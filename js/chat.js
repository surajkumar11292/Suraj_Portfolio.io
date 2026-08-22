(function () {
  const toggleBtn = document.getElementById('ts-chat-toggle');
  const chatPanel = document.getElementById('ts-chat-panel');
  const closeBtn = document.getElementById('ts-chat-close');
  const chatBody = document.getElementById('ts-chat-body');
  const chatForm = document.getElementById('ts-chat-form');
  const chatInput = document.getElementById('ts-chat-input');
  const sendBtn = document.getElementById('ts-chat-send');
  const botSprite = document.getElementById('ts-bot-sprite');
  const botHead = document.getElementById('ts-bot-head');
  const starterChips = document.querySelectorAll('.ts-starter-chip');
  const widget = document.getElementById('ts-chat-widget');

  let history = [];
  let isOpen = false;
  let isRequestInFlight = false;

  // Initial nudge
  if (!sessionStorage.getItem('ts-chat-nudged')) {
    setTimeout(() => {
      if (!isOpen && !sessionStorage.getItem('ts-chat-nudged')) {
        widget.classList.add('ts-nudge-active');
        sessionStorage.setItem('ts-chat-nudged', 'true');
        setTimeout(() => widget.classList.remove('ts-nudge-active'), 4000);
      }
    }, 8000);
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      widget.classList.add('is-open');
      widget.classList.remove('ts-nudge-active');
      sessionStorage.setItem('ts-chat-nudged', 'true');
      
      // Calculate transform dynamically using FLIP-like technique
      const target = document.getElementById('ts-avatar-target');
      const botContainer = document.querySelector('.ts-bot-container');
      
      // Force panel to its final open state instantly to measure true final coordinates
      const originalTransition = chatPanel.style.transition;
      chatPanel.style.transition = 'none';
      chatPanel.classList.add('is-open');
      
      const botRect = botContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      
      // Revert panel back so it can animate naturally
      chatPanel.classList.remove('is-open');
      // Force a reflow
      void chatPanel.offsetWidth;
      
      // Trigger the real animation
      chatPanel.style.transition = originalTransition;
      chatPanel.classList.add('is-open');
      
      // Scale the bot so it is slightly larger than the target circle (protruding 3D effect)
      const scale = (targetRect.height * 1.25) / botRect.height; 
      
      const scaledWidth = botRect.width * scale;
      const scaledHeight = botRect.height * scale;
      
      const offsetX = (targetRect.width - scaledWidth) / 2;
      const offsetY = (targetRect.height - scaledHeight) / 2;
      
      const deltaX = targetRect.left - botRect.left + offsetX;
      const deltaY = targetRect.top - botRect.top + offsetY;
      
      botContainer.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
      botContainer.style.pointerEvents = 'none';

      chatInput.focus();
    } else {
      chatPanel.classList.remove('is-open');
      widget.classList.remove('is-open');
      const botContainer = document.querySelector('.ts-bot-container');
      botContainer.style.transform = '';
      botContainer.style.pointerEvents = 'auto';
      toggleBtn.focus();
    }
  }

  // Recalculate bot position on resize if open (e.g. mobile address bar hiding/showing)
  window.addEventListener('resize', () => {
    if (isOpen) {
      // Temporarily disable transition for instant snapping
      const botContainer = document.querySelector('.ts-bot-container');
      const oldTransition = botContainer.style.transition;
      botContainer.style.transition = 'none';
      
      // We don't need FLIP here because the panel is already in its final state
      const target = document.getElementById('ts-avatar-target');
      const targetRect = target.getBoundingClientRect();
      
      // Remove transform to get true botRect
      botContainer.style.transform = '';
      const botRect = botContainer.getBoundingClientRect();
      
      const scale = (targetRect.height * 1.25) / botRect.height; 
      const scaledWidth = botRect.width * scale;
      const scaledHeight = botRect.height * scale;
      const offsetX = (targetRect.width - scaledWidth) / 2;
      const offsetY = (targetRect.height - scaledHeight) / 2;
      
      const deltaX = targetRect.left - botRect.left + offsetX;
      const deltaY = targetRect.top - botRect.top + offsetY;
      
      botContainer.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
      
      // Restore transition after a tiny delay
      setTimeout(() => botContainer.style.transition = oldTransition, 50);
    }
  });

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Keyboard support & focus trap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleChat();
    }
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  async function typeWriter(element, text, speed = 15) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      element.textContent += text.charAt(i);
      chatBody.scrollTop = chatBody.scrollHeight;
      await new Promise(r => setTimeout(r, speed));
    }
  }

  let typingIndicatorRow = null;

  function showTypingIndicator() {
    typingIndicatorRow = document.createElement('div');
    typingIndicatorRow.className = 'ts-msg-row';
    
    const avatarImg = document.createElement('img');
    avatarImg.src = 'assets/bot/robot-128.png';
    avatarImg.className = 'ts-msg-avatar';
    avatarImg.alt = 'AI';
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ts-msg ts-msg-ai';
    
    const indicator = document.createElement('div');
    indicator.className = 'ts-typing-indicator';
    indicator.innerHTML = '<div class="ts-dot"></div><div class="ts-dot"></div><div class="ts-dot"></div>';
    
    msgDiv.appendChild(indicator);
    typingIndicatorRow.appendChild(avatarImg);
    typingIndicatorRow.appendChild(msgDiv);
    chatBody.appendChild(typingIndicatorRow);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    if (typingIndicatorRow && typingIndicatorRow.parentNode) {
      typingIndicatorRow.parentNode.removeChild(typingIndicatorRow);
    }
    typingIndicatorRow = null;
  }

  // Render message
  async function appendMessage(role, text, isSystem = false) {
    if (role === 'model' && !isSystem) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'ts-msg-row';
      
      const avatarImg = document.createElement('img');
      avatarImg.src = 'assets/bot/robot-128.png';
      avatarImg.className = 'ts-msg-avatar';
      avatarImg.alt = 'AI';
      
      const msgDiv = document.createElement('div');
      msgDiv.className = 'ts-msg ts-msg-ai';
      
      rowDiv.appendChild(avatarImg);
      rowDiv.appendChild(msgDiv);
      chatBody.appendChild(rowDiv);
      
      await typeWriter(msgDiv, text);
    } else {
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('ts-msg', role === 'user' ? 'ts-msg-user' : 'ts-msg-ai');
      if (isSystem) msgDiv.classList.add('ts-msg-system');
      
      msgDiv.textContent = text;
      chatBody.appendChild(msgDiv);
    }
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Chips
  starterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (isRequestInFlight) return;
      chatInput.value = chip.textContent;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isRequestInFlight) return;

    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;
    isRequestInFlight = true;
    
    await appendMessage('user', text);
    
    // Hide starter chips
    const chipsContainer = document.getElementById('ts-starter-chips');
    if (chipsContainer) chipsContainer.style.display = 'none';

    // Thinking state
    widget.classList.add('ts-thinking');
    showTypingIndicator();

    history.push({ role: 'user', text });
    if (history.length > 10) history = history.slice(history.length - 10);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      widget.classList.remove('ts-thinking');
      removeTypingIndicator();

      if (response.status === 429) {
        await appendMessage('model', "Too many messages. Try again in a bit.", true);
        history.pop();
        return;
      }

      if (!response.ok) {
        let errStr = 'API Error';
        try {
          const errData = await response.json();
          if (errData.error) errStr = errData.error;
        } catch (e) {}
        throw new Error(errStr);
      }

      const data = await response.json();
      await appendMessage('model', data.reply);
      history.push({ role: 'model', text: data.reply });
      if (history.length > 10) history = history.slice(history.length - 10);

    } catch (err) {
      console.error("Chat API error:", err.message);
      widget.classList.remove('ts-thinking');
      removeTypingIndicator();
      await appendMessage('model', "Something went wrong. Try again in a moment.", true);
      history.pop();
    } finally {
      chatInput.disabled = false;
      sendBtn.disabled = false;
      isRequestInFlight = false;
      chatInput.focus();
    }
  });
})();
