// ============================================================
// Foppa — JS da página FOPPA BITES
// Compila para dist/js/pages/foppa-bites.min.js → servido via JSDelivr.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
	initShopNowDialog();
	initNutritionTableDialog();
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
	// Quem abriu o dialogo desta vez (#btnShopNow ou um dos pacotes) — o foco
	// volta pra ele ao fechar, não sempre pro botão da aba.
	let opener = trigger;

	// focus() sem preventScroll (e o scroll-into-view do iOS) faz o overlay
	// ou a página saltarem depois da animação — especialmente no mobile.
	const focusWithoutScroll = (el) => {
		if (!el) return;
		const pageY = window.scrollY;
		const dialogTop = dialog.scrollTop;
		el.focus({ preventScroll: true });
		if (window.scrollY !== pageY) window.scrollTo(0, pageY);
		if (dialog.scrollTop !== dialogTop) dialog.scrollTop = dialogTop;
	};

	const lockPageScroll = () => {
		document.documentElement.style.overflow = "hidden";
		if (window.lenis) window.lenis.stop();
	};
	const unlockPageScroll = () => {
		document.documentElement.style.overflow = "";
		if (window.lenis) window.lenis.start();
	};

	const openDialog = (source) => {
		if (isOpen) return;
		isOpen = true;
		opener = source || trigger;

		if (timeline) timeline.kill();
		activateShopNowTab();
		lockPageScroll();
		dialog.style.display = "flex";
		dialog.scrollTop = 0;
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
		timeline.eventCallback("onComplete", () => focusWithoutScroll(panel));
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
				focusWithoutScroll(opener);
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

	// Os pacotes da seção .s-foopabites-packages (.foopabites-packages_item)
	// também abrem o Shop Now. Diferente do #btnShopNow, eles NÃO são toggle:
	// clicar num pacote sempre abre (fechar continua sendo pelo botão da aba,
	// overlay ou Esc). São <div> comuns, sem semântica interativa nativa — é o
	// JS que os torna clicáveis, então é ele também quem dá papel/foco de
	// botão; se o script não carregar, seguem imagens estáticas em vez de
	// controles quebrados.
	document.querySelectorAll(".foopabites-packages_item").forEach((item) => {
		item.setAttribute("role", "button");
		item.setAttribute("tabindex", "0");
		item.setAttribute("aria-haspopup", "dialog");

		item.addEventListener("click", () => openDialog(item));
		item.addEventListener("keydown", (event) => {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			openDialog(item);
		});
	});

	// Deep link (ex.: item "Shop" do footer, em outra página): a URL chega
	// como /foppa-bites#dialogShopNow — mesmo id do dialog, sem precisar de
	// query param separado. Abre direto e limpa o hash da URL (replaceState)
	// pra não conflitar com o toggle do trigger nem reabrir num refresh.
	if (window.location.hash === "#" + dialog.id) {
		openDialog();
		history.replaceState(null, "", window.location.pathname + window.location.search);
	}

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
// (.foppabites-type_item[data-shop-type]) e a foto correspondente em
// .shop-foppabites_media (.shop-foppabites_img[data-shop-type]) — todos com
// o mesmo valor de data-shop-type. O link "Fale com nosso Concierge" não tem
// data-shop-type e por isso não participa da troca — continua como link
// normal.
// Passar o mouse (ou focar via teclado) troca a pré-visualização; o clique
// NÃO é interceptado — segue o href definido em cada link normalmente.
// Em telas touch (sem hover real, ex.: celular/tablet) não existe "passar o
// mouse", então o toque assume esse papel: o primeiro toque numa opção só
// pré-visualiza (como um hover simulado) e não navega; um segundo toque, já
// com a opção ativa, segue o link normalmente — mesmo padrão usado em menus
// com preview em sites responsivos.
// A classe combo "active" marca visualmente a opção e a foto em
// pré-visualização; o texto da variante entra/sai via GSAP (display + fade).
// O estado inicial (primeiro item ativo) é aplicado pelo próprio JS — ver
// comentário dentro da função —, então nenhum item precisa nascer com
// "active" marcado no Designer.
function initTypeSwitcher(dialog, dur) {
	const panels = Array.from(dialog.querySelectorAll(".foppabites-type_item[data-shop-type]"));
	const images = Array.from(dialog.querySelectorAll(".shop-foppabites_img[data-shop-type]"));
	const optionLinks = Array.from(dialog.querySelectorAll(".foppabites-option_btn[data-shop-type]"));
	if (!panels.length || !optionLinks.length) return { killTimeline: () => {} };

	const getPanel = (type) => panels.find((item) => item.dataset.shopType === type);

	// A variante inicial é sempre a do PRIMEIRO item (ordem do DOM = ordem do
	// CMS). O estado não pode vir da classe "active" marcada no Designer: com
	// os produtos saindo do CMS, todos os itens nascem do mesmo template — ou
	// nenhum tem "active", ou todos têm. Quem manda é este JS, que logo na
	// inicialização aplica a classe no primeiro item e limpa dos demais
	// (setActiveLink/setActiveImage percorrem a lista inteira).
	let activeType = optionLinks[0].dataset.shopType;
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

	const setActiveImage = (type) => {
		images.forEach((img) => {
			img.classList.toggle("active", img.dataset.shopType === type);
		});
	};

	setActiveLink(activeType);
	setActiveImage(activeType);

	const switchTo = (nextType) => {
		if (!nextType || nextType === activeType) return;
		const nextPanel = getPanel(nextType);
		if (!nextPanel) return;
		const currentPanel = getPanel(activeType);

		if (switchTimeline) switchTimeline.kill();
		setActiveLink(nextType);
		setActiveImage(nextType);
		activeType = nextType;

		// kill() de uma timeline anterior pode deixar painéis com display/
		// autoAlpha intermediários. Força exclusividade antes de animar:
		// qualquer painel que não seja o atual nem o próximo some na hora.
		panels.forEach((item) => {
			if (item !== nextPanel && item !== currentPanel) {
				gsap.set(item, { display: "none", autoAlpha: 0, y: 0 });
			}
		});

		switchTimeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
		if (currentPanel && currentPanel !== nextPanel) {
			switchTimeline
				.to(currentPanel, { autoAlpha: 0, y: 8, duration: dur(0.2) })
				.set(currentPanel, { display: "none", y: 0 });
		}
		switchTimeline
			.set(nextPanel, { display: "block", y: 8, autoAlpha: 0 })
			.to(nextPanel, { autoAlpha: 1, y: 0, duration: dur(0.3) });
	};

	// "hover: hover" + "pointer: fine" = dispositivo com mouse/trackpad de
	// verdade. Em telas touch essa media query dá false, então ali o clique
	// vira o gatilho da pré-visualização (ver comentário da função acima).
	const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

	optionLinks.forEach((link) => {
		if (supportsHover) {
			link.addEventListener("mouseenter", () => switchTo(link.dataset.shopType));
		} else {
			link.addEventListener("click", (event) => {
				if (link.dataset.shopType !== activeType) {
					event.preventDefault();
					switchTo(link.dataset.shopType);
				}
			});
		}
		// focus cobre navegação por teclado em qualquer tipo de dispositivo.
		link.addEventListener("focus", () => switchTo(link.dataset.shopType));
	});

	return {
		killTimeline: () => {
			if (switchTimeline) switchTimeline.kill();
		},
	};
}

// Dialog "Tabela Nutricional": substitui os lightboxes nativos do Webflow,
// que só mostravam a imagem da tabela e não aceitavam um rich text abaixo.
// #dialogTable é um <div> comum (mesmo padrão do Shop Now — o Designer já
// cuida do "display: none" e do overlay em position fixed), e dentro dele
// existe um .dialog-table_item[data-table-flavor] por sabor, cada um com a
// imagem da tabela + o rich text. Só o painel do sabor clicado fica visível.
//
// Os gatilhos são os links #btn-table-cacao / #btn-table-damasco /
// #btn-table-nozes, que carregam o mesmo data-table-flavor do painel — é o
// atributo, e não o id, que faz o pareamento (o id fica só como âncora
// histórica/estilo). Cada botão é toggle: clicar de novo no mesmo botão
// fecha; clicar em outro botão com o dialogo aberto troca o sabor exibido.
function initNutritionTableDialog() {
	const dialog = document.getElementById("dialogTable");
	if (!dialog || typeof gsap === "undefined") return;

	const panel = dialog.querySelector(".dialog-table_panel");
	const closeBtn = dialog.querySelector("#btnCloseDialogTable");
	const items = Array.from(dialog.querySelectorAll(".dialog-table_item[data-table-flavor]"));
	const triggers = Array.from(document.querySelectorAll("[data-table-flavor]")).filter(
		(el) => !dialog.contains(el)
	);
	if (!panel || !items.length || !triggers.length) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const dur = (seconds) => (reduceMotion ? 0.001 : seconds);

	// Ver nota em common.js (initMeetCeoDialog): com lenis.stop() ativo, o
	// Lenis bloqueia scroll nativo de qualquer elemento sem esse atributo.
	dialog.setAttribute("data-lenis-prevent", "");

	// O dialogo é um "menu de sabores": os gatilhos anunciam que abrem um
	// dialog, então quem usa leitor de tela sabe o que esperar do clique.
	triggers.forEach((trigger) => trigger.setAttribute("aria-haspopup", "dialog"));

	let isOpen = false;
	let activeFlavor = null;
	let timeline = null;
	let opener = triggers[0];

	// Base fechada: só o painel do sabor ativo é exibido. Como o estado
	// inicial não tem sabor escolhido, todos começam escondidos.
	items.forEach((item) => gsap.set(item, { display: "none", autoAlpha: 0, y: 0 }));

	const getItem = (flavor) => items.find((item) => item.dataset.tableFlavor === flavor);

	// focus() sem preventScroll (e o scroll-into-view do iOS) faz o overlay
	// ou a página saltarem depois da animação — especialmente no mobile.
	const focusWithoutScroll = (el) => {
		if (!el) return;
		const pageY = window.scrollY;
		const dialogTop = dialog.scrollTop;
		el.focus({ preventScroll: true });
		if (window.scrollY !== pageY) window.scrollTo(0, pageY);
		if (dialog.scrollTop !== dialogTop) dialog.scrollTop = dialogTop;
	};

	const lockPageScroll = () => {
		document.documentElement.style.overflow = "hidden";
		if (window.lenis) window.lenis.stop();
	};
	const unlockPageScroll = () => {
		document.documentElement.style.overflow = "";
		if (window.lenis) window.lenis.start();
	};

	// Exclusividade sem animação: usada ao abrir (o fade de entrada é do
	// painel inteiro) e como reset depois de um kill() de timeline.
	const showOnly = (flavor) => {
		items.forEach((item) => {
			const isActive = item === getItem(flavor);
			gsap.set(item, { display: isActive ? "flex" : "none", autoAlpha: isActive ? 1 : 0, y: 0 });
		});
		activeFlavor = flavor;
	};

	// Troca de sabor com o dialogo já aberto: crossfade curto entre painéis,
	// sem reabrir o overlay.
	const switchTo = (flavor) => {
		if (!flavor || flavor === activeFlavor) return;
		const nextItem = getItem(flavor);
		if (!nextItem) return;
		const currentItem = getItem(activeFlavor);

		if (timeline) timeline.kill();
		items.forEach((item) => {
			if (item !== nextItem && item !== currentItem) {
				gsap.set(item, { display: "none", autoAlpha: 0, y: 0 });
			}
		});
		activeFlavor = flavor;

		timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
		if (currentItem && currentItem !== nextItem) {
			timeline
				.to(currentItem, { autoAlpha: 0, y: 8, duration: dur(0.2) })
				.set(currentItem, { display: "none", y: 0 });
		}
		timeline
			.set(nextItem, { display: "flex", y: 8, autoAlpha: 0 })
			.to(nextItem, { autoAlpha: 1, y: 0, duration: dur(0.3) });
	};

	const openDialog = (flavor, source) => {
		if (!getItem(flavor)) return;
		opener = source || opener;

		if (isOpen) {
			switchTo(flavor);
			return;
		}
		isOpen = true;

		if (timeline) timeline.kill();
		showOnly(flavor);
		lockPageScroll();
		dialog.style.display = "flex";
		dialog.scrollTop = 0;
		dialog.setAttribute("aria-hidden", "false");

		gsap.set(dialog, { autoAlpha: 0 });
		gsap.set(panel, { autoAlpha: 0, y: 32, scale: 0.96 });

		timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
		timeline
			.to(dialog, { autoAlpha: 1, duration: dur(0.4) })
			.to(panel, { autoAlpha: 1, y: 0, scale: 1, duration: dur(0.6) }, "-=0.25")
			.eventCallback("onComplete", () => focusWithoutScroll(panel));
	};

	const closeDialog = () => {
		if (!isOpen) return;
		isOpen = false;

		if (timeline) timeline.kill();
		dialog.setAttribute("aria-hidden", "true");

		timeline = gsap.timeline({
			defaults: { ease: "power2.in" },
			onComplete: () => {
				dialog.style.display = "none";
				activeFlavor = null;
				items.forEach((item) => gsap.set(item, { display: "none", autoAlpha: 0, y: 0 }));
				unlockPageScroll();
				focusWithoutScroll(opener);
			},
		});
		timeline
			.to(panel, { autoAlpha: 0, y: 20, scale: 0.97, duration: dur(0.28) })
			.to(dialog, { autoAlpha: 0, duration: dur(0.28) }, "-=0.16");
	};

	triggers.forEach((trigger) => {
		trigger.addEventListener("click", (event) => {
			event.preventDefault();
			const flavor = trigger.dataset.tableFlavor;
			// Toggle só vale pro botão do sabor que já está aberto; um botão
			// diferente troca o conteúdo em vez de fechar.
			if (isOpen && flavor === activeFlavor) {
				closeDialog();
				return;
			}
			openDialog(flavor, trigger);
		});
	});

	if (closeBtn) {
		closeBtn.addEventListener("click", closeDialog);
		closeBtn.addEventListener("keydown", (event) => {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			closeDialog();
		});
	}

	// Clique fora do painel (no overlay) fecha — o overlay preenche a tela e
	// posiciona o painel via flexbox, então um clique direto nele (não em um
	// filho) equivale a clicar fora do conteúdo.
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) closeDialog();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && isOpen) closeDialog();
	});
}

