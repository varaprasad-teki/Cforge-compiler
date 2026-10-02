const code=document.getElementById("code"),gutter=document.getElementById("gutter"),terminal=document.getElementById("terminal"),status=document.getElementById("status"),buildStat=document.getElementById("buildStat"),exitStat=document.getElementById("exitStat"),buildTime=document.getElementById("buildTime"),toast=document.getElementById("toast");
function lineNumbers(){gutter.innerHTML=Array.from({length:code.value.split("\n").length},(_,i)=>i+1).join("<br>")}
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function diagnostics(s){let d=[];if(!/\bint\s+main\s*\(/.test(s))d.push(["error","main.c: main() function not found"]);if(/printf\s*\(/.test(s)&&!/#include\s*<stdio\.h>/.test(s))d.push(["warn","main.c: printf() requires <stdio.h>"]);if((s.match(/{/g)||[]).length!==(s.match(/}/g)||[]).length)d.push(["error","main.c: unmatched braces"]);return d}
function execute(){
 const t0=performance.now();status.textContent="COMPILING…";terminal.innerHTML='<span style="color:#f6c85f">⟳ Initializing C17 / GCC build pipeline…</span>';
 setTimeout(()=>{
  const src=code.value,d=diagnostics(src);let out=[],m,rx=/printf\s*\(\s*"((?:\\.|[^"\\])*)"(?:\s*,\s*([^)]*))?\s*\)\s*;/g;
  while((m=rx.exec(src))){let text=m[1].replace(/\\n/g,"\n").replace(/\\t/g,"\t").replace(/\"/g,'"').replace(/\\\\/g,"\\");if(m[2]){let vars={},v,decl=/\b(?:int|long|float|double|char)\s+(\w+)\s*=\s*([^;]+);/g;while((v=decl.exec(src)))vars[v[1]]=v[2].trim();m[2].split(",").map(x=>x.trim()).forEach(a=>{let k=a.replace(/^&/,"");if(vars[k]!==undefined)text=text.replace(/%[dfcilsu]/,vars[k])})}out.push(text)}
  let ms=Math.max(1,Math.round(performance.now()-t0)),bad=d.some(x=>x[0]=="error");status.textContent=bad?"BUILD FAILED":"BUILD SUCCESS";buildStat.textContent=ms+"ms";exitStat.textContent=bad?"1":"0";buildTime.textContent=ms+" ms";
  let html=bad?'<span style="color:#ff607d">✕ BUILD FAILED</span>':'<span style="color:#36e3a2">✓ BUILD SUCCESSFUL</span>';
  if(d.length)html+="\n\n"+d.map(x=>'<span style="color:'+(x[0]=="error"?"#ff607d":"#f6c85f")+'">'+(x[0]=="error"?"✕ ":"⚠ ")+esc(x[1])+"</span>").join("\n");
  if(!bad)html+="\n\n<span style="color:#70bfff">$ ./main</span>\n"+'<span style="color:#d7e6fa">'+esc(out.length?out.join("\n"):"(No printf output captured.)")+"</span>\n\n<span style="color:#36e3a2">Process exited with code 0.</span>";
  terminal.innerHTML=html;
 },320)}
document.getElementById("runBtn").onclick=execute;
document.querySelector(".cmd:nth-child(6)")?.addEventListener("click",execute);
code.addEventListener("input",lineNumbers);code.addEventListener("scroll",()=>gutter.scrollTop=code.scrollTop);lineNumbers();
code.addEventListener("keydown",e=>{if(e.ctrlKey&&e.key==="Enter"){e.preventDefault();execute()}if(e.key==="Tab"){e.preventDefault();code.setRangeText("    ",code.selectionStart,code.selectionEnd,"end");lineNumbers()}});
document.getElementById("clearBtn").onclick=()=>terminal.innerHTML='<span style="color:#71829d">Terminal cleared.</span>';
document.getElementById("newBtn").onclick=()=>{if(confirm("Create a new C program?")){code.value='#include <stdio.h>\n\nint main(void) {\n    printf("Hello, CForge!\\n");\n    return 0;\n}\n';lineNumbers();showToast("New C file created")}};
document.getElementById("saveBtn").onclick=()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([code.value],{type:"text/plain"}));a.download="main.c";a.click();showToast("main.c saved")};
document.getElementById("openBtn").onclick=()=>{let i=document.createElement("input");i.type="file";i.accept=".c,.h,.txt";i.onchange=()=>{let f=i.files[0];if(f){let r=new FileReader();r.onload=()=>{code.value=r.result;lineNumbers();showToast("File opened")};r.readAsText(f)}};i.click()};
function showToast(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1400)}
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();showToast("Command palette ready")}})
