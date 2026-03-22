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
      if (e.target.closest('a, button, input, textarea, select, option, label, summary, [role="button"], [contenteditable="true"], [data-no-section-scroll]')) return
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
      backDelay: 1500,
      startDelay: 400
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
   * Neural Digit Classifier - Build Your Own Digit Classifier
   */
  const neuralDigitClassifier = select('.neural-digit-classifier')
  if (neuralDigitClassifier) {
    const canvas = select('#neural-digit-classifier-canvas')
    const ctx = canvas ? canvas.getContext('2d') : null
    const neuronCountEl = select('#neural-digit-classifier-neurons')
    const connCountEl = select('#neural-digit-classifier-connections')
    const statusEl = select('#neural-digit-classifier-status')
    const ctrlBtns = select('[data-neural-action]', true)
    const digitBtns = select('.neural-digit-classifier-digit[data-digit]', true)

    if (canvas && ctx) {
      let W = 0, H = 0

      const DW = 3, DH = 5, NPIX = 15
      const DIGITS = [
        [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1],
        [0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1],
        [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1],
        [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1],
        [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1],
        [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
        [1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1],
        [1,1,1, 0,0,1, 0,0,1, 0,1,0, 0,1,0],
        [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1],
        [1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1]
      ]

      const NZONES = 4
      const ZLABELS = ['Input', 'Hidden 1', 'Hidden 2', 'Output']
      const NET_L = 0.14, NET_R = 0.86
      const ZW = (NET_R - NET_L) / NZONES
      const ZX = []
      for (let z = 0; z < NZONES; z++) ZX.push(NET_L + (z + 0.5) * ZW)

      const LDELAY = 350
      const sigmoid = x => 1 / (1 + Math.exp(-Math.max(-12, Math.min(12, x))))

      let neurons = []
      let layers = [[], [], [], []]
      let conns = []
      let wCache = new Map()
      let currentDigit = -1
      let digitPixels = null
      let inputAlpha = 0
      let predAlpha = 0
      let prediction = -1
      let confidence = 0
      let pulseTime = -1
      let pixPulse = -1
      let lastTime = 0
      let globalTime = 0
      let digitBoxRect = { x: 0, y: 0, w: 0, h: 0 }

      const cachedWeight = (a, b) => {
        const k = a + ',' + b
        if (!wCache.has(k)) wCache.set(k, Math.random() * 2 - 1)
        return wCache.get(k)
      }

      const rebuildConns = () => {
        conns = []
        const filled = []
        for (let li = 0; li < NZONES; li++)
          if (layers[li].length > 0) filled.push(li)
        for (let k = 0; k < filled.length - 1; k++) {
          const fl = filled[k], tl = filled[k + 1]
          for (const fi of layers[fl])
            for (const ti of layers[tl])
              conns.push({ from: fi, to: ti, weight: cachedWeight(fi, ti), pulse: -1 })
        }
      }

      const snapOutputY = () => {
        const n = layers[3].length
        for (let i = 0; i < n; i++) {
          neurons[layers[3][i]].x = ZX[3] * W
          neurons[layers[3][i]].y = H * (i + 1) / (n + 1)
        }
      }

      const initOutput = () => {
        for (let i = 0; i < 10; i++) {
          const idx = neurons.length
          neurons.push({
            x: 0, y: 0, r: 5, act: 0, targetAct: 0,
            bias: (Math.random() - 0.5) * 0.4,
            layer: 3, digitLabel: i,
            pixelIndex: -1,
            phase: Math.random() * Math.PI * 2,
            birthFlash: 0
          })
          layers[3].push(idx)
        }
      }

      const resizeCanvas = () => {
        const r = canvas.getBoundingClientRect()
        if (!r.width || !r.height) return
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const pW = W, pH = H
        W = r.width; H = r.height
        canvas.width = Math.round(W * dpr)
        canvas.height = Math.round(H * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (pW && pH && neurons.length) {
          const sx = W / pW, sy = H / pH
          neurons.forEach(n => { n.x *= sx; n.y *= sy })
        }
        for (let li = 0; li < NZONES; li++)
          for (const idx of layers[li])
            neurons[idx].x = ZX[li] * W
        snapOutputY()
      }

      let statusTimer = null
      let initialStatus = true
      const showStatus = (msg, duration) => {
        initialStatus = false
        if (statusTimer) clearTimeout(statusTimer)
        statusEl.style.transition = 'none'
        statusEl.style.opacity = '1'
        statusEl.textContent = msg
        if (duration) {
          statusTimer = setTimeout(() => {
            statusEl.style.transition = 'opacity 0.8s ease'
            statusEl.style.opacity = '0'
            statusTimer = null
          }, duration)
        }
      }

      const updateCounters = () => {
        neuronCountEl.textContent = neurons.length
        connCountEl.textContent = conns.length
      }

      const whichZone = (px) => {
        const f = px / W
        for (let z = 0; z < NZONES - 1; z++) {
          const left = NET_L + z * ZW, right = left + ZW
          if (f >= left && f <= right) return z
        }
        return -1
      }

      const reassignInputPixels = () => {
        const sorted = layers[0].slice().sort((a, b) => neurons[a].y - neurons[b].y)
        sorted.forEach((idx, i) => { neurons[idx].pixelIndex = i })
      }

      const nextHint = () => {
        const hasInput = layers[0].length > 0
        const hasHidden = layers[1].length > 0 || layers[2].length > 0
        const hasDigit = currentDigit >= 0
        if (!hasInput) return 'Add neurons to the Input column.'
        if (!hasHidden) return 'Add hidden neurons to improve predictions.'
        if (!hasDigit) return 'Pick a digit, then try clicking Predict!'
        return 'Try clicking Predict!'
      }

      const addNeuron = (px, py) => {
        const zone = whichZone(px)
        if (zone < 0) return -1
        if (zone === 0 && layers[0].length >= NPIX) {
          showStatus('All ' + NPIX + ' input neurons added. ' + nextHint(), 3000)
          return -1
        }
        const idx = neurons.length
        neurons.push({
          x: ZX[zone] * W, y: py,
          r: 5, act: 0, targetAct: 0,
          bias: (Math.random() - 0.5) * 0.4,
          layer: zone, digitLabel: -1,
          pixelIndex: -1,
          phase: Math.random() * Math.PI * 2,
          birthFlash: 1
        })
        layers[zone].push(idx)
        if (zone === 0) reassignInputPixels()
        rebuildConns()
        updateCounters()
        if (zone === 0) {
          const inputCount = layers[0].length
          const inputHint = inputCount < NPIX
            ? 'Keep adding to map all inputs.'
            : nextHint()
          showStatus('Added input neuron (' + inputCount + '/' + NPIX + '). ' + inputHint, 3000)
        } else
          showStatus('Added neuron to ' + ZLABELS[zone] + '. ' + nextHint(), 3000)
        return idx
      }

      const forwardPass = (pix) => {
        for (const idx of layers[0]) {
          const n = neurons[idx]
          n.targetAct = n.pixelIndex >= 0 ? (pix[n.pixelIndex] || 0) : 0
        }

        const filled = []
        for (let li = 0; li < NZONES; li++)
          if (layers[li].length > 0) filled.push(li)

        for (let k = 1; k < filled.length; k++) {
          const li = filled[k], prevLi = filled[k - 1]
          for (const idx of layers[li]) {
            const n = neurons[idx]
            let s = n.bias
            for (const c of conns)
              if (c.to === idx && neurons[c.from].layer === prevLi)
                s += neurons[c.from].targetAct * c.weight
            if (li === 3) n.rawLogit = s
            else n.targetAct = sigmoid(s)
          }
        }

        prediction = -1; confidence = 0
        if (layers[3].length > 0 && filled.length > 1) {
          const logits = layers[3].map(i => neurons[i].rawLogit || 0)
          const mx = Math.max(...logits)
          const exps = logits.map(l => Math.exp(l - mx))
          const total = exps.reduce((a, b) => a + b, 0)
          let bestI = 0
          layers[3].forEach((idx, i) => {
            neurons[idx].targetAct = exps[i] / total
            if (neurons[idx].targetAct > neurons[layers[3][bestI]].targetAct) bestI = i
          })
          prediction = neurons[layers[3][bestI]].digitLabel
          confidence = neurons[layers[3][bestI]].targetAct
        } else if (layers[3].length > 0) {
          layers[3].forEach(idx => { neurons[idx].targetAct = sigmoid(neurons[idx].bias) })
        }
      }

      const selectDigit = (digit) => {
        currentDigit = digit
        digitPixels = DIGITS[digit].map(v => v ? 0.5 + Math.random() * 0.5 : Math.random() * 0.06)
        digitBtns.forEach(btn =>
          btn.classList.toggle('active', parseInt(btn.getAttribute('data-digit')) === digit))
        inputAlpha = 1; predAlpha = 0; pixPulse = -1; pulseTime = -1
        neurons.forEach(n => { n.act = 0 })
        conns.forEach(c => { c.pulse = -1 })
        const hasInput = layers[0].length > 0
        const hasConns = conns.length > 0
        if (!hasInput)
          showStatus('Digit ' + digit + ' selected. Add neurons to the Input column first.', 3000)
        else if (!hasConns)
          showStatus('Digit ' + digit + ' selected. Add hidden neurons to create connections.', 3000)
        else
          showStatus('Digit ' + digit + ' selected. Click Predict to see the prediction.', 3000)
      }

      const runPredict = () => {
        if (currentDigit < 0) {
          showStatus('Pick a digit first!', 2500)
          return
        }
        if (layers[0].length === 0) {
          showStatus('Add input neurons first!', 2500)
          return
        }
        if (conns.length === 0) {
          showStatus('Add hidden neurons to create connections between layers.', 2500)
          return
        }
        neurons.forEach(n => { n.act = 0 })
        conns.forEach(c => { c.pulse = -1 })
        forwardPass(digitPixels)
        predAlpha = 0; pixPulse = 0; pulseTime = 0
        showStatus('Predicting digit ' + currentDigit + '\u2026', 2500)
      }

      let isTraining = false

      const runOneSample = (pix, label, filled, lr) => {
        for (const idx of layers[0])
          neurons[idx].fwdAct = neurons[idx].pixelIndex >= 0 ? (pix[neurons[idx].pixelIndex] || 0) : 0

        for (let k = 1; k < filled.length; k++) {
          const li = filled[k], pl = filled[k - 1]
          for (const idx of layers[li]) {
            let s = neurons[idx].bias
            for (const c of conns)
              if (c.to === idx && neurons[c.from].layer === pl)
                s += neurons[c.from].fwdAct * c.weight
            if (li === 3) neurons[idx].rawLogit = s
            else neurons[idx].fwdAct = sigmoid(s)
          }
        }

        const logits = layers[3].map(i => neurons[i].rawLogit || 0)
        const mx = Math.max(...logits)
        const exps = logits.map(l => Math.exp(l - mx))
        const tot = exps.reduce((a, b) => a + b, 0)
        layers[3].forEach((idx, i) => { neurons[idx].fwdAct = exps[i] / tot })

        layers[3].forEach(idx => {
          neurons[idx].delta = neurons[idx].fwdAct - (neurons[idx].digitLabel === label ? 1 : 0)
        })

        for (let k = filled.length - 2; k >= 1; k--) {
          const li = filled[k], nl = filled[k + 1]
          for (const idx of layers[li]) {
            let gs = 0
            for (const c of conns)
              if (c.from === idx && neurons[c.to].layer === nl)
                gs += c.weight * neurons[c.to].delta
            neurons[idx].delta = gs * neurons[idx].fwdAct * (1 - neurons[idx].fwdAct)
          }
        }

        for (const c of conns) {
          c.weight -= lr * neurons[c.from].fwdAct * neurons[c.to].delta
          wCache.set(c.from + ',' + c.to, c.weight)
        }
        for (let k = 1; k < filled.length; k++)
          for (const idx of layers[filled[k]])
            neurons[idx].bias -= lr * neurons[idx].delta
      }

      const computeAccuracy = (filled) => {
        let correct = 0
        for (let d = 0; d < 10; d++) {
          for (const idx of layers[0])
            neurons[idx].fwdAct = neurons[idx].pixelIndex >= 0 ? (DIGITS[d][neurons[idx].pixelIndex] || 0) : 0
          for (let k = 1; k < filled.length; k++) {
            const li = filled[k], pl = filled[k - 1]
            for (const idx of layers[li]) {
              let s = neurons[idx].bias
              for (const c of conns)
                if (c.to === idx && neurons[c.from].layer === pl)
                  s += neurons[c.from].fwdAct * c.weight
              neurons[idx].fwdAct = li === 3 ? s : sigmoid(s)
            }
          }
          let bestI = 0
          for (let i = 1; i < layers[3].length; i++)
            if (neurons[layers[3][i]].fwdAct > neurons[layers[3][bestI]].fwdAct) bestI = i
          if (neurons[layers[3][bestI]].digitLabel === d) correct++
        }
        return correct
      }

      const trainNetwork = () => {
        if (isTraining) return
        const filled = []
        for (let li = 0; li < NZONES; li++)
          if (layers[li].length > 0) filled.push(li)
        if (!filled.includes(0)) { showStatus('Add input neurons first!', 2500); return }
        if (conns.length === 0) { showStatus('Add hidden neurons to create connections between layers.', 2500); return }

        isTraining = true
        predAlpha = 0; pulseTime = -1; pixPulse = -1

        const trainData = []
        for (let d = 0; d < 10; d++)
          for (let a = 0; a < 8; a++)
            trainData.push({ pix: DIGITS[d].map(v => v ? 0.5 + Math.random() * 0.5 : Math.random() * 0.06), label: d })

        const lr = 0.5, totalEpochs = 20, epochsPerFrame = 1
        let epoch = 0

        const shuffle = (arr) => {
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]
          }
        }

        const trainFrame = () => {
          for (let b = 0; b < epochsPerFrame && epoch < totalEpochs; b++, epoch++) {
            shuffle(trainData)
            for (const sample of trainData)
              runOneSample(sample.pix, sample.label, filled, lr)
          }

          const lastSample = trainData[trainData.length - 1]
          currentDigit = lastSample.label
          digitPixels = lastSample.pix.map(v => v > 0.3 ? 0.6 + Math.random() * 0.25 : Math.random() * 0.04)
          inputAlpha = 1
          digitBtns.forEach(btn =>
            btn.classList.toggle('active', parseInt(btn.getAttribute('data-digit')) === lastSample.label))

          neurons.forEach(n => { if (n.fwdAct !== undefined) n.act = n.fwdAct })

          let bestOut = 0
          for (let i = 1; i < layers[3].length; i++)
            if (neurons[layers[3][i]].fwdAct > neurons[layers[3][bestOut]].fwdAct) bestOut = i
          prediction = neurons[layers[3][bestOut]].digitLabel
          confidence = neurons[layers[3][bestOut]].fwdAct || 0
          predAlpha = 1

          const maxGrad = conns.reduce((mx, c) =>
            Math.max(mx, Math.abs((neurons[c.from].fwdAct || 0) * (neurons[c.to].delta || 0))), 0.001)
          conns.forEach(c => {
            c.backPulse = Math.abs((neurons[c.from].fwdAct || 0) * (neurons[c.to].delta || 0)) / maxGrad
          })

          const pct = Math.round(epoch / totalEpochs * 100)
          showStatus('Training\u2026 ' + pct + '%')

          if (epoch < totalEpochs) {
            requestAnimationFrame(trainFrame)
          } else {
            isTraining = false
            conns.forEach(c => { c.backPulse = 0 })
            neurons.forEach(n => { n.act = 0 })
            predAlpha = 0; prediction = -1
            const acc = computeAccuracy(filled)
            const tip = acc < 7 ? ' Try adding more neurons and training again.' : ' Pick a digit to test.'
            showStatus('Training complete! Accuracy: ' + acc + '/10.' + tip, 5000)
          }
        }

        trainFrame()
      }

      const clearAll = () => {
        neurons = []; layers = [[], [], [], []]; conns = []; wCache = new Map()
        currentDigit = -1; digitPixels = null; prediction = -1
        inputAlpha = 0; predAlpha = 0; pixPulse = -1; pulseTime = -1
        digitBtns.forEach(btn => btn.classList.remove('active'))
        initOutput(); snapOutputY(); rebuildConns(); updateCounters()
        showStatus('Network reset. Start by adding neurons to the Input column.', 3000)
      }

      const update = (dt) => {
        globalTime += dt
        neurons.forEach(n => {
          n.phase += dt * 0.002
          if (n.birthFlash > 0.01) n.birthFlash *= 0.93; else n.birthFlash = 0
          if (pulseTime < 0 && !isTraining) n.act *= 0.985
        })
        if (!isTraining) conns.forEach(c => { if (c.backPulse > 0) c.backPulse *= 0.85 })
        if (pulseTime < 0) return
        pulseTime += dt

        const filled = []
        for (let li = 0; li < NZONES; li++)
          if (layers[li].length > 0) filled.push(li)
        const lDelay = filled.length > 1 ? LDELAY : 300

        inputAlpha = Math.min(pulseTime / 350, 1)

        if (pixPulse >= 0 && pixPulse < 1)
          pixPulse = Math.min(pulseTime / 350, 1)

        filled.forEach((li, order) => {
          const t0 = 350 + order * lDelay
          if (pulseTime >= t0) {
            const p = Math.min((pulseTime - t0) / 250, 1)
            for (const idx of layers[li])
              neurons[idx].act = neurons[idx].targetAct * p
          }
        })

        for (const c of conns) {
          const fromOrder = filled.indexOf(neurons[c.from].layer)
          if (fromOrder < 0) continue
          const t0 = 350 + fromOrder * lDelay + 100
          const dur = lDelay * 0.6
          if (pulseTime >= t0 && c.pulse < 1)
            c.pulse = Math.min((pulseTime - t0) / dur, 1)
        }

        const predT = 350 + (filled.length - 1) * lDelay + 40
        predAlpha = pulseTime > predT ? 1 : 0
        if (predAlpha > 0 && prediction >= 0 && pulseTime - dt <= predT)
          showStatus('Predicted: ' + prediction + ' (' + Math.round(confidence * 100) + '% confidence). Click Train to improve accuracy.', 4000)
      }

      const render = () => {
        ctx.clearRect(0, 0, W, H)
        const compactOutput = W < 560

        for (let z = 0; z < NZONES; z++) {
          const zl = (NET_L + z * ZW) * W, zw = ZW * W
          ctx.fillStyle = 'rgba(255,255,255,0.04)'
          ctx.fillRect(zl, 0, zw, H)
          if (z > 0) {
            ctx.strokeStyle = 'rgba(120,180,255,0.3)'
            ctx.lineWidth = 1; ctx.setLineDash([4, 4])
            ctx.beginPath(); ctx.moveTo(zl, 0); ctx.lineTo(zl, H); ctx.stroke()
            ctx.setLineDash([])
          }
          ctx.fillStyle = z === 3 ? 'rgba(180,215,255,0.85)' : 'rgba(180,215,255,0.7)'
          ctx.font = '10px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(ZLABELS[z], ZX[z] * W, 14)
          if (z < 3 && layers[z].length === 0) {
            const pulseAlpha = 0.5 + 0.2 * Math.sin(globalTime * 0.002)
            const cx = ZX[z] * W, cy = H / 2 - 6
            const cr = 8
            ctx.strokeStyle = 'rgba(180,215,255,' + pulseAlpha + ')'
            ctx.lineWidth = 1.2
            ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.stroke()
            ctx.fillStyle = 'rgba(180,215,255,' + pulseAlpha + ')'
            ctx.font = '14px system-ui, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('+', cx, cy)
            ctx.textBaseline = 'alphabetic'
            ctx.fillStyle = 'rgba(180,215,255,' + pulseAlpha + ')'
            ctx.font = '8px system-ui, sans-serif'
            ctx.fillText('click to add', cx, cy + cr + 13)
            ctx.fillText('neurons', cx, cy + cr + 25)
          }
        }

        const dX = W * 0.015, dW = W < 500 ? W * 0.14 : W * 0.11, dH2 = H * (W < 500 ? 0.12 : 0.26)
        const dY = H / 2 - dH2
        const dPad = 6
        digitBoxRect = { x: dX, y: dY, w: dW, h: dH2 * 2 }
        ctx.strokeStyle = 'rgba(120,180,255,0.4)'
        ctx.lineWidth = 1; ctx.setLineDash([3, 3])
        ctx.strokeRect(dX, dY, dW, dH2 * 2)
        ctx.setLineDash([])
        ctx.fillStyle = 'rgba(180,215,255,0.7)'
        ctx.font = '9px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Digit', dX + dW / 2, dY - 6)

        const innerW = dW - dPad * 2, innerH = dH2 * 2 - dPad * 2
        const cell = Math.min(innerH / DH, innerW / DW)
        const gw = cell * DW, gh = cell * DH
        const ox = dX + dPad + (innerW - gw) / 2, oy = dY + dPad + (innerH - gh) / 2
        const pixCenters = []
        for (let row = 0; row < DH; row++)
          for (let col = 0; col < DW; col++)
            pixCenters.push({ x: ox + col * cell + cell / 2, y: oy + row * cell + cell / 2 })

        if (digitPixels && inputAlpha > 0) {
          for (let row = 0; row < DH; row++)
            for (let col = 0; col < DW; col++) {
              const pi = row * DW + col
              const val = digitPixels[pi] * inputAlpha
              if (val < 0.03) continue
              const s = cell * 0.76, cx = ox + col * cell + (cell - s) / 2, cy = oy + row * cell + (cell - s) / 2
              const rr = s * 0.2
              ctx.fillStyle = 'rgba(120,190,255,' + (val * 0.95) + ')'
              ctx.beginPath()
              ctx.moveTo(cx + rr, cy); ctx.lineTo(cx + s - rr, cy)
              ctx.quadraticCurveTo(cx + s, cy, cx + s, cy + rr)
              ctx.lineTo(cx + s, cy + s - rr)
              ctx.quadraticCurveTo(cx + s, cy + s, cx + s - rr, cy + s)
              ctx.lineTo(cx + rr, cy + s)
              ctx.quadraticCurveTo(cx, cy + s, cx, cy + s - rr)
              ctx.lineTo(cx, cy + rr)
              ctx.quadraticCurveTo(cx, cy, cx + rr, cy)
              ctx.closePath(); ctx.fill()
            }
        } else {
          const digitPulse = 0.5 + 0.2 * Math.sin(globalTime * 0.002)
          const dcx = dX + dW / 2, dcy = H / 2 - 10
          const dcr = 8
          ctx.strokeStyle = 'rgba(180,215,255,' + digitPulse + ')'
          ctx.lineWidth = 1.2
          ctx.beginPath(); ctx.arc(dcx, dcy, dcr, 0, Math.PI * 2); ctx.stroke()
          ctx.fillStyle = 'rgba(180,215,255,' + digitPulse + ')'
          ctx.font = '14px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('+', dcx, dcy)
          ctx.textBaseline = 'alphabetic'
          ctx.font = '8px system-ui, sans-serif'
          ctx.fillText('click to pick', dcx, dcy + dcr + 13)
          ctx.fillText('a digit', dcx, dcy + dcr + 25)
        }

        if (digitPixels && layers[0].length > 0) {
          for (const idx of layers[0]) {
            const n = neurons[idx]
            if (n.pixelIndex < 0 || n.pixelIndex >= NPIX) continue
            const pc = pixCenters[n.pixelIndex]
            const val = digitPixels[n.pixelIndex] || 0
            ctx.strokeStyle = 'rgba(120,190,255,' + (0.08 + val * 0.35) + ')'
            ctx.lineWidth = 0.5 + val * 0.8
            ctx.beginPath(); ctx.moveTo(pc.x, pc.y); ctx.lineTo(n.x, n.y); ctx.stroke()

            if (pixPulse > 0 && pixPulse < 1 && val > 0.05) {
              const px = pc.x + (n.x - pc.x) * pixPulse
              const py = pc.y + (n.y - pc.y) * pixPulse
              const g = ctx.createRadialGradient(px, py, 0, px, py, 10)
              g.addColorStop(0, 'rgba(130,200,255,' + (val * 0.5) + ')')
              g.addColorStop(1, 'rgba(80,160,255,0)')
              ctx.fillStyle = g
              ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill()
              ctx.fillStyle = 'rgba(230,245,255,0.9)'
              ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill()
            }
          }
        }

        const maxW = conns.length > 0 ? conns.reduce((mx, c) => Math.max(mx, Math.abs(c.weight)), 0.01) : 1

        for (const c of conns) {
          const a = neurons[c.from], b = neurons[c.to]
          const hot = c.pulse > 0 && c.pulse < 1
          const wNorm = Math.abs(c.weight) / maxW
          const t = Math.max(0, Math.min(1, (c.weight / maxW + 1) / 2))
          const cR = Math.round(160 * (1 - t) + 80 * t)
          const cG = Math.round(80 * (1 - t) + 170 * t)
          const cB = Math.round(255 * (1 - t) + 255 * t)
          ctx.strokeStyle = 'rgba(' + cR + ',' + cG + ',' + cB + ',' + (0.25 + wNorm * 0.2) + ')'
          ctx.lineWidth = 0.5 + wNorm * 0.6
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()

          if (hot) {
            ctx.strokeStyle = 'rgba(100,170,255,0.35)'
            ctx.lineWidth = 2
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            const px = a.x + (b.x - a.x) * c.pulse, py = a.y + (b.y - a.y) * c.pulse
            const g = ctx.createRadialGradient(px, py, 0, px, py, 10)
            g.addColorStop(0, 'rgba(150,210,255,0.55)')
            g.addColorStop(1, 'rgba(80,160,255,0)')
            ctx.fillStyle = g
            ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = 'rgba(230,245,255,0.95)'
            ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fill()
          }

          if (c.backPulse > 0.05) {
            ctx.strokeStyle = 'rgba(255,160,60,' + (c.backPulse * 0.25) + ')'
            ctx.lineWidth = 0.8 + c.backPulse * 1.2
            ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(a.x, a.y); ctx.stroke()
          }
        }

        neurons.forEach(n => {
          const br = 1 + Math.sin(n.phase) * 0.04
          const r = n.r * br
          const glow = Math.max(n.act, n.birthFlash * 0.5, 0.1)
          const g = ctx.createRadialGradient(n.x, n.y, r * 0.3, n.x, n.y, r * 2.5)
          g.addColorStop(0, 'rgba(90,170,255,' + (glow * 0.45) + ')')
          g.addColorStop(0.6, 'rgba(60,130,255,' + (glow * 0.1) + ')')
          g.addColorStop(1, 'rgba(60,130,255,0)')
          ctx.fillStyle = g
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = 'rgba(185,220,255,' + (0.5 + glow * 0.5) + ')'
          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = 'rgba(235,245,255,' + (0.35 + glow * 0.55) + ')'
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2); ctx.fill()
          if (glow > 0.3) {
            const rr = r + 3 + (1 - glow) * 8
            ctx.strokeStyle = 'rgba(110,185,255,' + (glow * 0.5) + ')'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(n.x, n.y, rr, 0, Math.PI * 2); ctx.stroke()
          }
          if (n.digitLabel >= 0) {
            ctx.fillStyle = 'rgba(220,235,255,' + (0.65 + n.act * 0.35) + ')'
            ctx.font = (predAlpha > 0 && n.targetAct > 0.15 ? 'bold ' : '') + '11px system-ui, sans-serif'
            ctx.textAlign = 'left'
            const showProb = !compactOutput && predAlpha > 0 && n.targetAct > 0.01
            const label = showProb ? n.digitLabel + ' (' + Math.round(n.targetAct * 100) + '%)' : String(n.digitLabel)
            ctx.fillText(label, n.x + n.r + 6, n.y + 4)
          }
          if (n.pixelIndex >= 0) {
            ctx.fillStyle = 'rgba(180,215,255,0.6)'
            ctx.font = '8px system-ui, sans-serif'
            ctx.textAlign = 'right'
            ctx.fillText('P' + n.pixelIndex, n.x - n.r - 4, n.y + 3)
          }
        })

        if (hoverNeuron >= 0 && hoverNeuron < neurons.length) {
          const hn = neurons[hoverNeuron]
          const hg = ctx.createRadialGradient(hn.x, hn.y, hn.r * 0.3, hn.x, hn.y, hn.r * 2.5)
          hg.addColorStop(0, 'rgba(220,60,60,0.35)')
          hg.addColorStop(1, 'rgba(220,60,60,0)')
          ctx.fillStyle = hg
          ctx.beginPath(); ctx.arc(hn.x, hn.y, hn.r * 2.5, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = 'rgba(220,60,60,0.7)'
          ctx.beginPath(); ctx.arc(hn.x, hn.y, hn.r, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.font = '8px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('\u00d7', hn.x, hn.y)
          ctx.textBaseline = 'alphabetic'
        }

        if (predAlpha > 0 && prediction >= 0) {
          const px = compactOutput ? W * 0.915 : W * 0.93
          const fs = compactOutput ? Math.min(H * 0.2, 44) : Math.min(H * 0.3, 70)
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillStyle = 'rgba(200,230,255,' + predAlpha + ')'
          ctx.font = 'bold ' + fs + 'px system-ui, sans-serif'
          ctx.fillText(String(prediction), px, H * 0.45)
          if (!compactOutput) {
            ctx.textBaseline = 'alphabetic'
            ctx.fillStyle = 'rgba(180,215,255,' + (predAlpha * 0.7) + ')'
            ctx.font = '9px system-ui, sans-serif'
            ctx.fillText(Math.round(confidence * 100) + '% Confidence', px, H * 0.45 + fs * 0.5 + 14)
          }
        }

        const lgW = 80, lgH = 8
        const lgX = W < 500 ? 12 : W - lgW - 12
        const lgY = H - 28
        const lgGrad = ctx.createLinearGradient(lgX, 0, lgX + lgW, 0)
        lgGrad.addColorStop(0, 'rgba(160,80,255,0.7)')
        lgGrad.addColorStop(0.5, 'rgba(120,125,255,0.35)')
        lgGrad.addColorStop(1, 'rgba(80,170,255,0.7)')
        ctx.fillStyle = lgGrad
        ctx.beginPath()
        const lgR = lgH / 2
        ctx.moveTo(lgX + lgR, lgY); ctx.lineTo(lgX + lgW - lgR, lgY)
        ctx.quadraticCurveTo(lgX + lgW, lgY, lgX + lgW, lgY + lgR)
        ctx.lineTo(lgX + lgW, lgY + lgH - lgR)
        ctx.quadraticCurveTo(lgX + lgW, lgY + lgH, lgX + lgW - lgR, lgY + lgH)
        ctx.lineTo(lgX + lgR, lgY + lgH)
        ctx.quadraticCurveTo(lgX, lgY + lgH, lgX, lgY + lgH - lgR)
        ctx.lineTo(lgX, lgY + lgR)
        ctx.quadraticCurveTo(lgX, lgY, lgX + lgR, lgY)
        ctx.closePath(); ctx.fill()

        ctx.fillStyle = 'rgba(180,215,255,0.6)'
        ctx.font = '8px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('\u22121', lgX, lgY - 3)
        ctx.textAlign = 'right'
        ctx.fillText('+1', lgX + lgW, lgY - 3)
        ctx.textAlign = 'center'
        ctx.fillText('Weight', lgX + lgW / 2, lgY + lgH + 11)
      }

      let hoverNeuron = -1
      let mouseX = -1, mouseY = -1

      const findNeuronAt = (px, py) => {
        for (let i = 0; i < neurons.length; i++) {
          const n = neurons[i]
          if (n.digitLabel >= 0) continue
          const dx = px - n.x, dy = py - n.y
          if (dx * dx + dy * dy <= (n.r + 4) * (n.r + 4)) return i
        }
        return -1
      }

      const removeNeuron = (idx) => {
        const n = neurons[idx]
        const li = n.layer
        layers[li] = layers[li].filter(i => i !== idx)
        const idxMap = new Map()
        let ni = 0
        for (let i = 0; i < neurons.length; i++) {
          if (i === idx) continue
          idxMap.set(i, ni++)
        }
        const newCache = new Map()
        wCache.forEach((w, key) => {
          const parts = key.split(',').map(Number)
          if (parts[0] === idx || parts[1] === idx) return
          const nk = idxMap.get(parts[0]) + ',' + idxMap.get(parts[1])
          newCache.set(nk, w)
        })
        wCache = newCache
        neurons.splice(idx, 1)
        for (let l = 0; l < NZONES; l++)
          layers[l] = layers[l].map(i => idxMap.get(i)).filter(i => i !== undefined)
        conns = []
        rebuildConns()
        if (li === 0) reassignInputPixels()
        snapOutputY()
        updateCounters()
        hoverNeuron = -1
        showStatus('Removed neuron from ' + ZLABELS[li] + '. ' + nextHint(), 3000)
      }

      const isInDigitBox = (px, py) => {
        const d = digitBoxRect
        return px >= d.x && px <= d.x + d.w && py >= d.y && py <= d.y + d.h
      }

      const canvasPopup = select('.neural-digit-classifier-canvas-popup')
      const canvasDigitBtns = select('[data-canvas-digit]', true)

      const showCanvasPopup = (canvasX, canvasY) => {
        const r = canvas.getBoundingClientRect()
        const stage = canvas.parentElement
        const sr = stage.getBoundingClientRect()
        let left = r.left - sr.left + canvasX + 8
        let top = r.top - sr.top + canvasY - 40
        const popW = 210, popH = 100
        if (left + popW > sr.width) left = sr.width - popW - 8
        if (top + popH > sr.height) top = sr.height - popH - 8
        if (top < 4) top = 4
        if (left < 4) left = 4
        canvasPopup.style.left = left + 'px'
        canvasPopup.style.top = top + 'px'
        canvasPopup.style.display = 'grid'
      }

      const hideCanvasPopup = () => { canvasPopup.style.display = 'none' }

      canvasDigitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          selectDigit(parseInt(btn.getAttribute('data-canvas-digit')))
          hideCanvasPopup()
        })
      })

      document.addEventListener('pointerdown', (e) => {
        if (canvasPopup.style.display !== 'none' && !canvasPopup.contains(e.target))
          hideCanvasPopup()
      })

      canvas.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect()
        mouseX = e.clientX - r.left
        mouseY = e.clientY - r.top
        hoverNeuron = findNeuronAt(mouseX, mouseY)
        if (hoverNeuron >= 0) canvas.style.cursor = 'pointer'
        else if (isInDigitBox(mouseX, mouseY)) canvas.style.cursor = 'pointer'
        else canvas.style.cursor = 'crosshair'
      })

      canvas.addEventListener('pointerleave', () => {
        hoverNeuron = -1
        mouseX = -1; mouseY = -1
        canvas.style.cursor = 'crosshair'
      })

      canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const r = canvas.getBoundingClientRect()
        const px = e.clientX - r.left, py = e.clientY - r.top
        if (isInDigitBox(px, py)) {
          if (canvasPopup.style.display !== 'none') hideCanvasPopup()
          else showCanvasPopup(px, py)
          return
        }
        hideCanvasPopup()
        const hit = findNeuronAt(px, py)
        if (hit >= 0) removeNeuron(hit)
        else addNeuron(px, py)
      })

      digitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          selectDigit(parseInt(btn.getAttribute('data-digit')))
          btn.blur()
        })
      })

      ctrlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-neural-action')
          if (action === 'train') trainNetwork()
          if (action === 'predict') runPredict()
          if (action === 'clear') clearAll()
          btn.blur()
        })
      })

      const easterEgg = select('.easter-egg-trigger')
      const classifierClose = select('.neural-digit-classifier-close')
      const eggMotion = select('.easter-egg-motion')
      const eggShell = select('.easter-egg-shell')
      const eggCore = select('.easter-egg-core')
      const classifierContent = select('.neural-digit-classifier-content')
      const EGG_CRACK_MS = 360
      const EGG_MORPH_MS = 420
      let eggAnimating = false

      const clearEggMorph = () => {
        const card = document.querySelector('.neural-digit-classifier-morph-card')
        if (card) card.remove()
      }

      const waitForEggMorph = (card) => new Promise(resolve => {
        let done = false
        const finish = () => {
          if (done) return
          done = true
          card.removeEventListener('transitionend', onEnd)
          resolve()
        }
        const onEnd = (evt) => {
          if (evt.target === card && evt.propertyName === 'height') finish()
        }
        card.addEventListener('transitionend', onEnd)
        window.setTimeout(finish, EGG_MORPH_MS + 20)
      })

      const createEggMorph = (rect, expanded) => {
        clearEggMorph()
        const card = document.createElement('div')
        card.className = 'neural-digit-classifier-morph-card'
        if (expanded) card.classList.add('is-expanded')
        card.style.top = `${rect.top}px`
        card.style.left = `${rect.left}px`
        card.style.width = `${rect.width}px`
        card.style.height = `${rect.height}px`
        document.body.appendChild(card)
        return card
      }

      const animateEggMorph = (card, rect, expanded) => {
        requestAnimationFrame(() => {
          card.classList.toggle('is-expanded', expanded)
          card.style.top = `${rect.top}px`
          card.style.left = `${rect.left}px`
          card.style.width = `${rect.width}px`
          card.style.height = `${rect.height}px`
        })
      }

      const resetGardenDisplay = () => {
        neuralDigitClassifier.style.visibility = ''
        neuralDigitClassifier.style.opacity = ''
        neuralDigitClassifier.style.pointerEvents = ''
        neuralDigitClassifier.style.transform = ''
        neuralDigitClassifier.style.transition = ''
      }

      const freezeEggPose = () => {
        if (eggMotion) eggMotion.style.transform = window.getComputedStyle(eggMotion).transform
        if (eggShell) eggShell.style.transform = window.getComputedStyle(eggShell).transform
      }

      const resetEggCrackState = () => {
        if (easterEgg) easterEgg.classList.remove('is-cracking')
        if (eggMotion) {
          eggMotion.style.animation = 'none'
          eggMotion.style.transform = ''
          void eggMotion.offsetWidth
          eggMotion.style.animation = ''
        }
        if (eggShell) {
          eggShell.style.animation = 'none'
          eggShell.style.transform = ''
          void eggShell.offsetWidth
          eggShell.style.animation = ''
        }
      }

      const openEggClassifier = async () => {
        if (!easterEgg || !neuralDigitClassifier || !classifierContent || eggAnimating) return
        eggAnimating = true
        easterEgg.style.pointerEvents = 'none'
        freezeEggPose()
        easterEgg.classList.add('is-cracking')

        await new Promise(resolve => window.setTimeout(resolve, EGG_CRACK_MS))

        const startRect = eggCore ? eggCore.getBoundingClientRect() : easterEgg.getBoundingClientRect()
        const card = createEggMorph(startRect, false)
        card.classList.add('is-seed')

        easterEgg.style.opacity = '0'
        easterEgg.style.display = 'none'

        neuralDigitClassifier.classList.add('is-content-hidden')
        neuralDigitClassifier.style.display = 'block'
        neuralDigitClassifier.style.visibility = 'hidden'
        neuralDigitClassifier.style.pointerEvents = 'none'
        neuralDigitClassifier.style.transform = 'none'
        neuralDigitClassifier.style.transition = 'none'
        resizeCanvas()

        const endRect = neuralDigitClassifier.getBoundingClientRect()
        animateEggMorph(card, endRect, true)

        await waitForEggMorph(card)
        clearEggMorph()
        easterEgg.style.display = 'none'
        easterEgg.style.opacity = ''
        easterEgg.style.pointerEvents = ''
        resetEggCrackState()
        neuralDigitClassifier.style.display = 'block'
        neuralDigitClassifier.style.visibility = 'visible'
        neuralDigitClassifier.style.transform = ''
        neuralDigitClassifier.style.transition = ''
        neuralDigitClassifier.classList.remove('is-content-hidden')
        neuralDigitClassifier.style.pointerEvents = ''
        resizeCanvas()
        eggAnimating = false
      }

      const closeEggClassifier = async () => {
        if (!easterEgg || !neuralDigitClassifier || eggAnimating || neuralDigitClassifier.style.display === 'none') return
        eggAnimating = true

        const startRect = neuralDigitClassifier.getBoundingClientRect()
        const card = createEggMorph(startRect, true)

        resetEggCrackState()
        easterEgg.style.display = 'flex'
        easterEgg.style.opacity = '0'
        easterEgg.style.transition = 'none'
        easterEgg.style.pointerEvents = 'none'
        const endRect = easterEgg.getBoundingClientRect()

        neuralDigitClassifier.style.display = 'none'
        resetGardenDisplay()

        animateEggMorph(card, endRect, false)

        requestAnimationFrame(() => {
          easterEgg.style.transition = `opacity 600ms ease 200ms`
          easterEgg.style.opacity = '1'
        })

        await waitForEggMorph(card)
        clearEggMorph()
        easterEgg.style.transition = ''
        easterEgg.style.opacity = ''
        easterEgg.style.pointerEvents = ''
        eggAnimating = false
      }

      if (easterEgg && neuralDigitClassifier) {
        easterEgg.addEventListener('click', openEggClassifier)
      }
      if (classifierClose && neuralDigitClassifier && easterEgg) {
        classifierClose.addEventListener('click', closeEggClassifier)
      }

      const hintsToggle = select('.neural-digit-classifier-hints-toggle')
      const hintsPanel = select('.neural-digit-classifier-hints')
      const hintSlides = select('.neural-digit-classifier-hint-slide', true)
      const hintPrev = select('.neural-digit-classifier-hint-prev')
      const hintNext = select('.neural-digit-classifier-hint-next')
      let hintIndex = 0

      const showHint = (nextIndex) => {
        if (!hintSlides.length) return
        hintIndex = (nextIndex + hintSlides.length) % hintSlides.length
        hintSlides.forEach((slide, idx) => slide.classList.toggle('active', idx === hintIndex))
      }

      if (hintsToggle && hintsPanel) {
        hintsToggle.addEventListener('click', () => {
          const open = hintsPanel.classList.toggle('open')
          hintsToggle.textContent = open ? 'Hide Hints' : 'Hints'
          hintsToggle.blur()
        })
      }
      if (hintPrev) {
        hintPrev.addEventListener('click', () => {
          showHint(hintIndex - 1)
          hintPrev.blur()
        })
      }
      if (hintNext) {
        hintNext.addEventListener('click', () => {
          showHint(hintIndex + 1)
          hintNext.blur()
        })
      }
      showHint(0)

      if ('ResizeObserver' in window)
        new ResizeObserver(() => resizeCanvas()).observe(canvas)
      else
        window.addEventListener('resize', resizeCanvas)



      document.addEventListener('visibilitychange', () => { lastTime = performance.now() })

      const animate = (now) => {
        const dt = Math.min(now - lastTime, 50)
        lastTime = now
        update(dt)
        render()
        requestAnimationFrame(animate)
      }

      initOutput()
      resizeCanvas()
      updateCounters()
      statusEl.textContent = 'Start by clicking in the Input column to add neurons.'
      statusEl.style.opacity = '1'
      lastTime = performance.now()
      requestAnimationFrame(animate)
    }
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()