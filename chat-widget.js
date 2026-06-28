(function () {
  if (document.getElementById('makac-widget')) return; // already injected

  // ── CSS ──────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
    #makac-widget { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; align-items:flex-end; gap:12px; pointer-events:none; }
    #makac-panel {
      width:320px; height:440px; background:#fff;
      border:1.5px solid rgba(0,32,246,.2); border-radius:20px;
      box-shadow:0 20px 60px rgba(0,32,246,.2);
      display:flex; flex-direction:column; overflow:hidden; position:relative;
      transform:translateY(20px); opacity:0; pointer-events:none;
      transition:transform .28s cubic-bezier(.2,.8,.2,1), opacity .28s ease;
    }
    #makac-panel.open { transform:translateY(0); opacity:1; pointer-events:auto; }
    #makac-panel-header {
      background:#0020f6;
      padding:12px 14px; display:flex; align-items:center; gap:8px;
      border-bottom:none; flex-shrink:0;
    }
    .mw-avatar {
      width:38px; height:33px; flex-shrink:0;
      background:linear-gradient(160deg,rgba(255,255,255,.35) 0%,rgba(255,255,255,.15) 100%);
      border-radius:50% 50% 44% 44%;
      position:relative;
      box-shadow:0 4px 14px rgba(0,0,60,.3),inset 0 1px 0 rgba(255,255,255,.3);
      border:1.5px solid rgba(255,255,255,.4);
    }
    .mw-brow { position:absolute; width:8px; height:1.5px; background:rgba(190,190,255,.6); border-radius:2px; top:6px; transition:transform .22s ease; }
    .mw-brow.l { left:5px; } .mw-brow.r { right:5px; }
    .mw-eye { position:absolute; width:9px; height:9px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:inset 0 1px 2px rgba(0,0,0,.12); top:12px; }
    .mw-eye.l { left:5px; } .mw-eye.r { right:5px; }
    .mw-pupil { width:5px; height:5px; background:#16163c; border-radius:50%; transition:transform .09s ease; position:absolute; }
    .mw-lid { position:absolute; top:0; left:0; right:0; height:0; background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,.5)); transition:height .3s cubic-bezier(.4,0,.2,1); z-index:2; }
    .mw-cheek { position:absolute; width:7px; height:3px; border-radius:50%; background:rgba(255,100,150,.22); bottom:4px; }
    .mw-cheek.l { left:3px; } .mw-cheek.r { right:3px; }
    #makac-panel-info { flex:1; }
    #makac-panel-name { font-weight:700; font-size:.88rem; color:#fff; }
    #makac-panel-sub { display:flex; align-items:center; gap:4px; margin-top:1px; }
    #mw-dot { width:6px; height:6px; border-radius:50%; transition:background .4s, box-shadow .4s; }
    #mw-dot.joining { background:#fbbf24; box-shadow:0 0 5px rgba(251,191,36,.6); }
    #mw-dot.online  { background:#22c55e; box-shadow:0 0 5px rgba(34,197,94,.5); }
    #mw-status { font-size:.7rem; transition:color .4s; }
    #mw-status.joining { color:#fbbf24; } #mw-status.online { color:#22c55e; }
    #mw-new-chat {
      display:flex; align-items:center; gap:3px; background:rgba(255,255,255,.15);
      border:1px solid rgba(255,255,255,.3); border-radius:6px; color:#fff;
      cursor:pointer; font-size:.68rem; font-weight:600; padding:3px 7px;
      transition:background .15s,color .15s; font-family:inherit;
    }
    #mw-new-chat:hover { background:rgba(255,255,255,.25); color:#fff; }
    #mw-close { background:none; border:none; color:rgba(255,255,255,.6); cursor:pointer; font-size:1.1rem; padding:2px 4px; transition:color .15s; }
    #mw-close:hover { color:#fff; }
    #makac-msgs { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:8px; scrollbar-width:thin; scrollbar-color:rgba(0,32,246,.2) transparent; }
    .mw-msg { max-width:82%; padding:9px 12px; border-radius:13px; font-size:.84rem; line-height:1.45; word-break:break-word; }
    .mw-msg.bot   { background:#f0f2ff; color:#0a0a2e; border-bottom-left-radius:3px; align-self:flex-start; }
    .mw-msg.human { background:#f0f2ff; color:#0a0a2e; border-bottom-left-radius:3px; align-self:flex-start; }
    .mw-msg.user  { background:#0020f6; color:#fff; border-bottom-right-radius:3px; align-self:flex-end; }
    .mw-sender { font-size:.68rem; color:#9090b0; margin-bottom:2px; }
    .mw-typing { display:flex; gap:4px; padding:10px 12px; align-self:flex-start; background:#f0f2ff; border-radius:13px; border-bottom-left-radius:3px; }
    .mw-typing span { width:6px; height:6px; background:#0020f6; border-radius:50%; animation:mwbounce 1.1s infinite; }
    .mw-typing span:nth-child(2) { animation-delay:.18s; } .mw-typing span:nth-child(3) { animation-delay:.36s; }
    @keyframes mwbounce { 0%,60%,100%{transform:translateY(0);opacity:.6} 30%{transform:translateY(-5px);opacity:1} }
    #makac-input-row { padding:10px; border-top:1px solid rgba(0,32,246,.1); display:flex; gap:7px; flex-shrink:0; }
    #mw-input { flex:1; background:#f5f6ff; border:1.5px solid rgba(0,32,246,.2); border-radius:9px; padding:9px 12px; color:#0a0a2e; font-size:.84rem; outline:none; transition:border-color .2s; font-family:inherit; }
    #mw-input:focus { border-color:#0020f6; }
    #mw-input::placeholder { color:#9090b0; }
    #mw-send { background:#0020f6; border:none; border-radius:9px; width:38px; height:38px; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:opacity .15s; }
    #mw-send:hover { opacity:.85; }
    #makac-toggle { width:52px; height:52px; border-radius:50%; background:#0020f6; border:none; cursor:pointer; color:#fff; font-size:1.4rem; box-shadow:0 8px 24px rgba(0,32,246,.45); display:flex; align-items:center; justify-content:center; transition:transform .2s,box-shadow .2s; pointer-events:auto; }
    #makac-toggle:hover { transform:scale(1.08); box-shadow:0 12px 32px rgba(0,32,246,.6); }
    /* Confirm overlay */
    #mw-confirm { position:absolute; inset:0; background:rgba(10,10,30,.88); backdrop-filter:blur(4px); z-index:10; display:none; align-items:center; justify-content:center; border-radius:20px; }
    #mw-confirm.show { display:flex; }
    .mw-confirm-box { background:#fff; border:1.5px solid rgba(0,32,246,.2); border-radius:16px; padding:22px 18px; text-align:center; max-width:220px; }
    .mw-confirm-icon { font-size:1.8rem; margin-bottom:8px; }
    .mw-confirm-title { font-weight:700; color:#0a0a2e; font-size:.9rem; margin-bottom:5px; }
    .mw-confirm-sub { font-size:.75rem; color:#6060a0; margin-bottom:16px; line-height:1.4; }
    .mw-confirm-btns { display:flex; gap:8px; }
    .mw-confirm-cancel { flex:1; padding:7px; border-radius:8px; border:1px solid rgba(0,32,246,.2); background:none; color:#0020f6; cursor:pointer; font-size:.8rem; font-family:inherit; transition:background .15s; }
    .mw-confirm-cancel:hover { background:rgba(0,32,246,.05); }
    .mw-confirm-ok { flex:1; padding:7px; border-radius:8px; border:none; background:#0020f6; color:#fff; cursor:pointer; font-size:.8rem; font-weight:700; font-family:inherit; transition:opacity .15s; }
    .mw-confirm-ok:hover { opacity:.85; }
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────────────
  var widget = document.createElement('div');
  widget.id = 'makac-widget';
  widget.innerHTML = `
    <div id="makac-panel">
      <div id="makac-panel-header">
        <div class="mw-avatar">
          <div class="mw-brow l" id="mw-browL"></div>
          <div class="mw-brow r" id="mw-browR"></div>
          <div class="mw-eye l" id="mw-eyeL"><div class="mw-pupil" id="mw-pl"></div><div class="mw-lid" id="mw-lidL"></div></div>
          <div class="mw-eye r" id="mw-eyeR"><div class="mw-pupil" id="mw-pr"></div><div class="mw-lid" id="mw-lidR"></div></div>
          <div class="mw-cheek l"></div>
          <div class="mw-cheek r"></div>
        </div>
        <div id="makac-panel-info">
          <div id="makac-panel-name">Makač</div>
          <div id="makac-panel-sub">
            <div id="mw-dot" class="joining"></div>
            <span id="mw-status" class="joining">Už letím...</span>
          </div>
        </div>
        <button id="mw-new-chat" title="Nový chat">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nový chat
        </button>
        <button id="mw-close">✕</button>
      </div>
      <div id="makac-msgs"></div>
      <div id="mw-confirm">
        <div class="mw-confirm-box">
          <div class="mw-confirm-icon">🗑️</div>
          <div class="mw-confirm-title">Smazat tento chat?</div>
          <div class="mw-confirm-sub">Celá konverzace bude smazána a začne nová.</div>
          <div class="mw-confirm-btns">
            <button class="mw-confirm-cancel" id="mw-confirm-cancel">Zrušit</button>
            <button class="mw-confirm-ok" id="mw-confirm-ok">Ano, smazat</button>
          </div>
        </div>
      </div>
      <div id="makac-input-row">
        <input id="mw-input" type="text" placeholder="Napiš zprávu..." autocomplete="off" />
        <button id="mw-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
    <button id="makac-toggle"><img src="/message.png" width="28" height="28" style="object-fit:contain;filter:invert(1)" alt=""></button>
  `;
  document.body.appendChild(widget);

  // ── Persistence keys ─────────────────────────────────────────────────────
  var KEY_OPEN  = 'makac-chat-open';
  var KEY_STATE = 'makac-chat-state';

  function loadState() {
    try { var r = sessionStorage.getItem(KEY_STATE); return r ? JSON.parse(r) : null; } catch(e) { return null; }
  }
  function saveState() {
    try { sessionStorage.setItem(KEY_STATE, JSON.stringify({ convId: convId, history: msgHistory, welcomed: welcomed })); } catch(e) {}
  }
  function clearState() {
    try { sessionStorage.removeItem(KEY_STATE); sessionStorage.removeItem(KEY_OPEN); } catch(e) {}
  }

  // ── State ─────────────────────────────────────────────────────────────────
  var saved      = loadState();
  var convId     = saved ? saved.convId    : 'web-' + Math.random().toString(36).slice(2, 10);
  var msgHistory = saved ? saved.history   : [];
  var welcomed   = saved ? saved.welcomed  : false;
  var lastTs     = '2000-01-01';
  var pollInterval = null;

  var panel    = document.getElementById('makac-panel');
  var toggle   = document.getElementById('makac-toggle');
  var closeBtn = document.getElementById('mw-close');
  var msgs     = document.getElementById('makac-msgs');
  var input    = document.getElementById('mw-input');
  var sendBtn  = document.getElementById('mw-send');
  var dot      = document.getElementById('mw-dot');
  var status   = document.getElementById('mw-status');
  var newChat  = document.getElementById('mw-new-chat');
  var confirm  = document.getElementById('mw-confirm');
  var confirmOk= document.getElementById('mw-confirm-ok');
  var confirmCx= document.getElementById('mw-confirm-cancel');
  var pl       = document.getElementById('mw-pl');
  var pr       = document.getElementById('mw-pr');

  // ── Helpers ───────────────────────────────────────────────────────────────
  function setStatus(s) {
    dot.className = s; status.className = s;
    status.textContent = s === 'joining' ? 'Už letím...' : 'online';
  }

  function renderBot(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\n/g, '<br>');
  }

  function addMsgEl(text, role, label) {
    if (label) { var l = document.createElement('div'); l.className = 'mw-sender'; l.textContent = label; msgs.appendChild(l); }
    var el = document.createElement('div'); el.className = 'mw-msg ' + role;
    if (role === 'user') { el.textContent = text; }
    else { el.innerHTML = renderBot(text); }
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
  }

  function addMsg(text, role, label) {
    addMsgEl(text, role, label);
    // Persist message (label is not saved — it's just UI decoration)
    msgHistory.push({ text: text, role: role });
    saveState();
  }

  function restoreHistory() {
    msgHistory.forEach(function(m) { addMsgEl(m.text, m.role); });
    if (welcomed) setStatus('online');
  }

  function showTyping() {
    var el = document.createElement('div'); el.className = 'mw-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight; return el;
  }

  function startPolling() {
    if (pollInterval) return;
    var API = 'http://localhost:8000';
    pollInterval = setInterval(function () {
      fetch(API + '/chat/messages?conversation_id=' + convId + '&since=' + lastTs)
        .then(function (r) { return r.json(); })
        .then(function (ms) {
          ms.forEach(function (m) {
            if (m.sender === 'human') { addMsg(m.text, 'human', 'Podpora'); lastTs = m.created_at; }
          });
        }).catch(function () {});
    }, 3000);
  }

  function greet() {
    setStatus('joining');
    var t = showTyping();
    setTimeout(function () {
      t.remove();
      addMsg('Ahoj! 👋 Jsem <strong>Makač</strong>, tvůj AI pomocník. Na co se mě chceš zeptat?', 'bot');
      setTimeout(function () { setStatus('online'); welcomed = true; saveState(); }, 400);
    }, 1800);
    startPolling();
  }

  function openPanel(fromRestore) {
    panel.classList.add('open');
    try { sessionStorage.setItem(KEY_OPEN, '1'); } catch(e) {}
    if (!fromRestore) input.focus();
    if (msgHistory.length === 0) {
      greet();
    } else if (welcomed) {
      setStatus('online');
      startPolling();
    } else {
      startPolling();
    }
  }

  function send() {
    var text = input.value.trim(); if (!text) return;
    input.value = ''; addMsg(text, 'user');
    var t = showTyping();
    var API = 'http://localhost:8000';
    fetch(API + '/chat/message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ conversation_id: convId, text: text }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { t.remove(); if (d.reply !== '__human_active__') addMsg(d.reply, 'bot'); })
      .catch(function () { t.remove(); addMsg('Chyba spojení. Zkus to znovu.', 'bot'); });
  }

  function resetChat() {
    convId = 'web-' + Math.random().toString(36).slice(2, 10);
    welcomed = false; lastTs = '2000-01-01';
    msgHistory = [];
    msgs.innerHTML = '';
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
    clearState();
    greet();
  }

  // ── Event listeners ───────────────────────────────────────────────────────
  toggle.addEventListener('click', function() { openPanel(false); });
  closeBtn.addEventListener('click', function () {
    panel.classList.remove('open');
    try { sessionStorage.removeItem(KEY_OPEN); } catch(e) {}
  });
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
  newChat.addEventListener('click', function () { confirm.classList.add('show'); });
  confirmCx.addEventListener('click', function () { confirm.classList.remove('show'); });
  confirmOk.addEventListener('click', function () { confirm.classList.remove('show'); resetChat(); });

  // ── Eye tracking + blinking ───────────────────────────────────────────────
  var eyeL = document.getElementById('mw-eyeL'), eyeR = document.getElementById('mw-eyeR');
  var lidL  = document.getElementById('mw-lidL'), lidR  = document.getElementById('mw-lidR');
  document.addEventListener('mousemove', function (e) {
    movePupil(pl, eyeL, e.clientX, e.clientY);
    movePupil(pr, eyeR, e.clientX, e.clientY);
  });
  function movePupil(p, eye, mx, my) {
    if (!p || !eye) return;
    var r = eye.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dx = mx - cx, dy = my - cy, dist = Math.sqrt(dx * dx + dy * dy), max = 1.5;
    p.style.transform = 'translate(' + (dist > max ? (dx / dist) * max : dx).toFixed(2) + 'px,' + (dist > max ? (dy / dist) * max : dy).toFixed(2) + 'px)';
  }
  function mwBlink() {
    if (!lidL || !lidR) return;
    lidL.style.transition = lidR.style.transition = 'height .08s ease';
    lidL.style.height = lidR.style.height = '9px';
    setTimeout(function () {
      lidL.style.height = lidR.style.height = '0';
      setTimeout(function () {
        lidL.style.transition = lidR.style.transition = 'height .28s ease';
        setTimeout(mwBlink, 3000 + Math.random() * 3000);
      }, 120);
    }, 100);
  }
  setTimeout(mwBlink, 2000 + Math.random() * 2000);

  // ── Restore state on page load ────────────────────────────────────────────
  if (msgHistory.length > 0) {
    restoreHistory();
  }
  if (sessionStorage.getItem(KEY_OPEN)) {
    panel.classList.add('open');
    if (msgHistory.length === 0) {
      greet();
    } else if (welcomed) {
      setStatus('online');
      startPolling();
    }
  }

  // Global opener — stránky mohou volat window.openMakacChat()
  window.openMakacChat = function() { openPanel(false); };
})();
