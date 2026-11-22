import { useEffect, useRef, useState } from "react";
import { WalkingMascot } from "./components/Mascot.jsx";
import { useScale } from "./scale.js";
import PawCursor from "./components/PawCursor.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Footer, WhatsAppFloat } from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Puppies from "./pages/Puppies.jsx";
import PuppyDetail from "./pages/PuppyDetail.jsx";
import { HappyFamilies, GoneHome } from "./pages/Families.jsx";
import GoneDetail from "./pages/GoneDetail.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Faq from "./pages/Faq.jsx";
import Contact from "./pages/Contact.jsx";
import { WHATSAPP } from "./data.js";

const CALL = "tel:+971500000000"; // change to the real phone number

// Scroll to top on every page change (or to the #section if the link has one)
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

// Page transition: shown on the first visit and on every page change.
// A scalloped curtain drops down, the puppy walks in leaving paw prints, "every puppy is family" appears,
// then the curtain fades away and the new page is there (it is already drawn underneath).
const PRINTS = [8, 22, 36, 50, 64];
function PageTransition() {
  const { pathname } = useLocation();
  const [run, setRun] = useState(1);
  const [show, setShow] = useState(true);
  const [walking, setWalking] = useState(true);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) first.current = false; else setRun((n) => n + 1);
    setShow(true);
    setWalking(true);
    const stop = setTimeout(() => setWalking(false), 1250);
    const end = setTimeout(() => setShow(false), 2300);
    return () => { clearTimeout(stop); clearTimeout(end); };
  }, [pathname]);
  if (!show) return null;
  return (
    <div className="pt" key={run} aria-hidden="true">
      <div className="pt-sheet"><div className="pt-edge" /></div>
      <div className="pt-stage">
        <div className="pt-row">
          {PRINTS.map((x, i) => (
            <svg key={i} className="pt-print" viewBox="0 0 24 24" style={{ left: x + "%", animationDelay: 0.55 + i * 0.16 + "s", top: i % 2 ? "70%" : "52%" }}>
              <ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" />
            </svg>
          ))}
          <div className="pt-dog"><WalkingMascot size={170} walking={walking} dir={1} /></div>
        </div>
        <p className="hand pt-text">every puppy is family</p>
      </div>
    </div>
  );
}

// A small dog walks left and right while the page scrolls. HOME PAGE ONLY (phones).
// Desktop Home has the big roaming dog; every other page has no walking dog.
// Only ONE dog is ever shown: it hides while the hero dog or the footer basket dog is on screen.
function MobileDog() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  // x = place on the screen (%), walking = legs moving, peek = only the head and paws show above the bottom bar
  const [st, setSt] = useState({ x: 8, dir: 1, walking: false, peek: true, hide: false });
  const [wide, setWide] = useState(typeof window !== "undefined" && window.innerWidth >= 1100);
  useEffect(() => {
    let last = window.scrollY, pos = 8, dir = 1, tWalk = 0, tPeek = 0;
    const root = document.documentElement;
    setSt({ x: 8, dir: 1, walking: false, peek: true, hide: false });
    if (!isHome) return; // no walking dog on any other page
    function onResize() { setWide(window.innerWidth >= 1100); }
    function onScroll() {
      const vw = window.innerWidth, vh = window.innerHeight;
      if (vw >= 1100) return; // big screens: the big roaming dog does the walking
      const y = window.scrollY, dy = Math.abs(y - last);
      last = y;
      // end of the page: the dog sits in the footer basket
      const slot = document.querySelector(".basket-dog");
      if (slot && slot.getBoundingClientRect().top + 90 < vh - (vw < 861 ? 70 : 20)) { root.dataset.dogMode = "basket"; setSt((s) => (s.hide ? s : { ...s, hide: true })); return; }
      if (root.dataset.dogMode === "basket") delete root.dataset.dogMode;
      // the hero dog is on screen: do not show a second one
      const hd = document.querySelector(".hero-win.mascot");
      const hr = hd ? hd.getBoundingClientRect() : null;
      const hideForHero = !!hr && hr.height > 0 && hr.bottom > 0 && hr.top < vh;
      // in "Meet the pups" the dog stays at the left edge and only peeks over the bar (like the original)
      const meetEl = document.querySelector(".meet-m, .meet");
      const mr = meetEl ? meetEl.getBoundingClientRect() : null;
      const inMeet = !!mr && mr.height > 0 && mr.top < vh * 0.55 && mr.bottom > vh * 0.55;
      if (inMeet) {
        pos = 8; dir = 1;
        setSt((s) => ({ ...s, x: 8, dir: 1, walking: false, peek: true, hide: hideForHero }));
        return;
      }
      setSt((s) => (s.hide === hideForHero ? s : { ...s, hide: hideForHero }));
      if (!dy) return;
      // elsewhere it walks left and right with the scroll, then sits down and peeks when you stop
      pos += (dy * 0.45 / Math.max(320, vw)) * 100 * dir;
      const max = vw < 700 ? 80 : 88;
      if (pos > max) { pos = max; dir = -1; } else if (pos < 4) { pos = 4; dir = 1; }
      setSt((s) => ({ ...s, x: pos, dir, walking: true, peek: false }));
      clearTimeout(tWalk); clearTimeout(tPeek);
      tWalk = setTimeout(() => setSt((s) => ({ ...s, walking: false })), 170);
      tPeek = setTimeout(() => setSt((s) => ({ ...s, peek: true })), 900);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); clearTimeout(tWalk); clearTimeout(tPeek); if (root.dataset.dogMode === "basket") delete root.dataset.dogMode; };
  }, [pathname]);
  const active = isHome && !wide; // Home page, phones and tablets only
  if (!active) return null;
  const cls = "mdog" + (st.hide ? " hide" : "") + (st.peek ? " peek" : "");
  return <div className={cls} style={{ left: st.x + "%" }} aria-hidden="true"><div className="mdog-in"><WalkingMascot size={typeof window !== "undefined" && window.innerWidth >= 700 ? 100 : 84} walking={st.walking} dir={st.dir} /></div></div>;
}

function MobileBar() {
  return (
    <div className="mbar">
      <a className="btn green" href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us</a>
      <a className="call" href={CALL}>Call</a>
    </div>
  );
}

export default function App() {
  useScale();
  return (
    <>
      <PageTransition />
      <PawCursor />
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/puppies" element={<Puppies />} />
          <Route path="/puppies/:slug" element={<PuppyDetail />} />
          <Route path="/happy-families" element={<HappyFamilies />} />
          <Route path="/gone-home" element={<GoneHome />} />
          <Route path="/gone-home/:slug" element={<GoneDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<div className="container section"><h1>Page not found</h1></div>} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileDog />
      <MobileBar />
    </>
  );
}
