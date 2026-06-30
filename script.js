/* ============================================================
   LOVE LETTER SURPRISE — script.js
   Edit LETTER_TEXT, ANNIVERSARY_DATE_DEFAULT and SURPRISE_MESSAGES
   below to customize. See README.md for full guide.
============================================================ */

/* ---------- CUSTOMIZE ME ---------- */
const LETTER_TEXT = `My Dearest,

From the moment we met, my world gained a softer light.
Every ordinary day became something worth remembering,
simply because you were in it.

I made this little corner of the internet just for you —
pixels and hearts to say what words alone never quite can.

Thank you for choosing me, again and again.
Here's to every day we still get to write together.

Always yours.`;

const ANNIVERSARY_DATE_DEFAULT = "2024-02-14"; // YYYY-MM-DD, editable in-app too

const SURPRISE_MESSAGES = [
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
/* ---------- END CUSTOMIZE ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHearts();
  initEnvelope();
  initLetterActions();
  initMusic();
  initCountdown();
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
      typeLetter();
    }, 650);
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
    textEl.textContent = LETTER_TEXT;
    return;
  }

  let i = 0;
  const speed = 28; // ms per character

  function step() {
    if (i <= LETTER_TEXT.length) {
      textEl.textContent = LETTER_TEXT.slice(0, i);
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
    let idx;
    do {
      idx = Math.floor(Math.random() * SURPRISE_MESSAGES.length);
    } while (idx === lastIndex && SURPRISE_MESSAGES.length > 1);
    lastIndex = idx;

    surpriseMsgEl.textContent = SURPRISE_MESSAGES[idx];
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
  let playing = false;

  btn.addEventListener('click', async () => {
    try {
      if (!playing) {
        await audio.play();
        playing = true;
        icon.textContent = '🔊';
        btn.setAttribute('aria-label', 'Pause background music');
      } else {
        audio.pause();
        playing = false;
        icon.textContent = '🔇';
        btn.setAttribute('aria-label', 'Play background music');
      }
    } catch (err) {
      // Autoplay restrictions or missing file — fail silently, icon stays muted
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

  const stored = localStorage.getItem('lls-anniversary-date');
  const activeDate = stored || ANNIVERSARY_DATE_DEFAULT;
  dateInput.value = activeDate;

  updateCountdown(activeDate);
  const intervalId = setInterval(() => updateCountdown(dateInput.value || activeDate), 1000);

  saveBtn.addEventListener('click', () => {
    const val = dateInput.value;
    if (!val) return;
    localStorage.setItem('lls-anniversary-date', val);
    updateCountdown(val);
  });

  window.addEventListener('beforeunload', () => clearInterval(intervalId));
}

function updateCountdown(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();

  // Always count to the *next* occurrence of this date (anniversary, recurring yearly)
  let next = new Date(target);
  next.setFullYear(now.getFullYear());
  if (next < now) next.setFullYear(now.getFullYear() + 1);

  const diff = Math.max(0, next - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setText('days', pad(days));
  setText('hours', pad(hours));
  setText('minutes', pad(minutes));
  setText('seconds', pad(seconds));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
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
