import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * Renderiza um bloco JSX como HTML estático (GitHub sanitiza e exibe).
 * O React 19 injeta <link rel="preload"> antes de cada <img>; removemos
 * porque o GitHub não precisa (e não permite) essas tags no README.
 */
const html = (node: ReactNode): string =>
  renderToStaticMarkup(node).replace(/<link rel="preload"[^>]*\/>/g, "");

export type RepoLangs = Record<string, string | undefined>;

/* ------------------------------------------------------------------ */
/* URLs e helpers                                                      */
/* ------------------------------------------------------------------ */

const STATS =
  "https://github-readme-stats.vercel.app/api?username=H-Augusto" +
  "&show_icons=true&count_private=true&hide=stars,issues,prs&hide_rank=true" +
  "&theme=dark" +
  "&bg_color=0d1117&text_color=8b949e&number_color=8b949e" +
  "&title_color=2ea043&icon_color=2ea043&border_color=21262d";

type BadgeTone = "gray" | "green";

/** Badge no estilo for-the-badge, sempre cinza ou verde escuro. */
const badge = (label: string, tone: BadgeTone, logo?: string): string => {
  const color = tone === "gray" ? "30363d" : "238636";
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
}) => (
  <img src={badge(label, tone, logo)} alt={label} />
);

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
  fallbackLang: string;
}

const projects: Project[] = [
  {
    name: "Sistema-Oficina",
    desc: "API REST com Node.js + TypeScript — arquitetura em camadas, Zod, bcrypt e MySQL",
    fallbackLang: "TypeScript",
  },
  {
    name: "piHole-Cyber-Security-Learning",
    desc: "Laboratório de estudo em redes e cibersegurança com Pi-hole",
    fallbackLang: "Shell",
  },
  {
    name: "Health-Data-Registration",
    desc: "Registro de dados de saúde em PHP — PDO, prepared statements e transações",
    fallbackLang: "PHP",
  },
  {
    name: "Desafio_dev",
    desc: "Desafio técnico para vaga — lógica de programação",
    fallbackLang: "JavaScript",
  },
  {
    name: "Cadastro-aluno",
    desc: "Orientação a objetos em Java — cadastro, médias e aprovação",
    fallbackLang: "Java",
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
    <img
      src="assets/languages.svg"
      alt="Linguagens mais usadas"
      width="440"
    />
  </div>
);

const Stack = () => (
  <div align="center">
    <Badge label="Node.js" tone="gray" logo="nodedotjs" />
    {" "}
    <Badge label="JavaScript" tone="gray" logo="javascript" />
    {" "}
    <Badge label="TypeScript" tone="gray" logo="typescript" />
    {" "}
    <Badge label="Java" tone="gray" logo="openjdk" />
    {" "}
    <Badge label="SQL" tone="gray" logo="mysql" />
    {" "}
    <Badge label="PHP" tone="gray" logo="php" />
    <br />
    <Badge label="HTML5" tone="gray" logo="html5" />
    {" "}
    <Badge label="CSS3" tone="gray" logo="css3" />
    {" "}
    <Badge label="Git" tone="gray" logo="git" />
    {" "}
    <Badge label="GitHub" tone="gray" logo="github" />
    <br />
    <Badge label="Linux" tone="green" logo="linux" />
    {" "}
    <Badge label="Redes" tone="green" logo="cisco" />
    {" "}
    <Badge label="Cibersegurança" tone="green" />
  </div>
);

const Projects = ({ repoLangs }: { repoLangs: RepoLangs }) => (
  <table>
    <thead>
      <tr>
        <th>Projeto</th>
        <th>Descrição</th>
        <th>Linguagem</th>
      </tr>
    </thead>
    <tbody>
      {projects.map((p) => (
        <tr key={p.name}>
          <td>
            <a href={`https://github.com/H-Augusto/${p.name}`}>{p.name}</a>
          </td>
          <td>{p.desc}</td>
          <td>
            <code>{repoLangs[p.name] ?? p.fallbackLang}</code>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
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

export function buildReadme(opts: {
  includeLanguages: boolean;
  repoLangs: RepoLangs;
}): string {
  const parts: string[] = [
    "# Heitor-Augusto",
    html(<Header />),
    html(<Terminal />),
    "## 📊 Estatísticas",
    html(<Stats />),
  ];

  if (opts.includeLanguages) {
    parts.push("## 🧠 Linguagens");
    parts.push(html(<LanguagesCard />));
  }

  parts.push("## 🛠️ Stack");
  parts.push(html(<Stack />));
  parts.push("## 📁 Projetos");
  parts.push(html(<Projects repoLangs={opts.repoLangs} />));
  parts.push("## 📫 Contato");
  parts.push(html(<Footer />));
  parts.push(
    "<!-- README gerado por src/ (React + TypeScript) — rode `npm run build` para atualizar -->"
  );

  return parts.join("\n\n") + "\n";
}
