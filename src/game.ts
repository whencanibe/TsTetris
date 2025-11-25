import {GameState} from "./types";
import {getNextPieceType, createPiece} from "./pieces";
import {COLS, ROWS, DROP_INTERVAL, GAME_OVER_LINE} from "./constants";
import {drawBoard, drawGrid, drawMatrix} from "./render";


export function makeNewBlock(gameState: GameState): void {
    gameState.currentPieceType = getNextPieceType(gameState);
    gameState.currentPiece = createPiece(gameState.currentPieceType);
    gameState.position.x = Math.floor((COLS - gameState.currentPiece.shape[0].length) / 2);
    gameState.position.y = 2;
}

export function checkNewScore(gameState: GameState): void{
    const grid = gameState.board.grid;
    const rowCount = grid.length;

    let flag = false;
    for (let i = GAME_OVER_LINE; i < rowCount; i++) {
        for (let j = 0 ; j < grid[0].length ; j++) {
            if (grid[i][j] === 0) {
                flag = true;
            }
        }
        if (!flag) {
            grid.splice(i, 1);
            const emptyRow = [];
            for (let j = 0 ; j < grid[0].length ; j++) {
                emptyRow.push(0);
            }
            grid.unshift(emptyRow);
        } else {
            flag = false;
        }
    }
}

export function isGameOver(gameState: GameState): boolean {
    const grid = gameState.board.grid;
    for (let i = 0; i < GAME_OVER_LINE; i += 1) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 1) {
                const resultElement = document.querySelector(".game-result") as HTMLElement;

                if (resultElement) {
                    resultElement.style.display = "block";
                }
                return true;
            }
        }
    }

    return false;
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

            checkNewScore(gameState);
            if (isGameOver(gameState)) {
                return;
            }
            makeNewBlock(gameState);
        }
        gameState.dropCounter = 0;
        //DEBUG
        // for (let row of gameState.board.grid) {
        //     console.log(row);
        // }
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawBoard(context, gameState.board.grid);
    drawMatrix(context, gameState.currentPiece, gameState.position);
    drawGrid(context, COLS, ROWS);
    requestAnimationFrame((time) => update(gameState, context, time));
}