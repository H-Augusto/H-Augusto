import { theme, MONO } from "../theme";

/**
 * Scanner de projetos — animação em loop (SVG + CSS/SMIL, sem JS):
 * digita "ls -la ./projects", as linhas entram deslizando, um cursor
 * azul percorre a lista (destacando o projeto atual), a linha de status
 * mostra o selecionado e uma barra de progresso varre o ciclo.
 */

const W = 800;
const H = 280;
const LOOP = 10; // segundos por ciclo

const FS = 13.5;
const CH = FS * 0.6;
const CMD = "ls -la ./projects";
const CMD_X = 36;
const CMD_END = Math.round(CMD_X + CMD.length * CH + 6 - 20);

interface Project {
  name: string;
  lang: string;
}

const projects: Project[] = [
  { name: "Sistema-Oficina", lang: "TS" },
  { name: "piHole-Cyber-Security-Learning", lang: "SH" },
  { name: "Health-Data-Registration", lang: "PHP" },
  { name: "Desafio_dev", lang: "JS" },
  { name: "Cadastro-aluno", lang: "JAVA" },
];

const ROW0 = 88; // baseline da primeira linha
const STEP = 30;
const HL_Y = ROW0 - 16; // topo do retângulo de destaque (linha 0)
const HL_H = 23;

/** janelas (%) em que cada linha está selecionada */
const win = (i: number): [number, number] => [26 + 12.8 * i, 38.8 + 12.8 * i];

const num = (n: number): string => n.toFixed(1);

/** destaque desliza de linha em linha, com fade nas pontas */
const highlightKeyframes = (): string => {
  const stops: string[] = [
    "0%,24%{opacity:0;transform:translateY(0)}",
    "26%{opacity:1;transform:translateY(0)}",
  ];
  for (let i = 1; i < projects.length; i++) {
    const b = 26 + 12.8 * i;
    stops.push(`${num(b - 1.5)}%{transform:translateY(${(i - 1) * STEP}px)}`);
    stops.push(`${num(b)}%{transform:translateY(${i * STEP}px)}`);
  }
  stops.push("88.5%{transform:translateY(120px)}");
  stops.push("90%{opacity:1;transform:translateY(120px)}");
  stops.push("93%,100%{opacity:0;transform:translateY(120px)}");
  return `@keyframes hlMove{${stops.join("")}}`;
};

/** nome do projeto fica azul durante a janela dele */
const selectionKeyframes = (i: number): string => {
  const [a, b] = win(i);
  return (
    `@keyframes sel${i}{` +
    `0%,${num(a)}%{fill:${theme.gray}}` +
    `${num(a + 0.8)}%,${num(b - 0.8)}%{fill:${theme.accent}}` +
    `${num(b)}%,100%{fill:${theme.gray}}}`
  );
};

/** nome na barra de status aparece na janela dele */
const statusKeyframes = (i: number): string => {
  const [a, b] = win(i);
  return (
    `@keyframes st${i}{` +
    `0%,${num(a + 1)}%{opacity:0}` +
    `${num(a + 3)}%,${num(b - 1)}%{opacity:1}` +
    `${num(b + 1)}%,100%{opacity:0}}`
  );
};

const css = `
  .sc-highlight{opacity:1;animation:hlMove ${LOOP}s cubic-bezier(.65,0,.35,1) infinite}
  .sc-caret{animation:caretBlink 1.1s steps(1,jump-none) infinite}
  .sc-row{animation:rowIn ${LOOP}s ease-out infinite backwards}
  .sc-prog{transform-box:fill-box;transform-origin:left center;
    animation:prog ${LOOP}s linear infinite}
  ${highlightKeyframes()}
  ${projects.map((_, i) => selectionKeyframes(i)).join("\n")}
  @keyframes rowIn{
    0%{opacity:0;transform:translateX(-8px)}
    5%{opacity:1;transform:translateX(0)}
    93%{opacity:1;transform:translateX(0)}
    98%,100%{opacity:0;transform:translateX(0)}}
  @keyframes caretBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
  @keyframes prog{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
`;

