// ═══════════════════════════════════════════════════════════════
// Back to Top Button — Vanilla JS
// Show after 300px scroll, smooth scroll to top, bilingual
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // Create button if not exists
  function createButton() {
    let btn = document.getElementById('backToTop');
    if (!btn) {
      btn = document.createElement('a');
      btn.id = 'backToTop';
      btn.href = '#';
      btn.setAttribute('aria-label', 'العودة للأعلى');
      
      // Bilingual text
      const isArabic = document.documentElement.lang === 'ar' || document.body.dir === 'rtl';
      const text = isArabic ? 'للأعلى' : 'Top';
      const fullText = isArabic ? 'العودة<br>للأعلى' : 'Back to<br>Top';
      
      btn.innerHTML = `
        <span>${text}</span>
        <i class="icon fas fa-arrow-up" aria-hidden="true"></i>
      `;
      
      document.body.appendChild(btn);
      return btn;
    }
    return btn;
  }

  // Toggle visibility
  function toggleButton() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Event listeners
  function init() {
    const btn = createButton();
    
    // Scroll listener
    window.addEventListener('scroll', toggleButton);
    
    // Click handler
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToTop();
    });
    
    // Keyboard support
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();
      }
    });
    
    // Initial toggle
    toggleButton();
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Language change support (for lang-toggle)
  document.addEventListener('languageChanged', function() {
    const btn = document.getElementById('backToTop');
    if (btn) {
      // Re-init for lang change
      const spans = btn.querySelectorAll('span');
      const isArabic = document.documentElement.lang === 'ar';
      spans[0].textContent = isArabic ? 'للأعلى' : 'Top';
      document.querySelector('#backToTop [aria-label]').setAttribute('aria-label', isArabic ? 'العودة للأعلى' : 'Back to top');
    }
  });

})();

