
/* ============ Skills & generators ============ */
const SKILLS={
  add:{name:'Addition',sym:'+',base:2.5,step:0.6},
  sub:{name:'Subtraction',sym:'−',base:2.5,step:0.7},
  mul:{name:'Multiplication',sym:'×',base:3,step:1.1},
  div:{name:'Division',sym:'÷',base:3,step:1.1},
  pct:{name:'Percentages',sym:'%',base:4,step:0.9},
  sq:{name:'Squares & roots',sym:'x²',base:3,step:1.2},
};
const targetSecs=(sk,l)=>SKILLS[sk].base+SKILLS[sk].step*l;
const ADD_R=[[1,9,1,9],[10,99,1,9],[10,50,10,49],[10,99,10,99],[100,999,10,99],[100,999,100,999],[1000,9999,100,999],[1000,9999,1000,9999]];
const MUL_R=[[2,5,2,9],[2,9,2,9],[2,12,2,12],[11,49,2,9],[12,99,3,9],[11,19,11,19],[11,29,11,29],[101,999,2,9],[21,99,11,99],[101,999,11,99]];
const GEN={
  add(l){
    if(l<=8){const r=ADD_R[l-1],a=rnd(r[0],r[1]),b=rnd(r[2],r[3]);return{q:`${fmt(a)} + ${fmt(b)}`,a:a+b}}
    const lo=l===9?10:100,hi=l===9?99:999,a=rnd(lo,hi),b=rnd(lo,hi),c=rnd(lo,hi);
    return{q:`${a} + ${b} + ${c}`,a:a+b+c}
  },
  sub(l){
    if(l<=8){const r=ADD_R[l-1];let a=rnd(r[0],r[1]),b=rnd(r[2],r[3]);if(b>a)[a,b]=[b,a];if(a===b)a+=rnd(1,9);return{q:`${fmt(a)} − ${fmt(b)}`,a:a-b}}
    const lo=l===9?10:100,hi=l===9?99:999,b=rnd(lo,Math.floor(hi/3)),c=rnd(lo,Math.floor(hi/3)),a=b+c+rnd(lo,hi);
    return{q:`${a} − ${b} − ${c}`,a:a-b-c}
  },
  mul(l){const r=MUL_R[l-1];let a=rnd(r[0],r[1]),b=rnd(r[2],r[3]);if(Math.random()<.5)[a,b]=[b,a];return{q:`${fmt(a)} × ${fmt(b)}`,a:a*b}},
  div(l){const r=MUL_R[l-1];const a=rnd(r[0],r[1]),b=rnd(r[2],r[3]);return{q:`${fmt(a*b)} ÷ ${fmt(b)}`,a}},
  pct(l){
    let p,n;
    const mult=(m,lo,hi)=>m*rnd(Math.ceil(lo/m),Math.floor(hi/m));
    if(l===1){p=pick([10,50]);n=mult(10,20,200)}
    else if(l===2){p=pick([10,20,25,50]);n=mult(20,40,400)}
    else if(l===3){p=pick([5,15,25,75]);n=mult(20,40,400)}
    else if(l===4){p=pick([10,20,30,40,60,70,80,90]);n=mult(10,50,900)}
    else if(l===5){p=pick([5,15,35,45,65,85,95]);n=mult(20,60,980)}
    else if(l===6){p=pick([12.5,37.5,62.5,87.5]);n=mult(8,16,800)}
    else if(l===7){p=rnd(1,99);n=mult(100,100,900)}
    else if(l===8){p=pick([10,20,25,50,5,15]);n=mult(20,40,600);return{q:`Increase ${n} by ${p}%`,a:Math.round(n*(100+p)/100),text:true}}
    else if(l===9){p=pick([5,10,15,20,25,30,40]);n=mult(20,40,800);return{q:`Decrease ${n} by ${p}%`,a:Math.round(n*(100-p)/100),text:true}}
    else{n=pick([20,25,40,50,80,200,250,400,500]);do{p=rnd(2,98)}while((n*p)%100!==0);const m=n*p/100;return{q:`${m} is what % of ${n}?`,a:p,text:true}}
    return{q:`${p}% of ${n}`,a:Math.round(n*p/100),text:true}
  },
  sq(l){
    let n;
    if(l===1)n=rnd(2,12);else if(l===2)n=rnd(13,20);else if(l===3)n=rnd(21,30);else if(l===4)n=10*rnd(1,9)+5;
    else if(l===5)n=rnd(31,50);else if(l===6)n=rnd(41,59);else if(l===7)n=rnd(51,70);else if(l===8)n=rnd(91,109);else if(l===9)n=rnd(71,99);else n=rnd(101,125);
    if(l>=5&&Math.random()<.35)return{q:`√${fmt(n*n)}`,a:n};
    return{q:`${n}²`,a:n*n}
  }
};
const weakestSkill=()=>SKILL_IDS.slice().sort((a,b)=>D.skills[a].lvl-D.skills[b].lvl||(D.skills[a].answered-D.skills[b].answered))[0];

