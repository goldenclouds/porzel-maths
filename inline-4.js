
/* ============ Porzel Maths Pro: free vs subscription, 3-day trial, referrals ============ */
const PRO={monthly:{label:'Monthly',price:'A$7.99',per:'/month'},yearly:{label:'Yearly',price:'A$49.99',per:'/year',note:'save 48%'}};
const DAY=864e5,FREE_SESSIONS_PER_DAY=3,FREE_TECH=4;
const LOCK_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
function proState(){const p=D.pro;if(!p)return'free';if(['trial','bonus','active'].includes(p.status)&&p.until&&p.until<Date.now()){p.status=(p.status==='bonus'&&!p.trialUsed)?'free':'expired';save()}return p.status}
const isPro=()=>['trial','bonus','active'].includes(proState());
const proDaysLeft=()=>D.pro&&D.pro.until?Math.max(0,Math.ceil((D.pro.until-Date.now())/DAY)):0;
function refCode(){if(!D.refCode){D.refCode='ZELL-'+Math.random().toString(36).slice(2,7).toUpperCase();save()}return D.refCode}
function refLink(){return location.origin+location.pathname+'?ref='+refCode()}
function addProDays(days,why){const now=Date.now();const p=D.pro;const base=(p.until&&p.until>now)?p.until:now;p.until=base+days*DAY;if(!['trial','active'].includes(p.status))p.status='bonus';p.bonusDays=(p.bonusDays||0)+days;save();toast(`+${days} days of Porzel Maths Pro · ${why}`);SFX.up()}
function startTrial(plan){const p=D.pro;p.plan=plan;p.trialUsed=true;p.status='trial';p.until=Date.now()+3*DAY;p.startedAt=Date.now();save();
  // referral credit (prototype: recorded locally; the launch build credits the referrer server-side)
  if(D.referredBy&&!D.referralCredited){D.referralCredited=true;save()}}
