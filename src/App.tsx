import { Fragment } from "react";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * Renderiza um bloco JSX como HTML estático (GitHub sanitiza e exibe).
 * O React 19 injeta <link rel="preload"> antes de cada <img>; removemos
 * porque o GitHub não precisa (e não permite) essas tags no README.
 */
const html = (node: ReactNode): string =>
  renderToStaticMarkup(node).replace(/<link rel="preload"[^>]*\/>/g, "");

/* ------------------------------------------------------------------ */
/* URLs e helpers                                                      */
/* ------------------------------------------------------------------ */

const STATS =
  "https://github-readme-stats.vercel.app/api?username=H-Augusto" +
  "&show_icons=true&count_private=true&hide=stars,issues,prs&hide_rank=true" +
  "&theme=dark" +
  "&bg_color=0d1117&text_color=8b949e&number_color=c9d1d9" +
  "&title_color=58a6ff&icon_color=58a6ff&border_color=21262d";

type BadgeTone = "gray" | "accent";

/** Badge no estilo for-the-badge — cinza ou azul (tom principal: preto). */
const badge = (label: string, tone: BadgeTone, logo?: string): string => {
  const color = tone === "gray" ? "30363d" : "1f6feb";
  const params = new URLSearchParams({
    style: "for-the-badge",
    labelColor: "161b22",
    color,
  });
  if (logo) {
    params.set("logo", logo);
    params.set("logoColor", "c9d1d9");
  }
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?${params}`;
};

const Badge = ({ label, tone, logo }: {
  label: string;
  tone: BadgeTone;
  logo?: string;
}) => <img src={badge(label, tone, logo)} alt={label} />;

/* ------------------------------------------------------------------ */
/* Dados reais (currículo + projetos do GitHub)                        */
/* ------------------------------------------------------------------ */

const STACK: Array<[string, string | undefined]> = [
  ["Node.js", "nodedotjs"],
  ["JavaScript", "javascript"],
  ["TypeScript", "typescript"],
  ["Java", "openjdk"],
  ["SQL", "mysql"],
  ["PHP", "php"],
  ["HTML5", "html5"],
  ["CSS3", "css3"],
  ["Git", "git"],
  ["GitHub", "github"],
];

const FOCUS: Array<[string, string | undefined]> = [
  ["Linux", "linux"],
  ["Redes", "cisco"],
  ["Cibersegurança", undefined],
];

interface Project {
  name: string;
  desc: string;
}

const projects: Project[] = [
  {
    name: "Sistema-Oficina",
    desc: "API REST com Node.js + TypeScript — arquitetura em camadas, Zod, bcrypt e MySQL",
  },
  {
    name: "piHole-Cyber-Security-Learning",
    desc: "Laboratório de estudo em redes e cibersegurança com Pi-hole",
  },
  {
    name: "Health-Data-Registration",
    desc: "Registro de dados de saúde em PHP — PDO, prepared statements e transações",
  },
  {
    name: "Desafio_dev",
    desc: "Desafio técnico para vaga — lógica de programação",
  },
  {
    name: "Cadastro-aluno",
    desc: "Orientação a objetos em Java — cadastro, médias e aprovação",
  },
];

/* ------------------------------------------------------------------ */
/* Blocos HTML (React)                                                 */
/* ------------------------------------------------------------------ */

const Header = () => (
  <p align="center">
    <strong>Estudante de Desenvolvimento de Sistemas</strong>
    <br />
    Infraestrutura · Redes · Cibersegurança · Linux
  </p>
);

const Terminal = () => (
  <div align="center">
    <img src="assets/terminal.svg" alt="terminal" width="620" />
  </div>
);

const Stats = () => (
  <div align="center">
    <img src={STATS} alt="GitHub Stats" height="165" />
  </div>
);

const LanguagesCard = () => (
  <div align="center">
    <img src="assets/languages.svg" alt="Linguagens mais usadas" width="440" />
  </div>
);

const StackTerminal = () => (
  <div align="center">
    <img src="assets/stack.svg" alt="./stack --list" width="680" />
  </div>
);

const Stack = () => (
  <div align="center">
    {STACK.map(([label, logo], i) => (
      <Fragment key={label}>
        {i === 6 && <br />}
        {i > 0 && i !== 6 && " "}
        <Badge label={label} tone="gray" logo={logo} />
      </Fragment>
    ))}
    <br />
    {FOCUS.map(([label, logo], i) => (
      <Fragment key={label}>
        {i > 0 && " "}
        <Badge label={label} tone="accent" logo={logo} />
      </Fragment>
    ))}
  </div>
);

const ProjectsScanner = () => (
  <div align="center">
    <img src="assets/projects.svg" alt="Scanner dos projetos" width="700" />
  </div>
);

/** Chips clicáveis no estilo "./comando" — com tooltip ao passar o mouse. */
const ProjectChips = () => (
  <p align="center">
    {projects.map((p, i) => (
      <Fragment key={p.name}>
        {i > 0 && (i === 3 ? <br /> : " ")}
        <a href={`https://github.com/H-Augusto/${p.name}`} title={p.desc}>
          <code>./{p.name}</code>
        </a>
      </Fragment>
    ))}
  </p>
);

const Footer = () => (
  <>
    <p align="center">
      <a href="mailto:heitorrpaulista@gmail.com">📧 Email</a>
      {" · "}
      <a href="https://www.linkedin.com/in/heitor-augusto-roque-paulista-465349359">
        💼 LinkedIn
      </a>
      {" · "}
      <a href="https://github.com/H-Augusto">🐙 GitHub</a>
    </p>
    <p align="center">
      <sub>
        Itajaí – SC · Português nativo · Inglês intermediário avançado ·
        Buscando estágio em TI
      </sub>
    </p>
  </>
);

/* ------------------------------------------------------------------ */
/* Composição do README                                                */
/* ------------------------------------------------------------------ */

export function buildReadme(opts: { includeLanguages: boolean }): string {
  const parts: string[] = [
    "# Heitor-Augusto",
    html(<Header />),
    html(<Terminal />),
    "## Estatísticas",
    html(<Stats />),
  ];

  if (opts.includeLanguages) {
    parts.push("## Linguagens");
    parts.push(html(<LanguagesCard />));
  }

  parts.push("## Stack");
  parts.push(html(<StackTerminal />));
  parts.push(html(<Stack />));
  parts.push("## Projetos");
  parts.push(html(<ProjectsScanner />));
  parts.push(html(<ProjectChips />));
  parts.push("## Contato");
  parts.push(html(<Footer />));
  parts.push(
    "<!-- README gerado por src/ (React + TypeScript) — rode `npm run build` para atualizar -->"
  );

  return parts.join("\n\n") + "\n";
}
