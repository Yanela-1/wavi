// overlay.js — panel logic for envelope, camera, frame, walkman

function openOv(html) {
  document.getElementById('ov-wrap').innerHTML = html;
  document.getElementById('overlay').classList.add('on');
}
function closeOv() {
  document.getElementById('overlay').classList.remove('on');
  APP.cv = null;
  setTimeout(() => document.getElementById('ov-wrap').innerHTML = '', 650);
}
function ovBgClick(e) {
  if (e.target.id === 'overlay' || e.target.id === 'ov-wrap') closeOv();
}

// ── ENVELOPE ──────────────────────────────────────────────────
function openEnvOv() {
  APP.cv = 'env'; APP.oli = null;
  openOv(buildEnvHTML());
}

function buildEnvHTML() {
  const ls = APP.letters;
  return `<div class="ov-panel">
  <button class="ov-close" onclick="closeOv()">✕ &nbsp;close</button>
  <div class="lp-panel">
    <div class="lp-title">Letters to Wabi</div>
    ${ls.length === 0 ? `<p class="lp-empty">No letters yet — click the pencil to write one.</p>` : ''}
    <div class="l-scroll">
      ${ls.map((l, i) => `<div class="l-row ${APP.oli === i ? 'sel' : ''}" onclick="viewL(${i})">
        <div class="l-num">#${i + 1}</div>
        <div class="l-meta">
          <div class="l-prev">${X(l.body.substring(0, 60))}${l.body.length > 60 ? '…' : ''}</div>
          <div class="l-date">${X(l.date)}</div>
        </div>
        <div class="l-btns">
          <button class="xbtn" onclick="editL(event,${i})">edit</button>
          <button class="xbtn del" onclick="delL(event,${i})">del</button>
        </div>
      </div>`).join('')}
    </div>
    ${APP.oli !== null && ls[APP.oli] ? `<div class="open-letter">
      <div class="l-date-header">${X(ls[APP.oli].date)}</div>
      <div class="l-body-text">${X(ls[APP.oli].body)}</div>
    </div>` : ''}
  </div>
</div>`;
}

function viewL(i) {
  APP.oli = APP.oli === i ? null : i;
  openEnvOv();
}
function editL(e, i) {
  e.stopPropagation(); APP.ei = i; openOv(buildEdHTML(APP.letters[i]));
}
function delL(e, i) {
  e.stopPropagation();
  if (!confirm('Delete this letter?')) return;
  APP.letters.splice(i, 1); APP.oli = null;
  saveApp(); updBadge(); openEnvOv(); showT('Letter deleted.');
}

// ── LETTER EDITOR ─────────────────────────────────────────────
function buildEdHTML(l) {
  const ed = l !== undefined;
  return `<div class="ov-panel">
  <button class="ov-close" onclick="${ed ? 'openEnvOv()' : 'closeOv()'}">✕ &nbsp;${ed ? 'back' : 'close'}</button>
  <div class="ed-panel">
    <div class="ed-title">${ed ? 'Edit letter' : 'Write a letter'}</div>
    <label class="ed-label">Date</label>
    <input class="ed-input" id="ld" value="${ed ? X(l.date) : new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}">
    <label class="ed-label">Your letter</label>
    <textarea class="ed-ta" id="lb" placeholder="Dear Wabi,...">${ed ? X(l.body) : ''}</textarea>
    <div class="ed-actions">
      <button class="btn-back" onclick="${ed ? 'openEnvOv()' : 'closeOv()'}">${ed ? 'back' : 'cancel'}</button>
      <button class="btn-save" onclick="saveL()">save letter</button>
    </div>
  </div>
</div>`;
}

function saveL() {
  const d = document.getElementById('ld').value.trim();
  const b = document.getElementById('lb').value.trim();
  if (!b) { showT('Write something first'); return; }
  if (APP.ei !== null) { APP.letters[APP.ei] = {date:d, body:b}; APP.ei = null; }
  else APP.letters.push({date:d, body:b});
  saveApp(); updBadge();
  APP.oli = APP.letters.length - 1;
  showT('Letter saved ♥');
  openEnvOv();
}

// ── CAMERA ────────────────────────────────────────────────────
function openCamOv() {
  APP.cv = 'cam';
  openOv(buildCamHTML());
  document.getElementById('photo-up').onchange = handlePh;
}

