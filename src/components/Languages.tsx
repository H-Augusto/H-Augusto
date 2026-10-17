import { theme, MONO } from "../theme";

/**
 * Card "Mais usadas" — linguagens reais do GitHub, na paleta cinza + verde escuro.
 * Gerado em React; as barras crescem com animação SMIL.
 */

export interface LangRow {
  name: string;
  percent: number;
}

const W = 440;
const PAD = 16;
const ROW_H = 30;
const TOP = 44;

export function LanguagesSvg({ rows }: { rows: LangRow[] }) {
  const H = TOP + rows.length * ROW_H + 14;
  const trackW = W - PAD * 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Linguagens mais usadas"
    >
      <defs>
        <filter id="sh2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="10"
            floodColor="#000000"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      <rect
        x="0"
        y="0"
        width={W}
        height={H}
        rx="6"
        fill={theme.bg}
        filter="url(#sh2)"
      />
      <rect
        x="0.5"
        y="0.5"
        width={W - 1}
        height={H - 1}
        rx="6"
        fill="none"
        stroke={theme.border}
      />

      <text
        x={PAD}
        y="28"
        fontFamily={MONO}
        fontSize="14"
        fontWeight="600"
        fill={theme.green}
      >
        Mais usadas
      </text>

      {rows.map((r, i) => {
        const top = TOP + i * ROW_H;
        const barW = Math.max(4, (trackW * r.percent) / 100);
        return (
          <g key={r.name}>
            <text
              x={PAD}
              y={top + 11}
              fontFamily={MONO}
              fontSize="12"
              fill={theme.gray}
            >
              {r.name}
            </text>
            <text
              x={W - PAD}
              y={top + 11}
              fontFamily={MONO}
              fontSize="12"
              fill={theme.grayLight}
              textAnchor="end"
            >
              {r.percent.toFixed(1)}%
            </text>
            <rect
              x={PAD}
              y={top + 18}
              width={trackW}
              height="6"
              rx="3"
              fill={theme.border}
            />
            <rect
              x={PAD}
              y={top + 18}
              width="0"
              height="6"
              rx="3"
              fill={theme.green}
            >
              <animate
                attributeName="width"
                from="0"
                to={String(Math.round(barW))}
                dur="0.7s"
                begin={`${0.3 + i * 0.12}s`}
                fill="freeze"
              />
            </rect>
          </g>
        );
      })}
    </svg>
  );
}
