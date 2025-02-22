(() => {
  // 1. Finn søkefeltet (juster ID/selektor om nødvendig)
  const searchInput = document.querySelector('#header-search');
  if (!searchInput) {
    console.warn("Fant ikke søkefelt med ID '#header-search'.");
    return;
  }

  // 2. Bruk parent-elementet til søkefeltet som container
  const container = searchInput.parentElement;
  // Sørg for at containeren har posisjon + z-index
  container.style.position = "relative";
  container.style.zIndex = "9999";

  // 3. Juster søkefeltet slik at det ikke overlapper med knappen
  searchInput.style.paddingRight = "60px";

  // 4. Opprett en AI-knapp som plasseres helt til høyre i søkefeltet
  const aiBtn = document.createElement('button');
  aiBtn.innerText = "AI";
  aiBtn.style.position = "absolute";
  aiBtn.style.top = "50%";
  aiBtn.style.right = "8px";
  aiBtn.style.transform = "translateY(-50%)";
  aiBtn.style.cursor = "pointer";
  aiBtn.style.padding = "4px 8px";
  aiBtn.style.zIndex = "1000";
  container.appendChild(aiBtn);

  // 5. Opprett en dropdown-container for Voiceflow-chatten, rett under søkefeltet
  const chatContainer = document.createElement('div');
  chatContainer.id = "voiceflow-container";
  chatContainer.style.position = "absolute";
  chatContainer.style.top = "100%";
  chatContainer.style.right = "0";
  chatContainer.style.width = "350px";
  chatContainer.style.maxHeight = "500px";
  chatContainer.style.overflow = "auto";
  chatContainer.style.border = "1px solid #ccc";
  chatContainer.style.backgroundColor = "#fff";
  chatContainer.style.display = "none"; // skjult inntil vi klikker på knappen
  // Sett høy z-index for å ligge over navigasjonsmenyen
  chatContainer.style.zIndex = "99999";
  container.appendChild(chatContainer);

  // 6. Legg til toggle-funksjonalitet på AI-knappen
  aiBtn.addEventListener('click', () => {
    chatContainer.style.display = (chatContainer.style.display === "none") ? "block" : "none";
  });

  // 7. Last inn Voiceflow-chatten i embedded-modus med chatContainer som mål
  (function(d, t) {
    var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
    v.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: '67891dc58be20586cd1445e8' }, // Bytt ut med ditt prosjekt-ID
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        assistant: {
          stylesheet: "https://kristoman-rikardo.github.io/dafaq/style.css" // Egen styling
        },
        render: {
          mode: 'embedded',
          target: chatContainer, // Plasser chatten i dropdown-containeren
        },
        launch: {
          event: {
            type: "launch",
            payload: { test_url: window.location.href }
          }
        },
        autostart: true,
      });
    };
    v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    v.type = "text/javascript";
    s.parentNode.insertBefore(v, s);
  })(document, 'script');

  console.log("✅ Voiceflow-chat er integrert i søkefeltet med AI-knapp, og skal ligge over 'Kategorier'.");
})();
