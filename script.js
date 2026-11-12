const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));document.getElementById('year').textContent=new Date().getFullYear();
// Preencha com o telefone autorizado, incluindo 55 e DDD, somente dígitos.
const whatsapp='';if(whatsapp){const url='https://wa.me/'+whatsapp+'?text='+encodeURIComponent('Olá! Gostaria de agendar uma avaliação.');const contact=document.getElementById('contact-button');contact.href=url;contact.textContent='Agendar pelo WhatsApp ↗';const floating=document.querySelector('.floating');floating.href=url;floating.setAttribute('aria-label','WhatsApp');}

const imageDialog = document.querySelector('.image-dialog');

if (imageDialog && typeof imageDialog.showModal === 'function') {
  const dialogImage = imageDialog.querySelector('.dialog-image');
  const dialogTitle = imageDialog.querySelector('#image-dialog-title');
  const closeButton = imageDialog.querySelector('.dialog-close');

  document.querySelectorAll('[data-gallery-image]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const image = link.querySelector('img');
      const title = link.closest('.result-card').querySelector('strong');

      dialogImage.src = link.href;
      dialogImage.alt = image.alt;
      dialogTitle.textContent = title.textContent;
      imageDialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', event => {
    if (event.target === imageDialog) {
      imageDialog.close();
    }
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  const revealElements = document.querySelectorAll(
    '.hero-copy, .hero-photo img, .about > div, .treatments > .eyebrow, ' +
    '.treatments > h2, .treatments > .intro, .cards article, ' +
    '.gallery-heading, .result-card, .contact > *'
  );

  revealElements.forEach(element => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}
