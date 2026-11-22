import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Mascot, { WalkingMascot } from "../components/Mascot.jsx";
import { DoorCard } from "../components/PuppyCard.jsx";
import { puppies, families, faqs, steps, trust, BREEDS, SHOWROOM, WHATSAPP } from "../data.js";
import { getScale, useScale } from "../scale.js";
import Stars from "../components/Stars.jsx";

// How far the user has scrolled through a tall section (0 at the start, 1 at the end)
function useProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    function update() {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / total)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return p;
}

// Becomes true once the element is visible on screen
function useSeen(ref, th = 0.4) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: th });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return seen;
}

// opens once, as soon as the top of the element is on screen, and then stays open (no flicker when you scroll away and back)
function useInView(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setOn(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } }, { threshold: 0, rootMargin: "0px 0px 120px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return on;
}

/* Hero windows: puppies peek up from behind a scalloped floor, photos swap, one breed tag at a time */
const HERO_SLOTS = [
  { w: 86, h: 96, pool: [2, 7] },
  { w: 112, h: 150, pool: [6, 12, 13] },
  { w: 104, h: 112, pool: [1, 4, 9] },
  { w: 124, mascot: true },
  { w: 104, h: 118, pool: [0, 11, 14] },
  { w: 124, h: 166, pool: [3, 5, 10] },
  { w: 86, h: 96, pool: [7, 2] },
];
const TAG_ORDER = [1, 5, 2, 4, 0, 6]; // which window shows the tag, in turn
const tagOf = (p) => (p.name === "Max" ? "Maltipoo" : p.name === "Copper" ? "Cavapoo" : p.name);

function HeroStage() {
  const [tick, setTick] = useState(0);
  const winsRef = useRef(null);
  // As the page scrolls toward "Meet the pups", the puppy windows sink down behind the scalloped floor (like the original)
  useEffect(() => {
    let queued = false;
    function update() {
      queued = false;
      const el = winsRef.current;
      if (!el) return;
      const t = clampN(window.scrollY / (window.innerHeight * 0.55));
      el.style.setProperty("--sink", (t * t * (3 - 2 * t)).toFixed(3));
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setTick((n) => n + 1), 2800);
    return () => clearInterval(t);
  }, []);
  const active = TAG_ORDER[tick % TAG_ORDER.length];
  return (
    <div className="hero-stage">
      <div className="hero-wins" ref={winsRef}>
        {HERO_SLOTS.map((s, i) => {
          const style = { "--w": s.w, "--h": s.h, animationDelay: 0.2 + i * 0.12 + "s" };
          if (s.mascot) {
            return <div key={i} className="hero-win mascot" style={style} aria-hidden="true"><Mascot size={s.w + 16} /></div>;
          }
          const cur = s.pool[Math.floor((tick + i) / 2) % s.pool.length];
          const pup = puppies[cur];
          return (
            <Link key={i} to={"/puppies/" + pup.slug} className={"hero-win" + (active === i ? " on" : "")} style={style} aria-label={pup.name + ", " + pup.breed + " puppy"}>
              <span className="hero-arch">
                {s.pool.map((idx) => <img key={idx} src={puppies[idx].image} alt="" className={idx === cur ? "show" : ""} />)}
              </span>
              {active === i && <span key={tick} className="hero-tag">{tagOf(pup)}</span>}
            </Link>
          );
        })}
      </div>
      <div className="hero-floor" />
    </div>
  );
}

/* 1. Hero: puppies peek up from below */
function Hero() {
  return (
    <section className="hero2">
      <div className="container wide hero-copy">
        <p className="hand">every puppy is family</p>
        <h1>Premium teacup puppies in Dubai</h1>
        <p className="lead">Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.</p>
        <div className="row mid">
          <Link className="btn" to="/puppies">View available puppies</Link>
          <a className="btn light" href={WHATSAPP} target="_blank" rel="noreferrer">Enquire on WhatsApp</a>
        </div>
      </div>
      <HeroStage />
    </section>
  );
}

/* One dog for the whole top of the page. It steps out of the hero window, walks onto the shelf in
   "Meet the pups", and later walks down to the signpost in "Two ways". Its place is worked out from the
   scroll position, so it never jumps: it only moves a little with every bit of scrolling. */
const clampN = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (t) => t * t * (3 - 2 * t); // makes the walk start and stop gently
const lerp = (a, b, t) => a + (b - a) * t;

