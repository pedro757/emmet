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

connection.onInitialize(function () {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
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
