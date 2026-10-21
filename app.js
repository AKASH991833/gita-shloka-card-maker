'use strict';
(function(){
var $=function(s){return document.querySelector(s)};
var G=window.GITA,CH=window.GITA_CH;
var THEMES=[
{id:'kesar',n:'Kesar Sunrise',bg:['#ffb347','#f0562a','#8e1d2b'],ink:'#fffaf0',sub:'#ffe9c7',acc:'#fff1b8',light:false},
{id:'night',n:'Krishna Night',bg:['#0a0f2e','#1d2b72','#43207a'],ink:'#ffffff',sub:'#cfd6ff',acc:'#ffd479'},
{id:'parch',n:'Parchment',bg:['#f9edd0','#ecd3a0','#d9b676'],ink:'#3a1d09',sub:'#5b3a1d',acc:'#9a3412'},
{id:'peacock',n:'Peacock',bg:['#04373b','#0a7a76','#1e3f96'],ink:'#ffffff',sub:'#cdf3ee',acc:'#ffe08a'},
{id:'rose',n:'Rose Gold',bg:['#33101e','#a3304f','#f4a07f'],ink:'#ffffff',sub:'#ffe3d8',acc:'#fff0c9'},
{id:'mono',n:'Pure Black',bg:['#000000','#0d0d0f','#1a1a1f'],ink:'#ffffff',sub:'#c4c4cc',acc:'#e5c07b'},
{id:'lotus',n:'Lotus White',bg:['#ffffff','#fdeaf5','#f3dcff'],ink:'#3b1747',sub:'#5d3a6b',acc:'#b0239c'},
{id:'forest',n:'Forest',bg:['#06210e','#14532d','#4b6a14'],ink:'#ffffff',sub:'#d6f2dc',acc:'#fde68a'}];
var SIZES={sq:[1080,1080],pt:[1080,1350],st:[1080,1920]};
var FONTS={tiro:{f:'"Tiro Devanagari Hindi","Noto Serif Devanagari",serif',w:400,k:1.0,lh:1.55},noto:{f:'"Noto Serif Devanagari","Tiro Devanagari Hindi",serif',w:700,k:.92,lh:1.5},hind:{f:'"Hind","Noto Sans Devanagari",sans-serif',w:600,k:1.02,lh:1.5}};
var BODY='"Hind","Noto Sans Devanagari",system-ui,sans-serif';
var S={mode:'verse',idx:93,theme:'kesar',size:'sq',font:'tiro',oSa:true,oTr:false,oRef:true,oOm:true,mark:'',kind:'sh',mean:'',custom:'',cref:''};
try{var saved=JSON.parse(localStorage.getItem('gsc-v1')||'null');if(saved&&typeof saved==='object'){['theme','size','font','mark','kind'].forEach(function(k){if(typeof saved[k]==='string')S[k]=saved[k].slice(0,40)});['oSa','oTr','oRef','oOm'].forEach(function(k){if(typeof saved[k]==='boolean')S[k]=saved[k]})}}catch(e){}
if(!THEMES.some(function(t){return t.id===S.theme}))S.theme='kesar';if(!SIZES[S.size])S.size='sq';if(!FONTS[S.font])S.font='tiro';if(['sh','se','hi','en','none'].indexOf(S.kind)<0)S.kind='sh';
function save(){try{localStorage.setItem('gsc-v1',JSON.stringify({theme:S.theme,size:S.size,font:S.font,oSa:S.oSa,oTr:S.oTr,oRef:S.oRef,oOm:S.oOm,mark:S.mark,kind:S.kind}))}catch(e){}}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('show')},2200)}
var cv=$('#cv'),ctx=cv.getContext('2d');

function verseLines(v){return v.sa.filter(function(l){return !/उवाच\s*$/.test(l)})}
function meaningFor(v,kind){
  if(kind==='none')return '';
  if(kind==='sh'&&v.sh)return v.sh;if(kind==='se'&&v.se)return v.se;
  if(kind==='sh'||kind==='hi')return v.hi;if(kind==='se'||kind==='en')return v.en;return v.hi}
