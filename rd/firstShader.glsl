#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 normM = u_mouse.xy/u_resolution;
    float normTX = abs(sin(u_time));
    float normTY = abs(sin(u_time * .5));
    float x = abs(sin(st.x * normM.x * normTX * 10.));
    float y = abs(sin(st.y * normM.y * normTY * 50.));
	gl_FragColor = vec4(x, y, 0.0 , 1.0);
}