// Accordion do FAQ (.faq-list > .faq-item): cada item tem .faq-item_heading
// (gatilho, role="button" + tabindex setados no Designer) e .faq-item_body
// (painel, já nasce com height:0 + overflow:clip no Designer — a base fechada
// é 100% Client-First, o JS só anima a abertura/fechamento).
// Comportamento: clicar num item fechado abre ele e fecha o que estava aberto
// (só um por vez); clicar no item já aberto apenas fecha. Animação em GSAP:
// altura do painel (0 → "auto", que o GSAP calcula sozinho) + fade/slide sutil
// do texto interno, para o conteúdo "surgir" em vez de só esticar o container.
//
// ⚠️ .faq-item é um Webflow Component ("Collapse", em Global) — todos os itens
// da página são instâncias da MESMA definição, então os atributos do heading
// são obrigatoriamente iguais em todas elas. Por isso o estado inicial NÃO
// pode mais vir de aria-expanded no Designer (marcar "true" ali abriria todos
// os itens de uma vez, e aria-controls/id fixos gerariam ids duplicados no
// HTML). Quem manda no estado é este JS: ele fecha todos, abre só o
// DEFAULT_OPEN_INDEX e escreve aria-expanded + aria-controls/id únicos por
// instância. Na definição do componente o heading fica com
// aria-expanded="false" (base fechada também sem JS).
function initFaqAccordion() {
	const items = Array.from(document.querySelectorAll(".faq-list .faq-item"));
	if (!items.length || typeof gsap === "undefined") return;

	// Índice do item que começa aberto (0 = primeiro). Use -1 para começar
	// com o FAQ inteiro fechado.
	const DEFAULT_OPEN_INDEX = 0;

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

	entries.forEach((entry, index) => {
		// Como o id do body vem da definição do componente, ele se repetiria em
		// todas as instâncias — numera aqui pra manter o par heading/body
		// apontando um pro outro sem id duplicado na página.
		entry.body.id = "faq-body-" + (index + 1);
		entry.heading.setAttribute("aria-controls", entry.body.id);

		const defaultOpen = index === DEFAULT_OPEN_INDEX;
		entry.heading.setAttribute("aria-expanded", defaultOpen ? "true" : "false");
		// gsap.set (e não .to) porque é estado inicial: sem animação, sem flash
		// fechado→aberto.
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
			// Estado vem da referência em memória, não do aria-expanded do DOM:
			// o atributo é compartilhado pela definição do componente e só é
			// confiável depois que este JS o reescreve por instância.
			const isOpen = openEntry === entry;

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
