varying vec2 v_uv;
uniform vec2 u_mouse;
uniform sampler2D sampler;
uniform sampler2D u_channel1;

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

float random(vec2 fg)
{
    vec2 k1 = vec2( 23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
);
return fract(cos(dot(fg, k1) ) * 12345.6789);
}

void main () {
    vec2 uv = v_uv;
    float n = noise(vec3(uv * 10., 0) + u_time * 1.5);
    vec2 distortion = uv * n * 0.005;
    uv += distortion;
    float opacity = texture(sampler, uv).r;


    vec4 backgroundColor = texture(u_channel1, v_uv);

    vec2 uvrandom = v_uv;
    uvrandom.y *= random(vec2(uvrandom.y, 0.4 ));

    backgroundColor.rbg += random(uvrandom) * 0.1;
    // opacity += random(uvrandom) * .3;


    gl_FragColor = mix(vec4(1., 1., 1., 0.5), backgroundColor, opacity);
}