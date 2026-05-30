import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Box, RotateCcw, X } from 'lucide-react';
import AdventureLog from './components/AdventureLog.jsx';
import CompletionModal from './components/CompletionModal.jsx';
import PlayerPanel from './components/PlayerPanel.jsx';
import TaskCard from './components/TaskCard.jsx';
import TaskDetailModal from './components/TaskDetailModal.jsx';
import TaskLibrary from './components/TaskLibrary.jsx';
import { adventureTasks } from './data/tasks.js';
import {
  applyAttributeRewards,
  calculateStreak,
  canRerollToday,
  hasCompletedToday,
  hasOpenedToday,
  loadPlayer,
  savePlayer,
  todayKey,
} from './utils/storage.js';

function drawTask(previousTaskId) {
  const candidates = adventureTasks.filter((task) => task.id !== previousTaskId);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

const encouragements = [
  '小小一步，也是今天真实发生的胜利。',
  '你把生活里的一个角落点亮了。',
  '经验到账，勇气也悄悄升级了。',
  '今天的你，已经比开局时更靠前一点。',
  '任务完成，世界没有变大，但你变能打了。',
  '这枚小成就，值得被认真收下。',
];

function drawEncouragement() {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

export default function App() {
  const [player, setPlayer] = useState(() => {
    const saved = loadPlayer();
    return {
      ...saved,
      streak: calculateStreak(saved.completedDates),
    };
  });
  const [completionResult, setCompletionResult] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [expAnimationKey, setExpAnimationKey] = useState(0);

  const completedToday = useMemo(() => hasCompletedToday(player), [player]);
  const openedToday = useMemo(() => hasOpenedToday(player), [player]);
  const skippedToday = player.currentTaskStatus === 'skipped' && openedToday;
  const canReroll = useMemo(
    () => canRerollToday(player) && player.currentTaskStatus === 'active',
    [player],
  );
  const preferenceHint = useMemo(() => {
    const entries = Object.entries(player.skipCountByCategory || {});
    const [category, count] = entries.sort((a, b) => b[1] - a[1])[0] || [];
    return count >= 2 ? `你最近似乎不太想做「${category}」类任务。` : '';
  }, [player.skipCountByCategory]);

  useEffect(() => {
    savePlayer(player);
  }, [player]);

  function handleOpenAdventure() {
    if (completedToday || openedToday) return;

    const date = todayKey();

    setPlayer((current) => {
      const nextTask = drawTask(current.currentTask?.id);

      return {
        ...current,
        currentTask: nextTask,
        currentTaskDate: date,
        currentTaskStatus: 'active',
        rerollUsed: false,
        rerollDate: date,
        discoveredTaskIds: [...new Set([...current.discoveredTaskIds, nextTask.id])],
      };
    });
  }

  function handleCompleteTask() {
    if (!player.currentTask || completedToday || skippedToday) return;

    const date = todayKey();
    const logId = `completed-${date}-${player.currentTask.id}-${Date.now()}`;
    const completedDates = [...new Set([...player.completedDates, date])];
    const nextHistory = [
      {
        ...player.currentTask,
        logId,
        taskId: player.currentTask.id,
        status: 'completed',
        date,
        completedAt: new Date().toISOString(),
        feelingTag: '',
        feelingNote: '',
      },
      ...player.history,
    ];

    setPlayer({
      ...player,
      exp: player.exp + player.currentTask.exp,
      attributes: applyAttributeRewards(player.attributes, player.currentTask.attributes),
      streak: calculateStreak(completedDates),
      completedDates,
      currentTaskStatus: 'completed',
      discoveredTaskIds: [...new Set([...player.discoveredTaskIds, player.currentTask.id])],
      history: nextHistory,
    });

    setCompletionResult({
      logId,
      title: player.currentTask.title,
      exp: player.currentTask.exp,
      attributes: player.currentTask.attributes,
      encouragement: drawEncouragement(),
    });
    setExpAnimationKey((key) => key + 1);
  }

  function handleRerollToday() {
    if (!canReroll || completedToday) return;

    setPlayer((current) => {
      const nextTask = drawTask(current.currentTask?.id);

      return {
        ...current,
        currentTask: nextTask,
        currentTaskStatus: 'active',
        rerollUsed: true,
        rerollDate: todayKey(),
        discoveredTaskIds: [...new Set([...current.discoveredTaskIds, nextTask.id])],
      };
    });
  }

  function handleSkipTask() {
    if (!player.currentTask || completedToday || skippedToday) return;

    const date = todayKey();
    const skippedRecord = {
      ...player.currentTask,
      logId: `skipped-${date}-${player.currentTask.id}-${Date.now()}`,
      taskId: player.currentTask.id,
      status: 'skipped',
      date,
      skippedAt: new Date().toISOString(),
    };

    setPlayer({
      ...player,
      currentTaskStatus: 'skipped',
      discoveredTaskIds: [...new Set([...player.discoveredTaskIds, player.currentTask.id])],
      skippedTasks: [skippedRecord, ...player.skippedTasks],
      skipCountByCategory: {
        ...player.skipCountByCategory,
        [player.currentTask.category]: (player.skipCountByCategory[player.currentTask.category] || 0) + 1,
      },
      history: [skippedRecord, ...player.history],
    });
  }

  function handleToggleFavorite(taskId) {
    setPlayer((current) => {
      const favorites = new Set(current.favoriteTaskIds);
      if (favorites.has(taskId)) {
        favorites.delete(taskId);
      } else {
        favorites.add(taskId);
      }

      return {
        ...current,
        favoriteTaskIds: [...favorites],
      };
    });
  }

  function handleSetToday(task) {
    if (completedToday || openedToday) {
      setDetailTask(null);
      return;
    }

    const date = todayKey();
    setPlayer((current) => ({
      ...current,
      currentTask: task,
      currentTaskDate: date,
      currentTaskStatus: 'active',
      rerollUsed: false,
      rerollDate: date,
      discoveredTaskIds: [...new Set([...current.discoveredTaskIds, task.id])],
    }));
    setDetailTask(null);
  }

  function handleRewardClose(feedback) {
    if (feedback?.logId) {
      setPlayer((current) => ({
        ...current,
        history: current.history.map((item) =>
          item.logId === feedback.logId
            ? {
                ...item,
                feelingTag: feedback.feelingTag,
                feelingNote: feedback.feelingNote,
              }
            : item,
        ),
      }));
    }

    setCompletionResult(null);
  }

  return (
    <main className="app-shell">
      <div className="background-grid" />

      <section className="hero">
        <PlayerPanel player={player} expAnimationKey={expAnimationKey} />

        <div className="adventure-zone">
          <div className="blind-box">
            <div className="box-lid" />
            <div className="box-face">
              <Box size={42} />
            </div>
          </div>

          <div className="action-row">
            <button
              className="open-button"
              onClick={handleOpenAdventure}
              disabled={completedToday || openedToday}
            >
              <Box size={20} />
              {completedToday ? '明天再开新冒险' : openedToday ? '今日冒险已开启' : '打开今日小冒险'}
            </button>
            {openedToday && !completedToday && player.currentTaskStatus === 'active' && (
              <button
                className="reroll-button"
                onClick={handleRerollToday}
                disabled={!canReroll}
                type="button"
              >
                <RotateCcw size={19} />
                {canReroll ? '重新抽一次' : '今日重抽已用'}
              </button>
            )}
          </div>
          {preferenceHint && <p className="preference-hint">{preferenceHint}</p>}
        </div>
      </section>

      <section className="content-grid">
        <TaskCard
          task={player.currentTask}
          completed={completedToday}
          skipped={skippedToday}
          canReroll={canReroll}
          onComplete={handleCompleteTask}
          onReroll={handleRerollToday}
          onSkip={handleSkipTask}
        />
        <AdventureLog history={player.history} />
      </section>

      <button className="codex-button" onClick={() => setLibraryOpen(true)} type="button">
        <BookOpen size={19} />
        冒险图鉴
      </button>

      {libraryOpen && (
        <div className="codex-drawer-shell" role="presentation">
          <button
            className="codex-drawer-backdrop"
            onClick={() => setLibraryOpen(false)}
            type="button"
            aria-label="关闭冒险图鉴"
          />
          <aside className="codex-drawer" aria-label="冒险图鉴抽屉">
            <div className="codex-drawer-header">
              <span>冒险图鉴</span>
              <button onClick={() => setLibraryOpen(false)} type="button" aria-label="关闭冒险图鉴">
                <X size={19} />
              </button>
            </div>
            <TaskLibrary
              tasks={adventureTasks}
              player={player}
              onOpenDetail={setDetailTask}
              onToggleFavorite={handleToggleFavorite}
            />
          </aside>
        </div>
      )}
      <TaskDetailModal
        task={detailTask}
        favorited={Boolean(detailTask && player.favoriteTaskIds.includes(detailTask.id))}
        onClose={() => setDetailTask(null)}
        onToggleFavorite={() => detailTask && handleToggleFavorite(detailTask.id)}
        onSetToday={() => detailTask && handleSetToday(detailTask)}
      />
      <CompletionModal result={completionResult} onClose={handleRewardClose} />
    </main>
  );
}
