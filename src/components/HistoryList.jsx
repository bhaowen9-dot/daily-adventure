import React from 'react';
import { ScrollText } from 'lucide-react';

export default function HistoryList({ history }) {
  return (
    <section className="history-panel" aria-label="历史任务">
      <div className="section-title">
        <ScrollText size={19} />
        <h2>冒险日志</h2>
      </div>

      {history.length === 0 ? (
        <p className="history-empty">完成第一件小冒险后，这里会留下闪闪发亮的记录。</p>
      ) : (
        <div className="history-list">
          {history.slice(0, 6).map((item) => (
            <article className="history-item" key={item.completedAt}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.date} · {item.category}</span>
              </div>
              <b>+{item.exp}</b>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
