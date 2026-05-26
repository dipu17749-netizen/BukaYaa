/* ═══════════════════════════════════════════════════════
   script.js — Birthday Surprise Website
   ═══════════════════════════════════════════════════════

   ⚙️  KONFIGURASI — Sesuaikan bagian ini:
   ═══════════════════════════════════════════════════════ */
const CONFIG = {
  name: "Sayang",       // ← Ganti dengan nama pacar kamu
  birthDate: "2008-05-27",   // ← Ganti tanggal lahir (YYYY-MM-DD)
  currentAge: 18,             // ← Ganti dengan usia saat ini

  // Statistik hubungan kustom (Tahun Penuh Cinta, Bulan Bersama, Hari Indah)
  // Biarkan kosong "" jika ingin dihitung otomatis berdasarkan birthDate
  tahunPenuhCinta: "1,5",     // ← Ganti dengan nilai kustom (misal: "1,5")
  bulanBersama: 17,           // ← Ganti dengan nilai kustom (misal: 17)
  hariIndah: 521,             // ← Ganti dengan nilai kustom (misal: 521)
  fotoKamu: " pacar.jpg ", // ← Ganti dengan path gambar kamu
  fotoCaption: "Sayangku yang cantik 💕",
};

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
window.addEventListener("load", () => {
  // Terapkan nama ke elemen
  document.getElementById("heroName").textContent = CONFIG.name + " 💕";
  document.getElementById("letterName").textContent = CONFIG.name;
  document.getElementById("ageDisplay").textContent = CONFIG.currentAge;

  // Tanggal surat
  const opts = { day: "numeric", month: "long", year: "numeric" };
  document.getElementById("letterDateTxt").textContent =
    new Date().toLocaleDateString("id-ID", opts);

  // Loading screen hilang setelah 2 detik
  setTimeout(() => {
    document.getElementById("loading-screen").classList.add("gone");
    afterLoad();
  }, 2200);

  // Coba putar musik secara otomatis pada interaksi pertama pengguna yang valid (klik, sentuh, tombol)
  const autoPlayHandler = () => {
    playMusic();
    ["click", "touchstart", "keydown"].forEach(evt => {
      document.removeEventListener(evt, autoPlayHandler);
    });
  };
  ["click", "touchstart", "keydown"].forEach(evt => {
    document.addEventListener(evt, autoPlayHandler);
  });

  // Cadangan: Coba jalankan secara langsung jika browser mengizinkan
  playMusic();
  setTimeout(playMusic, 1000);
});

function afterLoad() {
  spawnFloatingElements();
  initConfetti();
  initCountdown();
  initBirthdayStats();
  initScrollReveal();
  initNavDots();
  startQuoteCarousel();
  showPage(0); // Mulai dari slide pertama (index 0)
}

/* ═══════════════════════════════════════════════════════
   SLIDESHOW SYSTEM LOGIC
═══════════════════════════════════════════════════════ */
let currentPageIndex = 0;
let sectionsList = [];

function showPage(index) {
  if (sectionsList.length === 0) {
    sectionsList = Array.from(document.querySelectorAll("section.section"));
  }

  if (index < 0 || index >= sectionsList.length) return;

  // Update active section
  sectionsList.forEach((sec, idx) => {
    if (idx === index) {
      sec.classList.add("active");

      // Paksa semua animasi masuk (reveal) berjalan pada slide yang sedang aktif
      const reveals = sec.querySelectorAll(".reveal");
      reveals.forEach(el => el.classList.add("visible"));
    } else {
      sec.classList.remove("active");
    }
  });

  // Update nav dots
  const dots = document.querySelectorAll(".nav-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });

  currentPageIndex = index;
}

function nextPage() {
  showPage(currentPageIndex + 1);
}

function prevPage() {
  showPage(currentPageIndex - 1);
}

/* ═══════════════════════════════════════════════════════
   FLOATING HEARTS & STARS (Hero)
═══════════════════════════════════════════════════════ */
function spawnFloatingElements() {
  const hearts = ["💕", "💖", "💗", "💓", "❤️", "🌹", "💘"];
  const stars = ["⭐", "✨", "🌟", "💫", "⚡"];

  const hw = document.getElementById("heartsWrap");
  const sw = document.getElementById("starsWrap");

  for (let i = 0; i < 14; i++) {
    const el = document.createElement("div");
    el.classList.add("flt-heart");
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      font-size:${0.8 + Math.random() * 1.2}rem;
      animation-delay:${Math.random() * 5}s;
      animation-duration:${3 + Math.random() * 4}s;
    `;
    hw.appendChild(el);
  }

  for (let i = 0; i < 16; i++) {
    const el = document.createElement("div");
    el.classList.add("flt-star");
    el.textContent = stars[Math.floor(Math.random() * stars.length)];
    el.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      font-size:${0.6 + Math.random() * 0.9}rem;
      animation-delay:${Math.random() * 6}s;
      animation-duration:${4 + Math.random() * 4}s;
    `;
    sw.appendChild(el);
  }
}

/* ═══════════════════════════════════════════════════════
   CONFETTI CANVAS
═══════════════════════════════════════════════════════ */
function initConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const COLORS = [
    "#FF6B9D", "#FFB3C9", "#C9748A",
    "#D4A853", "#F0CC87", "#FF1493",
    "#FFD6E0", "#E8B4BE", "#ffffff"
  ];

  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: 7 + Math.random() * 8,
    h: 4 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 1 + Math.random() * 2.5,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.18,
    alpha: 0.55 + Math.random() * 0.45,
  }));

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y += p.speed;
      p.angle += p.spin;
      p.x += Math.sin(p.angle * 2.5) * 0.6;

      if (p.y > canvas.height) {
        p.y = -p.h;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(loop);
  })();
}

