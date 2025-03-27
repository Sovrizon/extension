console.log("🧪 content.js chargé");
console.log("chrome.runtime :", chrome?.runtime);
console.log("👀 content.js actif sur :", window.location.href);

// Écoute les messages du frontend
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data) return;

  const { source, action, data } = event.data;

  if (source === "sovrizon-frontend") {
    console.log("📨 Message reçu du frontend :", action, data);

    chrome.runtime.sendMessage({
      from: "content",
      action,
      data
    });
  }
});

// Écoute les messages du background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Reçoit demande de chiffrement
  if (message.from === "frontend" && message.action === "encrypt_image") {
    console.log("🖼️ Image reçue pour chiffrement :", message.data);

    chrome.runtime.sendMessage({
      from: "content",
      action: "encrypt_image",
      data: message.data
    });
  }

  // Reçoit image chiffrée et la transmet au frontend
  if (message.action === "image_encrypted") {
    console.log("📤 Image chiffrée reçue du background :", message.data);

    window.postMessage({
      source: "sovrizon-extension",
      action: "image_encrypted",
      data: message.data
    }, "*");
  }

  // 🔓 Reçoit image déchiffrée et la transmet au frontend
  if (message.action === "receive_key") {
    console.log("📥 Image déchiffrée reçue du background :", message);

    const { image_id, decrypted_image, valid } = message;

    if (!image_id || !decrypted_image) {
      console.error("❌ Données invalides reçues :", message);
      return;
    }

    window.postMessage({
      source: "sovrizon-extension",
      action: "receive_key",
      image_id,
      decrypted_image,
      valid: valid ?? true  // ✅ ici on assure que valid = true par défaut
    }, "*");
  }
});