function RoamingDog() {
  const [pos, setPos] = useState({ x: 0, y: 0, s: 1, o: 0, say: false });
  const [walking, setWalking] = useState(false);
  const [dir, setDir] = useState(1);
  const st = useRef({ x: null, scrollY: 0, timer: 0, queued: false });

  useEffect(() => {
    const root = document.documentElement;
    // after the pole the dog glides toward its spot instead of jumping, so it never moves too fast
    function glide() {
      const s = st.current;
      const dx = s.tx - s.sx, dy = s.ty - s.sy;
      s.sx += dx * 0.07; s.sy += dy * 0.07;
      const moving = Math.hypot(dx, dy) > 1.5;
      setWalking(moving);
      if (Math.abs(dx) > 1) setDir(dx > 0 ? 1 : -1);
      setPos({ x: s.sx, y: s.sy, s: 1, o: s.o, say: false });
      s.raf = moving ? requestAnimationFrame(glide) : 0;
    }
    function update() {
      st.current.queued = false;
      const { w, h: vh, kv } = getScale();
      if (w < 1100) { cancelAnimationFrame(st.current.raf); st.current.raf = 0; st.current.sx = null; setPos((o) => (o.o ? { ...o, o: 0 } : o)); return; } // phones use the small dog at the bottom
      const BASE = 170 * kv;            // the dog is this wide once it is out of the hero window
      const meet = document.querySelector(".meet");
      const heroDog = document.querySelector(".hero-win.mascot svg");
      const wayDog = document.querySelector(".tw-dog");
      if (!meet || !heroDog) return;
      const meetTop = meet.getBoundingClientRect().top;
      const meetBottom = meet.getBoundingClientRect().bottom;
      const hero = heroDog.getBoundingClientRect();

      const SHELF_X = dogShelfX(w, kv);   // where the dog stands on the shelf (when it arrives)
      const meetH = meet.getBoundingClientRect().height - vh;
      const pMeet = meetH > 0 ? clampN(-meetTop / meetH) : 0;
      const DOG_X = dogShelfAt(pMeet, w, kv); // and where it is now: it walks on along the shelf up to the Korean teacup door
      const END_X = dogShelfAt(1, w, kv);
      const SHELF_Y = vh - 58 * kv;       // and its feet (px from the top of the screen)
      // the walk starts when the page starts to scroll (or near the bottom of a hero taller than the screen)
      const walkStart = Math.min(meetTop + window.scrollY, vh * 0.95);
      const startX = hero.left + hero.width / 2;
      // where the feet were at the moment the walk started: a fixed spot, so the dog never jumps
      const startY = hero.bottom + (walkStart - meetTop);

      // Part 1: hero window -> shelf, while "Meet the pups" slides up into view
      const t1 = clampN((walkStart - meetTop) / (vh * 0.65));
      const e1 = smooth(t1);
      let x = lerp(startX, DOG_X, e1);
      let y = lerp(startY, SHELF_Y, e1);
      let size = lerp(hero.width / BASE, 1, e1);
      let mode = t1 > 0 ? "fixed" : "hero";

      // Part 3: after the shelf ends, walk to the place where the Two ways dog waits
      if (wayDog) {
        const wv = smooth(clampN(1 - meetBottom / (vh * 0.8)));
        if (wv > 0) {
          const wr = wayDog.getBoundingClientRect();
          const targetY = wr.top + BASE;
          x = lerp(END_X, wr.left + wr.width / 2, wv);
          y = lerp(SHELF_Y, Math.min(targetY, SHELF_Y), wv);
          size = 1;
          if (wv >= 1 && targetY <= SHELF_Y) mode = "ways"; // the Two ways dog takes over at the same spot
        }
      }
      // Part 4: the SAME dog keeps going after the pole: phone, book, wall of photos, door, questions, house door, basket.
      // Every stop is read from the page itself, and the dog is placed between two stops by the scroll position.
      let lateOn = false;
      const setDoor = (v) => { if (st.current.door !== v) { st.current.door = v; window.dispatchEvent(new CustomEvent("dogdoor", { detail: v })); } };
      const grid = document.querySelector(".tw-grid");
      if (grid && wayDog) {
        const T = window.scrollY, Q = (sel) => document.querySelector(sel), rc = (el) => el.getBoundingClientRect();
        const topOf = (el) => rc(el).top + T;
        const E = { jr: Q(".journey"), phone: Q(".phone"), book: Q(".book"), hang: Q(".hang"), door: Q(".ds-door"), scene: Q(".doorscene"), ques: Q(".questions"), house: Q(".house"), slot: Q(".basket-dog") };
        const gr = rc(grid);
        const trig0 = T + gr.top + gr.height - vh * 0.5 - BASE * 1.25; // the scroll position where the dog has reached the end of the pole
        if (T > trig0 + 4 && Object.values(E).every(Boolean)) {
          lateOn = true;
          const pr = rc(E.phone), br = rc(E.book), hr = rc(E.hang), dr = rc(E.door), sr = rc(E.scene), hs = rc(E.house), bs = rc(E.slot), wr0 = rc(wayDog);
          const jTop = topOf(E.jr), jEnd = jTop + rc(E.jr).height - vh;
          const stops = [
            [trig0, wr0.left + wr0.width / 2, wr0.top + BASE],                       // sitting at the end of the pole
            [jTop, pr.left - BASE * 0.42, pr.bottom],                                 // sits beside the chat phone ...
            [jEnd, pr.left - BASE * 0.42, pr.bottom],                                 // ... until the step list has finished
            [topOf(E.book) + br.height - vh * 0.9, br.left + BASE * 0.7, br.bottom - 8 * kv], // bottom-left corner of the passport book
            [topOf(E.hang) - vh * 0.35, hr.right - BASE * 0.4, hr.top + hr.height * 0.5],      // walks over the photo wall
            [topOf(E.hang) + hr.height - vh * 0.7, hr.left + BASE * 0.6, hr.bottom],
            [topOf(E.scene) + sr.height - vh * 0.85, dr.left - BASE * 0.55, sr.bottom - 6 * kv], // next to the door
            [topOf(E.ques) + rc(E.ques).height * 0.5 - vh * 0.5, w * 0.1 + BASE * 0.5, vh - 20 * kv], // along the bottom of Questions
            [topOf(E.house) + hs.height - vh * 0.9, hs.left - BASE * 0.35, hs.bottom],  // beside the "ready to meet" door
            [document.documentElement.scrollHeight - vh, bs.left + bs.width / 2, bs.top + BASE], // into the footer basket
          ];
          for (let k = 1; k < stops.length; k++) stops[k][0] = Math.max(stops[k][0], stops[k - 1][0] + 1);
          let i = 0;
          while (i < stops.length - 2 && T > stops[i + 1][0]) i++;
          const a = stops[i], b = stops[i + 1];
          const e = smooth(clampN((T - a[0]) / (b[0] - a[0])));
          x = lerp(a[1], b[1], e); y = lerp(a[2], b[2], e); size = 1;
          mode = T >= stops[9][0] - 2 ? "basket" : "fixed"; // in the basket the footer's own dog takes over
          setDoor(T > stops[8][0] + 0.3 * (stops[9][0] - stops[8][0])); // the door opens as the dog passes, closes when it comes back up
        }
      }
      if (!lateOn) setDoor(false);
      root.dataset.dogMode = mode;

      // walking: true while the page is moving, facing the way the dog moves
      const s = st.current;
      const dx = s.x === null ? 0 : x - s.x;
      const dScroll = window.scrollY - s.scrollY;
      s.x = x;
      s.scrollY = window.scrollY;
      const dyy = s.y == null ? 0 : y - s.y;
      s.y = y;
      if (mode === "fixed" && !lateOn && dScroll !== 0) { // after the pole it only walks when it really moves
        setWalking(true);
        clearTimeout(s.timer);
        s.timer = setTimeout(() => setWalking(false), 170);
      }
      if (Math.abs(dx) > 0.3) setDir(dx > 0 ? 1 : -1);
      else if (dScroll !== 0) setDir(dScroll > 0 ? 1 : -1);

      // the roaming dog is fully visible the moment it leaves the window (the window dog hides at the same moment)
      if (lateOn) {
        s.tx = x; s.ty = y; s.o = mode === "fixed" ? 1 : 0;
        if (s.sx == null) { s.sx = x; s.sy = y; }
        if (!s.raf) s.raf = requestAnimationFrame(glide);
      } else {
        // the glide loop must stop here, otherwise it keeps drawing an old copy of the dog (2-3 dogs while scrolling back up)
        cancelAnimationFrame(s.raf); s.raf = 0; s.sx = null; s.o = mode === "fixed" ? 1 : 0;
        setPos({ x, y, s: size, o: mode === "fixed" ? 1 : 0, say: mode === "fixed" && t1 < 0.4 });
      }
    }
    function onScroll() {
      if (st.current.queued) return;
      st.current.queued = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(st.current.timer);
      cancelAnimationFrame(st.current.raf);
      delete root.dataset.dogMode;
    };
  }, []);

  return (
    <div className="roam" aria-hidden="true" style={{ opacity: pos.o, transform: "translate3d(" + pos.x + "px," + pos.y + "px,0) translate(-50%,-100%) scale(" + pos.s + ")" }}>
      {pos.say && <span className="roam-say">peekaboo!</span>}
      <WalkingMascot size={170} walking={walking} dir={dir} />
    </div>
  );
}

