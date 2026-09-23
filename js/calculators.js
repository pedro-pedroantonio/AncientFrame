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
function fractionToDecimal(value){
  if(value===undefined||value===null||String(value).trim()==="") return 0;
  const s=String(value).trim();
  const fractionMatch=s.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if(fractionMatch){
    const numerator=parseFloat(fractionMatch[1]);
    const denominator=parseFloat(fractionMatch[2]);
    if(denominator>0) return numerator/denominator;
  }
  const simple=parseFloat(s);
  if(Number.isFinite(simple)) return simple;
  return 0;
}
function dimensionFromFields(feetField,inchesField,fractionField){
  const feet=Number(feetField&&feetField.value?feetField.value:0)||0;
  const inches=Number(inchesField&&inchesField.value?inchesField.value:0)||0;
  const fraction=fractionToDecimal(fractionField&&fractionField.value?fractionField.value:0);
  return feet*12 + inches + fraction;
}
function isDimensionFilled(fieldSet){
  return fieldSet.some(el=>{
    if(!el) return false;
    return el.value!==undefined && el.value!==null && String(el.value).trim()!=="";
  });
}
function setRafterFields(mode){
 const f=document.getElementById("rafterForm"); if(!f)return;
 const groups={
  run:[f.runFeet,f.runInches,f.runFraction],
  rise:[f.riseFeet,f.riseInches,f.riseFraction],
  pitch:[f.pitch],
  length:[f.lengthFeet,f.lengthInches,f.lengthFraction]
 };
 Object.values(groups).forEach(fields=>fields.forEach(el=>{if(el){el.disabled=false;el.required=false}}));
 const disable=(names)=>names.forEach(n=>{const fields=groups[n]||[];fields.forEach(el=>{if(el){el.disabled=true}})});
 if(mode==="runrise"){disable(["pitch","length"]);groups.run.forEach(el=>{if(el)el.required=true});groups.rise.forEach(el=>{if(el)el.required=true})}
 if(mode==="pitchrun"){disable(["rise","length"]);groups.pitch.forEach(el=>{if(el)el.required=true});groups.run.forEach(el=>{if(el)el.required=true})}
 if(mode==="pitchrise"){disable(["run","length"]);groups.pitch.forEach(el=>{if(el)el.required=true});groups.rise.forEach(el=>{if(el)el.required=true})}
 if(mode==="pitchlength"){disable(["run","rise"]);groups.pitch.forEach(el=>{if(el)el.required=true});groups.length.forEach(el=>{if(el)el.required=true})}
}
function rafterDiagram(run,rise){
 const w=620,h=320;
 const leftX=55, rightX=565, baseY=245, ridgeY=65;
 const labels=localStorage.getItem("ancientframe_lang")==="es"?{run:"corrida",rise:"elevación",ridge:"CUMBRERA"}:{run:"run",rise:"rise",ridge:"RIDGE"};
 const rafterLength=Math.hypot(run,rise);
 const rafterMidX=(leftX+rightX)/2;
 const rafterMidY=(ridgeY+baseY)/2;
 return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Rafter measurements showing run, rise and ridge">
 <line x1="${leftX}" y1="${ridgeY+20}" x2="${leftX}" y2="${baseY}" class="diagram-dim"/>
 <line x1="${leftX}" y1="${baseY}" x2="${rightX}" y2="${baseY}" class="diagram-dim"/>
 <line x1="${leftX}" y1="${ridgeY}" x2="${rightX}" y2="${baseY}" class="diagram-line diagram-draw"/>
 <line x1="${leftX-18}" y1="${ridgeY}" x2="${leftX+18}" y2="${ridgeY}" class="diagram-tick"/>
 <line x1="${rightX}" y1="${baseY-18}" x2="${rightX}" y2="${baseY+18}" class="diagram-tick"/>
 <circle cx="${leftX}" cy="${ridgeY}" r="10" class="diagram-accent"/>
 <text x="${leftX-2}" y="${ridgeY-25}" text-anchor="middle" class="diagram-label">${labels.ridge}</text>
 <text x="${leftX+48}" y="${(ridgeY+baseY)/2+8}" class="diagram-label">${fmtInches(round16(rise))} ${labels.rise}</text>
 <text x="${(leftX+rightX)/2}" y="${baseY+42}" text-anchor="middle" class="diagram-label">${fmtInches(round16(run))} ${labels.run}</text>
 <text x="${rafterMidX+18}" y="${rafterMidY-12}" class="diagram-label">${fmtInches(round16(rafterLength))} ${localStorage.getItem("ancientframe_lang")==="es"?"largo de viga":"rafter length"}</text>
 </svg>`;
}
function setupRafter(){
 const f=document.getElementById("rafterForm");if(!f)return;
 const card=document.getElementById("rafterCard");
 document.addEventListener("ancientframe-language-change",()=>{const diagram=document.getElementById("rafterDiagram");if(diagram&&!diagram.hidden){const run=dimensionFromFields(f.runFeet,f.runInches,f.runFraction);const rise=dimensionFromFields(f.riseFeet,f.riseInches,f.riseFraction);if(run>0&&rise>=0)diagram.innerHTML=rafterDiagram(run,rise)}});
 f.querySelectorAll('input[name="mode"]').forEach(r=>r.addEventListener("change",()=>setRafterFields(r.value)));
 setRafterFields("runrise");
 f.onsubmit=e=>{
   e.preventDefault(); card.classList.add("calculating");
   setTimeout(()=>card.classList.remove("calculating"),650);
   const mode=f.querySelector('input[name="mode"]:checked').value;
   const run=dimensionFromFields(f.runFeet,f.runInches,f.runFraction);
   const rise=dimensionFromFields(f.riseFeet,f.riseInches,f.riseFraction);
   const length=dimensionFromFields(f.lengthFeet,f.lengthInches,f.lengthFraction);
   let runValue=run,riseValue=rise,lengthValue=length,ratio=parsePitch(f.pitch.value);
   const err=document.getElementById("rafterError"),res=document.getElementById("rafterResults"),diagram=document.getElementById("rafterDiagram");
   if(mode==="runrise"){if(!(runValue>0&&riseValue>=0)){err.textContent="Enter a valid positive run and rise.";return}lengthValue=Math.hypot(runValue,riseValue);ratio=riseValue/runValue}
   if(mode==="pitchrun"){if(!(ratio>0&&runValue>0)){err.textContent="Enter a valid pitch and run. Example pitch: 8/12.";return}riseValue=runValue*ratio;lengthValue=Math.hypot(runValue,riseValue)}
   if(mode==="pitchrise"){if(!(ratio>0&&riseValue>0)){err.textContent="Enter a valid pitch and rise. Example pitch: 8/12.";return}runValue=riseValue/ratio;lengthValue=Math.hypot(runValue,riseValue)}
   if(mode==="pitchlength"){if(!(ratio>0&&lengthValue>0)){err.textContent="Enter a valid pitch and rafter length.";return}runValue=lengthValue/Math.sqrt(1+ratio*ratio);riseValue=runValue*ratio}
   err.textContent="";
   const angle=Math.atan2(riseValue,runValue)*180/Math.PI,pitch12=ratio*12;
   res.hidden=false;
   res.innerHTML=resultHTML([
    ["Run",fmtInches(round16(runValue))],["Rise",fmtInches(round16(riseValue))],["Rafter length",fmtInches(round16(lengthValue))],
    ["Pitch",pitch12.toFixed(4)+" / 12"],["Roof angle",angle.toFixed(4)+"°"]
   ]);
   diagram.hidden=false;diagram.innerHTML=rafterDiagram(runValue,riseValue);
   wireSave("saveRafter","Rafter",{run:fmtInches(runValue),rise:fmtInches(riseValue),length:fmtInches(round16(lengthValue)),angle:angle.toFixed(4)+"°",pitch:pitch12.toFixed(4)+"/12"});
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