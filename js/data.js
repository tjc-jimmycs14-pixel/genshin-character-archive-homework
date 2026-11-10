/** 資料載入與固定分類名稱。介面不直接寫入角色資訊。 */
export const ELEMENT_LABELS = Object.freeze({
  Pyro: '火元素', Hydro: '水元素', Anemo: '風元素', Electro: '雷元素',
  Dendro: '草元素', Cryo: '冰元素', Geo: '岩元素'
});
export const WEAPON_LABELS = Object.freeze({
  Sword: '單手劍', Claymore: '雙手劍', Polearm: '長柄武器',
  Bow: '弓', Catalyst: '法器'
});
export const ELEMENT_GLYPHS = Object.freeze({
  Pyro: '♨', Hydro: '◈', Anemo: '❃', Electro: 'ϟ', Dendro: '❋', Cryo: '❄', Geo: '◆'
});
export const TALENT_LABELS = Object.freeze({
  info: '基本資訊', normalAttack: '普通攻擊', elementalSkill: '元素戰技',
  elementalBurst: '元素爆發', passiveTalents: '固有天賦'
});
export const TALENT_GLYPHS = Object.freeze({
  info: '◇', normalAttack: '✦', elementalSkill: '✧', elementalBurst: '✺', passiveTalents: '❖'
});
const VALID_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertResponse(response, path) {
  if (!response.ok) throw new Error(`無法載入 ${path}（HTTP ${response.status}）`);
  return response.json();
}

export async function loadCharacterIndex() {
  const path = './data/characters.json';
  const data = await fetch(path).then(response => assertResponse(response, path));
  if (!Array.isArray(data)) throw new Error('角色索引格式不正確。');
  const usedIds = new Set();
  return data.map(item => {
    if (!item || !VALID_ID.test(item.id) || usedIds.has(item.id) ||
        typeof item.name !== 'string' || !ELEMENT_LABELS[item.element] ||
        !WEAPON_LABELS[item.weapon] || ![4, 5].includes(item.rarity)) {
      throw new Error('角色索引含有不完整或重複的資料。');
    }
    usedIds.add(item.id);
    return item;
  });
}

export async function loadCharacterDetails(id) {
  if (!VALID_ID.test(id)) throw new Error('角色識別碼格式不正確。');
  const path = `./data/characters/${id}.json`;
  const data = await fetch(path).then(response => assertResponse(response, path));
  if (!data || data.id !== id || typeof data.name !== 'string' ||
      !ELEMENT_LABELS[data.element] || !WEAPON_LABELS[data.weapon] ||
      ![4, 5].includes(data.rarity) || !data.talents ||
      typeof data.talents !== 'object') {
    throw new Error('角色詳細資料格式不正確。');
  }
  return data;
}

/** 僅允許專案內的相對圖片路徑。空字串代表沒有圖片。 */
export function getAssetUrl(path) {
  if (typeof path !== 'string' || !/^assets\/[a-z0-9/_-]+\.(?:svg|png|webp|jpg|jpeg)$/i.test(path) || path.includes('..')) {
    return '';
  }
  return new URL(`./${path}`, document.baseURI).href;
}

export function labelFor(dict, key) { return dict[key] || '待確認'; }
