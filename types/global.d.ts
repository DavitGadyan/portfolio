export {};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    Calendly?: {
      initInlineWidget(opts: { url: string; parentElement: HTMLElement; resize?: boolean; prefill?: object; utm?: object }): void;
    };
  }
}
