(function(){
const KEY="ancientframe_saved_measurements_v1";const root=document.getElementById("savedMeasurements");if(!root)return;
let items=[];try{items=JSON.parse(localStorage.getItem(KEY)||"[]")}catch{}
function render(){if(!items.length){root.innerHTML='<div class="saved-card"><h3>No saved measurements yet.</h3><p>Run a calculator and choose “Save measurement” to keep a result on this device.</p><a class="button" href="calculators.html">Open calculators →</a></div>';return}
root.innerHTML=items.map((x,i)=>`<article class="saved-card"><span class="eyebrow">${x.type}</span><h3>${new Date(x.savedAt).toLocaleString()}</h3><p>${Object.entries(x.data).map(([k,v])=>`${k}: ${v}`).join(" · ")}</p><button class="button button-secondary" data-delete="${i}">Delete</button></article>`).join("");
root.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{items.splice(+b.dataset.delete,1);localStorage.setItem(KEY,JSON.stringify(items));render()})}render();
})();