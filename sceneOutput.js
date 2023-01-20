import * as THREE from 'three'

import { outputShader } from './shaders/outputShader'

const shader = outputShader;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 10)

const mesh = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), shader);


scene.add(mesh);


document.addEventListener('mousemove', (evt) => {
    shader.uniforms['u_mouse'].value.x = evt.clientX;
    shader.uniforms['u_mouse'].value.y = innerHeight - evt.clientY;
});

/* detect resize */
window.addEventListener('resize', (evt) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

let uniforms = shader.uniforms;

export default {scene, camera, uniforms};