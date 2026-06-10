const VIETNAMESE_UTILS = (function() {
  const initials = [
    'ngh', 'gh', 'kh', 'ph', 'th', 'tr', 'ch', 'nh', 'ng', 'gi',
    'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x'
  ];

  function normalize(str) {
    return str.normalize('NFC').trim().toLowerCase();
  }

  function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300\u0301\u0302\u0303\u0309\u0323]/g, '').normalize('NFC');
  }

  function getTone(word) {
    if (!word) return null;
    const nfd = word.normalize('NFD');
    if (nfd.includes('\u0300')) return 'bằng'; // huyền
    if (nfd.includes('\u0301')) return 'trắc'; // sắc
    if (nfd.includes('\u0309')) return 'trắc'; // hỏi
    if (nfd.includes('\u0303')) return 'trắc'; // ngã
    if (nfd.includes('\u0323')) return 'trắc'; // nặng
    return 'bằng'; // ngang
  }

  function getToneChar(word) {
    const t = getTone(word);
    return t === 'bằng' ? 'B' : 'T';
  }

  function getRhyme(word, keepTone = false) {
    if (!word) return '';
    let w = normalize(word);
    for (let ini of initials) {
      if (w.startsWith(ini)) {
        let rhyme = w.substring(ini.length);
        if (!keepTone) rhyme = removeDiacritics(rhyme);
        return rhyme;
      }
    }
    return keepTone ? w : removeDiacritics(w);
  }

  function isRhyme(a, b) {
    return getRhyme(a, false) === getRhyme(b, false);
  }

  function isToneRhyme(a, b) {
    return getRhyme(a, false) === getRhyme(b, false) && getTone(a) === getTone(b);
  }

  function countWords(line) {
    if (!line) return 0;
    return line.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  function splitWords(line) {
    if (!line) return [];
    return line.trim().split(/\s+/).filter(w => w.length > 0);
  }

  return {
    normalize,
    removeDiacritics,
    getTone,
    getToneChar,
    getRhyme,
    isRhyme,
    isToneRhyme,
    countWords,
    splitWords
  };
})();