export function ProjectsScannerSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Scanner animado dos projetos do perfil"
    >
      <style>{css}</style>
      <defs>
        <filter id="sc-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="10"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
        <clipPath id="sc-clip">
          <rect x="20" y="42" width="0" height="20">
            <animate
              attributeName="width"
              values={`0;0;${CMD_END};${CMD_END};0;0`}
              keyTimes="0;0.02;0.18;0.96;0.975;1"
              dur={`${LOOP}s`}
              repeatCount="indefinite"
            />
          </rect>
        </clipPath>
        <clipPath id="sc-win">
          <rect x="0" y="0" width={W} height={H} rx="10" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width={W} height={H} rx="10" fill={theme.bg} filter="url(#sc-sh)" />

      <g clipPath="url(#sc-win)">
        <rect x="0" y="0" width={W} height={H} fill={theme.bg} />

        {/* barra de título */}
        <rect x="0" y="0" width={W} height="30" fill={theme.panel} />
        <line x1="0" y1="30" x2={W} y2="30" stroke={theme.border} strokeWidth="1" />
        <circle cx="18" cy="15" r="4.5" fill={theme.accentDeep} />
        <circle cx="36" cy="15" r="4.5" fill={theme.gray} opacity="0.3" />
        <circle cx="54" cy="15" r="4.5" fill={theme.gray} opacity="0.3" />
        <text x="74" y="19" fontFamily={MONO} fontSize="11" fill={theme.gray}>
          projects — ~/H-Augusto
        </text>
        <text x={W - 16} y="19" fontFamily={MONO} fontSize="11" fill={theme.gray} textAnchor="end" opacity="0.7">
          5 itens
        </text>

        {/* comando digitado */}
        <text x="20" y="56" fontFamily={MONO} fontSize={FS} fill={theme.accent}>
          $&#160;
        </text>
        <g clipPath="url(#sc-clip)">
          <text x={CMD_X} y="56" fontFamily={MONO} fontSize={FS} fill={theme.text}>
            {CMD}
          </text>
        </g>

        {/* linhas de projetos */}
        {projects.map((p, i) => {
          const y = ROW0 + i * STEP;
          return (
            <g
              key={p.name}
              className="sc-row"
              style={{
                animationDelay: `${(1.9 + i * 0.15).toFixed(2)}s`,
              }}
            >
              <text x="24" y={y} fontFamily={MONO} fontSize="11.5" fill={theme.gray} opacity="0.55">
                {String(i + 1).padStart(2, "0")}
              </text>
              <text
                x="56"
                y={y}
                fontFamily={MONO}
                fontSize={FS}
                fill={theme.gray}
                style={{ animation: `sel${i} ${LOOP}s steps(1,jump-none) infinite` }}
              >
                {p.name}
              </text>
              <text
                x={W - 24}
                y={y}
                fontFamily={MONO}
                fontSize="11"
                fill={theme.gray}
                textAnchor="end"
                opacity="0.8"
              >
                {p.lang}
              </text>
            </g>
          );
        })}

        {/* destaque móvel + cursor */}
        <g className="sc-highlight">
          <rect x="8" y={HL_Y} width={W - 16} height={HL_H} rx="4" fill={theme.accent} opacity="0.1" />
          <rect x="14" y={HL_Y} width="2.5" height={HL_H} fill={theme.accent} />
          <rect className="sc-caret" x="42" y={HL_Y + 5} width="6" height="14" fill={theme.accent} />
        </g>

        {/* linha de status */}
        <text x="20" y="246" fontFamily={MONO} fontSize="12.5" fill={theme.accent}>
          &#8250;
        </text>
        {projects.map((p, i) => {
          const suffixX = 36 + p.name.length * 7.8 + 14;
          return (
            <g key={`st-${p.name}`}>
              <text
                className="sc-status"
                x="36"
                y="246"
                fontFamily={MONO}
                fontSize="12.5"
                fill={theme.accent}
                opacity="0"
                style={{ animation: `st${i} ${LOOP}s steps(1,jump-none) infinite` }}
              >
                {p.name}
              </text>
              <text
                className="sc-status"
                x={suffixX}
                y="246"
                fontFamily={MONO}
                fontSize="12.5"
                fill={theme.gray}
                opacity="0"
                style={{ animation: `st${i} ${LOOP}s steps(1,jump-none) infinite` }}
              >
                — [enter] abrir
              </text>
            </g>
          );
        })}

        {/* barra de progresso do ciclo */}
        <rect x="8" y="262" width={W - 16} height="3" rx="1.5" fill={theme.border} />
        <rect className="sc-prog" x="8" y="262" width={W - 16} height="3" rx="1.5" fill={theme.accent} />
      </g>

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
