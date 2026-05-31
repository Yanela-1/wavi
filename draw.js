// draw.js — Lofi illustrated objects using SVG images embedded as data URIs
// All objects are hand-crafted SVG illustrations matching lofi art style

// ── ROOM BACKGROUND ─────────────────────────────────────────────────────────
function drawRoom(canvas, lampOn, photos, frameIdx) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const deskY = H * 0.60;
  ctx.clearRect(0,0,W,H);

  // SKY
  const skyG = ctx.createLinearGradient(0,0,0,deskY);
  skyG.addColorStop(0,'#09101f');
  skyG.addColorStop(0.6,'#111828');
  skyG.addColorStop(1,'#18203a');
  ctx.fillStyle=skyG; ctx.fillRect(0,0,W,deskY);

  // WALL — warm painted plaster
  const wallG=ctx.createLinearGradient(0,0,0,deskY);
  wallG.addColorStop(0,'#2a1608');
  wallG.addColorStop(0.3,'#3a2010');
  wallG.addColorStop(0.7,'#321808');
  wallG.addColorStop(1,'#2a1608');
  ctx.fillStyle=wallG;
  const winX=W*.26, winY=H*.04, winW=W*.48, winH=H*.48;
  ctx.fillRect(0,0,winX-14,deskY);
  ctx.fillRect(winX+winW+14,0,W,deskY);
  ctx.fillRect(0,0,W,winY-8);
  ctx.fillRect(winX-14,winY+winH+8,winW+28,deskY-(winY+winH+8));
  // wall texture scanlines
  ctx.save();
  for(let y=0;y<deskY;y+=4){ctx.fillStyle='rgba(0,0,0,0.015)';ctx.fillRect(0,y,W,1.5);}
  ctx.restore();

  // WINDOW FRAME
  const wfp=14;
  const wfG=ctx.createLinearGradient(winX,0,winX+winW,0);
  wfG.addColorStop(0,'#9a7030');wfG.addColorStop(0.5,'#c8a050');wfG.addColorStop(1,'#7a5018');
  ctx.fillStyle=wfG;
  ctx.fillRect(winX-wfp,winY-wfp,winW+wfp*2,wfp);
  ctx.fillRect(winX-wfp,winY+winH,winW+wfp*2,wfp+2);
  ctx.fillRect(winX-wfp,winY-wfp,wfp,winH+wfp*2);
  ctx.fillRect(winX+winW,winY-wfp,wfp,winH+wfp*2);

  // WINDOW GLASS — night city
  ctx.save();
  ctx.beginPath();ctx.rect(winX,winY,winW,winH);ctx.clip();
  const ngG=ctx.createLinearGradient(0,winY,0,winY+winH);
  ngG.addColorStop(0,'#090e1c');ngG.addColorStop(0.5,'#0f1530');ngG.addColorStop(1,'#16193a');
  ctx.fillStyle=ngG;ctx.fillRect(winX,winY,winW,winH);
  // Stars
  [[.08,.1],[.18,.07],[.3,.13],[.44,.05],[.56,.1],[.65,.17],[.78,.07],[.9,.12],[.95,.08],
   [.12,.22],[.38,.2],[.7,.19],[.84,.25]].forEach(([sx,sy])=>{
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();
    ctx.arc(winX+winW*sx,winY+winH*sy,0.9,0,Math.PI*2);ctx.fill();
  });
  // Moon
  const mx=winX+winW*.78,my=winY+winH*.12;
  const moonG=ctx.createRadialGradient(mx-2,my-2,1,mx,my,9);
  moonG.addColorStop(0,'#fff8e0');moonG.addColorStop(0.6,'#f0e0a0');moonG.addColorStop(1,'rgba(240,220,150,0)');
  ctx.fillStyle=moonG;ctx.beginPath();ctx.arc(mx,my,9,0,Math.PI*2);ctx.fill();
  // City silhouette far
  ctx.fillStyle='#191530';
  ctx.beginPath();ctx.moveTo(winX,winY+winH);
  const fb=[.55,.35,.2,.4,.3,.55,.22,.38,.52,.28,.42,.55,.32,.18,.45,.55,.25,.4,.55,.2,.35,.5,.28,.44];
  const fbw=winW/fb.length;
  fb.forEach((b,i)=>{ctx.lineTo(winX+i*fbw,winY+winH*b);ctx.lineTo(winX+(i+1)*fbw,winY+winH*b);});
  ctx.lineTo(winX+winW,winY+winH);ctx.closePath();ctx.fill();
  // City mid warm
  ctx.fillStyle='#2a1a16';
  ctx.beginPath();ctx.moveTo(winX,winY+winH);
  const mb=[.75,.5,.35,.6,.42,.7,.4,.55,.72,.45,.6,.75,.48,.33,.62,.75,.38,.55,.72,.35,.5,.68,.42,.6];
  const mbw=winW/mb.length;
  mb.forEach((b,i)=>{ctx.lineTo(winX+i*mbw,winY+winH*b);ctx.lineTo(winX+(i+1)*mbw,winY+winH*b);});
  ctx.lineTo(winX+winW,winY+winH);ctx.closePath();ctx.fill();
  // Building lights
  const lights=[[.08,.68],[.14,.74],[.21,.70],[.28,.65],[.35,.72],[.42,.68],[.48,.75],[.55,.70],
    [.62,.66],[.69,.73],[.76,.68],[.83,.72],[.90,.67],[.11,.82],[.24,.85],[.38,.80],
    [.51,.83],[.65,.79],[.78,.84],[.88,.80],[.18,.60],[.32,.57],[.45,.62],[.58,.58]];
  lights.forEach(([sx,sy],i)=>{
    ctx.fillStyle=i%3===0?`rgba(255,${185+Math.random()*30|0},${65+Math.random()*30|0},0.75)`:`rgba(200,220,255,0.5)`;
    ctx.fillRect(winX+winW*sx,winY+winH*sy,2.2,2.8);
  });
  ctx.restore();

  // Window crossbars
  ctx.fillStyle='#b09040';
  ctx.fillRect(winX,winY+winH/2-3,winW,6);
  ctx.fillRect(winX+winW/2-3,winY,6,winH);
  ctx.fillStyle='rgba(255,215,100,0.14)';
  ctx.fillRect(winX,winY+winH/2-3,winW,2);
  ctx.fillRect(winX+winW/2-3,winY,2,winH);
  // Window sill
  const sillG=ctx.createLinearGradient(0,winY+winH,0,winY+winH+18);
  sillG.addColorStop(0,'#c8a050');sillG.addColorStop(1,'#6a5018');
  ctx.fillStyle=sillG;ctx.fillRect(winX-wfp-4,winY+winH,winW+wfp*2+8,18);
  ctx.fillStyle='rgba(255,200,100,0.12)';ctx.fillRect(winX-wfp-4,winY+winH,winW+wfp*2+8,3);

  // Plant on sill
  drawPlant(ctx,winX+winW*.62,winY+winH-8,W);

  // LAMP
  const lcx=W*.34;
  drawLamp(ctx,lcx,0,lampOn,W,H);
  if(lampOn){
    const coneG=ctx.createRadialGradient(lcx,H*.2,0,lcx,H*.2,W*.3);
    coneG.addColorStop(0,'rgba(255,175,65,0.2)');
    coneG.addColorStop(0.4,'rgba(255,140,50,0.08)');
    coneG.addColorStop(1,'rgba(0,0,0,0)');
    ctx.save();
    ctx.beginPath();ctx.moveTo(lcx,H*.2);ctx.lineTo(lcx-W*.28,deskY+H*.05);ctx.lineTo(lcx+W*.28,deskY+H*.05);ctx.closePath();
    ctx.fillStyle=coneG;ctx.fill();ctx.restore();
  }

  // BOOKSHELF
  drawBookshelf(ctx,0,0,W*.115,deskY,W);
  // CORK BOARD
  drawCorkboard(ctx,W*.87,H*.07,W*.115,H*.28,W);
  // SMALL ART
  drawWallArt(ctx,W*.15,H*.13,W*.09,H*.13);
  // DESK
  drawDesk(ctx,0,deskY,W,H,lampOn,lcx);
  // CLUTTER
  drawClutter(ctx,0,deskY,W,H);
  // FLOOR
  drawFloor(ctx,0,deskY,W,H);
  // VIGNETTE
  const vG=ctx.createRadialGradient(W/2,H/2,H*.18,W/2,H/2,H*.82);
  vG.addColorStop(0,'rgba(0,0,0,0)');vG.addColorStop(0.55,'rgba(0,0,0,0.05)');vG.addColorStop(1,'rgba(0,0,0,0.72)');
  ctx.fillStyle=vG;ctx.fillRect(0,0,W,H);
  const bG=ctx.createLinearGradient(0,H*.87,0,H);
  bG.addColorStop(0,'rgba(0,0,0,0)');bG.addColorStop(1,'rgba(0,0,0,0.58)');
  ctx.fillStyle=bG;ctx.fillRect(0,H*.87,W,H*.13);
}

