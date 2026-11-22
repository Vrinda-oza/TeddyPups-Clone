import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { WHATSAPP } from "../data.js";
import Mascot from "../components/Mascot.jsx";

// How it works: chips that follow you, an In Dubai / Imported switch, step cards, the puppy promise stamps,
// delivery with a flying plane, why choose us, and a closing card.
const CHIPS = [["two-ways", "Two ways home"], ["promise", "Our premium puppy promise"], ["delivery", "Delivery & collection"], ["why", "Why choose us"]];

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" };
const ICONS = {
  search: <svg {...ic}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>,
  heart: <svg {...ic}><path d="M12 20s-7-4.4-7-9.6A4 4 0 0 1 12 7.8a4 4 0 0 1 7 2.6C19 15.6 12 20 12 20z" /></svg>,
  clock: <svg {...ic}><circle cx="12" cy="13" r="7.5" /><path d="M12 9v4l2.5 2M5 4l2 2M19 4l-2 2" /></svg>,
  truck: <svg {...ic}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>,
  calendar: <svg {...ic}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></svg>,
  chat: <svg {...ic}><path d="M4 5h16v11H10l-4 4v-4H4z" /></svg>,
  plane: <svg {...ic}><path d="M21 4L3 11l7 2 2 7z" /></svg>,
  house: <svg {...ic}><path d="M4 11l8-7 8 7v9H4zM10 20v-5h4v5" /></svg>,
};

const STEPS = {
  dubai: [
    ["search", "Explore our puppies", "Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information.", "#fde2a6"],
    ["heart", "Choose your puppy", "Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.", "#fbd3d3"],
    ["clock", "Meet before you choose", "Spend time bonding before making your decision.", "#d6e4f7"],
    ["truck", "Pick-up or delivery", "Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.", "#d9ecd3"],
  ],
  imported: [
    ["calendar", "Reserve your puppy", "Tell us which puppy has captured your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.", "#fde2a6"],
    ["chat", "Personalized consultation", "We finalize details with you and share updates on your puppy's journey.", "#fbd3d3"],
    ["plane", "Import and arrival", "We manage health checks, travel arrangements, and documentation. Your puppy will be carefully transported and will arrive ready to join your family.", "#d6e4f7"],
    ["house", "Welcome home", "We help your new puppy settle in and stay available for any additional assistance, to ensure a smooth transition into your home.", "#d9ecd3"],
  ],
};

const WHY = [
  ["plane", "International cargo", "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance."],
  ["chat", "Support 24/7", "Our team is available 24/7 to answer your questions and assist you through every step of the adoption process. From choosing your puppy to post-delivery support — we're just a message away."],
  ["heart", "Health guarantee", "All our puppies come with a verified health certificate from licensed vets. We ensure every puppy is vaccinated, dewormed, and thoroughly checked before joining your family."],
];

const MINI = [
  ["Take your puppy home the same day", "Local puppies are available immediately — visit, fall in love, and go home together."],
  ["Delivery within Dubai", "Prefer to stay home? We deliver your puppy to your door within Dubai, safely and comfortably."],
  ["Safe international cargo", "We handle all the paperwork and ensure comfortable travel so your puppy arrives happy and stress-free."],
  ["Worldwide delivery", "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance."],
];

// a section that fades up the first time it is on screen
function Sec({ id, className = "", children }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <section id={id} ref={ref} className={"hw-sec " + className + (seen ? " in" : "")}>{children}</section>;
}

const ARC = "M34 150 Q180 -34 326 150";
function Plane({ wing = "#fff" }) {
  return (
    <g stroke="#2a1509" strokeWidth="2.2" strokeLinejoin="round" fill="#fff">
      <path d="M-4 -3 L-13 -17 L-4 -17 L9 -3Z" fill={wing} /><path d="M-4 3 L-13 17 L-4 17 L9 3Z" fill={wing} /><path d="M-22 -3 L-28 -11 L-21 -11 L-14 -3Z" fill={wing} />
      <path d="M-24 0 C-24 -4 -10 -5 16 -4 C24 -3 28 -1 28 0 C28 1 24 3 16 4 C-10 5 -24 4 -24 0Z" />
    </g>
  );
}
const SKY = "M0 160H360M14 160V104H40V160M48 160V70H72V160M80 160V118H100V160M108 160V40L113 14L118 40V160M130 160V84H160V160M168 160V108H190V160M200 160V60H226V160M236 160V112H262V160M272 160V96H300V160M308 160V124H340V160";

