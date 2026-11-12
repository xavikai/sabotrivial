// Peer fals per a proves: comunica pestanyes del mateix navegador amb BroadcastChannel
(function(){
  const bc = new BroadcastChannel('fakepeer');
  const peers = {};
  function Emitter(){ this._h={}; }
  Emitter.prototype.on=function(e,f){(this._h[e]=this._h[e]||[]).push(f);return this;};
  Emitter.prototype.emit=function(e,...a){(this._h[e]||[]).forEach(f=>f(...a));};
  class Conn extends Emitter{ constructor(me,other,cid){super();this.me=me;this.peer=other;this.cid=cid;this.open=false;}
    send(d){bc.postMessage({k:'data',to:this.peer,from:this.me.id,cid:this.cid,d:JSON.parse(JSON.stringify(d))});}
    close(){bc.postMessage({k:'close',to:this.peer,from:this.me.id,cid:this.cid});this.open=false;this.emit('close');} }
  class Peer extends Emitter{
    constructor(id){ super(); if(typeof id!=='string') id='anon-'+Math.random().toString(36).slice(2); this.id=id; this.conns={}; this.destroyed=false;
      const claim = ()=>{ peers[id]=this; this.emit('open',id); };
      setTimeout(claim, 50);
      bc.addEventListener('message', ev=>this._msg(ev.data)); }
    _msg(m){ if(this.destroyed||m.to!==this.id) return;
      if(m.k==='connect'){ const c=new Conn(this,m.from,m.cid); this.conns[m.cid]=c; this.emit('connection',c); c.open=true; setTimeout(()=>c.emit('open'),10); bc.postMessage({k:'accept',to:m.from,from:this.id,cid:m.cid}); }
      else if(m.k==='accept'){ const c=this.conns[m.cid]; if(c){c.open=true;c.emit('open');} }
      else if(m.k==='data'){ const c=this.conns[m.cid]; if(c) c.emit('data',m.d); }
      else if(m.k==='close'){ const c=this.conns[m.cid]; if(c){c.open=false;c.emit('close');} } }
    connect(id){ const cid=Math.random().toString(36).slice(2); const c=new Conn(this,id,cid); this.conns[cid]=c; bc.postMessage({k:'connect',to:id,from:this.id,cid}); return c; }
    reconnect(){} destroy(){ this.destroyed=true; Object.values(this.conns).forEach(c=>c.open&&c.close()); }
  }
  window.Peer=Peer;
})();
