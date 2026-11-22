import { useEffect, useState } from "react";

// The original site is designed at about 1912 x 872. Every size in the home scenes is written for
// that screen and multiplied by --k (width based) or --kv (width and height based), so the page
// keeps the same proportions on bigger and smaller screens.
export function getScale() {
  const w = typeof window === "undefined" ? 1912 : window.innerWidth;
  const h = typeof window === "undefined" ? 872 : window.innerHeight;
  const mobile = w < 860;
  const k = mobile ? Math.max(0.5, Math.min(0.72, w / 640)) : Math.min(1.3, Math.max(0.62, w / 1912));
  const kv = mobile ? k : Math.min(k, Math.max(0.55, h / 872));
  return { w, h, k, kv, mobile };
}

export function useScale() {
  const [s, setS] = useState(getScale);
  useEffect(() => {
    function set() {
      const n = getScale();
      const root = document.documentElement;
      root.style.setProperty("--k", n.k.toFixed(3));
      root.style.setProperty("--kv", n.kv.toFixed(3));
      setS(n);
    }
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return s;
}
