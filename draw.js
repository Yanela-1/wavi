// draw.js — Enhanced 3D Lofi Room — deep shadows, film grain, ambient glow

// ── ROOM BACKGROUND ──────────────────────────────────────────────────────────
function drawRoom(canvas, lampOn, photos, frameIdx) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const deskY = H * 0.60;
  ctx.clearRect(0,0,W,H);

  // ── NIGHT SKY ──
  const skyG = ctx.createLinearGradient(0,0,0,H*.25);
  skyG.addColorStop(0,'#06091a');
  skyG.addColorStop(1,'#0c1228');
  ctx.fillStyle=skyG; ctx.fillRect(0,0,W,deskY);

  // ── WARM PLASTERED WALL ──
  const wallG=ctx.createLinearGradient(0,0,W,deskY);
  wallG.addColorStop(0,'#241005');
  wallG.addColorStop(0.3,'#321808');
  wallG.addColorStop(0.7,'#2c1406');
  wallG.addColorStop(1,'#200e04');
  ctx.fillStyle=wallG;
  const winX=W*.26, winY=H*.04, winW=W*.48, winH=H*.48;
  // Wall sections around window
  ctx.fillRect(0,0,winX-16,deskY);
  ctx.fillRect(winX+winW+16,0,W,deskY);
  ctx.fillRect(0,0,W,winY-10);
  ctx.fillRect(winX-16,winY+winH+10,winW+32,deskY-(winY+winH+10));

  // Wall texture — subtle grain
  ctx.save();
  ctx.globalAlpha=0.03;
  for(let y=0;y<deskY;y+=3){
    ctx.fillStyle=`hsl(${20+Math.sin(y*.1)*5},${30}%,${50+Math.sin(y*.05)*5}%)`;
    ctx.fillRect(0,y,W,2);
  }
  ctx.globalAlpha=1;
  ctx.restore();

  // Wall plaster texture lines (subtle)
  ctx.save();
  ctx.strokeStyle='rgba(0,0,0,0.04)';ctx.lineWidth=1;
  for(let y=0;y<deskY;y+=6){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }
  ctx.restore();

  // Lamp warm glow cast on wall (before window)
  const lcx=W*.34;
  if(lampOn){
    // Large warm cone of light on wall
    const wallGlow=ctx.createRadialGradient(lcx,H*.22,0,lcx,H*.22,W*.5);
    wallGlow.addColorStop(0,'rgba(255,160,50,0.22)');
    wallGlow.addColorStop(0.35,'rgba(240,120,30,0.09)');
    wallGlow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=wallGlow;ctx.fillRect(0,0,W,deskY);
    // Cone of light downward
    ctx.save();
    ctx.beginPath();ctx.moveTo(lcx,H*.22);ctx.lineTo(lcx-W*.32,deskY+H*.08);ctx.lineTo(lcx+W*.32,deskY+H*.08);ctx.closePath();
    const coneG=ctx.createLinearGradient(lcx,H*.22,lcx,deskY+H*.05);
    coneG.addColorStop(0,'rgba(255,155,45,0.14)');coneG.addColorStop(0.5,'rgba(255,130,40,0.06)');coneG.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=coneG;ctx.fill();ctx.restore();
  }

  // ── WINDOW FRAME (wooden, with 3D depth) ──
  const wfp=16;
  // Outer shadow
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=18;ctx.shadowOffsetX=4;ctx.shadowOffsetY=4;
  const wfG=ctx.createLinearGradient(winX,0,winX+winW,0);
  wfG.addColorStop(0,'#b09050');wfG.addColorStop(0.15,'#d4a830');wfG.addColorStop(0.5,'#c8a040');wfG.addColorStop(0.85,'#b09050');wfG.addColorStop(1,'#7a5020');
  ctx.fillStyle=wfG;
  // Top bar
  ctx.fillRect(winX-wfp,winY-wfp,winW+wfp*2,wfp);
  // Bottom bar
  ctx.fillRect(winX-wfp,winY+winH,winW+wfp*2,wfp+4);
  // Left bar
  ctx.fillRect(winX-wfp,winY-wfp,wfp,winH+wfp*2);
  // Right bar
  ctx.fillRect(winX+winW,winY-wfp,wfp,winH+wfp*2);
  ctx.restore();
  // Frame inner bevel (3D depth)
  ctx.fillStyle='rgba(255,210,100,0.18)';
  ctx.fillRect(winX-wfp,winY-wfp,winW+wfp*2,3);
  ctx.fillStyle='rgba(0,0,0,0.35)';
  ctx.fillRect(winX-wfp,winY+winH+wfp+1,winW+wfp*2,3);

  // ── NIGHT CITY SCENE through window ──
  ctx.save();
  ctx.beginPath();ctx.rect(winX,winY,winW,winH);ctx.clip();
  // Deep blue-purple night sky gradient
  const ngG=ctx.createLinearGradient(0,winY,0,winY+winH);
  ngG.addColorStop(0,'#06091c');ngG.addColorStop(0.35,'#0a1028');ngG.addColorStop(0.65,'#0f1535');ngG.addColorStop(1,'#14183e');
  ctx.fillStyle=ngG;ctx.fillRect(winX,winY,winW,winH);

  // Stars — varied brightness
  const starData=[[.06,.06,0.9],[.16,.05,0.7],[.28,.11,0.8],[.42,.04,0.6],[.54,.08,0.9],[.63,.15,0.5],
    [.76,.06,0.8],[.88,.10,0.7],[.94,.07,0.9],[.10,.20,0.5],[.36,.18,0.7],[.68,.17,0.6],[.82,.23,0.8],
    [.22,.28,0.4],[.50,.24,0.6],[.72,.12,0.5],[.90,.20,0.7],[.04,.32,0.5],[.48,.15,0.4],[.85,.14,0.6]];
  starData.forEach(([sx,sy,br])=>{
    ctx.fillStyle=`rgba(255,255,255,${br})`;
    ctx.beginPath();ctx.arc(winX+winW*sx,winY+winH*sy,0.7+br*.4,0,Math.PI*2);ctx.fill();
  });

  // Moon — soft glowing
  const mx=winX+winW*.79,my=winY+winH*.1;
  ctx.save();
  const moonHalo=ctx.createRadialGradient(mx,my,0,mx,my,26);
  moonHalo.addColorStop(0,'rgba(255,248,200,0.15)');moonHalo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=moonHalo;ctx.beginPath();ctx.arc(mx,my,26,0,Math.PI*2);ctx.fill();
  const moonG=ctx.createRadialGradient(mx-2,my-2,1,mx,my,11);
  moonG.addColorStop(0,'#fffce8');moonG.addColorStop(0.5,'#f8e8b0');moonG.addColorStop(0.85,'#e8d080');moonG.addColorStop(1,'rgba(220,190,100,0)');
  ctx.fillStyle=moonG;ctx.beginPath();ctx.arc(mx,my,11,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // City silhouette — far background (darkest, blue-grey)
  ctx.fillStyle='#131528';
  ctx.beginPath();ctx.moveTo(winX,winY+winH);
  const fb=[.52,.32,.18,.38,.28,.52,.20,.36,.50,.26,.40,.52,.30,.16,.42,.52,.22,.38,.52,.18,.32,.48,.26,.42];
  const fbw=winW/fb.length;
  fb.forEach((b,i)=>{ctx.lineTo(winX+i*fbw,winY+winH*b);ctx.lineTo(winX+(i+1)*fbw,winY+winH*b);});
  ctx.lineTo(winX+winW,winY+winH);ctx.closePath();ctx.fill();

  // City mid layer — warm dark brown
  ctx.fillStyle='#1e1210';
  ctx.beginPath();ctx.moveTo(winX,winY+winH);
  const mb=[.72,.48,.33,.58,.40,.68,.38,.53,.70,.43,.58,.72,.46,.31,.60,.72,.36,.53,.70,.33,.48,.65,.40,.58];
  const mbw=winW/mb.length;
  mb.forEach((b,i)=>{ctx.lineTo(winX+i*mbw,winY+winH*b);ctx.lineTo(winX+(i+1)*mbw,winY+winH*b);});
  ctx.lineTo(winX+winW,winY+winH);ctx.closePath();ctx.fill();

  // City near layer — dark warm
  ctx.fillStyle='#160e08';
  ctx.beginPath();ctx.moveTo(winX,winY+winH);
  const nb=[.88,.65,.50,.72,.58,.82,.55,.68,.85,.60,.74,.88,.62,.46,.76,.88,.52,.68,.86,.48,.62,.80,.55,.70];
  const nbw=winW/nb.length;
  nb.forEach((b,i)=>{ctx.lineTo(winX+i*nbw,winY+winH*b);ctx.lineTo(winX+(i+1)*nbw,winY+winH*b);});
  ctx.lineTo(winX+winW,winY+winH);ctx.closePath();ctx.fill();

  // Building windows — warm amber & cool blue glow
  const lights=[[.07,.64],[.13,.70],[.20,.66],[.27,.62],[.33,.68],[.40,.64],[.47,.71],[.53,.66],
    [.60,.62],[.67,.69],[.74,.64],[.81,.68],[.88,.63],[.10,.78],[.23,.81],[.37,.76],
    [.50,.79],[.64,.75],[.77,.80],[.87,.76],[.16,.57],[.31,.54],[.44,.59],[.57,.55],[.70,.58]];
  lights.forEach(([sx,sy],i)=>{
    const warm=i%3!==0;
    const col=warm?`rgba(255,${170+Math.random()*40|0},${40+Math.random()*30|0},0.8)`:`rgba(180,210,255,0.55)`;
    ctx.fillStyle=col;
    const lw=2+Math.random()*1.5,lh=2.5+Math.random()*2;
    ctx.fillRect(winX+winW*sx,winY+winH*sy,lw,lh);
    // Glow around warm lights
    if(warm){
      const lg=ctx.createRadialGradient(winX+winW*sx,winY+winH*sy,0,winX+winW*sx,winY+winH*sy,6);
      lg.addColorStop(0,'rgba(255,160,50,0.18)');lg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=lg;ctx.fillRect(winX+winW*sx-5,winY+winH*sy-4,12,10);
    }
  });

  // Window glass reflection on inside — subtle diagonal sheen
  const sheen=ctx.createLinearGradient(winX,winY,winX+winW*.4,winY+winH);
  sheen.addColorStop(0,'rgba(255,255,255,0)');sheen.addColorStop(0.4,'rgba(255,255,255,0.025)');sheen.addColorStop(0.6,'rgba(255,255,255,0.015)');sheen.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=sheen;ctx.fillRect(winX,winY,winW,winH);
  ctx.restore();

  // Window crossbars
  ctx.fillStyle='#b09040';
  ctx.fillRect(winX,winY+winH/2-4,winW,8);
  ctx.fillRect(winX+winW/2-4,winY,8,winH);
  ctx.fillStyle='rgba(255,215,100,0.18)';
  ctx.fillRect(winX,winY+winH/2-4,winW,2);
  ctx.fillRect(winX+winW/2-4,winY,2,winH);

  // Window sill — 3D top face + front face
  const sillG=ctx.createLinearGradient(0,winY+winH,0,winY+winH+22);
  sillG.addColorStop(0,'#d4aa50');sillG.addColorStop(0.35,'#b88828');sillG.addColorStop(1,'#6a4c10');
  ctx.fillStyle=sillG;ctx.fillRect(winX-wfp-6,winY+winH,winW+wfp*2+12,22);
  ctx.fillStyle='rgba(255,220,120,0.22)';ctx.fillRect(winX-wfp-6,winY+winH,winW+wfp*2+12,3);
  // Sill side face (3D)
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(winX-wfp-6,winY+winH+19,winW+wfp*2+12,5);

  // Plant on sill
  drawPlant(ctx,winX+winW*.62,winY+winH-8,W);

  // ── LAMP ──
  drawLamp(ctx,lcx,0,lampOn,W,H);

  // ── BOOKSHELF ──
  drawBookshelf(ctx,0,0,W*.115,deskY,W);
  // ── CORK BOARD ──
  drawCorkboard(ctx,W*.87,H*.07,W*.115,H*.28,W);
  // ── SMALL FRAMED ART ──
  drawWallArt(ctx,W*.155,H*.12,W*.09,H*.14);
  // ── DESK ──
  drawDesk(ctx,0,deskY,W,H,lampOn,lcx);
  // ── DESK CLUTTER ──
  drawClutter(ctx,0,deskY,W,H);
  // ── FLOOR ──
  drawFloor(ctx,0,deskY,W,H);
  // ── AMBIENT OCCLUSION corners ──
  const aoG=ctx.createRadialGradient(W/2,H/2,H*.15,W/2,H/2,H*.88);
  aoG.addColorStop(0,'rgba(0,0,0,0)');aoG.addColorStop(0.5,'rgba(0,0,0,0.04)');aoG.addColorStop(1,'rgba(0,0,0,0.78)');
  ctx.fillStyle=aoG;ctx.fillRect(0,0,W,H);
  // Bottom fade
  const bG=ctx.createLinearGradient(0,H*.85,0,H);
  bG.addColorStop(0,'rgba(0,0,0,0)');bG.addColorStop(1,'rgba(0,0,0,0.6)');
  ctx.fillStyle=bG;ctx.fillRect(0,H*.85,W,H*.15);
  // ── FILM GRAIN OVERLAY ──
  drawFilmGrain(ctx,W,H);
}