function subscribe(plan){const p=D.pro;p.plan=plan;p.status='active';p.until=Date.now()+(plan==='yearly'?365:30)*DAY;save()}
function cancelPro(){const p=D.pro;p.status=p.until&&p.until>Date.now()?p.status:'expired';p.cancelled=true;save()}
let PLAN='yearly';
function openPaywall(reason){
  const p=D.pro,st=proState(),trialOk=!p.trialUsed;
  const why={sessions:`You've used today's ${FREE_SESSIONS_PER_DAY} free sessions outside the workout.`,tech:'Techniques 5–12 are part of Porzel Maths Pro.',puzzles:'Ten-puzzle sets are part of Porzel Maths Pro.'}[reason]||'';
  openSheet(`<div class="unlock" style="gap:10px"><div class="eyebrow">Porzel Maths Pro <span class="sparkle">✦</span></div><h3>Train without limits</h3>
    <div class="catbox" style="width:120px">${catSVG('happy',Object.assign({},D.equipped,{hat:D.equipped.hat||'wizard'}))}</div>
    ${why?`<p style="font-size:14px;color:var(--muted)">${why}</p>`:''}
    <div class="card" style="width:100%;text-align:left;padding:12px 14px"><div class="benefits">
      <div><b>Unlimited</b> sprints, sets and puzzles</div><div>All <b>12 techniques</b> with animated walkthroughs</div><div><b>10-puzzle</b> sets and harder pattern families</div><div><b>1.5× runes</b> on everything you earn</div><div>Future <b>leagues &amp; leaderboards</b> first</div></div></div>
    <div class="seg" style="width:100%">${Object.entries(PRO).map(([k,v])=>`<button data-plan="${k}" class="${PLAN===k?'on':''}">${v.label}<br><span style="font-size:12px;font-weight:600;color:var(--muted)">${v.price}${v.per}${v.note?' · '+v.note:''}</span></button>`).join('')}</div>
    <button class="btn ginger" id="gopro">${trialOk?'Start 3-day free trial':st==='expired'?'Subscribe to Porzel Maths Pro':'Subscribe'}</button>
    <p style="font-size:12px;color:var(--muted)">${trialOk?`Free for 3 days, then ${PRO[PLAN].price}${PRO[PLAN].per}. Cancel any time before the trial ends and you won't be charged.`:`${PRO[PLAN].price}${PRO[PLAN].per}, cancel any time.`}</p>
    <div class="demo-note" style="width:100%">Prototype build: no payment is taken — the trial and subscription are simulated so you can see the flow. The launch version bills through the App Store, Google Play or Stripe.</div>
    <div class="btn-row" style="width:100%"><button class="btn ghost" id="restore">Restore purchase</button><button class="btn ghost" id="notnow">Not now</button></div></div>`);
  $$('[data-plan]').forEach(b=>b.onclick=()=>{PLAN=b.dataset.plan;SFX.tap();openPaywall(reason)});
  $('#gopro').onclick=()=>{SFX.done();buzz([40,60,40]);if(trialOk)startTrial(PLAN);else subscribe(PLAN);burstAt($('#gopro'));setTimeout(()=>{closeSheet();toast(trialOk?'Trial started — 3 days of Porzel Maths Pro':'Welcome to Porzel Maths Pro');go(TAB)},400)};
  $('#restore').onclick=()=>toast('Nothing to restore in the prototype');
  $('#notnow').onclick=closeSheet;
}
function openReferral(){
  const n=D.referrals||0;
  openSheet(`<h3>Invite a friend, get a week of Pro</h3>
    <p style="font-size:14px;color:var(--muted)">When a friend joins with your link and starts their free trial, you get <b>7 days of Porzel Maths Pro</b> — on top of whatever you already have. No limit during Season One.</p>
    <div class="card" style="text-align:center;padding:14px"><div class="eyebrow">Your code</div><div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.06em;margin:6px 0">${refCode()}</div><div style="font-size:12px;color:var(--muted);overflow-wrap:anywhere">${esc(refLink())}</div></div>
    <div class="btn-row"><button class="btn" id="share">Share link</button><button class="btn ghost" id="copy">Copy</button></div>
    <div class="stat-strip"><div class="stat"><div class="v mono">${n}</div><div class="l">Friends joined</div></div><div class="stat"><div class="v mono">${n*7}</div><div class="l">Days earned</div></div><div class="stat"><div class="v mono">${D.pro.bonusDays||0}</div><div class="l">Bonus days total</div></div></div>
    ${!D.referredBy&&!D.pro.trialUsed?`<div class="setrow" style="border:0"><div><div class="t">Have a friend's code?</div><div class="d">Enter it before you start your trial</div></div><input id="refin" placeholder="ZELL-XXXXX" style="font:inherit;font-family:'Chivo Mono',monospace;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--surface-2);color:var(--text);width:140px;text-transform:uppercase"></div>`:D.referredBy?`<p style="font-size:13px;color:var(--muted)">You joined with code <b class="mono">${esc(D.referredBy)}</b>${D.referralCredited?' — your friend has their week.':' — start your trial and your friend gets a week of Pro.'}</p>`:''}
    <div class="demo-note">Prototype: referrals are tracked on this device only. The launch build credits the referrer on the server the moment the friend's trial starts. <button id="simref" style="color:var(--accent);font-weight:800">Simulate a friend starting a trial</button></div>
    <button class="btn ghost" id="closeref">Done</button>`);
  $('#share').onclick=async()=>{SFX.tap();const data={title:'Porzel Maths',text:`Train mental maths with Porzel Maths and Zell — join with my code ${refCode()} and I get a week of Pro.`,url:refLink()};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(refLink());toast('Link copied')}}catch(e){}};
  $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(refLink());toast('Link copied')}catch(e){toast(refLink())}};
  const inp=$('#refin');if(inp)inp.onchange=()=>{const v=inp.value.trim().toUpperCase();if(/^ZELL-[A-Z0-9]{5}$/.test(v)&&v!==refCode()){D.referredBy=v;save();toast('Code applied');openReferral()}else toast('That code doesn\'t look right')};
  $('#simref').onclick=()=>{D.referrals=(D.referrals||0)+1;addProDays(7,'a friend started their trial');openReferral()};
  $('#closeref').onclick=()=>{closeSheet();go(TAB)};
}
function captureRef(){try{const u=new URL(location.href);const r=(u.searchParams.get('ref')||'').toUpperCase();if(r&&/^ZELL-[A-Z0-9]{5}$/.test(r)&&!D.referredBy&&r!==D.refCode){D.referredBy=r;save();setTimeout(()=>toast(`Joined with ${r} — start a trial and your friend gets a week of Pro`),800)}}catch(e){}}
function freeUsedToday(){return (D.freeUse&&D.freeUse[today()])||0}
function canStart(cfg){if(isPro()||cfg.daily)return true;if(cfg.mode==='puzzle'&&cfg.n>=10){openPaywall('puzzles');return false}if(freeUsedToday()>=FREE_SESSIONS_PER_DAY){openPaywall('sessions');return false}return true}
function proChip(){const st=proState();if(st==='trial')return`<button class="pro-chip trial" data-pro>Trial · ${proDaysLeft()}d</button>`;if(st==='bonus')return`<button class="pro-chip trial" data-pro>Pro · ${proDaysLeft()}d</button>`;if(st==='active')return`<button class="pro-chip" data-pro>Pro ✦</button>`;return''}
