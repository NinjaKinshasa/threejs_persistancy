import {
	ShaderMaterial,
	Vector2,
} from 'three';

import vertexShader from "./mask.vert";
import fragmentShader from "./mask.frag";

const maskShader = new ShaderMaterial({
    uniforms: {
        u_mouse: {value: new Vector2(0, 0)},
        sampler: { value: null },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
  });

  export {maskShader};
