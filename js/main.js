(function(){
const AF=window.ANCIENTFRAME || {calculators:[],guides:[]};
if(!Array.isArray(AF.calculators)) AF.calculators=[];
if(!Array.isArray(AF.guides)) AF.guides=[];
const translations={
  en:{brand:"AncientFrame",calculators:"Calculators",guides:"Guides",saved:"Saved Measurements",about:"About",feedback:"Feedback",start:"Start calculating",lang:"ES",eyebrow:"Built for the work",heroTitle:"The math shouldn't slow down the build.",heroText:"AncientFrame turns real-world measurements into clear framing dimensions for the people who build.",explore:"Explore the tools",microNote:"Feet · inches · 1/8\" · 1/16\" · no account required",regularRafters:"Regular Rafters",rafterLink:"Calculate rafter layout →",openTool:"Open tool →",readGuide:"Read guide →",resources:"Resources",buildingGuides:"Building guides",privacy:"Privacy",disclaimer:"Disclaimer",measureIt:"Measure it. Calculate it. Frame it. Build it.",verify:"Verify measurements before cutting or construction."},
  es:{brand:"AncientFrame",calculators:"Calculadoras",guides:"Guías",saved:"Medidas guardadas",about:"Acerca de",feedback:"Comentarios",start:"Empezar",lang:"EN",eyebrow:"Hecho para el trabajo",heroTitle:"Las matemáticas no deberían frenar la construcción.",heroText:"AncientFrame convierte medidas reales en dimensiones prácticas para las personas que construyen.",explore:"Explorar herramientas",microNote:"Pies · pulgadas · 1/8\" · 1/16\" · sin cuenta",regularRafters:"Vigas comunes",rafterLink:"Calcular disposición de vigas →",openTool:"Abrir herramienta →",readGuide:"Leer guía →",resources:"Recursos",buildingGuides:"Guías de construcción",privacy:"Privacidad",disclaimer:"Aviso legal",measureIt:"Mide. Calcula. Ensambla. Construye.",verify:"Verifica las medidas antes de cortar o construir."}
};
function getLang(){return localStorage.getItem("ancientframe_lang") || "en";}
function setLang(lang){
  const normalized = lang === "es" ? "es" : "en";
  localStorage.setItem("ancientframe_lang", normalized);
  document.documentElement.lang = normalized;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const dict = translations[normalized];
    const value = dict && dict[key];
    if (value) el.textContent = value;
  });
}
function depthPrefix(){return location.pathname.includes("/calculators/")||location.pathname.includes("/guides/")?"../":""}
function header(){
 const h=document.querySelector(".site-header"); if(!h)return;
 const p=depthPrefix();
 const lang=getLang();
 const t=translations[lang];
 h.innerHTML=`<a class="brand" href="${p}index.html" aria-label="AncientFrame home"><span class="brand-mark">AF</span><span>${t.brand}</span></a>
 <nav class="desktop-nav" aria-label="Main navigation"><a href="${p}calculators.html">${t.calculators}</a><a href="${p}guides.html">${t.guides}</a><a href="${p}projects.html">${t.saved}</a><a href="${p}about.html">${t.about}</a><a href="${p}contact.html">${t.feedback}</a></nav>
 <div class="header-actions"><a class="button button-small" href="${p}calculators.html">${t.start}</a><button class="lang-switch" type="button" data-lang-toggle>${t.lang}</button></div><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button>`;
 const b=h.querySelector(".menu-toggle"); if (b) b.addEventListener("click",()=>{document.body.classList.toggle("mobile-nav-open");b.setAttribute("aria-expanded",document.body.classList.contains("mobile-nav-open"))});
 const btn=h.querySelector("[data-lang-toggle]"); if (btn) btn.addEventListener("click",()=>{const next=getLang()==="en"?"es":"en"; setLang(next); header(); footer(); cards(); document.dispatchEvent(new CustomEvent("ancientframe-language-change"));});
}
function footer(){
 const f=document.querySelector(".site-footer");if(!f)return;const p=depthPrefix();
 const t=translations[getLang()];
 f.innerHTML=`<div class="footer-inner"><div class="footer-brand"><div class="brand"><span class="brand-mark">AF</span><span>AncientFrame</span></div><p>${t.measureIt}</p></div><div class="footer-col"><h4>${t.calculators}</h4><a href="${p}calculators/rafter.html">${getLang()==="es"?"Vigas":"Rafters"}</a><a href="${p}calculators/stairs.html">${getLang()==="es"?"Escaleras":"Stairs"}</a><a href="${p}calculators/roof-framing.html">${getLang()==="es"?"Estructura de techo":"Roof framing"}</a><a href="${p}calculators/arched-opening.html">${getLang()==="es"?"Aberturas":"Openings"}</a></div><div class="footer-col"><h4>${t.resources}</h4><a href="${p}guides.html">${t.buildingGuides}</a><a href="${p}projects.html">${t.saved}</a><a href="${p}faq.html">FAQ</a></div><div class="footer-col"><h4>${t.brand}</h4><a href="${p}about.html">${t.about}</a><a href="${p}contact.html">${t.feedback}</a><a href="${p}privacy.html">${t.privacy}</a><a href="${p}disclaimer.html">${t.disclaimer}</a></div></div><div class="footer-bottom">© 2026 AncientFrame · ${t.verify}</div>`;
}
function cards(){
 const t=translations[getLang()];
 const tc=document.getElementById("homeTools")||document.getElementById("calculatorGrid"); if(tc) tc.innerHTML=AF.calculators.map((c,i)=>`<a class="tool-card reveal" href="${c.url}"><span class="tool-number">${String(i+1).padStart(2,"0")}</span><h3>${c.title}</h3><p>${c.description}</p><span class="card-arrow">${t.openTool}</span></a>`).join("");
 const gg=document.getElementById("homeGuides")||document.getElementById("guideGrid"); if(gg) gg.innerHTML=AF.guides.map(g=>`<a class="guide-card reveal" href="blog-post.html?slug=${encodeURIComponent(g.slug)}"><span class="eyebrow">${g.category}</span><h3>${g.title}</h3><p>${g.excerpt}</p><span class="card-arrow">${t.readGuide}</span></a>`).join("");
}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(x=>io.observe(x))}
function feedback(){
 const form=document.getElementById("feedbackForm");if(!form)return;
 form.addEventListener("submit",async e=>{e.preventDefault();const s=document.getElementById("feedbackStatus"),fd=new FormData(form);if(fd.get("website"))return;s.textContent="Sending…";
 const endpoint=(window.ANCIENTFRAME_CONFIG&&ANCIENTFRAME_CONFIG.feedbackEndpoint)||"";
 if(!endpoint){s.textContent="The form is validated and ready, but a server endpoint has not been configured yet. Set feedbackEndpoint in js/config.js before deployment.";s.style.color="#8a2f2f";return}
 try{const r=await fetch(endpoint,{method:"POST",body:fd,headers:{Accept:"application/json"}});if(!r.ok)throw Error();form.reset();s.textContent="Thanks — your feedback was sent.";s.style.color="var(--green)"}catch(err){s.textContent="We couldn't send that right now. Please try again.";s.style.color="#8a2f2f"}});
}
document.addEventListener("DOMContentLoaded",()=>{
  setLang(getLang());
  header();
  footer();
  cards();
  reveal();
  feedback();
});
})();