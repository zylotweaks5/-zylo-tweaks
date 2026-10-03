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
  var DISC=['Open Discord',function(){window.open('https://discord.gg/zAaH8uxAG','_blank','noopener')}],MAIL=['Email support',function(){location.href='mailto:zylotweaks5@gmail.com'}],DASH=['Open dashboard',function(){location.href='dashboard.html'}];
  var I=[
   {id:'hi',k:['hi','hello','hey','yo','sup','hola','heya','howdy','good morning','good evening','good afternoon'],r:["Hey! 👋 What are you working on: FPS, input delay, ping, or a specific PC?","Hi there! Tell me about your PC or what's bugging you and I'll find the right guide.","Hello! Want help with FPS, input delay or ping?"]},
   {id:'how',k:['how are you','how r u','hows it going','whats up','wyd','you good'],r:["Doing great, thanks for asking! Ready to help you squeeze more FPS out of your PC. What's up?","All good here. What can I help you tune today?","Running smoothly (no stutters on my end 😄). What do you need?"]},
   {id:'thx',k:['thanks','thank you','thx','ty','cheers','appreciate'],r:["You're welcome! Ping me again if you need anything else.","Anytime! Good luck in your next match.","Happy to help! Let me know how the tweaks go."]},
   {id:'bye',k:['bye','goodbye','see ya','cya','later','gtg','good night'],r:["See you! Good luck out there.","Bye! Come back any time.","Catch you later, and gg."]},
   {id:'who',k:['who are you','what are you','your name','are you ai','are you real','are you a bot','are you human','are you chatgpt','who made you'],r:["I'm the ZYLO helper, a simple guide-finder built into this site. I'm not a live AI like ChatGPT and I'm not a person, but I know every ZYLO guide.","Good question! I'm a small helper that matches what you type to the right ZYLO guide. For open-ended chat you'd want a full AI, and for human help the Discord is best."],h:1},
   {id:'can',k:['what can you do','what do you do','can you help','commands','what can i ask','how do you work','options'],r:["I can point you to the right guide for FPS, input delay, ping, low-end PCs, AMD, Intel and Nvidia, explain what's safe, and send you to the dashboard. Just describe your problem in a few words.","Try things like \"my game stutters\", \"best settings for Nvidia\", \"how do I lower ping\" or \"is this safe?\". I'll open the matching guide for you."]},
   {id:'joke',k:['joke','funny','make me laugh','tell me something'],r:["Why did the PC go to therapy? Too many tabs open. 🙃","My FPS and my sleep schedule have one thing in common: both drop at night.","Why was the GPU calm? It had plenty of cool-down time."]},
   {id:'nice',k:['good bot','awesome','great job','love it','amazing','nice one','well done','you rock'],r:["Thank you! That means a lot. 😊","Glad it's helping! Anything else you want to tune?","Appreciate it! Tell me what to look at next."]},
   {id:'rude',k:['stupid','dumb','useless','trash','bad bot','you suck','terrible','garbage'],r:["Fair, I'm a simple helper and I do miss things. Tell me your PC or problem in a few words and I'll try again, or ask a human on Discord."],h:1},
   {id:'low',k:['low end','low-end','potato','weak pc','slow pc','old pc','4gb','8gb','integrated','laptop','bad pc','cheap pc','crappy'],r:["For a weaker PC, start with the Low-End preset. If it still struggles, Potato Graphics Pro goes further.","Older or weaker hardware? Begin with the Low-End preset, then try Potato Graphics Pro if you need more."],g:['low-end','potato-pro','pc-checks'],more:"Low-end PCs gain most from lower 3D resolution, shorter view distance and shadows off. PC Checks shows what is actually holding yours back."},
   {id:'amd',k:['amd','ryzen','radeon','rx 580','rx 6'],r:["AMD hardware? The AMD guide is built for you, and Game Processor pairs well with it.","For Ryzen and Radeon setups, start with the AMD guide, then add Game Processor."],g:['amd','game-processor']},
   {id:'intel',k:['intel','i3','i5','i7','i9','core i','uhd graphics'],r:["For Intel CPUs, start with the Intel guide and add Game Processor.","Intel setup: the Intel guide first, then Game Processor for CPU scheduling."],g:['intel','game-processor']},
   {id:'nv',k:['nvidia','geforce','rtx','gtx','nvidia control panel'],r:["For GeForce cards, try the Nvidia Pack and the Game User Settings guide.","Nvidia GPU: start with the Nvidia Pack, then check Game User Settings."],g:['nvidia','game-settings']},
   {id:'delay',k:['input delay','delay','latency','responsive','input lag','mouse lag','slow response','feels slow','reaction'],r:["For the lowest input delay, the 0 Delay guide is the one. Game Processor helps too.","Feels delayed? Start with the 0 Delay guide, then Game Processor."],g:['zero-delay','game-processor'],more:"Input delay comes from the whole chain: mouse, game, GPU queue and monitor. Fewer background tasks and a high-performance power plan both help."},
   {id:'ping',k:['ping','network','wifi','wi-fi','packet','jitter','internet','connection','disconnect','rubberband','lagging','laggy','high ms'],r:["For ping and connection issues, use the Network guide. A wired cable helps a lot too.","High ping or jitter? The Network guide covers it. If you're on Wi-Fi, switching to Ethernet is the biggest win."],g:['network'],more:"Tweaks can't fix a slow connection, but they can clear stale lookups and stop other apps eating bandwidth. Close streams and downloads while you play."},
   {id:'stretch',k:['stretch','4:3','aspect','resolution','black bars'],r:["The Stretched Resolution guide walks you through setting it up.","Want stretched res? That guide covers it step by step."],g:['stretched-res']},
   {id:'stutter',k:['stutter','stuttering','freeze','freezing','hitch','hitching','micro stutter','crash','crashing','frame drops','fps drops','spikes'],r:["Stutters usually come from background load, a throttling CPU or the wrong GPU being used. Run PC Checks first, then Basic Tweaks.","For stutters and freezes, PC Checks will point at the cause. After that, Basic Tweaks and Game Processor usually help."],g:['pc-checks','basic','game-processor'],more:"If it crashes or freezes a lot, also update your graphics driver and check your temperatures. Overheating makes both worse."},
   {id:'fps',k:['fps','frames','boost','performance','faster','more fps','low fps','smoother'],r:["For more FPS, run PC Checks first to see what's slowing you down, then Basic Tweaks. Pro Tweaks is the next step up.","Want more FPS? PC Checks, then Basic Tweaks, then Pro Tweaks if you need more."],g:['pc-checks','basic','pro'],d:1,more:"Results depend on your hardware, so no guaranteed numbers. Test before and after in the same match type."},
   {id:'expect',k:['how much fps','how many fps','guarantee','will it work','does it work','really work','legit'],r:["Honest answer: it depends on your hardware, so I can't promise numbers. Weaker PCs usually gain more. Test before and after.","No guaranteed FPS here. The guides remove common bottlenecks, and how much that helps depends on your PC."]},
   {id:'ram',k:['ram','memory','8gb ram','16gb','out of memory'],r:["Low on RAM? Close browsers and launchers before playing, and run PC Checks to see what's using memory.","For memory pressure, close background apps and try the Low-End preset. PC Checks shows what's eating RAM."],g:['pc-checks','low-end']},
   {id:'cpu',k:['cpu','processor','cpu usage','100% cpu','bottleneck'],r:["CPU holding you back? Game Processor tunes how Windows schedules the game, and PC Checks shows if the CPU is the bottleneck.","For CPU issues, start with Game Processor and run PC Checks to confirm the bottleneck."],g:['game-processor','pc-checks']},
   {id:'driver',k:['driver','drivers','update gpu','graphics card','gpu'],r:["Keep your graphics driver current from the official Nvidia, AMD or Intel site. Then the guide for your card (Nvidia Pack, AMD or Intel) will make more sense.","Update your GPU driver from the maker's site first, then pick your card's guide."],g:['nvidia','amd','intel']},
   {id:'temp',k:['temperature','temps','overheat','overheating','too hot','fan','thermal','throttle'],r:["Overheating isn't something a tweak fixes. Clean dust from fans, improve airflow and check temps with a monitoring tool. A hot CPU or GPU throttles and drops FPS.","If your PC runs hot it will throttle. Clean the fans and vents first, then re-test."],g:['pc-checks']},
   {id:'set',k:['best settings','settings','graphics settings','shadows','textures','view distance','render','dx11','dx12','performance mode'],r:["The Game User Settings guide covers the in-game options that matter most for FPS.","For in-game settings, Game User Settings has the recommended values."],g:['game-settings','low-end']},
   {id:'disp',k:['monitor','refresh rate','144hz','240hz','60hz','display','vsync','fullscreen'],r:["Make sure your monitor is actually running at its full refresh rate: Windows Settings, Display, Advanced display. Then use Fullscreen in-game and keep V-Sync off for the lowest delay.","Check Windows Settings, Display, Advanced display so your refresh rate isn't stuck at 60. The Game User Settings guide covers the in-game side."],g:['game-settings']},
   {id:'aim',k:['aim','mouse','keyboard','sensitivity','dpi','polling'],r:["Tweaks can't change your aim, but lower input delay makes the game feel more responsive. The 0 Delay guide is the one for that.","I can't tune your aim, but I can help the game feel snappier. Try the 0 Delay guide."],g:['zero-delay']},
   {id:'win',k:['windows 11','windows 10','windows update','game mode','game bar','power plan','background apps','startup'],r:["Windows-level tweaks like Game Mode, power plan and capture settings are in the dashboard, or in Basic Tweaks if you prefer a guide.","Game Mode, power plan and Game Bar capture are all handled in the dashboard under Windows."],g:['basic'],d:1},
   {id:'dash',k:['dashboard','apply','optimize','script','bat file','download','connect pc','zylo link','one click','install'],r:["The dashboard has a Fortnite preset and switches for each tweak. You can download a script to run yourself, or connect ZYLO Link to apply tweaks live on your PC.","Open the dashboard, press Optimize on the Fortnite preset, then run the script as administrator. Connect PC lets it apply directly instead."],d:1,more:"Every command is shown before you run it, and there's a Restore script to undo everything."},
   {id:'all',k:['everything','all of it','full optimization','extreme','maximum','max out'],r:["For everything in one pass, use Full Optimization. Extreme Tweaks squeezes out the last bit.","Want it all? Full Optimization, then Extreme Tweaks if you're comfortable going further."],g:['full-optimization','extreme']},
   {id:'start',k:['start','begin','beginner','new here','where do i','not sure','unsure','dont know','confused'],r:["Start with PC Checks to see what's slowing your PC, then Basic Tweaks.","New here? PC Checks first, then Basic Tweaks. Ask me if you get stuck."],g:['pc-checks','basic']},
   {id:'safe',k:['safe','cheat','ban','virus','anticheat','anti-cheat','malware','trust','scam'],r:["Everything here is a normal Windows or in-game setting. No cheats, no macros, no DLL injection, nothing that touches anti-cheat. Back your settings up first.","Totally fair to ask. These are standard settings you could change by hand, and there's nothing that touches anti-cheat. Read any script before running it, and use the Restore option if you want to undo."]},
   {id:'undo',k:['undo','revert','restore','backup','back up','reset','go back'],r:["Everything can be undone. Settings are backed up first, and the Restore script (or Restore buttons) puts them back.","You can always roll back: use the Restore script in the dashboard, or flip the setting back by hand."],d:1},
   {id:'price',k:['price','free','cost','pay','premium','pro plan','buy','subscription','money'],r:["Everything on ZYLO TWEAKS is free. There's no paid tier right now.","It's all free: guides, dashboard and scripts."]},
   {id:'upd',k:['update','updates','new guide','patch','changelog','whats new'],r:["Check the Updates section on the home page for new guides and fixes. The Discord also announces them first.","New guides get posted in the Updates section and on Discord."]},
   {id:'human',k:['discord','contact','email','human','person','support','owner','admin','real person'],r:["You can ask in the Discord, or email zylotweaks5@gmail.com. Both go to a real person."],h:1}
  ];
  var F=["I'm not sure I caught that. Tell me your CPU/GPU, or whether it's FPS, input delay or ping, and I'll point you to a guide.","Hmm, \"{q}\" isn't something I know yet. I'm best at picking the right ZYLO guide: describe your PC or problem in a few words.","That one's outside my guide list. Try something like \"low FPS\", \"high ping\" or \"I have Nvidia\".","Can you rephrase that? Something like \"my game stutters\" or \"best settings for AMD\" works well.","I might be missing what you mean. I know Fortnite performance really well, so ask me about FPS, delay, ping or your hardware.","Not sure about that one! For anything unusual, a person on Discord can help much better than I can."];
  var fab=document.createElement('button');fab.className='zh-fab';fab.type='button';fab.textContent='Ask ZYLO';
  var box=document.createElement('div');box.className='zh';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','ZYLO helper');
  box.innerHTML='<div class="zh-top"><span>ZYLO Helper</span><button type="button" aria-label="Close">✕</button></div><div class="zh-log" aria-live="polite"></div><div class="zh-chips"></div><form class="zh-form"><input type="text" placeholder="Describe your PC or problem…" aria-label="Message"><button>Send</button></form>';
  document.body.appendChild(fab);document.body.appendChild(box);
  var log=box.querySelector('.zh-log'),chips=box.querySelector('.zh-chips'),inp=box.querySelector('input'),started=false;
  function add(t,c){var d=document.createElement('div');d.className='zh-m '+c;d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight}
  function acts(items){if(!items.length)return;var d=document.createElement('div');d.className='zh-acts';items.forEach(function(it){var b=document.createElement('button');b.type='button';b.textContent=it[0];b.onclick=it[1];d.appendChild(b)});log.appendChild(d);log.scrollTop=log.scrollHeight}
  function open(o){box.hidden=!o;fab.hidden=o;if(o){if(!started){started=true;add("Hi! I'm the ZYLO helper. Tell me about your PC or what you want fixed and I'll point you to the right guide.\n\nI'm a simple guide-finder, not a live AI, so for anything unusual ask in the Discord.",'zh-b')}inp.focus()}}
  function guide(id){box.hidden=true;fab.hidden=false;if(window.zyloOpenTweak)window.zyloOpenTweak(id)}
  var lastI=null,fb=0,used={};
  function pick(key,arr){if(arr.length===1)return arr[0];var u=used[key],i;do{i=Math.floor(Math.random()*arr.length)}while(i===u);used[key]=i;return arr[i]}
  function lev(a,b){var m=[],i,j;for(i=0;i<=a.length;i++)m[i]=[i];for(j=1;j<=b.length;j++)m[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]}
  function swap(a,b){if(a.length!==b.length)return false;for(var i=0;i<a.length-1;i++)if(a[i]!==b[i]){return a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2)}return false}
  function score(s,toks,it){var sc=0;it.k.forEach(function(k){
    var h=false;
    if(k.indexOf(' ')>-1||k.indexOf('-')>-1||k.indexOf(':')>-1)h=s.indexOf(k)>-1;
    else if(k.length<=3)h=toks.indexOf(k)>-1;
    else{h=s.indexOf(' '+k)>-1;if(!h&&k.length>=4)for(var i=0;i<toks.length;i++){var t=toks[i];if(t.length>=4&&Math.abs(t.length-k.length)<=1&&(lev(t,k)<=1||swap(t,k))){h=true;break}}}
    if(h)sc+=k.length});return sc}
  function reply(t){
    var s=' '+t.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9:\- ]/g,' ').replace(/\s+/g,' ').trim()+' ',toks=s.trim().split(' ');
    if(lastI&&lastI.more&&toks.length<=4&&/(^| )(more|why|explain|details?|elaborate|how come|tell me more)( |$)/.test(s)){add(lastI.more,'zh-b');return}
    var best=null,bs=0,second=null,ss=0;I.forEach(function(it){var sc=score(s,toks,it);if(sc>bs){second=best;ss=bs;bs=sc;best=it}else if(sc>ss){ss=sc;second=it}});
    if(!best){
      fb++;var q=t.length>36?t.slice(0,36)+'…':t;
      add(pick('fb',F).replace('{q}',q),'zh-b');
      if(fb>=2)acts([DISC,MAIL]);
      return}
    fb=0;lastI=best;
    add(pick(best.id,best.r),'zh-b');
    var ids=(best.g||[]).slice();if(second&&ss>=3&&second.g)second.g.forEach(function(id){if(ids.indexOf(id)<0&&ids.length<4)ids.push(id)});
    var a=ids.map(function(id){return ['Open: '+N[id],function(){guide(id)}]});
    if(best.d)a.push(DASH);if(best.h)a.push(DISC,MAIL);
    acts(a);
  }
  function send(t){t=t.trim();if(!t)return;add(t,'zh-u');reply(t)}
  ['My PC is low-end','I have AMD','I have Nvidia','Lower input delay','Fix my ping','Is it safe?','What can you do?'].forEach(function(c){var b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=function(){send(c)};chips.appendChild(b)});
  fab.onclick=function(){open(true)};box.querySelector('.zh-top button').onclick=function(){open(false)};
  box.querySelector('form').addEventListener('submit',function(e){e.preventDefault();send(inp.value);inp.value=''});
  document.addEventListener('click',function(e){var t=e.target.closest('[data-zh-open]');if(t){e.preventDefault();if(mg)mega(false);open(true)}});
})();
