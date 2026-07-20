export const synonymMap = {
  'bismuth ammonium citrate': 'bismuth',
  'bismuth citrate': 'bismuth',
  'bismuth subgallate': 'bismuth',
  'bismuth tannate': 'bismuth',
  'bismuth oxychloride': 'bismuth',
  'bismuth subcarbonate': 'bismuth',
  'bismuth subnitrate': 'bismuth',
  'bismuth chloride oxide': 'bismuth',
  'cocos nucifera coconut oil': 'coconut oil',
  'cocos nucifera': 'coconut oil',
  'coconut kernel oil': 'coconut oil',
  'coconut palm oil': 'coconut oil',
  'copra oil': 'coconut oil',
  'cocos nucifera coconut fruit juice': 'coconut oil',
  'refined coconut oil': 'coconut oil',
  'unrefined coconut oil': 'coconut oil',
  'expeller pressed': 'coconut oil',
  'centrifuge extracted coconut oil': 'coconut oil',
  'hydrogenated coconut oil': 'coconut oil',
  'non-hydrogenated coconut oil': 'coconut oil',
  'virgin coconut oil': 'coconut oil',
  'organic cocos nucifera coconut oil': 'coconut oil',
  'cocos nucifera coconutnoix de coco oil': 'coconut oil',
  'hydrogenated coconut acid': 'coconut extract',
  'coconut acid': 'coconut extract',
  'butyrospermum parkii shea butter': 'shea butter',
  'butyrospermum parkii shea butter extract': 'shea butter',
  'butyrospermum parkii shea oil': 'shea butter',
  'butyrospermum parkii butter butyrospermum parkii shea butter': 'shea butter',
  'shea': 'shea butter',
  'shea butter ethyl esters': 'shea butter',
  'shea butterbutyrospermum parkii butter': 'shea butter',
  'synthetic beeswax': 'beeswax',
  'polyglyceryl 3 beeswax': 'beeswax',
  'sodium polyacrylate starch': 'starch',
  'zea mays corn starch': 'starch',
  'hydroxypropyl starch phosphate': 'starch',
  'peg8 stearate': 'peg 8 stearate',
  'peg 75': 'peg-75',
  'glycine soja oil soybean oil': 'soybean oil',
  'glycine soja soybean extract': 'soybean oil',
  'undaria pinnatifida extract': 'undaria pinnatifida',
  'sorbitan oleate decylglucoside crosspolymer': 'sorbitan oleate',
  'hydrolyzed soy protein': 'soy',
  'hydrolyzed corn protein': 'corn',
  'peg8 beeswax': 'beeswax',
  'triticum vulgare wheat germ oil': 'wheat',
  'triticum vulgare wheat flour lipids': 'wheat',
  'triticum vulgare': 'wheat',
  'potassium palmitoyl hydrolyzed wheat protein': 'wheat',
  'glycine soja soybean seed extract': 'soybean',
  'soja soybean seed extract': 'soybean',
  'glycine soja soybean oil': 'soybean',
  'glycine soja soybean sterols': 'soybean',
  'glycine soja soybean protein': 'soybean',
  'tapioca starch': 'starch',
  'chondrus crispus extract': 'chondrus crispus (aka irish moss or carageenan moss)',
  'chondrus crispus carrageenan extract': 'chondrus crispus (aka irish moss or carageenan moss)',
  'fucus vesiculosus extract': 'fucus vesiculosus',
  'ceteareth20 and cetearyl alcohol': 'cetearyl alcohol + ceteareth 20',
  'polyglyceryl3 diisostearate': 'polyglyceryl-3 diisostearate',
  'laureth23': 'laureth-23',
  'laureth4': 'laureth-4',
  'porphyridium cruentum extract': 'porphyridium',
  'chlorella vulgaris extract': 'chlorella',
  'chlorella extract': 'chlorella',
  'red 17': 'd & c red # 17',
  'red 21': 'd & c red # 21',
  'red 33': 'd & c red # 3',
  'red 30': 'd & c red # 30',
  'red 36': 'd & c red # 36',
  'myristyl ether propionate': 'myristyl',
  'ppg2 myristyl ether propionate': 'myristyl',
  'adansonia digitata baobab oil': 'baobab',
  'baobab oil': 'baobab',
  'polyglyceryl10 myristate': 'myristate',
  'magnesium myristate': 'myristate',
  'isopropyl myristate': 'myristate',
  'myristyl myristate': 'myristate',
  'zinc myristate': 'myristate',
  'octyldodecyl myristate': 'myristate',
  'ppg3 benzyl elther myristate': 'myristate',
  'sesamum indicum sesame oil': 'sesame',
  'sesamum indicum sesame seed oil': 'sesame',
  'sesamum indicum sesame seed powder': 'sesame',
  'sesamum indicum sesame': 'sesame',
  'sesamum indicum': 'sesame',
  'sesame oil': 'sesame',
  'plankton extract': 'plankton',
  'aluminum starch octenylsuccinate': 'starch',
  'hydroxypropyl starch': 'starch',
  'dictyopteris polypodioides extract': 'dictyopteris polypodioides',
  'theobroma cacao cocoa seed butter': 'cocoa butter',
  'cocoa seed butter': 'cocoa butter',
  'oleth3 phosphate': 'oleth-3',
  'hydrolyzed corn starch': 'corn',
  'aluminum starch octenylsuccinate and boron nitride': 'starch',
  'aluminum starch': 'starch',
  'hydrogenated starch hydrolysate': 'starch',
  'corn starch powder': 'starch',
  'steareth100': 'steareth 10',
  '1acetoxyhexadecane': '1-acetoxyhexadecane',
  '1hexadecanol acetate': '1-hexadecanol acetate',
  '1hexadecanol': '1-hexadecanol',
  'd c red 17': 'd & c red # 17',
  'd c red 21': 'd & c red # 21',
  'd c red 3': 'd & c red # 3',
  'd c red 30': 'd & c red # 30',
  'd c red 36': 'd & c red # 36'
};

export function cleanName(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/ci \d+/gi, '')
    .replace(/[^a-z0-9 &#+()-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeIngredientName(name) {
  const cleaned = cleanName(name);
  return synonymMap[cleaned] || cleaned;
}

export function parseIngredients(input) {
  if (Array.isArray(input)) {
    return input.map(String).map(cleanName).filter(Boolean);
  }

  return String(input || '')
    .replace(/may contain/gi, '')
    .replace(/peut contenir/gi, '')
    .replace(/[\|\\/\u00B7\u2022\n\r.]+/g, ',')
    .split(',')
    .map(cleanName)
    .filter(Boolean);
}

export function getComedogenicRating(score) {
  if (score === null || score === undefined) return 'unknown';
  if (score <= 1) return 'low';
  if (score <= 3) return 'moderate';
  return 'high';
}
