/* Core utilities and shared model helpers (classic script, global scope). */
const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const LS=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
const fit=p=>{const n=p.length;if(n<3)return null;let sx=0,sy=0,sxy=0,sxx=0;p.forEach(([x,y])=>{sx+=x;sy+=y;sxy+=x*y;sxx+=x*x});const d=n*sxx-sx*sx;if(!d)return null;const m=(n*sxy-sx*sy)/d;return{m,b:(sy-m*sx)/n}};
function bg(c,t){c.fillStyle='#fff';c.fillRect(0,0,520,440);c.fillStyle='#8b6b4b';c.fillRect(0,400,520,40);c.fillStyle='#6f5339';c.fillRect(0,400,520,5);c.fillStyle='#13202b';c.font='13px sans-serif';c.fillText(t,10,424)}
function poly(c,pts,fill,stroke){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke()}}
const EX={}; /* experiment registry: filled by js/experiments/*.js */
