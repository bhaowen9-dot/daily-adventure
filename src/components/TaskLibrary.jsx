import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Gem, Heart, Swords } from 'lucide-react';
import { taskCategories } from '../data/tasks.js';

const collectionFilters = ['全部', '已完成', '已收藏'];

function getTaskState(task, player) {
  const completed = player.history?.some((item) => item.taskId === task.id && item.status === 'completed');
  const discovered = player.discoveredTaskIds?.includes(task.id) || completed;
  const favorited = player.favoriteTaskIds?.includes(task.id);

  if (completed) return { label: favorited ? '已完成 · 已收藏' : '已完成', tone: 'completed' };
  if (favorited) return { label: discovered ? '已抽到 · 已收藏' : '已收藏', tone: 'favorite' };
  if (discovered) return { label: '已抽到', tone: 'seen' };
  return { label: '未遇见', tone: 'unknown' };
}

export default function TaskLibrary({ tasks, player, onOpenDetail, onToggleFavorite }) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [collectionFilter, setCollectionFilter] = useState('全部');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const categoryMatched = activeCategory === '全部' || task.category === activeCategory;
      const completed = player.history?.some((item) => item.taskId === task.id && item.status === 'completed');
      const favorited = player.favoriteTaskIds?.includes(task.id);
      const collectionMatched =
        collectionFilter === '全部' ||
        (collectionFilter === '已完成' && completed) ||
        (collectionFilter === '已收藏' && favorited);

      return categoryMatched && collectionMatched;
    });
  }, [activeCategory, collectionFilter, player.favoriteTaskIds, player.history, tasks]);

  return (
    <section className="library-panel" aria-label="冒险图鉴">
      <div className="library-heading">
        <div className="section-title">
          <BookOpen size={20} />
          <h2>冒险图鉴</h2>
        </div>
        <span className="library-count">{filteredTasks.length} 个条目</span>
      </div>

      <div className="category-filter" aria-label="图鉴状态筛选">
        {collectionFilters.map((filter) => (
          <button
            key={filter}
            className={filter === collectionFilter ? 'filter-chip filter-chip-active' : 'filter-chip'}
            onClick={() => setCollectionFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="category-filter" aria-label="任务分类筛选">
        {taskCategories.map((category) => (
          <button
            key={category}
            className={category === activeCategory ? 'filter-chip filter-chip-active' : 'filter-chip'}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="library-grid">
        {filteredTasks.map((task) => {
          const favorited = player.favoriteTaskIds?.includes(task.id);
          const state = getTaskState(task, player);

          return (
            <article className={`library-card library-card-${state.tone}`} key={task.id}>
              <button className="library-open" onClick={() => onOpenDetail(task)} type="button">
                <div className="library-card-top">
                  <span className="task-category">{task.category}</span>
                  <span className={`collection-state collection-state-${state.tone}`}>
                    {state.label}
                  </span>
                </div>
                <h3>{task.title}</h3>
                <div className="library-meta">
                  <span>
                    <Swords size={14} />
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
              </button>

              <div className="library-card-footer">
                <div className="attribute-list">
                  {task.attributes.map((attribute) => (
                    <span className="attribute-chip" key={attribute.key || attribute.name}>
                      {attribute.name} +{attribute.value}
                    </span>
                  ))}
                </div>
                <button
                  className={`favorite-button ${favorited ? 'favorite-button-active' : ''}`}
                  onClick={() => onToggleFavorite(task.id)}
                  type="button"
                  aria-label={favorited ? '取消收藏' : '收藏任务'}
                >
                  {favorited ? <CheckCircle2 size={17} /> : <Heart size={17} />}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
