/*
  Motor del Sabotrivial.
  L'estat el guarda l'amfitrió (o el dispositiu en mode local) i és l'única font de veritat.
  dispatch(S, pid, action, now) i tick(S, now) modifiquen l'estat i retornen true si ha canviat.
*/
(function (root) {
  const QUESTIONS = (typeof module !== 'undefined' && module.exports) ? require('./questions.js') : root.QUESTIONS;

  const CATS = {
    geo: { name: 'Geografia', emoji: '🌍', color: '#2F9BE0' },
    his: { name: 'Història', emoji: '🏰', color: '#E8B21E' },
    cie: { name: 'Ciència i Natura', emoji: '🔬', color: '#2DB36A' },
    art: { name: 'Art i Lletres', emoji: '🎨', color: '#9B59E0' },
    ent: { name: 'Pelis, Música i Jocs', emoji: '🎬', color: '#EE5A9C' },
    esp: { name: 'Esports i Lleure', emoji: '⚽', color: '#F28A30' },
    act: { name: 'Actualitat', emoji: '📰', color: '#16A6A6' },
    vid: { name: 'Videojocs', emoji: '🎮', color: '#7C4DFF', friki: true },
    cin: { name: 'Cinema', emoji: '🍿', color: '#E0443E', friki: true },
    sag: { name: 'Sagues i superherois', emoji: '🦸', color: '#1E88E5', friki: true },
    mus: { name: 'Música', emoji: '🎸', color: '#00A383', friki: true }
  };
  const CAT_KEYS = Object.keys(CATS).filter(k => QUESTIONS[k] && !CATS[k].friki);
  const FRIKI_KEYS = Object.keys(CATS).filter(k => QUESTIONS[k] && CATS[k].friki);
  // Temàtiques de la partida: 'gen' (cultura general), una de friki, o 'mix' (barreja friki)
  const THEMES = { gen: { name: 'Cultura general', emoji: '🌍', desc: 'Per a tots els públics' } };
  for (const k of FRIKI_KEYS) THEMES[k] = { name: CATS[k].name, emoji: CATS[k].emoji, desc: 'Mode friki' };
  if (FRIKI_KEYS.length > 1) THEMES.mix = { name: 'Barreja friki', emoji: '🤓', desc: 'Totes les temàtiques friki' };
  const themeCats = S => { const t = S.settings.theme; return t === 'mix' ? FRIKI_KEYS : FRIKI_KEYS.includes(t) ? [t] : CAT_KEYS; };

  const SQUARES = {
    start: { emoji: '🏁', name: 'Sortida', desc: 'Aquí comença tot.' },
    goal: { emoji: '🏆', name: 'Meta', desc: 'Qui hi arriba primer, guanya!' },
    card: { emoji: '🃏', name: 'Carta', desc: 'Robes una carta de sabotatge.' },
    rocket: { emoji: '🚀', name: 'Coet', desc: 'Avances 3 caselles més.' },
    slide: { emoji: '🍌', name: 'Relliscada', desc: 'Retrocedeixes 3 caselles.' },
    duel: { emoji: '⚔️', name: 'Duel', desc: 'Repta un rival: qui encerti (i més ràpid) avança 2 i l\'altre retrocedeix 2.' },
    quake: { emoji: '🌋', name: 'Terratrèmol', desc: 'Tots els altres retrocedeixen 2 caselles.' },
    swap: { emoji: '🌪️', name: 'Remolí', desc: 'Et canvies de lloc amb qui va primer.' },
    all: { emoji: '📣', name: 'Tothom respon', desc: 'Pregunta per a tothom: qui encerti avança 1.' }
  };

  const CARDS = {
    banana: { emoji: '🍌', name: 'Pell de plàtan', desc: 'Un rival retrocedeix 3 caselles.', kind: 'attack', w: 3 },
    freeze: { emoji: '🧊', name: 'Congelador', desc: 'Un rival perd el seu pròxim torn.', kind: 'attack', w: 2 },
    swap: { emoji: '🔀', name: 'Canvi de lloc', desc: 'T\'intercanvies la posició amb un rival.', kind: 'attack', w: 1 },
    magnet: { emoji: '🧲', name: 'Imant', desc: 'Robes una carta a l\'atzar a un rival.', kind: 'attack', w: 2 },
    bomb: { emoji: '💣', name: 'Pregunta bomba', desc: 'Un rival ha de respondre ara una pregunta més difícil. Si falla, retrocedeix 4.', kind: 'attack', w: 2 },
    dizzy: { emoji: '🌀', name: 'Mareig', desc: 'Un rival veurà la seva pròxima pregunta cap per avall.', kind: 'attack', w: 2 },
    clock: { emoji: '⏱️', name: 'Rellotge boig', desc: 'Un rival només tindrà 8 segons a la pròxima pregunta.', kind: 'attack', w: 2 },
    ink: { emoji: '🦑', name: 'Tinta de calamar', desc: 'Les respostes del rival quedaran tacades de tinta uns segons.', kind: 'attack', w: 2 },
    double: { emoji: '🎲', name: 'Doble dau', desc: 'Aquest torn tires dos daus.', kind: 'self', w: 2 },
    fifty: { emoji: '✂️', name: '50%', desc: 'A la teva pròxima pregunta s\'eliminen dues respostes dolentes.', kind: 'self', w: 2 },
    shield: { emoji: '🛡️', name: 'Escut', desc: 'Passiva: atura automàticament el pròxim atac que rebis.', kind: 'passive', w: 2 },
    mirror: { emoji: '🪞', name: 'Mirall', desc: 'Passiva: el pròxim atac que rebis rebota cap a qui te l\'ha llençat.', kind: 'passive', w: 1 }
  };

  const LEVELS = {
    1: { name: 'Petit', emoji: '🐣', desc: 'Fins a 11 anys' },
    2: { name: 'Mitjà', emoji: '🦊', desc: 'De 12 a 15 anys' },
    3: { name: 'Expert', emoji: '🧠', desc: 'Adults' }
  };

  const COLORS = ['#FF4D4D', '#3D7BFF', '#22B573', '#FFC233', '#A55EEA', '#FF8FCB'];
  const MAX_HAND = 4;
  const MAX_PLAYERS = 6;

  // ---------- utilitats ----------
  const rnd = n => Math.floor(Math.random() * n);
  const pick = arr => arr[rnd(arr.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const P = (S, id) => S.players.find(p => p.id === id);
  const label = p => `${p.avatar} ${p.name}`;
  const last = S => S.board.length - 1;

  function say(S, emoji, text) {
    S.toast = { n: (S.toast ? S.toast.n : 0) + 1, e: emoji, t: text };
    S.log.unshift({ e: emoji, t: text });
    if (S.log.length > 40) S.log.length = 40;
  }

  // ---------- creació ----------
  function createState({ local = false, hostId = null } = {}) {
    return {
      v: 1, local, hostId,
      phase: 'lobby', mode: 'board',
      settings: { len: 36, rounds: 12, time: 25, theme: 'gen' },
      players: [], board: [],
      turn: 0, step: null, until: 0,
      dice: null, target: null, cardUsed: false,
      ask: null, askSeq: 0,
      round: 0, quizCats: [],
      toast: null, log: [], winner: null,
      secret: { used: {}, ans: {} }
    };
  }

  function addPlayer(S, { id, name, avatar, level }) {
    if (S.phase !== 'lobby') return false;
    if (P(S, id)) return false;
    if (S.players.length >= MAX_PLAYERS) return false;
    const used = S.players.map(p => p.color);
    const color = COLORS.find(c => !used.includes(c)) || COLORS[0];
    S.players.push({
      id, name: String(name || 'Jugador').slice(0, 14), avatar: avatar || '🙂', color,
      level: clamp(+level || 2, 1, 3),
      pos: 0, cards: [], frozen: false, eff: {}, streak: 0,
      stats: { ok: 0, n: 0, fast: null }, score: 0, inkLeft: 1, fiftyLeft: 1,
      connected: true
    });
    return true;
  }

  function makeBoard(len, cats = CAT_KEYS) {
    const seq = ['card', 'rocket', 'duel', 'slide', 'card', 'all', 'quake', 'swap', 'card', 'slide', 'duel', 'rocket'];
    const b = [{ type: 'start' }];
    let c = 0, s = 0;
    for (let i = 1; i < len - 1; i++) {
      if (i % 4 === 0) b.push({ type: seq[s++ % seq.length] });
      else b.push({ type: 'cat', cat: cats[c++ % cats.length] });
    }
    b.push({ type: 'goal' });
    // una mica de drama a prop de la meta
    b[len - 3] = { type: 'slide' };
    return b;
  }

  // ---------- preguntes ----------
  function pickQuestion(S, cat, lvl) {
    const pool = QUESTIONS[cat][lvl];
    let free = pool.filter(q => !S.secret.used[q.id]);
    if (!free.length) { pool.forEach(q => delete S.secret.used[q.id]); free = pool; }
    const q = pick(free);
    S.secret.used[q.id] = 1;
    const opts = shuffle([q.a, ...q.w]);
    return { q: q.q, opts, correct: opts.indexOf(q.a) };
  }

  function twoWrong(correct) {
    return shuffle([0, 1, 2, 3].filter(i => i !== correct)).slice(0, 2);
  }

  function startAsk(S, now, kind, pids, o = {}) {
    const cat = o.cat || pick(themeCats(S));
    const ask = { id: ++S.askSeq, kind, cat, parts: {}, order: pids.slice(), reveal: false, by: o.by || null, target: o.target ?? null, double: !!o.double };
    for (const pid of pids) {
      const p = P(S, pid);
      const lvl = clamp(p.level + (o.harder ? 1 : 0), 1, 3);
      const q = pickQuestion(S, cat, lvl);
      const time = p.eff.clock ? 8 : S.settings.time;
      const part = {
        q: q.q, opts: q.opts, lvl, time,
        eff: { dizzy: !!p.eff.dizzy, ink: !!p.eff.ink, clock: !!p.eff.clock },
        hide: p.eff.fifty ? twoWrong(q.correct) : [],
        ans: null, ok: null, ms: null, start: null, deadline: null, pts: 0
      };
      S.secret.ans[ask.id + ':' + pid] = q.correct;
      delete p.eff.dizzy; delete p.eff.ink; delete p.eff.clock; delete p.eff.fifty;
      const autoStart = !S.local || (pids.length === 1 && kind === 'turn');
      if (autoStart) { part.start = now; part.deadline = now + time * 1000; }
      ask.parts[pid] = part;
    }
    S.ask = ask;
    S.step = 'ask';
  }

  function allAnswered(S) { return Object.values(S.ask.parts).every(p => p.ans !== null); }

  function resolveAsk(S, now) {
    const a = S.ask;
    a.reveal = true;
    for (const pid in a.parts) {
      const part = a.parts[pid];
      part.correct = S.secret.ans[a.id + ':' + pid];
      part.ok = part.ans === part.correct;
      const p = P(S, pid);
      p.stats.n++;
      if (part.ok) {
        p.stats.ok++;
        if (p.stats.fast === null || part.ms < p.stats.fast) p.stats.fast = part.ms;
      }
      if (a.kind === 'quiz') {
        if (part.ok) {
          p.streak++;
          const remaining = Math.max(0, part.time * 1000 - part.ms);
          let pts = 100 + Math.round(50 * remaining / (part.time * 1000));
          if (p.streak >= 3) pts += 25;
          if (a.double) pts *= 2;
          part.pts = pts; p.score += pts;
        } else p.streak = 0;
      }
    }
    S.step = 'reveal';
    S.until = now + (a.kind === 'quiz' ? 3800 : 3300);
  }

  // ---------- cartes i atacs ----------
  function drawCard(S, p, why, emoji = '🃏') {
    if (p.cards.length >= MAX_HAND) { say(S, '🃏', `${label(p)} té la mà plena i no pot robar més cartes`); return; }
    const bag = [];
    for (const k in CARDS) for (let i = 0; i < CARDS[k].w; i++) bag.push(k);
    const c = pick(bag);
    p.cards.push(c);
    if (why !== false) say(S, emoji, why || `${label(p)} roba una carta de sabotatge`);
  }

  function removeCard(p, c) { const i = p.cards.indexOf(c); if (i >= 0) { p.cards.splice(i, 1); return true; } return false; }

  // Comprova escuts i miralls. Retorna {victim, gainer} o null si l'atac queda aturat.
  function hit(S, att, tgt, o = {}) {
    if (tgt.cards.includes('mirror')) {
      removeCard(tgt, 'mirror');
      if (o.mirrorAsShield) { say(S, '🪞', `${label(tgt)} treu el mirall i l'atac no li fa res!`); return null; }
      if (att.cards.includes('shield')) {
        removeCard(att, 'shield');
        say(S, '🪞', `${label(tgt)} fa rebotar l'atac amb un mirall... però l'escut de ${label(att)} l'atura!`);
        return null;
      }
      say(S, '🪞', `${label(tgt)} tenia un mirall! L'atac rebota cap a ${label(att)}`);
      return { victim: att, gainer: tgt, reflected: true };
    }
    if (tgt.cards.includes('shield')) {
      removeCard(tgt, 'shield');
      say(S, '🛡️', `${label(tgt)} s'ha protegit amb l'escut. Atac aturat!`);
      return null;
    }
    return { victim: tgt, gainer: att, reflected: false };
  }

  function moveBy(S, p, d) { p.pos = clamp(p.pos + d, 0, last(S)); }

  function checkWin(S, p) {
    if (p.pos >= last(S)) {
      S.phase = 'end'; S.winner = p.id; S.step = null; S.ask = null;
      say(S, '🏆', `${label(p)} arriba a la meta i guanya la partida!`);
      return true;
    }
    return false;
  }

  function applyCard(S, now, me, card, target) {
    const t = target ? P(S, target) : null;
    switch (card) {
      case 'banana': {
        say(S, '🍌', `${label(me)} llença una pell de plàtan a ${label(t)}...`);
        const r = hit(S, me, t); if (!r) return;
        moveBy(S, r.victim, -3);
        say(S, '🍌', `Patacada! ${label(r.victim)} rellisca 3 caselles enrere`);
        return;
      }
      case 'freeze': {
        const r = hit(S, me, t); if (!r) return;
        r.victim.frozen = true;
        say(S, '🧊', `Al congelador! ${label(r.victim)} perd el pròxim torn`);
        return;
      }
      case 'swap': {
        const r = hit(S, me, t, { mirrorAsShield: true }); if (!r) return;
        const a = me.pos; me.pos = t.pos; t.pos = a;
        say(S, '🔀', `${label(me)} i ${label(t)} s'intercanvien el lloc!`);
        return;
      }
      case 'magnet': {
        const r = hit(S, me, t); if (!r) return;
        if (!r.victim.cards.length) { say(S, '🧲', `L'imant no troba res: ${label(r.victim)} no té cartes`); return; }
        if (r.gainer.cards.length >= MAX_HAND) { say(S, '🧲', `${label(r.gainer)} té la mà plena i l'imant no pot robar res`); return; }
        const c = r.victim.cards.splice(rnd(r.victim.cards.length), 1)[0];
        r.gainer.cards.push(c);
        say(S, '🧲', `${label(r.gainer)} roba una carta a ${label(r.victim)} amb l'imant!`);
        return;
      }
      case 'bomb': {
        const r = hit(S, me, t); if (!r) return;
        say(S, '💣', `${label(me)} llança una pregunta bomba a ${label(r.victim)}! Si falla, 4 caselles enrere`);
        startAsk(S, now, 'bomb', [r.victim.id], { harder: true, by: me.id });
        return;
      }
      case 'dizzy': {
        const r = hit(S, me, t); if (!r) return;
        r.victim.eff.dizzy = true;
        say(S, '🌀', `${label(r.victim)} es mareja: veurà la pròxima pregunta cap per avall!`);
        return;
      }
      case 'clock': {
        const r = hit(S, me, t); if (!r) return;
        r.victim.eff.clock = true;
        say(S, '⏱️', `Rellotge boig! ${label(r.victim)} només tindrà 8 segons a la pròxima pregunta`);
        return;
      }
      case 'ink': {
        const r = hit(S, me, t); if (!r) return;
        r.victim.eff.ink = true;
        say(S, '🦑', `Esquitx de tinta de calamar! A ${label(r.victim)} li costarà veure les respostes`);
        return;
      }
      case 'double':
        me.eff.double = true;
        say(S, '🎲', `${label(me)} tirarà dos daus aquest torn!`);
        return;
      case 'fifty':
        me.eff.fifty = true;
        say(S, '✂️', `${label(me)} elimina dues respostes dolentes de la seva pròxima pregunta`);
        return;
    }
  }

  // ---------- torns del taulell ----------
  function beginTurn(S, now) {
    const p = S.players[S.turn];
    S.dice = null; S.target = null; S.cardUsed = false; S.ask = null;
    if (p.frozen) {
      p.frozen = false;
      say(S, '🧊', `${label(p)} encara és dins el congelador i perd el torn`);
      S.step = 'skip'; S.until = now + 2600;
      return;
    }
    S.step = 'pre';
  }

  function nextTurn(S, now) {
    S.turn = (S.turn + 1) % S.players.length;
    beginTurn(S, now);
  }

  function pause(S, now, ms, next) { S.step = 'pause'; S.until = now + ms; S.next = next; }

  function applySquare(S, now, p) {
    const sq = S.board[p.pos];
    switch (sq.type) {
      case 'goal': return checkWin(S, p);
      case 'card': drawCard(S, p, `Casella de carta: ${label(p)} roba una carta de sabotatge`); break;
      case 'rocket':
        moveBy(S, p, 3);
        say(S, '🚀', `Coet! ${label(p)} vola 3 caselles endavant`);
        if (checkWin(S, p)) return true;
        break;
      case 'slide':
        moveBy(S, p, -3);
        say(S, '🍌', `Terra relliscós! ${label(p)} cau de cul i retrocedeix 3 caselles`);
        break;
      case 'duel':
        if (S.players.length < 2) break;
        say(S, '⚔️', `Duel! ${label(p)} ha de triar un rival`);
        S.step = 'pickDuel';
        return true;
      case 'quake': {
        say(S, '🌋', `Terratrèmol! Tothom menys ${label(p)} retrocedeix 2 caselles`);
        for (const o of S.players) {
          if (o === p) continue;
          const r = hit(S, p, o);
          if (r) moveBy(S, r.victim, -2);
        }
        break;
      }
      case 'swap': {
        const others = S.players.filter(o => o !== p);
        const leader = others.sort((a, b) => b.pos - a.pos)[0];
        if (!leader || leader.pos <= p.pos) { say(S, '🌪️', `Remolí... però ${label(p)} ja va primer. No passa res!`); break; }
        const r = hit(S, p, leader, { mirrorAsShield: true });
        if (r) {
          const a = p.pos; p.pos = leader.pos; leader.pos = a;
          say(S, '🌪️', `Remolí! ${label(p)} es canvia de lloc amb ${label(leader)}, que anava primer`);
        }
        break;
      }
      case 'all':
        say(S, '📣', `Pregunta per a tothom! Qui encerti avança 1 casella`);
        pause(S, now, 1800, { k: 'askAll' });
        return true;
    }
    return false;
  }

  function afterAsk(S, now) {
    const a = S.ask;
    if (a.kind === 'quiz') {
      S.step = 'scores'; S.until = now + 5500;
      return;
    }
    const cur = S.players[S.turn];
    if (a.kind === 'turn') {
      const part = a.parts[cur.id];
      S.ask = null;
      if (part.ok) {
        cur.streak++;
        cur.pos = S.target;
        say(S, '✅', `${label(cur)} encerta i avança fins a la casella ${cur.pos}`);
        if (cur.streak % 3 === 0) drawCard(S, cur, `Tres encerts seguits! ${label(cur)} guanya una carta`, '🔥');
        if (checkWin(S, cur)) return;
        // deixem que el moviment s'animi abans de l'efecte de la casella
        pause(S, now, 1500, { k: 'square' });
      } else {
        cur.streak = 0;
        say(S, '❌', part.ans === -1 ? `Temps esgotat! ${label(cur)} es queda on és` : `${label(cur)} falla i es queda on és`);
        pause(S, now, 1500, { k: 'next' });
      }
      return;
    }
    if (a.kind === 'bomb') {
      const pid = a.order[0], v = P(S, pid), part = a.parts[pid];
      S.ask = null;
      if (part.ok) {
        say(S, '💪', `${label(v)} desactiva la bomba! Com a premi, roba una carta`);
        drawCard(S, v, false);
      } else {
        moveBy(S, v, -4);
        say(S, '💥', `BOOM! ${label(v)} falla la pregunta bomba i retrocedeix 4 caselles`);
      }
      pause(S, now, 1500, { k: 'pre' });
      return;
    }
    if (a.kind === 'duel') {
      const [x, y] = a.order.map(id => P(S, id));
      const px = a.parts[x.id], py = a.parts[y.id];
      S.ask = null;
      let win = null, lose = null;
      if (px.ok && !py.ok) { win = x; lose = y; }
      else if (py.ok && !px.ok) { win = y; lose = x; }
      else if (px.ok && py.ok) { if (px.ms <= py.ms) { win = x; lose = y; } else { win = y; lose = x; } }
      if (!win) { say(S, '🤝', `Ningú guanya el duel. Tothom es queda quiet`); pause(S, now, 1500, { k: 'next' }); return; }
      moveBy(S, win, 2); moveBy(S, lose, -2);
      say(S, '⚔️', `${label(win)} guanya el duel${px.ok && py.ok ? ' per velocitat' : ''}! Avança 2, i ${label(lose)} retrocedeix 2`);
      drawCard(S, win, false);
      if (checkWin(S, win)) return;
      pause(S, now, 1800, { k: 'next' });
      return;
    }
    if (a.kind === 'all') {
      S.ask = null;
      const oks = a.order.map(id => ({ p: P(S, id), part: a.parts[id] })).filter(o => o.part.ok).sort((m, n) => m.part.ms - n.part.ms);
      if (!oks.length) { say(S, '🙈', `Ningú ha encertat la pregunta per a tothom!`); pause(S, now, 1500, { k: 'next' }); return; }
      oks.forEach(o => moveBy(S, o.p, 1));
      drawCard(S, oks[0].p, false);
      say(S, '📣', `${oks.map(o => o.p.avatar).join(' ')} avancen 1 casella. ${label(oks[0].p)} ha respost més de pressa i guanya una carta!`);
      for (const o of oks) if (checkWin(S, o.p)) return;
      pause(S, now, 1800, { k: 'next' });
    }
  }

  function runNext(S, now) {
    const n = S.next; S.next = null;
    const cur = S.players[S.turn];
    switch (n.k) {
      case 'next': return nextTurn(S, now);
      case 'pre': S.step = 'pre'; return;
      case 'square':
        if (applySquare(S, now, cur)) return; // la casella ha obert una altra fase
        return pause(S, now, 1600, { k: 'next' });
      case 'askAll':
        return startAsk(S, now, 'all', S.players.map(p => p.id));
      case 'ask': {
        const sq = S.board[S.target];
        return startAsk(S, now, 'turn', [cur.id], { cat: sq.type === 'cat' ? sq.cat : null });
      }
    }
  }

  // ---------- repte individual ----------
  function nextQuizRound(S, now) {
    S.round++;
    if (S.round > S.settings.rounds) return endQuiz(S);
    const cat = S.quizCats[(S.round - 1) % S.quizCats.length];
    startAsk(S, now, 'quiz', S.players.map(p => p.id), { cat, double: S.round === S.settings.rounds });
  }

  function endQuiz(S) {
    const sorted = S.players.slice().sort((a, b) => b.score - a.score || b.stats.ok - a.stats.ok);
    S.phase = 'end'; S.winner = sorted[0].id; S.step = null; S.ask = null;
    say(S, '🏆', `${label(sorted[0])} guanya el repte amb ${sorted[0].score} punts!`);
  }

  // ---------- inici / reinici ----------
  function resetPlayers(S) {
    for (const p of S.players) {
      Object.assign(p, { pos: 0, cards: [], frozen: false, eff: {}, streak: 0, stats: { ok: 0, n: 0, fast: null }, score: 0, inkLeft: 1, fiftyLeft: 1 });
    }
  }

  function startGame(S, now) {
    resetPlayers(S);
    S.players = shuffle(S.players);
    S.log = []; S.winner = null; S.ask = null; S.round = 0; S.next = null;
    S.phase = 'play';
    if (S.mode === 'board') {
      S.board = makeBoard(S.settings.len, themeCats(S));
      for (const p of S.players) { drawCard(S, p, false); drawCard(S, p, false); }
      S.turn = 0;
      say(S, '🎲', `Comença la partida! L'ordre l'ha decidit l'atzar: comença ${label(S.players[0])}`);
      beginTurn(S, now);
    } else {
      S.board = [];
      S.quizCats = shuffle(themeCats(S));
      say(S, '⚡', `Comença el repte! ${S.settings.rounds} preguntes, i l'última val doble`);
      S.step = 'intro'; S.until = now + 2500;
    }
  }

  // ---------- accions ----------
  function dispatch(S, pid, a, now) {
    const me = P(S, pid);
    const isHost = S.local || pid === S.hostId;
    const cur = S.players[S.turn];
    if (!me && !['config', 'kick', 'start', 'restart', 'skipTurn'].includes(a.type)) return false;
    const myTurn = me && cur && cur.id === pid && S.phase === 'play' && S.mode === 'board';

    switch (a.type) {
      case 'config':
        if (!isHost || S.phase !== 'lobby') return false;
        if (a.mode === 'board' || a.mode === 'quiz') S.mode = a.mode;
        if ([24, 36, 48].includes(+a.len)) S.settings.len = +a.len;
        if ([6, 12, 18].includes(+a.rounds)) S.settings.rounds = +a.rounds;
        if ([15, 25, 40].includes(+a.time)) S.settings.time = +a.time;
        if (THEMES[a.theme]) S.settings.theme = a.theme;
        return true;
      case 'kick':
        if (!isHost || S.phase !== 'lobby' || a.id === S.hostId) return false;
        S.players = S.players.filter(p => p.id !== a.id);
        return true;
      case 'profile':
        if (!me || S.phase !== 'lobby') return false;
        if (a.name) me.name = String(a.name).slice(0, 14);
        if (a.avatar) me.avatar = a.avatar;
        if (a.level) me.level = clamp(+a.level, 1, 3);
        return true;
      case 'start':
        if (!isHost || S.phase !== 'lobby' || S.players.length < 1) return false;
        startGame(S, now);
        return true;
      case 'restart':
        if (!isHost || S.phase === 'lobby') return false;
        resetPlayers(S);
        Object.assign(S, { phase: 'lobby', step: null, ask: null, board: [], winner: null, log: [], next: null, toast: null });
        return true;
      case 'skipTurn':
        if (!isHost || S.phase !== 'play' || S.mode !== 'board') return false;
        if (!['pre', 'pickDuel'].includes(S.step)) return false;
        say(S, '⏭️', `Saltem el torn de ${label(cur)}`);
        nextTurn(S, now);
        return true;

      case 'play': {
        if (!myTurn || S.step !== 'pre' || S.cardUsed) return false;
        const def = CARDS[a.card];
        if (!def || def.kind === 'passive' || !me.cards.includes(a.card)) return false;
        if (def.kind === 'attack') {
          const t = P(S, a.target);
          if (!t || t === me) return false;
        }
        removeCard(me, a.card);
        S.cardUsed = true;
        applyCard(S, now, me, a.card, a.target);
        return true;
      }
      case 'roll': {
        if (!myTurn || S.step !== 'pre') return false;
        const d1 = 1 + rnd(6), d2 = me.eff.double ? 1 + rnd(6) : null;
        delete me.eff.double;
        S.dice = d2 ? [d1, d2] : [d1];
        S.target = Math.min(me.pos + d1 + (d2 || 0), last(S));
        S.step = 'rolling'; S.until = now + 1900; S.next = { k: 'ask' };
        return true;
      }
      case 'duel': {
        if (!myTurn || S.step !== 'pickDuel') return false;
        const t = P(S, a.target);
        if (!t || t === me) return false;
        say(S, '⚔️', `${label(me)} repta ${label(t)} a un duel!`);
        startAsk(S, now, 'duel', [me.id, t.id]);
        return true;
      }
      case 'ready': { // mode local: el jugador agafa el mòbil i comença el seu compte enrere
        const part = S.ask && !S.ask.reveal && S.ask.parts[pid];
        if (!part || part.start !== null) return false;
        part.start = now; part.deadline = now + part.time * 1000;
        return true;
      }
      case 'answer': {
        const part = S.ask && !S.ask.reveal && S.ask.parts[pid];
        if (!part || part.ans !== null || part.start === null) return false;
        const c = +a.choice;
        if (!(c >= 0 && c < 4) || part.hide.includes(c)) return false;
        part.ans = c; part.ms = now - part.start;
        if (allAnswered(S)) resolveAsk(S, now);
        return true;
      }
      case 'fifty': { // repte: comodí 50% un cop per partida
        const part = S.ask && !S.ask.reveal && S.ask.parts[pid];
        if (S.mode !== 'quiz' || !part || part.ans !== null || part.hide.length || me.fiftyLeft < 1) return false;
        me.fiftyLeft--;
        part.hide = twoWrong(S.secret.ans[S.ask.id + ':' + pid]);
        return true;
      }
      case 'ink': { // repte: tinta de calamar un cop per partida, entre preguntes
        if (S.mode !== 'quiz' || !['scores', 'reveal', 'intro'].includes(S.step) || me.inkLeft < 1) return false;
        const t = P(S, a.target);
        if (!t || t === me) return false;
        me.inkLeft--;
        t.eff.ink = true;
        say(S, '🦑', `${label(me)} esquitxa tinta de calamar a ${label(t)}!`);
        return true;
      }
    }
    return false;
  }

  function tick(S, now) {
    if (S.phase !== 'play') return false;
    let changed = false;
    if (S.step === 'ask' && S.ask && !S.ask.reveal) {
      for (const pid in S.ask.parts) {
        const part = S.ask.parts[pid];
        if (part.ans === null && part.deadline !== null && now >= part.deadline) {
          part.ans = -1; part.ms = part.time * 1000; changed = true;
        }
      }
      if (allAnswered(S)) { resolveAsk(S, now); changed = true; }
      return changed;
    }
    if (S.until && now >= S.until) {
      const step = S.step;
      S.until = 0;
      if (step === 'reveal') afterAsk(S, now);
      else if (step === 'scores' || step === 'intro') nextQuizRound(S, now);
      else if (step === 'skip') nextTurn(S, now);
      else if (step === 'rolling' || step === 'pause') runNext(S, now);
      return true;
    }
    return false;
  }

  // Vista pública: sense respostes secretes
  function publicView(S) {
    const c = JSON.parse(JSON.stringify(S));
    delete c.secret;
    return c;
  }

  const api = { CATS, CAT_KEYS, FRIKI_KEYS, THEMES, SQUARES, CARDS, LEVELS, COLORS, MAX_PLAYERS, createState, addPlayer, dispatch, tick, publicView, makeBoard };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof window !== 'undefined' ? window : globalThis);
