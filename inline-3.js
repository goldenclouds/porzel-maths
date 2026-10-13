
/* ============ Runes: earning, relics, wardrobe, packs ============ */
const RUNE_ICON='<svg class="rune-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l7 5v10l-7 5-7-5V7z" fill="#F2B84B" stroke="#B8862E" stroke-width="1"/><path d="M12 7l3.2 5L12 17l-3.2-5z" fill="#FFF3D6"/></svg>';
const PAW_ICON='<svg viewBox="0 0 24 24"><circle cx="6" cy="9" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="9.5" cy="5" r="2"/><circle cx="14.5" cy="5" r="2"/><path d="M12 11c-3 0-6 3-6 6a3 3 0 0 0 3 3c1.2 0 2-.6 3-.6s1.8.6 3 .6a3 3 0 0 0 3-3c0-3-3-6-6-6z"/></svg>';
const MILESTONES={3:30,7:75,14:150,30:400,50:600,100:1000};
const PACKS=[{id:'pocket',n:150,price:'A$2.99',t:'Pocketful'},{id:'pouch',n:550,price:'A$7.99',t:'Velvet pouch',d:'10% bonus'},{id:'chest',n:1300,price:'A$14.99',t:'Charmed chest',d:'30% bonus',best:true},{id:'vault',n:3400,price:'A$29.99',t:'Moonlit vault',d:'70% bonus'}];
function earn(n,why){if(!n)return 0;if(isPro())n=Math.round(n*1.5);D.runes=(D.runes||0)+n;D.runeLog=(D.runeLog||[]).slice(-60);D.runeLog.push({t:Date.now(),n,why});save();return n}
function runeToast(n,why){toast(`+${n} runes · ${why}`);SFX.step()}
function checkRelics(){const fresh=[];for(const it of ITEMS){if(!it.relic||D.relics[it.id])continue;const [c,m]=it.relic.prog();if(c>=m){D.relics[it.id]=Date.now();if(!D.owned.includes(it.id))D.owned.push(it.id);fresh.push(it.id)}}if(fresh.length)save();return fresh}
function showUnlock(ids){const it=itemById(ids[0]);openSheet(`<div class="unlock"><div class="eyebrow">Relic unlocked <span class="sparkle">✦</span></div><h3>${it.name}</h3><div class="catbox">${catSVG('happy',Object.assign({},D.equipped,{[it.slot]:it.id}))}</div><p style="color:var(--muted);font-size:14px">${it.relic.how}. This one can't be bought — you earned it.</p>
  <div class="btn-row" style="width:100%"><button class="btn ginger" id="eqnow">Wear it</button><button class="btn ghost" id="later">Later</button></div></div>`);
  SFX.done();buzz([40,60,40,60,120]);setTimeout(()=>burstAt($('#sheet .catbox')),200);
  $('#eqnow').onclick=()=>{D.equipped[it.slot]=it.id;save();closeSheet();if(ids.length>1)showUnlock(ids.slice(1));else go(TAB)};
  $('#later').onclick=()=>{closeSheet();if(ids.length>1)showUnlock(ids.slice(1))};}
function openPacks(need){
  openSheet(`<h3>Runes ${RUNE_ICON}</h3>
    <p style="font-size:14px;color:var(--muted)">You have <b class="mono" style="color:var(--text)">${fmt(D.runes)}</b>.${need?` You need <b>${need}</b> more for that.`:''} Runes come from finishing sessions, keeping your streak and levelling up — or top up here.</p>
    <div style="display:flex;flex-direction:column;gap:8px">${PACKS.map(p=>`<button class="pack ${p.best?'best':''}" data-pack="${p.id}"><div class="ic">${RUNE_ICON}</div><div><div class="t">${fmt(p.n)} runes</div><div class="d">${p.t}${p.d?' · '+p.d:''}${p.best?' · most popular':''}</div></div><div class="pr">${p.price}</div></button>`).join('')}</div>
    <div class="demo-note">Prototype build: tapping a pack adds the runes instantly and no payment is taken. The launch version will charge through Stripe on the web and App Store / Google Play billing inside the apps.</div>
    <div class="card" style="padding:12px 14px"><div class="eyebrow" style="margin-bottom:6px">How to earn</div><div style="font-size:13px;color:var(--muted);line-height:1.5">Finish a session +5 (80%+ adds 5, a perfect run adds 10) · Complete the daily workout +25 · Level up +15 · Streak milestones: 3 days 30, 7 days 75, 14 days 150, 30 days 400, 50 days 600, 100 days 1000.</div></div>
    <button class="btn ghost" id="closep">Close</button>`);
  $$('[data-pack]').forEach(b=>b.onclick=()=>{const p=PACKS.find(x=>x.id===b.dataset.pack);earn(p.n,'top-up (demo)');SFX.done();buzz(40);burstAt(b);toast(`+${fmt(p.n)} runes added (demo purchase)`);closeSheet();go(TAB)});
  $('#closep').onclick=closeSheet;
}
let WARD='all';
const SLOT_LABEL={hat:'Hats',face:'Face',neck:'Neck',outfit:'Outfits',aura:'Auras',pin:'Pins',companion:'Companions'};
function viewWardrobe(){
  const cats=[['all','Everything'],['hat','Hats'],['face','Face'],['neck','Neck'],['outfit','Outfits'],['aura','Auras'],['relics','Relics ✦']];
  const list=WARD==='relics'?[]:ITEMS.filter(i=>!i.relic&&(WARD==='all'||i.slot===WARD));
  const relics=ITEMS.filter(i=>i.relic);
  $('#view').innerHTML=`
  <div class="topbar"><h1 style="font-size:26px;font-weight:800">Zell</h1><div class="rune-chip">${RUNE_ICON}<span class="mono">${fmt(D.runes)}</span><button id="getr">+ Get</button></div></div>
  <div class="ward-hero" style="padding-top:6px"><div class="catbox" id="wcat">${catSVG()}</div><div class="stage"></div></div>
  <div class="coach"><div class="bubble top" style="width:100%">${D.owned.length===0?"Everything I wear, you earned. Finish a session and I'll start a rune pouch for you — the bell collar's a good first buy.":pick(["How do I look? Be honest. Actually — don't.","Relics can't be bought with anything. Those are the ones I'm proud of.","Tap me to try things on. I'm patient."])}</div></div>
  <div class="chips">${cats.map(([id,l])=>`<button class="chip ${WARD===id?'on':''}" data-ward="${id}">${l}</button>`).join('')}</div>
  ${WARD==='relics'?`<p style="font-size:13px;color:var(--muted)">Relics are limited to players who meet the condition. No rune price, no shortcut.</p><div style="display:flex;flex-direction:column;gap:8px">${relics.map(relicCard).join('')}</div>`:
  `<div class="grid3">${list.map(itemCard).join('')}</div>
   ${WARD==='all'?`<div class="section-head" style="margin-top:6px"><h2>Relics <span class="sparkle">✦</span></h2><button class="link" data-ward="relics">See all</button></div><div style="display:flex;flex-direction:column;gap:8px">${relics.slice(0,3).map(relicCard).join('')}</div>`:''}`}`;
  $('#getr').onclick=()=>{SFX.tap();openPacks()};
  const cat=$('#wcat .cat');cat.addEventListener('click',()=>{catReact(cat,pick(['wave','excited','happy']),1400);SFX.step();buzz(10)});
  $$('[data-ward]').forEach(b=>b.onclick=()=>{WARD=b.dataset.ward;SFX.tap();viewWardrobe()});
  $$('[data-item]').forEach(b=>b.onclick=()=>itemTap(b.dataset.item));
}
function itemCard(it){const owned=D.owned.includes(it.id),eq=D.equipped[it.slot]===it.id;
  return`<button class="item ${eq?'equipped':''}" data-item="${it.id}"><span class="rar ${it.rar}">${it.rar}</span><div class="catbox">${catSVG('',{[it.slot]:it.id})}</div><div class="n">${it.name}</div><div class="p ${eq?'eq':owned?'own':'buy'}">${eq?'Wearing':owned?'Owned':it.price===0?'Free':RUNE_ICON+fmt(it.price)}</div></button>`}
