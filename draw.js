// draw.js — All canvas drawing: room background + lofi-style objects

// ── PALETTE (lofi warm palette from reference images) ──────────────────────
const P = {
  // walls / room
  wallTop:    '#2a1608',
  wallMid:    '#3c2210',
  wallBot:    '#2e1a0a',
  // sky outside
  skyTop:     '#0a0e1e',
  skyMid:     '#12182e',
  skyBot:     '#1a1e38',
  // desk
  deskTop:    '#a06030',
  deskFront:  '#7a4818',
  deskShadow: '#3a2008',
  // floor
  floor1:     '#5a3010',
  floor2:     '#3a2008',
  // lamp
  lampShade:  '#c04020',
  lampShadeIn:'#ff9844',
  lampArm:    '#b87830',
  lampBase:   '#9a6828',
  // envelope colours (warm paper)
  envBody:    '#e8c060',
  envFlap:    '#f5d878',
  envShadow:  '#b88828',
  envSeal:    '#c01818',
  // camera
  camBody:    '#242830',
  camBodyHi:  '#363c44',
  camRubber:  '#181c20',
  camLens:    '#14181e',
  camGlass:   '#1a2848',
  camMetal:   '#c8a048',
  // frame
  frameGold1: '#d4a020',
  frameGold2: '#f0c840',
  frameGold3: '#8a6010',
  frameMat:   '#ece0be',
  // walkman
  wkBody:     '#1e2c48',
  wkBodyHi:   '#2a3c5a',
  wkBlue:     '#4888d8',
  wkLabel:    '#d4aa50',
  wkWindow:   '#06090e',
};

// ── ROOM BACKGROUND ─────────────────────────────────────────────────────────
function drawRoom(canvas, lampOn, photos, frameIdx) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const deskY = H * 0.60; // desk top surface y

  ctx.clearRect(0,0,W,H);

  // ── SKY (fills entire canvas behind everything)
  const skyG = ctx.createLinearGradient(0,0,0,deskY*0.9);
  skyG.addColorStop(0, '#080c1a');
  skyG.addColorStop(0.5,'#0e1428');
  skyG.addColorStop(1,  '#14182e');
  ctx.fillStyle = skyG;
  ctx.fillRect(0,0,W,deskY*0.9);

  // ── WALL (overlaid on sky, below window opening)
  // left wall segment
  const wallG = ctx.createLinearGradient(0,0,0,deskY);
  wallG.addColorStop(0,'#241408');
  wallG.addColorStop(0.4,'#341c0c');
  wallG.addColorStop(0.8,'#2e1808');
  wallG.addColorStop(1,'#261408');
  ctx.fillStyle = wallG;
  // left of window
  const winX = W*0.26, winW = W*0.48, winY = H*0.04, winH = H*0.48;
  ctx.fillRect(0, 0, winX-16, deskY);
  // right of window
  ctx.fillRect(winX+winW+16, 0, W-(winX+winW+16), deskY);
  // above window
  ctx.fillRect(0,0,W,winY-6);
  // below window
  ctx.fillRect(winX-16, winY+winH+6, winW+32, deskY-(winY+winH+6));

  // subtle wall texture scan lines
  ctx.save();
  for(let y=0;y<deskY;y+=4){
    ctx.fillStyle = 'rgba(0,0,0,0.018)';
    ctx.fillRect(0,y,W,1);
  }
  ctx.restore();

  // ── WINDOW FRAME (thick wooden frame)
  const wfPad = 16;
  // outer frame
  const wfG = ctx.createLinearGradient(winX-wfPad, 0, winX+winW+wfPad, 0);
  wfG.addColorStop(0,'#9a7030');
  wfG.addColorStop(0.3,'#c8a050');
  wfG.addColorStop(0.7,'#b08838');
  wfG.addColorStop(1,'#7a5018');
  ctx.fillStyle = wfG;
  // top bar
  ctx.fillRect(winX-wfPad, winY-wfPad, winW+wfPad*2, wfPad);
  // bottom bar
  ctx.fillRect(winX-wfPad, winY+winH, winW+wfPad*2, wfPad+2);
  // left bar
  ctx.fillRect(winX-wfPad, winY-wfPad, wfPad, winH+wfPad*2);
  // right bar
  ctx.fillRect(winX+winW, winY-wfPad, wfPad, winH+wfPad*2);

  // ── WINDOW GLASS — night city
  ctx.save();
  ctx.beginPath();
  ctx.rect(winX, winY, winW, winH);
  ctx.clip();

  // sky gradient inside glass
  const nightG = ctx.createLinearGradient(0,winY,0,winY+winH);
  nightG.addColorStop(0,'#0a0e20');
  nightG.addColorStop(0.5,'#101630');
  nightG.addColorStop(1,'#181e38');
  ctx.fillStyle = nightG;
  ctx.fillRect(winX,winY,winW,winH);

  // stars
  const stars = [[.08,.12],[.19,.08],[.32,.15],[.44,.06],[.58,.11],[.67,.18],[.78,.08],[.88,.14],[.96,.09],[.14,.22],[.42,.25],[.71,.20],[.85,.26]];
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  stars.forEach(([sx,sy])=>{
    ctx.beginPath();
    ctx.arc(winX+winW*sx, winY+winH*sy, 1, 0, Math.PI*2);
    ctx.fill();
  });
  // moon
  const moonX = winX+winW*.78, moonY = winY+winH*.12;
  const moonG2 = ctx.createRadialGradient(moonX-2,moonY-2,1,moonX,moonY,9);
  moonG2.addColorStop(0,'#fff8e8');
  moonG2.addColorStop(0.6,'#f0e0a8');
  moonG2.addColorStop(1,'rgba(240,220,150,0)');
  ctx.fillStyle = moonG2;
  ctx.beginPath();
  ctx.arc(moonX,moonY,9,0,Math.PI*2);
  ctx.fill();

  // city silhouette — far buildings (dark purple-blue)
  ctx.fillStyle = '#1a1530';
  drawCityFar(ctx, winX, winY, winW, winH);

  // city silhouette — mid buildings (dark warm)
  ctx.fillStyle = '#2a1a18';
  drawCityMid(ctx, winX, winY, winW, winH);

  // warm building windows (tiny glowing squares)
  drawBuildingLights(ctx, winX, winY, winW, winH);

  // glass reflection tint
  const glassG = ctx.createLinearGradient(winX,winY,winX+winW,winY+winH);
  glassG.addColorStop(0,'rgba(100,120,180,0.04)');
  glassG.addColorStop(1,'rgba(0,0,0,0.15)');
  ctx.fillStyle = glassG;
  ctx.fillRect(winX,winY,winW,winH);

  ctx.restore();

  // Window cross bars
  ctx.fillStyle = '#b09040';
  ctx.fillRect(winX, winY+winH/2-3, winW, 6);
  ctx.fillRect(winX+winW/2-3, winY, 6, winH);
  // bar highlights
  ctx.fillStyle = 'rgba(255,220,100,0.15)';
  ctx.fillRect(winX, winY+winH/2-3, winW, 2);
  ctx.fillRect(winX+winW/2-3, winY, 2, winH);

  // Window sill (thick ledge)
  const sillG = ctx.createLinearGradient(0,winY+winH,0,winY+winH+18);
  sillG.addColorStop(0,'#c8a050');
  sillG.addColorStop(0.4,'#a08030');
  sillG.addColorStop(1,'#6a5018');
  ctx.fillStyle = sillG;
  ctx.beginPath();
  ctx.roundRect(winX-wfPad-4, winY+winH, winW+wfPad*2+8, 18, [0,0,3,3]);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,200,100,0.12)';
  ctx.fillRect(winX-wfPad-4, winY+winH, winW+wfPad*2+8, 3);

  // Window plant on sill
  drawWindowPlant(ctx, winX+winW*.62, winY+winH-10, W);

  // ── LAMP (lofi style — red pendant lamp hanging from top)
  const lampCX = W*0.34;
  drawLamp(ctx, lampCX, 0, lampOn, W, H);

  // ── LAMP GLOW CONE on wall/desk when on
  if(lampOn) {
    const glowCX = lampCX;
    const glowTopY = H*0.22;
    const glowBotY = deskY+H*0.05;
    const glowRad = W*0.28;
    const coneG = ctx.createRadialGradient(glowCX,glowTopY,0,glowCX,glowTopY,glowRad*1.6);
    coneG.addColorStop(0,'rgba(255,180,70,0.22)');
    coneG.addColorStop(0.3,'rgba(255,140,50,0.1)');
    coneG.addColorStop(0.7,'rgba(255,100,30,0.04)');
    coneG.addColorStop(1,'rgba(0,0,0,0)');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(glowCX,glowTopY);
    ctx.lineTo(glowCX-glowRad*1.1, glowBotY);
    ctx.lineTo(glowCX+glowRad*1.1, glowBotY);
    ctx.closePath();
    ctx.fillStyle = coneG;
    ctx.fill();
    ctx.restore();
  }

  // ── BOOKSHELF (left side, like reference)
  drawBookshelf(ctx, 0, 0, W*0.11, deskY, W);

  // ── CORK BOARD (right side on wall)
  drawCorkBoard(ctx, W*0.86, H*0.06, W*0.12, H*0.28, W);

  // ── WALL ART (small framed art between bookshelf and window)
  drawWallArt(ctx, W*0.145, H*0.12, W*0.09, H*0.14);

  // ── DESK SURFACE
  drawDesk(ctx, 0, deskY, W, H, lampOn, lampCX);

  // ── DESK CLUTTER (notebooks, pens, scattered papers)
  drawDeskClutter(ctx, 0, deskY, W, H, lampOn);

  // ── PICTURE FRAME on desk — live update with photo
  drawFrameOnDesk(ctx, W*0.76, deskY-2, W*0.11, photos, frameIdx);

  // ── FLOOR
  drawFloor(ctx, 0, deskY, W, H);

  // ── VIGNETTE
  const vigG = ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.85);
  vigG.addColorStop(0,'rgba(0,0,0,0)');
  vigG.addColorStop(0.5,'rgba(0,0,0,0.05)');
  vigG.addColorStop(1,'rgba(0,0,0,0.72)');
  ctx.fillStyle = vigG;
  ctx.fillRect(0,0,W,H);

  // bottom depth fade (like foreground blur in reference images)
  const botG = ctx.createLinearGradient(0,H*0.88,0,H);
  botG.addColorStop(0,'rgba(0,0,0,0)');
  botG.addColorStop(1,'rgba(0,0,0,0.6)');
  ctx.fillStyle = botG;
  ctx.fillRect(0,H*0.88,W,H*0.12);
}

