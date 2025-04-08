  import { Board } from "./board";
  import { COLS, ROWS, SCALE } from "./constants";
  import { makeNewBlock, update } from "./game";
  import { setupInputHandlers } from "./input";
  import { GameState } from "./types";

  export function init(): void {
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const context = canvas.getContext('2d')!; // ! : means not null

    canvas.width = COLS * SCALE;
    canvas.height = ROWS * SCALE;

    context.scale(SCALE, SCALE); // 그리는 네모의 1단위가 20px

    const gameState: GameState = {
      board: new Board(),
      currentPiece: undefined!,
      currentPieceType: undefined!,
      position: {x: 3, y:2},
      bag: [],
      dropCounter: 0,
      lastTime: 0
    }
    makeNewBlock(gameState);
    setupInputHandlers(gameState);
    update(gameState, context);
  }

  window.addEventListener('DOMContentLoaded', init);
