// ============================================================
// Foppa — JS da página FOPPAMKT
// Compila para dist/js/pages/foppamkt.min.js → servido via JSDelivr.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
	initProjectsHoverImage();
});

// Grid de projetos (.projects-grid > .project-item): cada item tem uma
// .project-item_img absoluta, centrada e com opacity:0 por padrão (definido
// no Designer). Aqui só ligamos a interação: ao passar o mouse (ou focar via
// teclado) num .project-item, a imagem faz fade-in e passa a acompanhar o
// cursor com um leve "lag" (quickTo), soltando o item ela faz fade-out. Tudo
// em transform (x/y/scale) para ficar 100% compositor/GPU, sem reflow.
function initProjectsHoverImage() {
	if (typeof gsap === "undefined") return;

	const grid = document.querySelector(".projects-grid");
	if (!grid) return;

	const items = grid.querySelectorAll(".project-item");
	if (!items.length) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const fadeDuration = reduceMotion ? 0.001 : 0.5;
	const followDuration = reduceMotion ? 0.001 : 0.65;

	items.forEach((item) => {
		const img = item.querySelector(".project-item_img");
		if (!img) return;

		// xPercent/yPercent replicam o translate(-50%, -50%) que já vem do
		// Designer, mas via GSAP — para que x/y (px) fiquem livres para o
		// acompanhamento do mouse sem brigar com o transform do CSS.
		gsap.set(img, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.8, opacity: 0 });

		const moveX = gsap.quickTo(img, "x", { duration: followDuration, ease: "power3" });
		const moveY = gsap.quickTo(img, "y", { duration: followDuration, ease: "power3" });

		const followPointer = (clientX, clientY) => {
			const rect = item.getBoundingClientRect();
			moveX(clientX - (rect.left + rect.width / 2));
			moveY(clientY - (rect.top + rect.height / 2));
		};

		const showImage = () => {
			gsap.to(img, {
				opacity: 1,
				scale: 1,
				duration: fadeDuration,
				ease: "power3.out",
				overwrite: "auto",
			});
		};

		const hideImage = () => {
			gsap.to(img, {
				opacity: 0,
				scale: 0.8,
				duration: fadeDuration,
				ease: "power3.inOut",
				overwrite: "auto",
			});
		};

		item.addEventListener("mouseenter", (event) => {
			followPointer(event.clientX, event.clientY);
			showImage();
		});

		item.addEventListener("mousemove", (event) => {
			followPointer(event.clientX, event.clientY);
		});

		item.addEventListener("mouseleave", hideImage);

		// Foco via teclado (Tab): sem posição de mouse, centraliza a
		// imagem no item mesmo assim, mantendo a interação acessível.
		item.addEventListener("focus", () => {
			moveX(0);
			moveY(0);
			showImage();
		});
		item.addEventListener("blur", hideImage);
	});
}
