type CharacterSpriteProps = {
  talking?: boolean;
  className?: string;
};

export function CharacterSprite({ talking, className = "" }: CharacterSpriteProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={`${className} ${talking ? "anim-bounce-soft" : ""}`}
      role="img"
      aria-label="Captain Echo placeholder sprite"
    >
      <circle cx="60" cy="35" r="20" fill="#ffe7c2" />
      <rect x="35" y="60" width="50" height="58" rx="12" fill="#1e40af" />
      <rect x="20" y="70" width="18" height="10" rx="5" fill="#1e40af" />
      <rect x="82" y="70" width="18" height="10" rx="5" fill="#1e40af" />
      <rect x="45" y="118" width="10" height="18" rx="4" fill="#334155" />
      <rect x="65" y="118" width="10" height="18" rx="4" fill="#334155" />
      <path d="M35 25 L60 8 L85 25" stroke="#111827" strokeWidth="6" fill="none" />
      <circle cx="53" cy="33" r="2.5" fill="#0f172a" />
      <circle cx="67" cy="33" r="2.5" fill="#0f172a" />
      <path d="M53 43 Q60 48 67 43" stroke="#0f172a" strokeWidth="2" fill="none" />
    </svg>
  );
}
