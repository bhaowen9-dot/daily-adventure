import React from 'react';
import { Flame, Sparkles, Star } from 'lucide-react';
import {
  attributeMeta,
  getLevel,
  getLevelProgress,
  getLevelTitle,
} from '../utils/level.js';

export default function PlayerPanel({ player, expAnimationKey }) {
  const level = getLevel(player.exp);
  const progress = getLevelProgress(player.exp);
  const title = getLevelTitle(level);

  return (
    <section className="player-panel" aria-label="玩家状态">
      <div className="player-title">
        <div>
          <span className="eyebrow">冒险者档案</span>
          <h1>今日小冒险</h1>
        </div>
        <div className="level-badge">
          <Star size={18} />
          Lv.{level}
        </div>
      </div>
      <div className="title-badge">{title}</div>

      <div
        className="exp-bar exp-bar-boost"
        aria-label={`当前经验 ${progress}/100`}
        key={expAnimationKey}
      >
        <div className="exp-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="exp-row">
        <span>{player.exp} 总经验</span>
        <span>距下一级 {100 - progress} EXP</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Sparkles size={18} />
          <span>今日状态</span>
          <strong>{player.currentTask ? '已开盒' : '待开盒'}</strong>
        </div>
        <div className="stat-card">
          <Flame size={18} />
          <span>连续完成</span>
          <strong>{player.streak} 天</strong>
        </div>
      </div>

      <div className="attribute-board" aria-label="角色属性">
        {attributeMeta.map((attribute) => {
          const value = player.attributes?.[attribute.key] || 0;
          const width = `${Math.min(value * 8, 100)}%`;

          return (
            <div className="attribute-row" key={attribute.key}>
              <div className="attribute-label">
                <span>{attribute.label}</span>
                <strong>{value}</strong>
              </div>
              <div className="mini-attribute-bar">
                <div style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