/* ═══════════════════════════════════════════════════════
   COUNTDOWN TIMER
═══════════════════════════════════════════════════════ */
function initCountdown() {
  const checkEl = document.getElementById("timerDays");
  if (!checkEl) {
    console.warn("Countdown timer elements not found in HTML. Skipping countdown initialization.");
    return;
  }

  function tick() {
    const now = new Date();
    const birth = new Date(CONFIG.birthDate);
    const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (next <= now) next.setFullYear(now.getFullYear() + 1);

    const isToday =
      now.getMonth() === birth.getMonth() &&
      now.getDate() === birth.getDate();

    if (isToday) {
      ["Days", "Hours", "Minutes", "Seconds"].forEach(k =>
        (document.getElementById("timer" + k).textContent = "00")
      );
      document.getElementById("nextBdayLbl").textContent =
        "🎉 Hari ini adalah harimu! Selamat Ulang Tahun! 🎉";
      return;
    }

    const diff = next - now;
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);

    document.getElementById("timerDays").textContent = pad(d);
    document.getElementById("timerHours").textContent = pad(h);
    document.getElementById("timerMinutes").textContent = pad(m);
    document.getElementById("timerSeconds").textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

function pad(n) { return String(n).padStart(2, "0"); }

/* ═══════════════════════════════════════════════════════
   BIRTHDAY STATS (animated count-up)
═══════════════════════════════════════════════════════ */
function initBirthdayStats() {
  const birth = new Date(CONFIG.birthDate);
  const now = new Date();

  // Gunakan nilai kustom dari CONFIG jika diisi, jika tidak hitung otomatis
  const years = CONFIG.tahunPenuhCinta !== undefined && CONFIG.tahunPenuhCinta !== ""
    ? CONFIG.tahunPenuhCinta
    : CONFIG.currentAge;

  let months;
  if (CONFIG.bulanBersama !== undefined && CONFIG.bulanBersama !== "") {
    months = CONFIG.bulanBersama;
  } else {
    months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (now.getDate() < birth.getDate()) months--;
  }

  let days;
  if (CONFIG.hariIndah !== undefined && CONFIG.hariIndah !== "") {
    days = CONFIG.hariIndah;
  } else {
    days = Math.floor((now - birth) / 864e5);
  }

  // Trigger count-up once the section is visible
  const statsSection = document.getElementById("countdown");
  const counted = { done: false };

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted.done) {
      counted.done = true;

      // Jika statistik bernilai angka, jalankan animasi countUp. 
      // Jika berupa string (seperti "1,5"), tampilkan langsung secara instan.
      if (typeof years === "number") {
        countUp("yearsCount", years);
      } else {
        document.getElementById("yearsCount").textContent = years;
      }

      if (typeof months === "number") {
        countUp("monthsCount", months);
      } else {
        document.getElementById("monthsCount").textContent = months;
      }

      if (typeof days === "number") {
        countUp("daysCount", days);
      } else {
        document.getElementById("daysCount").textContent = days;
      }
    }
  }, { threshold: 0.3 });
  obs.observe(statsSection);
}

function countUp(id, target, dur = 1800) {
  const el = document.getElementById(id);
  const start = performance.now();
  (function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString("id-ID");
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger delay for sibling cards
        const siblings = [...e.target.parentElement.querySelectorAll(".reveal")];
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add("visible"), idx * 120);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════════════════
   NAV DOTS — highlight active section
═══════════════════════════════════════════════════════ */
function initNavDots() {
  const dots = document.querySelectorAll(".nav-dot");
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(idx);
    });
  });
}

/* ═══════════════════════════════════════════════════════
   BIRTHDAY CAKE — Blow Candles
═══════════════════════════════════════════════════════ */
let blown = false;

