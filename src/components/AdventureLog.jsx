import React from 'react';
import { ScrollText } from 'lucide-react';

export default function AdventureLog({ history }) {
  return (
    <section className="history-panel" aria-label="冒险日志">
      <div className="section-title">
        <ScrollText size={19} />
        <h2>冒险日志</h2>
      </div>

      {history.length === 0 ? (
        <p className="history-empty">完成或跳过一次小冒险后，这里会留下属于今天的生活记录。</p>
      ) : (
        <div className="history-list">
          {history.slice(0, 8).map((item) => {
            const isSkipped = item.status === 'skipped';
            const feeling = [item.feelingTag, item.feelingNote].filter(Boolean).join(' · ');

            return (
              <article
                className={`history-item ${isSkipped ? 'history-item-skipped' : 'history-item-completed'}`}
                key={item.logId || item.completedAt || item.skippedAt}
              >
                <div>
                  <span className="history-status">{isSkipped ? '已跳过' : '已完成'}</span>
                  <strong>{item.title}</strong>
                  <span>{item.date} · {item.category}</span>
                  {feeling && <em>{feeling}</em>}
                </div>
                <b>{isSkipped ? '0 EXP' : `+${item.exp}`}</b>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
