// ============================================================
// Foppa — JS da página FOPPA BITES
// Compila para dist/js/pages/foppa-bites.min.js → servido via JSDelivr.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
	initShopNowDialog();
	initFaqAccordion();
});

// Dialog "Shop Now": .dialog-shop-foppabites é um <div> comum (não um
// <dialog> nativo) — o Designer já cuida do "display: none" padrão e do
// centering (flex) via classe. Aqui só alternamos display/aria-hidden e
// animamos tudo com GSAP: fade do overlay, entrada do painel e stagger
// dos elementos internos (mídia → variante ativa → opções de compra).
// #btnShopNow funciona como toggle: primeiro clique abre, segundo fecha.
// Ele também é um item de .foppabites-tabs — abrir o dialogo marca ele como
// a aba "active" (removendo de quem estava antes); fechar devolve o
// "active" pra aba anterior. Clicar em outra aba com o dialogo aberto fecha
// o Shop Now antes de seguir a navegação dessa aba.
function initShopNowDialog() {
	const trigger = document.getElementById("btnShopNow");
	const dialog = document.getElementById("dialogShopNow");
	if (!trigger || !dialog || typeof gsap === "undefined") return;

	const panel = dialog.querySelector(".shop-foppabites_panel");
	const media = dialog.querySelector(".shop-foppabites_media");
	const typeContainer = dialog.querySelector(".shop-foppabites_type");
	const optionLinks = dialog.querySelectorAll(".shop-foppabites_options .foppabites-option_link");
	if (!panel) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const dur = (seconds) => (reduceMotion ? 0.001 : seconds);
	const stagger = reduceMotion ? 0 : 0.08;

	// Independente do open/close: já deixa a variante correta visível dentro
	// de typeContainer assim que a página carrega, para não haver flash de
	// conteúdo errado quando o dialogo abrir pela primeira vez.
	const typeSwitcher = initTypeSwitcher(dialog, dur);

	// #btnShopNow é um item de .foppabites-tabs (junto de "Sobre"/"Ingredientes").
	// Ao abrir o dialogo, ele vira a aba "active" (removendo de quem estava antes);
	// ao fechar, devolve o "active" pra aba que estava antes de abrir o dialogo.
	const tabsContainer = trigger.closest(".foppabites-tabs");
	const tabItems = tabsContainer ? Array.from(tabsContainer.querySelectorAll(".foppabites-tabs_item")) : [];
	let previousActiveTab = null;

	const activateShopNowTab = () => {
		if (!tabItems.length) return;
		previousActiveTab = tabItems.find((item) => item !== trigger && item.classList.contains("active")) || null;
		tabItems.forEach((item) => item.classList.toggle("active", item === trigger));
	};

	const restorePreviousTab = () => {
		if (!tabItems.length) return;
		trigger.classList.remove("active");
		if (previousActiveTab) previousActiveTab.classList.add("active");
		previousActiveTab = null;
	};

	// Ver nota em common.js (initMeetCeoDialog): com lenis.stop() ativo, o
	// Lenis bloqueia scroll nativo de qualquer elemento sem esse atributo —
	// marca o dialog inteiro pra manter o scroll interno (se houver overflow)
	// funcionando enquanto a página está travada.
	dialog.setAttribute("data-lenis-prevent", "");

	let isOpen = false;
	let timeline = null;

	const lockPageScroll = () => {
		document.documentElement.style.overflow = "hidden";
		if (window.lenis) window.lenis.stop();
	};
	const unlockPageScroll = () => {
		document.documentElement.style.overflow = "";
		if (window.lenis) window.lenis.start();
	};

	const openDialog = () => {
		if (isOpen) return;
		isOpen = true;

		if (timeline) timeline.kill();
		activateShopNowTab();
		lockPageScroll();
		dialog.style.display = "flex";
		dialog.setAttribute("aria-hidden", "false");

		gsap.set(dialog, { autoAlpha: 0 });
		gsap.set(panel, { autoAlpha: 0, y: 32, scale: 0.96 });
		if (media) gsap.set(media, { autoAlpha: 0, x: -24 });
		if (typeContainer) gsap.set(typeContainer, { autoAlpha: 0, y: 16 });
		if (optionLinks.length) gsap.set(optionLinks, { autoAlpha: 0, y: 16 });

		timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
		timeline.to(dialog, { autoAlpha: 1, duration: dur(0.4) }).to(
			panel,
			{ autoAlpha: 1, y: 0, scale: 1, duration: dur(0.6) },
			"-=0.25"
		);
		if (media) timeline.to(media, { autoAlpha: 1, x: 0, duration: dur(0.55) }, "-=0.4");
		if (typeContainer) timeline.to(typeContainer, { autoAlpha: 1, y: 0, duration: dur(0.5) }, "-=0.4");
		if (optionLinks.length) {
			timeline.to(optionLinks, { autoAlpha: 1, y: 0, duration: dur(0.45), stagger }, "-=0.3");
		}
		timeline.eventCallback("onComplete", () => panel.focus());
	};

	const closeDialog = () => {
		if (!isOpen) return;
		isOpen = false;

		if (timeline) timeline.kill();
		typeSwitcher.killTimeline();
		restorePreviousTab();
		dialog.setAttribute("aria-hidden", "true");

		timeline = gsap.timeline({
			defaults: { ease: "power2.in" },
			onComplete: () => {
				dialog.style.display = "none";
				unlockPageScroll();
				trigger.focus();
			},
		});
		if (optionLinks.length) {
			timeline.to(optionLinks, { autoAlpha: 0, y: 12, duration: dur(0.22), stagger: stagger / 2 });
		}
		const fadeOutTargets = [typeContainer, media].filter(Boolean);
		if (fadeOutTargets.length) {
			timeline.to(fadeOutTargets, { autoAlpha: 0, y: 12, duration: dur(0.22) }, "-=0.12");
		}
		timeline
			.to(panel, { autoAlpha: 0, y: 20, scale: 0.97, duration: dur(0.28) }, "-=0.12")
			.to(dialog, { autoAlpha: 0, duration: dur(0.28) }, "-=0.16");
	};

	trigger.addEventListener("click", (event) => {
		event.preventDefault();
		isOpen ? closeDialog() : openDialog();
	});

	// Clicar em outra aba ("Sobre"/"Ingredientes") com o dialogo aberto fecha
	// o Shop Now antes de seguir a navegação normal da aba (scroll de seção).
	tabItems
		.filter((item) => item !== trigger)
		.forEach((item) => {
			item.addEventListener("click", () => {
				if (isOpen) closeDialog();
			});
		});

	// Clique fora do painel (no overlay) fecha — o overlay preenche a tela
	// e centraliza o painel via flexbox, então um clique direto nele
	// (não em um filho) equivale a clicar fora do conteúdo.
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) closeDialog();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && isOpen) closeDialog();
	});
}

