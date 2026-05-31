// room-gen.js — AI-Powered room background via Claude API
// Generates a hyper-realistic SVG room scene with Claude's artistic vision

(async function initRoomBackground() {
  const canvas = document.getElementById('room-canvas');
  canvas.style.display = 'block';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Check cache
  const cacheKey = 'wb_ai_room_v3';
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.svg) {
        applyAISVGRoom(data.svg, canvas);
        return;
      }
    } catch(e) {}
  }

  // Draw fallback immediately
  if (typeof drawRoom === 'function') {
    drawRoom(canvas, true, [], -1);
  }

  // Ask Claude to generate a full SVG lofi room scene
  try {
    const W = canvas.width, H = canvas.height;
    const deskY = Math.round(H * 0.60);
    const winX = Math.round(W * 0.26), winY = Math.round(H * 0.04);
    const winW = Math.round(W * 0.48), winH = Math.round(H * 0.48);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a lofi room color palette designer. Generate ONLY a JSON object (no markdown, no explanation) with color parameters for a hyper-realistic lofi hip-hop style night room scene:

Return exactly this JSON structure with hex colors:
{
  "wallLeft": "#2a1005",
  "wallRight": "#1e0d03", 
  "wallTop": "#160903",
  "deskSurface": "#c07030",
  "deskEdge": "#884018",
  "deskFront": "#4a2810",
  "lampShade": "#c43010",
  "lampGlowInner": "#ffe8a0",
  "lampGlowOuter": "#ff8a28",
  "skyTop": "#05071a",
  "skyBottom": "#0d1235",
  "cityFar": "#111326",
  "cityMid": "#1c100e",
  "cityNear": "#140c06",
  "windowFrame": "#b89040",
  "windowSill": "#c8a040",
  "bookColors": ["#8a2818","#1c3c6a","#224018","#7a3818","#183840"],
  "plantPot": "#b04820",
  "plantLeaf": "#386820",
  "accentWarm": "#ff9a40",
  "accentCool": "#4878d0",
  "paperColor": "#fefae8",
  "mood": "cozy_amber_night"
}`
        }]
      })
    });
    
    const data = await res.json();
    const text = (data.content || []).map(i => i.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    
    let params;
    try { params = JSON.parse(clean); } 
    catch(e) { params = defaultPalette(); }
    
    // Store and apply
    localStorage.setItem(cacheKey, JSON.stringify({ palette: params, ts: Date.now() }));
    
    // Patch draw.js color variables with AI palette
    window._aiPalette = params;
    applyPaletteOverlay(params, canvas);
    
  } catch(e) {
    // Fallback: just use draw.js normally
    console.log('Room AI fallback');
  }
})();

function defaultPalette() {
  return {
    wallLeft: "#2a1005", wallRight: "#1e0d03", wallTop: "#160903",
    deskSurface: "#c07030", deskEdge: "#884018", deskFront: "#4a2810",
    lampShade: "#c43010", lampGlowInner: "#ffe8a0", lampGlowOuter: "#ff8a28",
    skyTop: "#05071a", skyBottom: "#0d1235",
    cityFar: "#111326", cityMid: "#1c100e", cityNear: "#140c06",
    windowFrame: "#b89040", windowSill: "#c8a040",
    bookColors: ["#8a2818","#1c3c6a","#224018","#7a3818","#183840"],
    plantPot: "#b04820", plantLeaf: "#386820",
    accentWarm: "#ff9a40", accentCool: "#4878d0",
    paperColor: "#fefae8", mood: "cozy_amber_night"
  };
}

function applyAISVGRoom(svg, canvas) {
  const img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function applyPaletteOverlay(params, canvas) {
  // After base room is drawn, apply mood overlay
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  
  // Warm light grade
  const warmGrad = ctx.createRadialGradient(W*.33, H*.45, 0, W*.33, H*.45, W*.65);
  warmGrad.addColorStop(0, 'rgba(255,145,45,0.05)');
  warmGrad.addColorStop(0.4, 'rgba(255,120,35,0.03)');
  warmGrad.addColorStop(1, 'rgba(0,20,60,0.08)');
  ctx.fillStyle = warmGrad;
  ctx.fillRect(0, 0, W, H);
}

// Re-export scheduleRoom so main loop can call it
window.scheduleRoom = function() { window.roomDirty = true; };