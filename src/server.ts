#!/usr/bin/env node

import complete from "./completion"
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CompletionItem,
  createConnection,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
let hasWorkspaceFolderCapability: boolean = false;

connection.onInitialize(function (params: InitializeParams) {
  let capabilities = params.capabilities;

  // Does the client support the `workspace/configuration` request?
  // If not, we fall back using global settings.
  hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
    },
  };
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    };
  }
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

connection.onCompletion(function (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] {
  try {
    return complete(textDocumentPosition, documents);
  } catch (error) {
    connection.console.log(`ERR: ${error}`);
  }

  return [];
});

documents.listen(connection);

connection.listen();
