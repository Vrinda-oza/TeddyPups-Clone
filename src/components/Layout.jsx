import Stars from "./Stars.jsx";
import { WalkingMascot } from "./Mascot.jsx";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LOGO, WHATSAPP, BREEDS } from "../data.js";

const CALL_LINK = "tel:+971500000000"; // same number as the Call button on phones
import { gone } from "../goneData.js";
import Mascot from "./Mascot.jsx";

const links = [
  ["/", "Home"],
  ["/puppies", "Puppies"],
  ["/happy-families", "Happy families"],
  ["/how-it-works", "How it works"],
  ["/faq", "FAQ"],
  ["/contact", "Visit & contact"],
];

export function Header() {
  const [open, setOpen] = useState(false); // mobile menu open or closed
  const [hidden, setHidden] = useState(false); // hide the header while scrolling down
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > lastY && y > 120);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]); // a tapped menu link opens its page and closes the menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""; // the page behind the menu does not scroll
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);
  return (
    <header className={hidden && !open ? "header hide" : "header"}>
      <a href="#main" className="skip">Skip to content</a>
      <div className="container bar">
        <Link to="/" className="logo"><img src={LOGO} alt="" width="36" height="36" />TeddyPups</Link>
        <nav className={open ? "nav open" : "nav"}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>{label}</NavLink>
          ))}
          <div className="nav-cta">
            <a className="btn green" href={WHATSAPP} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>WhatsApp us</a>
            <a className="nav-call" href={CALL_LINK} onClick={() => setOpen(false)}>Call</a>
          </div>
        </nav>
        <a className="btn green small" href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us</a>
        <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open}><svg className="menu-paw" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg><span>{open ? "Close" : "Menu"}</span></button>
      </div>
    </header>
  );
}

const GONE = gone.slice(0, 5);

// "Already gone home" strip shown above the footer on the puppy pages.
// The photos pop in one by one when the strip scrolls into view, then float gently.
// Clicking any puppy opens the Gone home page (and jumps to that puppy's ticket).
function GoneHomeStrip() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className={seen ? "gone seen" : "gone"} ref={ref}>
      <div className="container wide gone-grid">
        <div className="gone-copy">
          <h2>Already<br />gone home</h2>
          <p>These puppies have found their families.</p>
          <Link className="btn" to="/gone-home">See the puppies who've gone home</Link>
        </div>
        <div className="gone-row">
          {GONE.map((g, i) => (
            <Link key={g.slug} to={"/gone-home/" + g.slug} state={{ from: "puppies-strip" }} className={"gone-pup g" + i} style={{ "--i": i }}>
              <span className="gone-photo">
                <span className="gone-blob" /><span className="gone-ring" />
                <img src={g.image} alt={g.name + ", a puppy who has gone home"} loading="lazy" />
                <i className="gone-doodle" />
              </span>
              <span className="gone-pill">gone home &#9829;</span>
              <b>{g.name}</b>
            </Link>
          ))}
        </div>
      </div>
      <svg className="gone-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C 220 118 470 70 720 84 C 980 98 1210 34 1440 52 L1440 140 L0 140 Z" fill="#24130b" /></svg>
    </section>
  );
}

export function Footer() {
  const { pathname } = useLocation();
  const puppyPage = pathname.startsWith("/puppies") || pathname.startsWith("/gone-home") || pathname.startsWith("/happy-families") || pathname.startsWith("/how-it-works") || pathname.startsWith("/faq") || pathname.startsWith("/contact");
  const ownWave = pathname.startsWith("/how-it-works") || pathname.startsWith("/happy-families") || pathname.startsWith("/faq") || pathname.startsWith("/contact"); // that page draws its own wave inside its orange background
  const listPage = pathname.replace(/\/$/, "") === "/puppies"; // the strip (with its own wave) is only on the list page
  return (
    <>
    {listPage && <GoneHomeStrip />}
    {puppyPage && !listPage && !ownWave && (
      <svg className="pre-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C 220 118 470 70 720 84 C 980 98 1210 34 1440 52 L1440 140 L0 140 Z" fill="#24130b" /></svg>
    )}
    <footer className={puppyPage ? "footer sit" : "footer"}>
      <Stars />
      <span className="moon" />
      <div className="container cols">
        <div>
          <h3>Home, at last.</h3>
          <p>TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.</p>
          <div className="basket">
            <span className="basket-dog"><WalkingMascot size={170} walking={false} /></span>
            <span className="basket-paw bp-l" /><span className="basket-paw bp-r" />
            <svg className="basket-front" viewBox="0 0 220 80" preserveAspectRatio="none" aria-hidden="true"><path d="M4 4h212l-18 72H22z" fill="#d9a15c" stroke="#2a1509" strokeWidth="4" strokeLinejoin="round" /><path d="M14 28h192M20 52h180M70 6l-8 70M110 6v70M150 6l8 70" stroke="#a8702f" strokeWidth="3" fill="none" /></svg>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/puppies">Available puppies</Link>
          <Link to="/gone-home">Gone home</Link>
          <Link to="/happy-families">Happy families</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/how-it-works#delivery">Delivery & collection</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Visit & contact</Link>
        </div>
        <div>
          <h4>Say hello</h4>
          <a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp +971 50 000 0000</a>
          <a href="mailto:hello@teddypups.ae">hello@teddypups.ae</a>
          <span>Downtown Dubai, United Arab Emirates</span>
          <a href="https://www.instabizweb.com/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.instabizweb.com/" target="_blank" rel="noreferrer">TikTok</a>
          <a href="https://www.instabizweb.com/" target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </div>
      <div className="copy">
        <span className="copy-l"><img src={LOGO} alt="" width="46" height="46" />© 2026 TeddyPups U.A.E.</span>
        <span className="copy-r">every puppy is family</span>
      </div>
    </footer>
    </>
  );
}

// Floating WhatsApp button that opens a small chat card
export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="float">
      {open && (
        <div className="chat">
          <div className="chat-head"><img src={LOGO} alt="" width="32" height="32" /><b>TeddyPups U.A.E.</b><small>online</small></div>
          <p className="bubble">Hi TeddyPups! I'd love to know more about your puppies.</p>
          <p>Select your preferred breed or tell us what you're looking for.</p>
          <div className="chips">
            {BREEDS.map((b) => (
              <Link key={b} to={"/puppies?breed=" + b.toLowerCase().replace(" ", "-")} onClick={() => setOpen(false)}>{b}</Link>
            ))}
          </div>
          <a className="btn green" href={WHATSAPP} target="_blank" rel="noreferrer">Say hello on WhatsApp</a>
        </div>
      )}
      <button className="fab" onClick={() => setOpen(!open)} aria-label="Chat on WhatsApp">{open ? "×" : "💬"}</button>
    </div>
  );
}
