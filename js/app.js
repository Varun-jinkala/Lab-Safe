/* Page navigation, lab cards and event wiring. */
const LABS=[['chem','Chemistry Laboratory','Titration with a burette, conical flask, indicator and live pH meter.'],['phys','Physics Laboratory','Hooke’s law with a spring, slotted masses and ruler.'],['bio','Biology Laboratory','Osmosis in potato tissue using an electronic balance.']];
function go(p){['intro','labs','lab'].forEach(x=>$('#'+x).hidden=x!=p);if(p=='labs')cards()}
function cards(){const b=LS('best')||{};$('#cards').innerHTML=LABS.map(([k,n,d])=>`<div class="card"><h3>${n}</h3><p>${d}</p>${Object.keys(EX).filter(i=>i.startsWith(k)).map(i=>`<p style="margin:8px 0"><button data-lab="${i}">${EX[i].title}</button><br><span class="tag">${b[i]!=null?'Best quiz: '+b[i]+'%':'Quiz not taken'}</span></p>`).join('')}</div>`).join('')}
document.addEventListener('click',e=>{const t=e.target.closest('[data-go],[data-lab]');if(!t)return;if(t.dataset.go){if(S)S.run=false;go(t.dataset.go)}if(t.dataset.lab)open(t.dataset.lab)});
$('#enter').onclick=()=>{snd.click();go('labs')};$('#back').onclick=()=>{if(S){S.run=false}go('labs')};
$('#pz').onclick=()=>{S.run=!S.run;$('#pz').textContent=S.run?'Pause':'Resume';say(S.run?'Resumed':'Paused')};
$('#rs').onclick=()=>{if(confirm('Reset this experiment? Measurements and log are cleared; saved quiz scores are kept.')){delete SS[S.id];open(S.id,true)}};
$('#mute').onclick=()=>{mute=!mute;$('#mute').textContent=mute?'Sound off':'Sound on';$('#mute').setAttribute('aria-pressed',mute)};$('#vol').oninput=e=>{vol=+e.target.value;snd.click()};$('#qbtn').onclick=quiz;
sc=$('#sc');gc=$('#gr');requestAnimationFrame(frame);
