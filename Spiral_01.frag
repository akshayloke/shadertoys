// Author: Akshay S. Loke
// Title: Spiral 01

#ifdef GL_ES
precision mediump float;
#endif

#define USE_SMOOTH
#define M_PI 3.14159265358979
#define M_2PI 6.28318530717958
#define RADIUS 0.25
#define NUMCURLS 7

//http://iquilezles.org/www/articles/palettes/palettes.htm
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float aspect = iResolution.x/iResolution.y;
    vec2 normCenter = vec2(0.0);

    vec2 uv = fragCoord.xy;
    vec2 normUV = fragCoord.xy / iResolution.xy;
	normUV = normUV * 2.0 - vec2(1.0);
    normUV.x *= aspect;
    
    float dist = length(normUV - normCenter);
    float theta = atan(normUV.y, normUV.x) + M_PI;
    float normTheta = theta / M_2PI;

    /*float val0 = step(0.0, dist) - step(normTheta * RADIUS, dist);
    float val1 = step(normTheta * RADIUS, dist) - step((normTheta + 1.0) * RADIUS, dist);
    float val = (val0 * normTheta + val1 * (normTheta + 1.0)) * 0.5;

    float smoothVal0 = smoothstep(0.0, 0.0, dist) - smoothstep(normTheta * RADIUS - 0.01, normTheta * RADIUS, dist);
    float smoothVal1 = smoothstep(normTheta * RADIUS - 0.01, normTheta * RADIUS, dist) - smoothstep((normTheta + 1.0) * RADIUS - 0.01, (normTheta + 1.0) * RADIUS, dist);
    float smoothVal = (smoothVal0 * normTheta + smoothVal1 * (normTheta + 1.0)) * 0.5;
    */

    float val = 0.0;
    float numCurlsFloat = float(NUMCURLS);

    for (int i=-1; i<NUMCURLS-1; i++) {
        float index = float(i);
        float normThetaPre = (normTheta + index);
        float ringPre = normThetaPre * RADIUS;
        if (i == -1) {
            ringPre = 0.0;
        }
        
        float normThetaPost = (normTheta + index + 1.0);
        float ringPost = normThetaPost * RADIUS;
#ifdef USE_SMOOTH
        float ringVal = smoothstep(ringPre-0.01, ringPre, dist) - smoothstep(ringPost-0.01, ringPost, dist);
#else
        float ringVal = step(ringPre, dist) - step(ringPost, dist);
#endif
        val += (ringVal * normThetaPost);
    }

    val /= numCurlsFloat;
    val += cos(iGlobalTime*0.3);

    vec3 col = pal( val, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );

    float alpha = 1.0 - smoothstep(0.79, 0.80, dist);
    fragColor = vec4(col*alpha, 1.0);
}
