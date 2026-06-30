/* ============================================================
   LOVE LETTER SURPRISE — script.js
   Edit LETTER_TEXT, ANNIVERSARY_DATE_DEFAULT and SURPRISE_MESSAGES
   below to customize. See README.md for full guide.
============================================================ */

/* ---------- DEFAULTS ---------- */
const DEFAULT_LETTER_TEXT = `My Dearest,

From the moment we met, my world gained a softer light.
Every ordinary day became something worth remembering,
simply because you were in it.

I made this little corner of the internet just for you —
pixels and hearts to say what words alone never quite can.

Thank you for choosing me, again and again.
Here's to every day we still get to write together.

Always yours.`;

const DEFAULT_ANNIVERSARY_DATE = "2024-02-14";

const DEFAULT_SURPRISE_MESSAGES = [
  "You are my favorite notification. 💌",
  "If kisses were snowflakes, I'd send you a blizzard. ❄️",
  "My heart does a little pixel-jump every time you smile.",
  "You + me = my favorite equation.",
  "I'd choose you in every timeline.",
  "You're the reason I check my phone so much. 📱",
  "Warning: thinking about you may cause spontaneous smiling.",
  "You're proof that good things do happen.",
  "Home isn't a place, it's wherever you are.",
  "I love you more than pixels love symmetry.",
  "You make ordinary Tuesdays feel like holidays.",
  "Every love song makes a little more sense now.",
  "You're my favorite person to do nothing with.",
  "If I could bottle a feeling, it'd be 'us'.",
  "You're the plot twist I didn't see coming, in the best way.",
  "Loving you is my favorite hobby.",
  "You make my heart lag like a buffering video — in a good way.",
  "Save the date: forever, with you.",
  "You're the reason I believe in soft endings.",
  "P.S. I still get butterflies. Every single time."
];

// App State
let state = {
  letterText: DEFAULT_LETTER_TEXT,
  anniversaryDate: DEFAULT_ANNIVERSARY_DATE,
  surpriseMessages: [...DEFAULT_SURPRISE_MESSAGES],
  musicUrl: "",
  themePreset: "classic"
};

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  initHearts();
  initEnvelope();
  initLetterActions();
  initMusic();
  initCountdown();
  initCustomizer();
  initMouseTrail();
});

/* ============================
   THEME TOGGLE
============================ */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  const saved = localStorage.getItem('lls-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('lls-theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      icon.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      icon.textContent = '🌙';
    }
  }
}

/* ============================
   AMBIENT FLOATING HEARTS
============================ */
function initHearts() {
  const container = document.getElementById('hearts-container');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const emojis = ['❤️', '💗', '💕', '💖'];

  setInterval(() => {
    if (document.hidden) return;
    spawnHeart();
  }, 1400);

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const startX = Math.random() * 100;
    const drift = (Math.random() * 80 - 40) + 'px';
    const duration = 6 + Math.random() * 5;
    heart.style.left = startX + 'vw';
    heart.style.setProperty('--drift', drift);
    heart.style.animationDuration = duration + 's';
    heart.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 200);
  }
}

/* ============================
   SPARKLE BURST (on envelope open)
============================ */
function spawnSparkles(x, y) {
  const container = document.getElementById('hearts-container');
  const symbols = ['✨', '⭐', '💫'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    s.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
    container.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
}

/* ============================
   ENVELOPE OPEN + SCREEN SWITCH
============================ */
function initEnvelope() {
  const envelope = document.getElementById('envelope');
  const landing = document.getElementById('landing');
  const letterScreen = document.getElementById('letter-screen');

  envelope.addEventListener('click', () => {
    if (envelope.classList.contains('opened')) return;
    envelope.classList.add('opened');

    const rect = envelope.getBoundingClientRect();
    spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    launchConfetti();

    setTimeout(() => {
      landing.classList.remove('active');
      letterScreen.classList.add('active');
      letterScreen.style.animation = 'pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1)';
      typeLetter();
    }, 950);
  });
}

/* ============================
   TYPING LETTER EFFECT
============================ */
let typingTimeoutId = null;

function typeLetter() {
  const textEl = document.getElementById('letter-text');
  textEl.textContent = '';
  if (typingTimeoutId) clearTimeout(typingTimeoutId);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    textEl.textContent = state.letterText;
    return;
  }

  let i = 0;
  const speed = 28; // ms per character

  function step() {
    if (i <= state.letterText.length) {
      textEl.textContent = state.letterText.slice(0, i);
      i++;
      typingTimeoutId = setTimeout(step, speed);
    }
  }
  step();
}

