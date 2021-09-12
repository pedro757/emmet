# emmets

Emmet support based on LSP. This is a fork of [this](https://github.com/aca/emmet-ls) project that seems unmaintained

![alt](https://i.ibb.co/TgHGmsb/emmet.gif)

#### Requirements
1. [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) Installed
2. A completion plugin that support LSP like:
    - [nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
    - [nvim-completion](https://github.com/nvim-lua/completion-nvim)

#### Install

```
npm install -g ls_emmet
```

#### Configuration

  In your neovim config:

  ```lua
  local lspconfig = require'lspconfig'
  local configs = require'lspconfig/configs'

  local capabilities = vim.lsp.protocol.make_client_capabilities()
  capabilities.textDocument.completion.completionItem.snippetSupport = true

  configs.ls_emmet = {
    default_config = {
      cmd = {'ls_emmet', '--stdio'};
      filetypes = {'html', 'css'};
      root_dir = function(fname)
        return vim.loop.cwd()
        end;
      settings = {};
    };
  }

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
