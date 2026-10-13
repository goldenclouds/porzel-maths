
/* ============ Session engine ============ */
let S=null,timerI=null,fbT=null;
function startSession(cfg){
  if(!canStart(cfg))return;
  closeSheet();
  S={cfg,i:0,correct:0,wrong:0,times:[],xp:0,cur:null,input:'',qStart:0,lvlNotes:[],misses:[],done:false,locked:false,hintShown:false,startedAt:Date.now(),left:cfg.secs||0,run:0,bestRun:0};
  $('#tabs').classList.add('hidden');$('#view').classList.add('session');window.scrollTo(0,0);
  renderSession();nextQ();
  if(cfg.mode==='sprint'){timerI=setInterval(()=>{S.left--;$('#prog i').style.width=(S.left/cfg.secs*100)+'%';$('#tleft').textContent=S.left+'s';if(S.left===10){SFX.step()}if(S.left<=0)endSession()},1000)}
}
function sessionLabelFor(c){if(c.mode==='puzzle')return'Number patterns';if(c.mode==='tech')return techById(c.tech).title;return c.skill==='mix'?'Mixed drill':SKILLS[c.skill].name}
function renderSession(){
  const c=S.cfg,total=c.n||0;
  $('#view').innerHTML=`
  <div class="sess">
    <div class="sess-head"><button class="x" id="quit" aria-label="Quit">${ICON.x}</button><div class="tag" id="tag">${sessionLabelFor(c)}</div><div class="score mono"><b id="sc">0</b>${total?` / ${total}`:''}${c.mode==='sprint'?` · <span id="tleft">${c.secs}s</span>`:''}</div><div class="catbox" id="scat">${catSVG()}</div></div>
    <div class="prog ${c.mode==='sprint'?'timer':''}" id="prog"><i style="width:${c.mode==='sprint'?100:0}%"></i></div>
    <div class="qwrap" id="qwrap"><div class="kind" id="kind"></div><div class="q mono" id="q"></div><div class="ans mono" id="ans"><span class="caret"></span></div><div class="fb" id="fb"></div></div>
    <div class="keypad" id="kp">${[7,8,9,4,5,6,1,2,3].map(n=>`<button class="key mono" data-k="${n}">${n}</button>`).join('')}<button class="key fn mono" data-k="-">−</button><button class="key mono" data-k="0">0</button><button class="key fn" data-k="del" aria-label="Delete">${ICON.del}</button><button class="key go" data-k="go">Enter</button></div>
  </div>`;
  $('#quit').onclick=()=>{if(S.i>0&&!S.done)endSession(true);else{clearInterval(timerI);const t=backTab();S=null;go(t)}};
  $('#kp').addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();key(b.dataset.k)});
}
function backTab(){const m=S?S.cfg.mode:'home';return m==='puzzle'?'puzzles':m==='tech'?'learn':'train'}
function nextQ(){
  const c=S.cfg;let q,kind;
  if(c.mode==='puzzle'){q=genPuzzle(D.puzzles.lvl);kind=`Pattern · Lv ${D.puzzles.lvl}`}
  else if(c.mode==='tech'){const t=techById(c.tech);q=t.gen(techLevel(c.tech));kind=`${t.title} · Lv ${techLevel(c.tech)}`}
  else{const sk=c.skill==='mix'?pick(SKILL_IDS):c.skill;q=GEN[sk](D.skills[sk].lvl);q.sk=sk;kind=`${SKILLS[sk].name} · Lv ${D.skills[sk].lvl}`}
  S.cur=q;S.input='';S.hintShown=false;S.locked=false;
  $('#kind').textContent=kind;
  const qe=$('#q');qe.className='q mono'+(q.text?' text':'')+(q.q.length>14&&!q.text?' long':'');qe.textContent=q.q;
  $('#qwrap').className='qwrap';$('#fb').className='fb';$('#fb').textContent='';
  $('.hintbtn')?.remove();
  if(q.hint){const h=document.createElement('button');h.className='hintbtn';h.textContent='Hint';h.onclick=()=>{$('#fb').textContent=q.hint;S.hintShown=true;h.remove();SFX.tap()};$('#qwrap').appendChild(h)}
  drawAns();S.qStart=performance.now();
}
function drawAns(){$('#ans').innerHTML=[...S.input].map(ch=>`<span class="ch">${ch}</span>`).join('')+'<span class="caret"></span>'}
function flashKey(k){const b=$(`#kp [data-k="${k}"]`);if(b){b.classList.add('down');setTimeout(()=>b.classList.remove('down'),90)}}
function key(k){
  if(!S||S.done||S.locked)return;
  if(k==='go'){submit();return}
  SFX.tap(k==='del'?'del':'num');buzz(6);flashKey(k);
  if(k==='del'){S.input=S.input.slice(0,-1)}
  else if(k==='-'){if(!S.input)S.input='-';else if(S.input==='-')S.input=''}
  else if(S.input.replace('-','').length<7)S.input+=k;
  drawAns();
}
document.addEventListener('keydown',e=>{
  if(!S||$('#sheet').classList.contains('open'))return;
  if(/^[0-9]$/.test(e.key))key(e.key);else if(e.key==='Backspace')key('del');else if(e.key==='Enter')key('go');else if(e.key==='-')key('-');else if(e.key==='Escape')$('#quit')?.click();else return;
  e.preventDefault();
});
function noteLvl(name,from,to){const n=S.lvlNotes.find(x=>x.name===name);if(n){n.to=to}else S.lvlNotes.push({name,from,to})}
function submit(){
  if(S.input===''||S.input==='-')return;
  const val=parseInt(S.input,10),q=S.cur,ok=val===q.a,t=(performance.now()-S.qStart)/1000;
  S.locked=true;S.i++;S.times.push(t);
  let lvl,target,rec,name;
  if(S.cfg.mode==='puzzle'){rec=D.puzzles;lvl=rec.lvl;target=puzzleTarget(lvl);name='Patterns'}
  else if(S.cfg.mode==='tech'){rec=D.techniques[S.cfg.tech]=Object.assign({opened:true,answered:0,correct:0},D.techniques[S.cfg.tech]||{});lvl=techLevel(S.cfg.tech);target=8}
  else{rec=D.skills[q.sk];lvl=rec.lvl;target=targetSecs(q.sk,lvl);name=SKILLS[q.sk].name}
  rec.answered++;D.answered++;D.days[today()]=(D.days[today()]||0)+1;
  const cat=$('#scat .cat'),w=$('#qwrap'),fb=$('#fb');
  if(ok){rec.correct++;D.correct++;S.correct++;S.run++;S.bestRun=Math.max(S.bestRun,S.run);let gain=(S.cfg.mode==='puzzle'?20:10)+2*lvl;const quick=t<target/2&&!S.hintShown;if(quick)gain+=5;S.xp+=gain;D.xp+=gain;
    SFX.ok();buzz(30);catReact(cat,'excited',700);if(quick||S.run%5===0)burstAt(w)}
  else{S.wrong++;S.run=0;S.misses.push({q:q.q,you:val,a:q.a,rule:q.rule||q.hint||''});SFX.no();buzz([50,40,50]);catReact(cat,'oops',1300)}
  let lvlChange=0;
  if(rec.recent){rec.recent.push({ok,t});if(rec.recent.length>12)rec.recent.shift();
    const last=rec.recent.slice(-8);
    if(last.length===8){const okc=last.filter(x=>x.ok).length,avg=last.reduce((s,x)=>s+x.t,0)/8;
      if(okc>=7&&avg<=target&&rec.lvl<10){rec.lvl++;rec.recent=[];noteLvl(name,rec.lvl-1,rec.lvl);lvlChange=1}
      else if(okc<=4&&rec.lvl>1){rec.lvl--;rec.recent=[];noteLvl(name,rec.lvl+1,rec.lvl);lvlChange=-1}}}
  save();
  $('#sc').textContent=S.correct;
  if(S.cfg.n)$('#prog i').style.width=(S.i/S.cfg.n*100)+'%';
  w.className='qwrap '+(ok?'ok':'no');fb.className='fb '+(ok?'ok':'no');
  fb.textContent=ok?(t<target/2?pick(['Quick!','Snap.','Fast hands.']):S.run>=5?`${S.run} in a row`:'Correct'):`Answer: ${fmt(q.a)}${q.rule?' — '+q.rule:''}`;
  $('.hintbtn')?.remove();
  if(lvlChange>0){earn(15,'level up');setTimeout(()=>{SFX.up();toast(`Level up — ${name} Lv ${rec.lvl} · +15 runes`);burstAt(w)},380)}else if(lvlChange<0){setTimeout(()=>{SFX.down();toast(`Easing off — ${name} Lv ${rec.lvl}`)},380)}
  const finished=S.cfg.n&&S.i>=S.cfg.n;
  fbT=setTimeout(()=>{if(!S||S.done)return;if(finished)endSession();else nextQ()},ok?480:(q.rule?2400:1400));
}
function endSession(quit){
  if(!S||S.done)return;S.done=true;clearInterval(timerI);clearTimeout(fbT);
  const n=S.i,c=S.correct,avg=n?S.times.reduce((a,b)=>a+b,0)/n:0,p=n?Math.round(100*c/n):0;
  const notes=[];let complete=false,streakNote=null;const runesGot=[];
  if(n>0){
    const tk=today();
    if(D.lastDay!==tk){const y=new Date();y.setDate(y.getDate()-1);D.streak=D.lastDay===dayKey(y)?D.streak+1:1;D.lastDay=tk;D.bestStreak=Math.max(D.bestStreak,D.streak);streakNote=D.streak===1?'Streak started — come back tomorrow to make it 2.':`Day ${D.streak} of your streak.`;notes.push({cls:'gold',txt:streakNote})}
    if(S.cfg.daily&&!quit){D.daily[tk]=Object.assign({},D.daily[tk]||{},{[S.cfg.daily]:true});const ds=D.daily[tk];if(ds.sprint&&ds.tech&&ds.puzzle){complete=true;notes.push({cls:'gold',txt:'Workout complete for today.'})}}
    D.sessions.push({d:Date.now(),m:S.cfg.mode,l:sessionLabelFor(S.cfg),n,c,avg:Math.round(avg*10)/10,xp:S.xp});if(D.sessions.length>200)D.sessions.shift();
    if(!quit){let r=5;if(p>=80)r+=5;if(p===100)r+=10;runesGot.push([earn(r,'session'),'for finishing']);
      if(S.cfg.mode==='set'&&c===n&&n>=20){const lv=S.cfg.skill==='mix'?Math.min(...SKILL_IDS.map(i=>D.skills[i].lvl)):D.skills[S.cfg.skill].lvl;if(lv>=5){D.perfectSets=(D.perfectSets||0)+1}}}
    if(!quit&&!S.cfg.daily&&!isPro()){D.freeUse[tk]=(D.freeUse[tk]||0)+1}
    if(complete)runesGot.push([earn(25,'workout'),'for the full workout']);
    for(const m of Object.keys(MILESTONES)){if(D.streak>=+m&&!D.milestones[m]){D.milestones[m]=true;runesGot.push([earn(MILESTONES[m],'streak '+m),`for a ${m}-day streak`])}}
    save();
  }
  const fresh=n>0?checkRelics():[];
  S.lvlNotes.filter(x=>x.from!==x.to).forEach(x=>notes.push({cls:x.to>x.from?'up':'down',txt:`${x.name} ${x.to>x.from?'moved up to':'eased back to'} level ${x.to} (from ${x.from})`}));
  const cfg=S.cfg,misses=S.misses,xp=S.xp,bestRun=S.bestRun;S=null;
  const line=n?TALLY.result(p,cfg.mode):'Stopped before the first answer — no harm done.';
  $('#view').innerHTML=`
  <div class="res">
    <div class="bigscore"><div class="eyebrow">${quit?'Stopped early':cfg.mode==='sprint'?'Time':'Done'} · ${esc(sessionLabelFor(cfg))}</div>
      <div class="n mono" style="margin-top:10px">${c}<small> / ${n}</small></div>
      <div class="l">${p}% accuracy · <span class="mono">${avg.toFixed(1)}s</span> per answer · <span class="mono">+${xp}</span> XP${bestRun>=5?` · best run <span class="mono">${bestRun}</span>`:''}</div></div>
    <div class="coach"><div class="catbox" id="rcat">${catSVG(p>=80?'happy':p>=60?'':'oops')}</div><div class="bubble">${line}</div></div>
    ${runesGot.map(([r,w])=>`<div class="note gold">${RUNE_ICON} <b class="mono">+${r}</b>&nbsp;runes ${w}${isPro()?' <span style="opacity:.7">(1.5× Pro)</span>':''}</div>`).join('')}
    ${!isPro()&&freeUsedToday()>=FREE_SESSIONS_PER_DAY?`<button class="note" data-pro style="width:100%;text-align:left;border:1px dashed var(--accent);background:var(--accent-soft);color:var(--accent)">${LOCK_ICON} That's today's free sessions — the daily workout is always open. Try Porzel Maths Pro free for 3 days →</button>`:''}
    ${notes.map(x=>`<div class="note ${x.cls}">${x.txt}</div>`).join('')}
    ${misses.length?`<div class="card"><div class="eyebrow" style="margin-bottom:8px">Worth another look</div><div class="miss">${misses.map(m=>`<div class="row"><span class="mono">${esc(m.q)}</span><span><span class="w mono">${fmt(m.you)}</span><span class="r mono">${fmt(m.a)}</span></span>${m.rule?`<div class="rule">${esc(m.rule)}</div>`:''}</div>`).join('')}</div></div>`:''}
    <div class="btn-row"><button class="btn" id="again">Again</button><button class="btn ghost" id="home">Home</button></div>
  </div>`;
  if(n>0){if(p>=80||complete){SFX.done();setTimeout(()=>burstAt($('.bigscore')),150)}buzz(complete?[40,60,40,60,120]:[40])}
  $('#again').onclick=()=>{SFX.tap();startSession(cfg)};
  $('#home').onclick=()=>{SFX.tap();go('home')};
  $$('[data-pro]').forEach(b=>b.onclick=()=>openPaywall());
  if(fresh.length)setTimeout(()=>showUnlock(fresh),900);
}

