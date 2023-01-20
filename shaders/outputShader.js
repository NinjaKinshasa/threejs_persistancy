import {
	ShaderMaterial,
	Vector2,
} from 'three';

import vertexShader from "./output.vert";
import fragmentShader from "./output.frag";

let uniforms = {
    u_mouse: {value: new Vector2(0, 0)},
    sampler: { value: null },
    u_time: { value: 0 },
    u_channel1: { value: null },
};

const outputShader = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
  });

export {outputShader};
