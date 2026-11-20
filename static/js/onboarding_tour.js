/**
 * FinSight Interactive Onboarding & System Navigation Tour
 */
(function () {
  'use strict';

  const TOUR_STEPS = [
    {
      target: null, // Modal center
      title: "Welcome to FinSight! 🎉",
      body: "Congratulations on creating your new account! Let's take a quick 1-minute guided tour through your financial command center.",
      icon: "bi-stars",
      badge: "Getting Started"
    },
    {
      target: "#sidebar",
      title: "Navigation Center 🧭",
      body: "Use this sidebar to easily navigate through your Dashboard, Finances (Income & Expenses), Investments, Financial Goals, Health Score, AI Insights, and Reports.",
      icon: "bi-layout-sidebar-inset",
      badge: "Step 2 of 5"
    },
    {
      target: ".smart-kpi-row",
      title: "Real-Time Financial KPIs 📊",
      body: "Track your Total Income, Expenses, Monthly Budget usage, Savings Rate, and Active Goals at a glance with real-time updates.",
      icon: "bi-pie-chart-fill",
      badge: "Step 3 of 5"
    },
    {
      target: ".top-header-bar-right",
      title: "Alerts, Themes & Profile 🔔",
      body: "Check automated budget alerts, switch seamlessly between Dark and Light modes, or update your profile settings anytime.",
      icon: "bi-bell-fill",
      badge: "Step 4 of 5"
    },
    {
      target: ".ai-section",
      title: "Smart AI Insights 🤖",
      body: "FinSight's built-in AI continuously monitors your spending patterns to deliver personalized financial recommendations and warnings.",
      icon: "bi-robot",
      badge: "Step 5 of 5"
    },
    {
      target: null, // Modal center finish
      title: "You're Ready to Go! 🚀",
      body: "You're all set to take control of your finances! You can replay this Guided Tour anytime using the 🧭 Guided Tour button in the sidebar.",
      icon: "bi-check-circle-fill",
      badge: "Complete"
    }
  ];

  let currentStepIndex = 0;
  let tourOverlay = null;
  let highlightBox = null;
  let tooltipCard = null;
  let isActive = false;
  let activeTargetEl = null;

  function createTourDOM() {
    if (document.getElementById('tour-overlay')) return;

    // Overlay
    tourOverlay = document.createElement('div');
    tourOverlay.id = 'tour-overlay';
    document.body.appendChild(tourOverlay);

    // Highlight Box
    highlightBox = document.createElement('div');
    highlightBox.id = 'tour-highlight-box';
    document.body.appendChild(highlightBox);

    // Tooltip Card
    tooltipCard = document.createElement('div');
    tooltipCard.id = 'tour-tooltip-card';
    tooltipCard.innerHTML = `
      <div class="tour-header">
        <span class="tour-badge" id="tour-badge">Step 1</span>
        <button class="tour-close-btn" id="tour-close-btn" title="Skip Tour"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="tour-title" id="tour-title">
        <i class="bi bi-stars"></i>
        <span>Welcome</span>
      </div>
      <div class="tour-body" id="tour-body">Tour details...</div>
      <div class="tour-progress-bar-wrap">
        <div class="tour-progress-bar" id="tour-progress-bar"></div>
      </div>
      <div class="tour-footer">
        <span class="tour-step-count" id="tour-step-count">1 of 6</span>
        <div class="tour-actions">
          <button class="tour-btn tour-btn-secondary" id="tour-prev-btn"><i class="bi bi-arrow-left"></i> Back</button>
          <button class="tour-btn tour-btn-primary" id="tour-next-btn">Next <i class="bi bi-arrow-right"></i></button>
        </div>
      </div>
    `;
    document.body.appendChild(tooltipCard);

    // Event Listeners
    document.getElementById('tour-close-btn').addEventListener('click', endTour);
    document.getElementById('tour-prev-btn').addEventListener('click', prevStep);
    document.getElementById('tour-next-btn').addEventListener('click', nextStep);

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (!isActive) return;
      if (e.key === 'Escape') endTour();
      else if (e.key === 'ArrowRight') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
    });
  }

  function clearActiveTarget() {
    if (activeTargetEl) {
      activeTargetEl.classList.remove('tour-active-target');
      activeTargetEl = null;
    }
  }

  function renderStep(index) {
    if (index < 0 || index >= TOUR_STEPS.length) return;

    currentStepIndex = index;
    const step = TOUR_STEPS[index];

    // Elements
    const badgeEl = document.getElementById('tour-badge');
    const titleEl = document.getElementById('tour-title');
    const bodyEl = document.getElementById('tour-body');
    const progressBar = document.getElementById('tour-progress-bar');
    const stepCountEl = document.getElementById('tour-step-count');
    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');

    // Update Text Content
    badgeEl.textContent = step.badge || `Step ${index + 1}`;
    titleEl.innerHTML = `<i class="bi ${step.icon}"></i><span>${step.title}</span>`;
    bodyEl.textContent = step.body;

    // Progress Bar
    const progressPct = Math.round(((index + 1) / TOUR_STEPS.length) * 100);
    progressBar.style.width = `${progressPct}%`;
    stepCountEl.textContent = `${index + 1} of ${TOUR_STEPS.length}`;

    // Prev Button State
    if (index === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'inline-flex';
    }

    // Next Button State
    if (index === TOUR_STEPS.length - 1) {
      nextBtn.innerHTML = `Finish <i class="bi bi-check-lg"></i>`;
      nextBtn.classList.remove('tour-btn-primary');
      nextBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      nextBtn.style.color = '#FFFFFF';
    } else {
      nextBtn.innerHTML = `Next <i class="bi bi-arrow-right"></i>`;
      nextBtn.classList.add('tour-btn-primary');
      nextBtn.style.background = '';
    }

    positionSpotlightAndTooltip(step.target);
  }

  function positionSpotlightAndTooltip(targetSelector) {
    clearActiveTarget();

    const targetEl = targetSelector ? document.querySelector(targetSelector) : null;

    if (!targetEl || targetEl.offsetWidth === 0) {
      // Center Modal Position
      highlightBox.style.opacity = '0';
      highlightBox.style.pointerEvents = 'none';

      tooltipCard.style.top = '50%';
      tooltipCard.style.left = '50%';
      tooltipCard.style.transform = 'translate(-50%, -50%) scale(1)';
      return;
    }

    // Bring active target above overlay for crisp clarity
    activeTargetEl = targetEl;
    activeTargetEl.classList.add('tour-active-target');

    // Scroll into view gently if needed
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

    const rect = targetEl.getBoundingClientRect();
    const padding = 8;

    // Highlight Box Position
    highlightBox.style.opacity = '1';
    highlightBox.style.top = `${Math.max(0, rect.top - padding)}px`;
    highlightBox.style.left = `${Math.max(0, rect.left - padding)}px`;
    highlightBox.style.width = `${rect.width + padding * 2}px`;
    highlightBox.style.height = `${rect.height + padding * 2}px`;

    // Tooltip Placement Logic
    const tooltipWidth = 380;
    const tooltipHeight = tooltipCard.offsetHeight || 240;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // Default: try placing below
    if (rect.bottom + tooltipHeight + 20 < viewportHeight) {
      top = rect.bottom + 16;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }
    // Else try placing above
    else if (rect.top - tooltipHeight - 20 > 0) {
      top = rect.top - tooltipHeight - 16;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }
    // Else try placing right
    else if (rect.right + tooltipWidth + 20 < viewportWidth) {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + 16;
    }
    // Else center
    else {
      top = viewportHeight / 2 - tooltipHeight / 2;
      left = viewportWidth / 2 - tooltipWidth / 2;
    }

    // Bound within viewport
    left = Math.max(16, Math.min(left, viewportWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, viewportHeight - tooltipHeight - 16));

    tooltipCard.style.top = `${top}px`;
    tooltipCard.style.left = `${left}px`;
    tooltipCard.style.transform = 'translate(0, 0) scale(1)';
  }

  function handleReposition() {
    if (!isActive) return;
    const step = TOUR_STEPS[currentStepIndex];
    positionSpotlightAndTooltip(step.target);
  }

  function startTour() {
    createTourDOM();
    isActive = true;
    tourOverlay.classList.add('active');
    tooltipCard.classList.add('active');
    renderStep(0);
  }

  function nextStep() {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      renderStep(currentStepIndex + 1);
    } else {
      endTour();
    }
  }

  function prevStep() {
    if (currentStepIndex > 0) {
      renderStep(currentStepIndex - 1);
    }
  }

  function endTour() {
    if (!isActive) return;
    isActive = false;

    clearActiveTarget();

    if (tourOverlay) tourOverlay.classList.remove('active');
    if (tooltipCard) tooltipCard.classList.remove('active');
    if (highlightBox) highlightBox.style.opacity = '0';

    // Call API to save completion state
    fetch('/api/complete-tour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("Tour status updated:", data);
    })
    .catch(err => {
      console.warn("Could not record tour completion:", err);
    });
  }

  // Expose global method to trigger tour anytime
  window.startFinSightTour = startTour;

  // Auto Start for First-Time Logins
  document.addEventListener('DOMContentLoaded', () => {
    if (window.IS_FIRST_LOGIN === true) {
      setTimeout(() => {
        startTour();
      }, 1200);
    }
  });
})();
