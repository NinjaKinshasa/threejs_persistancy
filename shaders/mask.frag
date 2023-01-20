varying vec2 v_uv;
uniform vec2 u_mouse;
uniform sampler2D sampler;

void main () {

float persistancyFactor = .95;

float circle_size = 160.;
float dispersionRatio = 0.2;
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