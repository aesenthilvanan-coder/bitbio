'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function mkRng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
}
const rng = mkRng(0xdeadbeef);

// ─── Pre-generated scene data ─────────────────────────────────────────────────
const STARS = Array.from({ length: 240 }, () => ({
  x: rng(), y: rng() * 0.54, r: rng() > 0.85 ? 2 : 1,
  phase: rng() * Math.PI * 2, speed: 0.3 + rng() * 1.6,
}));
const FLOWERS = Array.from({ length: 50 }, (_, i) => ({
  xr: 0.02 + rng() * 0.96, yr: 0.73 + rng() * 0.17,
  size: 2 + Math.floor(rng() * 3),
  color: ['#ff5599','#00ffcc','#bb55ff','#55ffaa','#ffcc22'][i % 5],
  phase: rng() * Math.PI * 2, speed: 0.35 + rng() * 0.8, glow: rng() > 0.45,
}));
const FAR_TREES  = Array.from({ length: 30 }, (_, i) => ({ xr: (i + rng()*0.7-0.35)/29, h: 28 + rng()*22 }));
const MID_TREES  = Array.from({ length: 22 }, (_, i) => ({ xr: (i + rng()*0.7-0.35)/21, h: 44 + rng()*32, glow: rng()>0.55 }));
const NEAR_TREES = Array.from({ length: 15 }, (_, i) => ({ xr: (i + rng()*0.7-0.35)/14, h: 58 + rng()*42 }));
const mkPeaks = (n: number, lo: number, hi: number) => Array.from({ length: n }, () => lo + rng() * (hi - lo));
const M_FAR = mkPeaks(32, 0.07, 0.22), M_MID = mkPeaks(26, 0.055, 0.17), M_NEAR = mkPeaks(22, 0.04, 0.13);
const DNA_BASES = Array.from({ length: 22 }, () => ({
  xr: rng(), yr: 0.1 + rng() * 0.45, speed: 0.008 + rng() * 0.018,
  base: ['A','T','G','C'][Math.floor(rng()*4)],
  phase: rng() * Math.PI * 2, size: 7 + Math.floor(rng() * 5),
  color: ['#00ffcc88','#39ff1488','#ff559988','#aa44ff88'][Math.floor(rng()*4)],
}));

const ip = Math.round;

// ─── Scene helpers ────────────────────────────────────────────────────────────
function drawMountains(ctx: CanvasRenderingContext2D, W: number, H: number, peaks: number[], baseFrac: number, col: string) {
  const baseY = H * baseFrac, step = W / (peaks.length - 1);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, baseY - peaks[0]*H);
  for (let i = 0; i < peaks.length-1; i++) {
    const x0=i*step, x1=(i+1)*step, y0=baseY-peaks[i]*H, y1=baseY-peaks[i+1]*H;
    ctx.quadraticCurveTo(x0+step*0.5, Math.min(y0,y1)-H*0.008, x1, y1);
  }
  ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
}
function drawDNATree(ctx: CanvasRenderingContext2D, cx: number, baseY: number, h: number, col: string, glowCol?: string) {
  if (glowCol) { ctx.shadowColor=glowCol; ctx.shadowBlur=7; }
  const cx_=ip(cx), topY=ip(baseY-h);
  ctx.fillStyle=col; ctx.fillRect(cx_-1, topY, 2, ip(h*0.72));
  const rungs=ip(h/10);
  for (let r=0; r<rungs; r++) {
    const ry=ip(baseY-(r+0.5)*10), sp=ip(5-(r/rungs)*3);
    if (ry>topY+6 && ry<ip(baseY)) { ctx.fillRect(cx_-sp-1,ry,sp,1); ctx.fillRect(cx_+1,ry,sp,1); }
  }
  ctx.fillRect(cx_-6,topY-1,12,4); ctx.fillRect(cx_-4,topY-3,8,2); ctx.fillRect(cx_-2,topY-5,4,2);
  ctx.shadowBlur=0;
}
function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, sz: number, col: string, glow: boolean) {
  if (glow) { ctx.shadowColor=col; ctx.shadowBlur=sz*3.5; }
  const s=ip(sz), x_=ip(x), y_=ip(y);
  ctx.fillStyle=col;
  ctx.fillRect(x_-ip(s/2), y_-s*2, s, s); ctx.fillRect(x_-ip(s/2), y_, s, s);
  ctx.fillRect(x_-s*2, y_-s, s, s); ctx.fillRect(x_, y_-s, s, s);
  ctx.fillStyle='#ffffff'; ctx.fillRect(x_-ip(s/2), y_-s, s, s); ctx.shadowBlur=0;
}
function drawEnzymeCat(ctx: CanvasRenderingContext2D, cx: number, by: number, frame: number, jumpY: number = 0) {
  const S=2.4, f=ip(frame/10)%4, cx_=ip(cx), by_=ip(by+jumpY);
  ctx.shadowColor='rgba(255,255,255,0.3)'; ctx.shadowBlur=5;
  ctx.fillStyle='#f0f0f0';
  ctx.fillRect(cx_-ip(5*S), by_-ip(10*S), ip(10*S), ip(8*S));
  ctx.fillRect(cx_-ip(4*S), by_-ip(16*S), ip(8*S), ip(7*S));
  ctx.fillRect(cx_-ip(5*S), by_-ip(19*S), ip(3*S), ip(3*S));
  ctx.fillRect(cx_+ip(2*S), by_-ip(19*S), ip(3*S), ip(3*S));
  ctx.fillStyle='#ffb6c1';
  ctx.fillRect(cx_-ip(4*S), by_-ip(18*S), ip(2*S), ip(2*S));
  ctx.fillRect(cx_+ip(2*S), by_-ip(18*S), ip(2*S), ip(2*S));
  const blink=frame%90>84;
  ctx.fillStyle=blink?'#f0f0f0':'#111111';
  ctx.fillRect(cx_-ip(2*S), by_-ip(13*S), ip(S), blink?0:ip(S));
  ctx.fillRect(cx_+ip(S),   by_-ip(13*S), ip(S), blink?0:ip(S));
  if (!blink) { ctx.fillStyle='#00bbaa'; ctx.fillRect(cx_-ip(2*S),by_-ip(13*S),ip(S/2),ip(S/2)); }
  ctx.fillStyle='#ffb6c1'; ctx.fillRect(cx_-ip(S/2), by_-ip(11.5*S), ip(S), ip(S/2));
  ctx.fillStyle='#c8c8c8';
  ctx.fillRect(cx_-ip(6.5*S), by_-ip(12*S), ip(4*S), 1);
  ctx.fillRect(cx_+ip(2.5*S), by_-ip(12*S), ip(4*S), 1);
  const tWag=ip(Math.sin(frame*0.1)*3*S);
  ctx.fillStyle='#f0f0f0';
  ctx.fillRect(cx_+ip(4*S)+tWag, by_-ip(7*S), ip(4*S), ip(S));
  ctx.fillRect(cx_+ip(7*S)+tWag, by_-ip(9*S), ip(S), ip(3*S));
  const l1=f<2?ip(S):0, l2=f<2?0:ip(S);
  ctx.fillStyle='#e0e0e0';
  ctx.fillRect(cx_-ip(3*S), by_-ip(2*S)+l1, ip(2*S), ip(4*S));
  ctx.fillRect(cx_+ip(S),   by_-ip(2*S)+l2, ip(2*S), ip(4*S));
  ctx.fillStyle='#d0d0d0';
  ctx.fillRect(cx_-ip(4*S), by_-ip(2*S)+l2, ip(2*S), ip(3*S));
  ctx.fillRect(cx_+ip(2*S), by_-ip(2*S)+l1, ip(2*S), ip(3*S));
  ctx.fillStyle='#ffb6c1';
  ctx.fillRect(cx_-ip(3*S), by_+ip(2*S)+l1, ip(2*S), ip(S));
  ctx.fillRect(cx_+ip(S),   by_+ip(2*S)+l2, ip(2*S), ip(S));
  ctx.shadowBlur=0;
}

interface TrailParticle { x: number; y: number; life: number; color: string; }
interface EnzState { jumpVy: number; jumpY: number; quipTimer: number; quip: string; }

function renderScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, frame: number, trail: TrailParticle[], enz: EnzState) {
  ctx.clearRect(0,0,W,H); ctx.imageSmoothingEnabled=false;
  const sg=ctx.createLinearGradient(0,0,0,H*0.76);
  sg.addColorStop(0,'#010810'); sg.addColorStop(0.28,'#021220'); sg.addColorStop(0.60,'#061c34'); sg.addColorStop(1,'#0c2a48');
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
  const hg=ctx.createRadialGradient(W*.5,H*.58,0,W*.5,H*.58,W*.42);
  hg.addColorStop(0,'rgba(0,200,110,0.06)'); hg.addColorStop(.6,'rgba(0,80,60,0.025)'); hg.addColorStop(1,'transparent');
  ctx.fillStyle=hg; ctx.fillRect(0,0,W,H);
  for (const s of STARS) {
    const a=0.42+0.58*Math.sin(t*s.speed+s.phase);
    ctx.fillStyle=`rgba(210,228,255,${a.toFixed(2)})`; ctx.fillRect(ip(s.x*W), ip(s.y*H), s.r, s.r);
  }
  ctx.save();
  for (const b of DNA_BASES) {
    const fy=((b.yr-t*b.speed)%0.6+0.6)%0.6, opacity=Math.sin((fy/0.6)*Math.PI);
    if (opacity<=0) continue;
    ctx.globalAlpha=opacity*0.7; ctx.fillStyle=b.color; ctx.font=`bold ${b.size}px monospace`;
    ctx.fillText(b.base, ip(b.xr*W), ip(fy*H*0.9+H*0.05));
  }
  ctx.restore();
  const aColors=['rgba(0,255,150,.044)','rgba(100,20,220,.040)','rgba(0,190,220,.036)'];
  for (let i=0;i<3;i++) {
    const drift=Math.sin(t*0.17+i*2.0)*16, ay=H*0.11+i*22+drift;
    const ag=ctx.createLinearGradient(0,ay,0,ay+20);
    ag.addColorStop(0,'transparent'); ag.addColorStop(.5,aColors[i]); ag.addColorStop(1,'transparent');
    ctx.fillStyle=ag; ctx.fillRect(0,ip(ay),W,20);
  }
  ctx.save();
  ctx.strokeStyle=`rgba(0,255,180,${0.04+0.03*Math.sin(t*0.8)})`; ctx.lineWidth=2; ctx.beginPath();
  for (let xi=0;xi<=W;xi+=3) { const y=H*0.55+Math.sin(xi*0.025+t*0.4)*6+Math.sin(xi*0.012-t*0.25)*4; xi===0?ctx.moveTo(xi,y):ctx.lineTo(xi,y); }
  ctx.stroke(); ctx.restore();
  drawMountains(ctx,W,H,M_FAR,0.54,'#0a1620'); drawMountains(ctx,W,H,M_MID,0.57,'#0e1e2c'); drawMountains(ctx,W,H,M_NEAR,0.60,'#122438');
  for (const tr of FAR_TREES) drawDNATree(ctx,tr.xr*W,H*0.64,tr.h*.52,'#08160a');
  const mg=ctx.createLinearGradient(0,H*.60,0,H*.78);
  mg.addColorStop(0,'#0d280a'); mg.addColorStop(1,'#091c06');
  ctx.fillStyle=mg; ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(0,H*.71);
  for (let xi=0;xi<=28;xi++) { const xf=xi/28; ctx.lineTo(xf*W,H*(0.67+Math.sin(xf*Math.PI*5+.6)*.038)); }
  ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
  for (const tr of MID_TREES) drawDNATree(ctx,tr.xr*W,H*0.72,tr.h*.68,'#142c10',tr.glow?'#00ff8826':undefined);
  const ng=ctx.createLinearGradient(0,H*.73,0,H);
  ng.addColorStop(0,'#1a3c12'); ng.addColorStop(.5,'#122c0c'); ng.addColorStop(1,'#0c1e08');
  ctx.fillStyle=ng; ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(0,H*.77);
  for (let xi=0;xi<=34;xi++) { const xf=xi/34; ctx.lineTo(xf*W,H*(0.74+Math.sin(xf*Math.PI*7+1.3)*.022)); }
  ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
  for (const tr of NEAR_TREES) drawDNATree(ctx,tr.xr*W,H*0.80,tr.h*.84,'#1e4418','#00ff4422');
  const fg=ctx.createLinearGradient(0,H*.83,0,H);
  fg.addColorStop(0,'#0e2408'); fg.addColorStop(.55,'#091a06'); fg.addColorStop(1,'#030802');
  ctx.fillStyle=fg; ctx.fillRect(0,ip(H*.85),W,H);
  ctx.fillStyle='#1a4010';
  for (let gx=0;gx<W;gx+=5) { const bh=3+Math.sin(gx*.32+t*.5)*3, gy=H*.855+Math.sin(gx*.08)*2; ctx.fillRect(ip(gx),ip(gy-bh),1,ip(bh)); if (gx%15===0) ctx.fillRect(ip(gx+2),ip(gy-bh*.6),1,ip(bh*.6)); }
  for (const p of trail) { ctx.globalAlpha=p.life*0.6; ctx.fillStyle=p.color; ctx.fillRect(ip(p.x)-2,ip(p.y)-2,4,4); }
  ctx.globalAlpha=1;
  for (const fl of FLOWERS) { const fy=fl.yr*H+Math.sin(t*fl.speed+fl.phase)*1.8; if (fy>H*.77&&fy<H*.91) drawFlower(ctx,fl.xr*W,fy,fl.size,fl.color,fl.glow); }
  const catPeriod=420, catXFrac=(frame%catPeriod)/catPeriod;
  const catX=W*0.06+catXFrac*W*0.28, catY=H*0.857;
  drawEnzymeCat(ctx,catX,catY,frame,enz.jumpY);
  if (enz.quipTimer>0) {
    const bx=catX-10, by=catY+enz.jumpY-ip(2.4*19);
    ctx.fillStyle='rgba(0,20,10,0.92)'; ctx.fillRect(ip(bx-90),ip(by-36),180,32);
    ctx.strokeStyle='#00ffcc'; ctx.lineWidth=2; ctx.strokeRect(ip(bx-90),ip(by-36),180,32);
    ctx.fillStyle='#00ffcc'; ctx.font='7px "Press Start 2P",monospace'; ctx.textAlign='center';
    const words=enz.quip.split(' '); let line='', lines: string[]=[];
    for (const w of words) { if ((line+w).length>22){lines.push(line.trim());line='';}line+=w+' '; }
    lines.push(line.trim());
    lines.slice(0,2).forEach((l,i)=>ctx.fillText(l,ip(bx),ip(by-22+i*12)));
    ctx.textAlign='left';
  }
  const ds=ctx.createLinearGradient(0,H*.90,0,H);
  ds.addColorStop(0,'transparent'); ds.addColorStop(.35,'rgba(3,8,2,.85)'); ds.addColorStop(1,'#020602');
  ctx.fillStyle=ds; ctx.fillRect(0,ip(H*.90),W,H);
  ctx.fillStyle='#050c03';
  for (let gx=0;gx<W;gx+=3) { const bh=5+Math.sin(gx*.23+t*.28)*5; ctx.fillRect(ip(gx),ip(H*.93-bh),1,ip(bh)); }
}

// ─── Background scene canvas ──────────────────────────────────────────────────
function BiologySceneCanvas() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const frameRef=useRef(0);
  const trailRef=useRef<TrailParticle[]>([]);
  const enzRef=useRef<EnzState>({jumpVy:0,jumpY:0,quipTimer:0,quip:''});
  useEffect(()=>{
    const canvas=canvasRef.current!; const ctx=canvas.getContext('2d')!;
    let raf: number, startTs=0;
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;};
    resize(); const ro=new ResizeObserver(resize); ro.observe(canvas);
    const onMouseMove=(e: MouseEvent)=>{
      const rect=canvas.getBoundingClientRect();
      trailRef.current.push({x:e.clientX-rect.left,y:e.clientY-rect.top,life:1,color:Math.random()>0.5?'#00ffcc':'#39ff14'});
      if (trailRef.current.length>10) trailRef.current.shift();
    };
    const onClick=(e: MouseEvent)=>{
      const rect=canvas.getBoundingClientRect(); const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      const W=canvas.width, H=canvas.height;
      const catXFrac=(frameRef.current%420)/420;
      const enzX=W*0.06+catXFrac*W*0.28, enzY=H*0.857;
      if (Math.hypot(mx-enzX,my-enzY)<50) {
        const quips=["Mitochondria is the powerhouse of EVERYTHING","I have teal eyes and I'm not afraid to use them","Did you know I can fold proteins? I just choose not to."];
        enzRef.current={jumpVy:-9,jumpY:0,quipTimer:140,quip:quips[Math.floor(Math.random()*3)]};
      }
    };
    canvas.addEventListener('mousemove',onMouseMove); canvas.addEventListener('click',onClick);
    const loop=(ts: number)=>{
      if (!startTs) startTs=ts; const t=(ts-startTs)/1000; frameRef.current++;
      for (const p of trailRef.current) p.life-=0.09;
      trailRef.current=trailRef.current.filter(p=>p.life>0);
      const e=enzRef.current;
      if (e.jumpVy!==0||e.jumpY!==0){e.jumpY+=e.jumpVy;e.jumpVy+=0.45;if(e.jumpY>=0){e.jumpY=0;e.jumpVy=0;}}
      if (e.quipTimer>0) e.quipTimer--;
      const {width:W,height:H}=canvas;
      if (W>0&&H>0) renderScene(ctx,W,H,t,frameRef.current,trailRef.current,enzRef.current);
      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return ()=>{cancelAnimationFrame(raf);ro.disconnect();canvas.removeEventListener('mousemove',onMouseMove);canvas.removeEventListener('click',onClick);};
  },[]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{imageRendering:'pixelated'}} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME PREVIEW CANVAS — live playable-looking game screenshot in the hero
