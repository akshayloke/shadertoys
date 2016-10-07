// Author: Akshay S. Loke
// Title: Metaballs 01

#ifdef GL_ES
precision mediump float;
#endif

#define NUM_BALLS 8
#define PI 6.28
#define RADIUS 0.02
#define MOVING_RADIUS 0.02

//http://iquilezles.org/www/articles/palettes/palettes.htm
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 st = fragCoord.xy/iResolution.xy;
    float aspect = iResolution.x/iResolution.y;
    st.x *= aspect;
    
    vec3 col = vec3(0.);
    float mi_total = 0.0;
    
    vec2 c0 = vec2(cos(iGlobalTime)*0.3+0.5*aspect, 
                   sin(iGlobalTime)*0.3+0.5);
    float d0 = distance(st, c0);
	float m0 = MOVING_RADIUS/d0;
    col += m0*vec3(1, 1, 1);
    
    for (int i=0; i<NUM_BALLS;i++) {
        vec2 ci = vec2(cos(-iGlobalTime*0.5+float(i)*PI/float(NUM_BALLS))*0.3+0.5*aspect, 
                       sin(-iGlobalTime*0.5+float(i)*PI/float(NUM_BALLS))*0.3+0.5);
        float d = distance(st, ci);
        float mi = RADIUS/d;
        mi_total += mi;
        col += mi*palette(float(i)/float(NUM_BALLS), 
                          vec3(0.5,0.5,0.5),
                          vec3(0.5,0.5,0.5),
                          vec3(1.0,1.0,1.0),
                          vec3(0.0,0.33,0.67));
    }

    float m = smoothstep(0.2, 2.0, m0+mi_total);
    vec3 color = (col);
    
    fragColor = vec4(color*m, 1.0);
}
