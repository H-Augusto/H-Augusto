/**
 * Paleta do perfil — tom principal: preto.
 * Fundo #0d1117, texto #c9d1d9, único acento #58a6ff (azul).
 */
export const theme = {
  /** Preto — fundo principal */
  bg: "#0d1117",
  /** Painel / barra de título */
  panel: "#161b22",
  /** Borda e trilhas */
  border: "#21262d",
  /** Cinza do texto secundário */
  gray: "#8b949e",
  /** Texto principal (cinza claro) */
  text: "#c9d1d9",
  /** Acento — azul */
  accent: "#58a6ff",
  /** Azul mais profundo (badges, contraste) */
  accentDeep: "#1f6feb",
} as const;

export const MONO =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace";
