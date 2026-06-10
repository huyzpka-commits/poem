const PoemAnalyzer = (function() {
  const { countWords, splitWords, getTone, getToneChar, getRhyme, isRhyme, isToneRhyme } = VIETNAMESE_UTILS;

  function createBaseResult(lines) {
    return {
      lines: lines.map((line, idx) => ({
        index: idx,
        text: line,
        words: splitWords(line),
        wordCount: countWords(line),
        tones: splitWords(line).map(w => getTone(w))
      })),
      errors: [],
      warnings: [],
      info: []
    };
  }

  function addError(result, lineIdx, message) {
    result.errors.push({ line: lineIdx + 1, message });
  }
  function addWarning(result, lineIdx, message) {
    result.warnings.push({ line: lineIdx + 1, message });
  }
  function addInfo(result, lineIdx, message) {
    result.info.push({ line: lineIdx + 1, message });
  }

  function analyzeLucBat(lines) {
    const result = createBaseResult(lines);
    const n = result.lines.length;
    if (n === 0) {
      addError(result, 0, 'Bài thơ trống.');
      return result;
    }
    if (n % 2 !== 0) {
      addWarning(result, n - 1, 'Lục bát thường có số câu chẵn (cặp lục-bát).');
    }

    for (let i = 0; i < n; i++) {
      const line = result.lines[i];
      const expected = (i % 2 === 0) ? 6 : 8;
      if (line.wordCount !== expected) {
        addError(result, i, `Câu ${i + 1} (${i % 2 === 0 ? 'lục' : 'bát'}) phải có ${expected} chữ, có ${line.wordCount}.`);
      } else {
        addInfo(result, i, `Số chữ đúng (${expected}).`);
      }
      if (line.wordCount === expected) {
        addInfo(result, i, 'Nhịp đề xuất: ' + (expected === 6 ? '2/2/2' : '2/2/2/2'));
      }
    }

    for (let i = 1; i < n; i++) {
      const curr = result.lines[i];
      const prev = result.lines[i - 1];
      if (i % 2 === 1) {
        // câu bát (chẵn, index 1,3,5...)
        if (i >= 3) {
          const prevBat = result.lines[i - 2];
          if (curr.words.length >= 8 && prevBat.words.length >= 8) {
            if (!isRhyme(curr.words[7], prevBat.words[7])) {
              addError(result, i, `Vần chân không khớp: "${curr.words[7]}" không vần với "${prevBat.words[7]}" (câu bát trước).`);
            } else {
              addInfo(result, i, 'Vần chân khớp.');
              if (getTone(curr.words[7]) !== 'bằng') {
                addWarning(result, i, `Vần chân nên có thanh bằng, "${curr.words[7]}" là thanh ${getTone(curr.words[7])}.`);
              }
            }
          }
        }
        if (curr.words.length >= 6 && prev.words.length >= 6) {
          if (!isRhyme(curr.words[5], prev.words[5])) {
            addError(result, i, `Vần lưng không khớp: chữ thứ 6 "${curr.words[5]}" không vần với chữ thứ 6 câu lục trước "${prev.words[5]}".`);
          } else {
            addInfo(result, i, 'Vần lưng khớp.');
            if (getTone(curr.words[5]) !== 'trắc') {
              addWarning(result, i, `Vần lưng (chữ thứ 6 câu bát) nên thanh trắc, "${curr.words[5]}" là thanh ${getTone(curr.words[5])}.`);
            }
            if (getTone(prev.words[5]) !== 'trắc') {
              addWarning(result, i - 1, `Vần lưng (chữ thứ 6 câu lục) nên thanh trắc, "${prev.words[5]}" là thanh ${getTone(prev.words[5])}.`);
            }
          }
        }
      } else {
        // câu lục (lẻ, index 2,4,6...) i>=2
        if (curr.words.length >= 6 && prev.words.length >= 6) {
          if (!isRhyme(curr.words[5], prev.words[5])) {
            addError(result, i, `Vần lưng không khớp: chữ thứ 6 "${curr.words[5]}" không vần với chữ thứ 6 câu bát trước "${prev.words[5]}".`);
          } else {
            addInfo(result, i, 'Vần lưng khớp.');
            if (getTone(curr.words[5]) !== 'trắc') {
              addWarning(result, i, `Vần lưng (chữ thứ 6 câu lục) nên thanh trắc, "${curr.words[5]}" là thanh ${getTone(curr.words[5])}.`);
            }
            if (getTone(prev.words[5]) !== 'trắc') {
              addWarning(result, i - 1, `Vần lưng (chữ thứ 6 câu bát) nên thanh trắc, "${prev.words[5]}" là thanh ${getTone(prev.words[5])}.`);
            }
          }
        }
      }
    }
    return result;
  }

  function analyzeSongThatLucBat(lines) {
    const result = createBaseResult(lines);
    const n = result.lines.length;
    if (n === 0) { addError(result, 0, 'Bài thơ trống.'); return result; }
    if (n % 4 !== 0) {
      addWarning(result, n - 1, 'Song thất lục bát nên chia thành các khổ 4 câu (7-7-6-8).');
    }
    for (let i = 0; i < n; i++) {
      const mod = i % 4;
      const expected = (mod === 0 || mod === 1) ? 7 : (mod === 2 ? 6 : 8);
      const name = mod < 2 ? 'song thất' : (mod === 2 ? 'lục' : 'bát');
      if (result.lines[i].wordCount !== expected) {
        addError(result, i, `Câu ${i + 1} (${name}) phải có ${expected} chữ, có ${result.lines[i].wordCount}.`);
      } else {
        addInfo(result, i, `Số chữ đúng (${expected}).`);
      }
    }
    for (let i = 0; i < n; i += 4) {
      if (i + 1 < n) {
        const c1 = result.lines[i], c2 = result.lines[i + 1];
        if (c1.words.length >= 7 && c2.words.length >= 7) {
          if (!isRhyme(c1.words[6], c2.words[6])) {
            addError(result, i, `Hai câu song thất đầu khổ phải vần chân: "${c1.words[6]}" và "${c2.words[6]}".`);
            addError(result, i + 1, `Hai câu song thất đầu khổ phải vần chân: "${c1.words[6]}" và "${c2.words[6]}".`);
          } else {
            addInfo(result, i, 'Vần chân câu 1-2 khớp.');
            if (getTone(c1.words[6]) !== 'bằng') addWarning(result, i, `Vần chân nên thanh bằng, "${c1.words[6]}" là thanh ${getTone(c1.words[6])}.`);
            if (getTone(c2.words[6]) !== 'bằng') addWarning(result, i + 1, `Vần chân nên thanh bằng, "${c2.words[6]}" là thanh ${getTone(c2.words[6])}.`);
          }
        }
      }
      if (i + 3 < n) {
        const c3 = result.lines[i + 2], c4 = result.lines[i + 3], c2 = result.lines[i + 1];
        if (c3.words.length >= 6 && c4.words.length >= 6) {
          if (!isRhyme(c3.words[5], c4.words[5])) {
            addError(result, i + 2, `Vần lưng câu lục-bát không khớp: "${c3.words[5]}" và "${c4.words[5]}".`);
          } else {
            addInfo(result, i + 2, 'Vần lưng khớp.');
            if (getTone(c3.words[5]) !== 'trắc') addWarning(result, i + 2, `Vần lưng nên thanh trắc, "${c3.words[5]}" là thanh ${getTone(c3.words[5])}.`);
            if (getTone(c4.words[5]) !== 'trắc') addWarning(result, i + 3, `Vần lưng nên thanh trắc, "${c4.words[5]}" là thanh ${getTone(c4.words[5])}.`);
          }
        }
        if (c2.words.length >= 7 && c4.words.length >= 8) {
          if (!isRhyme(c2.words[6], c4.words[7])) {
            addError(result, i + 3, `Vần chân cuối khổ (câu 2 và 4) không khớp: "${c2.words[6]}" và "${c4.words[7]}".`);
          } else {
            addInfo(result, i + 3, 'Vần chân khổ khớp.');
            if (getTone(c4.words[7]) !== 'bằng') addWarning(result, i + 3, `Vần chân cuối khổ nên thanh bằng, "${c4.words[7]}" là thanh ${getTone(c4.words[7])}.`);
          }
        }
      }
    }
    return result;
  }

  function analyzeThatNgonBatCu(lines) {
    const result = createBaseResult(lines);
    const n = result.lines.length;
    if (n !== 8) {
      addError(result, 0, `Thất ngôn bát cú phải có 8 câu, có ${n}.`);
    }
    for (let i = 0; i < n; i++) {
      if (result.lines[i].wordCount !== 7) {
        addError(result, i, `Câu ${i + 1} phải có 7 chữ, có ${result.lines[i].wordCount}.`);
      } else {
        addInfo(result, i, 'Số chữ đúng (7).');
      }
    }

    let isBangDau = true;
    if (n > 0 && result.lines[0].words.length > 0) {
      const firstTone = getToneChar(result.lines[0].words[0]);
      if (firstTone === 'T') isBangDau = false;
    }
    const pBang = ['B', 'B', 'T', 'T', 'B', 'T', 'B'];
    const pTrac = ['T', 'T', 'B', 'B', 'T', 'B', 'T'];
    const pt = [];
    for (let i = 0; i < 8; i++) {
      if (i % 2 === 0) pt.push(isBangDau ? pBang : pTrac);
      else pt.push(isBangDau ? pTrac : pBang);
    }

    for (let i = 0; i < n; i++) {
      const line = result.lines[i];
      if (line.wordCount !== 7) continue;
      const expected = pt[i];
      for (let w = 0; w < 7; w++) {
        const actual = getToneChar(line.words[w]);
        if (actual !== expected[w]) {
          const msg = `Chữ thứ ${w + 1} (${line.words[w]}): luật đòi hỏi ${expected[w] === 'B' ? 'bằng' : 'trắc'}, là ${actual === 'B' ? 'bằng' : 'trắc'}`;
          if (i < 6) addError(result, i, msg);
          else addWarning(result, i, msg);
        }
      }
    }

    const rhymePositions = [2, 4, 6, 8];
    let baseRhyme = null;
    for (let pos of rhymePositions) {
      if (pos - 1 < n && result.lines[pos - 1].wordCount === 7) {
        const word = result.lines[pos - 1].words[6];
        if (!baseRhyme) baseRhyme = getRhyme(word, false);
        else if (!isRhyme(word, baseRhyme)) {
          addError(result, pos - 1, `Câu ${pos} chữ cuối ("${word}") phải vần với các câu 2, 4, 6, 8.`);
        } else {
          addInfo(result, pos - 1, 'Vần đúng.');
        }
        if (getTone(word) !== 'bằng') {
          addWarning(result, pos - 1, `Chữ cuối câu vần nên có thanh bằng (ngang/huyền), "${word}" là thanh ${getTone(word)}.`);
        }
      }
    }
    if (n > 0 && result.lines[0].wordCount === 7) {
      const w1 = result.lines[0].words[6];
      if (baseRhyme && isRhyme(w1, baseRhyme)) {
        addInfo(result, 0, 'Câu 1 vần cùng (vần bắt đầu).');
      }
    }
    return result;
  }

  function analyzeThatNgonTuTuyet(lines) {
    const result = createBaseResult(lines);
    const n = result.lines.length;
    if (n !== 4) addError(result, 0, `Thất ngôn tứ tuyệt phải 4 câu, có ${n}.`);
    for (let i = 0; i < n; i++) {
      if (result.lines[i].wordCount !== 7) addError(result, i, `Phải 7 chữ, có ${result.lines[i].wordCount}.`);
      else addInfo(result, i, '7 chữ.');
    }
    const isBangDau = (n > 0 && result.lines[0].words.length > 0 && getToneChar(result.lines[0].words[0]) === 'B');
    const pBang = ['B', 'B', 'T', 'T', 'B', 'T', 'B'];
    const pTrac = ['T', 'T', 'B', 'B', 'T', 'B', 'T'];
    for (let i = 0; i < Math.min(n, 4); i++) {
      const expected = (i % 2 === 0) ? (isBangDau ? pBang : pTrac) : (isBangDau ? pTrac : pBang);
      const line = result.lines[i];
      if (line.wordCount !== 7) continue;
      for (let w = 0; w < 7; w++) {
        const actual = getToneChar(line.words[w]);
        if (actual !== expected[w]) addError(result, i, `Chữ ${w + 1} (${line.words[w]}): cần ${expected[w] === 'B' ? 'bằng' : 'trắc'}, là ${actual === 'B' ? 'bằng' : 'trắc'}`);
      }
    }
    if (n >= 4 && result.lines[1].wordCount >= 7 && result.lines[3].wordCount >= 7) {
      if (!isRhyme(result.lines[1].words[6], result.lines[3].words[6])) {
        addError(result, 1, 'Câu 2 và 4 phải vần chân.');
        addError(result, 3, 'Câu 2 và 4 phải vần chân.');
      } else {
        addInfo(result, 1, 'Vần chân khớp.');
      }
      if (getTone(result.lines[1].words[6]) !== 'bằng') addWarning(result, 1, 'Vần chân nên thanh bằng.');
      if (getTone(result.lines[3].words[6]) !== 'bằng') addWarning(result, 3, 'Vần chân nên thanh bằng.');
    }
    if (n >= 2 && result.lines[0].wordCount >= 7 && isRhyme(result.lines[0].words[6], result.lines[1].words[6])) {
      addInfo(result, 0, 'Câu 1 vần cùng.');
    }
    return result;
  }

  function analyzeNguNgon(lines, type = 'batcu') {
    const result = createBaseResult(lines);
    const n = result.lines.length;
    const expectedLines = type === 'batcu' ? 8 : 4;
    if (n !== expectedLines) addError(result, 0, `Ngũ ngôn ${type === 'batcu' ? 'bát cú' : 'tứ tuyệt'} phải ${expectedLines} câu, có ${n}.`);
    for (let i = 0; i < n; i++) {
      if (result.lines[i].wordCount !== 5) addError(result, i, `Phải 5 chữ, có ${result.lines[i].wordCount}.`);
      else addInfo(result, i, '5 chữ.');
    }
    const isBangDau = (n > 0 && result.lines[0].words.length > 0 && getToneChar(result.lines[0].words[0]) === 'B');
    const pBang = ['B', 'B', 'T', 'B', 'T'];
    const pTrac = ['T', 'T', 'B', 'T', 'B'];
    for (let i = 0; i < Math.min(n, expectedLines); i++) {
      const expected = (i % 2 === 0) ? (isBangDau ? pBang : pTrac) : (isBangDau ? pTrac : pBang);
      const line = result.lines[i];
      if (line.wordCount !== 5) continue;
      for (let w = 0; w < 5; w++) {
        const actual = getToneChar(line.words[w]);
        if (actual !== expected[w]) addError(result, i, `Chữ ${w + 1} (${line.words[w]}): cần ${expected[w] === 'B' ? 'bằng' : 'trắc'}, là ${actual === 'B' ? 'bằng' : 'trắc'}`);
      }
    }
    const rhymePositions = type === 'batcu' ? [2, 4, 6, 8] : [2, 4];
    let base = null;
    for (let pos of rhymePositions) {
      if (pos - 1 < n && result.lines[pos - 1].wordCount === 5) {
        const w = result.lines[pos - 1].words[4];
        if (!base) base = getRhyme(w, false);
        else if (!isRhyme(w, base)) addError(result, pos - 1, `Câu ${pos} chữ cuối ("${w}") không vần.`);
        else addInfo(result, pos - 1, 'Vần đúng.');
        if (getTone(w) !== 'bằng') addWarning(result, pos - 1, 'Vần chân nên thanh bằng.');
      }
    }
    return result;
  }

  function analyzeThoTuDo(lines) {
    const result = createBaseResult(lines);
    const n = result.lines.length;
    if (n === 0) addError(result, 0, 'Bài thơ trống.');
    else addInfo(result, 0, `Thơ tự do: ${n} câu.`);
    return result;
  }

  function analyzeThoHienDai578(lines) {
    const result = createBaseResult(lines);
    const n = result.lines.length;
    if (n === 0) addError(result, 0, 'Bài thơ trống.');
    for (let i = 0; i < n; i++) {
      const c = result.lines[i].wordCount;
      if (c !== 5 && c !== 7 && c !== 8) {
        addWarning(result, i, `Câu ${i + 1} có ${c} chữ, không thuộc form 5, 7, 8 chữ truyền thống.`);
      }
    }
    addInfo(result, 0, 'Thơ 5/7/8 chữ: kế thừa form truyền thống, phá vỡ luật bằng/trắc.');
    return result;
  }

  function analyzeThoVanXuoi(lines) {
    const result = createBaseResult(lines);
    if (result.lines.length === 0) addError(result, 0, 'Bài thơ trống.');
    else addInfo(result, 0, 'Thơ văn xuôi: đoạn văn liền mạch, không xuống dòng theo câu.');
    return result;
  }

  function analyzeHatNoi(lines) {
    const result = createBaseResult(lines);
    if (result.lines.length === 0) addError(result, 0, 'Bài thơ trống.');
    else addInfo(result, 0, 'Hát nói: nhịp tự do, dùng trong ca trù.');
    return result;
  }

  return {
    analyze(type, lines) {
      switch (type) {
        case 'lucbat': return analyzeLucBat(lines);
        case 'songthatlucbat': return analyzeSongThatLucBat(lines);
        case 'hatnoi': return analyzeHatNoi(lines);
        case 'thatngonbatcu': return analyzeThatNgonBatCu(lines);
        case 'thatngontutuyet': return analyzeThatNgonTuTuyet(lines);
        case 'ngungonbatcu': return analyzeNguNgon(lines, 'batcu');
        case 'ngungontutuyet': return analyzeNguNgon(lines, 'tutuyet');
        case 'thotudo': return analyzeThoTuDo(lines);
        case 'tho578': return analyzeThoHienDai578(lines);
        case 'thovanxuoi': return analyzeThoVanXuoi(lines);
        default: return analyzeThoTuDo(lines);
      }
    }
  };
})();
