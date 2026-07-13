import { Y as __toESM, q as require_react, s as require_jsx_runtime } from "./react-dom-m5QsD6Q8.js";
//#region src/shared/lib/seeded-rng.ts
/**
* Deterministic 32-bit RNG (mulberry32). Both players derive ALL game
* randomness (ship placement, hangman word, first turn…) from the room seed
* through this generator — never `Math.random()` in game code — so lockstep
* states cannot diverge.
*/
function mulberry32(seed) {
	let state = seed >>> 0;
	return () => {
		state = state + 1831565813 >>> 0;
		let t = state;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
/** Uniform integer in `[0, length)` — seeded picks out of arrays. */
function pickIndex(rng, length) {
	if (!Number.isInteger(length) || length <= 0) throw new RangeError(`pickIndex needs a positive length, got ${length}`);
	return Math.floor(rng() * length);
}
//#endregion
//#region src/shared/config/brand.ts
/** Wordmark for headers and the home hero. */
var BRAND = "Lobi";
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/tailwind-merge/dist/bundle-mjs.mjs
/**
* Concatenates two arrays faster than the array spread operator.
*/
var concatArrays = (array1, array2) => {
	const combinedArray = new Array(array1.length + array2.length);
	for (let i = 0; i < array1.length; i++) combinedArray[i] = array1[i];
	for (let i = 0; i < array2.length; i++) combinedArray[array1.length + i] = array2[i];
	return combinedArray;
};
var createClassValidatorObject = (classGroupId, validator) => ({
	classGroupId,
	validator
});
var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
	nextPart,
	validators,
	classGroupId
});
var CLASS_PART_SEPARATOR = "-";
var EMPTY_CONFLICTS = [];
var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
var createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		if (className.startsWith("[") && className.endsWith("]")) return getGroupIdForArbitraryProperty(className);
		const classParts = className.split(CLASS_PART_SEPARATOR);
		return getGroupRecursive(classParts, classParts[0] === "" && classParts.length > 1 ? 1 : 0, classMap);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		if (hasPostfixModifier) {
			const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
			const baseConflicts = conflictingClassGroups[classGroupId];
			if (modifierConflicts) {
				if (baseConflicts) return concatArrays(baseConflicts, modifierConflicts);
				return modifierConflicts;
			}
			return baseConflicts || EMPTY_CONFLICTS;
		}
		return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
