import * as THREE from 'three';
import { HEIGHT, DEBUG } from '../const.js';

const SIZE_AXES = 3

export function initRotateHelper(scene) {
    if (DEBUG) { console.log("Create rotate helper") }
    const axesHelper = new THREE.AxesHelper(SIZE_AXES);
    axesHelper.layers.enableAll();
    axesHelper.class = "helper-rotate";
    axesHelper.position.y = HEIGHT;
    scene.add(axesHelper);
}

export function updatePosition(helper, positions) {
    helper.position.set(positions[0], positions[1], positions[2]);
}

export function updateRotateHelperPosition(scene, positions) {
    let helper = scene.children.filter(obj => obj.class == "helper-rotate").shift();
    helper.position.set(positions.x, positions.y, positions.z);
}

export function toggleRotateHelperVisibility(scene, state) {
    let helper = scene.children.filter(obj => obj.class == "helper-rotate").shift();
    helper.visible = state;
}