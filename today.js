(()=>{
  const clock=document.querySelector('#live-clock'), list=document.querySelector('#day-events');
  const zone='Europe/Rome';
  const dateFormat=new Intl.DateTimeFormat('it-IT',{timeZone:zone,day:'numeric',month:'long'});
  const clockFormat=new Intl.DateTimeFormat('it-IT',{timeZone:zone,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  let currentDay='', events=[], expanded=false, requestId=0;
  const status=document.querySelector('#day-status'), more=document.querySelector('#day-more');
  function render(){
    list.replaceChildren();
    for(const event of expanded?events:events.slice(0,3)){
      const row=document.createElement('li'), year=document.createElement('span'), body=document.createElement('div'), text=document.createElement('p'), link=document.createElement('a');
      year.className='day-year';year.textContent=event.year;
      text.textContent=event.text;link.textContent='Approfondisci su Wikipedia';link.href=event.url;
      body.append(text,link);row.append(year,body);list.append(row);
    }
    more.hidden=events.length<=3;more.textContent=expanded?'Mostra meno':'Mostra tutti gli eventi';more.setAttribute('aria-expanded',String(expanded));
  }
  async function load(day){
    const id=++requestId;events=[];expanded=false;render();status.hidden=false;status.textContent='Caricamento degli eventi…';
    const page=day.replace(' ','_'), source='https://it.wikipedia.org/wiki/'+encodeURIComponent(page);
    document.querySelector('#history-date').textContent=day;
    document.querySelector('#day-source').href=source;
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const params=new URLSearchParams({action:'parse',page,prop:'text',format:'json',formatversion:'2',origin:'*',redirects:'1',disableeditsection:'1'});
      const response=await fetch('https://it.wikipedia.org/w/api.php?'+params,{signal:controller.signal,credentials:'omit'});
      if(!response.ok)throw new Error('HTTP');
      const data=await response.json();if(typeof data.parse?.text!=='string')throw new Error('Format');
      const doc=new DOMParser().parseFromString(data.parse.text,'text/html');
      let active=false, found=false;const result=[];
      for(const node of doc.querySelectorAll('h2,li')){
        if(node.tagName==='H2'){active=node.textContent.trim().toLowerCase()==='eventi';if(active)found=true;continue;}
        if(!active||node.parentElement.closest('li'))continue;
        const text=node.textContent.replace(/\[\d+\]/g,'').replace(/\s+/g,' ').trim();
        const match=text.match(/^(\d{4})\s*[–—−-]\s*(.+)$/);
        if(!match||Number(match[1])<1900||Number(match[1])>1999)continue;
        const a=[...node.querySelectorAll('a[href]')].find(a=>/^\/wiki\//.test(a.getAttribute('href'))&&!/^\d{4}$/.test(a.textContent));
        result.push({year:Number(match[1]),text:match[2],url:a?new URL(a.getAttribute('href'),'https://it.wikipedia.org').href:source});
      }
      if(!found)throw new Error('Section');
      if(id!==requestId)return;
      events=result.sort((a,b)=>a.year-b.year);render();
      status.hidden=events.length>0;status.textContent='Nessun evento del Novecento presente nella fonte per questa data.';
    }catch(error){if(id===requestId){status.hidden=false;status.textContent='Gli eventi non sono disponibili al momento. Puoi consultare la fonte qui sotto.';}}
    finally{clearTimeout(timeout);}
  }
  function tick(){const now=new Date();clock.textContent=clockFormat.format(now)+' · Roma';clock.dateTime=now.toISOString();const day=dateFormat.format(now);if(list&&day!==currentDay){currentDay=day;load(day);}}
  more?.addEventListener('click',()=>{expanded=!expanded;render();});
  tick();setInterval(tick,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
})();
