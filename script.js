const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));document.getElementById('year').textContent=new Date().getFullYear();
const whatsapp = '5564999999687';
const appointmentForm = document.getElementById('appointment-form');

if (appointmentForm) {
  appointmentForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!appointmentForm.reportValidity()) {
      return;
    }

    const answers = new FormData(appointmentForm);
    const notes = answers.get('notes').trim();
    const message = [
      'Olá! Gostaria de agendar uma avaliação.',
      '',
      `Nome: ${answers.get('name').trim()}`,
      `Tratamento de interesse: ${answers.get('interest')}`,
      `Primeira consulta: ${answers.get('firstVisit')}`,
      `Período de preferência: ${answers.get('period')}`,
      `Observações: ${notes || 'Nenhuma observação.'}`
    ].join('\n');

    window.location.assign(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`);
  });

  appointmentForm.querySelector('button[type="submit"]').disabled = false;
}

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

const galleryTrack = document.querySelector('.gallery-images');
const galleryControls = document.querySelector('.gallery-controls');

if (galleryTrack && galleryControls) {
  const galleryCards = Array.from(galleryTrack.querySelectorAll('.result-card'));
  const pagination = galleryControls.querySelector('.gallery-pagination');
  const previousButton = galleryControls.querySelector('.gallery-prev');
  const nextButton = galleryControls.querySelector('.gallery-next');
  let galleryPositions = [];
  let currentGalleryIndex = 0;

  function updateGalleryControls() {
    let closestDistance = Infinity;

    galleryPositions.forEach((position, index) => {
      const distance = Math.abs(galleryTrack.scrollLeft - position);
      if (distance < closestDistance) {
        closestDistance = distance;
        currentGalleryIndex = index;
      }
    });

    pagination.querySelectorAll('button').forEach((button, index) => {
      if (index === currentGalleryIndex) {
        button.setAttribute('aria-current', 'true');
      } else {
        button.removeAttribute('aria-current');
      }
    });

    previousButton.disabled = galleryTrack.scrollLeft <= 2;
    nextButton.disabled = galleryTrack.scrollLeft >= galleryPositions[galleryPositions.length - 1] - 2;
  }

  function goToGalleryPosition(index) {
    const targetIndex = Math.max(0, Math.min(index, galleryPositions.length - 1));
    galleryTrack.scrollTo({
      left: galleryPositions[targetIndex],
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  function buildGalleryPagination() {
    const maxScroll = Math.max(0, galleryTrack.scrollWidth - galleryTrack.clientWidth);
    galleryPositions = [];

    galleryCards.forEach(card => {
      const position = Math.min(card.offsetLeft, maxScroll);
      const previousPosition = galleryPositions[galleryPositions.length - 1];

      if (previousPosition === undefined || position - previousPosition > 2) {
        galleryPositions.push(position);
      }
    });

    pagination.replaceChildren();
    galleryPositions.forEach((position, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-dot';
      button.setAttribute('aria-label', `Ir para posição ${index + 1} de ${galleryPositions.length}`);
      button.setAttribute('aria-controls', 'gallery-track');
      button.addEventListener('click', () => goToGalleryPosition(index));
      pagination.append(button);
    });

    galleryControls.hidden = galleryPositions.length < 2;
    updateGalleryControls();
  }

  previousButton.addEventListener('click', () => goToGalleryPosition(currentGalleryIndex - 1));
  nextButton.addEventListener('click', () => goToGalleryPosition(currentGalleryIndex + 1));
  galleryTrack.addEventListener('scroll', updateGalleryControls, { passive: true });
  window.addEventListener('resize', buildGalleryPagination);
  buildGalleryPagination();
}

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
    '.gallery-heading, .contact > *'
  );

  revealElements.forEach(element => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}
