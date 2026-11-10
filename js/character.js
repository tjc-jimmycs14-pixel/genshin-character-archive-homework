import { ELEMENT_LABELS, WEAPON_LABELS, ELEMENT_GLYPHS, TALENT_LABELS, TALENT_GLYPHS, getAssetUrl, labelFor } from './data.js';

function elementLabel(character) { return labelFor(ELEMENT_LABELS, character.element); }
function weaponLabel(character) { return labelFor(WEAPON_LABELS, character.weapon); }

function makeImage(path, alt, className) {
  const img = document.createElement('img');
  img.className = className;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  const url = getAssetUrl(path);
  if (!url) return null;
  img.src = url;
  return img;
}

export function createCharacterCard(character) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'character-card';
  card.dataset.element = character.element;
  card.dataset.characterId = character.id;
  card.setAttribute('aria-label', `查看${character.name}的角色資料與技能`);

  card.dataset.status = character.reviewStatus || 'pending';
  const ring = document.createElement('span');
  ring.className = 'card-inner-ring';
  ring.setAttribute('aria-hidden', 'true');
  const element = document.createElement('span');
  element.className = 'card-element';
  const dot = document.createElement('span');
  dot.className = 'element-dot';
  dot.textContent = ELEMENT_GLYPHS[character.element];
  dot.setAttribute('aria-hidden', 'true');
  element.append(dot, document.createTextNode(elementLabel(character)));
  const rarity = document.createElement('span');
  rarity.className = 'card-rarity';
  rarity.textContent = '★'.repeat(character.rarity);
  rarity.setAttribute('aria-label', `${character.rarity}星`);
  const art = document.createElement('div');
  art.className = 'card-art';
  const fallback = document.createElement('span');
  fallback.className = 'card-art-fallback';
  fallback.setAttribute('aria-hidden', 'true');
  const glyph = document.createElement('span');
  glyph.className = 'fallback-art-glyph';
  glyph.textContent = ELEMENT_GLYPHS[character.element];
  const initial = document.createElement('span');
  initial.className = 'fallback-art-initial';
  initial.textContent = character.name.slice(0, 1);
  fallback.append(glyph, initial);
  const img = makeImage(character.portrait, '', 'card-portrait');
  if (img) {
    img.addEventListener('error', () => img.replaceWith(fallback), {once: true});
    art.append(img);
  } else art.append(fallback);
  const body = document.createElement('div');
  body.className = 'card-body';
  const copy = document.createElement('div');
  const name = document.createElement('h3');
  name.textContent = character.name;
  const sub = document.createElement('p');
  sub.className = 'card-sub';
  sub.textContent = `${character.region || '地區待確認'} · ${weaponLabel(character)}`;
  copy.append(name, sub);
  const arrow = document.createElement('span');
  arrow.className = 'card-arrow';
  arrow.textContent = '›';
  arrow.setAttribute('aria-hidden', 'true');
  body.append(copy, arrow);
  const status = document.createElement('span');
  status.className = 'card-data-status';
  status.textContent = character.reviewStatus === 'reviewed' ? '天賦已整理' : '資料待補';
  art.append(status);
  card.append(ring, element, rarity, art, body);
  return card;
}

export function renderCharacterSwitcher(index, currentId, onSelect) {
  const wrapper = document.getElementById('character-switcher');
  const currentIndex = index.findIndex(character => character.id === currentId);
  const fragment = document.createDocumentFragment();
  // Keep the quick switcher usable with a large collection. The dropdown includes everyone.
  const begin = Math.max(0, Math.min(currentIndex - 3, index.length - 7));
  for (const character of index.slice(begin, begin + 7)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'switcher-item';
    button.dataset.element = character.element;
    button.setAttribute('aria-current', character.id === currentId ? 'true' : 'false');
    button.setAttribute('aria-label', `切換為${character.name}`);
    const thumb = document.createElement('span');
    thumb.className = 'switcher-thumb';
    const image = makeImage(character.portrait, '', 'switcher-portrait');
    const fallback = document.createElement('span');
    fallback.textContent = character.name.slice(0, 1);
    fallback.setAttribute('aria-hidden', 'true');
    if (image) {
      image.addEventListener('error', () => image.replaceWith(fallback), { once: true });
      thumb.append(image);
    } else thumb.append(fallback);
    const label = document.createElement('span');
    label.textContent = character.name;
    button.append(thumb, label);
    button.addEventListener('click', () => onSelect(character.id));
    fragment.append(button);
  }
  wrapper.replaceChildren(fragment);
}

