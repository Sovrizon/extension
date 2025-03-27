async function encryptImageWithKey(base64Image, keyBase64) {
    const keyBytes = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const imageBytes = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));

    const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, imageBytes);

    const encryptedBytes = new Uint8Array(encrypted);
    const result = new Uint8Array(iv.length + encryptedBytes.length);
    result.set(iv);
    result.set(encryptedBytes, iv.length);

    return btoa(String.fromCharCode(...result));
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {

        // 🔓 Déchiffrement des images
        case "decrypt_with_token": {
            console.log("📩 Message decrypt_with_token reçu dans background.js");

            const { token, username, image_ids, encrypted_images } = message.data;
            console.log("🔑 Token reçu :", token, "| 👤 Utilisateur :", username);

            image_ids.forEach((image_id) => {
                fetch(`http://127.0.0.1:8300/get_key/${image_id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, username })
                })
                    .then(res => res.json())
                    .then(data => {
                        const encryptedImage = encrypted_images[image_id];

                        decryptImageWithKey(encryptedImage, data.key).then((decryptedImage) => {
                            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                if (tabs.length > 0) {
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        source: "sovrizon-extension",
                                        action: "receive_key",
                                        image_id,
                                        decrypted_image: decryptedImage,
                                        valid: data.valid
                                    });
                                }
                            });
                        });
                    })
                    .catch(err => {
                        console.error(`❌ Erreur pour l’image ${image_id} :`, err);
                    });
            });
            break;
        }

        // 🆕 Enregistrement utilisateur
        case "register_user": {
            if (message.from !== "content") return;

            const username = message.data.username;
            console.log("🆕 Utilisateur enregistré :", username);

            fetch("http://127.0.0.1:8300/register_viewer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ viewer_username: username })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("🎫 Token reçu du tiers de confiance :", data.token);
                    chrome.storage.local.set({ trust_token: data.token });
                })
                .catch(err => {
                    console.error("❌ Erreur lors de l’enregistrement auprès du tiers :", err);
                });
            break;
        }

        // 🔐 Chiffrement des images
        case "encrypt_image": {
            if (message.from !== "content") return;

            const { image_base64, image_id, username, valid, valid_from, valid_to } = message.data;
            console.log("🔐 Chiffrement de l'image pour l'utilisateur :", username);

            fetch("http://127.0.0.1:8300/set_key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image_id,
                    owner_username: username,
                    valid_from,
                    valid_to,
                    valid
                })
            })
                .then(res => res.json())
                .then(async data => {
                    console.log("🌟 Réponse de /set_key :", data);

                    // 🔐 Chiffrement local avec clé reçue
                    const encryptedImage = await encryptImageWithKey(image_base64, data.key);

                    // Envoi au frontend via content.js
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs.length > 0) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                from: "background",
                                action: "image_encrypted",
                                data: {
                                    image_id,
                                    encrypted_image: encryptedImage,
                                    token: data.token,
                                    key: data.key // à retirer si sensible
                                }
                            });
                        }
                    });
                })
                .catch(err => {
                    console.error("❌ Erreur lors de l'envoi à /set_key :", err);
                });
            break;
        }
        default:
            console.warn("❔ Action non reconnue :", message.action);
    }
});