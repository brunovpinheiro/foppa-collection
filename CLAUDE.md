# CLAUDE.md — Projeto Foppa (Webflow + Client-First)

Guia de trabalho para construção do site no **Webflow** via **MCP**, seguindo o padrão
**Finsweet Client-First v2** e usando **JSDelivr** para servir JS/CSS externos.

> Doc oficial Client-First: https://finsweet.com/client-first/docs

---

## 0. Estado atual do site FOPPA (starter Client-First já clonado)

O site já é um **starter Client-First v2 completo**. Estilos, tokens e páginas existem —
**reutilize sempre; NÃO recrie** classes/variáveis que já estão lá.

**Identificadores Webflow:**

> ⚠️ `siteId` e IDs de página mudaram (site foi recriado/duplicado). Confirme sempre via
> `data_sites_tool > list_sites` / `data_pages_tool > list_pages` antes de assumir os IDs abaixo.
>
> ⚠️ **Atenção a site duplicado (2026-07-04):** existe um site homônimo **"FOPPA"**
> (`6a47ee43342b5b6256bfca21`, shortName `foppa`, tz America/Sao_Paulo) que NÃO é o correto.
> O site correto é o **"FOPPA WEBSITE"** abaixo. Se o `list_sites` do MCP só mostrar o
> duplicado e `get_site` do ID correto der 404, o MCP está conectado ao workspace errado —
> **reconecte o Webflow MCP ao site correto antes de construir.**

- `siteId`: `6a48439dda8696af2751d529` (displayName: FOPPA WEBSITE, shortName: foppa-website, timezone America/New_York)
- Páginas:
  - **Home** `6a4843a1da8696af2751d572` — slug `/` (publicada) ← trabalhar aqui
  - **Style Guide** `6a4843a1da8696af2751d576` — draft (referência de todas as classes)
  - **404** `6a4843a1da8696af2751d575`, **Password/401** `6a4843a1da8696af2751d574`
  - **New Page** `6a4843a1da8696af2751d57a` — draft template (slug placeholder)
  - **Artigo** `6a492380a7b93caff3bec722` — draft, slug `/artigo`
  - **FOPPAMKT** `6a49375e8bdb9a89a9fdc5be` — slug `/foppamkt` (contém a seção `section_mkt-hero`)

**Coleções de variáveis (design tokens) — use estas, com seus modos:**
| Coleção | ID | Modos |
|---|---|---|
| Base | `collection-1d0ab9c2-7f62-3c89-bdc5-90bef369024c` | Base mode |
| Theme | `collection-cf92d964-2dd5-c10b-994e-2f87c56921d7` | Base mode, **Dark Mode** |
| Typography | `collection-a9a0c241-39bb-cfcd-87ff-2583cef1ad48` | Base, Tablet, Mobile Landscape |
| Layout | `collection-df805846-1ff6-cb28-71dc-b98c2e89bb29` | Base, Tablet, Mobile Landscape |
| Sizes | `collection-a0b63f6a-5ef6-4d4d-5a7b-2388fb799367` | Base mode |

> Cores respondem a temas: há **Dark Mode** na coleção Theme. Aplique modo de variável via
> `data_style_tool > set_style_variable_mode` num wrapper para trocar o tema de um bloco.

**Escala de spacing REAL do starter (estendida — difere da doc base):**
`0 · xxtiny · xtiny · tiny · xxsmall · xsmall · small · medium · large · xlarge · xxlarge ·
huge · xhuge · xxhuge · custom1 · custom2 · custom3`
Existem para **todas** as direções: `padding-{top,bottom,left,right,horizontal,vertical}-{size}`,
idem `margin-*`, além de `padding-{size}`/`margin-{size}` (all-sides), `spacer-{size}` e `gap-{size}`.
Os valores rem são definidos pelas variáveis da coleção **Sizes** — não hardcode px.

**Utilities já disponíveis (não recriar):**

- **Estrutura:** `page-wrapper`, `main-wrapper`, `padding-global`, `container-{small,medium,large}`,
  `padding-section-{small,medium,large}` (+ `padding-section-top/bottom-{size}`), `section_hero`.
- **Cor:** `background-color-{primary,secondary,alternate}`, `text-color-{primary,secondary,alternate,inherit}`.
- **Tipografia:** `heading-style-h1…h6`, `text-size-{tiny,small,regular,medium,large,inherit}`,
  `text-weight-{light,normal,medium,semibold,bold,xbold,inherit}`,
  `text-style-{allcaps,italic,muted,nowrap,quote,link,strikethrough,balance,pretty,1line,2lines,3lines}`,
  `text-align-{left,center,right}`.
- **Layout:** `max-width-{xxsmall…xxlarge, full, full-tablet, full-mobile-*}`,
  `grid-autofit-*`, `grid-autofill-*`, `grid-span-full`, `aspect-ratio-{square,portrait,landscape,widescreen}`,
  `gap-{size}`, `z-index-1/2`, `overflow-auto/clip`, `display-*`, `pointer-events-*`.
- **Ícones:** `icon-1x1-{small,medium,large}`, `icon-height-{small,medium,large}`.
- **Responsivo:** `hide`, `hide-tablet`, `hide-mobile-landscape`, `hide-mobile-portrait`.
- **Componentes/parciais:** `hero_*`, `form_*` (form*input, form_label, form_checkbox…),
  `utility-page*\_`, `fs-styleguide\_\_`(só na Style Guide),`global-styles\*` (embed CF).

**Regras práticas:**

- Antes de criar qualquer classe, consulte a Style Guide ou faça `data_style_tool > query_styles`.
- `section_rename` é placeholder do starter — renomeie para `section_[nome-descritivo]` ao usar.
- `New Page` é template de duplicação; use `create_page` com `duplicateOf` para novas páginas.

