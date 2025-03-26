importScripts("crypto/encrypt.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === "content") {
        console.log("📦 Message reçu dans background.js :", message.action, message.data);

        if (message.action === "encrypt_image") {
            const { image_base64, image_id, vault_url } = message.data;

            console.log("🔐 Début du chiffrement de l’image", image_id);

            encryptImage(image_base64)
                .then(encryptedBase64 => {
                    console.log("✅ Chiffrement terminé pour", image_id);
                    console.log("📤 Envoi de l’image chiffrée au content.js via tabs.sendMessage");

                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs.length > 0) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                source: "sovrizon-extension",
                                action: "encrypt_image",
                                status: "success",
                                data: {
                                    image_id,
                                    encrypted_image: encryptedBase64
                                }
                            });
                        } else {
                            console.warn("⚠️ Aucun onglet actif trouvé pour envoyer la réponse.");
                        }
                    });
                })
                .catch(err => {
                    console.error("❌ Erreur pendant le chiffrement :", err);
                });
        }
    }
});