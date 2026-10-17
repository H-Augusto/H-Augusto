import { theme, MONO } from "../theme";

/**
 * Terminal "./stack --list" — spec:
 * viewBox 0 0 800 220, sem JS, só SVG + CSS @keyframes / SMIL.
 * Digita o comando (clipPath width), cursor pisca (opacity keyframes),
 * 4 barras crescem escalonadas (animation-delay) e seguram 3s em loop.
 */

const W = 800;
const H = 220;
const LOOP = 8; // segundos por ciclo

const CMD = "./stack --list";
const CMD_X = 36;
const FS = 13.5;
const CH = FS * 0.6; // avanço monoespaçado ≈ 8.1
const CMD_END = Math.round((CMD_X + CMD.length * CH + 6 - 20) * 10) / 10; // clip: x=20 → fim do texto +6

interface Bar {
  label: string;
  pct: number;
  delay: number;
}

const bars: Bar[] = [
  { label: "PHP", pct: 55, delay: 1.7 },
  { label: "SQL", pct: 70, delay: 2.15 },
  { label: "MySQL", pct: 95, delay: 2.6 },
  { label: "Git", pct: 80, delay: 3.05 },
];

const TRACK_X = 96;
const TRACK_W = 684;
const ROW_Y = [82, 116, 150, 184];
const BAR_H = 15;

/** keyframes do cursor: some após a digitação e pisca até o fim do ciclo */
const cursorKeyframes = (): string => {
  const stops: string[] = ["0%,17.9%{opacity:0}"];
  for (let p = 18; p < 94; p += 5) {
    stops.push(`${p}%{opacity:1}`);
    stops.push(`${Math.min(p + 2.5, 94)}%{opacity:0}`);
  }
  stops.push("94%,100%{opacity:0}");
  return `@keyframes cursorBlink{${stops.join("")}}`;
};

const css = `
  .cmd-cursor{opacity:1;animation:cursorBlink ${LOOP}s steps(1,jump-none) infinite}
  .bar-fill{transform-box:fill-box;transform-origin:left center;
    animation:barGrow ${LOOP}s cubic-bezier(.22,1,.36,1) infinite backwards}
  .bar-ghost{animation:rowIn ${LOOP}s ease-out infinite backwards}
  @keyframes barGrow{
    0%{transform:scaleX(0)}6%{transform:scaleX(1)}
    90%{transform:scaleX(1)}94%{transform:scaleX(0)}100%{transform:scaleX(0)}}
  @keyframes rowIn{
    0%{opacity:0}8%{opacity:1}90%{opacity:1}94%{opacity:0}100%{opacity:0}}
  ${cursorKeyframes()}
`;

export function StackTerminalSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Terminal ./stack --list com barras das tecnologias"
    >
      <style>{css}</style>
      <defs>
        <filter id="st-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="10"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
        <clipPath id="st-clip">
          <rect x="20" y="42" width="0" height="20">
            {/* digitação em loop: aparece, segura, limpa */}
            <animate
              attributeName="width"
              values={`0;0;${CMD_END};${CMD_END};0;0`}
              keyTimes="0;0.02;0.18;0.96;0.975;1"
              dur={`${LOOP}s`}
              repeatCount="indefinite"
            />
          </rect>
        </clipPath>
        <clipPath id="st-win">
          <rect x="0" y="0" width={W} height={H} rx="10" />
        </clipPath>
      </defs>

      {/* sombra da janela */}
      <rect x="0" y="0" width={W} height={H} rx="10" fill={theme.bg} filter="url(#st-sh)" />

      <g clipPath="url(#st-win)">
        <rect x="0" y="0" width={W} height={H} fill={theme.bg} />

        {/* barra de título */}
        <rect x="0" y="0" width={W} height="30" fill={theme.panel} />
        <line x1="0" y1="30" x2={W} y2="30" stroke={theme.border} strokeWidth="1" />
        <circle cx="18" cy="15" r="4.5" fill={theme.accentDeep} />
        <circle cx="36" cy="15" r="4.5" fill={theme.gray} opacity="0.3" />
        <circle cx="54" cy="15" r="4.5" fill={theme.gray} opacity="0.3" />
        <text x="74" y="19" fontFamily={MONO} fontSize="11" fill={theme.gray}>
          root@heitor:~#
        </text>

        {/* linha de comando: prompt fixo + comando digitado */}
        <text x="20" y="56" fontFamily={MONO} fontSize={FS} fill={theme.accent}>
          $&#160;
        </text>
        <g clipPath="url(#st-clip)">
          <text x={CMD_X} y="56" fontFamily={MONO} fontSize={FS} fill={theme.text}>
            {CMD}
          </text>
        </g>
        {/* cursor piscando logo após o comando */}
        <rect
          className="cmd-cursor"
          x={CMD_X + CMD.length * CH}
          y="44"
          width="7"
          height="15"
          fill={theme.accent}
        />

        {/* barras */}
        {bars.map((b, i) => {
          const y = ROW_Y[i];
          const delay = `${b.delay}s`;
          const fillW = Math.round((TRACK_W * b.pct) / 100);
          return (
            <g key={b.label}>
              <g className="bar-ghost" style={{ animationDelay: delay }}>
                <text
                  x="20"
                  y={y + 11.5}
                  fontFamily={MONO}
                  fontSize="12.5"
                  fill={theme.text}
                >
                  {b.label}
                </text>
                <rect
                  x={TRACK_X}
                  y={y}
                  width={TRACK_W}
                  height={BAR_H}
                  rx={BAR_H / 2}
                  fill={theme.border}
                />
              </g>
              <rect
                className="bar-fill"
                style={{ animationDelay: delay }}
                x={TRACK_X}
                y={y}
                width={fillW}
                height={BAR_H}
                rx={BAR_H / 2}
                fill={theme.accent}
              />
            </g>
          );
        })}
      </g>

      {/* borda da janela */}
      <rect
        x="0.5"
        y="0.5"
        width={W - 1}
        height={H - 1}
        rx="10"
        fill="none"
        stroke="#30363d"
      />
    </svg>
  );
}
