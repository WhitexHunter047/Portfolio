(() => {
  /* ============================================================
     BOOT SPLASH — hide after animation
  ============================================================ */
  const boot = document.getElementById('boot');
  if (boot) {
    const hide = () => boot.classList.add('hide');
    setTimeout(hide, 2600);
    const skip = () => { hide(); window.removeEventListener('keydown', skip); boot.removeEventListener('click', skip); };
    boot.addEventListener('click', skip);
    window.addEventListener('keydown', skip, { once: true });
  }

  /* ============================================================
     MATRIX RAIN
  ============================================================ */
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  let w=0, h=0, cols=0, drops=[], active=true, raf=0;
  const chars='01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$+-*/=%#&_();:?!\\|{}<>[]^~';
  function resizeMatrix(){
    const dpr = Math.min(devicePixelRatio||1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    cols = Math.ceil(w/14);
    drops = Array.from({length:cols}, () => Math.random()*-h/14);
  }
  function frame(){
    if (!active) { raf=0; return; }
    ctx.fillStyle='rgba(6,8,6,.035)'; ctx.fillRect(0,0,w,h);
    ctx.font='12px "Fira Code",monospace';
    for (let i=0;i<cols;i++){
      const x=i*14, y=drops[i]*14;
      const bright = Math.random()>.91;
      ctx.fillStyle = bright ? 'rgba(184,255,92,.78)' : 'rgba(72,230,139,.30)';
      ctx.fillText(chars[(Math.random()*chars.length)|0], x, y);
      drops[i]++;
      if (y>h+30 && Math.random()>.965) drops[i]=Math.random()*-35;
    }
    raf = requestAnimationFrame(frame);
  }
  resizeMatrix(); addEventListener('resize', resizeMatrix); frame();

  /* ============================================================
     ANIMATED GRID — reacts to cursor
  ============================================================ */
  const gridCanvas = document.getElementById('gridCanvas');
  const gctx = gridCanvas.getContext('2d');
  let gw=0, gh=0, gm={x:-9999, y:-9999};
  const GRID = 54;
  const INFLUENCE = 180;

  function resizeGrid(){
    const dpr = Math.min(devicePixelRatio||1, 2);
    gw = innerWidth; gh = innerHeight;
    gridCanvas.width = Math.floor(gw*dpr);
    gridCanvas.height = Math.floor(gh*dpr);
    gridCanvas.style.width = gw+'px';
    gridCanvas.style.height = gh+'px';
    gctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function drawGrid(){
    gctx.clearRect(0,0,gw,gh);
    for (let x=0; x<=gw; x+=GRID){
      gctx.beginPath();
      for (let y=0; y<=gh; y+=GRID/2){
        const dx = x - gm.x, dy = y - gm.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const force = Math.max(0, 1 - dist/INFLUENCE);
        const push = force * force * 22;
        const px = x + (dx / (dist||1)) * push;
        if (y===0) gctx.moveTo(px, y); else gctx.lineTo(px, y);
      }
      const dgx = x - gm.x;
      const gf = Math.max(0, 1 - Math.abs(dgx)/INFLUENCE);
      gctx.strokeStyle = `rgba(184,255,92,${0.025 + gf*0.14})`;
      gctx.lineWidth = 1;
      gctx.stroke();
    }
    for (let y=0; y<=gh; y+=GRID){
      gctx.beginPath();
      for (let x=0; x<=gw; x+=GRID/2){
        const dx = x - gm.x, dy = y - gm.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const force = Math.max(0, 1 - dist/INFLUENCE);
        const push = force * force * 22;
        const py = y + (dy / (dist||1)) * push;
        if (x===0) gctx.moveTo(x, py); else gctx.lineTo(x, py);
      }
      const dgy = y - gm.y;
      const gf = Math.max(0, 1 - Math.abs(dgy)/INFLUENCE);
      gctx.strokeStyle = `rgba(184,255,92,${0.025 + gf*0.14})`;
      gctx.lineWidth = 1;
      gctx.stroke();
    }
    requestAnimationFrame(drawGrid);
  }
  resizeGrid(); addEventListener('resize', resizeGrid);
  addEventListener('pointermove', e => { gm.x = e.clientX; gm.y = e.clientY; }, {passive:true});
  addEventListener('pointerleave', () => { gm.x = -9999; gm.y = -9999; });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) drawGrid();

  /* ============================================================
     MATRIX TOGGLE
  ============================================================ */
  const toggle = document.querySelector('.matrix-toggle');
  toggle?.addEventListener('click', () => {
    active = !active;
    if (!active) { ctx.clearRect(0,0,w,h); }
    else if (!raf) frame();
    toggle.querySelector('span').textContent = active ? 'Matrix' : 'Matrix OFF';
  });

  /* ============================================================
     SECTION REVEAL
  ============================================================ */
  const observer = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }), {threshold:.08});
  document.querySelectorAll('.section-reveal').forEach(e => observer.observe(e));

  /* ============================================================
     SCROLL PROGRESS
  ============================================================ */
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.scroll-progress').style.width = (max>0 ? scrollY/max*100 : 0) + '%';
  }, {passive:true});

  /* ============================================================
     SKILL CARD TILT
  ============================================================ */
  document.querySelectorAll('.skill-matrix article').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width - .5;
      const y = (e.clientY - r.top)/r.height - .5;
      card.style.transform = `perspective(700px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  const ham = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  ham?.addEventListener('click', e => {
    e.stopPropagation();
    navLinks.classList.toggle('mobile-open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('mobile-open') && !navLinks.contains(e.target) && e.target !== ham){
      navLinks.classList.remove('mobile-open');
    }
  });

  /* ============================================================
     ACTIVE NAV LINK
  ============================================================ */
  const sections = [...document.querySelectorAll('section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+id));
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(s => navObserver.observe(s));

  /* ============================================================
     COPY EMAIL
  ============================================================ */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const val = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(val);
        const label = btn.querySelector('b');
        const small = btn.querySelector('small');
        const o1 = label.textContent, o2 = small.textContent;
        label.textContent = 'Copied!';
        small.textContent = 'IN CLIPBOARD';
        btn.classList.add('copied');
        setTimeout(() => {
          label.textContent = o1;
          small.textContent = o2;
          btn.classList.remove('copied');
        }, 1800);
      } catch(err) { console.warn('Clipboard failed', err); }
    });
  });

  /* ============================================================
     CV DOWNLOAD WITH PROGRESS BAR
  ============================================================ */
  const cvBtn = document.getElementById('cvBtn');
  cvBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = cvBtn.dataset.cv;
    const bar = cvBtn.querySelector('.cv-progress i');
    const label = cvBtn.querySelector('span');

    cvBtn.classList.add('downloading');
    label.textContent = 'Downloading…';
    bar.style.width = '0%';

    try {
      const res = await fetch(url, {cache:'no-store'});
      if (!res.ok) throw new Error('HTTP '+res.status);
      const total = +res.headers.get('Content-Length') || 0;
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        const pct = total ? (received/total)*100 : Math.min(95, received/1000);
        bar.style.width = pct + '%';
      }

      const blob = new Blob(chunks, {type: res.headers.get('Content-Type') || 'application/pdf'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = url.split('/').pop() || 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);

      bar.style.width = '100%';
      label.textContent = 'Downloaded';
      cvBtn.classList.add('done');
      setTimeout(() => {
        cvBtn.classList.remove('downloading','done');
        label.textContent = 'Download CV';
        bar.style.width = '0%';
      }, 2200);

    } catch (err){
      console.warn('Stream download failed, falling back.', err);
      const a = document.createElement('a');
      a.href = url; a.download = '';
      document.body.appendChild(a); a.click(); a.remove();
      cvBtn.classList.remove('downloading');
      label.textContent = 'Download CV';
      bar.style.width = '0%';
    }
  });

  /* ============================================================
     ICON FALLBACKS
  ============================================================ */
  document.querySelectorAll('.platform-mini img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const fb = img.parentElement.querySelector('.logo-fallback');
      if (fb) fb.style.display = 'grid';
    });
  });

  /* ============================================================
     UI SOUND — soft chill click on buttons / links
     Very short (~120ms), low-pass filtered sine tick.
     No loop, no reverb. Fires on hover + click with a cooldown.
  ============================================================ */
  const soundBtn = document.querySelector('.sound-toggle');
  let audioCtx = null;
  let soundOn = true; // start ON so the effect is felt — user can mute
  let lastPlay = 0;
  const COOLDOWN = 60; // ms — prevent machine-gun on fast pointer moves

  soundBtn?.querySelector('i')?.classList.replace('fa-volume-xmark','fa-volume-high');
  soundBtn?.classList.add('on');

  function ensureCtx(){
    if (!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  /**
   * playTick — a single soft "blip".
   * @param {number} freq  base frequency (default 880)
   * @param {number} dur   duration in seconds (default 0.09)
   * @param {number} vol   peak volume (default 0.06)
   */
  function playTick(freq = 880, dur = 0.09, vol = 0.06){
    if (!soundOn) return;
    const now = performance.now();
    if (now - lastPlay < COOLDOWN) return;
    lastPlay = now;

    const ctx = ensureCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + dur);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1800;
    lp.Q.value = 0.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  // Slightly brighter tick for links, softer for plain buttons
  const hoverSel = 'a, button, .btn, .contact-item, .quick-item, .platform-mini, .nav-links a, .sound-toggle, .matrix-toggle, .hamburger';
  const clickSel = 'a, button, .btn, .contact-item, .quick-item';

  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('pointerenter', () => playTick(920, 0.07, 0.045), {passive:true});
  });
  document.querySelectorAll(clickSel).forEach(el => {
    el.addEventListener('click', () => playTick(660, 0.10, 0.07), {passive:true});
  });

  // Toggle button
  soundBtn?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.classList.toggle('on', soundOn);
    const i = soundBtn.querySelector('i');
    if (i) i.className = soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    // confirmation tick when turning back on
    if (soundOn){
      lastPlay = 0; // bypass cooldown for confirmation
      playTick(880, 0.10, 0.06);
    }
  });
})();
