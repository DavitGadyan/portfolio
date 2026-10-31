import type { ReactNode } from 'react';

/** Phone screen recordings side by side: two across, four from the desktop breakpoint (see .vidgrid). */
export function VideoGrid({ children }: { children?: ReactNode }) {
  return <div className="vidgrid">{children}</div>;
}
