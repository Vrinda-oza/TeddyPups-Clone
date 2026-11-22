// A simple cartoon puppy drawn with SVG shapes (our own mascot)
export default function Mascot({ size = 90, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Teddy the puppy">
      <ellipse cx="50" cy="82" rx="26" ry="14" fill="#f2b54a" stroke="#2a1509" strokeWidth="3" />
      <circle cx="30" cy="40" r="14" fill="#d98a2b" stroke="#2a1509" strokeWidth="3" />
      <circle cx="70" cy="40" r="14" fill="#d98a2b" stroke="#2a1509" strokeWidth="3" />
      <circle cx="50" cy="45" r="25" fill="#f7c76a" stroke="#2a1509" strokeWidth="3" />
      <circle cx="41" cy="44" r="3" fill="#2a1509" />
      <circle cx="59" cy="44" r="3" fill="#2a1509" />
      <ellipse cx="50" cy="53" rx="5" ry="3.5" fill="#2a1509" />
      <path d="M44 59 Q50 64 56 59" fill="none" stroke="#2a1509" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Same puppy, but with feet and a tail that animate: walks while `walking`, rests otherwise.
// `dir` is 1 when walking right and -1 when walking left.
export function WalkingMascot({ size = 96, walking = false, dir = 1 }) {
  const ink = "#2a1509";
  return (
    <svg className={"dog " + (walking ? "walk" : "idle")} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Teddy the puppy" style={{ overflow: "visible", transform: "scaleX(" + dir + ")" }}>
      <g className="dog-tail"><path d="M74 80 Q94 76 89 58" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" /><path d="M74 80 Q94 76 89 58" fill="none" stroke="#d98a2b" strokeWidth="4" strokeLinecap="round" /></g>
      <ellipse className="foot foot-l" cx="38" cy="96" rx="10" ry="5.5" fill="#f2b54a" stroke={ink} strokeWidth="3" />
      <ellipse className="foot foot-r" cx="62" cy="96" rx="10" ry="5.5" fill="#f2b54a" stroke={ink} strokeWidth="3" />
      <g className="dog-body">
        <ellipse cx="50" cy="82" rx="26" ry="14" fill="#f2b54a" stroke={ink} strokeWidth="3" />
        <circle cx="30" cy="40" r="14" fill="#d98a2b" stroke={ink} strokeWidth="3" />
        <circle cx="70" cy="40" r="14" fill="#d98a2b" stroke={ink} strokeWidth="3" />
        <circle cx="50" cy="45" r="25" fill="#f7c76a" stroke={ink} strokeWidth="3" />
        <circle cx="41" cy="44" r="3" fill={ink} /><circle cx="59" cy="44" r="3" fill={ink} />
        <ellipse cx="50" cy="53" rx="5" ry="3.5" fill={ink} />
        <path d="M44 59 Q50 64 56 59" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
