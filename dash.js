/* ZYLO dashboard UI. Uses the tweak list + script builder from panel.js (window.zyloCore). */
(function(){
  var Z=window.zyloCore,root=document.getElementById('app');if(!Z||!root)return;
  var T=Z.T,tab='ov',scanR=null,opt=null,PRESET=['gm','dvr','pw','gpu','fso','dpi'];
  var NAV=[['SYSTEM',[['ov','Overview','▦'],['gp','Game Presets','✦']]],['OPTIMIZATION',[['win','Windows','⊞'],['gfx','Graphics','▭'],['net','Network','⌁'],['cln','Cleanup','⌫']]],['MORE',[['pot','Potato','◧'],['cr','Credits','©']]]];
  var CAT={win:['gm','dvr','pw'],gfx:['gpu','fso','dpi'],net:['dns'],cln:['tmp']};
  var HEAD={ov:['Overview','Your PC at a glance'],gp:['Game Presets','One tap. Max FPS.'],win:['Windows','Game Mode, capture and power'],gfx:['Graphics','GPU and fullscreen behaviour'],net:['Network','Clear stale lookups'],cln:['Cleanup','One-time cleanup'],pot:['Potato','Guides for low-end PCs'],cr:['Credits','About ZYLO TWEAKS']};
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
  function n(){return T.filter(function(t){return Z.sel[t.id]}).length}
  function scan(){
    var gpu='Unavailable in this browser';
    try{var c=document.createElement('canvas'),gl=c.getContext('webgl')||c.getContext('experimental-webgl'),e=gl&&gl.getExtension('WEBGL_debug_renderer_info');if(e)gpu=gl.getParameter(e.UNMASKED_RENDERER_WEBGL)}catch(x){}
    var ua=navigator.userAgent,os=/Windows NT 10/.test(ua)?'Windows 10/11':/Windows/.test(ua)?'Windows':/iPhone|iPad/.test(ua)?'iOS':/Android/.test(ua)?'Android':/Mac/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Unknown';
    scanR={OS:os,'CPU threads':navigator.hardwareConcurrency?navigator.hardwareConcurrency+' threads':'Unavailable','Memory':navigator.deviceMemory?'About '+navigator.deviceMemory+' GB (rounded)':'Unavailable in this browser','Graphics':gpu,'Display':screen.width+' × '+screen.height+' @ '+(window.devicePixelRatio||1)+'x','Connection':navigator.connection&&navigator.connection.effectiveType?navigator.connection.effectiveType:'Unavailable'};
  }
  function tweaks(ids){return '<div class="ls">'+ids.map(function(id){var t=T.filter(function(x){return x.id===id})[0];return '<label class="t"><span><b>'+esc(t.n)+'</b><small>'+esc(t.d)+'</small></span><input type="checkbox" data-id="'+id+'"'+(Z.sel[id]?' checked':'')+'></label>'}).join('')+'</div>'+
    '<div class="bar"><span><b>'+n()+'</b> of '+T.length+' tweaks selected</span><span><button class="gh" data-a="restore">Restore script</button> <button class="bt" data-a="apply">Download Apply script</button></span></div>'+
    '<details><summary>Preview the script before you run it</summary><pre>'+esc(Z.build(true))+'</pre></details>'}
  function body(){
    if(tab==='ov'){
      var u=Z.user(),h='';
      if(scanR&&scanR.OS!=='Windows 10/11'&&scanR.OS!=='Windows')h+='<div class="warn">You\'re on '+esc(scanR.OS)+'. The scripts are for Windows PCs, so download them on your gaming PC.</div>';
      h+='<div class="lbl">System scan<span>'+(scanR?'Limited to what your browser exposes':'Not scanned yet')+'</span></div><div class="gr">';
      ['OS','CPU threads','Memory','Graphics','Display','Connection'].forEach(function(k){h+='<div class="cd"><small>'+k.toUpperCase()+'</small><b>'+(scanR?esc(scanR[k]):'—')+'</b></div>'});
      h+='</div><div class="lbl">Optimization<span></span></div><div class="gr"><div class="cd"><small>TWEAKS SELECTED</small><b>'+n()+' / '+T.length+'</b></div><div class="cd"><small>DISCORD</small><b>'+(u?esc(u.name):'Not connected')+'</b></div></div>'+
        '<p class="nt">A website can\'t read everything about your PC or change it directly. The scan shows what the browser allows, and the scripts make the changes once you run them.</p>';
      return h}
    if(tab==='gp')return '<div class="lbl">Game Presets<span>One tap</span></div><div class="gr"><div class="cd fn"><div class="ic">F</div><h3>FORTNITE</h3><p>Maximum FPS, minimum input lag</p><em>'+PRESET.length+' tweaks</em><button class="op" data-a="opt">Optimize</button></div>'+
      '<div class="cd fn" style="border-color:var(--line);background:var(--card)"><div class="ic" style="background:#1a2332;color:var(--dim)">◧</div><h3>LOW-END PC</h3><p>Step-by-step guides for weaker hardware</p><em>Guides</em><button class="op" style="background:#1a2332;color:var(--text)" data-tab="pot">Open Potato</button></div></div>'+
      '<p class="nt">Optimize builds a script from the preset and downloads it. Run it as administrator and its window shows each step as OK or FAILED. You can review every command under Windows and Graphics first.</p>';
    if(CAT[tab])return tweaks(CAT[tab]);
    if(tab==='pot')return '<div class="lbl">Potato<span>Guides</span></div><div class="gr"><div class="cd fn"><div class="ic" style="background:#1a2332">A</div><h3>AMD / INTEL GPU</h3><p>Low-end settings guide</p><em>&nbsp;</em><a class="op" style="display:block" href="index.html#tweaks">Open guides</a></div><div class="cd fn"><div class="ic" style="background:#1a2332">N</div><h3>NVIDIA GPU</h3><p>Low-end settings guide</p><em>&nbsp;</em><a class="op" style="display:block" href="index.html#tweaks">Open guides</a></div></div>';
    return '<div class="lbl">ZYLO TWEAKS<span></span></div><div class="cd"><b>Free Fortnite performance tweaks for Windows.</b><p class="nt">Not affiliated with Epic Games or Discord.</p><a class="gh" style="display:inline-block;margin-top:8px" href="https://discord.gg/zAaH8uxAG" target="_blank" rel="noopener">Join the Discord</a></div>'}
  function draw(){
    var u=Z.user(),h=HEAD[tab];
    root.innerHTML='<aside class="sd"><div class="lg"><i>⚡</i><div><b>ZYLO <span>TWEAKS</span></b><small>OPTIMIZER</small></div></div>'+
      NAV.map(function(g){return '<div class="sl">'+g[0]+'</div>'+g[1].map(function(x){return '<button class="nv'+(tab===x[0]?' on':'')+'" data-tab="'+x[0]+'"><span>'+x[2]+'</span>'+x[1]+'</button>'}).join('')}).join('')+
      '<div class="sf"><b>'+(u?esc(u.name):'Guest')+'</b>discord.gg/zAaH8uxAG</div></aside>'+
      '<main class="mn"><div class="hd"><div><h1>'+h[0]+'</h1><p>'+h[1]+'</p></div><button class="sc" data-a="scan">Scan System</button></div>'+body()+'</main>'+
      (opt?'<div class="ov"><div class="oc"><div class="ic">F</div><h3>FORTNITE</h3>'+(opt.done?'<p><b style="color:var(--green)">Script ready ✓</b></p><ol><li>Open the downloaded <b>ZYLO_Apply.bat</b>.</li><li>Right-click it, then choose Run as administrator.</li><li>Its window shows each step as OK or FAILED.</li><li>Restart Fortnite.</li></ol><button class="bt" data-a="close" style="width:100%">Done</button>':'<p>'+esc(opt.t)+'</p><div class="pb"><i style="width:'+opt.p+'%"></i></div><div class="pc">'+opt.p+'%</div>')+'</div></div>':'')}
  function optimize(){
    opt={p:10,t:'Selecting the Fortnite preset…',done:false};draw();
    Z.sel={};PRESET.forEach(function(k){Z.sel[k]=1});Z.save();
    setTimeout(function(){opt.p=55;opt.t='Building your script…';var txt=Z.build(true);draw();
      setTimeout(function(){opt.p=100;opt.t='Saving ZYLO_Apply.bat…';Z.dl('ZYLO_Apply.bat',txt);draw();
        setTimeout(function(){opt.done=true;draw()},600)},700)},700)}
  root.addEventListener('click',function(e){
    var t=e.target.closest('[data-tab],[data-a]');if(!t)return;
    if(t.dataset.tab){tab=t.dataset.tab;draw()}
    else{var a=t.dataset.a;
      if(a==='scan'){scan();tab='ov';draw()}
      else if(a==='opt')optimize();
      else if(a==='close'){opt=null;draw()}
      else if(a==='apply')Z.dl('ZYLO_Apply.bat',Z.build(true));
      else if(a==='restore')Z.dl('ZYLO_Restore.bat',Z.build(false))}});
  root.addEventListener('change',function(e){var id=e.target.dataset.id;if(!id)return;var s=Z.sel;s[id]=e.target.checked?1:0;Z.sel=s;Z.save();draw()});
  draw();
})();
