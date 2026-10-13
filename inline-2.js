
/* ============ Icons ============ */
const ICON={
  home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  train:'<svg viewBox="0 0 24 24"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
  learn:'<svg viewBox="0 0 24 24"><path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/></svg>',
  puzzle:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/></svg>',
  stats:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>',
  flame:'<svg viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 1-3s.5 2 2 2c0-3 1-6 2-10z"/></svg>',
  chev:'<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
  x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  del:'<svg viewBox="0 0 24 24"><path d="M21 6H8l-5 6 5 6h13a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM17 9l-6 6M11 9l6 6"/></svg>',
  gear:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  stop:'<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>',
};

/* ============ Router & chrome ============ */
const TABS=[['home','Home'],['train','Train'],['learn','Learn'],['puzzles','Puzzles'],['tally','Zell stats'],['stats','Stats']];
let TAB='home';
function renderTabs(){$('#tabs').innerHTML=TABS.map(([id,l])=>`<button class="${TAB===id?'on':''}" data-tab="${id}" aria-label="${l}">${id==='tally'?PAW_ICON:ICON[id==='puzzles'?'puzzle':id]}<span>${l}</span></button>`).join('');}
function go(tab){TAB=tab;renderTabs();$('#tabs').classList.remove('hidden');$('#view').classList.remove('session');$('#view').classList.toggle('home-view',tab==='home');window.scrollTo(0,0);({home:viewHome,train:viewTrain,learn:viewLearn,puzzles:viewPuzzles,tally:viewWardrobe,stats:viewStats})[tab]();}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b){SFX.tap();buzz(8);go(b.dataset.tab)}});
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}
function openSheet(html){$('#sheet .panel').innerHTML=html;$('#sheet').classList.add('open')}
function closeSheet(){$('#sheet').classList.remove('open')}
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
document.addEventListener('pointerdown',()=>{SFX.c()},{once:true,capture:true});

const accuracy=()=>D.answered?Math.round(100*D.correct/D.answered):0;
const today=()=>dayKey();
const dailyState=()=>D.daily[today()]||{};
const pips=l=>`<div class="pips">${Array.from({length:10},(_,i)=>`<i class="${i<l?'on':''}"></i>`).join('')}</div>`;