function drawCityFar(ctx, wx,wy,ww,wh) {
  const bots = [.55,.35,.20,.40,.30,.55,.22,.38,.52,.28,.42,.55,.32,.18,.45,.55,.25,.40,.55,.20,.35,.50,.28,.44];
  const bw = ww/bots.length;
  ctx.beginPath();
  ctx.moveTo(wx,wy+wh);
  bots.forEach((b,i)=>{
    ctx.lineTo(wx+i*bw, wy+wh*b);
    ctx.lineTo(wx+(i+1)*bw, wy+wh*b);
  });
  ctx.lineTo(wx+ww,wy+wh);
  ctx.closePath();
  ctx.fill();
}

function drawCityMid(ctx, wx,wy,ww,wh) {
  const bots = [.75,.50,.35,.60,.42,.70,.40,.55,.72,.45,.60,.75,.48,.33,.62,.75,.38,.55,.72,.35,.50,.68,.42,.60];
  const bw = ww/bots.length;
  ctx.beginPath();
  ctx.moveTo(wx,wy+wh);
  bots.forEach((b,i)=>{
    ctx.lineTo(wx+i*bw, wy+wh*b);
    ctx.lineTo(wx+(i+1)*bw, wy+wh*b);
  });
  ctx.lineTo(wx+ww,wy+wh);
  ctx.closePath();
  ctx.fill();
}

function drawBuildingLights(ctx, wx,wy,ww,wh) {
  const windows = [
    [.08,.68],[.14,.74],[.21,.70],[.28,.65],[.35,.72],[.42,.68],[.48,.75],[.55,.70],
    [.62,.66],[.69,.73],[.76,.68],[.83,.72],[.90,.67],[.11,.82],[.24,.85],[.38,.80],
    [.51,.83],[.65,.79],[.78,.84],[.88,.80],[.18,.60],[.32,.57],[.45,.62],[.58,.58],
    [.72,.61],[.85,.55],[.05,.75],[.95,.72],
  ];
  windows.forEach(([sx,sy], i)=>{
    const bright = 0.5 + Math.random()*0.3;
    const warm = i%3===0;
    ctx.fillStyle = warm
      ? `rgba(255,${180+Math.floor(Math.random()*40)},${60+Math.floor(Math.random()*40)},${bright})`
      : `rgba(200,220,255,${bright*0.7})`;
    const ws = 2+Math.random()*2;
    ctx.fillRect(wx+ww*sx, wy+wh*sy, ws, ws*1.2);
  });
}