function blowCandles() {
  if (blown) return;
  blown = true;

  const candles = document.querySelectorAll(".candle");
  candles.forEach((c, i) => {
    setTimeout(() => c.classList.add("blown"), i * 180);
  });

  setTimeout(() => {
    // Show sparkle overlay
    const overlay = document.getElementById("sparkleOverlay");
    overlay.style.display = "block";

    // Show wish box, hide blow button
    document.getElementById("wishBox").style.display = "block";
    document.getElementById("blowBtn").style.display = "none";

    // Burst confetti
    burstParticles();
  }, candles.length * 180 + 350);
}

function relightCandles() {
  document.querySelectorAll(".candle").forEach(c => c.classList.remove("blown"));
  blown = false;
  document.getElementById("sparkleOverlay").style.display = "none";
  document.getElementById("wishBox").style.display = "none";
  document.getElementById("blowBtn").style.display = "inline-flex";
}

function burstParticles() {
  const emojis = ["🎊", "🎉", "✨", "💕", "🌟", "💖", "🎈", "⭐", "💫"];
  const section = document.getElementById("cake");

  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const tx = (Math.random() - 0.5) * 380;
    const ty = (Math.random() - 0.5) * 340;
    p.style.cssText = `
      position:absolute;
      top:50%; left:50%;
      font-size:${1.2 + Math.random() * 0.8}rem;
      pointer-events:none; z-index:200;
      --tx:${tx}px; --ty:${ty}px;
      animation:burstPop 1.4s ease forwards;
      animation-delay:${Math.random() * 0.3}s;
    `;
    section.appendChild(p);
    setTimeout(() => p.remove(), 1800);
  }
}

/* ═══════════════════════════════════════════════════════
   ENVELOPE / LOVE LETTER
═══════════════════════════════════════════════════════ */
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const env = document.getElementById("envelope");
  const letter = document.getElementById("letterPaper");

  env.classList.add("open");
  setTimeout(() => {
    env.style.display = "none";
    letter.style.display = "block";
  }, 750);
}

/* ═══════════════════════════════════════════════════════
   QUOTES CAROUSEL
═══════════════════════════════════════════════════════ */
const QUOTES = [
  "Mencintaimu adalah keputusan terbaik yang pernah aku buat.",
  "Bersamamu, setiap hari terasa seperti hari yang paling indah di hidupku.",
  "Di mataku, kamu adalah segalanya — matahari di setiap hariku yang gelap.",
  "Cintaku padamu tidak butuh alasan, karena kamu sendiri sudah menjadi alasannya.",
  "Semoga usiamu bertambah, tapi cintaku padamu akan selalu bertambah lebih banyak.",
];

let currentQ = 0;
let qInterval = null;

function startQuoteCarousel() {
  qInterval = setInterval(() => nextQuote(true), 5000);
}

function showQuote(idx, auto = false) {
  if (!auto) { clearInterval(qInterval); qInterval = setInterval(() => nextQuote(true), 5000); }

  const txt = document.getElementById("quoteTxt");
  const dots = document.querySelectorAll(".qdot");

  txt.style.opacity = "0";
  setTimeout(() => {
    txt.textContent = QUOTES[idx];
    txt.style.opacity = "1";
    txt.style.transition = "opacity .45s ease";
  }, 220);

  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  currentQ = idx;
}

function nextQuote(auto = false) {
  showQuote((currentQ + 1) % QUOTES.length, auto);
}

function prevQuote() {
  showQuote((currentQ - 1 + QUOTES.length) % QUOTES.length);
}

function goToQuote(idx) {
  showQuote(idx);
}

/* ═══════════════════════════════════════════════════════
   MUSIC PLAYER
═══════════════════════════════════════════════════════ */
let musicOn = false;
const audio = document.getElementById("bgMusic");

function playMusic() {
  if (musicOn) return;

  audio.play()
    .then(() => {
      musicOn = true;
      const waves = document.getElementById("musicWaves");
      const iconPlay = document.getElementById("musicIconPlay");
      const iconPause = document.getElementById("musicIconPause");
      if (waves && iconPlay && iconPause) {
        waves.classList.remove("paused");
        iconPlay.classList.add("hidden");
        iconPause.classList.remove("hidden");
      }
    })
    .catch((err) => {
      console.log("Autoplay musik terhambat kebijakan browser. Menunggu interaksi pertama user.");
    });
}

function toggleMusic() {
  const waves = document.getElementById("musicWaves");
  const iconPlay = document.getElementById("musicIconPlay");
  const iconPause = document.getElementById("musicIconPause");

  if (musicOn) {
    audio.pause();
    musicOn = false;
    if (waves && iconPlay && iconPause) {
      waves.classList.add("paused");
      iconPlay.classList.remove("hidden");
      iconPause.classList.add("hidden");
    }
  } else {
    audio.play()
      .then(() => {
        musicOn = true;
        if (waves && iconPlay && iconPause) {
          waves.classList.remove("paused");
          iconPlay.classList.add("hidden");
          iconPause.classList.remove("hidden");
        }
      })
      .catch((err) => {
        console.log("Gagal memutar audio:", err);
      });
  }
}