/* ============ Sequence puzzles ============ */
function mk(t,rule){return{q:t.slice(0,5).map(fmt).join(',  ')+',  ?',terms:t,a:t[5],rule}}
function seq(f,rule){const t=[];for(let i=0;i<6;i++)t.push(f(i));return mk(t,rule)}
const SEQ=[
  {min:1,f:l=>{const a=rnd(1,l>4?60:20),d=rnd(2,l>4?15:9);return seq(i=>a+d*i,`Add ${d} each time`)}},
  {min:3,f:l=>{const a=rnd(l>5?80:40,l>5?200:60),d=rnd(3,l>5?17:9);return seq(i=>a-d*i,`Subtract ${d} each time`)}},
  {min:2,f:l=>{const a=rnd(1,l>5?7:4),r=l>5?pick([2,3,4,5]):pick([2,3]);return seq(i=>a*r**i,`Multiply by ${r} each time`)}},
  {min:3,f:l=>{const k=rnd(1,l>6?8:4);return seq(i=>(k+i)**2,`Square numbers: ${k}², ${k+1}², ${k+2}², …`)}},
  {min:3,f:l=>{const k=rnd(1,l>6?6:3);return seq(i=>{const n=k+i;return n*(n+1)/2},`Triangular numbers — the gaps grow by 1 (+${k+1}, +${k+2}, +${k+3}, …)`)}},
  {min:4,f:l=>{const a=rnd(1,30),d=rnd(1,6);return seq(i=>a+i*d+i*(i-1)/2,`Gaps grow by 1 each step (+${d}, +${d+1}, +${d+2}, …)`)}},
  {min:4,f:l=>{const a=rnd(10,40),p=rnd(5,15),m=rnd(1,4);const t=[a];for(let i=1;i<6;i++)t.push(i%2?t[i-1]+p:t[i-1]-m);return mk(t,`Alternate: +${p}, then −${m}`)}},
  {min:5,f:l=>{const a=rnd(1,9),b=rnd(a,15);const t=[a,b];for(let i=2;i<6;i++)t.push(t[i-1]+t[i-2]);return mk(t,'Each term is the sum of the two before it')}},
  {min:5,f:l=>{const a=rnd(1,5),p=rnd(2,9),m=pick([2,3]);const t=[a];for(let i=1;i<6;i++)t.push(i%2?t[i-1]+p:t[i-1]*m);return mk(t,`Alternate: +${p}, then ×${m}`)}},
  {min:5,f:l=>{const k=rnd(1,6),c=pick([-3,-2,-1,1,2,3,5,10]);return seq(i=>(k+i)**2+c,`Square numbers ${c>0?'plus':'minus'} ${Math.abs(c)}`)}},
  {min:6,f:l=>{const P=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61];const k=rnd(0,l>8?12:6);return mk(P.slice(k,k+6),'Consecutive prime numbers')}},
  {min:7,f:l=>{const a=rnd(1,6),m=pick([2,3]),c=pick([-2,-1,1,2,3]);const t=[a];for(let i=1;i<6;i++)t.push(t[i-1]*m+c);return mk(t,`Multiply by ${m}, then ${c>0?'add':'subtract'} ${Math.abs(c)}`)}},
  {min:7,f:l=>{const k=rnd(1,4);return seq(i=>(k+i)**3,`Cube numbers: ${k}³, ${k+1}³, ${k+2}³, …`)}},
  {min:7,f:l=>{const a=rnd(1,20),d1=rnd(2,9),b=rnd(1,30),d2=rnd(2,9);return mk([a,b,a+d1,b+d2,a+2*d1,b+2*d2],`Two interleaved sequences: +${d1} on odd positions, +${d2} on even positions`)}},
  {min:8,f:l=>{const k=rnd(1,7);return seq(i=>(k+i)*(k+i+1),`n × (n+1): ${k}×${k+1}, ${k+1}×${k+2}, …`)}},
  {min:8,f:l=>{const k=rnd(2,6);return seq(i=>(k+i)**2-(k+i),`n² − n for n = ${k}, ${k+1}, ${k+2}, …`)}},
  {min:9,f:l=>{const k=rnd(1,4);return seq(i=>2**(k+i)-1,'Powers of 2, minus 1')}},
  {min:9,f:l=>{const a=rnd(1,4),r=pick([2,3]),b=rnd(5,30),d=rnd(3,9);return mk([a,b,a*r,b+d,a*r*r,b+2*d],`Two interleaved sequences: ×${r} on odd positions, +${d} on even positions`)}},
];
function genPuzzle(l){const c=SEQ.filter(s=>s.min<=l);const pref=c.filter(s=>s.min>=l-3);return pick(pref.length?pref:c).f(l)}
const puzzleTarget=l=>10+l*2;

