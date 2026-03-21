/**
* Template Name: iPortfolio - v3.7.0
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  let hoverActive = false
  let clickActive = false
  let clickTarget = null
  let scrollTimeout = null
  const clearClickLock = () => {
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout)
      scrollTimeout = null
    }
    clickActive = false
    clickTarget = null
  }
  const setClickedNavActive = (hash, duration = 0) => {
    clickActive = true
    clickTarget = hash
    navbarlinks.forEach(nl => nl.classList.remove('active'))
    let clickedLink = navbarlinks.find(nl => nl.hash === hash)
    if (clickedLink) clickedLink.classList.add('active')

    if (scrollTimeout) window.clearTimeout(scrollTimeout)
    scrollTimeout = window.setTimeout(() => {
      clearClickLock()
      navbarlinksActive()
    }, duration + 50)
  }
  const navbarlinksActive = () => {
    if (hoverActive || clickActive) return
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, () => {
    if (clickActive) return
    navbarlinksActive()
  })

  navbarlinks.forEach(navbarlink => {
    if (!navbarlink.hash) return
    let section = select(navbarlink.hash)
    if (!section) return
    section.addEventListener('mouseenter', () => {
      clearClickLock()
      hoverActive = true
      navbarlinks.forEach(nl => nl.classList.remove('active'))
      navbarlink.classList.add('active')
      if (section.id !== 'hero') section.classList.add('section-hover')
    })
    section.addEventListener('mouseleave', () => {
      hoverActive = false
      section.classList.remove('section-hover')
    })

    section.addEventListener('click', (e) => {
      if (e.defaultPrevented) return
      if (e.target.closest('a, button, input, textarea, select, option, label, summary, [role="button"], [contenteditable="true"]')) return
      if (window.getSelection && window.getSelection().toString()) return

      let hash = `#${section.id}`
      let duration = scrollto(hash)
      setClickedNavActive(hash, duration)
    })
  })

  document.addEventListener('wheel', () => {
    if (clickActive) {
      clearClickLock()
      navbarlinksActive()
    }
  })

  const clearAllHovers = () => {
    document.querySelectorAll('.section-hover').forEach(el => el.classList.remove('section-hover'))
  }
  window.addEventListener('blur', () => {
    hoverActive = false
    clearAllHovers()
  })
  window.addEventListener('focus', () => {
    hoverActive = false
    clearAllHovers()
  })
  document.addEventListener('mouseleave', () => {
    hoverActive = false
    clearAllHovers()
  })

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let targetPos = select(el).offsetTop
    let startPos = window.scrollY
    let distance = targetPos - startPos
    let absDist = Math.abs(distance)
    let maxDist = Math.max(document.body.scrollHeight - window.innerHeight, 1)
    let ratio = Math.min(Math.max(absDist / maxDist, 0.05), 1)

    let maxDuration = 600
    let minDuration = 120
    let duration = minDuration + (maxDuration - minDuration) * ratio
    let startTime = performance.now()

    // Jerk-limited motion profile: smooth throttle-up, cruise, smooth braking.
    let accelFrac = 0.3
    let cruiseFrac = 0.3
    let decelFrac = 0.4
    let peakVelocity = 1 / (0.5 * accelFrac + cruiseFrac + 0.5 * decelFrac)
    let accelDistance = peakVelocity * accelFrac * 0.5
    let cruiseDistance = peakVelocity * cruiseFrac

    function integralSmootherstep(p) {
      return p ** 6 - 3 * p ** 5 + 2.5 * p ** 4
    }

    function progressAt(t) {
      if (t < accelFrac) {
        let p = t / accelFrac
        return peakVelocity * accelFrac * integralSmootherstep(p)
      }

      if (t < accelFrac + cruiseFrac) {
        return accelDistance + peakVelocity * (t - accelFrac)
      }

      let p = (t - accelFrac - cruiseFrac) / decelFrac
      return accelDistance + cruiseDistance + peakVelocity * decelFrac * (p - integralSmootherstep(p))
    }

    function step(currentTime) {
      let elapsed = currentTime - startTime
      let t = Math.min(elapsed / duration, 1)
      window.scrollTo(0, startPos + distance * progressAt(t))
      if (t < 1) requestAnimationFrame(step)
      else window.scrollTo(0, targetPos)
    }

    requestAnimationFrame(step)
    return duration
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let hash = this.hash
      let duration = scrollto(hash)
      setClickedNavActive(hash, duration)

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    } else {
      window.scrollTo(0, 0)
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 80,
      backSpeed: 20,
      backDelay: 1500
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()