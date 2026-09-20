// =========================================================
// ZYLO TWEAKS — site scripts
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile hamburger menu ----
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after tapping a link (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- FAQ accordion ----
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close any other open FAQ item
      faqItems.forEach(function (other) {
        other.classList.remove('open');
      });

      // Toggle this one
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

});
