// File ini berjalan di server Netlify (bukan di browser),
// sehingga DISCORD_WEBHOOK_URL tidak pernah terlihat oleh pengunjung website.

exports.handler = async function (event) {
  // Hanya izinkan method POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return { statusCode: 500, body: 'Webhook belum dikonfigurasi.' };
  }

  try {
    const { name, tag, message } = JSON.parse(event.body);

    // Validasi dasar
    if (!message || message.trim() === '') {
      return { statusCode: 400, body: 'Pesan kosong.' };
    }

    // Warna embed berbeda per tag
    const tagColors = {
      'Confession': 15158332, // merah
      'Sharing': 3447003      // biru
    };

    const discordPayload = {
      embeds: [
        {
          title: `Pesan Baru: ${tag || 'Tanpa Kategori'}`,
          description: message,
          color: tagColors[tag] || 8421504,
          footer: { text: `Dari: ${name || 'Seseorang'}` },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      return { statusCode: 502, body: 'Gagal meneruskan ke Discord.' };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: 'Terjadi kesalahan server.' };
  }
};