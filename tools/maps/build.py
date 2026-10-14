import json,sys,argparse
ap=argparse.ArgumentParser();ap.add_argument('--generated');ap.add_argument('--ds');ap.add_argument('--isw');ap.add_argument('--dg-date');ap.add_argument('--dg-id');A=ap.parse_args()
def lbl(d):return d[8:10]+'.'+d[5:7]

from shapely.geometry import Polygon, MultiPolygon, shape, mapping, box, Point
from shapely.ops import unary_union, transform
from shapely.validation import make_valid
from pyproj import Transformer
Q=200.0
def decode(s):
    polys=[]
    for p in s.split('#'):
        rings=[]
        for r in p.split('|'):
            pts=[];x=y=0
            for i,pair in enumerate(r.split(';')):
                a,b=map(int,pair.split(','))
                if i==0:x,y=a,b
                else:x+=a;y+=b
                pts.append((x/Q,y/Q))
            if len(pts)>=4: rings.append(pts)
        if rings:
            g=make_valid(Polygon(rings[0],rings[1:]))
            polys.append(g)
    return unary_union(polys)
ds_occ=decode(open('ds_occ.txt').read().strip())
ds_grey=decode(open('ds_grey.txt').read().strip())
dg_ru=decode(open('dg_ru.txt').read().strip())
isw_ctrl=unary_union([decode(open('isw_ctrl.txt').read().strip()),decode(open('isw_pre.txt').read().strip())]).buffer(0)
isw_adv=decode(open('isw_adv.txt').read().strip()).buffer(0)
# topojson decode (world-atlas 50m)
topo=json.load(open('package/countries-50m.json'))
sc,tr=topo['transform']['scale'],topo['transform']['translate']
arcs=[]
for a in topo['arcs']:
    x=y=0;pts=[]
    for dx,dy in a:
        x+=dx;y+=dy;pts.append((x*sc[0]+tr[0],y*sc[1]+tr[1]))
    arcs.append(pts)
def arc(i):
    return arcs[i] if i>=0 else arcs[~i][::-1]
def ring(ids):
    out=[]
    for i in ids:
        a=arc(i);out.extend(a if not out else a[1:])
    return out
def geom(g):
    if g['type']=='Polygon': return make_valid(Polygon(ring(g['arcs'][0]),[ring(r) for r in g['arcs'][1:]]))
    if g['type']=='MultiPolygon': return unary_union([make_valid(Polygon(ring(p[0]),[ring(r) for r in p[1:]])) for p in g['arcs']])
countries={}
for g in topo['objects']['countries']['geometries']:
    if g.get('type') in('Polygon','MultiPolygon'): countries[g['properties']['name']]=geom(g)
CRIMEA=countries['Russia'].intersection(box(32.3,44.2,36.645,46.25))
UA=unary_union([countries['Ukraine'],CRIMEA]).buffer(0)
countries['Ukraine']=UA
countries['Russia']=countries['Russia'].difference(CRIMEA)
BB=box(20.5,43.3,41.8,53.8)
fwd=Transformer.from_crs('EPSG:4326','EPSG:6933',always_xy=True).transform  # equal-area
km2=lambda g: transform(fwd,g).area/1e6
utm=Transformer.from_crs('EPSG:4326','EPSG:32637',always_xy=True).transform
ds_occ_ua=ds_occ.intersection(UA); ds_grey_ua=ds_grey.intersection(UA).difference(ds_occ_ua); dg_ua=dg_ru.intersection(UA)
isw_ua=isw_ctrl.intersection(UA); isw_adv_ua=isw_adv.intersection(UA).difference(isw_ua)
NC=lambda g:g.difference(CRIMEA)
ds_nc,dg_nc,isw_nc=NC(ds_occ_ua),NC(dg_ua),NC(isw_ua)
pairs={'dg_ds':(dg_nc,ds_nc),'dg_isw':(dg_nc,isw_nc),'isw_ds':(isw_nc,ds_nc)}
only={k:(a.difference(b),b.difference(a)) for k,(a,b) in pairs.items()}
only_dg_grey=only['dg_ds'][0].intersection(ds_grey_ua)
ds_occ_nocr=ds_nc
def clean(g,tol=0.002,minkm=0.5):
    g=g.buffer(0)
    parts=[p for p in (g.geoms if hasattr(g,'geoms') else [g]) if p.geom_type=='Polygon' and km2(p)>=minkm]
    return unary_union(parts).simplify(tol,preserve_topology=True) if parts else Polygon()
def coords(g,dec=3):
    out=[]
    for p in (g.geoms if hasattr(g,'geoms') else [g]):
        if p.is_empty or p.geom_type!='Polygon':continue
        rr=[[[round(x,dec),round(y,dec)] for x,y in p.exterior.coords]]+[[[round(x,dec),round(y,dec)] for x,y in r.coords] for r in p.interiors]
        out.append(rr)
    return out
base=[]
for n in ['Ukraine','Russia','Belarus','Poland','Slovakia','Hungary','Romania','Moldova','Georgia','Turkey','Bulgaria','Lithuania','Latvia']:
    if n in countries:
        g=countries[n].intersection(BB).simplify(0.01,preserve_topology=True)
        if not g.is_empty: base.append({'name':n,'ua':n=='Ukraine','c':coords(g,2)})
