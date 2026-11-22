import { useSearchParams } from "react-router-dom";
import Mascot from "../components/Mascot.jsx";
import { RoundCard } from "../components/PuppyCard.jsx";
import { puppies, BREEDS } from "../data.js";

const WHERE = [["imported", "Imported"], ["korean", "Korean Teacup"]];
const SEX = [["boys", "Boys"], ["girls", "Girls"]];
const slug = (text) => text.toLowerCase().replace(" ", "-");

export default function Puppies() {
  // Filters are saved in the URL, e.g. /puppies?where=imported&breed=maltipoo,poodle
  const [params, setParams] = useSearchParams();
  const read = (key) => (params.get(key) ? params.get(key).split(",") : []);
  const where = read("where");
  const breed = read("breed");
  const sex = read("sex");

  function toggle(key, value) {
    const current = read(key);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    const p = new URLSearchParams(params);
    if (next.length) p.set(key, next.join(","));
    else p.delete(key);
    setParams(p);
  }

  // A puppy must match at least one chip in each group that has chips selected
  const list = puppies.filter((p) => {
    const whereOk = where.length === 0 || where.some((w) =>
      w === "local" ? p.origin === "local" : w === "imported" ? p.origin === "imported" : p.name.includes("Korean Teacup"));
    const breedOk = breed.length === 0 || breed.includes(slug(p.breed));
    const sexOk = sex.length === 0 || sex.some((s) => (s === "boys" ? p.gender.includes("boy") : p.gender.includes("girl")));
    return whereOk && breedOk && sexOk;
  });

  const anyFilter = where.length + breed.length + sex.length > 0;
  const chip = (key, selected, value, label) => (
    <button key={value} className={selected.includes(value) ? "chip on" : "chip"} onClick={() => toggle(key, value)}>{label}</button>
  );

  return (
    <div className="pups-page">
      <div className="container wide section pups-top">
        <div className="pups-title">
          <p className="hand">from Teddy's sketchbook</p>
          <h1 className="big">Available puppies</h1>
          <svg className="squiggle" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 12 C 90 4, 160 22, 250 12 S 420 2, 510 12 S 700 22, 800 11 S 940 5, 996 11" fill="none" stroke="#c0592a" strokeWidth="9" strokeLinecap="round" /></svg>
          <p className="lead">Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.</p>
        </div>
        <div className="portrait-wrap">
          <div className="portrait"><Mascot size={96} /><span className="bubble-say">hm?</span></div>
          <span className="hand cap">self-portrait</span>
        </div>
      </div>

      <div className="container wide">
        <div className="board-filter">
          <span className="tape" />
          <div className="frow"><b className="hand">where</b>
            <button className={where.length === 0 ? "chip on" : "chip"} onClick={() => { const p = new URLSearchParams(params); p.delete("where"); setParams(p); }}>Everywhere</button>
            {WHERE.map(([v, l]) => chip("where", where, v, l))}
          </div>
          <div className="frow"><b className="hand">breed</b>{BREEDS.map((b) => chip("breed", breed, slug(b), b))}</div>
          <div className="frow"><b className="hand">boy or girl</b>{SEX.map(([v, l]) => chip("sex", sex, v, l))}</div>
          {anyFilter && <button className="clear" onClick={() => setParams({})}>Clear filters</button>}
        </div>

        <p className="count hand">{list.length} {list.length === 1 ? "puppy match" : "puppies match"}{list.length === puppies.length ? " looking for a home" : ""}</p>
        {list.length === 0 ? (
          <p className="empty">No puppies match these filters. Clear a filter, or message us on WhatsApp.</p>
        ) : (
          <div className="rounds">{list.map((p, i) => <RoundCard key={p.slug} puppy={p} index={i} />)}</div>
        )}
      </div>
    </div>
  );
}
