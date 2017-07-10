export interface Offset {
  years: number;
  text: string;
}

export enum DefaultOffsetKey { NONE, YEARS_8, YEARS_4, YEARS_1 }

export const DefaultOrderedOffsetKeys = [
  DefaultOffsetKey.YEARS_8,
  DefaultOffsetKey.YEARS_4,
  DefaultOffsetKey.YEARS_1,
  DefaultOffsetKey.NONE,
];

export const DefaultOffsets: {[key: number]: Offset} = {
  [DefaultOffsetKey.NONE]: {years: 0, text: "No offset"},
  [DefaultOffsetKey.YEARS_1]: {years: 1, text: "1 year"},
  [DefaultOffsetKey.YEARS_4]: {years: 4, text: "4 years"},
  [DefaultOffsetKey.YEARS_8]: {years: 8, text: "8 years"},
}