### 0.1 Design Tokens — valores atuais (padrão Client-First)

> Estes são os valores **padrão do starter**. Quando você me passar imagem/Figma, eu atualizo
> estas variáveis (via `data_variable_tool > update_*`) e o Design System inteiro acompanha,
> porque estilos/temas apontam para elas. Sempre editar o **token**, nunca hardcodar no elemento.

**Modos (para editar por breakpoint/tema):**

- Theme → `base` · **Dark Mode** `mode-62e4ccbe-ca41-9b53-717d-4e3a494bff8d`
- Typography → `base` · Tablet `mode-e1e96f23-1708-5e17-b421-4b1b291e52f5` · Mobile Landscape `mode-40c24f25-108f-d3d1-299e-3f4541992a38`
- Layout → `base` · Tablet `mode-1d43442a-28fb-ea59-86f4-35a55d41faba` · Mobile Landscape `mode-7ad426d0-c3fa-3db6-f129-e521eec8bbaf`

#### Coleção `Base` — primitivos (referenciados pelo Theme)

> ⚠️ A marca migrou de azul para uma paleta **orange/cream** — os valores abaixo refletem
> o Webflow atual (não mais os tokens azuis do starter original).

**Cores — Brand (orange):** `orange-light` hsla(22.6,74.6%,80%,1) · `orange` **#a05124** · `orange-dark` #743c21 · `orange-darker` hsla(19.5,55.7%,18.6%,1)
**Cores — Brand (cream):** `cream-light` #fff6e7 · `cream` #e5d2ba · `cream-dark` #dfc490 · `cream-darker` hsla(39.5,35.2%,54.7%,1)
**Cores — Neutral:** `white` #fff · `black` #000 · `neutral-light` #eee · `neutral` #4a453b · `neutral-dark` #282520 · `neutral-darker` #181612 · `transparent`
**Cores — Others:** `green-light` #cef5ca / `green-dark` #114e0b · `yellow-light` #fcf8d8 / `yellow-dark` #5e5515 · `red-light` #f8e4e4 / `red-dark` #3b0b0b
**Font Family:** `heading` = Timesnow · `heading-alternate` = Brooklyn · `body` = Timesnow · `body-alternate` = DM Sans
**Font Weight:** thin 100 · xlight 200 · light 300 · normal 400 · medium 500 · semi-bold 600 · bold 700 · xbold 800 · black 900
**Font Height (line-height):** small 1.1 · medium 1.2 · large 1.4 · xlarge 1.5
**Letter Spacing:** tighter -0.02em · tight -0.01em · default 0 · wide 0.01em · wider **0.06em**

#### Coleção `Theme` — semânticos (aponta p/ Base). Dark Mode parcialmente configurado