function refText(v){var p=v.r.split('.');return 'श्रीमद्भगवद्गीता · अध्याय '+p[0]+' · श्लोक '+p[1]}
function wrap(c,text,maxW){
  var words=text.split(/\s+/).filter(Boolean),lines=[],cur='';
  for(var i=0;i<words.length;i++){var t=cur?cur+' '+words[i]:words[i];if(c.measureText(t).width<=maxW||!cur)cur=t;else{lines.push(cur);cur=words[i]}}
  if(cur)lines.push(cur);return lines}

function build(c,W,H,sc){
  // returns drawing blocks measured at scale sc
  var th=THEMES.filter(function(t){return t.id===S.theme})[0],fo=FONTS[S.font],ph=W>H?0:0,maxW=W-200,blocks=[];
  var big=H>1500?1.2:(H>1200?1.08:1);
  var v=S.mode==='verse'?G[S.idx]:null;
  function add(kind,font,size,lh,color,lines,gap){blocks.push({kind:kind,font:font,size:size,lh:lh,color:color,lines:lines,gap:gap})}
  if(S.mode==='verse'){
    if(S.oSa){var vl=verseLines(v),fs=Math.round(60*fo.k*sc*big),fit=false;for(var q=1;q>=.78;q-=.04){var f2=Math.round(60*fo.k*sc*big*q);c.font=fo.w+' '+f2+'px '+fo.f;if(vl.every(function(l){return c.measureText(l).width<=maxW})){fs=f2;fit=true;break}}if(!fit)fs=Math.round(60*fo.k*sc*big*.92);c.font=fo.w+' '+fs+'px '+fo.f;var ls=[];vl.forEach(function(l){wrap(c,l,maxW).forEach(function(x){ls.push(x)})});add('sa',c.font,fs,fo.lh,th.ink,ls,Math.round(34*sc))}
    if(S.oTr){var ts=Math.round(27*sc*big);c.font='500 '+ts+'px '+BODY;var tl=[];v.tr.forEach(function(l){wrap(c,l,maxW).forEach(function(x){tl.push(x)})});add('tr',c.font,ts,1.5,th.sub,tl,Math.round(30*sc))}
  }else{
    var cs=Math.round(62*fo.k*sc*big);c.font=fo.w+' '+cs+'px '+fo.f;var cl=[];(S.custom||'Write your own line here').split('\n').forEach(function(l){wrap(c,l,maxW).forEach(function(x){cl.push(x)})});add('sa',c.font,cs,fo.lh,th.ink,cl,Math.round(34*sc))}
  var m=S.mean.trim();
  if(m&&S.kind!=='none'||S.mode==='custom'&&m){var ms=Math.round(34*sc*big);c.font='500 '+ms+'px '+BODY;var ml=wrap(c,m,maxW-40);add('mean',c.font,ms,1.55,th.sub,ml,0)}
  return blocks}
function total(bl){var h=0;bl.forEach(function(b,i){h+=b.lines.length*b.size*b.lh+(i<bl.length-1?b.gap:0)});return h}

