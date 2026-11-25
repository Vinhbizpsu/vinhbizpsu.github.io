/* Optional future content. Runs before UI observers; empty groups stay hidden. */
(function(){
  'use strict';
  const d=document,w=window, api=w.NQV, future=w.NQV_FUTURE||{};
  const bilingual=v=>v&&typeof v.vi==='string'&&v.vi.trim()&&typeof v.en==='string'&&v.en.trim();
  const text=(value,lang)=>typeof value==='string'?value:(value&&typeof value[lang]==='string'?value[lang]:'');
  const items=key=>Array.isArray(future[key])?future[key].filter(x=>x&&bilingual(x.title)&&bilingual(x.description)):[];
  const groups={experience:items('experience'),projects:items('projects'),awards:items('awards'),certifications:items('certifications')};
  const headings={experience:{vi:'Kinh nghiệm làm việc',en:'Work experience'},projects:{vi:'Dự án',en:'Projects'},awards:{vi:'Giải thưởng bổ sung',en:'Additional awards'},certifications:{vi:'Chứng chỉ bổ sung',en:'Additional certifications'}};
  const localized=[];
  function el(tag,cls,parent){const n=d.createElement(tag);if(cls)n.className=cls;if(parent)parent.append(n);return n;}
  function label(node,value){localized.push([node,value]);node.textContent=text(value,api.i18n.get());}
  function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch(e){return null;}}
  function card(item,grid){
    const a=el('article','future-card',grid);a.setAttribute('data-reveal','');
    const subtitle=el('p','future-meta',a);label(subtitle,item.subtitle);subtitle.hidden=!text(item.subtitle,'vi')&&!text(item.subtitle,'en');
    label(el('h3','future-title',a),item.title);
    if(item.period){const p=el('p','small-note',a);label(p,item.period);}
    label(el('p','future-description',a),item.description);
    if(Array.isArray(item.tags)&&item.tags.length){const tags=el('div','inline-tags',a);item.tags.filter(v=>typeof v==='string'||bilingual(v)).forEach(v=>label(el('span','',tags),v));}
    const url=safeUrl(item.url);if(url){const link=el('a','text-link future-link',a);link.href=url;link.target='_blank';link.rel='noopener noreferrer';label(link,{vi:'Xem chi tiết / xác thực',en:'View details / credential'});}
  }
  Object.keys(groups).forEach(key=>{
    const section=d.querySelector('[data-future-group="'+key+'"]');if(!section||!groups[key].length)return;
    section.hidden=false;label(section.querySelector('[data-future-heading]'),headings[key]);
    const grid=section.querySelector('.future-grid');groups[key].forEach(item=>card(item,grid));
  });
  const container=d.querySelector('#future-career');if(container&&(groups.experience.length||groups.projects.length))container.hidden=false;
  // The original two research awards and six certificates remain untouched.
  // When new items appear, summary counters/labels reflect the total, not an old fixed count.
  function total(key,base,target,quick,vi,en){
    if(!groups[key].length)return;
    const n=base+groups[key].length, a=d.querySelector('.evidence a[href="'+target+'"]');
    if(a){const count=a.querySelector('[data-count]');count.dataset.count=String(n);count.textContent=String(n);
      const l=a.querySelector('.evidence__label');l.removeAttribute('data-i18n');label(l,{vi,en});}
    const q=d.querySelector('#quick-dialog [data-i18n="'+quick+'"]');if(q){q.closest('.dashboard-tile').querySelector('strong').textContent=String(n);q.removeAttribute('data-i18n');label(q,{vi,en});}
  }
  total('awards',2,'#honors','v4.q.awards','giải thưởng','awards');
  total('certifications',6,'#certificates','v4.q.cert','chứng chỉ','certificates');
  api.i18n.onChange(lang=>localized.forEach(([node,value])=>{node.textContent=text(value,lang);}));
})();
