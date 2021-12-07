#!/usr/bin/env node

import complete from "./completion";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CompletionItem,
  createConnection,
  InitializeResult,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

const triggerCharacters = [
  ">",
  ")",
  "]",
  "}",

  "@",
  "*",
  "$",
  "+",

  // alpha
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",

  // num
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

connection.onInitialize(function () {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: triggerCharacters,
      },
    },
  };
  return result;
});

// The example settings
interface ExampleSettings {
  maxNumberOfProblems: number;
}

let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

documents.onDidClose(function (e) {
  documentSettings.delete(e.document.uri);
});

connection.onCompletion(function (
  textDocumentPosition: TextDocumentPositionParams
): CompletionItem[] {
  try {
    return complete(textDocumentPosition, documents);
  } catch (error) {
    connection.console.log(`ERR: ${error}`);
  }

  return [];
});

documents.listen(connection);

connection.listen();
