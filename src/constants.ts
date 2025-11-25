import { PieceType } from "./types";

export const SCALE: number = 20;
export const COLS = 10;
export const ROWS = 24;
export const DROP_INTERVAL = 500; // ms
export const GAME_OVER_LINE = 4;
export const ALL_PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']; // 1,2,3,4,5,6,7 순서 - drawBoard 할때

export const BLOCK_COLORS = [
    '#00FFFF',
    '#FFFF00',
    '#800080',
    '#00FF00',
    '#FF0000',
    '#0000FF',
    '#FFA500',
]

export const PIECE_TYPE_INDICES: Record<PieceType, number> = {
    'I': 1,
    'O': 2,
    'T': 3,
    'S': 4,
    'Z': 5,
    'J': 6,
    'L': 7
};
