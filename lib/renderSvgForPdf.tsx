// ─── Kleuren ─────────────────────────────────────────────────────────────────
const FRAME_FILL   = "#d4d8de";   // kozijnprofiel grijs
const FRAME_STROKE = "#2d3748";   // buitenlijn kozijn
const GLASS_FILL   = "#dbeafe";   // lichtblauw glas
const GLASS_LINE   = "#93c5fd";   // diagonalen in glas
const VLEUGEL      = "#1e293b";   // vleugel / binnenprofiel
const OPEN_LINE    = "#475569";   // openingsindicator stippel
const DIM_COLOR    = "#1066a3";   // maatvoeringskleur
const HINGE_FILL   = "#94a3b8";   // scharnier

// ─── Constanten ──────────────────────────────────────────────────────────────
const FT  = 16;   // frame thickness px
const VT  = 5;    // vleugel inset px
const DIV = 10;   // tussenstijl breedte
const DIM_GAP  = 14;  // ruimte boven dimensielijn
const DIM_H    = 22;  // hoogte dimensie-gebied
const DIM_R    = 42;  // breedte dimensie rechts

// ─── Types ────────────────────────────────────────────────────────────────────
type VakDef = { type: "vast" | "dk" | "kiep"; mirror?: boolean };

// ─── Slug parser ──────────────────────────────────────────────────────────────
function parseVakken(slug: string): VakDef[] {
  const map: Record<string, VakDef[]> = {
    "vast-kozijn":                                        [{ type:"vast" }],
    "draai-kiep-kozijn":                                  [{ type:"dk" }],
    "kiep-kozijn":                                        [{ type:"kiep" }],
    "draai-kiep-vast-kozijn":                             [{ type:"dk" },{ type:"vast" }],
    "draai-kiep-draai-stolp-kozijn":                      [{ type:"dk" },{ type:"dk",mirror:true }],
    "vast-vast-kozijn":                                   [{ type:"vast" },{ type:"vast" }],
    "kiep-vast-liggend":                                  [{ type:"kiep" },{ type:"vast" }],
    "kiep-kiep-kozijn":                                   [{ type:"kiep" },{ type:"kiep" }],
    "dk-dk-gelijk":                                       [{ type:"dk" },{ type:"dk",mirror:true }],
    "vast-bovenlicht-kiep":                               [{ type:"vast" }],
    "dk-bovenlicht-vast":                                 [{ type:"dk" }],
    "dk-bovenlicht-kiep":                                 [{ type:"dk" }],
    "dk-borstwering-vast":                                [{ type:"dk" }],
    "draai-kiep-vast-draai-kiep-kozijn":                  [{ type:"dk" },{ type:"vast" },{ type:"dk",mirror:true }],
    "vast-vast-vast-kozijn":                              [{ type:"vast" },{ type:"vast" },{ type:"vast" }],
    "vast-draai-kiep-vast-kozijn":                        [{ type:"vast" },{ type:"dk" },{ type:"vast" }],
    "draai-kiep-vast-vast-kozijn":                        [{ type:"dk" },{ type:"vast" },{ type:"vast" }],
    "draai-kiep-draai-kiep-draai-kiep-kozijn":            [{ type:"dk" },{ type:"dk" },{ type:"dk",mirror:true }],
    "draai-kiep-vast-vast-draai-kiep-kozijn":             [{ type:"dk" },{ type:"vast" },{ type:"vast" },{ type:"dk",mirror:true }],
    "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn": [{ type:"dk" },{ type:"dk" },{ type:"dk" },{ type:"dk",mirror:true }],
  };
  return map[slug] ?? [{ type:"vast" }];
}

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function rect(x:number,y:number,w:number,h:number,fill:string,stroke:string,sw:number,extra=""):string {
  return `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
}
function line(x1:number,y1:number,x2:number,y2:number,stroke:string,sw:number,dash=""):string {
  const d = dash ? `stroke-dasharray="${dash}"` : "";
  return `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${stroke}" stroke-width="${sw}" ${d}/>`;
}
function text(x:number,y:number,txt:string,anchor="middle",size=11,fill=DIM_COLOR,transform=""):string {
  return `<text x="${r(x)}" y="${r(y)}" text-anchor="${anchor}" font-family="Arial,sans-serif" font-size="${size}" fill="${fill}" ${transform}>${txt}</text>`;
}
function r(n:number):string { return n.toFixed(1); }

