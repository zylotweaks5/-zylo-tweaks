/* ZYLO dashboard. Two modes:
   - Not connected: builds .bat scripts (via panel.js) you run yourself.
   - Connected: talks to ZYLO Link (ZYLO_Link.bat) running on your PC to apply tweaks live, with real results. */
(function(){
  var Z=window.zyloCore,root=document.getElementById('app');if(!Z||!root)return;
  var T=Z.T,LT=[{id:'gfx',n:'Lowest in-game graphics',d:'Sets Fortnite quality levels to the lowest. Close Fortnite first.'},{id:'fps',n:'Uncap the frame rate limit',d:'Removes the saved FPS cap in Fortnite\'s settings file. Close Fortnite first.'}];
  var ALL=T.concat(LT),PRESET=['gm','dvr','pw','gpu','fso','dpi','fps'],BASE='http://127.0.0.1:47831';
  var link={on:false,code:'',info:null,err:'',busy:false},tab='ov',scanR=null,opt=null,q=null;
  var NAV=[['SYSTEM',[['ov','Overview','▦'],['link','Connect PC','⌁'],['gp','Game Presets','✦']]],['OPTIMIZATION',[['win','Windows','⊞'],['gr','Graphics','▭'],['net','Network','◎'],['cln','Cleanup','⌫'],['fn','Fortnite','F']]],['MORE',[['pot','Potato','◧'],['cr','Credits','©']]]];
  var CAT={win:['gm','dvr','pw'],gr:['gpu','fso','dpi'],net:['dns'],cln:['tmp'],fn:['gfx','fps']};
  var HEAD={ov:['Overview','Your PC at a glance'],link:['Connect PC','Let the dashboard apply tweaks directly'],gp:['Game Presets','One tap. Max FPS.'],win:['Windows','Game Mode, capture and power'],gr:['Graphics','GPU and fullscreen behaviour'],net:['Network','Clear stale lookups'],cln:['Cleanup','One-time cleanup'],fn:['Fortnite','Edits Fortnite\'s own settings file'],pot:['Potato','Guides for low-end PCs'],cr:['Credits','About ZYLO TWEAKS']};
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML}
  function nm(id){return ALL.filter(function(t){return t.id===id})[0].n}
  function n(){return ALL.filter(function(t){return Z.sel[t.id]}).length}
  function api(path,body){return fetch(BASE+path,{method:body?'POST':'GET',headers:{'X-Zylo-Code':link.code,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined}).then(function(r){if(r.status===401)throw new Error('Wrong code');if(!r.ok)throw new Error('Link error '+r.status);return r.json()})}
  function lost(e){link.on=false;link.err=e.message==='Wrong code'?'That code is wrong. Check the ZYLO Link window.':'Could not reach ZYLO Link. Make sure it is running on this PC and that you opened this page in Chrome or Edge on the same PC. Safari and iPad cannot connect.'}
  function connect(){link.err='';link.busy=true;draw();api('/status').then(function(i){link.on=true;link.info=i;link.busy=false;tab='ov';draw()}).catch(function(e){link.busy=false;lost(e);draw()})}
  function browserScan(){
    var gpu='Unavailable in this browser';
    try{var c=document.createElement('canvas'),gl=c.getContext('webgl')||c.getContext('experimental-webgl'),e=gl&&gl.getExtension('WEBGL_debug_renderer_info');if(e)gpu=gl.getParameter(e.UNMASKED_RENDERER_WEBGL)}catch(x){}
    var ua=navigator.userAgent,os=/Windows/.test(ua)?'Windows':/iPhone|iPad/.test(ua)?'iOS':/Android/.test(ua)?'Android':/Mac/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Unknown';
    scanR={OS:os,CPU:navigator.hardwareConcurrency?navigator.hardwareConcurrency+' threads':'Unavailable',Memory:navigator.deviceMemory?'About '+navigator.deviceMemory+' GB (rounded)':'Unavailable in this browser',Graphics:gpu,Display:screen.width+' × '+screen.height,Fortnite:'Connect your PC to check'};
  }
  function cards(o){var h='<div class="gr">';Object.keys(o).forEach(function(k){h+='<div class="cd"><small>'+esc(k.toUpperCase())+'</small><b>'+esc(o[k])+'</b></div>'});return h+'</div>'}
  function tweaks(ids){
    var h='<div class="ls">'+ids.map(function(id){var t=ALL.filter(function(x){return x.id===id})[0];return '<label class="t"><span><b>'+esc(t.n)+'</b><small>'+esc(t.d)+'</small></span><input type="checkbox" data-id="'+id+'"'+(Z.sel[id]?' checked':'')+'></label>'}).join('')+'</div>';
    var only=ids.filter(function(id){return Z.sel[id]});
    if(link.on)return h+'<div class="bar"><span><b>'+only.length+'</b> selected · applies straight to your PC</span><span><button class="gh" data-a="restc">Restore selected</button> <button class="bt" data-a="applyc">Apply to my PC</button></span></div>';
    if(tab==='fn')return h+'<div class="warn">These two edit Fortnite\'s settings file, so they need ZYLO Link. <a href="#" data-tab="link" style="text-decoration:underline">Connect your PC</a></div>';
    return h+'<div class="bar"><span><b>'+n()+'</b> of '+ALL.length+' tweaks selected · <a href="#" data-tab="link" style="color:var(--blue)">connect your PC</a> to apply directly</span><span><button class="gh" data-a="restore">Restore script</button> <button class="bt" data-a="apply">Download Apply script</button></span></div><details><summary>Preview the script before you run it</summary><pre>'+esc(Z.build(true))+'</pre></details>';
  }
  function body(){
    if(tab==='ov'){
      var h='';
      if(link.on){var i=link.info;h+='<div class="lbl">Your PC<span>Live from ZYLO Link</span></div>'+cards({OS:i.os,CPU:i.cpu,Threads:i.threads+' threads',Memory:i.ramGB+' GB',Graphics:[].concat(i.gpu).join(', '),Fortnite:i.running?'Running now':i.fortnite?'Installed':'Not found'})}
      else{if(scanR&&scanR.OS!=='Windows')h+='<div class="warn">You\'re on '+esc(scanR.OS)+'. Open this dashboard on your Windows gaming PC to connect it.</div>';h+='<div class="lbl">System scan<span>'+(scanR?'Limited to what your browser exposes':'Not scanned yet')+'</span></div>'+cards(scanR||{OS:'—',CPU:'—',Memory:'—',Graphics:'—',Display:'—',Fortnite:'—'})}
      var u=Z.user();
      return h+'<div class="lbl">Optimization<span></span></div>'+cards({'Tweaks selected':n()+' / '+ALL.length,'PC link':link.on?'Connected':'Not connected',Discord:u?u.name:'Not connected'});
    }
    if(tab==='link'){
      if(link.on)return '<div class="cd fn" style="border-color:#14532d"><div class="ic" style="background:#14532d">✓</div><h3>PC CONNECTED</h3><p>Tweaks you apply now go straight to this PC.</p><em>&nbsp;</em><button class="op" data-a="disc" style="background:#1a2332;color:var(--text)">Disconnect</button></div><p class="nt">To fully disconnect, also close the ZYLO Link window.</p>';
      return '<div class="gr"><div class="cd"><small>STEP 1</small><b>Download ZYLO Link</b><p class="nt">One file for your gaming PC. You can open it in Notepad and read every line first.</p><a class="bt" style="display:inline-block;margin-top:8px" href="ZYLO_Link.bat" download>Download ZYLO_Link.bat</a></div>'+
        '<div class="cd"><small>STEP 2</small><b>Run it</b><p class="nt">Double-click it and approve the admin prompt. A window opens with a 6-character code.</p></div>'+
        '<div class="cd"><small>STEP 3</small><b>Enter the code</b><div style="display:flex;gap:8px;margin-top:10px"><input class="ci" id="code" maxlength="6" placeholder="ABC123" autocomplete="off" value="'+esc(link.code)+'"><button class="bt" data-a="connect">'+(link.busy?'Connecting…':'Connect')+'</button></div></div></div>'+
        (link.err?'<div class="warn">'+esc(link.err)+'</div>':'')+
        '<p class="nt">Safety: ZYLO Link only listens on your own PC (127.0.0.1), needs that code, and can only run the fixed list of tweaks you see in this dashboard. It can\'t run anything else. Use Chrome or Edge on the same PC, and allow the local-network prompt if your browser asks.</p>';
    }
    if(tab==='gp')return '<div class="lbl">Game Presets<span>One tap</span></div><div class="gr"><div class="cd fn"><div class="ic">F</div><h3>FORTNITE</h3><p>Maximum FPS, minimum input lag</p><em>'+PRESET.length+' tweaks · '+(link.on?'applies directly to this PC':'builds a script')+'</em><button class="op" data-a="opt">Optimize</button></div>'+
      '<div class="cd fn" style="border-color:var(--line);background:var(--card)"><div class="ic" style="background:#1a2332;color:var(--dim)">◧</div><h3>LOW-END PC</h3><p>Step-by-step guides for weaker hardware</p><em>Guides</em><button class="op" style="background:#1a2332;color:var(--text)" data-tab="pot">Open Potato</button></div></div>';
    if(CAT[tab])return tweaks(CAT[tab]);
    if(tab==='pot')return '<div class="lbl">Potato<span>Guides</span></div><div class="gr"><div class="cd fn"><div class="ic" style="background:#1a2332">A</div><h3>AMD / INTEL GPU</h3><p>Low-end settings guide</p><em>&nbsp;</em><a class="op" style="display:block" href="index.html#tweaks">Open guides</a></div><div class="cd fn"><div class="ic" style="background:#1a2332">N</div><h3>NVIDIA GPU</h3><p>Low-end settings guide</p><em>&nbsp;</em><a class="op" style="display:block" href="index.html#tweaks">Open guides</a></div></div>';
    return '<div class="lbl">ZYLO TWEAKS<span></span></div><div class="cd"><b>Free Fortnite performance tweaks for Windows.</b><p class="nt">Not affiliated with Epic Games or Discord.</p><a class="gh" style="display:inline-block;margin-top:8px" href="https://discord.gg/zAaH8uxAG" target="_blank" rel="noopener">Join the Discord</a></div>';
  }
  var ICON={wait:'○',run:'◌',ok:'✓',fail:'✕'};
  function overlay(){
    if(q){var d=q.items.filter(function(i){return i.st==='ok'||i.st==='fail'}).length,pct=Math.round(d/q.items.length*100),ok=q.items.filter(function(i){return i.st==='ok'}).length;
      return '<div class="ov"><div class="oc"><div class="ic">F</div><h3>'+esc(q.title)+'</h3><div class="pb"><i style="width:'+pct+'%"></i></div><div class="pc">'+pct+'%</div><ul class="st">'+q.items.map(function(i){return '<li class="'+i.st+'"><span class="si">'+ICON[i.st]+'</span><span>'+esc(nm(i.id))+(i.msg&&i.st==='fail'?'<small>'+esc(i.msg)+'</small>':'')+'</span></li>'}).join('')+'</ul>'+
        (q.done?'<p><b style="color:'+(ok===q.items.length?'var(--green)':'#fbbf24')+'">'+ok+' of '+q.items.length+' done'+(ok===q.items.length?' ✓':'')+'</b></p><div class="bar2">'+(q.act==='apply'&&link.on?'<button class="bt" data-a="launch">Launch Fortnite</button><button class="gh" data-a="undo">Undo these</button>':'')+'<button class="gh" data-a="close">Close</button></div>':'')+'</div></div>';}
    if(opt)return '<div class="ov"><div class="oc"><div class="ic">F</div><h3>FORTNITE</h3>'+(opt.done?'<p><b style="color:var(--green)">Script ready ✓</b></p><ol><li>Open the downloaded <b>ZYLO_Apply.bat</b>.</li><li>Right-click it, then choose Run as administrator.</li><li>Its window shows each step as OK or FAILED.</li><li>Restart Fortnite.</li></ol><p class="nt">Want this to happen right from the dashboard? Use Connect PC.</p><button class="bt" data-a="close" style="width:100%">Done</button>':'<p>'+esc(opt.t)+'</p><div class="pb"><i style="width:'+opt.p+'%"></i></div><div class="pc">'+opt.p+'%</div>')+'</div></div>';
    return '';
  }
  function draw(){
    var u=Z.user(),h=HEAD[tab];
    root.innerHTML='<aside class="sd"><div class="lg"><i>⚡</i><div><b>ZYLO <span>TWEAKS</span></b><small>OPTIMIZER</small></div></div>'+
      NAV.map(function(g){return '<div class="sl">'+g[0]+'</div>'+g[1].map(function(x){return '<button class="nv'+(tab===x[0]?' on':'')+'" data-tab="'+x[0]+'"><span>'+x[2]+'</span>'+x[1]+'</button>'}).join('')}).join('')+
      '<div class="sf"><b>'+(u?esc(u.name):'Guest')+'</b>discord.gg/zAaH8uxAG</div></aside>'+
      '<main class="mn"><div class="hd"><div><h1>'+h[0]+'</h1><p>'+h[1]+'</p></div><div class="hr"><button class="chip" data-tab="link"><i class="dot'+(link.on?' on':'')+'"></i>'+(link.on?'PC connected':'PC not connected')+'</button><button class="sc" data-a="scan">Scan System</button></div></div>'+body()+'</main>'+overlay();
    var ci=document.getElementById('code');if(ci)ci.focus()&&0;
  }
  function run(ids,act){
    q={act:act,title:act==='apply'?'Applying to your PC':'Restoring defaults',items:ids.map(function(id){return{id:id,st:'wait',msg:''}}),done:false};draw();
    var i=0;(function next(){
      if(i>=q.items.length){q.done=true;draw();return}
      var it=q.items[i];it.st='run';draw();
      api('/tweak',{id:it.id,action:act}).then(function(r){it.st=r.ok?'ok':'fail';it.msg=r.msg||''}).catch(function(e){it.st='fail';it.msg=e.message;lost(e)}).then(function(){i++;draw();if(!link.on&&i<q.items.length){q.items.slice(i).forEach(function(x){x.st='fail';x.msg='Disconnected'});q.done=true;draw();return}next()});
    })();
  }
  function optimize(){
    opt={p:10,t:'Selecting the Fortnite preset…',done:false};draw();
    Z.sel={};PRESET.forEach(function(k){Z.sel[k]=1});Z.save();
    setTimeout(function(){opt.p=55;opt.t='Building your script…';var txt=Z.build(true);draw();
      setTimeout(function(){opt.p=100;opt.t='Saving ZYLO_Apply.bat…';Z.dl('ZYLO_Apply.bat',txt);draw();
        setTimeout(function(){opt.done=true;draw()},600)},700)},700)}
  root.addEventListener('click',function(e){
    var t=e.target.closest('[data-tab],[data-a]');if(!t)return;
    if(t.tagName==='A'&&t.getAttribute('href')==='#')e.preventDefault();
    if(t.dataset.tab){tab=t.dataset.tab;draw();return}
    var a=t.dataset.a,ids=(CAT[tab]||[]).filter(function(id){return Z.sel[id]});
    if(a==='scan'){if(link.on){api('/status').then(function(i){link.info=i;tab='ov';draw()}).catch(function(x){lost(x);tab='link';draw()})}else{browserScan();tab='ov';draw()}}
    else if(a==='opt'){if(link.on){var s={};PRESET.forEach(function(k){s[k]=1});Z.sel=s;Z.save();run(PRESET,'apply')}else optimize()}
    else if(a==='applyc'){if(ids.length)run(ids,'apply')}
    else if(a==='restc'){if(ids.length)run(ids,'restore')}
    else if(a==='connect'){connect()}
    else if(a==='disc'){link.on=false;link.info=null;draw()}
    else if(a==='launch'){api('/launch',{}).catch(function(){});q=null;draw()}
    else if(a==='undo'){run(q.items.map(function(i){return i.id}),'restore')}
    else if(a==='close'){opt=null;q=null;draw()}
    else if(a==='apply')Z.dl('ZYLO_Apply.bat',Z.build(true));
    else if(a==='restore')Z.dl('ZYLO_Restore.bat',Z.build(false));
  });
  root.addEventListener('input',function(e){if(e.target.id==='code')link.code=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'')});
  root.addEventListener('keydown',function(e){if(e.target.id==='code'&&e.key==='Enter'){link.code=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'');connect()}});
  root.addEventListener('change',function(e){var id=e.target.dataset.id;if(!id)return;var s=Z.sel;s[id]=e.target.checked?1:0;Z.sel=s;Z.save();draw()});
  draw();
})();
