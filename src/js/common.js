// ============================================================
// Foppa — JS global (todas as páginas)
// Compila para dist/js/common.min.js → servido via JSDelivr.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
	initLenis();
	initNavTheme();
	initMeetCeoDialog();
});

// Smooth scroll (Lenis) sincronizado com o RAF/ticker do GSAP, para que
// ScrollTrigger e quaisquer animações GSAP fiquem compatíveis com o scroll
// suave. Instanciado uma vez aqui porque roda em todas as páginas do site
// (GSAP + ScrollTrigger são carregados via CDN no Custom Code do site,
// ver CLAUDE.md seção 5.1). Exposto em window.lenis para outras rotinas
// (ex.: dialogs) pausarem/retomarem o scroll suave sem conflitar com ele.
function initLenis() {
	if (typeof Lenis === "undefined") return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const lenis = new Lenis({
		anchors: true,
		autoRaf: typeof gsap === "undefined",
		lerp: reduceMotion ? 1 : 0.1,
		smoothWheel: !reduceMotion,
	});

	window.lenis = lenis;

	if (typeof gsap === "undefined") return;

	if (typeof ScrollTrigger !== "undefined") {
		gsap.registerPlugin(ScrollTrigger);
		lenis.on("scroll", ScrollTrigger.update);
	}

	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});
	gsap.ticker.lagSmoothing(0);
}

// Navbar (.nav_fixed): permanece fixed e alterna Light/Dark conforme a
// cor da seção logo abaixo. Cobre o componente "Navbar" e o "Navbar - MKT"
// (ambos usam .nav_component, mas cada um tem seu w-variant / data-wf mode).
// A CSS publicada também aceita .nav_component.dark para os tokens.
function initNavTheme() {
	const navEntries = [...document.querySelectorAll(".nav_fixed")].flatMap((navFixed) => {
		const nav = navFixed.querySelector(".nav_component");
		if (!nav) return [];
		return [{ navFixed, nav, config: getNavThemeConfig(nav), mode: null }];
	});
	if (!navEntries.length) return;

	const LUMINANCE_THRESHOLD = 0.45;

	const setMode = (entry, mode) => {
		if (mode === entry.mode) return;
		entry.mode = mode;
		const isDark = mode === "dark";
		const { darkVariant, modeAttr } = entry.config;

		entry.nav.classList.toggle("dark", isDark);
		entry.nav.classList.toggle(darkVariant, isDark);
		entry.nav.setAttribute(modeAttr, mode);

		// Filhos que também recebem w-variant no publish (logo, botão,
		// linhas do hamburger) — espelhamos o :where() da CSS gerada.
		entry.navFixed.querySelectorAll(".nav_logo, .nav_button, .hamburger_12_line").forEach((el) => {
			el.classList.toggle(darkVariant, isDark);
		});
	};

	const parseRgb = (value) => {
		const match = value?.match(/rgba?\(([^)]+)\)/i);
		if (!match) return null;
		const parts = match[1].split(",").map((part) => parseFloat(part.trim()));
		const [r, g, b, a = 1] = parts;
		if ([r, g, b].some((n) => Number.isNaN(n)) || a === 0) return null;
		return { r, g, b };
	};

	const relativeLuminance = ({ r, g, b }) => {
		const toLinear = (channel) => {
			const value = channel / 255;
			return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
		};
		const R = toLinear(r);
		const G = toLinear(g);
		const B = toLinear(b);
		return 0.2126 * R + 0.7152 * G + 0.0722 * B;
	};

	const resolveFromElement = (el) => {
		let node = el;
		while (node && node !== document.documentElement) {
			const explicit = node.getAttribute?.("data-nav-mode");
			if (explicit === "light" || explicit === "dark") return explicit;

			const bg = parseRgb(getComputedStyle(node).backgroundColor);
			if (bg) return relativeLuminance(bg) < LUMINANCE_THRESHOLD ? "dark" : "light";

			node = node.parentElement;
		}
		return "light";
	};

	const updateEntry = (entry) => {
		const rect = entry.navFixed.getBoundingClientRect();
		const x = Math.min(Math.max(window.innerWidth * 0.5, 0), window.innerWidth - 1);
		const y = Math.min(Math.max(rect.bottom + 2, 0), window.innerHeight - 1);
		const hit = document.elementsFromPoint(x, y).find((el) => {
			return !entry.navFixed.contains(el) && el !== document.documentElement && el !== document.body;
		});
		if (!hit) return;

		const target = hit.closest("section, footer, [data-nav-mode]") || hit;
		setMode(entry, resolveFromElement(target));
	};

	const update = () => {
		navEntries.forEach(updateEntry);
	};

	let ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			update();
			ticking = false;
		});
	};

	if (window.lenis) window.lenis.on("scroll", onScroll);
	else window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll);
	update();
}

