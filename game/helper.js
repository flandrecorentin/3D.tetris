import * as THREE from 'three';
import { HEIGHT, DEBUG, DOUBLE_PI } from '../const.js';

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

export function initArrowHelper(scene, positions, rotate = 0) {
    const triangle = new THREE.CircleGeometry(0.4, 1);
    const box = new THREE.BoxGeometry(0.6, 0, 0.2);
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const meshTriangle = new THREE.Mesh(triangle, material);
    meshTriangle.rotation.x -= DOUBLE_PI / 4;
    meshTriangle.position.x += 0.5;

    const meshBox = new THREE.Mesh(box, material);

    const groupTest = new THREE.Group();
    groupTest.add(meshTriangle);
    groupTest.add(meshBox);
    groupTest.position.set(positions.x, positions.y, positions.z);

    groupTest.rotation.y += rotate;

    scene.add(groupTest);
}