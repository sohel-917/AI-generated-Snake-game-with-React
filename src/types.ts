
export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}
