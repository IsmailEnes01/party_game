import { s as require_jsx_runtime } from "./react-dom-m5QsD6Q8.js";
import { t as Link } from "./link-cNPqqV-U.js";
import { a as BRAND, i as cn, n as gamesList } from "./-catalog-BvomSuJh.js";
//#region src/shared/ui/card.tsx
var import_jsx_runtime = require_jsx_runtime();
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card",
		className: cn("flex flex-col gap-4 rounded-xl border bg-card py-4 text-card-foreground shadow-sm", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-header",
		className: cn("flex flex-col gap-1 px-4", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-title",
		className: cn("font-semibold leading-none", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-content",
		className: cn("px-4", className),
		...props
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-svh w-full max-w-5xl flex-col items-center gap-12 px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col items-center gap-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-6xl font-black tracking-tight sm:text-7xl",
					children: [BRAND, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-lg text-muted-foreground",
					children: "İki kişilik oyunlar: lobi kur, kodu arkadaşına gönder, hemen oyna. Kayıt yok, kurulum yok."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			"aria-label": "Oyunlar",
			className: "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: gamesList.map(({ def }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, { meta: def.meta }, def.meta.id))
		})]
	});
}
function GameCard({ meta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/oyun/$gameId",
		params: { gameId: meta.id },
		className: "group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-full gap-3 transition-all group-hover:-translate-y-1 group-hover:shadow-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "flex size-12 items-center justify-center rounded-xl bg-accent text-3xl transition-transform group-hover:scale-110",
						children: meta.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-lg",
						children: meta.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: meta.tagline })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "mt-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
					children: "Oyna →"
				})
			})]
		})
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		className: "flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				number: 1,
				label: "Lobi kur"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: "→"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				number: 2,
				label: "Kodu paylaş"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: "→"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				number: 3,
				label: "Oyna"
			})
		]
	});
}
function Step({ number, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-5 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary",
			children: number
		}), label]
	});
}
//#endregion
export { HomePage as component };
