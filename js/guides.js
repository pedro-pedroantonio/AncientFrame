(function(){
const A=window.ANCIENTFRAME;if(!A)return;
const slug=new URLSearchParams(location.search).get("slug"),article=document.getElementById("article");
if(article&&slug){const g=A.guides.find(x=>x.slug===slug);if(!g){article.innerHTML="<h1>Guide not found.</h1><a class='button' href='guides.html'>Back to guides</a>"}else{document.title=g.title+" — AncientFrame";document.querySelector('meta[name="description"]')?.setAttribute("content",g.excerpt);article.innerHTML=`<p class="eyebrow">${g.category}</p><h1>${g.title}</h1><p class="article-meta">${new Date(g.date+"T12:00:00").toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})}</p><div class="article-body">${g.body}</div><a class="button" href="calculators.html">Use an AncientFrame calculator →</a>`}}
})();