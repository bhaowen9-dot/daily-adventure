import React from 'react';
import { Clock, Gem, Heart, Swords, X } from 'lucide-react';

export default function TaskDetailModal({ task, favorited, onClose, onToggleFavorite, onSetToday }) {
  if (!task) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="task-detail-title">
        <button className="modal-close" onClick={onClose} type="button" aria-label="关闭任务详情">
          <X size={19} />
        </button>

        <span className="task-category">{task.category}</span>
        <h2 id="task-detail-title">{task.title}</h2>
        <div className="library-meta">
          <span>
            <Swords size={15} />
            {task.difficulty}
          </span>
          <span>
            <Clock size={15} />
            {task.duration}
          </span>
          <span>
            <Gem size={15} />+{task.exp} EXP
          </span>
        </div>

        <div className="attribute-list">
          {task.attributes.map((attribute) => (
            <span className="attribute-chip" key={attribute.key || attribute.name}>
              {attribute.name} +{attribute.value}
            </span>
          ))}
        </div>

        <div className="detail-copy">
          <h3>任务说明</h3>
          <p>{task.description}</p>
          <h3>完成条件</h3>
          <p>{task.completion}</p>
        </div>

        <div className="detail-actions">
          <button className="modal-button" onClick={onToggleFavorite} type="button">
            <Heart size={18} />
            {favorited ? '取消收藏' : '收藏'}
          </button>
          <button className="secondary-task-button" onClick={onSetToday} type="button">
            设为今日想做
          </button>
          <button className="ghost-task-button" onClick={onClose} type="button">
            关闭
          </button>
        </div>
      </section>
    </div>
  );
}
