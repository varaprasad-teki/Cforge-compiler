# CForge Online — Advanced C Compiler & Debugger UI

A polished OnlineGDB-style C development interface made with HTML, CSS and JavaScript.

## Features

- Advanced IDE-style layout
- Project/file explorer
- C17/C11/C99/C23 selectors
- GCC/Clang-style compiler selector
- Optimization profile selector
- Compiler flags field
- Main C editor with line numbers
- Standard input (stdin) panel
- Output / Compiler / stdin / Debugger tabs
- Compiler diagnostics for common mistakes
- `printf()` output simulation
- Execution time and exit code display
- Debugger-style controls and breakpoint/watch/call-stack UI
- New/Open/Save source
- Format action
- Ctrl+Enter Run shortcut
- Responsive desktop/tablet/mobile design
- No external CDN dependency

## Important: real online compilation

This package provides a **realistic compiler frontend and local C-output/diagnostic engine**, but it does not execute arbitrary C machine code in the browser.

To make it a true OnlineGDB-style compiler, connect the Run action to one of these backends:

### Option A — WebAssembly
Compile Clang/GCC or another C compiler to WebAssembly and run it in a Web Worker. This gives client-side compilation and can work without a server after assets are cached.

### Option B — Secure server API
Browser:
`POST /api/compile`

Example request:
```json
{
  "language": "c",
  "standard": "c17",
  "compiler": "gcc",
  "flags": ["-Wall","-Wextra"],
  "source": "...",
  "stdin": "..."
}
```

Response:
```json
{
  "stdout": "...",
  "stderr": "...",
  "exitCode": 0,
  "timeMs": 18
}
```

The server MUST compile and execute inside a strong sandbox/container with:
- no network
- CPU limit
- memory limit
- process timeout
- read-only filesystem
- isolated temporary directory
- restricted syscalls/capabilities
- output-size limit
- cleanup after every run

A debugger requires additional infrastructure (for example GDB/LLDB or a WebAssembly debugger integration) and source/line mapping.

## Run

Extract the ZIP and open `index.html` in a modern browser.

Use the included example and press **Run**. It will display compiler-style output and diagnostics.

## Project

```text
CForge-Online/
├── index.html
└── README.md
```

## Next production upgrade

For a full cloud compiler service, keep this frontend and add:
`API gateway → job queue → sandbox worker → GCC/Clang → stdout/stderr → WebSocket/SSE → terminal`.

Never run untrusted C code directly in your web server process.