// Seletor de variante do produto dentro do dialog Shop Now: cada opção em
// .shop-foppabites_options (.foppabites-option_link[data-shop-type]) mostra
// o painel correspondente em .shop-foppabites_type
// (.foppabites-type_item[data-shop-type]) com o mesmo valor de data-shop-type.
// O link "Fale com nosso Concierge" não tem data-shop-type e por isso não
// participa da troca — continua como link normal.
// Passar o mouse (ou focar via teclado) troca a pré-visualização; o clique
// NÃO é interceptado — segue o href definido em cada link normalmente.
// A classe combo "active" marca visualmente a opção em pré-visualização.
function initTypeSwitcher(dialog, dur) {
	const panels = Array.from(dialog.querySelectorAll(".foppabites-type_item[data-shop-type]"));
	const optionLinks = Array.from(dialog.querySelectorAll(".foppabites-option_link[data-shop-type]"));
	if (!panels.length || !optionLinks.length) return { killTimeline: () => {} };

	const getPanel = (type) => panels.find((item) => item.dataset.shopType === type);

	const initialLink = optionLinks.find((link) => link.classList.contains("active")) || optionLinks[0];
	let activeType = initialLink.dataset.shopType;
	let switchTimeline = null;

	panels.forEach((item) => {
		const isActive = item.dataset.shopType === activeType;
		gsap.set(item, { display: isActive ? "block" : "none", autoAlpha: isActive ? 1 : 0, y: 0 });
	});

	const setActiveLink = (type) => {
		optionLinks.forEach((link) => {
			link.classList.toggle("active", link.dataset.shopType === type);
		});
	};

	const switchTo = (nextType) => {
		if (!nextType || nextType === activeType) return;
		const nextPanel = getPanel(nextType);
		if (!nextPanel) return;
		const currentPanel = getPanel(activeType);

		if (switchTimeline) switchTimeline.kill();
		setActiveLink(nextType);
		activeType = nextType;

		switchTimeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
		if (currentPanel) {
			switchTimeline
				.to(currentPanel, { autoAlpha: 0, y: 8, duration: dur(0.2) })
				.set(currentPanel, { display: "none" });
		}
		switchTimeline
			.set(nextPanel, { display: "block", y: 8 })
			.to(nextPanel, { autoAlpha: 1, y: 0, duration: dur(0.3) });
	};

	// mouseenter cobre o hover do mouse; focus replica o mesmo comportamento
	// pra navegação por teclado (Tab), já que não há evento de "hover" nativo
	// pra quem não usa mouse.
	optionLinks.forEach((link) => {
		link.addEventListener("mouseenter", () => switchTo(link.dataset.shopType));
		link.addEventListener("focus", () => switchTo(link.dataset.shopType));
	});

	return {
		killTimeline: () => {
			if (switchTimeline) switchTimeline.kill();
		},
	};
}

