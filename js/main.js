(function(){
const AF=window.ANCIENTFRAME;
function depthPrefix(){return location.pathname.includes("/calculators/")||location.pathname.includes("/guides/")?"../":""}
function header(){
 const h=document.querySelector(".site-header"); if(!h)return;
 const p=depthPrefix();
 h.innerHTML=`<a class="brand" href="${p}index.html" aria-label="AncientFrame home"><span class="brand-mark">AF</span><span>AncientFrame</span></a>
 <nav class="desktop-nav" aria-label="Main navigation"><a href="${p}calculators.html">Calculators</a><a href="${p}guides.html">Guides</a><a href="${p}projects.html">Saved Measurements</a><a href="${p}about.html">About</a><a href="${p}contact.html">Feedback</a></nav>
 <a class="button button-small" href="${p}calculators.html">Start calculating</a><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button>`;
 const b=h.querySelector(".menu-toggle");b.addEventListener("click",()=>{document.body.classList.toggle("mobile-nav-open");b.setAttribute("aria-expanded",document.body.classList.contains("mobile-nav-open"))});
}
function footer(){
 const f=document.querySelector(".site-footer");if(!f)return;const p=depthPrefix();
 f.innerHTML=`<div class="footer-inner"><div class="footer-brand"><div class="brand"><span class="brand-mark">AF</span><span>AncientFrame</span></div><p>Measure it. Calculate it. Frame it. Build it.</p></div><div class="footer-col"><h4>Calculators</h4><a href="${p}calculators/rafter.html">Rafters</a><a href="${p}calculators/stairs.html">Stairs</a><a href="${p}calculators/roof-framing.html">Roof framing</a><a href="${p}calculators/arched-opening.html">Openings</a></div><div class="footer-col"><h4>Resources</h4><a href="${p}guides.html">Building guides</a><a href="${p}projects.html">Saved measurements</a><a href="${p}faq.html">FAQ</a></div><div class="footer-col"><h4>AncientFrame</h4><a href="${p}about.html">About</a><a href="${p}contact.html">Feedback</a><a href="${p}privacy.html">Privacy</a><a href="${p}disclaimer.html">Disclaimer</a></div></div><div class="footer-bottom">© 2026 AncientFrame · Verify measurements before cutting or construction.</div>`;
}
function cards(){
 const tc=document.getElementById("homeTools")||document.getElementById("calculatorGrid"); if(tc) tc.innerHTML=AF.calculators.map((c,i)=>`<a class="tool-card reveal" href="${c.url}"><span class="tool-number">${String(i+1).padStart(2,"0")}</span><h3>${c.title}</h3><p>${c.description}</p><span class="card-arrow">Open tool →</span></a>`).join("");
 const gg=document.getElementById("homeGuides")||document.getElementById("guideGrid"); if(gg) gg.innerHTML=AF.guides.map(g=>`<a class="guide-card reveal" href="blog-post.html?slug=${encodeURIComponent(g.slug)}"><span class="eyebrow">${g.category}</span><h3>${g.title}</h3><p>${g.excerpt}</p><span class="card-arrow">Read guide →</span></a>`).join("");
}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(x=>io.observe(x))}
function feedback(){
 const form=document.getElementById("feedbackForm");if(!form)return;
 form.addEventListener("submit",async e=>{e.preventDefault();const s=document.getElementById("feedbackStatus"),fd=new FormData(form);if(fd.get("website"))return;s.textContent="Sending…";
 const endpoint=(window.ANCIENTFRAME_CONFIG&&ANCIENTFRAME_CONFIG.feedbackEndpoint)||"";
 if(!endpoint){s.textContent="The form is validated and ready, but a server endpoint has not been configured yet. Set feedbackEndpoint in js/config.js before deployment.";s.style.color="#8a2f2f";return}
 try{const r=await fetch(endpoint,{method:"POST",body:fd,headers:{Accept:"application/json"}});if(!r.ok)throw Error();form.reset();s.textContent="Thanks — your feedback was sent.";s.style.color="var(--green)"}catch(err){s.textContent="We couldn't send that right now. Please try again.";s.style.color="#8a2f2f"}});
}
document.addEventListener("DOMContentLoaded",()=>{header();footer();cards();reveal();feedback()});
})();