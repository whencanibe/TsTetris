const canvas = document.getElementById('game') as HTMLCanvasElement;
const context = canvas.getContext('2d')!; // ! : saying not null

const scale: number = 20;
const gCols = 10;
const gRows = 24;

canvas.width = gCols * scale;
canvas.height = gRows * scale;

context.scale(scale, scale); // 그리는 네모의 1단위가 20px

interface Block{
  shape: number[][];
  color: string;
}

type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

const pieceColors: Record<PieceType, string> = {
  I: '#00FFFF',
  O: '#FFFF00',
  T: '#800080',
  S: '#00FF00',
  Z: '#FF0000',
  J: '#0000FF',
  L: '#FFA500',
};

const allPieceTypes: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// 7-bag system
let bag: PieceType[] = [];

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

function createPiece(type: PieceType): Block{
  const shapes = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
  };

  return {
    shape: shapes[type],
    color: pieceColors[type],
  };
}

const position = { x: 3, y: 0 };

function drawBlock(){
  const nextPieceType : PieceType = getNextPieceType();
  const piece: Block = createPiece(nextPieceType);
  position.x = Math.floor((gCols - piece.shape.length) / 2);
  drawMatrix(piece, position);
}

function drawMatrix(block: Block, offset: { x: number, y: number }) {
  block.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = block.color;
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function drawGrid(context: CanvasRenderingContext2D, cols: number, rows: number) {
  context.strokeStyle = '#ccc'; // 선 색상 (연한 회색)
  context.lineWidth = 0.05;

  for (let i = 0 ; i <= cols ; i++){
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

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBlock();
  drawGrid(context, gCols, gRows);
  position.y++;
  setTimeout(update, 500);
}

update();
