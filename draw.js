// draw.js — only overlay panel renderers needed for item popups

function drawPictureFrame(canvas, photos, frameIdx) {
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  c.clearRect(0,0,W,H);
  const img = new Image();
  img.onload = () => {
    c.clearRect(0,0,W,H);
    c.drawImage(img,0,0,W,H);
    if (frameIdx >= 0 && photos && photos[frameIdx]) {
      const ph = new Image();
      ph.onload = () => {
        c.save();
        const px=W*.185, py=H*.18, pw=W*.63, ph2=H*.56;
        c.beginPath(); c.rect(px,py,pw,ph2); c.clip();
        const ir=ph.width/ph.height, fr=pw/ph2;
        let sx=0,sy=0,sw=ph.width,sh=ph.height;
        if(ir>fr){sw=ph.height*fr;sx=(ph.width-sw)/2;}
        else     {sh=ph.width/fr; sy=(ph.height-sh)/2;}
        c.drawImage(ph,sx,sy,sw,sh,px,py,pw,ph2);
        c.restore();
      };
      ph.src = photos[frameIdx];
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
    if (playing) {
      drawAnimatedReels(c, W, H, reelAngle);
      const ledX=W*.5, ledY=H*.83;
      const lG=c.createRadialGradient(ledX,ledY,0,ledX,ledY,W*.028);
      lG.addColorStop(0,'rgba(120,200,255,0.92)');
      lG.addColorStop(0.5,'rgba(80,160,255,0.45)');
      lG.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=lG; c.beginPath(); c.arc(ledX,ledY,W*.028,0,Math.PI*2); c.fill();
    }
  };
  img.src = getWalkmanSVG();
}

function drawAnimatedReels(c, W, H, angle) {
  const r1x=W*.285, ry=H*.38, r2x=W*.715;
  [r1x,r2x].forEach((rx,ri)=>{
    c.save(); c.translate(rx,ry); c.rotate(angle*(ri===0?1:1.35));
    c.strokeStyle='rgba(80,155,225,0.6)'; c.lineWidth=1.8; c.lineCap='round';
    for(let sp=0;sp<3;sp++){
      c.rotate(Math.PI*2/3);
      c.beginPath(); c.moveTo(0,0); c.lineTo(0,W*.11*.42); c.stroke();
    }
    c.restore();
  });
}

function getFrameSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190" width="200" height="190">
  <defs>
    <linearGradient id="ftop" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f0c840"/><stop offset="22%" stop-color="#8a6010"/>
      <stop offset="50%" stop-color="#d8aa28"/><stop offset="78%" stop-color="#8a6010"/>
      <stop offset="100%" stop-color="#f0c840"/>
    </linearGradient>
    <linearGradient id="fleft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f5ce48"/><stop offset="55%" stop-color="#b88820"/><stop offset="100%" stop-color="#8a6010"/>
    </linearGradient>
    <linearGradient id="fright" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7a5008"/><stop offset="45%" stop-color="#aa7818"/><stop offset="100%" stop-color="#d4a828"/>
    </linearGradient>
    <linearGradient id="fbot" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7a5008"/><stop offset="55%" stop-color="#c08818"/><stop offset="100%" stop-color="#e8b828"/>
    </linearGradient>
    <linearGradient id="fdeep" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5a3808"/><stop offset="100%" stop-color="#3a2004"/>
    </linearGradient>
    <radialGradient id="fcorn" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f8d030"/><stop offset="50%" stop-color="#c89020"/><stop offset="100%" stop-color="#8a5c08"/>
    </radialGradient>
    <filter id="fsh"><feDropShadow dx="2" dy="12" stdDeviation="10" flood-color="rgba(0,0,0,0.68)"/></filter>
    <filter id="inn"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.6)"/></filter>
    <pattern id="grain" x="0" y="0" width="4" height="60" patternUnits="userSpaceOnUse">
      <line x1="1.2" y1="0" x2="1.2" y2="60" stroke="rgba(160,110,10,0.07)" stroke-width="0.7"/>
      <line x1="3" y1="0" x2="3" y2="60" stroke="rgba(100,65,5,0.04)" stroke-width="0.6"/>
    </pattern>
  </defs>
  <rect x="14" y="18" width="180" height="172" rx="4" fill="rgba(0,0,0,0.55)" filter="url(#fsh)"/>
  <polygon points="8,8 192,8 186,15 14,15" fill="url(#fdeep)"/>
  <polygon points="8,182 192,182 186,175 14,175" fill="#4a2e04"/>
  <polygon points="8,8 8,182 15,175 15,15" fill="#7a5808"/>
  <polygon points="192,8 192,182 185,175 185,15" fill="#3a2004"/>
  <polygon points="8,8 192,8 174,28 26,28" fill="url(#ftop)"/>
  <polygon points="8,182 192,182 174,162 26,162" fill="url(#fbot)"/>
  <polygon points="8,8 8,182 28,162 28,28" fill="url(#fleft)"/>
  <polygon points="192,8 192,182 172,162 172,28" fill="url(#fright)"/>
  <rect x="8" y="8" width="184" height="174" rx="4" fill="url(#grain)" opacity="0.55"/>
  <rect x="8" y="8" width="184" height="174" rx="4" fill="none" stroke="rgba(255,220,100,0.16)" stroke-width="2"/>
  <rect x="28" y="28" width="144" height="134" fill="#e8d8b0" filter="url(#inn)"/>
  <rect x="30" y="30" width="140" height="130" fill="#dfd0a0"/>
  <rect x="30" y="30" width="140" height="130" fill="none" stroke="rgba(0,0,0,0.13)" stroke-width="2.5"/>
  <rect x="40" y="40" width="120" height="108" fill="#140e08" rx="1"/>
  <circle cx="8"   cy="8"   r="11" fill="url(#fcorn)"/><circle cx="192" cy="8"   r="11" fill="url(#fcorn)"/>
  <circle cx="8"   cy="182" r="11" fill="url(#fcorn)"/><circle cx="192" cy="182" r="11" fill="url(#fcorn)"/>
  <circle cx="8"   cy="8"   r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <circle cx="192" cy="8"   r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <circle cx="8"   cy="182" r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <circle cx="192" cy="182" r="7" fill="none" stroke="rgba(255,240,130,0.35)" stroke-width="1.2"/>
  <polygon points="8,8 192,8 174,28 26,28" fill="rgba(255,255,255,0.11)"/>
  <polygon points="8,8 90,8 78,28 26,28" fill="rgba(255,255,255,0.07)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getWalkmanSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 175" width="230" height="175">
  <defs>
    <linearGradient id="wbody" x1="0%" y1="0%" x2="8%" y2="100%">
      <stop offset="0%" stop-color="#2e3e60"/><stop offset="28%" stop-color="#1e2e50"/>
      <stop offset="62%" stop-color="#142040"/><stop offset="100%" stop-color="#0e1835"/>
    </linearGradient>
    <linearGradient id="wstripe" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/><stop offset="8%" stop-color="#3a6aaa"/>
      <stop offset="50%" stop-color="#6098cc"/><stop offset="92%" stop-color="#3a6aaa"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </linearGradient>
    <linearGradient id="wlabel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8b455"/><stop offset="45%" stop-color="#eaca68"/><stop offset="100%" stop-color="#c8a245"/>
    </linearGradient>
    <radialGradient id="wreel" cx="30%" cy="28%" r="72%">
      <stop offset="0%" stop-color="#1e3868"/><stop offset="58%" stop-color="#0c1c38"/><stop offset="100%" stop-color="#040a1c"/>
    </radialGradient>
    <radialGradient id="wrhub" cx="34%" cy="30%" r="66%">
      <stop offset="0%" stop-color="#3a7098"/><stop offset="100%" stop-color="#183050"/>
    </radialGradient>
    <linearGradient id="wbotface" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0e18"/><stop offset="100%" stop-color="#070a10"/>
    </linearGradient>
    <filter id="wsh"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="rgba(0,0,0,0.75)"/></filter>
    <filter id="winsh"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgba(0,0,0,0.8)"/></filter>
    <pattern id="vrgr" x="0" y="0" width="12" height="4" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="12" height="2.5" fill="rgba(70,120,220,0.28)"/>
    </pattern>
  </defs>
  <rect x="10" y="25" width="188" height="135" rx="10" fill="rgba(0,0,0,0.6)" filter="url(#wsh)"/>
  <rect x="8" y="148" width="188" height="7" rx="4" fill="url(#wbotface)"/>
  <polygon points="196,16 204,22 204,149 196,148" fill="#08100c"/>
  <rect x="8" y="16" width="188" height="133" rx="10" fill="url(#wbody)"/>
  <rect x="8" y="16" width="188" height="5" rx="4" fill="rgba(255,255,255,0.08)"/>
  <rect x="8" y="16" width="188" height="133" rx="10" fill="none" stroke="rgba(255,255,255,0.065)" stroke-width="1.5"/>
  <rect x="18" y="28" width="164" height="78" rx="6" fill="#01030a" stroke="#1c3258" stroke-width="2.5" filter="url(#winsh)"/>
  <rect x="20" y="30" width="160" height="74" rx="5" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <rect x="20" y="30" width="105" height="38" rx="4" fill="rgba(74,144,217,0.07)"/>
  <circle cx="60"  cy="67" r="27" fill="url(#wreel)" stroke="#1c3258" stroke-width="2"/>
  <circle cx="60"  cy="67" r="23" fill="#0c1a2e" stroke="#1a3050" stroke-width="1.5"/>
  <circle cx="60"  cy="67" r="25" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2.5" stroke-dasharray="3,9"/>
  <circle cx="60"  cy="67" r="14" fill="#18203a" stroke="#1c3050" stroke-width="1.2"/>
  <circle cx="60"  cy="67" r="7.5" fill="url(#wrhub)" stroke="#2a5080" stroke-width="1.5"/>
  <ellipse cx="58" cy="65" rx="3" ry="2" fill="rgba(100,180,255,0.2)"/>
  <line x1="60" y1="67" x2="60" y2="53" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="60" y1="67" x2="72" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="60" y1="67" x2="48" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="144" cy="67" r="27" fill="url(#wreel)" stroke="#1c3258" stroke-width="2"/>
  <circle cx="144" cy="67" r="23" fill="#0c1a2e" stroke="#1a3050" stroke-width="1.5"/>
  <circle cx="144" cy="67" r="25" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2.5" stroke-dasharray="3,9"/>
  <circle cx="144" cy="67" r="14" fill="#18203a" stroke="#1c3050" stroke-width="1.2"/>
  <circle cx="144" cy="67" r="7.5" fill="url(#wrhub)" stroke="#2a5080" stroke-width="1.5"/>
  <ellipse cx="142" cy="65" rx="3" ry="2" fill="rgba(100,180,255,0.2)"/>
  <line x1="144" y1="67" x2="144" y2="53" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="144" y1="67" x2="156" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="144" y1="67" x2="132" y2="74" stroke="rgba(74,144,217,0.5)" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M86 91 Q102 97 118 91" stroke="rgba(18,38,58,0.88)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <rect x="86" y="48" width="32" height="28" rx="3.5" fill="url(#wlabel)"/>
  <rect x="88" y="50" width="28" height="24" rx="2.5" fill="none" stroke="rgba(120,80,5,0.25)" stroke-width="1"/>
  <line x1="89" y1="59" x2="116" y2="59" stroke="rgba(120,80,5,0.28)" stroke-width="0.9"/>
  <line x1="89" y1="66" x2="116" y2="66" stroke="rgba(120,80,5,0.22)" stroke-width="0.8"/>
  <text x="102" y="57.5" text-anchor="middle" font-size="5.5" font-family="Special Elite,monospace" fill="rgba(26,14,4,0.8)" font-weight="bold">WABI</text>
  <text x="102" y="64"   text-anchor="middle" font-size="4.5" font-family="Special Elite,monospace" fill="rgba(26,14,4,0.68)">mix tape</text>
  <text x="102" y="71"   text-anchor="middle" font-size="4"   font-family="Special Elite,monospace" fill="rgba(26,14,4,0.55)">Side A</text>
  <rect x="8"  y="110" width="188" height="5.5" fill="url(#wstripe)"/>
  <rect x="16" y="117" width="170" height="26" rx="4" fill="#0a1428" stroke="#1c3258" stroke-width="1.5"/>
  <rect x="16" y="117" width="170" height="4"  rx="3" fill="rgba(255,255,255,0.03)"/>
  <circle cx="42"  cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <text x="42"  y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">◀◀</text>
  <circle cx="68"  cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <text x="68"  y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">◀</text>
  <circle cx="102" cy="130" r="9"   fill="#2878c8" stroke="#4a88d8" stroke-width="1.5"/>
  <circle cx="102" cy="130" r="9"   fill="rgba(0,0,0,0.2)"/>
  <circle cx="100" cy="128" r="3.5" fill="rgba(160,220,255,0.52)"/>
  <text x="102" y="134" text-anchor="middle" font-size="8" fill="rgba(200,230,255,0.8)">▶</text>
  <circle cx="136" cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <text x="136" y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">▶</text>
  <circle cx="162" cy="130" r="8.5" fill="#1a2e58" stroke="#1c3258" stroke-width="1.5"/>
  <text x="162" y="133" text-anchor="middle" font-size="8" fill="rgba(74,140,217,0.7)">▶▶</text>
  <rect x="200" y="36"  width="16" height="56" rx="3" fill="#182848" stroke="#2848a8" stroke-width="1.2"/>
  <rect x="202" y="40"  width="12" height="48" fill="url(#vrgr)"/>
  <rect x="204" y="38"  width="8"  height="4"  rx="2" fill="rgba(100,160,255,0.15)"/>
  <circle cx="28" cy="158" r="6"   fill="#010308" stroke="#1c3258" stroke-width="1.8"/>
  <circle cx="28" cy="158" r="2.8" fill="#010308"/>
  <rect x="204" y="96"  width="14" height="42" rx="3" fill="#182848" stroke="#2848a8" stroke-width="1.2"/>
  <ellipse cx="70" cy="50" rx="78" ry="34" fill="rgba(255,255,255,0.04)" transform="rotate(-10,70,50)"/>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}