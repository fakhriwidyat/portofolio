// Loading screen: bar mengisi smooth, lalu semuanya fade + blur keluar
const barSpan = document.querySelector('#loader .bar span');
requestAnimationFrame(() => requestAnimationFrame(() => barSpan.classList.add('fill')));

window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 2300);
});
