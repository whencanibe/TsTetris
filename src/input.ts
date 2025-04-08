import { GameState } from "./types";
import { makeNewBlock } from "./game";
import { rotateClockwise } from "./pieces";

export function setupInputHandlers(gameState: GameState): void {
    document.addEventListener('keydown', (event) => handleKey(event,gameState));
}

function handleKey(event: KeyboardEvent, gameState: GameState): void {
    switch (event.key) {
        case 'ArrowLeft':
            gameState.position.x--;
            if (gameState.board.isCollide(gameState.currentPiece, gameState.position)) {
                gameState.position.x++;
            }
            break;
        case 'ArrowRight':
            gameState.position.x++;
            if (gameState.board.isCollide(gameState.currentPiece, gameState.position)) {
                gameState.position.x--;
            }
            break;
        case 'ArrowDown':
            gameState.position.y++;
            if (gameState.board.isCollide(gameState.currentPiece, gameState.position)) {
                gameState.position.y--;
                gameState.board.merge(gameState.currentPiece, gameState.position, gameState.currentPieceType);
                makeNewBlock(gameState);
            }
            gameState.dropCounter = 0; // 수동 낙하 시 타이머 초기화
            break;
        case 'ArrowUp':
            gameState.currentPiece.shape = rotateClockwise(gameState.currentPiece.shape);
            // 회전 후 충돌 검사 및 조정 로직이 추가 예정
            break;
    }
}