/* ============================
   READ AGAIN / SURPRISE ME
============================ */
function initLetterActions() {
  const readAgainBtn = document.getElementById('read-again');
  const surpriseBtn = document.getElementById('surprise-me');
  const surpriseMsgEl = document.getElementById('surprise-message');

  readAgainBtn.addEventListener('click', () => {
    surpriseMsgEl.textContent = '';
    typeLetter();
  });

  let lastIndex = -1;
  surpriseBtn.addEventListener('click', () => {
    if (!state.surpriseMessages || state.surpriseMessages.length === 0) {
      surpriseMsgEl.textContent = "You're amazing! ❤️";
      return;
    }
    let idx;
    do {
      idx = Math.floor(Math.random() * state.surpriseMessages.length);
    } while (idx === lastIndex && state.surpriseMessages.length > 1);
    lastIndex = idx;

    surpriseMsgEl.textContent = state.surpriseMessages[idx];
    surpriseMsgEl.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    surpriseMsgEl.offsetHeight;
    surpriseMsgEl.style.animation = 'pop 0.5s ease';

    const rect = surpriseBtn.getBoundingClientRect();
    spawnSparkles(rect.left + rect.width / 2, rect.top);
  });
}

/* ============================
   BACKGROUND MUSIC
============================ */
function initMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  const visualizer = document.getElementById('music-visualizer');
  let playing = false;

  if (state.musicUrl) {
    audio.src = state.musicUrl;
  }

  btn.addEventListener('click', async () => {
    try {
      if (!playing) {
        await audio.play();
        playing = true;
        icon.textContent = '🔊';
        btn.setAttribute('aria-label', 'Pause background music');
        if (visualizer) visualizer.classList.add('playing');
      } else {
        audio.pause();
        playing = false;
        icon.textContent = '🔇';
        btn.setAttribute('aria-label', 'Play background music');
        if (visualizer) visualizer.classList.remove('playing');
      }
    } catch (err) {
      console.warn('Music could not be played:', err);
    }
  });
}

/* ============================
   ANNIVERSARY COUNTDOWN
============================ */
function initCountdown() {
  const dateInput = document.getElementById('anniversary-date');
  const saveBtn = document.getElementById('save-date');

  dateInput.value = state.anniversaryDate;

  updateCountdown(state.anniversaryDate);
  const intervalId = setInterval(() => {
    updateCountdown(dateInput.value || state.anniversaryDate);
  }, 1000);

  saveBtn.addEventListener('click', () => {
    const val = dateInput.value;
    if (!val) return;
    state.anniversaryDate = val;
    saveStateToStorage(state);
    updateCountdown(val);
  });

  window.addEventListener('beforeunload', () => clearInterval(intervalId));
}

