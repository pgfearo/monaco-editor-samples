import * as monaco from 'monaco-editor';

export namespace xslThemeData {
	export const vsDark: monaco.editor.ITokenThemeRule[] = [
		{
			token: 'attributeName',
			foreground: '#ff0000'
		},
		{
			token: 'attributeEquals',
			foreground: '#ff0000'
		},
		{
			token: 'attributeValue',
			foreground: '#ff0000'
		},
		{
			token: 'xmlnsName',
			foreground: '#ff0000'
		},
		{
			token: 'dtd',
			foreground: '#ff0000'
		},
		{
			token: 'dtdEnd',
			foreground: '#ff0000'
		},
		{
			token: 'elementName',
			foreground: '#ff0000'
		},
		{
			token: 'elementValue',
			foreground: '#ff0000'
		},
		{
			token: 'processingInstrName',
			foreground: '#ff0000'
		},
		{
			token: 'processingInstrValue',
			foreground: '#ff0000'
		},
		{
			token: 'entityRef',
			foreground: '#ff0000'
		},
		{
			token: 'xmlComment',
			foreground: '#ff0000'
		},
		{
			token: 'xmlPunctuation',
			foreground: '#0000ff'
		},
		{
			token: 'xslElementName',
			foreground: '#00ff00'
		},
		{
			token: 'xmlText',
			foreground: '#ff0000'
		}
	]
}