// ═══════════════════════════════════════════════════════════════════════════════
function GamePreviewCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const S = 2, TILE = 16, TS = TILE * S; // 32px per tile
    const COLS = 11, ROWS = 7;
    const W = COLS * TS, HUD_H = 20, WORLD_H = ROWS * TS, STAT_H = 22;
    const H = HUD_H + WORLD_H + STAT_H;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // Map: # wall, . floor, T organelle, L lesson-node, E elliot, C enzyme-cat
    const MAP = [
      '###########',
      '#....T....#',
      '#.........#',
      '#..E....L.#',
      '#.....C...#',
      '#...T.....#',
      '###########',
    ];

    let f = 0, raf: number;
    const gr = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c; ctx.fillRect(x * S, HUD_H + y * S, w * S, h * S);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── HUD ────────────────────────────────────────────────────────────────
      ctx.fillStyle = '#090909'; ctx.fillRect(0, 0, W, HUD_H);
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, HUD_H - 1, W, 1);
      ctx.font = '5px "Press Start 2P",monospace';
      ctx.fillStyle = '#39ff14'; ctx.fillText('BIT', 4, 13);
      ctx.fillStyle = '#00ff88'; ctx.fillText('BIO', 22, 13);
      // Hearts
      for (let h = 0; h < 3; h++) { ctx.fillStyle = '#ff4466'; ctx.fillRect(82 + h * 11, 6, 8, 8); }
      // XP bar
      ctx.fillStyle = '#0e1e0e'; ctx.fillRect(120, 8, 72, 5);
      ctx.fillStyle = '#00ff88'; ctx.fillRect(120, 8, 50, 5);
      ctx.fillStyle = '#1a3a1a'; ctx.fillRect(170, 8, 22, 5);
      // Gems
      ctx.fillStyle = '#00ffee'; ctx.fillRect(204, 6, 6, 7);
      ctx.font = '5px "Press Start 2P",monospace';
      ctx.fillStyle = '#00ffee'; ctx.fillText('28', 214, 13);
      // Streak
      ctx.font = '5px monospace'; ctx.fillStyle = '#ff8c00'; ctx.fillText('🔥7', 256, 13);

      // ── WORLD ──────────────────────────────────────────────────────────────
      const FL = '#1d4d55', FLH = '#255e6a', WL = '#0d2a30', WLT = '#1a4550';
      const catFrac = (f % 300) / 300;
      const catTX = 1.2 + catFrac * 8.5, catTY = 4;

      for (let ty = 0; ty < MAP.length; ty++) {
        for (let tx = 0; tx < MAP[ty].length; tx++) {
          const tile = MAP[ty][tx];
          const px = tx * TILE, py = ty * TILE;

          if (tile === '#') {
            gr(px, py, TILE, TILE, WL);
            gr(px, py, TILE, 3, WLT);
            gr(px, py, TILE, 1, '#255e6a');
            gr(px + TILE - 1, py, 1, TILE, '#071820');
            gr(px, py + TILE - 2, TILE, 2, '#07181c');
            gr(px, py + TILE - 1, TILE, 1, '#000');
          } else {
            const h1 = (tx * 1664525 + ty * 1013904223) & 0x7fffffff;
            gr(px, py, TILE, TILE, (tx + ty) % 2 === 0 ? FL : FLH);
            gr(px, py, TILE, 1, '#0d2a30'); gr(px, py, 1, TILE, '#0d2a30');
            if (h1 % 9 === 0) {
              const on = ((f >> 3) + (h1 & 0xff)) % 4 < 2;
              if (on) { gr(px + 5, py + 5, 3, 3, '#00ffcc22'); gr(px + 6, py + 6, 1, 1, '#00ffcc88'); }
            }
            if (h1 % 7 === 0) {
              const fx = (h1>>8)%10+3, fy2 = (h1>>16)%10+3;
              gr(px+fx, py+fy2-1, 1, 1, '#ff88cc66'); gr(px+fx-1, py+fy2, 1, 1, '#ff88cc66');
              gr(px+fx+1, py+fy2, 1, 1, '#ff88cc66'); gr(px+fx, py+fy2+1, 1, 1, '#ff88cc66');
              gr(px+fx, py+fy2, 1, 1, '#ffffff44');
            }

            if (tile === 'T') {
              // Omori round canopy
              const tc = '#005a60', tH2 = '#00c8a0', tS2 = '#003840', tR = '#3a5a40';
              const rows: [number,number,number][] = [[1,4,8],[2,2,12],[3,1,14],[4,1,14],[5,1,14],[6,1,14],[7,2,12],[8,3,10],[9,5,6]];
              rows.slice(5).forEach(([row,x1,w])=>{if(x1+w<=TILE) gr(px+x1+1,py+row+1,w,1,'#000')});
              rows.forEach(([row,x1,w])=>{gr(px+x1-1,py+row,1,1,tS2); gr(px+x1+w,py+row,1,1,tS2);});
              rows.forEach(([row,x1,w])=>gr(px+x1,py+row,w,1,tc));
              [[5,5,8],[6,4,8]].forEach(([row,x1,w])=>gr(px+x1,py+row,w,1,tS2));
              gr(px+2,py+2,5,1,tH2); gr(px+2,py+3,3,1,tH2); gr(px+2,py+2,2,1,'#ffffff');
              [[5,4],[11,3],[4,6],[12,5],[7,8]].forEach(([dx,dy])=>gr(px+dx,py+dy,1,1,'#ffb8d8'));
              if((f+tx*7)%5===0) gr(px+9,py+2,1,1,'#ffffff');
              gr(px+6,py+10,4,4,tR); gr(px+7,py+10,2,4,shiftHex(tR,18)); gr(px+9,py+10,1,4,shiftHex(tR,-12));
            } else if (tile === 'L') {
              const on = Math.floor(f / 15) % 2 === 0;
              const ga = 0.18 + 0.18 * Math.sin(f * 0.07);
              ctx.globalAlpha = ga; gr(px - 3, py - 3, TILE + 6, TILE + 6, '#00ffcc'); ctx.globalAlpha = 1;
              const nc = on ? '#00ffcc' : '#00aa88';
              gr(px+6,py+2,4,2,nc); gr(px+4,py+4,8,2,nc); gr(px+2,py+6,12,4,nc);
              gr(px+4,py+10,8,2,nc); gr(px+6,py+12,4,2,nc);
              gr(px+4,py+4,8,8,'#001a15');
              if (on) { gr(px+5,py+5,2,2,'#88ffee'); gr(px+9,py+9,2,2,'#44ccaa'); }
              // "▲ STUDY" prompt
              const promptA = 0.6 + 0.4 * Math.abs(Math.sin(f * 0.06));
              ctx.globalAlpha = promptA;
              ctx.fillStyle = '#000c'; ctx.fillRect(px * S - 8, HUD_H + py * S - 14, 54, 12);
              ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1; ctx.strokeRect(px * S - 8, HUD_H + py * S - 14, 54, 12);
              ctx.font = '4px "Press Start 2P",monospace'; ctx.fillStyle = '#00ffcc';
              ctx.fillText('▲ STUDY', px * S - 5, HUD_H + py * S - 6);
              ctx.globalAlpha = 1;
            } else if (tile === 'E') {
              // Elliot (lab coat, glasses)
              const wf = Math.floor(f / 8) % 4;
              gr(px+3,py+4,10,12,'#e8e8e8');
              gr(px+4,py+16,4,wf<2?6:5,'#1a4a6a'); gr(px+9,py+16,4,wf<2?5:6,'#1a4a6a');
              gr(px+4,py-4,8,9,'#c68642');
              gr(px+3,py-6,10,5,'#1a1a1a');
              gr(px+4,py-1,4,2,'#00ffcc'); gr(px+9,py-1,4,2,'#00ffcc');
              gr(px+10,py+5,1,4,'#4444ff');
            } else if (tile === 'C') {
              // Enzyme cat (animated, walking)
              const catPX = ip(catTX * TILE), catPY = ip(catTY * TILE);
              const walkPhase = Math.floor(f / 8) % 4;
              const S2 = 1;
              const blink2 = f % 90 > 84;
              const cx2 = catPX + 8, by2 = catPY + 14;
              ctx.fillStyle = '#f0f0f0';
              ctx.fillRect((cx2-6)*S + 0, HUD_H + (by2-10)*S, 10*S, 8*S);
              ctx.fillRect((cx2-5)*S + 0, HUD_H + (by2-16)*S, 8*S, 7*S);
              ctx.fillRect((cx2-6)*S + 0, HUD_H + (by2-19)*S, 4*S, 3*S);
              ctx.fillRect((cx2+2)*S + 0, HUD_H + (by2-19)*S, 4*S, 3*S);
              ctx.fillStyle = '#ffb6c1';
              ctx.fillRect((cx2-5)*S, HUD_H + (by2-18)*S, 2*S, 2*S);
              ctx.fillRect((cx2+3)*S, HUD_H + (by2-18)*S, 2*S, 2*S);
              if (!blink2) {
                ctx.fillStyle = '#00bbaa';
                ctx.fillRect((cx2-2)*S, HUD_H + (by2-13)*S, S, S);
                ctx.fillRect((cx2+1)*S, HUD_H + (by2-13)*S, S, S);
              }
              ctx.fillStyle = '#c8c8c8';
              ctx.fillRect((cx2-7)*S, HUD_H + (by2-12)*S, 4*S, 1);
              ctx.fillRect((cx2+3)*S, HUD_H + (by2-12)*S, 4*S, 1);
              const tw = ip(Math.sin(f*0.1)*2); ctx.fillStyle='#f0f0f0';
              ctx.fillRect((cx2+4)*S+tw, HUD_H + (by2-7)*S, 4*S, S);
              ctx.fillStyle = '#e0e0e0';
              const l1=walkPhase<2?1:0, l2=walkPhase<2?0:1;
              ctx.fillRect((cx2-3)*S, HUD_H + (by2-2)*S+l1, 2*S, 4*S);
              ctx.fillRect((cx2+1)*S, HUD_H + (by2-2)*S+l2, 2*S, 4*S);
            }
          }
        }
      }

      // ── STATUS BAR ──────────────────────────────────────────────────────────
      const statY = HUD_H + WORLD_H;
      ctx.fillStyle = '#040d08'; ctx.fillRect(0, statY, W, STAT_H);
      ctx.fillStyle = '#0e2818'; ctx.fillRect(0, statY, W, 1);
      ctx.font = '4px "Press Start 2P",monospace';
      ctx.fillStyle = '#00ff88'; ctx.fillText('CYTOPLASM  LESSON 3/9', 6, statY + 9);
      ctx.fillStyle = '#1a4028'; ctx.fillRect(W - 66, statY + 4, 60, 6);
      ctx.fillStyle = '#00ff88'; ctx.fillRect(W - 66, statY + 4, 20, 6);
      ctx.font = '4px monospace'; ctx.fillStyle = '#2a6a3a'; ctx.fillText('3/9 to LYSO', W - 65, statY + 19);

      // ── SCANLINES ────────────────────────────────────────────────────────────
      for (let y = 0; y < H; y += 3) { ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, y, W, 1); }

      f++; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas ref={ref}
      style={{ imageRendering: 'pixelated', width: '100%', maxWidth: 528, display: 'block',
        border: '2px solid #0e3a1e', boxShadow: '0 0 0 1px #000, 0 0 40px rgba(0,255,136,0.18), 0 0 80px rgba(0,255,136,0.06)' }} />
  );
}

