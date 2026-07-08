// ---------- Nav toggle + solid-on-scroll ----------
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add('solid');
      else header.classList.remove('solid');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

// ---------- Home hero: JMF -> Josh McFadden Films ----------
(function () {
  var track = document.getElementById('marqueeTrack');
  var copyA = document.getElementById('copyA');
  var clonesWrap = document.getElementById('introClones');
  if (!track || !copyA || !clonesWrap) return;

  var letters = Array.prototype.slice.call(copyA.querySelectorAll('.letter'));
  var clones = Array.prototype.slice.call(clonesWrap.querySelectorAll('.clone'));

  function runIntro() {
    // 1. position clones exactly over their JMF-stage spot (already laid out by flex),
    //    then compute delta to the matching anchor letter's real position.
    var clonePairs = clones.map(function (clone) {
      var targetIndex = clone.getAttribute('data-target');
      var target = copyA.querySelector('.letter[data-i="' + targetIndex + '"]');
      return { clone: clone, target: target };
    });

    // wait for the JMF pop-in to finish (last delay 0.27s + 0.35s duration)
    setTimeout(function () {
      clonePairs.forEach(function (pair, i) {
        var cRect = pair.clone.getBoundingClientRect();
        var tRect = pair.target.getBoundingClientRect();
        var dx = (tRect.left + tRect.width / 2) - (cRect.left + cRect.width / 2);
        var dy = (tRect.top + tRect.height / 2) - (cRect.top + cRect.height / 2);
        pair.clone.style.setProperty('--dx', dx + 'px');
        pair.clone.style.setProperty('--dy', dy + 'px');
        pair.clone.style.animationDelay = (i * 0.11) + 's';

        setTimeout(function () {
          pair.clone.classList.add('jump');
        }, i * 110);

        // reveal the real anchor letter right as the clone lands
        setTimeout(function () {
          pair.target.classList.add('anchor-shown');
        }, i * 110 + 400);
      });

      // hide the clone layer once the last one has landed
      var lastLand = (clonePairs.length - 1) * 110 + 430;
      setTimeout(function () {
        clonesWrap.classList.add('hide');
      }, lastLand);

      // teleport in the remaining (non-anchor) letters, staggered
      setTimeout(function () {
        var i = 0;
        letters.forEach(function (letter) {
          if (letter.classList.contains('anchor-shown')) return;
          letter.style.animationDelay = (i * 0.02) + 's';
          letter.classList.add('teleport-in');
          i++;
        });

        var assembleTime = i * 20 + 260;

        // start the seamless rolling marquee
        setTimeout(function () {
          var copyB = document.createElement('div');
          copyB.className = 'marquee-copy copy-b';
          copyB.setAttribute('aria-hidden', 'true');
          copyB.innerHTML = copyA.innerHTML;
          copyB.querySelectorAll('.letter').forEach(function (l) {
            l.classList.remove('teleport-in');
            l.style.animationDelay = '';
          });
          track.appendChild(copyB);
          track.style.transform = 'translate(-25%, -50%)';
          track.classList.add('rolling');
        }, assembleTime);
      }, lastLand + 80);
    }, 620);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runIntro);
  } else {
    runIntro();
  }
})();

// ---------- Work page filters ----------
(function () {
  var buttons = document.querySelectorAll('.work-filters button');
  var cards = document.querySelectorAll('.project-card');
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cat = card.getAttribute('data-category');
        card.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
      });
    });
  });
})();

// ---------- Gallery lightbox ----------
(function () {
  var gallery = document.querySelector('.gallery');
  if (!gallery) return;

  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);
  var lbImg = lightbox.querySelector('img');

  gallery.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('click', function () {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  function close() { lightbox.classList.remove('open'); lbImg.src = ''; }
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

// ---------- Contact form (mailto) ----------
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var status = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill out every field.';
      return;
    }

    var subject = encodeURIComponent('Project inquiry from ' + name);
    var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:mcfaddenjosh6@gmail.com?subject=' + subject + '&body=' + body;
    status.textContent = 'Opening your email client…';
  });
})();
