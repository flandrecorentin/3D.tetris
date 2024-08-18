import { TETROMINOS, TETROMINOS_MAPPING, HEIGHT, DEBUG } from '../const.js';
import * as BLOCK from './block.js';
import * as TETRIS from './tetris.js';

let blocks = [];
let x = 0;
let y = 0;
let z = 0;
let color = 0;
let drawnBlocks = [];

export function init(letter) {
    blocks = [];
    x = 0;
    y = 0;
    z = 0;
    color = 0;
    drawnBlocks = [];

    const ref = Object.assign({}, TETROMINOS[letter]);
    ref.blocks.forEach(function (refBlock) {
        blocks.push([refBlock[0], refBlock[1], refBlock[2]]);
    })

    x = Math.floor(Math.random() * (ref.maxX - ref.minX + 1)) + ref.minX;
    y = HEIGHT;
    z = Math.floor(Math.random() * (ref.maxZ - ref.minZ + 1)) + ref.minZ;
    color = ref.color;

    blocks.forEach(function (block) {
        block[0] += x;
        block[1] += y;
        block[2] += z;
    })

    blocks.forEach(function (block) {
        let drawnBlock = BLOCK.init({ color: color });

        drawnBlock.castShadow = true;
        drawnBlock.receiveShadow = true;

        drawnBlock.position.set(block[0], block[1], block[2]);
        drawnBlocks.push(drawnBlock);
    })
}

export function draw(scene) {
    if (DEBUG) { console.log(blocks) }
    drawnBlocks.forEach(function (drawnBlock) {
        scene.add(drawnBlock);
    })
}

export function play(tetris) {
    if (DEBUG) { blocks[0][1] }

    // if we can't apply or on the ground
    blocks.forEach(function (block) {
        let transfo = TETRIS.transform(block[0], block[1] - 1, block[2])

        if (tetris.get(transfo) != undefined) {
            if (block[1] == HEIGHT) {
                endGame();
            }
            else {
                changeTetromino(tetris);
            }
            return;
        }
    })

    applyGravity();
}

function applyGravity() {
    let index = 0;
    blocks.forEach(function (block) {
        block[1]--;
        drawnBlocks[index].position.y = block[1];
        index++;
    })
}

function changeTetromino(tetris) {
    const letter = randomPiece();
    if (DEBUG) { console.log("change Tetromino: " + letter) }

    blocks.forEach(function (block) {
        tetris.set(TETRIS.transform2(block), color);
    })

    init(letter);
}

// TODO : making end game works
function endGame() {
    if (DEBUG) { console.log("End") }

    console.log("End game");
}

function randomPiece() {
    const random = Math.floor(Math.random() * (TETROMINOS_MAPPING.size));
    return TETROMINOS_MAPPING.get(random);
}

export function move(direction, tetris) {
    let incrementTransform = 0;
    let incrementX = 0;
    let incrementZ = 0;
    switch (direction) {
        case 'up':
            incrementZ = -1;
            incrementTransform = -1;
            break;
        case 'down':
            incrementZ = +1;
            incrementTransform = +1;
            break;
        case 'left':
            incrementX = -1;
            incrementTransform = -5;
            break;
        case 'right':
            incrementX = +1;
            incrementTransform = +5;
            break;
        case 'gravity':
            play(tetris);
            play(tetris);
            break;
        default:
            console.log("Invalid direction");
    }

    let validity = true
    blocks.forEach(function (block) {
        const currIncrement = TETRIS.transform2(block)
        if (tetris.get(currIncrement + incrementTransform) != undefined
            || block[0] + incrementX > 2
            || block[0] + incrementX < -2
            || block[2] + incrementZ > 2
            || block[2] + incrementZ < -2) {
            validity = false;
        }
    })

    if (!validity) return;

    let index = 0;
    blocks.forEach(function (block) {
        block[0] += incrementX;
        block[2] += incrementZ;
        drawnBlocks[index].position.x = block[0];
        drawnBlocks[index].position.z = block[2];
        index++;
    })
}