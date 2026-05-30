export const attributeMeta = [
  { key: 'explore', label: '探索力' },
  { key: 'action', label: '行动力' },
  { key: 'social', label: '社交力' },
  { key: 'energy', label: '回血力' },
  { key: 'curiosity', label: '好奇心' },
  { key: 'order', label: '秩序感' },
];

export const defaultAttributes = attributeMeta.reduce(
  (attributes, item) => ({ ...attributes, [item.key]: 0 }),
  {},
);

const levelTitles = [
  '新手冒险者',
  '生活观察员',
  '城市探索者',
  '反惯性玩家',
  '松弛感大师',
  '现实 RPG 主角',
];

export function getLevel(exp) {
  return Math.floor(exp / 100) + 1;
}

export function getLevelProgress(exp) {
  return exp % 100;
}

export function getLevelTitle(level) {
  return levelTitles[Math.min(level, levelTitles.length) - 1];
}

export function normalizeAttributes(attributes = {}) {
  return attributeMeta.reduce(
    (result, item) => ({ ...result, [item.key]: Number(attributes[item.key] || 0) }),
    {},
  );
}
