import { useEffect, useRef, useState } from 'react'

/**
 * LUA DE FUNDO (estática) — pano de fundo do hero, no estilo "planeta à contraluz".
 * Gerada uma única vez em WebGL (não gira, não é um objeto 3D interativo).
 * - `variant="dark"`: lado escuro voltado para a câmera com textura sutil, crescente fino
 *   iluminado à direita e brilho atmosférico roxo vazando pela borda.
 * - `variant="light"`: "lua de dia", quase cheia, em tons pastel lilás, com limbo violeta
 *   e halo difuso, para ler bem sobre o céu claro.
 *
 * O canvas é maior que o disco (`SCALE`) para caber o brilho externo.
 * Só redesenha quando o tamanho muda.
 */
export const MOON_CANVAS_SCALE = 1.4

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos; gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uPx;
uniform float uScale;
uniform float uLight; // 1 = tema claro (lua de dia), 0 = tema escuro (lua à contraluz)

float hash(vec3 p){ p = fract(p*0.3183099 + 0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
vec3 hash3(vec3 p){ return vec3(hash(p), hash(p + 17.13), hash(p + 31.71)); }
float noise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float a = 0.5, s = 0.0; for(int i = 0; i < 6; i++){ s += a*noise(p); p = p*2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }

vec4 craters(vec3 p, float density, float depth, float keep){
  vec3 q = p*density; vec3 i = floor(q); vec3 f = fract(q);
  float best = 9.0; vec3 bv = vec3(0.0); float bd = 1.0; float br = 1.0;
  for(int z = -1; z <= 1; z++) for(int y = -1; y <= 1; y++) for(int x = -1; x <= 1; x++){
    vec3 g = vec3(float(x), float(y), float(z));
    vec3 h = hash3(i + g);
    if(h.y < keep) continue;
    vec3 v = g + h - f;
    float d = length(v);
    float r = 0.12 + 0.30*h.z*h.z;
    float dn = d/r;
    if(dn < best){ best = dn; bv = v; bd = d; br = r; }
  }
  if(best > 1.8) return vec4(0.0);
  float dn = best; float w = 0.22;
  float rim = 0.45*exp(-((dn-1.0)*(dn-1.0))/(w*w));
  float dh = (dn < 1.0 ? 2.0*dn : 0.0) + rim*(-2.0*(dn-1.0)/(w*w));
  return vec4(dh*(-bv/max(bd, 1e-4))/br*density*depth, exp(-dn*dn*3.0));
}

void main(){
  vec2 uv = vUv*uScale;                       // disco com raio 1
  float r = length(uv);
  bool day = uLight > 0.5;
  // Noite: luz vindo de trás, pela direita (crescente fino).
  // Dia: luz pela frente-direita (lua quase cheia, pálida, como a lua vista de dia).
  vec3 L = day ? normalize(vec3(0.70, 0.30, 0.55)) : normalize(vec3(0.80, 0.28, -0.62));
  vec2 L2 = normalize(L.xy);
  float facing = max(dot(uv/max(r, 1e-4), L2), 0.0);

  // Brilho atmosférico (fora e na borda do disco)
  float out_ = max(r - 1.0, 0.0);
  float tight = exp(-out_*16.0)*pow(facing, 1.4);
  float wide = exp(-out_*4.0)*pow(facing, 2.2)*0.45;
  vec3 glowCol = mix(vec3(0.43, 0.16, 0.85), vec3(0.80, 0.74, 1.0), exp(-out_*30.0));
  float gI = clamp(tight*0.95 + wide, 0.0, 1.0);
  if(day){
    // halo lilás difuso em volta do disco inteiro, mais forte do lado da luz
    glowCol = vec3(0.62, 0.50, 0.96);
    gI = clamp(exp(-out_*6.0)*(0.25 + 0.75*facing)*0.34, 0.0, 1.0);
  }
  vec3 glow = glowCol*gI;

  if(r > 1.0){ gl_FragColor = vec4(glow, gI); return; }

  vec3 n = vec3(uv, sqrt(1.0 - r*r));
  float c = cos(2.2), s = sin(2.2);
  vec3 p = vec3(c*n.x + s*n.z, n.y, -s*n.x + c*n.z);
  vec3 Lo = vec3(c*L.x + s*L.z, L.y, -s*L.x + c*L.z);

  float maria = smoothstep(0.44, 0.60, fbm(p*1.25 + vec3(3.1, 0.7, 5.2)));
  float albedo = mix(0.74, 0.30, maria) + (fbm(p*7.0) - 0.5)*0.24 + (fbm(p*24.0) - 0.5)*0.10;

  vec4 c1 = craters(p, 2.0, 0.020, 0.80);
  vec4 c2 = craters(p + 7.3, 5.0, 0.010, 0.70);
  vec4 c3 = craters(p + 2.9, 12.0, 0.005, 0.60);
  vec3 g = c1.xyz + c2.xyz + c3.xyz;
  vec3 nb = normalize(p - (g - dot(g, p)*p));
  albedo += 0.08*c2.w*(1.0 - maria) + 0.10*c3.w;

  float ndl = dot(nb, Lo);
  vec3 col;
  if(day){
    // Lua de dia: tons pastel (já em espaço de exibição, sem gama).
    // Mares em lilás, terras quase brancas, lado sem luz um lilás um pouco mais escuro que o céu.
    float lit = smoothstep(-0.15, 0.45, ndl);
    float shade = 0.88 + 0.12*max(ndl, 0.0);
    vec3 dayCol = mix(vec3(0.70, 0.64, 0.91), vec3(0.99, 0.98, 1.0), clamp(albedo*1.2, 0.0, 1.0))*shade;
    vec3 nightCol = vec3(0.87, 0.84, 0.97) + (albedo - 0.5)*0.08;
    col = mix(nightCol, dayCol, lit);
    // limbo violeta: define a borda do disco contra o céu claro
    float fres = pow(1.0 - n.z, 3.2);
    col = mix(col, vec3(0.60, 0.48, 0.94), fres*0.45);
  } else {
    float lit = smoothstep(-0.02, 0.30, ndl)*(0.35 + 0.65*max(ndl, 0.0));
    // textura fraca no lado escuro, crescendo em direção à luz
    float amb = 0.25 + 0.75*smoothstep(-0.9, 0.0, dot(n, L));
    col = vec3(0.88, 0.84, 1.0)*albedo*lit*1.3 + vec3(0.010, 0.008, 0.020)*albedo*amb;

    // atmosfera roxa no limbo iluminado
    float fres = pow(1.0 - n.z, 2.4);
    col += vec3(0.50, 0.30, 0.95)*fres*pow(facing, 1.6)*1.1;

    col = pow(col, vec3(0.4545));
  }
  float a = 1.0 - smoothstep(1.0 - 1.5*uPx, 1.0, r);
  gl_FragColor = vec4(col*a + glow*(1.0 - a), a + gI*(1.0 - a));
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
  return s
}

export function MoonBackdrop({ className = '', variant = 'dark' }: { className?: string; variant?: 'light' | 'dark' }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
    if (!gl) return setFailed(true)

    let prog: WebGLProgram
    try {
      prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link')
    } catch {
      return setFailed(true)
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uPx = gl.getUniformLocation(prog, 'uPx')
    gl.uniform1f(gl.getUniformLocation(prog, 'uScale'), MOON_CANVAS_SCALE)
    gl.uniform1f(gl.getUniformLocation(prog, 'uLight'), variant === 'light' ? 1 : 0)

    let raf = 0
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      // teto de 1536 px: o shader é pesado (custo ∝ pixels) e a lua é suave, a ampliação não aparece
      const size = Math.min(Math.round(canvas.clientWidth * dpr), 1536)
      if (size < 2) return
      canvas.width = canvas.height = size
      gl.viewport(0, 0, size, size)
      gl.uniform1f(uPx, (2 * MOON_CANVAS_SCALE) / size)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      // Não usar loseContext(): no StrictMode o efeito roda 2× e o canvas é reaproveitado
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [variant]) // troca de tema → recompila e redesenha (barato: é um único quadro)

  if (failed) {
    // Fallback sem WebGL: disco escuro com borda roxa (escuro) ou disco pálido com halo lilás (claro)
    const day = variant === 'light'
    return (
      <div aria-hidden className={`grid place-items-center ${className}`}>
        <div
          className="size-[71.4%] rounded-full"
          style={{
            background: day
              ? 'radial-gradient(circle at 70% 35%, #fdfcff, #d9cff5 70%, #a996e6)'
              : 'radial-gradient(circle at 80% 30%, #3b2a66, #0f0b1a 45%)',
            boxShadow: day ? '0 0 80px -10px rgb(139 92 246 / 0.35)' : '40px -10px 80px -20px rgb(139 92 246 / 0.6)',
          }}
        />
      </div>
    )
  }

  return <canvas ref={ref} aria-hidden className={`block ${className}`} />
}
