/**
 * FinSight Autonomous Dynamic AI Assistant Chatbot Controller ("Zoiee")
 * Features:
 * - Voice Input Microphone Button 🎙️ (Speech-to-Text Recognition via Web Speech API)
 * - Auto-Send Voice Commands for Income, Expenses, Budgets, Goals & Queries
 * - 100% Pure Vector 3D Robot Character (No Image Files, No Card Artifacts!)
 * - Light Metallic Stage Background with Outer Dark Vignette Perimeter
 * - Top-Left Brand Logo & Top-Right Floating Action Buttons (Expand/Shrink & Gear)
 * - Dynamic Hand Raising Vector Arms Animation
 * - Floating Dark Navy Bot Messages & White User Messages
 * - Bottom-Right White Input Bar with Mic, Dark Navy Send & Reset Buttons
 */
(function () {
  'use strict';

  let drawerEl = null;
  let chatBodyEl = null;
  let inputFieldEl = null;
  let sendBtnEl = null;
  let triggerBtnEl = null;
  let robotCharEl = null;
  let isFullscreen = true; // Open in full screen stage view by default

  // Voice Speech Recognition Variables
  let recognition = null;
  let isListening = false;

  function initAIAssistantDOM() {
    if (document.getElementById('ai-assistant-trigger-btn')) return;

    // 1. Floating Bottom-Right Avatar Button
    triggerBtnEl = document.createElement('button');
    triggerBtnEl.id = 'ai-assistant-trigger-btn';
    triggerBtnEl.type = 'button';
    triggerBtnEl.title = 'Ask Zoiee AI Assistant';
    triggerBtnEl.innerHTML = `
      <div class="ai-trigger-avatar">
        <i class="bi bi-robot"></i>
        <span class="ai-online-pulse"></span>
      </div>
    `;
    document.body.appendChild(triggerBtnEl);

    // 2. Main Container
    drawerEl = document.createElement('div');
    drawerEl.id = 'ai-chat-drawer';
    drawerEl.className = 'fullscreen';
    
    renderStageHTML();
    document.body.appendChild(drawerEl);

    bindEvents();
    initSpeechRecognition();
  }

  function renderStageHTML() {
    if (!drawerEl) return;

    if (isFullscreen) {
      // FULLSCREEN PURE VECTOR STAGE WITH VOICE MIC BUTTON
      drawerEl.className = 'fullscreen';
      drawerEl.innerHTML = `
        <div class="ai-fullscreen-vignette"></div>

        <!-- Top Header Controls -->
        <div class="ai-fullscreen-header">
          <div class="ai-fullscreen-brand">
            <div class="ai-brand-logo-icon">
              <img src="/static/images/logo.jpeg" alt="Project Logo" class="ai-brand-logo-img" />
            </div>
            <div class="ai-brand-text-block">
              <span class="ai-brand-title">Finance Analytics Platform</span>
              <span class="ai-brand-subtitle">Financial Reporting & Budget Tracking</span>
            </div>
          </div>
          <div class="ai-fullscreen-actions">
            <button class="ai-fullscreen-btn" id="ai-expand-btn" title="Shrink to Drawer"><i class="bi bi-arrows-angle-contract"></i></button>
            <button class="ai-fullscreen-btn" id="ai-settings-btn" title="AI Settings"><i class="bi bi-gear-fill"></i></button>
          </div>
        </div>

        <!-- Stage Body -->
        <div class="ai-fullscreen-stage">
          <!-- Left Vector Robot Stage -->
          <div class="ai-fullscreen-robot-container">
            <div class="ai-robot-wrapper">
              <div class="ai-robot-character" id="ai-robot-character">
                <!-- Head -->
                <div class="ai-robot-head-box">
                  <div class="ai-robot-antenna"></div>
                  <div class="ai-robot-ear left"></div>
                  <div class="ai-robot-ear right"></div>
                  <div class="ai-robot-visor">
                    <div class="ai-robot-eyes-container">
                      <div class="ai-robot-eye-glow"></div>
                      <div class="ai-robot-eye-glow"></div>
                    </div>
                    <div class="ai-robot-smile-curve"></div>
                  </div>
                </div>
                <!-- Torso -->
                <div class="ai-robot-torso-box">
                  <div class="ai-robot-chest-shield">
                    <div class="ai-robot-core-orb"></div>
                  </div>
                </div>
                <!-- Vector Arms Raising Hands Towards Up -->
                <div class="ai-robot-arm-limb left-arm"></div>
                <div class="ai-robot-arm-limb right-arm"></div>
              </div>
              <div class="ai-robot-ground-shadow"></div>
            </div>
          </div>

          <!-- Right Conversation & Input Bar with Voice Microphone Button -->
          <div class="ai-fullscreen-chat-container">
            <div class="ai-fullscreen-messages-stream" id="ai-chat-body">
              <div class="ai-fullscreen-bot-msg-wrapper">
                <div class="ai-fullscreen-bot-msg">
                  Hello there! What can I do to lend a hand? 🎙️ You can also click the mic button to speak with me!
                </div>
                <div class="ai-fullscreen-reactions">
                  <button class="ai-reaction-btn like-btn" title="Helpful"><i class="bi bi-hand-thumbs-up"></i></button>
                  <button class="ai-reaction-btn dislike-btn" title="Not Helpful"><i class="bi bi-hand-thumbs-down"></i></button>
                </div>
              </div>
            </div>

            <!-- Bottom Right Input Form with Microphone Button -->
            <form class="ai-fullscreen-input-bar" id="ai-input-form">
              <div class="ai-input-container-rel">
                <input type="text" id="ai-input-field" class="ai-fullscreen-input-field" placeholder="Ask Zoiee or speak using mic..." autocomplete="off" />
                <button type="button" id="ai-mic-btn" class="ai-mic-btn" title="Voice Search / Speak to Zoiee">
                  <i class="bi bi-mic-fill"></i>
                </button>
              </div>
              <button type="submit" id="ai-send-btn" class="ai-fullscreen-send-btn" title="Send Message">
                <i class="bi bi-send-fill"></i>
              </button>
              <button type="button" id="ai-reset-btn" class="ai-fullscreen-reset-btn" title="Reset Chat">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </form>
          </div>
        </div>
      `;
    } else {
      // DRAWER POPUP VIEW WITH VOICE MIC BUTTON
      drawerEl.className = '';
      drawerEl.innerHTML = `
        <div class="ai-chat-header">
          <div class="ai-header-info">
            <div class="ai-header-avatar-badge"><i class="bi bi-robot"></i></div>
            <div class="ai-header-text">
              <h4>Zoiee</h4>
              <span class="ai-header-status">
                <i class="bi bi-circle-fill" style="font-size: 0.55rem; color: #10B981;"></i> Online • Powered by Gemini AI
              </span>
            </div>
          </div>
          <div class="ai-header-actions">
            <button class="ai-header-btn" id="ai-expand-btn" title="Expand Full Screen"><i class="bi bi-arrows-angle-expand"></i></button>
            <button class="ai-header-btn" id="ai-settings-btn" title="AI Settings"><i class="bi bi-gear-fill"></i></button>
            <button class="ai-header-btn close-btn" id="ai-close-btn" title="Close"><i class="bi bi-dash-lg"></i></button>
          </div>
        </div>

        <div class="ai-chat-body" id="ai-chat-body">
          <div class="ai-msg-row-bot">
            <div class="ai-msg-avatar-icon"><i class="bi bi-robot"></i></div>
            <div>
              <div class="ai-msg-bot-content">
                Hello there! What can I do to lend a hand? 🎙️ You can speak to me using the mic!
              </div>
              <div class="ai-msg-reactions">
                <button class="ai-reaction-btn like-btn" title="Helpful"><i class="bi bi-hand-thumbs-up"></i></button>
                <button class="ai-reaction-btn dislike-btn" title="Not Helpful"><i class="bi bi-hand-thumbs-down"></i></button>
              </div>
            </div>
          </div>
        </div>

        <div class="ai-chat-footer">
          <form class="ai-input-form" id="ai-input-form">
            <div class="ai-input-container-rel" style="flex:1;">
              <input type="text" id="ai-input-field" class="ai-input-field" placeholder="Ask Zoiee or use mic..." autocomplete="off" />
              <button type="button" id="ai-mic-btn" class="ai-mic-btn" title="Voice Search / Speak to Zoiee">
                <i class="bi bi-mic-fill"></i>
              </button>
            </div>
            <button type="submit" id="ai-send-btn" class="ai-send-btn" title="Send Message">
              <i class="bi bi-send-fill"></i>
            </button>
            <button type="button" id="ai-reset-btn" class="ai-reset-btn" title="Reset Chat">
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
          </form>
        </div>
      `;
    }

    rebindRefs();
  }

  function rebindRefs() {
    chatBodyEl = document.getElementById('ai-chat-body');
    inputFieldEl = document.getElementById('ai-input-field');
    sendBtnEl = document.getElementById('ai-send-btn');
    robotCharEl = document.getElementById('ai-robot-character');
  }

  function bindEvents() {
    triggerBtnEl.addEventListener('click', toggleDrawer);

    drawerEl.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('#ai-close-btn');
      if (closeBtn) closeDrawer();

      const expandBtn = e.target.closest('#ai-expand-btn');
      if (expandBtn) toggleFullscreen();

      const resetBtn = e.target.closest('#ai-reset-btn');
      if (resetBtn) resetChat();

      const micBtn = e.target.closest('#ai-mic-btn');
      if (micBtn) toggleVoiceInput();

      const reactionBtn = e.target.closest('.ai-reaction-btn');
      if (reactionBtn) {
        if (reactionBtn.classList.contains('like-btn')) {
          reactionBtn.classList.toggle('active-like');
          const sibling = reactionBtn.parentElement.querySelector('.dislike-btn');
          if (sibling) sibling.classList.remove('active-dislike');
        } else if (reactionBtn.classList.contains('dislike-btn')) {
          reactionBtn.classList.toggle('active-dislike');
          const sibling = reactionBtn.parentElement.querySelector('.like-btn');
          if (sibling) sibling.classList.remove('active-like');
        }
      }
    });

    drawerEl.addEventListener('submit', (e) => {
      if (e.target.id === 'ai-input-form') {
        handleSend(e);
      }
    });
  }

  /* --------------------------------------------------
     VOICE SPEECH RECOGNITION (WEB SPEECH API)
     -------------------------------------------------- */
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition API not supported in this browser.");
      return;
    }

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Supports English, Telugu, Teluglish & Multilingual speech

      recognition.onstart = function () {
        isListening = true;
        updateMicUI(true);
      };

      recognition.onresult = function (event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (inputFieldEl) {
          inputFieldEl.value = transcript;
        }
      };

      recognition.onerror = function (event) {
        console.error("Speech Recognition Error:", event.error);
        stopListening();
      };

      recognition.onend = function () {
        isListening = false;
        updateMicUI(false);
        // Auto-send recognized text to AI Chat if text is present!
        if (inputFieldEl && inputFieldEl.value.trim().length > 0) {
          handleSend(new Event('submit'));
        }
      };
    } catch (e) {
      console.error("Failed to initialize speech recognition:", e);
    }
  }

  function toggleVoiceInput() {
    if (!recognition) {
      initSpeechRecognition();
    }
    if (!recognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  }

  function stopListening() {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.error(e);
      }
    }
    isListening = false;
    updateMicUI(false);
  }

  function updateMicUI(listening) {
    const micBtns = document.querySelectorAll('#ai-mic-btn');
    micBtns.forEach(btn => {
      if (listening) {
        btn.classList.add('recording');
        btn.title = 'Recording... Click to Stop & Send';
        btn.innerHTML = '<i class="bi bi-mic-mute-fill"></i>';
      } else {
        btn.classList.remove('recording');
        btn.title = 'Voice Search / Speak to Zoiee';
        btn.innerHTML = '<i class="bi bi-mic-fill"></i>';
      }
    });

    if (inputFieldEl) {
      if (listening) {
        inputFieldEl.placeholder = '🎙️ Listening... Speak your command...';
      } else {
        inputFieldEl.placeholder = 'Ask Zoiee or speak using mic...';
      }
    }
  }

  function toggleDrawer() {
    if (!drawerEl) return;
    drawerEl.classList.toggle('open');
    if (drawerEl.classList.contains('open')) {
      if (inputFieldEl) inputFieldEl.focus();
      triggerHandRaisingAnimation();
    }
  }

  function closeDrawer() {
    if (drawerEl) drawerEl.classList.remove('open');
    stopListening();
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    renderStageHTML();
    drawerEl.classList.add('open');
    if (inputFieldEl) inputFieldEl.focus();
    triggerHandRaisingAnimation();
  }

  function triggerHandRaisingAnimation() {
    if (!robotCharEl) return;
    robotCharEl.classList.add('raising-hands');
    setTimeout(() => {
      if (robotCharEl) robotCharEl.classList.remove('raising-hands');
    }, 2800);
  }

  function resetChat() {
    stopListening();
    if (!chatBodyEl) return;
    if (isFullscreen) {
      chatBodyEl.innerHTML = `
        <div class="ai-fullscreen-bot-msg-wrapper">
          <div class="ai-fullscreen-bot-msg">
            Hello there! What can I do to lend a hand? 🎙️ You can also speak to me using the microphone!
          </div>
          <div class="ai-fullscreen-reactions">
            <button class="ai-reaction-btn like-btn" title="Helpful"><i class="bi bi-hand-thumbs-up"></i></button>
            <button class="ai-reaction-btn dislike-btn" title="Not Helpful"><i class="bi bi-hand-thumbs-down"></i></button>
          </div>
        </div>
      `;
    } else {
      chatBodyEl.innerHTML = `
        <div class="ai-msg-row-bot">
          <div class="ai-msg-avatar-icon"><i class="bi bi-robot"></i></div>
          <div>
            <div class="ai-msg-bot-content">
              Hello there! What can I do to lend a hand? 🎙️ You can speak to me using the microphone!
            </div>
            <div class="ai-msg-reactions">
              <button class="ai-reaction-btn like-btn" title="Helpful"><i class="bi bi-hand-thumbs-up"></i></button>
              <button class="ai-reaction-btn dislike-btn" title="Not Helpful"><i class="bi bi-hand-thumbs-down"></i></button>
            </div>
          </div>
        </div>
      `;
    }
    triggerHandRaisingAnimation();
  }

  function appendUserMessage(text) {
    if (!chatBodyEl) return;
    if (isFullscreen) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'ai-fullscreen-user-msg';
      msgDiv.textContent = text;
      chatBodyEl.appendChild(msgDiv);
    } else {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'ai-msg-row-user';
      rowDiv.innerHTML = `
        <div class="ai-msg-user-content">${escapeHTML(text)}</div>
        <div class="ai-user-avatar-badge"><i class="bi bi-person-fill"></i></div>
      `;
      chatBodyEl.appendChild(rowDiv);
    }
    scrollToBottom();
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 5px;border-radius:4px;font-size:0.82rem;">$1</code>')
      .replace(/^[\s]*[•\-]\s+(.*)$/gm, '• $1')
      .replace(/\n/g, '<br>');
  }

  function appendBotMessage(htmlContent, cardHtml = '') {
    if (!chatBodyEl) return;
    let formattedMsg = formatMarkdown(htmlContent);
    if (cardHtml) formattedMsg += cardHtml;

    if (isFullscreen) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.className = 'ai-fullscreen-bot-msg-wrapper';
      wrapperDiv.innerHTML = `
        <div class="ai-fullscreen-bot-msg">${formattedMsg}</div>
        <div class="ai-fullscreen-reactions">
          <button class="ai-reaction-btn like-btn" title="Helpful"><i class="bi bi-hand-thumbs-up"></i></button>
          <button class="ai-reaction-btn dislike-btn" title="Not Helpful"><i class="bi bi-hand-thumbs-down"></i></button>
        </div>
      `;
      chatBodyEl.appendChild(wrapperDiv);
    } else {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'ai-msg-row-bot';
      rowDiv.innerHTML = `
        <div class="ai-msg-avatar-icon"><i class="bi bi-robot"></i></div>
        <div>
          <div class="ai-msg-bot-content">${formattedMsg}</div>
          <div class="ai-msg-reactions">
            <button class="ai-reaction-btn like-btn" title="Helpful"><i class="bi bi-hand-thumbs-up"></i></button>
            <button class="ai-reaction-btn dislike-btn" title="Not Helpful"><i class="bi bi-hand-thumbs-down"></i></button>
          </div>
        </div>
      `;
      chatBodyEl.appendChild(rowDiv);
    }

    scrollToBottom();
    triggerHandRaisingAnimation();
  }

  function showTypingIndicator() {
    if (!chatBodyEl) return;
    if (isFullscreen) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.className = 'ai-fullscreen-bot-msg-wrapper ai-typing-indicator';
      wrapperDiv.id = 'ai-typing-indicator';
      wrapperDiv.innerHTML = `
        <div class="ai-fullscreen-bot-msg">
          <div class="ai-typing-dots">
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
          </div>
        </div>
      `;
      chatBodyEl.appendChild(wrapperDiv);
    } else {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'ai-msg-row-bot ai-typing-indicator';
      rowDiv.id = 'ai-typing-indicator';
      rowDiv.innerHTML = `
        <div class="ai-msg-avatar-icon"><i class="bi bi-robot"></i></div>
        <div class="ai-msg-bot-content">
          <div class="ai-typing-dots">
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
          </div>
        </div>
      `;
      chatBodyEl.appendChild(rowDiv);
    }
    scrollToBottom();
    triggerHandRaisingAnimation();
  }

  function removeTypingIndicator() {
    const typingDiv = document.getElementById('ai-typing-indicator');
    if (typingDiv) typingDiv.remove();
  }

  function scrollToBottom() {
    if (chatBodyEl) {
      chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
    }
  }

  function handleSend(e) {
    if (e) e.preventDefault();
    if (!inputFieldEl) return;
    const text = inputFieldEl.value.trim();
    if (!text) return;

    if (isListening) {
      stopListening();
    }

    appendUserMessage(text);
    inputFieldEl.value = '';
    showTypingIndicator();

    // Send request to Flask Gemini AI Backend
    fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error('session');
      }
      if (!res.ok) {
        throw new Error(data.reply || `Server error (${res.status})`);
      }
      return data;
    })
    .then(data => {
      removeTypingIndicator();
      if (data.status === 'success') {
        appendBotMessage(data.reply, data.card_html || '');
        if (data.action_performed) {
          triggerDashboardSync();
        }
      } else {
        appendBotMessage(data.reply || '⚠️ I received an empty response. Please try again.');
      }
    })
    .catch(err => {
      removeTypingIndicator();
      console.error('AI Assistant Error:', err);
      if (err.message && err.message.toLowerCase().includes('session')) {
        appendBotMessage('⚠️ Your session has expired. Please <a href="/login" style="color:#38BDF8;">log in again</a>.');
      } else if (err.message && err.message.toLowerCase().includes('server error')) {
        appendBotMessage('⚠️ Server error: ' + err.message + '. Please check your connection or refresh the page.');
      } else {
        appendBotMessage('⚠️ I could not process your request right now. Please try again in a moment.');
      }
    });
  }

  function triggerDashboardSync() {
    if (typeof window.fetchDashboardData === 'function') {
      window.fetchDashboardData();
    } else {
      window.dispatchEvent(new CustomEvent('finsight:data-updated'));
    }
  }

  // Global trigger function
  window.openFinSightAIChat = function(initialPrompt) {
    if (!drawerEl) initAIAssistantDOM();
    if (drawerEl) {
      drawerEl.classList.add('open');
      if (initialPrompt && inputFieldEl) {
        inputFieldEl.value = initialPrompt;
        handleSend(new Event('submit'));
      }
    }
  };

  // Initialize on page ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistantDOM);
  } else {
    initAIAssistantDOM();
  }
})();
