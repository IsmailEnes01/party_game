import { Y as __toESM, q as require_react } from "./react-dom-m5QsD6Q8.js";
//#region node_modules/@tanstack/router-core/dist/esm/root.js
/** Stable identifier used for the root route in a route tree. */
var rootRouteId = "__root__";
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/redirect.js
/**
* Create a redirect Response understood by TanStack Router.
*
* Use from route `loader`/`beforeLoad` or server functions to trigger a
* navigation. If `throw: true` is set, the redirect is thrown instead of
* returned. When an absolute `href` is supplied and `reloadDocument` is not
* set, a full-document navigation is inferred.
*
* @param opts Options for the redirect. Common fields:
* - `href`: absolute URL for external redirects; infers `reloadDocument`.
* - `statusCode`: HTTP status code to use (defaults to 307).
* - `headers`: additional headers to include on the Response.
* - Standard navigation options like `to`, `params`, `search`, `replace`,
*   and `reloadDocument` for internal redirects.
* @returns A Response augmented with router navigation options.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/redirectFunction
*/
function redirect(opts) {
	opts.statusCode = opts.statusCode || opts.code || 307;
	if (!opts._builtLocation && !opts.reloadDocument && typeof opts.href === "string") try {
		new URL(opts.href);
		opts.reloadDocument = true;
	} catch {}
	const headers = new Headers(opts.headers);
	if (opts.href && headers.get("Location") === null) headers.set("Location", opts.href);
	const response = new Response(null, {
		status: opts.statusCode,
		headers
	});
	response.options = opts;
	if (opts.throw) throw response;
	return response;
}
/** Check whether a value is a TanStack Router redirect Response. */
/** Check whether a value is a TanStack Router redirect Response. */
function isRedirect(obj) {
	return obj instanceof Response && !!obj.options;
}
/** True if value is a redirect with a resolved `href` location. */
/** True if value is a redirect with a resolved `href` location. */
function isResolvedRedirect(obj) {
	return isRedirect(obj) && !!obj.options.href;
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/matchContext.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var matchContext = import_react.createContext(void 0);
var dummyMatchContext = import_react.createContext(void 0);
//#endregion
//#region src/shared/lib/lobby-code.ts
/** Exactly LOBBY_CODE_LENGTH chars, all from the alphabet (case-sensitive —
* normalize with toUpperCase() before validating user input). */
function isValidLobbyCode(value) {
	return LOBBY_CODE_PATTERN.test(value);
}
var LOBBY_CODE_PATTERN = new RegExp(`^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$`);
//#endregion
export { isResolvedRedirect as a, isRedirect as i, dummyMatchContext as n, redirect as o, matchContext as r, rootRouteId as s, isValidLobbyCode as t };
