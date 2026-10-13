
/* ============ Utilities ============ */
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fmt=n=>Number(n).toLocaleString('en-AU');
const pad=n=>String(n).padStart(2,'0');
const dayKey=(d=new Date())=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];

/* ============ Store ============ */
const KEY='porzel.v1';const LEGACY_KEY='numera.v1';
const SKILL_IDS=['add','sub','mul','div','pct','sq'];
const SETTINGS_DEFAULT={sound:true,haptic:true,motion:true,theme:'system'};
function defaults(){return{
  v:2,user:null,created:Date.now(),name:'',
  streak:0,bestStreak:0,lastDay:null,xp:0,answered:0,correct:0,
  skills:Object.fromEntries(SKILL_IDS.map(id=>[id,{lvl:1,recent:[],answered:0,correct:0}])),
  puzzles:{lvl:1,recent:[],answered:0,correct:0},
  techniques:{},sessions:[],days:{},daily:{},settings:Object.assign({},SETTINGS_DEFAULT),
  runes:60,owned:[],equipped:{},relics:{},milestones:{},perfectSets:0,runeLog:[],
  pro:{status:'free',until:0,plan:null,trialUsed:false,bonusDays:0},freeUse:{},refCode:null,referredBy:null,referrals:0,referralCredited:false
}}
let D=defaults();
function load(){try{let raw=localStorage.getItem(KEY);if(!raw){raw=localStorage.getItem(LEGACY_KEY);if(raw)localStorage.setItem(KEY,raw)}if(raw){const o=JSON.parse(raw);D=Object.assign(defaults(),o);D.settings=Object.assign({},SETTINGS_DEFAULT,o.settings||{});for(const id of SKILL_IDS)D.skills[id]=Object.assign({lvl:1,recent:[],answered:0,correct:0},D.skills[id]||{});if(typeof D.runes!=='number'){D.runes=60}if(!Array.isArray(D.owned))D.owned=[];if(!D.equipped||typeof D.equipped!=='object')D.equipped={};if(!D.bellMigrated){D.bellMigrated=true;D.owned=D.owned.filter(x=>x!=='bell');if(D.equipped.neck==='bell')delete D.equipped.neck;}D.relics=D.relics||{};D.milestones=D.milestones||{};D.perfectSets=D.perfectSets||0;D.pro=Object.assign({status:'free',until:0,plan:null,trialUsed:false,bonusDays:0},D.pro||{});D.freeUse=D.freeUse||{};}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}}
function applySettings(){const t=D.settings.theme;if(t==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t;document.documentElement.classList.toggle('no-motion',!D.settings.motion)}

/* ============ Zell the black cat (with wardrobe slots) ============ */
const FUR='#2B2740',FUR_L='#3A3556',FUR_D='#1C1830',EYE='#7B4DFF',INK='#14121F',PINK='#F7A1C4';
const ITEMS=[
  // --- hats ---
  {id:'beanie',name:'Cosy beanie',slot:'hat',price:60,rar:'common',svg:'<path d="M44 78 q56 -76 112 0 v8 H44z" fill="#2FD4C1"/><rect x="40" y="74" width="120" height="16" rx="8" fill="#22B8A7"/><circle cx="100" cy="36" r="9" fill="#FFFFFF"/>'},
  {id:'party',name:'Party cone',slot:'hat',price:40,rar:'common',svg:'<path d="M76 66 L100 4 L124 66 Z" fill="#FF5FA8"/><path d="M84 48 h32 M90 30 h20" stroke="#FFD070" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="5" r="6" fill="#FFD070"/>'},
  {id:'flowers',name:'Flower crown',slot:'hat',price:90,rar:'rare',svg:'<g><circle cx="58" cy="66" r="7" fill="#FF5FA8"/><circle cx="74" cy="56" r="7" fill="#FFD070"/><circle cx="92" cy="50" r="7" fill="#FF5FA8"/><circle cx="110" cy="50" r="7" fill="#FFFFFF"/><circle cx="128" cy="56" r="7" fill="#FFD070"/><circle cx="144" cy="66" r="7" fill="#FF5FA8"/><g fill="#2FD4C1"><circle cx="58" cy="66" r="2.5"/><circle cx="74" cy="56" r="2.5"/><circle cx="92" cy="50" r="2.5"/><circle cx="110" cy="50" r="2.5"/><circle cx="128" cy="56" r="2.5"/><circle cx="144" cy="66" r="2.5"/></g></g>'},
  {id:'tophat',name:'Top hat',slot:'hat',price:110,rar:'rare',svg:'<rect x="66" y="8" width="68" height="58" rx="6" fill="#221C4A"/><rect x="52" y="60" width="96" height="12" rx="6" fill="#221C4A"/><rect x="66" y="50" width="68" height="9" fill="#6D4AFF"/>'},
  {id:'wizard',name:'Wizard hat',slot:'hat',price:140,rar:'epic',svg:'<path d="M54 66 Q100 40 104 -8 Q126 30 150 66 Z" fill="#6D4AFF"/><path d="M104 -8 q14 6 10 22" stroke="#6D4AFF" stroke-width="10" stroke-linecap="round" fill="none"/><ellipse cx="102" cy="66" rx="56" ry="10" fill="#5236D6"/><path d="M96 30 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1z" fill="#FFD070"/><circle cx="118" cy="46" r="2.5" fill="#FFD070"/><circle cx="84" cy="52" r="2" fill="#FFD070"/>'},
  {id:'halo',name:'Halo',slot:'hat',price:160,rar:'epic',svg:'<ellipse cx="100" cy="20" rx="36" ry="9" fill="none" stroke="#FFD070" stroke-width="11" opacity=".25"/><ellipse cx="100" cy="20" rx="36" ry="9" fill="none" stroke="#FFD070" stroke-width="5"/>'},
  {id:'crown',name:'Midnight Crown',slot:'hat',price:null,rar:'relic',svg:'<path d="M58 68 L62 30 L82 50 L100 18 L118 50 L138 30 L142 68 Z" fill="#FFD070"/><rect x="58" y="62" width="84" height="12" rx="4" fill="#F2B84B"/><circle cx="100" cy="46" r="4.5" fill="#FF5FA8"/><circle cx="72" cy="54" r="3.5" fill="#2FD4C1"/><circle cx="128" cy="54" r="3.5" fill="#2FD4C1"/>',
    relic:{how:'Reach a 30-day streak',prog:()=>[Math.min(D.bestStreak,30),30]}},
  // --- face ---
  {id:'glasses',name:'Round glasses',slot:'face',price:80,rar:'common',svg:'<g fill="none" stroke="#FFD070" stroke-width="3.5"><circle cx="76" cy="104" r="18"/><circle cx="124" cy="104" r="18"/><path d="M94 104 h12 M58 100 l-8 -4 M142 100 l8 -4"/></g>'},
  {id:'shades',name:'Star shades',slot:'face',price:100,rar:'rare',svg:'<g><rect x="56" y="92" width="38" height="26" rx="9" fill="#6D4AFF"/><rect x="106" y="92" width="38" height="26" rx="9" fill="#6D4AFF"/><path d="M94 104 h12" stroke="#6D4AFF" stroke-width="4"/><path d="M64 98 h14 M114 98 h14" stroke="#FFFFFF" stroke-width="3" opacity=".7" stroke-linecap="round"/></g>'},
  {id:'monocle',name:'Prime Monocle',slot:'face',price:null,rar:'relic',svg:'<circle cx="124" cy="104" r="18" fill="none" stroke="#FFD070" stroke-width="3.5"/><circle cx="124" cy="104" r="14" fill="#FFFFFF" opacity=".12"/><path d="M138 116 q12 14 6 32" stroke="#FFD070" stroke-width="2.5" fill="none"/>',
    relic:{how:'Take any skill to level 10',prog:()=>[Math.max(...SKILL_IDS.map(i=>D.skills[i].lvl)),10]}},
  // --- neck ---
  {id:'bell',name:'Bell collar',slot:'neck',price:40,rar:'common',svg:'<path d="M62 150 q38 24 76 0" stroke="#FF5FA8" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="100" cy="163" r="7.5" fill="#FFD070"/><circle cx="100" cy="165" r="2" fill="#B8862E"/>'},
  {id:'bowtie',name:'Bow tie',slot:'neck',price:50,rar:'common',svg:'<path d="M100 158 l-20 -11 v22 z M100 158 l20 -11 v22 z" fill="#F25C6E"/><circle cx="100" cy="158" r="4.5" fill="#C2334A"/>'},
  {id:'scarf',name:'Striped scarf',slot:'neck',price:70,rar:'rare',svg:'<path d="M58 148 q42 26 84 0 v14 q-42 26 -84 0z" fill="#2FD4C1"/><path d="M70 156 q30 18 60 0" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".7"/><path d="M118 160 l12 30 h-16z" fill="#22B8A7"/>'},
  {id:'pendant',name:'Nine Lives Pendant',slot:'neck',price:null,rar:'relic',svg:'<path d="M68 150 q32 22 64 0" stroke="#FFD070" stroke-width="2.5" fill="none"/><circle cx="100" cy="166" r="9" fill="#FFD070"/><circle cx="100" cy="166" r="9" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity=".6"/><text x="100" y="170.5" font-size="11" text-anchor="middle" fill="#221C4A" font-weight="800" font-family="Outfit,sans-serif">9</text>',
    relic:{how:'Complete the full daily workout on 9 different days',prog:()=>[Math.min(workoutDays(),9),9]}},
  // --- outfits ---
  {id:'hoodie',name:'Hoodie',slot:'outfit',price:150,rar:'rare',svg:'<path d="M56 166 q44 -34 88 0 v22 q-44 22 -88 0z" fill="#3E9BFF"/><path d="M84 178 h32 v10 h-32z" fill="#2F7FD6" opacity=".8"/><path d="M92 158 v14 M108 158 v14" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>'},
  {id:'robe',name:'Wizard robe',slot:'outfit',price:220,rar:'epic',svg:'<path d="M58 152 q42 -10 84 0 l8 46 h-100z" fill="#3B2A8C"/><path d="M100 152 v46" stroke="#FFD070" stroke-width="3"/><path d="M62 190 h76" stroke="#FFD070" stroke-width="3"/><path d="M118 168 a6 6 0 1 0 6 8 a5 5 0 1 1 -6 -8z" fill="#FFD070"/>'},
  {id:'cape',name:'Star cape',slot:'outfit',price:200,rar:'epic',back:true,svg:'<path d="M52 150 q-8 34 6 50 h84 q14 -16 6 -50 q-48 -16 -96 0z" fill="#6D4AFF"/><g fill="#FFD070"><circle cx="64" cy="178" r="2.5"/><circle cx="140" cy="172" r="2.5"/><circle cx="58" cy="192" r="1.8"/><circle cx="146" cy="190" r="1.8"/></g>'},
  {id:'cloak',name:'Phantom Cloak',slot:'outfit',price:null,rar:'relic',back:true,svg:'<path d="M48 146 q-12 36 6 56 h92 q18 -20 6 -56 q-52 -20 -104 0z" fill="#14121F" opacity=".92"/><path d="M52 160 q48 14 96 0" stroke="#9D85FF" stroke-width="2" fill="none" opacity=".7"/><g fill="#9D85FF" opacity=".8"><circle cx="60" cy="184" r="2"/><circle cx="142" cy="180" r="2"/><circle cx="52" cy="196" r="1.5"/></g>',
    relic:{how:'Score 20 / 20 on a question set at level 5 or higher',prog:()=>[Math.min(D.perfectSets||0,1),1]}},
  // --- auras ---
  {id:'motes',name:'Sparkle motes',slot:'aura',price:130,rar:'rare',svg:'<g fill="#FFD070"><circle class="twinkle" cx="34" cy="70" r="3"/><circle class="twinkle" cx="168" cy="60" r="3.5"/><circle class="twinkle" cx="24" cy="130" r="2.5"/><circle class="twinkle" cx="176" cy="126" r="3"/><circle class="twinkle" cx="52" cy="24" r="2.5"/><circle class="twinkle" cx="150" cy="18" r="2.5"/></g>'},
  {id:'moon',name:'Moon & stars',slot:'aura',price:180,rar:'epic',svg:'<g class="float"><path d="M160 34 a16 16 0 1 0 14 22 a12 12 0 1 1 -14 -22z" fill="#FFD070"/></g><g fill="#FFFFFF"><path class="twinkle" d="M40 40 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z"/><path class="twinkle" d="M172 100 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/><path class="twinkle" d="M26 110 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"/></g>'},
  {id:'aurora',name:'Aurora glow',slot:'aura',price:250,rar:'epic',svg:'<g class="aurora" style="transform-origin:100px 110px"><ellipse cx="100" cy="112" rx="96" ry="84" fill="#6D4AFF" opacity=".22"/><ellipse cx="100" cy="112" rx="72" ry="64" fill="#2FD4C1" opacity=".22"/><ellipse cx="100" cy="112" rx="48" ry="44" fill="#FF5FA8" opacity=".16"/></g>'},
  {id:'comet',name:'Comet Tail',slot:'aura',price:null,rar:'relic',svg:'<path d="M150 178 Q196 130 184 40" stroke="#FFD070" stroke-width="14" fill="none" stroke-linecap="round" opacity=".18"/><path d="M150 178 Q196 130 184 40" stroke="#FFD070" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/><path d="M150 178 Q196 130 184 40" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/><path class="twinkle" d="M184 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#FFFFFF"/>',
    relic:{how:'Answer 1,000 questions correctly',prog:()=>[Math.min(D.correct,1000),1000]}},
  // --- pins & companions ---
  {id:'founder',name:"Founder's Star",slot:'pin',price:null,rar:'relic',svg:'<path d="M128 172 l3.5 8 8.5 1 -6.5 6 2 8.5 -7.5 -4.5 -7.5 4.5 2 -8.5 -6.5 -6 8.5 -1z" fill="#FFD070" stroke="#B8862E" stroke-width="1"/>',
    relic:{how:'Season One only — join before 1 Jan 2027 and finish 3 sessions',prog:()=>[D.created<Date.UTC(2027,0,1)?Math.min(D.sessions.length,3):0,3],season:true}},
  {id:'grimoire',name:'Grand Grimoire',slot:'companion',price:null,rar:'relic',svg:'<g class="float"><path d="M14 132 l30 -6 v34 l-30 6z" fill="#3B2A8C"/><path d="M44 126 l4 2 v34 l-4 -2z" fill="#2A1E66"/><path d="M20 140 l18 -4 M20 148 l18 -4 M20 156 l18 -4" stroke="#FFD070" stroke-width="2" stroke-linecap="round"/><path class="twinkle" d="M30 118 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#FFD070"/></g>',
    relic:{how:'Drill all 12 techniques to 80%+ (at least 10 answers each)',prog:()=>[TECH.filter(t=>{const s=D.techniques[t.id];return s&&s.answered>=10&&s.correct/s.answered>=.8}).length,12]}},
];
const SLOTS=['aura','outfit','neck','face','hat','pin','companion'];
const itemById=id=>ITEMS.find(i=>i.id===id);
function workoutDays(){return Object.values(D.daily).filter(d=>d.sprint&&d.tech&&d.puzzle).length}

function catSVG(cls='',eq){
  eq=eq||D.equipped||{};
  const get=slot=>{const it=eq[slot]&&itemById(eq[slot]);return it?it.svg:''};
  const outfit=eq.outfit&&itemById(eq.outfit);
  return`<svg class="cat ${cls}" viewBox="0 0 200 200" aria-hidden="true">
<g class="slot-aura">${get('aura')}</g>
<g class="slot-companion">${get('companion')}</g>
<g class="tail"><path d="M136 176 C 176 178, 186 140, 164 122" stroke="${FUR}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M164 122 c-2 -7 3 -11 9 -8" stroke="#F3F0FF" stroke-width="7" fill="none" stroke-linecap="round"/></g>
${outfit&&outfit.back?`<g class="slot-outfit">${outfit.svg}</g>`:''}
<g class="body"><ellipse cx="100" cy="166" rx="42" ry="30" fill="${FUR}"/><ellipse cx="100" cy="172" rx="16" ry="14" fill="#F3F0FF"/></g>
${outfit&&!outfit.back?`<g class="slot-outfit">${outfit.svg}</g>`:''}
<ellipse class="paw-l" cx="82" cy="191" rx="12" ry="7" fill="${FUR_L}"/><ellipse class="paw-r" cx="118" cy="191" rx="12" ry="7" fill="${FUR_L}"/>
<g class="slot-neck">${get('neck')}</g>
<g class="head"><g class="ear-l"><path d="M50 74 L38 14 L94 48 Z" fill="${FUR}"/><path d="M56 64 L50 30 L82 50 Z" fill="${PINK}"/></g><g class="ear-r"><path d="M150 74 L162 14 L106 48 Z" fill="${FUR}"/><path d="M144 64 L150 30 L118 50 Z" fill="${PINK}"/></g>
<circle cx="100" cy="100" r="56" fill="${FUR}"/><ellipse cx="92" cy="72" rx="30" ry="16" fill="${FUR_L}" opacity=".55"/>
<circle cx="62" cy="122" r="8" fill="#FF7FAE" opacity=".45"/><circle cx="138" cy="122" r="8" fill="#FF7FAE" opacity=".45"/>
<path class="brow-sad" d="M64 80 l16 6 M136 80 l-16 6" stroke="${FUR_L}" stroke-width="4" stroke-linecap="round" fill="none"/>
<g class="eyes-open"><ellipse cx="76" cy="102" rx="14" ry="16" fill="#FFFFFF"/><ellipse cx="124" cy="102" rx="14" ry="16" fill="#FFFFFF"/><g class="pupils"><circle cx="77" cy="104" r="10.5" fill="${EYE}"/><circle cx="123" cy="104" r="10.5" fill="${EYE}"/><circle cx="77" cy="104" r="10.5" fill="none" stroke="#5A2ED6" stroke-width="1.5"/><circle cx="123" cy="104" r="10.5" fill="none" stroke="#5A2ED6" stroke-width="1.5"/><circle cx="78" cy="105" r="6" fill="${INK}"/><circle cx="124" cy="105" r="6" fill="${INK}"/><circle cx="81" cy="99" r="3.2" fill="#fff"/><circle cx="127" cy="99" r="3.2" fill="#fff"/><circle cx="73" cy="108" r="1.6" fill="#fff" opacity=".8"/><circle cx="119" cy="108" r="1.6" fill="#fff" opacity=".8"/></g></g>
<g class="eyes-closed"><path d="M64 104 q12 -13 24 0 M112 104 q12 -13 24 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
<path d="M95 119 h10 l-5 5.5 z" fill="${PINK}"/>
<path class="mouth-w" d="M93 126 q7 6 7 0 q0 6 7 0" stroke="#F3F0FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
<path class="mouth-smile" d="M89 125 q11 11 22 0" stroke="#F3F0FF" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>
<ellipse class="mouth-o" cx="100" cy="129" rx="6" ry="5" fill="#B9445C"/>
<path class="mouth-flat" d="M93 127 h14" stroke="#F3F0FF" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".9"/>
<path d="M58 118 l-22 -5 M58 124 l-22 3 M142 118 l22 -5 M142 124 l22 3" stroke="#F3F0FF" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>
<g class="slot-face">${get('face')}</g><g class="slot-hat">${get('hat')}</g></g>
<g class="slot-pin">${get('pin')}</g>
<g class="zz"><text x="150" y="40" font-size="22" font-weight="800" fill="#9D85FF" font-family="Outfit,sans-serif">z</text><text x="164" y="24" font-size="14" font-weight="800" fill="#9D85FF" font-family="Outfit,sans-serif">z</text></g>
</svg>`}

function catReact(el,cls,ms=900){if(!el)return;el.classList.remove('happy','excited','oops','think','wave');el.classList.add(cls);if(ms)setTimeout(()=>el.classList.remove(cls),ms)}
const TALLY={
  greet(){const h=new Date().getHours(),tod=h<5?'Still up?':h<12?'Morning':h<17?'Afternoon':'Evening';const nm=D.name?`, ${D.name}`:'';
    if(D.answered===0)return`${tod}${nm}! I'm <b>Zell</b>. I'll sit with you while you train — short bursts, every day, and I promise the numbers start to feel smaller.`;
    const ds=D.daily[dayKey()]||{},done=['sprint','tech','puzzle'].filter(k=>ds[k]).length;
    if(done===3)return pick([`That's today's three done${nm}. Streak's safe — I'm going to nap on the keyboard.`,`All done for today. Proud of you${nm}. Come back tomorrow and we'll go again.`]);
    if(D.streak>=7)return`${tod}${nm}. <b>${D.streak} days</b> straight — that's a habit now. Let's keep it tidy: ${3-done} block${3-done===1?'':'s'} left.`;
    if(D.lastDay&&D.lastDay!==dayKey()){const y=new Date();y.setDate(y.getDate()-1);if(D.lastDay!==dayKey(y))return`${tod}${nm}. It's been a little while — no guilt, streaks restart. One sprint and we're back.`}
    const w=weakestSkill();return pick([`${tod}${nm}. ${SKILLS[w].name} is the one I'd sharpen today — start there and the rest gets easier.`,`${tod}${nm}. Warm up with a 60-second sprint, then I'll show you a trick.`,`${tod}${nm}. Ready when you are. Accuracy first, speed follows — I'll keep saying it.`])},
  result(p,mode){if(p>=95)return pick(['Sharp. That is the kind of run I like to see.','Clean sheet, near enough. Levels move when you do that at pace.','Look at you. I barely had to twitch an ear.']);
    if(p>=80)return pick(['Solid. A couple more like that and the level moves up.','Good work. The misses below are the whole game now.','That was tidy. Keep the pace, tighten the last few.']);
    if(p>=60)return pick(['Good effort. Slow down a touch — accuracy first, speed follows.','You are close. Check the misses; they tend to share one habit.','Not bad at all. Give the hint button a try next time, that is what it is for.']);
    return pick(['Tough one. Ease the pace right off and let accuracy lead — I will nudge the level down for you.','Everyone has these. The level will settle to where you are and climb from there.','Shake it off. One easier round, then we go again.'])},
  puzzleWrong(){return pick(['Not that one — here is the rule.','Close. The rule was:','Ah, sneaky pattern. Look:'])},
};

/* ============ Sound, haptics, voice, effects ============ */
const SFX={ctx:null,
  c(){if(!D.settings.sound)return null;try{if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;this.ctx=new C()}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx}catch(e){return null}},
  tone(f,dur,{type='sine',vol=.12,at=0,to=null}={}){const c=this.c();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+at;o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.03)},
  tap(kind){const c=this.c();if(!c)return;const t=c.currentTime,base=kind==='del'?380:kind==='go'?440:520,f=base*(1+(Math.random()-.5)*.05);
    const o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;lp.Q.value=.7;
    o.type='sine';o.frequency.setValueAtTime(f*1.5,t);o.frequency.exponentialRampToValueAtTime(f,t+.028);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.085,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+.1);
    o.connect(lp).connect(g).connect(c.destination);o.start(t);o.stop(t+.12);
    const o2=c.createOscillator(),g2=c.createGain();o2.type='sine';o2.frequency.value=f*2.5;g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(.02,t+.003);g2.gain.exponentialRampToValueAtTime(.0001,t+.045);o2.connect(g2).connect(c.destination);o2.start(t);o2.stop(t+.05)},
  ok(){this.tone(587,.12,{vol:.08});this.tone(784,.14,{vol:.08,at:.07});this.tone(1175,.22,{vol:.06,at:.14})},
  no(){this.tone(262,.16,{type:'sine',vol:.07,to:220});this.tone(220,.22,{type:'sine',vol:.06,at:.12,to:196})},
  up(){[523,659,784,1047].forEach((f,i)=>this.tone(f,.18,{vol:.09,at:i*.09}))},
  down(){[440,392].forEach((f,i)=>this.tone(f,.2,{type:'triangle',vol:.07,at:i*.14}))},
  done(){[523,659,784,659,1047].forEach((f,i)=>this.tone(f,.22,{vol:.09,at:i*.11}))},
  step(){this.tone(740,.09,{type:'sine',vol:.05,to:880})},
};
const buzz=p=>{if(D.settings.haptic&&navigator.vibrate){try{navigator.vibrate(p)}catch(e){}}};
const FX={parts:[],raf:0,
  burst(x,y,n=22){if(!D.settings.motion)return;const cv=$('#fx');cv.width=innerWidth;cv.height=innerHeight;const cols=['#3358FF','#FF8A3D','#FFB627','#17B37A','#F0479A','#8B5CF6'];
    for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=3+Math.random()*5.5;this.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3.5,r:4+Math.random()*4,c:pick(cols),l:1,rot:Math.random()*6})}
    if(!this.raf)this.tick()},
  tick(){const cv=$('#fx'),ctx=cv.getContext('2d');ctx.clearRect(0,0,cv.width,cv.height);this.parts=this.parts.filter(p=>p.l>0);
    for(const p of this.parts){p.x+=p.vx;p.y+=p.vy;p.vy+=.22;p.vx*=.985;p.l-=.02;p.rot+=.12;ctx.save();ctx.globalAlpha=Math.max(0,p.l);ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.c;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.5);ctx.restore()}
    if(this.parts.length)this.raf=requestAnimationFrame(()=>this.tick());else{this.raf=0;ctx.clearRect(0,0,cv.width,cv.height)}}
};
function burstAt(el){if(!el)return;const r=el.getBoundingClientRect();FX.burst(r.left+r.width/2,r.top+r.height/2)}
