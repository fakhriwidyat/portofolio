// js/contact.js
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Mencegah reload halaman
    
    // Ubah status tombol saat mengirim
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    // Mengambil URL Formspree langsung dari atribut action pada tag form
    const endpoint = contactForm.getAttribute('action'); 

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json' // Meminta respons JSON agar halaman tidak pindah
        }
      });

      if (response.ok) {
        alert('Pesan kamu berhasil terkirim!');
        contactForm.reset(); // Mengosongkan form
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          // Menampilkan error spesifik dari Formspree jika ada
          alert('Gagal: ' + data.errors.map(error => error.message).join(', '));
        } else {
          alert('Gagal mengirim pesan. Coba periksa kembali data kamu.');
        }
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      // Kembalikan tombol ke keadaan semula
      submitBtn.textContent = 'SEND MESSAGE';
      submitBtn.disabled = false;
    }
  });
}