'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

/** A question already localised for the page; `answer` indexes `options`. */
export type QuestionView = { id: string; node: string; nodeTitle: string; group: string; q: string; code?: string; options: string[]; answer: number; why: string };
export type QuizStrings = {
  startIntro: string; start: string; restart: string; chipQuestions: string; chipTimer: string; chipGraded: string; progress: string; prev: string; next: string; finish: string;
  unanswered: string; allAnswered: string; navigator: string; goTo: string; scoreTitle: string; scoreLine: string; levelStrong: string; levelPass: string; levelPractise: string;
  review: string; hideReview: string; yourAnswer: string; correctAnswer: string; noAnswer: string; onMap: string; nojs: string;
};

const LETTERS = ['A', 'B', 'C', 'D'];
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => (v[k] !== undefined ? String(v[k]) : `{${k}}`));
function shuffle<T>(a: readonly T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
/** Backtick spans in a stem or option become <code>. */
function rich(s: string): ReactNode {
  const parts = s.split('`');
  return parts.length === 1 ? s : parts.map((p, i) => (i % 2 ? <code key={i}>{p}</code> : p));
}

/** One draw: the question and the on-screen order of its options (`order[j]` = index into `q.options` shown at position j). */
type Item = { q: QuestionView; order: number[] };

/**
 * Practice quiz: a start card, then `size` questions drawn at random from the bank (options shuffled too), one per
 * screen with a dot navigator, then the score as a ring with a per-question review. The draw happens on the start
 * click, so the server and the first client render agree; nothing is persisted. `onReview` opens a card on the map.
 */
export function Quiz({ questions, size, s, onReview }: { questions: QuestionView[]; size: number; s: QuizStrings; onReview?: (nodeId: string) => void }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [cur, setCur] = useState(0);
  const [done, setDone] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const n = Math.min(size, questions.length);

  const start = () => {
    const picked = shuffle(questions).slice(0, n).map((q) => ({ q, order: shuffle(q.options.map((_, i) => i)) }));
    setItems(picked); setAnswers(picked.map(() => null)); setCur(0); setDone(false); setReviewing(false);
  };
  const pick = (j: number) => setAnswers((prev) => prev.map((a, i) => (i === cur ? j : a)));
  const isRight = (it: Item, a: number | null) => a !== null && it.order[a] === it.q.answer;

  if (!items) {
    return (
      <div className="qz" data-phase="start">
        <div className="qz__start">
          <p>{s.startIntro}</p>
          <ul className="qz__facts" role="list">
            <li>{fill(s.chipQuestions, { n })}</li><li>{s.chipTimer}</li><li>{s.chipGraded}</li>
          </ul>
          <button type="button" className="btn btn-solid qz__cta" onClick={start}>{s.start}</button>
          <p className="qz__nojs">{s.nojs}</p>
        </div>
      </div>
    );
  }

  if (done) {
    const correct = items.filter((it, i) => isRight(it, answers[i])).length;
    const pct = Math.round((correct / n) * 100);
    const level = pct >= 85 ? 'strong' : pct >= 70 ? 'pass' : 'practise';
    return (
      <div className="qz" data-phase="done">
        <div className="qz__result">
          <p className="qz__eyebrow">{s.scoreTitle}</p>
          <div className="qz__ring" data-level={level} style={{ '--score': pct / 100 } as CSSProperties} role="img" aria-label={`${pct} %`}><strong>{pct}%</strong></div>
          <p className="qz__level">{level === 'strong' ? s.levelStrong : level === 'pass' ? s.levelPass : s.levelPractise}</p>
          <p className="qz__line">{fill(s.scoreLine, { correct, n })}</p>
          <div className="qz__actions">
            <button type="button" className="btn btn-solid" aria-expanded={reviewing} aria-controls="qz-review" onClick={() => setReviewing((r) => !r)}>{reviewing ? s.hideReview : s.review}</button>
            <button type="button" className="btn btn-outline-dark" onClick={start}><RotateCcw size={16} aria-hidden="true" />{fill(s.restart, { n })}</button>
          </div>
        </div>
        {reviewing && (
          <ol className="qz__review" id="qz-review">
            {items.map((it, i) => {
              const a = answers[i], ok = isRight(it, a), right = it.order.indexOf(it.q.answer);
              return (
                <li key={it.q.id} data-ok={ok}>
                  <p className="qz__rq">{rich(it.q.q)}</p>
                  {it.q.code && <pre className="qz__snippet"><code>{it.q.code}</code></pre>}
                  <dl className="qz__ra">
                    {!ok && <><dt>{s.yourAnswer}</dt><dd data-mark="wrong">{a === null ? s.noAnswer : <>{LETTERS[a]}. {rich(it.q.options[it.order[a]])}</>}</dd></>}
                    <dt>{s.correctAnswer}</dt><dd data-mark="right"><Check size={14} aria-hidden="true" /> {LETTERS[right]}. {rich(it.q.options[it.q.answer])}</dd>
                  </dl>
                  <p className="qz__why">{it.q.why}</p>
                  {onReview && <button type="button" className="qz__map" onClick={() => onReview(it.q.node)}>{s.onMap}: <span>{it.q.nodeTitle}</span> →</button>}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  }

  const it = items[cur];
  const answered = answers.filter((a) => a !== null).length;
  return (
    <div className="qz" data-phase="run">
      <div className="qz__head">
        <span aria-live="polite">{fill(s.progress, { i: cur + 1, n })}</span>
        <span className="qz__chip">{it.q.group} · {it.q.nodeTitle}</span>
      </div>
      <div className="qz__bar" aria-hidden="true"><i style={{ '--p': (cur + 1) / n } as CSSProperties} /></div>
      <div key={it.q.id} className="qz__body">
        <p className="qz__q" id="qz-q">{rich(it.q.q)}</p>
        {it.q.code && <pre className="qz__snippet"><code>{it.q.code}</code></pre>}
        <div className="qz__opts" role="radiogroup" aria-labelledby="qz-q">
          {it.order.map((oi, j) => (
            <label key={oi} className="qz__opt" data-checked={answers[cur] === j ? '' : undefined}>
              <input type="radio" name="qz" value={j} checked={answers[cur] === j} onChange={() => pick(j)} />
              <span className="qz__key" aria-hidden="true">{LETTERS[j]}</span>
              <span>{rich(it.q.options[oi])}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="qz__foot">
        <div className="qz__nav">
          <button type="button" className="btn btn-outline-dark btn-sm" disabled={cur === 0} onClick={() => setCur((c) => c - 1)}><ChevronLeft size={16} aria-hidden="true" />{s.prev}</button>
          <button type="button" className="btn btn-outline-dark btn-sm" disabled={cur === n - 1} onClick={() => setCur((c) => c + 1)}>{s.next}<ChevronRight size={16} aria-hidden="true" /></button>
        </div>
        <div className="qz__dots" role="group" aria-label={s.navigator}>
          {items.map((x, i) => (
            <button key={x.q.id} type="button" className="qz__dot" data-done={answers[i] !== null ? '' : undefined} aria-current={i === cur ? 'step' : undefined} aria-label={fill(s.goTo, { i: i + 1 })} onClick={() => setCur(i)} />
          ))}
        </div>
        <div className="qz__end">
          <span className="qz__status">{answered === n ? s.allAnswered : fill(s.unanswered, { n: n - answered })}</span>
          <button type="button" className="btn btn-solid btn-sm" onClick={() => setDone(true)}>{s.finish}</button>
        </div>
      </div>
    </div>
  );
}
