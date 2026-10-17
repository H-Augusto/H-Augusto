/**
 * Paleta única do perfil: cinza + verde escuro.
 * Nada de neon — tudo em tons de cinza com verde escuro como único acento.
 */
export const theme = {
  /** Fundo principal (quase preto) */
  bg: "#0d1117",
  /** Painel / barra de título */
  panel: "#161b22",
  /** Borda e trilhas */
  border: "#21262d",
  /** Cinza do texto secundário */
  gray: "#8b949e",
  /** Cinza claro (texto de comando) */
  grayLight: "#c9d1d9",
  /** Verde escuro — único acento */
  green: "#2ea043",
  /** Verde escuro mais profundo (badges) */
  greenDark: "#238636",
} as const;

export const MONO =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace";
