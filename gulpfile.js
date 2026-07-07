const { src, watch, dest, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglifycss = require("gulp-uglifycss");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const concat = require("gulp-concat");

// Configuração das bibliotecas de terceiros
// Registre aqui os caminhos das libs quando necessário (ex.: gsap, lenis, swiper).
// GSAP não entra aqui — é carregado via CDN no Custom Code do Webflow (ver CLAUDE.md, seção 5.1).
const libsConfig = {
	js: ["./src/js/lib/lenis.js"],
	css: ["./src/scss/lib/lenis.scss"],
};

// Concatenar e minificar bibliotecas JS → dist/js/libs.min.js
const buildLibsJs = (cb) => {
	if (libsConfig.js.length === 0) {
		console.log("⚠️  Nenhuma biblioteca JS configurada. Pulando buildLibsJs...");
		return cb();
	}
	return src(libsConfig.js, { sourcemaps: true })
		.pipe(concat("libs.js"))
		.pipe(terser())
		.pipe(rename("libs.min.js"))
		.pipe(dest("./dist/js", { sourcemaps: true }));
};

// Compilar bibliotecas SCSS → dist/css/libs.min.css
const buildLibsCss = (cb) => {
	if (libsConfig.css.length === 0) {
		console.log("⚠️  Nenhuma biblioteca CSS configurada. Pulando buildLibsCss...");
		return cb();
	}
	return src(libsConfig.css, { sourcemaps: true })
		.pipe(
			sass({
				api: "modern",
			}).on("error", sass.logError)
		)
		.pipe(concat("libs.css"))
		.pipe(
			uglifycss({
				uglyComments: true,
			})
		)
		.pipe(rename("libs.min.css"))
		.pipe(dest("./dist/css", { sourcemaps: true }));
};

// Compilar SCSS → dist/css/style.min.css
const scssToCss = () => {
	return src("./src/scss/*.scss", { sourcemaps: true })
		.pipe(
			sass({
				api: "modern",
			}).on("error", sass.logError)
		)
		.pipe(concat("style.css"))
		.pipe(
			uglifycss({
				uglyComments: true,
			})
		)
		.pipe(rename("style.min.css"))
		.pipe(dest("./dist/css", { sourcemaps: true }));
};

// Minificar JS global → dist/js/common.min.js
const minifyCommonJs = () => {
	return src("./src/js/common.js", { sourcemaps: true })
		.pipe(terser())
		.pipe(rename("common.min.js"))
		.pipe(dest("./dist/js", { sourcemaps: true }));
};

// Minificar JS das páginas → dist/js/pages/*.min.js
const minifyPagesJs = () => {
	return src("./src/js/pages/*.js", { sourcemaps: true })
		.pipe(terser())
		.pipe(
			rename(function (path) {
				path.basename = path.basename + ".min";
			})
		)
		.pipe(dest("./dist/js/pages", { sourcemaps: true }));
};

// Watch
const watchFiles = () => {
	watch("./src/scss/**/*.scss", scssToCss);
	watch("./src/js/common.js", minifyCommonJs);
	watch("./src/js/pages/*.js", minifyPagesJs);

	if (libsConfig.js.length > 0) {
		watch(libsConfig.js, buildLibsJs);
	}
	if (libsConfig.css.length > 0) {
		watch(libsConfig.css, buildLibsCss);
	}
};

exports.default = series(buildLibsJs, buildLibsCss, scssToCss, minifyCommonJs, minifyPagesJs, watchFiles);
exports.build = series(buildLibsJs, buildLibsCss, scssToCss, minifyCommonJs, minifyPagesJs);
