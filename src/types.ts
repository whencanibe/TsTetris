import { Board } from "./board";

export interface Block {
    shape: number[][];
    color: string;
}

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
    x: number;
    y: number;
}

export interface GameState {
    board: Board;
    currentPiece: Block;
    currentPieceType: PieceType;
    position: Position;
    bag: PieceType[];
    dropCounter: number;
    lastTime: number;
}

