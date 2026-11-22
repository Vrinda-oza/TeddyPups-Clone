import { useState } from "react";
import { photoTint } from "../tint.js";
import { useReveal } from "../reveal.js";
import { Link } from "react-router-dom";

export default function PuppyCard({ puppy }) {
  return (
    <Link to={"/puppies/" + puppy.slug} className="card">
      <div className="card-img">
        <img src={puppy.image} alt={puppy.gender + " " + puppy.breed + " puppy"} loading="lazy" />
        <span className="badge">Available</span>
      </div>
      <div className="card-body">
        <h3>{puppy.name}</h3>
        <p>{puppy.breed}, {puppy.gender}, {puppy.age}{puppy.video ? ", with video" : ""}</p>
      </div>
    </Link>
  );
}

// Puppy behind an arched door. `o` is how far the door is open (0 closed, 1 wide open):
// the home page sets it from where the dog is, and hovering a door opens it too.
export function DoorCard({ puppy, o = 0 }) {
  return (
    <Link to={"/puppies/" + puppy.slug} className="door-card" style={{ "--o": o }}>
      <h3>{puppy.name}<svg className="h-paw" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg></h3>
      <p>{puppy.breed}, {puppy.gender}, {puppy.age}{puppy.video ? ", with video" : ""}</p>
      <div className="arch-wrap">
        <div className="arch">
          <img src={puppy.image} alt={puppy.gender + " " + puppy.breed + " puppy"} loading="lazy" />
          <div className="door">
            <i className="door-inner" />
            <svg className="door-paw" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5" /><ellipse cx="5" cy="10" rx="2.4" ry="3" /><ellipse cx="9.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="14.5" cy="5.5" rx="2.4" ry="3" /><ellipse cx="19" cy="10" rx="2.4" ry="3" /></svg>
          </div>
        </div>
        <span className="pill">Available</span>
      </div>
    </Link>
  );
}

// Round photo card used on the Puppies page
export function RoundCard({ puppy, index = 0 }) {
  const [rref, seen] = useReveal();
  // touching or hovering a puppy tints its circle with the colours of its photo
  const [hc, setHc] = useState(null);
  const warm = () => { if (!hc) photoTint(puppy.image).then((c) => setHc(c)); };
  return (
    <Link ref={rref} to={"/puppies/" + puppy.slug} className={seen ? "round-card rv in" : "round-card rv"} onMouseEnter={warm} onFocus={warm} onTouchStart={warm} style={{ "--d": index % 4, ...(hc ? { "--hc": hc } : null) }}>
      <div className="round">
        <span className="blob" />
        <span className="ring" />
        <img src={puppy.image} alt={puppy.gender + " " + puppy.breed + " puppy"} loading="lazy" />
        {puppy.video && <span className="vid">&#9654; video</span>}
        <span className="pill">Available</span>
        <i className="doodle d1" /><i className="doodle d2" />
      </div>
      <h3>{puppy.name}</h3>
      <p>{puppy.gender} · {puppy.age}</p>
    </Link>
  );
}

export function Faqs({ items }) {
  // <details> gives us an open / close accordion without any JavaScript
  return (
    <div className="faqs">
      {items.map(([q, a]) => (
        <details key={q}><summary>{q}</summary><p>{a}</p></details>
      ))}
    </div>
  );
}
