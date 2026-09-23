// =========================================================
// ZYLO TWEAKS — site scripts
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile hamburger menu ----
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- FAQ accordion ----
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      faqItems.forEach(function (other) {
        other.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ---- Diagnostic scan panel: count-up animation ----
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scanValues = document.querySelectorAll('.scan-value');

  scanValues.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1100;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  });

  // ---- Demo performance bars: animate fill on scroll into view ----
  var perfBars = document.querySelectorAll('.perf-bar-fill, .perf-ba-after');

  if (perfBars.length) {
    var fillBar = function (el) {
      var pct = el.getAttribute('data-fill');
      if (pct !== null) {
        el.style.width = pct + '%';
      }
    };

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      perfBars.forEach(fillBar);
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fillBar(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      perfBars.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  // ---- Tweak guide modal ----
  var tweakData = {
    'low-end': {
      tag: 'LOW-END',
      title: 'Potato / Low-End Preset',
      html: `
        <p>For 4–8GB RAM, integrated graphics, or older/lower-power CPUs. Takes about 10 minutes, everything below is reversible.</p>
        <h3>In-game settings</h3>
        <p>Fortnite → Settings → Video tab:</p>
        <table>
          <tr><th>Setting</th><th>Change to</th></tr>
          <tr><td>Window Mode</td><td>Fullscreen</td></tr>
          <tr><td>Frame Rate Limit</td><td>Match your monitor</td></tr>
          <tr><td>3D Resolution</td><td>100% (85–90% if still choppy)</td></tr>
          <tr><td>View Distance</td><td>Medium</td></tr>
          <tr><td>Shadows</td><td>Off</td></tr>
          <tr><td>Anti-Aliasing</td><td>Off or Low</td></tr>
          <tr><td>Textures</td><td>Low</td></tr>
          <tr><td>Effects</td><td>Low</td></tr>
          <tr><td>Post Processing</td><td>Low</td></tr>
          <tr><td>VSync</td><td>Off</td></tr>
          <tr><td>Motion Blur</td><td>Off</td></tr>
        </table>
        <h3>Windows settings</h3>
        <ul>
          <li>Settings → Gaming → Game Mode → <strong>On</strong></li>
          <li>Settings → Gaming → Captures → turn off background recording</li>
          <li>Settings → Apps → Startup → disable what you don't need at boot</li>
          <li>Settings → System → Power & Battery → Balanced or High Performance</li>
          <li>Task Manager (Ctrl+Shift+Esc) → close anything hogging RAM you don't need open</li>
        </ul>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'amd': {
      tag: 'AMD',
      title: 'AMD Optimization',
      html: `
        <p>For Ryzen CPUs + Radeon GPUs.</p>
        <h3>Steps</h3>
        <ul>
          <li><strong>Update drivers</strong> — AMD Software (Adrenalin) → Home → check for updates</li>
          <li><strong>Power plan</strong> — Settings → Power & Battery → Best Performance while gaming</li>
          <li><strong>Radeon Chill</strong> → Off (caps FPS to save power)</li>
          <li><strong>Radeon Boost</strong> → Off (can feel inconsistent in competitive play)</li>
          <li><strong>Anti-Lag</strong> → On (genuinely helps reduce input latency)</li>
          <li>If available, use the <strong>AMD Ryzen Balanced/High Performance</strong> Windows power plan instead of the generic one</li>
        </ul>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'intel': {
      tag: 'INTEL',
      title: 'Intel Optimization',
      html: `
        <p>For Intel Core CPUs.</p>
        <h3>Steps</h3>
        <ul>
          <li><strong>Update drivers</strong> — Intel Graphics Command Center or your GPU app → check for updates</li>
          <li><strong>Power plan</strong> — Settings → Power & Battery → Best Performance</li>
          <li>On 12th-gen+ CPUs with P-cores/E-cores, avoid power-saving modes that push work onto slower cores</li>
          <li>If overclocking, make sure <strong>Intel Speed Shift Technology</strong> is enabled in BIOS</li>
        </ul>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'game-processor': {
      tag: 'CPU',
      title: 'Game Processor',
      html: `
        <p>Tells Windows to treat Fortnite as more important than background tasks.</p>
        <h3>Set priority to High</h3>
        <ol>
          <li>Launch Fortnite</li>
          <li>Task Manager (Ctrl+Shift+Esc) → Details tab</li>
          <li>Find <code>FortniteClient-Win64-Shipping.exe</code></li>
          <li>Right-click → Set priority → <strong>High</strong> (not Realtime — that can cause instability)</li>
        </ol>
        <p>This resets every time you restart Fortnite — you'll need to redo it each session unless you use a third-party tool to make it stick.</p>
        <h3>CPU affinity (optional, 6+ cores only)</h3>
        <p>Same right-click menu → "Set affinity" — you can reserve 1–2 cores for background processes, though this makes little difference on most modern CPUs.</p>
      `
    },
    'game-settings': {
      tag: 'SETTINGS',
      title: 'Game User Settings',
      html: `
        <p>A general settings baseline for any hardware tier — not just weak PCs.</p>
        <table>
          <tr><th>Setting</th><th>Recommended</th></tr>
          <tr><td>Frame Rate Limit</td><td>Match your monitor's refresh rate</td></tr>
          <tr><td>V-Sync</td><td>Off (unless you see tearing)</td></tr>
          <tr><td>Motion Blur</td><td>Off</td></tr>
          <tr><td>Anti-Aliasing</td><td>Low or Off</td></tr>
          <tr><td>3D Resolution</td><td>100%</td></tr>
          <tr><td>View Distance</td><td>Medium–Epic (matters for spotting enemies)</td></tr>
        </table>
      `
    },
    'stretched-res': {
      tag: 'DISPLAY',
      title: 'Stretched Resolution',
      html: `
        <p>Changes your aspect ratio so characters appear wider/shorter. Allowed by Epic — a stylistic choice, not a performance boost.</p>
        <h3>Steps</h3>
        <ol>
          <li>Fortnite → Settings → Video → Window Mode → <strong>Windowed Fullscreen</strong></li>
          <li>Resolution → pick a 4:3 option, e.g. 1440×1080 or 1024×768</li>
          <li>In your GPU control panel, set Scaling mode to <strong>Full-screen</strong> with scaling performed by <strong>Display</strong> (not GPU)</li>
          <li>Restart Fortnite for it to fully apply</li>
        </ol>
        <p class="tweak-modal-note">To undo: set Window Mode back to Fullscreen and Resolution back to native.</p>
      `
    },
    'network': {
      tag: 'NET',
      title: 'Network Optimization',
      html: `
        <ul>
          <li><strong>Wired over WiFi</strong> — usually matters more than any software tweak</li>
          <li>Close downloads/streaming apps before playing</li>
          <li>Device Manager → Network adapters → Properties → Power Management → uncheck "Allow the computer to turn off this device to save power"</li>
          <li>Game Mode (Settings → Gaming → Game Mode → On) helps counter background network throttling</li>
          <li>Optional: switch DNS to Cloudflare (1.1.1.1) or Google (8.8.8.8) — won't affect in-game ping, just lookup speed</li>
        </ul>
      `
    },
    'pc-checks': {
      tag: 'DIAGNOSTIC',
      title: 'PC Checks',
      html: `
        <p>Do this one first, before any other tweak.</p>
        <h3>Task Manager pass</h3>
        <ol>
          <li>Ctrl+Shift+Esc → Startup apps tab → disable high-impact items you don't need at boot</li>
          <li>Processes tab → sort by Memory → check for anything unfamiliar using a lot of RAM</li>
        </ol>
        <h3>Storage &amp; updates</h3>
        <ul>
          <li>Settings → System → Storage → keep at least 10–15% free space</li>
          <li>Settings → Windows Update → install pending updates, especially graphics drivers</li>
        </ul>
      `
    },
    'basic': {
      tag: 'BUNDLE',
      title: 'Basic Tweaks',
      html: `
        <p>The starting bundle — quick wins that take about 10 minutes total, safe for any hardware.</p>
        <h3>What's included</h3>
        <ul>
          <li><strong>PC Checks</strong> — trim startup apps, free up storage, update drivers</li>
          <li><strong>Game User Settings baseline</strong> — VSync off, motion blur off, frame rate capped to your monitor</li>
          <li><strong>Game Mode</strong> — Settings → Gaming → Game Mode → On</li>
        </ul>
        <p>This is the same content as the standalone PC Checks and Game User Settings guides, bundled together as one pass for anyone just getting started.</p>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'pro': {
      tag: 'BUNDLE',
      title: 'Pro Tweaks',
      html: `
        <p>Everything in Basic Tweaks, plus the settings that matter once you're past the easy wins.</p>
        <h3>Adds on top of Basic</h3>
        <ul>
          <li><strong>Game Processor priority</strong> — set Fortnite to High priority each session via Task Manager</li>
          <li><strong>Network Optimization</strong> — wired connection, adapter power management, background app closure</li>
          <li><strong>Full in-game video settings pass</strong> — Shadows/Effects/Post Processing to Low, Textures to Low or Medium depending on your GPU memory</li>
          <li><strong>GPU driver check</strong> — Nvidia/AMD/Intel, whichever applies to you (see the matching hardware guide)</li>
        </ul>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'extreme': {
      tag: 'BUNDLE',
      title: 'Extreme Tweaks',
      html: `
        <p>Everything in Pro Tweaks, pushed further — for people who want every bit of overhead gone, even at the cost of visuals.</p>
        <h3>Adds on top of Pro</h3>
        <ul>
          <li><strong>All video settings to lowest</strong> — Resolution Scale down to 85–90% if needed, View Distance to Medium, all quality sliders to minimum</li>
          <li><strong>Power plan</strong> — High Performance / Best Performance, not just Balanced</li>
          <li><strong>Background recording off</strong> — Xbox Game Bar captures disabled entirely</li>
          <li><strong>CPU affinity (6+ core CPUs)</strong> — reserve 1–2 cores for background Windows processes</li>
          <li><strong>DNS switch</strong> — Cloudflare (1.1.1.1) or Google (8.8.8.8) for faster lookups</li>
        </ul>
        <p>This is the most aggressive combination on the site — expect a noticeably plainer-looking game in exchange for less overhead.</p>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'full-optimization': {
      tag: 'BUNDLE',
      title: 'Full Optimization',
      html: `
        <p>Every guide on this site, done in one sitting, in the order that makes sense: Checks → hardware-specific pack → in-game settings → network → priority.</p>
        <h3>The full order</h3>
        <ol>
          <li>PC Checks (always first)</li>
          <li>Your hardware pack — AMD, Intel, or Nvidia, whichever applies</li>
          <li>Game User Settings baseline</li>
          <li>Network Optimization</li>
          <li>Game Processor priority</li>
          <li>Optional: Stretched Resolution, if that's a look you want</li>
        </ol>
        <p>Budget about 30–40 minutes to go through everything properly the first time. After that, most of it is a one-time setup.</p>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'nvidia': {
      tag: 'NVIDIA',
      title: 'Nvidia Pack',
      html: `
        <p>For GeForce GPUs — the Nvidia equivalent of the AMD/Intel packs.</p>
        <h3>Nvidia Control Panel</h3>
        <p>Right-click desktop → NVIDIA Control Panel → Manage 3D Settings → Program Settings → add Fortnite, then set:</p>
        <table>
          <tr><th>Setting</th><th>Change to</th></tr>
          <tr><td>Low Latency Mode</td><td>Ultra</td></tr>
          <tr><td>Power Management Mode</td><td>Prefer Maximum Performance</td></tr>
          <tr><td>Vertical Sync</td><td>Off</td></tr>
          <tr><td>Texture Filtering — Quality</td><td>Performance</td></tr>
          <tr><td>Shader Cache Size</td><td>Unlimited</td></tr>
        </table>
        <h3>Other steps</h3>
        <ul>
          <li>GeForce Experience → Drivers tab → check for updates</li>
          <li>Windows power plan → Best Performance while gaming</li>
        </ul>
        <p class="tweak-modal-note">Results vary by hardware — this reduces overhead, it doesn't guarantee a specific FPS number.</p>
      `
    },
    'zero-delay': {
      tag: 'LATENCY',
      title: '0 Delay — No FPS Drop',
      html: `
        <p>Combines the Network and Game Processor guides specifically to chase input delay, without touching visual quality (so your FPS floor doesn't drop from this alone).</p>
        <h3>Steps</h3>
        <ul>
          <li><strong>Wired connection</strong> — biggest single factor, more than any software setting</li>
          <li><strong>Network adapter power management</strong> — Device Manager → your adapter → Properties → Power Management → uncheck "Allow the computer to turn off this device"</li>
          <li><strong>Fortnite process priority → High</strong> — Task Manager → Details tab → FortniteClient-Win64-Shipping.exe → Set priority → High</li>
          <li><strong>GPU Low Latency Mode → Ultra</strong> (Nvidia) or <strong>Anti-Lag → On</strong> (AMD) — see the matching hardware pack</li>
          <li><strong>VSync off, Frame Rate Limit matched to your monitor</strong> — uncapped or mismatched frame rates can actually add input lag</li>
        </ul>
        <p class="tweak-modal-note">"0 delay" is the goal this bundle aims at, not a literal guarantee — real input delay depends on your full setup, including your monitor and peripherals.</p>
      `
    },
    'potato-pro': {
      tag: 'LOW-END',
      title: 'Potato Graphics Pro',
      html: `
        <p>For PCs where the standard Potato/Low-End preset still isn't enough — the most aggressive visual-quality cuts on the site.</p>
        <h3>Beyond the base Potato preset</h3>
        <ul>
          <li><strong>Resolution Scale</strong> — drop to 75–85% (base preset keeps this at 100%)</li>
          <li><strong>Window Mode</strong> — Windowed Fullscreen instead of exclusive Fullscreen, which can reduce memory overhead on integrated graphics</li>
          <li><strong>Close everything non-essential</strong> before launching — browser, Discord overlay, any second monitor apps</li>
          <li><strong>Disable visual effects in Windows itself</strong> — Settings → System → About → Advanced system settings → Performance → Adjust for best performance</li>
          <li><strong>Consider a lower target frame rate</strong> — capping to 30 or 45 FPS instead of 60 can mean far more consistent frame times on very weak hardware, even though the number is lower</li>
        </ul>
        <p class="tweak-modal-note">This trades a noticeable amount of visual quality for stability — start with the base Potato preset first, and only move to this if that's still not enough.</p>
      `
    }
  };

  var modal = document.getElementById('tweak-modal');
  var modalBody = document.getElementById('tweak-modal-body');

  function openTweakModal(id) {
    var data = tweakData[id];
    if (!data || !modal || !modalBody) return;

    modalBody.innerHTML =
      '<div class="tweak-modal-cover">' +
        '<span class="tweak-box-spine"></span>' +
        '<span class="tweak-box-tag">' + data.tag + '</span>' +
        '<span class="tweak-modal-cover-title">' + data.title + '</span>' +
      '</div>' +
      '<h2 id="tweak-modal-title">' + data.title + '</h2>' +
      data.html;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeTweakModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-tweak]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openTweakModal(btn.getAttribute('data-open-tweak'));
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeTweakModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeTweakModal();
  });

});