function draw(c,W,H){
  var th=THEMES.filter(function(t){return t.id===S.theme})[0];
  c.clearRect(0,0,W,H);
  var g=c.createLinearGradient(0,0,W*.8,H);g.addColorStop(0,th.bg[0]);g.addColorStop(.55,th.bg[1]);g.addColorStop(1,th.bg[2]);c.fillStyle=g;c.fillRect(0,0,W,H);
  // glow
  var rg=c.createRadialGradient(W/2,H*.18,10,W/2,H*.18,W*.75);rg.addColorStop(0,hexA(th.acc,.28));rg.addColorStop(1,hexA(th.acc,0));c.fillStyle=rg;c.fillRect(0,0,W,H);
  // mandala rings
  c.save();c.translate(W/2,H*.5);c.strokeStyle=hexA(th.acc,.09);c.lineWidth=2;
  for(var r=140;r<W*.95;r+=70){c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke()}
  for(var a=0;a<24;a++){c.save();c.rotate(a*Math.PI/12);c.beginPath();c.ellipse(0,-W*.34,22,70,0,0,Math.PI*2);c.stroke();c.restore()}
  c.restore();
  // frame
  c.strokeStyle=hexA(th.acc,.55);c.lineWidth=3;rr(c,34,34,W-68,H-68,34);c.stroke();
  c.strokeStyle=hexA(th.acc,.22);c.lineWidth=2;rr(c,52,52,W-104,H-104,24);c.stroke();
  var top=120,bottom=S.mark.trim()?H-150:H-110;
  var y0=top;
  c.textAlign='center';c.textBaseline='alphabetic';
  if(S.oOm){c.font='600 64px '+'"Noto Serif Devanagari","Tiro Devanagari Hindi",serif';c.fillStyle=th.acc;c.fillText('ॐ',W/2,y0+40);y0+=78}
  if(S.oRef){var rt=S.mode==='verse'?refText(G[S.idx]):(S.cref.trim()||'');if(rt){c.font='500 28px '+BODY;c.fillStyle=th.acc;c.fillText(rt,W/2,y0+30);y0+=62}}
  var avail=bottom-y0-30;
  var sc=1.25,bl;
  for(;sc>=.34;sc-=.03){bl=build(c,W,H,sc);if(total(bl)<=avail)break}
  var cut=false;
  if(total(bl)>avail){ // truncate meaning
    var mb=bl.filter(function(b){return b.kind==='mean'})[0];
    if(mb){var words=S.mean.trim().split(/\s+/);var keep=words.length;var saveM=S.mean;
      while(keep>8){keep=Math.floor(keep*.9);S.mean=words.slice(0,keep).join(' ')+'…';bl=build(c,W,H,sc);if(total(bl)<=avail)break}
      S.mean=saveM;cut=true}
  }
  var th2=total(bl),y=y0+Math.max(0,(avail-th2)/2)+30;
  bl.forEach(function(b,i){
    c.font=b.font;c.fillStyle=b.color;
    b.lines.forEach(function(l){y+=b.size*b.lh;c.fillText(l,W/2,y-b.size*(b.lh-1)/2-b.size*.12)});
    if(i<bl.length-1){
      if(bl[i+1].kind==='mean'||b.kind==='tr'&&bl[i+1].kind==='mean'){ // ornament
        var oy=y+b.gap/2-6;c.strokeStyle=hexA(th.acc,.7);c.lineWidth=2;c.beginPath();c.moveTo(W/2-150,oy);c.lineTo(W/2-22,oy);c.moveTo(W/2+22,oy);c.lineTo(W/2+150,oy);c.stroke();
        c.fillStyle=th.acc;c.beginPath();c.moveTo(W/2,oy-9);c.lineTo(W/2+9,oy);c.lineTo(W/2,oy+9);c.lineTo(W/2-9,oy);c.closePath();c.fill()}
      y+=b.gap}
  });
  var mk=S.mark.trim();
  if(mk){c.font='600 28px '+BODY;c.fillStyle=th.acc;c.textAlign='center';c.fillText(mk,W/2,H-92)}
  return {sc:sc,cut:cut}
}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function hexA(h,a){var n=parseInt(h.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'}

var fontsReady=false;
function loadFonts(){
  var specs=['400 40px "Tiro Devanagari Hindi"','700 40px "Noto Serif Devanagari"','600 40px "Hind"','500 40px "Hind"','500 40px "Hind"'];
  var samples=['कर्म','karma ṛṣṭ','ॐ','ABC'];
  return Promise.all(specs.map(function(s,i){return document.fonts.load(s,samples[i%samples.length]).catch(function(){})}).concat([document.fonts.load('500 40px "Hind"','ṇṣāṭ')])).then(function(){fontsReady=true})}
var pending=false;
function render(){
  if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;
    var d=SIZES[S.size];if(cv.width!==d[0]||cv.height!==d[1]){cv.width=d[0];cv.height=d[1]}
    var r=draw(ctx,d[0],d[1]);
    var n='';if(r.cut)n='Text was long, so the meaning was shortened on the card. Use Short meaning or edit it.';else if(r.sc<.55)n='Text is long, so letters got small. Short meaning looks better.';
    $('#note').textContent=n;
  })}

