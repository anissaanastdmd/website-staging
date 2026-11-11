(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 0 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Placeholder links (href="#" or empty) do nothing instead of jumping to the top
   */
  function isPlaceholderLink(link) {
    const href = link.getAttribute('href');
    return href === null || href.trim() === '' || href.trim() === '#';
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && isPlaceholderLink(link)) e.preventDefault();
  });

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    const open = document.querySelector('body').classList.toggle('mobile-nav-active');
    const icon = mobileNavToggleBtn.querySelector('i');
    icon.classList.toggle('bi-list', !open);
    icon.classList.toggle('bi-x', open);
    mobileNavToggleBtn.setAttribute('aria-expanded', open);
    mobileNavToggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
    // Escape closes the mobile menu and returns focus to the button
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
        mobileNavToggleBtn.focus();
      }
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active') && !navmenu.classList.contains('toggle-dropdown') && !isPlaceholderLink(navmenu)) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const submenu = this.nextElementSibling;
      const open = submenu.classList.toggle('dropdown-active');
      this.classList.toggle('active', open);
      this.setAttribute('aria-expanded', open);
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      const autoplayToggle = swiperElement.parentElement.querySelector('[data-autoplay-toggle]');

      // No automatic sliding for people who ask their device to reduce motion
      if (prefersReducedMotion) {
        delete config.autoplay;
        if (autoplayToggle) autoplayToggle.hidden = true;
      }

      const swiper = new Swiper(swiperElement, config);

      if (swiper && config.autoplay && autoplayToggle) {
        initAutoplayControls(swiper, swiperElement, autoplayToggle);
      }
    });
  }

  // Pause/play button for auto-advancing sliders (WCAG 2.2.2), plus pausing while
  // keyboard focus is inside the slider so content doesn't move while being read.
  function initAutoplayControls(swiper, swiperElement, button) {
    let pausedByUser = false;
    const label = button.querySelector('span');
    const icon = button.querySelector('i');

    button.addEventListener('click', () => {
      pausedByUser = !pausedByUser;
      if (pausedByUser) swiper.autoplay.stop(); else swiper.autoplay.start();
      button.setAttribute('aria-pressed', pausedByUser);
      label.textContent = pausedByUser ? 'Play reviews' : 'Pause reviews';
      icon.classList.toggle('bi-pause-fill', !pausedByUser);
      icon.classList.toggle('bi-play-fill', pausedByUser);
    });

    swiperElement.addEventListener('focusin', () => swiper.autoplay.stop());
    swiperElement.addEventListener('focusout', (e) => {
      if (!swiperElement.contains(e.relatedTarget) && !pausedByUser) swiper.autoplay.start();
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  // The whole panel (including its padding) toggles it, except clicks on links
  // inside an answer and clicks that finish selecting text.
  document.querySelectorAll('.faq-item').forEach((faqItem) => {
    faqItem.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      if (window.getSelection().toString()) return;
      const open = faqItem.classList.toggle('faq-active');
      const button = faqItem.querySelector('.faq-question button');
      if (button) button.setAttribute('aria-expanded', open);
    });
  });

})();