import {
	ShaderMaterial
} from 'three';

import vertexShader from "./background.vert";
import fragmentShader from "./background.frag";

const backgroundShader = new ShaderMaterial({
    uniforms: {
        u_time: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });

  export {backgroundShader};