/* ============ Techniques ============ */
const TECH=[
  {id:'x11',title:'Multiply by 11',ex:'63 × 11',blurb:'Split the digits and add them in the middle.',
   steps:['Take a two-digit number, say 63.','Add its digits: 6 + 3 = 9.','Slot the sum between the digits: 6 9 3 → 693.','If the sum is 10 or more, carry the 1: 87 × 11 → 8 (15) 7 → 957.'],
   gen(l){const n=l<4?rnd(12,45):rnd(12,98);return{q:`${n} × 11`,a:n*11,hint:`${Math.floor(n/10)} _ ${n%10}, middle = ${Math.floor(n/10)+n%10}`}}},
  {id:'sq5',title:'Square a number ending in 5',ex:'65²',blurb:'Multiply the tens digit by one more, then write 25.',
   steps:['Take the digits before the 5: for 65 that is 6.','Multiply by the next number up: 6 × 7 = 42.','Append 25: 4225.','Works for any size: 115² → 11 × 12 = 132 → 13225.'],
   gen(l){const k=l<4?rnd(1,9):rnd(1,12);return{q:`${k*10+5}²`,a:(k*10+5)**2,hint:`${k} × ${k+1} = ${k*(k+1)}, then 25`}}},
  {id:'sq50',title:'Square near 50',ex:'47²',blurb:'Start from 2500 and adjust by hundreds.',
   steps:['Find the distance from 50: 47 is 3 below.','Below 50: subtract 100 per unit — 2500 − 300 = 2200.','Add the distance squared: 2200 + 9 = 2209.','Above 50 (e.g. 54): 2500 + 400 + 16 = 2916.'],
   gen(l){const d=l<4?rnd(1,6):rnd(1,12),n=Math.random()<.5?50-d:50+d;return{q:`${n}²`,a:n*n,hint:`2500 ${n<50?'−':'+'} ${d*100} + ${d*d}`}}},
  {id:'sq100',title:'Square near 100',ex:'97²',blurb:'Start from 10 000 and adjust by 200s.',
   steps:['Distance from 100: 97 is 3 below.','Subtract 200 per unit: 10000 − 600 = 9400.','Add the distance squared: 9400 + 9 = 9409.','Above 100 (e.g. 106): 10000 + 1200 + 36 = 11236.'],
   gen(l){const d=l<4?rnd(1,7):rnd(1,15),n=Math.random()<.5?100-d:100+d;return{q:`${n}²`,a:n*n,hint:`10000 ${n<100?'−':'+'} ${d*200} + ${d*d}`}}},
  {id:'x5',title:'Multiply by 5, 25 and 50',ex:'48 × 25',blurb:'Trade the awkward factor for a tidy division.',
   steps:['× 5 is × 10 then halve: 84 × 5 → 840 ÷ 2 = 420.','× 25 is ÷ 4 then × 100: 48 × 25 → 12 × 100 = 1200.','× 50 is × 100 then halve: 36 × 50 → 3600 ÷ 2 = 1800.','Odd numbers still work: 37 × 5 → 370 ÷ 2 = 185.'],
   gen(l){const t=pick([5,25,50]);if(t===5){const n=l<4?rnd(12,99):rnd(24,399);return{q:`${n} × 5`,a:n*5,hint:`${n*10} ÷ 2`}}if(t===25){const n=l<4?4*rnd(2,15):rnd(8,96);return{q:`${n} × 25`,a:n*25,hint:`${n} ÷ 4 = ${n/4}, × 100`}}const n=l<4?rnd(12,60):rnd(12,199);return{q:`${n} × 50`,a:n*50,hint:`${n*100} ÷ 2`}}},
  {id:'ltr',title:'Add left to right',ex:'457 + 386',blurb:'Big chunks first — the way you say numbers aloud.',
   steps:['Add the hundreds of the second number: 457 + 300 = 757.','Then its tens: 757 + 80 = 837.','Then its units: 837 + 6 = 843.','You always hold one running total, never a column of carries.'],
   gen(l){const a=l<4?rnd(100,599):rnd(100,999),b=l<4?rnd(100,499):rnd(100,999);return{q:`${a} + ${b}`,a:a+b,hint:`${a} + ${Math.floor(b/100)*100} = ${a+Math.floor(b/100)*100}, then + ${b%100}`}}},
  {id:'comp',title:'Subtract from 1000',ex:'1000 − 647',blurb:'All from 9, the last from 10.',
   steps:['Take each digit from 9, except the final digit which you take from 10.','1000 − 647: 9−6 = 3, 9−4 = 5, 10−7 = 3 → 353.','No borrowing, ever.','Same idea for 100, 10 000, or change from $50 (50.00 − 23.65).'],
   gen(l){if(l>=5&&Math.random()<.5){const n=rnd(1001,9999);return{q:`10000 − ${n}`,a:10000-n,hint:'9 9 9 10 — no borrowing'}}const n=rnd(101,999);return{q:`1000 − ${n}`,a:1000-n,hint:`9−${Math.floor(n/100)}, 9−${Math.floor(n/10)%10}, 10−${n%10}`}}},
  {id:'near100',title:'Multiply two numbers near 100',ex:'97 × 94',blurb:'Cross-subtract, then multiply the small gaps.',
   steps:['Find each gap from 100: 97 is 3 below, 94 is 6 below.','Cross-subtract either way: 97 − 6 = 91 (or 94 − 3). That is the front.','Multiply the gaps: 3 × 6 = 18. That is the back (two digits).','9118. Above 100 (103 × 108): 103 + 8 = 111, 3 × 8 = 24 → 11124.'],
   gen(l){const x=rnd(1,l<4?9:15),y=rnd(1,l<4?9:15);if(l>=5&&Math.random()<.4){const a=100+x,b=100+y;return{q:`${a} × ${b}`,a:a*b,hint:`${a}+${y} = ${a+y} | ${x}×${y} = ${x*y}`}}const a=100-x,b=100-y;return{q:`${a} × ${b}`,a:a*b,hint:`${a}−${y} = ${a-y} | ${x}×${y} = ${x*y}`}}},
  {id:'pctflip',title:'Flip the percentage',ex:'8% of 25',blurb:'x% of y is always y% of x.',
   steps:['8% of 25 feels awkward.','Swap them: 25% of 8 = 2. Same answer.','Look for the version where one side is 10, 20, 25, 50 or 75.','16% of 50 → 50% of 16 = 8.'],
   gen(l){const nice=pick([10,20,25,50,75,5]);const m={10:10,20:5,25:4,50:2,75:4,5:20}[nice];const x=m*rnd(1,Math.floor((l<4?40:96)/m));return{q:`${x}% of ${nice}`,a:x*nice/100,hint:`= ${nice}% of ${x}`,text:true}}},
  {id:'dblhalf',title:'Double and halve',ex:'16 × 35',blurb:'Halve one, double the other, keep the product.',
   steps:['16 × 35: halve 16 → 8, double 35 → 70.','8 × 70 = 560. Done.','Keep going while it helps: 24 × 15 → 12 × 30 → 360.','Best when one number is even and the other ends in 5.'],
   gen(l){const a=pick(l<4?[12,14,16,18,22,24]:[12,14,16,18,22,24,26,28,32,34,36,44,48]),b=pick(l<4?[15,25,35,45]:[15,25,35,45,55,65,75,85,95]);return{q:`${a} × ${b}`,a:a*b,hint:`${a/2} × ${b*2}`}}},
  {id:'diffsq',title:'Difference of squares',ex:'47 × 53',blurb:'Numbers evenly either side of a round number.',
   steps:['47 and 53 sit 3 either side of 50.','(50 − 3)(50 + 3) = 50² − 3².','2500 − 9 = 2491.','Spot the pattern: 28 × 32 = 900 − 4 = 896.'],
   gen(l){const c=pick(l<4?[20,30,40,50]:[20,30,40,50,60,70,80,90,100]),d=rnd(1,l<4?5:9);return{q:`${c-d} × ${c+d}`,a:c*c-d*d,hint:`${c}² − ${d}² = ${c*c} − ${d*d}`}}},
  {id:'x9',title:'Multiply by 9 and 99',ex:'47 × 99',blurb:'Go one over, then take one back.',
   steps:['× 9 is × 10 minus one lot: 47 × 9 → 470 − 47 = 423.','× 99 is × 100 minus one lot: 47 × 99 → 4700 − 47 = 4653.','Same trick for 19, 29, 49: 23 × 19 → 460 − 23 = 437.','You are trading a hard multiplication for a subtraction you can do left to right.'],
   gen(l){const n=rnd(12,99),t=l<3?9:pick([9,99,19,29,49]);return{q:`${n} × ${t}`,a:n*t,hint:`${n} × ${t+1} = ${n*(t+1)}, minus ${n}`}}},
];

