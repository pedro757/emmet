# Emmets

Emmet support based on LSP. This is a fork of [this](https://github.com/aca/emmet-ls) project that seems unmaintained

![emmet-gif](https://i.ibb.co/TgHGmsb/emmet.gif)

## Requirements
1. [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) Installed
2. A completion plugin that supports LSP, like:
    - [nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
    - [nvim-completion](https://github.com/nvim-lua/completion-nvim)
3. A Snippet plugin that supports LSP, like:
    - [luasnip](https://github.com/L3MON4D3/LuaSnip)
    - [vim-vsnip](https://github.com/hrsh7th/vim-vsnip)

## Install

```
npm install -g ls_emmet
```

## Configuration

  In your neovim config:

  ```lua
  local lspconfig = require'lspconfig'
  local configs = require'lspconfig.configs'

  local capabilities = vim.lsp.protocol.make_client_capabilities()
  capabilities.textDocument.completion.completionItem.snippetSupport = true

  if not configs.ls_emmet then
    configs.ls_emmet = {
      default_config = {
        cmd = { 'ls_emmet', '--stdio' };
        filetypes = { 'html', 'css', 'scss', 'javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'haml',
          'xml', 'xsl', 'pug', 'slim', 'sass', 'stylus', 'less', 'sss'};
        root_dir = function(fname)
          return vim.loop.cwd()
        end;
        settings = {};
      };
    }
  end

  lspconfig.ls_emmet.setup{ capabilities = capabilities }

  ```

Just type:

```
table>tr*3>td*2
```

And it will be expanded to:

```html
<table>
  <tr>
    <td>|</td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
  </tr>
</table>
```

## Contribuiting
Bug reports, feature suggestions and especially code contributions are welcome. You open a GitHub issue or pull
request. Please read [this document](CONTRIBUTING.md) before opening an issue.

## Supported Languages
| Markup   | StyleSheets    |
|--------- | -------------- |
| HTML   | CSS    |
| JSX    | SCSS   |
| JS     | SASS   |
| XML    | STYLUS |
| XSL    | SSS    |
| HAML   | LESS   |
| PUG    |        |
| SLIM   |        |
