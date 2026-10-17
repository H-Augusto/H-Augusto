import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { buildReadme, type RepoLangs } from "./App";
import { LanguagesSvg, type LangRow } from "./components/Languages";
import { TerminalSvg } from "./components/Terminal";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "assets");

/** Requisição tolerante a falhas: se a API cair, o build continua. */
async function gh<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "H-Augusto-profile-build",
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) {
      console.warn(`⚠️  ${url} respondeu ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn("⚠️  GitHub API indisponível:", err);
    return null;
  }
}

interface Repo {
  name: string;
  language: string | null;
  fork: boolean;
  languages_url: string;
}

async function main(): Promise<void> {
  mkdirSync(assetsDir, { recursive: true });

  // 1. Terminal — sempre funciona, não depende de rede.
  writeFileSync(
    join(assetsDir, "terminal.svg"),
    renderToStaticMarkup(<TerminalSvg />),
  );
  console.log("✅ assets/terminal.svg");

  // 2. Dados reais do GitHub → linguagem de cada projeto + card de linguagens.
  const repos = await gh<Repo[]>(
    "https://api.github.com/users/H-Augusto/repos?per_page=100&sort=updated",
  );

  const repoLangs: RepoLangs = {};
  let langSvg: string | null = null;

  if (repos) {
    for (const r of repos) repoLangs[r.name] = r.language ?? undefined;

    const own = repos.filter((r) => !r.fork && r.name !== "H-Augusto");
    const totals: Record<string, number> = {};
    let grand = 0;

    for (const r of own) {
      const langs = await gh<Record<string, number>>(r.languages_url);
      if (!langs) continue;
      for (const [name, bytes] of Object.entries(langs)) {
        totals[name] = (totals[name] ?? 0) + bytes;
        grand += bytes;
      }
    }

    if (grand > 0) {
      const rows: LangRow[] = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, bytes]) => ({ name, percent: (bytes / grand) * 100 }));
      langSvg = renderToStaticMarkup(<LanguagesSvg rows={rows} />);
      writeFileSync(join(assetsDir, "languages.svg"), langSvg);
      console.log("✅ assets/languages.svg");
    }
  }

  // Se a API falhar mas já existir um card anterior, mantemos a seção.
  const includeLanguages =
    langSvg !== null || existsSync(join(assetsDir, "languages.svg"));

  // 3. README final.
  const readme = buildReadme({ includeLanguages, repoLangs });
  writeFileSync(join(root, "README.md"), readme);
  console.log("✅ README.md");
}

main().catch((err) => {
  console.error("❌ Build falhou:", err);
  process.exit(1);
});