/* ============ Stats ============ */
function viewStats(){
  const days=[];const now=new Date();const start=new Date(now);start.setDate(now.getDate()-83);
  for(let i=0;i<84;i++){const dd=new Date(start);dd.setDate(start.getDate()+i);days.push(dayKey(dd))}
  const offset=(start.getDay()+6)%7;
  const cells=Array(offset).fill(null).concat(days).slice(0,84);
  const lvlOf=n=>!n?'':n<15?'l1':n<40?'l2':'l3';
  const ss=D.sessions.slice(-20);
  $('#view').innerHTML=`
  <div class="topbar"><h1 style="font-size:26px;font-weight:800">Progress</h1><div class="streak-chip ${D.streak>=3?'hot':''}">${ICON.flame}<span class="mono">${D.streak}</span></div></div>
  <div class="stat-strip">
    <div class="stat"><div class="v mono">${fmt(D.answered)}</div><div class="l">Answered</div></div>
    <div class="stat"><div class="v mono">${accuracy()}%</div><div class="l">Accuracy</div></div>
    <div class="stat"><div class="v mono">${fmt(D.xp)}</div><div class="l">XP</div></div>
  </div>
  <div class="card"><div class="section-head" style="margin-bottom:10px"><h2>Last 12 weeks</h2><span style="font-size:12px;color:var(--muted)">questions per day</span></div>
    <div class="heat">${cells.map(k=>k?`<i class="${lvlOf(D.days[k])} ${k===today()?'today':''}" title="${k}: ${D.days[k]||0}"></i>`:'<i style="visibility:hidden"></i>').join('')}</div></div>
  <div class="card"><div class="section-head" style="margin-bottom:12px"><h2>Levels</h2><span style="font-size:12px;color:var(--muted)">of 10</span></div>
    <div class="lvl-list">${SKILL_IDS.map(id=>`<div class="lvl-row" style="--sk:var(--sk-${id})"><span>${SKILLS[id].name}</span><div class="bar"><i style="width:${D.skills[id].lvl*10}%"></i></div><span class="v mono">${D.skills[id].lvl}</span></div>`).join('')}
    <div class="lvl-row" style="--sk:var(--sk-mix)"><span>Patterns</span><div class="bar"><i style="width:${D.puzzles.lvl*10}%"></i></div><span class="v mono">${D.puzzles.lvl}</span></div></div></div>
  <div class="card"><div class="section-head" style="margin-bottom:8px"><h2>Recent sessions</h2><span style="font-size:12px;color:var(--muted)">last ${ss.length}</span></div>
    ${ss.length>1?`<canvas class="spark" id="spark" width="800" height="240"></canvas><div class="legend" style="margin-top:6px"><span><i style="background:var(--accent)"></i>accuracy %</span><span><i style="background:var(--ginger)"></i>seconds per answer</span></div>`:''}
    <div class="hist" style="margin-top:8px">${ss.length?ss.slice().reverse().slice(0,8).map(s=>`<div class="row"><div><div>${esc(s.l)}</div><div class="d">${new Date(s.d).toLocaleDateString('en-AU',{day:'numeric',month:'short'})} · ${s.m==='sprint'?'sprint':s.m==='set'?'20 set':s.m==='puzzle'?'patterns':'drill'}</div></div><span class="mono">${s.c}/${s.n}</span><span class="mono" style="color:var(--muted)">${s.avg}s</span></div>`).join(''):'<div class="empty">No sessions yet — your first sprint will show up here.</div>'}</div></div>`;
  if(ss.length>1)drawSpark(ss);
}
function drawSpark(ss){
  const cv=$('#spark'),ctx=cv.getContext('2d'),W=cv.width,H=cv.height,cs=getComputedStyle(document.documentElement);
  const acc=cs.getPropertyValue('--accent').trim(),gold=cs.getPropertyValue('--ginger').trim(),line=cs.getPropertyValue('--line').trim(),muted=cs.getPropertyValue('--muted').trim();
  const P={l:44,r:44,t:16,b:28},n=ss.length,x=i=>P.l+(W-P.l-P.r)*i/(n-1);
  const maxT=Math.max(5,...ss.map(s=>s.avg));
  ctx.clearRect(0,0,W,H);ctx.strokeStyle=line;ctx.lineWidth=1;ctx.font='20px Chivo Mono, monospace';ctx.fillStyle=muted;
  [0,50,100].forEach(v=>{const y=P.t+(H-P.t-P.b)*(1-v/100);ctx.beginPath();ctx.moveTo(P.l,y);ctx.lineTo(W-P.r,y);ctx.stroke();ctx.textAlign='right';ctx.fillText(v,P.l-8,y+7)});
  ctx.textAlign='left';ctx.fillText(maxT.toFixed(0)+'s',W-P.r+8,P.t+7);ctx.fillText('0s',W-P.r+8,H-P.b+7);
  const plot=(get,col,max)=>{ctx.beginPath();ss.forEach((s,i)=>{const y=P.t+(H-P.t-P.b)*(1-get(s)/max);i?ctx.lineTo(x(i),y):ctx.moveTo(x(i),y)});ctx.strokeStyle=col;ctx.lineWidth=4;ctx.lineJoin='round';ctx.stroke();
    const s=ss[n-1],y=P.t+(H-P.t-P.b)*(1-get(s)/max);ctx.fillStyle=col;ctx.beginPath();ctx.arc(x(n-1),y,7,0,7);ctx.fill()};
  plot(s=>s.avg,gold,maxT);plot(s=>s.n?100*s.c/s.n:0,acc,100);
}

/* ============ Starfield ============ */
const SKY={stars:[],t:0,init(){const cv=$('#sky');const fit=()=>{cv.width=innerWidth;cv.height=innerHeight;this.stars=Array.from({length:Math.round(innerWidth*innerHeight/14000)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:.6+Math.random()*1.4,p:Math.random()*6.28,s:.4+Math.random()*1.2}))};fit();addEventListener('resize',fit);this.loop()},
  loop(){const cv=$('#sky'),ctx=cv.getContext('2d');const draw=()=>{this.t+=.04;ctx.clearRect(0,0,cv.width,cv.height);const col=getComputedStyle(document.documentElement).getPropertyValue('--star').trim()||'#fff';ctx.fillStyle=col;for(const s of this.stars){const a=D.settings.motion?.25+.55*(.5+.5*Math.sin(this.t*s.s+s.p)):.5;ctx.globalAlpha=a*.7;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill()}ctx.globalAlpha=1;setTimeout(()=>requestAnimationFrame(draw),D.settings.motion?90:2000)};draw()}};
/* ============ Init ============ */
load();applySettings();SKY.init();captureRef();
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!S&&!$('#sheet').classList.contains('open'))go(TAB)});
go('home');
