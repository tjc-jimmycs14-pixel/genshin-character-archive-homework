import { loadCharacterIndex, loadCharacterDetails } from './data.js';
import { createCharacterCard, renderCharacterSwitcher, renderCharacterStage, renderTalentContent, setActiveTalentTab } from './character.js';

const overview = document.getElementById('overview-view');
const detail = document.getElementById('detail-view');
const grid = document.getElementById('character-grid');
const overviewMessage = document.getElementById('overview-message');
const detailMessage = document.getElementById('detail-message');
const empty = document.getElementById('empty-state');
const elementFilter = document.getElementById('element-filter');
const weaponFilter = document.getElementById('weapon-filter');
const rarityFilter = document.getElementById('rarity-filter');
const statusFilter = document.getElementById('status-filter');
const sortFilter = document.getElementById('sort-filter');
const nameSearch = document.getElementById('name-search');
const loadMore = document.getElementById('load-more');
const quickSelect = document.getElementById('quick-character-select');
const characterCache = new Map();
const PAGE_SIZE = 24;
let index = [];
let selectedCharacter = null;
let loadSequence = 0;
let visibleCount = PAGE_SIZE;

function showNotice(node, message) {
  node.textContent = message;
  node.hidden = !message;
}

function clearFilters() {
  elementFilter.value = 'all';
  weaponFilter.value = 'all';
  rarityFilter.value = 'all';
  statusFilter.value = 'all';
  sortFilter.value = 'featured';
  nameSearch.value = '';
  visibleCount = PAGE_SIZE;
  renderOverview();
}

function matchingCharacters() {
  const query = nameSearch.value.trim().normalize('NFKC').toLowerCase();
  const matches = index.filter(c =>
    (!query || c.name.normalize('NFKC').toLowerCase().includes(query) || c.id.includes(query.replace(/\s+/g, '-'))) &&
    (elementFilter.value === 'all' || c.element === elementFilter.value) &&
    (weaponFilter.value === 'all' || c.weapon === weaponFilter.value) &&
    (rarityFilter.value === 'all' || c.rarity === Number(rarityFilter.value)) &&
    (statusFilter.value === 'all' || c.reviewStatus === statusFilter.value)
  );
  if (sortFilter.value === 'name') matches.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
  if (sortFilter.value === 'rarity') matches.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name, 'zh-Hant'));
  return matches;
}

function renderOverview() {
  const results = matchingCharacters();
  const visible = results.slice(0, visibleCount);
  const fragment = document.createDocumentFragment();
  for (const character of visible) fragment.append(createCharacterCard(character));
  grid.replaceChildren(fragment);
  grid.setAttribute('aria-busy', 'false');
  empty.hidden = results.length > 0 || index.length === 0;
  loadMore.hidden = visible.length >= results.length;
  document.getElementById('filter-count').textContent = `顯示 ${visible.length} / 符合 ${results.length} / 共 ${index.length}`;
  document.getElementById('total-characters').textContent = String(index.length).padStart(2, '0');
  document.getElementById('reviewed-characters').textContent = String(index.filter(c => c.reviewStatus === 'reviewed').length).padStart(2, '0');
}

