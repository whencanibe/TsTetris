import { ROWS, COLS, PIECE_TYPE_INDICES } from "./constants";
import { Block, PieceType, Position } from "./types";

export class Board{
    public grid: number[][] = [];

    constructor(){
        this.reset();
    }

    reset(): void{
        this.grid = [];
        for (let y = 0; y < ROWS; y++) {
            const row: number[] = [];
            for (let x = 0; x < COLS; x++) {
              row.push(0);
            }
            this.grid.push(row);
          }
    }

    isCollide(piece: Block, pos: Position): boolean {
        const shape = piece.shape;
      
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] === 0) continue;
      
            const blockX = pos.x + x;
            const blockY = pos.y + y;
      
            if (blockX >= COLS || blockX < 0) return true;
      
            if (blockY >= ROWS) return true;
      
            if (this.grid[blockY] && this.grid[blockY][blockX] !== 0) return true;
          }
        }
        return false;
    }

    merge(piece: Block, pos: Position, pieceType: PieceType) {
        const shape: number[][] = piece.shape;
        const index: number = PIECE_TYPE_INDICES[pieceType];
      
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if(shape[y][x] !== 0){
              this.grid[pos.y + y][pos.x + x] = index;
            }
          }
        }
      }
}