// ─── Vak tekeningen ──────────────────────────────────────────────────────────

function drawVastVak(x:number,y:number,w:number,h:number):string {
  let s = "";
  s += rect(x,y,w,h, GLASS_FILL,"none",0);
  s += line(x,y,x+w,y+h, GLASS_LINE,0.9);
  s += line(x+w,y,x,y+h, GLASS_LINE,0.9);
  return s;
}

function drawDkVak(x:number,y:number,w:number,h:number,mirror=false):string {
  let s = "";
  s += rect(x,y,w,h, GLASS_FILL,"none",0);
  s += line(x,y,x+w,y+h, GLASS_LINE,0.9);
  s += line(x+w,y,x,y+h, GLASS_LINE,0.9);
  // vleugel binnenprofiel
  const vx=x+VT, vy=y+VT, vw=w-VT*2, vh=h-VT*2;
  s += rect(vx,vy,vw,vh,"none",VLEUGEL,2);
  // openingsindicator (driehoek stippel)
  const ax = mirror ? vx+vw : vx;
  const bx = mirror ? vx : vx+vw;
  const mx = vx+vw/2;
  s += line(ax,vy, mx,vy+vh, OPEN_LINE,1.2,"6,3");
  s += line(mx,vy+vh, bx,vy, OPEN_LINE,1.2,"6,3");
  s += line(ax,vy, bx,vy, OPEN_LINE,1.2,"6,3");
  // greep
  const hx = mirror ? vx+5 : vx+vw-10;
  s += `<rect x="${r(hx)}" y="${r(vy+vh/2-14)}" width="5" height="28" rx="2.5" fill="${HINGE_FILL}" stroke="${VLEUGEL}" stroke-width="0.8"/>`;
  return s;
}

function drawKiepVak(x:number,y:number,w:number,h:number):string {
  let s = "";
  s += rect(x,y,w,h, GLASS_FILL,"none",0);
  s += line(x,y,x+w,y+h, GLASS_LINE,0.9);
  s += line(x+w,y,x,y+h, GLASS_LINE,0.9);
  const vx=x+VT, vy=y+VT, vw=w-VT*2, vh=h-VT*2;
  s += rect(vx,vy,vw,vh,"none",VLEUGEL,2);
  const mx=vx+vw/2;
  s += line(vx,vy+vh, mx,vy, OPEN_LINE,1.2,"6,3");
  s += line(mx,vy, vx+vw,vy+vh, OPEN_LINE,1.2,"6,3");
  s += line(vx,vy+vh, vx+vw,vy+vh, OPEN_LINE,1.2,"6,3");
  s += `<rect x="${r(mx-14)}" y="${r(vy+5)}" width="28" height="5" rx="2.5" fill="${HINGE_FILL}" stroke="${VLEUGEL}" stroke-width="0.8"/>`;
  return s;
}

// ─── Hoofd bouwer: kozijn ─────────────────────────────────────────────────────

