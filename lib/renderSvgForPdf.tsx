import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import {
  GlassVast, GlassDK, GlassKiep, GlassVastBovenlichtKiep,
  GlassDkBovenlichtVast, GlassDkBovenlichtKiep, GlassDkBorstweringVast,
  GlassKiepKiep, GlassDkDkStolpBovenlichtVast, GlassDkVastBovenlichtenVast,
  GlassDkBovenlichtKiepVast, GlassVastBovenlichtKiepVast, GlassDkBovenlichtVastVast,
  GlassDkVastVastKozijn, GlassDkDkDkKozijn, GlassDkVastDkBovenlichtenVast,
  GlassVastDkVastBovenlichtenVast,
} from "@/lib/kozijn-svgs";
import {
  SingleDoorBase, DoubleDoorBase, VoordeurBovenlicht, AchterdeurBovenlicht,
  AchterdeurBorstwering, AchterdeurBorstweringBovenlicht, DeurZijlicht,
  VoordeurZijlicht, DeurZijlichtBovenlicht, VoordeurZijlichtBovenlicht,
  DeurZijlichtBorstwering, DeurZijlichten, DubbeleDeurBovenlicht,
  DubbeleDeurZijlicht, DubbeleDeurZijlichtenBovenlichten, DubbeleDeurBorstweringBovenlicht,
} from "@/lib/deur-svgs";
import {
  HarmonicadeurDriedelig, HarmonicadeurVierdelig, HarmonicadeurVijfdelig,
} from "@/lib/harmonicadeur-svgs";

const DARK = "#2d3748";

const kozijnMap: Record<string, { v: number; components: React.ReactNode }> = {
  "vast-kozijn":                              { v: 1, components: <GlassVast x={0} /> },
  "draai-kiep-kozijn":                        { v: 1, components: <GlassDK x={0} /> },
  "kiep-kozijn":                              { v: 1, components: <GlassKiep x={0} /> },
  "vast-bovenlicht-kiep":                     { v: 1, components: <GlassVastBovenlichtKiep x={0} /> },
  "dk-bovenlicht-vast":                       { v: 1, components: <GlassDkBovenlichtVast x={0} /> },
  "dk-bovenlicht-kiep":                       { v: 1, components: <GlassDkBovenlichtKiep x={0} /> },
  "dk-borstwering-vast":                      { v: 1, components: <GlassDkBorstweringVast x={0} /> },
  "draai-kiep-vast-kozijn":                   { v: 2, components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />] },
  "draai-kiep-draai-stolp-kozijn":            { v: 2, components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} mirror />] },
  "vast-vast-kozijn":                         { v: 2, components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />] },
  "kiep-vast-liggend":                        { v: 2, components: [<GlassKiep key="1" x={0} />, <GlassVast key="2" x={100} />] },
  "kiep-kiep-kozijn":                         { v: 2, components: <GlassKiepKiep x={0} /> },
  "dk-dk-stolp-bovenlicht-vast-2vaks":        { v: 2, components: <GlassDkDkStolpBovenlichtVast x={0} /> },
  "dk-vast-bovenlichten-vast-2vaks":          { v: 2, components: <GlassDkVastBovenlichtenVast x={0} /> },
  "dk-bovenlicht-kiep-vast-2vaks":            { v: 2, components: <GlassDkBovenlichtKiepVast x={0} /> },
  "vast-bovenlicht-kiep-vast-2vaks":          { v: 2, components: <GlassVastBovenlichtKiepVast x={0} /> },
  "dk-bovenlicht-vast-vast-2vaks":            { v: 2, components: <GlassDkBovenlichtVastVast x={0} /> },
  "draai-kiep-vast-draai-kiep-kozijn":        { v: 3, components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassDK key="3" x={200} mirror />] },
  "vast-vast-vast-kozijn":                    { v: 3, components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />] },
  "vast-draai-kiep-vast-kozijn":              { v: 3, components: [<GlassVast key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassVast key="3" x={200} />] },
  "draai-kiep-vast-vast-kozijn":              { v: 3, components: <GlassDkVastVastKozijn x={0} /> },
  "draai-kiep-draai-kiep-draai-kiep-kozijn":  { v: 3, components: <GlassDkDkDkKozijn x={0} /> },
  "draai-kiep-vast-dk-bovenlichten-vast":     { v: 3, components: <GlassDkVastDkBovenlichtenVast x={0} /> },
  "vast-dk-vast-bovenlichten-vast":           { v: 3, components: <GlassVastDkVastBovenlichtenVast x={0} /> },
  "draai-kiep-vast-vast-draai-kiep-kozijn":   { v: 4, components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />, <GlassDK key="4" x={300} mirror />] },
  "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn": { v: 4, components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassDK key="3" x={200} />, <GlassDK key="4" x={300} />] },
};

