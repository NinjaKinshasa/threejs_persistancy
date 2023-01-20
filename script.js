import * as THREE from 'three'
console.clear()


const sceneChannel0 = new THREE.Scene()
const finalScene = new THREE.Scene()

let channel0target = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)

let channel0previous = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)

// Ajout d'un renderer à la page
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

// Ajout de la camera
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 10)

// Shader de la scene finale
const shaderFinalScene = new THREE.ShaderMaterial({
    uniforms: {
        u_mouse: {value: new THREE.Vector2(0, 0)},
        sampler: { value: null },
        u_time: { value: 0 },
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
        uniform float u_time;

        float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

        float noise(vec3 p){
            vec3 a = floor(p);
            vec3 d = p - a;
            d = d * d * (3.0 - 2.0 * d);

            vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
            vec4 k1 = perm(b.xyxy);
            vec4 k2 = perm(k1.xyxy + b.zzww);

            vec4 c = k2 + a.zzzz;
            vec4 k3 = perm(c);
            vec4 k4 = perm(c + 1.0);

            vec4 o1 = fract(k3 * (1.0 / 41.0));
            vec4 o2 = fract(k4 * (1.0 / 41.0));

            vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
            vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

            return o4.y * d.y + o4.x * (1.0 - d.y);
        }

        void main () {
          vec2 uv = v_uv;
          float n = noise(vec3(uv * 10., 0) + u_time * 1.5);
          vec2 noisedUV = uv * n;
          vec2 distortion = noisedUV * 0.1;
          uv += distortion;
          float opacity = texture(sampler, uv).r;
          gl_FragColor = mix(vec4(1., 0., 1., 1.), vec4(1., 1., 0., 1.), opacity);
        }
      `,
      transparent: true
});


// Shader de la scene channel0, qui sera le mask
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

      gl_FragColor = vec4(vec3(max(prevColor, dist)), 1.);
      //gl_FragColor = vec4(vec3(dist), 1.);

      //gl_FragColor = prevColor + vec4(vec3(dist), 1.);

      //gl_FragColor = mix(texture2D(sampler, v_uv), vec4(0.,0.,0.,1.), 0.05) + vec4(vec3(dist), 1.);
    }
    `,
    transparent: true
});

// définition des mesh, les geométries sont pas prises en compte par les shaders
const meshFinalScene = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), shaderFinalScene);
const meshChannel0 = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), shaderChannel0);

// Ajout des mesh à la scene
finalScene.add(meshFinalScene)
sceneChannel0.add(meshChannel0)

// detection du mouvement de la souris
renderer.domElement.addEventListener('mousemove', (evt) => {
    //console.log(evt.clientX, evt.clientY);
    shaderFinalScene.uniforms['u_mouse'].value.x = evt.clientX;
    shaderFinalScene.uniforms['u_mouse'].value.y = window.innerHeight - evt.clientY;
    shaderChannel0.uniforms['u_mouse'].value.x = evt.clientX;
    shaderChannel0.uniforms['u_mouse'].value.y = window.innerHeight - evt.clientY;
});


// animation loop
renderer.autoClearColor = false;
renderer.setAnimationLoop(onAnimLoop)


function onAnimLoop() {

  // on fait un rendu du channel0 vers le target
  renderer.setRenderTarget(channel0target)
  renderer.render(sceneChannel0, camera);

  // le rendu est passé à la fois à lui même et à la scene finale
  meshFinalScene.material.uniforms.sampler.value = channel0target.texture
  meshChannel0.material.uniforms.sampler.value = channel0target.texture

  // target = null => rendu sur l'ecran
  renderer.setRenderTarget(null);
  // On peut decommenter la ligne suivante pour avoir le rendu de la premiere scene
  //renderer.render(sceneChannel0, camera);
  renderer.render(finalScene, camera);

  // swap les 2 buffers du channel 0 pour eviter les erreurs webgl
  const temp = channel0target
  channel0target = channel0previous
  channel0previous = temp

  //update unifromes 
  meshFinalScene.material.uniforms.u_time.value += 0.01;

}