function shiftHex(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n>>16) + amt));
  const g = Math.max(0, Math.min(255, ((n>>8)&0xff) + amt));
  const b = Math.max(0, Math.min(255, (n&0xff) + amt));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CANVAS — pixel art illustration per feature card
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCanvas({ type }: { type: 'rpg' | 'science' | 'companion' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const W = 160, H = 100;
  useEffect(() => {
    const canvas = ref.current!; canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!; ctx.imageSmoothingEnabled = false;
    let f = 0, raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (type === 'rpg') {
        ctx.fillStyle = '#020c06'; ctx.fillRect(0, 0, W, H);
        // Stars
        [[8,6],[30,12],[60,4],[90,8],[120,3],[145,10],[15,25],[85,20]].forEach(([sx,sy]) => {
          const b = (f + sx * 3) % 45 < 22;
          ctx.fillStyle = b ? '#c8f044' : '#2a4a12'; ctx.fillRect(sx, sy, b ? 2 : 1, b ? 2 : 1);
        });
        // Boss defeated popup
        const popW = 130, popH = 68, popX = (W - popW) / 2, popY = (H - popH) / 2 - 4;
        const ga = 0.08 + 0.06 * Math.sin(f * 0.07);
        ctx.globalAlpha = ga; ctx.fillStyle = '#c8f044'; ctx.fillRect(popX - 4, popY - 4, popW + 8, popH + 8); ctx.globalAlpha = 1;
        ctx.fillStyle = '#050f08'; ctx.fillRect(popX, popY, popW, popH);
        ctx.strokeStyle = '#c8f044'; ctx.lineWidth = 2; ctx.strokeRect(popX, popY, popW, popH);
        ctx.strokeStyle = '#3a6a14'; ctx.lineWidth = 1; ctx.strokeRect(popX + 3, popY + 3, popW - 6, popH - 6);
        ctx.font = '6px "Press Start 2P",monospace'; ctx.textAlign = 'center';
        ctx.fillStyle = '#c8f044'; ctx.fillText('BOSS DEFEATED!', W / 2, popY + 17);
        ctx.fillStyle = '#00ffcc'; ctx.fillText('+500 XP', W / 2, popY + 32);
        ctx.fillStyle = '#ffcc00'; ctx.fillText('+20 💎', W / 2, popY + 46);
        ctx.fillStyle = '#888'; ctx.font = '5px "Press Start 2P",monospace';
        ctx.fillText('REALM 1 COMPLETE', W / 2, popY + 61);
        // Progress bar
        const prog = (f % 120) / 120;
        ctx.fillStyle = '#0a1e0a'; ctx.fillRect(12, H - 10, W - 24, 5);
        ctx.fillStyle = '#00ff88'; ctx.fillRect(12, H - 10, ip((W - 24) * prog), 5);
        ctx.textAlign = 'left';
      } else if (type === 'science') {
        ctx.fillStyle = '#01080e'; ctx.fillRect(0, 0, W, H);
        // DNA double helix
        const t2 = f * 0.045;
        for (let xi = 0; xi < W; xi += 2) {
          const y1 = H/2 + 22 * Math.sin((xi * 0.07) + t2);
          const y2 = H/2 + 22 * Math.sin((xi * 0.07) + t2 + Math.PI);
          ctx.fillStyle = '#1166bb'; ctx.fillRect(xi, ip(y1), 2, 2);
          ctx.fillStyle = '#11aa66'; ctx.fillRect(xi, ip(y2), 2, 2);
        }
        for (let xi = 10; xi < W; xi += 22) {
          const y1 = H/2 + 22 * Math.sin((xi * 0.07) + t2);
          const y2 = H/2 + 22 * Math.sin((xi * 0.07) + t2 + Math.PI);
          const bp = Math.floor(xi / 22) % 4;
          const mid = (y1 + y2) / 2;
          ctx.fillStyle = bp < 2 ? '#ff4422' : '#44cc44';
          ctx.fillRect(xi, ip(y1), 2, ip(mid - y1) + 1);
          ctx.fillStyle = bp < 2 ? '#4488ff' : '#ffcc00';
          ctx.fillRect(xi, ip(mid), 2, ip(y2 - mid) + 1);
        }
        ctx.font = '5px "Press Start 2P",monospace';
        ctx.fillStyle = '#ff4422'; ctx.fillText('A', 4, 14);
        ctx.fillStyle = '#4488ff'; ctx.fillText('T', 4, H - 5);
        ctx.fillStyle = '#44cc44'; ctx.fillText('G', W - 12, 14);
        ctx.fillStyle = '#ffcc00'; ctx.fillText('C', W - 12, H - 5);
        ctx.fillStyle = '#00ffcc44'; ctx.font = '4px monospace';
        ctx.fillText('REAL SCIENCE', 40, H - 5);
      } else {
        ctx.fillStyle = '#010a0f'; ctx.fillRect(0, 0, W, H);
        // Floor
        ctx.fillStyle = '#1d4d55'; ctx.fillRect(0, H - 20, W, 20);
        ctx.fillStyle = '#0d2a30'; ctx.fillRect(0, H - 21, W, 1);
        // Flower dots on floor
        [[20,H-22],[50,H-24],[90,H-22],[130,H-23],[155,H-21]].forEach(([fx,fy]) => {
          ctx.fillStyle = '#ff88cc'; ctx.fillRect(fx, fy, 2, 2);
        });
        // Speech bubble
        ctx.fillStyle = '#000c'; ctx.fillRect(36, 8, W - 46, 30);
        ctx.strokeStyle = '#ffaa44'; ctx.lineWidth = 1.5; ctx.strokeRect(36, 8, W - 46, 30);
        ctx.font = '5px monospace'; ctx.fillStyle = '#ffdd99';
        ctx.fillText("You've got this!", 40, 21); ctx.fillText("I believe in you!", 40, 32);
        ctx.fillStyle = '#ffaa44'; ctx.fillRect(54, 38, 2, 5);
        // Enzyme cat (small)
        const CS = 1.2, cx = 50, by2 = H - 22;
        const blink = f % 90 > 84;
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(ip(cx-5*CS), ip(by2-10*CS), ip(10*CS), ip(8*CS));
        ctx.fillRect(ip(cx-4*CS), ip(by2-16*CS), ip(8*CS), ip(7*CS));
        ctx.fillRect(ip(cx-5*CS), ip(by2-19*CS), ip(3*CS), ip(3*CS));
        ctx.fillRect(ip(cx+2*CS), ip(by2-19*CS), ip(3*CS), ip(3*CS));
        if (!blink) { ctx.fillStyle='#00bbaa'; ctx.fillRect(ip(cx-2*CS),ip(by2-13*CS),ip(CS),ip(CS)); ctx.fillRect(ip(cx+CS),ip(by2-13*CS),ip(CS),ip(CS)); }
        // Player
        const px2 = 110, py2 = H - 22;
        ctx.fillStyle = '#3a80cc'; ctx.fillRect(px2 - 5, py2, 10, 12);
        ctx.fillStyle = '#c68642'; ctx.fillRect(px2 - 4, py2 - 8, 8, 9);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px2 - 5, py2 - 10, 10, 5);
        ctx.fillStyle = '#00ffcc'; ctx.fillRect(px2 - 4, py2 - 5, 3, 2); ctx.fillRect(px2 + 2, py2 - 5, 3, 2);
        // XP popup
        const popRise = ip(8 * Math.abs(Math.sin(f * 0.04)));
        ctx.globalAlpha = Math.max(0, Math.sin(f * 0.04));
        ctx.font = '5px "Press Start 2P",monospace'; ctx.fillStyle = '#00ff88';
        ctx.fillText('+50XP', px2 - 10, py2 - 12 - popRise);
        ctx.globalAlpha = 1;
      }
      f++; raf = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, [type]);
  return <canvas ref={ref} width={W} height={H} style={{ imageRendering: 'pixelated', width: '100%', display: 'block' }} />;
}

// ─── Custom pixel cursor ──────────────────────────────────────────────────────
function PixelCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const sparks = useRef<Array<{x:number;y:number;vx:number;vy:number;life:number;col:string}>>([]);
  useEffect(() => {
    const canvas = ref.current!; const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const onResize = () => resize();
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        sparks.current.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a)*(2+Math.random()*3), vy: Math.sin(a)*(2+Math.random()*3), life: 1, col: i%2===0?'#00ffcc':'#39ff14' });
      }
    };
    window.addEventListener('resize', onResize); window.addEventListener('mousemove', onMove); window.addEventListener('click', onClick);
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.imageSmoothingEnabled = false;
      const { x, y } = pos.current;
      ctx.shadowColor = '#00ffcc'; ctx.shadowBlur = 6;
      ctx.fillStyle = '#00ffcc'; ctx.fillRect(x, y - 8, 2, 16);
      for (let r = 0; r < 4; r++) { const ry = y - 6 + r * 4; ctx.fillStyle = r%2===0?'#39ff14':'#00ffcc'; ctx.fillRect(x-4,ry,4,2); ctx.fillRect(x+2,ry,4,2); }
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y - 2, 2, 2); ctx.shadowBlur = 0;
      sparks.current = sparks.current.filter(p => p.life > 0);
      for (const p of sparks.current) {
        ctx.globalAlpha = p.life; ctx.fillStyle = p.col; ctx.fillRect(ip(p.x), ip(p.y), 3, 3);
        p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.05;
      }
      ctx.globalAlpha = 1; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMove); window.removeEventListener('click', onClick); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed',inset:0,zIndex:9999,pointerEvents:'none',imageRendering:'pixelated' }} />;
}

