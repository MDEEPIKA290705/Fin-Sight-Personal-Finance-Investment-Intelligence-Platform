/**
 * cursor.js — Ultra-Professional Animated Cursor Engine for FinSight
 */
(function () {
  'use strict';

  // Restore sidebar state immediately
  const savedState = localStorage.getItem('sidebarState');
  const sidebarEl = document.getElementById('sidebar');
  if (savedState === 'open') {
    document.body.classList.add('sidebar-open');
    if (sidebarEl) sidebarEl.classList.add('open');
  } else {
    document.body.classList.remove('sidebar-open');
    if (sidebarEl) sidebarEl.classList.remove('open');
  }

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const isCustomCursorDisabled = !dot || !ring || (window.getComputedStyle && getComputedStyle(dot).display === 'none');

  if (!isCustomCursorDisabled) {

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let targetX = -100, targetY = -100;
  let isHovered = false;

  // Determine trail color based on theme
  function getThemeColor() {
    const body = document.body;
    if (body.classList.contains('theme-income'))  return '#10B981';
    if (body.classList.contains('theme-expense')) return '#F97316';
    if (body.classList.contains('theme-budget'))  return '#8B5CF6';
    if (body.classList.contains('theme-invest'))  return '#06B6D4';
    return '#3B82F6'; // Default Dashboard Electric Blue
  }

  // Mouse Move Event Listener
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant Dot movement
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';

    // Particle Trail
    spawnTrail(mouseX, mouseY);
  });

  // Smooth Ring Follow Loop via RequestAnimationFrame (Lerp Physics)
  function animateRing() {
    const ease = 0.16; // Liquid fluid easing
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    ring.style.left = ringX.toFixed(2) + 'px';
    ring.style.top = ringY.toFixed(2) + 'px';

    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Interactive Hover Selectors
  const interactiveSelectors = 'a, button, [role="button"], .nav-item, .quick-nav-item, .stat-card, .kpi-card, .panel, .guided-tour-nav-btn, .tour-btn, .tour-header-btn, .page-submit-btn, .sidebar-reset-btn';
  const inputSelectors = 'input[type="text"], input[type="number"], input[type="email"], input[type="password"], input[type="date"], textarea, select';

  document.addEventListener('mouseover', (e) => {
    const interactiveTarget = e.target.closest(interactiveSelectors);
    const inputTarget = e.target.closest(inputSelectors);

    if (interactiveTarget) {
      document.body.classList.add('cursor-hover');
      document.body.classList.remove('cursor-input');
    } else if (inputTarget) {
      document.body.classList.add('cursor-input');
      document.body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
    if (e.target.closest(inputSelectors)) {
      document.body.classList.remove('cursor-input');
    }
  });

  // Click Effects & Ripple Shockwave
  document.addEventListener('mousedown', (e) => {
    document.body.classList.add('cursor-click');
    spawnRipple(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hide cursor on window exit
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  // Particle Sparkle Trail
  let lastTrailTime = 0;
  function spawnTrail(x, y) {
    const now = Date.now();
    if (now - lastTrailTime < 35) return; // Throttled at ~30fps
    lastTrailTime = now;

    const particle = document.createElement('div');
    particle.className = 'cursor-trail';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = getThemeColor();
    particle.style.color = getThemeColor();
    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 550);
  }

  // Click Shockwave Ripple
  function spawnRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.borderColor = getThemeColor();
    document.body.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 450);
  }
  }

  // Global Sidebar Toggle Handler
  function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn && sidebar) {
      const savedState = localStorage.getItem('sidebarState');
      if (savedState === 'open') {
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
      } else {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
      }

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
        localStorage.setItem('sidebarState', isOpen ? 'open' : 'closed');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarToggle);
  } else {
    initSidebarToggle();
  }
})();
