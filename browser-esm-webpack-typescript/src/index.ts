import * as monaco from 'monaco-editor';
import './index.css';

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

const themeRules: monaco.editor.ITokenThemeRule[] = [
	{
		token: 'xmlPunctuation',
		foreground: '#ff0000'
	}
]

const themeColors: monaco.editor.IColors = {'myred': '#ff0000'};

const themeData: monaco.editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
	rules: themeRules,
	colors: themeColors
}

const legend = {
    tokenTypes: [
        'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
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

const tokenPattern = new RegExp('([a-zA-Z]+)((?:\\.[a-zA-Z]+)*)', 'g');

monaco.editor.defineTheme('myTheme', themeData);

monaco.languages.registerDocumentSemanticTokensProvider('plaintext', {
	getLegend: function () {
			return legend;
	},
	provideDocumentSemanticTokens: function (model, lastResultId, token) {
			const lines = model.getLinesContent();

			/** @type {number[]} */
			const data = [];

			let prevLine = 0;
			let prevChar = 0;

			for (let i = 0; i < lines.length; i++) {
					const line = lines[i];

					for (let match = null; match = tokenPattern.exec(line);) {
							// translate token and modifiers to number representations
							let type = getType(match[1]);
							if (type === -1) {
									continue;
							}
							let modifier = 0

							data.push(
									// translate line to deltaLine
									i - prevLine,
									// for the same line, translate start to deltaStart
									prevLine === i ? match.index - prevChar : match.index,
									match[0].length,
									type,
									modifier
							);

							prevLine = i;
							prevChar = match.index;
					}
			}
			return {
					data: new Uint32Array(data),
					resultId: null
			};
	},
	releaseDocumentSemanticTokens: function (resultId) { }
});

const mEditor = monaco.editor.create(document.body, {
    value: [
        'Available token types:',
        '    [comment] [string] [keyword] [number] [regexp] [operator] [namespace]',
        '    [type] [struct] [class] [interface] [enum] [typeParameter] [function]',
        '    [member] [macro] [variable] [parameter] [property] [label]',
        '',
        'Available token modifiers:',
        '    [type.declaration] [type.documentation] [type.member] [type.static]',
        '    [type.abstract] [type.deprecated] [type.modification] [type.async]',
        '',
        'Some examples:',
        '    [class.static.token]     [type.static.abstract]',
        '    [class.static.token]     [type.static]',
        '',
        '    [struct]',
        '',
        '    [function.private]',
        '',
        'An error case:',
        '    [notInLegend]'
    ].join('\n'),
	language: 'plaintext',
	theme: 'dark',
	'semanticHighlighting.enabled': true
});
