import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Mascot from "../components/Mascot.jsx";
import { gone } from "../goneData.js";
import { useReveal } from "../reveal.js";
import { happyPhotos, HAPPY_COLS } from "../happyData.js";

// Happy families: a wall of taped polaroids (photos saved in public/happy). Each photo drops in when it scrolls into view.
// Wide screens use the four columns of the reference page; tablets get 3 columns and phones 2 (photos keep their own shape).
// Click any photo to open the big viewer (counter, Previous / Next, arrow keys, Esc).
const PAWS = [[6, 3, -20], [93, 9, 25], [14, 16, 10], [84, 24, -15], [4, 33, 30], [96, 41, -25], [11, 52, 15], [90, 60, -10], [5, 71, 20], [95, 79, 12], [12, 88, -22], [88, 94, 18]];

const TILTS = ["-2.2deg", "1.6deg", "-.8deg", "2.4deg", "-1.4deg"];

function Polaroid({ p, idx, onOpen }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <button type="button" ref={ref} className={seen ? "hfw-pol in" : "hfw-pol"} style={{ "--d": idx % 4, "--r": TILTS[idx % 5] }} onClick={() => onOpen(idx)} data-t={idx % 3}>
      <img src={p.src} alt={p.caption || "A happy TeddyPups family"} width={p.w} height={p.h} style={{ aspectRatio: p.w + " / " + p.h }} loading="lazy" />
      <span className="hand">{p.caption}</span>
    </button>
  );
}

// how many columns fit: 4 on wide screens, 3 on tablets, 2 on phones
function useColCount() {
  const get = () => (typeof window === "undefined" ? 4 : window.innerWidth >= 1100 ? 4 : window.innerWidth >= 700 ? 3 : 2);
  const [n, setN] = useState(get);
  useEffect(() => {
    const on = () => setN(get());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return n;
}

// 3 or 2 columns: each photo goes under the shortest column, in reading order
function masonry(n) {
  const cols = Array.from({ length: n }, () => []);
  const heights = new Array(n).fill(0);
  happyPhotos.forEach((p, idx) => {
    const c = heights.indexOf(Math.min(...heights));
    cols[c].push(idx);
    heights[c] += p.h / p.w + 0.16;
  });
  return cols;
}

// the four columns end at slightly different heights, so move the last photos of the tallest columns to the shortest until they are level
function balance(base) {
  const hh = (i) => happyPhotos[i].h / happyPhotos[i].w + 0.16;
  const cols = base.map((c) => c.slice());
  const hs = cols.map((c) => c.reduce((s, i) => s + hh(i), 0));
  for (let n = 0; n < 12; n++) {
    const t = hs.indexOf(Math.max(...hs)), sh = hs.indexOf(Math.min(...hs));
    const last = cols[t][cols[t].length - 1];
    if (hs[t] - hs[sh] <= hh(last)) break;
    cols[t].pop(); cols[sh].push(last); hs[t] -= hh(last); hs[sh] += hh(last);
  }
  return cols;
}

function Gallery() {
  const [open, setOpen] = useState(null); // index of the photo shown big, or null
  const total = happyPhotos.length;
  const count = useColCount();
  const columns = masonry(count); // every screen size: each photo goes under the shortest column, so all columns end together (no empty corner)

  useEffect(() => {
    if (open === null) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o + 1) % total);
      if (e.key === "ArrowLeft") setOpen((o) => (o - 1 + total) % total);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, total]);

  return (
    <>
      <div className="hfw-wall">
        {columns.map((list, c) => (
          <div className="hfw-col" key={c} data-c={c}>
            {list.map((idx) => <Polaroid key={happyPhotos[idx].src} p={happyPhotos[idx]} idx={idx} onOpen={setOpen} />)}
          </div>
        ))}
      </div>
      {open !== null && (
        <div className="lightbox hf-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setOpen(null)}>
          <span className="count-badge">{open + 1} / {total}</span>
          <button type="button" className="hf-close" onClick={() => setOpen(null)} aria-label="Close">&times;</button>
          <img key={open} src={happyPhotos[open].src} alt={happyPhotos[open].caption || "A happy TeddyPups family"} onClick={(e) => e.stopPropagation()} />
          <div className="row hf-nav" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="hf-prev" onClick={() => setOpen((open - 1 + total) % total)}>Previous</button>
            <button type="button" className="hf-next" onClick={() => setOpen((open + 1) % total)}>Next</button>
          </div>
        </div>
      )}
    </>
  );
}

export function HappyFamilies() {
  return (
    <div className="hfw">
      <div className="hfw-paws" aria-hidden="true">
        {PAWS.map(([x, y, r], i) => (
          <svg key={i} viewBox="0 0 24 24" style={{ left: x + "%", top: y + "%", transform: "rotate(" + r + "deg)" }}>
            <ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" />
          </svg>
        ))}
      </div>
      <div className="container wide hfw-top">
        <div className="hfw-title">
          <p className="hand">our wall of happy endings</p>
          <h1 className="big">Happy families<svg className="hfw-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" /></svg></h1>
          <p className="lead">Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.</p>
          <p className="hand hfw-count">{happyPhotos.length} moments and counting</p>
        </div>
        <figure className="hfw-note">
          <span className="hfw-tape" />
          <blockquote>&ldquo;TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.&rdquo;</blockquote>
          <figcaption>Sarah M., Dubai, UAE</figcaption>
        </figure>
      </div>
      <div className="container wide">
        <Gallery />
      </div>
      <div className="hfw-end" aria-hidden="true">
        <span className="hfw-sitter"><Mascot size={96} /></span>
        <p className="hand">every one of them was a Teddy Pup once</p>
      </div>
      <svg className="hfw-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C 220 118 470 70 720 84 C 980 98 1210 34 1440 52 L1440 140 L0 140 Z" fill="#24130b" /></svg>
    </div>
  );
}

function GoneTicket({ g, i, hit }) {
  const [ref, seen] = useReveal();
  return (
    <Link ref={ref} to={"/gone-home/" + g.slug} id={g.slug} className={"ticket" + (hit ? " hit" : "") + (seen ? " in" : "")} style={{ "--i": i % 3 }}>
      <img className="t-photo" src={g.image} alt={g.name + ", gone home"} loading="lazy" />
      <div className="t-body">
        <span className="hand t-one">one ticket home</span>
        <h3>{g.name}</h3>
        <p>{g.info}</p>
        <div className="t-route"><b>{g.from}</b><i /><b>HOME &#9829;</b></div>
      </div>
      <div className="t-stub"><span>admit one</span></div>
    </Link>
  );
}

export function GoneHome() {
  const { hash } = useLocation();
  const target = hash.slice(1);
  return (
    <div className="gh">
      <div className="container wide gh-top">
        <div className="gh-title">
          <h1 className="big">Gone home<span className="gh-heart" aria-hidden="true">&#9825;</span></h1>
          <p className="lead">Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we'll help you find your match.</p>
          <Link className="btn" to="/puppies">See available puppies</Link>
        </div>
        <div className="booth" aria-hidden="true">
          <span className="booth-dog"><Mascot size={110} /></span>
          <span className="booth-roof" /><span className="booth-sign hand">tickets home</span>
        </div>
      </div>
      <div className="container wide">
        <div className="tickets">
          {gone.map((g, i) => <GoneTicket key={g.slug} g={g} i={i} hit={g.slug === target} />)}
        </div>
      </div>
    </div>
  );
}
