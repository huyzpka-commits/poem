document.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('poem-type');
  const inputArea = document.getElementById('poem-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultDiv = document.getElementById('result');
  const clearBtn = document.getElementById('clear-btn');

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

  const typeDescriptions = {
    lucbat: 'Lục bát: 1 câu 6 chữ, 1 câu 8 chữ. Gieo vần chân, vần lưng. Nhịp chẵn (2/2/2).',
    songthatlucbat: 'Song thất lục bát: Khổ 4 câu 7-7-6-8. Vần bằng/trắc đan xen.',
    hatnoi: 'Hát nói: Nhịp tự do. Dùng trong nghệ thuật ca trù.',
    thatngonbatcu: 'Thất ngôn bát cú: 8 câu, 7 chữ/câu. Luật bằng/trắc khắt khe. Bố cục: Đề, Thực Luận, Kết.',
    thatngontutuyet: 'Thất ngôn tứ tuyệt: 4 câu, 7 chữ/câu. Bản rút gọn của bát cú.',
    ngungonbatcu: 'Ngũ ngôn bát cú: 8 câu, 5 chữ/câu. Luật gieo vần tương tự thất ngôn.',
    ngungontutuyet: 'Ngũ ngôn tứ tuyệt: 4 câu, 5 chữ/câu.',
    thotudo: 'Thơ tự do: Không giới hạn số chữ, số câu. Cảm xúc định nhịp.',
    tho578: 'Thơ 5, 7, 8 chữ: Kế thừa form truyền thống. Phá vỡ luật bằng/trắc cổ điển.',
    thovanxuoi: 'Thơ văn xuôi: Viết dạng đoạn văn. Không xuống dòng theo câu. Tạo nhạc điệu bằng từ ngữ.'
  };

  function updateDescription() {
    const desc = document.getElementById('type-description');
    if (desc) desc.textContent = typeDescriptions[typeSelect.value] || '';
  }

  typeSelect.addEventListener('change', updateDescription);
  updateDescription();

  clearBtn.addEventListener('click', () => {
    inputArea.value = '';
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
  });

  analyzeBtn.addEventListener('click', () => {
    const type = typeSelect.value;
    const text = inputArea.value;
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const result = PoemAnalyzer.analyze(type, lines);
    renderResult(type, result);
  });

  function renderResult(type, result) {
    resultDiv.style.display = 'block';
    let html = `<div class="result-header"><h2>Kết quả phân tích: ${typeLabels[type] || type}</h2></div>`;

    if (result.errors.length === 0 && result.warnings.length === 0) {
      html += `<div class="result-success">Bài thơ tuân thủ đúng luật của thể ${typeLabels[type]}!</div>`;
    } else {
      if (result.errors.length > 0) {
        html += `<div class="result-section errors"><h3>Lỗi (${result.errors.length})</h3><ul>`;
        result.errors.forEach(e => {
          html += `<li><span class="badge error">Câu ${e.line}</span> ${e.message}</li>`;
        });
        html += `</ul></div>`;
      }
      if (result.warnings.length > 0) {
        html += `<div class="result-section warnings"><h3>Cảnh báo (${result.warnings.length})</h3><ul>`;
        result.warnings.forEach(e => {
          html += `<li><span class="badge warning">Câu ${e.line}</span> ${e.message}</li>`;
        });
        html += `</ul></div>`;
      }
    }

    if (result.lines && result.lines.length > 0) {
      html += `<div class="result-section details"><h3>Chi tiết từng câu</h3>`;
      result.lines.forEach((line, idx) => {
        html += `<div class="line-detail">
          <div class="line-title">Câu ${idx+1} <span class="word-count">(${line.wordCount} chữ)</span></div>
          <div class="line-words">`;
        line.words.forEach((w) => {
          const tone = VIETNAMESE_UTILS.getTone(w);
          const toneClass = tone === 'bằng' ? 'tone-bang' : 'tone-trac';
          html += `<span class="word-chip ${toneClass}" title="Thanh ${tone}">${w}</span>`;
        });
        html += `</div></div>`;
      });
      html += `</div>`;
    }

    resultDiv.innerHTML = html;
  }
});