function buildCamHTML() {
  const ph = APP.photos, ci = APP.ci;
  return `<div class="ov-panel">
  <button class="ov-close" onclick="closeOv()" style="border-color:rgba(200,160,80,.3);color:#c8a050">✕ &nbsp;close</button>
  <div class="cam-panel">
    <div class="cam-hdr">
      <span class="cam-brand">WABI-CAM</span>
      <span style="color:rgba(200,160,80,.35);font-family:'Special Elite',monospace;font-size:.68rem">35mm</span>
      <span class="cam-count">${String(ph.length).padStart(2,'0')}</span>
    </div>
    <div class="vf-wrap">
      <div class="vf-grid"></div><div class="vf-corners"></div>
      ${ci >= 0 && ph[ci] ? `<img class="vf-img" src="${ph[ci]}" alt="">` : `<div class="vf-empty">no photo loaded</div>`}
    </div>
    <div class="film-strip">
      <div class="film-cell film-add" onclick="document.getElementById('photo-up').click()">+</div>
      ${ph.map((p,i) => `<div class="film-cell ${i===ci?'on':''}" onclick="selPh(${i})"><img src="${p}" alt=""></div>`).join('')}
    </div>
  </div>
</div>`;
}

function selPh(i) {
  APP.ci = i;
  document.getElementById('ov-wrap').innerHTML = buildCamHTML();
  document.getElementById('photo-up').onchange = handlePh;
}
function handlePh(e) {
  const files = Array.from(e.target.files); let done = 0;
  files.forEach(f => {
    const r = new FileReader();
    r.onload = ev => {
      APP.photos.push(ev.target.result); done++;
      if (done === files.length) {
        saveApp(); APP.ci = APP.photos.length - 1;
        document.getElementById('ov-wrap').innerHTML = buildCamHTML();
        document.getElementById('photo-up').onchange = handlePh;
        showT(`${files.length} photo(s) added`);
      }
    };
    r.readAsDataURL(f);
  });
  e.target.value = '';
}

// ── FRAME ─────────────────────────────────────────────────────
function openFrameOv() {
  APP.cv = 'frame';
  openOv(buildFrameHTML());
  setTimeout(() => {
    const c = document.getElementById('ov-frame-canvas');
    if (c) drawPictureFrame(c, APP.photos, APP.fi);
  }, 50);
}

function buildFrameHTML() {
  const ph = APP.photos, fi = APP.fi;
  return `<div class="ov-panel">
  <button class="ov-close" onclick="closeOv()">✕ &nbsp;close</button>
  <div class="frame-panel">
    <div class="pant" style="color:#e8904a">Picture Frame</div>
    <div class="frame-big-wrap"><canvas id="ov-frame-canvas" width="240" height="228"></canvas></div>
    <div class="frame-hint">${ph.length === 0 ? 'add photos with the camera first' : 'tap a photo to display it'}</div>
    <div class="frame-grid">
      ${ph.map((p,i) => `<div class="frame-thumb ${i===fi?'sel':''}" onclick="setFrm(${i})"><img src="${p}" alt=""></div>`).join('')}
    </div>
  </div>
</div>`;
}

function setFrm(i) {
  APP.fi = APP.fi === i ? -1 : i;
  saveApp(); openFrameOv();
}

// ── WALKMAN ───────────────────────────────────────────────────
function openWkOv() {
  APP.cv = 'walkman';
  openOv(buildWkHTML());
  setTimeout(() => {
    const c = document.getElementById('ov-wk-canvas');
    if (c) drawWalkman(c, APP.playing, APP.reelAngle);
  }, 50);
  document.getElementById('song-up').onchange = handleSongs;
}

