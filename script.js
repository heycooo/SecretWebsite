// ===== Elemen =====
const screenName = document.getElementById('screen-name');
const screenMain = document.getElementById('screen-main');
const nameInput = document.getElementById('nameInput');
const beginBtn = document.getElementById('beginBtn');
const greeting = document.getElementById('greeting');
const tagButtons = document.querySelectorAll('.tag-btn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('statusText');

let selectedTag = null;
let senderName = 'Seseorang';

// Mencegah karakter HTML dari input nama merusak tampilan/struktur halaman
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== Transisi fade-blur antar layar =====
function switchScreen(fromScreen, toScreen) {
  fromScreen.classList.add('fading');

  setTimeout(() => {
    fromScreen.classList.remove('active');
    fromScreen.classList.remove('fading');

    toScreen.classList.add('active');
  }, 450); // durasi harus sama dengan transition di CSS
}

// ===== Layar 1 -> Layar 2 =====
beginBtn.addEventListener('click', () => {
  const typed = nameInput.value.trim();
  senderName = typed !== '' ? typed : 'Seseorang';

  greeting.innerHTML = `Halo, <span class="accent-text">${escapeHtml(senderName)}</span>!`;

  switchScreen(screenName, screenMain);
});

// ===== Helper untuk update status text =====
function setStatus(text, isError = false) {
  statusText.textContent = text;
  statusText.classList.toggle('error', isError);
}

// ===== Pilih Mood Tag =====
tagButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tagButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTag = btn.dataset.tag;
  });
});

// ===== Kirim Pesan =====
sendBtn.addEventListener('click', async () => {
  const message = messageInput.value.trim();

  if (!selectedTag) {
    setStatus('Pilih kategori pesan dulu ya.', false);
    return;
  }
  if (message === '') {
    setStatus('Pesan tidak boleh kosong.', true);
    return;
  }

  sendBtn.disabled = true;
  setStatus('Mengirim...', false);

  try {
    const response = await fetch('/.netlify/functions/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: senderName,
        tag: selectedTag,
        message: message
      })
    });

    if (response.ok) {
      setStatus('Pesan terkirim!', false);
      messageInput.value = '';
      tagButtons.forEach(b => b.classList.remove('selected'));
      selectedTag = null;
    } else {
      setStatus('Gagal mengirim, coba lagi.', true);
    }
  } catch (err) {
    setStatus('Terjadi kesalahan koneksi.', true);
  }

  sendBtn.disabled = false;
});