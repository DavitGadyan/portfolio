'use client';
import { useEffect, useRef, useState } from 'react';

type Props = { words: string[]; className?: string };

const TYPE_MS = 62;
const TYPE_JITTER_MS = 55;
const DELETE_MS = 34;
const HOLD_MS = 1900;
const BEFORE_NEXT_MS = 420;

/**
 * Typewriter headline: the first word is server-rendered, so there is no flash before hydration.
 * Typing starts once the page is idle (or after 5 s) so it never competes with the LCP image,
 * pauses while the hero is scrolled out of view, and is skipped entirely under reduced motion.
 */
export function Typewriter({ words, className }: Props) {
  const [state, setState] = useState({ text: words[0] ?? '', typing: false });
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || words.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let wordIndex = 0;
    let length = words[0].length;
    let deleting = false;
    let timer = 0;
    let started = false;
    let visible = true;
    let stopped = false;

    const step = () => {
      timer = 0;
      if (stopped || !visible) return;
      const word = words[wordIndex];
      let delay: number;
      let typing = true;
      if (!deleting) {
        if (length < word.length) {
          length += 1;
          delay = TYPE_MS + Math.random() * TYPE_JITTER_MS;
        } else {
          deleting = true;
          typing = false;
          delay = HOLD_MS;
        }
      } else if (length > 0) {
        length -= 1;
        delay = DELETE_MS;
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = BEFORE_NEXT_MS;
      }
      setState({ text: words[wordIndex].slice(0, length), typing });
      timer = window.setTimeout(step, delay);
    };

    const schedule = () => { if (started && visible && !stopped && !timer) timer = window.setTimeout(step, HOLD_MS); };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else if (timer) { clearTimeout(timer); timer = 0; }
    });
    io.observe(root);

    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (n: number) => void };
    const go = () => { if (started) return; started = true; schedule(); };
    const fallback = window.setTimeout(go, 5000);
    const idle = w.requestIdleCallback ? w.requestIdleCallback(() => setTimeout(go, 1500), { timeout: 5000 }) : 0;

    return () => {
      stopped = true;
      clearTimeout(timer);
      clearTimeout(fallback);
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
      io.disconnect();
    };
  }, [words]);

  return (
    <span ref={rootRef} className={className ? `tw ${className}` : 'tw'} data-typing={state.typing ? '' : undefined}>
      {state.text}
      <span className="tw__cursor" aria-hidden="true" />
    </span>
  );
}
