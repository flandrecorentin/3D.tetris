import { WIDTH } from '../const.js';

export function initTetris(tetris) {
    for (let i = -2; i < 3; i++) {
        for (let j = -2; j < 3; j++) {
            tetris.set(transform(i, -1, j), undefined);
        }
    }
}

export function transform(x, y, z) {
    return y * WIDTH * WIDTH + x * WIDTH + z;
}

export function transform2(array) {
    return array[1] * WIDTH * WIDTH + array[0] * WIDTH + array[2];
}

export function getFirstIndexNextLevel(level) {
    return level * WIDTH * WIDTH + WIDTH * Math.floor(WIDTH / 2) + Math.floor(WIDTH / 2) + 1;
}