// the dog stands about a fifth of the way across the shelf (like the original)
const dogShelfX = (w, kv) => Math.max(120 * kv, w * 0.195);
// Doors on the shelf: 15 puppies, then "Meet them all". The dog walks along the shelf and stops next to the
// 13th door (the first Korean Teacup Pomeranian), so the last 2 doors stay closed.
const LAST_OPEN = 12; // index of the last door that opens
function dogShelfAt(p, w, kv) {
  const ARCH = 206 * kv, PITCH = 320 * kv, n = puppies.length;
  const start = dogShelfX(w, kv);
  // where the shelf ends: "Meet them all" stops near the right edge, so door i sits at 0.9w - ARCH/2 - (n - i) * PITCH
  const end = Math.max(start, 0.9 * w - ARCH / 2 - (n - LAST_OPEN) * PITCH + 150 * kv);
  return lerp(start, end, smooth(clampN((p - 0.4) / 0.6)));
}

/* 2. Meet the pups: the page stays pinned while the shelf slides sideways */
function MeetPups() {
  const ref = useRef(null);
  const p = useProgress(ref);
  const { w, h, kv, mobile } = useScale();
  const ARCH = 206 * kv;               // door width
  const PITCH = 320 * kv;              // distance from one door to the next
  const LEFT = Math.max(w * 0.4, 260 * kv); // empty space before the first door
  const n = puppies.length;
  const maxShift = Math.max(0, LEFT + n * PITCH + ARCH - w * 0.9); // "Meet them all" ends near the right edge
  const shift = p * maxShift;
  const dogX = dogShelfAt(p, w, kv); // the dog walks on along the shelf during the last part of the scroll
  const [prints, setPrints] = useState([]);
  const walk = useRef({ shift: 0, acc: 0, side: 1, id: 0 });

  // The dog walks while the page scrolls, and leaves a paw print every ~60px it walks
  useEffect(() => {
    const wk = walk.current;
    const d = shift - wk.shift;
    wk.shift = shift;
    if (d === 0) return;
    const facing = d > 0 ? 1 : -1;
    wk.acc += Math.abs(d);
    if (wk.acc >= 60 * kv) {
      wk.acc = 0;
      wk.side = -wk.side;
      setPrints((list) => list.slice(-28).concat({ id: wk.id++, x: shift + dogX, lane: wk.side > 0, dir: facing }));
    }
  }, [shift]);

  if (mobile) {
    return (
      <section ref={ref} className="meet meet-m">
        <div className="container meet-head">
          <div><h2>Meet the pups</h2><p>Real puppies, real photos, looking for their families right now.</p></div>
          <Link className="btn" to="/puppies">See all available puppies</Link>
        </div>
        <div className="meet-grid">
          {puppies.map((pup) => <DoorCard key={pup.slug} puppy={pup} o={1} />)}
          <Link to="/puppies" className="all-door">Meet <br /><u>them all</u></Link>
        </div>
      </section>
    );
  }
  return (
    <section ref={ref} className="meet" style={{ height: h + maxShift * 0.8 }}>
      <div className="meet-sticky">
        <div className="container wide meet-head">
          <div><h2>Meet the pups</h2><p>Real puppies, real photos, looking for their families right now.</p></div>
          <Link className="btn" to="/puppies">See all available puppies</Link>
        </div>
        <div className="meet-track" style={{ transform: "translateX(" + -shift + "px)", paddingLeft: LEFT }}>
          {puppies.map((pup, i) => {
            const centre = LEFT + i * PITCH + ARCH / 2 - shift; // where this door is on screen
            // a door swings open as the dog gets near: wide open once the dog has reached it, closed further ahead
            const o = clampN((dogX + 120 * kv - centre) / (200 * kv));
            return <DoorCard key={pup.slug} puppy={pup} o={Math.round(o * 100) / 100} />;
          })}
          <Link to="/puppies" className="all-door">Meet <br /><u>them all</u></Link>
        </div>
        <div className="meet-floor" />
        <div className="meet-prints" style={{ transform: "translateX(" + -shift + "px)" }}>
          {prints.map((pr) => {
            const o = Math.max(0, 1 - Math.abs(pr.x - shift - dogX) / (560 * kv)); // trail fades the further the dog walks away
            return (
              <span key={pr.id} className="print" style={{ left: pr.x, bottom: (pr.lane ? 62 : 34) * kv, opacity: o, transform: "rotate(" + (pr.dir > 0 ? 90 : -90) + "deg)" }}>
                <svg viewBox="0 0 24 24"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 3. Two ways: a signpost whose pole runs down the middle. As you scroll, the dog walks down the pole
   (leaving paw prints) and sits when the pole ends. The plane flies Korea -> Dubai along a dotted arc. */
const ARC = { p0: [30, 140], c: [160, -50], p2: [330, 100] }; // quadratic curve from Korea to Dubai
const clamp01 = (n) => Math.min(1, Math.max(0, n));

function Sign({ side, children, to }) {
  const pts = side === "l" ? "14,2 198,2 198,42 14,42 2,22" : "2,2 186,2 198,22 186,42 2,42";
  return (
    <Link to={to} className={"tw-sign " + side}>
      <svg viewBox="0 0 200 44" preserveAspectRatio="none" aria-hidden="true"><polygon points={pts} fill="#d79a58" stroke="#2a1509" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></svg>
      <b>{children}</b>
    </Link>
  );
}

function TwoWays() {
  const gridRef = useRef(null);
  const arcRef = useRef(null);
  const { kv: tkv } = useScale();
  const [dogY, setDogY] = useState(160);
  const [walking, setWalking] = useState(false);
  const [prints, setPrints] = useState([]);
  const [flight, setFlight] = useState(0);
  const st = useRef({ y: 160, acc: 0, side: 1, id: 0, timer: 0 });

  useEffect(() => {
    function update() {
      const g = gridRef.current, a = arcRef.current;
      if (!g || !a) return;
      const { h: vh, kv } = getScale();
      const B = 170 * kv;
      const r = g.getBoundingClientRect();
      // the dog stays around mid-screen while the page scrolls, until it reaches the end of the pole
      const y = Math.min(r.height - B * 1.25, Math.max(B * 0.95, vh * 0.5 - r.top));
      const s = st.current;
      const d = y - s.y;
      if (Math.abs(d) > 0.5) {
        setWalking(true);
        clearTimeout(s.timer);
        s.timer = setTimeout(() => setWalking(false), 170);
        s.acc += Math.abs(d);
        if (s.acc >= 60 * kv) {
          s.acc = 0; s.side = -s.side;
          setPrints((list) => list.slice(-24).concat({ id: s.id++, y: y + B * 0.9, side: s.side, down: d > 0 }));
        }
        s.y = y;
        setDogY(y);
      }
      setFlight(clamp01((vh * 0.85 - a.getBoundingClientRect().top) / (vh * 0.7)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  // plane position and direction on the arc
  const u = flight, [x0, y0] = ARC.p0, [cx, cy] = ARC.c, [x2, y2] = ARC.p2;
  const px = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * cx + u * u * x2;
  const py = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * cy + u * u * y2;
  const ang = Math.atan2(2 * (1 - u) * (cy - y0) + 2 * u * (y2 - cy), 2 * (1 - u) * (cx - x0) + 2 * u * (x2 - cx)) * 180 / Math.PI;
  const dogFeet = dogY + 170 * tkv * 0.9;

  return (
    <section className="tw">
      <h2 className="mid-title">Two ways to<br />meet your puppy</h2>
      <div className="tw-grid" ref={gridRef}>
        <div className="tw-signs">
          <Sign side="l" to="/puppies?where=local">Puppies in Dubai</Sign>
          <Sign side="r" to="/puppies?where=imported">Imported for you</Sign>
        </div>
        <div className="tw-pole" />

        <div className="tw-way tw-local">
          <div className="tw-sign-m"><Sign side="l" to="/puppies?where=local">Puppies in Dubai</Sign></div>
          <div className="tw-shopwrap">
            <svg className="tw-skyline" viewBox="0 0 260 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <path d="M0 96H260M10 96V62H34V96M42 96V40H66V96M74 96V70H92V96M100 96V20L104 6L108 20V96M120 96V50H150V96M158 96V66H178V96M186 96V34H210V96M218 96V72H250V96" fill="none" stroke="#c69558" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div className="tw-shop"><div className="tw-awning" /><img src={SHOWROOM} alt="A tiny apricot teddy bear puppy in our showroom" loading="lazy" /></div>
          </div>
          <p className="hand tw-cap">in our showroom</p>
          <p>See them, love them, take them home. Come meet our locally available puppies before you decide.</p>
          <Link className="btn" to="/puppies?where=local">Meet local puppies</Link>
        </div>

        <div className="tw-way tw-import">
          <div className="tw-sign-m"><Sign side="r" to="/puppies?where=imported">Imported for you</Sign></div>
          <div className="tw-arc" ref={arcRef}>
            <svg viewBox="0 -20 360 200" aria-label="Flight path from Korea to Dubai">
              <path d={"M" + x0 + " " + y0 + " Q" + cx + " " + cy + " " + x2 + " " + y2} fill="none" stroke="#a0471d" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" />
              <circle cx={x0} cy={y0} r="4.5" fill="#a0471d" /><circle cx={x2} cy={y2} r="4.5" fill="#a0471d" />
              <text x={x0 - 4} y={y0 + 24} fontFamily="Caveat, cursive" fontSize="20" fill="#2a1509">Korea</text>
              <text x={x2 - 20} y={y2 + 26} fontFamily="Caveat, cursive" fontSize="20" fill="#2a1509">Dubai</text>
              <g transform={"translate(" + px + " " + py + ") rotate(" + ang + ") scale(.95) translate(-40 -22)"} stroke="#2a1509" strokeWidth="3" strokeLinejoin="round">
                <path d="M10 14 L2 3 L16 3 L22 13Z" fill="#a0471d" /><path d="M10 30 L2 41 L16 41 L22 31Z" fill="#a0471d" />
                <path d="M30 14 L44 -4 L56 -4 L50 14Z" fill="#a0471d" /><path d="M30 30 L44 48 L56 48 L50 30Z" fill="#a0471d" />
                <ellipse cx="40" cy="22" rx="36" ry="11" fill="#fff" />
                <circle cx="56" cy="21" r="6.5" fill="#f7c76a" /><circle cx="54" cy="20" r="1" fill="#2a1509" stroke="none" /><circle cx="58.5" cy="20" r="1" fill="#2a1509" stroke="none" />
              </g>
            </svg>
          </div>
          <p>Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.</p>
          <Link className="btn" to="/puppies?where=imported">See imported puppies</Link>
        </div>

        {prints.map((pr) => (
          <span key={pr.id} className="tw-print" style={{ left: "calc(var(--px) + " + pr.side * 22 * tkv + "px)", top: pr.y, opacity: Math.max(0, 1 - Math.abs(pr.y - dogFeet) / (560 * tkv)), transform: "rotate(" + (pr.down ? 180 : 0) + "deg)" }}>
            <svg viewBox="0 0 24 24"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg>
          </span>
        ))}
        <div className="tw-dog" style={{ top: dogY }}><WalkingMascot size={170} walking={walking} /></div>
      </div>
    </section>
  );
}

/* 4. Puppy journey. On a big screen the page stays pinned: the step list scrolls so the current step is at the top,
   the phone chat grows message by message, and the dog walks across the bottom toward the passport.
   On a phone it is a normal page: a step lights up when it reaches the middle of the screen. */
function RouteArt() {
  return (
    <svg className="route-art" viewBox="0 0 200 46" aria-hidden="true">
      <path d="M10 34 Q50 8 90 28 T170 20" fill="none" stroke="#a0471d" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" />
      <circle cx="10" cy="34" r="4" fill="#a0471d" />
      <path d="M170 24l12-10 12 10v14h-24z" fill="#fff" stroke="#2a1509" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function Journey() {
  const ref = useRef(null);
  const listRef = useRef(null);
  const p = useProgress(ref);
  const { mobile, kv } = useScale();
  const [mActive, setMActive] = useState(0);
  const [shiftY, setShiftY] = useState(0);
  const stage = mobile ? 2 : p < 0.08 ? -1 : Math.min(2, Math.floor((p - 0.08) / 0.3)); // -1 = only the first message
  const active = mobile ? mActive : stage;

  // the left column scrolls up so the current step sits at the top
  useEffect(() => {
    const el = listRef.current && listRef.current.querySelectorAll(".jstep")[stage];
    setShiftY(mobile || stage < 0 || !el ? 0 : el.offsetTop);
  }, [stage, mobile, kv]);

  // phones: highlight the step that is in the middle of the screen
  useEffect(() => {
    if (!mobile || !ref.current) return;
    const obs = new IntersectionObserver((list) => list.forEach((e) => e.isIntersecting && setMActive(Number(e.target.dataset.i))), { rootMargin: "-45% 0px -45% 0px" });
    ref.current.querySelectorAll(".jstep").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [mobile]);

  return (
    <section ref={ref} className="journey" style={mobile ? undefined : { height: "230vh" }}>
      <div className="journey-sticky container">
        <div className="jleft">
          <div className="jlist" ref={listRef} style={mobile ? undefined : { transform: "translateY(" + -shiftY + "px)" }}>
            <h2>Your puppy journey</h2>
            <p className="lead">A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.</p>
            {steps.map(([title, text], i) => (
              <div key={title} data-i={i} className={i === active ? "jstep on" : "jstep"}>
                <span className="num">{i + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </div>
            ))}
            <Link className="btn" to="/how-it-works">How it works</Link>
          </div>
        </div>
        <div className="phone">
          <div className="phone-head"><Mascot size={30} /><div><b>TeddyPups U.A.E.</b><small>online</small></div></div>
          <div className="phone-body">
            <p className="msg me">Hi TeddyPups! I'd love to know more about your puppies.</p>
            {active >= 0 && (
              <div className="msg them pop">Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.
                <div className="chips">{BREEDS.map((b) => <span key={b}>{b}</span>)}</div></div>
            )}
            {active >= 1 && (
              <div className="msg them pop">
                <div className="vid"><img src={puppies[0].image} alt="" /><i>▶</i></div>
                Our team will share real photos, health details, and all necessary information directly on WhatsApp.
              </div>
            )}
            {active >= 2 && <div className="msg them pop">Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.<RouteArt /></div>}
          </div>
          <a className="phone-foot" href={WHATSAPP} target="_blank" rel="noreferrer">Say hello on WhatsApp <span>➤</span></a>
        </div>
      </div>
    </section>
  );
}

/* 5. Puppy passport: the book opens, then four stamps thump down one by one and their icons move */
const STAMP_ICONS = [
  <svg key="h" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><g className="ic-heart"><path d="M24 40C10 30 6 22 10 15c3-5 10-5 14 1 4-6 11-6 14-1 4 7 0 15-14 25z" /></g><path d="M13 25h7l3-5 4 9 3-4h5" /></svg>,
  <svg key="p" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><g className="ic-plane"><path d="M6 28l36-14-8 24-9-7-6 6-1-9z" /></g></svg>,
  <svg key="c" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 10h32v22H20l-8 8v-8H8z" /><circle className="ic-dot" cx="17" cy="21" r="2" fill="currentColor" /><circle className="ic-dot" cx="24" cy="21" r="2" fill="currentColor" /><circle className="ic-dot" cx="31" cy="21" r="2" fill="currentColor" /></svg>,
  <svg key="g" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="16" /><ellipse className="ic-globe" cx="24" cy="24" rx="7" ry="16" /><path d="M8 24h32" /></svg>,
];
const STAMP_LOOK = [["", "#a0471d"], ["rect", "#2f7a52"], ["", "#6b3518"], ["dots", "#c0562a"]];

function Passport() {
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <section ref={ref} className="passport">
      <div className={seen ? "book open" : "book"}>
        <div className="page pl">
          <p className="hand">puppy passport</p>
          <h2>Why families trust TeddyPups</h2>
        </div>
        <div className="spine" />
        <div className="page pr stamps">
          {trust.map(([title, text], i) => (
            <div key={title} className="stamp-wrap" style={{ "--i": i }}>
              <div className={"sshape " + STAMP_LOOK[i % 4][0]} style={{ "--c": STAMP_LOOK[i % 4][1] }}>{STAMP_ICONS[i % 4]}<h3>{title}</h3></div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. Happy families: a brown wall, a beam with taped polaroids that drop in and swing, and a door with a lamp at the end */
function Happy() {
  const ref = useRef(null);
  const seen = useSeen(ref, 0.15);
  const photos = families.slice(0, 8);
  const total = photos.length;
  const [open, setOpen] = useState(null); // index of the photo shown big, or null

  // big photo viewer: Esc closes, arrow keys go Previous / Next, the page behind does not scroll
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
    <section ref={ref} className="happy">
      <div className="sun" />
      <svg className="skyline" viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 140V80h50V50h40V90h40V30h50V70h60V40h40V100h50V60h60V20h40V80h60V50h50V90h40V35h50V75h60V55h40V95h50V45h60V85h50V25h40V70h60V100h50V60h60V90h50V140Z" />
      </svg>
      <div className="container happy-top">
        <div>
          <h2>Happy families<br />& puppies</h2>
          <p>We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.</p>
        </div>
        <blockquote>“TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”<cite>Sarah M., Dubai, UAE</cite></blockquote>
      </div>
      <div className="container">
        <div className="beam" />
        <div className={seen ? "hang in" : "hang"}>
          {photos.map((f, i) => (
            <figure key={f.image} className="polaroid hp-pol" style={{ "--a": i % 2 ? 2 : -2, "--n": i }} role="button" tabIndex={0} aria-label={"Open photo " + (i + 1) + " of " + total} onClick={() => setOpen(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(i); } }}><span className="tape" /><img src={f.image} alt="A happy TeddyPups family" loading="lazy" /><figcaption className="hand">{f.caption}</figcaption></figure>
          ))}
        </div>
      </div>
      <div className="doorscene">
        <span className="ds-lamp" aria-hidden="true"><i /></span>
        <span className="ds-door" aria-hidden="true"><i className="ds-panel" /><i className="ds-knob" /></span>
        <Link className="btn ds-cta" to="/happy-families">See every happy family</Link>
      </div>
      {open !== null && createPortal(
        <div className="lightbox hf-lightbox hp-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setOpen(null)}>
          <span className="count-badge">{open + 1} / {total}</span>
          <button type="button" className="hf-close" onClick={() => setOpen(null)} aria-label="Close">&times;</button>
          <img key={open} src={photos[open].image} alt={photos[open].caption || "A happy TeddyPups family"} onClick={(e) => e.stopPropagation()} />
          <div className="row hf-nav" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="hf-prev" onClick={() => setOpen((open - 1 + total) % total)}>Previous</button>
            <button type="button" className="hf-next" onClick={() => setOpen((open + 1) % total)}>Next</button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

/* 7. Questions: dark section */
function Questions() {
  return (
    <section className="questions">
      <Stars />
      <div className="container qgrid">
        <div>
          <h2>Questions,<br />answered</h2>
          <Link className="btn outline" to="/faq">Read all questions</Link>
          <span className="qmark" aria-hidden="true">?</span>
        </div>
        <div>
          {faqs.slice(0, 3).map(([q, a]) => (
            <div className="q" key={q}><h3>✦ {q}</h3><p>{a}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8. Closing scene: the door opens to show Max */
function Welcome() {
  const ref = useRef(null);
  const seen = useSeen(ref);
  const { mobile } = useScale();
  const [dogOpen, setDogOpen] = useState(false);
  useEffect(() => {
    const on = (e) => setDogOpen(e.detail);
    window.addEventListener("dogdoor", on);
    return () => window.removeEventListener("dogdoor", on);
  }, []);
  const open = mobile ? seen : dogOpen; // on a big screen the dog opens it as it passes and it closes again when the dog comes back up
  return (
    <section className="welcome">
      <div className="container center">
        <h2>Ready to meet your<br />new best friend?</h2>
        <p>Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.</p>
      </div>
      <div ref={ref} className={open ? "house open" : "house"}>
        <div className="roof" />
        <div className="doorway"><img src={puppies[0].image} alt="Max, waiting inside" /><span className="plaque">welcome home</span><div className="bigdoor" /></div>
        <span className="win l" aria-hidden="true" /><span className="win r" aria-hidden="true" />
        <span className="plant l" /><span className="plant r" /><span className="lamp" /><span className="lamp l" />
      </div>
      <div className="row mid">
        <a className="btn green" href={WHATSAPP} target="_blank" rel="noreferrer">Enquire on WhatsApp</a>
        <Link className="btn light" to="/contact">Visit & contact</Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <RoamingDog />
      <Hero />
      <MeetPups />
      <div className="story">
        <TwoWays />
        <Journey />
      </div>
      <Passport />
      <Happy />
      <Questions />
      <Welcome />
    </>
  );
}