function buildKozijnSvg(slug:string,breedte:number,hoogte:number):string {
  const vakken = parseVakken(slug);
  const n = vakken.length;

  // Canvas proporties
  const CW = 460;
  const ratio = breedte/hoogte;
  const CH = Math.max(160, Math.min(Math.round(CW/ratio), 560));

  // Glas-gebied (binnen het frame)
  const gx = FT, gy = FT;
  const gw = CW - FT*2;
  const gh = CH - FT*2;

  // Breedte van elk vak
  const vakW = (gw - (n-1)*DIV) / n;

  let s = "";

  // Buitenste kader (frame)
  s += rect(0,0,CW,CH, FRAME_FILL,FRAME_STROKE,2.5,"rx='2'");

  // Glas achtergrond
  s += rect(gx,gy,gw,gh, GLASS_FILL,"none",0);

  // Tussenstijlen
  for(let i=1;i<n;i++){
    const tx = gx + i*(vakW+DIV) - DIV;
    s += rect(tx,0,DIV,CH, FRAME_FILL,FRAME_STROKE,1);
  }

  // Vakken
  for(let i=0;i<n;i++){
    const vx = gx + i*(vakW+DIV);
    const vy = gy;
    const vk = vakken[i];
    if(vk.type==="vast")      s += drawVastVak(vx,vy,vakW,gh);
    else if(vk.type==="dk")   s += drawDkVak(vx,vy,vakW,gh,vk.mirror);
    else if(vk.type==="kiep") s += drawKiepVak(vx,vy,vakW,gh);
  }

  // Binnenste kaderlijn bovenop (geeft diepte aan frame)
  s += rect(FT-4,FT-4,gw+8,gh+8,"none",FRAME_STROKE,1.5);

  // Maatvoering — breedte onderkant
  const dimY = CH + DIM_GAP;
  s += line(0,CH+4, 0,CH+12, DIM_COLOR,1);
  s += line(CW,CH+4, CW,CH+12, DIM_COLOR,1);
  s += line(0,CH+8, CW,CH+8, DIM_COLOR,1);
  // pijlpunten
  s += `<polygon points="6,${r(CH+8)} 0,${r(CH+5)} 0,${r(CH+11)}" fill="${DIM_COLOR}"/>`;
  s += `<polygon points="${r(CW-6)},${r(CH+8)} ${r(CW)},${r(CH+5)} ${r(CW)},${r(CH+11)}" fill="${DIM_COLOR}"/>`;
  s += text(CW/2, dimY+10, `${breedte} mm`);

  // Maatvoering — hoogte rechterkant
  s += line(CW+4,0, CW+12,0, DIM_COLOR,1);
  s += line(CW+4,CH, CW+12,CH, DIM_COLOR,1);
  s += line(CW+8,0, CW+8,CH, DIM_COLOR,1);
  s += `<polygon points="${r(CW+8)},6 ${r(CW+5)},0 ${r(CW+11)},0" fill="${DIM_COLOR}"/>`;
  s += `<polygon points="${r(CW+8)},${r(CH-6)} ${r(CW+5)},${r(CH)} ${r(CW+11)},${r(CH)}" fill="${DIM_COLOR}"/>`;
  s += text(CW+DIM_R/2+2, CH/2+5, `${hoogte} mm`,  "middle",11,DIM_COLOR,`transform="rotate(-90,${r(CW+DIM_R/2+2)},${r(CH/2)})"`);

  const totalW = CW + DIM_R + 4;
  const totalH = CH + DIM_H + 8;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="white"/>
  ${s}
</svg>`;
}

// ─── Schuifpui ────────────────────────────────────────────────────────────────

function buildSchuifpuiSvg(slug:string,breedte:number,hoogte:number):string {
  const n = slug.includes("4-vaks") ? 4 : 2;
  const CW=460, ratio=breedte/hoogte;
  const CH=Math.max(160,Math.min(Math.round(CW/ratio),400));
  const vakW=(CW-FT*2-(n-1)*DIV)/n;
  let s="";
  s+=rect(0,0,CW,CH,FRAME_FILL,FRAME_STROKE,2.5,"rx='2'");
  for(let i=0;i<n;i++){
    const vx=FT+i*(vakW+DIV), vy=FT, vw=vakW, vh=CH-FT*2;
    s+=rect(vx,vy,vw,vh,GLASS_FILL,"none",0);
    s+=line(vx,vy,vx+vw,vy+vh,GLASS_LINE,0.9);
    s+=line(vx+vw,vy,vx,vy+vh,GLASS_LINE,0.9);
    if(i<n-1) s+=rect(vx+vw,0,DIV,CH,FRAME_FILL,FRAME_STROKE,1);
    // schuifpijl afwisselend links/rechts
    const ay=vy+vh/2, dir=i%2===0?1:-1;
    const ax1=vx+vw/2-dir*16, ax2=vx+vw/2+dir*16;
    s+=line(ax1,ay,ax2,ay,VLEUGEL,2);
    s+=`<polygon points="${r(ax2)},${r(ay)} ${r(ax2-dir*8)},${r(ay-5)} ${r(ax2-dir*8)},${r(ay+5)}" fill="${VLEUGEL}"/>`;
  }
  s+=rect(FT-4,FT-4,CW-FT*2+8,CH-FT*2+8,"none",FRAME_STROKE,1.5);
  const totalW=CW+DIM_R+4, totalH=CH+DIM_H+8;
  s+=dimLines(CW,CH,breedte,hoogte);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="white"/>
  ${s}
</svg>`;
}

