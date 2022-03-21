import expand, { extract } from "emmet";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  TextDocumentPositionParams,
  TextDocuments,
  InsertTextFormat,
  CompletionItemKind,
} from "vscode-languageserver/node";

const syntaxes = {
  markup: ["html", "xml", "xsl", "jsx", "js", "pug", "slim", "haml", "hbs",
    "handlebars", "php", "vue"],
  stylesheet: ["css", "sass", "scss", "less", "sss", "stylus"],
};

function parseLanguage(language: string): string {
  if (language == "javascriptreact" || language == "typescriptreact")
    language = "jsx";
  if (language === "javascript") language = "js";
  return language;
}

function isMarkupEmmet(language: string): boolean {
  const markupSyntaxes = syntaxes.markup;
  language = parseLanguage(language);

  if (markupSyntaxes.some((filetype) => language == filetype)) {
    return true;
  }

  return false;
}

function getSyntax(language: string): string | undefined {
  const availableSyntaxes = [...syntaxes.markup, ...syntaxes.stylesheet];
  language = parseLanguage(language);

  if (availableSyntaxes.some((syntax) => syntax == language)) {
    return language;
  }

  return undefined;
}

function getExtracted(language: string, line: string, character: number) {
  let extracted;
  if (isMarkupEmmet(language)) {
    extracted = extract(line, character);
  } else {
    extracted = extract(line, character, { type: "stylesheet" });
  }

  if (extracted?.abbreviation == undefined) {
    throw "failed to parse line";
  }

  return {
    left: extracted.start,
    right: extracted.end,
    abbreviation: extracted.abbreviation,
    location: extracted.location,
  };
}

function getExpanded(language: string, abbreviation: string): string {
  let expanded;
  const options = {
    "output.field": (index: any, placeholder: any) =>
      "${" + index + (placeholder && ":" + placeholder) + "}",
  };
  const syntax = getSyntax(language);
  if (isMarkupEmmet(language)) {
    expanded = expand(abbreviation, { options, syntax });
  } else {
    expanded = expand(abbreviation, { type: "stylesheet", options, syntax });
  }
  return expanded;
}

function complete(
  textDocsPosition: TextDocumentPositionParams,
  documents: TextDocuments<TextDocument>
) {
  const docs = documents.get(textDocsPosition.textDocument.uri);
  if (!docs) throw "failed to find document";
  const languageId = docs.languageId;
  const content = docs.getText();
  const linenr = textDocsPosition.position.line;
  const line = String(content.split(/\r?\n/g)[linenr]);
  const character = textDocsPosition.position.character;

  const { left, right, abbreviation } = getExtracted(
    languageId,
    line,
    character
  );
  const textResult = getExpanded(languageId, abbreviation);

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

export default complete;
