import { TETROMINOS, TETROMINOS_MAPPING, HEIGHT, WIDTH, DEBUG } from '../const.js';
import * as BLOCK from './block.js';
import * as TETRIS from './tetris.js';

let blocks = [];
let x = 0;
let y = 0;
let z = 0;
let color = 0;
let pivot = 0;
let letterPiece = 'X';
let nextLetterPiece = 'X';
let drawnBlocks = [];
let drawnNextBlocks = [];

export function init(letter) {
    blocks = [];
    x = 0;
    y = 0;
    z = 0;
    color = 0;
    drawnBlocks = [];
    drawnNextBlocks = [];

    letterPiece = letter;
    nextLetterPiece = randomPiece();
    const ref = Object.assign({}, TETROMINOS[letter]);
    ref.blocks.forEach(function (refBlock) {
        blocks.push([refBlock[0], refBlock[1], refBlock[2]]);
    })

    x = Math.floor(Math.random() * (ref.maxX - ref.minX + 1)) + ref.minX;
    y = HEIGHT;
    z = Math.floor(Math.random() * (ref.maxZ - ref.minZ + 1)) + ref.minZ;
    color = ref.color;
    pivot = ref.pivot;

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
        drawnBlock.class = "block";
        scene.add(drawnBlock);
    })

    drawNext(scene);
}

function drawNext(scene) {
    const nextRef = Object.assign({}, TETROMINOS[nextLetterPiece]);

    const drawnNextBlocksToDelete = scene.children.filter(obj => obj.class == "next-block");
    drawnNextBlocksToDelete.forEach(function (drawnNextBlockToDelete) {
        scene.remove(drawnNextBlockToDelete);
    })

    nextRef.blocks.forEach(function (block) {
        let drawnBlock = BLOCK.init({ color: nextRef.color });
        drawnBlock.class = "next-block";
        drawnBlock.position.set(6 + block[0], -BLOCK.UNIT_SIZE / 2, 7 + block[2]);
        drawnBlock.scale.y = 0.1;

        drawnNextBlocks.push(drawnBlock);
    })

    drawnNextBlocks.forEach(function (drawnNextBlock) {
        scene.add(drawnNextBlock);
    })
}

export function play(tetris, scene) {
    if (DEBUG) { blocks[0][1] }

    // Impossible to apply gravity
    let end = false;
    let next = true;
    blocks.forEach(function (block) {
        let transfo = TETRIS.transform(block[0], block[1] - 1, block[2])
        if (tetris.get(transfo) != undefined) {
            if (block[1] == HEIGHT) {
                end = true;
            }
            else {
                next = false;
            }
        }
    })
    if (end) { endGame() }
    else if (!next) {
        addTetrominoTo(tetris);
        updateLevels(tetris, scene);
        changeTetromino(tetris);
    }
    else { applyGravity() }

}

function addTetrominoTo(tetris) {
    let index = 0;
    blocks.forEach(function (block) {
        tetris.set(TETRIS.transform2(block), color);
        index++;
    })
}

function updateLevels(tetris, scene) {
    let levelsConcerned = []
    blocks.forEach(function (block) {
        if (!levelsConcerned.includes(block[1])) { levelsConcerned.push(block[1]) }
    })

    let levelsToDelete = []
    const min = Math.floor(- WIDTH / 2 + 0.5);
    const max = Math.floor(WIDTH / 2 + 0.5);
    levelsConcerned.forEach(function (level) {
        let validity = true;
        for (let x = min; x < max; x++) {
            for (let z = min; z < max; z++) {
                const transfo = TETRIS.transform(x, level, z)
                if (!tetris.has(transfo)) {
                    validity = false;
                    break;
                }
            }
        }
        if (validity) { levelsToDelete.push(level) }
    })

    if (DEBUG && levelsToDelete.length != 0) console.log("Levels to delete: " + levelsToDelete)


    levelsToDelete.forEach(function (level) {
        for (let x = min; x < max; x++) {
            for (let z = min; z < max; z++) {
                tetris.delete(TETRIS.transform(x, level, z))
            }
        }

        const drawnBlocksToDelete = scene.children.filter(obj => obj.class == "block"
            && obj.position.y == level);
        drawnBlocksToDelete.forEach(function (drawnBlockToDelete) {
            scene.remove(drawnBlockToDelete)
        })


        const firstIndexNextLevel = TETRIS.getFirstIndexNextLevel(level);

        let keyBlocksToDown = []
        for (const key of tetris.keys()) {
            if (key >= firstIndexNextLevel) {
                keyBlocksToDown.push(key);
            }
        }

        keyBlocksToDown.forEach(function (key) {
            tetris.set(key - WIDTH * WIDTH, tetris.get(key));
            tetris.delete(key);
        })

        const drawnBlocksToDown = scene.children.filter(obj => obj.class == "block"
            && obj.position.y > level);
        drawnBlocksToDown.forEach(function (drawnBlockToDown) {
            drawnBlockToDown.position.y = drawnBlockToDown.position.y - 1
        })
    })

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
    const letter = nextLetterPiece;
    if (DEBUG) { console.log("change Tetromino: " + letter) }
    init(letter);
}

// TODO : making end game works
function endGame() {
    if (DEBUG) { console.log("End") }

    console.log("End game");
}

export function randomPiece() {
    const random = Math.floor(Math.random() * (TETROMINOS_MAPPING.size));
    return TETROMINOS_MAPPING.get(random);
}

export function move(direction, tetris, scene) {
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
            play(tetris, scene);
            play(tetris, scene);
            break;
        default:
            console.log("Non-existent direction");
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

// Rotate operation implies to precises the pivot index block in TETROMINOS (const.js)
export function rotate(direction, tetris) {
    if (DEBUG) { console.log("rotate on " + direction + " with pivot " + pivot) }

    let blocksRotated = []
    blocks.forEach(function (block) {
        blocksRotated.push([block[0], block[1], block[2]]);
    })

    let validity = true
    for (let index = 0; index < blocks.length; index++) {
        if (index == pivot) { continue }
        else {
            switch (direction) {
                case 'X':
                    blocksRotated[index][1] = (blocks[index][2] - blocks[pivot][2]) + blocks[pivot][1]
                    blocksRotated[index][2] = - (blocks[index][1] - blocks[pivot][1]) + blocks[pivot][2]
                    break;
                case 'Y':
                    blocksRotated[index][0] = - (blocks[index][2] - blocks[pivot][2]) + blocks[pivot][0]
                    blocksRotated[index][2] = (blocks[index][0] - blocks[pivot][0]) + blocks[pivot][2]
                    break;
                case 'Z':
                    blocksRotated[index][0] = (blocks[index][1] - blocks[pivot][1]) + blocks[pivot][0]
                    blocksRotated[index][1] = - (blocks[index][0] - blocks[pivot][0]) + blocks[pivot][1]
                    break;
                default:
                    console.log("Non-existent rotation")
            }

            if (tetris.get(blocksRotated[index]) != undefined
                || blocksRotated[index][0] > 2
                || blocksRotated[index][0] < -2
                || blocksRotated[index][2] > 2
                || blocksRotated[index][2] < -2
                || blocksRotated[index][1] < 0) {
                validity = false;
            }
        }
    }

    if (validity) {
        let index = 0;
        blocks.forEach(function (block) {
            blocks[index][0] = blocksRotated[index][0]
            blocks[index][1] = blocksRotated[index][1]
            blocks[index][2] = blocksRotated[index][2]

            drawnBlocks[index].position.x = block[0];
            drawnBlocks[index].position.y = block[1];
            drawnBlocks[index].position.z = block[2];
            index++;
        })
    }
}