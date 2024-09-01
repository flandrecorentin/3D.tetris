import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { PI, DOUBLE_PI, DEBUG, WIDTH } from './const.js';
import * as CAMERA from './game/camera.js';
import * as BLOCK from './game/block.js';
import * as TETROMINO from './game/tetromino.js';
import * as TETRIS from './game/tetris.js';

function main() {

    let score = 0;
    let speed = 1.3;
    const speedCoeff = 0.997;
    let prevTime = 0;
    let tetris = new Map();
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

    const gui = new GUI();
    gui.add(camera, 'fov', 25, 150).onChange(updateCamera);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040418);

    {

        const planeSize = 5;

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0xDDDDDD
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * - .5;
        mesh.position.y = mesh.position.y - BLOCK.UNIT_SIZE / 2;
        mesh.receiveShadow = true;
        scene.add(mesh);

        const gridHelper = new THREE.GridHelper(planeSize, planeSize, 0x333333, 0x333333);
        gridHelper.position.y -= BLOCK.UNIT_SIZE / 2;
        scene.add(gridHelper);
    }

    {
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

    {
        addControls(scene)
    }

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

    function applyGravity() {
        TETROMINO.play(tetris, scene)
    }

    function render(time) {

        if (camera.position.y < 1) {
            camera.position.y = 1
        }

        if (Math.abs(time - prevTime) > speed*1000) {
            prevTime = time;
            speed *= speedCoeff;
            applyGravity();
        }

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        document.querySelector('#time').textContent = 'Time : ' + Math.round(time / 1000) + 's';
        document.querySelector('#score').textContent = 'Score : ' + score; // TODO : Make the score working
        document.querySelector('#speed').textContent = 'Speed : ' + parseFloat(speed.toFixed(2)) + " ticks/s"; // TODO : Make the speed as expected
        renderer.render(scene, camera);

        TETROMINO.draw(scene)
        requestAnimationFrame(render);
    }

    function addControls(scene) {
        const geometry = new THREE.BoxGeometry(1.7, 0.1, 1.7);
        const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

        let controlUp = new THREE.Mesh(geometry, material);
        controlUp.position.set(0, -BLOCK.UNIT_SIZE / 2, 5); // TOP = decrease z

        let controlDown = new THREE.Mesh(geometry, material);
        controlDown.position.set(0, -BLOCK.UNIT_SIZE / 2, 9); // DOWN = increase z

        let controlLeft = new THREE.Mesh(geometry, material);
        controlLeft.position.set(-2, -BLOCK.UNIT_SIZE / 2, 7); // LEFT = decrease x

        let controlRight = new THREE.Mesh(geometry, material);
        controlRight.position.set(2, -BLOCK.UNIT_SIZE / 2, 7); // RIGHT = increase x

        const cylinderGeometry = new THREE.CylinderGeometry(PI / 4, PI / 4, 0.3, 10);
        let controlGravity = new THREE.Mesh(cylinderGeometry, material);
        controlGravity.position.set(0, -BLOCK.UNIT_SIZE / 2, 7);

        // TODO : Arrows on controls
        scene.add(controlUp);
        scene.add(controlDown);
        scene.add(controlLeft);
        scene.add(controlRight);
        scene.add(controlGravity);

        let controlRotX = new THREE.Mesh(cylinderGeometry, material);
        controlRotX.position.set(6, -BLOCK.UNIT_SIZE / 2, 2.5);

        let controlRotY = new THREE.Mesh(cylinderGeometry, material);
        controlRotY.position.set(6, -BLOCK.UNIT_SIZE / 2, 0);

        let controlRotZ = new THREE.Mesh(cylinderGeometry, material);
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