// ─── Harmonicadeur ────────────────────────────────────────────────────────────

function buildHarmonicaSvg(slug:string,breedte:number,hoogte:number):string {
  const n=slug.includes("vijf")?5:slug.includes("vier")?4:3;
  const CW=460, ratio=breedte/hoogte;
  const CH=Math.max(200,Math.min(Math.round(CW/ratio),500));
  const vakW=(CW-FT*2)/n;
  let s="";
  s+=rect(0,0,CW,CH,FRAME_FILL,FRAME_STROKE,2.5,"rx='2'");
  for(let i=0;i<n;i++){
    const vx=FT+i*vakW, vy=FT, vw=vakW, vh=CH-FT*2;
    s+=rect(vx,vy,vw,vh,GLASS_FILL,"none",0);
    s+=line(vx,vy,vx+vw,vy+vh,GLASS_LINE,0.9);
    s+=line(vx+vw,vy,vx,vy+vh,GLASS_LINE,0.9);
    if(i<n-1) s+=line(vx+vw,FT,vx+vw,CH-FT,VLEUGEL,2,"8,4");
  }
  s+=rect(FT-4,FT-4,CW-FT*2+8,CH-FT*2+8,"none",FRAME_STROKE,1.5);
  s+=dimLines(CW,CH,breedte,hoogte);
  const totalW=CW+DIM_R+4, totalH=CH+DIM_H+8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="white"/>
  ${s}
</svg>`;
}

// ─── Deur ─────────────────────────────────────────────────────────────────────

function drawDeurPanel(x:number,y:number,w:number,h:number,mirror=false):string {
  let s="";
  // glas
  s+=rect(x,y,w,h,GLASS_FILL,"none",0);
  s+=line(x,y,x+w,y+h,GLASS_LINE,0.9);
  s+=line(x+w,y,x,y+h,GLASS_LINE,0.9);
  // vleugel binnenprofiel
  const vx=x+VT,vy=y+VT,vw=w-VT*2,vh=h-VT*2;
  s+=rect(vx,vy,vw,vh,"none",VLEUGEL,2.5);
  // openingsindicator: rechte stippellijnen zoals dk
  const ax = mirror ? vx+vw : vx;
  const bx = mirror ? vx : vx+vw;
  const mx = vx+vw/2;
  s+=line(ax,vy, mx,vy+vh, OPEN_LINE,1.3,"7,4");
  s+=line(mx,vy+vh, bx,vy, OPEN_LINE,1.3,"7,4");
  s+=line(ax,vy, bx,vy, OPEN_LINE,1.3,"7,4");
  // greep (midden hoogte, tegenkant scharnier)
  const hx = mirror ? vx+vw-10 : vx+4;
  s+=`<rect x="${r(hx)}" y="${r(vy+vh/2-20)}" width="6" height="40" rx="3" fill="${HINGE_FILL}" stroke="${VLEUGEL}" stroke-width="0.8"/>`;
  // scharnieren (3 stuks, scharnierkant)
  const sx = mirror ? vx : vx+vw-6;
  for(const sy of [0.18,0.5,0.82]){
    s+=`<rect x="${r(sx)}" y="${r(vy+vh*sy-10)}" width="6" height="20" rx="2" fill="${HINGE_FILL}" stroke="${VLEUGEL}" stroke-width="0.8"/>`;
  }
  return s;
}

function buildDeurSvg(breedte:number,hoogte:number):string {
  const dubbel = breedte >= 1400;
  const CW = dubbel ? 460 : 360;
  const ratio=breedte/hoogte;
  const CH=Math.max(280,Math.min(Math.round(CW/ratio),520));
  let s="";
  s+=rect(0,0,CW,CH,FRAME_FILL,FRAME_STROKE,2.5,"rx='2'");

  if(dubbel){
    const gw=CW-FT*2, gh=CH-FT*2;
    const vakW=(gw-DIV)/2;
    s+=rect(FT,FT,gw,gh,GLASS_FILL,"none",0);
    // tussenstijl
    s+=rect(FT+vakW,0,DIV,CH,FRAME_FILL,FRAME_STROKE,1);
    s+=drawDeurPanel(FT, FT, vakW, gh, false);
    s+=drawDeurPanel(FT+vakW+DIV, FT, vakW, gh, true);
  } else {
    const gw=CW-FT*2, gh=CH-FT*2;
    s+=rect(FT,FT,gw,gh,GLASS_FILL,"none",0);
    s+=drawDeurPanel(FT, FT, gw, gh, false);
  }

  s+=rect(FT-4,FT-4,CW-FT*2+8,CH-FT*2+8,"none",FRAME_STROKE,1.5);
  s+=dimLines(CW,CH,breedte,hoogte);
  const totalW=CW+DIM_R+4, totalH=CH+DIM_H+8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="white"/>
  ${s}
</svg>`;
}