pre2022=None
areas={'ds_occ':km2(ds_occ_ua),'ds_grey':km2(ds_grey_ua),'dg_ru':km2(dg_ua),'isw':km2(isw_ua),'isw_adv':km2(isw_adv_ua),'ds_nc':km2(ds_nc),'dg_nc':km2(dg_nc),'isw_nc':km2(isw_nc),'crimea':km2(CRIMEA),'ua_total':km2(UA),'only_dg_grey':km2(only_dg_grey)}
for k,(x,y) in only.items(): areas[k+'_a']=km2(x); areas[k+'_b']=km2(y)
print({k:round(v) for k,v in areas.items()})
CITIES=[("Київ",50.45466,30.5238),("Харків",49.98177,36.25475),("Одеса",46.48572,30.74383),("Дніпро",48.46664,35.04066),("Запоріжжя",47.85167,35.11714),("Донецьк",48.023,37.80224),("Луганськ",48.56814,39.30553),("Маріуполь",47.09514,37.54131),("Херсон",46.63695,32.61458),("Миколаїв",46.97625,31.99296),("Суми",50.91741,34.79906),("Чернігів",51.50541,31.28656),("Полтава",49.58925,34.55367),("Львів",49.83826,24.02324),("Вінниця",49.2322,28.46871),("Кропивницький",48.50834,32.26618),("Краматорськ",48.73106,37.56779),("Слов'янськ",48.84974,37.59739),("Костянтинівка",48.52728,37.70594),("Покровськ",48.28014,37.17706),("Добропілля",48.46674,37.08567),("Куп'янськ",49.71003,37.61581),("Вовчанськ",50.29078,36.94108),("Оріхів",47.57613,35.78333),("Гуляйполе",47.66685,36.25576),("Мелітополь",46.84735,35.38196),("Бахмут",48.59419,37.99886),("Сіверськ",48.86476,38.09683),("Сімферополь",44.95719,34.11079),("Севастополь",44.60795,33.52134)]
DSU=transform(utm,ds_occ)
ISU=transform(utm,unary_union([isw_ctrl,isw_adv]))
ev=[]
for line in open('dg_events.txt').read().strip().split('\n'):
    i,d,la,lo,t=line.split('|',4);p=Point(float(lo),float(la))
    st='occ' if ds_occ.contains(p) else ('grey' if ds_grey.contains(p) else ('ua' if UA.contains(p) else 'out'))
    if st=='ua':
        dkm=DSU.distance(transform(utm,p))/1000
        if dkm<=2: st='edge'
        elif dkm>10: st='far'
    si='occ' if isw_ctrl.contains(p) else ('adv' if isw_adv.contains(p) else ('ua' if UA.contains(p) else 'out'))
    if si=='ua':
        dk=ISU.distance(transform(utm,p))/1000
        if dk<=2: si='edge'
        elif dk>10: si='far'
    ev.append({'id':int(i),'d':d,'lat':float(la),'lng':float(lo),'t':t,'ds':st,'isw':si})
from collections import Counter;print(Counter(e['ds'] for e in ev),Counter(e['isw'] for e in ev))
out={
 'schema':1,'generated':A.generated,
 'sources':{
  'deepstate':{'name':'DeepState','kind':'ua','asOf':A.ds,'asOfLabel':lbl(A.ds)+' о '+A.ds[11:16],'url':'https://deepstatemap.live','note':'Українська волонтерська карта. Шари: окуповано (разом з ОРДЛО та Кримом) і «статус невідомий» (сіра зона).'},
  'isw':{'name':'ISW','kind':'monitor','asOf':A.isw,'asOfLabel':lbl(A.isw)+' (pub_date шару)','url':'https://www.arcgis.com/home/item.html?id=9f04944a2fe84edab9da31750c2b15eb','note':'Institute for the Study of War (США), незалежний аналітичний центр. Шари: «Assessed Russian-Controlled Terrain» разом із територією під контролем рф до 24.02.2022, і окремо «Assessed Russian Advances».'},
  'divgen':{'name':'DIVGEN','kind':'ru','asOf':A.dg_date,'asOfLabel':lbl(A.dg_date)+', подія №'+A.dg_id,'url':'https://divgen.ru','note':'Російська карта «СВО», лише для контрасту. Шар «Контроль РФ» на дату останньої події.'}},
 'method':'Контури спрощено до ≈400 м і округлено до 0,005° (≈0,5 км), тому дрібні відмінності менше кілометра — шум. Площі пораховано в рівноплощинній проєкції лише в межах кордону 🇺🇦 України (Natural Earth 1:50m). Розбіжності: «лише перший» — територія, яку перше джерело вважає під контролем рф, а друге — ні (для пари DIVGEN↔DeepState окремо показано, скільки з неї DeepState має як сіру зону); «лише другий» — навпаки. Порівнюється будь-яка пара з трьох джерел. Крим із порівняння виключено: DIVGEN не позначає його як «Контроль РФ», бо вважає частиною рф.',
 'areas':{k:round(v) for k,v in areas.items()},
 'base':base,'cities':[{'n':n,'lat':a,'lng':b} for n,a,b in CITIES],
 'layers':{'ds_occ':coords(ds_occ_ua.simplify(0.002,preserve_topology=True)),'ds_grey':coords(clean(ds_grey_ua,0.002,0.2)),'dg_ru':coords(dg_ua.simplify(0.002,preserve_topology=True)),
   'isw':coords(isw_ua.simplify(0.002,preserve_topology=True)),'isw_adv':coords(clean(isw_adv_ua,0.002,0.2)),'only_dg_grey':coords(clean(only_dg_grey,0.002,0.5)),
   **{k+'_a':coords(clean(x,0.002,0.5)) for k,(x,y) in only.items()},**{k+'_b':coords(clean(y,0.002,0.5)) for k,(x,y) in only.items()}},
 'events':ev}
json.dump(out,open('maps.json','w'),ensure_ascii=False,separators=(',',':'))
import os;print('size',os.path.getsize('maps.json'))