function relicCard(it){const un=!!D.relics[it.id],[c,m]=it.relic.prog(),eq=D.equipped[it.slot]===it.id;
  return`<button class="relic ${un?'unlocked':'locked'}" data-item="${it.id}"><div class="catbox">${catSVG('',{[it.slot]:it.id})}</div><div class="b"><div class="t">${it.name} ${it.relic.season?'<span class="rar relic" style="position:static;font-size:9px;padding:2px 6px;border-radius:999px;background:linear-gradient(90deg,var(--gold),var(--ginger));color:#221C4A;letter-spacing:.08em;text-transform:uppercase">Season one</span>':''}</div><div class="c">${it.relic.how}</div>${un?'':`<div class="bar"><i style="width:${Math.round(100*c/m)}%"></i></div>`}</div><div class="st">${un?(eq?'Wearing':'Unlocked'):`${fmt(c)} / ${fmt(m)}`}</div></button>`}
function itemTap(id){const it=itemById(id),owned=D.owned.includes(id);
  if(it.relic&&!owned){const [c,m]=it.relic.prog();openSheet(`<div class="unlock"><div class="eyebrow">Relic · not for sale</div><h3>${it.name}</h3><div class="catbox" style="filter:grayscale(1) brightness(.85)">${catSVG('think',{[it.slot]:id})}</div><p style="font-size:14px;color:var(--muted)">${it.relic.how}.</p><div class="relic" style="border:0;padding:0"><div class="b" style="width:100%"><div class="bar" style="height:8px"><i style="width:${Math.round(100*c/m)}%"></i></div><div class="c" style="margin-top:6px">${fmt(c)} of ${fmt(m)}</div></div></div><button class="btn ghost" id="cl">Close</button></div>`);$('#cl').onclick=closeSheet;return}
  if(owned){if(D.equipped[it.slot]===id){delete D.equipped[it.slot];toast(`Took off ${it.name}`)}else{D.equipped[it.slot]=id;toast(`Wearing ${it.name}`);SFX.step();buzz(10)}save();viewWardrobe();return}
  if(it.price>D.runes){SFX.no();buzz(20);openPacks(it.price-D.runes);return}
  openSheet(`<div class="unlock"><div class="eyebrow">${it.rar} · ${SLOT_LABEL[it.slot]}</div><h3>${it.name}</h3><div class="catbox">${catSVG('happy',Object.assign({},D.equipped,{[it.slot]:id}))}</div><p style="font-size:14px;color:var(--muted)">${it.price===0?'Free — Zell insists.':`${fmt(it.price)} runes. You'll have ${fmt(D.runes-it.price)} left.`}</p><div class="btn-row" style="width:100%"><button class="btn" id="buy">${it.price===0?'Take it':'Buy & wear'} ${it.price?RUNE_ICON+fmt(it.price):''}</button><button class="btn ghost" id="cl">Not now</button></div></div>`);
  $('#cl').onclick=closeSheet;
  $('#buy').onclick=()=>{D.runes-=it.price;D.owned.push(id);D.equipped[it.slot]=id;save();SFX.up();buzz([30,40,30]);burstAt($('#sheet .catbox'));setTimeout(()=>{closeSheet();viewWardrobe()},500)};
}