function drawWindowPlant(ctx, x, y, W) {
  const sc = W/900;
  // pot
  ctx.fillStyle = '#b06030';
  ctx.beginPath();
  ctx.moveTo(x-14*sc, y);
  ctx.lineTo(x+14*sc, y);
  ctx.lineTo(x+10*sc, y+20*sc);
  ctx.lineTo(x-10*sc, y+20*sc);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a4020';
  ctx.fillRect(x-14*sc,y,28*sc,4*sc);
  // soil
  ctx.fillStyle = '#2a1408';
  ctx.beginPath();
  ctx.ellipse(x,y,12*sc,4*sc,0,0,Math.PI*2);
  ctx.fill();
  // stems+leaves
  const leaves = [[-8,-28,30],[-4,-42,-20],[2,-36,10],[8,-24,-35],[0,-52,5]];
  leaves.forEach(([lx,ly,angle])=>{
    ctx.save();
    ctx.translate(x+lx*sc, y+ly*sc);
    ctx.rotate(angle*Math.PI/180);
    const leafG = ctx.createRadialGradient(-2*sc,-4*sc,1,0,0,14*sc);
    leafG.addColorStop(0,'#6a9040');
    leafG.addColorStop(1,'#2a5018');
    ctx.fillStyle = leafG;
    ctx.beginPath();
    ctx.ellipse(0,0,7*sc,14*sc,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
  // stem
  ctx.strokeStyle = '#3a6020';
  ctx.lineWidth = 2*sc;
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.quadraticCurveTo(x-4*sc,y-25*sc,x-2*sc,y-50*sc);
  ctx.stroke();
}

function drawLamp(ctx, cx, topY, lampOn, W, H) {
  const sc = W/900;
  // cord hanging from ceiling
  ctx.strokeStyle = '#3a2010';
  ctx.lineWidth = 3*sc;
  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.quadraticCurveTo(cx+6*sc, H*0.08, cx, H*0.18);
  ctx.stroke();
  // arm bracket
  ctx.strokeStyle = P.lampArm;
  ctx.lineWidth = 5*sc;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, H*0.18);
  ctx.lineTo(cx-22*sc, H*0.14);
  ctx.stroke();
  ctx.lineCap = 'butt';
  // shade — lofi rounded pendant style (like reference: red/terracotta)
  const shX = cx-6*sc, shTopY = H*0.14, shW = 70*sc, shH = 55*sc;
  ctx.save();
  ctx.translate(shX, shTopY);
  // outer shade (terracotta red — like reference images)
  const shadeG = ctx.createLinearGradient(-shW/2,0,shW/2,shH);
  shadeG.addColorStop(0,'#c84022');
  shadeG.addColorStop(0.3,'#a83010');
  shadeG.addColorStop(0.7,'#882808');
  shadeG.addColorStop(1,'#6a1e06');
  ctx.fillStyle = shadeG;
  ctx.beginPath();
  ctx.moveTo(-shW*0.38,0);
  ctx.bezierCurveTo(-shW*0.38,-12*sc, shW*0.38,-12*sc, shW*0.38,0);
  ctx.bezierCurveTo(shW*0.5,shH*0.4, shW*0.45,shH*0.85, shW*0.36,shH);
  ctx.bezierCurveTo(shW*0.15,shH*1.05, -shW*0.15,shH*1.05, -shW*0.36,shH);
  ctx.bezierCurveTo(-shW*0.45,shH*0.85, -shW*0.5,shH*0.4, -shW*0.38,0);
  ctx.closePath();
  ctx.fill();
  // rim
  ctx.strokeStyle = '#e8a060';
  ctx.lineWidth = 2*sc;
  ctx.beginPath();
  ctx.ellipse(0,0,shW*0.38,5*sc,0,0,Math.PI*2);
  ctx.stroke();
  // inside glow when lamp on
  if(lampOn) {
    const innerG = ctx.createRadialGradient(0,shH*.7,2,0,shH*.5,shW*.4);
    innerG.addColorStop(0,'rgba(255,230,140,0.95)');
    innerG.addColorStop(0.3,'rgba(255,180,80,0.55)');
    innerG.addColorStop(0.7,'rgba(255,120,40,0.15)');
    innerG.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = innerG;
    ctx.beginPath();
    ctx.ellipse(0, shH*.55, shW*.33, shH*.45, 0,0,Math.PI*2);
    ctx.fill();
    // bulb dot
    ctx.fillStyle = '#fff8d0';
    ctx.shadowColor = 'rgba(255,220,100,0.9)';
    ctx.shadowBlur = 18*sc;
    ctx.beginPath();
    ctx.arc(0, shH*.58, 5*sc, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  // shade highlight
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.ellipse(-shW*0.12, shH*0.2, shW*0.12, shH*0.14, -0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawBookshelf(ctx, x, y, w, h, W) {
  const sc = W/900;
  // back panel
  ctx.fillStyle = '#160c04';
  ctx.fillRect(x, y, w, h);
  // side panel
  const spG = ctx.createLinearGradient(x+w-6*sc,0,x+w,0);
  spG.addColorStop(0,'#6a4010');spG.addColorStop(1,'#3a2008');
  ctx.fillStyle = spG;
  ctx.fillRect(x+w-6*sc, y, 6*sc, h);
  // two shelves
  const shelves = [h*0.32, h*0.64];
  shelves.forEach((sy, si)=>{
    const shG = ctx.createLinearGradient(0,y+sy,0,y+sy+12*sc);
    shG.addColorStop(0,'#9a6828');shG.addColorStop(0.4,'#7a5018');shG.addColorStop(1,'#5e3c10');
    ctx.fillStyle = shG;
    ctx.fillRect(x, y+sy, w, 12*sc);
    ctx.fillStyle = 'rgba(255,200,100,0.1)';
    ctx.fillRect(x, y+sy, w, 2*sc);
  });
  // books on each shelf
  const bookDefs = [
    // row 1
    [{w:11,h:0.88,c:'#8a3020'},{w:9,h:0.72,c:'#205080'},{w:12,h:0.92,c:'#4a7030'},
     {w:8,h:0.68,c:'#804020'},{w:11,h:0.82,c:'#6a4080'},{w:8,h:0.65,c:'#205048'}],
    // row 2
    [{w:10,h:0.80,c:'#7a3828'},{w:13,h:0.90,c:'#284878'},{w:9,h:0.74,c:'#5a7028'},
     {w:11,h:0.86,c:'#782828'},{w:8,h:0.70,c:'#204858'}],
  ];
  bookDefs.forEach((row, ri)=>{
    const shelfTopY = ri===0? y+shelves[0]-row[0].h*(shelves[0])*0.38 : y+shelves[1]-row[0].h*(h-shelves[1])*0.55;
    const rowH = ri===0? shelves[0]*0.38 : (h-shelves[1])*0.55;
    let bx = x+4*sc;
    row.forEach(b=>{
      const bw = b.w*sc, bh = rowH*b.h;
      const by = shelfTopY+rowH-bh;
      const bG = ctx.createLinearGradient(bx,by,bx+bw,by);
      bG.addColorStop(0,b.c);bG.addColorStop(0.1,lightenHex(b.c,20));bG.addColorStop(1,darkenHex(b.c,20));
      ctx.fillStyle = bG;
      ctx.fillRect(bx, by, bw, bh);
      // spine highlight
      ctx.fillStyle='rgba(255,255,255,0.07)';
      ctx.fillRect(bx,by,1.5*sc,bh);
      ctx.fillStyle='rgba(0,0,0,0.3)';
      ctx.fillRect(bx+bw-1.5*sc,by,1.5*sc,bh);
      bx += bw+1.5*sc;
    });
  });
}

function drawCorkBoard(ctx, x, y, w, h, W) {
  const sc = W/900;
  // frame
  const fG = ctx.createLinearGradient(x,y,x+w,y+h);
  fG.addColorStop(0,'#c8901a');fG.addColorStop(0.5,'#9a6c10');fG.addColorStop(1,'#b87c14');
  ctx.fillStyle = fG;
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,3);
  ctx.fill();
  // cork surface
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x+5*sc,y+5*sc,w-10*sc,h-10*sc,2);
  ctx.clip();
  // cork texture
  const corkG = ctx.createLinearGradient(x,y,x+w,y+h);
  corkG.addColorStop(0,'#c89050');corkG.addColorStop(0.5,'#a87030');corkG.addColorStop(1,'#c08040');
  ctx.fillStyle = corkG;
  ctx.fillRect(x+5*sc,y+5*sc,w-10*sc,h-10*sc);
  // cork dots
  for(let i=0;i<18;i++){
    ctx.fillStyle=`rgba(${100+Math.floor(Math.random()*40)},${60+Math.floor(Math.random()*30)},${10+Math.floor(Math.random()*20)},0.25)`;
    ctx.beginPath();
    ctx.arc(x+8*sc+Math.random()*(w-16*sc),y+8*sc+Math.random()*(h-16*sc),1.5*sc+Math.random()*2*sc,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
  // pinned post-it notes
  drawPinnedNote(ctx, x+w*0.18, y+h*0.1, w*0.62, h*0.3, '#fffaaa', 'for wabi\nwith love', -2, sc);
  drawPinnedNote(ctx, x+w*0.22, y+h*0.5, w*0.55, h*0.28, '#ffd890', 'always', 4, sc);
}

function drawPinnedNote(ctx, x, y, w, h, color, text, rot, sc) {
  ctx.save();
  ctx.translate(x+w/2, y+h/2);
  ctx.rotate(rot*Math.PI/180);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-w/2,-h/2,w,h,1);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(-w/2+1,-h/2+1,w,h);
  // pushpin
  ctx.fillStyle = '#c02020';
  ctx.beginPath();
  ctx.arc(0,-h/2+3*sc,3*sc,0,Math.PI*2);
  ctx.fill();
  // text lines
  ctx.fillStyle = 'rgba(42,30,8,0.55)';
  ctx.fillRect(-w/2+4*sc, -h/2+8*sc, w*0.7, 1.5*sc);
  ctx.fillRect(-w/2+4*sc, -h/2+13*sc, w*0.5, 1.5*sc);
  ctx.restore();
}

function drawWallArt(ctx, x, y, w, h) {
  // small framed painting between shelf and window
  // outer frame
  const fG = ctx.createLinearGradient(x,y,x+w,y+h);
  fG.addColorStop(0,'#c09020');fG.addColorStop(0.5,'#9a7010');fG.addColorStop(1,'#c09020');
  ctx.fillStyle = fG;
  ctx.fillRect(x,y,w,h);
  // canvas inside
  const cG = ctx.createLinearGradient(x+6,y+6,x+w-6,y+h-6);
  cG.addColorStop(0,'#2a3050');cG.addColorStop(0.5,'#1e2440');cG.addColorStop(1,'#283050');
  ctx.fillStyle = cG;
  ctx.fillRect(x+6,y+6,w-12,h-12);
  // moonscape painting
  ctx.fillStyle = 'rgba(255,210,80,0.5)';
  ctx.beginPath();
  ctx.arc(x+w*.55,y+h*.3,h*.15,0,Math.PI*2);
  ctx.fill();
  // hills
  ctx.fillStyle = '#1a3028';
  ctx.beginPath();
  ctx.moveTo(x+6,y+h-6);
  ctx.quadraticCurveTo(x+w*.3,y+h*.5,x+w*.5,y+h-6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#142820';
  ctx.beginPath();
  ctx.moveTo(x+w*.35,y+h-6);
  ctx.quadraticCurveTo(x+w*.65,y+h*.4,x+w-6,y+h-6);
  ctx.closePath();
  ctx.fill();
  // hanging wire
  ctx.strokeStyle = 'rgba(180,140,60,0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x+w*.25, y);
  ctx.quadraticCurveTo(x+w*.5, y-8, x+w*.75, y);
  ctx.stroke();
}

function drawDesk(ctx, x, deskY, W, H, lampOn, lampCX) {
  // desk top surface (angled perspective top like reference images)
  const dtH = 20;
  const dtG = ctx.createLinearGradient(0,deskY,0,deskY+dtH);
  dtG.addColorStop(0,'#c07838');
  dtG.addColorStop(0.3,'#a86028');
  dtG.addColorStop(0.7,'#8a5020');
  dtG.addColorStop(1,'#7a4418');
  ctx.fillStyle = dtG;
  ctx.fillRect(x, deskY, W, dtH);
  // surface edge highlight
  ctx.fillStyle = 'rgba(255,200,100,0.18)';
  ctx.fillRect(x, deskY, W, 2);
  // desk front face
  const dfG = ctx.createLinearGradient(0,deskY+dtH,0,H);
  dfG.addColorStop(0,'#7a4418');
  dfG.addColorStop(0.4,'#6a3810');
  dfG.addColorStop(0.8,'#4a2808');
  dfG.addColorStop(1,'#3a2008');
  ctx.fillStyle = dfG;
  ctx.fillRect(x, deskY+dtH, W, H-(deskY+dtH));
  // wood grain lines on desk top
  ctx.save();
  for(let gx=0;gx<W;gx+=60){
    ctx.strokeStyle='rgba(0,0,0,0.04)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(gx,deskY);ctx.lineTo(gx+40,deskY+dtH);ctx.stroke();
  }
  ctx.restore();
  // warm lamp glow on desk surface
  if(lampOn) {
    const deskGlow = ctx.createRadialGradient(lampCX,deskY+dtH/2,0,lampCX,deskY,W*0.35);
    deskGlow.addColorStop(0,'rgba(255,170,60,0.28)');
    deskGlow.addColorStop(0.4,'rgba(255,140,40,0.1)');
    deskGlow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = deskGlow;
    ctx.fillRect(0,deskY,W,dtH*2);
  }
}

function drawDeskClutter(ctx, x0, deskY, W, H, lampOn) {
  const sc = W/900;
  const sy = deskY+4; // items sit on desk top

  // ── Open notebook (center-left, biggest item) — like reference images
  const nbX = W*0.28, nbY = sy - 45*sc, nbW = 155*sc, nbH = 55*sc;
  drawOpenNotebook(ctx, nbX, nbY, nbW, nbH, sc);

  // ── Stacked books (right center)
  const bkX = W*0.62, bkY = sy;
  const bookStack = [
    {w:85,c:'#c8601a'},{w:95,c:'#204878'},{w:78,c:'#284820'}
  ];
  let bky = bkY;
  bookStack.forEach(b=>{
    const bW = b.w*sc, bH = 16*sc;
    bky -= bH;
    const bkG = ctx.createLinearGradient(bkX,bky,bkX+bW,bky+bH);
    bkG.addColorStop(0,lightenHex(b.c,15));
    bkG.addColorStop(0.5,b.c);
    bkG.addColorStop(1,darkenHex(b.c,20));
    ctx.fillStyle = bkG;
    ctx.fillRect(bkX,bky,bW,bH);
    ctx.fillStyle='rgba(255,255,255,0.07)';
    ctx.fillRect(bkX,bky,bW,2);
    ctx.fillStyle='rgba(0,0,0,0.18)';
    ctx.fillRect(bkX,bky+bH-2,bW,2);
    bky -= 1;
  });

  // ── Pen/pencil cup (left side — like reference)
  drawPenCup(ctx, W*0.14, sy, sc);

  // ── Scissors
  drawScissors(ctx, W*0.21, sy, sc);

  // ── Candle (right of notebooks)
  drawCandle(ctx, W*0.52, sy, sc);

  // ── Tea cup (far right area)
  drawTeaCup(ctx, W*0.80, sy, sc, lampOn);
}

function drawOpenNotebook(ctx, x, y, w, h, sc) {
  // left page
  const lpG = ctx.createLinearGradient(x,y,x+w*.49,y+h);
  lpG.addColorStop(0,'#fefae8');lpG.addColorStop(1,'#f8f0d8');
  ctx.fillStyle = lpG;
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 10*sc;
  ctx.shadowOffsetX = -3*sc;
  ctx.shadowOffsetY = 4*sc;
  ctx.beginPath();
  ctx.roundRect(x,y,w*.49,h,[2,0,0,2]);
  ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
  // right page
  const rpG = ctx.createLinearGradient(x+w*.51,y,x+w,y+h);
  rpG.addColorStop(0,'#fdf8e8');rpG.addColorStop(1,'#f6eec8');
  ctx.fillStyle = rpG;
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = 10*sc;
  ctx.shadowOffsetX = 4*sc;
  ctx.shadowOffsetY = 4*sc;
  ctx.beginPath();
  ctx.roundRect(x+w*.51,y,w*.49,h,[0,2,2,0]);
  ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
  // spine
  const spG = ctx.createLinearGradient(x+w*.49,y,x+w*.51,y);
  spG.addColorStop(0,'#c0a060');spG.addColorStop(0.5,'#e8c870');spG.addColorStop(1,'#b09050');
  ctx.fillStyle = spG;
  ctx.fillRect(x+w*.49,y,w*.02,h);
  // ruled lines on both pages
  ctx.strokeStyle='rgba(100,80,180,0.18)';
  ctx.lineWidth=0.8;
  for(let ly=y+10*sc;ly<y+h-6*sc;ly+=10*sc){
    ctx.beginPath();ctx.moveTo(x+6*sc,ly);ctx.lineTo(x+w*.47,ly);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+w*.53,ly);ctx.lineTo(x+w-6*sc,ly);ctx.stroke();
  }
  // handwriting squiggles
  ctx.strokeStyle='rgba(40,30,80,0.32)';ctx.lineWidth=1.2;
  [[x+10*sc,y+14*sc,w*.28],[x+10*sc,y+24*sc,w*.22],[x+10*sc,y+34*sc,w*.30],
   [x+w*.54,y+14*sc,w*.25],[x+w*.54,y+24*sc,w*.32],[x+w*.54,y+34*sc,w*.18]].forEach(([lx,ly,lw])=>{
    ctx.beginPath();
    ctx.moveTo(lx,ly);
    for(let i=0;i<lw;i+=8){ctx.quadraticCurveTo(lx+i+4,ly-2+Math.random()*3,lx+i+8,ly);}
    ctx.stroke();
  });
  // pen resting on notebook
  ctx.save();
  ctx.translate(x+w*.3, y+h*.6);
  ctx.rotate(-8*Math.PI/180);
  const penG = ctx.createLinearGradient(0,0,w*.55,0);
  penG.addColorStop(0,'#1a1208');penG.addColorStop(0.2,'#3a2a10');
  penG.addColorStop(0.6,'#c8a050');penG.addColorStop(1,'#1a1208');
  ctx.fillStyle = penG;
  ctx.fillRect(0,-2,w*.55,4);
  ctx.fillStyle='#c83020';
  ctx.beginPath();ctx.moveTo(w*.55,-2);ctx.lineTo(w*.55+6*sc,0);ctx.lineTo(w*.55,-2+4);ctx.closePath();ctx.fill();
  ctx.restore();
}

function drawPenCup(ctx, cx, by, sc) {
  const cw = 22*sc, ch = 32*sc, cy = by-ch;
  // cup body — terracotta/red like reference
  const cupG = ctx.createLinearGradient(cx-cw/2,cy,cx+cw/2,cy+ch);
  cupG.addColorStop(0,'#b84020');cupG.addColorStop(0.3,'#8a2810');cupG.addColorStop(1,'#6a1808');
  ctx.fillStyle = cupG;
  ctx.beginPath();
  ctx.roundRect(cx-cw/2,cy,cw,ch,[3,3,2,2]);
  ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.08)';
  ctx.fillRect(cx-cw/2,cy,cw/3,ch);
  ctx.fillStyle='rgba(0,0,0,0.25)';
  ctx.fillRect(cx-cw/2,cy,cw,4);
  // pens/pencils sticking out
  const items=[
    {dx:-7,h:38,c:'#c83020'},{dx:-2,h:32,c:'#2a2820'},
    {dx:3,h:42,c:'#2060a0'},{dx:8,h:28,c:'#309030'},
  ];
  items.forEach(({dx,h,c})=>{
    ctx.fillStyle=c;
    ctx.fillRect(cx+dx*sc-1.2*sc,cy-h*sc,2.5*sc,h*sc);
    ctx.fillStyle='#f5e8c0';
    ctx.beginPath();
    ctx.moveTo(cx+dx*sc-1.2*sc,cy-h*sc);
    ctx.lineTo(cx+dx*sc+1.3*sc,cy-h*sc);
    ctx.lineTo(cx+dx*sc,cy-(h+5)*sc);
    ctx.closePath();
    ctx.fill();
  });
}

function drawScissors(ctx, cx, by, sc) {
  const sy = by - 38*sc;
  ctx.save();
  ctx.translate(cx, sy);
  // handles
  const hc = '#2a3840';
  ctx.fillStyle=hc;
  ctx.beginPath();ctx.ellipse(-5*sc,30*sc,6*sc,10*sc,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(5*sc,30*sc,6*sc,10*sc,0,0,Math.PI*2);ctx.fill();
  // blades
  ctx.strokeStyle='#d0d0d8';ctx.lineWidth=2.5*sc;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-3*sc,22*sc);ctx.lineTo(-6*sc,-2*sc);ctx.stroke();
  ctx.beginPath();ctx.moveTo(3*sc,22*sc);ctx.lineTo(6*sc,-2*sc);ctx.stroke();
  // pivot
  ctx.fillStyle='#a0a0a8';ctx.beginPath();ctx.arc(0,20*sc,3*sc,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawCandle(ctx, cx, by, sc) {
  const ch = 38*sc;
  const cy = by - ch;
  const cw = 13*sc;
  // plate/holder
  const plateG = ctx.createRadialGradient(cx,by,0,cx,by,14*sc);
  plateG.addColorStop(0,'#e0c898');plateG.addColorStop(1,'#b09060');
  ctx.fillStyle=plateG;
  ctx.beginPath();ctx.ellipse(cx,by,13*sc,5*sc,0,0,Math.PI*2);ctx.fill();
  // wax drip
  ctx.fillStyle='rgba(240,220,180,0.6)';
  ctx.beginPath();ctx.moveTo(cx+3*sc,cy+ch*.3);ctx.quadraticCurveTo(cx+6*sc,cy+ch*.6,cx+4*sc,cy+ch);ctx.quadraticCurveTo(cx+8*sc,cy+ch,cx+3*sc,cy+ch);ctx.closePath();ctx.fill();
  // candle body
  const candleG = ctx.createLinearGradient(cx-cw/2,cy,cx+cw/2,cy);
  candleG.addColorStop(0,'rgba(255,255,255,0.12)');
  candleG.addColorStop(0.3,'rgba(0,0,0,0)');
  candleG.addColorStop(1,'rgba(0,0,0,0.1)');
  ctx.fillStyle=ctx.createLinearGradient(0,cy,0,cy+ch);
  const bodyG=ctx.createLinearGradient(0,cy,0,cy+ch);
  bodyG.addColorStop(0,'#faecd8');bodyG.addColorStop(0.4,'#e8d4b8');bodyG.addColorStop(1,'#d4c0a0');
  ctx.fillStyle=bodyG;
  ctx.fillRect(cx-cw/2,cy,cw,ch);
  ctx.fillStyle=candleG;ctx.fillRect(cx-cw/2,cy,cw,ch);
  // wick
  ctx.strokeStyle='#1a0a04';ctx.lineWidth=1.5*sc;
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+1*sc,cy-8*sc);ctx.stroke();
  // flame
  ctx.save();ctx.translate(cx+1*sc,cy-8*sc);
  const flameG=ctx.createRadialGradient(0,4*sc,0,0,0,14*sc);
  flameG.addColorStop(0,'rgba(255,255,200,0.95)');
  flameG.addColorStop(0.2,'rgba(255,200,80,0.85)');
  flameG.addColorStop(0.5,'rgba(255,120,30,0.55)');
  flameG.addColorStop(1,'rgba(255,80,10,0)');
  ctx.fillStyle=flameG;
  ctx.beginPath();
  ctx.moveTo(0,12*sc);
  ctx.bezierCurveTo(-5*sc,6*sc,-6*sc,-4*sc,0,-12*sc);
  ctx.bezierCurveTo(6*sc,-4*sc,5*sc,6*sc,0,12*sc);
  ctx.fill();
  ctx.shadowColor='rgba(255,160,40,0.8)';
  ctx.shadowBlur=12*sc;
  ctx.fillStyle='rgba(255,245,180,0.9)';
  ctx.beginPath();ctx.arc(0,-2*sc,3*sc,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  ctx.restore();
}

function drawTeaCup(ctx, cx, by, sc, lampOn) {
  const r=18*sc, cy=by-r*1.2;
  // saucer
  ctx.fillStyle='#d4b890';
  ctx.beginPath();ctx.ellipse(cx,by,r*1.4,r*.45,0,0,Math.PI*2);ctx.fill();
  // cup
  const cupG=ctx.createLinearGradient(cx-r,cy,cx+r,cy);
  cupG.addColorStop(0,'rgba(255,255,255,0.1)');cupG.addColorStop(0.3,'rgba(0,0,0,0)');cupG.addColorStop(1,'rgba(0,0,0,0.12)');
  ctx.fillStyle='#e8d8b8';
  ctx.beginPath();ctx.ellipse(cx,cy,r,r*.85,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=cupG;ctx.beginPath();ctx.ellipse(cx,cy,r,r*.85,0,0,Math.PI*2);ctx.fill();
  // tea inside
  ctx.fillStyle='rgba(160,80,20,0.65)';
  ctx.beginPath();ctx.ellipse(cx,cy,r*.85,r*.7,0,0,Math.PI*2);ctx.fill();
  // steam
  if(lampOn){
    ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=1.5*sc;ctx.lineCap='round';
    [[cx-5*sc,-22],[cx,  -30],[cx+5*sc,-22]].forEach(([sx,sh])=>{
      ctx.beginPath();ctx.moveTo(sx,cy+sh*sc);
      ctx.quadraticCurveTo(sx+4*sc,cy+(sh-10)*sc,sx,cy+(sh-20)*sc);ctx.stroke();
    });
  }
  // handle
  ctx.strokeStyle='#c8b898';ctx.lineWidth=2.5*sc;ctx.beginPath();
  ctx.arc(cx+r,cy,r*.5,Math.PI*.25,Math.PI*.75);ctx.stroke();
}

function drawFrameOnDesk(ctx, fx, deskY, fw, photos, frameIdx) {
  // Picture frame sitting on desk (separate from interactive item canvas)
  // This is just a small thumbnail indication — actual item is on canvas
}

function drawFloor(ctx, x, deskY, W, H) {
  const floorY = deskY+20;
  // floor planks
  for(let row=0;row<3;row++){
    const fy = floorY + row*(H-floorY)/3;
    const fH = (H-floorY)/3;
    const fG = ctx.createLinearGradient(0,fy,0,fy+fH);
    fG.addColorStop(0, row===0?'#5a3010':'#4a2808');
    fG.addColorStop(1, '#2a1606');
    ctx.fillStyle=fG;
    ctx.fillRect(x, fy, W, fH+1);
    // plank lines
    ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=1;
    for(let px=0;px<W;px+=100){
      ctx.beginPath();ctx.moveTo(px,fy);ctx.lineTo(px,fy+fH);ctx.stroke();
    }
    ctx.strokeStyle='rgba(0,0,0,0.07)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,fy);ctx.lineTo(W,fy);ctx.stroke();
  }
}

// ── ITEM RENDERERS (lofi illustrated style) ─────────────────────────────────

function drawEnvelope(canvas, animate) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  const S = 0.85;
  const ex = W*0.07, ey = H*0.12, ew = W*0.86, eh = H*0.76;

  ctx.save();
  ctx.translate(W/2, H/2);
  ctx.scale(S,S);
  ctx.translate(-W/2,-H/2);

  // ── envelope body — warm aged paper, lofi painted feel
  // Multiple layered gradients to get that illustrated warmth
  const bodyG = ctx.createLinearGradient(ex, ey, ex+ew, ey+eh);
  bodyG.addColorStop(0,  '#f0cc68');
  bodyG.addColorStop(0.35,'#e4b848');
  bodyG.addColorStop(0.65,'#d8a430');
  bodyG.addColorStop(1,  '#c89028');
  ctx.fillStyle = bodyG;
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.beginPath();
  ctx.roundRect(ex, ey, ew, eh, 4);
  ctx.fill();
  ctx.shadowBlur=0; ctx.shadowOffsetY=0;

  // left fold triangle — cast shadow
  ctx.fillStyle = 'rgba(80,40,0,0.22)';
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex+ew/2-2, ey+eh*0.56);
  ctx.lineTo(ex, ey+eh);
  ctx.closePath();
  ctx.fill();

  // right fold
  ctx.fillStyle = 'rgba(80,40,0,0.16)';
  ctx.beginPath();
  ctx.moveTo(ex+ew, ey);
  ctx.lineTo(ex+ew/2+2, ey+eh*0.56);
  ctx.lineTo(ex+ew, ey+eh);
  ctx.closePath();
  ctx.fill();

  // bottom fold — slight highlight
  ctx.fillStyle = 'rgba(255,255,255,0.09)';
  ctx.beginPath();
  ctx.moveTo(ex, ey+eh);
  ctx.lineTo(ex+ew/2, ey+eh*0.56);
  ctx.lineTo(ex+ew, ey+eh);
  ctx.closePath();
  ctx.fill();

  // ── FLAP — lighter warm paper
  const flapG = ctx.createLinearGradient(ex, ey, ex+ew/2, ey+eh*0.6);
  flapG.addColorStop(0, '#f8e898');
  flapG.addColorStop(0.4,'#f0d060');
  flapG.addColorStop(1, '#d8a830');
  ctx.fillStyle = flapG;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex+ew/2, ey+eh*0.58);
  ctx.lineTo(ex+ew, ey);
  ctx.closePath();
  ctx.fill();
  // flap top highlight
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex+ew/2, ey+eh*0.2);
  ctx.lineTo(ex+ew, ey);
  ctx.closePath();
  ctx.fill();
  // flap bottom shadow edge
  ctx.strokeStyle = 'rgba(120,70,10,0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ex,ey);
  ctx.lineTo(ex+ew/2,ey+eh*0.58);
  ctx.lineTo(ex+ew,ey);
  ctx.stroke();

  // ── WAX SEAL
  const sealCX = ex+ew/2, sealCY = ey+eh*0.62, sealR = Math.min(ew,eh)*0.12;
  const sealOG = ctx.createRadialGradient(sealCX-sealR*.3, sealCY-sealR*.3, 1, sealCX, sealCY, sealR);
  sealOG.addColorStop(0,'#e84848');
  sealOG.addColorStop(0.5,'#b82020');
  sealOG.addColorStop(0.8,'#8a0e0e');
  sealOG.addColorStop(1,'#6a0808');
  ctx.fillStyle = sealOG;
  ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=6;ctx.shadowOffsetY=3;
  ctx.beginPath();ctx.arc(sealCX,sealCY,sealR,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  // seal inner circle
  ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(sealCX,sealCY,sealR*.78,0,Math.PI*2);ctx.stroke();
  // heart
  ctx.fillStyle='#f8d060';ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=3;
  ctx.font=`bold ${sealR*1.1}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('♥',sealCX,sealCY+sealR*.06);
  ctx.shadowBlur=0;ctx.textAlign='left';ctx.textBaseline='alphabetic';

  // ── STAMP top right corner
  const stX=ex+ew*.78, stY=ey+eh*.12, stW=ew*.14, stH=eh*.2;
  ctx.fillStyle='rgba(255,255,255,0.18)';
  ctx.strokeStyle='rgba(255,255,255,0.32)';ctx.lineWidth=1;
  ctx.setLineDash([2,2]);
  ctx.beginPath();ctx.rect(stX,stY,stW,stH);ctx.fill();ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='rgba(100,180,80,0.35)';
  ctx.fillRect(stX+2,stY+2,stW-4,stH-4);

  // ── paper grain texture (crosshatch)
  ctx.save();
  ctx.globalAlpha=0.035;
  ctx.strokeStyle='#8a6010';ctx.lineWidth=0.5;
  for(let i=0;i<15;i++){
    ctx.beginPath();ctx.moveTo(ex+i*(ew/14),ey);ctx.lineTo(ex+(i+1)*(ew/14),ey+eh);ctx.stroke();
  }
  ctx.restore();

  // ── top edge highlight
  ctx.fillStyle='rgba(255,248,180,0.3)';
  ctx.fillRect(ex,ey,ew,3);

  ctx.restore();
}

function drawCamera(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  const bx=W*.05, by=H*.18, bw=W*.9, bh=H*.72;

  // ── PENTAPRISM HUMP
  const hx=bx+bw*.08, hw=bw*.42, hh=bh*.28;
  const humpG=ctx.createLinearGradient(hx,by-hh,hx,by);
  humpG.addColorStop(0,'#2e3440');humpG.addColorStop(1,'#1e2430');
  ctx.fillStyle=humpG;
  ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
  ctx.beginPath();ctx.roundRect(hx,by-hh,hw,hh+4,[5,5,0,0]);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;

  // ── MAIN BODY
  const bodyG=ctx.createLinearGradient(bx,by,bx,by+bh);
  bodyG.addColorStop(0,'#353c46');bodyG.addColorStop(0.3,'#252c38');bodyG.addColorStop(0.7,'#181e28');bodyG.addColorStop(1,'#101418');
  ctx.fillStyle=bodyG;
  ctx.shadowColor='rgba(0,0,0,0.65)';ctx.shadowBlur=20;ctx.shadowOffsetY=10;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,6);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;

  // ── RUBBER GRIP (right side)
  const gx=bx+bw*.74, gw=bw*.24;
  ctx.save();
  ctx.beginPath();ctx.roundRect(gx,by,gw,bh,[0,6,6,0]);ctx.clip();
  ctx.fillStyle='#12161c';
  ctx.fillRect(gx,by,gw,bh);
  for(let gy=by;gy<by+bh;gy+=3.5){
    ctx.fillStyle='rgba(0,0,0,0.22)';ctx.fillRect(gx,gy,gw,1.8);
  }
  ctx.restore();

  // ── LENS BARREL — lofi illustrated style (concentric rings)
  const lcx=bx+bw*.36, lcy=by+bh*.52, lr=bh*.41;
  // outer barrel ring
  const barrelG=ctx.createRadialGradient(lcx-lr*.3,lcy-lr*.3,lr*.1,lcx,lcy,lr);
  barrelG.addColorStop(0,'#2c3040');barrelG.addColorStop(0.6,'#1a1e28');barrelG.addColorStop(1,'#0e1018');
  ctx.fillStyle=barrelG;
  ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=14;ctx.shadowOffsetY=6;
  ctx.beginPath();ctx.arc(lcx,lcy,lr,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;

  // focus ring (engraved texture)
  const r2=lr*.82;
  ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1.5;
  for(let a=0;a<Math.PI*2;a+=Math.PI/12){
    ctx.beginPath();
    ctx.arc(lcx,lcy,r2,a,a+Math.PI/18);ctx.stroke();
  }
  // aperture ring
  const r3=lr*.68;
  ctx.fillStyle='#141820';
  ctx.beginPath();ctx.arc(lcx,lcy,r3,0,Math.PI*2);ctx.fill();
  // glass element — deep blue with coating
  const r4=lr*.52;
  const glassG=ctx.createRadialGradient(lcx-r4*.35,lcy-r4*.35,r4*.05,lcx,lcy,r4);
  glassG.addColorStop(0,'rgba(80,120,200,0.45)');
  glassG.addColorStop(0.3,'rgba(40,70,160,0.28)');
  glassG.addColorStop(0.65,'rgba(14,22,60,0.18)');
  glassG.addColorStop(1,'rgba(4,8,20,0.08)');
  ctx.fillStyle='#0a0e18';ctx.beginPath();ctx.arc(lcx,lcy,r4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=glassG;ctx.beginPath();ctx.arc(lcx,lcy,r4,0,Math.PI*2);ctx.fill();
  // blue lens coating shimmer
  const coatG=ctx.createRadialGradient(lcx-r4*.3,lcy-r4*.3,1,lcx-r4*.15,lcy-r4*.15,r4*.6);
  coatG.addColorStop(0,'rgba(140,170,255,0.28)');
  coatG.addColorStop(0.5,'rgba(100,140,230,0.12)');
  coatG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=coatG;ctx.beginPath();ctx.arc(lcx,lcy,r4,0,Math.PI*2);ctx.fill();
  // inner reflection dot
  ctx.fillStyle='rgba(200,220,255,0.12)';
  ctx.beginPath();ctx.ellipse(lcx-r4*.2,lcy-r4*.25,r4*.18,r4*.1,-0.4,0,Math.PI*2);ctx.fill();
  // lens ring border highlight
  ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(lcx,lcy,lr,0,Math.PI*2);ctx.stroke();

  // ── SHUTTER BUTTON
  const sx=bx+bw*.62, sy2=by-2;
  ctx.fillStyle='#404850';
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=5;ctx.shadowOffsetY=2;
  ctx.beginPath();ctx.arc(sx,sy2,bw*.055,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle='rgba(255,255,255,0.08)';
  ctx.beginPath();ctx.arc(sx-1,sy2-1,bw*.028,0,Math.PI*2);ctx.fill();

  // ── VIEWFINDER
  const vfx=bx+bw*.14, vfy=by-bh*.13, vfw=bw*.15, vfh=bh*.1;
  ctx.fillStyle='#080c14';
  ctx.strokeStyle='#2a2e3a';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.roundRect(vfx,vfy,vfw,vfh,2);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(60,100,200,0.15)';ctx.fillRect(vfx+1,vfy+1,vfw-2,vfh-2);

  // ── FLASH
  const fsx=bx+bw*.54, fsy=by-bh*.12, fsw=bw*.15, fsh=bh*.09;
  const flashG=ctx.createLinearGradient(fsx,fsy,fsx,fsy+fsh);
  flashG.addColorStop(0,'#c8a050');flashG.addColorStop(1,'#8a6018');
  ctx.fillStyle=flashG;
  ctx.beginPath();ctx.roundRect(fsx,fsy,fsw,fsh,2);ctx.fill();
  ctx.fillStyle='rgba(255,230,130,0.25)';ctx.fillRect(fsx+1,fsy+1,fsw-2,2);

  // ── BRAND (WABI)
  ctx.fillStyle='rgba(200,165,80,0.72)';
  ctx.font=`bold ${bw*.055}px Special Elite, monospace`;
  ctx.textAlign='center';ctx.letterSpacing='0.1em';
  ctx.fillText('WABI', bx+bw*.63, by+bh*.22);
  ctx.textAlign='left';ctx.letterSpacing='0';

  // ── MODE DIAL
  const mdx=bx+bw*.88, mdy=by-bh*.15, mdr=bw*.065;
  const dialG=ctx.createRadialGradient(mdx-mdr*.3,mdy-mdr*.3,1,mdx,mdy,mdr);
  dialG.addColorStop(0,'#3e444e');dialG.addColorStop(1,'#1e2228');
  ctx.fillStyle=dialG;
  ctx.shadowColor='rgba(0,0,0,0.45)';ctx.shadowBlur=5;ctx.shadowOffsetY=2;
  ctx.beginPath();ctx.arc(mdx,mdy,mdr,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;
  for(let a=0;a<Math.PI*2;a+=Math.PI/5){
    ctx.beginPath();ctx.arc(mdx,mdy,mdr,a,a+Math.PI/12);ctx.stroke();
  }

  // ── TOP SHEEN
  const sheenG=ctx.createLinearGradient(bx,by,bx+bw*.4,by+bh*.3);
  sheenG.addColorStop(0,'rgba(255,255,255,0.055)');sheenG.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=sheenG;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,6);ctx.fill();
}

function drawPictureFrame(canvas, photos, frameIdx) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  const fx=W*.06, fy=H*.04, fw=W*.88, fh=H*.92;
  const border=fw*.12;

  // ── OUTER FRAME — lofi painted gold wood
  ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=22;ctx.shadowOffsetY=10;
  // multi-gradient gold frame (conic style)
  const frameStops = [
    [0,'#e8b828'],[0.08,'#b08010'],[0.18,'#e0a820'],[0.25,'#f0c840'],
    [0.35,'#ca9020'],[0.5,'#a87010'],[0.65,'#d8a020'],[0.75,'#f0c840'],
    [0.88,'#b08010'],[1,'#e8b828']
  ];
  // Draw frame as 4 trapezoids for 3D feel
  // Top face
  const topG=ctx.createLinearGradient(fx,fy,fx,fy+border);
  topG.addColorStop(0,'#f0c840');topG.addColorStop(0.4,'#d4a020');topG.addColorStop(1,'#8a5c08');
  ctx.fillStyle=topG;
  ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+fw,fy);
  ctx.lineTo(fx+fw-border,fy+border);ctx.lineTo(fx+border,fy+border);ctx.closePath();ctx.fill();
  // Bottom face
  const botG=ctx.createLinearGradient(fx,fy+fh-border,fx,fy+fh);
  botG.addColorStop(0,'#8a5c08');botG.addColorStop(0.6,'#c8900c');botG.addColorStop(1,'#e8b020');
  ctx.fillStyle=botG;
  ctx.beginPath();ctx.moveTo(fx,fy+fh);ctx.lineTo(fx+fw,fy+fh);
  ctx.lineTo(fx+fw-border,fy+fh-border);ctx.lineTo(fx+border,fy+fh-border);ctx.closePath();ctx.fill();
  // Left face
  const lG=ctx.createLinearGradient(fx,fy,fx+border,fy);
  lG.addColorStop(0,'#f0c840');lG.addColorStop(0.4,'#c09020');lG.addColorStop(1,'#8a5c08');
  ctx.fillStyle=lG;
  ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx,fy+fh);
  ctx.lineTo(fx+border,fy+fh-border);ctx.lineTo(fx+border,fy+border);ctx.closePath();ctx.fill();
  // Right face
  const rG=ctx.createLinearGradient(fx+fw-border,fy,fx+fw,fy);
  rG.addColorStop(0,'#8a5c08');rG.addColorStop(0.4,'#a87018');rG.addColorStop(1,'#d4a020');
  ctx.fillStyle=rG;
  ctx.beginPath();ctx.moveTo(fx+fw,fy);ctx.lineTo(fx+fw,fy+fh);
  ctx.lineTo(fx+fw-border,fy+fh-border);ctx.lineTo(fx+fw-border,fy+border);ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;

  // ── Corner ornaments
  const corners=[[fx,fy],[fx+fw,fy],[fx,fy+fh],[fx+fw,fy+fh]];
  corners.forEach(([cx,cy])=>{
    const cg=ctx.createRadialGradient(cx,cy,1,cx,cy,border*.55);
    cg.addColorStop(0,'#f8d030');cg.addColorStop(0.5,'#c89020');cg.addColorStop(1,'#8a5c08');
    ctx.fillStyle=cg;
    ctx.shadowColor='rgba(0,0,0,0.3)';ctx.shadowBlur=6;ctx.shadowOffsetY=2;
    ctx.beginPath();ctx.arc(cx,cy,border*.5,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  });

  // ── MAT board (cream)
  const mx=fx+border, my=fy+border, mw=fw-border*2, mh=fh-border*2;
  ctx.fillStyle='#ece0bc';
  ctx.fillRect(mx,my,mw,mh);
  ctx.shadowColor='rgba(0,0,0,0.2)';ctx.shadowBlur=8;ctx.shadowOffsetX=3;ctx.shadowOffsetY=3;
  ctx.fillStyle='#e8dab8';ctx.fillRect(mx+2,my+2,mw-4,mh-4);
  ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;

  // ── PHOTO AREA
  const pp=border*.45;
  const phx=mx+pp,phy=my+pp,phw=mw-pp*2,phh=mh-pp*2;
  ctx.fillStyle='#1a1208';
  ctx.fillRect(phx,phy,phw,phh);
  // render actual photo if available
  if(frameIdx>=0 && photos && photos[frameIdx]) {
    const img=new Image();
    img.onload=()=>{
      ctx.save();ctx.beginPath();ctx.rect(phx,phy,phw,phh);ctx.clip();
      // fit cover
      const ir=img.width/img.height,fr=phw/phh;
      let sx=0,sy=0,sw=img.width,sh=img.height;
      if(ir>fr){sw=img.height*fr;sx=(img.width-sw)/2;}
      else{sh=img.width/fr;sy=(img.height-sh)/2;}
      ctx.drawImage(img,sx,sy,sw,sh,phx,phy,phw,phh);
      ctx.restore();
    };
    img.src=photos[frameIdx];
  } else {
    // placeholder — soft blur suggestion of a photo
    const phG=ctx.createLinearGradient(phx,phy,phx+phw,phy+phh);
    phG.addColorStop(0,'#1e1810');phG.addColorStop(0.5,'#1a1408');phG.addColorStop(1,'#151008');
    ctx.fillStyle=phG;ctx.fillRect(phx,phy,phw,phh);
    ctx.fillStyle='rgba(255,230,160,0.08)';
    ctx.font=`${phh*.18}px Lora,serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('no photo', phx+phw/2,phy+phh/2);
    ctx.textAlign='left';ctx.textBaseline='alphabetic';
  }

  // Frame top sheen
  const sheenG=ctx.createLinearGradient(fx,fy,fx+fw*.45,fy+fh*.4);
  sheenG.addColorStop(0,'rgba(255,250,200,0.12)');sheenG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sheenG;ctx.fillRect(fx,fy,fw,fh);
}

function drawWalkman(canvas, playing, reelAngle) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  const bx=W*.04, by=H*.08, bw=W*.78, bh=H*.84;

  // ── BODY — deep navy blue, lofi plastic feel
  const bodyG=ctx.createLinearGradient(bx,by,bx,by+bh);
  bodyG.addColorStop(0,'#2c3c5a');bodyG.addColorStop(0.35,'#1e2c4a');bodyG.addColorStop(0.7,'#141e3a');bodyG.addColorStop(1,'#0e162e');
  ctx.fillStyle=bodyG;
  ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=22;ctx.shadowOffsetY=10;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,10);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  // body edge highlight
  ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,10);ctx.stroke();

  // ── CASSETTE WINDOW
  const wx=bx+bw*.08, wy=by+bh*.1, ww=bw*.84, wh=bh*.54;
  ctx.fillStyle='#01030a';
  ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=10;ctx.shadowOffsetY=4;
  ctx.beginPath();ctx.roundRect(wx,wy,ww,wh,5);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle='#1c3258';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(wx,wy,ww,wh,5);ctx.stroke();

  // Window plastic sheen
  const wsG=ctx.createLinearGradient(wx,wy,wx+ww*.6,wy+wh*.5);
  wsG.addColorStop(0,'rgba(74,144,217,0.08)');wsG.addColorStop(0.4,'rgba(255,255,255,0.03)');wsG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=wsG;ctx.beginPath();ctx.roundRect(wx+1,wy+1,ww-2,wh-2,4);ctx.fill();

  // ── REELS
  const reel1CX=wx+ww*.26, reel2CX=wx+ww*.74, reelCY=wy+wh*.45, reelR=wh*.38;
  [reel1CX,reel2CX].forEach((rcx,ri)=>{
    const angle=ri===0?reelAngle:reelAngle*1.35;
    // outer ring
    const rG=ctx.createRadialGradient(rcx-reelR*.3,reelCY-reelR*.3,reelR*.05,rcx,reelCY,reelR);
    rG.addColorStop(0,'#1e3660');rG.addColorStop(0.7,'#0c1a30');rG.addColorStop(1,'#040a18');
    ctx.fillStyle=rG;
    ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
    ctx.beginPath();ctx.arc(rcx,reelCY,reelR,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    ctx.strokeStyle='#1c3258';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(rcx,reelCY,reelR,0,Math.PI*2);ctx.stroke();
    // reel tick marks
    for(let a=0;a<Math.PI*2;a+=Math.PI/8){
      ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(rcx,reelCY,reelR*.88,a,a+Math.PI/16);ctx.stroke();
    }
    // middle hub
    const mG=ctx.createRadialGradient(rcx-reelR*.2,reelCY-reelR*.2,1,rcx,reelCY,reelR*.55);
    mG.addColorStop(0,'#2a4878');mG.addColorStop(1,'#0c1c38');
    ctx.fillStyle=mG;ctx.beginPath();ctx.arc(rcx,reelCY,reelR*.55,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#1a3050';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(rcx,reelCY,reelR*.55,0,Math.PI*2);ctx.stroke();
    // spokes (rotate with angle)
    ctx.save();ctx.translate(rcx,reelCY);ctx.rotate(angle);
    for(let sp=0;sp<3;sp++){
      ctx.rotate(Math.PI*2/3);
      ctx.strokeStyle='rgba(74,144,217,0.65)';ctx.lineWidth=1.5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,reelR*.45);ctx.stroke();
    }
    ctx.restore();
    // hub center
    const hG=ctx.createRadialGradient(rcx-reelR*.12,reelCY-reelR*.12,1,rcx,reelCY,reelR*.2);
    hG.addColorStop(0,'#3a7098');hG.addColorStop(1,'#182848');
    ctx.fillStyle=hG;ctx.beginPath();ctx.arc(rcx,reelCY,reelR*.2,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#2a5080';ctx.lineWidth=1;ctx.beginPath();ctx.arc(rcx,reelCY,reelR*.2,0,Math.PI*2);ctx.stroke();
  });

  // tape path between reels
  ctx.strokeStyle='rgba(30,50,70,0.8)';ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(reel1CX+reelR*.85, reelCY+reelR*.6);
  ctx.quadraticCurveTo((reel1CX+reel2CX)/2, reelCY+reelR*.85, reel2CX-reelR*.85, reelCY+reelR*.6);
  ctx.stroke();

  // ── CASSETTE LABEL (center)
  const lbW=ww*.25,lbH=wh*.52,lbX=wx+ww/2-lbW/2,lbY=wy+wh/2-lbH/2;
  const lbG=ctx.createLinearGradient(lbX,lbY,lbX+lbW,lbY+lbH);
  lbG.addColorStop(0,'#d4ae52');lbG.addColorStop(0.5,'#e8c868');lbG.addColorStop(1,'#c8a045');
  ctx.fillStyle=lbG;
  ctx.shadowColor='rgba(0,0,0,0.35)';ctx.shadowBlur=5;ctx.shadowOffsetY=2;
  ctx.beginPath();ctx.roundRect(lbX,lbY,lbW,lbH,3);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  // label lines
  ctx.strokeStyle='rgba(140,90,10,0.3)';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(lbX+3,lbY+lbH*.35);ctx.lineTo(lbX+lbW-3,lbY+lbH*.35);ctx.stroke();
  ctx.beginPath();ctx.moveTo(lbX+3,lbY+lbH*.65);ctx.lineTo(lbX+lbW-3,lbY+lbH*.65);ctx.stroke();
  ctx.fillStyle='rgba(26,14,6,0.7)';ctx.font=`bold ${lbH*.2}px Special Elite,monospace`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('WABI',lbX+lbW/2,lbY+lbH*.2);
  ctx.font=`${lbH*.16}px Special Elite,monospace`;
  ctx.fillText('mix tape',lbX+lbW/2,lbY+lbH*.5);
  ctx.fillText('Side A',lbX+lbW/2,lbY+lbH*.79);
  ctx.textAlign='left';ctx.textBaseline='alphabetic';

  // ── BLUE ACCENT STRIPE
  const strG=ctx.createLinearGradient(bx,0,bx+bw,0);
  strG.addColorStop(0,'rgba(0,0,0,0)');strG.addColorStop(0.1,'#3a6aaa');
  strG.addColorStop(0.5,'#5898cc');strG.addColorStop(0.9,'#3a6aaa');strG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=strG;
  ctx.fillRect(bx,wy+wh+2,bw,4);

  // ── CONTROLS BAR
  const cbY=by+bh*.72, cbH=bh*.2;
  ctx.fillStyle='#0a1428';ctx.strokeStyle='#1c3058';ctx.lineWidth=1.5;
  ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=6;ctx.shadowOffsetY=2;
  ctx.beginPath();ctx.roundRect(bx+bw*.05,cbY,bw*.9,cbH,4);ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  // control dots
  const dots=[.15,.28,.5,.72,.85];
  dots.forEach((dx,di)=>{
    const dcx=bx+bw*.05+bw*.9*dx, dcy=cbY+cbH*.5, dr=cbH*.28;
    const isLed=di===2;
    const dG=ctx.createRadialGradient(dcx-dr*.3,dcy-dr*.3,1,dcx,dcy,dr);
    if(isLed&&playing){
      dG.addColorStop(0,'#70b8f0');dG.addColorStop(1,'#2878c8');
      ctx.shadowColor='rgba(74,136,216,0.6)';ctx.shadowBlur=8;
    } else {
      dG.addColorStop(0,'#1e3460');dG.addColorStop(1,'#0a1230');
    }
    ctx.fillStyle=dG;
    ctx.beginPath();ctx.arc(dcx,dcy,dr,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.strokeStyle='#1c3258';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(dcx,dcy,dr,0,Math.PI*2);ctx.stroke();
  });

  // ── VOLUME ROCKER (right side)
  const vrX=bx+bw+2, vrY=by+bh*.2, vrW=W*.12, vrH=bh*.6;
  const vrG=ctx.createLinearGradient(vrX,vrY,vrX+vrW,vrY);
  vrG.addColorStop(0,'#182848');vrG.addColorStop(1,'#223868');
  ctx.fillStyle=vrG;ctx.beginPath();ctx.roundRect(vrX,vrY,vrW,vrH,3);ctx.fill();
  ctx.strokeStyle='#2848a8';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(vrX,vrY,vrW,vrH,3);ctx.stroke();
  for(let ly=vrY+6;ly<vrY+vrH-4;ly+=5){
    ctx.strokeStyle='rgba(70,120,220,0.3)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(vrX+3,ly);ctx.lineTo(vrX+vrW-3,ly);ctx.stroke();
  }

  // ── HEADPHONE JACK
  ctx.fillStyle='#01030a';ctx.strokeStyle='#1c3258';ctx.lineWidth=1.5;
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=4;
  ctx.beginPath();ctx.arc(bx+bw*.12,by+bh*.94,4,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;

  // ── BODY SHEEN
  const sheenG=ctx.createLinearGradient(bx,by,bx+bw*.45,by+bh*.35);
  sheenG.addColorStop(0,'rgba(255,255,255,0.06)');sheenG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sheenG;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,10);ctx.fill();
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function lightenHex(hex, amount) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return '#'+[Math.min(255,r+amount),Math.min(255,g+amount),Math.min(255,b+amount)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function darkenHex(hex, amount) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return '#'+[Math.max(0,r-amount),Math.max(0,g-amount),Math.max(0,b-amount)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