function drawFilmGrain(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.045;
  // Simplified grain: random noise rects
  for(let i=0;i<W*H/200;i++){
    const gx=Math.random()*W, gy=Math.random()*H;
    const gb=Math.random()>.5?255:0;
    ctx.fillStyle=`rgba(${gb},${gb},${gb},${Math.random()*.6})`;
    ctx.fillRect(gx,gy,1,1);
  }
  ctx.globalAlpha=1;
  ctx.restore();
}

function drawPlant(ctx,x,y,W){
  const s=W/900;
  // Pot — terracotta with 3D shading
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=10*s;ctx.shadowOffsetY=5*s;
  const potG=ctx.createLinearGradient(x-15*s,y,x+15*s,y+22*s);
  potG.addColorStop(0,'#c05828');potG.addColorStop(0.4,'#a04018');potG.addColorStop(1,'#6a2808');
  ctx.fillStyle=potG;
  ctx.beginPath();ctx.moveTo(x-15*s,y);ctx.lineTo(x+15*s,y);ctx.lineTo(x+11*s,y+22*s);ctx.lineTo(x-11*s,y+22*s);ctx.closePath();ctx.fill();
  ctx.restore();
  // Pot rim highlight
  ctx.fillStyle='#d07838';ctx.beginPath();ctx.ellipse(x,y,15*s,4.5*s,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,180,120,0.3)';ctx.beginPath();ctx.ellipse(x-2*s,y-1*s,9*s,2.5*s,0,0,Math.PI);ctx.fill();
  // Soil
  ctx.fillStyle='#1a0e06';ctx.beginPath();ctx.ellipse(x,y,12*s,3.5*s,0,0,Math.PI*2);ctx.fill();
  // Leaves
  const lv=[[-9,-30,32],[-4,-46,-20],[4,-38,14],[9,-28,-38],[0,-56,6],[-6,-42,50],[5,-50,-18]];
  lv.forEach(([lx,ly,a])=>{
    ctx.save();ctx.translate(x+lx*s,y+ly*s);ctx.rotate(a*Math.PI/180);
    const g=ctx.createRadialGradient(-2*s,-4*s,1,0,0,15*s);
    g.addColorStop(0,'#70a848');g.addColorStop(0.5,'#3e7828');g.addColorStop(1,'#1e4812');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,7.5*s,15*s,0,0,Math.PI*2);ctx.fill();
    // Leaf vein
    ctx.strokeStyle='rgba(80,160,40,0.3)';ctx.lineWidth=0.8*s;
    ctx.beginPath();ctx.moveTo(0,12*s);ctx.lineTo(0,-12*s);ctx.stroke();
    ctx.restore();
  });
  // Stem
  ctx.strokeStyle='#2e5010';ctx.lineWidth=2.2*s;
  ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-5*s,y-28*s,x-2*s,y-54*s);ctx.stroke();
}