| Token                             | Base mode                                        | Dark Mode                     |
| --------------------------------- | ------------------------------------------------- | ------------------------------ |
| `background/primary`              | cream-light                                        | neutral-darker (inverte)        |
| `background/secondary`            | orange                                             | orange (igual)                  |
| `background/alternate`            | neutral-darker                                     | cream-light (inverte)           |
| `border/primary`                  | neutral-light (#eee)                               | igual                           |
| `border/secondary`                | orange                                              | igual                           |
| `text/primary`                    | neutral-darker                                     | igual                           |
| `text/secondary`                  | neutral (#4a453b)                                  | igual                           |
| `text/alternate`                  | orange                                              | igual                           |
| `link/primary` / `link/secondary` | orange / black                                     | igual                           |
| `button-primary`                  | bg orange · text white · hover orange-dark         | igual                           |
| `button-secondary`                | bg white · text black · hover neutral-light        | igual                           |
| `system/success`                  | bg green-light · text green-dark                   | igual                           |
| `system/warning`                  | bg yellow-light · text yellow-dark                 | igual                           |
| `system/error`                    | bg red-light · text red-dark                       | igual                           |
| `system/focus-state`              | orange · `selection` bg orange / text white        | igual                           |

> ⚠️ Diferente do que a doc antiga dizia, o **Dark Mode já está parcialmente configurado**:
> `background/primary` e `background/alternate` invertem entre os modos (cream-light ↔
> neutral-darker). Todos os outros tokens ainda espelham a base. As utilities
> `background-color-*` / `text-color-*` consomem estes tokens.

#### Coleção `Typography` — responsivo (base → tablet → mobile landscape)

| Token          | Base    | Tablet  | Mobile L.                           |
| -------------- | ------- | ------- | ----------------------------------- |
| body font-size | 1rem    | 1rem    | 1rem (weight normal, lh xlarge 1.5) |
| H1             | 4rem    | 4rem    | 2.5rem (bold, lh 1.1)               |
| H2             | 3rem    | 3rem    | 2rem (bold, lh 1.2)                 |
| H3             | 2rem    | 2rem    | 1.5rem (bold, lh 1.2)               |
| H4             | 1.5rem  | 1.5rem  | 1.25rem (bold, lh 1.4)              |
| H5             | 1.25rem | 1.25rem | 1rem (bold, lh 1.5)                 |
| H6             | 1rem    | 1rem    | 0.875rem (bold, lh 1.5)             |

**Font Size (utilities `text-size-*`):** tiny 0.75rem · small 0.875rem · regular 1rem · medium 1.25rem · large 1.5rem→1.25rem (mobile)

#### Coleção `Layout` — spacing responsivo (base → tablet → mobile landscape)

| Token                                      | Base         | Tablet       | Mobile L.    |
| ------------------------------------------ | ------------ | ------------ | ------------ |
| none                                       | 0            | 0            | 0            |
| xxtiny                                     | 0.25rem      | =            | =            |
| xtiny                                      | 0.5rem       | =            | =            |
| tiny                                       | 0.75rem      | =            | =            |
| xxsmall                                    | 1rem         | =            | =            |
| xsmall                                     | 1.25rem      | =            | =            |
| small                                      | 1.5rem       | =            | =            |
| medium                                     | 2rem         | 1.5rem       | 1.25rem      |
| large                                      | 3rem         | 2.5rem       | 1.5rem       |
| xlarge                                     | 4rem         | 3rem         | 2rem         |
| xxlarge                                    | 5rem         | 4rem         | 3rem         |
| huge                                       | 6rem         | 5rem         | 4rem         |
| xhuge                                      | 8rem         | 6rem         | 5rem         |
| xxhuge                                     | 12rem        | 8rem         | 6rem         |
| **global-padding** (`padding-global`)      | 3rem         | 3rem         | 1.25rem      |
| **section-padding** small / medium / large | 3 / 5 / 10rem| 3 / 4 / 6rem | 3 / 3 / 5rem |

#### Coleção `Sizes` — não responsivo

**Max Width:** xxsmall 12 · xsmall 16 · small 20 · medium 32 · large 48 · xlarge 64 · xxlarge 80 (rem)
**Container:** small 48 · medium 64 · large 80 (rem)
**Grid Columns:** xsmall 15 · small 20 · medium 30 · large 40 (rem)
**Border Radius:** small 0.25 · medium 0.5 · large 1 (rem)
**Icon:** small 1 · medium 2 · large 2.5 (rem) · **Focus:** width/offset 0.125px

### 0.2 Componentes com CSS/JS custom (fora do Designer)

Alguns componentes precisam de CSS que o Webflow Designer não expõe (`::backdrop`,
`@starting-style`, `transition-behavior: allow-discrete`, etc.) ou de JS de interação.
Nesses casos o código vive **local** (`src/`) e é publicado via JSDelivr — nunca em Embed.

- **`.dialog_meetceo`** (elemento `<dialog id="dialogMeetCeo">`, Webflow Component
 "Dialog - Meet CEO"): abre via `#openMeetCeoBtn` (dentro do component "Navmenu", que
 fica dentro de "Navbar"), fecha via `#closeMeetCeoBtn` ou clique fora da caixa.
 - Por ser um Webflow Component reutilizável, a instância precisa existir em **toda
 página que usa o Navbar padrão** (mesmo padrão do botão). Ao adicionar uma página nova
 com Navbar, insira também uma instância de "Dialog - Meet CEO" (`insert_component_instance`,
 mesmos valores padrão de props) — senão o botão "Meet CEO" fica sem alvo (`getElementById`
 retorna null e o JS simplesmente não faz nada).
 - Animação (fade-up/down no dialog + fade in/out no `::backdrop`, 100% CSS, sem JS/timers):
 `src/scss/components/_dialog-meetceo.scss` (importado em `style.scss`).
 - Interação (abrir/fechar/teclado): `src/js/common.js` (`initMeetCeoDialog`) — JS
 **global**, não de página, porque o componente aparece em várias páginas (Home, FOPPA
 BITES, Artigo, Política de Privacidade, FOPPAMKT, Projetos Template).
 - **Scroll:** quem rola é o `dialog.dialog_meetceo` (`overflow-y: auto`, no Webflow),
 não o `.meetceo_box` (sem overflow, conteúdo dita a altura) nem o `.dialog_meetceo-wrapper`
 (sem `max-height`/`overflow`, senão o flexbox encolhe e corta o conteúdo — ver nota
 abaixo). `.dialog_meetceo-wrapper` tem `margin-top`/`margin-bottom: 4rem` pra dar
 respiro no topo/rodapé quando o conteúdo é maior que a viewport. O JS trava o scroll
 da página (`document.documentElement.style.overflow = "hidden"` **+ `window.lenis.stop()`**,
 ver seção 5.4) ao abrir e destrava no evento nativo `close` do `<dialog>` — cobre
 qualquer forma de fechar (botão, clique fora, Esc).
 > ⚠️ Pegadinha de flexbox: `dialog_meetceo` é flex-column; qualquer filho direto dele
 > (ex. `.dialog_meetceo-wrapper`) com `overflow` diferente de `visible` zera o
 > "automatic minimum size" do item flex, permitindo que o navegador o encolha abaixo
 > do conteúdo — o conteúdo interno fica cortado e inacessível mesmo com scroll no pai.
 > Por isso o wrapper não pode ter `overflow: hidden`/`auto`.

- **`.dialog-shop-foppabites`** (página **FOPPA BITES** `/foppa-bites`, elemento
  `<div id="dialogShopNow">`): **não é um `<dialog>` nativo** — é um `<div>` comum que o
  Designer já deixa com `display: none` + `position: fixed` cobrindo a tela (overlay com
  blur). `#btnShopNow` (link estilizado como aba, `foppabites-tabs_item`, dentro de
  `.foppabites-tabs` junto de "Sobre" e "Ingredientes") funciona como toggle: primeiro
  clique abre, segundo clique fecha.
  - **Estado da aba:** abrir o dialogo marca `#btnShopNow` como a aba `active` (combo já
    existente em `foppabites-tabs_item`, bg branco) e remove `active` de quem estava antes
    (ex.: "Sobre"); fechar restaura o `active` na aba anterior e tira de `#btnShopNow`. Não
    há scroll-spy nas outras abas ("Sobre"/"Ingredientes") — o estado `active` delas hoje é
    só o que estiver setado no Designer/DOM no momento em que o dialogo abre.
  - Clicar em "Sobre" ou "Ingredientes" com o Shop Now aberto fecha o dialogo antes de
    seguir a navegação normal dessas abas (scroll de seção) — evita o dialogo ficar aberto
    por cima do conteúdo pra onde a aba está levando.
  - **Scroll responsivo (telas desktop pequenas, tablet e mobile):** só o overlay
    `.dialog-shop-foppabites` rola (`overflow-y: auto` + `overflow-x: hidden`) — o
    `.shop-foppabites_panel` **não tem** `max-height`/`overflow` próprios, fica com altura
    livre (`height: auto`, cresce pro tamanho do conteúdo). Ter scroll nos dois ao mesmo
    tempo criava 2 scrollbars (uma dentro da outra); com o painel sem overflow, ele só
    "vaza" pra fora do viewport e quem rola pra alcançar o que passou da tela é o overlay,
    scrollando o painel inteiro (imagem + texto juntos) como uma unidade só.
    `margin-top`/`margin-bottom: auto` no painel + `align-items: flex-start` no overlay é o
    truque clássico de "centralizar com flexbox e ainda permitir overflow/scroll":
    centraliza igual a `align-items: center` quando o painel cabe na tela, mas em vez de
    cortar o topo quando não cabe, ele fica alcançável via scroll do overlay.
  - **Stacking mais cedo:** o layout de 2 colunas (`grid-template-columns: 1fr 1fr` /
    flex row, `.shop-foppabites_media` + `.shop-foppabites_content` cada um com
    `min-width: 25rem`) só empilhava (`flex-direction: column`) no breakpoint **tiny**
    (≤479px) — abaixo disso e até ~991px (breakpoints **medium**/**small**) os dois
    `min-width: 25rem` (800px de floor, mais gap/padding) não cabiam na tela, causando
    overflow horizontal em tablets. Agora `flex-direction: column` (+ gap reduzido pra
    `2rem`) entra já no breakpoint **medium** (≤991px, cascade automático pro **small**
    também) — só o **main** (desktop largo) mantém as 2 colunas lado a lado.
    `.shop-foppabites_media`/`.shop-foppabites_content` também reduzem `min-width` pra
    `20rem` no **medium** (**tiny** continua com `15rem`, mais agressivo) e a mídia ganha
    `max-height: 20rem` + `overflow: hidden` nesse breakpoint (**tiny** já tinha
    `16rem`) — evita a imagem dominar a tela empilhada antes do texto aparecer.
  - Animação (100% GSAP, sem CSS de transição): `src/js/pages/foppa-bites.js`. Timeline de
    entrada/saída anima o overlay (fade), o `.shop-foppabites_panel` (fade + y + scale) e,
    em stagger, `.shop-foppabites_media`, o container `.shop-foppabites_type` (como bloco
    único — ver seletor de variante abaixo) e os 4 `.foppabites-option_link` dentro de
    `.shop-foppabites_options`. Respeita `prefers-reduced-motion` (durações comprimidas
    para ~0 e sem stagger).
  - CSS local (`src/scss/components/_dialog-shop-foppabites.scss`): só `will-change` nas
    camadas animadas e `cursor: pointer` no gatilho — o show/hide e o layout continuam 100%
    Designer/Client-First, o resto da animação é inline via GSAP.
  - Fecha ao clicar no botão de novo, no overlay (fora do painel) ou com Esc. Trava o
    scroll da página enquanto aberto (mesmo padrão do Meet CEO). Acessibilidade:
    `role="dialog"` + `aria-modal="true"` no wrapper (setados via `data_element_tool`),
    `aria-hidden` alternado via JS, painel com `tabindex="-1"` recebe foco ao abrir, foco
    volta pro `#btnShopNow` ao fechar.
  - **Seletor de variante (dentro do dialog):** `.shop-foppabites_type` (`#foppaBitesTypes`)
    contém 3 `.foppabites-type_item[data-shop-type]` (`signature` / `gifting-set` /
    `soft-pouch`) — só um fica visível por vez. `.shop-foppabites_options` tem os
    `.foppabites-option_link[data-shop-type]` correspondentes (mesmos 3 valores) +
    o CTA `Fale com nosso Concierge` (`.is-dark`, **sem** `data-shop-type` — não participa
    da troca, continua link normal). **Passar o mouse (ou focar via Tab)** numa opção com
    `data-shop-type` troca o painel exibido (fade+y via GSAP, função `initTypeSwitcher` em
    `foppa-bites.js`, eventos `mouseenter`/`focus`) e alterna a classe combo `active`
    (criada com `foppabites-option_link` como pai — border `border/secondary` laranja —
    **não** é o mesmo objeto do combo `active` usado nas `foppabites-tabs_item`; combo
    classes no Webflow são amarradas à classe-pai com que foram criadas, reaplicar o mesmo
    nome sob um pai diferente exige criar um novo combo, não só listar o nome em
    `set_style`). **Em telas touch** (`matchMedia("(hover: hover) and (pointer: fine)")`
    dando `false`) não existe "passar o mouse" — o primeiro toque numa opção só faz a
    pré-visualização (via `click` com `preventDefault`, já que não roda `mouseenter`);
    um segundo toque, com a opção já ativa, segue o link normalmente. Em dispositivos com
    mouse/trackpad de verdade o clique não é interceptado — cada opção navega normalmente
    para o `href` configurado nela no Designer (ainda placeholder; defina o destino real
    por fora). Por isso essas opções são links puros, sem `role`/`aria-*` de botão/toggle.
    > ⚠️ Atributo é `data-shop-type` (não `data-type`) — nome escolhido para não colidir
    > com um possível `data-type` genérico de outro script/plugin no futuro.
  - **Painel deslizante "Escolha o sabor" (`.shop-signature-flavors_panel`):** filho
    absoluto de `.shop-foppabites_panel` (pai com `position: relative` + `overflow: clip`).
    Clicar em `signature` (`.foppabites-option_link[data-shop-type="signature"]`) **não
    navega** — desliza o painel de `right: -50%` → `0%` (desktop; em ≤991px parte de
    `-100%` com `max-width: 100%`) via GSAP + combo `is-open` (`initSignatureFlavorsPanel`
    em `foppa-bites.js`). Contém 3 sabores da Signature Edition, cada um com checkout
    Stripe próprio (`.shop-signature-flavors_options > .foppabites-option_link[data-flavor]`).
    Fecha via "← Voltar" (`#btnBackSignatureFlavors`), Esc (coordenado pra fechar o slide
    antes do Shop Now) ou ao fechar o Shop Now.
 - GSAP + ScrollTrigger agora carregam no **Custom Code do site** (Head), não mais por
 página — ver seção 5.1. O Custom Code da página FOPPA BITES só mantém o
 `<script src>` do `foppa-bites.min.js` (JS específico desta página); `style.min.css`,
 `libs.min.css`, GSAP/ScrollTrigger, `libs.min.js` e `common.min.js` já vêm do site.

---

## 1. Como trabalhamos

- **Ferramenta principal:** Webflow MCP. Antes de usar qualquer tool do Webflow, chame
  `webflow_guide_tool` **uma vez por sessão** para carregar as capacidades disponíveis.
- **Padrão de nomenclatura e estrutura:** SEMPRE Client-First v2 (regras na seção 3).
- **Consistência acima de tudo:** reutilize classes utilitárias existentes antes de criar
  novas. Cada classe nova deve justificar sua existência.
- **Figma → Webflow:** ao receber um layout do Figma, só entra **estrutura** no Webflow
  (elementos + classes Client-First). Nada de CSS solto, assets ou JS do Figma — regras
  completas na seção **1.1**.
- **Interações/animações:** sempre em **JS local com GSAP + Lenis**, nunca só no painel
  nativo de Interactions do Webflow — regras completas na seção **5**.
- **Ambiente de dev:** durante todo o trabalho, um **server local** estará rodando
  servindo os arquivos deste projeto (`dist/`) — aponte `<link>`/`<script>` customizados
  do Webflow para esse server local enquanto desenvolvemos. Só ao final, quando a página/
  feature estiver pronta, fazemos `npm run build`, commit/push e trocamos os links para o
  **JSDelivr** antes de publicar (checklist na seção 4).

### 1.1 Fluxo Figma → Webflow (só estrutura, sem CSS/assets/JS)

Objetivo: usar o Figma **apenas como blueprint visual** para montar a página rapidamente,
sem duplicar trabalho de estilo que o Design System do Webflow já resolve.

> 🟠 **Regra de ouro:** do Figma vem **SÓ a estrutura** (hierarquia de elementos e quais
> classes Client-First usar). **NUNCA reproduzir o design 1:1.** Aparência (cor, espaçamento,
> tipografia, tamanhos) vem **sempre das variáveis/tokens do Webflow** e das utilities
> Client-First — **nunca** de valores literais copiados do Figma (hex, px, rem, line-height,
> letter-spacing exatos). Se o Figma diz `#a54d18`, você usa a variável de marca mais próxima
> (`orange`), não o hex. Se diz `line-height: 55px`, você usa o token de tipografia, não `55px`.
> Divergência visual do Figma é **esperada e aceitável** — o Design System é a fonte da verdade.

- **NÃO** copiar/colar CSS bruto, inline styles, hex codes soltos, valores px/rem exatos ou
  tokens do Figma direto no elemento. Sempre mapear cor/espaçamento/tipografia do Figma para
  as **variáveis/tokens já existentes** (seção 0.1) ou para uma **utility Client-First**
  já existente (seção 0). Nunca hardcode um valor — **mesmo que ele seja igual ao valor de um
  token**; nesse caso, aponte para a variável, não escreva o número. Se realmente faltar um
  valor no Design System, o ajuste é no **token** (`data_variable_tool`), nunca no elemento.
- **Classe custom nova (quando inevitável) deve consumir variáveis do Webflow**, não valores
  literais. Cor/espaçamento/tipografia da classe apontam para as variáveis das coleções
  (Base/Theme/Typography/Layout/Sizes). Uma classe custom com `color:#181612` ou
  `padding:6rem` hardcoded está **errada** — deve referenciar a variável correspondente.
- **NÃO** subir assets do Figma (imagens exportadas, ícones, fontes) por padrão. Reuse
  assets/ícones já existentes no Webflow Assets sempre que possível. Só faça upload de um
  asset novo quando for conteúdo real (foto/logo específico) que não existe no projeto —
  nunca para recriar algo que dá para fazer com CSS (formas, sombras, gradientes, ícones
  de sistema).
- **NÃO** trazer JS do Figma nem criar Embeds novos para replicar detalhes visuais do
  design. Se o Client-First não cobre 100% do visual, resolva com combinação de utilities
  existentes primeiro; só crie classe custom nova como último recurso, seguindo o padrão
  da seção 3.
- **Use a saída do Figma (MCP `get_design_context`, screenshot, hints) só como
  referência** de layout, hierarquia e proporção — para escolher quais elementos Webflow
  usar (`section_*`, `container-*`, `grid-*`, etc.) e como estruturar a árvore. Não trate
  o código React/Tailwind retornado como algo a "traduzir" 1:1.
- Resultado esperado: a página nasce **só com elementos nativos do Webflow + classes já
  existentes**, publicável imediatamente. Ajustes finos de CSS/JS que realmente exigirem
  código (ex.: `::backdrop`, animações GSAP) entram depois, localmente (seções 0.2 e 5) —
  nunca durante a montagem inicial da estrutura.

### Idioma

Documentação de classes/pastas em inglês (padrão Client-First). Conversa e commits em PT-BR.

---

## 2. Fluxo de desenvolvimento (build local com Gulp)

Espelhamos a estrutura do projeto de referência `/Users/brunopinheiro/Dev/blackhaus`
(gulp + SCSS + JS). O gulp compila/minifica para `dist/`, servido localmente (ex.:
`http://127.0.0.1`) enquanto desenvolvemos, e publicado via JSDelivr em produção.

### Estrutura de pastas (src → dist)

```
src/
  scss/
    style.scss          → compila para dist/css/style.min.css
    lib/*.scss           (bibliotecas de terceiros → dist/css/libs.min.css)
  js/
    common.js            → dist/js/common.min.js   (JS global, todas as páginas)
    pages/*.js           → dist/js/pages/*.min.js   (JS por página)
    lib/*.js             (libs de terceiros → dist/js/libs.min.js)
dist/                    (gerado — nunca editar à mão)
```

### Scripts (package.json)

- `npm start` → `gulp` (watch: recompila SCSS/JS ao salvar) — usar no dia a dia.
- `npm run build` → `gulp build` (build único, sem watch) — antes de publicar.

### Regras do gulp (iguais ao blackhaus)

- SCSS: API `modern`, concatenado em `style.css`, minificado → `style.min.css`.
- JS: `terser` para minificar. `common.js` e cada arquivo em `pages/` viram `.min.js`.
- Libs: JS/CSS de terceiros ficam em `src/**/lib/`, concatenados em `libs.min.*`.
  Registrar cada lib em `libsConfig` no `gulpfile.js`.
- **Sourcemaps ligados** em todos os pipelines.

### No Webflow

- **CSS/JS custom** entram via `<link>`/`<script>` apontando para o JSDelivr (produção)
  ou para o server local (dev) — nas Custom Code settings (Head/Footer) ou Page settings.
- Evite escrever CSS/JS diretamente em Embeds do Designer quando puder centralizar em
  arquivos versionados. Exceção: o **Global Styles embed** do Client-First (seção 3.6).

---

## 3. Padrão Client-First v2

### 3.1 Dois tipos de classe

- **Custom classes** — usam **underscore** `_` para criar "pastas" virtuais.
  Formato: `folder_element` ou `parent_child_element`.
  Ex.: `nav_primary_logo-wrapper`, `team_member_photo`.
- **Utility classes** — usam **apenas hífen** `-`, sem underscore. Reutilizáveis e globais.
  Ex.: `text-color-primary`, `padding-large`, `max-width-large`.

Palavras dentro de um segmento também usam hífen: `hero-header_title-wrapper`.

### 3.2 Pastas (folders)

Pastas são organização virtual. Underscore = nível de pasta.

- Não faça over-nesting. Aninhe só o necessário.
- Utilities são agrupadas automaticamente por keyword (ex.: `text-color-*` → pasta
  `text` › `color`).

### 3.3 Core structure (hierarquia obrigatória das páginas)

Toda página segue esta ordem de wrappers:

```
page-wrapper                     ← div externa (tag <div>) envolve tudo
  main-wrapper                   ← tag <main>, conteúdo principal (fora de nav/footer)
    section_[identificador]      ← tag <section>, nome descritivo: section_hero, section_about
      padding-global             ← padding horizontal (left/right) da página
        container-[size]         ← centraliza + max-width (small | medium | large)
          padding-section-[size] ← padding vertical (top/bottom): small | medium | large
            ...conteúdo
```

Regras:

- `page-wrapper` evita estilizar o `<body>` direto.
- `section_*` sempre com nome semântico do conteúdo (`section_testimonials`, não `section_1`).
- `padding-global` cuida SÓ do espaçamento horizontal.
- `container-large/medium/small` centralizam (`margin: auto`, `width: 100%`).
- `padding-section-*` cuida SÓ do espaçamento vertical da seção.

### 3.4 Sizes & REM

- **Base: 1rem = 16px** (default do browser — NÃO alterar o font-size do `html`).
- Trabalhe em rem: `px ÷ 16 = rem` (ex.: 64px = 4rem).
- Prefira valores legíveis: `1, 1.5, 2, 2.5, 3, 4, 5`. Evite decimais quebrados.
- rem respeita zoom/acessibilidade do usuário — nunca use px fixo pra layout/spacing.

### 3.5 Escala de spacing (padding & margin utilities)

Aplicável a `padding-*` e `margin-*` com direção
(`-top`, `-bottom`, `-left`, `-right`, `-horizontal`, `-vertical`):

| Classe     | REM      | PX    |
| ---------- | -------- | ----- |
| `-0`       | 0        | 0     |
| `-tiny`    | 0.125rem | 2px   |
| `-xxsmall` | 0.25rem  | 4px   |
| `-xsmall`  | 0.5rem   | 8px   |
| `-small`   | 1rem     | 16px  |
| `-medium`  | 2rem     | 32px  |
| `-large`   | 3rem     | 48px  |
| `-xlarge`  | 4rem     | 64px  |
| `-xxlarge` | 5rem     | 80px  |
| `-huge`    | 6rem     | 96px  |
| `-xhuge`   | 8rem     | 128px |
| `-xxhuge`  | 12rem    | 192px |
| `-custom1` | 1.5rem   | 24px  |
| `-custom2` | 2.5rem   | 40px  |
| `-custom3` | 3.5rem   | 56px  |

> ⚠️ O starter FOPPA usa a **escala estendida** e adiciona `xxtiny` e `xtiny` (menores que
> `tiny`). Veja a lista real e a fonte dos valores (coleção Sizes) na **seção 0**.

**Estratégias de espaçamento:**

- **Spacer block:** div vazia com `spacer-[size]` para separar irmãos (permite variação
  responsiva). Alternativa 2-classe: `padding-bottom` + `padding-[size]`.
- **Spacing wrapper:** `margin/padding-[direção]` + `margin/padding-[size]` num wrapper.
- **Section padding:** `padding-section-[size]` junto de `padding-global`.
- **CSS Grid:** parent com grid + gap para espaçar filhos uniformemente.

### 3.6 Tipografia

Padrão: **sem classe em Headings/Text** — use as tags HTML e estilize os defaults globais.
Só adicione classe quando houver **variação** do default.

- **Heading (mantendo semântica):** `heading-style-h1` … `heading-style-h6`
  (permite, ex., um `<h2>` com aparência de h1).
- **Tamanho de texto:** `text-size-small`, `text-size-regular`, `text-size-medium`,
  `text-size-large`.
- **Peso:** `text-weight-[valor]` (ex.: `text-weight-medium`, `-semibold`, `-bold`).
- **Estilo:** `text-style-[descritor]` (ex.: `text-style-muted`, combinações agrupadas).
- **Cor:** `text-color-[nome]` (ex.: `text-color-primary`, `text-color-brand`).
- **Alinhamento:** `text-align-[direção]`.
- **Opacidade:** `text-opacity-[nível]` (low, medium, high, full).

### 3.7 Max-width utilities (uso aninhado, não confundir com `container-*`)

| Classe              | REM    |
| ------------------- | ------ |
| `max-width-xxsmall` | 12rem  |
| `max-width-xsmall`  | 16rem  |
| `max-width-small`   | 20rem  |
| `max-width-medium`  | 32rem  |
| `max-width-large`   | 48rem  |
| `max-width-xlarge`  | 64rem  |
| `max-width-xxlarge` | 105rem |

### 3.8 Global Styles Embed

Adicionar o embed padrão do Client-First (Head do projeto). Ele:

- Aplica `-webkit-font-smoothing: antialiased`.
- Cria foco unificado via `*[tabindex]:focus-visible`.
- Remove margens do primeiro/último elemento em Rich Text.
- Força centralização de `container-*` (`margin-left/right: auto !important`).
- Fornece utilities com `!important`: `.hide`, `.margin-0`, `.padding-0` e variantes
  direcionais, além de `.inherit-color`.
- Remove estilos/tamanhos hardcoded de elementos default do Webflow.

### 3.9 Semântica, acessibilidade e responsivo

- Use tags HTML corretas: `<main>`, `<section>`, `<nav>`, `<footer>`, headings em ordem.
- Acessibilidade: foco visível, contraste, `alt` em imagens, ordem lógica de headings.
- Responsivo fluido preferindo rem; evite valores fixos que quebram zoom/acessibilidade.

### 3.10 Nomenclatura de Interactions (Webflow IX)

> ⚠️ Regra do projeto: interações "de verdade" (scroll, timeline, parallax etc.) usam
> **GSAP + Lenis em JS local**, não o IX nativo — veja a seção 5. O IX nativo do Webflow
> fica só para micro-interações triviais (hover simples de states).

Quando usar o IX nativo, nomeie as interactions de forma descritiva e consistente com a
classe/elemento alvo (padrão Client-First `interactions-naming`), para facilitar manutenção.

---

## 4. JS e CSS externos via JSDelivr

Em produção, servir arquivos versionados pelo **JSDelivr** (CDN gratuito sobre GitHub/npm).

- **Repositório:** `https://github.com/brunovpinheiro/foppa-collection` (branch `main`).
- **Via GitHub:**
  `https://cdn.jsdelivr.net/gh/USUARIO/REPO@VERSAO/dist/js/common.min.js`
- Sempre apontar para os arquivos **minificados** de `dist/` (gerados pelo gulp).
- **Dev:** apontar para o server local (ex.: `http://127.0.0.1:PORTA/dist/...`) e trocar
  pela URL JSDelivr ao publicar.

### 4.1 Automação (GitHub Actions → purge JSDelivr)

O workflow `.github/workflows/jsdelivr-purge.yml` roda a cada `push` na branch `main` que
altere algo em `dist/**` e chama a **purge API** do JSDelivr
(`https://purge.jsdelivr.net/gh/...`) para cada arquivo de `dist/`, forçando o CDN a buscar
a versão mais recente do GitHub imediatamente (sem esperar o cache de até 12h/7 dias expirar).

Por isso as URLs usam `@main` (branch), **não** tag/commit fixo — a URL final é **estável**
(não muda a cada deploy) e o conteúdo é atualizado automaticamente pelo Action. Você só
precisa colar as URLs abaixo nas Custom Code settings do Webflow **uma vez**; deploys
seguintes (`npm run build` + commit/push) atualizam o conteúdo sozinhos via Action.

### 4.2 URLs finais para colar no Webflow (Custom Code settings)

**CSS (Head, antes do JS):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/brunovpinheiro/foppa-collection@main/dist/css/libs.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/brunovpinheiro/foppa-collection@main/dist/css/style.min.css">
```

**JS global (Footer, depois do GSAP/ScrollTrigger que já estão no Custom Code do site):**

```html
<script src="https://cdn.jsdelivr.net/gh/brunovpinheiro/foppa-collection@main/dist/js/libs.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/brunovpinheiro/foppa-collection@main/dist/js/common.min.js"></script>
```

**JS por página (Custom Code da página, depois do `common.min.js`):**

```html
<script src="https://cdn.jsdelivr.net/gh/brunovpinheiro/foppa-collection@main/dist/js/pages/foppa-bites.min.js"></script>
```

> Ao criar um novo arquivo em `src/js/pages/`, o gulp gera o `.min.js` correspondente em
> `dist/js/pages/` — a URL segue o mesmo padrão acima, trocando `foppa-bites` pelo nome do
> arquivo.

**Checklist ao publicar JS/CSS:**

1. `npm run build` (gera `dist/`).
2. Commit + push na branch `main` do repositório GitHub — o Action de purge do JSDelivr
   dispara sozinho (ver 4.1).
3. Confirme que as URLs acima já estão nas Custom Code settings do Webflow (só precisa
   fazer isso uma vez, pois a URL `@main` não muda).
4. Publicar o site no Webflow.

---

## 5. Interações e animações (GSAP + Lenis)

Padrão do projeto: qualquer interação/animação (scroll reveal, parallax, menu, transições,
hover mais elaborado, etc.) é feita em **JS local com GSAP + Lenis**, e não no painel
nativo de Interactions (IX2) do Webflow. Exceção: micro-interações triviais que o próprio
Designer resolve nativamente sem JS (ex.: hover simples de cor/opacidade via states) podem
continuar nativas — tudo que precisar de scroll-trigger, sequência/timeline ou smooth
scroll vai para código.

### 5.1 Bibliotecas

- **GSAP** (core + `ScrollTrigger`) para as animações. **Não** subir/bundlar o GSAP neste
  repo nem registrar em `libsConfig.js` — ele entra via `<script src>` do CDN oficial
  (jsDelivr, versão fixada) no **Custom Code do site** (Head), e o JS local
  (`common.js`/`pages/*.js`) só usa `gsap`/`ScrollTrigger` como globais.
  ✅ **Status atual: carregado site-wide.** O Head do site inclui, nesta ordem:
  `libs.min.css` (Lenis), `style.min.css`, `gsap.min.js`, `ScrollTrigger.min.js` — todas
  as páginas herdam automaticamente, sem precisar repetir o include por página. Antes de
  assumir que mudou, confirme com `data_scripts_tool > get_site_freeform_code`.
- **Lenis** (smooth scroll) — vendorizado como lib de terceiros, seguindo o padrão da
  seção 2: `src/js/lib/lenis.js` (build UMD copiado de `node_modules/lenis/dist/lenis.js`,
  expõe `window.Lenis`) e `src/scss/lib/lenis.scss` (CSS recomendado da lib), registrados
  em `libsConfig` no `gulpfile.js` → viram `dist/js/libs.min.js` / `dist/css/libs.min.css`.
  Para atualizar a versão: `npm install lenis@latest` e recopiar os dois arquivos de
  `node_modules/lenis/dist/` por cima dos vendorizados (mantendo o header de comentário).
- O código de inicialização/interação em si é **sempre nosso**, em
  `common.js`/`pages/*.js`, nunca direto em Embed.

### 5.2 Inicialização

- O Lenis é instanciado **uma vez**, em `src/js/common.js` (`initLenis()`), porque roda em
  todas as páginas via Custom Code do site. Exposto em `window.lenis` para outras rotinas
  (ex.: dialogs) poderem chamar `.stop()`/`.start()` sem reinstanciar.
- Sincronizado com o RAF do GSAP (`gsap.ticker.add((time) => lenis.raf(time * 1000))`,
  `gsap.ticker.lagSmoothing(0)`) e com o `ScrollTrigger.update` via `lenis.on("scroll", ...)`,
  para que scroll-trigger e smooth scroll fiquem compatíveis. Se o GSAP não estiver
  carregado por algum motivo, cai para `autoRaf: true` (Lenis roda sozinho, sem GSAP).
  Respeita `prefers-reduced-motion` (lerp `1` e `smoothWheel: false` = sem suavização).
- Animações específicas de uma página entram em `src/js/pages/[nome].js`, com funções
  nomeadas de forma descritiva (ex.: `initHeroParallax()`, `initMenuReveal()`). Helpers
  reaproveitáveis entre páginas vão para `common.js`.
- **Modais/dialogs que travam o scroll** (Meet CEO, Shop Now) devem chamar
  `window.lenis.stop()`/`.start()` **além** do `document.documentElement.style.overflow`,
  senão o Lenis pode deixar resíduo de inércia por baixo do modal.

### 5.3 Funcionar no Preview E no site publicado

- GSAP, ScrollTrigger, Lenis (`libs.min.js`/`libs.min.css`) e `common.min.js` já estão nas
  Custom Code settings do **site** (Head/Footer) — não precisam ser repetidos por página.
  JS específico de página (`pages/*.min.js`) continua indo no Custom Code **da página**,
  carregando depois do `common.min.js` (ordem no Footer). O Designer **Preview** executa o
  custom code de site/página, então o comportamento fica idêntico ao publicado.
- **Sempre teste no botão Preview do Designer** antes de publicar, e valide de novo depois
  de publicar.
- URLs seguem o mesmo fluxo da seção 4: durante o dev, `<script src>`/`<link>` apontam pro
  **server local** (hoje `http://127.0.0.1:5500/dist/...`); ao finalizar, troca pra URL do
  **JSDelivr** fixada em tag/commit, e publica (GSAP continua sempre via CDN oficial,
  nunca via JSDelivr deste repo).

---

## 6. Checklist rápido antes de criar algo no Webflow

- [ ] `webflow_guide_tool` já foi chamado nesta sessão?
- [ ] A estrutura da página segue a hierarquia core (seção 3.3)?
- [ ] Existe uma utility class reutilizável antes de criar uma nova?
- [ ] Custom class usa `_` (pasta) e utility usa só `-`?
- [ ] Spacing/typography usam as escalas oficiais (3.5–3.7)?
- [ ] Valores em rem, não px?
- [ ] `section_*` tem nome semântico?
- [ ] Layout veio do Figma? Confirme que só entrou **estrutura** (seção 1.1) — nada de
      reproduzir 1:1; sem CSS solto, assets novos ou JS copiado do Figma.
- [ ] Cor/espaçamento/tipografia apontam para **variáveis do Webflow** e utilities — zero
      valores hardcoded (hex/px/rem exatos), mesmo em classe custom (regra de ouro, seção 1.1)?
- [ ] Alguma interação/animação nova? Deve estar em JS local com GSAP + Lenis (seção 5),
      não só no IX nativo.
- [ ] JS/CSS externo aponta pra JSDelivr (prod) ou server local (dev)?
