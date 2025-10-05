export interface Planet {
  key: string;
  ad: string;
  ozellik: string;
  bilgi: string;
  resim: string;
}

export interface CardData {
  type: 'ad' | 'ozellik';
  value: string;
  matchKey: string;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface LevelData {
  terrain: Vector2D[];
  gems: Vector2D[];
  meteorFrequency: number; // 0 (none) to 1 (constant)
}

export enum GameStage {
  START_SCREEN,
  SPLASH,
  MAIN_MENU,
  PLANET_TOUR,
  MATCH_GAME,
  CONSTELLATION_INTRO,
  CONSTELLATION_STAR_INFO,
  CONSTELLATION_PUZZLE,
  ASTEROID_DODGE,
  MARS_ROVER,
  END_SCREEN,
}

export interface Star {
  id: number;
  name: string;
  info: string;
}

export interface DropZone {
  id: number;
  position: { top: string; left: string };
  filledBy: number | null;
}