// ─── Maatvoering helper ───────────────────────────────────────────────────────

function dimLines(CW:number,CH:number,breedte:number,hoogte:number):string {
  let s="";
  s+=line(0,CH+4,0,CH+12,DIM_COLOR,1);
  s+=line(CW,CH+4,CW,CH+12,DIM_COLOR,1);
  s+=line(0,CH+8,CW,CH+8,DIM_COLOR,1);
  s+=`<polygon points="6,${r(CH+8)} 0,${r(CH+5)} 0,${r(CH+11)}" fill="${DIM_COLOR}"/>`;
  s+=`<polygon points="${r(CW-6)},${r(CH+8)} ${r(CW)},${r(CH+5)} ${r(CW)},${r(CH+11)}" fill="${DIM_COLOR}"/>`;
  s+=text(CW/2, CH+DIM_GAP+10, `${breedte} mm`);
  s+=line(CW+4,0,CW+12,0,DIM_COLOR,1);
  s+=line(CW+4,CH,CW+12,CH,DIM_COLOR,1);
  s+=line(CW+8,0,CW+8,CH,DIM_COLOR,1);
  s+=`<polygon points="${r(CW+8)},6 ${r(CW+5)},0 ${r(CW+11)},0" fill="${DIM_COLOR}"/>`;
  s+=`<polygon points="${r(CW+8)},${r(CH-6)} ${r(CW+5)},${r(CH)} ${r(CW+11)},${r(CH)}" fill="${DIM_COLOR}"/>`;
  s+=text(CW+DIM_R/2+2,CH/2+5,`${hoogte} mm`,"middle",11,DIM_COLOR,`transform="rotate(-90,${r(CW+DIM_R/2+2)},${r(CH/2)})"`);
  return s;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function getSvgString(slug:string, breedte=1000, hoogte=1200):string|null {
  if(!slug) return null;
  if(slug.includes("schuifpui")) return buildSchuifpuiSvg(slug,breedte,hoogte);
  if(slug.includes("harmonica")) return buildHarmonicaSvg(slug,breedte,hoogte);
  if(slug.includes("deur") && !slug.includes("kozijn")) return buildDeurSvg(breedte,hoogte);
  return buildKozijnSvg(slug,breedte,hoogte);
}

export function renderSvgForPdf(slug:string):string|null {
  const svg = getSvgString(slug);
  if(!svg) return null;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
