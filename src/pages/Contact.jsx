import { useEffect, useRef, useState } from "react";
import { whatsappFor, WHATSAPP, puppies, SHOWROOM } from "../data.js";
import { WalkingMascot } from "../components/Mascot.jsx";

// "Max (Maltipoo, boy)", "Maltipoo (girl)": the same list as the puppies on the Puppies page
const OPTIONS = puppies.map((p) => (p.name.includes(p.breed) ? p.name + " (" + p.gender + ")" : p.name + " (" + p.breed + ", " + p.gender + ")"));
const MAPS = "https://www.google.com/maps/search/?api=1&query=Downtown+Dubai";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [breed, setBreed] = useState("any puppy (not sure yet)");
  const [note, setNote] = useState("");
  const [errs, setErrs] = useState({}); // field -> message, shown in the red box and on the fields
  const [phase, setPhase] = useState("form"); // form -> sending (envelope drops into the mailbox) -> done ("Message received!")
  const [hover, setHover] = useState(false); // the dog says "hm?" while the mouse is on it
  const [boxH, setBoxH] = useState(0);
  const formRef = useRef(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const note2 = () => "Hi TeddyPups! My name is " + name + ", my number is " + phone + (email ? " and my email is " + email : "") +
    ". I live in " + (city || "Dubai") + ", and I'm curious about " + breed + ". " + note;

  function validate() {
    const e = {};
    if (name.trim() === "") e.name = "Please tell us your name.";
    const digits = phone.replace(/\D/g, "");
    if (!phone.trim().startsWith("+") || digits.length < 8 || digits.length > 15) e.phone = "Add a phone or WhatsApp number we can reach, with country code.";
    if (email.trim() !== "" && !/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "That email address doesn't look right.";
    return e;
  }
  // typing in a field clears that field's red mark
  const clear = (f) => setErrs((o) => { if (!o[f]) return o; const n = { ...o }; delete n[f]; return n; });

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrs(found);
    if (Object.keys(found).length) {
      const first = formRef.current && formRef.current.querySelector(".ct-bad");
      if (first) first.focus();
      return;
    }
    setBoxH(formRef.current ? formRef.current.offsetHeight : 0);
    setPhase("sending");
    const slow = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    timer.current = setTimeout(() => setPhase("done"), slow ? 2300 : 400);
  }

  return (
    <div className="ct-page">
      <div className="container wide ct-inner">
        <header className="ct-head">
          <h1 className="ct-h1">Get in touch<br />with us</h1>
          <p className="ct-lead">Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we'd love to hear from you!</p>
        </header>

        <div className="ct-grid">
          <div className="ct-left">
            <a className="btn green ct-wa" href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp +971 50 000 0000</a>
            <ul className="ct-facts">
              <li><span className="ct-lab">call us</span><a href="tel:+971500000000">+971 50 000 0000</a></li>
              <li><span className="ct-lab">email</span><a href="mailto:info@instabizweb.com">info@instabizweb.com</a></li>
            </ul>
          </div>

          {phase === "form" ? (
          <form ref={formRef} onSubmit={handleSubmit} className="ct-letter" noValidate>
            <span className="ct-stamp" aria-hidden="true">
              <svg viewBox="0 0 24 24"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg>
            </span>
            <p className="ct-dear">Dear TeddyPups,</p>
            {Object.keys(errs).length > 0 && (
              <div className="ct-alert" role="alert">
                <b>Please check the highlighted fields.</b>
                <ul>{Object.values(errs).map((m) => <li key={m}>{m}</li>)}</ul>
              </div>
            )}
            <p className="ct-line">my name is <input className={"ct-in w-name" + (errs.name ? " ct-bad" : "")} aria-invalid={!!errs.name} value={name} onChange={(e) => { setName(e.target.value); clear("name"); }} aria-label="Your name" autoComplete="name" />, and you can reach me on <input className={"ct-in w-phone" + (errs.phone ? " ct-bad" : "")} aria-invalid={!!errs.phone} type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }} placeholder="+971 50 123 4567" aria-label="Phone" autoComplete="tel" /> or by email at <input className={"ct-in w-email" + (errs.email ? " ct-bad" : "")} aria-invalid={!!errs.email} type="email" value={email} onChange={(e) => { setEmail(e.target.value); clear("email"); }} placeholder="optional" aria-label="Email" autoComplete="email" />.</p>
            <p className="ct-line">I live in <input className="ct-in w-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Dubai Marina" aria-label="City" />, and I'm curious about{" "}
              <select className="ct-in ct-sel" value={breed} onChange={(e) => setBreed(e.target.value)} aria-label="Breed">
                <option>any puppy (not sure yet)</option>
                {OPTIONS.map((o, i) => <option key={i}>{o}</option>)}
              </select>.</p>
            <textarea className="ct-ruled" rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything else you'd like to tell us..." aria-label="Message" />
            <div className="ct-sign">
              <span className="ct-love">with love, a future puppy parent</span>
              <button className="ct-post" type="submit">Post my letter</button>
            </div>
            <div className="ct-dog" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-hidden="true">
              <WalkingMascot size={96} />
              {hover && <span className="ct-bubble">hm?</span>}
            </div>
          </form>
        ) : (
          <div className={"ct-result " + phase} style={boxH ? { minHeight: boxH } : undefined} role="status" aria-live="polite">
            {phase === "sending" ? (
              <div className="ct-send">
                <svg className="ct-env" viewBox="0 0 100 62" aria-hidden="true"><rect x="3" y="3" width="94" height="56" rx="7" fill="#fffdf8" stroke="#2a1509" strokeWidth="4" /><path d="M5 6l45 31L95 6z" fill="#fbe3b0" stroke="#2a1509" strokeWidth="4" strokeLinejoin="round" /><path d="M5 57l35-27M95 57L60 30" stroke="#2a1509" strokeWidth="3" /><circle cx="50" cy="37" r="7" fill="#a0471d" stroke="#2a1509" strokeWidth="3.5" /></svg>
                <svg className="ct-mb" viewBox="0 0 120 150" aria-hidden="true"><rect x="52" y="86" width="16" height="48" fill="#5b3a29" stroke="#2a1509" strokeWidth="4" /><path d="M24 90V54a36 36 0 0 1 72 0v36z" fill="#c2602a" stroke="#2a1509" strokeWidth="4" strokeLinejoin="round" /><rect x="40" y="50" width="40" height="9" rx="4.5" fill="#24130b" /><path d="M32 76h56" stroke="#8a421c" strokeWidth="2" /><g className="ct-flag"><path d="M96 66h22" stroke="#2a1509" strokeWidth="4" strokeLinecap="round" /></g></svg>
              </div>
            ) : (
              <div className="ct-done">
                <svg className="ct-mb" viewBox="0 0 120 150" aria-hidden="true"><rect x="52" y="86" width="16" height="48" fill="#5b3a29" stroke="#2a1509" strokeWidth="4" /><path d="M24 90V54a36 36 0 0 1 72 0v36z" fill="#c2602a" stroke="#2a1509" strokeWidth="4" strokeLinejoin="round" /><rect x="40" y="50" width="40" height="9" rx="4.5" fill="#24130b" /><path d="M32 76h56" stroke="#8a421c" strokeWidth="2" /><g className="ct-flag up"><path d="M98 70V40" stroke="#2a1509" strokeWidth="4" strokeLinecap="round" /><rect x="98" y="32" width="16" height="11" rx="1.5" fill="#fbe3b0" stroke="#2a1509" strokeWidth="3.5" /></g></svg>
                <h2>Message received!</h2>
                <p>Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.</p>
                <a className="btn green" href={whatsappFor(note2())} target="_blank" rel="noreferrer">WhatsApp us</a>
              </div>
            )}
            <div className="ct-dog" aria-hidden="true">
              <WalkingMascot size={96} />
              {phase === "sending" && <span className="ct-bubble">hm?</span>}
            </div>
          </div>
        )}

          <section className="ct-visit">
            <div className="ct-awning" aria-hidden="true" />
            <div className="ct-visit-body">
              <div className="ct-visit-text">
                <h2>Visit us in<br />Downtown Dubai</h2>
                <p>Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.</p>
                <p className="ct-where"><svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg>Downtown Dubai, United Arab Emirates</p>
                <a className="ct-map" href={MAPS} target="_blank" rel="noreferrer">Open in Google Maps</a>
              </div>
              <img className="ct-arch" src={SHOWROOM} alt="A tiny apricot puppy held up in the TeddyPups showroom" loading="lazy" />
            </div>
            <svg className="ct-fence" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 39H400M10 39V14l6-8 6 8v25M40 39V14l6-8 6 8v25M70 39V14l6-8 6 8v25M100 39V14l6-8 6 8v25M130 39V14l6-8 6 8v25M160 39V14l6-8 6 8v25M190 39V14l6-8 6 8v25M220 39V14l6-8 6 8v25M250 39V14l6-8 6 8v25M280 39V14l6-8 6 8v25M310 39V14l6-8 6 8v25M340 39V14l6-8 6 8v25M370 39V14l6-8 6 8v25M0 22H400" /></svg>
          </section>
        </div>
      </div>
      <svg className="hw-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C 220 118 470 70 720 84 C 980 98 1210 34 1440 52 L1440 140 L0 140 Z" fill="#24130b" /></svg>
    </div>
  );
}
