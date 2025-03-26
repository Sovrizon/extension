console.log("🧪 content.js chargé");
console.log("chrome.runtime:", chrome?.runtime);
console.log("👀 content.js actif sur :", window.location.href);

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== "sovrizon-frontend") return;

  const { action, data } = event.data;
  console.log("📨 Message reçu du frontend :", action, data);

  chrome.runtime.sendMessage({
    from: "content",
    action,
    data
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.source === "sovrizon-extension" && msg.action === "encrypt_image") {
    console.log("📬 Message reçu du background.js :", msg);
    console.log("🔁 Repost vers frontend...");

    window.postMessage({
      source: "sovrizon-extension",
      action: "encrypt_image",
      status: "success",
      data: msg.data
    }, "*");
  }
});