// ─── SparkLogo ────────────────────────────────────────────────────────────────
function SparkLogo() {
  const [spark, setSpark] = useState('⚡');
  useEffect(() => { const sparks = ['⚡','✦','✧','·','*','⚡','✦']; const id = setInterval(() => setSpark(sparks[Math.floor(Math.random()*sparks.length)]), 200); return () => clearInterval(id); }, []);
  return (
    <Link href="/" style={{ display:'flex',alignItems:'center',gap:4,textDecoration:'none' }}>
      <span style={{ fontSize:14,color:'#39ff14',fontFamily:"'Press Start 2P',monospace",textShadow:'0 0 12px #39ff1466' }}>BIT</span>
      <span style={{ fontSize:10,color:'#ffff55',fontFamily:"'Press Start 2P',monospace",minWidth:14,textAlign:'center' }}>{spark}</span>
      <span style={{ fontSize:14,color:'#00ffcc',fontFamily:"'Press Start 2P',monospace",textShadow:'0 0 12px #00ffcc66' }}>BIO</span>
    </Link>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function LandingNav({ onStart, isReturning }: { onStart:()=>void; isReturning:boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string|null>(null);
  const [arrowOffset, setArrowOffset] = useState(0);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 10); window.addEventListener('scroll', h, {passive:true}); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => { const id = setInterval(() => setArrowOffset(p => (p+1)%6), 120); return () => clearInterval(id); }, []);
  const NAV = [{label:'Game',href:'#realms'},{label:'Realms',href:'#realms'},{label:'Mentors',href:'#cast'},{label:'About',href:'#about'}];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background:scrolled?'rgba(1,8,16,0.97)':'rgba(1,8,16,0.88)', backdropFilter:'blur(10px)', borderBottom:scrolled?'1px solid rgba(0,255,150,0.12)':'1px solid transparent', height:60 }}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        <SparkLogo />
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(item=>(
            <a key={item.label} href={item.href}
              onMouseEnter={()=>setHovered(item.label)} onMouseLeave={()=>setHovered(null)}
              style={{ padding:'8px 14px',fontFamily:"'Press Start 2P',monospace",fontSize:8,color:hovered===item.label?'#b8e643':'#8899aa',textDecoration:'none',letterSpacing:'0.04em',position:'relative',display:'inline-block' }}>
              {item.label}
              <span style={{ position:'absolute',bottom:4,left:'50%',transform:'translateX(-50%)',height:2,background:'#b8e643',width:hovered===item.label?'80%':'0%',transition:'width 0.12s steps(4)',display:'block' }} />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onStart} style={{ background:'none',border:'none',cursor:'pointer',fontFamily:"'Press Start 2P',monospace",fontSize:8,color:'#8899aa',padding:'8px 12px',letterSpacing:'0.04em' }}
            onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='#8899aa')}>
            {isReturning?'CONTINUE':'SIGN IN'}
          </button>
          <button onClick={onStart}
            style={{ background:'#b8e643',border:'2px solid #8ab022',color:'#0a1a00',fontFamily:"'Press Start 2P',monospace",fontSize:8,padding:'10px 20px',cursor:'pointer',letterSpacing:'0.04em',boxShadow:'0 3px 0 #4a7000' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#cef855'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='#b8e643'; e.currentTarget.style.transform='translateY(0)'; }}>
            {isReturning?'RESUME':'START FREE'} →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Realm mini preview canvas ────────────────────────────────────────────────
function RealmMiniCanvas({ realm, bg }: { realm:number; bg:string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!; canvas.width = 200; canvas.height = 90;
    const ctx = canvas.getContext('2d')!; ctx.imageSmoothingEnabled = false;
    let f = 0; let raf: number;
    const draw = () => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 200, 90);
      if (realm === 1) {
        ctx.fillStyle='#1a4a5a'; ctx.beginPath(); ctx.ellipse(100,45,36,28,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#00ffcc44'; ctx.beginPath(); ctx.ellipse(100,45,22,16,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#00ffcc'; ctx.beginPath(); ctx.ellipse(100,45,10,8,0,0,Math.PI*2); ctx.fill();
        const t2=f*0.04;
        const organelles: [number,number,number,string][] = [[1.0,28,18,'#cc3300'],[2.1,20,12,'#39ff14'],[3.4,32,14,'#aa44ff'],[4.8,24,10,'#ffcc00']];
        organelles.forEach(([phase,rx,ry,col])=>{
          const ox=ip(100+rx*Math.cos(t2+phase)), oy=ip(45+ry*Math.sin(t2+phase));
          ctx.fillStyle=col; ctx.fillRect(ox-4,oy-2,8,4);
        });
      } else if (realm === 2) {
        ctx.strokeStyle='#1166bb'; ctx.lineWidth=2; ctx.beginPath();
        for (let xi=0;xi<200;xi+=2) { const y=45+20*Math.sin((xi*0.06)+f*0.06); xi===0?ctx.moveTo(xi,y):ctx.lineTo(xi,y); } ctx.stroke();
        ctx.strokeStyle='#11aa66'; ctx.lineWidth=2; ctx.beginPath();
        for (let xi=0;xi<200;xi+=2) { const y=45+20*Math.sin((xi*0.06)+f*0.06+Math.PI); xi===0?ctx.moveTo(xi,y):ctx.lineTo(xi,y); } ctx.stroke();
        for (let xi=10;xi<200;xi+=20) {
          const y1=45+20*Math.sin((xi*0.06)+f*0.06), y2=45+20*Math.sin((xi*0.06)+f*0.06+Math.PI);
          ctx.strokeStyle=xi%40===10?'#ff4422':'#44cc44'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(xi,y1); ctx.lineTo(xi,y2); ctx.stroke();
        }
      } else if (realm === 3) {
        const nodes=[[40,25],[100,15],[160,25],[30,65],[80,60],[130,55],[170,65],[100,45]];
        const edges=[[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[0,4],[1,4],[2,5],[3,6]];
        for (const [a,b] of edges) {
          const pulse=(Math.sin(f*0.08+a*0.7)>0.3)?0.8:0.2;
          ctx.strokeStyle=`rgba(170,85,255,${pulse})`; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(nodes[a][0],nodes[a][1]); ctx.lineTo(nodes[b][0],nodes[b][1]); ctx.stroke();
        }
        for (const [nx,ny] of nodes) {
          const glow=Math.sin(f*0.06+nx*0.05)>0.4;
          ctx.fillStyle=glow?'#aa44ff':'#552288'; ctx.beginPath(); ctx.arc(nx,ny,4,0,Math.PI*2); ctx.fill();
          if (glow) { ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(nx,ny,2,0,Math.PI*2); ctx.fill(); }
        }
      } else {
        const settle=Math.min(f/120,1);
        for (let i=0;i<14;i++) {
          const angle=(i/14)*Math.PI*4*(settle)+(f*0.01), rx=settle*22, ry=settle*16;
          const cx=ip(100+rx*Math.cos(angle)*(0.3+settle*0.7)), cy=ip(45+ry*Math.sin(angle)+i*(settle>0.5?2:4)*(1-settle));
          ctx.fillStyle=i%3===0?'#c0a0ff':i%3===1?'#ffaa00':'#ff88cc'; ctx.fillRect(cx-3,cy-3,6,6);
          if (i>0) {
            const pangle=((i-1)/14)*Math.PI*4*(settle)+(f*0.01), px2=ip(100+rx*Math.cos(pangle)*(0.3+settle*0.7)), py2=ip(45+ry*Math.sin(pangle)+(i-1)*(settle>0.5?2:4)*(1-settle));
            ctx.strokeStyle='#604080'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(px2,py2); ctx.lineTo(cx,cy); ctx.stroke();
          }
        }
      }
      f++; raf=requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, [realm, bg]);
  return <canvas ref={ref} width={200} height={90} style={{ imageRendering:'pixelated',width:'100%',display:'block',borderBottom:'1px solid rgba(255,255,255,0.05)' }} />;
}

// ─── Animated stat counter ─────────────────────────────────────────────────────
function AnimStat({ target, suffix, label }: { target:number|null; suffix:string; label:string }) {
  const [val, setVal] = useState(0); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      if (target === null) { setVal(100); observer.disconnect(); return; }
      const end = target, dur = 1200, st = performance.now();
      const tick = (now: number) => { const p=Math.min((now-st)/dur,1), eased=1-Math.pow(1-p,3); setVal(Math.floor(eased*end)); if (p<1) requestAnimationFrame(tick); else setVal(end); };
      requestAnimationFrame(tick); observer.disconnect();
    }, {threshold:0.3});
    observer.observe(el); return () => observer.disconnect();
  }, [target]);
  return (
    <div ref={ref} style={{ textAlign:'center' }}>
      <div style={{ fontSize:'clamp(28px,4vw,44px)',color:'#b8e643',fontFamily:"'Press Start 2P',monospace",marginBottom:12 }}>{target===null?`100${suffix}`:`${val}${suffix}`}</div>
      <div style={{ fontSize:'clamp(10px,1.2vw,14px)',color:'#4a6a50',fontFamily:"'Courier New',monospace",lineHeight:1.5,letterSpacing:'0.04em' }}>{label}</div>
    </div>
  );
}

// ─── Gallery canvas ───────────────────────────────────────────────────────────
function GalleryCanvas({ scene }: { scene:number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const W = 200, H = 200;
  useEffect(() => {
    const canvas = ref.current!; canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!; ctx.imageSmoothingEnabled = false;
    let f = 0; let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (scene === 1) {
        ctx.fillStyle='#1a3a44'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#2a6070'; ctx.fillRect(0,140,W,60);
        ctx.fillStyle='#550800'; ctx.beginPath(); ctx.ellipse(140,100,45,28,0.3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#992200'; ctx.beginPath(); ctx.ellipse(140,100,38,22,0.3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#cc3300'; ctx.beginPath(); ctx.ellipse(140,100,30,16,0.3,0,Math.PI*2); ctx.fill();
        const co=Math.floor(f/30)%2; ctx.fillStyle='#ff4400'; [100,114,128].forEach(cx2=>ctx.fillRect(cx2+co,86,2,28));
        ctx.fillStyle='#ffcc00'; [[120,90],[140,88],[160,92]].forEach(([ax,ay])=>ctx.fillRect(ax,ay,3,3));
        const walkX=40+Math.sin(f*0.04)*8;
        ctx.fillStyle='#e8e8e8'; ctx.fillRect(ip(walkX-8),105,16,28);
        ctx.fillStyle='#1a4a6a'; ctx.fillRect(ip(walkX-4),120,4,14); ctx.fillRect(ip(walkX+1),120,4,14);
        ctx.fillStyle='#c68642'; ctx.fillRect(ip(walkX-6),90,12,14); ctx.fillStyle='#1a1a1a'; ctx.fillRect(ip(walkX-7),88,14,6);
        ctx.fillStyle='#00ffcc'; ctx.fillRect(ip(walkX-5),95,4,3); ctx.fillRect(ip(walkX+1),95,4,3);
        ctx.fillStyle='#4444ff'; ctx.fillRect(ip(walkX+3),107,1,5);
        if (Math.abs(walkX-80)<20) { ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.fillRect(ip(walkX-30),70,80,16); ctx.fillStyle='#00ffcc'; ctx.font='6px monospace'; ctx.fillText('The powerhouse!!',ip(walkX-28),81); }
      } else if (scene === 2) {
        ctx.fillStyle='#162a0a'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#0a1606'; ctx.fillRect(0,130,W,70);
        // Omori-style round trees
        [[30,130,80],[80,130,100],[130,130,90],[170,130,70]].forEach(([tx,ty,th])=>{
          const rows2:number[][] = [[1,tx-6,12],[2,tx-8,16],[3,tx-9,18],[4,tx-9,18],[5,tx-8,16],[6,tx-7,14],[7,tx-5,10]];
          rows2.forEach(([row,x1,w])=>{ctx.fillStyle='#3a8a30';ctx.fillRect(x1,ty-th+row*6,w,6);});
          ctx.fillStyle='#56b048'; ctx.fillRect(tx-8,ty-th+6,16,6);
          ctx.fillStyle='#88ff66'; ctx.fillRect(tx-7,ty-th+3,6,4);
          // Pink flower dots
          [[tx-2,ty-th+12],[tx+4,ty-th+8],[tx-4,ty-th+24]].forEach(([fx,fy])=>{ ctx.fillStyle='#ffb8d8'; ctx.fillRect(fx,fy,2,2); });
          ctx.fillStyle='#2a5520'; ctx.fillRect(tx-2,ty-th+th*0.7,4,th*0.3);
        });
        const bx=60+Math.sin(f*0.03)*30;
        ctx.fillStyle='#1a5a28'; ctx.fillRect(ip(bx-7),108,14,26); ctx.fillStyle='#8a6030'; ctx.fillRect(ip(bx-5),120,4,14); ctx.fillRect(ip(bx+2),120,4,14);
        ctx.fillStyle='#c68642'; ctx.fillRect(ip(bx-5),92,10,14); ctx.fillStyle='#1a1a1a'; ctx.fillRect(ip(bx-6),90,12,5);
        ctx.fillStyle='#d4a850'; ctx.fillRect(ip(bx+6),110,10,7); ctx.fillStyle='#228822'; ctx.fillRect(ip(bx+6),112,10,2); ctx.fillStyle='#cc4422'; ctx.fillRect(ip(bx+6),114,10,1);
        ctx.fillStyle='#051a2a'; ctx.beginPath(); ctx.moveTo(0,145); for (let xi=0;xi<W;xi+=4) ctx.lineTo(xi,145+Math.sin(xi*0.1+f*0.04)*4); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.fill();
      } else if (scene === 3) {
        ctx.fillStyle='#030008'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#1a0838'; ctx.fillRect(50,120,100,14); ctx.fillStyle='#aa44ff'; ctx.fillRect(50,120,100,3);
        const t2=f*0.05;
        for (let i=0;i<12;i++) {
          const sx=ip(20+Math.sin(t2+i*0.8)*80), sy=ip(40+Math.cos(t2*0.7+i*0.6)*60);
          const sx2=ip(100+Math.sin(t2*1.2+i*0.5)*60), sy2=ip(80+Math.cos(t2+i*0.9)*50);
          const alpha=0.3+0.5*Math.abs(Math.sin(t2+i));
          ctx.strokeStyle=`rgba(170,68,255,${alpha.toFixed(2)})`; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx2,sy2); ctx.stroke();
          ctx.fillStyle=`rgba(200,150,255,${alpha.toFixed(2)})`; ctx.fillRect(sx-2,sy-2,4,4);
        }
        ctx.fillStyle='#222222'; ctx.fillRect(85,80,16,26); ctx.fillStyle='#8a6030'; ctx.fillRect(87,92,5,14); ctx.fillRect(93,92,5,14);
        ctx.fillStyle='#c68642'; ctx.fillRect(84,66,14,14); ctx.fillStyle='#111111'; ctx.fillRect(83,64,16,5);
        ctx.fillStyle='#f0e0d0'; ctx.fillRect(100,84,7,8); ctx.fillStyle='#6b3a2a'; ctx.fillRect(101,85,5,6);
        if (f%40<20) { ctx.fillStyle='rgba(255,200,100,0.6)'; ctx.fillRect(101,79,2,4); ctx.fillRect(104,77,2,6); }
        for (let i=0;i<30;i++) { const sx=ip(((i*37+11)%200)), sy=ip(((i*13+7)%100)); const blink2=Math.sin(f*0.06+i*0.7)>0.5; ctx.fillStyle=blink2?'#ffffff':'#444488'; ctx.fillRect(sx,sy,1,1); }
      } else {
        ctx.fillStyle='#040210'; ctx.fillRect(0,0,W,H);
        [[20,0,14,H],[W-34,0,14,H]].forEach(([px,py,pw,ph])=>{ ctx.fillStyle='#1a1028'; ctx.fillRect(Number(px),Number(py),Number(pw),Number(ph)); ctx.fillStyle='#241840'; ctx.fillRect(Number(px),Number(py),2,Number(ph)); });
        ctx.fillStyle='#2a1a3a'; ctx.fillRect(60,130,80,30); ctx.fillStyle='#c0a0ff'; ctx.fillRect(60,130,80,4);
        const t3=f*0.05;
        for (let i=0;i<8;i++) { const a=t3+i*(Math.PI*2/8), gx=ip(100+28*Math.cos(a)), gy=ip(90+16*Math.sin(a)), pulse=0.5+0.5*Math.sin(t3*2+i); ctx.fillStyle=`rgba(255,180,0,${(0.4+pulse*0.5).toFixed(2)})`; ctx.fillRect(gx-2,gy-2,4,4); }
        const flicker=f%3===0?0.45:f%3===1?0.7:0.55; ctx.globalAlpha=flicker;
        ctx.fillStyle='#00ffcc'; ctx.fillRect(86,60,28,14); ctx.fillStyle='#e0e0ff'; ctx.fillRect(86,60,28,4);
        ctx.fillStyle='#ffffff'; ctx.fillRect(89,65,6,5); ctx.fillRect(101,65,6,5); ctx.fillStyle='#00cccc'; ctx.fillRect(84,74,32,28); ctx.fillRect(76,74,8,22); ctx.fillRect(116,74,8,22);
        if (f%4===0) { ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillRect(92,58,2,42); ctx.fillRect(106,58,2,42); }
        ctx.globalAlpha=1;
        [[60,0,25,40,'rgba(255,100,0,0.15)'],[95,0,25,40,'rgba(0,200,255,0.15)'],[130,0,25,40,'rgba(170,85,255,0.15)']].forEach(([gx2,gy2,gw2,gh2,gc2])=>{ ctx.fillStyle=String(gc2); ctx.fillRect(Number(gx2),Number(gy2),Number(gw2),Number(gh2)); });
      }
      f++; raf = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, [scene]);
  return <canvas ref={ref} width={W} height={H} style={{ imageRendering:'pixelated',width:'100%',display:'block' }} />;
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); } }, {threshold:0.12});
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const TICKER_TEXT = 'ADENINE • THYMINE • GUANINE • CYTOSINE • PROTEIN • RIBOSOME • ATP • DNA • RNA • CRISPR • GRADIENT • BACKPROP • ALPHAFOLD • MRNA • HELIX • NEURON • CODON • EXON • SYNAPSE • ';

