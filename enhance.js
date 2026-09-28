/* Adds search + tag filter + sort + live count above the tweak cards. Doesn't touch script.js. */
(function(){
  var grid=document.querySelector('#tweaks .card-grid'); if(!grid) return;
  var cards=[].slice.call(grid.querySelectorAll('.tweak-card'));
  var tags=[]; cards.forEach(function(c){var t=(c.querySelector('.tweak-box-tag')||{}).textContent;t=(t||'').trim();c.dataset.tag=t;if(t&&tags.indexOf(t)<0)tags.push(t)});
  var bar=document.createElement('div');bar.className='tweak-tools';
  bar.innerHTML='<input type="search" id="tq" placeholder="Search tweaks…" aria-label="Search tweaks"><select id="tf" aria-label="Filter by tag"><option value="">All tags</option>'+tags.map(function(t){return '<option>'+t+'</option>'}).join('')+'</select><select id="ts" aria-label="Sort"><option value="n">Default order</option><option value="a">A–Z</option></select>';
  var count=document.createElement('p');count.className='tweak-count';
  grid.parentNode.insertBefore(bar,grid);grid.parentNode.insertBefore(count,grid);
  var empty=document.createElement('div');empty.className='tweak-empty';empty.textContent='No tweaks match that search.';
  var q=bar.querySelector('#tq'),f=bar.querySelector('#tf'),s=bar.querySelector('#ts');
  function run(){
    var n=0,term=q.value.toLowerCase();
    var list=cards.slice(); if(s.value==='a')list.sort(function(a,b){return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent)});
    list.forEach(function(c){grid.appendChild(c);var ok=(!f.value||c.dataset.tag===f.value)&&c.textContent.toLowerCase().indexOf(term)>-1;c.style.display=ok?'':'none';if(ok)n++});
    count.textContent=n+' of '+cards.length+' free tweaks';
    if(!n)grid.appendChild(empty);else if(empty.parentNode)grid.removeChild(empty);
  }
  [q,f,s].forEach(function(el){el.addEventListener('input',run)});run();
})();