function updateCountdown(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();

  let next = new Date(target);
  next.setFullYear(now.getFullYear());
  if (next < now) next.setFullYear(now.getFullYear() + 1);

  const diff = Math.max(0, next - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setTextWithTick('days', pad(days));
  setTextWithTick('hours', pad(hours));
  setTextWithTick('minutes', pad(minutes));
  setTextWithTick('seconds', pad(seconds));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setTextWithTick(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.textContent !== value) {
    el.textContent = value;
    const box = el.closest('.time-box');
    if (box) {
      box.classList.remove('tick');
      // eslint-disable-next-line no-unused-expressions
      box.offsetHeight;
      box.classList.add('tick');
    }
  }
}
function pad(n) { return String(n).padStart(2, '0'); }

/* ============================
   CONFETTI (lightweight canvas)
============================ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FF6FA5', '#C9B6FF', '#B8F2E6', '#FFB6D9', '#FFD27D'];
  const pieces = [];
  const count = 90;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -10 - 4,
      size: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.25 + Math.random() * 0.15,
      life: 0
    });
  }

  let frame = 0;
  const maxFrames = 130;

  function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ============================================================
   STATE LOAD / SAVE & CUSTOMIZER / PARTICLES
============================================================ */

function loadState() {
  const params = new URLSearchParams(window.location.search);
  const sharedData = params.get('l');
  if (sharedData) {
    try {
      const decoded = decodeURIComponent(escape(atob(sharedData)));
      const data = JSON.parse(decoded);
      
      if (data.t) state.letterText = data.t;
      if (data.d) state.anniversaryDate = data.d;
      if (data.m && Array.isArray(data.m)) state.surpriseMessages = data.m;
      if (data.mu) state.musicUrl = data.mu;
      if (data.theme) state.themePreset = data.theme;
      
      const banner = document.getElementById('share-banner');
      if (banner) banner.style.display = 'flex';
      
      applyPresetTheme(state.themePreset);
      saveStateToStorage(state);
      return;
    } catch (e) {
      console.error("Failed to parse shared letter data:", e);
    }
  }

  const stored = localStorage.getItem('lls-custom-state');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.letterText) state.letterText = data.letterText;
      if (data.anniversaryDate) state.anniversaryDate = data.anniversaryDate;
      if (data.surpriseMessages) state.surpriseMessages = data.surpriseMessages;
      if (data.musicUrl) state.musicUrl = data.musicUrl;
      if (data.themePreset) state.themePreset = data.themePreset;
      
      applyPresetTheme(state.themePreset);
    } catch (e) {
      console.error("Failed to load local state:", e);
    }
  }
}

function saveStateToStorage(customState) {
  localStorage.setItem('lls-custom-state', JSON.stringify(customState));
  localStorage.setItem('lls-anniversary-date', customState.anniversaryDate);
}

function applyPresetTheme(preset) {
  document.body.className = document.body.className.replace(/\bpreset-\S+/g, '');
  if (preset && preset !== 'classic') {
    document.body.classList.add(`preset-${preset}`);
  }
}

