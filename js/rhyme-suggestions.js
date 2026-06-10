/**
 * Rhyme Suggestions - Từ điển gợi ý vần tiếng Việt
 * Phân loại theo vần (không dấu) và thanh điệu (bằng/trắc)
 */
const RHYME_SUGGESTIONS = (function() {
  const { getRhyme, getTone } = VIETNAMESE_UTILS;

  // Từ điển vần phổ biến: vần -> { bang: [từ thanh bằng], trac: [từ thanh trắc] }
  const dictionary = {
    'a': {
      bang: ['là', 'ta', 'nhà', 'cà', 'đà', 'ma', 'xa', 'pha', 'tha', 'la', 'ha', 'ga', 'ba', 'ca', 'ra', 'sa', 'va', 'na'],
      trac: ['bà', 'mà', 'chà', 'ghà', 'khà', 'ngà', 'nghà', 'nhà', 'trà', 'già']
    },
    'ang': {
      bang: ['vang', 'rang', 'lang', 'sang', 'bang', 'can', 'tang', 'hang', 'gan', 'lan', 'man', 'nan', 'ran', 'san', 'van'],
      trac: ['tràng', 'nàng', 'màng', 'chàng', 'giàng', 'ngàng', 'nhàng', 'khàng', 'phàng', 'thàng']
    },
    'an': {
      bang: ['an', 'lan', 'man', 'nan', 'ran', 'san', 'van', 'can', 'tan', 'han', 'gan'],
      trac: ['bàn', 'màn', 'chàn', 'tràn', 'giàn', 'ngàn', 'nhàn', 'khàn', 'phàn', 'thàn', 'đàn', 'sàn']
    },
    'am': {
      bang: ['am', 'lam', 'nam', 'ram', 'sam', 'tam', 'ham', 'cam', 'gam'],
      trac: ['trăm', 'măm', 'chăm', 'thăm', 'đăm', 'ngăm', 'nhăm', 'khăm', 'phăm', 'giăm']
    },
    'at': {
      bang: ['át', 'lát', 'nát', 'rát', 'sát', 'tát', 'hát', 'cát', 'gát', 'mát', 'vát'],
      trac: ['bát', 'mát', 'chát', 'trát', 'giát', 'ngát', 'nhát', 'khát', 'phát', 'thát', 'đát', 'sát']
    },
    'ac': {
      bang: ['ác', 'lác', 'nác', 'rác', 'sác', 'tác', 'hác', 'các', 'gác', 'mác'],
      trac: ['bác', 'mác', 'chác', 'trác', 'giác', 'ngác', 'nhác', 'khác', 'phác', 'thác', 'đác', 'sác']
    },
    'ai': {
      bang: ['ai', 'lai', 'nai', 'rai', 'sai', 'tai', 'hai', 'cai', 'gai', 'mai', 'vai'],
      trac: ['bài', 'mài', 'chài', 'trài', 'giài', 'ngài', 'nhài', 'khài', 'phài', 'thài', 'đài', 'sài']
    },
    'ay': {
      bang: ['ay', 'lay', 'nay', 'ray', 'say', 'tay', 'hay', 'cay', 'gay', 'may', 'vay', 'bay'],
      trac: ['bày', 'mày', 'chày', 'trày', 'giày', 'ngày', 'nhày', 'khày', 'phày', 'thày', 'đày', 'sày']
    },
    'au': {
      bang: ['au', 'lau', 'nau', 'rau', 'sau', 'tau', 'hau', 'cau', 'gau', 'mau', 'vau'],
      trac: ['bàu', 'màu', 'chàu', 'tràu', 'giàu', 'ngàu', 'nhàu', 'khàu', 'phàu', 'thàu', 'đàu', 'sàu']
    },
    'ao': {
      bang: ['ao', 'lao', 'nao', 'rao', 'sao', 'tao', 'hao', 'cao', 'gao', 'mao', 'vao', 'bao'],
      trac: ['bào', 'mào', 'chào', 'trào', 'giào', 'ngào', 'nhào', 'khào', 'phào', 'thào', 'đào', 'sào']
    },
    'eo': {
      bang: ['eo', 'leo', 'neo', 'reo', 'seo', 'teo', 'heo', 'ceo', 'geo', 'meo', 'veo', 'beo'],
      trac: ['bèo', 'mèo', 'chèo', 'trèo', 'gièo', 'ngèo', 'nhèo', 'khèo', 'phèo', 'thèo', 'đèo', 'sèo']
    },
    'iu': {
      bang: ['iu', 'liu', 'niu', 'riu', 'siu', 'tiu', 'hiu', 'ciu', 'giu', 'miu', 'viu', 'biu'],
      trac: ['bìu', 'mìu', 'chìu', 'trìu', 'gìu', 'ngìu', 'nhìu', 'khìu', 'phìu', 'thìu', 'đìu', 'sìu']
    },
    'ieu': {
      bang: ['yêu', 'liêu', 'niêu', 'riêu', 'siêu', 'tiêu', 'hiêu', 'ciêu', 'giêu', 'miêu', 'viêu', 'biêu', 'diêu'],
      trac: ['biều', 'miều', 'chiều', 'triều', 'giều', 'ngiều', 'nhiều', 'khiều', 'phiều', 'thiều', 'điều', 'siều', 'diều']
    },
    'o': {
      bang: ['lo', 'no', 'ro', 'so', 'to', 'ho', 'co', 'go', 'mo', 'vo', 'bo', 'do'],
      trac: ['bò', 'mò', 'chò', 'trò', 'giò', 'ngò', 'nhò', 'khò', 'phò', 'thò', 'đò', 'sò', 'lò', 'nò', 'rò', 'tò', 'hò', 'cò', 'gò']
    },
    'ong': {
      bang: ['ong', 'long', 'nong', 'rong', 'song', 'tong', 'hong', 'cong', 'gong', 'mong', 'vong', 'bong', 'dong'],
      trac: ['bòng', 'mòng', 'chòng', 'tròng', 'giòng', 'ngòng', 'nhòng', 'khòng', 'phòng', 'thòng', 'đòng', 'sòng']
    },
    'on': {
      bang: ['on', 'lon', 'non', 'ron', 'son', 'ton', 'hon', 'con', 'gon', 'mon', 'von', 'bon', 'don'],
      trac: ['bòn', 'mòn', 'chòn', 'tròn', 'giòn', 'ngòn', 'nhòn', 'khòn', 'phòn', 'thòn', 'đòn', 'sòn', 'lòn', 'nòn', 'ròn', 'tòn', 'hòn', 'còn', 'gòn']
    },
    'om': {
      bang: ['om', 'lom', 'nom', 'rom', 'som', 'tom', 'hom', 'com', 'gom', 'mom', 'vom', 'bom', 'dom'],
      trac: ['bòm', 'mòm', 'chòm', 'tròm', 'giòm', 'ngòm', 'nhòm', 'khòm', 'phòm', 'thòm', 'đòm', 'sòm']
    },
    'ot': {
      bang: ['ót', 'lót', 'nót', 'rót', 'sót', 'tót', 'hót', 'cót', 'gót', 'mót', 'vót', 'bót', 'dót'],
      trac: ['bót', 'mót', 'chót', 'trót', 'giót', 'ngót', 'nhót', 'khót', 'phót', 'thót', 'đót', 'sót']
    },
    'oc': {
      bang: ['óc', 'lóc', 'nóc', 'róc', 'sóc', 'tóc', 'hóc', 'cóc', 'góc', 'móc', 'vóc', 'bóc', 'dóc'],
      trac: ['bóc', 'móc', 'chóc', 'tróc', 'gióc', 'ngóc', 'nhóc', 'khóc', 'phóc', 'thóc', 'đóc', 'sóc']
    },
    'oi': {
      bang: ['oi', 'loi', 'noi', 'roi', 'soi', 'toi', 'hoi', 'coi', 'goi', 'moi', 'voi', 'boi', 'doi'],
      trac: ['bòi', 'mòi', 'chòi', 'tròi', 'giòi', 'ngòi', 'nhòi', 'khòi', 'phòi', 'thòi', 'đòi', 'sòi']
    },
    'u': {
      bang: ['u', 'lu', 'ru', 'su', 'tu', 'hu', 'cu', 'gu', 'mu', 'vu', 'bu', 'du', 'nu'],
      trac: ['bù', 'mù', 'chù', 'trù', 'gù', 'ngù', 'nhù', 'khù', 'phù', 'thù', 'đù', 'sù', 'lù', 'nù', 'rù', 'tù', 'hù', 'cù', 'gù']
    },
    'ung': {
      bang: ['ung', 'lung', 'nung', 'rung', 'sung', 'tung', 'hung', 'cung', 'gung', 'mung', 'vung', 'bung', 'dung'],
      trac: ['bùng', 'mùng', 'chùng', 'trùng', 'gùng', 'ngùng', 'nhùng', 'khùng', 'phùng', 'thùng', 'đùng', 'sùng', 'lùng', 'nùng', 'rùng', 'tùng', 'hùng', 'cùng', 'gùng']
    },
    'un': {
      bang: ['un', 'lun', 'nun', 'run', 'sun', 'tun', 'hun', 'cun', 'gun', 'mun', 'vun', 'bun', 'dun'],
      trac: ['bùn', 'mùn', 'chùn', 'trùn', 'gùn', 'ngùn', 'nhùn', 'khùn', 'phùn', 'thùn', 'đùn', 'sùn', 'lùn', 'nùn', 'rùn', 'tùn', 'hùn', 'cùn', 'gùn']
    },
    'um': {
      bang: ['um', 'lum', 'num', 'rum', 'sum', 'tum', 'hum', 'cum', 'gum', 'mum', 'vum', 'bum', 'dum'],
      trac: ['bùm', 'mùm', 'chùm', 'trùm', 'gùm', 'ngùm', 'nhùm', 'khùm', 'phùm', 'thùm', 'đùm', 'sùm']
    },
    'ut': {
      bang: ['út', 'lút', 'nút', 'rút', 'sút', 'tút', 'hút', 'cút', 'gút', 'mút', 'vút', 'bút', 'dút'],
      trac: ['bút', 'mút', 'chút', 'trút', 'gút', 'ngút', 'nhút', 'khút', 'phút', 'thút', 'đút', 'sút']
    },
    'uc': {
      bang: ['úc', 'lúc', 'núc', 'rúc', 'súc', 'túc', 'húc', 'cúc', 'gúc', 'múc', 'vúc', 'búc', 'dúc'],
      trac: ['búc', 'múc', 'chúc', 'trúc', 'gúc', 'ngúc', 'nhúc', 'khúc', 'phúc', 'thúc', 'đúc', 'súc']
    },
    'ui': {
      bang: ['ui', 'lui', 'nui', 'rui', 'sui', 'tui', 'hui', 'cui', 'gui', 'mui', 'vui', 'bui', 'dui'],
      trac: ['bùi', 'mùi', 'chùi', 'trùi', 'gùi', 'ngùi', 'nhùi', 'khùi', 'phùi', 'thùi', 'đùi', 'sùi']
    },
    'uu': {
      bang: ['ưu', 'lưu', 'nưu', 'rưu', 'sưu', 'tưu', 'hưu', 'cưu', 'gưu', 'mưu', 'vưu', 'bưu', 'dưu'],
      trac: ['bưu', 'mưu', 'chưu', 'trưu', 'gưu', 'ngưu', 'nhưu', 'khưu', 'phưu', 'thưu', 'đưu', 'sưu']
    },
    'e': {
      bang: ['e', 'le', 're', 'se', 'te', 'he', 'ce', 'ge', 'me', 've', 'be', 'de', 'ne'],
      trac: ['bè', 'mè', 'chè', 'trè', 'gè', 'ngè', 'nhè', 'khè', 'phè', 'thè', 'đè', 'sè', 'lè', 'nè', 'rè', 'tè', 'hè', 'cè', 'gè']
    },
    'eng': {
      bang: ['eng', 'leng', 'neng', 'reng', 'seng', 'teng', 'heng', 'ceng', 'geng', 'meng', 'veng', 'beng', 'deng'],
      trac: ['bèng', 'mèng', 'chèng', 'trèng', 'gèng', 'ngèng', 'nhèng', 'khèng', 'phèng', 'thèng', 'đèng', 'sèng']
    },
    'en': {
      bang: ['en', 'len', 'nen', 'ren', 'sen', 'ten', 'hen', 'cen', 'gen', 'men', 'ven', 'ben', 'den'],
      trac: ['bèn', 'mèn', 'chèn', 'trèn', 'gèn', 'ngèn', 'nhèn', 'khèn', 'phèn', 'thèn', 'đèn', 'sèn', 'lèn', 'nèn', 'rèn', 'tèn', 'hèn', 'cèn', 'gèn']
    },
    'em': {
      bang: ['em', 'lem', 'nem', 'rem', 'sem', 'tem', 'hem', 'cem', 'gem', 'mem', 'vem', 'bem', 'dem'],
      trac: ['bèm', 'mèm', 'chèm', 'trèm', 'gèm', 'ngèm', 'nhèm', 'khèm', 'phèm', 'thèm', 'đèm', 'sèm']
    },
    'et': {
      bang: ['ét', 'lét', 'nét', 'rét', 'sét', 'tét', 'hét', 'cét', 'gét', 'mét', 'vét', 'bét', 'dét'],
      trac: ['bét', 'mét', 'chét', 'trét', 'gét', 'ngét', 'nhét', 'khét', 'phét', 'thét', 'đét', 'sét']
    },
    'ec': {
      bang: ['éc', 'léc', 'néc', 'réc', 'séc', 'téc', 'héc', 'céc', 'géc', 'méc', 'véc', 'béc', 'déc'],
      trac: ['béc', 'méc', 'chéc', 'tréc', 'géc', 'ngéc', 'nhéc', 'khéc', 'phéc', 'théc', 'đéc', 'séc']
    },
    'ong': {
      bang: ['ong', 'long', 'nong', 'rong', 'song', 'tong', 'hong', 'cong', 'gong', 'mong', 'vong', 'bong', 'dong'],
      trac: ['bòng', 'mòng', 'chòng', 'tròng', 'giòng', 'ngòng', 'nhòng', 'khòng', 'phòng', 'thòng', 'đòng', 'sòng']
    },
    'on': {
      bang: ['on', 'lon', 'non', 'ron', 'son', 'ton', 'hon', 'con', 'gon', 'mon', 'von', 'bon', 'don'],
      trac: ['bòn', 'mòn', 'chòn', 'tròn', 'giòn', 'ngòn', 'nhòn', 'khòn', 'phòn', 'thòn', 'đòn', 'sòn', 'lòn', 'nòn', 'ròn', 'tòn', 'hòn', 'còn', 'gòn']
    },
    'om': {
      bang: ['om', 'lom', 'nom', 'rom', 'som', 'tom', 'hom', 'com', 'gom', 'mom', 'vom', 'bom', 'dom'],
      trac: ['bòm', 'mòm', 'chòm', 'tròm', 'giòm', 'ngòm', 'nhòm', 'khòm', 'phòm', 'thòm', 'đòm', 'sòm']
    },
    'ot': {
      bang: ['ót', 'lót', 'nót', 'rót', 'sót', 'tót', 'hót', 'cót', 'gót', 'mót', 'vót', 'bót', 'dót'],
      trac: ['bót', 'mót', 'chót', 'trót', 'giót', 'ngót', 'nhót', 'khót', 'phót', 'thót', 'đót', 'sót']
    },
    'oc': {
      bang: ['óc', 'lóc', 'nóc', 'róc', 'sóc', 'tóc', 'hóc', 'cóc', 'góc', 'móc', 'vóc', 'bóc', 'dóc'],
      trac: ['bóc', 'móc', 'chóc', 'tróc', 'gióc', 'ngóc', 'nhóc', 'khóc', 'phóc', 'thóc', 'đóc', 'sóc']
    },
    'oi': {
      bang: ['oi', 'loi', 'noi', 'roi', 'soi', 'toi', 'hoi', 'coi', 'goi', 'moi', 'voi', 'boi', 'doi'],
      trac: ['bòi', 'mòi', 'chòi', 'tròi', 'giòi', 'ngòi', 'nhòi', 'khòi', 'phòi', 'thòi', 'đòi', 'sòi']
    },
    'anh': {
      bang: ['anh', 'lanh', 'manh', 'ranh', 'sanh', 'tanh', 'hanh', 'canh', 'ganh', 'manh', 'vanh', 'banh', 'danh'],
      trac: ['bành', 'mành', 'chành', 'trành', 'giành', 'ngành', 'nhành', 'khành', 'phành', 'thành', 'đành', 'sành']
    },
    'ach': {
      bang: ['ách', 'lách', 'nách', 'rách', 'sách', 'tách', 'hách', 'cách', 'gách', 'mách', 'vách', 'bách', 'dách'],
      trac: ['bách', 'mách', 'chách', 'trách', 'giách', 'ngách', 'nhách', 'khách', 'phách', 'thách', 'đách', 'sách']
    },
    'ach2': {  // for 'ach' ending with 'ch' sound (like 'sách', 'tách')
      bang: ['ách', 'lách', 'nách', 'rách', 'sách', 'tách', 'hách', 'cách', 'gách', 'mách', 'vách', 'bách', 'dách'],
      trac: ['bách', 'mách', 'chách', 'trách', 'giách', 'ngách', 'nhách', 'khách', 'phách', 'thách', 'đách', 'sách']
    },
    'inh': {
      bang: ['inh', 'linh', 'ninh', 'rinh', 'sinh', 'tinh', 'hinh', 'cinh', 'ginh', 'minh', 'vinh', 'binh', 'dinh'],
      trac: ['bình', 'mình', 'chình', 'trình', 'gình', 'ngình', 'nhình', 'khình', 'phình', 'thình', 'đình', 'sình']
    },
    'ich': {
      bang: ['ích', 'lích', 'ních', 'rích', 'sích', 'tích', 'hích', 'cích', 'gích', 'mích', 'vích', 'bích', 'dích'],
      trac: ['bích', 'mích', 'chích', 'trích', 'gích', 'ngích', 'nhích', 'khích', 'phích', 'thích', 'đích', 'sích']
    },
    'uan': {
      bang: ['oan', 'loan', 'noan', 'roan', 'soan', 'toan', 'hoan', 'coan', 'goan', 'moan', 'voan', 'boan', 'doan'],
      trac: ['boàn', 'moàn', 'choàn', 'troàn', 'gioàn', 'ngoàn', 'nhoàn', 'khoàn', 'phoàn', 'thoàn', 'đoàn', 'soàn']
    },
    'uong': {
      bang: ['uông', 'luông', 'nuông', 'ruông', 'suông', 'tuông', 'huông', 'cuông', 'guông', 'muông', 'vuông', 'buông', 'duông'],
      trac: ['buồng', 'muồng', 'chuồng', 'truồng', 'guồng', 'nguồng', 'nhuồng', 'khuồng', 'phuồng', 'thuồng', 'đuồng', 'suồng']
    },
    'uoc': {
      bang: ['uốc', 'luốc', 'nuốc', 'ruốc', 'suốc', 'tuốc', 'huốc', 'cuốc', 'guốc', 'muốc', 'vuốc', 'buốc', 'duốc'],
      trac: ['buốc', 'muốc', 'chuốc', 'truốc', 'guốc', 'nguốc', 'nhuốc', 'khuốc', 'phuốc', 'thuốc', 'đuốc', 'suốc']
    },
    'uot': {
      bang: ['uốt', 'luốt', 'nuốt', 'ruốt', 'suốt', 'tuốt', 'huốt', 'cuốt', 'guốt', 'muốt', 'vuốt', 'buốt', 'duốt'],
      trac: ['buốt', 'muốt', 'chuốt', 'truốt', 'guốt', 'nguốt', 'nhuốt', 'khuốt', 'phuốt', 'thuốt', 'đuốt', 'suốt']
    },
    'yen': {
      bang: ['yên', 'lyên', 'nyên', 'ryên', 'syên', 'tyên', 'hyên', 'cyên', 'gyên', 'myên', 'vyên', 'byên', 'dyên'],
      trac: ['byền', 'myền', 'chyền', 'tryền', 'gyền', 'ngyền', 'nhyền', 'khyền', 'phyền', 'thyền', 'đyền', 'syền']
    },
    'yem': {
      bang: ['yêm', 'lyêm', 'nyêm', 'ryêm', 'syêm', 'tyêm', 'hyêm', 'cyêm', 'gyêm', 'myêm', 'vyêm', 'byêm', 'dyêm'],
      trac: ['byềm', 'myềm', 'chyềm', 'tryềm', 'gyềm', 'ngyềm', 'nhyềm', 'khyềm', 'phyềm', 'thyềm', 'đyềm', 'syềm']
    },
    'yet': {
      bang: ['yết', 'lyết', 'nyết', 'ryết', 'syết', 'tyết', 'hyết', 'cyết', 'gyết', 'myết', 'vyết', 'byết', 'dyết'],
      trac: ['byết', 'myết', 'chyết', 'tryết', 'gyết', 'ngyết', 'nhyết', 'khyết', 'phyết', 'thyết', 'đyết', 'syết']
    },
    'ieng': {
      bang: ['iêng', 'liêng', 'niêng', 'riêng', 'siêng', 'tiêng', 'hiêng', 'ciêng', 'giêng', 'miêng', 'viêng', 'biêng', 'diêng'],
      trac: ['biềng', 'miềng', 'chiềng', 'triềng', 'giềng', 'ngiềng', 'nhiềng', 'khiềng', 'phiềng', 'thiềng', 'điềng', 'siềng']
    },
    'oai': {
      bang: ['oai', 'loai', 'noai', 'roai', 'soai', 'toai', 'hoai', 'coai', 'goai', 'moai', 'voai', 'boai', 'doai'],
      trac: ['boài', 'moài', 'choài', 'troài', 'gioài', 'ngoài', 'nhoài', 'khoài', 'phoài', 'thoài', 'đoài', 'soài']
    },
    'oan': {
      bang: ['oan', 'loan', 'noan', 'roan', 'soan', 'toan', 'hoan', 'coan', 'goan', 'moan', 'voan', 'boan', 'doan'],
      trac: ['boàn', 'moàn', 'choàn', 'troàn', 'gioàn', 'ngoàn', 'nhoàn', 'khoàn', 'phoàn', 'thoàn', 'đoàn', 'soàn']
    },
    'oat': {
      bang: ['oát', 'loát', 'noát', 'roát', 'soát', 'toát', 'hoát', 'coát', 'goát', 'moát', 'voát', 'boát', 'doát'],
      trac: ['boát', 'moát', 'choát', 'troát', 'gioát', 'ngoát', 'nhoát', 'khoát', 'phoát', 'thoát', 'đoát', 'soát']
    },
    'oac': {
      bang: ['oác', 'loác', 'noác', 'roác', 'soác', 'toác', 'hoác', 'coác', 'goác', 'moác', 'voác', 'boác', 'doác'],
      trac: ['boác', 'moác', 'choác', 'troác', 'gioác', 'ngoác', 'nhoác', 'khoác', 'phoác', 'thoác', 'đoác', 'soác']
    }
  };

  // Alias mapping for common rhyme variations
  const rhymeAliases = {
    'a': 'a', 'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ang': 'ang', 'áng': 'ang', 'àng': 'ang', 'ảng': 'ang', 'ãng': 'ang', 'ạng': 'ang',
    'an': 'an', 'án': 'an', 'àn': 'an', 'ản': 'an', 'ãn': 'an', 'ạn': 'an',
    'am': 'am', 'ám': 'am', 'àm': 'am', 'ảm': 'am', 'ãm': 'am', 'ạm': 'am',
    'at': 'at', 'át': 'at', 'ạt': 'at',
    'ac': 'ac', 'ác': 'ac', 'ạc': 'ac',
    'ai': 'ai', 'ái': 'ai', 'ài': 'ai', 'ải': 'ai', 'ãi': 'ai', 'ại': 'ai',
    'ay': 'ay', 'áy': 'ay', 'ày': 'ay', 'ảy': 'ay', 'ãy': 'ay', 'ạy': 'ay',
    'au': 'au', 'áu': 'au', 'àu': 'au', 'ảu': 'au', 'ãu': 'au', 'ạu': 'au',
    'ao': 'ao', 'áo': 'ao', 'ào': 'ao', 'ảo': 'ao', 'ão': 'ao', 'ạo': 'ao',
    'eo': 'eo', 'éo': 'eo', 'èo': 'eo', 'ẻo': 'eo', 'ẽo': 'eo', 'ẹo': 'eo',
    'iu': 'iu', 'íu': 'iu', 'ìu': 'iu', 'ỉu': 'iu', 'ĩu': 'iu', 'ịu': 'iu',
    'ieu': 'ieu', 'iêu': 'ieu', 'íeu': 'ieu', 'ìeu': 'ieu', 'iểu': 'ieu', 'iễu': 'ieu', 'iệu': 'ieu',
    'o': 'o', 'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ong': 'ong', 'óng': 'ong', 'òng': 'ong', 'ỏng': 'ong', 'õng': 'ong', 'ọng': 'ong',
    'on': 'on', 'ón': 'on', 'òn': 'on', 'ỏn': 'on', 'õn': 'on', 'ọn': 'on',
    'om': 'om', 'óm': 'om', 'òm': 'om', 'ỏm': 'om', 'õm': 'om', 'ọm': 'om',
    'ot': 'ot', 'ót': 'ot', 'ọt': 'ot',
    'oc': 'oc', 'óc': 'oc', 'ọc': 'oc',
    'oi': 'oi', 'ói': 'oi', 'òi': 'oi', 'ỏi': 'oi', 'õi': 'oi', 'ọi': 'oi',
    'u': 'u', 'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ung': 'ung', 'úng': 'ung', 'ùng': 'ung', 'ủng': 'ung', 'ũng': 'ung', 'ụng': 'ung',
    'un': 'un', 'ún': 'un', 'ùn': 'un', 'ủn': 'un', 'ũn': 'un', 'ụn': 'un',
    'um': 'um', 'úm': 'um', 'ùm': 'um', 'ủm': 'um', 'ũm': 'um', 'ụm': 'um',
    'ut': 'ut', 'út': 'ut', 'ụt': 'ut',
    'uc': 'uc', 'úc': 'uc', 'ục': 'uc',
    'ui': 'ui', 'úi': 'ui', 'ùi': 'ui', 'ủi': 'ui', 'ũi': 'ui', 'ụi': 'ui',
    'uu': 'uu', 'ưu': 'uu', 'ứu': 'uu', 'ừu': 'uu', 'ửu': 'uu', 'ữu': 'uu', 'ựu': 'uu',
    'e': 'e', 'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'eng': 'eng', 'éng': 'eng', 'èng': 'eng', 'ẻng': 'eng', 'ẽng': 'eng', 'ẹng': 'eng',
    'en': 'en', 'én': 'en', 'èn': 'en', 'ẻn': 'en', 'ẽn': 'en', 'ẹn': 'en',
    'em': 'em', 'ém': 'em', 'èm': 'em', 'ẻm': 'em', 'ẽm': 'em', 'ẹm': 'em',
    'et': 'et', 'ét': 'et', 'ẹt': 'et',
    'ec': 'ec', 'éc': 'ec', 'ẹc': 'ec',
    'anh': 'anh', 'ánh': 'anh', 'ành': 'anh', 'ảnh': 'anh', 'ãnh': 'anh', 'ạnh': 'anh',
    'ach': 'ach', 'ách': 'ach', 'ạch': 'ach',
    'inh': 'inh', 'ính': 'inh', 'ình': 'inh', 'ỉnh': 'inh', 'ĩnh': 'inh', 'ịnh': 'inh',
    'ich': 'ich', 'ích': 'ich', 'ịch': 'ich',
    'uan': 'uan', 'oan': 'uan', 'oán': 'uan', 'oàn': 'uan', 'oản': 'uan', 'oãn': 'uan', 'oạn': 'uan',
    'uong': 'uong', 'uông': 'uong', 'uống': 'uong', 'uồng': 'uong', 'uổng': 'uong', 'uỗng': 'uong', 'uộng': 'uong',
    'uoc': 'uoc', 'uốc': 'uoc', 'uộc': 'uoc',
    'uot': 'uot', 'uốt': 'uot', 'uột': 'uot',
    'yen': 'yen', 'yên': 'yen', 'yến': 'yen', 'yền': 'yen', 'yển': 'yen', 'yễn': 'yen', 'yện': 'yen',
    'yem': 'yem', 'yêm': 'yem', 'yếm': 'yem', 'yềm': 'yem', 'yểm': 'yem', 'yễm': 'yem', 'yệm': 'yem',
    'yet': 'yet', 'yết': 'yet', 'yệt': 'yet',
    'ieng': 'ieng', 'iêng': 'ieng', 'iếng': 'ieng', 'iềng': 'ieng', 'iểng': 'ieng', 'iễng': 'ieng', 'iệng': 'ieng',
    'oai': 'oai', 'oái': 'oai', 'oài': 'oai', 'oải': 'oai', 'oãi': 'oai', 'oại': 'oai',
    'oan': 'oan', 'oán': 'oan', 'oàn': 'oan', 'oản': 'oan', 'oãn': 'oan', 'oạn': 'oan',
    'oat': 'oat', 'oát': 'oat', 'oạt': 'oat',
    'oac': 'oac', 'oác': 'oac', 'oạc': 'oac'
  };

  function normalizeRhyme(rhyme) {
    return rhymeAliases[rhyme] || rhyme;
  }

  function getSuggestions(word, desiredTone) {
    const rhyme = getRhyme(word, false);
    const normalizedRhyme = normalizeRhyme(rhyme);
    const entry = dictionary[normalizedRhyme];
    
    if (!entry) return null;
    
    const suggestions = desiredTone === 'bằng' ? entry.bang : entry.trac;
    if (!suggestions || suggestions.length === 0) return null;
    
    // Filter out the exact same word and return up to 10 suggestions
    return suggestions.filter(w => w !== word).slice(0, 10);
  }

  function formatSuggestion(word, targetWord, desiredTone) {
    const suggestions = getSuggestions(word, desiredTone);
    if (!suggestions || suggestions.length === 0) {
      return ` Không có gợi ý vần "${getRhyme(word, false)}" (${desiredTone}).`;
    }
    return ` Gợi ý thay "${word}" bằng: ${suggestions.join(', ')}`;
  }

  return {
    getSuggestions,
    formatSuggestion,
    dictionary
  };
})();
