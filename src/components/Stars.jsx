// Little stars that twinkle and drift slowly (used in Questions and the footer)
const STARS = Array.from({ length: 30 }, (_, i) => ({ l: (i * 37 + 11) % 100, t: (i * 53 + 7) % 100, d: (i * 0.43) % 5, z: 2 + (i % 3) }));
export default function Stars() {
  return <div className="stars" aria-hidden="true">{STARS.map((s, i) => <i key={i} style={{ left: s.l + "%", top: s.t + "%", width: s.z, height: s.z, animationDelay: -s.d + "s" }} />)}</div>;
}
