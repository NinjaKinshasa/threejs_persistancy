import {
	ShaderMaterial,
    DoubleSide,
} from 'three';

import vertexShader from "./background.vert";
import fragmentShader from "./background.frag";

console.log('vertexShader');

const backgroundShader = new ShaderMaterial({
    uniforms: {
        u_time: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: DoubleSide,
});

export {backgroundShader};
