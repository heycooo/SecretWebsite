/* ============================================
   preview.js
   Handler KHUSUS untuk fitur Preview Mode.
   Sengaja dipisah dari script.js utama.
   Satu-satunya "jembatan" ke script.js adalah
   fungsi window.openPreviewMode(name, message)
   yang dipanggil dari script.js setelah pesan
   berhasil terkirim. Selain itu, modul ini
   berdiri sendiri.
   ============================================ */

const screenMainEl = document.getElementById('screen-main');
const screenPreviewEl = document.getElementById('screen-preview');
const paperWrapper = document.getElementById('paperWrapper');
const paperMessageText = document.getElementById('paperMessageText');
const paperFromName = document.getElementById('paperFromName');
const readableText = document.getElementById('readableText');
const previewBackBtn = document.getElementById('previewBackBtn');

const TRANSITION_DURATION = 450; // harus sama dengan transition di CSS

function fadeSwitch(fromEl, toEl) {
  fromEl.classList.add('fading');
  setTimeout(() => {
    fromEl.classList.remove('active');
    fromEl.classList.remove('fading');
    toEl.classList.add('active');
  }, TRANSITION_DURATION);
}

// ===== Entry point publik, dipanggil dari script.js =====
window.openPreviewMode = function (name, message) {
  paperMessageText.textContent = message;
  paperFromName.textContent = name;
  readableText.textContent = message;
  resetTilt();

  fadeSwitch(screenMainEl, screenPreviewEl);
};

// ===== Tombol kembali dari preview ke main content =====
previewBackBtn.addEventListener('click', () => {
  fadeSwitch(screenPreviewEl, screenMainEl);
});

// ===== Interaksi drag-tilt 3D pada kertas =====
let isDragging = false;

function handleTilt(clientX, clientY) {
  const rect = paperWrapper.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const maxTilt = 25; // derajat maksimum
  const rotateY = ((clientX - centerX) / (rect.width / 2)) * maxTilt;
  const rotateX = -((clientY - centerY) / (rect.height / 2)) * maxTilt;

  paperWrapper.style.transform =
    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt() {
  paperWrapper.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
}

// Mouse (desktop)
paperWrapper.addEventListener('mousedown', () => { isDragging = true; });
window.addEventListener('mouseup', () => {
  isDragging = false;
  resetTilt();
});
window.addEventListener('mousemove', (e) => {
  if (isDragging) handleTilt(e.clientX, e.clientY);
});

// Touch (mobile)
paperWrapper.addEventListener('touchstart', () => { isDragging = true; });
window.addEventListener('touchend', () => {
  isDragging = false;
  resetTilt();
});
window.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches[0]) {
    handleTilt(e.touches[0].clientX, e.touches[0].clientY);
  }
});