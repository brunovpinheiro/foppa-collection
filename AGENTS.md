# AGENTS.md — Projeto Foppa (Webflow + Client-First)

> Fonte de verdade completa: **`CLAUDE.md`** (raiz do projeto). Este arquivo existe porque
> o Cursor lê `AGENTS.md` nativamente como padrão de instruções de projeto — sempre que
> for trabalhar neste repo, leia o `CLAUDE.md` inteiro antes de qualquer tarefa no
> Webflow, e mantenha as duas fontes em sincronia ao alterar regras de processo.

## Resumo das regras que valem para qualquer agente

- **Stack:** site Webflow (starter Client-First v2 já pronto) editado via Webflow MCP,
  com JS/CSS custom versionados neste repo (`src/` → `dist/` via Gulp) e servidos por
  **JSDelivr** em produção.
- **Reuso antes de criação:** nunca recrie classes, tokens ou páginas que já existem no
  starter. Consulte a Style Guide / `data_style_tool > query_styles` antes de criar
  qualquer classe nova.
- **Nomenclatura:** sempre Client-First v2 — custom classes com `_` (pastas virtuais),
  utility classes só com `-`. Detalhes completos no `CLAUDE.md` (seção 3).
- **Figma → Webflow:** ao converter um layout do Figma, só entra **estrutura** (elementos
  Webflow + classes Client-First existentes). Não copiar CSS bruto, não subir assets do
  Figma por padrão, não trazer JS do Figma. Mapear cor/espaçamento/tipografia para os
  tokens/variáveis já existentes. Detalhes no `CLAUDE.md` (seção 1.1).
- **Interações/animações:** sempre em JS local com **GSAP + Lenis** (não no painel nativo
  de Interactions do Webflow), carregadas via Custom Code settings para funcionar igual no
  Preview do Designer e no site publicado. Detalhes no `CLAUDE.md` (seção 5).
- **Ambiente:** durante o desenvolvimento, um **server local** serve os arquivos deste
  projeto — aponte `<link>`/`<script>` do Webflow para ele. Só ao finalizar: `npm run
  build`, commit/push, trocar as URLs para o **JSDelivr** (versão/commit fixo) e publicar.
- **Idioma:** classes/pastas em inglês (padrão Client-First); conversa e commits em PT-BR.

Antes de qualquer alteração no Webflow, siga o checklist da seção 6 do `CLAUDE.md`.
