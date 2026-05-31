// app.js
const APP = {
  letters:   JSON.parse(localStorage.getItem('wb_l') || '[]'),
  photos:    JSON.parse(localStorage.getItem('wb_p') || '[]'),
  fi:        parseInt(localStorage.getItem('wb_f') || '-1'),
  pl:        JSON.parse(localStorage.getItem('wb_pl') || '[]'),
  pn: 0, ti: 0, playing: false, ei: null, oli: null, ci: -1, cv: null,
  lampOn: true,
  reelAngle: 0,
};
const AUD = document.getElementById('aud');
function saveApp(){
  localStorage.setItem('wb_l', JSON.stringify(APP.letters));
  localStorage.setItem('wb_p', JSON.stringify(APP.photos));
  localStorage.setItem('wb_f', APP.fi);
  localStorage.setItem('wb_pl', JSON.stringify(APP.pl));
}

const GIFS=['https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif','https://media.giphy.com/media/xT77XWum9yH7zNkFW0/giphy.gif','https://media.giphy.com/media/VGG8UY1nEl66Y/giphy.gif','https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif'];

let roomDirty = true;
let itemsDone  = false;

window.onload = () => {
  document.getElementById('g-gif').src = GIFS[Math.floor(Math.random()*GIFS.length)];
  updBadge();
  initAudio();
  initRoom();
  startLoop();
};

function enterRoom(){
  document.getElementById('greeting').classList.add('out');
  setTimeout(()=>{
    document.getElementById('greeting').style.display='none';
    document.getElementById('room').classList.add('show');
  }, 2000);
}

// ── ROOM ───────────────────────────────────────────────────────────────────
function initRoom(){
  const canvas = document.getElementById('room-canvas');
  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    roomDirty = true;
    itemsDone = false; // redraw items on resize
  };
  window.addEventListener('resize', resize);
  resize();
}

function scheduleRoom(){ roomDirty = true; }

// ── MAIN LOOP ──────────────────────────────────────────────────────────────
function startLoop(){
  let lastT = 0;
  (function frame(ts){
    const dt = Math.min((ts - lastT)/1000, 0.1);
    lastT = ts;

    if(APP.playing) APP.reelAngle += dt * 2.2;

    if(roomDirty){
      const canvas = document.getElementById('room-canvas');
      if(canvas.width !== window.innerWidth){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
      drawRoom(canvas, APP.lampOn, APP.photos, APP.fi);
      roomDirty = false;
    }

    if(!itemsDone){
      renderAllItems();
      itemsDone = true;
    }

    // walkman reel animation — keep redrawing when playing
    if(APP.playing){
      const wkc = document.getElementById('cv-walkman');
      if(wkc) drawWalkman(wkc, true, APP.reelAngle);
    }

    requestAnimationFrame(frame);
  })(0);
}

function renderAllItems(){
  const evc = document.getElementById('cv-envelope');
  const cmc = document.getElementById('cv-camera');
  const frc = document.getElementById('cv-frame');
  const wkc = document.getElementById('cv-walkman');
  if(evc) drawEnvelope(evc);
  if(cmc) drawCamera(cmc);
  if(frc) drawPictureFrame(frc, APP.photos, APP.fi);
  if(wkc) drawWalkman(wkc, APP.playing, APP.reelAngle);
}

// ── LAMP ───────────────────────────────────────────────────────────────────
function toggleLamp(){
  APP.lampOn = !APP.lampOn;
  document.body.classList.toggle('lamp-on', APP.lampOn);
  document.body.classList.toggle('lamp-off', !APP.lampOn);
  scheduleRoom();
}

// ── ITEM ROUTING ──────────────────────────────────────────────────────────
function openItem(type){
  switch(type){
    case 'envelope': openEnvOv(); setTimeout(renderOvEnvCanvas, 60); break;
    case 'camera':   openCamOv(); break;
    case 'frame':    openFrameOv(); break;
    case 'walkman':  openWkOv(); break;
  }
}

// ── PEN ────────────────────────────────────────────────────────────────────
function pencilClick(e){
  e.stopPropagation();
  APP.pn++;
  document.getElementById('pen-n').textContent = APP.pn;
  if(APP.pn >= 10){
    APP.pn=0; APP.ei=null;
    document.getElementById('pen-n').textContent='0';
    openOv(buildEdHTML());
    showT('Time to write something sweet');
  } else {
    showT(`${10-APP.pn} more click${10-APP.pn!==1?'s':''} to unlock`);
  }
}
function updBadge(){ document.getElementById('env-badge').textContent=APP.letters.length; }

// ── AUDIO ──────────────────────────────────────────────────────────────────
function initAudio(){
  AUD.addEventListener('timeupdate', updProg);
  AUD.addEventListener('ended', nextT);
  if(APP.pl.length) loadT(0, false);
}
function togglePlay(){
  if(!APP.pl.length){ showT('Add songs first'); return; }
  if(APP.playing){ AUD.pause(); APP.playing=false; }
  else { if(!AUD.src||AUD.src===location.href) loadT(APP.ti,false); AUD.play().catch(()=>{}); APP.playing=true; }
  const b=document.getElementById('wpb');
  if(b){ b.innerHTML=APP.playing?'&#10074;&#10074;':'&#9654;'; b.className=`wk-btn lg${APP.playing?' playing':''}`; }
}
function loadT(i,play){
  if(!APP.pl.length)return;
  i=Math.max(0,Math.min(i,APP.pl.length-1));
  APP.ti=i;
  const t=APP.pl[i];
  if(t&&t.src){AUD.src=t.src;if(play){AUD.play().catch(()=>{});APP.playing=true;}}
  const n=document.getElementById('wn');if(n)n.textContent=t?t.name:'';
  rPL();
  if(play){const b=document.getElementById('wpb');if(b){b.innerHTML='&#10074;&#10074;';b.className='wk-btn lg playing';}}
}
function nextT(){if(!APP.pl.length)return;loadT((APP.ti+1)%APP.pl.length,APP.playing)}
function prevT(){if(AUD.currentTime>3){AUD.currentTime=0;return}if(!APP.pl.length)return;loadT((APP.ti-1+APP.pl.length)%APP.pl.length,APP.playing)}
function seekR(s){AUD.currentTime=Math.max(0,Math.min(AUD.duration||0,AUD.currentTime+s))}
function seekAud(e){const b=document.getElementById('prog');if(!b||!AUD.duration)return;const r=b.getBoundingClientRect();AUD.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*AUD.duration}
function updProg(){
  const pct=AUD.duration?(AUD.currentTime/AUD.duration*100):0;
  const f=document.getElementById('pf');const d=document.getElementById('pd');
  const c=document.getElementById('wc');const dur=document.getElementById('wd');
  if(f)f.style.width=pct+'%';if(d)d.style.left=pct+'%';
  if(c)c.textContent=fmtT(AUD.currentTime);if(dur&&AUD.duration)dur.textContent=fmtT(AUD.duration);
}
function rPL(){document.querySelectorAll('.pl-item').forEach((el,i)=>{el.className=`pl-item${i===APP.ti?' cur':''}`;});}

// ── FRAME REFRESH on photo change ──────────────────────────────────────────
function refreshFrame(){
  const frc = document.getElementById('cv-frame');
  if(frc){ drawPictureFrame(frc, APP.photos, APP.fi); }
  scheduleRoom();
}

// ── TOAST ──────────────────────────────────────────────────────────────────
let toastT;
function showT(m){
  const t=document.getElementById('toast');t.textContent=m;
  t.classList.add('show');clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove('show'),2700);
}