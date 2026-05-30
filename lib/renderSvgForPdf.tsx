import { buildDeurSvgString } from "./deur-svg-strings";
import { buildKozijnSvgString } from "./kozijn-svg-strings";
import { buildSchuifpuiSvgString } from "./schuifpui-svg-strings";

// ─── Kleuren (schuifpui / harmonica) ─────────────────────────────────────────
const FRAME_FILL   = "#d4d8de";
const FRAME_STROKE = "#2d3748";
const GLASS_FILL   = "#dbeafe";
const GLASS_LINE   = "#93c5fd";
const VLEUGEL      = "#1e293b";
const DIM_COLOR    = "#1066a3";

// ─── Constanten (schuifpui / harmonica) ──────────────────────────────────────
const FT      = 16;
const DIM_GAP = 14;
const DIM_H   = 22;
const DIM_R   = 42;

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

export function getSvgString(slug:string, breedte=1000, hoogte=1200, glas?:string):string|null {
  if(!slug) return null;
  if(slug.includes("schuifpui")) return buildSchuifpuiSvgString(slug,breedte,hoogte);
  if(slug.includes("harmonica")) return buildHarmonicaSvg(slug,breedte,hoogte);
  if(slug.includes("deur") && !slug.includes("kozijn")) {
    return buildDeurSvgString(slug, breedte, hoogte, glas);
  }
  return buildKozijnSvgString(slug, breedte, hoogte, glas);
}

export function renderSvgForPdf(slug:string):string|null {
  const svg = getSvgString(slug);
  if(!svg) return null;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
