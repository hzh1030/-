"use strict";
const $ = (selector) => document.querySelector(selector);
const dialog = $("#project-dialog");
const panels = {palette: $("#palette-demo"), note: $("#note-demo"), type: $("#type-demo")};
const projects = {
  palette: {title:"色彩拾光", category:"01 / COLOR STUDY", description:"从日常情绪里拾起几种颜色。试着切换配色，找到今天喜欢的那一组。", format:"交互配色小实验", focus:"色彩搭配与视觉感受"},
  note: {title:"灵感便签", category:"02 / LITTLE NOTES", description:"不必想得完整，先把它记下来。让那些一闪而过的小想法，慢慢长成作品。", format:"浏览器中的小便签", focus:"轻量记录与即时表达"},
  type: {title:"字间实验", category:"03 / TYPE EXPLORATION", description:"文字也有自己的语气。换一种字体，调一点字重，看看同一句话会变成什么样。", format:"文字排版交互实验", focus:"字体、字重与表达"}
};
let toastTimer;
function showToast(message){
  const toast = $("#toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}
function openProject(key){
  const project = projects[key];
  if(!project) return;
  $("#dialog-title").textContent = project.title;
  $("#dialog-category").textContent = project.category;
  $("#dialog-description").textContent = project.description;
  $("#project-format").textContent = project.format;
  $("#project-focus").textContent = project.focus;
  for(const [name,panel] of Object.entries(panels)) panel.hidden = name !== key;
  if(key === "note") loadNote();
  if(!dialog.open) dialog.showModal();
  document.body.classList.add("dialog-open");
  dialog.scrollTop = 0;
}
document.querySelectorAll("[data-project]").forEach(button => button.addEventListener("click", () => openProject(button.dataset.project)));
$("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
dialog.addEventListener("click", event => {
  if(event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
const palettes = [
  {name:"橙色日常",colors:["#ED693F","#FFA366","#F5C897","#F6DFC4","#393D43"]},
  {name:"海边散步",colors:["#173F4F","#317B8C","#79B4B8","#D0E5DF","#F0CF9C"]},
  {name:"午夜来信",colors:["#25233A","#595172","#8B7DA9","#BCB3D3","#EEE9F5"]},
  {name:"夏日汽水",colors:["#204B38","#5D8C58","#A9BD73","#E8D982","#F4EEE0"]},
  {name:"城市漫游",colors:["#252830","#586573","#ADB8C4","#E4E9ED","#D34F43"]}
];
let paletteIndex = 0;
async function copyColor(color){
  try {
    if(!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
    await navigator.clipboard.writeText(color);
    showToast("已复制颜色 " + color);
  } catch {
    showToast("颜色值：" + color + "，可长按或选中复制");
  }
}
function renderPalette(){
  const palette = palettes[paletteIndex];
  $("#palette-name").textContent = palette.name;
  $("#palette-live").replaceChildren(...palette.colors.map(color => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-swatch";
    button.style.backgroundColor = color;
    const channels = color.slice(1).match(/.{2}/g).map(hex => parseInt(hex,16));
    const linear = channels.map(channel => {const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;});
    const luminance = .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
    button.style.color = luminance > .179 ? "#101218" : "#FFFFFF";
    button.textContent = color;
    button.setAttribute("aria-label","复制颜色 " + color);
    button.addEventListener("click", () => copyColor(color));
    return button;
  }));
}
$("#next-palette").addEventListener("click", () => {paletteIndex = (paletteIndex + 1) % palettes.length;renderPalette();});
renderPalette();
const noteKey = "zh-personal-site-note-v1";
const noteText = $("#note-text");
function updateCount(){ $("#note-count").textContent = noteText.value.length + " / 2000"; }
function loadNote(){
  try {const saved = localStorage.getItem(noteKey);if(saved !== null) noteText.value = saved;} catch { /* The draft remains usable when storage is restricted. */ }
  updateCount();
}
function saveNote(){
  try {localStorage.setItem(noteKey,noteText.value);showToast("便签已保存在这个浏览器里");return true;}
  catch {showToast("当前浏览器无法保存，请先复制你的文字");return false;}
}
noteText.addEventListener("input",updateCount);
$("#save-note").addEventListener("click",saveNote);
function updateType(){
  const preview = $("#type-live");
  preview.textContent = $("#type-text").value || "写下你的文字。";
  preview.style.fontFamily = $("#type-font").value === "serif" ? "var(--serif)" : "var(--sans)";
  preview.style.fontWeight = $("#type-weight").value;
  $("#weight-value").value = $("#type-weight").value;
}
["#type-text","#type-font","#type-weight"].forEach(selector => $(selector).addEventListener("input",updateType));
const navLinks = [...document.querySelectorAll("nav a")];
if("IntersectionObserver" in window){
  const observer = new IntersectionObserver(entries => {
    const active = entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!active) return;
    navLinks.forEach(link => {if(link.getAttribute("href") === "#"+active.target.id)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");});
  },{rootMargin:"-10% 0px -50% 0px",threshold:[0,.1,.5]});
  ["#home","#work","#about","#contact"].forEach(selector => observer.observe($(selector)));
}
$("#year").textContent = new Date().getFullYear();

const mediaDialog = $("#media-dialog");
document.querySelectorAll("[data-image]").forEach(button => button.addEventListener("click", () => {
  $("#media-image-frame").classList.toggle("opening-frame", button.dataset.image.endsWith("werewolf-opening.png"));
  $("#media-image").src = button.dataset.image;
  $("#media-image").alt = button.dataset.caption;
  $("#media-title").textContent = button.dataset.caption;
  mediaDialog.showModal();
  document.body.classList.add("dialog-open");
}));
$("#close-media").addEventListener("click", () => mediaDialog.close());
mediaDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
mediaDialog.addEventListener("click", event => {
  if(event.target !== mediaDialog) return;
  const rect = mediaDialog.getBoundingClientRect();
  if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) mediaDialog.close();
});

const videos = [...document.querySelectorAll(".video-card video")];
videos.forEach(video => {
  video.addEventListener("play", () => videos.forEach(other => {if(other !== video) other.pause();}));
  video.addEventListener("error", () => {video.closest(".video-card").querySelector(".video-error").hidden = false;});
});

// Expose the same demo actions when the browser supports WebMCP.
if(document.modelContext?.registerTool){
  const lifecycle = new AbortController();
  const demoTools = [
    {
      name:"open_demo_project",title:"打开演示作品",description:"打开指定演示作品的详情和可交互界面。",
      inputSchema:{type:"object",properties:{project:{type:"string",enum:["palette","note","type"]}},required:["project"],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input){if(!input || !Object.hasOwn(projects,input.project))throw new Error("未知作品");openProject(input.project);return {project:input.project,title:projects[input.project].title};}
    },
    {
      name:"select_demo_palette",title:"选择演示配色",description:"打开配色演示并选中一组配色，返回名称和颜色值。",
      inputSchema:{type:"object",properties:{index:{type:"integer",minimum:0,maximum:palettes.length-1}},required:["index"],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input){if(!Number.isInteger(input?.index) || input.index<0 || input.index>=palettes.length)throw new Error("配色索引超出范围");paletteIndex=input.index;renderPalette();openProject("palette");return {name:palettes[paletteIndex].name,colors:[...palettes[paletteIndex].colors]};}
    },
    {
      name:"save_browser_note",title:"保存浏览器便签",description:"打开便签演示，将文字保存到当前浏览器中。不会上传文字。",
      inputSchema:{type:"object",properties:{text:{type:"string",maxLength:2000}},required:["text"],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:true},
      execute(input){if(typeof input?.text!=="string" || input.text.length>2000)throw new Error("便签必须是不超过2000字的文字");openProject("note");noteText.value=input.text;updateCount();if(!saveNote())throw new Error("浏览器存储不可用");return {saved:true,characters:input.text.length,storage:"this_browser"};}
    }
  ];
  for(const tool of demoTools){try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{ /* Standard browsers still retain all visible demo controls. */ }}
  window.addEventListener("pagehide",()=>lifecycle.abort(),{once:true});
}
