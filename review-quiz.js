/*
  Opika · Free Visibility & Growth Review quiz
  ---------------------------------------------------------------------------
  One script, used everywhere the quiz appears. It looks and behaves like the
  "Schedule a call" popup (same backdrop, dialog, header and side panel).

  Popup:   add  <script src="/review-quiz.js" defer></script>  to a page, then put
           data-open-review  on any link or button, e.g.
           <a class="btn btn-primary" data-open-review href="/free-review">Get a free review</a>
           (the href is the fallback if JavaScript is off). Visiting a page with
           #free-review in the URL opens it too.
  Inline:  <div data-review-quiz-inline></div>  renders the same quiz in the page
           (used by /free-review).

  Three questions on one screen. They must match lead-magnet/lib/questions.js (npm test checks this).
  Answers are posted to /api/review.
*/
(function () {
  if (window.__opikaReviewQuiz) return;
  window.__opikaReviewQuiz = true;

  var CSS = [
    '.rq-modal{position:fixed;inset:0;z-index:310;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;pointer-events:none;transition:opacity 220ms ease;font-family:"DM Sans",system-ui,sans-serif}',
    '.rq-modal.open{opacity:1;pointer-events:auto}',
    '.rq-backdrop{position:absolute;inset:0;background:rgba(18,26,33,.52);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
    '.rq-dialog{position:relative;width:min(1180px,100%);max-height:min(92vh,900px);background:rgba(255,255,255,.98);border:1px solid rgba(48,90,129,.08);border-radius:28px;box-shadow:0 24px 80px rgba(18,26,33,.24);overflow:hidden;transform:translateY(16px) scale(.98);transition:transform 260ms cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column;text-align:left}',
    '.rq-modal.open .rq-dialog{transform:none}',
    '.rq-inline .rq-dialog{transform:none;max-height:none;box-shadow:0 1px 3px rgba(33,44,53,.05),0 18px 50px rgba(33,44,53,.08)}',
    '.rq-close{position:absolute;top:.9rem;right:.9rem;width:42px;height:42px;border:none;border-radius:999px;background:rgba(48,90,129,.08);color:#212C35;font-size:1.5rem;line-height:1;cursor:pointer;transition:background 180ms ease;z-index:4}',
    '.rq-close:hover{background:rgba(48,90,129,.14)}',
    '.rq-head{padding:1rem 1.25rem .85rem;border-bottom:1px solid rgba(48,90,129,.08);background:rgba(255,255,255,.96)}',
    '.rq-head-inner{max-width:760px;padding-right:3.5rem}',
    '.rq-head h2{font-family:"DM Serif Display",Georgia,serif;font-weight:400;color:#212C35;font-size:clamp(1.45rem,2vw,2rem);margin:.45rem 0 0;line-height:1.08;letter-spacing:-.01em}',
    '.rq-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(320px,.65fr);min-height:0;flex:1}',
    '.rq-main{padding:1rem 1rem 1rem 1rem;overflow:auto;min-height:0}',
    '.rq-card{background:#fff;border:1px solid rgba(48,90,129,.1);border-radius:20px;box-shadow:0 10px 30px rgba(33,44,53,.08);padding:1.6rem 1.7rem 1.4rem}',
    '.rq-side{padding:1rem;border-left:1px solid rgba(48,90,129,.08);background:rgba(248,250,251,.78);overflow:auto}',
    '.rq-side-card{background:rgba(255,255,255,.9);border:1px solid rgba(48,90,129,.08);border-radius:18px;padding:1rem;box-shadow:0 6px 22px rgba(33,44,53,.05)}',
    '.rq-side h3{font-family:"DM Sans",sans-serif;font-size:1.04rem;font-weight:700;color:#212C35;margin:0}',
    '.rq-side-copy{color:rgba(33,44,53,.72);font-size:.9rem;line-height:1.55;margin:.18rem 0 0}',
    '.rq-toc{list-style:none;margin:.9rem 0 0;padding:0;border-top:1px solid rgba(48,90,129,.1)}',
    '.rq-toc li{display:grid;grid-template-columns:1.9rem 1fr;gap:.3rem;padding:.7rem 0;border-bottom:1px solid rgba(48,90,129,.1);font-size:.88rem;line-height:1.45;color:rgba(33,44,53,.72)}',
    '.rq-toc .n{font-family:"DM Serif Display",Georgia,serif;color:#FF4D71;font-size:1rem}',
    '.rq-toc b{display:block;color:#212C35;font-weight:600}',
    '.rq-doc{display:flex;gap:.9rem;align-items:center;margin-top:1rem}',
    '.rq-doc-thumb{flex:none;width:74px;height:96px;border-radius:4px;overflow:hidden;box-shadow:0 6px 18px rgba(33,44,53,.14);background:#fff}',
    '.rq-doc-thumb i{display:block;height:44%;background:linear-gradient(160deg,#305A81,#212C35);position:relative}',
    '.rq-doc-thumb i::after{content:"";position:absolute;left:8px;bottom:8px;width:16px;height:2px;background:#FF4D71}',
    '.rq-doc-thumb s{display:block;height:3px;margin:6px 8px 0;background:#e3e8ed;text-decoration:none}',
    '.rq-doc p{margin:0;font-size:.84rem;line-height:1.5;color:rgba(33,44,53,.72)}',
    '.rq-doc p b{display:block;color:#212C35;font-size:.9rem}',
    '.rq-note{margin:.9rem 0 0;font-size:.8rem;line-height:1.55;color:rgba(33,44,53,.5)}',
    '.rq-alt{margin-top:.8rem;padding-top:.8rem;border-top:1px solid rgba(48,90,129,.1);font-size:.86rem;color:rgba(33,44,53,.72)}',
    '.rq-alt a{color:#305A81;font-weight:700;text-decoration:none}',
    '.rq-intro{margin:0 0 1.3rem;color:rgba(33,44,53,.6);font-size:.94rem}',
    '.rq-intro b{color:#212C35}',
    '.rq-q-block{display:grid;grid-template-columns:30px 1fr;gap:.85rem;padding:1.15rem 0;border-top:1px solid rgba(48,90,129,.08)}',
    '.rq-q-block:first-of-type{border-top:0;padding-top:0}',
    '.rq-qn{width:30px;height:30px;border-radius:50%;background:rgba(255,77,113,.1);color:#FF4D71;font-family:"DM Serif Display",Georgia,serif;font-size:1rem;display:flex;align-items:center;justify-content:center}',
    '.rq-q-title{font-size:1rem;font-weight:700;color:#212C35;margin:.2rem 0 .65rem}',
    '.rq-hint{font-size:.8rem;color:rgba(33,44,53,.5);margin:0}',
    '.rq-field{display:flex;flex-direction:column;gap:.38rem;margin-bottom:.8rem}',
    '.rq-field:last-child{margin-bottom:0}',
    '.rq-field>label,.rq-field>.rq-q{font-size:.88rem;font-weight:600;color:#212C35}',
    '.rq-opt{font-weight:400;color:rgba(33,44,53,.5)}',
    '.rq-card input[type=text],.rq-card input[type=email],.rq-card input[type=url],.rq-card textarea{width:100%;box-sizing:border-box;border:1px solid rgba(48,90,129,.14);border-radius:12px;padding:.85rem .95rem;font:inherit;font-size:.98rem;color:#212C35;background:rgba(255,255,255,.96);transition:border-color .15s,box-shadow .15s}',
    '.rq-card textarea{resize:vertical;min-height:84px;max-height:180px}',
    '.rq-card input::placeholder,.rq-card textarea::placeholder{color:rgba(33,44,53,.4)}',
    '.rq-card input:focus,.rq-card textarea:focus{outline:none;border-color:#FF4D71;box-shadow:0 0 0 3px rgba(255,77,113,.14)}',
    '.rq-row{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}',
    '.rq-choices{display:flex;flex-wrap:wrap;gap:.45rem}',
    '.rq-choices.grid{display:grid;grid-template-columns:1fr 1fr}',
    '.rq-choices label{position:relative;display:flex;align-items:center;gap:.55rem;padding:.6rem .85rem;border:1px solid rgba(48,90,129,.16);border-radius:12px;background:rgba(255,255,255,.96);cursor:pointer;font-size:.9rem;color:#212C35;line-height:1.3;transition:all .15s}',
    '.rq-choices label:hover{border-color:rgba(48,90,129,.4)}',
    '.rq-choices input{position:absolute;opacity:0;pointer-events:none}',
    '.rq-choices label::before{content:"";flex:none;width:15px;height:15px;border:1.5px solid rgba(48,90,129,.4);border-radius:50%;background:#fff;transition:all .15s}',
    '.rq-choices.multi label::before{border-radius:4px}',
    '.rq-choices label:has(input:checked){background:rgba(255,77,113,.08);border-color:#FF4D71;font-weight:600}',
    '.rq-choices label:has(input:checked)::before{border-color:#FF4D71;background:#FF4D71;box-shadow:inset 0 0 0 2.5px #fff}',
    '.rq-choices.multi label:has(input:checked)::before{box-shadow:none;background:#FF4D71 url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M4.6 8.6 2 6l1-1 1.6 1.6L9 2.2l1 1z\' fill=\'%23fff\'/%3E%3C/svg%3E") center/11px no-repeat}',
    '.rq-choices label:has(input:focus-visible){outline:2px solid rgba(255,77,113,.45);outline-offset:1px}',
    '.rq-choices label:has(input:disabled){opacity:.45;cursor:not-allowed}',
    '.rq-err{display:none;color:#c42b4a;font-size:.84rem}',
    '.rq-field.invalid .rq-err{display:block}',
    '.rq-field.invalid input[type=text],.rq-field.invalid input[type=email],.rq-field.invalid input[type=url],.rq-field.invalid textarea{border-color:#e46b84}',
    '.rq-field.invalid .rq-choices label{border-color:rgba(228,107,132,.6)}',
    '.rq-nav{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:.4rem;padding-top:1.2rem;border-top:1px solid rgba(48,90,129,.08)}',
    '.rq-nav .rq-hint{flex:1;min-width:180px}',
    '.rq-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.9rem 1.6rem;border-radius:12px;border:none;font-family:"DM Sans",sans-serif;font-weight:600;font-size:.98rem;cursor:pointer;transition:transform 200ms ease,box-shadow 200ms ease,background 200ms ease}',
    '.rq-btn-primary{background:#FF4D71;color:#fff;box-shadow:0 4px 16px rgba(255,77,113,.3)}',
    '.rq-btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(255,77,113,.28)}',
    '.rq-btn[disabled]{opacity:.6;cursor:wait;transform:none}',
    '.rq-btn[hidden]{display:none}',
    '.rq-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px}',
    '.rq-formerr{display:none;margin-top:1rem;background:rgba(255,77,113,.08);color:#b3243f;border-radius:10px;padding:.8rem 1rem;font-size:.92rem}',
    '.rq-done{display:none;padding:.4rem .2rem}',
    '.rq-done .tick{width:54px;height:54px;border-radius:50%;margin:0 0 1rem;background:rgba(255,77,113,.1);color:#FF4D71;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:700}',
    '.rq-done h3{font-family:"DM Serif Display",Georgia,serif;font-weight:400;color:#212C35;font-size:1.9rem;margin:0 0 .5rem}',
    '.rq-done p{margin:0;color:rgba(33,44,53,.75);line-height:1.6}',
    '.rq-done ol{margin:1.2rem 0 0;padding:0;list-style:none;border-top:1px solid rgba(48,90,129,.1)}',
    '.rq-done li{display:grid;grid-template-columns:2rem 1fr;padding:.7rem 0;border-bottom:1px solid rgba(48,90,129,.1);font-size:.93rem;color:rgba(33,44,53,.75)}',
    '.rq-done li span{font-family:"DM Serif Display",Georgia,serif;color:#FF4D71}',
    'body.rq-open{overflow:hidden}',
    '@media (max-width:1024px){.rq-layout{grid-template-columns:minmax(0,1fr) 300px}}',
    '@media (max-width:768px){.rq-modal{padding:.5rem;align-items:flex-end}.rq-dialog{width:100%;max-height:94vh;border-radius:24px 24px 0 0}.rq-inline .rq-dialog{border-radius:24px}.rq-layout{display:block;overflow:auto;-webkit-overflow-scrolling:touch}.rq-main{overflow:visible;padding:.85rem}.rq-side-copy,.rq-doc{display:none}.rq-side{border-left:none;border-top:1px solid rgba(48,90,129,.08);padding:.85rem;overflow:visible}.rq-card{padding:1.3rem 1.1rem}.rq-row,.rq-choices.grid{grid-template-columns:1fr}}',
  ].join('\n');

  function checks(name, values) {
    return '<div class="rq-choices multi">' + values.map(function (v) {
      var e = v.replace(/&/g, '&amp;');
      return '<label><input type="checkbox" name="' + name + '" value="' + e + '">' + e + '</label>';
    }).join('') + '</div>';
  }

  // The three questions, on one screen. Keep in step with lead-magnet/lib/questions.js.
  var FOCUS = ['Getting found on Google & AI', 'More reviews & trust', 'More leads & better follow-up', 'Saving time with AI & automation', 'Not sure yet: find the biggest win'];
  var QUESTIONS =
    '<p class="rq-intro"><b>Three quick questions, about 30 seconds.</b> We research the rest from your website and public listings.</p>' +

    '<div class="rq-q-block"><span class="rq-qn">1</span><div>' +
      '<label class="rq-q-title" for="rq-site">Your website</label>' +
      '<div class="rq-field"><input id="rq-site" name="site" type="text" inputmode="url" required maxlength="200" autocomplete="url" placeholder="yourbusiness.com"><div class="rq-err">Please enter your website, or your business name and town.</div></div>' +
      '<p class="rq-hint">No website? Type your business name and town instead.</p>' +
    '</div></div>' +

    '<div class="rq-q-block"><span class="rq-qn">2</span><div>' +
      '<div class="rq-q-title">What would help most right now? <span class="rq-opt">(pick up to 2)</span></div>' +
      '<div class="rq-field" data-choice="focus" data-required data-max="2">' + checks('focus', FOCUS) + '<div class="rq-err">Please pick at least one.</div></div>' +
      '<div class="rq-field"><input id="rq-note" name="note" type="text" maxlength="300" aria-label="Your biggest challenge (optional)" placeholder="Biggest challenge? (optional)"></div>' +
    '</div></div>' +

    '<div class="rq-q-block"><span class="rq-qn">3</span><div>' +
      '<div class="rq-q-title">Where should we send it?</div>' +
      '<div class="rq-row">' +
        '<div class="rq-field"><input id="rq-first_name" name="first_name" type="text" required maxlength="60" autocomplete="given-name" aria-label="First name" placeholder="First name"><div class="rq-err">Please enter your first name.</div></div>' +
        '<div class="rq-field"><input id="rq-email" name="email" type="email" required maxlength="254" autocomplete="email" aria-label="Work email" placeholder="Work email"><div class="rq-err">Please enter a valid email.</div></div>' +
      '</div>' +
      '<input class="rq-hp" type="text" name="website_url" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '</div></div>';

  function dialogHTML(inline) {
    return '' +
      '<div class="rq-dialog"' + (inline ? '' : ' role="dialog" aria-modal="true" aria-labelledby="rqTitle"') + '>' +
        (inline ? '' : '<button aria-label="Close" class="rq-close" data-close-review type="button">×</button>') +
        '<div class="rq-head"><div class="rq-head-inner"><h2 id="rqTitle">Get your free Visibility &amp; Growth Review.</h2></div></div>' +
        '<div class="rq-layout">' +
          '<div class="rq-main"><div class="rq-card">' +
            '<form class="rq-form" novalidate>' +
              QUESTIONS +
              '<div class="rq-nav"><button type="submit" class="rq-btn rq-btn-primary rq-next">Send me my free review</button><p class="rq-hint">A 4-page PDF in your inbox, usually within a few minutes.</p></div>' +
              '<div class="rq-formerr" role="alert"></div>' +
            '</form>' +
            '<div class="rq-done" aria-live="polite"><div class="tick">✓</div><h3>Your review is being prepared</h3><p class="rq-done-msg">It will be in your inbox in a few minutes.</p>' +
              '<ol><li><span>1</span><div>We research your website, public listings and local competitors.</div></li><li><span>2</span><div>We write your review and email it to you as a 4-page PDF.</div></li><li><span>3</span><div>If you\'d like, book a 30-minute call and we\'ll walk you through it.</div></li></ol>' +
              '<p class="rq-note">Can\'t see it after 15 minutes? Check your promotions or spam folder, or email <a href="mailto:info@opika.co">info@opika.co</a>.</p></div>' +
          '</div></div>' +
          '<div class="rq-side"><div class="rq-side-card">' +
            '<h3>What you\'ll receive</h3><p class="rq-side-copy">A formal, personalised review of how your business shows up on Google and AI assistants.</p>' +
            '<ol class="rq-toc">' +
              '<li><span class="n">01</span><div><b>Executive summary</b>What\'s already working and the three opportunities at a glance.</div></li>' +
              '<li><span class="n">02</span><div><b>Three opportunities</b>The evidence we found, why it matters and what to do.</div></li>' +
              '<li><span class="n">03</span><div><b>Where we would start</b>A prioritised 90-day plan, with or without us.</div></li>' +
            '</ol>' +
            '<div class="rq-doc"><div class="rq-doc-thumb" aria-hidden="true"><i></i><s></s><s style="width:60%"></s><s></s></div><p><b>Free · 4-page PDF</b>Emailed to you, usually within a few minutes.</p></div>' +
            '<p class="rq-note">Data submitted is private and will not be shared externally.</p>' +
            '<div class="rq-alt">Prefer to talk first? <a href="https://calendly.com/aniket-opika/you" data-review-to-call target="_blank" rel="noopener">Schedule a call →</a></div>' +
          '</div></div>' +
        '</div>' +
      '</div>';
  }

  function wire(root) {
    var form = root.querySelector('.rq-form');
    var next = form.querySelector('.rq-next');
    var errBox = form.querySelector('.rq-formerr');
    var main = root.querySelector('.rq-main');

    function valid() {
      var ok = true;
      form.querySelectorAll('.rq-field').forEach(function (f) {
        var bad = false;
        var name = f.getAttribute('data-choice');
        if (name) bad = f.hasAttribute('data-required') && !form.querySelector('input[name="' + name + '"]:checked');
        else {
          var el = f.querySelector('input,textarea');
          if (el) bad = !el.checkValidity() || (el.required && el.value.trim().length < (el.name === 'site' ? 3 : 1));
        }
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      var first = form.querySelector('.rq-field.invalid input:not([type=checkbox])');
      if (first) first.focus();
      return ok;
    }

    form.addEventListener('change', function (e) {
      var f = e.target.closest('.rq-field');
      if (!f) return;
      f.classList.remove('invalid');
      var max = Number(f.getAttribute('data-max'));
      if (max) {
        var n = f.querySelectorAll('input:checked').length;
        f.querySelectorAll('input[type=checkbox]').forEach(function (b) { b.disabled = !b.checked && n >= max; });
      }
    });
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.rq-field');
      if (f && e.target.value.trim()) f.classList.remove('invalid');
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      errBox.style.display = 'none';
      if (!valid()) return;

      var data = { focus: [] };
      new FormData(form).forEach(function (v, k) {
        if (k === 'focus') data.focus.push(v);
        else data[k] = v;
      });
      next.disabled = true; next.textContent = 'Sending…';
      try {
        var res = await fetch('/api/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        var out = await res.json();
        if (!out.ok) throw out;
        root.querySelector('.rq-done-msg').textContent = out.message;
        form.style.display = 'none';
        root.querySelector('.rq-done').style.display = 'block';
        if (main) main.scrollTop = 0;
        if (window.gtag) gtag('event', 'generate_lead', { lead_magnet: 'visibility_growth_review', focus: data.focus.join('; ') });
        if (window.clarity) clarity('event', 'review_requested');
      } catch (err) {
        if (err && err.errors) {
          Object.keys(err.errors).forEach(function (k) {
            var el = form.querySelector('[name="' + k + '"]');
            if (el) el.closest('.rq-field').classList.add('invalid');
          });
        }
        errBox.textContent = (err && err.error) || 'Something went wrong. Please try again, or email info@opika.co.';
        errBox.style.display = 'block';
      }
      next.disabled = false; next.textContent = 'Send me my free review';
    });

    return { reset: function () {} };
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Inline version (/free-review)
    document.querySelectorAll('[data-review-quiz-inline]').forEach(function (host) {
      host.classList.add('rq-inline');
      host.innerHTML = dialogHTML(true);
      wire(host);
      var alt = host.querySelector('[data-review-to-call]');
      if (alt) alt.removeAttribute('data-review-to-call');
    });

    // Popup version
    var triggers = document.querySelectorAll('[data-open-review]');
    var wantsHash = location.hash === '#free-review';
    if (!triggers.length && !wantsHash) return;

    var modal = document.createElement('div');
    modal.className = 'rq-modal';
    modal.id = 'reviewModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<div class="rq-backdrop" data-close-review></div>' + dialogHTML(false);
    document.body.appendChild(modal);
    var quiz = wire(modal);
    var lastFocus = null;

    function open(e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      quiz.reset();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('rq-open');
      setTimeout(function () {
        var f = modal.querySelector('#rq-site');
        if (f && window.innerWidth > 768) f.focus({ preventScroll: true });
      }, 60);
      if (window.gtag) gtag('event', 'review_quiz_open');
    }
    function close() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('rq-open');
      if (location.hash === '#free-review') history.replaceState(null, '', location.pathname + location.search);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-open-review]');
      if (t) open(e);
    });
    modal.querySelectorAll('[data-close-review]').forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    // "Prefer to talk first?" → switch to the Schedule a call popup when the page has one.
    var toCall = modal.querySelector('[data-review-to-call]');
    var callTrigger = document.querySelector('[data-open-cta]');
    if (toCall && callTrigger) {
      toCall.removeAttribute('target');
      toCall.addEventListener('click', function (e) {
        e.preventDefault();
        close();
        callTrigger.click();
      });
    }

    if (wantsHash) open();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
