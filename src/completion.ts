import { extract } from "emmet";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  TextDocumentPositionParams,
  TextDocuments,
  InsertTextFormat,
  CompletionItemKind
} from "vscode-languageserver/node";

function isMarkupEmmet(language: String):boolean {
  let markupFiletypes = [ 'html', 'xml', 'markdown', '']
  if (markupFiletypes.some(filetype => language == filetype)) {
    return true
  }
  return false
}

function getPositionParams(language: String) {

}

function complete(textDocsPosition: TextDocumentPositionParams, documents: TextDocuments<TextDocument>) {
  let docs = documents.get(textDocsPosition.textDocument.uri);
  if (!docs) throw "failed to find document";
  let languageId = docs.languageId;
  let content = docs.getText();
  let linenr = textDocsPosition.position.line;
  let line = String(content.split(/\r?\n/g)[linenr]);
  let character = textDocsPosition.position.character;
  let extractPosition =
    languageId != "css" ? extract(line, character) : extract(line, character, { type: "stylesheet" });

  if (extractPosition?.abbreviation == undefined) {
    throw "failed to parse line";
  }

  let left = extractPosition.start;
  let right = extractPosition.start;
  let abbreviation = extractPosition.abbreviation;
  let textResult = "";
  if (languageId != "css") {
    /* const htmlconfig = resolveConfig({
      options: {
        "output.field": (index, placeholder) => ` \$\{${index}${placeholder ? ":" + placeholder : ""}\} `,
      },
    });
    const markup = parseMarkup(abbreviation, htmlconfig);
    textResult = stringifyMarkup(markup, htmlconfig); */
  } else {
    /* const cssConfig = resolveConfig({
      type: "stylesheet",
      options: {
        "output.field": (index, placeholder) => ` \$\{${index}${placeholder ? ":" + placeholder : ""}\} `,
      },
    });
    const markup = parseStylesheet(abbreviation, cssConfig);
    textResult = stringifyStylesheet(markup, cssConfig); */
  }

  textResult = textResult.replace(/ /g, '')
  const range = {
    start: {
      line: linenr,
      character: left,
    },
    end: {
      line: linenr,
      character: right,
    },
  };

  return [
    {
      insertTextFormat: InsertTextFormat.Snippet,
      label: abbreviation,
      detail: abbreviation,
      documentation: textResult,
      textEdit: {
        range,
        newText: textResult,
      },
      kind: CompletionItemKind.Snippet,
      data: {
        range,
        textResult,
      },
    },
  ];
}

export default complete
