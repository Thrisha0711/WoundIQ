/**
 * WoundIQ Client Script
 * Includes page-wide layout interactions (logo injection, scroll effects)
 * and the Interactive FAQ Chatbot logic.
 */

(function () {
  'use strict';

  /* ── Inject Logo Image ── */
  const src = './logo.png';
  ['nav-logo-img', 'dash-logo-sm', 'footer-logo', 'nav-logo-img-chat'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.src = src;
  });

  /* ── Nav Scroll Header Shift ── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── Clean URL Smooth Scroll (no # in address bar) ── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });

  /* ── Mobile Hamburger Menu ── */
  var hamburger = document.getElementById('hamburger-btn');
  var navLinks = document.querySelector('.nav-links');
  var menuOverlay = document.getElementById('mobile-menu-overlay');

  function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking overlay
    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }
  }

  /* ── Nav Scroll-Spy Active State ── */
  var spySections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (spySections.length > 0 && navAnchors.length > 0) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + id) {
              a.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.2, rootMargin: '-70px 0px -50% 0px' });

    spySections.forEach(function (sec) {
      spyObserver.observe(sec);
    });
  }

  /* ── Reveal Elements on Scroll (Intersection Observer) ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── Video Slider Player ── */
  var heroVideo = document.getElementById('wiq-hero-video');
  var playBtn = document.getElementById('video-play-btn');

  if (heroVideo && playBtn) {
    // Click play overlay → play video, hide overlay
    playBtn.addEventListener('click', function () {
      heroVideo.play();
      playBtn.classList.add('hidden');
    });

    // Click video while playing → pause, show overlay
    heroVideo.addEventListener('click', function () {
      if (!heroVideo.paused) {
        heroVideo.pause();
        playBtn.classList.remove('hidden');
      }
    });

    // When video ends, show play overlay again
    heroVideo.addEventListener('ended', function () {
      playBtn.classList.remove('hidden');
    });
  }

  /* ── Counter Animation on Stats ── */
  var statNums = document.querySelectorAll('.stat-num');
  if (statNums.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('counted');
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ── Back to Top Button ── */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Cookie Consent ── */
  var cookieBanner = document.getElementById('cookie-consent');
  if (cookieBanner && !localStorage.getItem('wiq_cookie_consent')) {
    setTimeout(function () {
      cookieBanner.classList.add('visible');
    }, 1500);

    var acceptBtn = document.getElementById('cookie-accept');
    var dismissBtn = document.getElementById('cookie-dismiss');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('wiq_cookie_consent', 'accepted');
        cookieBanner.classList.remove('visible');
      });
    }
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        localStorage.setItem('wiq_cookie_consent', 'dismissed');
        cookieBanner.classList.remove('visible');
      });
    }
  }

  /* ── Dynamic Copyright Year ── */
  var copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) {
    copyrightEl.textContent = new Date().getFullYear();
  }

  /* ═══════════════════════ CHATBOT LOGIC ═══════════════════════ */

  // FAQ Database
  const faqData = [
    {
      q: "What exactly is Wound-IQ?",
      a: "Wound-IQ is an AI-powered wound analysis tool. It operates in the background to predict wound deterioration before visible complications occur, helping your team deliver proactive care."
    },
    {
      q: "Will Wound-IQ replace our clinicians?",
      a: "Not at all. Wound-IQ is built to augment your care team, not replace them. It simply gives your clinicians advanced intelligence so they can make faster, more accurate decisions."
    },
    {
      q: "Do we need to train our staff to use it?",
      a: "Zero training is required. Clinicians work exactly as they do today. The system analyzes data in the background without adding any new steps to their daily workflow."
    },
    {
      q: "How does the AI predict deterioration?",
      a: "Our AI acts as an early warning system. It analyzes clinical data and wound patterns to spot microscopic signs of deterioration long before they are visible to the human eye."
    },
    {
      q: "Does it integrate with our current EMR/EHR system?",
      a: "Yes. Wound-IQ integrates seamlessly with existing healthcare systems."
    },
    {
      q: "How does Wound-IQ save our facility money?",
      a: "By predicting deterioration early, preventing complications, reducing hospitalizations, and saving nursing time."
    },
    {
      q: "Is patient data kept secure?",
      a: "Yes. Enterprise-grade security protocols and healthcare-compliant data handling are implemented."
    },
    {
      q: "Does it help with compliance surveys?",
      a: "Yes. Automated documentation and analytics help maintain survey readiness."
    },
    {
      q: "Do we need special hardware?",
      a: "No. It works with standard devices already used by clinical teams."
    },
    {
      q: "Which facilities benefit most?",
      a: "Hospitals, long-term care facilities, wound clinics, and healthcare networks."
    },
    {
      q: "How long does implementation take?",
      a: "Implementation is rapid with minimal disruption."
    },
    {
      q: "What happens when a patient is flagged at risk?",
      a: "The care team receives alerts and can intervene proactively."
    },
    {
      q: "Can it be used for telehealth?",
      a: "Yes. It supports remote monitoring and telehealth workflows."
    },
    {
      q: "Does it track network-wide outcomes?",
      a: "Yes. Enterprise analytics provide visibility across facilities."
    },
    {
      q: "How accurate is the AI?",
      a: "The AI is trained on clinically validated datasets and historical wound data."
    },
    {
      q: "Is the system difficult to maintain?",
      a: "No. It is cloud-based and maintained automatically."
    },
    {
      q: "How is the data stored?",
      a: "Stored securely in compliant cloud infrastructure."
    },
    {
      q: "Will it slow down our network?",
      a: "No. Processing is optimized and primarily cloud-based."
    },
    {
      q: "What support is offered?",
      a: "Dedicated enterprise support and account management."
    },
    {
      q: "How do we schedule a demo?",
      a: "Click the Request Demo button and submit the contact form."
    }
  ];

  // DOM Elements
  const chatBtn = document.getElementById('wiq-chat-btn');
  const chatWidget = document.getElementById('wiq-chat-widget');
  const chatClose = document.getElementById('wiq-chat-close');
  const chatBody = document.getElementById('wiq-chat-body');
  const searchInput = document.getElementById('wiq-search-input');
  const searchSubmit = document.getElementById('wiq-search-submit');
  const searchClear = document.getElementById('wiq-search-clear');
  const actionDemo = document.getElementById('wiq-action-demo');
  const actionContact = document.getElementById('wiq-action-contact');

  // Chatbot Service containing NLP matching logic separated from UI
  const ChatbotService = {
    faqData: faqData,

    async findBestResponse(query) {
      const cleanQuery = query.trim().toLowerCase();

      // Greetings handler
      const greetings = ['hi', 'hello', 'hey', 'greetings', 'hola', 'good morning', 'good afternoon'];
      if (greetings.some(g => cleanQuery === g || cleanQuery.startsWith(g + ' '))) {
        return {
          answer: "Hello! I am the Wound-IQ virtual assistant. How can I help you today? You can ask me about Wound-IQ's early warning AI, data security, implementation timelines, or telehealth capabilities."
        };
      }

      // Thanks handler
      const thanks = ['thanks', 'thank you', 'thank', 'awesome', 'great', 'cool'];
      if (thanks.some(t => cleanQuery.includes(t))) {
        return {
          answer: "You're very welcome! Let me know if there is anything else I can help you with."
        };
      }

      let bestMatch = null;
      let highestScore = 0;

      for (const faq of this.faqData) {
        const score = this.calculateSimilarity(cleanQuery, faq.q);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = faq;
        }
      }

      // Match confidence threshold (0-100 scale)
      const THRESHOLD = 25;
      if (bestMatch && highestScore >= THRESHOLD) {
        return {
          answer: bestMatch.a
        };
      }

      return null; // No match found
    },

    calculateSimilarity(query, question) {
      const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
      const cleanQuestion = question.toLowerCase().replace(/[^\w\s]/g, '').trim();

      if (cleanQuery === cleanQuestion) {
        return 100;
      }

      if (cleanQuestion.includes(cleanQuery)) {
        return 80 + (cleanQuery.length / cleanQuestion.length) * 10;
      }

      const queryWords = cleanQuery.split(/\s+/).filter(Boolean);
      const questionWords = cleanQuestion.split(/\s+/).filter(Boolean);

      if (queryWords.length === 0) return 0;

      let matches = 0;
      queryWords.forEach(word => {
        if (questionWords.includes(word)) {
          matches++;
        } else {
          // Fuzzy match check
          const hasFuzzy = questionWords.some(qWord => qWord.includes(word) || word.includes(qWord));
          if (hasFuzzy) {
            matches += 0.7;
          }
        }
      });

      const queryCoverage = matches / queryWords.length;
      const intersection = queryWords.filter(w => questionWords.includes(w)).length;
      const union = new Set([...queryWords, ...questionWords]).size;
      const jaccard = union > 0 ? intersection / union : 0;

      return queryCoverage * 70 + jaccard * 30;
    }
  };

  // Initialize Chat
  function initChat() {
    if (!chatBtn || !chatWidget) return;

    // Load conversation history or initial welcome message
    loadChatHistory();

    // Event: Toggle Chat Button
    chatBtn.addEventListener('click', toggleChat);

    // Event: Close Button
    if (chatClose) {
      chatClose.addEventListener('click', () => toggleChat(false));
    }

    // Event: Demo Navigation Button
    if (actionDemo) {
      actionDemo.addEventListener('click', () => {
        scrollToSection('#demo');
      });
    }

    // Event: Contact Us Button
    if (actionContact) {
      actionContact.addEventListener('click', () => {
        handleContactUs();
      });
    }

    // Event: Input Actions
    if (searchInput) {
      // Toggle clear button display
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        searchClear.style.display = query ? 'flex' : 'none';
      });

      // Submit message on Enter key
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleInputSubmit();
        }
      });
    }

    // Event: Send Button click
    if (searchSubmit) {
      searchSubmit.addEventListener('click', handleInputSubmit);
    }

    // Event: Clear Input Button click
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchInput.focus();
      });
    }
  }

  // Toggle widget visibility
  function toggleChat(forceOpen = null) {
    const isOpen = chatWidget.classList.contains('open');
    const nextState = forceOpen !== null ? forceOpen : !isOpen;

    if (nextState) {
      chatWidget.classList.add('open');
      chatBtn.classList.add('active');
      if (window.innerWidth > 768 && searchInput) {
        setTimeout(() => searchInput.focus(), 150);
      }
    } else {
      chatWidget.classList.remove('open');
      chatBtn.classList.remove('active');
    }
  }

  // Save a message to sessionStorage conversation history
  function saveMessageToHistory(sender, text, isHtml = false) {
    let history = [];
    try {
      history = JSON.parse(sessionStorage.getItem('wiq_chat_history')) || [];
    } catch (e) {
      history = [];
    }
    history.push({ sender, text, isHtml, time: getCurrentTime() });
    try {
      sessionStorage.setItem('wiq_chat_history', JSON.stringify(history));
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  }

  // Load chat history from sessionStorage
  function loadChatHistory() {
    let history = [];
    try {
      history = JSON.parse(sessionStorage.getItem('wiq_chat_history'));
    } catch (e) {
      history = null;
    }

    if (history && history.length > 0) {
      chatBody.innerHTML = '';
      history.forEach(msg => {
        if (msg.sender === 'user') {
          addUserMessage(msg.text, false);
        } else {
          addBotMessage(msg.text, msg.isHtml, false);
        }
      });
    } else {
      addBotMessage(
        "Hello! Welcome to Wound-IQ. I am your virtual assistant. Ask me anything about Wound-IQ's features, AI capabilities, security, implementation, or how to get a demo!",
        false,
        true
      );

      // Show initial popular question chips to get started
      const initialSuggestions = [
        { q: "What is Wound-IQ?" },
        { q: "How accurate is the AI?" },
        { q: "Is patient data secure?" },
        { q: "How do I schedule a demo?" }
      ];
      showFaqSuggestions(initialSuggestions);
    }
  }

  // Add a User message bubble
  function addUserMessage(text, shouldSave = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'wiq-msg user';

    const bubble = document.createElement('div');
    bubble.className = 'wiq-msg-bubble';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'wiq-msg-time';
    time.textContent = getCurrentTime();

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(time);
    chatBody.appendChild(msgDiv);
    scrollChatBottom();

    if (shouldSave) {
      saveMessageToHistory('user', text);
    }
  }

  // Add a Bot message bubble (supports HTML)
  function addBotMessage(text, isHtml = false, shouldSave = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'wiq-msg bot';

    const bubble = document.createElement('div');
    bubble.className = 'wiq-msg-bubble';
    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }

    const time = document.createElement('div');
    time.className = 'wiq-msg-time';
    time.textContent = getCurrentTime();

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(time);
    chatBody.appendChild(msgDiv);
    scrollChatBottom();

    if (shouldSave) {
      saveMessageToHistory('bot', text, isHtml);
    }
  }

  // Bouncing Typing Indicator elements
  let typingIndicatorEl = null;

  function showTypingIndicator() {
    if (typingIndicatorEl) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'wiq-msg bot';
    msgDiv.id = 'wiq-typing-indicator';

    const bubble = document.createElement('div');
    bubble.className = 'wiq-msg-bubble';

    const typingContainer = document.createElement('div');
    typingContainer.className = 'wiq-typing';

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      typingContainer.appendChild(dot);
    }

    bubble.appendChild(typingContainer);
    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    scrollChatBottom();

    typingIndicatorEl = msgDiv;
  }

  function hideTypingIndicator() {
    if (typingIndicatorEl) {
      typingIndicatorEl.remove();
      typingIndicatorEl = null;
    }
  }

  // Get current timestamp formatted
  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Auto-scroll chat body to the bottom
  function scrollChatBottom() {
    setTimeout(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 50);
  }

  // Show a list of suggestions as chips in the chat
  function showFaqSuggestions(faqs) {
    const existing = document.getElementById('wiq-suggestions-area');
    if (existing) {
      existing.remove();
    }

    if (!faqs || faqs.length === 0) return;

    const suggestionArea = document.createElement('div');
    suggestionArea.id = 'wiq-suggestions-area';

    const header = document.createElement('div');
    header.className = 'wiq-suggestion-header';
    header.textContent = "Or select a suggested topic:";
    suggestionArea.appendChild(header);

    const list = document.createElement('div');
    list.className = 'wiq-suggestions-list';

    faqs.forEach(faq => {
      const chip = document.createElement('button');
      chip.className = 'wiq-suggest-chip';
      chip.textContent = faq.q;
      chip.addEventListener('click', () => handleFaqSelect(faq));
      list.appendChild(chip);
    });

    suggestionArea.appendChild(list);
    chatBody.appendChild(suggestionArea);
    scrollChatBottom();
  }

  // Handle click on an FAQ suggestion chip
  function handleFaqSelect(faq) {
    const area = document.getElementById('wiq-suggestions-area');
    if (area) area.remove();

    processQuery(faq.q);
  }

  // Scroll to a selector in the main page (e.g. #demo)
  function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
      if (window.innerWidth <= 768) {
        toggleChat(false);
      }
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle user input submit
  function handleInputSubmit() {
    const text = searchInput.value.trim();
    if (!text) return;

    searchInput.value = '';
    searchClear.style.display = 'none';

    processQuery(text);
  }

  // Conversational response pipeline
  function processQuery(text) {
    // Add user message
    addUserMessage(text);

    // Show typing indicator
    showTypingIndicator();

    // Clear suggestion chips if they exist
    const area = document.getElementById('wiq-suggestions-area');
    if (area) area.remove();

    // Process matching with a realistic delay
    setTimeout(async () => {
      const response = await ChatbotService.findBestResponse(text);

      hideTypingIndicator();

      if (response) {
        addBotMessage(response.answer);
      } else {
        // Fallback message
        addBotMessage(
          "I'm sorry, I couldn't find a direct answer to that question in my database. Could you try rephrasing it, or check out related topics like 'Braden Scale', 'MNA nutritional screening', 'security', or 'telehealth'? You can also contact our team directly at woundiq@ehealthcare.ai."
        );

        // Show some popular questions to help them guide back
        const helperSuggestions = [
          { q: "What is Wound-IQ?" },
          { q: "How accurate is the AI?" },
          { q: "Is patient data secure?" },
          { q: "Does it support nutritional screening?" }
        ];
        showFaqSuggestions(helperSuggestions);
      }
    }, 800 + Math.random() * 500);
  }

  // Show detailed contact info card and scroll to contact section
  function handleContactUs() {
    const contactHtml = `
      <div style="font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; margin-bottom:8px;">WoundIQ Contact Information</div>
      <div style="font-size:0.82rem; line-height:1.6; color:var(--text-body);">
        <strong>Email:</strong> <a href="mailto:woundiq@ehealthcare.ai" style="color:var(--teal-600); text-decoration:underline; font-weight:700;">woundiq@ehealthcare.ai</a><br>
        <strong>Phone:</strong> +1 (847) 812-0026<br>
        <strong>Address:</strong><br>
        2525 Cabot Dr, Suite 201<br>
        Lisle, IL 60532
      </div>
    `;

    const area = document.getElementById('wiq-suggestions-area');
    if (area) area.remove();

    addUserMessage("How do I contact support or sales?");
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      addBotMessage(contactHtml, true);
      scrollToSection('footer');
    }, 1000);
  }

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }

})();

/////////////////////////////////////////////////////////////
