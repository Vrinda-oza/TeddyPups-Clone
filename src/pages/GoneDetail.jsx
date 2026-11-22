import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Mascot from "../components/Mascot.jsx";
import { gone } from "../goneData.js";
import { whatsappFor, puppies } from "../data.js";

const INCLUDED = ["Vaccinated", "Dewormed", "Verified health certificate from licensed vets", "Thoroughly checked before joining your family"];

function Paw() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="paw-i"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg>;
}

// Page for a puppy who has already gone home (opens from the "Already gone home" strip)
export default function GoneDetail() {
  const { slug } = useParams();
  const idx = gone.findIndex((g) => g.slug === slug);
  const pup = gone[idx];
  const [n, setN] = useState(0); // photo shown
  const [form, setForm] = useState({ name: "", phone: "", email: "", area: "", message: "" });

  useEffect(() => {
    setN(0);
    if (pup) setForm((f) => ({ ...f, message: "Hi! I'd love to know more about " + pup.name + " (" + pup.breed + ")." }));
  }, [slug]);

  // an available puppy never uses the Gone home path
  if (!pup && puppies.some((p) => p.slug === slug)) return <Navigate to={"/puppies/" + slug} replace />;
  if (!pup) {
    return (
      <div className="container wide section">
        <h1>Puppy not found</h1>
        <p><Link to="/gone-home">See all the puppies who've gone home</Link></p>
      </div>
    );
  }
  const total = pup.photos.length;
  const go = (d) => setN((n + d + total) % total);
  const prev = gone[(idx - 1 + gone.length) % gone.length];
  const next = gone[(idx + 1) % gone.length];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const send = () => window.open(whatsappFor("Hi TeddyPups! My name is " + (form.name || "-") + ", phone " + (form.phone || "-") + (form.email ? ", email " + form.email : "") + (form.area ? ", area " + form.area : "") + ". " + form.message), "_blank");
  const ask = whatsappFor("Hi TeddyPups! I'm looking for a puppy like " + pup.name + " (" + pup.breed + ").");

  return (
    <div className="pd gd">
      <div className="container wide pd-wrap">
        <p className="crumbs"><Link to="/gone-home">Gone home</Link> / {pup.name}</p>
        <p className="step-hand"><span className="sn">1</span><span className="hand">the day they went home</span></p>
        <div className="pd-hero">
          <div className="gd-gallery">
            <div className={pup.small ? "pd-photo gd-photo small" : "pd-photo gd-photo"}>
              {pup.small && <img className="gd-back" src={pup.photos[n]} alt="" aria-hidden="true" />}
              <img className="gd-main" key={pup.photos[n]} src={pup.photos[n]} alt={pup.name + ", " + pup.breed + ", gone home"} />
              {total > 1 && (
                <>
                  <button className="gd-arrow l" onClick={() => go(-1)} aria-label="Previous photo">&#8249;</button>
                  <button className="gd-arrow r" onClick={() => go(1)} aria-label="Next photo">&#8250;</button>
                  <span className="gd-count">{n + 1} / {total}</span>
                </>
              )}
            </div>
            {total > 1 && (
              <div className="gd-thumbs">
                {pup.photos.map((p, i) => (
                  <button key={p} className={i === n ? "on" : ""} onClick={() => setN(i)} aria-label={"Photo " + (i + 1)}><img src={p} alt="" /></button>
                ))}
              </div>
            )}
          </div>
          <aside className="pd-card">
            <span className="minus" aria-hidden="true" />
            <span className="pd-mascot"><Mascot size={70} /></span>
            <span className="avail gone-tag">Gone home &#9829;</span>
            <h1>{pup.name}</h1>
            <p className="sub">{pup.breed}</p>
            <dl className="facts2">
              <div><dt>Breed</dt><dd>{pup.breed}</dd></div>
              <div><dt>Boy or girl</dt><dd>{pup.sex}</dd></div>
              <div><dt>Age</dt><dd>{pup.age}</dd></div>
              <div><dt>Where</dt><dd>{pup.where}</dd></div>
            </dl>
            <a className="btn green wide-btn" href={ask} target="_blank" rel="noreferrer">Ask about a puppy like this</a>
            <a className="btn outline wide-btn" href="#enquiry">Send an enquiry</a>
          </aside>
        </div>

        <div className="pd-incl">
          <p className="step-hand"><span className="sn">2</span><span className="hand">what comes with {pup.name}</span></p>
          <h2>Every Teddy Pup comes</h2>
          <ul>{INCLUDED.map((t) => <li key={t}><span className="tick">&#10003;</span>{t}</li>)}</ul>
        </div>

        <section className="pd-letter" id="enquiry">
          <span className="stamp-paw"><Paw /></span>
          <div className="letter-l">
            <p className="step-hand"><span className="sn">3</span><span className="hand">dear TeddyPups...</span></p>
            <h2>Looking for a<br />puppy like this?</h2>
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
          <Link to={"/gone-home/" + prev.slug} className="pn"><span className="pn-thumb"><img src={prev.image} alt="" /></span><span><small className="hand">Previous pup</small><b>{prev.name}</b></span></Link>
          <Link to={"/gone-home/" + next.slug} className="pn next"><span><small className="hand">Next pup</small><b>{next.name}</b></span><span className="pn-thumb"><img src={next.image} alt="" /></span></Link>
        </div>
      </div>
    </div>
  );
}
