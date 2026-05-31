// room-gen.js — AI-Powered room background generation via Claude API
// Generates a detailed SVG/canvas room based on Claude's artistic description

(async function initRoomBackground() {
  const canvas = document.getElementById('room-canvas');
  canvas.style.display = 'block';
  
  // Initial canvas draw (fallback)
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Check cache
  const cached = localStorage.getItem('wb_ai_room_v2');
  if (cached) {
    try {
      applyAIRoom(JSON.parse(cached), canvas);
      return;
    } catch(e) {}
  }

  // Ask Claude to generate detailed room parameters
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a lofi room scene designer. Generate a JSON object describing the color parameters for a cozy lofi hip-hop style room scene at night (like the famous lofi girl streams). The room has:
- A window showing a night city
- A warm desk lamp  
- Books, plants, notebook on desk
- Warm amber/orange lamp light vs cool blue moonlight

Return ONLY a valid JSON object with these exact fields (no markdown, no explanation):
{
  "wallColor1": "#hex",
  "wallColor2": "#hex", 
  "deskColor1": "#hex",
  "deskColor2": "#hex",
  "lampColor": "#hex",
  "skyColor1": "#hex",
  "skyColor2": "#hex",
  "cityColor1": "#hex",
  "cityColor2": "#hex",
  "cityColor3": "#hex",
  "accentColor": "#hex",
  "lampGlow": "#hex",
  "bookColors": ["#hex","#hex","#hex"],
  "plantColor": "#hex",
  "mood": "warm_amber"
}`
        }]
      })
    });
    
    const data = await res.json();
    const text = data.content?.map(i => i.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    
    try {
      const params = JSON.parse(clean);
      localStorage.setItem('wb_ai_room_v2', JSON.stringify(params));
      applyAIRoom(params, canvas);
    } catch(e) {
      // Use defaults
      applyAIRoom(defaultRoomParams(), canvas);
    }
    
  } catch(e) {
    applyAIRoom(defaultRoomParams(), canvas);
  }
})();

function defaultRoomParams() {
  return {
    wallColor1: "#2a1206",
    wallColor2: "#1a0c04",
    deskColor1: "#c87838",
    deskColor2: "#884818",
    lampColor: "#c03818",
    skyColor1: "#06091a",
    skyColor2: "#0c1228",
    cityColor1: "#131528",
    cityColor2: "#1e1210",
    cityColor3: "#160e08",
    accentColor: "#d4aa50",
    lampGlow: "#ff9a3c",
    bookColors: ["#c8601a", "#204878", "#284820"],
    plantColor: "#3e7828",
    mood: "warm_amber"
  };
}

function applyAIRoom(params, canvas) {
  // Override draw.js color scheme with AI-generated params
  window._roomParams = params;
  // Force a redraw with new params
  if (typeof drawRoom === 'function') {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawRoomEnhanced(canvas, APP ? APP.lampOn : true, APP ? APP.photos : [], APP ? APP.fi : -1, params);
  }
}

// Enhanced room draw that uses AI color params
function drawRoomEnhanced(canvas, lampOn, photos, frameIdx, params) {
  if (!params) params = defaultRoomParams();
  // Use existing drawRoom but patch colors
  drawRoom(canvas, lampOn, photos, frameIdx);
  
  // Apply AI color tinting overlay
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  
  // Subtle warm/cool color grade overlay
  if (params.mood === 'warm_amber') {
    ctx.save();
    const tint = ctx.createRadialGradient(W*.34, H*.5, 0, W*.34, H*.5, W*.6);
    tint.addColorStop(0, 'rgba(255,140,40,0.04)');
    tint.addColorStop(0.5, 'rgba(255,120,30,0.02)');
    tint.addColorStop(1, 'rgba(0,20,60,0.06)');
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

// Also override scheduleRoom to use enhanced version after AI loads
const _origSchedule = window.scheduleRoom;
window.scheduleRoom = function() {
  roomDirty = true;
};

// Patch the main loop to use enhanced draw when params available
const _origDrawRoom = window.drawRoom;