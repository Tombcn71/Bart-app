import { isValidElement, type ReactNode } from "react";

/**
 * Zet svg-elementen (JSX zonder hooks) om naar svg-tekst. Next.js staat react-dom/server niet toe in de server,
 * en voor de offerte-pdf is alleen tekst nodig. Kent alleen wat de technische tekening gebruikt.
 */
const KEBAB = /^(stroke|fill|font|text|stop|vector|clip|marker)[A-Z]/;
const attr = (naam: string) => (naam === "className" ? "class" : KEBAB.test(naam) ? naam.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()) : naam);
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function jsxNaarSvg(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return esc(String(node));
  if (Array.isArray(node)) return node.map(jsxNaarSvg).join("");
  if (!isValidElement(node)) return "";
  const { type, props } = node as { type: unknown; props: Record<string, unknown> };
  if (typeof type === "function") return jsxNaarSvg((type as (p: unknown) => ReactNode)(props));
  if (typeof type === "symbol") return jsxNaarSvg(props.children as ReactNode); // fragment
  const { children, ...rest } = props;
  const attrs = Object.entries(rest)
    .filter(([, v]) => v != null && v !== false && typeof v !== "function")
    .map(([k, v]) => ` ${attr(k)}="${esc(String(v))}"`)
    .join("");
  return `<${String(type)}${attrs}>${jsxNaarSvg(children as ReactNode)}</${String(type)}>`;
}
