" David's .vimrc

" Sanely reset options
set nocompatible

" Enable syntax highlighting
syntax enable 

" Use colorscheme badwolf
colorscheme badwolf

" Visual spaces per tab
set tabstop=4

" Number of spaces in tab when editing
set softtabstop=4

" Tabs are spaces
set expandtab

" Show line numbers
set number

" Show command in bottom bar
set showcmd

" Highlight cursor line
set cursorline

" Visual autcomplete for command menu
set wildmenu

" Redraw only when we need to
set lazyredraw

" Highlight matching brackets, curly-brackets, parenthesees
set showmatch

" Search as characters are entered
set incsearch

" Highlight matches
set hlsearch

" Move to beginning/end of line
nnoremap B ^
nnoremap E $

" Mouse support
set mouse=a
