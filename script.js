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

  greeting.textContent = `Halo, ${senderName}!`;

  switchScreen(screenName, screenMain);
});

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
    statusText.textContent = 'Pilih kategori pesan dulu ya.';
    return;
  }
  if (message === '') {
    statusText.textContent = 'Pesan tidak boleh kosong.';
    return;
  }

  sendBtn.disabled = true;
  statusText.textContent = 'Mengirim...';

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
      statusText.textContent = 'Pesan terkirim!';
      messageInput.value = '';
      tagButtons.forEach(b => b.classList.remove('selected'));
      selectedTag = null;
    } else {
      statusText.textContent = 'Gagal mengirim, coba lagi.';
    }
  } catch (err) {
    statusText.textContent = 'Terjadi kesalahan koneksi.';
  }

  sendBtn.disabled = false;
});