// Accordion do FAQ (.faq-list > .faq-item): cada item tem .faq-item_heading
// (gatilho, role="button" + aria-expanded setados no Designer) e
// .faq-item_body (painel, já nasce com height:0 + overflow:clip no Designer —
// a base fechada é 100% Client-First, o JS só anima a abertura/fechamento).
// Comportamento: clicar num item fechado abre ele e fecha o que estava aberto
// (só um por vez); clicar no item já aberto apenas fecha. Animação em GSAP:
// altura do painel (0 → "auto", que o GSAP calcula sozinho) + fade/slide sutil
// do texto interno, para o conteúdo "surgir" em vez de só esticar o container.
// O item que já nasce aberto é definido no Designer (aria-expanded="true" no
// heading, hoje o primeiro item) — o JS só lê esse estado inicial e aplica
// sem animação (gsap.set, não .to), pra não haver flash fechado→aberto.
function initFaqAccordion() {
	const items = Array.from(document.querySelectorAll(".faq-list .faq-item"));
	if (!items.length || typeof gsap === "undefined") return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const dur = (seconds) => (reduceMotion ? 0.001 : seconds);

	const entries = items
		.map((item) => {
			const heading = item.querySelector(".faq-item_heading");
			const body = item.querySelector(".faq-item_body");
			const content = body ? body.querySelector(".faq-item_text-block") : null;
			return heading && body ? { heading, body, content, timeline: null } : null;
		})
		.filter(Boolean);

	if (!entries.length) return;

	let openEntry = null;

	entries.forEach((entry) => {
		const defaultOpen = entry.heading.getAttribute("aria-expanded") === "true";
		gsap.set(entry.body, { height: defaultOpen ? "auto" : 0 });
		if (entry.content) gsap.set(entry.content, { autoAlpha: defaultOpen ? 1 : 0, y: defaultOpen ? 0 : -8 });
		if (defaultOpen) openEntry = entry;
	});

	const closeEntry = (entry) => {
		if (entry.timeline) entry.timeline.kill();
		entry.heading.setAttribute("aria-expanded", "false");

		entry.timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
		if (entry.content) {
			entry.timeline.to(entry.content, { autoAlpha: 0, y: -8, duration: dur(0.2) }, 0);
		}
		entry.timeline.to(entry.body, { height: 0, duration: dur(0.45) }, 0);
	};

	const openEntryFn = (entry) => {
		if (entry.timeline) entry.timeline.kill();
		entry.heading.setAttribute("aria-expanded", "true");

		entry.timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
		entry.timeline.to(entry.body, { height: "auto", duration: dur(0.5) }, 0);
		if (entry.content) {
			entry.timeline.to(entry.content, { autoAlpha: 1, y: 0, duration: dur(0.4) }, dur(0.1));
		}
	};

	entries.forEach((entry) => {
		const toggle = () => {
			const isOpen = entry.heading.getAttribute("aria-expanded") === "true";

			if (isOpen) {
				closeEntry(entry);
				openEntry = null;
				return;
			}

			if (openEntry && openEntry !== entry) closeEntry(openEntry);
			openEntry = entry;
			openEntryFn(entry);
		};

		entry.heading.addEventListener("click", toggle);
		entry.heading.addEventListener("keydown", (event) => {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			toggle();
		});
	});
}
