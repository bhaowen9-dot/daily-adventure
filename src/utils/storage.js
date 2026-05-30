import { defaultAttributes, normalizeAttributes } from './level.js';

const STORAGE_KEY = 'today-mini-adventure-state';

export const defaultPlayer = {
  exp: 0,
  attributes: defaultAttributes,
  streak: 0,
  completedDates: [],
  currentTask: null,
  currentTaskDate: null,
  currentTaskStatus: 'idle',
  rerollUsed: false,
  rerollDate: null,
  discoveredTaskIds: [],
  favoriteTaskIds: [],
  skippedTasks: [],
  skipCountByCategory: {},
  history: [],
};

export function loadPlayer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPlayer;
    return normalizeDailyPlayer({ ...defaultPlayer, ...JSON.parse(raw) });
  } catch {
    return defaultPlayer;
  }
}

export function savePlayer(player) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}

export function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLevel(exp) {
  return Math.floor(exp / 100) + 1;
}

export function getLevelProgress(exp) {
  return exp % 100;
}

export function hasCompletedToday(player) {
  return player.completedDates.includes(todayKey());
}

export function hasOpenedToday(player) {
  return Boolean(player.currentTask && player.currentTaskDate === todayKey());
}

export function canRerollToday(player) {
  return hasOpenedToday(player) && player.rerollDate === todayKey() && !player.rerollUsed;
}

export function normalizeDailyPlayer(player) {
  const date = todayKey();
  const hasTodayTask = player.currentTask && player.currentTaskDate === date;
  const history = (player.history || []).map((item) => ({
    status: 'completed',
    taskId: item.taskId || item.id,
    completedAt: item.completedAt || item.date,
    ...item,
  }));
  const discoveredTaskIds = new Set(player.discoveredTaskIds || []);
  history.forEach((item) => {
    if (item.taskId) discoveredTaskIds.add(item.taskId);
  });
  if (hasTodayTask && player.currentTask?.id) {
    discoveredTaskIds.add(player.currentTask.id);
  }

  return {
    ...player,
    attributes: normalizeAttributes(player.attributes),
    currentTask: hasTodayTask ? player.currentTask : null,
    currentTaskDate: hasTodayTask ? player.currentTaskDate : null,
    currentTaskStatus: hasTodayTask ? player.currentTaskStatus || 'active' : 'idle',
    rerollUsed: player.rerollDate === date ? Boolean(player.rerollUsed) : false,
    rerollDate: date,
    discoveredTaskIds: [...discoveredTaskIds],
    favoriteTaskIds: [...new Set(player.favoriteTaskIds || [])],
    skippedTasks: player.skippedTasks || [],
    skipCountByCategory: player.skipCountByCategory || {},
    history,
  };
}

export function applyAttributeRewards(attributes, rewards) {
  const nextAttributes = normalizeAttributes(attributes);

  rewards.forEach((reward) => {
    if (reward.key) {
      nextAttributes[reward.key] = (nextAttributes[reward.key] || 0) + reward.value;
    }
  });

  return nextAttributes;
}

export function calculateStreak(completedDates) {
  const dates = new Set(completedDates);
  let cursor = new Date();
  let streak = 0;

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  while (dates.has(formatLocalDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
