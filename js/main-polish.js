/* V4.4: share, localized update date, language transition. */
(function(){
'use strict';
const d=document,w=window,r=d.documentElement,api=w.NQV,t=k=>api.i18n.t(k),q=s=>d.querySelector(s);
const profile=w.NQV_CONTENT.portfolio, dialog=q('#share-dialog'), input=q('#share-url'),status=q('[data-share-status]'),native=q('[data-native-share]');let opener;
const live=location.hostname==='vinhbizpsu.github.io';
function sync(){const lang=api.i18n.get();const stamp=q('[data-profile-date]');stamp.dateTime=profile.updated;stamp.textContent=new Intl.DateTimeFormat(lang==='vi'?'vi-VN':'en-GB',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(profile.updated+'T00:00:00Z'));if(live){q('[data-i18n="v44.share.note"]').textContent=t('v44.share.live');q('[data-i18n="v4.qr.note"]').textContent=lang==='vi'?'Quét mã QR để truy cập Portfolio.':'Scan the QR code to open the portfolio.';}if(status)status.textContent='';}
input.value=profile.url;native.hidden=typeof navigator.share!=='function';
d.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',()=>{opener=b;sync();dialog.showModal();}));
q('[data-share-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
q('[data-share-copy]').addEventListener('click',async()=>{let ok=false;try{if(navigator.clipboard&&w.isSecureContext){await navigator.clipboard.writeText(input.value);ok=true;}}catch(e){}if(!ok){input.focus();input.select();try{ok=d.execCommand('copy');}catch(e){}}status.textContent=t(ok?'v44.share.ok':'v44.share.fail');});
native.addEventListener('click',async()=>{try{await navigator.share({title:'Nguyễn Quốc Vinh | Portfolio',text:t('meta.description'),url:profile.url});}catch(e){if(e.name!=='AbortError')status.textContent=t('v44.share.fail');}});
api.i18n.onChange(()=>{sync();if(r.dataset.motionReduced!=='yes'&&d.querySelector('main').animate)d.querySelector('main').animate([{opacity:.76},{opacity:1}],{duration:300,easing:'ease-out'});});
sync();
})();
