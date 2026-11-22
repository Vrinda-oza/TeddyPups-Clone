import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Mascot from "../components/Mascot.jsx";
import { puppies, whatsappFor } from "../data.js";
import { gone } from "../goneData.js";
import { usePhotoTint } from "../tint.js";

const INCLUDED = ["Vaccinated", "Dewormed", "Verified health certificate from licensed vets", "Thoroughly checked before joining your family"];
const WAY = [
  ["Reserve your puppy", "Tell us which puppy has captured your heart."],
  ["Personalized consultation", "We finalize details with you and share updates on your puppy's journey."],
  ["Import and arrival", "We manage health checks, travel arrangements, and documentation."],
  ["Welcome home", "We help your new puppy settle in and ensure a smooth transition into your home."],
];

function Paw() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="paw-i"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg>;
}

// the thin rust ribbon on the left edge grows as you read down the page
function Ribbon() {
  const [p, setP] = useState(0);
  useEffect(() => {
    function on() { const h = document.documentElement; setP(Math.min(1, window.scrollY / Math.max(1, h.scrollHeight - window.innerHeight))); }
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div className="ribbon" aria-hidden="true" style={{ height: "calc(" + (8 + p * 92) + "vh - 40px)" }} />;
}

export default function PuppyDetail() {
  const { slug } = useParams();
  const idx = puppies.findIndex((p) => p.slug === slug);
  const puppy = puppies[idx];
  const tint = usePhotoTint(puppy && puppy.image);
  const [form, setForm] = useState({ name: "", phone: "", email: "", area: "", message: "" });

  useEffect(() => {
    if (puppy) setForm((f) => ({ ...f, message: "Hi! I'd love to know more about " + puppy.name + " (" + puppy.breed + ")." }));
  }, [slug]);

  // a puppy that has already gone home lives on the Gone home path only
  if (!puppy && gone.some((g) => g.slug === slug)) return <Navigate to={"/gone-home/" + slug} replace />;
  if (!puppy) {
    return (
      <div className="container wide section">
        <h1>Puppy not found</h1>
        <p>This puppy may have gone home. <Link to="/puppies">See available puppies</Link></p>
      </div>
    );
  }
  const prev = puppies[(idx - 1 + puppies.length) % puppies.length];
  const next = puppies[(idx + 1) % puppies.length];
  const where = puppy.origin === "local" ? "In our Dubai showroom" : "Imported for you";
  const message = "Hi TeddyPups! I'm interested in the " + puppy.name + " (" + puppy.breed + ", " + puppy.gender + ").";
  const send = () => window.open(whatsappFor("Hi TeddyPups! My name is " + (form.name || "-") + ", phone " + (form.phone || "-") + (form.email ? ", email " + form.email : "") + (form.area ? ", area " + form.area : "") + ". " + form.message), "_blank");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="pd" style={{ "--tint": tint }}>
      <Ribbon />
      <div className="container wide pd-wrap">
        <p className="crumbs"><Link to="/puppies">Available puppies</Link> / {puppy.name}</p>
        <p className="step-hand"><span className="sn">1</span><span className="hand">hello, it's me</span></p>
        <div className="pd-hero">
          <div className="pd-photo">
            <img src={puppy.image} alt={puppy.gender + " " + puppy.breed + " puppy"} />
            {puppy.video && <span className="vid">&#9654; video on request</span>}
          </div>
          <aside className="pd-card">
            <span className="minus" aria-hidden="true" />
            <span className="pd-mascot"><Mascot size={70} /></span>
            <span className="avail"><Paw /> Available</span>
            <h1>{puppy.name}</h1>
            <p className="sub">{puppy.breed}</p>
            <dl className="facts2">
              <div><dt>Breed</dt><dd>{puppy.breed}</dd></div>
              <div><dt>Boy or girl</dt><dd>{puppy.gender.replace(/^./, (c) => c.toUpperCase())}</dd></div>
              <div><dt>Age</dt><dd>{puppy.age}</dd></div>
              <div><dt>Where</dt><dd>{where}</dd></div>
            </dl>
            <a className="btn green wide-btn" href={whatsappFor(message)} target="_blank" rel="noreferrer">Ask about {puppy.name} on WhatsApp</a>
            <a className="btn outline wide-btn" href="#enquiry">Send an enquiry</a>
          </aside>
        </div>

        <div className="pd-incl">
          <p className="step-hand"><span className="sn">2</span><span className="hand">what comes with {puppy.name}</span></p>
          <h2>Every Teddy Pup comes</h2>
          <ul>{INCLUDED.map((t) => <li key={t}><span className="tick">&#10003;</span>{t}</li>)}</ul>
        </div>

        <div className="pd-way">
          <p className="step-hand"><span className="sn">3</span><span className="hand">the way home</span></p>
          <h2>{puppy.origin === "local" ? "Coming home from Dubai" : "Coming home from abroad"}</h2>
          <ol className="way-steps">
            {WAY.map(([t, d], i) => <li key={t}><span className="wn">{i + 1}</span><b>{t}</b><p>{d}</p></li>)}
          </ol>
        </div>

        <section className="pd-letter" id="enquiry">
          <span className="stamp-paw"><Paw /></span>
          <div className="letter-l">
            <p className="step-hand"><span className="sn">4</span><span className="hand">dear TeddyPups...</span></p>
            <h2>Ask about<br />this puppy</h2>
            <p>Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.</p>
          </div>
          <div className="letter-r">
            <label>Your name <i>*</i><input value={form.name} onChange={set("name")} /></label>
            <label>Phone or WhatsApp <i>*</i><input value={form.phone} onChange={set("phone")} /><small>With country code, e.g. +971 50 123 4567</small></label>
            <label>Email <span>(optional)</span><input value={form.email} onChange={set("email")} /></label>
            <label>Your area <span>(optional)</span><input value={form.area} onChange={set("area")} /><small>e.g. Dubai Marina</small></label>
            <label className="full">Message <span>(optional)</span><textarea rows="4" value={form.message} onChange={set("message")} /></label>
            <button className="btn full-btn" onClick={send}>Send enquiry <Paw /></button>
          </div>
        </section>

        <div className="pd-nav">
          <Link to={"/puppies/" + prev.slug} className="pn"><span className="pn-thumb"><img src={prev.image} alt="" /></span><span><small className="hand">Previous pup</small><b>{prev.name}</b></span></Link>
          <Link to={"/puppies/" + next.slug} className="pn next"><span><small className="hand">Next pup</small><b>{next.name}</b></span><span className="pn-thumb"><img src={next.image} alt="" /></span></Link>
        </div>
      </div>
    </div>
  );
}
