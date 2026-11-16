/* Interfície del Sabotrivial */
(function () {
  const E = window.Engine;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const AVATARS = ['🦊', '🐸', '🐼', '🦁', '🐙', '🦄', '🐵', '🐧', '🤖', '👽', '🦖', '🐱', '🐶', '🐯', '🦉', '👻', '🐷', '🦈', '🐝', '🧙'];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { } }
  };

  let myId = store.get('tp_pid');
  if (!myId) { myId = 'p' + Math.random().toString(36).slice(2, 10); store.set('tp_pid', myId); }

  const A = {
    role: null,        // 'host' | 'client' | 'local'
    S: null,           // estat complet (amfitrió / local)
    v: null,           // vista pública per pintar
    me: myId,
    code: null,
    offset: 0,         // diferència de rellotge amb l'amfitrió
    net: null,
    status: 'online',
    screen: 'home',
    form: { intent: null, error: null },
    localDraft: { avatar: AVATARS[1], level: 1 },
    ui: { toastN: 0, queue: [], showing: false, tokenPos: {}, boardSig: null, panelSig: null, askSig: null, lastTurnKey: null, revealSeen: null, rolledSig: null }
  };

  // ---------------------------------------------------------------- utilitats
  const player = id => A.v && A.v.players.find(p => p.id === id);
  const isMine = id => A.role === 'local' || id === A.me;
  const lbl = p => `${p.avatar} ${esc(p.name)}`;
  const vibrate = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } };
  const sec = ms => (ms / 1000).toFixed(1).replace('.', ',') + ' s';

  function act(a, who = A.me) {
    Sound.unlock();
    if (A.role === 'client') { if (!A.net.send({ t: 'act', a })) showToastNow('📡', 'Sense connexió amb l\'amfitrió…'); return; }
    if (!A.S) return;
    if (E.dispatch(A.S, who, a, Date.now())) changed();
  }

  function changed() {
    A.v = E.publicView(A.S);
    if (A.role === 'host' && A.net) A.net.broadcast({ t: 'state', s: A.v, now: Date.now() });
    if (A.role === 'host' || A.role === 'local') store.set('tp_save2', { role: A.role, code: A.code, S: A.S, t: Date.now() });
    render();
  }

  setInterval(() => {
    if ((A.role === 'host' || A.role === 'local') && A.S && E.tick(A.S, Date.now())) changed();
  }, 150);

  // ---------------------------------------------------------------- xarxa
  async function startHost(resumeState) {
    A.role = 'host'; A.screen = 'connecting'; render();
    A.net = new Net.Host({
      onHello(entry, msg) {
        const S = A.S;
        let p = S.players.find(x => x.id === msg.pid);
        if (p) {
          p.connected = true;
          if (S.phase === 'lobby') { p.name = String(msg.name || p.name).slice(0, 14); p.avatar = msg.avatar || p.avatar; p.level = +msg.level || p.level; }
        } else if (!E.addPlayer(S, { id: msg.pid, name: msg.name, avatar: msg.avatar, level: msg.level })) {
          A.net.send(entry, { t: 'error', msg: S.phase !== 'lobby' ? 'La partida ja ha començat. Espera que acabi!' : 'La sala ja és plena (màxim 6 jugadors).' });
          return;
        }
        say('👋', `${String(msg.name || '').slice(0, 14)} s'ha connectat`);
        changed();
      },
      onAction(pid, a) { if (A.S && E.dispatch(A.S, pid, a, Date.now())) changed(); },
      onLeave(pid) {
        const p = A.S && A.S.players.find(x => x.id === pid);
        if (!p) return;
        if (A.S.phase === 'lobby') A.S.players = A.S.players.filter(x => x.id !== pid);
        else p.connected = false;
        changed();
      },
      onStatus(s) { A.status = s === 'reconnecting' ? 'reconnecting' : 'online'; render(); }
    });
    try {
      const code = await A.net.start(resumeState ? A.code : null);
      A.code = code;
      if (resumeState) {
        A.S = resumeState;
        A.S.hostId = A.me;
        A.S.players.forEach(p => { p.connected = p.id === A.me; });
      } else {
        const prof = store.get('tp_profile');
        A.S = E.createState({ local: false, hostId: A.me });
        E.addPlayer(A.S, { id: A.me, name: prof.name, avatar: prof.avatar, level: prof.level });
      }
      A.screen = 'game';
      changed();
    } catch (err) { fail(err.message); }
  }

  function say(e, t) { // missatge local de l'amfitrió (no és part del joc)
    if (!A.S) return;
    A.S.toast = { n: (A.S.toast ? A.S.toast.n : 0) + 1, e, t };
    A.S.log.unshift({ e, t });
  }

  async function startClient(code) {
    A.role = 'client'; A.code = code.toUpperCase(); A.screen = 'connecting'; render();
    const prof = store.get('tp_profile');
    A.net = new Net.Client({
      onMessage(msg) {
        if (msg.t === 'state') { A.offset = Date.now() - msg.now; A.v = msg.s; A.screen = 'game'; A.status = 'online'; render(); }
        else if (msg.t === 'error') { A.net.destroy(); fail(msg.msg); }
      },
      onStatus(s) { A.status = s; renderStatus(); }
    });
    try {
      await A.net.join(A.code, { pid: A.me, name: prof.name, avatar: prof.avatar, level: prof.level });
      store.set('tp_last', { code: A.code, t: Date.now() });
    } catch (err) { A.net.destroy(); fail(err.message); }
  }

  function startLocal(resumeState) {
    A.role = 'local'; A.code = null;
    A.S = resumeState || E.createState({ local: true });
    A.screen = 'game';
    changed();
  }

  function leave() {
    try { A.net && A.net.destroy(); } catch (e) { }
    A.net = null; A.role = null; A.S = null; A.v = null; A.screen = 'home';
    A.ui.boardSig = A.ui.panelSig = A.ui.askSig = null; A.ui.tokenPos = {};
    history.replaceState(null, '', location.pathname);
    closeModal();
    render();
  }

  function fail(msg) { A.screen = 'error'; A.form.error = msg; A.v = null; A.role = null; render(); }

  // ---------------------------------------------------------------- render principal
  // Fitxa de cada jugador: cercle del seu color amb la inicial (dues lletres si coincideixen)
  function decorate(v) {
    if (!v || !v.players) return;
    const ini = v.players.map(p => (p.name || '?').trim().charAt(0).toUpperCase());
    v.players.forEach((p, i) => {
      const dup = ini.filter(x => x === ini[i]).length > 1;
      const t = dup ? (p.name || '?').trim().slice(0, 2) : ini[i];
      p.ini = t;
      p.avatar = `<span class="ini${dup ? ' two' : ''}" style="background:${p.color}">${esc(t)}</span>`;
    });
  }

  function render() {
    const app = $('#app');
    decorate(A.v);
    if (!A.v || A.screen !== 'game') {
      A.ui.boardSig = A.ui.panelSig = A.ui.askSig = null;
      document.body.dataset.screen = A.screen;
      app.innerHTML = ({ home: homeHTML, profile: profileHTML, connecting: connectingHTML, error: errorHTML })[A.screen]();
      if (A.screen === 'profile') setTimeout(() => { const n = $('#pname'); if (n && !n.value) n.focus(); }, 50);
      return;
    }
    const v = A.v;
    document.body.dataset.screen = v.phase;
    if (v.phase === 'lobby') { A.ui.boardSig = A.ui.panelSig = A.ui.askSig = null; app.innerHTML = lobbyHTML(v); }
    else if (v.phase === 'play') renderGame(v);
    else { A.ui.boardSig = A.ui.panelSig = A.ui.askSig = null; app.innerHTML = endHTML(v); }
    handleToasts(v);
    renderStatus();
    if (v.phase === 'end' && A.ui.endSeen !== v.winner + v.log.length) { A.ui.endSeen = v.winner + v.log.length; Sound.win(); confetti(); }
  }

  function renderStatus() {
    let b = $('#netstatus');
    if (A.role !== 'client' || A.status === 'online') { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'netstatus'; document.body.appendChild(b); }
    b.textContent = '📡 Reconnectant amb la sala…';
  }

  // ---------------------------------------------------------------- pantalles inicials
  function homeHTML() {
    const save = store.get('tp_save2');
    const canResume = save && save.S && Date.now() - save.t < 12 * 3600e3 && save.S.phase !== 'end';
    const sala = new URLSearchParams(location.search).get('sala');
    return `
    <div class="screen home">
      <div class="logo">
        <div class="logo-dice"><span>🎲</span><span>😈</span></div>
        <h1>Sabo<span class="hl">trivial</span><small>saber + sabotatge</small></h1>
        <p class="tagline">El trivial familiar on pots fer la guitza als altres</p>
      </div>
      ${sala ? `<button class="btn big primary pulse" data-a="go" data-to="join">🔗 Entrar a la sala ${esc(sala.toUpperCase())}</button>` : ''}
      ${canResume ? `<button class="btn big resume" data-a="resume">♻️ Reprendre la partida ${save.code ? 'de la sala ' + esc(save.code) : 'en aquest dispositiu'}</button>` : ''}
      <button class="btn big ${sala ? '' : 'primary'}" data-a="go" data-to="create">🎉 Crear una partida en línia</button>
      ${sala ? '' : `<button class="btn big" data-a="go" data-to="join">🔗 Unir-me a una partida</button>`}
      <button class="btn big ghost" data-a="go" data-to="local">📱 Jugar tots en aquest dispositiu</button>
      <div class="row center gap">
        <button class="btn small ghost" data-a="rules">📖 Com es juga</button>
        <button class="btn small ghost" data-a="mute">${Sound.muted ? '🔇 So apagat' : '🔊 So encès'}</button>
      </div>
      <p class="foot">${countQuestions()} preguntes en català · D'1 a 6 jugadors</p>
    </div>`;
  }

  function countQuestions() { let n = 0; for (const c in QUESTIONS) for (const l in QUESTIONS[c]) n += QUESTIONS[c][l].length; return n; }

  function profileHTML() {
    const prof = store.get('tp_profile', { name: '', avatar: AVATARS[Math.floor(Math.random() * 8)], level: 3 });
    const join = A.form.intent === 'join';
    const sala = new URLSearchParams(location.search).get('sala') || (store.get('tp_last') || {}).code || '';
    return `
    <div class="screen profile">
      <button class="btn small ghost back" data-a="go" data-to="home">← Enrere</button>
      <h2>${join ? '🔗 Unir-me a una partida' : '🎉 Crear una partida'}</h2>
      ${join ? `<label class="field"><span>Codi de la sala</span><input id="pcode" maxlength="4" autocomplete="off" autocapitalize="characters" value="${esc(sala.toUpperCase())}" placeholder="ABCD" class="codeinput"></label>` : ''}
      <label class="field"><span>Com et dius?</span><input id="pname" maxlength="14" value="${esc(prof.name)}" placeholder="El teu nom"></label>
      <div class="field"><span>Nivell de les preguntes</span>
        <div class="levels" id="plevels">${levelButtons(prof.level, 'picklvl')}</div>
      </div>
      ${A.form.error ? `<p class="err">${esc(A.form.error)}</p>` : ''}
      <button class="btn big primary" data-a="${join ? 'dojoin' : 'docreate'}">${join ? 'Entrar a la sala' : 'Crear la sala'} →</button>
    </div>`;
  }

  function levelButtons(sel, action) {
    return Object.entries(E.LEVELS).map(([k, l]) => `<button class="lvl ${+k === +sel ? 'sel' : ''}" data-a="${action}" data-lvl="${k}"><b>${l.emoji} ${l.name}</b><small>${l.desc}</small></button>`).join('');
  }

  function connectingHTML() {
    return `<div class="screen center-screen"><div class="spinner">🎲</div><p>${A.role === 'client' ? 'Connectant amb la sala ' + esc(A.code) + '…' : 'Creant la sala…'}</p><button class="btn small ghost" data-a="leave">Cancel·lar</button></div>`;
  }

  function errorHTML() {
    return `<div class="screen center-screen"><div class="bigemoji">😵</div><h2>Ups!</h2><p>${esc(A.form.error)}</p><button class="btn big primary" data-a="go" data-to="home">Tornar a l'inici</button></div>`;
  }

  // ---------------------------------------------------------------- sala d'espera
  function lobbyHTML(v) {
    const host = A.role !== 'client';
    const slots = [];
    for (let i = 0; i < E.MAX_PLAYERS; i++) {
      const p = v.players[i];
      if (p) slots.push(`<div class="pslot" style="--pc:${p.color}"><span class="pav">${p.avatar}</span><span class="pn">${esc(p.name)}${p.id === v.hostId ? ' 👑' : ''}${p.id === A.me && A.role !== 'local' ? ' <em>(tu)</em>' : ''}</span><span class="plv">${E.LEVELS[p.level].emoji} ${E.LEVELS[p.level].name}</span>${host && p.id !== v.hostId ? `<button class="x" data-a="kick" data-id="${p.id}">✕</button>` : ''}</div>`);
      else slots.push(`<div class="pslot empty"><span class="pav">·</span><span class="pn">Esperant jugador…</span></div>`);
    }
    const d = A.localDraft;
    const addForm = A.role === 'local' && v.players.length < E.MAX_PLAYERS ? `
      <div class="card addp">
        <h3>➕ Afegir jugador</h3>
        <input id="lname" maxlength="14" placeholder="Nom del jugador">
        <div class="levels">${levelButtons(d.level, 'ldlvl')}</div>
        <button class="btn primary" data-a="ladd">Afegir</button>
      </div>` : '';
    const mode = v.mode;
    const set = v.settings;
    const dis = host ? '' : 'disabled';
    const opt = (key, val, txt) => `<button class="chip ${set[key] === val ? 'sel' : ''}" ${dis} data-a="cfg" data-k="${key}" data-val="${val}">${txt}</button>`;
    return `
    <div class="screen lobby">
      <div class="topline">
        <button class="btn small ghost" data-a="askleave">← Sortir</button>
        <button class="btn small ghost" data-a="rules">📖 Regles</button>
      </div>
      ${A.role === 'local' ? `<h2>📱 Partida en aquest dispositiu</h2>` : `
      <div class="roomcode">
        <span>Codi de la sala</span>
        <b>${esc(A.code)}</b>
        <button class="btn small" data-a="share">📤 Compartir l'enllaç</button>
      </div>`}
      <div class="slots">${slots.join('')}</div>
      ${addForm}
      <h3 class="sect">Temàtica</h3>
      <div class="themes">${Object.entries(E.THEMES).map(([k, t]) => `<button class="theme ${(set.theme || 'gen') === k ? 'sel' : ''} ${k === 'gen' ? 'gen' : 'friki'}" ${dis} data-a="cfg" data-k="theme" data-val="${k}"><span>${t.emoji}</span><b>${t.name}</b></button>`).join('')}</div>
      <p class="hint">${(set.theme || 'gen') === 'gen' ? '🌍 Preguntes de cultura general per a tots els públics.' : '🤓 Mode friki: a veure qui en sap més! Cadascú juga igualment amb el seu nivell.'}</p>
      <h3 class="sect">Mode de joc</h3>
      <div class="modes">
        <button class="mode ${mode === 'board' ? 'sel' : ''}" ${dis} data-a="cfg" data-k="mode" data-val="board">
          <span class="me">🗺️</span><b>Conquesta</b><small>Per torns, sobre un mapa. Encerta per conquerir caselles, ataca les dels rivals i sabota'ls amb cartes. Guanya qui domina més territori!</small>
        </button>
        <button class="mode ${mode === 'quiz' ? 'sel' : ''}" ${dis} data-a="cfg" data-k="mode" data-val="quiz">
          <span class="me">⚡</span><b>Repte individual</b><small>Tothom respon alhora la seva pregunta. Punts per encert i rapidesa. Qui n'encerta més?</small>
        </button>
      </div>
      <div class="settings">
        ${mode === 'board' ? `<div class="setrow"><span>Mapa</span>${opt('len', 24, 'Petit')}${opt('len', 36, 'Normal')}${opt('len', 48, 'Gran')}</div>`
        : `<div class="setrow"><span>Preguntes</span>${opt('rounds', 6, '6')}${opt('rounds', 12, '12')}${opt('rounds', 18, '18')}</div>`}
        <div class="setrow"><span>Temps</span>${opt('time', 15, '15 s')}${opt('time', 25, '25 s')}${opt('time', 40, '40 s')}</div>
      </div>
      ${host ? `<button class="btn big primary" data-a="start" ${v.players.length < 1 ? 'disabled' : ''}>🚀 Començar la partida</button>
        ${A.role === 'host' && v.players.length < 2 ? `<p class="hint">Comparteix el codi <b>${esc(A.code)}</b> perquè la família s'hi connecti des del seu mòbil.</p>` : ''}`
        : `<p class="waitmsg">Esperant que ${lbl(player(v.hostId) || { avatar: '👑', name: 'l\'amfitrió' })} comenci la partida…</p>`}
    </div>`;
  }

  // ---------------------------------------------------------------- partida
  function renderGame(v) {
    const app = $('#app');
    if (!$('#game')) {
      A.ui.boardSig = A.ui.panelSig = A.ui.askSig = null;
      app.innerHTML = `
        <div id="game" class="screen game">
          <header class="gbar">
            <button class="btn icon" data-a="askleave" title="Sortir">✕</button>
            <div class="gtitle" id="gtitle"></div>
            <button class="btn icon" data-a="log" title="Historial">📜</button>
            <button class="btn icon" data-a="rules" title="Regles">📖</button>
            <button class="btn icon" data-a="mute" id="mutebtn">${Sound.muted ? '🔇' : '🔊'}</button>
          </header>
          <div id="pbar" class="pbar"></div>
          <div id="main" class="main"></div>
          <div id="panel" class="panel"></div>
          <div id="qlayer" class="qlayer hidden"></div>
        </div>`;
      wakeLock();
    }
    const th = E.THEMES[v.settings.theme] || E.THEMES.gen;
    const thTag = v.settings.theme && v.settings.theme !== 'gen' ? `${th.emoji} ` : '';
    $('#gtitle').innerHTML = thTag + (v.mode === 'board' ? `Conquesta · Ronda ${Math.min(v.round, v.map.rounds)}/${v.map.rounds}` : `Repte · ${Math.min(v.round, v.settings.rounds)}/${v.settings.rounds}`);
    $('#pbar').innerHTML = playersBarHTML(v);
    $('#pbar').dataset.n = v.players.length;
    if (v.mode === 'board') renderBoard(v); else renderScores(v);
    renderPanel(v);
    renderAsk(v);

    const cur = v.players[v.turn];
    const turnKey = v.mode === 'board' ? v.turn + ':' + v.log.length : null;
    if (v.mode === 'board' && v.step === 'pre' && A.ui.lastTurnKey !== cur.id + v.turn) {
      A.ui.lastTurnKey = cur.id + v.turn;
      if (isMine(cur.id)) { Sound.turn(); vibrate(120); }
    }
  }

  function playersBarHTML(v) {
    const cur = v.players[v.turn];
    return v.players.map(p => {
      const icons = [];
      if (p.frozen) icons.push('🧊');
      if (p.eff.dizzy) icons.push('🌀');
      if (p.eff.clock) icons.push('⏱️');
      if (p.eff.ink) icons.push('🦑');
      if (p.eff.fifty) icons.push('✂️');
      if (p.eff.double) icons.push('⚡');
      const active = v.mode === 'board' && cur && cur.id === p.id;
      const info = v.mode === 'board'
        ? `<span>🚩${p.pos}</span><span>🃏${p.cards.length}</span>`
        : `<span>⭐${p.score}</span><span>✅${p.stats.ok}</span>`;
      return `<div class="pchip ${active ? 'active' : ''} ${p.connected ? '' : 'off'} ${p.id === A.me && A.role !== 'local' ? 'mine' : ''}" style="--pc:${p.color}">
        <span class="pav">${p.avatar}</span>
        <span class="pmeta"><b>${esc(p.name)}</b><span class="pinfo">${info}${icons.length ? `<span class="fx">${icons.join('')}</span>` : ''}</span></span>
        ${p.connected ? '' : '<span class="offtag">📡</span>'}
      </div>`;
    }).join('');
  }

  // ---------- mapa de conquesta
  function hexGeom(m) { const s = 50, w = Math.sqrt(3) * s; return { s, w, W: w * (m.cols + 0.5), H: 1.5 * s * m.rows + 0.5 * s }; }
  function hexCenter(i, m, g) { const c = i % m.cols, r = Math.floor(i / m.cols); return { x: g.w * (c + 0.5 * (r & 1)) + g.w / 2, y: 1.5 * g.s * r + g.s }; }
  function myTargets(v) {
    const cur = v.players[v.turn];
    return (v.step === 'pre' && cur && isMine(cur.id)) ? E.targets(v, cur.id) : [];
  }

  function renderBoard(v) {
    const main = $('#main');
    const m = v.map, g = hexGeom(m);
    const tg = myTargets(v);
    const showTarget = ['ask', 'reveal'].includes(v.step) && v.ask && ['turn', 'duel'].includes(v.ask.kind) ? v.target : null;
    const sig = JSON.stringify([v.board, tg, showTarget]);
    if (A.ui.boardSig === sig) return;
    const prev = A.ui.owners || [];
    A.ui.boardSig = sig;
    const pts = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 180 * (60 * k - 30); pts.push((g.s * 0.95 * Math.cos(a)).toFixed(1) + ',' + (g.s * 0.95 * Math.sin(a)).toFixed(1)); }
    const poly = pts.join(' ');
    const cells = v.board.map((c, i) => {
      const { x, y } = hexCenter(i, m, g);
      const owner = c.owner && player(c.owner);
      const cls = ['hx'];
      if (owner) cls.push('own'); if (tg.includes(i)) cls.push('tg'); if (showTarget === i) cls.push('now');
      if (prev.length && prev[i] !== c.owner) cls.push('chg');
      const fill = owner ? owner.color : 'rgba(255,255,255,.13)';
      const main = c.base ? '👑' : E.CATS[c.cat].emoji;
      const badge = c.card ? '🃏' : c.star ? '⭐' : '';
      return `<g class="${cls.join(' ')}" data-a="cell" data-i="${i}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
        <polygon points="${poly}" fill="${fill}"/>
        <text class="hxe" y="${badge ? 4 : 12}">${main}</text>
        ${badge ? `<text class="hxb" y="34">${badge}</text>` : ''}
        ${owner && !c.base ? `<text class="hxi" y="-22">${esc(owner.ini)}</text>` : ''}
      </g>`;
    }).join('');
    A.ui.owners = v.board.map(c => c.owner);
    main.innerHTML = `<div class="boardwrap"><svg class="hexmap" viewBox="0 0 ${g.W.toFixed(0)} ${g.H.toFixed(0)}" style="max-width:min(100%, calc(60vh * ${(g.W / g.H).toFixed(3)}))">${cells}</svg></div>`;
  }

  function cellModal(i) {
    const v = A.v, c = v.board[i];
    const cat = E.CATS[c.cat], owner = c.owner && player(c.owner), cur = v.players[v.turn];
    const can = myTargets(v).includes(i);
    const extra = c.base ? E.SQUARES.base : c.card ? E.SQUARES.card : c.star ? E.SQUARES.star : null;
    let action = '';
    if (can && !owner) action = `<button class="btn big primary" data-a="move" data-i="${i}">🚩 Conquerir-la</button><p class="hint">Hauràs de respondre una pregunta de ${cat.name}.</p>`;
    else if (can) action = `<button class="btn big warn" data-a="move" data-i="${i}">⚔️ Atacar ${esc(owner.name)}</button><p class="hint">Tots dos respondreu una pregunta de ${cat.name}. Te la quedes si encertes i l'altre falla, o si encerteu tots dos i tu ets més ràpid.</p>`;
    else if (v.step === 'pre' && isMine(cur.id)) action = `<p class="hint">${c.base ? 'Les bases no es poden atacar.' : c.owner === cur.id ? 'Aquesta casella ja és teva.' : 'Només pots anar a caselles que toquin el teu territori.'}</p>`;
    openModal(`<div class="bigcard"><div class="bce">${c.base ? '👑' : cat.emoji}</div><h2>${c.base ? 'Base' : cat.name}</h2>
      <p>${owner ? `Territori de ${lbl(owner)}` : 'Casella lliure'}${c.star ? ' · val 2 punts' : ''}</p>${extra ? `<p>${extra.emoji} ${extra.desc}</p>` : ''}</div>
      ${action}<button class="btn ghost" data-a="close">Tancar</button>`);
  }

  // ---------- marcador del repte
  function renderScores(v) {
    const main = $('#main');
    const sorted = v.players.slice().sort((a, b) => b.score - a.score);
    const max = Math.max(1, ...sorted.map(p => p.score));
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
    main.innerHTML = `<div class="scoreboard">
      <div class="roundinfo">${v.step === 'intro' ? '⚡ Preparats?' : `Pregunta <b>${v.round}</b> de ${v.settings.rounds}${v.round === v.settings.rounds ? ' · ⭐ val doble!' : ''}`}</div>
      ${sorted.map((p, i) => `<div class="srow" style="--pc:${p.color}">
        <span class="med">${medals[i]}</span><span class="pav">${p.avatar}</span>
        <div class="sbar"><div class="sname">${esc(p.name)} <small>${E.LEVELS[p.level].emoji}</small>${p.streak >= 3 ? ' <span class="streak">🔥' + p.streak + '</span>' : ''}</div><div class="sfill" style="width:${(p.score / max * 100).toFixed(1)}%"></div></div>
        <b class="spts">${p.score}</b>
      </div>`).join('')}
    </div>`;
  }

  // ---------- panell inferior
  function renderPanel(v) {
    const html = v.mode === 'board' ? boardPanelHTML(v) : quizPanelHTML(v);
    if (html !== A.ui.panelSig) { A.ui.panelSig = html; $('#panel').innerHTML = html; }
  }

  function handHTML(p, playable, used) {
    if (!p.cards.length) return `<div class="hand empty">Sense cartes. Conquereix una casella 🃏 per robar-ne!</div>`;
    return `<div class="hand">${p.cards.map((c, i) => {
      const d = E.CARDS[c];
      const can = playable && !used && d.kind !== 'passive';
      return `<button class="gcard ${d.kind} ${can ? 'can' : ''}" data-a="card" data-c="${c}" data-pid="${p.id}" data-play="${can ? 1 : 0}"><span class="ce">${d.emoji}</span><span class="cn">${d.name}</span>${d.kind === 'passive' ? '<span class="ctag">passiva</span>' : ''}</button>`;
    }).join('')}</div>`;
  }

  function boardPanelHTML(v) {
    const cur = v.players[v.turn];
    const mine = isMine(cur.id);
    const me = player(A.me);
    const hostSkip = A.role === 'host' && !cur.connected && v.step === 'pre'
      ? `<button class="btn small warn" data-a="skip">⏭️ ${lbl(cur)} està desconnectat: saltar el torn</button>` : '';
    switch (v.step) {
      case 'pre':
        if (mine) return `
          <div class="turnhead" style="--pc:${cur.color}">${A.role === 'local' ? `Torn de ${lbl(cur)}` : '🎯 Et toca!'}</div>
          ${handHTML(cur, true, v.cardUsed)}
          <p class="hint">👉 <b>Toca una casella il·luminada</b> del mapa per conquerir-la o atacar-la.${v.cardUsed ? '' : ' Abans pots jugar una carta.'}</p>`;
        return `<div class="turnhead other" style="--pc:${cur.color}">Torn de ${lbl(cur)}…</div>
          ${me ? `<div class="mylabel">Les teves cartes</div>${handHTML(me, false)}` : ''}${hostSkip}`;
      case 'ask': case 'reveal':
        return `<div class="turnhead other">🤔 Pregunta en joc…</div>`;
      default: {
        const last = v.log[0];
        return `<div class="lastlog">${last ? `<span>${last.e}</span> ${esc(last.t)}` : ''}</div>`;
      }
    }
  }

  function dieFace(n) {
    const pips = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] }[n];
    let h = ''; for (let i = 1; i <= 9; i++) h += `<i class="${pips.includes(i) ? 'on' : ''}"></i>`;
    return h;
  }

  function quizPanelHTML(v) {
    if (v.step === 'scores' || v.step === 'intro' || v.step === 'reveal') {
      const throwers = v.players.filter(p => isMine(p.id) && p.inkLeft > 0);
      const inkBtn = throwers.length && v.players.length > 1
        ? `<button class="btn ink" data-a="inkpick">🦑 Llançar tinta de calamar a un rival</button><p class="hint">Un cop per partida: les respostes del rival quedaran tacades a la pròxima pregunta.</p>` : '';
      return `<div class="lastlog">${v.step === 'intro' ? '⚡ Comença el repte!' : '⏳ Ara ve la següent pregunta…'}</div>${inkBtn}`;
    }
    return `<div class="turnhead other">🤔 Responent…</div>`;
  }

  // ---------- capa de preguntes
  function renderAsk(v) {
    const layer = $('#qlayer');
    const a = v.ask;
    if (!a || !['ask', 'reveal'].includes(v.step)) {
      if (!layer.classList.contains('hidden')) { layer.classList.add('hidden'); layer.innerHTML = ''; }
      A.ui.askSig = null;
      return;
    }
    let show, mode;
    if (A.role === 'local') {
      if (!a.reveal) { show = a.order.find(id => a.parts[id].ans === null) || a.order[0]; mode = 'single'; }
      else { show = a.order.length === 1 ? a.order[0] : null; mode = show ? 'single' : 'summary'; }
    } else { show = a.parts[A.me] ? A.me : a.order[0]; mode = 'single'; }

    const answered = a.order.map(id => a.parts[id].ans !== null ? 1 : 0).join('');
    const part = show && a.parts[show];
    const sig = [a.id, a.reveal, show, part && part.ans, part && part.start, part && part.hide.join(','), answered].join('|');
    if (sig === A.ui.askSig) return;
    A.ui.askSig = sig;
    layer.classList.remove('hidden');
    layer.innerHTML = mode === 'summary' ? summaryHTML(v, a) : qcardHTML(v, a, show);

    if (a.reveal && A.ui.revealSeen !== a.id) {
      A.ui.revealSeen = a.id;
      const mineParts = a.order.filter(id => isMine(id)).map(id => a.parts[id]);
      const target = mineParts.length ? mineParts : a.order.map(id => a.parts[id]);
      if (target.some(p => p.ok)) Sound.good(); else Sound.bad();
      if (mineParts.length && !mineParts.some(p => p.ok)) vibrate([60, 40, 60]);
    }
    if (!a.reveal && part && part.start !== null && part.ans === null && isMine(show)) {
      if (A.ui.lastAskBuzz !== a.id + show) { A.ui.lastAskBuzz = a.id + show; vibrate(60); }
    }
  }

  const KIND = { turn: 'Pregunta', bomb: '💣 Pregunta bomba', duel: '⚔️ Duel', all: '📣 Tothom respon', quiz: '⚡ Repte' };

  function qcardHTML(v, a, pid) {
    const part = a.parts[pid];
    const p = player(pid);
    const cat = E.CATS[a.cat];
    const head = `<div class="qhead"><span>${cat.emoji} ${cat.name}</span><span>${KIND[a.kind]}${a.kind === 'quiz' ? ` ${v.round}/${v.settings.rounds}` : ''}${a.double ? ' · ⭐x2' : ''}</span></div>`;
    if (part.start === null) { // mode local: passar el mòbil
      return `<div class="qcard gate" style="--cc:${cat.color}">${head}
        <div class="gatebody"><div class="bigemoji">${p.avatar}</div><h2>Passa el mòbil a <span style="color:${p.color}">${esc(p.name)}</span></h2>
        <p>${a.kind === 'bomb' ? '💣 Té una pregunta bomba!' : a.kind === 'duel' ? '⚔️ Li toca respondre el duel' : 'Li toca respondre'} · Nivell ${E.LEVELS[part.lvl].emoji}</p>
        <p class="hint">Els altres, no mireu! 🙈</p>
        <button class="btn big primary" data-a="ready" data-pid="${pid}">Som-hi!</button></div></div>`;
    }
    const mine = isMine(pid);
    const interactive = mine && !a.reveal && part.ans === null;
    const watching = !mine;
    const fx = [];
    if (part.eff.dizzy) fx.push('🌀 Mareig');
    if (part.eff.clock) fx.push('⏱️ Només 8 s');
    if (part.eff.ink) fx.push('🦑 Tinta');
    if (part.hide.length) fx.push('✂️ 50%');
    const letters = ['A', 'B', 'C', 'D'];
    const opts = part.opts.map((o, i) => {
      const cls = [];
      if (part.hide.includes(i)) cls.push('gone');
      if (part.ans === i) cls.push('chosen');
      if (a.reveal && i === part.correct) cls.push('right');
      if (a.reveal && part.ans === i && i !== part.correct) cls.push('wrong');
      return `<button class="opt ${cls.join(' ')}" ${interactive && !part.hide.includes(i) ? `data-a="answer" data-pid="${pid}" data-i="${i}"` : 'disabled'}><span class="ol">${letters[i]}</span><span class="ot">${esc(o)}</span></button>`;
    }).join('');
    let foot = '';
    if (a.reveal) {
      const res = part.ok ? `<div class="verdict ok">✅ Correcte!${part.pts ? ` <b>+${part.pts}</b>` : ''} <small>${sec(part.ms)}</small></div>`
        : part.ans === -1 ? `<div class="verdict ko">⌛ S'ha acabat el temps!</div>` : `<div class="verdict ko">❌ Incorrecte!</div>`;
      foot = res + moreLink(part.q, part.opts[part.correct]) + (a.order.length > 1 ? resultsHTML(a) : '');
    } else {
      foot = `<div class="timer" data-dl="${part.deadline}" data-time="${part.time}" data-mine="${interactive ? 1 : 0}"><i></i><b></b></div>`;
      if (part.ans !== null && mine) foot += `<p class="hint center">Resposta enviada! Esperant els altres…</p>`;
      if (a.order.length > 1) foot += `<div class="who">${a.order.map(id => { const q = player(id); return `<span class="${a.parts[id].ans !== null ? 'done' : ''}">${q.avatar} ${a.parts[id].ans !== null ? '✔' : '…'}</span>`; }).join('')}</div>`;
      if (interactive && v.mode === 'quiz' && p.fiftyLeft > 0 && !part.hide.length) foot += `<button class="btn small fifty" data-a="fifty" data-pid="${pid}">✂️ Comodí 50% (només un cop)</button>`;
    }
    const inkDelay = part.start ? Math.max(0, (Date.now() - A.offset) - part.start) : 0;
    return `<div class="qcard ${a.reveal ? 'revealed' : ''}" style="--cc:${cat.color}">
      ${head}
      <div class="qwho">${watching ? `👀 Està responent ${lbl(p)}` : `${lbl(p)} · Nivell ${E.LEVELS[part.lvl].emoji}`}${fx.length ? ` <span class="fxs">${fx.join(' · ')}</span>` : ''}</div>
      <div class="qbody ${part.eff.dizzy && !a.reveal ? 'dizzy' : ''}">
        <div class="qtext">${esc(part.q)}</div>
        <div class="opts">${opts}${part.eff.ink && !a.reveal ? `<div class="inkblot" style="animation-delay:-${Math.min(inkDelay, 6000)}ms">${'<i></i>'.repeat(7)}</div>` : ''}</div>
      </div>
      ${foot}
    </div>`;
  }

  function moreURL(q, ans) { return 'https://www.google.com/search?q=' + encodeURIComponent(q + ' ' + ans); }
  function moreLink(q, ans, cls = '') { return `<a class="more ${cls}" href="${moreURL(q, ans)}" target="_blank" rel="noopener">🔎 Saber-ne més</a>`; }

  function resultsHTML(a) {
    return `<div class="results">${a.order.map(id => {
      const q = player(id), pt = a.parts[id];
      return `<div class="res ${pt.ok ? 'ok' : 'ko'}"><span>${q.avatar} ${esc(q.name)}</span><span>${pt.ok ? '✅' : pt.ans === -1 ? '⌛' : '❌'} ${pt.ok ? sec(pt.ms) : ''}${pt.pts ? ` <b>+${pt.pts}</b>` : ''}</span></div>`;
    }).join('')}</div>`;
  }

  function summaryHTML(v, a) {
    const cat = E.CATS[a.cat];
    return `<div class="qcard revealed" style="--cc:${cat.color}">
      <div class="qhead"><span>${cat.emoji} ${cat.name}</span><span>${KIND[a.kind]}</span></div>
      <div class="summary">${a.order.map(id => {
      const q = player(id), pt = a.parts[id];
      return `<div class="sumrow ${pt.ok ? 'ok' : 'ko'}">
          <div class="sumh"><b>${q.avatar} ${esc(q.name)}</b><span>${pt.ok ? '✅ ' + sec(pt.ms) : pt.ans === -1 ? '⌛ Temps!' : '❌'}${pt.pts ? ` <b>+${pt.pts}</b>` : ''}</span></div>
          <div class="sumq">${esc(pt.q)}</div>
          <div class="suma">✔ ${esc(pt.opts[pt.correct])}${!pt.ok && pt.ans >= 0 ? ` <s>${esc(pt.opts[pt.ans])}</s>` : ''} ${moreLink(pt.q, pt.opts[pt.correct], 'inline')}</div>
        </div>`;
    }).join('')}</div></div>`;
  }

  // compte enrere
  function timerLoop() {
    document.querySelectorAll('.timer[data-dl]').forEach(t => {
      const dl = +t.dataset.dl; if (!dl) return;
      const total = +t.dataset.time * 1000;
      const left = Math.max(0, dl + A.offset - Date.now());
      t.querySelector('i').style.width = (left / total * 100) + '%';
      const s = Math.ceil(left / 1000);
      const b = t.querySelector('b');
      if (b.textContent !== String(s)) {
        b.textContent = s;
        if (t.dataset.mine === '1' && s <= 5 && s > 0) Sound.tick();
      }
      t.classList.toggle('hurry', left < 5000);
    });
    requestAnimationFrame(timerLoop);
  }
  requestAnimationFrame(timerLoop);

  // ---------------------------------------------------------------- final
  function endHTML(v) {
    const w = player(v.winner);
    const ranking = v.players.slice().sort((a, b) => v.mode === 'board' ? (b.pos - a.pos) : (b.score - a.score));
    const best = v.players.slice().sort((a, b) => b.stats.ok - a.stats.ok || (b.stats.ok / Math.max(1, b.stats.n)) - (a.stats.ok / Math.max(1, a.stats.n)))[0];
    const fastest = v.players.filter(p => p.stats.fast != null).sort((a, b) => a.stats.fast - b.stats.fast)[0];
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
    const host = A.role !== 'client';
    return `<div class="screen end">
      <div class="winner" style="--pc:${w.color}">
        <div class="crown">👑</div><div class="wav">${w.avatar}</div>
        <h1>${esc(w.name)} guanya!</h1>
        <p>${v.mode === 'board' ? `Domina el mapa amb ${w.pos} punts 🚩` : `${w.score} punts al repte ⚡`}</p>
      </div>
      <div class="card">
        <h3>Classificació</h3>
        ${ranking.map((p, i) => `<div class="rrow" style="--pc:${p.color}"><span>${medals[i]}</span><span class="pav">${p.avatar}</span><b>${esc(p.name)}</b>
          <span class="rstat">${v.mode === 'board' ? `🚩${p.pos}` : `⭐${p.score}`}</span>
          <span class="rstat">✅ ${p.stats.ok}/${p.stats.n}${p.stats.n ? ` (${Math.round(p.stats.ok / p.stats.n * 100)}%)` : ''}</span></div>`).join('')}
      </div>
      <div class="awards">
        ${best && best.stats.ok ? `<div class="award">🎯<b>Més encerts</b><span>${best.avatar} ${esc(best.name)} · ${best.stats.ok}</span></div>` : ''}
        ${fastest ? `<div class="award">⚡<b>Resposta més ràpida</b><span>${fastest.avatar} ${esc(fastest.name)} · ${sec(fastest.stats.fast)}</span></div>` : ''}
      </div>
      ${host ? `<button class="btn big primary" data-a="restart">🔁 Tornar a jugar</button>` : `<p class="waitmsg">Esperant que l'amfitrió torni a començar…</p>`}
      <button class="btn ghost" data-a="log">📜 Veure què ha passat</button>
      <button class="btn ghost" data-a="askleave">🏠 Sortir</button>
    </div>`;
  }

  function confetti() {
    const box = $('#confetti');
    const cols = ['#FF4D4D', '#3D7BFF', '#22B573', '#FFC233', '#9B59E0', '#EE5A9C'];
    let h = '';
    for (let i = 0; i < 140; i++) {
      h += `<i style="left:${Math.random() * 100}%;background:${cols[i % cols.length]};animation-delay:${Math.random() * 1.5}s;animation-duration:${2.5 + Math.random() * 2}s;transform:rotate(${Math.random() * 360}deg)"></i>`;
    }
    box.innerHTML = h;
    setTimeout(() => { box.innerHTML = ''; }, 6000);
  }

  // ---------------------------------------------------------------- avisos
  const ATTACK = ['🧨', '🏴‍☠️', '💣', '🧊', '🌀', '⏱️', '🦑', '🔀', '🧲', '🌋', '🌪️', '💥', '⚔️'];
  function handleToasts(v) {
    if (A.ui.toastPhase !== v.phase) { A.ui.toastPhase = v.phase; A.ui.queue = []; }
    if (!v.toast) { A.ui.toastN = 0; return; }
    if (A.ui.toastN === 0 && v.toast.n > 1 && !A.ui.toastInit) { A.ui.toastInit = true; A.ui.toastN = v.toast.n; return; }
    A.ui.toastInit = true;
    if (v.toast.n <= A.ui.toastN) { if (v.toast.n < A.ui.toastN) A.ui.toastN = v.toast.n; return; }
    const n = Math.min(4, v.toast.n - A.ui.toastN);
    A.ui.toastN = v.toast.n;
    const items = v.log.slice(0, n).reverse();
    A.ui.queue.push(...items);
    if (A.ui.queue.length > 5) A.ui.queue = A.ui.queue.slice(-5);
    pumpToast();
  }
  function pumpToast() {
    if (A.ui.showing || !A.ui.queue.length) return;
    const t = A.ui.queue.shift();
    showToastNow(t.e, t.t, () => pumpToast());
  }
  function showToastNow(e, text, done) {
    const el = $('#toast');
    A.ui.showing = true;
    el.innerHTML = `<span class="te">${e}</span><span class="tt">${esc(text)}</span>`;
    el.classList.remove('hidden', 'out');
    el.classList.toggle('attack', ATTACK.includes(e));
    void el.offsetWidth; el.classList.add('in');
    if (ATTACK.includes(e)) Sound.attack(); else if (e === '🃏' || e === '🔥') Sound.card();
    const dur = Math.min(3600, 1500 + text.length * 28);
    clearTimeout(A.ui.toastTimer);
    A.ui.toastTimer = setTimeout(() => {
      el.classList.remove('in'); el.classList.add('out');
      setTimeout(() => { el.classList.add('hidden'); A.ui.showing = false; done && done(); }, 250);
    }, dur);
  }

  // ---------------------------------------------------------------- finestres modals
  function openModal(html) { const m = $('#modal'); m.innerHTML = `<div class="mbox">${html}</div>`; m.classList.remove('hidden'); }
  function closeModal() { const m = $('#modal'); m.classList.add('hidden'); m.innerHTML = ''; }

  function rulesHTML() {
    const sq = Object.entries(E.SQUARES).map(([k, s]) => `<li><span>${s.emoji}</span><b>${s.name}</b> ${s.desc}</li>`).join('');
    const cards = Object.values(E.CARDS).map(c => `<li><span>${c.emoji}</span><b>${c.name}</b> ${c.desc}</li>`).join('');
    const cats = E.CAT_KEYS.map(k => E.CATS[k]).map(c => `<span class="catpill" style="--cc:${c.color}">${c.emoji} ${c.name}</span>`).join('');
    return `<h2>📖 Com es juga</h2>
      <div class="rules">
      <p>Cada jugador tria el seu <b>nivell</b> (${Object.values(E.LEVELS).map(l => l.emoji + ' ' + l.name).join(', ')}) i sempre rep preguntes del seu nivell. Així petits i grans poden competir de tu a tu!</p>
      <div class="cats">${cats}</div>
      <h3>🗺️ Conquesta</h3>
      <ol>
        <li>Cada jugador comença amb una 👑 <b>base</b> en un extrem del mapa.</li>
        <li>Al teu torn pots jugar <b>una carta</b> i després tries una casella que toqui el teu territori.</li>
        <li><b>Casella lliure:</b> respon una pregunta de la seva categoria. Si l'encertes, és teva.</li>
        <li><b>Casella d'un rival:</b> l'ataques. Tots dos responeu; te la quedes si encertes i l'altre falla, o si encerteu tots dos i tu ets més ràpid.</li>
        <li>Tres encerts seguits = una carta de regal 🔥. Cada dues rondes hi ha una <b>pregunta llampec</b> per a tothom: qui l'encerta més de pressa guanya una carta.</li>
        <li>Quan s'acaben les rondes, guanya qui té més punts de territori (1 per casella, 2 per les ⭐).</li>
      </ol>
      <h3>Caselles especials</h3><ul class="deflist">${sq}</ul>
      <h3>Cartes de sabotatge</h3><p>Comences amb 2 cartes i pots tenir-ne 4 com a màxim.</p><ul class="deflist">${cards}</ul>
      <h3>🤓 Modes friki</h3>
      <p>A la sala d'espera, qui crea la partida tria la <b>temàtica</b>: cultura general (per a tots els públics) o un mode friki, on totes les preguntes són d'un sol tema: ${E.FRIKI_KEYS.map(k => E.CATS[k].emoji + ' ' + E.CATS[k].name).join(', ')}, o la 🤓 barreja friki. Serveix per als dos modes de joc.</p>
      <h3>⚡ Repte individual</h3>
      <p>Tothom respon alhora la seva pregunta. Encert = 100 punts + fins a 50 de rapidesa. Amb una ratxa de 3 encerts, +25. L'última pregunta val doble! Cada jugador té un comodí <b>✂️ 50%</b> i una <b>🦑 tinta de calamar</b> per tacar les respostes d'un rival.</p>
      <h3>📶 Jugar en línia</h3>
      <p>Una persona crea la sala i comparteix el codi de 4 lletres (podeu ser de 1 a 6 jugadors). Els altres hi entren des del seu mòbil. Qui crea la sala ha de mantenir la pantalla oberta durant la partida (millor un ordinador o una tauleta).</p>
      </div>
      <button class="btn primary" data-a="close">Entesos!</button>`;
  }

  function cardModal(c, pid, playable) {
    const d = E.CARDS[c];
    const v = A.v;
    let actions = '';
    if (playable) {
      if (d.kind === 'attack' && v.players.length < 2) actions = `<p class="hint">Jugant sol no hi ha ningú a qui fer la guitza 😇</p>`;
      else if (d.kind === 'attack') actions = `<p class="hint">Tria a qui li vols fer la guitza:</p><div class="targets">${v.players.filter(p => p.id !== pid).map(p =>
        `<button class="btn target" style="--pc:${p.color}" data-a="playcard" data-c="${c}" data-pid="${pid}" data-t="${p.id}">${lbl(p)} <small>🚩${p.pos} · 🃏${p.cards.length}</small></button>`).join('')}</div>`;
      else actions = `<button class="btn big primary" data-a="playcard" data-c="${c}" data-pid="${pid}">Jugar la carta</button>`;
    } else if (d.kind === 'passive') actions = `<p class="hint">Aquesta carta funciona sola quan algú t'ataca.</p>`;
    else actions = `<p class="hint">La podràs jugar al teu torn, abans de tirar el dau.</p>`;
    openModal(`<div class="bigcard ${d.kind}"><div class="bce">${d.emoji}</div><h2>${d.name}</h2><p>${d.desc}</p></div>${actions}<button class="btn ghost" data-a="close">Tancar</button>`);
  }

  // ---------------------------------------------------------------- accions de la interfície
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el) { if (e.target.id === 'modal') closeModal(); return; }
    if (el.disabled) return;
    const d = el.dataset;
    Sound.unlock();
    switch (d.a) {
      case 'go':
        if (d.to === 'home') { A.screen = 'home'; A.form.error = null; render(); }
        else if (d.to === 'local') { startLocal(); }
        else { A.form.intent = d.to; A.form.error = null; A.screen = 'profile'; render(); }
        Sound.click();
        break;
      case 'pickav':
        document.querySelectorAll('#pavatars .av').forEach(b => b.classList.toggle('sel', b === el)); Sound.click(); break;
      case 'picklvl':
        document.querySelectorAll('#plevels .lvl').forEach(b => b.classList.toggle('sel', b === el)); Sound.click(); break;
      case 'docreate': case 'dojoin': {
        const name = ($('#pname').value || '').trim();
        const av = ($('#pavatars .sel') || {}).dataset?.av || AVATARS[0];
        const lvl = +(($('#plevels .sel') || {}).dataset?.lvl || 3);
        if (!name) { A.form.error = 'Escriu el teu nom!'; store.set('tp_profile', { name, avatar: av, level: lvl }); render(); return; }
        store.set('tp_profile', { name, avatar: av, level: lvl });
        if (d.a === 'docreate') startHost();
        else {
          const code = ($('#pcode').value || '').trim().toUpperCase();
          if (!/^[A-Z]{4}$/.test(code)) { A.form.error = 'El codi de sala té 4 lletres.'; render(); return; }
          startClient(code);
        }
        break;
      }
      case 'resume': {
        const save = store.get('tp_save2');
        if (!save) return;
        if (save.role === 'local') startLocal(save.S);
        else { A.code = save.code; startHost(save.S); }
        break;
      }
      case 'leave': leave(); break;
      case 'askleave':
        openModal(`<h2>Segur que vols sortir?</h2><p>${A.role === 'host' ? 'Ets l\'amfitrió: si surts, la partida s\'atura per a tothom (la podràs reprendre des de l\'inici).' : A.role === 'local' ? 'Podràs reprendre la partida des de la pantalla d\'inici.' : 'Podràs tornar a entrar amb el mateix codi.'}</p>
          <button class="btn big warn" data-a="leave">Sí, sortir</button><button class="btn ghost" data-a="close">No, continuar jugant</button>`);
        break;
      case 'close': closeModal(); break;
      case 'rules': openModal(rulesHTML()); break;
      case 'mute': Sound.toggle(); const mb = $('#mutebtn'); if (mb) mb.textContent = Sound.muted ? '🔇' : '🔊'; if (A.screen === 'home') render(); break;
      case 'log': {
        const hist = (A.v && A.v.hist) || [];
        const qs = hist.map(h => { const p = player(h.p); const c = E.CATS[h.cat] || {}; return `<div class="hq"><small>${c.emoji || ''} ${p ? p.avatar + ' ' + esc(p.name) : ''} ${h.ok ? '✅' : '❌'}</small><div>${esc(h.q)}</div><b>✔ ${esc(h.a)}</b> ${moreLink(h.q, h.a, 'inline')}</div>`; }).join('');
        openModal(`<h2>📜 Historial</h2>
          <h3>Preguntes que han sortit</h3><div class="loglist">${qs || '<p>Encara no n\'ha sortit cap.</p>'}</div>
          <h3>Què ha passat</h3><div class="loglist">${(A.v ? A.v.log : []).map(l => `<div><span>${l.e}</span> ${esc(l.t)}</div>`).join('') || '<p>Encara res!</p>'}</div><button class="btn primary" data-a="close">Tancar</button>`);
        break;
      }
      case 'share': {
        const url = `${location.origin}${location.pathname}?sala=${A.code}`;
        const text = `Vine a jugar al Sabotrivial! Codi de sala: ${A.code}`;
        if (navigator.share) navigator.share({ title: 'Sabotrivial', text, url }).catch(() => { });
        else { navigator.clipboard && navigator.clipboard.writeText(url); showToastNow('📋', 'Enllaç copiat! Envia\'l a la família'); }
        break;
      }
      case 'cfg': act({ type: 'config', ...Object.assign({}, { mode: A.v.mode, len: A.v.settings.len, rounds: A.v.settings.rounds, time: A.v.settings.time }, { theme: A.v.settings.theme || 'gen' }, { [d.k]: (d.k === 'mode' || d.k === 'theme') ? d.val : +d.val }) }); Sound.click(); break;
      case 'kick': act({ type: 'kick', id: d.id }); break;
      case 'ldav': A.localDraft.avatar = d.av; keepNameAndRender(); break;
      case 'ldlvl': A.localDraft.level = +d.lvl; keepNameAndRender(); break;
      case 'ladd': {
        const name = ($('#lname').value || '').trim();
        if (!name) { $('#lname').focus(); $('#lname').classList.add('shake'); setTimeout(() => $('#lname') && $('#lname').classList.remove('shake'), 500); return; }
        const id = 'L' + Date.now().toString(36) + Math.floor(Math.random() * 99);
        E.addPlayer(A.S, { id, name, avatar: A.localDraft.avatar, level: A.localDraft.level });
        const used = A.S.players.map(p => p.avatar);
        A.localDraft.avatar = AVATARS.find(x => !used.includes(x));
        A.localDraft.name = '';
        Sound.card();
        changed();
        break;
      }
      case 'start': act({ type: 'start' }); break;
      case 'restart': act({ type: 'restart' }); break;
      case 'skip': act({ type: 'skipTurn' }); break;
      case 'roll': act({ type: 'roll' }, A.v.players[A.v.turn].id); break;
      case 'cell': cellModal(+d.i); Sound.click(); break;
      case 'move': closeModal(); act({ type: 'move', cell: +d.i }, A.v.players[A.v.turn].id); break;
      case 'card': cardModal(d.c, d.pid, d.play === '1'); Sound.click(); break;
      case 'playcard': closeModal(); act({ type: 'play', card: d.c, target: d.t || null }, d.pid); break;
      case 'duel': act({ type: 'duel', target: d.id }, A.v.players[A.v.turn].id); break;
      case 'ready': act({ type: 'ready' }, d.pid); break;
      case 'answer':
        el.classList.add('chosen');
        act({ type: 'answer', choice: +d.i }, d.pid); Sound.click(); break;
      case 'fifty': act({ type: 'fifty' }, d.pid); break;
      case 'sqinfo': {
        const s = A.v.board[+d.i];
        const info = s.type === 'cat' ? { emoji: E.CATS[s.cat].emoji, name: E.CATS[s.cat].name, desc: 'Casella de pregunta d\'aquesta categoria.' } : E.SQUARES[s.type];
        const here = A.v.players.filter(p => p.pos === +d.i).map(p => p.avatar).join(' ');
        openModal(`<div class="bigcard"><div class="bce">${info.emoji}</div><h2>Casella ${d.i} · ${info.name}</h2><p>${info.desc}</p>${here ? `<p>Aquí hi ha: ${here}</p>` : ''}</div><button class="btn ghost" data-a="close">Tancar</button>`);
        break;
      }
      case 'inkpick': {
        const throwers = A.v.players.filter(p => isMine(p.id) && p.inkLeft > 0);
        if (throwers.length === 1) inkTargets(throwers[0].id);
        else openModal(`<h2>🦑 Qui llença la tinta?</h2><div class="targets">${throwers.map(p => `<button class="btn target" style="--pc:${p.color}" data-a="inkfrom" data-pid="${p.id}">${lbl(p)}</button>`).join('')}</div><button class="btn ghost" data-a="close">Cancel·lar</button>`);
        break;
      }
      case 'inkfrom': inkTargets(d.pid); break;
      case 'inkto': closeModal(); act({ type: 'ink', target: d.t }, d.pid); break;
    }
  });

  function inkTargets(from) {
    openModal(`<h2>🦑 A qui li taques les respostes?</h2><div class="targets">${A.v.players.filter(p => p.id !== from).map(p => `<button class="btn target" style="--pc:${p.color}" data-a="inkto" data-pid="${from}" data-t="${p.id}">${lbl(p)} <small>⭐${p.score}</small></button>`).join('')}</div><button class="btn ghost" data-a="close">Cancel·lar</button>`);
  }

  function keepNameAndRender() {
    const n = $('#lname') ? $('#lname').value : '';
    render();
    if ($('#lname')) $('#lname').value = n;
    Sound.click();
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'lname') { const b = document.querySelector('[data-a="ladd"]'); b && b.click(); }
    if (e.key === 'Escape') closeModal();
  });

  // mantenir la pantalla encesa durant la partida
  let wl = null;
  async function wakeLock() { try { if ('wakeLock' in navigator && !wl) { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); } } catch (e) { } }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && A.screen === 'game') wakeLock(); });

  // inici
  if (new URLSearchParams(location.search).get('sala')) { A.form.intent = 'join'; A.screen = 'profile'; }
  render();

  // exposat per a proves
  window.__TP = A;
  window.__TPchanged = changed;
})();
