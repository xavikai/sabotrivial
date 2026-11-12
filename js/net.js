/*
  Xarxa amb PeerJS (WebRTC). L'amfitrió crea una sala amb un codi i els altres s'hi connecten.
  No cal cap servidor propi: PeerJS fa servir el seu servidor públic només per presentar els navegadors.
*/
(function (root) {
  const PREFIX = 'trivial-punyeta-cat-v1-';
  const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

  function randomCode() { let s = ''; for (let i = 0; i < 4; i++) s += ALPHA[Math.floor(Math.random() * ALPHA.length)]; return s; }

  function peerOk() { return typeof Peer !== 'undefined'; }

  // ---------------- AMFITRIÓ ----------------
  class Host {
    constructor({ onHello, onAction, onLeave, onStatus }) {
      this.h = { onHello, onAction, onLeave, onStatus };
      this.conns = new Map(); // conn.peer -> {conn, pid}
      this.code = null;
    }

    start(code, tries = 0) {
      return new Promise((resolve, reject) => {
        if (!peerOk()) return reject(new Error('No s\'ha pogut carregar PeerJS. Revisa la connexió a internet.'));
        const c = code || randomCode();
        const peer = new Peer(PREFIX + c, { debug: 1 });
        let opened = false;
        peer.on('open', () => { opened = true; this.peer = peer; this.code = c; resolve(c); });
        peer.on('error', err => {
          if (!opened && err.type === 'unavailable-id') {
            peer.destroy();
            if (code && tries < 6) return setTimeout(() => this.start(code, tries + 1).then(resolve, reject), 2500); // reprendre sala: esperem que s'alliberi
            if (!code) return this.start(null, tries + 1).then(resolve, reject);
            return reject(new Error('El codi de sala està ocupat.'));
          }
          if (!opened) return reject(new Error('No s\'ha pogut crear la sala (' + err.type + ').'));
          this.h.onStatus && this.h.onStatus('error', err.type);
        });
        peer.on('disconnected', () => { this.h.onStatus && this.h.onStatus('reconnecting'); setTimeout(() => { try { peer.reconnect(); } catch (e) { } }, 1000); });
        peer.on('connection', conn => this.attach(conn));
      });
    }

    attach(conn) {
      const entry = { conn, pid: null };
      this.conns.set(conn, entry);
      conn.on('data', msg => {
        if (!msg || typeof msg !== 'object') return;
        if (msg.t === 'hello') { entry.pid = msg.pid; this.h.onHello(entry, msg); }
        else if (msg.t === 'act' && entry.pid) this.h.onAction(entry.pid, msg.a);
        else if (msg.t === 'ping') { try { conn.send({ t: 'pong' }); } catch (e) { } }
      });
      const gone = () => {
        if (!this.conns.has(conn)) return;
        this.conns.delete(conn);
        if (entry.pid && ![...this.conns.values()].some(x => x.pid === entry.pid)) this.h.onLeave(entry.pid);
      };
      conn.on('close', gone);
      conn.on('error', gone);
    }

    send(entry, msg) { try { if (entry.conn.open) entry.conn.send(msg); } catch (e) { } }
    broadcast(msg) { for (const e of this.conns.values()) if (e.pid) this.send(e, msg); }
    destroy() { try { this.peer && this.peer.destroy(); } catch (e) { } }
  }

  // ---------------- CONVIDAT ----------------
  class Client {
    constructor({ onMessage, onStatus }) {
      this.h = { onMessage, onStatus };
      this.closed = false;
    }

    join(code, hello) {
      this.code = code.toUpperCase(); this.hello = hello;
      return new Promise((resolve, reject) => {
        if (!peerOk()) return reject(new Error('No s\'ha pogut carregar PeerJS. Revisa la connexió a internet.'));
        this.peer = new Peer({ debug: 1 });
        let first = true;
        this.peer.on('open', () => this.connect(first ? resolve : null, first ? reject : null));
        this.peer.on('error', err => {
          if (err.type === 'peer-unavailable') {
            if (first) { first = false; reject(new Error('No hi ha cap sala amb el codi ' + this.code + '.')); }
            else this.retry();
          } else if (first) { first = false; reject(new Error('Error de connexió (' + err.type + ').')); }
          else this.h.onStatus('reconnecting');
        });
        this.peer.on('disconnected', () => { if (!this.closed) setTimeout(() => { try { this.peer.reconnect(); } catch (e) { } }, 1000); });
        setTimeout(() => { if (first) { first = false; reject(new Error('La connexió tarda massa. Comprova el codi i torna-ho a provar.')); } }, 15000);
        this._first = () => { const f = first; first = false; return f; };
      });
    }

    connect(resolve, reject) {
      const conn = this.peer.connect(PREFIX + this.code, { reliable: true });
      this.conn = conn;
      conn.on('open', () => {
        conn.send(Object.assign({ t: 'hello' }, this.hello));
        this.h.onStatus('online');
        if (resolve && this._first()) resolve();
        clearInterval(this.pinger);
        this.pinger = setInterval(() => { try { conn.send({ t: 'ping' }); } catch (e) { } }, 8000);
      });
      conn.on('data', msg => this.h.onMessage(msg));
      conn.on('close', () => { clearInterval(this.pinger); if (!this.closed) this.retry(); });
      conn.on('error', () => { if (!this.closed) this.retry(); });
    }

    retry() {
      if (this.closed || this.retrying) return;
      this.retrying = true;
      this.h.onStatus('reconnecting');
      setTimeout(() => { this.retrying = false; if (!this.closed && this.peer && !this.peer.destroyed) this.connect(); }, 2000);
    }

    send(msg) { try { if (this.conn && this.conn.open) { this.conn.send(msg); return true; } } catch (e) { } return false; }
    destroy() { this.closed = true; clearInterval(this.pinger); try { this.peer && this.peer.destroy(); } catch (e) { } }
  }

  root.Net = { Host, Client, randomCode };
})(window);
