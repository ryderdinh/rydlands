const DEFAULT_SPEED = 26;

export default function Marquee({
  items,
  speed = DEFAULT_SPEED,
}: {
  items: string[];
  speed?: number;
}) {
  const content = [...items, ...items];

  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {content.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <span className="marquee-dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