var getGroupRecursive = (classParts, startIndex, classPartObject) => {
	if (classParts.length - startIndex === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[startIndex];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	if (nextClassPartObject) {
		const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
		if (result) return result;
	}
	const validators = classPartObject.validators;
	if (validators === null) return;
	const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
	const validatorsLength = validators.length;
	for (let i = 0; i < validatorsLength; i++) {
		const validatorObj = validators[i];
		if (validatorObj.validator(classRest)) return validatorObj.classGroupId;
	}
};
/**
* Get the class group ID for an arbitrary property.
*
* @param className - The class name to get the group ID for. Is expected to be string starting with `[` and ending with `]`.
*/
var getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	const content = className.slice(1, -1);
	const colonIndex = content.indexOf(":");
	const property = content.slice(0, colonIndex);
	return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
})();
/**
* Exported for testing only
*/
var createClassMap = (config) => {
	const { theme, classGroups } = config;
	return processClassGroups(classGroups, theme);
};
var processClassGroups = (classGroups, theme) => {
	const classMap = createClassPartObject();
	for (const classGroupId in classGroups) {
		const group = classGroups[classGroupId];
		processClassesRecursively(group, classMap, classGroupId, theme);
	}
	return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	const len = classGroup.length;
	for (let i = 0; i < len; i++) {
		const classDefinition = classGroup[i];
		processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
	}
};
var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (typeof classDefinition === "string") {
		processStringDefinition(classDefinition, classPartObject, classGroupId);
		return;
	}
	if (typeof classDefinition === "function") {
		processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
		return;
	}
	processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
	const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
	classPartObjectToEdit.classGroupId = classGroupId;
};
var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (isThemeGetter(classDefinition)) {
		processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
		return;
	}
	if (classPartObject.validators === null) classPartObject.validators = [];
	classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	const entries = Object.entries(classDefinition);
	const len = entries.length;
	for (let i = 0; i < len; i++) {
		const [key, value] = entries[i];
		processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
	}
};
var getPart = (classPartObject, path) => {
	let current = classPartObject;
	const parts = path.split(CLASS_PART_SEPARATOR);
	const len = parts.length;
	for (let i = 0; i < len; i++) {
		const part = parts[i];
		let next = current.nextPart.get(part);
		if (!next) {
			next = createClassPartObject();
			current.nextPart.set(part, next);
		}
		current = next;
	}
	return current;
};
var isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
var createLruCache = (maxCacheSize) => {
	if (maxCacheSize < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let cacheSize = 0;
	let cache = Object.create(null);
	let previousCache = Object.create(null);
	const update = (key, value) => {
		cache[key] = value;
		cacheSize++;
		if (cacheSize > maxCacheSize) {
			cacheSize = 0;
			previousCache = cache;
			cache = Object.create(null);
		}
	};
	return {
		get(key) {
			let value = cache[key];
			if (value !== void 0) return value;
			if ((value = previousCache[key]) !== void 0) {
				update(key, value);
				return value;
			}
		},
		set(key, value) {
			if (key in cache) cache[key] = value;
			else update(key, value);
		}
	};
};
var IMPORTANT_MODIFIER = "!";
var MODIFIER_SEPARATOR = ":";
var EMPTY_MODIFIERS = [];
var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
	modifiers,
	hasImportantModifier,
	baseClassName,
	maybePostfixModifierPosition,
	isExternal
});
var createParseClassName = (config) => {
	const { prefix, experimentalParseClassName } = config;
	/**
	* Parse class name into parts.
	*
	* Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
	* @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
	*/
	let parseClassName = (className) => {
		const modifiers = [];
		let bracketDepth = 0;
		let parenDepth = 0;
		let modifierStart = 0;
		let postfixModifierPosition;
		const len = className.length;
		for (let index = 0; index < len; index++) {
			const currentCharacter = className[index];
			if (bracketDepth === 0 && parenDepth === 0) {
				if (currentCharacter === MODIFIER_SEPARATOR) {
					modifiers.push(className.slice(modifierStart, index));
					modifierStart = index + 1;
					continue;
				}
				if (currentCharacter === "/") {
					postfixModifierPosition = index;
					continue;
				}
			}
			if (currentCharacter === "[") bracketDepth++;
			else if (currentCharacter === "]") bracketDepth--;
			else if (currentCharacter === "(") parenDepth++;
			else if (currentCharacter === ")") parenDepth--;
		}
		const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
		let baseClassName = baseClassNameWithImportantModifier;
		let hasImportantModifier = false;
		if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
			hasImportantModifier = true;
		} else if (baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(1);
			hasImportantModifier = true;
		}
		const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
		return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
	};
	if (prefix) {
		const fullPrefix = prefix + MODIFIER_SEPARATOR;
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
	}
	if (experimentalParseClassName) {
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => experimentalParseClassName({
			className,
			parseClassName: parseClassNameOriginal
		});
	}
	return parseClassName;
};
/**
* Sorts modifiers according to following schema:
* - Predefined modifiers are sorted alphabetically
* - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
*/
var createSortModifiers = (config) => {
	const modifierWeights = /* @__PURE__ */ new Map();
	config.orderSensitiveModifiers.forEach((mod, index) => {
		modifierWeights.set(mod, 1e6 + index);
	});
	return (modifiers) => {
		const result = [];
		let currentSegment = [];
		for (let i = 0; i < modifiers.length; i++) {
			const modifier = modifiers[i];
			const isArbitrary = modifier[0] === "[";
			const isOrderSensitive = modifierWeights.has(modifier);
			if (isArbitrary || isOrderSensitive) {
				if (currentSegment.length > 0) {
					currentSegment.sort();
					result.push(...currentSegment);
					currentSegment = [];
				}
				result.push(modifier);
			} else currentSegment.push(modifier);
		}
		if (currentSegment.length > 0) {
			currentSegment.sort();
			result.push(...currentSegment);
		}
		return result;
	};
};
var createConfigUtils = (config) => ({
	cache: createLruCache(config.cacheSize),
	parseClassName: createParseClassName(config),
	sortModifiers: createSortModifiers(config),
	postfixLookupClassGroupIds: createPostfixLookupClassGroupIds(config),
	...createClassGroupUtils(config)
});
var createPostfixLookupClassGroupIds = (config) => {
	const lookup = Object.create(null);
	const classGroupIds = config.postfixLookupClassGroups;
	if (classGroupIds) for (let i = 0; i < classGroupIds.length; i++) lookup[classGroupIds[i]] = true;
	return lookup;
};
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
	const { parseClassName, getClassGroupId, getConflictingClassGroupIds, sortModifiers, postfixLookupClassGroupIds } = configUtils;
	/**
	* Set of classGroupIds in following format:
	* `{importantModifier}{variantModifiers}{classGroupId}`
	* @example 'float'
	* @example 'hover:focus:bg-color'
	* @example 'md:!pr'
	*/
	const classGroupsInConflict = [];
	const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
	let result = "";
	for (let index = classNames.length - 1; index >= 0; index -= 1) {
		const originalClassName = classNames[index];
		const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		if (isExternal) {
			result = originalClassName + (result.length > 0 ? " " + result : result);
			continue;
		}
		let hasPostfixModifier = !!maybePostfixModifierPosition;
		let classGroupId;
		if (hasPostfixModifier) {
			classGroupId = getClassGroupId(baseClassName.substring(0, maybePostfixModifierPosition));
			const classGroupIdWithPostfix = classGroupId && postfixLookupClassGroupIds[classGroupId] ? getClassGroupId(baseClassName) : void 0;
			if (classGroupIdWithPostfix && classGroupIdWithPostfix !== classGroupId) {
				classGroupId = classGroupIdWithPostfix;
				hasPostfixModifier = false;
			}
		} else classGroupId = getClassGroupId(baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			hasPostfixModifier = false;
		}
		const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
		const classId = modifierId + classGroupId;
		if (classGroupsInConflict.indexOf(classId) > -1) continue;
		classGroupsInConflict.push(classId);
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		for (let i = 0; i < conflictGroups.length; ++i) {
			const group = conflictGroups[i];
			classGroupsInConflict.push(modifierId + group);
		}
		result = originalClassName + (result.length > 0 ? " " + result : result);
	}
	return result;
};
/**
* The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
*
* Specifically:
* - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
* - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
*
* Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
*/
var twJoin = (...classLists) => {
	let index = 0;
	let argument;
	let resolvedValue;
	let string = "";
	while (index < classLists.length) if (argument = classLists[index++]) {
		if (resolvedValue = toValue(argument)) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var toValue = (mix) => {
	if (typeof mix === "string") return mix;
	let resolvedValue;
	let string = "";
	for (let k = 0; k < mix.length; k++) if (mix[k]) {
		if (resolvedValue = toValue(mix[k])) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
	let configUtils;
	let cacheGet;
	let cacheSet;
	let functionToCall;
	const initTailwindMerge = (classList) => {
		configUtils = createConfigUtils(createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst()));
		cacheGet = configUtils.cache.get;
		cacheSet = configUtils.cache.set;
		functionToCall = tailwindMerge;
		return tailwindMerge(classList);
	};
	const tailwindMerge = (classList) => {
		const cachedResult = cacheGet(classList);
		if (cachedResult) return cachedResult;
		const result = mergeClassList(classList, configUtils);
		cacheSet(classList, result);
		return result;
	};
	functionToCall = initTailwindMerge;
	return (...args) => functionToCall(twJoin(...args));
};
var fallbackThemeArr = [];
var fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || fallbackThemeArr;
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isFraction = (value) => fractionRegex.test(value);
var isNumber = (value) => !!value && !Number.isNaN(Number(value));
var isInteger = (value) => !!value && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var isAny = () => true;
var isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
var isNamedContainerQuery = (value) => value.startsWith("@container") && (value[10] === "/" && value[11] !== void 0 || value[11] === "s" && value[16] !== void 0 && value.startsWith("-size/", 10) || value[11] === "n" && value[18] !== void 0 && value.startsWith("-normal/", 10));
var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
var isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
var isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
var isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
var getIsArbitraryValue = (value, testLabel, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return testValue(result[2]);
	}
	return false;
};
var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
	const result = arbitraryVariableRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return shouldMatchNoLabel;
	}
	return false;
};
var isLabelPosition = (label) => label === "position" || label === "percentage";
var isLabelImage = (label) => label === "image" || label === "url";
var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
var isLabelLength = (label) => label === "length";
var isLabelNumber = (label) => label === "number";
var isLabelFamilyName = (label) => label === "family-name";
var isLabelWeight = (label) => label === "number" || label === "weight";
var isLabelShadow = (label) => label === "shadow";
var getDefaultConfig = () => {
	/**
	* Theme getters for theme variable namespaces
	* @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
	*/
	const themeColor = fromTheme("color");
	const themeFont = fromTheme("font");
	const themeText = fromTheme("text");
	const themeFontWeight = fromTheme("font-weight");
	const themeTracking = fromTheme("tracking");
	const themeLeading = fromTheme("leading");
	const themeBreakpoint = fromTheme("breakpoint");
	const themeContainer = fromTheme("container");
	const themeSpacing = fromTheme("spacing");
	const themeRadius = fromTheme("radius");
	const themeShadow = fromTheme("shadow");
	const themeInsetShadow = fromTheme("inset-shadow");
	const themeTextShadow = fromTheme("text-shadow");
	const themeDropShadow = fromTheme("drop-shadow");
	const themeBlur = fromTheme("blur");
	const themePerspective = fromTheme("perspective");
	const themeAspect = fromTheme("aspect");
	const themeEase = fromTheme("ease");
	const themeAnimate = fromTheme("animate");
	/**
	* Helpers to avoid repeating the same scales
	*
	* We use functions that create a new array every time they're called instead of static arrays.
	* This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
	*/
	const scaleBreak = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const scalePosition = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	];
	const scalePositionWithArbitrary = () => [
		...scalePosition(),
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const scaleOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const scaleUnambiguousSpacing = () => [
		isArbitraryVariable,
		isArbitraryValue,
		themeSpacing
	];
	const scaleInset = () => [
		isFraction,
		"full",
		"auto",
		...scaleUnambiguousSpacing()
	];
	const scaleGridTemplateColsRows = () => [
		isInteger,
		"none",
		"subgrid",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartAndEnd = () => [
		"auto",
		{ span: [
			"full",
			isInteger,
			isArbitraryVariable,
			isArbitraryValue
		] },
		isInteger,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartOrEnd = () => [
		isInteger,
		"auto",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridAutoColsRows = () => [
		"auto",
		"min",
		"max",
		"fr",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleAlignPrimaryAxis = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	];
	const scaleAlignSecondaryAxis = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	];
	const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
	const scaleSizing = () => [
		isFraction,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingInline = () => [
		isFraction,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingBlock = () => [
		isFraction,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleColor = () => [
		themeColor,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBgPosition = () => [
		...scalePosition(),
		isArbitraryVariablePosition,
		isArbitraryPosition,
		{ position: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleBgRepeat = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }];
	const scaleBgSize = () => [
		"auto",
		"cover",
		"contain",
		isArbitraryVariableSize,
		isArbitrarySize,
		{ size: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleGradientStopPosition = () => [
		isPercent,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleRadius = () => [
		"",
		"none",
		"full",
		themeRadius,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBorderWidth = () => [
		"",
		isNumber,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleLineStyle = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	];
	const scaleBlendMode = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const scaleMaskImagePosition = () => [
		isNumber,
		isPercent,
		isArbitraryVariablePosition,
		isArbitraryPosition
	];
	const scaleBlur = () => [
		"",
		"none",
		themeBlur,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleRotate = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleScale = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleSkew = () => [
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleTranslate = () => [
		isFraction,
		"full",
		...scaleUnambiguousSpacing()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [isTshirtSize],
			breakpoint: [isTshirtSize],
			color: [isAny],
			container: [isTshirtSize],
			"drop-shadow": [isTshirtSize],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [isAnyNonArbitrary],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [isTshirtSize],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [isTshirtSize],
			shadow: [isTshirtSize],
			spacing: ["px", isNumber],
			text: [isTshirtSize],
			"text-shadow": [isTshirtSize],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			/**
			* Aspect Ratio
			* @see https://tailwindcss.com/docs/aspect-ratio
			*/
			aspect: [{ aspect: [
				"auto",
				"square",
				isFraction,
				isArbitraryValue,
				isArbitraryVariable,
				themeAspect
			] }],
			/**
			* Container
			* @see https://tailwindcss.com/docs/container
			* @deprecated since Tailwind CSS v4.0.0
			*/
			container: ["container"],
			/**
			* Container Type
			* @see https://tailwindcss.com/docs/responsive-design#container-queries
			*/
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Container Name
			* @see https://tailwindcss.com/docs/responsive-design#named-containers
			*/
			"container-named": [isNamedContainerQuery],
			/**
			* Columns
			* @see https://tailwindcss.com/docs/columns
			*/
			columns: [{ columns: [
				isNumber,
				isArbitraryValue,
				isArbitraryVariable,
				themeContainer
			] }],
			/**
			* Break After
			* @see https://tailwindcss.com/docs/break-after
			*/
			"break-after": [{ "break-after": scaleBreak() }],
			/**
			* Break Before
			* @see https://tailwindcss.com/docs/break-before
			*/
			"break-before": [{ "break-before": scaleBreak() }],
			/**
			* Break Inside
			* @see https://tailwindcss.com/docs/break-inside
			*/
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			/**
			* Box Decoration Break
			* @see https://tailwindcss.com/docs/box-decoration-break
			*/
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			/**
			* Box Sizing
			* @see https://tailwindcss.com/docs/box-sizing
			*/
			box: [{ box: ["border", "content"] }],
			/**
			* Display
			* @see https://tailwindcss.com/docs/display
			*/
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			/**
			* Screen Reader Only
			* @see https://tailwindcss.com/docs/display#screen-reader-only
			*/
			sr: ["sr-only", "not-sr-only"],
			/**
			* Floats
			* @see https://tailwindcss.com/docs/float
			*/
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			/**
			* Clear
			* @see https://tailwindcss.com/docs/clear
			*/
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			/**
			* Isolation
			* @see https://tailwindcss.com/docs/isolation
			*/
			isolation: ["isolate", "isolation-auto"],
			/**
			* Object Fit
			* @see https://tailwindcss.com/docs/object-fit
			*/
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			/**
			* Object Position
			* @see https://tailwindcss.com/docs/object-position
			*/
			"object-position": [{ object: scalePositionWithArbitrary() }],
			/**
			* Overflow
			* @see https://tailwindcss.com/docs/overflow
			*/
			overflow: [{ overflow: scaleOverflow() }],
			/**
			* Overflow X
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-x": [{ "overflow-x": scaleOverflow() }],
			/**
			* Overflow Y
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-y": [{ "overflow-y": scaleOverflow() }],
			/**
			* Overscroll Behavior
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			overscroll: [{ overscroll: scaleOverscroll() }],
			/**
			* Overscroll Behavior X
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-x": [{ "overscroll-x": scaleOverscroll() }],
			/**
			* Overscroll Behavior Y
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-y": [{ "overscroll-y": scaleOverscroll() }],
			/**
			* Position
			* @see https://tailwindcss.com/docs/position
			*/
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			/**
			* Inset
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			inset: [{ inset: scaleInset() }],
			/**
			* Inset Inline
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-x": [{ "inset-x": scaleInset() }],
			/**
			* Inset Block
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-y": [{ "inset-y": scaleInset() }],
			/**
			* Inset Inline Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-s` in next major release
			*/
			start: [{
				"inset-s": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				start: scaleInset()
			}],
			/**
			* Inset Inline End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-e` in next major release
			*/
			end: [{
				"inset-e": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				end: scaleInset()
			}],
			/**
			* Inset Block Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-bs": [{ "inset-bs": scaleInset() }],
			/**
			* Inset Block End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-be": [{ "inset-be": scaleInset() }],
			/**
			* Top
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			top: [{ top: scaleInset() }],
			/**
			* Right
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			right: [{ right: scaleInset() }],
			/**
			* Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			bottom: [{ bottom: scaleInset() }],
			/**
			* Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			left: [{ left: scaleInset() }],
			/**
			* Visibility
			* @see https://tailwindcss.com/docs/visibility
			*/
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			/**
			* Z-Index
			* @see https://tailwindcss.com/docs/z-index
			*/
			z: [{ z: [
				isInteger,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Basis
			* @see https://tailwindcss.com/docs/flex-basis
			*/
			basis: [{ basis: [
				isFraction,
				"full",
				"auto",
				themeContainer,
				...scaleUnambiguousSpacing()
			] }],
			/**
			* Flex Direction
			* @see https://tailwindcss.com/docs/flex-direction
			*/
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			/**
			* Flex Wrap
			* @see https://tailwindcss.com/docs/flex-wrap
			*/
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			/**
			* Flex
			* @see https://tailwindcss.com/docs/flex
			*/
			flex: [{ flex: [
				isNumber,
				isFraction,
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			/**
			* Flex Grow
			* @see https://tailwindcss.com/docs/flex-grow
			*/
			grow: [{ grow: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Shrink
			* @see https://tailwindcss.com/docs/flex-shrink
			*/
			shrink: [{ shrink: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Order
			* @see https://tailwindcss.com/docs/order
			*/
			order: [{ order: [
				isInteger,
				"first",
				"last",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Grid Template Columns
			* @see https://tailwindcss.com/docs/grid-template-columns
			*/
			"grid-cols": [{ "grid-cols": scaleGridTemplateColsRows() }],
			/**
			* Grid Column Start / End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start-end": [{ col: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Column Start
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start": [{ "col-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Column End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-end": [{ "col-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Template Rows
			* @see https://tailwindcss.com/docs/grid-template-rows
			*/
			"grid-rows": [{ "grid-rows": scaleGridTemplateColsRows() }],
			/**
			* Grid Row Start / End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start-end": [{ row: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Row Start
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start": [{ "row-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Row End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-end": [{ "row-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Auto Flow
			* @see https://tailwindcss.com/docs/grid-auto-flow
			*/
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			/**
			* Grid Auto Columns
			* @see https://tailwindcss.com/docs/grid-auto-columns
			*/
			"auto-cols": [{ "auto-cols": scaleGridAutoColsRows() }],
			/**
			* Grid Auto Rows
			* @see https://tailwindcss.com/docs/grid-auto-rows
			*/
			"auto-rows": [{ "auto-rows": scaleGridAutoColsRows() }],
			/**
			* Gap
			* @see https://tailwindcss.com/docs/gap
			*/
			gap: [{ gap: scaleUnambiguousSpacing() }],
			/**
			* Gap X
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-x": [{ "gap-x": scaleUnambiguousSpacing() }],
			/**
			* Gap Y
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-y": [{ "gap-y": scaleUnambiguousSpacing() }],
			/**
			* Justify Content
			* @see https://tailwindcss.com/docs/justify-content
			*/
			"justify-content": [{ justify: [...scaleAlignPrimaryAxis(), "normal"] }],
			/**
			* Justify Items
			* @see https://tailwindcss.com/docs/justify-items
			*/
			"justify-items": [{ "justify-items": [...scaleAlignSecondaryAxis(), "normal"] }],
			/**
			* Justify Self
			* @see https://tailwindcss.com/docs/justify-self
			*/
			"justify-self": [{ "justify-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Align Content
			* @see https://tailwindcss.com/docs/align-content
			*/
			"align-content": [{ content: ["normal", ...scaleAlignPrimaryAxis()] }],
			/**
			* Align Items
			* @see https://tailwindcss.com/docs/align-items
			*/
			"align-items": [{ items: [...scaleAlignSecondaryAxis(), { baseline: ["", "last"] }] }],
			/**
			* Align Self
			* @see https://tailwindcss.com/docs/align-self
			*/
			"align-self": [{ self: [
				"auto",
				...scaleAlignSecondaryAxis(),
				{ baseline: ["", "last"] }
			] }],
			/**
			* Place Content
			* @see https://tailwindcss.com/docs/place-content
			*/
			"place-content": [{ "place-content": scaleAlignPrimaryAxis() }],
			/**
			* Place Items
			* @see https://tailwindcss.com/docs/place-items
			*/
			"place-items": [{ "place-items": [...scaleAlignSecondaryAxis(), "baseline"] }],
			/**
			* Place Self
			* @see https://tailwindcss.com/docs/place-self
			*/
			"place-self": [{ "place-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Padding
			* @see https://tailwindcss.com/docs/padding
			*/
			p: [{ p: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline
			* @see https://tailwindcss.com/docs/padding
			*/
			px: [{ px: scaleUnambiguousSpacing() }],
			/**
			* Padding Block
			* @see https://tailwindcss.com/docs/padding
			*/
			py: [{ py: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline Start
			* @see https://tailwindcss.com/docs/padding
			*/
			ps: [{ ps: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline End
			* @see https://tailwindcss.com/docs/padding
			*/
			pe: [{ pe: scaleUnambiguousSpacing() }],
			/**
			* Padding Block Start
			* @see https://tailwindcss.com/docs/padding
			*/
			pbs: [{ pbs: scaleUnambiguousSpacing() }],
			/**
			* Padding Block End
			* @see https://tailwindcss.com/docs/padding
			*/
			pbe: [{ pbe: scaleUnambiguousSpacing() }],
			/**
			* Padding Top
			* @see https://tailwindcss.com/docs/padding
			*/
			pt: [{ pt: scaleUnambiguousSpacing() }],
			/**
			* Padding Right
			* @see https://tailwindcss.com/docs/padding
			*/
			pr: [{ pr: scaleUnambiguousSpacing() }],
			/**
			* Padding Bottom
			* @see https://tailwindcss.com/docs/padding
			*/
			pb: [{ pb: scaleUnambiguousSpacing() }],
			/**
			* Padding Left
			* @see https://tailwindcss.com/docs/padding
			*/
			pl: [{ pl: scaleUnambiguousSpacing() }],
			/**
			* Margin
			* @see https://tailwindcss.com/docs/margin
			*/
			m: [{ m: scaleMargin() }],
			/**
			* Margin Inline
			* @see https://tailwindcss.com/docs/margin
			*/
			mx: [{ mx: scaleMargin() }],
			/**
			* Margin Block
			* @see https://tailwindcss.com/docs/margin
			*/
			my: [{ my: scaleMargin() }],
			/**
			* Margin Inline Start
			* @see https://tailwindcss.com/docs/margin
			*/
			ms: [{ ms: scaleMargin() }],
			/**
			* Margin Inline End
			* @see https://tailwindcss.com/docs/margin
			*/
			me: [{ me: scaleMargin() }],
			/**
			* Margin Block Start
			* @see https://tailwindcss.com/docs/margin
			*/
			mbs: [{ mbs: scaleMargin() }],
			/**
			* Margin Block End
			* @see https://tailwindcss.com/docs/margin
			*/
			mbe: [{ mbe: scaleMargin() }],
			/**
			* Margin Top
			* @see https://tailwindcss.com/docs/margin
			*/
			mt: [{ mt: scaleMargin() }],
			/**
			* Margin Right
			* @see https://tailwindcss.com/docs/margin
			*/
			mr: [{ mr: scaleMargin() }],
			/**
			* Margin Bottom
			* @see https://tailwindcss.com/docs/margin
			*/
			mb: [{ mb: scaleMargin() }],
			/**
			* Margin Left
			* @see https://tailwindcss.com/docs/margin
			*/
			ml: [{ ml: scaleMargin() }],
			/**
			* Space Between X
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x": [{ "space-x": scaleUnambiguousSpacing() }],
			/**
			* Space Between X Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x-reverse": ["space-x-reverse"],
			/**
			* Space Between Y
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y": [{ "space-y": scaleUnambiguousSpacing() }],
			/**
			* Space Between Y Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y-reverse": ["space-y-reverse"],
			/**
			* Size
			* @see https://tailwindcss.com/docs/width#setting-both-width-and-height
			*/
			size: [{ size: scaleSizing() }],
			/**
			* Inline Size
			* @see https://tailwindcss.com/docs/width
			*/
			"inline-size": [{ inline: ["auto", ...scaleSizingInline()] }],
			/**
			* Min-Inline Size
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-inline-size": [{ "min-inline": ["auto", ...scaleSizingInline()] }],
			/**
			* Max-Inline Size
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-inline-size": [{ "max-inline": ["none", ...scaleSizingInline()] }],
			/**
			* Block Size
			* @see https://tailwindcss.com/docs/height
			*/
			"block-size": [{ block: ["auto", ...scaleSizingBlock()] }],
			/**
			* Min-Block Size
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-block-size": [{ "min-block": ["auto", ...scaleSizingBlock()] }],
			/**
			* Max-Block Size
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-block-size": [{ "max-block": ["none", ...scaleSizingBlock()] }],
			/**
			* Width
			* @see https://tailwindcss.com/docs/width
			*/
			w: [{ w: [
				themeContainer,
				"screen",
				...scaleSizing()
			] }],
			/**
			* Min-Width
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-w": [{ "min-w": [
				themeContainer,
				"screen",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Width
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-w": [{ "max-w": [
				themeContainer,
				"screen",
				"none",
				"prose",
				{ screen: [themeBreakpoint] },
				...scaleSizing()
			] }],
			/**
			* Height
			* @see https://tailwindcss.com/docs/height
			*/
			h: [{ h: [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Min-Height
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Height
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Font Size
			* @see https://tailwindcss.com/docs/font-size
			*/
			"font-size": [{ text: [
				"base",
				themeText,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Font Smoothing
			* @see https://tailwindcss.com/docs/font-smoothing
			*/
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			/**
			* Font Style
			* @see https://tailwindcss.com/docs/font-style
			*/
			"font-style": ["italic", "not-italic"],
			/**
			* Font Weight
			* @see https://tailwindcss.com/docs/font-weight
			*/
			"font-weight": [{ font: [
				themeFontWeight,
				isArbitraryVariableWeight,
				isArbitraryWeight
			] }],
			/**
			* Font Stretch
			* @see https://tailwindcss.com/docs/font-stretch
			*/
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				isPercent,
				isArbitraryValue
			] }],
			/**
			* Font Family
			* @see https://tailwindcss.com/docs/font-family
			*/
			"font-family": [{ font: [
				isArbitraryVariableFamilyName,
				isArbitraryFamilyName,
				themeFont
			] }],
			/**
			* Font Feature Settings
			* @see https://tailwindcss.com/docs/font-feature-settings
			*/
			"font-features": [{ "font-features": [isArbitraryValue] }],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-normal": ["normal-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-ordinal": ["ordinal"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-slashed-zero": ["slashed-zero"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			/**
			* Letter Spacing
			* @see https://tailwindcss.com/docs/letter-spacing
			*/
			tracking: [{ tracking: [
				themeTracking,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Line Clamp
			* @see https://tailwindcss.com/docs/line-clamp
			*/
			"line-clamp": [{ "line-clamp": [
				isNumber,
				"none",
				isArbitraryVariable,
				isArbitraryNumber
			] }],
			/**
			* Line Height
			* @see https://tailwindcss.com/docs/line-height
			*/
			leading: [{ leading: [themeLeading, ...scaleUnambiguousSpacing()] }],
			/**
			* List Style Image
			* @see https://tailwindcss.com/docs/list-style-image
			*/
			"list-image": [{ "list-image": [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* List Style Position
			* @see https://tailwindcss.com/docs/list-style-position
			*/
			"list-style-position": [{ list: ["inside", "outside"] }],
			/**
			* List Style Type
			* @see https://tailwindcss.com/docs/list-style-type
			*/
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Alignment
			* @see https://tailwindcss.com/docs/text-align
			*/
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			/**
			* Placeholder Color
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://v3.tailwindcss.com/docs/placeholder-color
			*/
			"placeholder-color": [{ placeholder: scaleColor() }],
			/**
			* Text Color
			* @see https://tailwindcss.com/docs/text-color
			*/
			"text-color": [{ text: scaleColor() }],
			/**
			* Text Decoration
			* @see https://tailwindcss.com/docs/text-decoration
			*/
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			/**
			* Text Decoration Style
			* @see https://tailwindcss.com/docs/text-decoration-style
			*/
			"text-decoration-style": [{ decoration: [...scaleLineStyle(), "wavy"] }],
			/**
			* Text Decoration Thickness
			* @see https://tailwindcss.com/docs/text-decoration-thickness
			*/
			"text-decoration-thickness": [{ decoration: [
				isNumber,
				"from-font",
				"auto",
				isArbitraryVariable,
				isArbitraryLength
			] }],
			/**
			* Text Decoration Color
			* @see https://tailwindcss.com/docs/text-decoration-color
			*/
			"text-decoration-color": [{ decoration: scaleColor() }],
			/**
			* Text Underline Offset
			* @see https://tailwindcss.com/docs/text-underline-offset
			*/
			"underline-offset": [{ "underline-offset": [
				isNumber,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Transform
			* @see https://tailwindcss.com/docs/text-transform
			*/
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			/**
			* Text Overflow
			* @see https://tailwindcss.com/docs/text-overflow
			*/
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			/**
			* Text Wrap
			* @see https://tailwindcss.com/docs/text-wrap
			*/
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			/**
			* Text Indent
			* @see https://tailwindcss.com/docs/text-indent
			*/
			indent: [{ indent: scaleUnambiguousSpacing() }],
			/**
			* Tab Size
			* @see https://tailwindcss.com/docs/tab-size
			*/
			"tab-size": [{ tab: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Vertical Alignment
			* @see https://tailwindcss.com/docs/vertical-align
			*/
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Whitespace
			* @see https://tailwindcss.com/docs/whitespace
			*/
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			/**
			* Word Break
			* @see https://tailwindcss.com/docs/word-break
			*/
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			/**
			* Overflow Wrap
			* @see https://tailwindcss.com/docs/overflow-wrap
			*/
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			/**
			* Hyphens
			* @see https://tailwindcss.com/docs/hyphens
			*/
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			/**
			* Content
			* @see https://tailwindcss.com/docs/content
			*/
			content: [{ content: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Background Attachment
			* @see https://tailwindcss.com/docs/background-attachment
			*/
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			/**
			* Background Clip
			* @see https://tailwindcss.com/docs/background-clip
			*/
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			/**
			* Background Origin
			* @see https://tailwindcss.com/docs/background-origin
			*/
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			/**
			* Background Position
			* @see https://tailwindcss.com/docs/background-position
			*/
			"bg-position": [{ bg: scaleBgPosition() }],
			/**
			* Background Repeat
			* @see https://tailwindcss.com/docs/background-repeat
			*/
			"bg-repeat": [{ bg: scaleBgRepeat() }],
			/**
			* Background Size
			* @see https://tailwindcss.com/docs/background-size
			*/
			"bg-size": [{ bg: scaleBgSize() }],
			/**
			* Background Image
			* @see https://tailwindcss.com/docs/background-image
			*/
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					],
					radial: [
						"",
						isArbitraryVariable,
						isArbitraryValue
					],
					conic: [
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					]
				},
				isArbitraryVariableImage,
				isArbitraryImage
			] }],
			/**
			* Background Color
			* @see https://tailwindcss.com/docs/background-color
			*/
			"bg-color": [{ bg: scaleColor() }],
			/**
			* Gradient Color Stops From Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from-pos": [{ from: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops Via Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via-pos": [{ via: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops To Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to-pos": [{ to: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops From
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from": [{ from: scaleColor() }],
			/**
			* Gradient Color Stops Via
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via": [{ via: scaleColor() }],
			/**
			* Gradient Color Stops To
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to": [{ to: scaleColor() }],
			/**
			* Border Radius
			* @see https://tailwindcss.com/docs/border-radius
			*/
			rounded: [{ rounded: scaleRadius() }],
			/**
			* Border Radius Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-s": [{ "rounded-s": scaleRadius() }],
			/**
			* Border Radius End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-e": [{ "rounded-e": scaleRadius() }],
			/**
			* Border Radius Top
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-t": [{ "rounded-t": scaleRadius() }],
			/**
			* Border Radius Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-r": [{ "rounded-r": scaleRadius() }],
			/**
			* Border Radius Bottom
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-b": [{ "rounded-b": scaleRadius() }],
			/**
			* Border Radius Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-l": [{ "rounded-l": scaleRadius() }],
			/**
			* Border Radius Start Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ss": [{ "rounded-ss": scaleRadius() }],
			/**
			* Border Radius Start End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-se": [{ "rounded-se": scaleRadius() }],
			/**
			* Border Radius End End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ee": [{ "rounded-ee": scaleRadius() }],
			/**
			* Border Radius End Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-es": [{ "rounded-es": scaleRadius() }],
			/**
			* Border Radius Top Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tl": [{ "rounded-tl": scaleRadius() }],
			/**
			* Border Radius Top Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tr": [{ "rounded-tr": scaleRadius() }],
			/**
			* Border Radius Bottom Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-br": [{ "rounded-br": scaleRadius() }],
			/**
			* Border Radius Bottom Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-bl": [{ "rounded-bl": scaleRadius() }],
			/**
			* Border Width
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w": [{ border: scaleBorderWidth() }],
			/**
			* Border Width Inline
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-x": [{ "border-x": scaleBorderWidth() }],
			/**
			* Border Width Block
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-y": [{ "border-y": scaleBorderWidth() }],
			/**
			* Border Width Inline Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-s": [{ "border-s": scaleBorderWidth() }],
			/**
			* Border Width Inline End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-e": [{ "border-e": scaleBorderWidth() }],
			/**
			* Border Width Block Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-bs": [{ "border-bs": scaleBorderWidth() }],
			/**
			* Border Width Block End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-be": [{ "border-be": scaleBorderWidth() }],
			/**
			* Border Width Top
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-t": [{ "border-t": scaleBorderWidth() }],
			/**
			* Border Width Right
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-r": [{ "border-r": scaleBorderWidth() }],
			/**
			* Border Width Bottom
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-b": [{ "border-b": scaleBorderWidth() }],
			/**
			* Border Width Left
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-l": [{ "border-l": scaleBorderWidth() }],
			/**
			* Divide Width X
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x": [{ "divide-x": scaleBorderWidth() }],
			/**
			* Divide Width X Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x-reverse": ["divide-x-reverse"],
			/**
			* Divide Width Y
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y": [{ "divide-y": scaleBorderWidth() }],
			/**
			* Divide Width Y Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y-reverse": ["divide-y-reverse"],
			/**
			* Border Style
			* @see https://tailwindcss.com/docs/border-style
			*/
			"border-style": [{ border: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Divide Style
			* @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
			*/
			"divide-style": [{ divide: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Border Color
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color": [{ border: scaleColor() }],
			/**
			* Border Color Inline
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-x": [{ "border-x": scaleColor() }],
			/**
			* Border Color Block
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-y": [{ "border-y": scaleColor() }],
			/**
			* Border Color Inline Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-s": [{ "border-s": scaleColor() }],
			/**
			* Border Color Inline End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-e": [{ "border-e": scaleColor() }],
			/**
			* Border Color Block Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-bs": [{ "border-bs": scaleColor() }],
			/**
			* Border Color Block End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-be": [{ "border-be": scaleColor() }],
			/**
			* Border Color Top
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-t": [{ "border-t": scaleColor() }],
			/**
			* Border Color Right
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-r": [{ "border-r": scaleColor() }],
			/**
			* Border Color Bottom
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-b": [{ "border-b": scaleColor() }],
			/**
			* Border Color Left
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-l": [{ "border-l": scaleColor() }],
			/**
			* Divide Color
			* @see https://tailwindcss.com/docs/divide-color
			*/
			"divide-color": [{ divide: scaleColor() }],
			/**
			* Outline Style
			* @see https://tailwindcss.com/docs/outline-style
			*/
			"outline-style": [{ outline: [
				...scaleLineStyle(),
				"none",
				"hidden"
			] }],
			/**
			* Outline Offset
			* @see https://tailwindcss.com/docs/outline-offset
			*/
			"outline-offset": [{ "outline-offset": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Outline Width
			* @see https://tailwindcss.com/docs/outline-width
			*/
			"outline-w": [{ outline: [
				"",
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Outline Color
			* @see https://tailwindcss.com/docs/outline-color
			*/
			"outline-color": [{ outline: scaleColor() }],
			/**
			* Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow
			*/
			shadow: [{ shadow: [
				"",
				"none",
				themeShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
			*/
			"shadow-color": [{ shadow: scaleColor() }],
			/**
			* Inset Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
			*/
			"inset-shadow": [{ "inset-shadow": [
				"none",
				themeInsetShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Inset Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
			*/
			"inset-shadow-color": [{ "inset-shadow": scaleColor() }],
			/**
			* Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
			*/
			"ring-w": [{ ring: scaleBorderWidth() }],
			/**
			* Ring Width Inset
			* @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-w-inset": ["ring-inset"],
			/**
			* Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
			*/
			"ring-color": [{ ring: scaleColor() }],
			/**
			* Ring Offset Width
			* @see https://v3.tailwindcss.com/docs/ring-offset-width
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-w": [{ "ring-offset": [isNumber, isArbitraryLength] }],
			/**
			* Ring Offset Color
			* @see https://v3.tailwindcss.com/docs/ring-offset-color
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-color": [{ "ring-offset": scaleColor() }],
			/**
			* Inset Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
			*/
			"inset-ring-w": [{ "inset-ring": scaleBorderWidth() }],
			/**
			* Inset Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
			*/
			"inset-ring-color": [{ "inset-ring": scaleColor() }],
			/**
			* Text Shadow
			* @see https://tailwindcss.com/docs/text-shadow
			*/
			"text-shadow": [{ "text-shadow": [
				"none",
				themeTextShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Text Shadow Color
			* @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
			*/
			"text-shadow-color": [{ "text-shadow": scaleColor() }],
			/**
			* Opacity
			* @see https://tailwindcss.com/docs/opacity
			*/
			opacity: [{ opacity: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Mix Blend Mode
			* @see https://tailwindcss.com/docs/mix-blend-mode
			*/
			"mix-blend": [{ "mix-blend": [
				...scaleBlendMode(),
				"plus-darker",
				"plus-lighter"
			] }],
			/**
			* Background Blend Mode
			* @see https://tailwindcss.com/docs/background-blend-mode
			*/
			"bg-blend": [{ "bg-blend": scaleBlendMode() }],
			/**
			* Mask Clip
			* @see https://tailwindcss.com/docs/mask-clip
			*/
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			/**
			* Mask Composite
			* @see https://tailwindcss.com/docs/mask-composite
			*/
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image-linear-pos": [{ "mask-linear": [isNumber] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": scaleMaskImagePosition() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": scaleMaskImagePosition() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": scaleColor() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": scaleColor() }],
			"mask-image-t-from-pos": [{ "mask-t-from": scaleMaskImagePosition() }],
			"mask-image-t-to-pos": [{ "mask-t-to": scaleMaskImagePosition() }],
			"mask-image-t-from-color": [{ "mask-t-from": scaleColor() }],
			"mask-image-t-to-color": [{ "mask-t-to": scaleColor() }],
			"mask-image-r-from-pos": [{ "mask-r-from": scaleMaskImagePosition() }],
			"mask-image-r-to-pos": [{ "mask-r-to": scaleMaskImagePosition() }],
			"mask-image-r-from-color": [{ "mask-r-from": scaleColor() }],
			"mask-image-r-to-color": [{ "mask-r-to": scaleColor() }],
			"mask-image-b-from-pos": [{ "mask-b-from": scaleMaskImagePosition() }],
			"mask-image-b-to-pos": [{ "mask-b-to": scaleMaskImagePosition() }],
			"mask-image-b-from-color": [{ "mask-b-from": scaleColor() }],
			"mask-image-b-to-color": [{ "mask-b-to": scaleColor() }],
			"mask-image-l-from-pos": [{ "mask-l-from": scaleMaskImagePosition() }],
			"mask-image-l-to-pos": [{ "mask-l-to": scaleMaskImagePosition() }],
			"mask-image-l-from-color": [{ "mask-l-from": scaleColor() }],
			"mask-image-l-to-color": [{ "mask-l-to": scaleColor() }],
			"mask-image-x-from-pos": [{ "mask-x-from": scaleMaskImagePosition() }],
			"mask-image-x-to-pos": [{ "mask-x-to": scaleMaskImagePosition() }],
			"mask-image-x-from-color": [{ "mask-x-from": scaleColor() }],
			"mask-image-x-to-color": [{ "mask-x-to": scaleColor() }],
			"mask-image-y-from-pos": [{ "mask-y-from": scaleMaskImagePosition() }],
			"mask-image-y-to-pos": [{ "mask-y-to": scaleMaskImagePosition() }],
			"mask-image-y-from-color": [{ "mask-y-from": scaleColor() }],
			"mask-image-y-to-color": [{ "mask-y-to": scaleColor() }],
			"mask-image-radial": [{ "mask-radial": [isArbitraryVariable, isArbitraryValue] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": scaleMaskImagePosition() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": scaleMaskImagePosition() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": scaleColor() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": scaleColor() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": scalePosition() }],
			"mask-image-conic-pos": [{ "mask-conic": [isNumber] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": scaleMaskImagePosition() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": scaleMaskImagePosition() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": scaleColor() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": scaleColor() }],
			/**
			* Mask Mode
			* @see https://tailwindcss.com/docs/mask-mode
			*/
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			/**
			* Mask Origin
			* @see https://tailwindcss.com/docs/mask-origin
			*/
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			/**
			* Mask Position
			* @see https://tailwindcss.com/docs/mask-position
			*/
			"mask-position": [{ mask: scaleBgPosition() }],
			/**
			* Mask Repeat
			* @see https://tailwindcss.com/docs/mask-repeat
			*/
			"mask-repeat": [{ mask: scaleBgRepeat() }],
			/**
			* Mask Size
			* @see https://tailwindcss.com/docs/mask-size
			*/
			"mask-size": [{ mask: scaleBgSize() }],
			/**
			* Mask Type
			* @see https://tailwindcss.com/docs/mask-type
			*/
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image": [{ mask: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Filter
			* @see https://tailwindcss.com/docs/filter
			*/
			filter: [{ filter: [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Blur
			* @see https://tailwindcss.com/docs/blur
			*/
			blur: [{ blur: scaleBlur() }],
			/**
			* Brightness
			* @see https://tailwindcss.com/docs/brightness
			*/
			brightness: [{ brightness: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Contrast
			* @see https://tailwindcss.com/docs/contrast
			*/
			contrast: [{ contrast: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Drop Shadow
			* @see https://tailwindcss.com/docs/drop-shadow
			*/
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				themeDropShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Drop Shadow Color
			* @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
			*/
			"drop-shadow-color": [{ "drop-shadow": scaleColor() }],
			/**
			* Grayscale
			* @see https://tailwindcss.com/docs/grayscale
			*/
			grayscale: [{ grayscale: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Hue Rotate
			* @see https://tailwindcss.com/docs/hue-rotate
			*/
			"hue-rotate": [{ "hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Invert
			* @see https://tailwindcss.com/docs/invert
			*/
			invert: [{ invert: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Saturate
			* @see https://tailwindcss.com/docs/saturate
			*/
			saturate: [{ saturate: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Sepia
			* @see https://tailwindcss.com/docs/sepia
			*/
			sepia: [{ sepia: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Filter
			* @see https://tailwindcss.com/docs/backdrop-filter
			*/
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Blur
			* @see https://tailwindcss.com/docs/backdrop-blur
			*/
			"backdrop-blur": [{ "backdrop-blur": scaleBlur() }],
			/**
			* Backdrop Brightness
			* @see https://tailwindcss.com/docs/backdrop-brightness
			*/
			"backdrop-brightness": [{ "backdrop-brightness": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Contrast
			* @see https://tailwindcss.com/docs/backdrop-contrast
			*/
			"backdrop-contrast": [{ "backdrop-contrast": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Grayscale
			* @see https://tailwindcss.com/docs/backdrop-grayscale
			*/
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Hue Rotate
			* @see https://tailwindcss.com/docs/backdrop-hue-rotate
			*/
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Invert
			* @see https://tailwindcss.com/docs/backdrop-invert
			*/
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Opacity
			* @see https://tailwindcss.com/docs/backdrop-opacity
			*/
			"backdrop-opacity": [{ "backdrop-opacity": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Saturate
			* @see https://tailwindcss.com/docs/backdrop-saturate
			*/
			"backdrop-saturate": [{ "backdrop-saturate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Sepia
			* @see https://tailwindcss.com/docs/backdrop-sepia
			*/
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Border Collapse
			* @see https://tailwindcss.com/docs/border-collapse
			*/
			"border-collapse": [{ border: ["collapse", "separate"] }],
			/**
			* Border Spacing
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing": [{ "border-spacing": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing X
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-x": [{ "border-spacing-x": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing Y
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-y": [{ "border-spacing-y": scaleUnambiguousSpacing() }],
			/**
			* Table Layout
			* @see https://tailwindcss.com/docs/table-layout
			*/
			"table-layout": [{ table: ["auto", "fixed"] }],
			/**
			* Caption Side
			* @see https://tailwindcss.com/docs/caption-side
			*/
			caption: [{ caption: ["top", "bottom"] }],
			/**
			* Transition Property
			* @see https://tailwindcss.com/docs/transition-property
			*/
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Behavior
			* @see https://tailwindcss.com/docs/transition-behavior
			*/
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			/**
			* Transition Duration
			* @see https://tailwindcss.com/docs/transition-duration
			*/
			duration: [{ duration: [
				isNumber,
				"initial",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Timing Function
			* @see https://tailwindcss.com/docs/transition-timing-function
			*/
			ease: [{ ease: [
				"linear",
				"initial",
				themeEase,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Delay
			* @see https://tailwindcss.com/docs/transition-delay
			*/
			delay: [{ delay: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Animation
			* @see https://tailwindcss.com/docs/animation
			*/
			animate: [{ animate: [
				"none",
				themeAnimate,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backface Visibility
			* @see https://tailwindcss.com/docs/backface-visibility
			*/
			backface: [{ backface: ["hidden", "visible"] }],
			/**
			* Perspective
			* @see https://tailwindcss.com/docs/perspective
			*/
			perspective: [{ perspective: [
				themePerspective,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Perspective Origin
			* @see https://tailwindcss.com/docs/perspective-origin
			*/
			"perspective-origin": [{ "perspective-origin": scalePositionWithArbitrary() }],
			/**
			* Rotate
			* @see https://tailwindcss.com/docs/rotate
			*/
			rotate: [{ rotate: scaleRotate() }],
			/**
			* Rotate X
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-x": [{ "rotate-x": scaleRotate() }],
			/**
			* Rotate Y
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-y": [{ "rotate-y": scaleRotate() }],
			/**
			* Rotate Z
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-z": [{ "rotate-z": scaleRotate() }],
			/**
			* Scale
			* @see https://tailwindcss.com/docs/scale
			*/
			scale: [{ scale: scaleScale() }],
			/**
			* Scale X
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-x": [{ "scale-x": scaleScale() }],
			/**
			* Scale Y
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-y": [{ "scale-y": scaleScale() }],
			/**
			* Scale Z
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-z": [{ "scale-z": scaleScale() }],
			/**
			* Scale 3D
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-3d": ["scale-3d"],
			/**
			* Skew
			* @see https://tailwindcss.com/docs/skew
			*/
			skew: [{ skew: scaleSkew() }],
			/**
			* Skew X
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-x": [{ "skew-x": scaleSkew() }],
			/**
			* Skew Y
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-y": [{ "skew-y": scaleSkew() }],
			/**
			* Transform
			* @see https://tailwindcss.com/docs/transform
			*/
			transform: [{ transform: [
				isArbitraryVariable,
				isArbitraryValue,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			/**
			* Transform Origin
			* @see https://tailwindcss.com/docs/transform-origin
			*/
			"transform-origin": [{ origin: scalePositionWithArbitrary() }],
			/**
			* Transform Style
			* @see https://tailwindcss.com/docs/transform-style
			*/
			"transform-style": [{ transform: ["3d", "flat"] }],
			/**
			* Translate
			* @see https://tailwindcss.com/docs/translate
			*/
			translate: [{ translate: scaleTranslate() }],
			/**
			* Translate X
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-x": [{ "translate-x": scaleTranslate() }],
			/**
			* Translate Y
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-y": [{ "translate-y": scaleTranslate() }],
			/**
			* Translate Z
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-z": [{ "translate-z": scaleTranslate() }],
			/**
			* Translate None
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-none": ["translate-none"],
			/**
			* Zoom
			* @see https://tailwindcss.com/docs/zoom
			*/
			zoom: [{ zoom: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Accent Color
			* @see https://tailwindcss.com/docs/accent-color
			*/
			accent: [{ accent: scaleColor() }],
			/**
			* Appearance
			* @see https://tailwindcss.com/docs/appearance
			*/
			appearance: [{ appearance: ["none", "auto"] }],
			/**
			* Caret Color
			* @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
			*/
			"caret-color": [{ caret: scaleColor() }],
			/**
			* Color Scheme
			* @see https://tailwindcss.com/docs/color-scheme
			*/
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			/**
			* Cursor
			* @see https://tailwindcss.com/docs/cursor
			*/
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Field Sizing
			* @see https://tailwindcss.com/docs/field-sizing
			*/
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			/**
			* Pointer Events
			* @see https://tailwindcss.com/docs/pointer-events
			*/
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			/**
			* Resize
			* @see https://tailwindcss.com/docs/resize
			*/
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			/**
			* Scroll Behavior
			* @see https://tailwindcss.com/docs/scroll-behavior
			*/
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			/**
			* Scrollbar Thumb Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-thumb-color": [{ "scrollbar-thumb": scaleColor() }],
			/**
			* Scrollbar Track Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-track-color": [{ "scrollbar-track": scaleColor() }],
			/**
			* Scrollbar Gutter
			* @see https://tailwindcss.com/docs/scrollbar-gutter
			*/
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			/**
			* Scrollbar Width
			* @see https://tailwindcss.com/docs/scrollbar-width
			*/
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			/**
			* Scroll Margin
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-m": [{ "scroll-m": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mx": [{ "scroll-mx": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-my": [{ "scroll-my": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ms": [{ "scroll-ms": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-me": [{ "scroll-me": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbs": [{ "scroll-mbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbe": [{ "scroll-mbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Top
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mt": [{ "scroll-mt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Right
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mr": [{ "scroll-mr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Bottom
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mb": [{ "scroll-mb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Left
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ml": [{ "scroll-ml": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-p": [{ "scroll-p": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-px": [{ "scroll-px": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-py": [{ "scroll-py": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-ps": [{ "scroll-ps": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pe": [{ "scroll-pe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbs": [{ "scroll-pbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbe": [{ "scroll-pbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Top
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pt": [{ "scroll-pt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Right
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pr": [{ "scroll-pr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Bottom
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pb": [{ "scroll-pb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Left
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pl": [{ "scroll-pl": scaleUnambiguousSpacing() }],
			/**
			* Scroll Snap Align
			* @see https://tailwindcss.com/docs/scroll-snap-align
			*/
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			/**
			* Scroll Snap Stop
			* @see https://tailwindcss.com/docs/scroll-snap-stop
			*/
			"snap-stop": [{ snap: ["normal", "always"] }],
			/**
			* Scroll Snap Type
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			/**
			* Scroll Snap Type Strictness
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			/**
			* Touch Action
			* @see https://tailwindcss.com/docs/touch-action
			*/
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			/**
			* Touch Action X
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			/**
			* Touch Action Y
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			/**
			* Touch Action Pinch Zoom
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-pz": ["touch-pinch-zoom"],
			/**
			* User Select
			* @see https://tailwindcss.com/docs/user-select
			*/
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			/**
			* Will Change
			* @see https://tailwindcss.com/docs/will-change
			*/
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Fill
			* @see https://tailwindcss.com/docs/fill
			*/
			fill: [{ fill: ["none", ...scaleColor()] }],
			/**
			* Stroke Width
			* @see https://tailwindcss.com/docs/stroke-width
			*/
			"stroke-w": [{ stroke: [
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			/**
			* Stroke
			* @see https://tailwindcss.com/docs/stroke
			*/
			stroke: [{ stroke: ["none", ...scaleColor()] }],
			/**
			* Forced Color Adjust
			* @see https://tailwindcss.com/docs/forced-color-adjust
			*/
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
};
var twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
//#endregion
//#region src/shared/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Classic fleet, longest first: 5, 4, two 3s and a 2 — 17 cells total. */
var FLEET_LENGTHS = [
	5,
	4,
	3,
	3,
	2
];
var battleshipGame = {
	meta: {
		id: "amiral-batti",
		name: "Amiral Battı",
		icon: "🚢",
		tagline: "Rakip filoyu bul ve batır; isabet ettiren yeniden atar."
	},
	playerLabels: ["Amiral 1", "Amiral 2"],
	init: init$6,
	applyMove: applyMove$6,
	status: status$6,
	turn: turn$6
};
function init$6(seed, _names) {
	return {
		fleets: [placeFleet(mulberry32(seed)), placeFleet(mulberry32(seed + 1))],
		shots: [[], []],
		turn: 0
	};
}
function applyMove$6(state, move, player) {
	if (status$6(state).kind !== "ongoing") return null;
	if (state.turn !== player) return null;
	if (typeof move !== "object" || move === null) return null;
	if (!isCoordinate(move.x) || !isCoordinate(move.y)) return null;
	const cell = cellIndex(move.x, move.y);
	if (state.shots[player].includes(cell)) return null;
	const enemy = other$3(player);
	const hit = shipAt(state.fleets[enemy], cell) !== void 0;
	const shots = player === 0 ? [[...state.shots[0], cell], state.shots[1]] : [state.shots[0], [...state.shots[1], cell]];
	return {
		fleets: state.fleets,
		shots,
		turn: hit ? player : enemy
	};
}
function status$6(state) {
	if (isFleetSunk(state.fleets[1], state.shots[0])) return {
		kind: "won",
		winner: 0
	};
	if (isFleetSunk(state.fleets[0], state.shots[1])) return {
		kind: "won",
		winner: 1
	};
	return { kind: "ongoing" };
}
function turn$6(state) {
	return status$6(state).kind === "ongoing" ? state.turn : null;
}
function cellIndex(x, y) {
	return y * 10 + x;
}
function shipAt(fleet, cell) {
	return fleet.find((ship) => ship.cells.includes(cell));
}
function isShipSunk(ship, shots) {
	return ship.cells.every((cell) => shots.includes(cell));
}
function isFleetSunk(fleet, shots) {
	return fleet.every((ship) => isShipSunk(ship, shots));
}
function placeFleet(rng) {
	const taken = /* @__PURE__ */ new Set();
	const fleet = [];
	for (const length of FLEET_LENGTHS) {
		let cells = rollShip(rng, length);
		while (cells.some((cell) => taken.has(cell))) cells = rollShip(rng, length);
		for (const cell of cells) taken.add(cell);
		fleet.push({ cells });
	}
	return fleet;
}
function rollShip(rng, length) {
	const horizontal = rng() < .5;
	const x = pickIndex(rng, horizontal ? 10 - length + 1 : 10);
	const y = pickIndex(rng, horizontal ? 10 : 10 - length + 1);
	return Array.from({ length }, (_, i) => horizontal ? cellIndex(x + i, y) : cellIndex(x, y + i));
}
function isCoordinate(value) {
	return Number.isInteger(value) && value >= 0 && value < 10;
}
function other$3(player) {
	return player === 0 ? 1 : 0;
}
//#endregion
//#region src/features/play-battleship/ui/board.tsx
var import_jsx_runtime = require_jsx_runtime();
function BattleshipBoard({ state, me, canMove, onMove }) {
	const enemy = me === 0 ? 1 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 md:flex-row md:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridFrame, {
				title: "Rakip suları",
				children: (x, y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TargetCell, {
					x,
					y,
					state,
					me,
					enemy,
					canMove,
					onMove
				}, cellIndex(x, y))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridFrame, {
				title: "Filon",
				children: (x, y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FleetCell, {
					x,
					y,
					state,
					me,
					enemy
				}, cellIndex(x, y))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "✕ isabet · • ıska · dolu kare battı — isabet ettirdikçe sıra sende kalır."
		})]
	});
}
function GridFrame({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex w-fit flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[1.25rem_repeat(10,1.75rem)] grid-rows-[1.25rem_repeat(10,1.75rem)] gap-px rounded-xl border bg-card p-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
				AXIS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: AXIS_LABEL_CLASS,
					children: COLUMN_LETTERS[x]
				}, x)),
				AXIS.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: AXIS_LABEL_CLASS,
					children: y + 1
				}), AXIS.map((x) => children(x, y))] }, y))
			]
		})]
	});
}
function TargetCell({ x, y, state, me, enemy, canMove, onMove }) {
	const cell = cellIndex(x, y);
	const myShots = state.shots[me];
	const place = `${COLUMN_LETTERS[x]}${y + 1}`;
	if (!myShots.includes(cell)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": `${place} — ateş et`,
		disabled: !canMove,
		onClick: () => onMove({
			x,
			y
		}),
		className: "rounded-sm bg-muted/60 transition-colors enabled:hover:bg-accent enabled:active:bg-accent/80 disabled:opacity-40"
	});
	const ship = shipAt(state.fleets[enemy], cell);
	if (ship === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
		label: `${place} — ıska`,
		className: "text-muted-foreground",
		children: "•"
	});
	if (isShipSunk(ship, myShots)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
		label: `${place} — battı`,
		className: "bg-destructive text-background",
		children: "✕"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
		label: `${place} — isabet`,
		className: "bg-destructive/15 text-destructive",
		children: "✕"
	});
}
function FleetCell({ x, y, state, me, enemy }) {
	const cell = cellIndex(x, y);
	const enemyShots = state.shots[enemy];
	const ship = shipAt(state.fleets[me], cell);
	const shot = enemyShots.includes(cell);
	const place = `${COLUMN_LETTERS[x]}${y + 1}`;
	if (ship === void 0) {
		if (shot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
			label: `${place} — ıska`,
			className: "text-muted-foreground",
			children: "•"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-sm bg-muted/40" });
	}
	if (isShipSunk(ship, enemyShots)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
		label: `${place} — battı`,
		className: "bg-destructive text-background",
		children: "✕"
	});
	if (shot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
		label: `${place} — isabet aldı`,
		className: "bg-destructive/20 text-destructive",
		children: "✕"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "img",
		"aria-label": `${place} — gemin`,
		className: cn("rounded-sm", me === 0 ? "bg-player-one/50" : "bg-player-two/50")
	});
}
function Mark({ label, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "img",
		"aria-label": label,
		className: cn("flex items-center justify-center rounded-sm bg-muted/60 text-xs font-semibold", className),
		children
	});
}
var AXIS = Array.from({ length: 10 }, (_, i) => i);
var COLUMN_LETTERS = [..."ABCDEFGHIJ"];
var AXIS_LABEL_CLASS = "flex items-center justify-center text-[0.65rem] text-muted-foreground";
//#endregion
//#region src/features/play-connect-four/model/rules.ts
var connectFourGame = {
	meta: {
		id: "dort-tas",
		name: "Dört Taş",
		icon: "🔴",
		tagline: "Dört taşı yan yana ilk getiren kazanır."
	},
	playerLabels: ["Mavi", "Kırmızı"],
	init: init$5,
	applyMove: applyMove$5,
	status: status$5,
	turn: turn$5
};
var WIN_LENGTH = 4;
/** Line directions as [rowStep, columnStep]: right, down, both diagonals —
* scanning every cell with these four covers all eight orientations. */
var DIRECTIONS = [
	[0, 1],
	[1, 0],
	[1, 1],
	[1, -1]
];
function init$5(_seed, _names) {
	return {
		board: Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => null)),
		current: 0
	};
}
function applyMove$5(state, move, player) {
	if (turn$5(state) !== player) return null;
	const column = move.column;
	if (!Number.isInteger(column) || column < 0 || column >= 7) return null;
	const row = landingRow(state.board, column);
	if (row === null) return null;
	return {
		board: state.board.map((cells, rowIndex) => rowIndex === row ? cells.map((cell, columnIndex) => columnIndex === column ? player : cell) : cells),
		current: other$2(player)
	};
}
function status$5(state) {
	const winner = findWinner(state.board);
	if (winner !== null) return {
		kind: "won",
		winner
	};
	return state.board.every((row) => row.every((cell) => cell !== null)) ? { kind: "draw" } : { kind: "ongoing" };
}
function turn$5(state) {
	return status$5(state).kind === "ongoing" ? state.current : null;
}
/** Deepest empty row of the column (gravity), or null when it is full. */
function landingRow(board, column) {
	for (let row = 5; row >= 0; row -= 1) if (board[row][column] === null) return row;
	return null;
}
function findWinner(board) {
	for (let row = 0; row < 6; row += 1) for (let column = 0; column < 7; column += 1) {
		const owner = board[row][column];
		if (owner === null) continue;
		for (const [rowStep, columnStep] of DIRECTIONS) if (lineFrom(board, owner, row, column, rowStep, columnStep)) return owner;
	}
	return null;
}
/** Whether WIN_LENGTH cells starting here along the direction share owner. */
function lineFrom(board, owner, row, column, rowStep, columnStep) {
	for (let step = 1; step < WIN_LENGTH; step += 1) {
		const r = row + rowStep * step;
		const c = column + columnStep * step;
		if (r < 0 || r >= 6 || c < 0 || c >= 7) return false;
		if (board[r][c] !== owner) return false;
	}
	return true;
}
function other$2(player) {
	return player === 0 ? 1 : 0;
}
//#endregion
//#region src/features/play-connect-four/ui/board.tsx
function ConnectFourBoard({ state, me, canMove, onMove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-label": "Dört Taş tahtası",
			className: "flex gap-1 rounded-2xl border bg-card p-2 shadow-sm",
			children: columns().map((column) => {
				const full = state.board[0][column] !== null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !canMove || full,
					"aria-label": columnLabel(column, full),
					onClick: () => onMove({ column }),
					className: cn("flex flex-col gap-1.5 rounded-xl p-1 transition-colors", "enabled:hover:bg-muted enabled:active:translate-y-px", !canMove && "opacity-60"),
					children: state.board.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disc, { owner: row[column] }, rowIndex))
				}, column);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [
				"Senin rengin:",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-3.5 rounded-full", me === 0 ? "bg-player-one" : "bg-player-two") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: connectFourGame.playerLabels[me]
				})
			]
		})]
	});
}
function Disc({ owner }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-9 rounded-full border sm:size-10", owner === null && "bg-background", owner === 0 && "border-transparent bg-player-one", owner === 1 && "border-transparent bg-player-two") });
}
function columns() {
	return Array.from({ length: 7 }, (_, column) => column);
}
function columnLabel(column, full) {
	return full ? `${column + 1}. sütun dolu` : `${column + 1}. sütuna taş bırak`;
}
var BOX_COUNT = 16;
var dotsBoxesGame = {
	meta: {
		id: "noktalar-kutular",
		name: "Noktalar & Kutular",
		icon: "✏️",
		tagline: "Çizgiyi çek, kutuyu kap — kutuyu kapatan bir tur daha oynar."
	},
	playerLabels: ["Mavi", "Kırmızı"],
	init: init$4,
	applyMove: applyMove$4,
	status: status$4,
	turn: turn$4
};
function init$4(_seed, _names) {
	return {
		h: emptyOwners(20),
		v: emptyOwners(20),
		boxes: emptyOwners(BOX_COUNT),
		turn: 0
	};
}
function applyMove$4(state, move, player) {
	if (status$4(state).kind !== "ongoing") return null;
	if (state.turn !== player) return null;
	if (typeof move !== "object" || move === null) return null;
	if (!isEdge(move)) return null;
	const horizontal = move.dir === "h";
	const index = horizontal ? hEdgeIndex(move.row, move.col) : vEdgeIndex(move.row, move.col);
	if ((horizontal ? state.h : state.v)[index] !== null) return null;
	const h = horizontal ? withOwner(state.h, index, player) : state.h;
	const v = horizontal ? state.v : withOwner(state.v, index, player);
	const boxes = [...state.boxes];
	let claimed = 0;
	for (const box of touchedBoxes(move)) {
		const target = boxIndex(box.row, box.col);
		if (boxes[target] === null && isBoxClosed(h, v, box.row, box.col)) {
			boxes[target] = player;
			claimed += 1;
		}
	}
	return {
		h,
		v,
		boxes,
		turn: claimed > 0 ? player : other$1(player)
	};
}
function status$4(state) {
	const [first, second] = boxCounts(state);
	if (first + second < BOX_COUNT) return { kind: "ongoing" };
	if (first > second) return {
		kind: "won",
		winner: 0
	};
	if (second > first) return {
		kind: "won",
		winner: 1
	};
	return { kind: "draw" };
}
function turn$4(state) {
	return status$4(state).kind === "ongoing" ? state.turn : null;
}
/** Horizontal edge at dot row `0..GRID`, box column `0..GRID-1`. */
function hEdgeIndex(row, col) {
	return row * 4 + col;
}
/** Vertical edge at box row `0..GRID-1`, dot column `0..GRID`. */
function vEdgeIndex(row, col) {
	return row * 5 + col;
}
function boxIndex(row, col) {
	return row * 4 + col;
}
/** Claimed-box tally, indexed by player. */
function boxCounts(state) {
	const counts = [0, 0];
	for (const owner of state.boxes) if (owner !== null) counts[owner] += 1;
	return counts;
}
function isEdge(move) {
	if (move.dir !== "h" && move.dir !== "v") return false;
	if (!Number.isInteger(move.row) || !Number.isInteger(move.col)) return false;
	const rows = move.dir === "h" ? 5 : 4;
	const cols = move.dir === "h" ? 4 : 5;
	return move.row >= 0 && move.row < rows && move.col >= 0 && move.col < cols;
}
/** The one or two boxes an edge is a wall of (perimeter edges touch one). */
function touchedBoxes(move) {
	const boxes = [];
	if (move.dir === "h") {
		if (move.row > 0) boxes.push({
			row: move.row - 1,
			col: move.col
		});
		if (move.row < 4) boxes.push({
			row: move.row,
			col: move.col
		});
	} else {
		if (move.col > 0) boxes.push({
			row: move.row,
			col: move.col - 1
		});
		if (move.col < 4) boxes.push({
			row: move.row,
			col: move.col
		});
	}
	return boxes;
}
function isBoxClosed(h, v, row, col) {
	return h[hEdgeIndex(row, col)] !== null && h[hEdgeIndex(row + 1, col)] !== null && v[vEdgeIndex(row, col)] !== null && v[vEdgeIndex(row, col + 1)] !== null;
}
function withOwner(owners, index, player) {
	const next = [...owners];
	next[index] = player;
	return next;
}
function emptyOwners(count) {
	return Array.from({ length: count }, () => null);
}
function other$1(player) {
	return player === 0 ? 1 : 0;
}
//#endregion
//#region src/features/play-dots-boxes/ui/board.tsx
function DotsBoxesBoard({ state, me, canMove, onMove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-5 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
					player: 0,
					state,
					me
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
					player: 1,
					state,
					me
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid w-fit rounded-xl border bg-card p-3",
				style: {
					gridTemplateColumns: LATTICE_TRACKS,
					gridTemplateRows: LATTICE_TRACKS
				},
				children: renderLattice(state, canMove, onMove)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Kutuyu kapatan bir tur daha oynar."
			})
		]
	});
}
function EdgeButton({ dir, row, col, owner, canMove, onMove }) {
	const orientation = dir === "h" ? "yatay" : "dikey";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": `${row + 1}. satır ${col + 1}. sütun ${orientation} çizgi`,
		"aria-pressed": owner !== null,
		disabled: owner !== null || !canMove,
		onClick: () => onMove({
			dir,
			row,
			col
		}),
		className: cn("m-[3px] rounded-full transition-colors", owner !== null ? PLAYER_SOLID[owner] : "bg-border enabled:hover:bg-ring/70 enabled:active:bg-ring disabled:opacity-50")
	});
}
function BoxCell({ owner }) {
	if (owner === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "img",
		"aria-label": `${dotsBoxesGame.playerLabels[owner]} kutusu`,
		className: cn("m-[3px] flex items-center justify-center rounded-md text-xs font-bold", PLAYER_SOFT[owner]),
		children: dotsBoxesGame.playerLabels[owner][0]
	});
}
function ScoreChip({ player, state, me }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-full", PLAYER_SOLID[player]) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: dotsBoxesGame.playerLabels[player]
			}),
			player === me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "(sen)"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold tabular-nums",
				children: boxCounts(state)[player]
			})
		]
	});
}
var LATTICE_TRACKS = `repeat(4, 1rem 2.75rem) 1rem`;
var PLAYER_SOLID = ["bg-player-one", "bg-player-two"];
var PLAYER_SOFT = ["bg-player-one/25 text-player-one", "bg-player-two/25 text-player-two"];
function renderLattice(state, canMove, onMove) {
	const cells = [];
	for (let row = 0; row <= 4; row += 1) {
		for (let col = 0; col <= 4; col += 1) {
			cells.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 place-self-center rounded-full bg-foreground/60" }, `dot-${row}-${col}`));
			if (col < 4) cells.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeButton, {
				dir: "h",
				row,
				col,
				owner: state.h[hEdgeIndex(row, col)],
				canMove,
				onMove
			}, `h-${row}-${col}`));
		}
		if (row === 4) break;
		for (let col = 0; col <= 4; col += 1) {
			cells.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeButton, {
				dir: "v",
				row,
				col,
				owner: state.v[vEdgeIndex(row, col)],
				canMove,
				onMove
			}, `v-${row}-${col}`));
			if (col < 4) cells.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoxCell, { owner: state.boxes[boxIndex(row, col)] }, `box-${row}-${col}`));
		}
	}
	return cells;
}
//#endregion
//#region src/features/play-hangman/config/words.ts
var WORDS = [
	"AĞAÇ",
	"ANAHTAR",
	"ARABA",
	"AYAKKABI",
	"AYNA",
	"BAHÇE",
	"BALIK",
	"BARDAK",
	"BAYRAK",
	"BEBEK",
	"BİLGİSAYAR",
	"BULUT",
	"ÇANTA",
	"ÇATAL",
	"ÇEKİÇ",
	"ÇİÇEK",
	"ÇİLEK",
	"ÇORAP",
	"DAĞ",
	"DEFTER",
	"DENİZ",
	"DOLAP",
	"DÜNYA",
	"EKMEK",
	"ELMA",
	"GEMİ",
	"GÖKKUŞAĞI",
	"GÖZLÜK",
	"GÜNEŞ",
	"HALI",
	"HEDİYE",
	"KALEM",
	"KAPI",
	"KARINCA",
	"KAŞIK",
	"KAZAK",
	"KEDİ",
	"KELEBEK",
	"KİRAZ",
	"KİTAP",
	"KÖPEK",
	"KÖPRÜ",
	"KUMANDA",
	"KUŞ",
	"LAMBA",
	"LİMON",
	"MAKAS",
	"MASA",
	"MEKTUP",
	"MERDİVEN",
	"MEYVE",
	"MUTFAK",
	"ORMAN",
	"OYUNCAK",
	"PENCERE",
	"PEYNİR",
	"PORTAKAL",
	"RESİM",
	"SAAT",
	"SABUN",
	"SEPET",
	"SİNEMA",
	"SÖZLÜK",
	"ŞAPKA",
	"ŞEHİR",
	"ŞEMSİYE",
	"TABAK",
	"TAVUK",
	"TELEFON",
	"TİYATRO",
	"TREN",
	"UÇAK",
	"ÜZÜM",
	"VAPUR",
	"YAĞMUR",
	"YASTIK",
	"YILDIZ",
	"YUMURTA",
	"ZEYTİN",
	"ZÜRAFA"
];
//#endregion
//#region src/features/play-hangman/model/rules.ts
var hangmanGame = {
	meta: {
		id: "adam-asmaca",
		name: "Adam Asmaca",
		icon: "🪢",
		tagline: "Altı yanlıştan önce kelimeyi bul"
	},
	playerLabels: ["Oyuncu 1", "Oyuncu 2"],
	init: init$3,
	applyMove: applyMove$3,
	status: status$3,
	turn: turn$3
};
/** The 29-letter Turkish alphabet in dictionary order — the board's letter
* buttons and move validation share it. */
var TURKISH_ALPHABET = [..."ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"];
/** Round r's word belongs to seat r; each word comes from its own derived
* RNG stream (seed, then seed + 1) so the rounds stay independent. */
function init$3(seed, _names) {
	const first = WORDS[pickIndex(mulberry32(seed), WORDS.length)];
	const rng = mulberry32(seed + 1);
	let second = WORDS[pickIndex(rng, WORDS.length)];
	while (second === first) second = WORDS[pickIndex(rng, WORDS.length)];
	return { rounds: [{
		word: first,
		guessed: []
	}, {
		word: second,
		guessed: []
	}] };
}
function applyMove$3(state, move, player) {
	const index = currentRound(state);
	if (index === null) return null;
	if (player !== guesserOf(index)) return null;
	if (typeof move !== "string") return null;
	if (!TURKISH_ALPHABET.includes(move)) return null;
	const active = state.rounds[index];
	if (active.guessed.includes(move)) return null;
	const next = {
		word: active.word,
		guessed: [...active.guessed, move]
	};
	return { rounds: index === 0 ? [next, state.rounds[1]] : [state.rounds[0], next] };
}
function status$3(state) {
	if (currentRound(state) !== null) return { kind: "ongoing" };
	const wins = [0, 0];
	for (const index of [0, 1]) wins[roundWinner(state.rounds[index], index)] += 1;
	if (wins[0] === 2) return {
		kind: "won",
		winner: 0
	};
	if (wins[1] === 2) return {
		kind: "won",
		winner: 1
	};
	const zeroWrongs = wrongLetters(state.rounds[1]).length;
	const oneWrongs = wrongLetters(state.rounds[0]).length;
	if (zeroWrongs < oneWrongs) return {
		kind: "won",
		winner: 0
	};
	if (oneWrongs < zeroWrongs) return {
		kind: "won",
		winner: 1
	};
	return { kind: "draw" };
}
function turn$3(state) {
	const index = currentRound(state);
	return index === null ? null : guesserOf(index);
}
/** Round in play: 0, then 1, then null once both are settled. */
function currentRound(state) {
	if (!isRoundOver(state.rounds[0])) return 0;
	if (!isRoundOver(state.rounds[1])) return 1;
	return null;
}
/** Seat r owns round r's word, so the other seat guesses it. */
function guesserOf(index) {
	return index === 0 ? 1 : 0;
}
function isRoundOver(round) {
	return isWordComplete(round) || wrongLetters(round).length >= 6;
}
function isWordComplete(round) {
	return [...round.word].every((letter) => round.guessed.includes(letter));
}
/** Guessed letters that are not in the word, in guess order. */
function wrongLetters(round) {
	return round.guessed.filter((letter) => !round.word.includes(letter));
}
/** Who took a settled round: the guesser on completion, else the owner. */
function roundWinner(round, index) {
	const guesser = guesserOf(index);
	if (isWordComplete(round)) return guesser;
	return guesser === 0 ? 1 : 0;
}
//#endregion
//#region node_modules/class-variance-authority/dist/index.mjs
/**
* Copyright 2022 Joe Bell. All rights reserved.
*
* This file is licensed to you under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with the
* License. You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/ var falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
var cx = clsx;
var cva = (base, config) => (props) => {
	var _config_compoundVariants;
	if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
	const { variants, defaultVariants } = config;
	const getVariantClassNames = Object.keys(variants).map((variant) => {
		const variantProp = props === null || props === void 0 ? void 0 : props[variant];
		const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
		if (variantProp === null) return null;
		const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
		return variants[variant][variantKey];
	});
	const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
		let [key, value] = param;
		if (value === void 0) return acc;
		acc[key] = value;
		return acc;
	}, {});
	return cx(base, getVariantClassNames, config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
		let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
		return Object.entries(compoundVariantOptions).every((param) => {
			let [key, value] = param;
			return Array.isArray(value) ? value.includes({
				...defaultVariants,
				...propsWithoutUndefined
			}[key]) : {
				...defaultVariants,
				...propsWithoutUndefined
			}[key] === value;
		}) ? [
			...acc,
			cvClass,
			cvClassName
		] : acc;
	}, []), props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
//#endregion
//#region src/shared/ui/badge.tsx
function Badge({ className, variant = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-slot": "badge",
		"data-variant": variant,
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var badgeVariants = cva("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		outline: "border-border bg-transparent text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
//#endregion
//#region src/features/play-hangman/ui/board.tsx
function HangmanBoard({ state, me, canMove, onMove }) {
	const playing = currentRound(state);
	const over = playing === null;
	const shown = playing ?? 1;
	const round = state.rounds[shown];
	const amGuesser = guesserOf(shown) === me;
	const wrongCount = wrongLetters(round).length;
	const locked = over || !amGuesser || !canMove;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full max-w-md flex-col items-center gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "secondary",
					children: [shown + 1, ". Tur"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					"aria-live": "polite",
					children: over ? "Maç bitti" : amGuesser ? canMove ? "Sıra sende — bir harf seç" : "Bekleniyor…" : "Kelimeni rakip tahmin ediyor…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallows, { wrongCount }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-2xl font-bold",
						children: 6 - wrongCount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "kalan hak"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex max-w-full flex-wrap justify-center gap-1.5",
				children: [...round.word].map((letter, index) => {
					const guessed = round.guessed.includes(letter);
					const visible = guessed || !amGuesser || over;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex h-10 w-8 items-center justify-center rounded-md", "border font-mono text-lg font-bold", guessed ? "bg-card" : "bg-muted text-muted-foreground"),
						children: visible ? letter : ""
					}, `${index}-${letter}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex max-w-sm flex-wrap justify-center gap-1.5",
				children: TURKISH_ALPHABET.map((letter) => {
					const guessed = round.guessed.includes(letter);
					const hit = guessed && round.word.includes(letter);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: locked || guessed,
						onClick: () => onMove(letter),
						className: cn("flex size-8 items-center justify-center rounded-md border", "bg-card font-mono text-sm font-semibold outline-none", "transition-colors focus-visible:border-ring", "focus-visible:ring-3 focus-visible:ring-ring/50", !guessed && (locked ? "opacity-50" : "hover:bg-muted active:translate-y-px"), hit && "border-transparent bg-primary text-primary-foreground", guessed && !hit && "border-transparent bg-destructive/10 text-destructive line-through"),
						children: letter
					}, letter);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col items-center gap-1",
				children: state.rounds.map((settled, index) => isRoundOver(settled) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundSummary, {
					round: settled,
					index: index === 0 ? 0 : 1,
					me
				}, settled.word))
			})
		]
	});
}
function RoundSummary({ round, index, me }) {
	const found = isWordComplete(round);
	const mine = roundWinner(round, index) === me;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs text-muted-foreground",
		children: [
			index + 1,
			". tur:",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono font-semibold text-foreground",
				children: round.word
			}),
			" ",
			"— ",
			found ? "bulundu" : "asıldı",
			" · ",
			mine ? "sen aldın" : "rakip aldı",
			" (",
			wrongLetters(round).length,
			" yanlış)"
		]
	});
}
/** The classic stick figure: scaffold always up, one body part per miss. */
function Gallows({ wrongCount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 120 140",
		className: "h-32 w-28",
		role: "img",
		"aria-label": `${wrongCount} yanlış tahmin`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			className: "stroke-muted-foreground",
			strokeWidth: "4",
			strokeLinecap: "round",
			fill: "none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "10",
					y1: "130",
					x2: "110",
					y2: "130"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "30",
					y1: "130",
					x2: "30",
					y2: "15"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "30",
					y1: "15",
					x2: "80",
					y2: "15"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "80",
					y1: "15",
					x2: "80",
					y2: "30"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			className: "stroke-destructive",
			strokeWidth: "4",
			strokeLinecap: "round",
			fill: "none",
			children: [
				wrongCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "80",
					cy: "41",
					r: "11"
				}),
				wrongCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "80",
					y1: "52",
					x2: "80",
					y2: "85"
				}),
				wrongCount > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "80",
					y1: "60",
					x2: "65",
					y2: "74"
				}),
				wrongCount > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "80",
					y1: "60",
					x2: "95",
					y2: "74"
				}),
				wrongCount > 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "80",
					y1: "85",
					x2: "68",
					y2: "106"
				}),
				wrongCount > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "80",
					y1: "85",
					x2: "92",
					y2: "106"
				})
			]
		})]
	});
}
var numbersGame = {
	meta: {
		id: "sayi-tahmin",
		name: "Sayı Tahmin",
		icon: "🔢",
		tagline: "0–100 arası sayıyı bul — herkes 5 tur"
	},
	playerLabels: [
		"Oyuncu 1",
		"Oyuncu 2",
		"Oyuncu 3",
		"Oyuncu 4",
		"Oyuncu 5",
		"Oyuncu 6",
		"Oyuncu 7",
		"Oyuncu 8",
		"Oyuncu 9",
		"Oyuncu 10",
		"Oyuncu 11"
	],
	init: init$2,
	applyMove: applyMove$2,
	status: status$2,
	turn: turn$2
};
var MIN_VALUE = 0;
var MAX_VALUE = 100;
/** Target number is derived from seed for deterministic lockstep. */
function init$2(seed, names) {
	const rng = mulberry32(seed);
	const target = Math.floor(rng() * 101) + MIN_VALUE;
	const playerCount = names.length;
	return {
		target,
		guesses: [],
		lowerBound: MIN_VALUE,
		upperBound: MAX_VALUE,
		currentPlayer: 0,
		playerCount,
		turnsTaken: new Array(playerCount).fill(0)
	};
}
function applyMove$2(state, move, player) {
	if (status$2(state).kind !== "ongoing") return null;
	if (player !== state.currentPlayer) return null;
	if (typeof move.guess !== "number") return null;
	if (!Number.isInteger(move.guess)) return null;
	if (move.guess < state.lowerBound || move.guess > state.upperBound) return null;
	if (state.turnsTaken[player] >= 5) return null;
	const guessEntry = {
		player,
		value: move.guess,
		result: move.guess === state.target ? "correct" : move.guess < state.target ? "higher" : "lower"
	};
	let lowerBound = state.lowerBound;
	let upperBound = state.upperBound;
	if (guessEntry.result === "higher") lowerBound = move.guess + 1;
	else if (guessEntry.result === "lower") upperBound = move.guess - 1;
	const newTurnsTaken = [...state.turnsTaken];
	newTurnsTaken[player] += 1;
	let nextPlayer = (state.currentPlayer + 1) % state.playerCount;
	let checked = 0;
	while (newTurnsTaken[nextPlayer] >= 5 && checked < state.playerCount) {
		nextPlayer = (nextPlayer + 1) % state.playerCount;
		checked++;
	}
	return {
		target: state.target,
		guesses: [...state.guesses, guessEntry],
		lowerBound,
		upperBound,
		currentPlayer: nextPlayer,
		playerCount: state.playerCount,
		turnsTaken: newTurnsTaken
	};
}
function status$2(state) {
	if (state.turnsTaken.every((t) => t >= 5) || state.guesses.length === 0) {
		if (state.guesses.length === 0) return { kind: "ongoing" };
		return {
			kind: "won",
			winner: determineWinner(state)
		};
	}
	const lastGuess = state.guesses[state.guesses.length - 1];
	if (lastGuess?.result === "correct") return {
		kind: "won",
		winner: lastGuess.player
	};
	return { kind: "ongoing" };
}
/** Determine winner: first correct guess wins, otherwise closest guess. */
function determineWinner(state) {
	const correctGuess = state.guesses.find((g) => g.result === "correct");
	if (correctGuess) return correctGuess.player;
	let bestPlayer = state.guesses[0].player;
	let bestDiff = Math.abs(state.guesses[0].value - state.target);
	for (let i = 1; i < state.guesses.length; i++) {
		const diff = Math.abs(state.guesses[i].value - state.target);
		if (diff < bestDiff) {
			bestDiff = diff;
			bestPlayer = state.guesses[i].player;
		}
	}
	return bestPlayer;
}
function turn$2(state) {
	if (status$2(state).kind !== "ongoing") return null;
	if (state.turnsTaken[state.currentPlayer] >= 5) {
		let next = (state.currentPlayer + 1) % state.playerCount;
		let checked = 0;
		while (state.turnsTaken[next] >= 5 && checked < state.playerCount) {
			next = (next + 1) % state.playerCount;
			checked++;
		}
		if (checked >= state.playerCount) return null;
		return next;
	}
	return state.currentPlayer;
}
//#endregion
//#region src/features/play-numbers/ui/board.tsx
function NumbersBoard({ state, me, canMove, onMove }) {
	const gameStatus = numbersGame.status(state);
	const isGameOver = gameStatus.kind === "won";
	const winner = gameStatus.kind === "won" ? gameStatus.winner : -1;
	const isWinner = winner === me;
	const turnsDisplay = state.turnsTaken.map((t, i) => ({
		player: i,
		turns: t,
		label: numbersGame.playerLabels[i] ?? `Oyuncu ${i + 1}`,
		isMe: i === me
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-4 w-full max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full text-center text-sm text-muted-foreground",
				children: [
					"Aralık: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: state.lowerBound }),
					" –",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: state.upperBound })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full flex flex-wrap justify-center gap-1 text-xs text-muted-foreground",
				children: turnsDisplay.map(({ player, turns, label, isMe }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("px-2 py-1 rounded bg-muted", isMe && "bg-primary/10 font-medium"),
					children: [
						label,
						": ",
						turns,
						"/",
						5
					]
				}, player))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: state.lowerBound,
					max: state.upperBound,
					placeholder: `${state.lowerBound}–${state.upperBound} arası tahmin`,
					disabled: !canMove || isGameOver,
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							const value = parseInt(e.currentTarget.value, 10);
							if (!Number.isNaN(value)) {
								onMove({ guess: value });
								e.currentTarget.value = "";
							}
						}
					},
					className: cn("flex-1 px-4 py-3 rounded-xl border bg-background text-center text-2xl font-mono", "enabled:hover:border-primary/50", "disabled:opacity-50 disabled:cursor-not-allowed", "focus:outline-none focus:ring-2 focus:ring-primary"),
					"aria-label": "Sayı tahmininizi girin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !canMove || isGameOver,
					onClick: () => {
						const input = document.querySelector("input[type=number]");
						if (input && !Number.isNaN(parseInt(input.value, 10))) {
							onMove({ guess: parseInt(input.value, 10) });
							input.value = "";
						}
					},
					className: cn("px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold", "enabled:hover:bg-primary/90 enabled:active:scale-[0.98]", "disabled:opacity-50 disabled:cursor-not-allowed", "transition-colors"),
					children: isGameOver ? "Oyun Bitti" : "Tahmin Et"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-h-64 overflow-y-auto space-y-1",
				children: [state.guesses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground py-4",
					children: "Henüz tahmin yok. İlk sen başla!"
				}) : [...state.guesses].reverse().map((g, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuessRow, {
					guess: g,
					me,
					playerLabel: numbersGame.playerLabels[g.player] ?? `Oyuncu ${g.player + 1}`
				}, idx)), isGameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("text-center py-3 rounded-xl font-semibold text-lg", isWinner ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"),
					children: isWinner ? "🎉 Kazandın! Tebrikler!" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Oyun bitti! Kazanan:",
						" ",
						numbersGame.playerLabels[winner] ?? `Oyuncu ${winner + 1}`,
						state.guesses.some((g) => g.result === "correct") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2",
							children: "(Doğru tahmin!)"
						}),
						!state.guesses.some((g) => g.result === "correct") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2",
							children: "(En yakın tahmin kazandı)"
						})
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground text-center",
				children: isGameOver ? "Oyun bitti — Herkes 5 tur oynadı" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Sıra:",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-medium", me === state.currentPlayer ? "text-primary" : ""),
						children: state.currentPlayer === me ? "(Sen)" : numbersGame.playerLabels[state.currentPlayer] ?? `Oyuncu ${state.currentPlayer + 1}`
					}),
					state.turnsTaken[state.currentPlayer] >= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-amber-600",
						children: "(Tur hakları bitti)"
					})
				] })
			})
		]
	});
}
function GuessRow({ guess, me, playerLabel }) {
	const isMe = guess.player === me;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm", isMe && "bg-primary/10 ring-1 ring-primary/20", !isMe && "bg-muted/50"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-muted-foreground w-10 text-right",
				children: guess.value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex-1 text-left font-medium",
				children: [playerLabel, isMe && " (Sen)"]
			}),
			guess.result === "correct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-green-600 dark:text-green-400 font-bold",
				children: "✓ Doğru!"
			}),
			guess.result === "higher" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-600 dark:text-red-400 font-mono",
				children: "⬆ Daha büyük"
			}),
			guess.result === "lower" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-blue-600 dark:text-blue-400 font-mono",
				children: "⬇ Daha küçük"
			})
		]
	});
}
//#endregion
//#region src/features/play-rps/model/rules.ts
var rpsGame = {
	meta: {
		id: "tas-kagit-makas",
		name: "Taş-Kağıt-Makas",
		icon: "✊",
		tagline: "Üç el kazanan maçı alır"
	},
	playerLabels: ["Oyuncu 1", "Oyuncu 2"],
	init: init$1,
	applyMove: applyMove$1,
	status: status$1,
	turn: turn$1
};
var RPS_CHOICES = [
	"tas",
	"kagit",
	"makas"
];
/** What each choice defeats — the whole rulebook in one map. */
var BEATS = {
	tas: "makas",
	kagit: "tas",
	makas: "kagit"
};
/** RPS needs no randomness; the room seed is deliberately unused. */
function init$1(_seed, _names) {
	return {
		pending: [null, null],
		rounds: [],
		score: [0, 0]
	};
}
function applyMove$1(state, move, player) {
	if (!isChoice(move)) return null;
	if (status$1(state).kind !== "ongoing") return null;
	if (state.pending[player] !== null) return null;
	const pending = [...state.pending];
	pending[player] = move;
	const [zero, one] = pending;
	if (zero === null || one === null) return {
		...state,
		pending
	};
	const winner = duelWinner(zero, one);
	const score = [...state.score];
	if (winner !== null) score[winner] += 1;
	return {
		pending: [null, null],
		rounds: [...state.rounds, {
			choices: [zero, one],
			winner
		}],
		score
	};
}
function status$1(state) {
	if (state.score[0] >= 3) return {
		kind: "won",
		winner: 0
	};
	if (state.score[1] >= 3) return {
		kind: "won",
		winner: 1
	};
	return { kind: "ongoing" };
}
/** Moves are simultaneous — there is never a "current" player. */
function turn$1(_state) {
	return null;
}
/** Winner of one resolved round, or null on a tie. */
function duelWinner(zero, one) {
	if (zero === one) return null;
	return BEATS[zero] === one ? 0 : 1;
}
function isChoice(value) {
	return RPS_CHOICES.includes(value);
}
//#endregion
//#region src/features/play-rps/ui/board.tsx
function RpsBoard({ state, me, canMove, onMove }) {
	const opponent = me === 0 ? 1 : 0;
	const mine = state.pending[me];
	const over = rpsGame.status(state).kind !== "ongoing";
	const locked = !canMove || mine !== null || over;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full max-w-md flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreLine, {
				me,
				mine: state.score[me],
				theirs: state.score[opponent]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: RPS_CHOICES.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: locked,
					"aria-pressed": mine === choice,
					onClick: () => onMove(choice),
					className: cn("flex flex-col items-center gap-1 rounded-xl border bg-card", "py-4 text-card-foreground shadow-sm outline-none transition-all", "focus-visible:border-ring focus-visible:ring-3", "focus-visible:ring-ring/50", mine === choice ? "border-primary ring-2 ring-primary/40" : locked ? "opacity-50" : "hover:bg-muted active:translate-y-px"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl",
						"aria-hidden": "true",
						children: CHOICE_FACES[choice].emoji
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: CHOICE_FACES[choice].label
					})]
				}, choice))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted-foreground",
				"aria-live": "polite",
				children: over ? "Maç bitti" : mine !== null ? "Seçimin gizlendi — rakip bekleniyor…" : canMove ? "Seçimini yap" : "Bekleniyor…"
			}),
			state.rounds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-1.5",
				children: state.rounds.map((round, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("flex items-center justify-between gap-2 rounded-lg border", "bg-card px-3 py-1.5 text-sm"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [index + 1, ". el"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								CHOICE_FACES[round.choices[me]].emoji,
								" ",
								CHOICE_FACES[round.choices[me]].label,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: " — "
								}),
								CHOICE_FACES[round.choices[opponent]].label,
								" ",
								CHOICE_FACES[round.choices[opponent]].emoji
							]
						}),
						round.winner === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Berabere"
						}) : round.winner === me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Kazandın" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: "Rakip aldı"
						})
					]
				}, index)).reverse()
			})
		]
	});
}
function ScoreLine({ me, mine, theirs }) {
	const myTone = me === 0 ? "text-player-one" : "text-player-two";
	const theirTone = me === 0 ? "text-player-two" : "text-player-one";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-center gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Sen"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono text-3xl font-bold", myTone),
					children: mine
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "pb-1.5 text-xs text-muted-foreground",
				children: [
					"ilk ",
					3,
					" galibiyet"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Rakip"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono text-3xl font-bold", theirTone),
					children: theirs
				})]
			})
		]
	});
}
var CHOICE_FACES = {
	tas: {
		emoji: "✊",
		label: "Taş"
	},
	kagit: {
		emoji: "✋",
		label: "Kağıt"
	},
	makas: {
		emoji: "✌️",
		label: "Makas"
	}
};
//#endregion
//#region src/features/play-xox/model/rules.ts
var xoxGame = {
	meta: {
		id: "xox",
		name: "XOX",
		icon: "❌",
		tagline: "Üç işareti ilk hizalayan kazanır."
	},
	playerLabels: ["X", "O"],
	init,
	applyMove,
	status,
	turn
};
var CELL_COUNT = 9;
/** Every winning line as row-major cell indexes: rows, columns, diagonals. */
var LINES = [
	[
		0,
		1,
		2
	],
	[
		3,
		4,
		5
	],
	[
		6,
		7,
		8
	],
	[
		0,
		3,
		6
	],
	[
		1,
		4,
		7
	],
	[
		2,
		5,
		8
	],
	[
		0,
		4,
		8
	],
	[
		2,
		4,
		6
	]
];
function init(_seed, _names) {
	return {
		board: Array.from({ length: CELL_COUNT }, () => null),
		current: 0
	};
}
function applyMove(state, move, player) {
	if (turn(state) !== player) return null;
	const cell = move.cell;
	if (!Number.isInteger(cell) || cell < 0 || cell >= CELL_COUNT) return null;
	if (state.board[cell] !== null) return null;
	return {
		board: state.board.map((mark, index) => index === cell ? player : mark),
		current: other(player)
	};
}
function status(state) {
	for (const [a, b, c] of LINES) {
		const mark = state.board[a];
		if (mark !== null && mark === state.board[b] && mark === state.board[c]) return {
			kind: "won",
			winner: mark
		};
	}
	return state.board.every((mark) => mark !== null) ? { kind: "draw" } : { kind: "ongoing" };
}
function turn(state) {
	return status(state).kind === "ongoing" ? state.current : null;
}
function other(player) {
	return player === 0 ? 1 : 0;
}
//#endregion
//#region src/features/play-xox/ui/board.tsx
function XoxBoard({ state, me, canMove, onMove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-label": "XOX tahtası",
			className: "grid grid-cols-3 gap-2",
			children: state.board.map((mark, cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !canMove || mark !== null,
				"aria-label": cellLabel(cell, mark),
				onClick: () => onMove({ cell }),
				className: cn("flex size-20 items-center justify-center rounded-xl border bg-card font-mono text-4xl font-bold shadow-sm transition-colors select-none", "enabled:hover:bg-muted enabled:active:translate-y-px", !canMove && "opacity-60", mark === 0 && "text-player-one", mark === 1 && "text-player-two"),
				children: mark === null ? "" : xoxGame.playerLabels[mark]
			}, cell))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"Senin işaretin:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono font-bold", me === 0 ? "text-player-one" : "text-player-two"),
					children: xoxGame.playerLabels[me]
				})
			]
		})]
	});
}
function cellLabel(cell, mark) {
	const position = `${Math.floor(cell / 3) + 1}. satır ${cell % 3 + 1}. sütun`;
	return mark === null ? `${position}: boş` : `${position}: ${xoxGame.playerLabels[mark]}`;
}
//#endregion
//#region src/routes/-catalog.ts
/** Catalog order = the home grid order. */
var gamesList = [
	{
		def: xoxGame,
		Board: XoxBoard
	},
	{
		def: connectFourGame,
		Board: ConnectFourBoard
	},
	{
		def: rpsGame,
		Board: RpsBoard
	},
	{
		def: battleshipGame,
		Board: BattleshipBoard
	},
	{
		def: dotsBoxesGame,
		Board: DotsBoxesBoard
	},
	{
		def: hangmanGame,
		Board: HangmanBoard
	},
	{
		def: numbersGame,
		Board: NumbersBoard
	}
];
var gamesById = new Map(gamesList.map((game) => [game.def.meta.id, game]));
//#endregion
export { BRAND as a, cn as i, gamesList as n, cva as r, gamesById as t };