function drawPlant(ctx,x,y,W){
  const s=W/900;
  ctx.fillStyle='#a84820';
  ctx.beginPath();ctx.moveTo(x-14*s,y);ctx.lineTo(x+14*s,y);ctx.lineTo(x+10*s,y+20*s);ctx.lineTo(x-10*s,y+20*s);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2a1408';ctx.beginPath();ctx.ellipse(x,y,12*s,4*s,0,0,Math.PI*2);ctx.fill();
  const lv=[[-8,-28,30],[-4,-44,-22],[3,-36,12],[8,-25,-36],[0,-54,5]];
  lv.forEach(([lx,ly,a])=>{
    ctx.save();ctx.translate(x+lx*s,y+ly*s);ctx.rotate(a*Math.PI/180);
    const g=ctx.createRadialGradient(-2*s,-4*s,1,0,0,14*s);
    g.addColorStop(0,'#6a9040');g.addColorStop(1,'#2a5018');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,7*s,14*s,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
  ctx.strokeStyle='#3a6020';ctx.lineWidth=2*s;
  ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-4*s,y-26*s,x-2*s,y-52*s);ctx.stroke();
}

function drawLamp(ctx,cx,topY,on,W,H){
  const s=W/900;
  ctx.strokeStyle='#3a2010';ctx.lineWidth=3*s;
  ctx.beginPath();ctx.moveTo(cx,topY);ctx.quadraticCurveTo(cx+6*s,H*.08,cx,H*.18);ctx.stroke();
  ctx.strokeStyle='#b87830';ctx.lineWidth=5*s;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(cx,H*.18);ctx.lineTo(cx-22*s,H*.14);ctx.stroke();ctx.lineCap='butt';
  const sw=68*s,sh=52*s,sx=cx-6*s,sy=H*.14;
  ctx.save();ctx.translate(sx,sy);
  const shG=ctx.createLinearGradient(-sw/2,0,sw/2,sh);
  shG.addColorStop(0,'#c84022');shG.addColorStop(0.35,'#a83010');shG.addColorStop(0.7,'#882808');shG.addColorStop(1,'#6a1e06');
  ctx.fillStyle=shG;
  ctx.beginPath();
  ctx.moveTo(-sw*.38,0);ctx.bezierCurveTo(-sw*.38,-12*s,sw*.38,-12*s,sw*.38,0);
  ctx.bezierCurveTo(sw*.5,sh*.4,sw*.45,sh*.85,sw*.36,sh);
  ctx.bezierCurveTo(sw*.15,sh*1.05,-sw*.15,sh*1.05,-sw*.36,sh);
  ctx.bezierCurveTo(-sw*.45,sh*.85,-sw*.5,sh*.4,-sw*.38,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#e8a060';ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(0,0,sw*.38,5*s,0,0,Math.PI*2);ctx.stroke();
  if(on){
    const ig=ctx.createRadialGradient(0,sh*.7,2,0,sh*.5,sw*.4);
    ig.addColorStop(0,'rgba(255,230,140,0.95)');ig.addColorStop(0.3,'rgba(255,180,80,0.55)');ig.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=ig;ctx.beginPath();ctx.ellipse(0,sh*.55,sw*.33,sh*.45,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff8d0';ctx.shadowColor='rgba(255,220,100,0.9)';ctx.shadowBlur=18*s;
    ctx.beginPath();ctx.arc(0,sh*.58,5*s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  }
  ctx.fillStyle='rgba(255,255,255,0.07)';ctx.beginPath();ctx.ellipse(-sw*.12,sh*.2,sw*.12,sh*.14,-0.3,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawBookshelf(ctx,x,y,w,h,W){
  const s=W/900;
  ctx.fillStyle='#160c04';ctx.fillRect(x,y,w,h);
  const spG=ctx.createLinearGradient(x+w-6*s,0,x+w,0);
  spG.addColorStop(0,'#6a4010');spG.addColorStop(1,'#3a2008');
  ctx.fillStyle=spG;ctx.fillRect(x+w-6*s,y,6*s,h);
  [h*.32,h*.64].forEach(sy=>{
    const shG=ctx.createLinearGradient(0,y+sy,0,y+sy+12*s);
    shG.addColorStop(0,'#9a6828');shG.addColorStop(0.4,'#7a5018');shG.addColorStop(1,'#5e3c10');
    ctx.fillStyle=shG;ctx.fillRect(x,y+sy,w,12*s);
    ctx.fillStyle='rgba(255,200,100,0.1)';ctx.fillRect(x,y+sy,w,2*s);
  });
  const rows=[[{w:11,h:.88,c:'#8a3020'},{w:9,h:.72,c:'#205080'},{w:12,h:.92,c:'#4a7030'},{w:8,h:.68,c:'#804020'},{w:11,h:.82,c:'#6a4080'},{w:8,h:.65,c:'#205048'},{w:10,h:.78,c:'#c09028'}],
               [{w:10,h:.8,c:'#7a3828'},{w:13,h:.9,c:'#284878'},{w:9,h:.74,c:'#5a7028'},{w:11,h:.86,c:'#782828'},{w:8,h:.7,c:'#204858'}]];
  rows.forEach((row,ri)=>{
    const shelfY=ri===0?h*.32:h*.64;
    const rowH=ri===0?h*.28:h*.3;
    let bx=x+4*s;
    row.forEach(b=>{
      const bw=b.w*s,bh=rowH*b.h,by=y+shelfY-bh;
      const bG=ctx.createLinearGradient(bx,by,bx+bw,by);
      bG.addColorStop(0,b.c);bG.addColorStop(0.15,lighten(b.c,20));bG.addColorStop(1,darken(b.c,20));
      ctx.fillStyle=bG;ctx.fillRect(bx,by,bw,bh);
      ctx.fillStyle='rgba(255,255,255,0.07)';ctx.fillRect(bx,by,1.5*s,bh);
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(bx+bw-1.5*s,by,1.5*s,bh);
      bx+=bw+1.5*s;
    });
  });
}

function drawCorkboard(ctx,x,y,w,h,W){
  const s=W/900;
  const fG=ctx.createLinearGradient(x,y,x+w,y+h);
  fG.addColorStop(0,'#c8901a');fG.addColorStop(0.5,'#9a6c10');fG.addColorStop(1,'#b87c14');
  ctx.fillStyle=fG;ctx.beginPath();ctx.roundRect(x,y,w,h,3);ctx.fill();
  ctx.save();ctx.beginPath();ctx.roundRect(x+5*s,y+5*s,w-10*s,h-10*s,2);ctx.clip();
  const cG=ctx.createLinearGradient(x,y,x+w,y+h);
  cG.addColorStop(0,'#c89050');cG.addColorStop(0.5,'#a87030');cG.addColorStop(1,'#c08040');
  ctx.fillStyle=cG;ctx.fillRect(x+5*s,y+5*s,w-10*s,h-10*s);
  ctx.restore();
  // post-its
  [[x+w*.1,y+h*.08,w*.7,h*.3,'#fffaaa',-3],[x+w*.15,y+h*.48,w*.65,h*.26,'#ffd890',4]].forEach(([px,py,pw,ph,pc,pr])=>{
    ctx.save();ctx.translate(px+pw/2,py+ph/2);ctx.rotate(pr*Math.PI/180);
    ctx.fillStyle=pc;ctx.beginPath();ctx.roundRect(-pw/2,-ph/2,pw,ph,1);ctx.fill();
    ctx.fillStyle='#c02020';ctx.beginPath();ctx.arc(0,-ph/2+3*s,3*s,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
}

function drawWallArt(ctx,x,y,w,h){
  const fG=ctx.createLinearGradient(x,y,x+w,y+h);
  fG.addColorStop(0,'#c09020');fG.addColorStop(0.5,'#9a7010');fG.addColorStop(1,'#c09020');
  ctx.fillStyle=fG;ctx.fillRect(x,y,w,h);
  const cG=ctx.createLinearGradient(x+6,y+6,x+w-6,y+h-6);
  cG.addColorStop(0,'#2a3050');cG.addColorStop(1,'#1e2440');
  ctx.fillStyle=cG;ctx.fillRect(x+6,y+6,w-12,h-12);
  ctx.fillStyle='rgba(255,210,80,0.5)';ctx.beginPath();ctx.arc(x+w*.55,y+h*.32,h*.15,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1a3028';ctx.beginPath();ctx.moveTo(x+6,y+h-6);ctx.quadraticCurveTo(x+w*.3,y+h*.5,x+w*.5,y+h-6);ctx.closePath();ctx.fill();
  ctx.fillStyle='#142820';ctx.beginPath();ctx.moveTo(x+w*.35,y+h-6);ctx.quadraticCurveTo(x+w*.65,y+h*.4,x+w-6,y+h-6);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(180,140,60,0.4)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x+w*.25,y);ctx.quadraticCurveTo(x+w*.5,y-8,x+w*.75,y);ctx.stroke();
}

function drawDesk(ctx,x,deskY,W,H,on,lx){
  const dtG=ctx.createLinearGradient(0,deskY,0,deskY+20);
  dtG.addColorStop(0,'#c07838');dtG.addColorStop(0.35,'#a86028');dtG.addColorStop(1,'#7a4418');
  ctx.fillStyle=dtG;ctx.fillRect(x,deskY,W,20);
  ctx.fillStyle='rgba(255,200,100,0.18)';ctx.fillRect(x,deskY,W,2);
  const dfG=ctx.createLinearGradient(0,deskY+20,0,H);
  dfG.addColorStop(0,'#7a4418');dfG.addColorStop(0.4,'#5a3010');dfG.addColorStop(1,'#3a2008');
  ctx.fillStyle=dfG;ctx.fillRect(x,deskY+20,W,H-(deskY+20));
  if(on){
    const dg=ctx.createRadialGradient(lx,deskY,0,lx,deskY,W*.35);
    dg.addColorStop(0,'rgba(255,170,60,0.28)');dg.addColorStop(0.4,'rgba(255,140,40,0.1)');dg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=dg;ctx.fillRect(0,deskY,W,40);
  }
}

function drawClutter(ctx,x0,deskY,W,H){
  const s=W/900,sy=deskY+4;
  // notebook
  const nx=W*.28,ny=sy-45*s,nw=155*s,nh=55*s;
  const lpG=ctx.createLinearGradient(nx,ny,nx+nw*.49,ny+nh);
  lpG.addColorStop(0,'#fefae8');lpG.addColorStop(1,'#f8f0d8');
  ctx.fillStyle=lpG;ctx.shadowColor='rgba(0,0,0,0.35)';ctx.shadowBlur=10*s;ctx.shadowOffsetX=-3*s;ctx.shadowOffsetY=4*s;
  ctx.beginPath();ctx.roundRect(nx,ny,nw*.49,nh,[2,0,0,2]);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
  const rpG=ctx.createLinearGradient(nx+nw*.51,ny,nx+nw,ny+nh);
  rpG.addColorStop(0,'#fdf8e8');rpG.addColorStop(1,'#f6eec8');
  ctx.fillStyle=rpG;ctx.shadowColor='rgba(0,0,0,0.28)';ctx.shadowBlur=10*s;ctx.shadowOffsetX=4*s;ctx.shadowOffsetY=4*s;
  ctx.beginPath();ctx.roundRect(nx+nw*.51,ny,nw*.49,nh,[0,2,2,0]);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
  const spG=ctx.createLinearGradient(nx+nw*.49,ny,nx+nw*.51,ny);
  spG.addColorStop(0,'#c0a060');spG.addColorStop(0.5,'#e8c870');spG.addColorStop(1,'#b09050');
  ctx.fillStyle=spG;ctx.fillRect(nx+nw*.49,ny,nw*.02,nh);
  ctx.strokeStyle='rgba(100,80,180,0.18)';ctx.lineWidth=0.8;
  for(let ly=ny+10*s;ly<ny+nh-6*s;ly+=10*s){
    ctx.beginPath();ctx.moveTo(nx+6*s,ly);ctx.lineTo(nx+nw*.47,ly);ctx.stroke();
    ctx.beginPath();ctx.moveTo(nx+nw*.53,ly);ctx.lineTo(nx+nw-6*s,ly);ctx.stroke();
  }
  // pen on notebook
  ctx.save();ctx.translate(nx+nw*.3,ny+nh*.6);ctx.rotate(-8*Math.PI/180);
  const penG=ctx.createLinearGradient(0,0,nw*.55,0);
  penG.addColorStop(0,'#1a1208');penG.addColorStop(0.2,'#3a2a10');penG.addColorStop(0.6,'#c8a050');penG.addColorStop(1,'#1a1208');
  ctx.fillStyle=penG;ctx.fillRect(0,-2,nw*.55,4);
  ctx.fillStyle='#c83020';ctx.beginPath();ctx.moveTo(nw*.55,-2);ctx.lineTo(nw*.55+6*s,0);ctx.lineTo(nw*.55,-2+4);ctx.closePath();ctx.fill();
  ctx.restore();
  // books stack
  [[85,'#c8601a'],[95,'#204878'],[78,'#284820']].forEach((b,i)=>{
    const bW=b[0]*s,bH=16*s,bX=W*.62,bY=sy-(3-i)*bH-2*i;
    const bG=ctx.createLinearGradient(bX,bY,bX+bW,bY+bH);
    bG.addColorStop(0,lighten(b[1],15));bG.addColorStop(0.5,b[1]);bG.addColorStop(1,darken(b[1],20));
    ctx.fillStyle=bG;ctx.fillRect(bX,bY,bW,bH);
    ctx.fillStyle='rgba(255,255,255,0.07)';ctx.fillRect(bX,bY,bW,2);
    ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(bX,bY+bH-2,bW,2);
  });
  // pen cup
  const cx=W*.14,ch=30*s,cy=sy-ch,cw=22*s;
  const cupG=ctx.createLinearGradient(cx-cw/2,cy,cx+cw/2,cy+ch);
  cupG.addColorStop(0,'#b84020');cupG.addColorStop(0.3,'#8a2810');cupG.addColorStop(1,'#6a1808');
  ctx.fillStyle=cupG;ctx.beginPath();ctx.roundRect(cx-cw/2,cy,cw,ch,[3,3,2,2]);ctx.fill();
  [{dx:-7,h:38,c:'#c83020'},{dx:-2,h:32,c:'#2a2820'},{dx:3,h:42,c:'#2060a0'},{dx:8,h:28,c:'#309030'}].forEach(({dx,h,c})=>{
    ctx.fillStyle=c;ctx.fillRect(cx+dx*s-1.2*s,cy-h*s,2.5*s,h*s);
    ctx.fillStyle='#f5e8c0';ctx.beginPath();ctx.moveTo(cx+dx*s-1.2*s,cy-h*s);ctx.lineTo(cx+dx*s+1.3*s,cy-h*s);ctx.lineTo(cx+dx*s,cy-(h+5)*s);ctx.closePath();ctx.fill();
  });
  // candle
  const ccx=W*.52,cch=36*s,ccy=sy-cch;
  const candG=ctx.createLinearGradient(0,ccy,0,ccy+cch);
  candG.addColorStop(0,'#faecd8');candG.addColorStop(0.5,'#e8d4b8');candG.addColorStop(1,'#d4c0a0');
  ctx.fillStyle=candG;ctx.fillRect(ccx-12*s,ccy,24*s,cch);
  ctx.strokeStyle='#1a0a04';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(ccx,ccy);ctx.lineTo(ccx+1*s,ccy-8*s);ctx.stroke();
  ctx.save();ctx.translate(ccx+1*s,ccy-8*s);
  const flG=ctx.createRadialGradient(0,4*s,0,0,0,14*s);
  flG.addColorStop(0,'rgba(255,255,200,0.95)');flG.addColorStop(0.2,'rgba(255,200,80,0.85)');flG.addColorStop(0.5,'rgba(255,120,30,0.55)');flG.addColorStop(1,'rgba(255,80,10,0)');
  ctx.fillStyle=flG;ctx.beginPath();ctx.moveTo(0,12*s);ctx.bezierCurveTo(-5*s,6*s,-6*s,-4*s,0,-12*s);ctx.bezierCurveTo(6*s,-4*s,5*s,6*s,0,12*s);ctx.fill();
  ctx.fillStyle='rgba(255,245,180,0.9)';ctx.shadowColor='rgba(255,160,40,0.8)';ctx.shadowBlur=12*s;ctx.beginPath();ctx.arc(0,-2*s,3*s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.restore();
}

function drawFloor(ctx,x,deskY,W,H){
  const flY=deskY+20;
  for(let r=0;r<3;r++){
    const fy=flY+r*(H-flY)/3,fH=(H-flY)/3;
    const fG=ctx.createLinearGradient(0,fy,0,fy+fH);
    fG.addColorStop(0,r===0?'#5a3010':'#4a2808');fG.addColorStop(1,'#2a1606');
    ctx.fillStyle=fG;ctx.fillRect(x,fy,W,fH+1);
    ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=1;
    for(let px=0;px<W;px+=100){ctx.beginPath();ctx.moveTo(px,fy);ctx.lineTo(px,fy+fH);ctx.stroke();}
    ctx.strokeStyle='rgba(0,0,0,0.07)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,fy);ctx.lineTo(W,fy);ctx.stroke();
  }
}

// ── ITEM OBJECTS — using actual illustrated SVG rendered to canvas ────────────

// ENVELOPE — photorealistic illustrated style
function drawEnvelope(canvas) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => {
    c.clearRect(0,0,W,H);
    c.drawImage(img,0,0,W,H);
  };
  img.src = getEnvelopeSVG();
}

// CAMERA
function drawCamera(canvas) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => { c.clearRect(0,0,W,H); c.drawImage(img,0,0,W,H); };
  img.src = getCameraSVG();
}

// FRAME
function drawPictureFrame(canvas, photos, frameIdx) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => {
    c.clearRect(0,0,W,H);
    c.drawImage(img,0,0,W,H);
    // overlay photo if any
    if(frameIdx>=0 && photos && photos[frameIdx]){
      const ph = new Image();
      ph.onload = () => {
        c.save();
        // clip to photo area inside frame
        c.beginPath();
        const px=W*.185, py=H*.18, pw=W*.63, ph2=H*.56;
        c.rect(px,py,pw,ph2);
        c.clip();
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

// WALKMAN
function drawWalkman(canvas, playing, reelAngle) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => {
    c.clearRect(0,0,W,H);
    c.drawImage(img,0,0,W,H);
    // animate reels on top
    if(playing) drawAnimatedReels(c, W, H, reelAngle);
    // LED pulse
    const ledX=W*.5, ledY=H*.83;
    if(playing){
      const lG=c.createRadialGradient(ledX,ledY,0,ledX,ledY,W*.025);
      lG.addColorStop(0,'rgba(100,180,255,0.9)');lG.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=lG;c.beginPath();c.arc(ledX,ledY,W*.025,0,Math.PI*2);c.fill();
    }
  };
  img.src = getWalkmanSVG();
}

function drawAnimatedReels(c, W, H, angle) {
  // left reel center
  const r1x=W*.285, r1y=H*.38, r2x=W*.715, r2y=H*.38, r=W*.11;
  [r1x,r2x].forEach((rx,ri)=>{
    c.save();c.translate(rx,r1y);c.rotate(angle*(ri===0?1:1.35));
    c.strokeStyle='rgba(74,144,217,0.55)';c.lineWidth=1.5;c.lineCap='round';
    for(let sp=0;sp<3;sp++){
      c.rotate(Math.PI*2/3);c.beginPath();c.moveTo(0,0);c.lineTo(0,r*.42);c.stroke();
    }
    c.restore();
  });
}

// ── SVG DEFINITIONS — inline illustrated objects ─────────────────────────────

function getEnvelopeSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 155" width="220" height="155">
  <defs>
    <linearGradient id="eb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8e498"/>
      <stop offset="30%" stop-color="#eec860"/>
      <stop offset="65%" stop-color="#dda838"/>
      <stop offset="100%" stop-color="#c89028"/>
    </linearGradient>
    <linearGradient id="ef" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fbeea8"/>
      <stop offset="50%" stop-color="#f2d060"/>
      <stop offset="100%" stop-color="#d9a830"/>
    </linearGradient>
    <linearGradient id="es" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e84848"/>
      <stop offset="45%" stop-color="#b82020"/>
      <stop offset="100%" stop-color="#6a0808"/>
    </linearGradient>
    <filter id="eshadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="rgba(0,0,0,0.55)"/></filter>
    <filter id="flapsh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.2)"/></filter>
    <!-- Paper texture pattern -->
    <pattern id="paper" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="4" y2="4" stroke="rgba(180,140,50,0.06)" stroke-width="0.5"/>
      <line x1="4" y1="0" x2="0" y2="4" stroke="rgba(180,140,50,0.04)" stroke-width="0.5"/>
    </pattern>
  </defs>
  <!-- Drop shadow -->
  <rect x="12" y="28" width="198" height="120" rx="4" fill="rgba(0,0,0,0.4)" filter="url(#eshadow)"/>
  <!-- Envelope body -->
  <rect x="10" y="22" width="200" height="122" rx="4" fill="url(#eb)"/>
  <!-- Paper texture overlay -->
  <rect x="10" y="22" width="200" height="122" rx="4" fill="url(#paper)" opacity="0.8"/>
  <!-- Left fold triangle shadow -->
  <polygon points="10,22 110,88 10,144" fill="rgba(80,40,0,0.2)"/>
  <!-- Right fold triangle shadow -->
  <polygon points="210,22 110,88 210,144" fill="rgba(80,40,0,0.15)"/>
  <!-- Bottom fold highlight -->
  <polygon points="10,144 110,88 210,144" fill="rgba(255,255,255,0.08)"/>
  <!-- Fold crease lines -->
  <line x1="10" y1="144" x2="110" y2="88" stroke="rgba(120,70,10,0.25)" stroke-width="1"/>
  <line x1="210" y1="144" x2="110" y2="88" stroke="rgba(120,70,10,0.22)" stroke-width="1"/>
  <!-- Flap -->
  <polygon points="10,22 110,90 210,22" fill="url(#ef)" filter="url(#flapsh)"/>
  <!-- Flap highlight top -->
  <polygon points="10,22 110,56 210,22" fill="rgba(255,255,255,0.16)"/>
  <!-- Flap bottom edge -->
  <line x1="10" y1="22" x2="110" y2="90" stroke="rgba(140,80,10,0.3)" stroke-width="1.2"/>
  <line x1="210" y1="22" x2="110" y2="90" stroke="rgba(140,80,10,0.28)" stroke-width="1.2"/>
  <!-- Top edge highlight -->
  <rect x="10" y="22" width="200" height="3" rx="2" fill="rgba(255,248,180,0.32)"/>
  <!-- Wax seal -->
  <circle cx="110" cy="96" r="20" fill="url(#es)" filter="url(#eshadow)"/>
  <circle cx="110" cy="96" r="18" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
  <circle cx="110" cy="96" r="14" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
  <!-- Heart in seal -->
  <text x="110" y="102" text-anchor="middle" font-size="14" font-family="Georgia,serif" fill="#f8d060" filter="url(#eshadow)">♥</text>
  <!-- Stamp top right -->
  <rect x="174" y="30" width="26" height="22" rx="1" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" stroke-dasharray="2,1.5"/>
  <rect x="176" y="32" width="22" height="18" rx="1" fill="rgba(100,180,80,0.28)"/>
  <!-- Postmark circle -->
  <circle cx="165" cy="35" r="10" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.8"/>
  <line x1="158" y1="35" x2="172" y2="35" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getCameraSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 185" width="260" height="185">
  <defs>
    <linearGradient id="cbody" x1="0%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#363c44"/>
      <stop offset="35%" stop-color="#252c38"/>
      <stop offset="70%" stop-color="#181e28"/>
      <stop offset="100%" stop-color="#101418"/>
    </linearGradient>
    <linearGradient id="chump" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2e3440"/>
      <stop offset="100%" stop-color="#1e2430"/>
    </linearGradient>
    <radialGradient id="cglass" cx="36%" cy="34%" r="60%">
      <stop offset="0%" stop-color="#5080d0" stop-opacity="0.45"/>
      <stop offset="30%" stop-color="#3060b8" stop-opacity="0.28"/>
      <stop offset="65%" stop-color="#1a3888" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#050c1e" stop-opacity="0.05"/>
    </radialGradient>
    <radialGradient id="ccoat" cx="28%" cy="26%" r="58%">
      <stop offset="0%" stop-color="rgba(150,175,255,0.28)"/>
      <stop offset="45%" stop-color="rgba(110,145,235,0.12)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <linearGradient id="cflash" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c8a050"/>
      <stop offset="100%" stop-color="#8a6018"/>
    </linearGradient>
    <filter id="csh"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="rgba(0,0,0,0.7)"/></filter>
    <filter id="lsh"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,0.65)"/></filter>
    <!-- Grip texture -->
    <pattern id="grip" x="0" y="0" width="1" height="3.5" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="1" height="2" fill="rgba(0,0,0,0.22)"/>
    </pattern>
  </defs>
  <!-- Shadow -->
  <rect x="12" y="55" width="236" height="118" rx="7" fill="rgba(0,0,0,0.5)" filter="url(#csh)"/>
  <!-- Pentaprism hump -->
  <rect x="25" y="32" width="108" height="36" rx="5" fill="url(#chump)"/>
  <rect x="25" y="32" width="108" height="4" rx="2" fill="rgba(255,255,255,0.05)"/>
  <!-- Main body -->
  <rect x="8" y="52" width="244" height="120" rx="7" fill="url(#cbody)"/>
  <!-- Body top highlight -->
  <rect x="8" y="52" width="244" height="4" rx="3" fill="rgba(255,255,255,0.055)"/>
  <!-- Rubber grip right -->
  <rect x="198" y="52" width="54" height="120" rx="0" fill="#12161c"/>
  <rect x="198" y="52" width="54" height="120" fill="url(#grip)"/>
  <rect x="198" y="52" width="54" height="120" rx="0" fill="none" stroke="#1e2430" stroke-width="0.5"/>
  <!-- Lens barrel outer -->
  <circle cx="108" cy="112" r="62" fill="#12161c" filter="url(#lsh)"/>
  <circle cx="108" cy="112" r="60" fill="#0e1018"/>
  <!-- Lens rings -->
  <circle cx="108" cy="112" r="56" fill="none" stroke="#1e2430" stroke-width="2.5"/>
  <circle cx="108" cy="112" r="50" fill="#141820"/>
  <circle cx="108" cy="112" r="46" fill="none" stroke="#1a1e28" stroke-width="1.5"/>
  <circle cx="108" cy="112" r="41" fill="#0e1018"/>
  <circle cx="108" cy="112" r="37" fill="none" stroke="#1e2430" stroke-width="1"/>
  <!-- Focus ring tick marks -->
  <circle cx="108" cy="112" r="54" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3" stroke-dasharray="4,12"/>
  <!-- Glass element -->
  <circle cx="108" cy="112" r="32" fill="#060c18"/>
  <circle cx="108" cy="112" r="32" fill="url(#cglass)"/>
  <!-- Lens coating shimmer -->
  <circle cx="108" cy="112" r="32" fill="url(#ccoat)"/>
  <!-- Inner reflection -->
  <ellipse cx="100" cy="104" rx="9" ry="5.5" transform="rotate(-22,100,104)" fill="rgba(180,210,255,0.13)"/>
  <ellipse cx="118" cy="122" rx="4" ry="2.5" transform="rotate(-22,118,122)" fill="rgba(80,120,200,0.07)"/>
  <!-- Lens ring border glow -->
  <circle cx="108" cy="112" r="60" fill="none" stroke="rgba(255,255,255,0.055)" stroke-width="1.5"/>
  <!-- SHUTTER BUTTON -->
  <circle cx="172" cy="49" r="12" fill="#383e48"/>
  <circle cx="172" cy="49" r="10" fill="#2a303c"/>
  <circle cx="172" cy="49" r="6" fill="#3a4050"/>
  <circle cx="170" cy="47" r="3" fill="rgba(255,255,255,0.08)"/>
  <!-- Mode dial -->
  <circle cx="238" cy="45" r="16" fill="#2a2e38"/>
  <circle cx="238" cy="45" r="14" fill="#1e2228"/>
  <circle cx="238" cy="45" r="10" fill="#282e38"/>
  <line x1="238" y1="36" x2="238" y2="31" stroke="rgba(200,168,80,0.6)" stroke-width="1.5"/>
  <text x="238" y="49" text-anchor="middle" font-size="7" font-family="monospace" fill="rgba(200,168,80,0.7)" letter-spacing="0">A</text>
  <!-- Hot shoe -->
  <rect x="135" y="38" width="22" height="8" rx="1" fill="#1a1e28"/>
  <rect x="135" y="38" width="22" height="2" fill="rgba(255,255,255,0.04)"/>
  <!-- Viewfinder -->
  <rect x="35" y="38" width="26" height="15" rx="2" fill="#06080e" stroke="#2a2e3a" stroke-width="1.5"/>
  <rect x="37" y="40" width="22" height="11" rx="1" fill="rgba(60,100,200,0.18)"/>
  <!-- Flash -->
  <rect x="163" y="36" width="28" height="14" rx="2" fill="url(#cflash)"/>
  <rect x="163" y="36" width="28" height="3" rx="1" fill="rgba(255,230,130,0.25)"/>
  <!-- Strap lug left -->
  <rect x="4" y="68" width="8" height="16" rx="2" fill="#1a1e28"/>
  <!-- Brand text -->
  <rect x="200" y="68" width="38" height="8" rx="1" fill="rgba(200,165,80,0.12)"/>
  <text x="219" y="75" text-anchor="middle" font-size="6.5" font-family="Special Elite,monospace" fill="rgba(200,165,80,0.72)" letter-spacing="1.5">WABI</text>
  <!-- Body sheen -->
  <rect x="8" y="52" width="244" height="120" rx="7" fill="url(#chump)" opacity="0.04"/>
  <ellipse cx="80" cy="80" rx="60" ry="30" fill="rgba(255,255,255,0.03)" transform="rotate(-15,80,80)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getFrameSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190" width="200" height="190">
  <defs>
    <!-- Gold conic-style gradient approximated with multiple stops -->
    <linearGradient id="ftop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0c840"/>
      <stop offset="25%" stop-color="#8a6010"/>
      <stop offset="50%" stop-color="#d4a828"/>
      <stop offset="75%" stop-color="#8a6010"/>
      <stop offset="100%" stop-color="#f0c840"/>
    </linearGradient>
    <linearGradient id="fleft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f0c840"/>
      <stop offset="40%" stop-color="#c09020"/>
      <stop offset="100%" stop-color="#8a6010"/>
    </linearGradient>
    <linearGradient id="fright" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8a6010"/>
      <stop offset="60%" stop-color="#b08018"/>
      <stop offset="100%" stop-color="#d4a828"/>
    </linearGradient>
    <linearGradient id="fbot" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8a6010"/>
      <stop offset="60%" stop-color="#c89018"/>
      <stop offset="100%" stop-color="#e8b020"/>
    </linearGradient>
    <radialGradient id="fcorn" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f8d030"/>
      <stop offset="50%" stop-color="#c89020"/>
      <stop offset="100%" stop-color="#8a5c08"/>
    </radialGradient>
    <filter id="fsh"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="rgba(0,0,0,0.65)"/></filter>
    <!-- Wood grain texture on frame -->
    <pattern id="grain" x="0" y="0" width="4" height="60" patternUnits="userSpaceOnUse">
      <line x1="1" y1="0" x2="1" y2="60" stroke="rgba(180,130,20,0.055)" stroke-width="0.7"/>
    </pattern>
  </defs>
  <!-- Shadow -->
  <rect x="12" y="16" width="182" height="174" rx="4" fill="rgba(0,0,0,0.5)" filter="url(#fsh)"/>
  <!-- Frame faces — 3D trapezoid effect -->
  <!-- Top face -->
  <polygon points="8,8 192,8 174,28 26,28" fill="url(#ftop)"/>
  <!-- Bottom face -->
  <polygon points="8,182 192,182 174,162 26,162" fill="url(#fbot)"/>
  <!-- Left face -->
  <polygon points="8,8 8,182 28,162 28,28" fill="url(#fleft)"/>
  <!-- Right face -->
  <polygon points="192,8 192,182 172,162 172,28" fill="url(#fright)"/>
  <!-- Grain overlay -->
  <rect x="8" y="8" width="184" height="174" rx="4" fill="url(#grain)" opacity="0.6"/>
  <!-- Frame bevel inner shadow -->
  <rect x="8" y="8" width="184" height="174" rx="4" fill="none" stroke="rgba(255,220,100,0.18)" stroke-width="1.5"/>
  <!-- Mat board -->
  <rect x="28" y="28" width="144" height="134" fill="#ece0bc"/>
  <rect x="30" y="30" width="140" height="130" fill="#e8d8b0"/>
  <!-- Mat bevel shadow -->
  <rect x="30" y="30" width="140" height="130" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="2"/>
  <!-- Photo opening (dark, photo renders here in JS) -->
  <rect x="40" y="40" width="120" height="108" fill="#1a1208" rx="1"/>
  <!-- Corner ornaments -->
  <circle cx="8" cy="8" r="10" fill="url(#fcorn)"/>
  <circle cx="192" cy="8" r="10" fill="url(#fcorn)"/>
  <circle cx="8" cy="182" r="10" fill="url(#fcorn)"/>
  <circle cx="192" cy="182" r="10" fill="url(#fcorn)"/>
  <!-- Corner detail rings -->
  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,240,130,0.3)" stroke-width="1"/>
  <circle cx="192" cy="8" r="6" fill="none" stroke="rgba(255,240,130,0.3)" stroke-width="1"/>
  <circle cx="8" cy="182" r="6" fill="none" stroke="rgba(255,240,130,0.3)" stroke-width="1"/>
  <circle cx="192" cy="182" r="6" fill="none" stroke="rgba(255,240,130,0.3)" stroke-width="1"/>
  <!-- Top sheen reflection -->
  <polygon points="8,8 192,8 174,28 26,28" fill="rgba(255,255,255,0.1)"/>
  <polygon points="8,8 80,8 70,28 26,28" fill="rgba(255,255,255,0.08)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getWalkmanSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 175" width="230" height="175">
  <defs>
    <linearGradient id="wbody" x1="0%" y1="0%" x2="8%" y2="100%">
      <stop offset="0%" stop-color="#2c3c5c"/>
      <stop offset="30%" stop-color="#1e2c4c"/>
      <stop offset="65%" stop-color="#141e3c"/>
      <stop offset="100%" stop-color="#0e1630"/>
    </linearGradient>
    <linearGradient id="wstripe" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="10%" stop-color="#3a6aaa"/>
      <stop offset="50%" stop-color="#5898cc"/>
      <stop offset="90%" stop-color="#3a6aaa"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </linearGradient>
    <linearGradient id="wlabel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4ae52"/>
      <stop offset="50%" stop-color="#e8c868"/>
      <stop offset="100%" stop-color="#c8a045"/>
    </linearGradient>
    <radialGradient id="wreel" cx="30%" cy="28%" r="70%">
      <stop offset="0%" stop-color="#1e3660"/>
      <stop offset="60%" stop-color="#0c1a30"/>
      <stop offset="100%" stop-color="#040a18"/>
    </radialGradient>
    <radialGradient id="wrhub" cx="34%" cy="32%" r="66%">
      <stop offset="0%" stop-color="#3a7098"/>
      <stop offset="100%" stop-color="#182848"/>
    </radialGradient>
    <filter id="wsh"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="rgba(0,0,0,0.72)"/></filter>
    <filter id="winsh"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="rgba(0,0,0,0.8)"/></filter>
    <!-- Volume rocker grip lines -->
    <pattern id="vrgr" x="0" y="0" width="12" height="4" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="12" height="2.5" fill="rgba(70,120,220,0.28)"/>
    </pattern>
  </defs>
  <!-- Main shadow -->
  <rect x="10" y="20" width="188" height="138" rx="10" fill="rgba(0,0,0,0.6)" filter="url(#wsh)"/>
  <!-- Body -->
  <rect x="8" y="16" width="188" height="136" rx="10" fill="url(#wbody)"/>
  <!-- Body highlight top -->
  <rect x="8" y="16" width="188" height="5" rx="4" fill="rgba(255,255,255,0.07)"/>
  <!-- Body border -->
  <rect x="8" y="16" width="188" height="136" rx="10" fill="none" stroke="rgba(255,255,255,0.065)" stroke-width="1.5"/>
  <!-- Cassette window -->
  <rect x="18" y="28" width="164" height="78" rx="6" fill="#01030a" stroke="#1c3258" stroke-width="2.5" filter="url(#winsh)"/>
  <!-- Window plastic sheen -->
  <rect x="20" y="30" width="100" height="35" rx="4" fill="rgba(74,144,217,0.06)"/>
  <!-- Left reel -->
  <circle cx="60" cy="67" r="26" fill="url(#wreel)" stroke="#1c3258" stroke-width="2"/>
  <circle cx="60" cy="67" r="22" fill="#0c1828" stroke="#1a3050" stroke-width="1.2"/>
  <!-- Left reel marks -->
  <circle cx="60" cy="67" r="24" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2.5" stroke-dasharray="3,9"/>
  <circle cx="60" cy="67" r="13" fill="#181830" stroke="#1c3050" stroke-width="1.2"/>
  <!-- Left hub -->
  <circle cx="60" cy="67" r="7" fill="url(#wrhub)" stroke="#2a5080" stroke-width="1.2"/>
  <!-- Left spokes (static, animated ones drawn by JS on top) -->
  <line x1="60" y1="67" x2="60" y2="54" stroke="rgba(74,144,217,0.45)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="60" y1="67" x2="71" y2="73" stroke="rgba(74,144,217,0.45)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="60" y1="67" x2="49" y2="73" stroke="rgba(74,144,217,0.45)" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Right reel -->
  <circle cx="144" cy="67" r="26" fill="url(#wreel)" stroke="#1c3258" stroke-width="2"/>
  <circle cx="144" cy="67" r="22" fill="#0c1828" stroke="#1a3050" stroke-width="1.2"/>
  <circle cx="144" cy="67" r="24" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2.5" stroke-dasharray="3,9"/>
  <circle cx="144" cy="67" r="13" fill="#181830" stroke="#1c3050" stroke-width="1.2"/>
  <circle cx="144" cy="67" r="7" fill="url(#wrhub)" stroke="#2a5080" stroke-width="1.2"/>
  <line x1="144" y1="67" x2="144" y2="54" stroke="rgba(74,144,217,0.45)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="144" y1="67" x2="155" y2="73" stroke="rgba(74,144,217,0.45)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="144" y1="67" x2="133" y2="73" stroke="rgba(74,144,217,0.45)" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Tape path -->
  <path d="M86 90 Q102 96 118 90" stroke="rgba(20,40,60,0.85)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Cassette label center -->
  <rect x="88" y="50" width="28" height="24" rx="3" fill="url(#wlabel)"/>
  <line x1="90" y1="58" x2="114" y2="58" stroke="rgba(140,90,10,0.3)" stroke-width="0.8"/>
  <line x1="90" y1="65" x2="114" y2="65" stroke="rgba(140,90,10,0.3)" stroke-width="0.8"/>
  <text x="102" y="57" text-anchor="middle" font-size="5.5" font-family="Special Elite,monospace" fill="rgba(26,14,6,0.75)" font-weight="bold">WABI</text>
  <text x="102" y="63" text-anchor="middle" font-size="4.5" font-family="Special Elite,monospace" fill="rgba(26,14,6,0.65)">mix tape</text>
  <text x="102" y="70" text-anchor="middle" font-size="4" font-family="Special Elite,monospace" fill="rgba(26,14,6,0.55)">Side A</text>
  <!-- Blue stripe -->
  <rect x="8" y="108" width="188" height="5" fill="url(#wstripe)"/>
  <!-- Controls bar -->
  <rect x="16" y="115" width="170" height="28" rx="4" fill="#0a1428" stroke="#1c3258" stroke-width="1.5"/>
  <!-- Control dots -->
  <circle cx="42" cy="129" r="8" fill="#1e3460" stroke="#1c3258" stroke-width="1.2"/>
  <circle cx="68" cy="129" r="8" fill="#1e3460" stroke="#1c3258" stroke-width="1.2"/>
  <!-- LED center -->
  <circle cx="102" cy="129" r="8" fill="#2878c8" stroke="#4a88d8" stroke-width="1.2"/>
  <circle cx="100" cy="127" r="3" fill="rgba(150,210,255,0.5)"/>
  <circle cx="136" cy="129" r="8" fill="#1e3460" stroke="#1c3258" stroke-width="1.2"/>
  <circle cx="162" cy="129" r="8" fill="#1e3460" stroke="#1c3258" stroke-width="1.2"/>
  <!-- Volume rocker right side -->
  <rect x="200" y="36" width="16" height="55" rx="3" fill="#182848" stroke="#2848a8" stroke-width="1"/>
  <rect x="202" y="40" width="12" height="47" fill="url(#vrgr)"/>
  <!-- Headphone jack -->
  <circle cx="26" cy="158" r="5.5" fill="#010308" stroke="#1c3258" stroke-width="1.5"/>
  <circle cx="26" cy="158" r="2.5" fill="#010308"/>
  <!-- Belt clip -->
  <rect x="204" y="95" width="14" height="42" rx="3" fill="#182848" stroke="#2848a8" stroke-width="1"/>
  <!-- Body sheen -->
  <rect x="8" y="16" width="188" height="136" rx="10" fill="rgba(255,255,255,0)" stroke="none"/>
  <ellipse cx="70" cy="50" rx="75" ry="35" fill="rgba(255,255,255,0.04)" transform="rotate(-10,70,50)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// helpers
function lighten(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return'#'+[Math.min(255,r+a),Math.min(255,g+a),Math.min(255,b+a)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function darken(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return'#'+[Math.max(0,r-a),Math.max(0,g-a),Math.max(0,b-a)].map(v=>v.toString(16).padStart(2,'0')).join('')}