const REALMS = [
  { name:'The Cytoplasm', num:1, color:'#00ffcc', emoji:'🔬', mentor:'Elliot', mentorQuip:'"Mitochondria is the powerhouse of the cell. I will say it forever."', topics:['Cell biology','Organelles','ATP synthesis','Membrane dynamics','Cell cycle'], desc:'Enter a living cell. Navigate organelle rooms, cross lysosome acid pools, and defend against a rogue protease.', bg:'#020a0e' },
  { name:'Genome Forest', num:2, color:'#52d483', emoji:'🌿', mentor:'Ben', mentorQuip:'"DNA double helix? More like a double helix of DELICIOUS information."', topics:['DNA sequencing','BLAST','RNA-seq','CRISPR','Population genetics'], desc:'Navigate ancient helix trees, decode corrupted sequences, and cross the RNA River to reach the gene vault.', bg:'#020a04' },
  { name:'Neural Nebula', num:3, color:'#a855f7', emoji:'🌌', mentor:'Alex', mentorQuip:'"*sips fourth coffee* Back-propagation is just coffee flowing in reverse."', topics:['Neural networks','Transformers','CNNs','Overfitting','PyTorch'], desc:'Float through deep space platforms. Train models that actually generalize. Face the OVERFIT.', bg:'#03000c' },
  { name:'Protein Cathedral', num:4, color:'#c0a0ff', emoji:'🏛️', mentor:'Henry', mentorQuip:'"*flickers* Greetings. I am definitely not a hologram. Achoo!"', topics:['Protein structure','AlphaFold','Drug discovery','GNNs','Systems biology'], desc:"Explore a gothic cathedral of misfolded proteins. Henry's holographic form waits at the grand altar.", bg:'#040210' },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, onboardingComplete, progress } = useGameStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isReturning = isAuthenticated && onboardingComplete;
  const handleStart = useCallback(() => {
    if (isAuthenticated && onboardingComplete) router.push(`/realm/${progress.currentRealm}`);
    else router.push('/onboarding/character');
  }, [isAuthenticated, onboardingComplete, progress.currentRealm, router]);

  const statsReveal = useReveal(), realmsReveal = useReveal(), featuresReveal = useReveal();
  const galleryReveal = useReveal(), stepsReveal = useReveal(), castReveal = useReveal();
  const testimonialsReveal = useReveal();

  return (
    <div style={{ background:'#010810',color:'#e5e7eb',fontFamily:"'Press Start 2P','Courier New',monospace",cursor:'none' }}>
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes pixelIn{0%{opacity:0;filter:blur(6px) brightness(2);}100%{opacity:1;filter:none;}}
        .px-reveal{animation:pixelIn 0.45s steps(6) forwards;}
        @keyframes tickerScroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        .ticker-track{display:flex;white-space:nowrap;animation:tickerScroll 28s linear infinite;}
        @keyframes floatUp{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        .float-anim{animation:floatUp 3s ease-in-out infinite;}
        @keyframes scanPulse{0%,100%{opacity:0.06;}50%{opacity:0.12;}}
        .scanlines::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,0.09) 3px,rgba(0,0,0,0.09) 4px);pointer-events:none;animation:scanPulse 4s ease-in-out infinite;}
      `}} />
      <PixelCursor />
      <LandingNav onStart={handleStart} isReturning={isReturning} />

      {/* ══════════════════ HERO — SPLIT LAYOUT ════════════════════════════════ */}
      <section style={{ position:'relative', minHeight:'100vh', overflow:'hidden' }}>
        <BiologySceneCanvas />
        {/* Gradient fade at bottom */}
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'28%',background:'linear-gradient(to bottom,transparent,#010810)',pointerEvents:'none' }} />

        {/* Hero content */}
        <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',paddingTop:60,paddingLeft:'clamp(16px,5vw,80px)',paddingRight:'clamp(16px,5vw,80px)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(24px,4vw,64px)', alignItems:'center', maxWidth:1200, width:'100%', margin:'0 auto' }}>

            {/* Left: text */}
            <div style={{ pointerEvents:'none' }}>
              <div style={{ display:'inline-block',background:'rgba(184,230,67,0.12)',border:'1px solid #b8e64344',padding:'5px 14px',fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,1vw,9px)',color:'#b8e643',letterSpacing:'0.25em',marginBottom:20,opacity:mounted?1:0,transition:'opacity 0.5s' }}>
                THE BIOLOGY RPG
              </div>
              <h1 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(28px,5.5vw,72px)',lineHeight:1.15,marginBottom:20,opacity:mounted?1:0,transition:'opacity 0.7s 0.1s' }}>
                <span style={{ display:'block',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00,6px 6px 0 #0f1e00' }}>Biology</span>
                <span style={{ display:'block',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00,6px 6px 0 #0f1e00' }}>Adventure</span>
              </h1>
              <p style={{ fontFamily:"'Courier New',monospace",fontSize:'clamp(12px,1.4vw,16px)',color:'#8aaa80',marginBottom:10,opacity:mounted?1:0,transition:'opacity 0.7s 0.18s',lineHeight:1.7,maxWidth:460 }}>
                The most immersive way to learn biology. Walk through living cells. Decode real genomes. Defeat rogue proteins. ✦
              </p>
              <p style={{ fontFamily:"'Courier New',monospace",fontSize:'clamp(11px,1.1vw,13px)',color:'#4a6a50',marginBottom:32,opacity:mounted?1:0,transition:'opacity 0.7s 0.22s',lineHeight:1.6,maxWidth:440 }}>
                Pokémon meets real science. Explore 4 realms, master 36 lessons, defeat 4 bosses — all in one living, breathing pixel world.
              </p>
              <div style={{ display:'flex',gap:12,flexWrap:'wrap',opacity:mounted?1:0,transition:'opacity 0.7s 0.3s',pointerEvents:'all' }}>
                <button onClick={handleStart}
                  style={{ background:'#b8e643',border:'3px solid #7ab010',color:'#0a1800',fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(9px,1.2vw,12px)',padding:'clamp(12px,1.8vw,18px) clamp(24px,3.5vw,44px)',cursor:'none',letterSpacing:'0.06em',boxShadow:'0 4px 0 #4a7000,0 0 40px #b8e64344',transition:'background 0.1s,transform 0.08s,box-shadow 0.1s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='#cef855'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 0 #4a7000,0 0 60px #c8f04455'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='#b8e643'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 0 #4a7000,0 0 40px #b8e64344'; }}>
                  {isReturning?'CONTINUE JOURNEY →':'BEGIN JOURNEY →'}
                </button>
                <a href="#realms" style={{ display:'flex',alignItems:'center',padding:'clamp(12px,1.8vw,18px) clamp(20px,2.5vw,32px)',border:'2px solid #2a4a30',color:'#7aaa6a',fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(8px,1vw,10px)',textDecoration:'none',letterSpacing:'0.04em',cursor:'none',transition:'border-color 0.1s,color 0.1s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='#7aaa6a'; e.currentTarget.style.color='#c8f044'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='#2a4a30'; e.currentTarget.style.color='#7aaa6a'; }}>
                  SEE REALMS ↓
                </a>
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:20,marginTop:32,opacity:mounted?0.6:0,transition:'opacity 0.8s 0.5s',flexWrap:'wrap' }}>
                {[['4','REALMS'],['36','LESSONS'],['4','BOSSES'],['40+','ITEMS']].map(([n,l])=>(
                  <div key={l} style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(14px,2vw,20px)',color:'#b8e643' }}>{n}</div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:9,color:'#3a5a3a',letterSpacing:'0.1em',marginTop:3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: live game preview */}
            <div style={{ display:'flex',flexDirection:'column',gap:12,opacity:mounted?1:0,transition:'opacity 0.8s 0.35s',pointerEvents:'none' }}>
              <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:7,color:'#2a5a3a',letterSpacing:'0.2em',marginBottom:4,display:'flex',alignItems:'center',gap:8 }}>
                <span style={{ display:'inline-block',width:6,height:6,background:'#00ff88',borderRadius:'50%',boxShadow:'0 0 6px #00ff88' }} />
                LIVE PREVIEW — REALM 1: CYTOPLASM
              </div>
              <div className="float-anim">
                <GamePreviewCanvas />
              </div>
              <div style={{ display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap' }}>
                {['↑↓←→ MOVE','E INTERACT','SPACE JUMP'].map(k=>(
                  <span key={k} style={{ fontFamily:"'Courier New',monospace",fontSize:9,color:'#2a5a3a',border:'1px solid #1a3a22',padding:'3px 8px',letterSpacing:'0.05em' }}>{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ PROOF BAR ═══════════════════════════════════════════ */}
      <div ref={statsReveal.ref}>
        <section style={{ background:'#050e08',borderTop:'2px solid #1a3a20',borderBottom:'2px solid #1a3a20',padding:'48px 24px',position:'relative',overflow:'hidden' }} className={statsReveal.visible?'px-reveal':''}>
          <div style={{ position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,0.15) 3px,rgba(0,0,0,0.15) 4px)',pointerEvents:'none' }} />
          <div style={{ maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:40,position:'relative',zIndex:2 }}>
            <AnimStat target={500} suffix="+" label="Interactive exercises" />
            <AnimStat target={4}   suffix=""  label="Immersive realms" />
            <AnimStat target={36}  suffix=""  label="Lessons & quests" />
            <AnimStat target={null} suffix="%" label="Free to play" />
          </div>
        </section>
      </div>

      {/* ══════════════════ WHY BITBIO — 3 FEATURE PILLARS ══════════════════════ */}
      <div ref={featuresReveal.ref}>
        <section style={{ padding:'clamp(60px,8vw,100px) 24px',background:'#010c08',position:'relative' }} className={featuresReveal.visible?'px-reveal':''}>
          <div style={{ maxWidth:1100,margin:'0 auto' }}>
            <div style={{ textAlign:'center',marginBottom:64 }}>
              <p style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,1vw,10px)',color:'#2a6a3a',letterSpacing:'0.3em',marginBottom:18 }}>WHY BITBIO</p>
              <h2 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(18px,3.5vw,38px)',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00',lineHeight:1.3 }}>Learning That Feels Like Play</h2>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:32 }}>
              {[
                { type:'rpg' as const, color:'#c8f044', title:'RPG Progression', sub:'No textbooks. No lectures.', desc:'Every lesson is a quest. Every answer earns XP and gems. Every realm ends in a boss fight that tests everything you\'ve learned. Progress feels earned — because it is.' },
                { type:'science' as const, color:'#00ffcc', title:'Real Biology', sub:'Peer-reviewed curriculum.', desc:'The science in BitBio is real: actual DNA base pairs, real CRISPR mechanics, actual protein folding physics. You\'re not playing a biology game. You\'re studying biology through a game.' },
                { type:'companion' as const, color:'#ffaa44', title:'Never Alone', sub:'Enzyme is with you.', desc:'Enzyme, your white cat companion with teal eyes, walks every realm with you. She has opinions about ribosomes. She will jump through portals before you\'re ready. She will catch you every time.' },
              ].map(({ type, color, title, sub, desc }) => (
                <div key={type} style={{ background:'#050f08',border:`2px solid ${color}22`,overflow:'hidden',transition:'border-color 0.15s,transform 0.12s,box-shadow 0.15s',cursor:'none' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'66'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 12px 40px ${color}18`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=color+'22'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                  <FeatureCanvas type={type} />
                  <div style={{ padding:24 }}>
                    <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:10,color,marginBottom:8,lineHeight:1.5 }}>{title}</div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:11,color:color+'aa',marginBottom:12,letterSpacing:'0.04em' }}>{sub}</div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:12,color:'#4a7a55',lineHeight:1.8 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════ REALMS ══════════════════════════════════════════════ */}
      <div ref={realmsReveal.ref}>
        <section id="realms" style={{ padding:'clamp(60px,8vw,100px) 24px',background:'#010c06' }} className={realmsReveal.visible?'px-reveal':''}>
          <div style={{ maxWidth:1200,margin:'0 auto' }}>
            <div style={{ textAlign:'center',marginBottom:64 }}>
              <p style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,1vw,10px)',color:'#2a6a3a',letterSpacing:'0.3em',marginBottom:18 }}>YOUR ADVENTURE AWAITS</p>
              <h2 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(18px,3.5vw,38px)',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00',lineHeight:1.3 }}>Explore Four Realms</h2>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24 }}>
              {REALMS.map(realm=>(
                <div key={realm.name} onClick={handleStart}
                  style={{ background:realm.bg,border:`2px solid ${realm.color}33`,overflow:'hidden',position:'relative',cursor:'none',transition:'border-color 0.15s,transform 0.12s,box-shadow 0.15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=realm.color+'88'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 40px ${realm.color}22`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=realm.color+'33'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                  <RealmMiniCanvas realm={realm.num} bg={realm.bg} />
                  <div style={{ padding:24,position:'relative' }}>
                    <div style={{ position:'absolute',top:0,right:0,width:80,height:80,background:`radial-gradient(circle at top right,${realm.color}18,transparent)`,pointerEvents:'none' }}/>
                    <div style={{ fontSize:28,marginBottom:12 }}>{realm.emoji}</div>
                    <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:9,color:realm.color,marginBottom:10,lineHeight:1.6 }}>{realm.name}</div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:12,color:'#4a7a60',marginBottom:14,lineHeight:1.75 }}>{realm.desc}</div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:10,color:'#3a5a40',marginBottom:12 }}>MENTOR: <span style={{color:realm.color}}>{realm.mentor}</span></div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:9,color:realm.color+'aa',marginBottom:14,lineHeight:1.6,fontStyle:'italic' }}>{realm.mentorQuip}</div>
                    <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                      {realm.topics.map(t=><span key={t} style={{ background:'#ffffff06',border:`1px solid ${realm.color}28`,color:realm.color+'cc',fontFamily:"'Courier New',monospace",fontSize:9,padding:'3px 8px' }}>{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════ GALLERY ═════════════════════════════════════════════ */}
      <div ref={galleryReveal.ref}>
        <section style={{ padding:'clamp(60px,8vw,100px) 24px',background:'#02060e' }} className={galleryReveal.visible?'px-reveal':''}>
          <div style={{ maxWidth:1000,margin:'0 auto' }}>
            <div style={{ textAlign:'center',marginBottom:56 }}>
              <p style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,1vw,10px)',color:'#2a4455',letterSpacing:'0.3em',marginBottom:18 }}>PIXEL ART GALLERY</p>
              <h2 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(18px,3vw,34px)',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00',lineHeight:1.3 }}>Meet Your Mentors</h2>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20 }}>
              {[
                {scene:1,color:'#00ffcc',name:'Elliot',quote:'"The mitochondria is the powerhouse of the cell. And my entire personality."'},
                {scene:2,color:'#52d483',name:'Ben',quote:'"I eat sandwiches and sequence genomes. Not always in that order."'},
                {scene:3,color:'#a855f7',name:'Alex',quote:'"Caffeine is just liquid gradient descent for my neurons."'},
                {scene:4,color:'#c0a0ff',name:'Henry',quote:'"I am completely, unambiguously, 100% not a hologram. *flickers*"'},
              ].map(({scene,color,name,quote})=>(
                <div key={name} style={{ border:`2px solid ${color}22`,overflow:'hidden',transition:'transform 0.12s,box-shadow 0.15s',cursor:'none' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow=`0 0 30px ${color}33`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}>
                  <GalleryCanvas scene={scene} />
                  <div style={{ padding:'14px 16px',background:'#010810' }}>
                    <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:9,color,marginBottom:8 }}>{name}</div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:10,color:color+'88',lineHeight:1.6,fontStyle:'italic' }}>{quote}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════ HOW IT WORKS ════════════════════════════════════════ */}
      <div ref={stepsReveal.ref}>
        <section style={{ padding:'clamp(60px,8vw,100px) 24px',background:'#010810' }} className={stepsReveal.visible?'px-reveal':''}>
          <div style={{ maxWidth:900,margin:'0 auto' }}>
            <div style={{ textAlign:'center',marginBottom:64 }}>
              <p style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,1vw,10px)',color:'#2a4456',letterSpacing:'0.3em',marginBottom:18 }}>YOUR JOURNEY</p>
              <h2 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(18px,3.5vw,38px)',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00',lineHeight:1.3 }}>How It Works</h2>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:36 }}>
              {[
                {step:'01',icon:'🎮',title:'Choose Your Avatar',desc:'Design your character — skin, hair, outfit. Your avatar walks every realm alongside Enzyme, your white cat companion.',color:'#00ffcc'},
                {step:'02',icon:'🗺️',title:'Explore the World',desc:'Move through 40×28 tile maps — organelle rooms, DNA forest clearings, neural platform hubs, protein cathedral naves.',color:'#52d483'},
                {step:'03',icon:'📚',title:'Learn Through Quests',desc:'Approach glowing lesson nodes. Answer real biology questions. Earn XP, gems, and lore entries in your Codex.',color:'#a855f7'},
                {step:'04',icon:'⚔️',title:'Defeat the Realm Boss',desc:'Complete all 9 nodes to unlock the boss gate. Defeat LYSO, VIRON, OVERFIT, and AMYLOID TYRANT.',color:'#c0a0ff'},
                {step:'05',icon:'🔬',title:'Unlock Research Tree',desc:'Spend XP on 24 research nodes — from Cell Theory to Foundation Models. Build your personal knowledge graph.',color:'#ffaa00'},
                {step:'06',icon:'🏆',title:'Earn Your Certificate',desc:'Defeat all 4 bosses for your completion certificate. 50+ achievements to collect along the way.',color:'#ff5599'},
              ].map(({step,icon,title,desc,color})=>(
                <div key={step} style={{ display:'flex',gap:20,alignItems:'flex-start' }}>
                  <div style={{ flexShrink:0 }}>
                    <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:28,lineHeight:1,color,opacity:0.18,marginBottom:10 }}>{step}</div>
                    <div style={{ fontSize:28 }}>{icon}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:9,color,marginBottom:12,lineHeight:1.6 }}>{title}</div>
                    <div style={{ fontFamily:"'Courier New',monospace",fontSize:12,color:'#4a6a55',lineHeight:1.8 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════ DIALOGUE TESTIMONIALS ════════════════════════════════ */}
      <div ref={testimonialsReveal.ref}>
        <section style={{ padding:'clamp(60px,8vw,100px) 24px',background:'#050e08',borderTop:'2px solid #0e2814',borderBottom:'2px solid #0e2814' }} className={testimonialsReveal.visible?'px-reveal':''}>
          <div style={{ maxWidth:900,margin:'0 auto' }}>
            <div style={{ textAlign:'center',marginBottom:56 }}>
              <p style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,1vw,10px)',color:'#2a6a3a',letterSpacing:'0.3em',marginBottom:18 }}>FROM THE FIELD</p>
              <h2 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(18px,3vw,34px)',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00',lineHeight:1.3 }}>What People Are Saying</h2>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20 }}>
              {[
                {name:'@bio_nerd_kate',color:'#00ffcc',tag:'Verified Cytoplasm Survivor',quote:'I learned more about ATP synthesis in one boss fight than in an entire semester of lecture. And I was genuinely stressed about LYSO. He had three phases.'},
                {name:'@ml_marcus',color:'#a855f7',tag:'Neural Nebula Graduate',quote:'The OVERFIT boss fight was brilliant. He got stronger when your model memorized the training data. I actually understood overfitting after that. Genuinely.'},
                {name:'@gen_sarah',color:'#52d483',tag:'Genome Forest Explorer',quote:'Ben fed me a sandwich fact about CRISPR while I was trying to cross the RNA River. I missed my step. Fell in. Still passed the lesson. Worth it.'},
                {name:'@prot_james',color:'#c0a0ff',tag:'Protein Cathedral Pilgrim',quote:'Henry keeps flickering and insisting he\'s real. I don\'t believe him. But his explanation of alpha helix folding was the clearest I\'ve ever encountered.'},
                {name:'@enzyme_fan',color:'#ffaa44',tag:'Enzyme Enthusiast (all 4 realms)',quote:'I clicked on Enzyme by accident in the forest and she said "I sensed your loneliness before you did." I need her. I NEED her.'},
                {name:'@highschool_dev',color:'#ff5599',tag:'First Week Complete',quote:'I\'m 16 and I\'ve never understood DNA. I played for two hours and now I can explain CRISPR to my parents. They are very confused. But I am not.'},
              ].map(({name,color,tag,quote})=>(
                <div key={name}
                  style={{ background:'#030a06',border:`2px solid ${color}22`,padding:20,transition:'border-color 0.15s,transform 0.1s',cursor:'none',position:'relative' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'55'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=color+'22'; e.currentTarget.style.transform='translateY(0)'; }}>
                  {/* Dialogue box styling */}
                  <div style={{ position:'absolute',top:-1,left:12,right:12,height:2,background:`linear-gradient(90deg,transparent,${color}88,transparent)` }} />
                  <div style={{ fontFamily:"'Courier New',monospace",fontSize:12,color:'#7a9a7a',lineHeight:1.8,fontStyle:'italic',marginBottom:16 }}>"{quote}"</div>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',borderTop:`1px solid ${color}18`,paddingTop:12 }}>
                    <div>
                      <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:7,color,marginBottom:4 }}>{name}</div>
                      <div style={{ fontFamily:"'Courier New',monospace",fontSize:9,color:color+'66' }}>{tag}</div>
                    </div>
                    <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:10,color:color+'44' }}>▼</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════ CAST ════════════════════════════════════════════════ */}
      <div ref={castReveal.ref} id="cast">
        <section style={{ padding:'clamp(60px,8vw,100px) 24px',background:'#060e08' }} className={castReveal.visible?'px-reveal':''}>
          <div style={{ maxWidth:900,margin:'0 auto',textAlign:'center' }}>
            <p style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,1vw,10px)',color:'#2a5a3a',letterSpacing:'0.3em',marginBottom:18 }}>YOUR MENTORS</p>
            <h2 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(18px,3vw,34px)',color:'#c8f044',textShadow:'3px 3px 0 #2a4a00',lineHeight:1.3,marginBottom:48 }}>Meet the Cast</h2>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:24 }}>
              {[
                {name:'Elliot',role:'Cytoplasm Guide',color:'#00ffcc',emoji:'🔬',bio:'Lab coat. Curly hair. Has opinions about ribosomes. Very strong opinions.'},
                {name:'Ben',role:'Genome Forest Guide',color:'#52d483',emoji:'🌿',bio:'Always eating a sandwich. Sequenced 3 genomes today. Productive morning.'},
                {name:'Alex',role:'Neural Nebula Guide',color:'#a855f7',emoji:'☕',bio:'Four coffees in. Convinced back-prop flows backward like cold espresso.'},
                {name:'Henry',role:'Protein Cathedral',color:'#c0a0ff',emoji:'👻',bio:'*flickers* I am definitely not a hologram. Please stop trying to walk through me.'},
                {name:'Enzyme',role:'Your Companion',color:'#ffaa44',emoji:'🐱',bio:'White cat. Teal eyes. Follows you everywhere. Has never missed a boss fight.'},
              ].map(({name,role,color,emoji,bio})=>(
                <div key={name} style={{ background:'#010c04',border:`2px solid ${color}28`,padding:20,transition:'border-color 0.15s,transform 0.12s',cursor:'none' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'66'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=color+'28'; e.currentTarget.style.transform='translateY(0)'; }}>
                  <div style={{ fontSize:32,marginBottom:12 }}>{emoji}</div>
                  <div style={{ fontFamily:"'Press Start 2P',monospace",fontSize:8,color,marginBottom:8 }}>{name}</div>
                  <div style={{ fontFamily:"'Courier New',monospace",fontSize:9,color:color+'88',marginBottom:10 }}>{role}</div>
                  <div style={{ fontFamily:"'Courier New',monospace",fontSize:10,color:'#3a5a40',lineHeight:1.7 }}>{bio}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════ FINAL CTA ═══════════════════════════════════════════ */}
      <section id="about" style={{ padding:'clamp(80px,10vw,140px) 24px',background:'linear-gradient(180deg,#020a06 0%,#010810 100%)',textAlign:'center',borderTop:'2px solid #1a3a20',position:'relative',overflow:'hidden' }}>
        {/* Ambient glow */}
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:400,background:'radial-gradient(ellipse,rgba(0,255,136,0.04) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ maxWidth:700,margin:'0 auto',position:'relative',zIndex:1 }}>
          <div style={{ fontSize:56,marginBottom:24,display:'block' }} className="float-anim">🐱</div>
          <div style={{ display:'inline-block',background:'rgba(200,240,68,0.08)',border:'1px solid #c8f04430',padding:'5px 16px',fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(7px,0.9vw,9px)',color:'#c8f044',letterSpacing:'0.2em',marginBottom:24 }}>
            100% FREE · NO ADS · OPEN WORLD
          </div>
          <h2 style={{ fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(22px,4vw,44px)',color:'#c8f044',textShadow:'4px 4px 0 #2a4a00,7px 7px 0 #0f1e00',lineHeight:1.3,marginBottom:28 }}>Your cells are<br/>waiting.</h2>
          <p style={{ fontFamily:"'Courier New',monospace",fontSize:'clamp(13px,1.6vw,16px)',color:'#4a6a50',lineHeight:1.85,marginBottom:18 }}>
            Enzyme has been sitting by the Cytoplasm entrance for three days.
          </p>
          <p style={{ fontFamily:"'Courier New',monospace",fontSize:'clamp(11px,1.3vw,14px)',color:'#2a4a30',lineHeight:1.8,marginBottom:48 }}>
            She&apos;s starting to judge you. The mitochondria are watching.
          </p>
          <button onClick={handleStart}
            style={{ background:'#b8e643',border:'3px solid #7ab010',color:'#0a1800',fontFamily:"'Press Start 2P',monospace",fontSize:'clamp(10px,1.4vw,14px)',padding:'clamp(16px,2.5vw,24px) clamp(32px,5vw,64px)',cursor:'none',letterSpacing:'0.06em',boxShadow:'0 5px 0 #4a7000,0 0 60px #b8e64335',transition:'background 0.12s,transform 0.08s,box-shadow 0.1s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#cef855'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 7px 0 #4a7000,0 0 80px #c8f04450'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='#b8e643'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 5px 0 #4a7000,0 0 60px #b8e64335'; }}>
            {isReturning?'CONTINUE YOUR ADVENTURE →':'START FOR FREE →'}
          </button>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════════════════════════════════ */}
      <footer style={{ background:'#010810',borderTop:'1px solid #0e2010' }}>
        <div style={{ background:'#020e08',borderBottom:'1px solid #0e2010',padding:'10px 0',overflow:'hidden' }}>
          <div className="ticker-track" style={{ gap:0 }}>
            {[TICKER_TEXT,TICKER_TEXT].map((txt,i)=>(
              <span key={i} style={{ fontFamily:"'Courier New',monospace",fontSize:9,color:'#1a3a20',letterSpacing:'0.2em',flexShrink:0 }}>{txt}</span>
            ))}
          </div>
        </div>
        <div style={{ padding:'40px 24px',display:'flex',flexDirection:'column',alignItems:'center',gap:20 }}>
          <SparkLogo />
          <div style={{ fontFamily:"'Courier New',monospace",fontSize:11,color:'#1a2a1a',letterSpacing:'0.04em',textAlign:'center',lineHeight:1.8 }}>
            Built entirely with Next.js 16 + Canvas API. Zero image files — every sprite drawn from scratch.<br />
            Made by <span style={{color:'#39ff14'}}>Aaryan Senthilvanan</span> · BitBio v1.0
          </div>
          <div style={{ display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center' }}>
            {['Next.js 16','Canvas API','TypeScript','Zustand','Press Start 2P'].map(l=>(
              <span key={l} style={{ background:'#0a1408',border:'1px solid #1a2818',color:'#2a4a2a',fontFamily:"'Courier New',monospace",fontSize:9,padding:'4px 10px' }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
