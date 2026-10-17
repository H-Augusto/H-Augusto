import { theme, MONO } from "../theme";

/**
 * Terminal animado do perfil — gerado em React (SVG + SMIL).
 * A animação digita as linhas em sequência e termina com cursor piscando.
 * Cores: apenas cinza + verde escuro (theme).
 */

const W = 620;
const H = 202;
const PAD = 20;
const FS = 13;

/** largura média de caractere monoespaçado em 13px */
const CH = 7.8;

type Part = { text: string; color: string };

interface Line {
  y: number;
  parts: Part[];
  /** x final do texto (fim da revelação) */
  end: number;
  /** início da animação (s) */
  begin: number;
  /** duração da digitação (s) */
  dur: number;
}

const lines: Line[] = [
  {
    y: 60,
    parts: [
      { text: "$ ", color: theme.green },
      { text: "whoami", color: theme.grayLight },
    ],
    end: 84,
    begin: 0.4,
    dur: 0.45,
  },
  {
    y: 84,
    parts: [
      {
        text: "heitor-augusto — desenvolvimento de sistemas",
        color: theme.gray,
      },
    ],
    end: 366,
    begin: 1.05,
    dur: 0.95,
  },
  {
    y: 108,
    parts: [
      { text: "$ ", color: theme.green },
      { text: "cat foco.txt", color: theme.grayLight },
    ],
    end: 132,
    begin: 2.3,
    dur: 0.75,
  },
  {
    y: 132,
    parts: [
      {
        text: "infraestrutura · redes · cibersegurança · linux",
        color: theme.gray,
      },
    ],
    end: 400,
    begin: 3.3,
    dur: 1.05,
  },
  {
    y: 156,
    parts: [
      { text: "$ ", color: theme.green },
      { text: "stack && status", color: theme.grayLight },
    ],
    end: 156,
    begin: 4.6,
    dur: 0.9,
  },
  {
    y: 180,
    parts: [
      { text: "node  ts  java  php  mysql  |  ", color: theme.gray },
      { text: "online", color: theme.green },
    ],
    end: 330,
    begin: 5.7,
    dur: 0.85,
  },
];

export function TerminalSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Terminal com informações do perfil"
    >
      <defs>
        <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="10"
            floodColor="#000000"
            floodOpacity="0.45"
          />
        </filter>
        <clipPath id="win">
          <rect x="0" y="0" width={W} height={H} rx="10" />
        </clipPath>

        {/* Máscaras: cada linha é "digitada" da esquerda para a direita */}
        {lines.map((l, i) => (
          <mask
            key={i}
            id={`k${i}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y={l.y - 14}
            width={W}
            height="21"
          >
            <rect x="0" y={l.y - 14} width="0" height="21" fill="#ffffff">
              <animate
                attributeName="width"
                from="0"
                to={String(l.end)}
                dur={`${l.dur}s`}
                begin={`${l.begin}s`}
                fill="freeze"
              />
            </rect>
          </mask>
        ))}
      </defs>

      {/* sombra da janela */}
      <rect
        x="0"
        y="0"
        width={W}
        height={H}
        rx="10"
        fill={theme.bg}
        filter="url(#sh)"
      />

      <g clipPath="url(#win)">
        {/* corpo */}
        <rect x="0" y="0" width={W} height={H} fill={theme.bg} />

        {/* barra de título */}
        <rect x="0" y="0" width={W} height="34" fill={theme.panel} />
        <line
          x1="0"
          y1="34"
          x2={W}
          y2="34"
          stroke={theme.border}
          strokeWidth="1"
        />
        <circle cx="18" cy="17" r="5" fill={theme.greenDark} />
        <circle cx="36" cy="17" r="5" fill={theme.gray} opacity="0.3" />
        <circle cx="54" cy="17" r="5" fill={theme.gray} opacity="0.3" />
        <text
          x="76"
          y="21"
          fontFamily={MONO}
          fontSize="11"
          fill={theme.gray}
        >
          h-augusto@localhost — ~/profile
        </text>

        {/* linhas com animação de digitação */}
        {lines.map((l, i) => (
          <g key={i} mask={`url(#k${i})`}>
            <text x={PAD} y={l.y} fontFamily={MONO} fontSize={FS}>
              {l.parts.map((p, j) => (
                <tspan key={j} fill={p.color}>
                  {p.text}
                </tspan>
              ))}
              {i === lines.length - 1 && (
                <tspan fill={theme.green} opacity="0">
                  ▌
                  <animate
                    attributeName="opacity"
                    values="1;0;1"
                    dur="1.1s"
                    begin="6.6s"
                    repeatCount="indefinite"
                  />
                </tspan>
              )}
            </text>
          </g>
        ))}
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
