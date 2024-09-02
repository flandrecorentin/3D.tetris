import * as THREE from 'three';

const fov = 70;
const aspect = 2; // default value
const near = 0.1;
const far = 1000;

export function init() {
    return new THREE.PerspectiveCamera( fov, aspect, near, far );
}