function openOverview() {
  loadSequence++;
  overview.hidden = false;
  detail.hidden = true;
  document.getElementById('app').dataset.element = 'Hydro';
  document.title = '原神角色與技能圖鑑 | Character Archive';
  renderOverview();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function openDetail(id) {
  const summary = index.find(character => character.id === id);
  if (!summary) {
    openOverview();
    showNotice(overviewMessage, '找不到這位角色，已返回角色圖鑑。');
    return;
  }
  const sequence = ++loadSequence;
  selectedCharacter = null;
  showNotice(detailMessage, '');
  overview.hidden = true;
  detail.hidden = false;
  renderCharacterSwitcher(index, id, target => { window.location.hash = `#/character/${target}`; });
  quickSelect.value = id;
  renderCharacterStage(summary);
  setActiveTalentTab('info');
  document.getElementById('detail-category').textContent = '載入中 / LOADING';
  document.getElementById('detail-skill-name').textContent = '正在讀取角色資料…';
  document.getElementById('detail-skill-description').textContent = '';
  document.getElementById('detail-passives').hidden = true;
  document.title = `${summary.name} | 原神角色與技能圖鑑`;
  window.scrollTo({ top: 0, behavior: 'instant' });
  try {
    if (!characterCache.has(id)) characterCache.set(id, await loadCharacterDetails(id));
    if (sequence !== loadSequence) return;
    selectedCharacter = characterCache.get(id);
    renderCharacterStage(selectedCharacter);
    renderTalentContent(selectedCharacter, 'info');
  } catch (error) {
    if (sequence !== loadSequence) return;
    selectedCharacter = null;
    document.getElementById('detail-category').textContent = '載入失敗 / ERROR';
    document.getElementById('detail-skill-name').textContent = '角色資料暫時無法顯示';
    document.getElementById('detail-skill-description').textContent = '請確認角色詳細資料檔存在，然後重新整理頁面。';
    document.getElementById('detail-data-status').textContent = '資料載入錯誤';
    showNotice(detailMessage, error.message || '無法載入角色資料。');
  }
}

function handleRoute() {
  const path = window.location.hash.replace(/^#/, '');
  // Preserve the skip-to-content anchor instead of routing it to the homepage.
  if (path === 'main-content') { document.getElementById('main-content').focus(); return; }
  const match = /^\/character\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path);
  if (match) openDetail(match[1]);
  else openOverview();
}

function renderQuickSelect() {
  const fragment = document.createDocumentFragment();
  for (const c of [...index].sort((a,b) => a.name.localeCompare(b.name,'zh-Hant'))) {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = `${c.name} · ${c.reviewStatus === 'reviewed' ? '天賦已整理' : '資料待補'}`;
    fragment.append(option);
  }
  quickSelect.replaceChildren(fragment);
}

function initializeEvents() {
  for (const node of [elementFilter, weaponFilter, rarityFilter, statusFilter, sortFilter]) {
    node.addEventListener('change', () => { visibleCount = PAGE_SIZE; renderOverview(); });
  }
  nameSearch.addEventListener('input', () => { visibleCount = PAGE_SIZE; renderOverview(); });
  loadMore.addEventListener('click', () => { visibleCount += PAGE_SIZE; renderOverview(); });
  document.getElementById('clear-filters').addEventListener('click', clearFilters);
  document.getElementById('empty-reset').addEventListener('click', clearFilters);
  grid.addEventListener('click', event => {
    const button = event.target.closest('button[data-character-id]');
    if (button) window.location.hash = `#/character/${button.dataset.characterId}`;
  });
  quickSelect.addEventListener('change', () => { window.location.hash = `#/character/${quickSelect.value}`; });
  document.querySelectorAll('.detail-tab').forEach(button => {
    button.addEventListener('click', () => {
      if (!selectedCharacter) return;
      const tab = button.dataset.tab;
      setActiveTalentTab(tab);
      renderTalentContent(selectedCharacter, tab);
    });
  });
  for (const id of ['breadcrumb-back', 'detail-return']) {
    document.getElementById(id).addEventListener('click', () => { window.location.hash = '#/'; });
  }
  window.addEventListener('hashchange', handleRoute);
}

async function initialize() {
  initializeEvents();
  try {
    index = await loadCharacterIndex();
    renderQuickSelect();
    showNotice(overviewMessage,'');
    handleRoute();
  } catch (error) {
    grid.setAttribute('aria-busy','false');
    showNotice(overviewMessage, `${error.message || '資料讀取失敗。'} 請透過本機 HTTP 伺服器開啟網站，並確認 data/characters.json 可讀取。`);
    renderOverview();
  }
}
initialize();