function initCustomizer() {
  const toggleBtn = document.getElementById('customizer-toggle');
  const modal = document.getElementById('customizer-modal');
  const closeBtn = document.getElementById('modal-close');
  const saveBtn = document.getElementById('save-customizer');
  const shareBtn = document.getElementById('share-link-btn');
  const resetBtn = document.getElementById('reset-customizer');

  const textInput = document.getElementById('custom-text');
  const dateInput = document.getElementById('custom-anniversary');
  const musicInput = document.getElementById('custom-music-url');
  
  const surpriseList = document.getElementById('surprise-list');
  const addSurpriseInput = document.getElementById('new-surprise-input');
  const addSurpriseBtn = document.getElementById('add-surprise-btn');

  let tempMessages = [...state.surpriseMessages];
  let selectedPreset = state.themePreset;

  function renderSurpriseList() {
    surpriseList.innerHTML = '';
    tempMessages.forEach((msg, idx) => {
      const li = document.createElement('li');
      li.textContent = msg.length > 35 ? msg.substring(0, 32) + '...' : msg;
      
      const delBtn = document.createElement('button');
      delBtn.innerHTML = '&times;';
      delBtn.title = "Delete message";
      delBtn.addEventListener('click', () => {
        tempMessages.splice(idx, 1);
        renderSurpriseList();
      });
      
      li.appendChild(delBtn);
      surpriseList.appendChild(li);
    });
  }

  const presetBtns = document.querySelectorAll('.theme-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPreset = btn.getAttribute('data-preset');
    });
  });

  toggleBtn.addEventListener('click', () => {
    textInput.value = state.letterText;
    dateInput.value = state.anniversaryDate;
    musicInput.value = state.musicUrl;
    tempMessages = [...state.surpriseMessages];
    selectedPreset = state.themePreset;

    presetBtns.forEach(btn => {
      if (btn.getAttribute('data-preset') === selectedPreset) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderSurpriseList();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  addSurpriseBtn.addEventListener('click', () => {
    const text = addSurpriseInput.value.trim();
    if (!text) return;
    tempMessages.push(text);
    addSurpriseInput.value = '';
    renderSurpriseList();
  });

  addSurpriseInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addSurpriseBtn.click();
    }
  });

  saveBtn.addEventListener('click', () => {
    state.letterText = textInput.value;
    state.anniversaryDate = dateInput.value;
    state.musicUrl = musicInput.value;
    state.surpriseMessages = [...tempMessages];
    state.themePreset = selectedPreset;

    saveStateToStorage(state);
    applyPresetTheme(state.themePreset);

    const audio = document.getElementById('bg-music');
    if (audio) {
      const currentSrc = audio.src;
      const targetSrc = state.musicUrl || 'assets/music.mp3';
      if (!currentSrc.endsWith(targetSrc) && !targetSrc.endsWith(currentSrc)) {
        audio.src = targetSrc;
        audio.load();
      }
    }

    const inPageDateInput = document.getElementById('anniversary-date');
    if (inPageDateInput) {
      inPageDateInput.value = state.anniversaryDate;
    }
    updateCountdown(state.anniversaryDate);

    const letterScreen = document.getElementById('letter-screen');
    if (letterScreen.classList.contains('active')) {
      typeLetter();
    }

    closeModal();
    alert("Settings saved successfully! 💖");
  });

  resetBtn.addEventListener('click', () => {
    if (confirm("Reset letter back to default templates?")) {
      state.letterText = DEFAULT_LETTER_TEXT;
      state.anniversaryDate = DEFAULT_ANNIVERSARY_DATE;
      state.surpriseMessages = [...DEFAULT_SURPRISE_MESSAGES];
      state.musicUrl = "";
      state.themePreset = "classic";

      saveStateToStorage(state);
      applyPresetTheme(state.themePreset);

      textInput.value = state.letterText;
      dateInput.value = state.anniversaryDate;
      musicInput.value = state.musicUrl;
      tempMessages = [...state.surpriseMessages];
      selectedPreset = state.themePreset;

      presetBtns.forEach(btn => {
        if (btn.getAttribute('data-preset') === 'classic') btn.classList.add('active');
        else btn.classList.remove('active');
      });

      renderSurpriseList();

      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.src = 'assets/music.mp3';
        audio.load();
      }

      const inPageDateInput = document.getElementById('anniversary-date');
      if (inPageDateInput) inPageDateInput.value = state.anniversaryDate;
      updateCountdown(state.anniversaryDate);

      const banner = document.getElementById('share-banner');
      if (banner) banner.style.display = 'none';

      closeModal();
      alert("Settings reset to default! 💖");
    }
  });

  shareBtn.addEventListener('click', () => {
    const shareData = {
      t: textInput.value,
      d: dateInput.value,
      m: tempMessages,
      mu: musicInput.value,
      theme: selectedPreset
    };

    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
      const shareUrl = `${window.location.origin}${window.location.pathname}?l=${encoded}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Shareable letter link copied to clipboard! Send it to your love! 🔗💖");
      }).catch(err => {
        console.error("Failed to copy link:", err);
        const fallback = prompt("Copy this link to share your letter:", shareUrl);
      });
    } catch (e) {
      console.error("Encoding failed:", e);
      alert("Oops, something went wrong generating the link.");
    }
  });
}

function initMouseTrail() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let lastX = 0;
  let lastY = 0;
  const emojis = ['❤️', '✨', '💖', '⭐', '💕'];
  
  function createParticle(x, y) {
    const p = document.createElement('span');
    p.className = 'cursor-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    const mx = (Math.random() - 0.5) * 60 + 'px';
    const my = (Math.random() - 0.5) * 60 - 45 + 'px';
    const rot = (Math.random() - 0.5) * 180 + 'deg';
    
    p.style.setProperty('--mx', mx);
    p.style.setProperty('--my', my);
    p.style.setProperty('--rot', rot);
    
    document.body.appendChild(p);
    
    setTimeout(() => {
      p.remove();
    }, 800);
  }

  window.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist > 35) {
      createParticle(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const dist = Math.hypot(touch.clientX - lastX, touch.clientY - lastY);
    if (dist > 35) {
      createParticle(touch.clientX, touch.clientY);
      lastX = touch.clientX;
      lastY = touch.clientY;
    }
  }, { passive: true });
}
