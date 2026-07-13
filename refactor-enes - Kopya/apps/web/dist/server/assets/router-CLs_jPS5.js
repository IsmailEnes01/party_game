import { A as deepEqual, M as escapeHtml, Y as __toESM, n as useStore, o as useHydrated, q as require_react, r as useRouter, s as require_jsx_runtime } from "./react-dom-m5QsD6Q8.js";
import { a as getAssetCrossOrigin, c as resolveManifestAssetLink, f as createNonReactiveMutableStore, l as RouterCore, p as createNonReactiveReadonlyStore, s as isInlinableStylesheet } from "./atom-jEES-w-K.js";
import { i as createRootRoute, n as lazyRouteComponent, r as createFileRoute, t as Route$2 } from "./oyun._gameId-D2wlTnox.js";
//#region node_modules/@tanstack/react-router/dist/esm/routerStores.js
var getStoreFactory = (opts) => {
	return {
		createMutableStore: createNonReactiveMutableStore,
		createReadonlyStore: createNonReactiveReadonlyStore,
		batch: (fn) => fn()
	};
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/router.js
/**
* Creates a new Router instance for React.
*
* Pass the returned router to `RouterProvider` to enable routing.
* Notable options: `routeTree` (your route definitions) and `context`
* (required if the root route was created with `createRootRouteWithContext`).
*
* @param options Router options used to configure the router.
* @returns A Router instance to be provided to `RouterProvider`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouterFunction
*/
var createRouter = (options) => {
	return new Router(options);
};
var Router = class extends RouterCore {
	constructor(options) {
		super(options, getStoreFactory);
	}
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Asset.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function Asset(asset) {
	const { attrs, children, nonce } = asset;
	switch (asset.tag) {
		case "title": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", {
			...attrs,
			suppressHydrationWarning: true,
			children
		});
		case "meta": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			...attrs,
			suppressHydrationWarning: true
		});
		case "link": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			...attrs,
			precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
			nonce,
			suppressHydrationWarning: true
		});
		case "style":
			if (asset.inlineCss && false);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
				...attrs,
				dangerouslySetInnerHTML: { __html: children },
				nonce
			});
		case "script": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Script, {
			attrs,
			children
		});
		default: return null;
	}
}
function Script({ attrs, children }) {
	useRouter();
	useHydrated();
	const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
	import_react.useEffect(() => {
		if (dataScript) return;
		if (attrs?.src) {
			const normSrc = (() => {
				try {
					const base = document.baseURI || window.location.href;
					return new URL(attrs.src, base).href;
				} catch {
					return attrs.src;
				}
			})();
			if (Array.from(document.querySelectorAll("script[src]")).find((el) => el.src === normSrc)) return;
			const script = document.createElement("script");
			for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
			document.head.appendChild(script);
			return () => {
				if (script.parentNode) script.parentNode.removeChild(script);
			};
		}
		if (typeof children === "string") {
			const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
			const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
			if (Array.from(document.querySelectorAll("script:not([src])")).find((el) => {
				if (!(el instanceof HTMLScriptElement)) return false;
				const sType = el.getAttribute("type") ?? "text/javascript";
				const sNonce = el.getAttribute("nonce") ?? void 0;
				return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
			})) return;
			const script = document.createElement("script");
			script.textContent = children;
			if (attrs) {
				for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
			}
			document.head.appendChild(script);
			return () => {
				if (script.parentNode) script.parentNode.removeChild(script);
			};
		}
	}, [
		attrs,
		children,
		dataScript
	]);
	if (attrs?.src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		...attrs,
		suppressHydrationWarning: true
	});
	if (typeof children === "string") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		...attrs,
		dangerouslySetInnerHTML: { __html: children },
		suppressHydrationWarning: true
	});
	return null;
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/headContentUtils.js
function buildTagsFromMatches(router, nonce, matches, assetCrossOrigin) {
	const routeMeta = matches.map((match) => match.meta).filter(Boolean);
	const resultMeta = [];
	const metaByAttribute = {};
	let title;
	for (let i = routeMeta.length - 1; i >= 0; i--) {
		const metas = routeMeta[i];
		for (let j = metas.length - 1; j >= 0; j--) {
			const m = metas[j];
			if (!m) continue;
			if (m.title) {
				if (!title) title = {
					tag: "title",
					children: m.title
				};
			} else if ("script:ld+json" in m) try {
				const json = JSON.stringify(m["script:ld+json"]);
				resultMeta.push({
					tag: "script",
					attrs: { type: "application/ld+json" },
					children: escapeHtml(json)
				});
			} catch {}
			else {
				const attribute = m.name ?? m.property;
				if (attribute) if (metaByAttribute[attribute]) continue;
				else metaByAttribute[attribute] = true;
				resultMeta.push({
					tag: "meta",
					attrs: {
						...m,
						nonce
					}
				});
			}
		}
	}
	if (title) resultMeta.push(title);
	if (nonce) resultMeta.push({
		tag: "meta",
		attrs: {
			property: "csp-nonce",
			content: nonce
		}
	});
	resultMeta.reverse();
	const constructedLinks = matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
		tag: "link",
		attrs: {
			...link,
			nonce
		}
	}));
	const manifest = router.ssr?.manifest;
	const assetLinks = matches.map((match) => manifest?.routes[match.routeId]?.assets ?? []).filter(Boolean).flat(1).flatMap((asset) => {
		if (asset.tag === "link") {
			if (isInlinableStylesheet(manifest, asset)) return [];
			return [{
				tag: "link",
				attrs: {
					...asset.attrs,
					crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? asset.attrs?.crossOrigin,
					suppressHydrationWarning: true,
					nonce
				}
			}];
		}
		if (asset.tag === "style") return [{
			tag: "style",
			attrs: {
				...asset.attrs,
				nonce
			},
			children: asset.children,
			...asset.inlineCss ? { inlineCss: true } : {}
		}];
		return [];
	});
	const preloadLinks = [];
	matches.map((match) => router.looseRoutesById[match.routeId]).forEach((route) => router.ssr?.manifest?.routes[route.id]?.preloads?.filter(Boolean).forEach((preload) => {
		const preloadLink = resolveManifestAssetLink(preload);
		preloadLinks.push({
			tag: "link",
			attrs: {
				rel: "modulepreload",
				href: preloadLink.href,
				crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "modulepreload") ?? preloadLink.crossOrigin,
				nonce
			}
		});
	}));
	const styles = matches.map((match) => match.styles).flat(1).filter(Boolean).map(({ children, ...attrs }) => ({
		tag: "style",
		attrs: {
			...attrs,
			nonce
		},
		children
	}));
	const headScripts = matches.map((match) => match.headScripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			nonce
		},
		children
	}));
	return uniqBy([
		...resultMeta,
		...preloadLinks,
		...constructedLinks,
		...assetLinks,
		...styles,
		...headScripts
	], (d) => JSON.stringify(d));
}
/**
* Build the list of head/link/meta/script tags to render for active matches.
* Used internally by `HeadContent`.
*/
var useTags = (assetCrossOrigin) => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	return buildTagsFromMatches(router, nonce, router.stores.matches.get(), assetCrossOrigin);
};
function uniqBy(arr, fn) {
	const seen = /* @__PURE__ */ new Set();
	return arr.filter((item) => {
		const key = fn(item);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/HeadContent.js
/**
* Render route-managed head tags (title, meta, links, styles, head scripts).
* Place inside the document head of your app shell.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management
*/
function HeadContent(props) {
	const tags = useTags(props.assetCrossOrigin);
	const nonce = useRouter().options.ssr?.nonce;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: tags.map((tag) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...tag,
		key: `tsr-meta-${JSON.stringify(tag)}`,
		nonce
	})) });
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Scripts.js
/**
* Render body script tags collected from route matches and SSR manifests.
* Should be placed near the end of the document body.
*/
var Scripts = () => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const getAssetScripts = (matches) => {
		const assetScripts = [];
		const manifest = router.ssr?.manifest;
		if (!manifest) return [];
		matches.map((match) => router.looseRoutesById[match.routeId]).forEach((route) => manifest.routes[route.id]?.assets?.filter((d) => d.tag === "script").forEach((asset) => {
			assetScripts.push({
				tag: "script",
				attrs: {
					...asset.attrs,
					nonce
				},
				children: asset.children
			});
		}));
		return assetScripts;
	};
	const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			suppressHydrationWarning: true,
			nonce
		},
		children
	}));
	{
		const activeMatches = router.stores.matches.get();
		const assetScripts = getAssetScripts(activeMatches);
		return renderScripts(router, getScripts(activeMatches), assetScripts);
	}
	const assetScripts = useStore(router.stores.matches, getAssetScripts, deepEqual);
	return renderScripts(router, useStore(router.stores.matches, getScripts, deepEqual), assetScripts);
};
function renderScripts(router, scripts, assetScripts) {
	let serverBufferedScript = void 0;
	if (router.serverSsr) serverBufferedScript = router.serverSsr.takeBufferedScripts();
	const allScripts = [...scripts, ...assetScripts];
	if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...asset,
		key: `tsr-scripts-${asset.tag}-${i}`
	})) });
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-DmQHvQsd.css";
//#endregion
//#region src/routes/__root.tsx
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lobi" }
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "tr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-0bhYz0m6.js");
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") }).update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$1
	}),
	OyunGameIdRoute: Route$2.update({
		id: "/oyun/$gameId",
		path: "/oyun/$gameId",
		getParentRoute: () => Route$1
	})
};
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		defaultPreload: "intent"
	});
};
//#endregion
export { getRouter };