function drawLamp(ctx,cx,topY,on,W,H){
  const s=W/900;
  // Cord from ceiling
  ctx.save();
  ctx.strokeStyle='#2e1808';ctx.lineWidth=2.5*s;
  ctx.beginPath();ctx.moveTo(cx,topY);ctx.quadraticCurveTo(cx+8*s,H*.06,cx,H*.19);ctx.stroke();
  // Arm
  ctx.strokeStyle='#c07828';ctx.lineWidth=6*s;ctx.lineCap='round';
  ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=6*s;
  ctx.beginPath();ctx.moveTo(cx,H*.19);ctx.lineTo(cx-24*s,H*.14);ctx.stroke();
  ctx.lineCap='butt';ctx.shadowBlur=0;
  // Arm joint
  ctx.fillStyle='#e8a060';ctx.beginPath();ctx.arc(cx,H*.19,4*s,0,Math.PI*2);ctx.fill();
  ctx.restore();
  // Shade
  const sw=75*s,sh=58*s,sx=cx-7*s,sy=H*.13;
  ctx.save();ctx.translate(sx,sy);
  ctx.shadowColor='rgba(0,0,0,0.55)';ctx.shadowBlur=18*s;ctx.shadowOffsetY=8*s;
  // Shade shape — 3D curved
  const shG=ctx.createLinearGradient(-sw/2,0,sw/2,sh);
  shG.addColorStop(0,'#d84830');shG.addColorStop(0.2,'#c03818');shG.addColorStop(0.5,'#a02808');shG.addColorStop(0.8,'#7a1a06');shG.addColorStop(1,'#601408');
  ctx.fillStyle=shG;
  ctx.beginPath();
  ctx.moveTo(-sw*.40,0);ctx.bezierCurveTo(-sw*.40,-14*s,sw*.40,-14*s,sw*.40,0);
  ctx.bezierCurveTo(sw*.52,sh*.42,sw*.46,sh*.88,sw*.37,sh);
  ctx.bezierCurveTo(sw*.16,sh*1.06,-sw*.16,sh*1.06,-sw*.37,sh);
  ctx.bezierCurveTo(-sw*.46,sh*.88,-sw*.52,sh*.42,-sw*.40,0);ctx.closePath();ctx.fill();
  // Rim top
  ctx.strokeStyle='#f0c080';ctx.lineWidth=2.5*s;ctx.shadowBlur=0;
  ctx.beginPath();ctx.ellipse(0,0,sw*.40,6*s,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(255,200,100,0.12)';ctx.beginPath();ctx.ellipse(0,0,sw*.40,6*s,0,0,Math.PI*2);ctx.fill();
  // Inner light glow
  if(on){
    const ig=ctx.createRadialGradient(0,sh*.65,2,0,sh*.5,sw*.38);
    ig.addColorStop(0,'rgba(255,235,160,0.95)');ig.addColorStop(0.25,'rgba(255,190,90,0.65)');ig.addColorStop(0.6,'rgba(255,140,50,0.25)');ig.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=ig;ctx.beginPath();ctx.ellipse(0,sh*.55,sw*.35,sh*.48,0,0,Math.PI*2);ctx.fill();
    // Bulb
    ctx.fillStyle='#fffce0';ctx.shadowColor='rgba(255,220,100,0.95)';ctx.shadowBlur=22*s;
    ctx.beginPath();ctx.arc(0,sh*.58,5.5*s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  }
  // Shade highlight (left)
  ctx.fillStyle='rgba(255,255,255,0.09)';ctx.beginPath();ctx.ellipse(-sw*.13,sh*.18,sw*.11,sh*.15,-0.3,0,Math.PI*2);ctx.fill();
  // Shade lower band
  ctx.strokeStyle='rgba(0,0,0,0.18)';ctx.lineWidth=1*s;
  ctx.beginPath();ctx.moveTo(-sw*.38,sh*.6);ctx.bezierCurveTo(-sw*.4,sh*.6+3,sw*.4,sh*.6+3,sw*.38,sh*.6);ctx.stroke();
  ctx.restore();
}

function drawBookshelf(ctx,x,y,w,h,W){
  const s=W/900;
  // Back panel
  ctx.fillStyle='#120a02';ctx.fillRect(x,y,w,h);
  // Right side panel with wood grain gradient
  const spG=ctx.createLinearGradient(x+w-8*s,0,x+w,0);
  spG.addColorStop(0,'#7a4c18');spG.addColorStop(0.5,'#5a3810');spG.addColorStop(1,'#3a2208');
  ctx.fillStyle=spG;ctx.fillRect(x+w-8*s,y,8*s,h);
  // Shelf boards
  [h*.32,h*.64].forEach(sy=>{
    const shG=ctx.createLinearGradient(0,y+sy,0,y+sy+14*s);
    shG.addColorStop(0,'#a87830');shG.addColorStop(0.35,'#8a5c18');shG.addColorStop(1,'#5e3c0e');
    ctx.fillStyle=shG;ctx.fillRect(x,y+sy,w,14*s);
    ctx.fillStyle='rgba(255,210,110,0.14)';ctx.fillRect(x,y+sy,w,2.5*s);
    // Shelf shadow under
    ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(x,y+sy+14*s,w,5*s);
  });
  // Books
  const rows=[[{w:11,h:.88,c:'#8a3020'},{w:9,h:.72,c:'#205080'},{w:13,h:.92,c:'#4a7030'},{w:8,h:.68,c:'#804020'},{w:11,h:.82,c:'#6a4080'},{w:8,h:.65,c:'#205048'},{w:10,h:.78,c:'#c09028'}],
               [{w:10,h:.80,c:'#7a3828'},{w:13,h:.90,c:'#284878'},{w:9,h:.74,c:'#5a7028'},{w:11,h:.86,c:'#782828'},{w:8,h:.70,c:'#204858'}]];
  rows.forEach((row,ri)=>{
    const shelfY=ri===0?h*.32:h*.64;
    const rowH=ri===0?h*.28:h*.30;
    let bx=x+4*s;
    row.forEach(b=>{
      const bw=b.w*s,bh=rowH*b.h,by=y+shelfY-bh;
      const bG=ctx.createLinearGradient(bx,by,bx+bw,by);
      bG.addColorStop(0,lighten(b.c,25));bG.addColorStop(0.12,b.c);bG.addColorStop(1,darken(b.c,25));
      ctx.fillStyle=bG;ctx.fillRect(bx,by,bw,bh);
      // Spine highlight
      ctx.fillStyle='rgba(255,255,255,0.09)';ctx.fillRect(bx,by,1.8*s,bh);
      // Page edge
      ctx.fillStyle='rgba(255,248,220,0.12)';ctx.fillRect(bx,by,bw,2.5*s);
      // Shadow right
      ctx.fillStyle='rgba(0,0,0,0.28)';ctx.fillRect(bx+bw-1.8*s,by,1.8*s,bh);
      bx+=bw+1.5*s;
    });
  });
  // Ambient occlusion top
  const aotG=ctx.createLinearGradient(x,y,x,y+h*.08);
  aotG.addColorStop(0,'rgba(0,0,0,0.45)');aotG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=aotG;ctx.fillRect(x,y,w,h*.08);
}

function drawCorkboard(ctx,x,y,w,h,W){
  const s=W/900;
  // Frame shadow
  ctx.save();ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12*s;ctx.shadowOffsetX=3*s;ctx.shadowOffsetY=4*s;
  const fG=ctx.createLinearGradient(x,y,x+w,y+h);
  fG.addColorStop(0,'#d89a22');fG.addColorStop(0.5,'#a07010');fG.addColorStop(1,'#c08818');
  ctx.fillStyle=fG;ctx.beginPath();ctx.roundRect(x,y,w,h,3);ctx.fill();
  ctx.restore();
  // Cork surface
  ctx.save();ctx.beginPath();ctx.roundRect(x+5*s,y+5*s,w-10*s,h-10*s,2);ctx.clip();
  const cG=ctx.createLinearGradient(x,y,x+w,y+h);
  cG.addColorStop(0,'#d09858');cG.addColorStop(0.35,'#b07c38');cG.addColorStop(0.65,'#c88a48');cG.addColorStop(1,'#c08040');
  ctx.fillStyle=cG;ctx.fillRect(x+5*s,y+5*s,w-10*s,h-10*s);
  // Cork texture dots
  ctx.fillStyle='rgba(0,0,0,0.06)';
  for(let ci=0;ci<20;ci++){
    const cx2=x+5*s+Math.random()*(w-10*s), cy2=y+5*s+Math.random()*(h-10*s);
    ctx.beginPath();ctx.arc(cx2,cy2,1+Math.random()*1.5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  // Post-it notes with push pins
  [[x+w*.08,y+h*.07,w*.72,h*.30,'#fffaaa',-3],[x+w*.12,y+h*.48,w*.68,h*.27,'#ffd890',4],[x+w*.06,y+h*.36,w*.6,h*.18,'#c8f0c8',2]].forEach(([px,py,pw,ph,pc,pr],ni)=>{
    ctx.save();ctx.translate(px+pw/2,py+ph/2);ctx.rotate(pr*Math.PI/180);
    ctx.shadowColor='rgba(0,0,0,0.3)';ctx.shadowBlur=6*s;ctx.shadowOffsetY=3*s;
    ctx.fillStyle=pc;ctx.beginPath();ctx.roundRect(-pw/2,-ph/2,pw,ph,1.5);ctx.fill();
    // Top fade (paper curl feel)
    const pnotchG=ctx.createLinearGradient(-pw/2,-ph/2,-pw/2,-ph/2+8*s);
    pnotchG.addColorStop(0,'rgba(255,255,255,0.28)');pnotchG.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=pnotchG;ctx.beginPath();ctx.roundRect(-pw/2,-ph/2,pw,8*s,1.5);ctx.fill();
    // Push pin
    ctx.shadowBlur=0;ctx.fillStyle='#c02020';ctx.beginPath();ctx.arc(0,-ph/2+3.5*s,3.5*s,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,100,100,0.4)';ctx.beginPath();ctx.arc(-1*s,-ph/2+2.5*s,1.5*s,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
}

function drawWallArt(ctx,x,y,w,h){
  // Small framed painting on wall
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.55)';ctx.shadowBlur=10;ctx.shadowOffsetX=2;ctx.shadowOffsetY=3;
  const fG=ctx.createLinearGradient(x,y,x+w,y+h);
  fG.addColorStop(0,'#d0a828');fG.addColorStop(0.5,'#a07810');fG.addColorStop(1,'#c09020');
  ctx.fillStyle=fG;ctx.fillRect(x,y,w,h);
  ctx.restore();
  const inner=5;
  const cG=ctx.createLinearGradient(x+inner,y+inner,x+w-inner,y+h-inner);
  cG.addColorStop(0,'#1a2035');cG.addColorStop(0.5,'#252840');cG.addColorStop(1,'#1e2238');
  ctx.fillStyle=cG;ctx.fillRect(x+inner,y+inner,w-inner*2,h-inner*2);
  // Night sky painting inside frame
  ctx.fillStyle='rgba(255,220,90,0.55)';ctx.beginPath();ctx.arc(x+w*.55,y+h*.28+inner,h*.15,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#162025';ctx.beginPath();ctx.moveTo(x+inner,y+h-inner);
  ctx.quadraticCurveTo(x+w*.28,y+h*.52,x+w*.5,y+h-inner);ctx.closePath();ctx.fill();
  ctx.fillStyle='#0e1a16';ctx.beginPath();ctx.moveTo(x+w*.32,y+h-inner);
  ctx.quadraticCurveTo(x+w*.62,y+h*.38,x+w-inner,y+h-inner);ctx.closePath();ctx.fill();
  // Frame highlight
  ctx.fillStyle='rgba(255,230,100,0.18)';ctx.fillRect(x,y,w,3);
}

function drawDesk(ctx,x,deskY,W,H,on,lx){
  const s=W/900;
  // Desk top — warm wood with strong 3D surface highlights
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=20;ctx.shadowOffsetY=-5;
  const dtG=ctx.createLinearGradient(0,deskY,0,deskY+24);
  dtG.addColorStop(0,'#c87838');dtG.addColorStop(0.3,'#a86028');dtG.addColorStop(0.7,'#884818');dtG.addColorStop(1,'#6a3810');
  ctx.fillStyle=dtG;ctx.fillRect(x,deskY,W,24);
  ctx.restore();
  // Desk surface specular highlight
  ctx.fillStyle='rgba(255,210,120,0.22)';ctx.fillRect(x,deskY,W,3);
  ctx.fillStyle='rgba(255,200,100,0.08)';ctx.fillRect(x,deskY+3,W,6);
  // Wood grain lines
  ctx.save();
  ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=1;
  for(let gx=0;gx<W;gx+=40+Math.random()*20){
    ctx.beginPath();ctx.moveTo(gx,deskY);ctx.lineTo(gx+8,deskY+24);ctx.stroke();
  }
  ctx.restore();
  // Desk front face
  const dfG=ctx.createLinearGradient(0,deskY+24,0,H);
  dfG.addColorStop(0,'#7a4418');dfG.addColorStop(0.3,'#5a3010');dfG.addColorStop(1,'#2e1808');
  ctx.fillStyle=dfG;ctx.fillRect(x,deskY+24,W,H-(deskY+24));
  // Lamp light on desk surface
  if(on){
    const dg=ctx.createRadialGradient(lx,deskY,0,lx,deskY,W*.4);
    dg.addColorStop(0,'rgba(255,175,65,0.3)');dg.addColorStop(0.3,'rgba(255,145,45,0.14)');dg.addColorStop(0.6,'rgba(255,120,35,0.05)');dg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=dg;ctx.fillRect(0,deskY,W,48);
  }
  // Desk edge shadow
  const dedgeG=ctx.createLinearGradient(0,deskY+20,0,deskY+40);
  dedgeG.addColorStop(0,'rgba(0,0,0,0.35)');dedgeG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=dedgeG;ctx.fillRect(0,deskY+20,W,20);
}

function drawClutter(ctx,x0,deskY,W,H){
  const s=W/900,sy=deskY+4;

  // ── OPEN NOTEBOOK ──
  const nx=W*.28,ny=sy-52*s,nw=165*s,nh=58*s;
  ctx.save();ctx.shadowColor='rgba(0,0,0,0.45)';ctx.shadowBlur=14*s;ctx.shadowOffsetX=-4*s;ctx.shadowOffsetY=5*s;
  // Left page
  const lpG=ctx.createLinearGradient(nx,ny,nx+nw*.49,ny+nh);
  lpG.addColorStop(0,'#fefae8');lpG.addColorStop(1,'#f5eccc');
  ctx.fillStyle=lpG;ctx.beginPath();ctx.roundRect(nx,ny,nw*.49,nh,[2,0,0,2]);ctx.fill();
  // Right page (slightly warmer)
  const rpG=ctx.createLinearGradient(nx+nw*.51,ny,nx+nw,ny+nh);
  rpG.addColorStop(0,'#fdf8e4');rpG.addColorStop(1,'#f3e8c0');
  ctx.fillStyle=rpG;ctx.beginPath();ctx.roundRect(nx+nw*.51,ny,nw*.49,nh,[0,2,2,0]);ctx.fill();
  ctx.restore();
  // Spiral binding
  const spG=ctx.createLinearGradient(nx+nw*.49,ny,nx+nw*.51,ny);
  spG.addColorStop(0,'#c0a060');spG.addColorStop(0.5,'#e8c870');spG.addColorStop(1,'#b09050');
  ctx.fillStyle=spG;ctx.fillRect(nx+nw*.49,ny,nw*.02,nh);
  // Ruled lines
  ctx.strokeStyle='rgba(100,80,200,0.14)';ctx.lineWidth=0.7;
  for(let ly=ny+10*s;ly<ny+nh-6*s;ly+=11*s){
    ctx.beginPath();ctx.moveTo(nx+6*s,ly);ctx.lineTo(nx+nw*.47,ly);ctx.stroke();
    ctx.beginPath();ctx.moveTo(nx+nw*.53,ly);ctx.lineTo(nx+nw-6*s,ly);ctx.stroke();
  }
  // Some handwriting scribbles (abstract)
  ctx.strokeStyle='rgba(40,30,80,0.22)';ctx.lineWidth=0.9;
  [[nx+8*s,ny+12*s,nx+nw*.32,ny+12*s],[nx+8*s,ny+23*s,nx+nw*.40,ny+23*s],[nx+8*s,ny+34*s,nx+nw*.28,ny+34*s]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  });
  // Page edge shadow (book depth)
  ctx.fillStyle='rgba(0,0,0,0.12)';ctx.fillRect(nx+nw*.49-3*s,ny,3*s,nh);
  // Pen on notebook
  ctx.save();ctx.translate(nx+nw*.28,ny+nh*.6);ctx.rotate(-9*Math.PI/180);
  ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=6*s;ctx.shadowOffsetY=3*s;
  const penG=ctx.createLinearGradient(0,-2,nw*.58,2);
  penG.addColorStop(0,'#1a1208');penG.addColorStop(0.15,'#3a2a10');penG.addColorStop(0.4,'#d4a840');penG.addColorStop(0.7,'#c89828');penG.addColorStop(1,'#1a1208');
  ctx.fillStyle=penG;ctx.fillRect(0,-2.5,nw*.58,5);
  // Pen tip
  ctx.fillStyle='#c03020';ctx.beginPath();ctx.moveTo(nw*.58,-2.5);ctx.lineTo(nw*.58+7*s,0);ctx.lineTo(nw*.58,2.5);ctx.closePath();ctx.fill();
  ctx.restore();

  // ── BOOK STACK ──
  [[90,'#c8601a'],[100,'#204878'],[82,'#284820']].forEach((b,i)=>{
    const bW=b[0]*s,bH=17*s,bX=W*.62,bY=sy-(3-i)*bH-2*i;
    ctx.save();ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=6*s;ctx.shadowOffsetX=2*s;ctx.shadowOffsetY=2*s;
    const bG=ctx.createLinearGradient(bX,bY,bX+bW,bY+bH);
    bG.addColorStop(0,lighten(b[1],18));bG.addColorStop(0.5,b[1]);bG.addColorStop(1,darken(b[1],22));
    ctx.fillStyle=bG;ctx.fillRect(bX,bY,bW,bH);
    ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.08)';ctx.fillRect(bX,bY,bW,2.5);
    ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(bX,bY+bH-2.5,bW,2.5);
    // Spine lines
    ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(bX,bY,2,bH);
  });

  // ── PEN CUP ──
  const pcx=W*.14,pch=33*s,pcy=sy-pch,pcw=24*s;
  ctx.save();ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=10*s;ctx.shadowOffsetY=4*s;
  const cupG=ctx.createLinearGradient(pcx-pcw/2,pcy,pcx+pcw/2,pcy+pch);
  cupG.addColorStop(0,'#cc4828');cupG.addColorStop(0.35,'#922010');cupG.addColorStop(1,'#5a1008');
  ctx.fillStyle=cupG;ctx.beginPath();ctx.roundRect(pcx-pcw/2,pcy,pcw,pch,[3,3,2,2]);ctx.fill();
  // Cup rim highlight
  ctx.fillStyle='rgba(255,150,100,0.25)';ctx.beginPath();ctx.ellipse(pcx,pcy+2,pcw/2*.8,3*s,0,0,Math.PI);ctx.fill();
  ctx.restore();
  // Pens/pencils in cup
  [{dx:-8,h:40,c:'#c83020'},{dx:-2,h:34,c:'#2a2820'},{dx:4,h:44,c:'#2060a0'},{dx:9,h:30,c:'#309030'},{dx:-5,h:36,c:'#c0a020'}].forEach(({dx,h,c})=>{
    ctx.save();ctx.translate(pcx+dx*s,pcy);ctx.shadowColor='rgba(0,0,0,0.35)';ctx.shadowBlur=4*s;
    ctx.fillStyle=c;ctx.fillRect(-1.3*s,-h*s,2.7*s,h*s);
    // Pencil tip
    ctx.fillStyle='#f0e0b0';ctx.beginPath();ctx.moveTo(-1.3*s,-h*s);ctx.lineTo(1.4*s,-h*s);ctx.lineTo(0,-( h+6)*s);ctx.closePath();ctx.fill();
    ctx.restore();
  });

  // ── CANDLE ──
  const ccx=W*.53,cch=38*s,ccy=sy-cch;
  ctx.save();ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=8*s;ctx.shadowOffsetY=4*s;
  const candG=ctx.createLinearGradient(0,ccy,0,ccy+cch);
  candG.addColorStop(0,'#faecd8');candG.addColorStop(0.5,'#e8d4b8');candG.addColorStop(1,'#d4c0a0');
  ctx.fillStyle=candG;ctx.beginPath();ctx.roundRect(ccx-12*s,ccy,24*s,cch,[2,2,0,0]);ctx.fill();
  ctx.restore();
  // Candle highlight
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillRect(ccx-10*s,ccy,5*s,cch);
  // Wax drip
  ctx.fillStyle='rgba(250,236,216,0.8)';ctx.beginPath();ctx.moveTo(ccx-4*s,ccy+8*s);ctx.quadraticCurveTo(ccx-8*s,ccy+18*s,ccx-10*s,ccy+24*s);ctx.lineTo(ccx-6*s,ccy+24*s);ctx.quadraticCurveTo(ccx-5*s,ccy+18*s,ccx-2*s,ccy+8*s);ctx.closePath();ctx.fill();
  // Wick
  ctx.strokeStyle='#1a0a04';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(ccx,ccy);ctx.lineTo(ccx+1.5*s,ccy-9*s);ctx.stroke();
  // Flame
  ctx.save();ctx.translate(ccx+1.5*s,ccy-9*s);
  const flG=ctx.createRadialGradient(0,3*s,0,0,0,15*s);
  flG.addColorStop(0,'rgba(255,255,200,0.96)');flG.addColorStop(0.2,'rgba(255,210,80,0.88)');flG.addColorStop(0.5,'rgba(255,120,30,0.6)');flG.addColorStop(1,'rgba(255,80,10,0)');
  ctx.fillStyle=flG;
  ctx.beginPath();ctx.moveTo(0,12*s);ctx.bezierCurveTo(-5.5*s,6*s,-6.5*s,-4*s,0,-13*s);ctx.bezierCurveTo(6.5*s,-4*s,5.5*s,6*s,0,12*s);ctx.fill();
  ctx.fillStyle='rgba(255,248,190,0.92)';ctx.shadowColor='rgba(255,160,40,0.9)';ctx.shadowBlur=14*s;
  ctx.beginPath();ctx.arc(0,-2*s,3.5*s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.restore();
  // Candle ambient glow on desk
  const cglow=ctx.createRadialGradient(ccx,sy,0,ccx,sy,W*.07);
  cglow.addColorStop(0,'rgba(255,170,50,0.12)');cglow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=cglow;ctx.fillRect(ccx-W*.07,deskY,W*.14,30*s);

  // ── TEA CUP ──
  const tcx=W*.72,tcy=sy-28*s;
  ctx.save();ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=8*s;ctx.shadowOffsetY=4*s;
  ctx.fillStyle='#f5f0e8';ctx.beginPath();ctx.ellipse(tcx,tcy+24*s,16*s,5*s,0,0,Math.PI*2);ctx.fill();// saucer
  const mugG=ctx.createLinearGradient(tcx-12*s,tcy,tcx+12*s,tcy+24*s);
  mugG.addColorStop(0,'#faf6f0');mugG.addColorStop(1,'#e8e0d0');
  ctx.fillStyle=mugG;
  ctx.beginPath();ctx.moveTo(tcx-12*s,tcy);ctx.lineTo(tcx-10*s,tcy+24*s);ctx.lineTo(tcx+10*s,tcy+24*s);ctx.lineTo(tcx+12*s,tcy);ctx.closePath();ctx.fill();
  ctx.restore();
  // Tea surface
  const teaG=ctx.createRadialGradient(tcx,tcy+3*s,0,tcx,tcy+3*s,10*s);
  teaG.addColorStop(0,'#c87828');teaG.addColorStop(1,'#8a4c10');
  ctx.fillStyle=teaG;ctx.beginPath();ctx.ellipse(tcx,tcy+2*s,11*s,3*s,0,0,Math.PI*2);ctx.fill();
  // Steam wisps
  ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1.2*s;ctx.lineCap='round';
  [[tcx-5*s,tcy-5*s,tcx-3*s,tcy-14*s],[tcx,tcy-4*s,tcx+2*s,tcy-15*s],[tcx+5*s,tcy-3*s,tcx+4*s,tcy-13*s]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo(x1-3*s,(y1+y2)/2,x2,y2);ctx.stroke();
  });
  ctx.lineCap='butt';
  // Cup handle
  ctx.strokeStyle='#e8e0d0';ctx.lineWidth=2.5*s;
  ctx.beginPath();ctx.arc(tcx+14*s,tcy+12*s,6*s,-Math.PI/2,Math.PI/2);ctx.stroke();
}

function drawFloor(ctx,x,deskY,W,H){
  const flY=deskY+24;
  for(let r=0;r<3;r++){
    const fy=flY+r*(H-flY)/3,fH=(H-flY)/3;
    const fG=ctx.createLinearGradient(0,fy,0,fy+fH);
    fG.addColorStop(0,r===0?'#5a3010':'#4a2808');fG.addColorStop(1,'#2a1606');
    ctx.fillStyle=fG;ctx.fillRect(x,fy,W,fH+1);
    // Floor boards
    ctx.save();
    ctx.strokeStyle='rgba(0,0,0,0.14)';ctx.lineWidth=1;
    for(let px=r%2===0?0:55;px<W;px+=110){ctx.beginPath();ctx.moveTo(px,fy);ctx.lineTo(px,fy+fH);ctx.stroke();}
    ctx.strokeStyle='rgba(0,0,0,0.08)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,fy);ctx.lineTo(W,fy);ctx.stroke();
    ctx.restore();
  }
}

// ── ITEM OBJECTS — Enhanced SVG with 3D depth ──────────────────────────────

function drawEnvelope(canvas) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => { c.clearRect(0,0,W,H); c.drawImage(img,0,0,W,H); };
  img.src = getEnvelopeSVG();
}

function drawCamera(canvas) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => { c.clearRect(0,0,W,H); c.drawImage(img,0,0,W,H); };
  img.src = getCameraSVG();
}

function drawPictureFrame(canvas, photos, frameIdx) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => {
    c.clearRect(0,0,W,H);
    c.drawImage(img,0,0,W,H);
    if(frameIdx>=0 && photos && photos[frameIdx]){
      const ph = new Image();
      ph.onload = () => {
        c.save();
        const px=W*.185, py=H*.18, pw=W*.63, ph2=H*.56;
        c.beginPath();c.rect(px,py,pw,ph2);c.clip();
        const ir=ph.width/ph.height, fr=pw/ph2;
        let sx=0,sy=0,sw=ph.width,sh=ph.height;
        if(ir>fr){sw=ph.height*fr;sx=(ph.width-sw)/2;}else{sh=ph.width/fr;sy=(ph.height-sh)/2;}
        c.drawImage(ph,sx,sy,sw,sh,px,py,pw,ph2);
        c.restore();
      };
      ph.src=photos[frameIdx];
    }
  };
  img.src = getFrameSVG();
}

function drawWalkman(canvas, playing, reelAngle) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => {
    c.clearRect(0,0,W,H);
    c.drawImage(img,0,0,W,H);
    if(playing) drawAnimatedReels(c, W, H, reelAngle);
    const ledX=W*.5, ledY=H*.83;
    if(playing){
      const lG=c.createRadialGradient(ledX,ledY,0,ledX,ledY,W*.028);
      lG.addColorStop(0,'rgba(120,200,255,0.92)');lG.addColorStop(0.5,'rgba(80,160,255,0.45)');lG.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=lG;c.beginPath();c.arc(ledX,ledY,W*.028,0,Math.PI*2);c.fill();
    }
  };
  img.src = getWalkmanSVG();
}

