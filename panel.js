/* ZYLO control panel + Discord connect.
   1) DISCORD: paste your Application (Client) ID below. See setup notes. Empty = login gate is off.
   2) PANEL: builds a .bat from the switches you pick. The site itself can't change a PC — the script does, when you run it. */
(function(){
  var CLIENT_ID='';   // <-- paste your Discord Client ID here
  var UK='zyloDiscord',TK='zyloPanel';
  var redirect=location.origin+location.pathname.replace(/[^\/]*$/,'');
  function ls(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
  function ss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  var user=ls(UK);

  /* ---------- Discord OAuth (implicit grant, identify only) ---------- */
  function finishLogin(){
    var h=new URLSearchParams(location.hash.slice(1)),t=h.get('access_token'),st=h.get('state'),ok=false;
    try{ok=st&&st===sessionStorage.getItem('zyloState')}catch(e){}
    history.replaceState(null,'',location.pathname+location.search);
    if(!t||!ok)return start();
    fetch('https://discord.com/api/users/@me',{headers:{Authorization:'Bearer '+t}}).then(function(r){return r.json()}).then(function(u){
      if(u&&u.id){user={id:u.id,name:u.global_name||u.username,avatar:u.avatar};ss(UK,user)}
    }).catch(function(){}).then(function(){var b=null;try{b=sessionStorage.getItem('zyloBack');sessionStorage.removeItem('zyloBack')}catch(e){}if(b&&b!==location.pathname){location.replace(b);return}start()});
  }
  function login(){
    var s=Math.random().toString(36).slice(2)+Date.now().toString(36);
    try{sessionStorage.setItem('zyloState',s);sessionStorage.setItem('zyloBack',location.pathname)}catch(e){}
    location.href='https://discord.com/oauth2/authorize?response_type=token&scope=identify&client_id='+CLIENT_ID+'&redirect_uri='+encodeURIComponent(redirect)+'&state='+s;
  }
  function gate(){
    if(!CLIENT_ID||user)return;
    var d=document.createElement('div');d.className='dl';d.id='dl';
    d.innerHTML='<div class="dl-c"><h2>Welcome to ZYLO TWEAKS</h2><p>Connect your Discord to continue and use the control panel.</p><button type="button">Connect Discord</button><small>Only your Discord name and avatar are read. Nothing is posted.</small></div>';
    d.querySelector('button').onclick=login;document.body.appendChild(d);document.body.style.overflow='hidden';
  }

  /* ---------- Tweaks -> script ---------- */
  var GB='HKCU\\Software\\Microsoft\\GameBar',GC='HKCU\\System\\GameConfigStore',DV='HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR',
      GP='HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences',LY='HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers';
  function add(k,v,t,d,extra){return 'reg add "'+k+'" /v '+v+' /t '+t+' /d '+d+' /f >nul'}
  var T=[
   {id:'gm',n:'Game Mode on',d:'Tells Windows to prioritise games.',a:[add(GB,'AutoGameModeEnabled','REG_DWORD',1),add(GB,'AllowAutoGameMode','REG_DWORD',1)],r:[add(GB,'AutoGameModeEnabled','REG_DWORD',1)]},
   {id:'dvr',n:'Turn off Game DVR recording',d:'Stops background capture overhead.',a:[add(GC,'GameDVR_Enabled','REG_DWORD',0),add(DV,'AppCaptureEnabled','REG_DWORD',0)],r:[add(GC,'GameDVR_Enabled','REG_DWORD',1),add(DV,'AppCaptureEnabled','REG_DWORD',1)]},
   {id:'pw',n:'High performance power plan',d:'Stops the CPU throttling down mid-match.',a:['powercfg /setactive SCHEME_MIN >nul'],r:['powercfg /setactive SCHEME_BALANCED >nul']},
   {id:'gpu',n:'Fortnite uses the high-performance GPU',d:'Makes laptops pick the dedicated GPU for Fortnite.',fn:1},
   {id:'fso',n:'Disable fullscreen optimizations',d:'Can reduce input lag on some setups.',fn:1,flag:'DISABLEDXMAXIMIZEDWINDOWEDMODE'},
   {id:'dpi',n:'High DPI awareness',d:'Stops Windows scaling the Fortnite window.',fn:1,flag:'HIGHDPIAWARE'},
   {id:'dns',n:'Flush DNS cache',d:'One-time action. Clears stale network lookups.',a:['ipconfig /flushdns >nul'],r:[]},
   {id:'tmp',n:'Clear temp files',d:'One-time action. Deletes your temp folder contents.',a:['del /q /f "%TEMP%\\*" >nul 2>&1'],r:[]}
  ];
  var sel=ls(TK)||{gm:1,dvr:1,pw:1};
  var FNL=['set "FN=C:\\Program Files\\Epic Games\\Fortnite\\FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe"','if not exist "%FN%" set /p FN=Paste the full path to FortniteClient-Win64-Shipping.exe: '];
  function head(t){return ['@echo off','setlocal','title ZYLO TWEAKS - '+t,'net session >nul 2>&1 || (echo Please right-click this file and choose Run as administrator. & pause & exit /b)','set "B=%USERPROFILE%\\Desktop\\ZYLO\\Backup"','if not exist "%B%" md "%B%"']}
  function build(apply){
    var on=T.filter(function(t){return sel[t.id]}),L=head(apply?'Apply':'Restore'),N=on.length;
    var needFN=apply?on.some(function(t){return t.fn}):true;
    if(needFN)L=L.concat(FNL);
    var X=' || set /a F+=1';
    if(apply){
      L.push('set "TF=0"','reg export "'+GB+'" "%B%\\gamebar.reg" /y >nul 2>&1','reg export "'+GC+'" "%B%\\gameconfig.reg" /y >nul 2>&1','reg export "'+GP+'" "%B%\\gpu.reg" /y >nul 2>&1','reg export "'+LY+'" "%B%\\layers.reg" /y >nul 2>&1','echo Backup saved to %B%','echo.');
      if(!N)L.push('echo No tweaks were selected.');
      var fl=on.filter(function(t){return t.flag}).map(function(t){return t.flag}),first=on.map(function(t){return !!t.flag}).indexOf(true);
      on.forEach(function(t,i){
        L.push('echo ['+(i+1)+'/'+N+'] '+t.n.replace(/[()&|<>^%]/g,'')+'...');
        if(t.flag&&i!==first){L.push('echo    Applied together with the step above');return}
        L.push('set "F=0"');
        (t.a||[]).forEach(function(c){L.push(c+X)});
        if(t.id==='gpu')L.push('reg add "'+GP+'" /v "%FN%" /t REG_SZ /d "GpuPreference=2;" /f >nul'+X);
        if(i===first)L.push('reg add "'+LY+'" /v "%FN%" /t REG_SZ /d "~ '+fl.join(' ')+'" /f >nul'+X);
        L.push('if %F%==0 (echo    OK) else (echo    FAILED & set /a TF+=1)');
      });
      if(N)L.push('echo.','if %TF%==0 (echo All '+N+' tweaks applied. Restart Fortnite.) else (echo Some tweaks had problems - see above. Use the Restore script to undo.)');
    }else{
      L.push('echo Restoring defaults...');
      T.forEach(function(t){(t.r||[]).forEach(function(c){L.push(c)})});
      L.push('reg delete "'+GP+'" /v "%FN%" /f >nul 2>&1','reg delete "'+LY+'" /v "%FN%" /f >nul 2>&1','echo.','echo Restored. Your backups are still in %B%');
    }
    L.push('pause');return L.join('\n');
  }
  function dl(name,text){var b=new Blob([text.replace(/\n/g,'\r\n')],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1500)}

  /* ---------- UI ---------- */
  function start(){
    gate();
    var root=document.getElementById('panel-root');if(!root)return;
    var tab='dash',built='',stage=false,PRESET=['gm','dvr','pw','gpu','fso','dpi'];
    function av(){return user&&user.avatar?'https://cdn.discordapp.com/avatars/'+user.id+'/'+user.avatar+'.png?size=64':''}
    function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
    function render(){
      var n=T.filter(function(t){return sel[t.id]}).length;
      var side='<aside class="pn-side"><div class="pn-brand">⚡<div>ZYLO TWEAKS<small>CONTROL PANEL</small></div></div>'+
       [['dash','Dashboard'],['tw','Tweaks'],['pot','Potato'],['cr','Credits']].map(function(x){return '<button type="button" class="pn-tab'+(tab===x[0]?' on':'')+'" data-t="'+x[0]+'">'+x[1]+'</button>'}).join('')+
       '<div class="pn-user">'+(user?(av()?'<img src="'+av()+'" alt="">':'')+'<div><b>'+esc(user.name)+'</b><a data-out>Disconnect</a></div>':'<div>Discord not connected'+(CLIENT_ID?'<br><a data-in>Connect</a>':'')+'</div>')+'</div></aside>';
      var m='';
      if(tab==='dash'){
        m='<div class="pn-h"><h3>ZYLO TWEAKS</h3><p>Pick your tweaks, build a script, and run it on your PC. Every command is shown before you run it.</p></div>'+
        '<div class="pn-stats"><div class="pn-st"><small>Discord</small><b>'+(user?'Connected':'Not connected')+'</b></div><div class="pn-st"><small>Tweaks selected</small><b>'+n+' / '+T.length+'</b></div><div class="pn-st"><small>Script</small><b>'+(built||'Not built yet')+'</b></div></div>'+
        '<div class="pn-c" style="text-align:left;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span><b>Fortnite preset</b><br><small class="pn-note">Recommended tweaks for most PCs. Review every command in the Tweaks tab.</small></span><button class="pn-btn" data-a="preset">Optimize</button></div>'+
        (stage?'<div class="pn-h"><h3>Script built ✓</h3><ol class="pn-steps"><li>Open the downloaded ZYLO_Apply.bat: right-click it, then Run as administrator.</li><li>Its window shows each step as OK or FAILED.</li><li>Restart Fortnite.</li></ol></div>':'')+
        '<div class="pn-row"><button class="pn-btn" data-a="apply">Download Apply script</button><button class="pn-btn r" data-a="restore">Download Restore script</button></div>'+
        '<ol class="pn-steps"><li>Choose tweaks in the Tweaks tab.</li><li>Download the Apply script.</li><li>Right-click it, then choose Run as administrator.</li><li>Restart Fortnite. Use the Restore script any time to undo.</li></ol>'+
        '<p class="pn-note">A website can\'t change your PC by itself. The script does it, on your PC, with your permission.</p>';
      }else if(tab==='tw'){
        m='<div class="pn-h"><h3>Tweaks</h3><p>Flip any tweak on or off. The script below updates as you go.</p></div><div class="pn-list">'+
        T.map(function(t){return '<label class="pn-t"><span><b>'+t.n+'</b><small>'+t.d+'</small></span><input type="checkbox" data-id="'+t.id+'"'+(sel[t.id]?' checked':'')+'></label>'}).join('')+'</div>'+
        '<pre class="pn-pre" id="pv"></pre><div class="pn-row"><button class="pn-btn" data-a="apply">Download Apply script</button><button class="pn-btn r" data-a="restore">Download Restore script</button></div>';
      }else if(tab==='pot'){
        m='<div class="pn-h"><h3>Potato</h3><p>Low-end graphics presets for older or weaker PCs, split by GPU vendor.</p></div><div class="pn-two">'+
        '<div class="pn-c"><h4>AMD / Intel GPU</h4><p>Step-by-step guide for weaker AMD and Intel setups.</p><button class="pn-btn" data-g="low-end">Open guide</button></div>'+
        '<div class="pn-c"><h4>Nvidia GPU</h4><p>Nvidia settings for low-end GeForce cards.</p><button class="pn-btn" data-g="nvidia">Open guide</button></div></div>';
      }else{
        m='<div class="pn-h"><h3>Credits</h3><p>Made by ZYLO TWEAKS. Not affiliated with Epic Games or Discord.</p></div><div class="pn-row"><a class="pn-btn g" href="https://discord.gg/zAaH8uxAG" target="_blank" rel="noopener">Join the Discord</a></div>';
      }
      root.innerHTML='<div class="pn">'+side+'<div class="pn-main">'+m+'</div></div>';
      var pv=root.querySelector('#pv');if(pv)pv.textContent=build(true);
    }
    root.addEventListener('click',function(e){
      var t=e.target.closest('[data-t],[data-a],[data-g],[data-out],[data-in]');if(!t)return;
      if(t.dataset.t){tab=t.dataset.t;render()}
      else if(t.dataset.a){if(t.dataset.a==='preset'){sel={};PRESET.forEach(function(k){sel[k]=1});ss(TK,sel);stage=true}var ap=t.dataset.a!=='restore';dl(ap?'ZYLO_Apply.bat':'ZYLO_Restore.bat',build(ap));built='Built '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});render()}
      else if(t.dataset.g){if(window.zyloOpenTweak)window.zyloOpenTweak(t.dataset.g);else location.href='index.html#tweaks'}
      else if(t.hasAttribute('data-out')){try{localStorage.removeItem(UK)}catch(x){}location.reload()}
      else if(t.hasAttribute('data-in'))login();
    });
    root.addEventListener('change',function(e){var id=e.target.dataset.id;if(!id)return;sel[id]=e.target.checked?1:0;ss(TK,sel);var pv=root.querySelector('#pv');if(pv)pv.textContent=build(true)});
    render();
  }
  window.zyloCore={T:T,build:build,dl:dl,save:function(){ss(TK,sel)},user:function(){return user},get sel(){return sel},set sel(v){sel=v}};
  if(location.hash.indexOf('access_token=')>-1)finishLogin();else start();
})();
