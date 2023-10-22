import plugin from "../plugin.json";
import style from "./style.scss";
const settings = acode.require("settings");
const { editor } = editorManager;
const themes = acode.require("themes");
const ThemeBuilder = acode.require("themeBuilder");
const themeName = "jellyfish";

ace.define(
	`ace/theme/${themeName}.css`,
	["require", "exports", "module"],
	function (require, exports, module) {
		module.exports = style;
	}
),
	ace.define(
		`ace/theme/${themeName}`,
		[
			"require",
			"exports",
			"module",
			`ace/theme/${themeName}.css`,
			"ace/lib/dom"
		],
		function (require, exports, module) {
			(exports.isDark = !0),
				(exports.cssClass = `ace-${themeName}`),
				(exports.cssText = require(`./${themeName}.css`));
			const dom = require("../lib/dom");
			dom.importCssString(exports.cssText, exports.cssClass, !1);
		}
	);
(function () {
	window.require(["ace/theme/" + themeName], function (m) {
		if (typeof module == "object" && typeof exports == "object" && module) {
			module.exports = m;
		}
	});
})();

function addTheme(name) {
	const jellyfish_theme = new ThemeBuilder(name, "dark", "free");

	jellyfish_theme.primaryColor = "#00002c";
	jellyfish_theme.popupBackgroundColor = "#171520dc";
	jellyfish_theme.darkenedPrimaryColor = "#00002c";
	jellyfish_theme.primaryTextColor = "#ffffff";
	jellyfish_theme.secondaryColor = "#010033c7";
	jellyfish_theme.secondaryTextColor = "#fff";
	jellyfish_theme.activeColor = "#ff00885d";
	jellyfish_theme.activeIconColor = "#00ffff";
	jellyfish_theme.linkTextColor = "#00d9ff";
	jellyfish_theme.errorTextColor = "#ff0000";
	jellyfish_theme.scrollbarColor = "#ffff";
	jellyfish_theme.borderColor = "#00d9ff";
	jellyfish_theme.popupBorderColor = "#00d9ff";
	jellyfish_theme.borderRadius = "4px";
	jellyfish_theme.popupBorderRadius = "4px";
	jellyfish_theme.popupIconColor = "#00d9ff";
	jellyfish_theme.popupTextColor = "#ffffff";
	jellyfish_theme.popupActiveColor = "#f9ff24";
	jellyfish_theme.boxShadowColor = "#00000033";
	jellyfish_theme.buttonActiveColor = "#61afefae";
	jellyfish_theme.buttonBackgroundColor = "#ff0055";
	jellyfish_theme.buttonTextColor = "#ffffff";
	themes.add(jellyfish_theme);
	themes.apply(name);
}

class AcodePlugin {
	async init() {
		addTheme("Jellyfish");
		ace.require("ace/ext/themelist").themes.push({
			caption: themeName
				.split("-")
				.map((name) => name[0].toUpperCase() + name.slice(1))
				.join(" "),
			theme: "ace/theme/" + themeName,
			isDark: true
		});

		const currentTheme = settings.get("editorTheme");
		if (currentTheme === themeName) editor.setTheme("ace/theme/" + themeName);
		settings.on("update", this.onThemeChange);
	}

	async destroy() {
		settings.off("update", this.onThemeChange);
	}

	onThemeChange(value) {
		if (value === "ace/theme/" + themeName) {
			editor.setTheme("ace/theme/" + themeName);
			settings.update({ editorTheme: themeName });
		}
	}
}

if (window.acode) {
	const acodePlugin = new AcodePlugin();
	acode.setPluginInit(
		plugin.id,
		(baseUrl, $page, { cacheFileUrl, cacheFile }) => {
			if (!baseUrl.endsWith("/")) {
				baseUrl += "/";
			}
			acodePlugin.baseUrl = baseUrl;
			acodePlugin.init($page, cacheFile, cacheFileUrl);
		}
	);
	acode.setPluginUnmount(plugin.id, () => {
		acodePlugin.destroy();
	});
}
