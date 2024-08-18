import * as THREE from 'three';

import { COLORS } from '../const.js';

export const UNIT_SIZE = 1;
const cubeSize = 0.875;

export function init({ color = COLORS.green }) {
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const material = new THREE.MeshPhongMaterial({ color: color });

    return new THREE.Mesh(geometry, material);
}