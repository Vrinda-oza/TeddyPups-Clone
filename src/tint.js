import { useEffect, useState } from "react";

// Soft background colour taken from a puppy photo (the page picks up the photo's colours, like the original).
// If the browser blocks reading the image, a plain warm cream is used.
const FALLBACK = "#efe6da";
const cache = {};
export function photoTint(url) {
  if (cache[url]) return Promise.resolve(cache[url]);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 12;
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0, 12, 12);
        const d = g.getImageData(0, 0, 12, 12).data;
        let r = 0, gr = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; gr += d[i + 1]; b += d[i + 2]; n++; }
        // mix the average colour with cream so text stays easy to read
        const mix = (v) => Math.round((v / n) * 0.28 + 250 * 0.72);
        cache[url] = "rgb(" + mix(r) + "," + mix(gr) + "," + (Math.round((b / n) * 0.28 + 244 * 0.72)) + ")";
      } catch (e) { cache[url] = FALLBACK; }
      resolve(cache[url]);
    };
    img.onerror = () => resolve(FALLBACK);
    img.src = url;
  });
}
export function usePhotoTint(url) {
  const [t, setT] = useState(cache[url] || FALLBACK);
  useEffect(() => {
    let live = true;
    if (!url) return;
    photoTint(url).then((c) => live && setT(c));
    return () => { live = false; };
  }, [url]);
  return t;
}
