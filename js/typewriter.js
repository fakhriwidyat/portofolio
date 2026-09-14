// js/typewriter.js
const roles = ["Student in SMK Telkom Purwokerto"];
const typedTextSpan = document.getElementById("typedRole");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  if (!typedTextSpan) return;

  const currentRole = roles[roleIndex];
  
  if (isDeleting) {
    // Menghapus karakter satu per satu
    typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Mengetik karakter satu per satu
    typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  // Atur kecepatan ketik dan hapus (dalam milidetik)
  let typeSpeed = isDeleting ? 50 : 100;

  // Logika ketika kata selesai diketik atau selesai dihapus
  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 1500; // Jeda sebelum mulai menghapus (1.5 detik)
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex++;
    
    // Ulangi dari awal jika sudah mencapai kata terakhir
    if (roleIndex >= roles.length) {
      roleIndex = 0; 
    }
    typeSpeed = 500; // Jeda sebelum mengetik kata baru
  }

  setTimeout(typeWriter, typeSpeed);
}

// Jalankan animasi setelah halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
  if(typedTextSpan) {
    typeWriter();
  }
});