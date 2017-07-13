interface TwttrOptions {
  cards?: 'hidden';
  conversation?: 'none';
  theme?: 'light' | 'dark';
  linkColor?: string;
  width?: number; // 250 - 550
  align?: string;
  lang?: string;
  dnt?: boolean;
}

interface TwttrWidgets {
  createTweet: (idStr: string, target: HTMLElement, options: TwttrOptions) => Promise<HTMLElement>;
  [key:string]: any;
}

interface Twttr {
  init?: boolean;
  events?: any;
  ready?: (cb: ()=>void ) => void;
  widgets?: TwttrWidgets;
  _e?: (()=>void)[];
  [key: string]: any;
}

interface Window {
  twttr: Twttr;
}