function buildWkHTML() {
  const pl = APP.pl, ci = APP.ti, t = pl[ci];
  const name = t ? t.name : 'no track loaded';
  const pct  = AUD.duration ? (AUD.currentTime / AUD.duration * 100) : 0;
  const vol  = Math.round((AUD.volume || 1) * 100);
  return `<div class="ov-panel">
  <button class="ov-close" onclick="closeOv()" style="border-color:rgba(72,136,216,.3);color:#4888d8">✕ &nbsp;close</button>
  <div class="wk-panel">
    <div class="wk-postit">Playlist<br>
      <a href="https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID" target="_blank">YouTube</a>
      <a href="https://open.spotify.com/playlist/YOUR_PLAYLIST_ID" target="_blank">Spotify</a>
    </div>
    <div class="pant" style="color:#4888d8">Walkman</div>
    <div class="wk-canvas-wrap"><canvas id="ov-wk-canvas" width="300" height="230"></canvas></div>
    <div class="trk-disp">
      <div class="trk-name" id="wn">${X(name)}</div>
      <div class="trk-time"><span id="wc">${fmtT(AUD.currentTime)}</span><span id="wd">${AUD.duration ? fmtT(AUD.duration) : '0:00'}</span></div>
    </div>
    <div class="prog-bar" id="prog" onclick="seekAud(event)">
      <div class="prog-fill" id="pf" style="width:${pct}%"></div>
      <div class="prog-dot"  id="pd" style="left:${pct}%"></div>
    </div>
    <div class="wk-ctrl">
      <button class="wk-btn" onclick="prevT()">&#9664;&#9664;</button>
      <button class="wk-btn" onclick="seekR(-10)">-10s</button>
      <button class="wk-btn lg ${APP.playing?'playing':''}" id="wpb" onclick="togglePlay()">${APP.playing?'&#10074;&#10074;':'&#9654;'}</button>
      <button class="wk-btn" onclick="seekR(10)">+10s</button>
      <button class="wk-btn" onclick="nextT()">&#9654;&#9654;</button>
    </div>
    <div class="vol-row">
      <span class="vol-lbl">vol</span>
      <input type="range" class="vol-sl" min="0" max="100" value="${vol}" oninput="AUD.volume=this.value/100">
    </div>
    <div class="pl-box">
      ${pl.length === 0
        ? '<p class="pl-empty">no songs yet</p>'
        : pl.map((tr,i) => `<div class="pl-item ${i===ci?'cur':''}" onclick="loadT(${i},true)">
            <span class="pl-num">${i+1}</span>
            <span class="pl-title">${X(tr.name)}</span>
            <span class="pl-dur">${tr.dur||''}</span>
            <span class="pl-del" onclick="rmSong(event,${i})">✕</span>
          </div>`).join('')}
    </div>
    <div class="add-row">
      <input type="text" id="surl" placeholder="audio URL (mp3, ogg...)">
      <button class="add-btn" onclick="addUrl()">+ url</button>
      <button class="add-btn" onclick="document.getElementById('song-up').click()">+ file</button>
    </div>
  </div>
</div>`;
}

function handleSongs(e) {
  Array.from(e.target.files).forEach(f => {
    const src = URL.createObjectURL(f);
    const name = f.name.replace(/\.[^/.]+$/, '');
    const tmp = new Audio(src);
    const push = dur => {
      APP.pl.push({name, src, dur}); saveApp();
      if (APP.cv === 'walkman') { document.getElementById('ov-wrap').innerHTML = buildWkHTML(); document.getElementById('song-up').onchange = handleSongs; setTimeout(() => { const c=document.getElementById('ov-wk-canvas'); if(c) drawWalkman(c, APP.playing, APP.reelAngle); }, 50); }
      if (APP.pl.length === 1) loadT(0, false);
      showT(`"${name}" added`);
    };
    tmp.onloadedmetadata = () => push(fmtT(tmp.duration));
    tmp.onerror = () => push('');
  });
  e.target.value = '';
}

function addUrl() {
  const inp = document.getElementById('surl');
  const url = (inp && inp.value.trim()) || '';
  if (!url) { showT('Enter a URL'); return; }
  const name = url.split('/').pop().split('?')[0].replace(/\.[^/.]+$/, '') || 'Track';
  const tmp = new Audio(url);
  const push = dur => {
    APP.pl.push({name, src:url, dur}); saveApp();
    if (inp) inp.value = '';
    if (APP.cv === 'walkman') { document.getElementById('ov-wrap').innerHTML = buildWkHTML(); document.getElementById('song-up').onchange = handleSongs; setTimeout(() => { const c=document.getElementById('ov-wk-canvas'); if(c) drawWalkman(c, APP.playing, APP.reelAngle); }, 50); }
    showT(`"${name}" added`);
  };
  tmp.onloadedmetadata = () => push(fmtT(tmp.duration));
  tmp.onerror = () => push('');
}

function rmSong(e, i) {
  e.stopPropagation();
  APP.pl.splice(i, 1); if (APP.ti >= APP.pl.length) APP.ti = 0;
  saveApp();
  if (APP.cv === 'walkman') { document.getElementById('ov-wrap').innerHTML = buildWkHTML(); document.getElementById('song-up').onchange = handleSongs; setTimeout(() => { const c=document.getElementById('ov-wk-canvas'); if(c) drawWalkman(c, APP.playing, APP.reelAngle); }, 50); }
  showT('Song removed');
}

// ── UTILS ─────────────────────────────────────────────────────
function X(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtT(s) {
  s = Math.floor(s || 0);
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
}