import * as THREE from 'three'

import sceneBackground from './sceneBackground'
import sceneMask from './sceneMask'
import sceneOutput from './sceneOutput'


// définition des render targets
let channel0target = new THREE.WebGLRenderTarget(innerWidth * devicePixelRatio,innerHeight * devicePixelRatio)
let channel0previous = new THREE.WebGLRenderTarget(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio) // 2 targets pour le channel 0 pour la persistance
let channel1target = new THREE.WebGLRenderTarget(innerWidth * devicePixelRatio,innerHeight * devicePixelRatio)

// Ajout d'un renderer à la page
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)


// animation loop
renderer.autoClearColor = false;
renderer.setAnimationLoop(onAnimLoop)

function onAnimLoop() {

  // on fait un rendu du channel0 vers le target
  renderer.setRenderTarget(channel0target)
  renderer.render(sceneMask.scene, sceneMask.camera);

  // le rendu est passé à la fois à lui même et à la scene finale
  sceneOutput.uniforms.sampler.value = channel0target.texture
  sceneMask.uniforms.sampler.value = channel0target.texture

  renderer.setRenderTarget(channel1target);
  renderer.render(sceneBackground.scene, sceneBackground.camera);

  // update uniforms
  sceneOutput.uniforms['u_channel1'].value = channel1target.texture
  sceneBackground.uniforms.u_time.value ++;

  // target = null => rendu sur l'ecran
  renderer.setRenderTarget(null);

  // rendu final sur l'ecran
  renderer.render(sceneOutput.scene, sceneOutput.camera);
  //renderer.render(sceneMask, sceneMask.camera);
  //renderer.render(sceneBackground.scene, sceneBackground.camera);


  // swap les 2 buffers du channel 0 pour eviter les erreurs webgl
  const temp = channel0target
  channel0target = channel0previous
  channel0previous = temp


}

// next steps : 
// ajouter le délais de la souris (lerp)
