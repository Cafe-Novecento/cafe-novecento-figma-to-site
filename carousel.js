(()=>{
const track=document.querySelector('#feature-track');if(!track)return;
const slides=[...track.children],prev=document.querySelector('#slide-prev'),next=document.querySelector('#slide-next'),count=document.querySelector('#slide-count');
let index=0;
function update(){index=slides.reduce((best,slide,i)=>Math.abs(slide.offsetLeft-track.offsetLeft-track.scrollLeft)<Math.abs(slides[best].offsetLeft-track.offsetLeft-track.scrollLeft)?i:best,0);prev.disabled=index===0;next.disabled=index===slides.length-1;count.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');}
function move(delta){const target=slides[Math.max(0,Math.min(slides.length-1,index+delta))];track.scrollTo({left:target.offsetLeft-track.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});addEventListener('resize',update);update();
})();
