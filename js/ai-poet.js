/**
 * AI Poet Module - Tích hợp OpenAI / Gemini để sáng tác thơ Việt Nam
 * Chạy hoàn toàn client-side. API key lưu localStorage (cảnh báo bảo mật).
 */
const AIPoet = (function() {
  const STORAGE_KEY = 'vtv_api_key';
  const PROVIDER_KEY = 'vtv_provider';
  const MODEL_KEY = 'vtv_model';

  const providers = {
    openai: {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      defaultModel: 'gpt-4o-mini'
    },
    gemini: {
      name: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      defaultModel: 'gemini-1.5-flash'
    }
  };

  function getPrompt(type, subject, hint) {
    const typeLabels = {
      lucbat: 'Lục Bát',
      songthatlucbat: 'Song Thất Lục Bát',
      hatnoi: 'Hát Nói',
      thatngonbatcu: 'Thất Ngôn Bát Cú',
      thatngontutuyet: 'Thất Ngôn Tứ Tuyệt',
      ngungonbatcu: 'Ngũ Ngôn Bát Cú',
      ngungontutuyet: 'Ngũ Ngôn Tứ Tuyệt',
      thotudo: 'Thơ Tự Do',
      tho578: 'Thơ 5, 7, 8 Chữ',
      thovanxuoi: 'Thơ Văn Xuôi'
    };

    const rules = {
      lucbat: `Thể Lục Bát:
- Cấu trúc: cặp câu 6 chữ và 8 chữ xen kẽ (câu lục, câu bát).
- Câu lục (6 chữ): nhịp 2/2/2. Chữ thứ 6 (cuối) là vần lưng, phải thanh TRẮC.
- Câu bát (8 chữ): nhịp 2/2/2/2. Chữ thứ 6 là vần lưng (vần với chữ thứ 6 câu lục liền trước), thanh TRẮC. Chữ thứ 8 là vần chân (vần với chữ thứ 8 câu bát liền trước), thanh BẰNG.
- Ví dụ cặp đúng luật:
  "Trăng thu dạ khúc trăng thu" (6)
  "Mây gió vần xanh mây gió trăng" (8)
  -> "trăng" (trac) vần lưng, "thu" (trac) vần lưng; "trăng" (bang) vần chân.`,

      songthatlucbat: `Thể Song Thất Lục Bát:
- Khổ 4 câu: 7 chữ, 7 chữ, 6 chữ, 8 chữ.
- Câu 1 và 2 (song thất): vần chân (chữ cuối) vần với nhau, thanh BẰNG.
- Câu 3 (lục) và câu 4 (bát): chữ thứ 6 của cả hai câu vần lưng (than TRẮC), chữ cuối câu 4 vần chân với chữ cuối câu 2 (thanh BẰNG).`,

      hatnoi: `Thể Hát Nói:
- Nhịp tự do, dùng trong nghệ thuật ca trù.
- Không khắt khe số chữ, nhưng cần có nhạc điệu, sự đối xứng câu và tiết tấu.
- Có thể xen lẫn câu 6, 7, 8 chữ. Vần linh hoạt nhưng vẫn du dương.`,

      thatngonbatcu: `Thể Thất Ngôn Bát Cú (Thơ Đường luật):
- 8 câu, mỗi câu 7 chữ.
- Luật bằng trắc cực kỳ khắt khe:
  + Nếu chữ đầu tiên THANH BẰNG: luật các chữ là B B T T B T B (câu lẻ 1,3,5,7) và T T B B T B T (câu chẵn 2,4,6,8).
  + Nếu chữ đầu tiên THANH TRẮC: luật ngược lại.
- Câu 2, 4, 6, 8 (và có thể câu 1) vần chân, chữ cuối câu vần phải THANH BẰNG (ngang hoặc huyền).
- Bố cục: Đề (câu 1-2), Thực (câu 3-4), Luận (câu 5-6), Kết (câu 7-8).`,

      thatngontutuyet: `Thể Thất Ngôn Tứ Tuyệt:
- 4 câu, mỗi câu 7 chữ.
- Luật bằng trắc tương tự Thất ngôn bát cú, chỉ có 4 câu.
- Câu 2 và câu 4 vần chân (thanh BẰNG). Câu 1 có thể vần cùng hoặc không.`,

      ngungonbatcu: `Thể Ngũ Ngôn Bát Cú:
- 8 câu, mỗi câu 5 chữ.
- Luật bằng trắc:
  + Bắt đầu bằng: B B T B T (câu lẻ) / T T B T B (câu chẵn).
  + Bắt đầu trắc: ngược lại.
- Câu 2, 4, 6, 8 vần chân (thanh BẰNG). Câu 1 có thể vần cùng.`,

      ngungontutuyet: `Thể Ngũ Ngôn Tứ Tuyệt:
- 4 câu, mỗi câu 5 chữ.
- Luật bằng trắc tương tự Ngũ ngôn bát cú (rút gọn 4 câu).
- Câu 2 và 4 vần chân (thanh BẰNG).`,

      thotudo: `Thể Thơ Tự Do:
- Không giới hạn số chữ, số câu.
- Cảm xúc định hình nhịp điệu, hình ảnh và âm thanh.
- Vần linh hoạt, có thể dùng vần chân, vần lưng hoặc ngẫu hứng.`,

      tho578: `Thơ 5, 7, 8 Chữ:
- Kế thừa form truyền thống (5, 7, 8 chữ) nhưng phá vỡ luật bằng/trắc cổ điển.
- Có thể xen kẽ các câu 5, 7, 8 chữ tự do.
- Cần giữ được nhạc điệu qua cách ngắt nhịp tự nhiên và vần điệu.`,

      thovanxuoi: `Thơ Văn Xuôi:
- Viết dưới dạng đoạn văn, không xuống dòng theo câu thơ cổ điển.
- Tạo nhạc điệu bằng từ ngữ, nhịp điệu, sự đối lập và hình ảnh.
- Có thể kết hợp vần nội tâm (internal rhyme) và vần đầu (alliteration).`
    };

    let system = `Bạn là một nhà thơ Việt Nam đại tài, am hiểu sâu sắc văn hóa dân tộc, thơ ca truyền thống và hiện đại. Bạn có khả năng sáng tác thơ theo mọi thể loại với vần điệu tinh tế, hình ảnh giàu chất thơ, và đặc biệt là tuân thủ nghiêm ngặt luật của từng thể.`;

    let user = `Hãy sáng tác một bài thể "${typeLabels[type] || type}" ${subject ? `với chủ đề: "${subject}"` : ''} ${hint ? `Gợi ý nội dung: ${hint}` : ''}.

QUY TẮC BẮT BUỘC:
${rules[type] || 'Viết theo cảm hứng, giữ nhạc điệu tiếng Việt.'}

YÊU CẦU ĐẦU RA:
- Chỉ trả về nội dung bài thơ, mỗi câu trên một dòng riêng biệt.
- KHÔNG thêm giải thích, tiêu đề, chú thích, ghi chú hay bất kỳ văn bản nào khác ngoài bài thơ.
- KHÔNG dùng dấu ngoặc, số thứ tự câu, hay ghi chú kỹ thuật.
- Nếu là thơ văn xuôi, viết thành đoạn văn liền mạch.
- Hãy viết sao cho bài thơ thực sự có giá trị văn chương, bay bổng, giàu hình ảnh và cảm xúc.`;

    return { system, user };
  }

  async function callOpenAI(apiKey, model, messages) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.8, max_tokens: 800 })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  async function callGeminiSingle(apiKey, model, systemPrompt, userPrompt, apiVersion = 'v1beta') {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 800 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  }

  async function callGemini(apiKey, model, systemPrompt, userPrompt) {
    // Try multiple model names AND API versions as fallback
    const fallbackModels = [
      model,
      'gemini-1.5-flash-002',
      'gemini-1.5-flash-001',
      'gemini-1.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro-002',
      'gemini-1.5-pro-001',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
    const uniqueModels = [...new Set(fallbackModels)];
    const versions = ['v1beta', 'v1'];
    let lastError = '';

    for (const v of versions) {
      for (const m of uniqueModels) {
        try {
          const text = await callGeminiSingle(apiKey, m, systemPrompt, userPrompt, v);
          if (text) return text;
        } catch (e) {
          const msg = (e.message || '').toLowerCase();
          if (msg.includes('not found') || (msg.includes('invalid') && msg.includes('model'))) {
            lastError = e.message;
            continue; // try next combination
          }
          // For other errors (e.g., unauthorized, quota), stop immediately and report
          throw e;
        }
      }
    }
    throw new Error(`Không tìm thấy model khả dụng. Đã thử ${uniqueModels.length} model x ${versions.length} phiên bản API.\nLỗi cuối: ${lastError}\n\nNGUYÊN NHÂN PHỔ BIẾN:\n1. API key được tạo từ Google Cloud Console (Vertex AI) thay vì Google AI Studio.\n   -> Vui lòng tạo key MIỄN PHÍ tại https://aistudio.google.com/app/apikey\n2. API key đúng nhưng chưa bật "Generative Language API" trong Google Cloud project.\n3. Key hết hạn hoặc bị giới hạn region.\n\nKey Gemini AI Studio phải bắt đầu bằng "AIza" và được tạo tại aistudio.google.com.`);
  }

  async function listGeminiModels(apiKey) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.models || [];
  }

  async function compose(type, subject, hint, provider, apiKey, model) {
    const { system, user } = getPrompt(type, subject, hint);
    if (provider === 'openai') {
      return await callOpenAI(apiKey, model, [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]);
    } else if (provider === 'gemini') {
      return await callGemini(apiKey, model, system, user);
    }
    throw new Error('Provider không được hỗ trợ');
  }

  function saveKey(key) { localStorage.setItem(STORAGE_KEY, key); }
  function loadKey() { return localStorage.getItem(STORAGE_KEY) || ''; }
  function saveProvider(p) { localStorage.setItem(PROVIDER_KEY, p); }
  function loadProvider() { return localStorage.getItem(PROVIDER_KEY) || 'openai'; }
  function saveModel(m) { localStorage.setItem(MODEL_KEY, m); }
  function loadModel() { return localStorage.getItem(MODEL_KEY) || providers.openai.defaultModel; }
  function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROVIDER_KEY);
    localStorage.removeItem(MODEL_KEY);
  }

  return {
    providers,
    compose,
    listGeminiModels,
    saveKey, loadKey,
    saveProvider, loadProvider,
    saveModel, loadModel,
    clearStorage
  };
})();