// Mapeia o .nav_component publicado para a variante Dark + attr Mode do
// componente Webflow correspondente (Navbar vs Navbar - MKT).
function getNavThemeConfig(nav) {
	// Navbar - MKT: attr Mode próprio + logo com combo is-mkt.
	// Funciona mesmo quando a instância começa em Light (sem w-variant).
	const isMkt =
		nav.hasAttribute("data-wf--navbar---mkt--mode") ||
		Boolean(nav.querySelector(".nav_logo.is-mkt")) ||
		nav.classList.contains("w-variant-a6c0ab14-a18b-5bad-25df-c551f2807832");

	if (isMkt) {
		return {
			darkVariant: "w-variant-a6c0ab14-a18b-5bad-25df-c551f2807832",
			modeAttr: "data-wf--navbar---mkt--mode",
		};
	}

	return {
		darkVariant: "w-variant-71fd37d1-cb4d-00fa-360e-635deceae661",
		modeAttr: "data-wf--navbar--mode",
	};
}

// Dialog "Meet CEO": componente reutilizável (Webflow Component) presente
// em todas as páginas que usam o Navbar padrão — por isso mora aqui (JS
// global) e não em um arquivo de página específica. A animação de
// fade-up/down (dialog) e fade in/out (::backdrop) é 100% CSS — via
// transition-behavior: allow-discrete + @starting-style
// (src/scss/components/_dialog-meetceo.scss). Aqui só ligamos abrir/fechar,
// sem classes, timers ou transitionend.
function initMeetCeoDialog() {
	const modal = document.getElementById("dialogMeetCeo");
	if (!modal) return;

	const openBtn = document.getElementById("openMeetCeoBtn");
	const closeBtn = document.getElementById("closeMeetCeoBtn");

	// data-lenis-prevent: com o Lenis pausado (lenis.stop(), abaixo), a lib
	// passa a dar preventDefault em QUALQUER wheel/touch fora desse atributo
	// — inclusive dentro do próprio dialog — travando o scroll nativo do
	// dialog.dialog_meetceo. Marcando o <dialog> com esse atributo, o Lenis
	// ignora completamente o scroll dentro dele (checado antes de olhar se
	// está pausado), então o overflow-y:auto nativo volta a funcionar.
	modal.setAttribute("data-lenis-prevent", "");

	// Trava o scroll da página enquanto o dialog está aberto — só o
	// conteúdo interno (dialog.dialog_meetceo, que já tem overflow-y: auto)
	// rola. Além do overflow (que remove a barra de rolagem nativa), pausa
	// o Lenis para não deixar nenhum resquício de scroll suave/inércia
	// "vazar" por baixo do modal. O <dialog> dispara "close" em qualquer
	// forma de fechamento (botão, clique fora, Esc), então destravar ali
	// cobre tudo.
	const lockPageScroll = () => {
		document.documentElement.style.overflow = "hidden";
		if (window.lenis) window.lenis.stop();
	};
	const unlockPageScroll = () => {
		document.documentElement.style.overflow = "";
		if (window.lenis) window.lenis.start();
	};

	const openModal = () => {
		lockPageScroll();
		modal.showModal();
	};
	const closeModal = () => modal.close();

	modal.addEventListener("close", unlockPageScroll);

	// openBtn/closeBtn são <div role="button"> no Webflow, então
	// tratamos Enter/Espaço para manter a ativação por teclado.
	const bindActivation = (el, handler) => {
		if (!el) return;
		el.addEventListener("click", handler);
		el.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handler();
			}
		});
	};

	bindActivation(openBtn, openModal);
	bindActivation(closeBtn, closeModal);

	// Fecha ao clicar fora da caixa de conteúdo. O <dialog> preenche
	// a tela e centraliza o conteúdo via flexbox, então um clique
	// direto nele (não em um filho) equivale a clicar no backdrop.
	modal.addEventListener("click", (event) => {
		if (event.target === modal) closeModal();
	});
}
