(() => {
  const welcome = document.getElementById('welcome');
  const enter = document.getElementById('enterBtn');
  const play = document.getElementById('playBtn');
  const music = document.querySelector('.music-card');
  const equalizer = document.getElementById('equalizer');
  const toast = document.getElementById('toast');
  document.getElementById('year').textContent = new Date().getFullYear();

  enter.addEventListener('click', () => {
    welcome.classList.add('hide');
    document.body.classList.add('entered');
  });

  let playing = true;
  play.addEventListener('click', () => {
    playing = !playing;
    music.classList.toggle('paused', !playing);
    play.textContent = playing ? 'Ⅱ' : '▶';
    play.setAttribute('aria-label', playing ? 'Pause visualizer' : 'Play visualizer');
    play.setAttribute('aria-pressed', String(playing));
    equalizer.setAttribute('aria-label', playing ? 'Visualizer playing' : 'Visualizer paused');
  });

  let toastTimer;
  document.querySelector('.discord-card').addEventListener('contextmenu', e => e.preventDefault());
  document.querySelector('.discord-card').addEventListener('click', async e => {
    // The Discord profile link remains usable; clicking the handle area copies the ID.
    if (e.target.closest('b')) {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText('scaredbunnyy');
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 1900);
      } catch (_) {
        toast.textContent = 'Discord: scaredbunnyy';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1900);
      }
    }
  });

  // Lightweight sparkle particles, with a reduced-motion and mobile-friendly count.
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [], width = 0, height = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = reduced ? 0 : (width < 600 ? 24 : 48);
    particles = Array.from({length: count}, () => ({
      x: Math.random()*width, y: Math.random()*height,
      r: Math.random()*1.8+.5, speed: Math.random()*.35+.12,
      alpha: Math.random()*.55+.2, phase: Math.random()*6.28
    }));
  }
  function draw(t) {
    ctx.clearRect(0,0,width,height);
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -5) { p.y = height+5; p.x = Math.random()*width; }
      const a = p.alpha * (.65 + .35*Math.sin(t/900+p.phase));
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,174,218,${a})`; ctx.fill();
      if (p.r > 1.7) {
        ctx.fillRect(p.x-3,p.y-.4,6,.8); ctx.fillRect(p.x-.4,p.y-3,.8,6);
      }
    });
    if (!reduced) requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();
  if (!reduced) requestAnimationFrame(draw);

  // Small pointer sparkle on desktop only.
  if (window.matchMedia('(pointer:fine)').matches && !reduced) {
    let last = 0;
    window.addEventListener('pointermove', e => {
      const now = performance.now();
      if (now-last < 90) return;
      last = now;
      const s = document.createElement('span');
      s.textContent = Math.random() > .5 ? '✧' : '·';
      s.className = 'pointer-sparkle';
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:10;pointer-events:none;color:#ffacd7;text-shadow:0 0 9px #ff7abc;font-size:${10+Math.random()*8}px;transition:all .65s ease;`;
      document.body.appendChild(s);
      requestAnimationFrame(() => { s.style.transform = `translate(${Math.random()*16-8}px,-18px) scale(.2)`; s.style.opacity = '0'; });
      setTimeout(() => s.remove(), 700);
    }, {passive:true});
  }
})();
