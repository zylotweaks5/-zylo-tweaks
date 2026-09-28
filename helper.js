/* More-menu toggle + ZYLO helper (rule-based guide finder — not a live AI). */
(function(){
  /* --- More menu --- */
  var mb=document.getElementById('more-btn'),mg=document.getElementById('mega');
  function mega(o){if(!mg)return;mg.hidden=!o;mb.setAttribute('aria-expanded',o)}
  if(mb&&mg){
    mb.addEventListener('click',function(e){e.stopPropagation();mega(mg.hidden)});
    mg.addEventListener('click',function(e){if(e.target.closest('a'))mega(false)});
    document.addEventListener('click',function(e){if(!mg.hidden&&!mg.contains(e.target))mega(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')mega(false)});
  }
  /* --- Helper --- */
  var N={'low-end':'Potato / Low-End Preset','potato-pro':'Potato Graphics Pro','amd':'AMD Optimization','intel':'Intel Optimization','nvidia':'Nvidia Pack','game-processor':'Game Processor','game-settings':'Game User Settings','stretched-res':'Stretched Resolution','network':'Network Optimization','pc-checks':'PC Checks','basic':'Basic Tweaks','pro':'Pro Tweaks','extreme':'Extreme Tweaks','full-optimization':'Full Optimization','zero-delay':'0 Delay'};
  var R=[
   [['low end','low-end','potato','weak','slow','4gb','8gb','integrated','old pc','laptop','bad pc'],'For a weaker PC, start with the Low-End preset. If it still struggles, Potato Graphics Pro goes further.',['low-end','potato-pro','pc-checks']],
   [['amd','ryzen','radeon'],'For AMD hardware, the AMD guide is built for you. Game Processor pairs well with it.',['amd','game-processor']],
   [['intel'],'For Intel CPUs, start with the Intel guide. Game Processor pairs well with it.',['intel','game-processor']],
   [['nvidia','geforce','rtx','gtx'],'For GeForce GPUs, try the Nvidia Pack and the Game User Settings guide.',['nvidia','game-settings']],
   [['input delay','delay','latency','responsive','input lag'],'For the lowest input delay, the 0 Delay guide is the one. Game Processor also helps.',['zero-delay','game-processor']],
   [['ping','network','wifi','wi-fi','packet','jitter','internet','connection'],'For ping and connection issues, use the Network guide. A wired cable helps a lot too.',['network']],
   [['stretch','4:3','aspect','resolution'],'The Stretched Resolution guide walks through setting it up.',['stretched-res']],
   [['fps','frames','boost','performance','stutter'],'For more FPS, run PC Checks first to see what is slowing you down, then use Basic Tweaks. Pro Tweaks is the next step up.',['pc-checks','basic','pro']],
   [['start','begin','beginner','new','where','not sure','unsure','help'],'Start with PC Checks to see what is slowing your PC, then Basic Tweaks.',['pc-checks','basic']],
   [['everything','all of it','full','extreme','max'],'For everything in one pass, use Full Optimization. Extreme Tweaks is for squeezing out the last bit.',['full-optimization','extreme']],
   [['safe','cheat','ban','virus','anticheat','anti-cheat','legit'],'Everything here is a normal Windows or in-game setting. No cheats, no macros, no DLL injection, nothing that touches anti-cheat. Back your settings up first.',[]],
   [['undo','revert','restore','backup','back up','reset'],'Everything can be undone. Back your settings up first, then flip them back whenever you want.',[]],
   [['discord','contact','email','human','person','support'],'You can ask in the Discord, or email zylotweaks5@gmail.com. Both go to a real person.',[]]
  ];
  var fab=document.createElement('button');fab.className='zh-fab';fab.type='button';fab.textContent='Ask ZYLO';
  var box=document.createElement('div');box.className='zh';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','ZYLO helper');
  box.innerHTML='<div class="zh-top"><span>ZYLO Helper</span><button type="button" aria-label="Close">✕</button></div><div class="zh-log" aria-live="polite"></div><div class="zh-chips"></div><form class="zh-form"><input type="text" placeholder="Describe your PC or problem…" aria-label="Message"><button>Send</button></form>';
  document.body.appendChild(fab);document.body.appendChild(box);
  var log=box.querySelector('.zh-log'),chips=box.querySelector('.zh-chips'),inp=box.querySelector('input'),started=false;
  function add(t,c){var d=document.createElement('div');d.className='zh-m '+c;d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight}
  function acts(items){if(!items.length)return;var d=document.createElement('div');d.className='zh-acts';items.forEach(function(it){var b=document.createElement('button');b.type='button';b.textContent=it[0];b.onclick=it[1];d.appendChild(b)});log.appendChild(d);log.scrollTop=log.scrollHeight}
  function open(o){box.hidden=!o;fab.hidden=o;if(o){if(!started){started=true;add("Hi! I'm the ZYLO helper. Tell me about your PC or what you want fixed and I'll point you to the right guide.\n\nI'm a simple guide-finder, not a live AI, so for anything unusual ask in the Discord.",'zh-b')}inp.focus()}}
  function guide(id){box.hidden=true;fab.hidden=false;if(window.zyloOpenTweak)window.zyloOpenTweak(id)}
  function reply(t){
    var s=t.toLowerCase(),best=null,bs=0;
    R.forEach(function(r){var n=0;r[0].forEach(function(k){if(s.indexOf(k)>-1)n++});if(n>bs){bs=n;best=r}});
    if(!best){add("I'm not sure about that one. Try mentioning your CPU/GPU brand, your RAM, or whether it's FPS, input delay or ping. You can also ask in the Discord.",'zh-b');acts([['Open Discord',function(){window.open('https://discord.gg/zAaH8uxAG','_blank','noopener')}],['Email support',function(){location.href='mailto:zylotweaks5@gmail.com'}]]);return}
    add(best[1],'zh-b');
    acts(best[2].map(function(id){return ['Open: '+N[id],function(){guide(id)}]}));
    if(/discord|contact|email|human|person|support/.test(s))acts([['Open Discord',function(){window.open('https://discord.gg/zAaH8uxAG','_blank','noopener')}],['Email support',function(){location.href='mailto:zylotweaks5@gmail.com'}]]);
  }
  function send(t){t=t.trim();if(!t)return;add(t,'zh-u');reply(t)}
  ['My PC is low-end','I have AMD','I have Nvidia','Lower input delay','Fix my ping','Is it safe?'].forEach(function(c){var b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=function(){send(c)};chips.appendChild(b)});
  fab.onclick=function(){open(true)};box.querySelector('.zh-top button').onclick=function(){open(false)};
  box.querySelector('form').addEventListener('submit',function(e){e.preventDefault();send(inp.value);inp.value=''});
  document.addEventListener('click',function(e){var t=e.target.closest('[data-zh-open]');if(t){e.preventDefault();if(mg)mega(false);open(true)}});
})();
