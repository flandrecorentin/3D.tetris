export const PI = 3.141592;
export const DOUBLE_PI = PI * 2;
export const HEIGHT = 15;
export const WIDTH = 5;
export const DEBUG = false;

export const TETROMINOS = {
    'O': {
        'color': 'yellow',
        'blocks': [
            [0, 0, 0],
            [0, 0, 1],
            [1, 0, 0],
            [1, 0, 1],
        ],
        'minX': -2,
        'maxX': 1,
        'minZ': -2,
        'maxZ': 1,
        'pivot': 0,
    },
    'I': {
        'color': 'lightblue',
        'blocks': [
            [0, 0, 0],
            [0, 0, -1],
            [0, 0, 1],
            [0, 0, 2],
        ],
        'minX': -2,
        'maxX': 2,
        'minZ': -1,
        'maxZ': 0,
        'pivot': 0,
    },
    'L': {
        'color': 'orange',
        'blocks': [
            [0, 0, 0],
            [0, 0, -1],
            [1, 0, -1],
            [0, 0, 1],
        ],
        'minX': -2,
        'maxX': 1,
        'minZ': -1,
        'maxZ': 1,
        'pivot': 0,
    },
    'J': {
        'color': 'pink',
        'blocks': [
            [0, 0, 0],
            [-1, 0, -1],
            [0, 0, -1],
            [0, 0, 1],
        ],
        'minX': -1,
        'maxX': 2,
        'minZ': -1,
        'maxZ': 1,
        'pivot': 0,
    },
    'T': {
        'color': 'purple',
        'blocks': [
            [0, 0, 0],
            [-1, 0, 0],
            [1, 0, 0],
            [0, 0, -1],
        ],
        'minX': -1,
        'maxX': 1,
        'minZ': -1,
        'maxZ': 2,
        'pivot': 0,
    },
    'S': {
        'color': 'red',
        'blocks': [
            [0, 0, 0],
            [-1, 0, 0],
            [0, 0, 1],
            [1, 0, 1],
        ],
        'minX': -1,
        'maxX': 1,
        'minZ': -2,
        'maxZ': 1,
        'pivot': 0,
    },
    'Z': {
        'color': 'green',
        'blocks': [
            [0, 0, 0],
            [-1, 0, 0],
            [0, 0, -1],
            [1, 0, -1],
        ],
        'minX': -1,
        'maxX': 1,
        'minZ': -1,
        'maxZ': 2,
        'pivot': 0,
    },
};

export const TETROMINOS_MAPPING = new Map();
let letters = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];

for (let index = 0; index < letters.length; index++) {
    TETROMINOS_MAPPING.set(index, letters[index]);
}

export const COLORS = {
    'red': 0xEB0045,
    'orange': 0xFF8300,
    'yellow': 0xFDDA1D,
    'lightblue': 0x21CDFF,
    'pink': 0xFFC0CB,
    'green': 0x3CC631,
    'purple': 0xB231F0,
};