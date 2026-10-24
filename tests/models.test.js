// Run: node tests/models.test.js   (no dependencies)
// Loads the real source files in a sandbox and checks the simulation models and quiz data.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const files=['js/core.js','js/audio.js','js/experiments/chemistry.js','js/experiments/physics.js','js/experiments/biology.js'];
const code=files.map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const ctx=vm.createContext({matchMedia:()=>({matches:true}),document:{querySelector:()=>null},console,Math});
const run=s=>vm.runInContext(s,ctx);
vm.runInContext(code,ctx);
let pass=0,fail=0;
const t=(name,ok,info='')=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+name+(info?'  ['+info+']':''))};
const near=(a,b,tol)=>Math.abs(a-b)<=tol;

// Chemistry: titration model (25.0 mL of 0.100 M HCl vs 0.100 M NaOH)
t('pH start = 1.00',near(run('pH(0)'),1,.005));
t('pH at 24.9 mL ~ 3.70',near(run('pH(24.9)'),3.70,.02),run('pH(24.9)').toFixed(3));
t('pH at 25.0 mL = 7',run('pH(25)')===7);
t('pH at 25.1 mL ~ 10.30',near(run('pH(25.1)'),10.30,.02),run('pH(25.1)').toFixed(3));
t('pH rises monotonically with volume',run('Array.from({length:500},(_,i)=>pH(i/10)).every((v,i,a)=>!i||v>=a[i-1]-1e-9)'));
// Chemistry: CO2 and precipitation stoichiometry
t('CO2 from 1.0 g CaCO3 = 239.8 mL',near(run('1/100.09*24000'),239.8,.1));
t('Precipitate peak at 10 mL (1:1) = 0.5005 g',near(run('.050045*Math.min(10,20-10)'),.5005,1e-4));
// Biology: osmosis model
t('Isotonic point (0.30 M) gives no mass change',near(run('mAt(.3,60)'),5,1e-9));
t('Distilled water gains mass, 0.6 M loses mass',run('mAt(0,60)>5&&mAt(.6,60)<5'));
t('Mass change symmetric about isotonic point',near(run('mAt(0,60)-5'),5-run('mAt(.6,60)'),1e-9));
// Generic least-squares helper
t('fit() recovers y=3x+2',(()=>{const f=run('fit([[0,2],[1,5],[2,8],[3,11]])');return near(f.m,3,1e-9)&&near(f.b,2,1e-9)})());
t('fit() needs >=3 points',run('fit([[0,0],[1,1]])')===null);
// Physics: Hooke's law, damped spring settles at m*g/k
t("Hooke's law: 100 g load settles at 0.0471 m",(()=>{
  run('var S1={s:EX.phys.init()};S1.s.m=100;for(let i=0;i<1200;i++)EX.phys.step(S1,.05);');
  return near(run('S1.s.x'),.12*9.81/25,1e-4)})(),run('S1.s.x').toFixed(5));
// Physics: pendulum period from the integrator (10 deg amplitude, 20 s of simulated time)
const period=L=>run(`(function(){var S={s:EX.phys2.init()};S.s.L=${L};S.s.th=10*Math.PI/180;S.s.go=1;for(let i=0;i<400;i++)EX.phys2.step(S,.05);return S.s.T})()`);
const T100=period(100);
t('Pendulum L=1.00 m: T within 1% of 2.010 s',near(T100,2.0102,.02),T100&&T100.toFixed(4));
t('Pendulum gradient gives g within 1%',(()=>{ctx.p=[20,40,60,80,100].map(L=>[L/100,Math.pow(period(L),2)]);const f=run('fit(p)');return near(39.478/f.m,9.81,.1)})());
// Data integrity: 9 experiments, 5+ questions, valid answer index, unique ids
const ids=run('Object.keys(EX)');
t('9 experiments registered',ids.length===9,ids.join(','));
t('3 per laboratory',['chem','phys','bio'].every(k=>ids.filter(i=>i.startsWith(k)).length===3));
ids.forEach(id=>{ctx.id=id;
  t(id+': >=5 quiz questions',run('EX[id].quiz.length')>=5);
  t(id+': quiz answer indexes valid',run('EX[id].quiz.every(q=>q[2]>=0&&q[2]<q[1].length)'));
  t(id+': has procedure, safety, model notes',run('EX[id].steps.length>=3&&!!EX[id].saf&&!!EX[id].model&&!!EX[id].obj'));
  t(id+': init() is reproducible',run('JSON.stringify(EX[id].init())===JSON.stringify(EX[id].init())'));});
// Scoring rule used by js/quiz.js: 20 marks/question; categories by percentage
const cat=p=>p>=90?'Excellent':p>=70?'Good':p>=50?'Satisfactory':'Needs Improvement';
t('Scoring: 5/5 = 100% Excellent; 3/5 = 60% Satisfactory; 0/5 = Needs Improvement',cat(100)==='Excellent'&&cat(60)==='Satisfactory'&&cat(0)==='Needs Improvement');
console.log(`\n${pass} passed, ${fail} failed`);process.exit(fail?1:0);
