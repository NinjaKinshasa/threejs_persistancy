import * as THREE from 'three'
console.clear()

const LABEL_TEXT = 'ABC'

const clock = new THREE.Clock()
const sceneChannel0 = new THREE.Scene()

//const restartAnimButton = document.getElementById('restart-anim')

// Create a new framebuffer we will use to render to
// the video card memory
let renderBufferA = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)
// Create a second framebuffer
let renderBufferB = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)

// Create a threejs renderer:
// 1. Size it correctly
// 2. Set default background color
// 3. Append it to the page
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x222222)
renderer.setClearAlpha(0)
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio || 1)
document.body.appendChild(renderer.domElement)

// Create an orthographic camera that covers the entire screen
// 1. Position it correctly in the positive Z dimension
// 2. Orient it towards the scene center
const orthoCamera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
orthoCamera.position.set(0, 0, 10)
// orthoCamera.lookAt(new THREE.Vector3(0, 0, 0))

// Create a plane geometry that spawns either the entire
// viewport height or width depending on which one is bigger



const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 })
);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 })
);

const cubevert = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

const cubeBleu = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 2),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

// scene.add(sphere);
// scene.add(cube);
// scene.add(cubevert);

// Create a second scene that will hold our fullscreen plane
const finalScene = new THREE.Scene()
// Create a plane geometry that covers the entire screen
const postFXGeometry = new THREE.PlaneGeometry(13, 6)

//finalScene.add(cubevert);
//finalScene.add(cubeBleu);
cubeBleu.position.z = 1;



// Create a plane material that expects a sampler texture input
// We will pass our generated framebuffer texture to it
const postFXMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sampler: { value: null },
  },
  // vertex shader will be in charge of positioning our plane correctly
  vertexShader: `
      varying vec2 v_uv;

      void main () {
        // Set the correct position of each plane vertex
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        // Pass in the correct UVs to the fragment shader
        v_uv = uv;
      }
    `,
  fragmentShader: `
      // Declare our texture input as a "sampler" variable
      uniform sampler2D sampler;

      // Consume the correct UVs from the vertex shader to use
      // when displaying the generated texture
      varying vec2 v_uv;

      void main () {
        // Sample the correct color from the generated texture
        vec4 inputColor = texture2D(sampler, v_uv );
        // Set the correct color of each pixel that makes up the plane
        // gl_FragColor = vec4(inputColor * 0.975);

        //gl_FragColor = vec4(inputColor);
        gl_FragColor = vec4(vec3(0.,0.,1.),1.);
        gl_FragColor = vec4(inputColor);
      }
    `,
    transparent: true
})
// const postFXMesh = new THREE.Mesh(postFXGeometry, postFXMaterial)
// finalScene.add(postFXMesh)



const shaderFinalScene = new THREE.ShaderMaterial({
    uniforms: {
        u_mouse: {value: new THREE.Vector2(0, 0)},
        sampler: { value: null },
    },
    // vertex shader will be in charge of positioning our plane correctly
    vertexShader: `
        varying vec2 v_uv;
  
        void main () {
          v_uv = uv;
          gl_Position = vec4(position, 1.0);          
        }
      `,
    fragmentShader: `
        varying vec2 v_uv;
        uniform vec2 u_mouse;
        uniform sampler2D sampler;

        void main () {


          gl_FragColor = vec4(1., 0., 1., 1.);

          // violet
          vec4 backgroundColor = vec4(1., 0., 1., 1.);

          // jaune
          vec4 foregroundColor = vec4(1., 1., 0., 1.);

          //gl_FragColor = foregroundColor;

          vec4 channel0Color = texture2D(sampler, v_uv);
          float opacityMask = channel0Color.r;

          gl_FragColor = mix(backgroundColor, foregroundColor, opacityMask);

          //gl_FragColor = texture2D(sampler, v_uv );

        }
      `,
      transparent: true
});

const meshFinalScene = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), shaderFinalScene);
finalScene.add(meshFinalScene)

const shaderChannel0 = new THREE.ShaderMaterial({
  uniforms: {
      u_mouse: {value: new THREE.Vector2(0, 0)},
      sampler: { value: null },
  },
  // vertex shader will be in charge of positioning our plane correctly
  vertexShader: `
      varying vec2 v_uv;

      void main () {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);          
      }
    `,
  fragmentShader: `
    varying vec2 v_uv;
    uniform vec2 u_mouse;
    uniform sampler2D sampler;

    void main () {

      float persistancyFactor = .98;

      float circle_size = 150.;
      float dispersionRatio = 0.7;
      vec2 center = u_mouse.xy;

      float dist = 1. - smoothstep(circle_size * (1. - dispersionRatio), circle_size * (1. + dispersionRatio), distance(center, gl_FragCoord.xy));
      
      float grayscale_prev = texture(sampler, v_uv).r;

      float prevColor = grayscale_prev * persistancyFactor;
      float newColor = (grayscale_prev * persistancyFactor + dist);

      //gl_FragColor = vec4(vec3(max(prevColor, dist)), 1.);
      //gl_FragColor = vec4(vec3(dist), 1.);

      //gl_FragColor = prevColor + vec4(vec3(dist), 1.);

      gl_FragColor = mix(texture2D(sampler, v_uv), vec4(0.,0.,0.,1.), 0.05) + vec4(vec3(dist), 1.);
    }
    `,
    transparent: true
});

const meshChannel0 = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), shaderChannel0);
sceneChannel0.add(meshChannel0)


renderer.domElement.addEventListener('mousemove', (evt) => {
    console.log(evt.clientX, evt.clientY);
    shaderFinalScene.uniforms['u_mouse'].value.x = evt.clientX;
    shaderFinalScene.uniforms['u_mouse'].value.y = window.innerHeight - evt.clientY;
    shaderChannel0.uniforms['u_mouse'].value.x = evt.clientX;
    shaderChannel0.uniforms['u_mouse'].value.y = window.innerHeight - evt.clientY;
});

// Start out animation render loop
renderer.setAnimationLoop(onAnimLoop)

function onAnimLoop() {
  // Do not clear the contents of the canvas on each render
  // In order to achieve our effect, we must draw the new frame
  // on top of the previous one!
  renderer.autoClearColor = false
  
  // Explicitly set renderBufferA as the framebuffer to render to
  renderer.setRenderTarget(renderBufferA)
  
  // On each new frame, render the scene to renderBufferA
  renderer.render(finalScene, orthoCamera)
  renderer.render(sceneChannel0, orthoCamera)

  // Set the device screen as the framebuffer to render to
  // In WebGL, framebuffer "null" corresponds to the default framebuffer!
  renderer.setRenderTarget(null)
  
  // Assign the generated texture to the sampler variable used
  // in the postFXMesh that covers the device screen
  //postFXMesh.material.uniforms.sampler.value = renderBufferA.texture
  meshFinalScene.material.uniforms.sampler.value = renderBufferA.texture
  meshChannel0.material.uniforms.sampler.value = renderBufferA.texture

  // Render the postFX mesh to the default framebuffer
  renderer.render(finalScene, orthoCamera)

  //renderer.render(scene, orthoCamera)
  
  // Ping-pong our framebuffers by swapping them
  // at the end of each frame render
  const temp = renderBufferA
  renderBufferA = renderBufferB
  renderBufferB = temp
}
