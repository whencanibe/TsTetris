import { Block, Position } from "./types";
import { BLOCK_COLORS, COLS } from "./constants";

export function drawBoard(context: CanvasRenderingContext2D,board: number[][]): void {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        if(board[y][x] !== 0){
          context.fillStyle = BLOCK_COLORS[board[y][x] - 1];
          context.fillRect(x, y, 1, 1);
        }
      }
    }
  }

export function drawMatrix(context: CanvasRenderingContext2D ,block: Block, offset: Position) {
    context.fillStyle = block.color;
    block.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

export function drawGrid(context: CanvasRenderingContext2D, cols: number, rows: number) {
    context.strokeStyle = '#ccc'; // 선 색상 (연한 회색)
    context.lineWidth = 0.05;

    for (let i = 0; i <= cols; i++) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, rows);
        context.stroke();
    }

    for (let y = 0; y <= rows; y++) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(cols, y);
        context.stroke();
    }

    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(0, 4);
    context.lineTo(cols, 4);
    context.stroke();
}
