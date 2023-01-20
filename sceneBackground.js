import * as THREE from 'three'

import vertexShader from "./shaders/background.vert";
import fragmentShader from "./shaders/background.frag";

const scene = new THREE.Scene()


// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 0;

// lumière
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add(light);

let uniforms = {
    u_time: { value: 1.0 },
};

// sphere avec shader
let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side:   THREE.DoubleSide,
    wireframe: false,
});
let geometry = new THREE.SphereGeometry(1, 32, 32);
//let geometry = new THREE.PlaneGeometry(4, 4);
let sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//sphere.position.z = -1;

 
let mouseDown = false;
    
let lastMouseX = null;
let lastMouseY = null;

let rotationY = 0;
let rotationX = 0;

//gestion des evenements de la souris
document.addEventListener("mousedown", (event) => {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastmouseY = event.clientY;
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


  sphere.rotation.y += deltaX * 0.001;
  sphere.rotation.x += deltaY * 0.001;
});


// zoom in event
let rotation = 0;
sphere.rotateY(THREE.MathUtils.degToRad(0));
camera.position.z = 0.38600000000000034;
document.addEventListener( "wheel", (event) => {
   // rotation += event.deltaY * 0.002;
    // sphere.rotateY(THREE.MathUtils.degToRad(rotation));
    // sphere.rotateX(THREE.MathUtils.degToRad(rotation));
    // sphere.rotateZ(THREE.MathUtils.degToRad(rotation));

  //  sphere.rotateX(THREE.MathUtils.degToRad(rotation));
   camera.position.z += event.deltaY * 0.002;
   // console.log(event.deltaY);
   console.log(camera.position.z);
});



export default {scene, camera, uniforms};