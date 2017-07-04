interface TwttrWidgets {
  createTweet: (idStr: string, target: HTMLElement, options: any) => Promise<HTMLElement>;
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

interface Window { twttr: Twttr }