// ---------- UI ----------
function curSelect(){var v=G[S.idx],p=v.r.split('.');$('#chsel').value=p[0];fillVerses(+p[0]);$('#vsel').value=p[1]}
function fillVerses(ch){var n=CH[ch-1].v,s=$('#vsel');s.replaceChildren();for(var i=1;i<=n;i++){var o=document.createElement('option');o.value=i;o.textContent=i;s.appendChild(o)}}
function setMeaningFromKind(){var v=S.mode==='verse'?G[S.idx]:null;
  if(!v){return}
  var k=S.kind;var hint='You can edit the meaning text above.';
  if((k==='sh'||k==='se')&&!v.sh){hint='Short meaning is available for 55 popular shlokas. This one shows the full meaning, trim it if needed.'}
  S.mean=meaningFor(v,k);$('#mean').value=S.mean;$('#meanhint').textContent=hint}
function pickVerse(i){S.mode='verse';S.idx=i;setTab('verse');curSelect();
  if(S.kind==='none'){}
  setMeaningFromKind();render();$('#results').hidden=true}
function setTab(m){S.mode=m;$('#tabVerse').setAttribute('aria-selected',m==='verse');$('#tabCustom').setAttribute('aria-selected',m==='custom');$('#paneVerse').hidden=m!=='verse';$('#paneCustom').hidden=m!=='custom';
  if(m==='custom'){S.mean=$('#mean').value}
  ['oSa','oTr'].forEach(function(k){});$('#oTr').disabled=m==='custom';}
function refIdx(r){for(var i=0;i<G.length;i++)if(G[i].r===r)return i;return -1}
function norm(s){return s.toLowerCase().normalize('NFC')}
function search(q){
  q=q.trim();var box=$('#results');box.replaceChildren();
  if(!q){box.hidden=true;return}
  var m=q.match(/^(\d{1,2})[.\s:,-]+(\d{1,3})$/),res=[];
  if(m){var i=refIdx(+m[1]+'.'+ +m[2]);if(i>=0)res.push(i)}
  else{var nq=norm(q);for(var j=0;j<G.length&&res.length<30;j++){var v=G[j];var hay=norm((v.sh||'')+' '+(v.se||'')+' '+v.en+' '+v.hi+' '+v.sa.join(' ')+' '+v.tr.join(' ')+' '+v.r);if(hay.indexOf(nq)>=0)res.push(j)}}
  box.hidden=false;
  if(!res.length){var p=document.createElement('div');p.className='muted small';p.style.padding='12px';p.textContent='No shloka found. Try a number like 2.47 or a word like karma.';box.appendChild(p);return}
  res.forEach(function(i){var v=G[i];var b=document.createElement('button');b.type='button';var bb=document.createElement('b');bb.textContent='Gita '+v.r;var sp=document.createElement('span');sp.textContent=(v.se||v.en).slice(0,110);b.append(bb,sp);b.addEventListener('click',function(){pickVerse(i)});box.appendChild(b)})}

var themeFilter='All';
function buildPopular(){
  var tc=$('#themes');tc.replaceChildren();var themes=['All'];G.forEach(function(v){if(v.th&&themes.indexOf(v.th)<0)themes.push(v.th)});
  themes.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='chip'+(t===themeFilter?' on':'');b.textContent=t;b.addEventListener('click',function(){themeFilter=t;buildPopular()});tc.appendChild(b)});
  var pc=$('#popular');pc.replaceChildren();
  G.forEach(function(v,i){if(!v.th||(themeFilter!=='All'&&v.th!==themeFilter))return;var b=document.createElement('button');b.type='button';b.className='chip'+(S.mode==='verse'&&S.idx===i?' on':'');b.textContent=v.r;b.title=v.se;b.addEventListener('click',function(){pickVerse(i);buildPopular()});pc.appendChild(b)})}
function buildSwatches(){var box=$('#swatches');box.replaceChildren();
  THEMES.forEach(function(t){var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-checked',t.id===S.theme);b.setAttribute('aria-label',t.n);b.style.background='linear-gradient(135deg,'+t.bg[0]+','+t.bg[1]+','+t.bg[2]+')';var c=(t.id==='parch'||t.id==='lotus')?t.ink:'#fff';b.style.color=c;b.style.textShadow=c==='#fff'?'0 1px 3px rgba(0,0,0,.6)':'none';b.textContent=t.n;
    b.addEventListener('click',function(){S.theme=t.id;save();buildSwatches();render()});box.appendChild(b)})}
