# CForge Neon Pro

A premium, animated, OnlineGDB-inspired C compiler IDE frontend.

## Files
- `index.html` — application structure
- `style.css` — complete visual system and responsive design
- `script.js` — editor, run simulation, diagnostics, file actions and UI interactions

## Highlights
- Neon/glassmorphism developer dashboard
- Animated aurora + grid background
- Professional command bar
- C editor with line numbers and minimap
- Compiler status card
- stdin panel
- compiler options
- output / problems / terminal / debugger tabs
- debugger controls, breakpoints, variables and call-stack UI
- save/open/new project actions
- Ctrl+Enter run shortcut
- mobile responsive layout

## Run
Open `index.html` in a modern browser.

## Real compiler
This is a frontend demo. For genuine arbitrary C compilation, connect the Run action to a sandboxed GCC/Clang backend or compile a C compiler to WebAssembly. Never execute untrusted C directly inside a normal web-server process.

## Backend API shape
`POST /api/compile` with source, compiler, standard, flags and stdin; return stdout, stderr, exitCode and execution time. Use CPU/memory/time limits, no network, isolated filesystem and strong sandboxing.
