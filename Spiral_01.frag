// Author: Akshay S. Loke
// Title: Spiral 01

#ifdef GL_ES
precision mediump float;
#endif

#define USE_SMOOTH
#define M_PI 3.14159265358979
#define M_2PI 6.28318530717958
#define RADIUS .25
#define NUMCURLS 6

//http://iquilezles.org/www/articles/palettes/palettes.htm
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 O, vec2 U ) {
    vec2 R = iResolution.xy;
    U = (2.*U-R)/R.y;
    
    float 	dist = length(U),
			normTheta = .5+atan(U.y, U.x)/M_2PI,
        	val = 0.;
    
    for (int i=-1; i<NUMCURLS-1; i++) {
        float iFloat = float(i);
        float 	ringPre = (iFloat == -1.)? 0.: (normTheta + iFloat) * RADIUS,
            	ringPost = (normTheta + iFloat + 1.) * RADIUS;
        
#ifdef USE_SMOOTH
        float ringVal = smoothstep(-.01, 0., dist-ringPre) - smoothstep(-.01, 0., dist-ringPost);
#else
        float ringVal = step(ringPre, dist) - step(ringPost, dist);
#endif
        val += ringVal * (normTheta + iFloat + 1.);
    }

    val /= float(NUMCURLS);
    val += cos(iGlobalTime*.3);

    vec3 col = pal(val, 
                   vec3(0.5,0.5,0.5),
                   vec3(0.5,0.5,0.5),
                   vec3(1.0,1.0,1.0),
                   vec3(0.0,0.33,0.67) );
    
    O = vec4(col * smoothstep(0.81, .8, dist), 1.);
}
