(function(){
const KEY="ancientframe_saved_measurements_v1";
function parseMeasure(v){if(v===undefined||v===null)return NaN;v=String(v).trim().replace(/,/g,"");if(!v)return NaN;
 let feet=0,inches=0;
 const fm=v.match(/(-?\d+(?:\.\d+)?)\s*(?:ft|feet|')/i);if(fm){feet=parseFloat(fm[1]);v=v.replace(fm[0]," ")}
 const im=v.match(/(-?\d+(?:\.\d+)?)\s*(?:in|inch|inches|")/i);if(im){inches=parseFloat(im[1]);v=v.replace(im[0]," ")}
 const f=v.match(/(\d+)\s*-\s*(\d+)?(?:\s+(\d+)\/(\d+))?/);if(f){if(!fm)feet=parseFloat(f[1]);if(f[2])inches+=parseFloat(f[2]);if(f[3])inches+=parseFloat(f[3])/parseFloat(f[4]);return feet*12+inches}
 const frac=v.match(/(-?\d+)?\s*(\d+)\s*\/\s*(\d+)/);if(frac){if(frac[1])inches+=parseFloat(frac[1]);inches+=parseFloat(frac[2])/parseFloat(frac[3]);return feet*12+inches}
 const nums=v.match(/-?\d+(?:\.\d+)?/g);if(nums){if(fm||im)return feet*12+inches+(fm?0:parseFloat(nums[0]));return parseFloat(nums[0])}
 return NaN}
function frac(n,den=16){const sign=n<0?"-":"";n=Math.abs(n);let whole=Math.floor(n+1e-10),r=n-whole,num=Math.round(r*den);if(num===den){whole++;num=0}if(num===0)return sign+whole;let g=(a,b)=>b?g(b,a%b):a;let d=g(num,den);return sign+(whole?whole+" ":"")+num/d+"/"+den/d}
function fmtInches(total,den=16){if(!Number.isFinite(total))return "—";const sign=total<0?"-":"";total=Math.abs(total);let ft=Math.floor(total/12+1e-10),rem=total-ft*12;let s=frac(rem,den);if(ft)return sign+ft+"' "+s+'"';return sign+s+'"'}
function round16(x){return Math.round(x*16)/16}
function resultHTML(items){return `<div class="result-grid">${items.map(([a,b])=>`<div class="result"><span>${a}</span><strong>${b}</strong></div>`).join("")}</div>`}
function save(type,data){let a=[];try{a=JSON.parse(localStorage.getItem(KEY)||"[]")}catch{};a.unshift({id:Date.now(),type,data,savedAt:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(a.slice(0,100)))}
function wireSave(id,type,data){const b=document.getElementById(id);if(!b)return;b.hidden=false;b.onclick=()=>{save(type,data);b.textContent="Saved on this device ✓";b.disabled=true}}
function parsePitch(v){
 if(v===undefined||v===null)return NaN;
 const s=String(v).trim().replace(/\s+/g,"");
 if(!s)return NaN;
 if(s.includes("/")){
   const p=s.split("/");
   if(p.length===2)return parseFloat(p[0])/parseFloat(p[1]);
 }
 const m=s.match(/^(\d+(?:\.\d+)?)[:](\d+(?:\.\d+)?)$/);
 if(m)return parseFloat(m[1])/parseFloat(m[2]);
 const n=parseFloat(s);
 return Number.isFinite(n)?n/12:NaN;
}
function setRafterFields(mode){
 const f=document.getElementById("rafterForm"); if(!f)return;
 ["run","rise","pitch","length"].forEach(n=>{const el=f.querySelector(`[name="${n}"]`); if(el){el.disabled=false;el.required=false}});
 const disable=(names)=>names.forEach(n=>{const el=f.querySelector(`[name="${n}"]`);if(el)el.disabled=true});
 if(mode==="runrise"){disable(["pitch","length"]);f.run.required=true;f.rise.required=true}
 if(mode==="pitchrun"){disable(["rise","length"]);f.pitch.required=true;f.run.required=true}
 if(mode==="pitchrise"){disable(["run","length"]);f.pitch.required=true;f.rise.required=true}
 if(mode==="pitchlength"){disable(["run","rise"]);f.pitch.required=true;f.length.required=true}
}
function rafterDiagram(run,rise){
 const w=620,h=320,p=55,maxX=Math.max(run,1),maxY=Math.max(rise,1);
 const x2=w-p,yBase=h-48,x1=p,yTop=Math.max(38,yBase-(rise/maxX)*((x2-x1)*.82)),ridgeX=(x1+x2)/2;
 const scale=(x2-x1)/maxX/2, leftX=ridgeX-run*scale, rightX=ridgeX+run*scale;
 const topY=yBase-rise*scale;
 return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Rafter triangle showing run, rise and rafter length">
 <line x1="${leftX}" y1="${yBase}" x2="${rightX}" y2="${yBase}" class="diagram-dim"/>
 <line x1="${leftX}" y1="${yBase+10}" x2="${leftX}" y2="${yBase-10}" class="diagram-tick"/>
 <line x1="${rightX}" y1="${yBase+10}" x2="${rightX}" y2="${yBase-10}" class="diagram-tick"/>
 <text x="${(leftX+rightX)/2}" y="${yBase+28}" text-anchor="middle" class="diagram-label">${fmtInches(round16(run))} run</text>
 <line x1="${ridgeX}" y1="${topY}" x2="${ridgeX}" y2="${yBase}" class="diagram-dim"/>
 <line x1="${ridgeX-10}" y1="${topY}" x2="${ridgeX+10}" y2="${topY}" class="diagram-tick"/>
 <line x1="${ridgeX-10}" y1="${yBase}" x2="${ridgeX+10}" y2="${yBase}" class="diagram-tick"/>
 <text x="${ridgeX+16}" y="${(topY+yBase)/2}" class="diagram-label">${fmtInches(round16(rise))} rise</text>
 <line x1="${leftX}" y1="${yBase}" x2="${ridgeX}" y2="${topY}" class="diagram-line diagram-draw"/>
 <line x1="${ridgeX}" y1="${topY}" x2="${rightX}" y2="${yBase}" class="diagram-line diagram-draw"/>
 <circle cx="${ridgeX}" cy="${topY}" r="5" class="diagram-accent"/>
 <text x="${ridgeX}" y="${Math.max(20,topY-13)}" text-anchor="middle" class="diagram-label">RIDGE</text>
 </svg>`;
}
function setupRafter(){
 const f=document.getElementById("rafterForm");if(!f)return;
 const card=document.getElementById("rafterCard");
 f.querySelectorAll('input[name="mode"]').forEach(r=>r.addEventListener("change",()=>setRafterFields(r.value)));
 setRafterFields("runrise");
 f.onsubmit=e=>{
   e.preventDefault(); card.classList.add("calculating");
   setTimeout(()=>card.classList.remove("calculating"),650);
   const mode=f.querySelector('input[name="mode"]:checked').value;
   let run=parseMeasure(f.run.value),rise=parseMeasure(f.rise.value),length=parseMeasure(f.length.value),ratio=parsePitch(f.pitch.value);
   const err=document.getElementById("rafterError"),res=document.getElementById("rafterResults"),diagram=document.getElementById("rafterDiagram");
   if(mode==="runrise"){if(!(run>0&&rise>=0)){err.textContent="Enter a valid positive run and rise.";return}length=Math.hypot(run,rise);ratio=rise/run}
   if(mode==="pitchrun"){if(!(ratio>0&&run>0)){err.textContent="Enter a valid pitch and run. Example pitch: 8/12.";return}rise=run*ratio;length=Math.hypot(run,rise)}
   if(mode==="pitchrise"){if(!(ratio>0&&rise>0)){err.textContent="Enter a valid pitch and rise. Example pitch: 8/12.";return}run=rise/ratio;length=Math.hypot(run,rise)}
   if(mode==="pitchlength"){if(!(ratio>0&&length>0)){err.textContent="Enter a valid pitch and rafter length.";return}run=length/Math.sqrt(1+ratio*ratio);rise=run*ratio}
   err.textContent="";
   const angle=Math.atan2(rise,run)*180/Math.PI,pitch12=ratio*12;
   res.hidden=false;
   res.innerHTML=resultHTML([
    ["Run",fmtInches(round16(run))],["Rise",fmtInches(round16(rise))],["Rafter length",fmtInches(round16(length))],
    ["Pitch",pitch12.toFixed(4)+" / 12"],["Roof angle",angle.toFixed(4)+"°"]
   ]);
   diagram.hidden=false;diagram.innerHTML=rafterDiagram(run,rise);
   wireSave("saveRafter","Rafter",{run:fmtInches(run),rise:fmtInches(rise),length:fmtInches(round16(length)),angle:angle.toFixed(4)+"°",pitch:pitch12.toFixed(4)+"/12"});
 };
}
function setupStairs(){const f=document.getElementById("stairsForm");if(!f)return;f.onsubmit=e=>{e.preventDefault();const rise=parseMeasure(f.rise.value),n=parseInt(f.risers.value,10),t=parseMeasure(f.tread.value),err=document.getElementById("stairsError"),res=document.getElementById("stairsResults");if(!(rise>0&&n>1&&t>0)){err.textContent="Enter a valid total rise, riser count and tread depth.";return}err.textContent="";const rh=rise/n,totalRun=t*(n-1),stringer=Math.hypot(rise,totalRun),ang=Math.atan2(rise,totalRun)*180/Math.PI;res.hidden=false;res.innerHTML=resultHTML([["Riser height",fmtInches(round16(rh))],["Tread depth",fmtInches(round16(t))],["Total run",fmtInches(round16(totalRun))],["Stringer length",fmtInches(round16(stringer))],["Stringer angle",ang.toFixed(4)+"°"],["Risers",n]]);wireSave("saveStairs","Stairs",{totalRise:fmtInches(rise),risers:n,riserHeight:fmtInches(round16(rh)),tread:fmtInches(t),totalRun:fmtInches(round16(totalRun)),stringer:fmtInches(round16(stringer))})}}
function setupRoof(){const f=document.getElementById("roofForm");if(!f)return;f.onsubmit=e=>{e.preventDefault();const span=parseMeasure(f.span.value),rise=parseMeasure(f.rise.value),err=document.getElementById("roofError"),res=document.getElementById("roofResults");if(!(span>0&&rise>=0)){err.textContent="Enter valid measurements.";return}const run=span/2,len=Math.hypot(run,rise),pitch=rise/run*12,angle=Math.atan2(rise,run)*180/Math.PI;res.hidden=false;res.innerHTML=resultHTML([["Half-span run",fmtInches(round16(run))],["Common rafter",fmtInches(round16(len))],["Pitch",pitch.toFixed(4)+" / 12"],["Roof angle",angle.toFixed(4)+"°"]])}}
function setupArch(){const f=document.getElementById("archForm");if(!f)return;f.onsubmit=e=>{e.preventDefault();const w=parseMeasure(f.width.value),h=parseMeasure(f.rise.value),err=document.getElementById("archError"),res=document.getElementById("archResults");if(!(w>0&&h>0&&w/2>0)){err.textContent="Enter valid width and rise.";return}const a=w/2,r=(a*a+h*h)/(2*h),theta=2*Math.asin(a/r),arc=r*theta;res.hidden=false;res.innerHTML=resultHTML([["Radius",fmtInches(round16(r))],["Arc length",fmtInches(round16(arc))],["Half chord",fmtInches(round16(a))],["Central angle", (theta*180/Math.PI).toFixed(4)+"°"]])}}
function setupOval(){const f=document.getElementById("ovalForm");if(!f)return;f.onsubmit=e=>{e.preventDefault();const w=parseMeasure(f.width.value),h=parseMeasure(f.height.value),err=document.getElementById("ovalError"),res=document.getElementById("ovalResults");if(!(w>0&&h>0)){err.textContent="Enter valid dimensions.";return}const a=w/2,b=h/2,area=Math.PI*a*b;const p=Math.PI*(3*(a+b)-Math.sqrt((3*a+b)*(a+3*b)));res.hidden=false;res.innerHTML=resultHTML([["Semi-major axis",fmtInches(round16(Math.max(a,b)))],["Semi-minor axis",fmtInches(round16(Math.min(a,b)))],["Area",area.toFixed(4)+" in²"],["Perimeter (approx.)",p.toFixed(4)+" in"]])}}
function setupAngle(){const f=document.getElementById("angleForm");if(!f)return;f.onsubmit=e=>{e.preventDefault();const a=parseMeasure(f.a.value),b=parseMeasure(f.b.value),err=document.getElementById("angleError"),res=document.getElementById("angleResults");if(!(a>0&&b>0)){err.textContent="Enter valid positive side lengths.";return}const c=Math.hypot(a,b),A=Math.atan2(a,b)*180/Math.PI,B=Math.atan2(b,a)*180/Math.PI;res.hidden=false;res.innerHTML=resultHTML([["Hypotenuse",fmtInches(round16(c))],["Angle A",A.toFixed(4)+"°"],["Angle B",B.toFixed(4)+"°"],["Side A",fmtInches(round16(a))],["Side B",fmtInches(round16(b))]])}}
document.addEventListener("DOMContentLoaded",()=>{setupRafter();setupStairs();setupRoof();setupArch();setupOval();setupAngle()});
window.AncientFrameMath={parseMeasure,fmtInches,round16};
})();