export function renderCharacterStage(character) {
  document.getElementById('app').dataset.element = character.element;
  document.getElementById('breadcrumb-current').textContent = character.name;
  document.getElementById('detail-character-name').textContent = character.name;
  document.getElementById('detail-region').textContent = `${character.region || '地區待確認'} · ${elementLabel(character)}`;
  const stars = document.getElementById('detail-stars');
  stars.textContent = '★'.repeat(character.rarity);
  stars.setAttribute('aria-label', `${character.rarity}星角色`);
  const image = document.getElementById('detail-portrait');
  const fallback = document.getElementById('detail-portrait-fallback');
  const url = getAssetUrl(character.portrait);
  document.getElementById('fallback-emblem').textContent = ELEMENT_GLYPHS[character.element];
  document.getElementById('detail-data-status').textContent = character.reviewStatus === 'reviewed' ? '✦ 已整理技能內容' : '◇ 技能資料整理中';
  const source = document.getElementById('detail-source-link');
  try {
    const url = new URL(character.source);
    if (url.protocol !== 'https:') throw new Error('不支援的來源網址');
    source.href = url.href;
    source.hidden = false;
  } catch {
    source.hidden = true;
  }
  image.onload = null;
  image.onerror = null;
  if (!url) { image.hidden = true; fallback.hidden = false; return; }
  image.alt = `${character.name}的原創人物示意剪影（非官方立繪）`;
  image.hidden = false;
  fallback.hidden = true;
  image.onerror = () => { image.hidden = true; fallback.hidden = false; };
  image.src = url;
}

function appendFact(container, title, value) {
  const fact = document.createElement('div');
  fact.className = 'panel-fact';
  const label = document.createElement('small');
  label.textContent = title;
  const content = document.createElement('strong');
  content.textContent = value;
  fact.append(label, content);
  container.append(fact);
}

function descriptionOrFallback(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '資料整理中';
}

export function renderTalentContent(character, activeTab) {
  const category = document.getElementById('detail-category');
  const counter = document.getElementById('detail-counter');
  const emblem = document.getElementById('detail-emblem');
  const title = document.getElementById('detail-skill-name');
  const description = document.getElementById('detail-skill-description');
  const passives = document.getElementById('detail-passives');
  const tabOrder = ['info','normalAttack','elementalSkill','elementalBurst','passiveTalents'];
  category.textContent = `${TALENT_LABELS[activeTab]} / ${activeTab === 'info' ? 'PROFILE' : 'TALENTS'}`;
  counter.textContent = `${String(tabOrder.indexOf(activeTab) + 1).padStart(2,'0')} / 05`;
  emblem.textContent = TALENT_GLYPHS[activeTab];
  description.replaceChildren();
  passives.replaceChildren();
  passives.hidden = true;
  if (activeTab === 'info') {
    title.textContent = character.name;
    const para = document.createElement('p');
    para.textContent = descriptionOrFallback(character.description);
    description.append(para);
    const facts = document.createElement('div');
    facts.className = 'panel-facts';
    appendFact(facts, '元素屬性', elementLabel(character));
    appendFact(facts, '武器類型', weaponLabel(character));
    appendFact(facts, '角色稀有度', `${character.rarity} 星`);
    appendFact(facts, '所屬地區', character.region || '資料整理中');
    description.append(facts);
    return;
  }
  if (activeTab === 'passiveTalents') {
    title.textContent = TALENT_LABELS[activeTab];
    const list = Array.isArray(character.talents.passiveTalents) ? character.talents.passiveTalents : [];
    if (!list.length) { description.textContent = '資料整理中'; return; }
    passives.hidden = false;
    list.forEach((talent, index) => {
      const item = document.createElement('section');
      item.className = 'passive-item';
      const h3 = document.createElement('h3');
      const glyph = document.createElement('span');
      glyph.textContent = '✧';
      glyph.setAttribute('aria-hidden','true');
      h3.append(glyph, document.createTextNode(talent?.name?.trim() || `固有天賦 ${index+1}`));
      const p = document.createElement('p');
      p.textContent = descriptionOrFallback(talent?.description);
      item.append(h3, p);
      passives.append(item);
    });
    return;
  }
  const talent = character.talents[activeTab] || {};
  title.textContent = typeof talent.name === 'string' && talent.name.trim() ? talent.name : '技能名稱待確認';
  const para = document.createElement('p');
  para.textContent = descriptionOrFallback(talent.description);
  description.append(para);
}

export function setActiveTalentTab(tab) {
  document.querySelectorAll('.detail-tab').forEach(button => {
    const active = button.dataset.tab === tab;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
