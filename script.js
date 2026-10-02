const code = document.getElementById('code');
const gutter = document.getElementById('gutter');
const terminal = document.getElementById('terminal');
const status = document.getElementById('status');
const buildStat = document.getElementById('buildStat');
const exitStat = document.getElementById('exitStat');
const buildTime = document.getElementById('buildTime');
const toast = document.getElementById('toast');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const newBtn = document.getElementById('newBtn');
const saveBtn = document.getElementById('saveBtn');
const openBtn = document.getElementById('openBtn');

function lineNumbers() {
  const count = Math.max(1, code.value.split('\n').length);
  gutter.innerHTML = Array.from({ length: count }, (_, i) => i + 1).join('<br>');
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function diagnostics(source) {
  const result = [];
  if (!/\bint\s+main\s*\(/.test(source)) {
    result.push(['error', 'main.c: main() function not found']);
  }
  if (/printf\s*\(/.test(source) && !/#include\s*<stdio\.h>/.test(source)) {
    result.push(['warn', 'main.c: printf() requires <stdio.h>']);
  }
  if ((source.match(/{/g) || []).length !== (source.match(/}/g) || []).length) {
    result.push(['error', 'main.c: unmatched braces']);
  }
  return result;
}

function decodeCString(value) {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function collectVariables(source) {
  const vars = {};
  const decl = /\b(?:int|long|float|double|char)\s+(\w+)\s*=\s*([^;]+);/g;
  let match;
  while ((match = decl.exec(source))) vars[match[1]] = match[2].trim();
  return vars;
}

function renderProgramOutput(source) {
  const vars = collectVariables(source);
  const output = [];
  const printfRegex = /printf\s*\(\s*"((?:\\.|[^"\\])*)"(?:\s*,\s*([^)]*))?\)\s*;/g;
  let match;

  while ((match = printfRegex.exec(source))) {
    let text = decodeCString(match[1]);
    if (match[2]) {
      const args = match[2].split(',').map(x => x.trim());
      args.forEach(arg => {
        const key = arg.replace(/^&/, '');
        const value = Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : arg;
        text = text.replace(/%[-+0-9.]*[dfcilsu]/, String(value));
      });
    }
    text = text.replace(/%[-+0-9.]*[dfcilsu]/g, '');
    output.push(text);
  }
  return output.join('\n');
}

function execute() {
  const started = performance.now();
  status.textContent = 'COMPILING…';
  terminal.innerHTML = '<span class="terminal-info">⟳ Initializing C17 / GCC build pipeline…</span>';

  window.setTimeout(() => {
    const source = code.value;
    const issues = diagnostics(source);
    const failed = issues.some(item => item[0] === 'error');
    const elapsed = Math.max(1, Math.round(performance.now() - started));

    status.textContent = failed ? 'BUILD FAILED' : 'BUILD SUCCESS';
    buildStat.textContent = elapsed + 'ms';
    buildTime.textContent = elapsed + ' ms';
    exitStat.textContent = failed ? '1' : '0';

    let html = failed
      ? '<span class="terminal-error">✕ BUILD FAILED</span>'
      : '<span class="terminal-success">✓ BUILD SUCCESSFUL</span>';

    if (issues.length) {
      html += '<div class="terminal-gap"></div>' + issues.map(issue => {
        const cls = issue[0] === 'error' ? 'terminal-error' : 'terminal-warn';
        const icon = issue[0] === 'error' ? '✕' : '⚠';
        return `<span class="${cls}">${icon} ${esc(issue[1])}</span>`;
      }).join('<br>');
    }

    if (!failed) {
      const output = renderProgramOutput(source) || '(No printf output captured.)';
      html += `<div class="terminal-gap"></div><span class="terminal-command">$ ./main</span><br><span class="terminal-output">${esc(output)}</span>`;
      html += '<div class="terminal-gap"></div><span class="terminal-success">Process exited with code 0.</span>';
    }

    terminal.innerHTML = html;
  }, 280);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1400);
}

runBtn?.addEventListener('click', execute);
clearBtn?.addEventListener('click', () => {
  terminal.innerHTML = '<span class="terminal-muted">Terminal cleared.</span>';
  status.textContent = 'READY';
  exitStat.textContent = '—';
});

newBtn?.addEventListener('click', () => {
  if (window.confirm('Create a new C program?')) {
    code.value = '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, CForge!\\n");\n    return 0;\n}\n';
    lineNumbers();
    showToast('New C file created');
  }
});

saveBtn?.addEventListener('click', () => {
  const blob = new Blob([code.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'main.c';
  link.click();
  URL.revokeObjectURL(url);
  showToast('main.c saved');
});

openBtn?.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.c,.h,.txt';
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      code.value = String(reader.result || '');
      lineNumbers();
      showToast('File opened');
    };
    reader.readAsText(file);
  };
  input.click();
});

code.addEventListener('input', lineNumbers);
code.addEventListener('scroll', () => { gutter.scrollTop = code.scrollTop; });
code.addEventListener('keydown', event => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    execute();
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    code.setRangeText('    ', code.selectionStart, code.selectionEnd, 'end');
    lineNumbers();
  }
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    showToast('Command palette ready');
  }
});

lineNumbers();
