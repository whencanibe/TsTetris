const canvas = document.getElementById('game') as HTMLCanvasElement;
const context = canvas.getContext('2d')!; // ! : means not null

const scale: number = 20;
const gCols = 10;
const gRows = 24;

canvas.width = gCols * scale;
canvas.height = gRows * scale;

context.scale(scale, scale); // 그리는 네모의 1단위가 20px

interface Block {
  shape: number[][];
  color: string;
}

type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

const allPieceTypes: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']; // 1,2,3,4,5,6,7 순서 - drawBoard 할때

let dropInterval = 500;        // 자동 낙하 속도 (0.5초)
let dropCounter = 0;           // 시간 누적용
let lastTime = 0;              // 이전 프레임 시간

const position = { x: 3, y: 2 };

let currentPiece: Block;
document.addEventListener('keydown', handleKey);

const board: number[][] = [];
for (let y = 0; y < gRows; y++) {
  const row: number[] = [];
  for (let x = 0; x < gCols; x++) {
    row.push(0);
  }
  board.push(row);
}


// 7-bag system
let bag: PieceType[] = [];
let currentPieceType: PieceType;
const blockColors = [
                      '#00FFFF',
                      '#FFFF00',
                      '#800080',
                      '#00FF00',
                      '#FF0000',
                      '#0000FF',
                      '#FFA500',
                    ]

function getNextPieceType(): PieceType {
  if (bag.length === 0) {
    bag = shuffle([...allPieceTypes]); // copy
    console.log('[7-Bag 섞음]:', bag);
  }
  return bag.pop()!;
}

//Fisher-Yates Shuffle
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

function createPiece(type: PieceType): Block {
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

  return {
    shape: shapes[type],
    color: colors[type],
  };
}

function drawBlock() {
  currentPieceType = getNextPieceType();
  const piece: Block = createPiece(currentPieceType);
  position.x = Math.floor((gCols - piece.shape.length) / 2);
  drawMatrix(piece, position);
}

function drawMatrix(block: Block, offset: { x: number, y: number }) {
  context.fillStyle = block.color;
  block.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function drawGrid(context: CanvasRenderingContext2D, cols: number, rows: number) {
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

function handleKey(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
      position.x--;
      break;
    case 'ArrowRight':
      position.x++;
      break;
    case 'ArrowDown':
      position.y++;
      if(isCollide(board, currentPiece, position)){
        position.y--;
        merge(board, currentPiece, position);
        makeNewBlock();
      }
      dropCounter = 0; // 수동 낙하 시 타이머 초기화
      break;
    case 'ArrowUp':
      // 회전 함수 호출!
      currentPiece.shape = rotateClockwise(currentPiece.shape);
      break;
  }
}

function rotateClockwise(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}
function makeNewBlock() {
  currentPiece = createPiece(getNextPieceType());
  position.x = Math.floor((gCols - currentPiece.shape[0].length) / 2);
  position.y = 2;
}

function isCollide(board: number[][], piece: Block, pos: { x: number, y: number }): boolean {
  const shape = piece.shape;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] === 0) continue;

      const blockX = pos.x + x;
      const blockY = pos.y + y;

      if (blockX >= gCols || blockX < 0) return true;

      if (blockY >= gRows) return true;

      if (board[blockY] && board[blockY][blockX] !== 0) return true;
    }
  }

  return false;
}

function getPieceTypeIndex(): number {

  switch (currentPieceType) {
    case 'I':
      return 1;
    case 'O':
      return 2;
    case 'T':
      return 3;
    case 'S':
      return 4;
    case 'Z':
      return 5;
    case 'J':
      return 6;
    case 'L':
      return 7;
  }
}

function merge(board: number[][], piece: Block, pos: { x: number, y: number }) {
  const shape: number[][] = piece.shape;
  const index: number = getPieceTypeIndex();

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if(shape[y][x] !== 0){
        board[pos.y + y][pos.x + x] = index;
      }
    }
  }
}

function drawBoard() {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if(board[y][x] !== 0){
        context.fillStyle = blockColors[board[y][x] - 1];
        context.fillRect(x, y, 1, 1);
      }
      
    }
  }
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    position.y++;

    if (isCollide(board, currentPiece, position)) {
      position.y--;
      merge(board, currentPiece, position);

      makeNewBlock();
    }
    dropCounter = 0;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawMatrix(currentPiece, position);
  drawGrid(context, gCols, gRows);
  requestAnimationFrame(update);
}

makeNewBlock();
update();
