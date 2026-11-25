/* V3: progressively enhanced, lightweight interactions. No dependencies. */
(function () {
  'use strict';
  const d=document, w=window, root=d.documentElement;
  const api=w.NQV, t=key=>api.i18n.t(key);
  const reduce=w.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOff=()=>root.dataset.motionEffective==='off'||root.dataset.motionReduced==='yes';
  const fine=w.matchMedia('(hover: hover) and (pointer: fine)');
  const frame=w.requestAnimationFrame.bind(w);
  // Ambient light reacts only to fine pointers, and stops offscreen.
  const intro=d.querySelector('.intro'), ambient=d.querySelector('.ambient');
  let lightFrame=0, x=0,y=0;
  function lightMove(e) {
    if(motionOff()||!fine.matches)return;
    const r=intro.getBoundingClientRect();
    x=(e.clientX-r.left-r.width/2)*.09; y=(e.clientY-r.top-r.height/2)*.09;
    if(!lightFrame)lightFrame=frame(()=>{ambient.style.setProperty('--light-x',x+'px');ambient.style.setProperty('--light-y',y+'px');lightFrame=0;});
  }
  function lightReset(){if(lightFrame)w.cancelAnimationFrame(lightFrame);lightFrame=0;ambient.style.setProperty('--light-x','0px');ambient.style.setProperty('--light-y','0px');}
  if(intro&&ambient){intro.addEventListener('pointermove',lightMove,{passive:true});intro.addEventListener('pointerleave',lightReset);if('IntersectionObserver' in w)new IntersectionObserver(([e])=>ambient.classList.toggle('paused',!e.isIntersecting)).observe(intro);reduce.addEventListener?.('change',lightReset);}
  // Count once, leaving actual numbers accessible and visible without JS.
  const nums=[...d.querySelectorAll('[data-count]')];
  function count(el){
    const end=Number(el.dataset.count); if(motionOff()||!Number.isFinite(end))return;
    const start=performance.now();
    function tick(now){const p=motionOff()?1:Math.min(1,(now-start)/1350);el.textContent=String(Math.round(end*(1-Math.pow(1-p,3))));if(p<1)frame(tick);}
    frame(tick);
  }
  nums.forEach(el=>{el.setAttribute('aria-hidden','true');const a=el.closest('a');const sr=d.createElement('span');sr.className='visually-hidden';sr.textContent=el.dataset.count+' ';a.prepend(sr);});
  if('IntersectionObserver' in w){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);count(e.target);}}),{threshold:.25});nums.forEach(el=>io.observe(el));}
  // Interactive timeline. Keep all stages readable without JS.
  const stages=[...d.querySelectorAll('.timeline li')];
  const stageButtons=[];
  function openStage(index){stages.forEach((li,i)=>{const active=i===index;li.classList.toggle('stage-active',active);stageButtons[i].setAttribute('aria-expanded',String(active));li.querySelector('p').hidden=!active;});}
  stages.forEach((li,i)=>{
    const h=li.querySelector('h4'), desc=li.querySelector('p'), b=d.createElement('button');
    b.type='button';b.className='stage-toggle';desc.id='stage-description-'+i;
    b.setAttribute('aria-controls',desc.id);b.setAttribute('data-i18n',h.dataset.i18n);b.textContent=h.textContent;h.removeAttribute('data-i18n');h.replaceChildren(b);
    b.addEventListener('click',()=>openStage(i));stageButtons.push(b);
    b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%stages.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i+stages.length-1)%stages.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=stages.length-1;else return;e.preventDefault();openStage(next);stageButtons[next].focus();});
  });
  if(stages.length){d.querySelector('.timeline').classList.add('is-interactive');openStage(0);}
  // Skill filter uses already approved card content. Keep details and labels intact.
  const filters=[...d.querySelectorAll('[data-filter]')], cards=[...d.querySelectorAll('[data-skill]')];
  filters.forEach(b=>b.addEventListener('click',()=>{
    const value=b.dataset.filter;
    filters.forEach(f=>f.setAttribute('aria-pressed',String(f===b)));
    cards.forEach(c=>{const show=value==='all'||c.dataset.skill===value;c.hidden=!show;if(show&&!motionOff()&&c.animate)c.animate([{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:230,easing:'ease-out'});});
  }));
  // Scroll progress + back to top use one rAF-throttled handler.
  const bar=d.querySelector('.reading-progress span'), top=d.querySelector('.back-top');
  let scheduled=false;
  function updateScroll(){scheduled=false;const max=root.scrollHeight-w.innerHeight;const pos=w.scrollY||root.scrollTop;bar.style.transform='scaleX('+Math.max(0,Math.min(1,max>0?pos/max:0))+')';top.hidden=pos<Math.max(450,w.innerHeight*.65);}
  function schedule(){if(!scheduled){scheduled=true;frame(updateScroll);}}
  w.addEventListener('scroll',schedule,{passive:true});w.addEventListener('resize',schedule,{passive:true});if('ResizeObserver' in w)new ResizeObserver(schedule).observe(d.body);api.i18n.onChange(schedule);updateScroll();
  top.addEventListener('click',e=>{e.preventDefault();d.getElementById('hero-title').setAttribute('tabindex','-1');d.getElementById('hero-title').focus({preventScroll:true});w.scrollTo({top:0,behavior:motionOff()?'instant':'smooth'});});
  // Contact copy: real clipboard API, fallback for local/older browsers.
  const toast=d.querySelector('.copy-toast');let toastTimer;
  async function copyText(value){
    if(navigator.clipboard&&w.isSecureContext){try{await navigator.clipboard.writeText(value);return true;}catch(e){/* try fallback */}}
    const a=d.createElement('textarea');a.value=value;a.setAttribute('readonly','');a.style.cssText='position:fixed;left:-9999px;top:0;';const focused=d.activeElement;d.body.append(a);a.select();let ok=false;try{ok=d.execCommand('copy');}catch(e){}a.remove();focused?.focus({preventScroll:true});return ok;
  }
  d.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
    const a=b.closest('.contact-row').querySelector('a');const value=b.dataset.copy==='email'?a.getAttribute('href').slice(7):a.querySelector('span').textContent.replace(/\s/g,'');
    const ok=await copyText(value);toast.textContent=t(ok?'v3.copy.ok':'v3.copy.fail');toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.classList.remove('show');toast.textContent='';},2600);
    if(ok){b.classList.add('copied');setTimeout(()=>b.classList.remove('copied'),1100);}
  }));
})();