const techById=id=>TECH.find(t=>t.id===id);
const techOfDay=()=>{const d=new Date();const doy=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);return TECH[doy%TECH.length]};
const techLevel=id=>{const t=D.techniques[id]||{};return Math.min(10,1+Math.floor((t.correct||0)/8))};

/* ============ Animated demos (Zell narrates) ============ */
const d=(x,c='')=>`<span class="d ${c}">${x}</span>`,op=x=>`<span class="op">${x}</span>`,row=(...x)=>`<div class="row">${x.join('')}</div>`,cap=x=>`<div class="cap">${x}</div>`,txt=x=>`<div class="txt">${x}</div>`,arrow='<div class="row"><span class="arrow">↓</span></div>';
const DEMO={
  x11:[
    {say:"Let's do 63 times 11. We only ever need the two digits.",b:row(d(6),d(3),op('×'),d(11,'ghost'))},
    {say:"Add the digits together. 6 plus 3 is 9.",b:row(d(6,'hl'),op('+'),d(3,'hl'),op('='),d(9,'pop warm'))},
    {say:"Now slide that 9 into the middle, between the 6 and the 3.",b:row(d(6),d(9,'drop warm'),d(3))},
    {say:"693. That's the whole trick.",b:row(d(6,'ok'),d(9,'ok'),d(3,'ok'))+cap('63 × 11 = 693')},
    {say:"One catch: if the digits add to 10 or more, carry the one. 87 times 11: 8 plus 7 is 15, so the 1 bumps the 8 up to 9. 957.",b:row(d(8),d(15,'hl'),d(7))+arrow+row(d(9,'ok'),d(5,'ok'),d(7,'ok'))+cap('87 × 11 = 957')}],
  sq5:[
    {say:"65 squared. Look at everything before the 5 — that's a 6.",b:row(d(6,'hl'),d(5))+cap('65²')},
    {say:"Multiply the 6 by the next number up, which is 7. 6 times 7 is 42.",b:row(d(6,'hl'),op('×'),d(7,'hl'),op('='),d(42,'pop warm'))},
    {say:"Then just write 25 after it.",b:row(d(42,'warm'),d(25,'drop'))},
    {say:"4225. Any number ending in 5 works the same way. 115 squared: 11 times 12 is 132, then 25. 13225.",b:row(d(4225,'ok'))+cap('65² = 4225 · 115² = 13225')}],
  sq50:[
    {say:"47 squared. 47 is 3 below 50, so start from 50 squared, which is 2500.",b:row(d(47),op('='),d(50),op('−'),d(3,'hl'))+cap('50² = 2500')},
    {say:"Take away 3 hundreds. 2500 minus 300 is 2200.",b:row(d(2500),op('−'),d(300,'hl'),op('='),d(2200,'pop warm'))},
    {say:"Now add back the 3 squared, which is 9.",b:row(d(2200,'warm'),op('+'),d(9,'hl pop'))},
    {say:"2209. Above 50 you add instead: 54 squared is 2500 plus 400 plus 16, 2916.",b:row(d(2209,'ok'))+cap('47² = 2209 · 54² = 2916')}],
  sq100:[
    {say:"97 squared. 97 is 3 below 100, so we start from 10,000.",b:row(d(97),op('='),d(100),op('−'),d(3,'hl'))+cap('100² = 10000')},
    {say:"Take away 3 lots of 200. 10,000 minus 600 is 9,400.",b:row(d('10000'),op('−'),d(600,'hl'),op('='),d(9400,'pop warm'))},
    {say:"Add back 3 squared, which is 9.",b:row(d(9400,'warm'),op('+'),d(9,'hl pop'))},
    {say:"9409. Above 100, add instead: 106 squared is 10,000 plus 1,200 plus 36. 11,236.",b:row(d(9409,'ok'))+cap('97² = 9409 · 106² = 11236')}],
  x5:[
    {say:"48 times 25. Multiplying by 25 is the same as multiplying by 100 and dividing by 4.",b:row(d(48),op('×'),d(25,'hl'))+cap('25 = 100 ÷ 4')},
    {say:"So divide 48 by 4 first. That's 12.",b:row(d(48,'hl'),op('÷'),d(4),op('='),d(12,'pop warm'))},
    {say:"Then multiply by 100. 1,200.",b:row(d(12,'warm'),op('×'),d(100),op('='),d(1200,'pop ok'))},
    {say:"Same family: times 5 is times 10 then halve. Times 50 is times 100 then halve.",b:row(d('×5','sm'),op('→'),d('×10, ÷2','sm'))+row(d('×25','sm'),op('→'),d('÷4, ×100','sm'))+row(d('×50','sm'),op('→'),d('×100, ÷2','sm'))}],
  ltr:[
    {say:"457 plus 386. We'll add left to right, the way you'd say the number out loud. Split 386 into 300, 80 and 6.",b:row(d(457),op('+'),d(300,'hl'),d(80,'hl'),d(6,'hl'))},
    {say:"457 plus 300 is 757.",b:row(d(457),op('+'),d(300,'hl'),op('='),d(757,'pop warm'))},
    {say:"757 plus 80 is 837.",b:row(d(757,'warm'),op('+'),d(80,'hl'),op('='),d(837,'pop warm'))},
    {say:"837 plus 6 is 843. One running total the whole way — nothing to carry, nothing to remember.",b:row(d(837,'warm'),op('+'),d(6,'hl'),op('='),d(843,'pop ok'))+cap('457 + 386 = 843')}],
  comp:[
    {say:"1000 minus 647. The rule: every digit comes from 9, except the last, which comes from 10.",b:row(d(9,'ghost sm'),d(9,'ghost sm'),d(10,'ghost sm'))+row(d(6),d(4),d(7))},
    {say:"9 minus 6 is 3.",b:row(d(9,'hl sm'),d(9,'ghost sm'),d(10,'ghost sm'))+row(d(6,'hl'),d(4),d(7))+row(d(3,'pop warm'))},
    {say:"9 minus 4 is 5.",b:row(d(9,'ghost sm'),d(9,'hl sm'),d(10,'ghost sm'))+row(d(6),d(4,'hl'),d(7))+row(d(3,'warm'),d(5,'pop warm'))},
    {say:"And 10 minus 7 is 3. 353 — and not a single borrow.",b:row(d(9,'ghost sm'),d(9,'ghost sm'),d(10,'hl sm'))+row(d(6),d(4),d(7,'hl'))+row(d(3,'ok'),d(5,'ok'),d(3,'pop ok'))+cap('1000 − 647 = 353')}],
  near100:[
    {say:"97 times 94. Both are close to 100. 97 is 3 below, 94 is 6 below.",b:row(d(97),d('−3','sm hl'),op('·'),d(94),d('−6','sm hl'))},
    {say:"Cross-subtract: 97 minus 6 is 91. You could also do 94 minus 3 — same answer. That's the front of our number.",b:row(d(97,'hl'),op('−'),d(6,'hl'),op('='),d(91,'pop warm'))},
    {say:"Multiply the two gaps: 3 times 6 is 18. That's the back — always two digits.",b:row(d(3,'hl'),op('×'),d(6,'hl'),op('='),d(18,'pop warm'))},
    {say:"Put them together. 9118.",b:row(d(91,'ok'),d(18,'ok'))+cap('97 × 94 = 9118 · above 100 you add: 103 × 108 → 111 | 24')}],
  pctflip:[
    {say:"8 percent of 25. That looks awkward.",b:row(d('8%'),op('of'),d(25))},
    {say:"Here's the secret: x percent of y is always y percent of x. So flip it.",b:row(d('8%','hl'),op('of'),d(25,'hl'))+arrow+row(d('25%','pop warm'),op('of'),d(8,'pop warm'))},
    {say:"25 percent is a quarter. A quarter of 8 is 2.",b:row(d('¼','warm'),op('of'),d(8),op('='),d(2,'pop ok'))},
    {say:"So 8 percent of 25 is 2. Always look for the version where one side is 10, 20, 25, 50 or 75.",b:row(d(2,'ok'))+cap('8% of 25 = 25% of 8 = 2')}],
  dblhalf:[
    {say:"16 times 35. Halve one number and double the other — the answer doesn't change.",b:row(d(16),op('×'),d(35))},
    {say:"16 becomes 8. 35 becomes 70.",b:row(d(16,'hl'),op('×'),d(35,'hl'))+arrow+row(d(8,'pop warm'),op('×'),d(70,'pop warm'))},
    {say:"8 times 70 is 560.",b:row(d(8,'warm'),op('×'),d(70,'warm'),op('='),d(560,'pop ok'))},
    {say:"Do it again whenever it helps: 24 times 15 becomes 12 times 30, which is 360.",b:row(d(24,'sm'),op('×'),d(15,'sm'),op('→'),d(12,'sm warm'),op('×'),d(30,'sm warm'),op('='),d(360,'sm ok'))}],
  diffsq:[
    {say:"47 times 53. Notice they sit 3 either side of 50.",b:row(d(47),d('50 − 3','sm hl'),op('·'),d(53),d('50 + 3','sm hl'))},
    {say:"That makes it 50 minus 3, times 50 plus 3. Which is 50 squared minus 3 squared.",b:row(d('50²','hl'),op('−'),d('3²','hl'))},
    {say:"2500 minus 9.",b:row(d(2500,'warm'),op('−'),d(9,'warm pop'))},
    {say:"2491. Look for pairs around a round number: 28 times 32 is 900 minus 4, 896.",b:row(d(2491,'ok'))+cap('47 × 53 = 2491 · 28 × 32 = 896')}],
  x9:[
    {say:"47 times 99. 99 is one less than 100, so 47 times 99 is 47 times 100, minus one 47.",b:row(d(47),op('×'),d(99,'hl'))+cap('99 = 100 − 1')},
    {say:"47 times 100 is 4,700.",b:row(d(47),op('×'),d(100),op('='),d(4700,'pop warm'))},
    {say:"Take away one 47. 4,700 minus 47 is 4,653.",b:row(d(4700,'warm'),op('−'),d(47,'hl'),op('='),d(4653,'pop ok'))},
    {say:"Same move for 9, 19, 29 and 49: go one over, then take one back.",b:row(d('×9','sm'),op('→'),d('×10 − 1','sm'))+row(d('×19','sm'),op('→'),d('×20 − 1','sm'))+row(d('×49','sm'),op('→'),d('×50 − 1','sm'))}],
};
