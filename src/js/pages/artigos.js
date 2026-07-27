// ============================================================
// Foppa — JS da página Artigos (CMS template)
// Compila para dist/js/pages/artigos.min.js → servido via JSDelivr.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
	initArticlePicturesReveal();
});

// Grid masonry das imagens do artigo (.article-pictures_list):
// cada .article-pictures_slide faz fade-up ao entrar no viewport
// (GSAP + ScrollTrigger, já carregados no Custom Code do site).
function initArticlePicturesReveal() {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

	const list = document.querySelector(".article-pictures_list");
	if (!list) return;

	const slides = list.querySelectorAll(".article-pictures_slide");
	if (!slides.length) return;

	gsap.registerPlugin(ScrollTrigger);

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduceMotion) {
		gsap.set(slides, { clearProps: "all" });
		return;
	}

	slides.forEach((slide) => {
		gsap.from(slide, {
			opacity: 0,
			y: 40,
			duration: 0.9,
			ease: "power3.out",
			scrollTrigger: {
				trigger: slide,
				start: "top 88%",
				toggleActions: "play none none none",
				once: true,
			},
		});
	});
}
