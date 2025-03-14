(() => {
  /****************************************************
   * 1. Finn søkefeltet (juster selektor om nødvendig)
   ****************************************************/
  const searchInput = document.querySelector('.live_search_box input');
  if (!searchInput) {
    console.warn("Fant ikke søkefelt med '.live_search_box input'. Juster querySelector om nødvendig.");
    return;
  }

  /**********************************************************************
   * 2. Bruk parent-elementet til søkefeltet som container + styling
   **********************************************************************/
  const container = searchInput.parentElement;
  container.style.position = "relative";
  container.style.zIndex = "9999";

  /**************************************************************************
   * 3. Juster søkefeltets padding, så ikke togglen/ikonet overlapper
   **************************************************************************/
  searchInput.style.paddingRight = "60px";

  /************************************************************
   * 4. Opprett en av/på-toggle (slider) + sparkle-ikon
   ************************************************************/
  // -- Legg til litt CSS for selve togglen --
  const style = document.createElement('style');
  style.textContent = `
    .ai-toggle-container {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      align-items: center;
      font-family: sans-serif;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      margin-right: 8px;
    }
    .switch input { 
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #444;    /* Mørk grå (av) */
      transition: .4s;
      border-radius: 34px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: #fff;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: #000;    /* Svart (på) */
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
    /* Ikon-styling */
    .ai-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #444; /* Av-farge på ikonet */
      transition: color 0.3s;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // -- Opprett container for toggle og ikon --
  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'ai-toggle-container';

  // -- Selve togglen (label + input + slider) --
  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'switch';

  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.checked = false; // default: av

  const sliderSpan = document.createElement('span');
  sliderSpan.className = 'slider';

  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(sliderSpan);

  // -- Sparkle-ikon (inline SVG) --
  const aiIcon = document.createElement('span');
  aiIcon.className = 'ai-icon';
  aiIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sparkles" fill="none"
         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M9.813 15.486l.334 1.026a1 1 0 001.906 0l.334-1.026
           1.026-.334a1 1 0 000-1.906l-1.026-.334-.334-1.026a1 1 0 00-1.906 0l-.334
           1.026-1.026.334a1 1 0 000 1.906l1.026.334z" />
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M15.816 9.336l.53 1.629a1 1 0 001.9 0l.53-1.63
           1.63-.53a1 1 0 000-1.899l-1.63-.53-.53-1.63a1 1 0 00-1.899 0l-.53
           1.63-1.63.53a1 1 0 000 1.899l1.63.53z" />
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M6.386 9.336l.53 1.629a1 1 0 001.9 0l.53-1.63
           1.63-.53a1 1 0 000-1.899l-1.63-.53-.53-1.63a1 1 0 00-1.899 0l-.53
           1.63-1.63.53a1 1 0 000 1.899l1.63.53z" />
    </svg>
  `;

  // -- Legg alt inn i containeren og i DOM --
  toggleContainer.appendChild(toggleLabel);
  toggleContainer.appendChild(aiIcon);
  container.appendChild(toggleContainer);

  /***************************************************************
   * 5. Opprett en dropdown-container for Voiceflow-chatten
   ***************************************************************/
  const chatContainer = document.createElement('div');
  chatContainer.id = "voiceflow-container";
  chatContainer.style.position = "absolute";
  chatContainer.style.top = "100%";
  chatContainer.style.right = "0";
  // Sett bredden enten fast 511px eller dynamisk:
  // chatContainer.style.width = searchInput.offsetWidth + "px"; // Dynamisk
  chatContainer.style.width = "511px"; // Fast 511 px (juster om du vil)
  chatContainer.style.maxHeight = "500px";
  chatContainer.style.overflow = "auto";
  chatContainer.style.border = "1px solid #000";    // Svart ramme
  chatContainer.style.backgroundColor = "#fff";     // Hvit bakgrunn
  chatContainer.style.display = "none"; // Skjult til togglen er "på"
  chatContainer.style.zIndex = "999999";            // Ekstra høy z-index
  container.appendChild(chatContainer);

  /******************************************************
   * 6. Toggle-funksjonalitet: viser/skjuler chatten
   *    + endrer farge på ikonet
   ******************************************************/
  const offColor = "#444";   // "Av"-farge på ikonet
  const onColor  = "#000";   // "På"-farge (svart)
  aiIcon.style.color = offColor;

  toggleInput.addEventListener('change', () => {
    if (toggleInput.checked) {
      chatContainer.style.display = "block";
      aiIcon.style.color = onColor;
    } else {
      chatContainer.style.display = "none";
      aiIcon.style.color = offColor;
    }
  });

  // Klikk på selve ikonet kan også toggles (valgfritt)
  aiIcon.addEventListener('click', () => {
    toggleInput.checked = !toggleInput.checked;
    toggleInput.dispatchEvent(new Event('change'));
  });

  /********************************************************
   * 7. Last inn Voiceflow-chatten (embedded)
   ********************************************************/
  (function(d, t) {
    const v = d.createElement(t), s = d.getElementsByTagName(t)[0];
    v.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: '67891dc58be20586cd1445e8' }, // Bytt til riktig projectID
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        assistant: {
          stylesheet: "https://kristoman-rikardo.github.io/dafaq/style.css" // Evt. egen styling
        },
        render: {
          mode: 'embedded',
          target: chatContainer
        },
        launch: {
          event: {
            type: "launch",
            payload: { browser_url: window.location.href }
          }
        },
        autostart: true, // Sett true om du vil at chatten starter automatisk
      });
    };
    v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    v.type = "text/javascript";
    s.parentNode.insertBefore(v, s);
  })(document, 'script');

  console.log("✅ AI-toggle (sparkle-ikon) og Voiceflow-chat er lagt til i søkefeltet.");
})();
