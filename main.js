import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { PI, DOUBLE_PI, DEBUG } from './const.js';
import * as CAMERA from './game/camera.js';
import * as BLOCK from './game/block.js';
import * as TETROMINO from './game/tetromino.js';
import * as TETRIS from './game/tetris.js';
import * as HELPER from './game/helper.js';
import * as LIGHT from './game/light.js';


let score = 0;

export function increaseScore(increment) {
    score += increment;
}

export function getScore() {
    return score;
}

let options = {
    displayRotateHelper: true,
};

function main() {

    let speed = 1.3;
    const speedCoeff = 0.997;
    let prevTime = 0;
    let tetris = new Map();
    document.getElementById('end').style.display = "none";

    TETRIS.initTetris(tetris);
    TETROMINO.init(TETROMINO.randomPiece());

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.shadowMap.enabled = true;

    const camera = CAMERA.init();
    camera.zoom = 2.5;
    camera.position.set(15, 20, 40);

    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040418);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
    addControls(scene)

    const gui = new GUI();
    gui.add(camera, 'fov', 25, 150).name("Zoom").onChange(updateCamera);
    gui.add(options, 'displayRotateHelper').name("Rotate Axes Helper Display").onChange(() => {
        HELPER.toggleRotateHelperVisibility(scene, options.displayRotateHelper)
    });

    HELPER.initGridHelper(scene);
    HELPER.initRotateHelper(scene);

    LIGHT.initLights(scene);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if (needResize) {
            renderer.setSize(width, height, false);
        }

        return needResize;
    }

    function render(time) {

        if (camera.position.y < 1) {
            camera.position.y = 1;
        }

        if (Math.abs(time - prevTime) > speed * 1000) {
            prevTime = time;
            speed *= speedCoeff;
            TETROMINO.play(tetris, scene);
        }

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        document.querySelector('#time').textContent = 'Time : ' + Math.round(time / 1000) + 's';
        document.querySelector('#score').textContent = 'Score : ' + score;
        document.querySelector('#speed').textContent = 'Speed : ' + parseFloat(speed.toFixed(2)) + " ticks/s";
        renderer.render(scene, camera);

        TETROMINO.draw(scene)
        requestAnimationFrame(render);
    }

    function addControls(scene) {
        const geometry = new THREE.BoxGeometry(1.7, 0.1, 1.7);
        const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const materialRotX = new THREE.MeshPhongMaterial({ color: 0xCC4400 });
        const materialRotY = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const materialRotZ = new THREE.MeshPhongMaterial({ color: 0x2222DD });

        let controlUp = new THREE.Mesh(geometry, material);
        controlUp.position.set(0, -BLOCK.UNIT_SIZE / 2, 5); // TOP = decrease z
        HELPER.initArrowHelper(scene, { 'x': 0, 'y': -BLOCK.UNIT_SIZE / 2 + 0.1, 'z': 5 + 0.25 }, DOUBLE_PI / 4);

        let controlDown = new THREE.Mesh(geometry, material);
        controlDown.position.set(0, -BLOCK.UNIT_SIZE / 2, 9); // DOWN = increase z
        HELPER.initArrowHelper(scene, { 'x': 0, 'y': -BLOCK.UNIT_SIZE / 2 + 0.1, 'z': 9 - 0.25 }, 3 * DOUBLE_PI / 4);

        let controlLeft = new THREE.Mesh(geometry, material);
        controlLeft.position.set(-2, -BLOCK.UNIT_SIZE / 2, 7); // LEFT = decrease x
        HELPER.initArrowHelper(scene, { 'x': -2 + 0.25, 'y': -BLOCK.UNIT_SIZE / 2 + 0.1, 'z': 7 }, 2 * DOUBLE_PI / 4);

        let controlRight = new THREE.Mesh(geometry, material);
        controlRight.position.set(2, -BLOCK.UNIT_SIZE / 2, 7); // RIGHT = increase x
        HELPER.initArrowHelper(scene, { 'x': 2 - 0.25, 'y': -BLOCK.UNIT_SIZE / 2 + 0.1, 'z': 7 });

        const cylinderGeometry = new THREE.CylinderGeometry(PI / 4, PI / 4, 0.3, 10);
        let controlGravity = new THREE.Mesh(cylinderGeometry, material);
        controlGravity.position.set(0, -BLOCK.UNIT_SIZE / 2, 7);

        scene.add(controlUp);
        scene.add(controlDown);
        scene.add(controlLeft);
        scene.add(controlRight);
        scene.add(controlGravity);

        let controlRotX = new THREE.Mesh(cylinderGeometry, materialRotX);
        controlRotX.position.set(6, -BLOCK.UNIT_SIZE / 2, 2.5);

        let controlRotY = new THREE.Mesh(cylinderGeometry, materialRotY);
        controlRotY.position.set(6, -BLOCK.UNIT_SIZE / 2, 0);

        let controlRotZ = new THREE.Mesh(cylinderGeometry, materialRotZ);
        controlRotZ.position.set(6, -BLOCK.UNIT_SIZE / 2, -2.5);

        scene.add(controlRotX);
        scene.add(controlRotY);
        scene.add(controlRotZ);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('click', () => {
            raycaster.setFromCamera(mouse, camera);

            const intersectsUp = raycaster.intersectObject(controlUp);
            const intersectsDown = raycaster.intersectObject(controlDown);
            const intersectsLeft = raycaster.intersectObject(controlLeft);
            const intersectsRight = raycaster.intersectObject(controlRight);
            const intersectsGravity = raycaster.intersectObject(controlGravity);

            const intersectsRotX = raycaster.intersectObject(controlRotX);
            const intersectsRotY = raycaster.intersectObject(controlRotY);
            const intersectsRotZ = raycaster.intersectObject(controlRotZ);

            if (intersectsUp.length > 0) {
                if (DEBUG) { console.log('controlUp clicked!') }
                TETROMINO.move('up', tetris, scene);
            } else if (intersectsDown.length > 0) {
                if (DEBUG) { console.log('controlDown clicked!') }
                TETROMINO.move('down', tetris, scene);
            } else if (intersectsLeft.length > 0) {
                if (DEBUG) { console.log('controlLeft clicked!') }
                TETROMINO.move('left', tetris, scene);
            } else if (intersectsRight.length > 0) {
                if (DEBUG) { console.log('controlRight clicked!') }
                TETROMINO.move('right', tetris, scene);
            } else if (intersectsGravity.length > 0) {
                if (DEBUG) { console.log('controlGravity clicked!') }
                TETROMINO.move('gravity', tetris, scene);
            } else if (intersectsRotX.length > 0) {
                if (DEBUG) { console.log('controlRotX clicked!') }
                TETROMINO.rotate('X', tetris);
            } else if (intersectsRotY.length > 0) {
                if (DEBUG) { console.log('controlRotY clicked!') }
                TETROMINO.rotate('Y', tetris);
            } else if (intersectsRotZ.length > 0) {
                if (DEBUG) { console.log('controlRotZ clicked!') }
                TETROMINO.rotate('Z', tetris);
            }
        });
    }

    requestAnimationFrame(render);
}

main();