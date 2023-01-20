import * as THREE from 'three'

import {backgroundShader} from "./shaders/backgroundShader";

const scene = new THREE.Scene()

const shader = backgroundShader;

let uniforms = shader.uniforms;

console.log(shader);

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 0;

// lumière
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add(light);


let geometry = new THREE.SphereGeometry(1, 32, 32);
let mesh = new THREE.Mesh(geometry, shader);

scene.add(mesh);


let mouseDown = false;
let lastMouseX = null;
let lastMouseY = null;


//gestion des evenements de la souris
document.addEventListener("mousedown", (event) => {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});

document.addEventListener("mouseup", (event) => {
  mouseDown = false;
});

document.addEventListener("mousemove", (event) => {
  if (!mouseDown) {
    return;
  }
  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  mesh.rotation.y += deltaX * 0.001;
  mesh.rotation.x += deltaY * 0.001;
});

document.addEventListener("wheel", (event) => {
    //camera.position.z += event.deltaY * 0.001;
});


/* detect resize */
window.addEventListener('resize', (evt) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});




camera.position.z = 0.3860;


export default {scene, camera, uniforms};