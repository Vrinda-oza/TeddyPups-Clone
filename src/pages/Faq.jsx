import { useState } from "react";
import { WalkingMascot } from "../components/Mascot.jsx";
import { useReveal } from "../reveal.js";
import { whatsappFor } from "../data.js";

// The nine notes pinned on the cork board: [question, answer]
const NOTES = [
  ["Are your puppies vaccinated and health-checked?", "Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family."],
  ["Can I meet a puppy before I decide?", "Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision."],
  ["Can I take my puppy home the same day?", "Local puppies are available immediately, so you can take your puppy home the same day."],
  ["Do you import puppies from abroad?", "Yes. We import puppies from trusted breeders in Korea and other countries. Our reservation-only model means every puppy is sourced to match your preferences."],
  ["How does an imported puppy travel to Dubai?", "We manage health checks, travel arrangements, and documentation. Your puppy travels carefully with our trusted cargo partners and arrives ready to join your family."],
  ["Will I see photos and health details first?", "Yes. Our team shares real photos, health details, and all necessary information directly on WhatsApp before you decide."],
  ["Do you deliver?", "Yes. We deliver within Dubai, and our trusted international cargo partners deliver puppies safely to loving homes all around the world."],
  ["Which breeds do you usually have?", "Mostly Maltipoo, Pomeranian, Poodle, Cavapoo, and Shih Tzu, including rare Korean teacup puppies. Availability changes, so check the Puppies page or ask us on WhatsApp."],
  ["Is there help after my puppy comes home?", "Yes. We help your new puppy settle in and stay available 24/7 on WhatsApp for any questions, so the transition into your home is smooth."],
];
const PINS = ["#c0392b", "#3a6ea5", "#e0a030", "#c75a7a"]; // red, blue, yellow, pink pins

// One note: it drops onto the board (and wobbles) when it scrolls into view
function NoteCard({ q, a, i, pos, isOpen, onToggle }) {
  const [ref, seen] = useReveal(0.12);
  return (
    <article ref={ref} className={"note" + (seen ? " in" : "") + (isOpen ? " open" : "")} style={{ "--r": pos % 2 ? 1.1 : -1.3, "--x": pos % 2 ? 4 : -2, "--d": (pos % 3) * 80 + "ms" }}>
      <span className="pin" style={{ background: PINS[i % 4] }} />
      <button type="button" className="note-q" aria-expanded={isOpen} onClick={onToggle}>
        <h3>{q}</h3>
        <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div className="note-a"><div><p>{a}</p></div></div>
      <i className="fold" />
    </article>
  );
}

export default function Faq() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null); // number of the note that is open
  const [hover, setHover] = useState(false); // the dog says "hoo?" while the mouse is on it

  // keep the number of each note so its pin colour does not change while searching
  const text = query.trim().toLowerCase();
  const shown = NOTES.map((n, i) => [n, i]).filter(([n]) => text === "" || (n[0] + " " + n[1]).toLowerCase().includes(text));
  const bubble = hover ? "hoo?" : open !== null ? "!" : "?";

  return (
    <div className="faq-page">
      <div className="container wide faq-inner">
        <h1 className="faq-h1">Questions<br /><span className="amp">&</span> answers</h1>
        <p className="faq-sub">Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7.</p>

        <div className="faq-grid">
          <aside className="faq-side">
            <p className="faq-hand">sniff out a question</p>
            <label className="faq-search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
              <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(null); }} placeholder="delivery, Korea, vaccinated…" aria-label="Search the questions" />
            </label>
            <p className="faq-count">{shown.length} {shown.length === 1 ? "note" : "notes"} on the board</p>
            <div className="faq-dog" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <WalkingMascot size={130} walking={false} />
              <span className="faq-bubble" key={bubble}>{bubble}</span>
            </div>
            <a className="btn green" href={whatsappFor("Hi TeddyPups! I have a question.")} target="_blank" rel="noreferrer">Ask your own question</a>
          </aside>

          <div className="corkboard">
            {shown.length === 0 && (
              <div className="note in empty-note" style={{ "--r": -1, "--x": 0, "--d": "0ms" }}>
                <p>No notes match “{query}”. Ask us on WhatsApp and we'll answer within minutes.</p>
              </div>
            )}
            {shown.map(([[q, a], i], pos) => {
              const isOpen = open === i;
              return <NoteCard key={q} q={q} a={a} i={i} pos={pos} isOpen={isOpen} onToggle={() => setOpen(isOpen ? null : i)} />;
            })}
          </div>
        </div>
      </div>
      <svg className="hw-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C 220 118 470 70 720 84 C 980 98 1210 34 1440 52 L1440 140 L0 140 Z" fill="#24130b" /></svg>
    </div>
  );
}
