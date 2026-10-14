// Map data extractor for "Щоденний дайджест війни". Paste into the browser pane on the given site, then call:
//   await __extract('ds')   on https://deepstatemap.live/api/history/last
//   await __extract('dg')   on https://divgen.ru/
//   await __extract('isw')  on https://www.arcgis.com/sharing/rest/content/items/9f04944a2fe84edab9da31750c2b15eb?f=json
// ISW renamed layers (seen 7.10.2026: «Assessed Russian Control», «Assessed Russian Advances in Ukraine»); old and new titles are both accepted.
// It returns {meta, parts:[{name,len,hash,chunks}]}; read each chunk with __part(name,i) (5000 chars).
window.__h=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16)};
window.__enc=function(rings,tol,q){
 function dp(pts,eps){if(pts.length<3)return pts;const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;const st=[[0,pts.length-1]];
  while(st.length){const [a,b]=st.pop();let md=0,mi=-1;const [x1,y1]=pts[a],[x2,y2]=pts[b];const dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy;
   for(let i=a+1;i<b;i++){const [x,y]=pts[i];let d;if(L===0)d=(x-x1)**2+(y-y1)**2;else{let t=((x-x1)*dx+(y-y1)*dy)/L;t=Math.max(0,Math.min(1,t));d=(x-x1-t*dx)**2+(y-y1-t*dy)**2}if(d>md){md=d;mi=i}}
   if(md>eps*eps&&mi>0){keep[mi]=1;st.push([a,mi],[mi,b])}}return pts.filter((_,i)=>keep[i])}
 const out=[];
 for(const r of rings){const s=dp(r.map(p=>[p[0],p[1]]),tol);const qq=[];let px=null,py=null;
  for(const [x,y] of s){const X=Math.round(x*q),Y=Math.round(y*q);if(X===px&&Y===py)continue;qq.push([X,Y]);px=X;py=Y}
  if(qq.length<4)continue;let str=qq[0][0]+','+qq[0][1];for(let i=1;i<qq.length;i++)str+=';'+(qq[i][0]-qq[i-1][0])+','+(qq[i][1]-qq[i-1][1]);out.push(str)}
 return out.join('|')};
window.__encP=(polys)=>polys.map(p=>__enc(p,0.004,200)).filter(Boolean).join('#');
window.__P={};
window.__part=(name,i)=>__P[name].slice(i*5000,(i+1)*5000);
window.__extract=async function(src){
 const parts={};const meta={src};const P=x=>typeof x==='string'?JSON.parse(x):x;
 if(src==='ds'){const j=JSON.parse(document.body.innerText);const F=j.map.features;const nm=f=>(f.properties&&f.properties.name)||'';
   parts.ds_occ=__encP(F.filter(f=>f.geometry.type==='Polygon'&&/^(Окуповано|ОРДЛО|Окупований Крим|Острів Тузла)/.test(nm(f))).map(f=>f.geometry.coordinates));
   parts.ds_grey=__encP(F.filter(f=>f.geometry.type==='Polygon'&&/^Статус невідомий/.test(nm(f))).map(f=>f.geometry.coordinates));
   meta.id=j.id;meta.datetime=j.datetime}
 if(src==='dg'){const ev=P((await (await fetch('/api/events')).json()).data).events.sort((a,b)=>a.id-b.id);const last=ev[ev.length-1];
   let g=await (await fetch('/api/events/'+last.id+'/geojson')).json();if(g.data!==undefined)g=P(g.data);const gj=P(g.geojson);
   const geom=f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[];
   parts.dg_ru=__encP(gj.features.filter(f=>f.properties.description==='Контроль РФ').flatMap(geom));
   const since=new Date(Date.parse(last.pdate+'T00:00:00Z')-30*864e5).toISOString().slice(0,10);
   parts.dg_events=ev.filter(x=>x.pdate>=since).map(e=>[e.id,e.pdate,(+e.lat).toFixed(4),(+e.lng).toFixed(4),String(e.title).replace(/\s+/g,' ').trim()].join('|')).join('\n');
   meta.lastId=last.id;meta.lastDate=last.pdate;meta.lastTitle=last.title}
 if(src==='isw'){const R=6378137,toLL=([x,y])=>Math.abs(x)>180?[x/R*180/Math.PI,(2*Math.atan(Math.exp(y/R))-Math.PI/2)*180/Math.PI]:[x,y];
   const d=await (await fetch('/sharing/rest/content/items/9f04944a2fe84edab9da31750c2b15eb/data?f=json')).json();
   const TT={'Assessed Russian-Controlled Terrain':/^Assessed Russian(-Controlled Terrain| Control)( in Ukraine)?$/,'Assessed Russian Advances':/^Assessed Russian Advances( in Ukraine)?$/};const fl=t=>{const L=d.operationalLayers.find(x=>x.title===t)||d.operationalLayers.find(x=>TT[t]&&TT[t].test(x.title));if(!L)throw new Error('ISW layer not found: '+t+' — titles: '+d.operationalLayers.map(x=>x.title).join(' | '));return L.featureCollection.layers[0].featureSet.features};const esri=fs=>fs.map(f=>f.geometry.rings.map(r=>r.map(toLL)));
   const pre=await (await fetch('https://services5.arcgis.com/SaBe5HMtmnbqSWlu/arcgis/rest/services/VIEW_Russian_controlled_Ukrainian_Territory_before_February_24_2022/FeatureServer/36/query?where=1%3D1&outFields=*&f=geojson')).json();
   parts.isw_ctrl=__encP(esri(fl('Assessed Russian-Controlled Terrain')));
   parts.isw_pre=__encP(pre.features.flatMap(f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates));
   parts.isw_adv=__encP(esri(fl('Assessed Russian Advances')));
   meta.pubDate=fl('Assessed Russian-Controlled Terrain')[0].attributes.pub_date}
 Object.assign(__P,parts);
 return {meta,parts:Object.entries(parts).map(([name,s])=>({name,len:s.length,hash:__h(s),chunks:Math.ceil(s.length/5000)}))}};
'extractor loaded'
