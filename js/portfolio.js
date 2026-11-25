/* Content interactions layered on top of the original Foundation. */
(function () {
  'use strict';
  const d = document, api = window.NQV || {}, data = window.NQV_CONTENT || {};
  const lang = () => api.i18n ? api.i18n.get() : 'vi';
  const portrait = d.querySelector('.portrait');
  if (portrait) {
    const fallback = () => { portrait.hidden = true; };
    portrait.addEventListener('error', fallback);
    if (portrait.complete && !portrait.naturalWidth) fallback();
  }
  // TOEIC: scores and date values have one editable JS source, with static HTML fallback.
  function syncToeic() {
    const s = data.toeic;
    if (!s || !Number.isInteger(s.listening) || !Number.isInteger(s.reading) || s.listening < 5 || s.reading < 5 || s.listening > 495 || s.reading > 495) return;
    const values = {...s, total:s.listening+s.reading};
    d.querySelectorAll('[data-toeic]').forEach(el => { el.textContent=values[el.dataset.toeic]; });
    d.querySelectorAll('[data-toeic-bar]').forEach(el => { el.value=values[el.dataset.toeicBar]; });
    d.querySelectorAll('[data-toeic-date]').forEach(el => {
      const value=values[el.dataset.toeicDate];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
      const dt = new Date(value+'T00:00:00Z');
      if (!Number.isFinite(dt.getTime())) return;
      el.dateTime=value;
      el.textContent=lang()==='vi'?value.split('-').reverse().join('/'):new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(dt);
    });
    const cert=d.querySelector('[data-toeic-image]');
    if (cert) { cert.hidden=!s.image; if(s.image) cert.href=s.image; }
  }
  if(api.i18n) api.i18n.onChange(syncToeic);
  syncToeic();
  // Keep both CV links independent of current UI language; HTML works without JS.
  d.querySelectorAll('a[download]').forEach(a=>{
    const match=a.getAttribute('href').match(/CV_(VI|EN)_/);
    if(match && data.cv && data.cv[match[1].toLowerCase()]) a.href=data.cv[match[1].toLowerCase()];
  });
  const modal=d.getElementById('photo-dialog');
  if(!modal || typeof modal.showModal!=='function') return;
  const pic=d.getElementById('dialog-image'), title=d.getElementById('photo-title'), caption=d.getElementById('dialog-caption');
  let opener=null, current=-1;
  const gallery=Array.from(d.querySelectorAll('.gallery a[data-photo]'));
  const controls=modal.querySelector('.gallery-controls');
  const thumbs=modal.querySelector('.gallery-thumbs');
  if(thumbs) gallery.forEach((a,i)=>{const b=d.createElement('button');b.type='button';b.className='gallery-thumb';const im=d.createElement('img');im.src=a.href;im.alt='';im.loading='lazy';im.decoding='async';b.append(im);b.addEventListener('click',()=>show(a));thumbs.append(b);});
  let touchX=null;
  pic.addEventListener('touchstart',e=>{touchX=e.touches[0]?.clientX??null;},{passive:true});
  pic.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)>50)move(dx<0?1:-1);},{passive:true});
  function show(a) {
    const label=a.getAttribute('aria-label') || a.textContent.trim();
    title.textContent=label; pic.alt=label;
    if(pic.getAttribute('src')!==a.href){
      pic.getAnimations?.().forEach(anim=>anim.cancel());
      pic.src=a.href;
      if(d.documentElement.dataset.motionReduced!=='yes' && pic.animate){
        pic.animate([{opacity:.35,transform:'translateY(5px) scale(.985)'},{opacity:1,transform:'none'}],{duration:290,easing:'cubic-bezier(.22,.61,.36,1)'});
      }
    }
    caption.textContent=a.closest('figure')?.querySelector('figcaption')?.textContent || '';
    current=gallery.indexOf(a);
    controls.hidden=current<0;
    if(thumbs){thumbs.hidden=current<0;thumbs.setAttribute('aria-label',api.i18n.t('v4.gallery.label'));[...thumbs.children].forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===current));b.setAttribute('aria-label',gallery[i].getAttribute('aria-label'));});}
    if(current>=0) {
      controls.querySelector('[data-gallery-index]').textContent=(current+1)+' / '+gallery.length;
    }
  }
  function move(delta) { if(current>=0) show(gallery[(current+delta+gallery.length)%gallery.length]); }
  d.querySelectorAll('a[data-photo]').forEach(a=>a.addEventListener('click',e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0) return;
    try { modal.showModal(); } catch(err) { return; }
    e.preventDefault(); opener=a; show(a);
    modal.querySelector('[data-photo-close]').focus();
  }));
  controls.querySelector('[data-gallery-prev]').addEventListener('click',()=>move(-1));
  controls.querySelector('[data-gallery-next]').addEventListener('click',()=>move(1));
  modal.addEventListener('keydown',e=>{if(current<0)return; if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
  if(api.i18n) api.i18n.onChange(()=>{if(modal.open&&opener)show(current>=0?gallery[current]:opener);});
  modal.querySelector('[data-photo-close]').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{ if(e.target!==modal)return; const r=modal.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close(); });
  modal.addEventListener('close',()=>{ pic.removeAttribute('src'); if(opener) opener.focus({preventScroll:true}); opener=null; current=-1; });
})();
