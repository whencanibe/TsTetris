import {PieceType, Block, GameState} from "./types";
import {ALL_PIECE_TYPES} from "./constants";

const shapes: Record<PieceType, number[][]> = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
};

const colors: Record<PieceType, string> = {
    I: '#00FFFF',
    O: '#FFFF00',
    T: '#800080',
    S: '#00FF00',
    Z: '#FF0000',
    J: '#0000FF',
    L: '#FFA500',
};

export function createPiece(type: PieceType): Block {

    return {
        shape: shapes[type],
        color: colors[type],
    };
}

export function rotateClockwise(shape: number[][]): number[][] {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated: number[][] = [];

    // 새 배열은 cols x rows 크기
    for (let col = 0; col < cols; col++) {
        const newRow: number[] = [];
        for (let row = rows - 1; row >= 0; row--) {
            newRow.push(shape[row][col]);
        }
        rotated.push(newRow);
    }

    return rotated;
}

export function getNextPieceType(gameState: GameState): PieceType {
    if (gameState.bag.length === 0) {
        gameState.bag = shuffle([...ALL_PIECE_TYPES]); // copy
        console.log('[7-Bag 섞음]:', gameState.bag);
    }
    return gameState.bag.pop()!;
}

//Fisher-Yates Shuffle
function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // swap
    }
    return array;
}