function drawAnimatedReels(c, W, H, angle) {
  const r1x=W*.285, r1y=H*.38, r2x=W*.715, r2y=H*.38;
  [r1x,r2x].forEach((rx,ri)=>{
    c.save();c.translate(rx,r1y);c.rotate(angle*(ri===0?1:1.35));
    c.strokeStyle='rgba(80,155,225,0.6)';c.lineWidth=1.8;c.lineCap='round';
    for(let sp=0;sp<3;sp++){
      c.rotate(Math.PI*2/3);c.beginPath();c.moveTo(0,0);c.lineTo(0,W*.11*.42);c.stroke();
    }
    c.restore();
  });
}

// ── ENHANCED SVG ILLUSTRATIONS ────────────────────────────────────────────────

function getEnvelopeSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 155" width="220" height="155">
  <defs>
    <linearGradient id="eb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5e28a"/>
      <stop offset="28%" stop-color="#e8c048"/>
      <stop offset="60%" stop-color="#d4960c"/>
      <stop offset="100%" stop-color="#b87818"/>
    </linearGradient>
    <linearGradient id="ef" x1="0%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#faeaa0"/>
      <stop offset="40%" stop-color="#f0cc50"/>
      <stop offset="100%" stop-color="#d09820"/>
    </linearGradient>
    <linearGradient id="eleft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e8c860"/>
      <stop offset="100%" stop-color="#b88820"/>
    </linearGradient>
    <linearGradient id="eright" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c09830"/>
      <stop offset="100%" stop-color="#e0b840"/>
    </linearGradient>
    <linearGradient id="ebot" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d4aa30"/>
      <stop offset="100%" stop-color="#f0c840"/>
    </linearGradient>
    <linearGradient id="es" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ee5555"/>
      <stop offset="40%" stop-color="#bb1818"/>
      <stop offset="100%" stop-color="#700808"/>
    </linearGradient>
    <radialGradient id="sealhl" cx="28%" cy="28%" r="55%">
      <stop offset="0%" stop-color="rgba(255,100,100,0.5)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <filter id="eshadow"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="rgba(0,0,0,0.65)"/></filter>
    <filter id="flapsh"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.25)"/></filter>
    <filter id="sealsh"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="rgba(0,0,0,0.55)"/></filter>
    <pattern id="paper" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="5" y2="5" stroke="rgba(160,100,10,0.05)" stroke-width="0.5"/>
    </pattern>
  </defs>
  <!-- Long shadow for 3D depth -->
  <rect x="18" y="38" width="196" height="115" rx="5" fill="rgba(0,0,0,0.5)" filter="url(#eshadow)"/>
  <!-- 3D side face bottom -->
  <polygon points="10,144 214,144 220,150 4,150" fill="#9a7010"/>
  <!-- 3D side face right -->
  <polygon points="214,22 220,28 220,150 214,144" fill="#8a6010"/>
  <!-- Envelope body -->
  <rect x="10" y="22" width="204" height="122" rx="4" fill="url(#eb)"/>
  <!-- Paper texture -->
  <rect x="10" y="22" width="204" height="122" rx="4" fill="url(#paper)" opacity="0.7"/>
  <!-- Left interior fold shadow -->
  <polygon points="10,22 110,88 10,144" fill="rgba(60,30,0,0.22)"/>
  <!-- Right interior fold shadow -->
  <polygon points="214,22 110,88 214,144" fill="rgba(60,30,0,0.16)"/>
  <!-- Bottom triangle slight highlight -->
  <polygon points="10,144 110,88 214,144" fill="rgba(255,255,255,0.07)"/>
  <!-- Fold crease lines -->
  <line x1="10" y1="144" x2="110" y2="88" stroke="rgba(100,60,5,0.22)" stroke-width="1.2"/>
  <line x1="214" y1="144" x2="110" y2="88" stroke="rgba(100,60,5,0.18)" stroke-width="1.2"/>
  <!-- Flap (top triangle) -->
  <polygon points="10,22 110,92 214,22" fill="url(#ef)" filter="url(#flapsh)"/>
  <!-- Flap top highlight sheen -->
  <polygon points="10,22 110,54 214,22" fill="rgba(255,255,255,0.18)"/>
  <!-- Flap fold lines -->
  <line x1="10" y1="22" x2="110" y2="92" stroke="rgba(130,75,5,0.28)" stroke-width="1.2"/>
  <line x1="214" y1="22" x2="110" y2="92" stroke="rgba(130,75,5,0.24)" stroke-width="1.2"/>
  <!-- Body top edge highlight -->
  <rect x="10" y="22" width="204" height="4" rx="2" fill="rgba(255,250,180,0.30)"/>
  <!-- Wax seal — with 3D depth -->
  <circle cx="112" cy="97" r="21" fill="rgba(0,0,0,0.35)" filter="url(#sealsh)"/>
  <circle cx="110" cy="95" r="21" fill="url(#es)"/>
  <circle cx="110" cy="95" r="21" fill="url(#sealhl)"/>
  <!-- Seal decorative rings -->
  <circle cx="110" cy="95" r="19" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
  <circle cx="110" cy="95" r="15" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <!-- Heart symbol -->
  <text x="110" y="101" text-anchor="middle" font-size="15" font-family="Georgia,serif" fill="#f8d060" opacity="0.95">♥</text>
  <!-- Postage stamp area -->
  <rect x="176" y="30" width="27" height="22" rx="1.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" stroke-width="0.8" stroke-dasharray="2,1.5"/>
  <rect x="178" y="32" width="23" height="18" rx="1" fill="rgba(80,160,60,0.3)"/>
  <text x="189.5" y="43" text-anchor="middle" font-size="7" font-family="serif" fill="rgba(255,255,255,0.7)">♦</text>
  <!-- Postmark circle -->
  <circle cx="164" cy="35" r="10.5" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="0.9"/>
  <line x1="156" y1="35" x2="172" y2="35" stroke="rgba(255,255,255,0.2)" stroke-width="0.9"/>
  <text x="164" y="30" text-anchor="middle" font-size="4.5" font-family="monospace" fill="rgba(255,255,255,0.35)">1982</text>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getCameraSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 185" width="260" height="185">
  <defs>
    <linearGradient id="cbody" x1="0%" y1="0%" x2="8%" y2="100%">
      <stop offset="0%" stop-color="#3a4050"/>
      <stop offset="30%" stop-color="#262c3a"/>
      <stop offset="70%" stop-color="#181e2c"/>
      <stop offset="100%" stop-color="#0e1218"/>
    </linearGradient>
    <linearGradient id="chump" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#303848"/>
      <stop offset="100%" stop-color="#1c2230"/>
    </linearGradient>
    <radialGradient id="cglass" cx="36%" cy="34%" r="60%">
      <stop offset="0%" stop-color="#5080d0" stop-opacity="0.45"/>
      <stop offset="30%" stop-color="#3060b8" stop-opacity="0.3"/>
      <stop offset="65%" stop-color="#1a3888" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#050c1e" stop-opacity="0.05"/>
    </radialGradient>
    <radialGradient id="ccoat" cx="28%" cy="26%" r="58%">
      <stop offset="0%" stop-color="rgba(150,185,255,0.3)"/>
      <stop offset="40%" stop-color="rgba(110,150,235,0.12)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <radialGradient id="lensdeep" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#080e18"/>
      <stop offset="60%" stop-color="#050810"/>
      <stop offset="100%" stop-color="#030508"/>
    </radialGradient>
    <linearGradient id="cflash" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d4a850"/>
      <stop offset="100%" stop-color="#8a6018"/>
    </linearGradient>
    <linearGradient id="cbotface" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c0e14"/>
      <stop offset="100%" stop-color="#080a10"/>
    </linearGradient>
    <filter id="csh"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="rgba(0,0,0,0.72)"/></filter>
    <filter id="lsh"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,0.65)"/></filter>
    <pattern id="grip" x="0" y="0" width="1" height="3.5" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="1" height="2" fill="rgba(0,0,0,0.24)"/>
    </pattern>
  </defs>
  <!-- Long drop shadow -->
  <rect x="14" y="62" width="232" height="116" rx="7" fill="rgba(0,0,0,0.55)" filter="url(#csh)"/>
  <!-- 3D bottom face -->
  <rect x="14" y="170" width="232" height="8" rx="2" fill="url(#cbotface)"/>
  <!-- 3D side face right -->
  <polygon points="252,58 260,65 260,172 252,170" fill="#0c0e14"/>
  <!-- Pentaprism hump -->
  <rect x="24" y="32" width="112" height="38" rx="6" fill="url(#chump)"/>
  <rect x="24" y="32" width="112" height="5" rx="3" fill="rgba(255,255,255,0.055)"/>
  <rect x="24" y="65" width="112" height="5" rx="0" fill="rgba(0,0,0,0.3)"/>
  <!-- Main body -->
  <rect x="10" y="52" width="242" height="118" rx="7" fill="url(#cbody)"/>
  <rect x="10" y="52" width="242" height="5" rx="4" fill="rgba(255,255,255,0.065)"/>
  <!-- Rubber grip right -->
  <rect x="195" y="52" width="57" height="118" rx="0" fill="#0e1216"/>
  <rect x="195" y="52" width="57" height="118" fill="url(#grip)"/>
  <!-- Lens barrel outer ring -->
  <circle cx="106" cy="111" r="64" fill="#0c0e14" filter="url(#lsh)"/>
  <circle cx="106" cy="111" r="62" fill="#0a0c10"/>
  <!-- Barrel knurl pattern -->
  <circle cx="106" cy="111" r="62" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="3" stroke-dasharray="2,8"/>
  <!-- Lens rings -->
  <circle cx="106" cy="111" r="57" fill="none" stroke="#1c2032" stroke-width="3"/>
  <circle cx="106" cy="111" r="52" fill="#101420"/>
  <circle cx="106" cy="111" r="48" fill="none" stroke="#181c28" stroke-width="1.5"/>
  <circle cx="106" cy="111" r="43" fill="#0c1018"/>
  <circle cx="106" cy="111" r="39" fill="none" stroke="#1c2030" stroke-width="1.2"/>
  <!-- Focus ring ticks -->
  <circle cx="106" cy="111" r="55" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3.5" stroke-dasharray="4,14"/>
  <!-- Deep glass element -->
  <circle cx="106" cy="111" r="34" fill="url(#lensdeep)"/>
  <circle cx="106" cy="111" r="34" fill="url(#cglass)"/>
  <!-- Lens coating shimmer -->
  <circle cx="106" cy="111" r="34" fill="url(#ccoat)"/>
  <!-- Inner lens reflections -->
  <ellipse cx="97" cy="103" rx="10" ry="6" transform="rotate(-22,97,103)" fill="rgba(190,220,255,0.14)"/>
  <ellipse cx="116" cy="120" rx="5" ry="3" transform="rotate(-22,116,120)" fill="rgba(80,120,210,0.08)"/>
  <ellipse cx="96" cy="104" rx="4" ry="2.5" transform="rotate(-15,96,104)" fill="rgba(255,255,255,0.07)"/>
  <!-- Lens outer ring glow -->
  <circle cx="106" cy="111" r="62" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
  <!-- SHUTTER BUTTON with 3D -->
  <circle cx="170" cy="49" r="13" fill="#32383e"/>
  <circle cx="170" cy="49" r="11" fill="#282e3a"/>
  <circle cx="170" cy="49" r="7" fill="#383e4a"/>
  <circle cx="168" cy="47" r="3.5" fill="rgba(255,255,255,0.09)"/>
  <!-- Mode dial with tick marks -->
  <circle cx="236" cy="44" r="17" fill="#282c38"/>
  <circle cx="236" cy="44" r="15" fill="#1e2230"/>
  <circle cx="236" cy="44" r="11" fill="#282e3a"/>
  <circle cx="236" cy="44" r="15" fill="none" stroke="rgba(200,170,80,0.15)" stroke-width="1" stroke-dasharray="2,6"/>
  <line x1="236" y1="35" x2="236" y2="30" stroke="rgba(200,168,80,0.65)" stroke-width="2"/>
  <text x="236" y="48" text-anchor="middle" font-size="7.5" font-family="monospace" fill="rgba(200,168,80,0.75)" letter-spacing="0">A</text>
  <!-- Hot shoe -->
  <rect x="132" y="37" width="24" height="9" rx="1.5" fill="#181c28"/>
  <rect x="132" y="37" width="24" height="2.5" fill="rgba(255,255,255,0.04)"/>
  <!-- Viewfinder -->
  <rect x="33" y="37" width="28" height="17" rx="3" fill="#06080e" stroke="#282e3c" stroke-width="1.8"/>
  <rect x="35" y="39" width="24" height="13" rx="1.5" fill="rgba(60,100,200,0.2)"/>
  <rect x="36" y="40" width="10" height="5" rx="1" fill="rgba(255,255,255,0.03)"/>
  <!-- Flash -->
  <rect x="160" y="34" width="30" height="15" rx="3" fill="url(#cflash)"/>
  <rect x="160" y="34" width="30" height="3.5" rx="1.5" fill="rgba(255,235,140,0.28)"/>
  <!-- Strap lug -->
  <rect x="5" y="68" width="8" height="18" rx="2.5" fill="#181c28"/>
  <!-- Brand text -->
  <rect x="196" y="68" width="40" height="9" rx="1.5" fill="rgba(200,165,80,0.12)"/>
  <text x="216" y="75.5" text-anchor="middle" font-size="7" font-family="Special Elite,monospace" fill="rgba(200,165,80,0.75)" letter-spacing="1.8">WABI</text>
  <!-- Body highlight sheen -->
  <ellipse cx="75" cy="78" rx="62" ry="28" fill="rgba(255,255,255,0.03)" transform="rotate(-14,75,78)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getFrameSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190" width="200" height="190">
  <defs>
    <linearGradient id="ftop" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f0c840"/>
      <stop offset="22%" stop-color="#8a6010"/>
      <stop offset="50%" stop-color="#d8aa28"/>
      <stop offset="78%" stop-color="#8a6010"/>
      <stop offset="100%" stop-color="#f0c840"/>
    </linearGradient>
    <linearGradient id="fleft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f5ce48"/>
      <stop offset="55%" stop-color="#b88820"/>
      <stop offset="100%" stop-color="#8a6010"/>
    </linearGradient>
    <linearGradient id="fright" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7a5008"/>
      <stop offset="45%" stop-color="#aa7818"/>
      <stop offset="100%" stop-color="#d4a828"/>
    </linearGradient>
    <linearGradient id="fbot" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7a5008"/>
      <stop offset="55%" stop-color="#c08818"/>
      <stop offset="100%" stop-color="#e8b828"/>
    </linearGradient>
    <linearGradient id="fdeep" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5a3808"/>
      <stop offset="100%" stop-color="#3a2004"/>
    </linearGradient>
    <radialGradient id="fcorn" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f8d030"/>
      <stop offset="50%" stop-color="#c89020"/>
      <stop offset="100%" stop-color="#8a5c08"/>
    </radialGradient>
    <filter id="fsh"><feDropShadow dx="2" dy="12" stdDeviation="10" flood-color="rgba(0,0,0,0.68)"/></filter>
    <filter id="inn"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.6)"/></filter>
    <pattern id="grain" x="0" y="0" width="4" height="60" patternUnits="userSpaceOnUse">
      <line x1="1.2" y1="0" x2="1.2" y2="60" stroke="rgba(160,110,10,0.07)" stroke-width="0.7"/>
      <line x1="3" y1="0" x2="3" y2="60" stroke="rgba(100,65,5,0.04)" stroke-width="0.6"/>
    </pattern>
  </defs>
  <!-- Long shadow -->
  <rect x="14" y="18" width="180" height="172" rx="4" fill="rgba(0,0,0,0.55)" filter="url(#fsh)"/>
  <!-- 3D depth side faces -->
  <polygon points="8,8 192,8 186,15 14,15" fill="url(#fdeep)"/>
  <polygon points="8,182 192,182 186,175 14,175" fill="#4a2e04"/>
  <polygon points="8,8 8,182 15,175 15,15" fill="#7a5808"/>
  <polygon points="192,8 192,182 185,175 185,15" fill="#3a2004"/>
  <!-- Top face bevel -->
  <polygon points="8,8 192,8 174,28 26,28" fill="url(#ftop)"/>
  <!-- Bottom face bevel -->
  <polygon points="8,182 192,182 174,162 26,162" fill="url(#fbot)"/>
  <!-- Left face bevel -->
  <polygon points="8,8 8,182 28,162 28,28" fill="url(#fleft)"/>
  <!-- Right face bevel -->
  <polygon points="192,8 192,182 172,162 172,28" fill="url(#fright)"/>
  <!-- Wood grain overlay -->
  <rect x="8" y="8" width="184" height="174" rx="4" fill="url(#grain)" opacity="0.55"/>
  <!-- Inner shadow (depth) -->
  <rect x="8" y="8" width="184" height="174" rx="4" fill="none" stroke="rgba(255,220,100,0.16)" stroke-width="2"/>
  <!-- Mat board -->
  <rect x="28" y="28" width="144" height="134" fill="#e8d8b0" filter="url(#inn)"/>
  <rect x="30" y="30" width="140" height="130" fill="#dfd0a0"/>
  <rect x="30" y="30" width="140" height="130" fill="none" stroke="rgba(0,0,0,0.13)" stroke-width="2.5"/>
  <!-- Photo cutout -->
  <rect x="40" y="40" width="120" height="108" fill="#140e08" rx="1"/>
  <!-- Corner ornaments — decorative brass bolts -->
  <circle cx="8" cy="8" r="11" fill="url(#fcorn)"/>
  <circle cx="192" cy="8" r="11" fill="url(#fcorn)"/>
  <circle cx="8" cy="182" r="11" fill="url(#fcorn)"/>
  <circle cx="192" cy="182" r="11" fill="url(#fcorn)"/>
  <!-- Corner detail rings -->
  <circle cx="8" cy="8" r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <circle cx="192" cy="8" r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <circle cx="8" cy="182" r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <circle cx="192" cy="182" r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <!-- Top face sheen -->
  <polygon points="8,8 192,8 174,28 26,28" fill="rgba(255,255,255,0.11)"/>
  <polygon points="8,8 90,8 78,28 26,28" fill="rgba(255,255,255,0.07)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getWalkmanSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 175" width="230" height="175">
  <defs>
    <linearGradient id="wbody" x1="0%" y1="0%" x2="8%" y2="100%">
      <stop offset="0%" stop-color="#2e3e60"/>
      <stop offset="28%" stop-color="#1e2e50"/>
      <stop offset="62%" stop-color="#142040"/>
      <stop offset="100%" stop-color="#0e1835"/>
    </linearGradient>
    <linearGradient id="wstripe" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="8%" stop-color="#3a6aaa"/>
      <stop offset="50%" stop-color="#6098cc"/>
      <stop offset="92%" stop-color="#3a6aaa"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </linearGradient>
    <linearGradient id="wlabel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8b455"/>
      <stop offset="45%" stop-color="#eaca68"/>
      <stop offset="100%" stop-color="#c8a245"/>
    </linearGradient>
    <radialGradient id="wreel" cx="30%" cy="28%" r="72%">
      <stop offset="0%" stop-color="#1e3868"/>
      <stop offset="58%" stop-color="#0c1c38"/>
      <stop offset="100%" stop-color="#040a1c"/>
    </radialGradient>
    <radialGradient id="wrhub" cx="34%" cy="30%" r="66%">
      <stop offset="0%" stop-color="#3a7098"/>
      <stop offset="100%" stop-color="#183050"/>
    </radialGradient>
    <linearGradient id="wbotface" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0e18"/>
      <stop offset="100%" stop-color="#070a10"/>
    </linearGradient>
    <filter id="wsh"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="rgba(0,0,0,0.75)"/></filter>
    <filter id="winsh"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgba(0,0,0,0.8)"/></filter>
    <pattern id="vrgr" x="0" y="0" width="12" height="4" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="12" height="2.5" fill="rgba(70,120,220,0.28)"/>
    </pattern>
  </defs>
  <!-- Drop shadow -->
  <rect x="10" y="25" width="188" height="135" rx="10" fill="rgba(0,0,0,0.6)" filter="url(#wsh)"/>
  <!-- 3D bottom face -->
  <rect x="8" y="148" width="188" height="7" rx="4" fill="url(#wbotface)"/>
  <!-- 3D side face right -->
  <polygon points="196,16 204,22 204,149 196,148" fill="#08100c"/>
  <!-- Body -->
  <rect x="8" y="16" width="188" height="133" rx="10" fill="url(#wbody)"/>
  <!-- Body top highlight sheen -->
  <rect x="8" y="16" width="188" height="5" rx="4" fill="rgba(255,255,255,0.08)"/>
  <!-- Body border -->
  <rect x="8" y="16" width="188" height="133" rx="10" fill="none" stroke="rgba(255,255,255,0.065)" stroke-width="1.5"/>
  <!-- Cassette window with depth -->
  <rect x="18" y="28" width="164" height="78" rx="6" fill="#01030a" stroke="#1c3258" stroke-width="2.5" filter="url(#winsh)"/>
  <!-- Window inner bevel -->
  <rect x="20" y="30" width="160" height="74" rx="5" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <!-- Window plastic sheen -->
  <rect x="20" y="30" width="105" height="38" rx="4" fill="rgba(74,144,217,0.07)"/>
  <!-- Left reel assembly -->
  <circle cx="60" cy="67" r="27" fill="url(#wreel)" stroke="#1c3258" stroke-width="2"/>
  <circle cx="60" cy="67" r="23" fill="#0c1a2e" stroke="#1a3050" stroke-width="1.5"/>
  <circle cx="60" cy="67" r="25" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2.5" stroke-dasharray="3,9"/>
  <circle cx="60" cy="67" r="14" fill="#18203a" stroke="#1c3050" stroke-width="1.2"/>
  <circle cx="60" cy="67" r="7.5" fill="url(#wrhub)" stroke="#2a5080" stroke-width="1.5"/>
  <!-- Reel hub highlight -->
  <ellipse cx="58" cy="65" rx="3" ry="2" fill="rgba(100,180,255,0.2)"/>
  <!-- Left spokes -->
  <line x1="60" y1="67" x2="60" y2="53" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="60" y1="67" x2="72" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="60" y1="67" x2="48" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Right reel assembly -->
  <circle cx="144" cy="67" r="27" fill="url(#wreel)" stroke="#1c3258" stroke-width="2"/>
  <circle cx="144" cy="67" r="23" fill="#0c1a2e" stroke="#1a3050" stroke-width="1.5"/>
  <circle cx="144" cy="67" r="25" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2.5" stroke-dasharray="3,9"/>
  <circle cx="144" cy="67" r="14" fill="#18203a" stroke="#1c3050" stroke-width="1.2"/>
  <circle cx="144" cy="67" r="7.5" fill="url(#wrhub)" stroke="#2a5080" stroke-width="1.5"/>
  <ellipse cx="142" cy="65" rx="3" ry="2" fill="rgba(100,180,255,0.2)"/>
  <line x1="144" y1="67" x2="144" y2="53" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="144" y1="67" x2="156" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="144" y1="67" x2="132" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Tape path -->
  <path d="M86 91 Q102 97 118 91" stroke="rgba(18,38,58,0.88)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <!-- Cassette label -->
  <rect x="86" y="48" width="32" height="28" rx="3.5" fill="url(#wlabel)"/>
  <rect x="88" y="50" width="28" height="24" rx="2.5" fill="none" stroke="rgba(120,80,5,0.25)" stroke-width="1"/>
  <line x1="89" y1="59" x2="116" y2="59" stroke="rgba(120,80,5,0.28)" stroke-width="0.9"/>
  <line x1="89" y1="66" x2="116" y2="66" stroke="rgba(120,80,5,0.22)" stroke-width="0.8"/>
  <text x="102" y="57.5" text-anchor="middle" font-size="5.5" font-family="Special Elite,monospace" fill="rgba(26,14,4,0.8)" font-weight="bold">WABI</text>
  <text x="102" y="64" text-anchor="middle" font-size="4.5" font-family="Special Elite,monospace" fill="rgba(26,14,4,0.68)">mix tape</text>
  <text x="102" y="71" text-anchor="middle" font-size="4" font-family="Special Elite,monospace" fill="rgba(26,14,4,0.55)">Side A</text>
  <!-- Blue metallic accent stripe -->
  <rect x="8" y="110" width="188" height="5.5" fill="url(#wstripe)"/>
  <!-- Controls bar -->
  <rect x="16" y="117" width="170" height="26" rx="4" fill="#0a1428" stroke="#1c3258" stroke-width="1.5"/>
  <rect x="16" y="117" width="170" height="4" rx="3" fill="rgba(255,255,255,0.03)"/>
  <!-- Control buttons with 3D effect -->
  <circle cx="42" cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <circle cx="42" cy="129" r="5" fill="rgba(255,255,255,0.04)"/>
  <text x="42" y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">◀◀</text>
  <circle cx="68" cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <text x="68" y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">◀</text>
  <!-- LED center button -->
  <circle cx="102" cy="130" r="9" fill="#2878c8" stroke="#4a88d8" stroke-width="1.5"/>
  <circle cx="102" cy="130" r="9" fill="rgba(0,0,0,0.2)"/>
  <circle cx="100" cy="128" r="3.5" fill="rgba(160,220,255,0.52)"/>
  <text x="102" y="134" text-anchor="middle" font-size="8" fill="rgba(200,230,255,0.8)">▶</text>
  <circle cx="136" cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <text x="136" y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">▶</text>
  <circle cx="162" cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <text x="162" y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">▶▶</text>
  <!-- Volume rocker -->
  <rect x="200" y="36" width="16" height="56" rx="3" fill="#182848" stroke="#2848a8" stroke-width="1.2"/>
  <rect x="202" y="40" width="12" height="48" fill="url(#vrgr)"/>
  <rect x="204" y="38" width="8" height="4" rx="2" fill="rgba(100,160,255,0.15)"/>
  <!-- Headphone jack -->
  <circle cx="28" cy="158" r="6" fill="#010308" stroke="#1c3258" stroke-width="1.8"/>
  <circle cx="28" cy="158" r="2.8" fill="#010308"/>
  <!-- Belt clip -->
  <rect x="204" y="96" width="14" height="42" rx="3" fill="#182848" stroke="#2848a8" stroke-width="1.2"/>
  <!-- Body sheen ellipse -->
  <ellipse cx="70" cy="50" rx="78" ry="34" fill="rgba(255,255,255,0.04)" transform="rotate(-10,70,50)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// helpers
function lighten(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return'#'+[Math.min(255,r+a),Math.min(255,g+a),Math.min(255,b+a)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function darken(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return'#'+[Math.max(0,r-a),Math.max(0,g-a),Math.max(0,b-a)].map(v=>v.toString(16).padStart(2,'0')).join('')}