const deurMap: Record<string, React.ReactNode> = {
  "voordeur":                               <SingleDoorBase type="voordeur" />,
  "achterdeur":                             <SingleDoorBase type="achterdeur" />,
  "voordeur-bovenlicht":                    <VoordeurBovenlicht />,
  "achterdeur-bovenlicht":                  <AchterdeurBovenlicht />,
  "achterdeur-borstwering":                 <AchterdeurBorstwering />,
  "achterdeur-borstwering-bovenlicht":      <AchterdeurBorstweringBovenlicht />,
  "deur-zijlicht":                          <DeurZijlicht />,
  "voordeur-zijlicht":                      <VoordeurZijlicht />,
  "deur-zijlicht-bovenlicht":               <DeurZijlichtBovenlicht />,
  "voordeur-zijlicht-bovenlicht":           <VoordeurZijlichtBovenlicht />,
  "deur-zijlicht-borstwering":              <DeurZijlichtBorstwering />,
  "deur-zijlichten":                        <DeurZijlichten />,
  "dubbele-deur":                           <DoubleDoorBase />,
  "dubbele-deur-zijlichten":                <DoubleDoorBase hasSideLights />,
  "dubbele-deur-borstwering":               <DoubleDoorBase hasPlinth />,
  "dubbele-deur-bovenlicht":                <DubbeleDeurBovenlicht />,
  "dubbele-deur-zijlicht":                  <DubbeleDeurZijlicht />,
  "dubbele-deur-zijlichten-bovenlichten":   <DubbeleDeurZijlichtenBovenlichten />,
  "dubbele-deur-borstwering-bovenlicht":    <DubbeleDeurBorstweringBovenlicht />,
};

export function renderSvgForPdf(slug: string): string | null {
  // Kozijn
  const kozijn = kozijnMap[slug];
  if (kozijn) {
    const svgString = renderToStaticMarkup(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${kozijn.v * 100} 100`} width={kozijn.v * 100} height={100}>
        <rect x="0.5" y="0.5" width={kozijn.v * 100 - 1} height="99" fill="none" stroke={DARK} strokeWidth="1" />
        {Array.from({ length: kozijn.v - 1 }).map((_, i) => (
          <line key={i} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="100" stroke={DARK} strokeWidth="1" />
        ))}
        {kozijn.components}
      </svg>
    );
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
  }

  // Deur
  const deurComponents = deurMap[slug];
  if (deurComponents) {
    const svgString = renderToStaticMarkup(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 160" width={150} height={160}>
        {deurComponents}
      </svg>
    );
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
  }

  // Harmonicadeur
  if (slug.includes("harmonicadeur") || slug.includes("harmonica")) {
    const sections = slug.includes("vijf") ? 5 : slug.includes("vier") ? 4 : 3;
    const comp = sections === 5 ? <HarmonicadeurVijfdelig /> : sections === 4 ? <HarmonicadeurVierdelig /> : <HarmonicadeurDriedelig />;
    const svgString = renderToStaticMarkup(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width={200} height={160}>
        {comp}
      </svg>
    );
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
  }

  // Schuifpui — simpele rechthoek met schuifpijl
  if (slug.includes("schuifpui")) {
    const sections = slug.includes("4-vaks") ? 4 : 2;
    const w = sections * 45;
    const svgString = renderToStaticMarkup(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} 100`} width={w} height={100}>
        <rect x="0.5" y="0.5" width={w - 1} height="99" fill="none" stroke={DARK} strokeWidth="1" />
        {Array.from({ length: sections - 1 }).map((_, i) => (
          <line key={i} x1={(i + 1) * 45} y1="0" x2={(i + 1) * 45} y2="100" stroke={DARK} strokeWidth="0.8" />
        ))}
        <line x1={w / 2 - 10} y1="50" x2={w / 2 + 10} y2="50" stroke={DARK} strokeWidth="1" />
        <line x1={w / 2 + 5} y1="45" x2={w / 2 + 10} y2="50" stroke={DARK} strokeWidth="1" />
        <line x1={w / 2 + 5} y1="55" x2={w / 2 + 10} y2="50" stroke={DARK} strokeWidth="1" />
      </svg>
    );
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
  }

  return null;
}