function filename(){var v=S.mode==='verse'?'gita-'+G[S.idx].r.replace('.','-'):'shloka-card';return v+'-'+S.size+'.png'}
function blob(cb){cv.toBlob(cb,'image/png')}
function download(){blob(function(b){if(!b){toast('Could not make image');return}var u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=filename();document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);toast('Image downloaded')})}
function share(){blob(function(b){if(!b)return;var f=new File([b],filename(),{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Gita shloka'}).catch(function(){})}else{download();toast('Share not supported here, image downloaded')}})}
function caption(){
  var out=[];
  if(S.mode==='verse'){var v=G[S.idx];out.push(verseLines(v).join('\n'));if(S.mean.trim())out.push(S.mean.trim());out.push('📖 Bhagavad Gita '+v.r);
    var tags=['#BhagavadGita','#Gita','#Krishna','#Sanatan','#GitaQuotes','#Shloka'];if(v.th)tags.push('#'+v.th+'Quotes');out.push(tags.join(' '))}
  else{out.push(S.custom.trim());if(S.mean.trim())out.push(S.mean.trim());out.push('#Motivation #Quotes #Inspiration')}
  return out.join('\n\n')}
function copyCap(){var t=caption();if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){toast('Caption copied')},function(){fallbackCopy(t)})}else fallbackCopy(t)}
function fallbackCopy(t){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Caption copied')}catch(e){toast('Copy not allowed here')}ta.remove()}

function init(){
  CH.forEach(function(c){var o=document.createElement('option');o.value=c.n;o.textContent=c.n+'. '+c.en;$('#chsel').appendChild(o)});
  $('#size').value=S.size;$('#font').value=S.font;$('#meankind').value=S.kind;$('#mark').value=S.mark;
  ['oSa','oTr','oRef','oOm'].forEach(function(k){$('#'+k).checked=S[k];$('#'+k).addEventListener('change',function(e){S[k]=e.target.checked;save();render()})});
  S.idx=refIdx('2.47');curSelect();setMeaningFromKind();buildPopular();buildSwatches();
  $('#chsel').addEventListener('change',function(e){fillVerses(+e.target.value);pickVerse(refIdx(e.target.value+'.1'));buildPopular()});
  $('#vsel').addEventListener('change',function(e){pickVerse(refIdx($('#chsel').value+'.'+e.target.value));buildPopular()});
  $('#q').addEventListener('input',function(e){search(e.target.value)});
  $('#rand').addEventListener('click',function(){pickVerse(Math.floor(Math.random()*G.length));buildPopular()});
  $('#today').addEventListener('click',function(){var cur=[];G.forEach(function(v,i){if(v.th)cur.push(i)});var d=new Date(),day=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);pickVerse(cur[day%cur.length]);buildPopular()});
  $('#meankind').addEventListener('change',function(e){S.kind=e.target.value;save();if(S.mode==='verse'){setMeaningFromKind()}else if(S.kind==='none'){S.mean='';$('#mean').value=''}render()});
  $('#mean').addEventListener('input',function(e){S.mean=e.target.value;render()});
  $('#mark').addEventListener('input',function(e){S.mark=e.target.value;save();render()});
  $('#size').addEventListener('change',function(e){S.size=e.target.value;save();render()});
  $('#font').addEventListener('change',function(e){S.font=e.target.value;save();render()});
  $('#ctext').addEventListener('input',function(e){S.custom=e.target.value;render()});
  $('#cref').addEventListener('input',function(e){S.cref=e.target.value;render()});
  $('#tabVerse').addEventListener('click',function(){setTab('verse');if(S.kind!=='none')setMeaningFromKind();render()});
  $('#tabCustom').addEventListener('click',function(){setTab('custom');$('#mean').value=S.mean;$('#meanhint').textContent='Write your own meaning or caption line (optional).';render()});
  $('#dl').addEventListener('click',download);$('#share').addEventListener('click',share);$('#copycap').addEventListener('click',copyCap);
  document.addEventListener('themechange',render);
  window.__gsc={S:S,G:G,pickVerse:pickVerse,render:render};
  loadFonts().then(render);render();
  if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0){navigator.serviceWorker.register('sw.js').catch(function(){})}
}
init();
})();
