# CForge Studio

A modern, responsive browser-based C development interface built with **HTML, CSS and JavaScript**.

## Included

- `index.html` — complete application in one file
- Modern IDE-style header, explorer, editor, terminal and diagnostics panel
- C17-oriented workflow
- C source editor with line numbers
- Run / build simulation and diagnostics
- Save `main.c` to your device
- Open local `.c`, `.h` and text files
- Keyboard shortcut: `Ctrl + Enter` to run
- Tab inserts four spaces
- Responsive mobile/tablet/desktop layout
- No external libraries or CDN dependencies

## Important compiler note

A real C compiler cannot be implemented reliably using only normal browser JavaScript without either:
1. compiling a C compiler such as Clang/GCC to WebAssembly, or
2. connecting the UI to a backend compilation service.

This project therefore provides a **browser-side compiler/execution preview frontend**. It checks several common C errors and previews `printf()` output. The UI is deliberately structured so a native GCC/Clang or WebAssembly compiler can be connected later.

### Connecting a real compiler

Recommended architecture:

Browser UI
→ POST `/api/compile`
→ sandboxed GCC/Clang process
→ captured stdout/stderr
→ browser terminal

Never execute arbitrary user C code directly on a production server without sandboxing. Use an isolated container/VM, CPU and memory limits, execution timeouts, filesystem restrictions, and disabled network access.

## Run

1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Write C in `main.c`.
4. Press **Run C** or `Ctrl + Enter`.

No installation is required for the frontend demo.

## Project structure

```text
cforge-studio/
├── index.html
└── README.md
```

## Future upgrade path

For a full online compiler, add:

- Clang/GCC WebAssembly backend
- Real syntax highlighting
- Monaco/CodeMirror editor
- Multi-file project tree
- stdin input panel
- compiler flags
- C11/C17/C23 selector
- real compile errors and warnings
- assembly output
- format-on-save
- project import/export
- server-side sandbox
- execution timeout and memory limits
- test-case runner
- shareable projects

## License

Use and modify this starter project for your own website/project.
