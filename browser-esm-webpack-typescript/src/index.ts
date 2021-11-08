import * as monaco from 'monaco-editor';
import './index.css';
import { XSLTConfiguration } from './languageConfigurations';
import { BaseToken } from './xpLexer';
import { LanguageConfiguration, XslLexer } from './xslLexer';

// @ts-ignore
self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
};

// unsure how to use these yet - related to 'encodedTokensColors' property
// of IStandaloneThemeData interfac that takes a string[] type?
const themeColors: monaco.editor.IColors = {'mygreen': '#0000ff'};

const themeRules: monaco.editor.ITokenThemeRule[] = [
	{
		token: 'xmlPunctuation',
		foreground: '#0000ff'
	}
]

const themeData: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
	rules: themeRules,
	colors: themeColors
}

const legend = {
    tokenTypes: [
        'xmlPunctuation', 'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
        'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
        'member', 'macro', 'variable', 'parameter', 'property', 'label'
    ],
    tokenModifiers: [
        'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
        'modification', 'async'
    ]
};

function getType(type: string) {
    return legend.tokenTypes.indexOf(type);
}

function getAdaptedXslType(tokenType: number) {
	return tokenType;;
}

const tokenPattern = new RegExp('([a-zA-Z]+)((?:\\.[a-zA-Z]+)*)', 'g');
const xslLexer: XslLexer = new XslLexer(XSLTConfiguration.configuration);
const xslLegend = XslLexer.getTextmateTypeLegend();

xslLexer.provideCharLevelState = true;

monaco.editor.defineTheme('xslDarkTheme', themeData);

monaco.languages.registerDocumentSemanticTokensProvider('plaintext', {
	getLegend: function () {
			return {
				tokenTypes: xslLegend,
				tokenModifiers: []
			}
	},
	provideDocumentSemanticTokens: function (model, lastResultId, token) {
			const lines = model.getLinesContent();
			const text = lines.join('\n');
			const allTokens = xslLexer.analyse(text);
			console.log({allTokens});
			/** @type {number[]} */
			const data = [];

			let prevLine = 0;
			let prevChar = 0;

			for (let i = 0; i < allTokens.length; i++) {
				const token: BaseToken = allTokens[i];
				let type = getAdaptedXslType(token.tokenType);
				let modifier = 0;
				let line = token.line;
				let char = token.startCharacter;
				data.push(
					// translate line to deltaLine
					line - prevLine,
					// for the same line, translate start to deltaStart
					prevLine === line ? char - prevChar : char,
					token.length,
					type,
					modifier
			);

			prevLine = line;
			prevChar = token.startCharacter;
			}

			return {
					data: new Uint32Array(data),
					resultId: null
			};
	},
	releaseDocumentSemanticTokens: function (resultId) { }
});

const mEditor = monaco.editor.create(document.body, {
    value:
        `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:xs="http://www.w3.org/2001/XMLSchema"
		exclude-result-prefixes="#all"
		expand-text="yes"
		version="3.0">

<xsl:variable select="@*, /abc/def/node()"/>
</xsl:stylesheet>`,
	language: 'plaintext',
	theme: 'xslDarkTheme',
	'semanticHighlighting.enabled': true
});
