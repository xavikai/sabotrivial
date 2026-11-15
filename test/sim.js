const E = require('../js/engine.js');
let THEME='gen';
function sim(mode, local, seedGames=200){
  let wins={}, turns=0, errs=0, maxSteps=0;
  for(let g=0; g<seedGames; g++){
    const S=E.createState({local, hostId:'a'});
    ['a','b','c','d'].forEach((id,i)=>E.addPlayer(S,{id,name:'P'+id,avatar:'🦊',level:1+(i%3)}));
    E.dispatch(S,'a',{type:'config',mode,len:36,rounds:12,time:25,theme:THEME},0);
    if(S.settings.theme!==THEME) throw 'theme';
    let now=1000; E.dispatch(S,'a',{type:'start'},now);
    let steps=0;
    while(S.phase==='play' && steps<20000){
      steps++; now+=300;
      const cur=S.players[S.turn];
      if(S.step==='pre'){
        if(!S.cardUsed && cur.cards.length && Math.random()<0.5){
          const c=cur.cards.find(c=>E.CARDS[c].kind!=='passive');
          if(c){const t=S.players.find(p=>p!==cur)||cur; E.dispatch(S,cur.id,{type:'play',card:c,target:t.id},now); continue;}
        }
        E.dispatch(S,cur.id,{type:'roll'},now);
      } else if(S.step==='pickDuel'){
        E.dispatch(S,cur.id,{type:'duel',target:S.players.find(p=>p!==cur).id},now);
      } else if(S.step==='ask'){
        for(const pid in S.ask.parts){const pt=S.ask.parts[pid];
          if(pt.start===null) E.dispatch(S,pid,{type:'ready'},now);
          else if(pt.ans===null && Math.random()<0.3){
            const corr=S.secret.ans[S.ask.id+':'+pid];
            const lv=E.CARDS; const p=S.players.find(x=>x.id===pid);
            const ch = Math.random()< [0,0.75,0.7,0.65][p.level] ? corr : [0,1,2,3].filter(i=>!pt.hide.includes(i))[Math.floor(Math.random()*(4-pt.hide.length))];
            if(!E.dispatch(S,pid,{type:'answer',choice:ch},now)) errs++;
          }
          if(mode==='quiz' && Math.random()<0.01) E.dispatch(S,pid,{type:'fifty'},now);
        }
      } else if(S.step==='scores' && Math.random()<0.05){
        E.dispatch(S,'b',{type:'ink',target:'c'},now);
      }
      E.tick(S,now);
      const pv=E.publicView(S); if(pv.secret) throw 'leak';
      if(S.players.some(p=>p.pos<0||p.pos>=S.board.length&&mode==='board')) throw 'pos';
    }
    if(THEME!=='gen'&&S.mode==='board'&&S.board.some(q=>q.type==='cat'&&!E.FRIKI_KEYS.includes(q.cat))) throw 'boardcat';
    if(S.phase!=='end') {console.log('STUCK',S.step,S.next,S.ask&&S.ask.kind); errs++; }
    maxSteps=Math.max(maxSteps,steps);
    wins[S.winner]=(wins[S.winner]||0)+1;
    turns+= (now-1000)/1000;
    // restart
    E.dispatch(S,'a',{type:'restart'},now); if(S.phase!=='lobby') throw 'restart';
  }
  console.log(mode, local?'local':'online', 'wins',JSON.stringify(wins),'avg simulated min',(turns/seedGames/60).toFixed(1),'errs',errs,'maxSteps',maxSteps);
}
for (const th of ['gen','vid','mix']) { THEME=th; console.log('--',th); sim('board',false); sim('board',true); sim('quiz',false); sim('quiz',true); }
