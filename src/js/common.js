// ============================================================
// Foppa — JS global (todas as páginas)
// Compila para dist/js/common.min.js → servido via JSDelivr.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
	initLenis();
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
