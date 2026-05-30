import React from 'react';
import { CheckCircle2, Clock, Gift, RotateCcw, Swords, XCircle } from 'lucide-react';

export default function TaskCard({
  task,
  completed,
  skipped,
  canReroll,
  onComplete,
  onReroll,
  onSkip,
}) {
  if (!task) {
    return (
      <section className="empty-task">
        <Gift size={44} />
        <h2>今天的盲盒还安静地躺着</h2>
        <p>打开它，领取一个能在现实里完成的小任务。</p>
      </section>
    );
  }

  return (
    <section className={`task-card ${completed ? 'task-card-complete' : ''} ${skipped ? 'task-card-skipped' : ''}`}>
      <div className="task-card-header">
        <span className="task-category">{task.category}</span>
        <span className="task-difficulty">
          <Swords size={15} />
          {task.difficulty}
        </span>
      </div>

      <h2>{task.title}</h2>

      <div className="task-meta">
        <span>
          <Clock size={16} />
          {task.duration}
        </span>
        <span>
          <Gift size={16} />+{task.exp} EXP
        </span>
      </div>

      <div className="attribute-list" aria-label="属性奖励">
        {task.attributes.map((attribute) => (
          <span key={attribute.name} className="attribute-chip">
            {attribute.name} +{attribute.value}
          </span>
        ))}
      </div>

      {skipped && <p className="skip-note">没关系，今天先放过自己。</p>}

      <div className="task-actions">
        <button className="complete-button" onClick={onComplete} disabled={completed || skipped}>
          <CheckCircle2 size={20} />
          {completed ? '今日任务已完成' : skipped ? '今日已跳过' : '完成任务'}
        </button>
        {!completed && !skipped && (
          <>
            <button className="secondary-task-button" onClick={onReroll} disabled={!canReroll} type="button">
              <RotateCcw size={18} />
              换一个
            </button>
            <button className="ghost-task-button" onClick={onSkip} type="button">
              <XCircle size={18} />
              今天不想做
            </button>
          </>
        )}
      </div>
    </section>
  );
}