function openSettings(){
  const s=D.settings;const tg=(k,t,d)=>`<div class="setrow"><div><div class="t">${t}</div><div class="d">${d}</div></div><button class="toggle ${s[k]?'on':''}" data-set="${k}" role="switch" aria-checked="${s[k]}" aria-label="${t}"></button></div>`;
  openSheet(`<h3>Settings</h3>
    ${tg('sound','Sounds','Key taps, right and wrong, level changes')}
    ${tg('haptic','Vibration','Light taps on Android; iPhones ignore web vibration')}
    ${tg('motion','Animation','Confetti, bounces and Zell’s idle movement')}
    <div class="setrow"><div><div class="t">Theme</div><div class="d">Follows your device by default</div></div>
      <div class="seg" style="width:190px">${['system','light','dark'].map(t=>`<button data-theme="${t}" class="${s.theme===t?'on':''}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div></div>
    <div class="setrow"><div><div class="t">Your name</div><div class="d">So Zell can say hello properly</div></div><input id="nm" value="${esc(D.name)}" placeholder="Optional" style="font:inherit;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--surface-2);color:var(--text);width:130px"></div>
    <div class="setrow"><div><div class="t">Porzel Maths Pro</div><div class="d">${proState()==='free'?'Free plan':proState()==='trial'?`Trial · ${proDaysLeft()} day${proDaysLeft()===1?'':'s'} left`:proState()==='bonus'?`Referral Pro · ${proDaysLeft()} days left`:proState()==='active'?`${PRO[D.pro.plan]?.label||'Pro'} · renews in ${proDaysLeft()} days`:'Trial ended'}</div></div><button class="btn sm ${isPro()?'ghost':''}" id="manage">${isPro()&&D.pro.status!=='bonus'?'Manage':'Go Pro'}</button></div>
    <div class="setrow"><div><div class="t">Invite friends</div><div class="d">Code ${refCode()} · a week of Pro per friend</div></div><button class="btn sm ghost" id="invite">Share</button></div>
    <button class="btn ghost" id="closeset">Done</button>`);
  $('#manage').onclick=()=>{if(isPro()&&D.pro.status!=='bonus'){if(confirm('Cancel Porzel Maths Pro? You keep access until the current period ends. (Prototype)')){cancelPro();closeSheet();toast('Pro will not renew');go(TAB)}}else openPaywall()};
  $('#invite').onclick=()=>openReferral();
  $$('[data-set]').forEach(b=>b.onclick=()=>{s[b.dataset.set]=!s[b.dataset.set];b.classList.toggle('on');b.setAttribute('aria-checked',s[b.dataset.set]);save();applySettings();SFX.tap();buzz(8)});
  $$('[data-theme]').forEach(b=>b.onclick=()=>{s.theme=b.dataset.theme;save();applySettings();$$('[data-theme]').forEach(x=>x.classList.toggle('on',x===b))});
  $('#nm').oninput=e=>{D.name=e.target.value.trim().slice(0,20);save()};
  $('#closeset').onclick=()=>{closeSheet();go(TAB)};
}

/* ============ Home ============ */
function viewHome(){
  $('#view').classList.add('home-view');
  const ds=dailyState(),done=['sprint','tech','puzzle'].filter(k=>ds[k]).length;
  const weak=weakestSkill(),tod=techOfDay();
  $('#view').innerHTML=`
  <div class="topbar home-topbar"><div class="wordmark">Num<span>era</span></div>
    <div class="tb-right"><div class="streak-chip ${D.streak>=3?'hot':''}" title="Day streak">${ICON.flame}<span class="mono">${D.streak}</span></div><button class="rune-chip" data-go="tally" title="Runes">${RUNE_ICON}<span class="mono">${fmt(D.runes)}</span></button>${proChip()}<button class="iconbtn" id="settings" aria-label="Settings">${ICON.gear}</button></div></div>
  <section class="hero home-hero"><div class="stars"></div>
    <div class="hero-top"><div class="txt"><div class="eyebrow">Today's workout</div><h2>${done===3?'All three done.':done?`${3-done} to go`:'Three blocks · about 5 min'}</h2><div class="sub" style="font-size:13px;opacity:.75;margin-top:4px">${done===3?'Come back tomorrow to keep the streak alive.':'Finish all three to bank today.'}</div></div>
      <div class="ring" style="--p:${Math.round(done/3*100)}"><i class="mono">${done}/3</i></div>
      <div class="catbox">${catSVG(done===3?'sleepy':'')}</div></div>
    <div class="bubble top" id="greet">${TALLY.greet()}</div>
    <div class="workout">
      <button class="wo ${ds.sprint?'done':''}" data-start='{"mode":"sprint","skill":"${weak}","secs":60,"daily":"sprint"}'><div class="num mono">${ds.sprint?'✓':'1'}</div><div><div class="t">60-second sprint · ${SKILLS[weak].name}</div><div class="d">Your weakest skill right now, Lv ${D.skills[weak].lvl}</div></div><div class="go">${ICON.chev}</div></button>
      <button class="wo ${ds.tech?'done':''}" data-lesson="${tod.id}"><div class="num mono">${ds.tech?'✓':'2'}</div><div><div class="t">Technique of the day</div><div class="d">${tod.title} · <span class="mono">${tod.ex}</span></div></div><div class="go">${ICON.chev}</div></button>
      <button class="wo ${ds.puzzle?'done':''}" data-start='{"mode":"puzzle","n":5,"daily":"puzzle"}'><div class="num mono">${ds.puzzle?'✓':'3'}</div><div><div class="t">5 number patterns</div><div class="d">Sequence puzzles, Lv ${D.puzzles.lvl}</div></div><div class="go">${ICON.chev}</div></button>
    </div>
  </section>
  <div class="stat-strip home-stats">
    <div class="stat"><div class="v mono">${fmt(D.xp)}</div><div class="l">XP</div></div>
    <div class="stat"><div class="v mono">${accuracy()}%</div><div class="l">Accuracy</div></div>
    <div class="stat"><div class="v mono">${D.bestStreak}</div><div class="l">Best streak</div></div>
  </div>
  <button class="card home-shortcut wardrobe-shortcut" data-go="tally" style="display:flex;align-items:center;gap:12px;text-align:left;width:100%"><div class="catbox" style="width:54px">${catSVG()}</div><div style="flex:1"><div style="font-weight:800">Zell's wardrobe</div><div style="font-size:13px;color:var(--muted)">${D.owned.length} item${D.owned.length===1?'':'s'} collected · ${Object.keys(D.relics).length} of ${ITEMS.filter(i=>i.relic).length} relics</div></div><span style="color:var(--muted)">${ICON.chev}</span></button>
  ${!isPro()?`<button class="card procard" data-pro><div class="pc-l"><div class="eyebrow" style="color:rgba(255,255,255,.75)">Porzel Maths Pro</div><div class="t">Unlimited training, all 12 techniques, 1.5× runes</div><div class="d">${D.pro.trialUsed?'Subscribe from A$4.17/month':'Try it free for 3 days'} · ${FREE_SESSIONS_PER_DAY-Math.min(FREE_SESSIONS_PER_DAY,freeUsedToday())} free session${FREE_SESSIONS_PER_DAY-Math.min(FREE_SESSIONS_PER_DAY,freeUsedToday())===1?'':'s'} left today</div></div><span class="go">${ICON.chev}</span></button>`:''}
  <button class="card home-shortcut invite-shortcut" id="refcard" style="display:flex;align-items:center;gap:12px;text-align:left;width:100%"><div style="width:38px;height:38px;border-radius:12px;background:var(--gold-soft);display:grid;place-items:center;flex:none;color:var(--gold)">✦</div><div style="flex:1"><div style="font-weight:800">Invite a friend, get a week of Pro</div><div style="font-size:13px;color:var(--muted)">Your code <span class="mono">${refCode()}</span> · ${D.referrals||0} joined</div></div><span style="color:var(--muted)">${ICON.chev}</span></button>
  <div class="section-head"><h2>Quick drill</h2><button class="link" data-go="train">All skills</button></div>
  <div class="grid2">${['add','mul','pct','sq'].map(skillCard).join('')}</div>`;
  $$('[data-pro]').forEach(b=>b.onclick=()=>{SFX.tap();openPaywall()});
  $('#refcard').onclick=()=>{SFX.tap();openReferral()};
  $('#settings').onclick=()=>{SFX.tap();openSettings()};
  const cat=$('.hero .cat');cat.addEventListener('click',()=>{catReact(cat,'wave',1400);SFX.step();buzz(10);$('#greet').innerHTML=pick(["Hello! Ready when you are.","Tap a block and let's go.","Purr. I mean — let's train."])});
  bindCommon();
}
function skillCard(id){const s=D.skills[id];return`<button class="skill" style="--sk:var(--sk-${id})" data-skill="${id}"><div class="sym mono">${SKILLS[id].sym}</div><div><div class="n">${SKILLS[id].name}</div><div class="lv">Level <span class="mono">${s.lvl}</span> · ${s.answered?Math.round(100*s.correct/s.answered)+'% right':'not started'}</div></div>${pips(s.lvl)}</button>`}

/* ============ Train ============ */
let TRAIN_MODE='sprint';
function viewTrain(){
  $('#view').innerHTML=`
  <div class="topbar"><h1 style="font-size:26px;font-weight:800">Train</h1></div>
  <div class="seg" role="tablist"><button class="${TRAIN_MODE==='sprint'?'on':''}" data-mode="sprint">60-second sprint</button><button class="${TRAIN_MODE==='set'?'on':''}" data-mode="set">20 questions</button></div>
  <div class="coach"><div class="catbox">${catSVG('think')}</div><div class="bubble">${TRAIN_MODE==='sprint'?'As many as you can before the clock runs out. Speed and accuracy both count.':'A fixed set at your own pace — the timer only watches, it never stops you.'} Levels move on their own: seven of eight right, at pace, and you go up.</div></div>
  <div class="grid2">
    ${SKILL_IDS.map(skillCard).join('')}
    <button class="skill" style="--sk:var(--sk-mix);grid-column:span 2" data-skill="mix"><div style="display:flex;align-items:center;gap:12px"><div class="sym mono">∑</div><div><div class="n">Mixed</div><div class="lv">Every skill, each at its own level</div></div></div></button>
  </div>`;
  $$('.seg button').forEach(b=>b.onclick=()=>{TRAIN_MODE=b.dataset.mode;SFX.tap();viewTrain()});
  bindCommon();
}
function bindCommon(){
  $$('[data-skill]').forEach(b=>b.onclick=()=>{const sk=b.dataset.skill;SFX.tap();buzz(8);if(TAB==='home')TRAIN_MODE='sprint';startSession(TRAIN_MODE==='sprint'?{mode:'sprint',skill:sk,secs:60}:{mode:'set',skill:sk,n:20})});
  $$('[data-start]').forEach(b=>b.onclick=()=>{SFX.tap();buzz(8);startSession(JSON.parse(b.dataset.start))});
  $$('[data-lesson]').forEach(b=>b.onclick=()=>{SFX.tap();buzz(8);viewLesson(b.dataset.lesson,b.closest('.wo')?'tech':null)});
  $$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
}

/* ============ Learn ============ */
function viewLearn(){
  $('#view').innerHTML=`
  <div class="topbar"><h1 style="font-size:26px;font-weight:800">Techniques</h1></div>
  <div class="coach"><div class="catbox">${catSVG()}</div><div class="bubble">Each trick is a two-minute walkthrough — I'll take you through it step by step — then a ten-question drill built only from numbers where the trick works.</div></div>
  <div style="display:flex;flex-direction:column;gap:8px">
  ${TECH.map((t,i)=>{const s=D.techniques[t.id]||{};const acc=s.answered?Math.round(100*s.correct/s.answered):null;const locked=techLocked(t,i);
    return`<button class="tech ${locked?'locked':''}" data-lesson="${t.id}"><div class="ex mono">${t.ex}</div><div class="b"><div class="t">${t.title}${i===TECH.indexOf(techOfDay())&&i>=FREE_TECH&&!isPro()?' <span class="tod">today · free</span>':''}</div><div class="s">${t.blurb}</div></div><div class="m">${locked?`<span class="lock">${LOCK_ICON} Pro</span>`:acc===null?(s.opened?'seen':'new'):`<b class="mono">${acc}%</b>${s.answered} drilled`}</div></button>`}).join('')}
  </div>`;
  bindCommon();
}
const techLocked=(t,i)=>!isPro()&&i>=FREE_TECH&&t.id!==techOfDay().id;
let DEMO_TIMER=null;
function viewLesson(id,daily){
  if(techLocked(techById(id),TECH.findIndex(t=>t.id===id))){openPaywall('tech');return}
  const t=techById(id),frames=DEMO[id];D.techniques[id]=Object.assign({opened:true,answered:0,correct:0},D.techniques[id]||{},{opened:true});save();
  clearTimeout(DEMO_TIMER);
  $('#view').innerHTML=`
  <button class="back" id="back">${ICON.back} ${daily?'Home':'Techniques'}</button>
  <div class="lesson">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><div class="eyebrow">Technique</div><h1 style="font-size:26px;font-weight:800;margin-top:4px">${t.title}</h1><p style="color:var(--muted);margin-top:6px">${t.blurb}</p></div>
</div>
    <div class="coach"><div class="catbox" id="lcat">${catSVG()}</div><div class="bubble" id="say"></div></div>
    <div class="demo"><div class="board" id="board"></div>
      <div class="demo-foot"><div class="demo-nav"><button id="prev">Back</button><div class="dots" id="dots"></div><button id="auto" aria-label="Play all steps">${ICON.play}</button><button class="primary" id="next">Next</button></div></div></div>
    <div class="card"><div class="eyebrow" style="margin-bottom:10px">In short</div><ol class="steps">${t.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol></div>
    <button class="btn ginger" id="drill">Drill it — 10 questions</button>
  </div>`;
  let i=0,auto=false;const cat=$('#lcat .cat');
  function show(k){i=k;$('#board').innerHTML=frames[i].b;$('#say').innerHTML=frames[i].say;$('#say').style.animation='none';void $('#say').offsetWidth;$('#say').style.animation='';
    $('#dots').innerHTML=frames.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('');$('#prev').disabled=i===0;$('#next').textContent=i===frames.length-1?'Again':'Next';
    SFX.step();buzz(6);catReact(cat,i===frames.length-1?'happy':'think',i===frames.length-1?1600:900);
    if(auto){DEMO_TIMER=setTimeout(()=>{if(i<frames.length-1)show(i+1);else{auto=false;$('#auto').innerHTML=ICON.play}},3400)}}
  $('#next').onclick=()=>{auto=false;$('#auto').innerHTML=ICON.play;show((i+1)%frames.length)};
  $('#prev').onclick=()=>{auto=false;$('#auto').innerHTML=ICON.play;if(i>0)show(i-1)};
  $('#auto').onclick=()=>{auto=!auto;$('#auto').innerHTML=auto?ICON.stop:ICON.play;if(auto)show(i===frames.length-1?0:i);else clearTimeout(DEMO_TIMER)};
  $('#back').onclick=()=>go(daily?'home':'learn');
  $('#drill').onclick=()=>{SFX.tap();buzz(8);startSession({mode:'tech',tech:id,n:10,daily:daily||undefined})};
  show(0);
}

/* ============ Puzzles ============ */
function viewPuzzles(){
  const p=D.puzzles,acc=p.answered?Math.round(100*p.correct/p.answered):null;
  $('#view').innerHTML=`
  <div class="topbar"><h1 style="font-size:26px;font-weight:800">Number patterns</h1></div>
  <div class="coach"><div class="catbox">${catSVG('think')}</div><div class="bubble">Find the rule, type the next term. Rules start with plain adding and grow into squares, primes, two sequences braided together, and recurrences like "double and add one".</div></div>
  <div class="card raised" style="display:flex;flex-direction:column;gap:10px;--sk:var(--sk-mix)">
    <div class="eyebrow">Example</div>
    <div class="mono" style="font-size:26px;font-weight:700;letter-spacing:-.01em">3,  7,  15,  31,  63,  ?</div>
    <p style="font-size:14px;color:var(--muted)">Each term doubles and adds one — so the next is 127.</p>
  </div>
  <div class="stat-strip">
    <div class="stat"><div class="v mono">${p.lvl}</div><div class="l">Level</div></div>
    <div class="stat"><div class="v mono">${acc===null?'–':acc+'%'}</div><div class="l">Accuracy</div></div>
    <div class="stat"><div class="v mono">${p.answered}</div><div class="l">Solved</div></div>
  </div>
  <div style="--sk:var(--sk-mix)">${pips(p.lvl)}</div>
  <div class="btn-row"><button class="btn" data-start='{"mode":"puzzle","n":5}'>5 puzzles</button><button class="btn ghost" data-start='{"mode":"puzzle","n":10}'>10 puzzles ${isPro()?'':LOCK_ICON}</button></div>`;
  bindCommon();
}
