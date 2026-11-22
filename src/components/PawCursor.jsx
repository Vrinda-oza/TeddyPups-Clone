import { useEffect } from "react";

// Paw-print cursor trail: as the mouse moves, small brown paw prints are left behind
// and fade away. Alternating left/right and turned in the walking direction.
// Skipped on touch screens and when the visitor prefers reduced motion.
const PAW = '<svg viewBox="0 0 24 24" fill="#9c4a1f"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5"/><ellipse cx="5" cy="10" rx="2.4" ry="3"/><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3"/><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3"/><ellipse cx="19" cy="10" rx="2.4" ry="3"/></svg>';

export default function PawCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lastX = -999, lastY = -999, side = 1;
    function onMove(e) {
      if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < 46) return; // one print every ~46px
      const angle = Math.atan2(e.clientY - lastY, e.clientX - lastX) * 180 / Math.PI + 90;
      const first = lastX === -999;
      lastX = e.clientX; lastY = e.clientY; side = -side;
      if (first) return;
      const paw = document.createElement("div");
      paw.className = "paw-trail";
      paw.innerHTML = PAW;
      paw.style.left = e.clientX + side * 6 + "px";
      paw.style.top = e.clientY + "px";
      paw.style.setProperty("--r", angle + "deg");
      document.body.appendChild(paw);
      setTimeout(() => paw.remove(), 1200);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return null;
}
