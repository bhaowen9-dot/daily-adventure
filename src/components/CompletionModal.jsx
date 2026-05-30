import React, { useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

const feelingTags = [
  '还不错',
  '有点尴尬',
  '意外开心',
  '没啥感觉',
  '下次还想做',
  '有点累但值得',
];

export default function CompletionModal({ result, onClose }) {
  const [feelingTag, setFeelingTag] = useState('');
  const [feelingNote, setFeelingNote] = useState('');

  if (!result) return null;

  function handleClose() {
    onClose({
      logId: result.logId,
      feelingTag,
      feelingNote: feelingNote.trim(),
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div className="result-icon">
          <Trophy size={34} />
        </div>
        <span className="eyebrow">冒险完成</span>
        <h2 id="result-title">{result.title}</h2>
        <p className="encouragement">{result.encouragement}</p>

        <div className="reward-panel">
          <div className="reward-exp">
            <Sparkles size={18} />
            <span>+{result.exp} EXP</span>
          </div>
          <div className="attribute-list">
            {result.attributes.map((attribute) => (
              <span className="attribute-chip" key={attribute.key || attribute.name}>
                {attribute.name} +{attribute.value}
              </span>
            ))}
          </div>
        </div>

        <div className="feeling-box">
          <label htmlFor="feeling-note">写一句完成后的感受</label>
          <div className="feeling-tags">
            {feelingTags.map((tag) => (
              <button
                className={tag === feelingTag ? 'feeling-tag feeling-tag-active' : 'feeling-tag'}
                key={tag}
                onClick={() => setFeelingTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
          <textarea
            id="feeling-note"
            value={feelingNote}
            onChange={(event) => setFeelingNote(event.target.value)}
            placeholder="比如：比想象中容易一点。"
            rows={3}
          />
        </div>

        <button className="modal-button" onClick={handleClose} type="button">
          收下奖励
        </button>
      </section>
    </div>
  );
}