export default function HowItWorks() {
  const [mode, setMode] = useState("dubai"); // "dubai" or "imported"
  const [active, setActive] = useState("two-ways");

  useEffect(() => {
    const els = CHIPS.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((list) => list.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  useEffect(() => { // links like /how-it-works#delivery
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 250);
  }, []);
  const go = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const steps = STEPS[mode];
  const chipsRef = useRef(null);
  useEffect(() => { // on phones the row scrolls sideways: keep the current chip in view
    const box = chipsRef.current, el = box && box.querySelector(".hw-chip.on");
    if (box && el && box.scrollWidth > box.clientWidth) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div className="hw">
      <div className="container wide">
        <div className="hw-top">
          <h1 className="big">How it works</h1>
          <p>Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.</p>
        </div>
        <div className="hw-chips" ref={chipsRef}>
          {CHIPS.map(([id, label], i) => (
            <button key={id} type="button" className={active === id ? "hw-chip on" : "hw-chip"} onClick={() => go(id)}><i>{i + 1}</i>{label}</button>
          ))}
        </div>

        <Sec id="two-ways">
          <div className="hw-ways-head">
            <div><p className="hand hw-eyebrow">choose your way</p><h2 className="hw-h2">Two ways home</h2></div>
            <div className="hw-toggle-row">
              <div className="hw-toggle" data-m={mode} role="tablist" aria-label="Choose how to meet your puppy">
                <button type="button" role="tab" aria-selected={mode === "dubai"} className={mode === "dubai" ? "on" : ""} onClick={() => setMode("dubai")}>In Dubai<small>meet in person</small></button>
                <button type="button" role="tab" aria-selected={mode === "imported"} className={mode === "imported" ? "on" : ""} onClick={() => setMode("imported")}>Imported<small>order upon request</small></button>
              </div>
              <span className="hw-dog bob" aria-hidden="true"><span className="hw-say">{mode === "dubai" ? "hm?" : "woof!"}</span><Mascot size={74} /></span>
            </div>
          </div>

          <div className="hw-ways-body" key={mode}>
            {mode === "dubai" ? (
              <>
                <div>
                  <h3 className="hw-h3">Meet your puppy in person</h3>
                  <p>Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks.</p>
                </div>
                <div className="hw-card">
                  <span className="hand hw-card-tag">Downtown Dubai</span>
                  <span className="hw-sun" />
                  <svg viewBox="0 0 360 170" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d={SKY} fill="none" stroke="#3b2a20" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" /><path d="M0 164H360" stroke="#3b2a20" strokeWidth="3" strokeLinecap="round" /></svg>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="hw-h3">Order upon request</h3>
                  <p>Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.</p>
                  <p className="hand hw-note">From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.</p>
                </div>
                <div className="hw-card sky">
                  <svg viewBox="0 -10 360 190" aria-label="A plane flying from Europe and Korea to Dubai">
                    <path d={ARC} fill="none" stroke="#a0471d" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 9" />
                    <g><animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={ARC} /><Plane /></g>
                  </svg>
                  <span className="hand hw-from">Europe - Korea</span><span className="hand hw-to">Dubai</span>
                </div>
              </>
            )}
          </div>

          <div className="hw-steps" key={mode + "s"}>
            {steps.map(([icon, title, text, tint], i) => (
              <article className="hw-step" key={title} style={{ "--i": i, "--t": tint }}>
                <span className="hw-ico" style={{ background: tint }}>{ICONS[icon]}</span>
                <span className="hand hw-stepno">Step {i + 1}</span>
                <h4>{title}</h4>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </Sec>

        <Sec id="promise" className="hw-promise">
          <p className="hand hw-eyebrow">puppy passport</p>
          <h2 className="hw-h2 hw-h2-xl">Our premium<br />puppy promise</h2>
          <div className="hw-stamps">
            <div className="hw-stamp" style={{ "--r": "-4deg", "--c": "#a0471d" }}>
              <div className="hw-shape"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><g className="ic-heart"><path d="M24 40C10 30 6 22 10 15c3-5 10-5 14 1 4-6 11-6 14-1 4 7 0 15-14 25z" /></g></svg><h3>Hand-selected breeders</h3></div>
              <p>We work only with breeders who uphold the highest ethical and health standards.</p>
            </div>
            <div className="hw-stamp" style={{ "--r": "3deg", "--c": "#2f7a52" }}>
              <div className="hw-shape rect"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><g className="ic-plane"><path d="M6 28l36-14-8 24-9-7-6 6-1-9z" /></g></svg><h3>Full transparency</h3></div>
              <p>Photos, videos, and health certificates are shared before your puppy travels.</p>
            </div>
            <div className="hw-stamp" style={{ "--r": "-3deg", "--c": "#6b3518" }}>
              <div className="hw-shape"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 10h32v22H20l-8 8v-8H8z" /><circle className="ic-dot" cx="17" cy="21" r="2" fill="currentColor" /><circle className="ic-dot" cx="24" cy="21" r="2" fill="currentColor" /><circle className="ic-dot" cx="31" cy="21" r="2" fill="currentColor" /></svg><h3>Safe, stress-free delivery</h3></div>
              <p>We handle every detail of the import process, so your puppy arrives happy, healthy, and ready to love you.</p>
            </div>
          </div>
        </Sec>

        <Sec id="delivery" className="hw-delivery">
          <div>
            <h2 className="hw-h2 hw-h2-xl">Delivery &amp;<br />collection</h2>
            <p className="hw-lead">From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and arrives safely.</p>
            <div className="hw-mini">{MINI.map(([t, x]) => <div key={t}><h4>{t}</h4><p>{x}</p></div>)}</div>
          </div>
          <div className="hw-route">
            <svg viewBox="0 -30 360 210" aria-label="A plane flying from Korea to Dubai over the skyline">
              <path d={SKY} fill="none" stroke="#c69558" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              <path d={ARC} fill="none" stroke="#a0471d" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" />
              <circle cx="34" cy="150" r="5" fill="#a0471d" /><circle cx="326" cy="150" r="5" fill="#a0471d" />
              <text x="14" y="176" fontFamily="Caveat, cursive" fontSize="20" fill="#2a1509">Korea</text><text x="300" y="176" fontFamily="Caveat, cursive" fontSize="20" fill="#2a1509">Dubai</text>
              <g><animateMotion dur="8s" repeatCount="indefinite" rotate="auto" path={ARC} /><g transform="scale(1.25)"><Plane wing="#a0471d" /></g></g>
            </svg>
          </div>
        </Sec>

        <Sec id="why" className="hw-why">
          <div>
            <h2 className="hw-h2 hw-h2-xl">Why<br />choose us</h2>
            <p className="hw-lead">We're here to help you find a new family member. From the moment you visit our site to the joyful day your puppy arrives at your door, we're with you every step of the way. Our mission is to make the entire adoption process smooth, transparent, and full of love.</p>
          </div>
          <ul>
            {WHY.map(([icon, t, x]) => <li key={t}><span className="hw-whyico">{ICONS[icon]}</span><div><h4>{t}</h4><p>{x}</p></div></li>)}
          </ul>
        </Sec>

        <Sec className="hw-cta">
          <div>
            <h2 className="hw-h2">Unique and high quality puppies</h2>
            <p>When you choose TeddyPups, you can trust that you're getting a puppy of the highest quality. We also provide guidance and support to new pet owners, offering advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend.</p>
            <div className="hw-cta-btns">
              <a className="btn green" href={WHATSAPP} target="_blank" rel="noreferrer">Ask us on WhatsApp</a>
              <Link className="btn outline" to="/puppies">See available puppies</Link>
            </div>
          </div>
          <span className="hw-cta-dog bob" aria-hidden="true"><Mascot size={130} /></span>
        </Sec>
      </div>
      <svg className="hw-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C 220 118 470 70 720 84 C 980 98 1210 34 1440 52 L1440 140 L0 140 Z" fill="#24130b" /></svg>
    </div>
  );
}
