import * as THREE from 'three';
import { DEBUG } from '../const.js';

export function initLights(scene) {
    const color = 0xDDDDDD;
    const ambIntensity = 1;
    const ambLight = new THREE.AmbientLight(color, ambIntensity);
    scene.add(ambLight);

    const dirIntensity = 0.4;
    const dirLight = new THREE.DirectionalLight(color, dirIntensity);
    dirLight.position.set(15, 20, 40);
    dirLight.target.position.set(10, 20, 40);
    scene.add(dirLight);
    scene.add(dirLight.target);

    const shadowIntensity = 2
    const colorShadow = 0xFFFFFF
    const shadowLight = new THREE.DirectionalLight(colorShadow, shadowIntensity);
    shadowLight.castShadow = true;
    shadowLight.position.set(0, 20, 0);
    shadowLight.target.position.set(0, 0, 0);
    scene.add(shadowLight);
    scene.add(shadowLight.target);

    if (DEBUG) {
        const helper = new THREE.DirectionalLightHelper(dirLight);
        scene.add(helper);
        const helperShadow = new THREE.DirectionalLightHelper(shadowLight);
        scene.add(helperShadow);
    }
}