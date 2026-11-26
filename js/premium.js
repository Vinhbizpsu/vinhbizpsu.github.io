/* V4 enhancements: keep V3.1's navigation, theme, i18n and core interactions. */
(function(){
'use strict';
const d=document,w=window,r=d.documentElement,api=w.NQV, t=k=>api.i18n.t(k), $=s=>d.querySelector(s), all=s=>[...d.querySelectorAll(s)];
const media=w.matchMedia('(prefers-reduced-motion: reduce)');
const disabled=()=>r.dataset.motionReduced==='yes';
// Start automatically on every visit, ignoring the former site-level switch.
function motionSync(){r.dataset.motion='auto';r.dataset.motionEffective='on';r.dataset.motionReduced=media.matches?'yes':'no';if(disabled()){all('[data-reveal]').forEach(el=>el.classList.add('is-visible'));all('[data-count]').forEach(el=>el.textContent=el.dataset.count);}}
media.addEventListener?.('change',()=>{motionSync();schedule();});
motionSync();
// Pause decorative loops outside the viewport and in background tabs.
const animEls=all('.portrait-decoration,.marquee,.honor-first');
if('IntersectionObserver' in w){const io=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-paused',!e.isIntersecting)));animEls.forEach(el=>io.observe(el));}
d.addEventListener('visibilitychange',()=>r.classList.toggle('page-hidden',d.hidden));
// Stagger individual cards instead of adding extra libraries. Existing reveal observer handles visibility.
all('.dashboard-grid,.skills-grid,.gallery,.cert-grid').forEach(grid=>[...grid.children].forEach((el,i)=>el.style.setProperty('--reveal-delay',Math.min(i*105,315)+'ms')));
// One scroll pass for gentle parallax and research progress. Manual timeline choices are not overwritten.
const figure=$('.hero__figure'), timeline=$('.timeline'), stages=all('.timeline li'), rail=$('.timeline-rail'), status=$('[data-story-title]'), idx=$('[data-story-index]');
let pending=false, active=-1;
function update(){pending=false;const vh=w.innerHeight;
 if(figure){const rect=figure.getBoundingClientRect();const shift=disabled()||rect.bottom<0||rect.top>vh?0:Math.max(-22,Math.min(22,w.scrollY*.065));figure.style.setProperty('--portrait-shift',shift+'px');}
 if(timeline&&stages.length){const rect=timeline.getBoundingClientRect(), probe=vh*.54;let index=0;stages.forEach((li,i)=>{if(li.getBoundingClientRect().top<=probe)index=i;});const p=Math.max(0,Math.min(1,(probe-rect.top)/Math.max(1,rect.height)));rail.style.setProperty('--story-progress',p);if(index!==active){active=index;stages.forEach((el,i)=>el.classList.toggle('story-current',i===index));idx.textContent=String(index+1).padStart(2,'0')+' / '+String(stages.length).padStart(2,'0');status.textContent=t('step.'+index+'.title');}}
}
function schedule(){if(!pending){pending=true;w.requestAnimationFrame(update);}}
w.addEventListener('scroll',schedule,{passive:true});w.addEventListener('resize',schedule,{passive:true});api.i18n.onChange(()=>{active=-1;schedule();});if('ResizeObserver' in w)new ResizeObserver(schedule).observe(timeline);schedule();
// Quick view and PDF preview, including native browser fallback.
const cv=$('#cv-dialog'), pdf=$('[data-pdf-frame]'), external=$('[data-pdf-external]');let current='vi';const openers=new Map();
function preview(lang){current=lang;const path=w.NQV_CONTENT.cv[lang];pdf.src=path;external.href=path;all('[data-preview-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewLang===lang)));}
all('[data-preview-lang]').forEach(b=>b.addEventListener('click',()=>preview(b.dataset.previewLang)));
all('[data-open]').forEach(b=>b.addEventListener('click',()=>{const modal=d.getElementById(b.dataset.open);if(!modal||typeof modal.showModal!=='function'){if(modal===cv)w.open(w.NQV_CONTENT.cv[api.i18n.get()],'_blank','noopener');return;}openers.set(modal,b);if(modal===cv)preview(api.i18n.get());modal.showModal();modal.querySelector('[data-v4-close]').focus();}));
all('.premium-dialog:not(.share-dialog)').forEach(modal=>{modal.querySelector('[data-v4-close]').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target!==modal)return;const box=modal.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)modal.close();});modal.addEventListener('close',()=>{if(modal===cv)pdf.removeAttribute('src');const opener=openers.get(modal);if(opener)opener.focus({preventScroll:true});openers.delete(modal);});});
all('[data-close-jump]').forEach(a=>a.addEventListener('click',()=>a.closest('dialog').close()));
// Print all skills and timeline details, even when a filter is active.
let printDetails=[];w.addEventListener('beforeprint',()=>{printDetails=all('.skill-card details').map(el=>[el,el.open]);printDetails.forEach(([el])=>el.open=true);});w.addEventListener('afterprint',()=>{printDetails.forEach(([el,open])=>el.open=open);printDetails=[];});all('[data-print]').forEach(b=>b.addEventListener('click',()=>w.print()));
})();
