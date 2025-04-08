import { GameState } from "./types";
import { getNextPieceType, createPiece } from "./pieces";
import { COLS, ROWS, DROP_INTERVAL } from "./constants";
import { drawBoard, drawGrid, drawMatrix } from "./render";


export function makeNewBlock(gameState: GameState) : void {
    gameState.currentPieceType = getNextPieceType()
    gameState.currentPiece = createPiece(gameState.currentPieceType);
    gameState.position.x = Math.floor((COLS - gameState.currentPiece.shape[0].length) / 2);
    gameState.position.y = 2;
}

export function update(gameState: GameState, context: CanvasRenderingContext2D, time = 0): void {
    const deltaTime = time - gameState.lastTime;
    gameState.lastTime = time;
    gameState.dropCounter += deltaTime;

    if (gameState.dropCounter > DROP_INTERVAL) {
        gameState.position.y++;

        //충돌 시
        if (gameState.board.isCollide(gameState.currentPiece, gameState.position)) {
            gameState.position.y--;
            gameState.board.merge(gameState.currentPiece, gameState.position, gameState.currentPieceType);

            makeNewBlock(gameState);
        }
        gameState.dropCounter = 0;
        for (let row of gameState.board.grid) {
            console.log(row);
        }
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawBoard(context, gameState.board.grid);
    drawMatrix(context, gameState.currentPiece, gameState.position);
    drawGrid(context, COLS, ROWS);
    requestAnimationFrame((time) => update(gameState, context, time));
}