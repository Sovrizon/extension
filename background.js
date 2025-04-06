import { FRONTEND_URL, TIERS_URL } from "./config.js";

function uint8ToBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000; // 32k
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
    }
    return btoa(binary);
}

async function encryptImageWithKey(base64Image, keyBase64) {
    if (typeof base64Image !== 'string' || base64Image.length > 5_000_000) {
        throw new Error("📛 Image invalide ou trop lourde pour le chiffrement.");
    }

    const keyBytes = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const imageBytes = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));

    const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, imageBytes);

    const encryptedBytes = new Uint8Array(encrypted);
    const result = new Uint8Array(iv.length + encryptedBytes.length);
    result.set(iv);
    result.set(encryptedBytes, iv.length);

    return uint8ToBase64(result);
}


async function decryptImageWithKey(base64Encrypted, keyBase64) {
    if (!keyBase64 || typeof keyBase64 !== 'string') {
        throw new Error("❌ Clé de déchiffrement manquante ou invalide.");
    }

    if (typeof base64Encrypted !== 'string' || base64Encrypted.length > 5_000_000) {
        throw new Error("❌ Données chiffrées invalides ou trop lourdes.");
    }

    const keyBytes = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
    const encryptedBytes = Uint8Array.from(atob(base64Encrypted), c => c.charCodeAt(0));

    if (encryptedBytes.length < 13) {
        throw new Error("❌ Données chiffrées invalides ou trop courtes.");
    }

    const iv = encryptedBytes.slice(0, 12);
    const data = encryptedBytes.slice(12);

    const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);

    return uint8ToBase64(new Uint8Array(decryptedBuffer));
}

    // 💾 Enregistrement direct de l’image déchiffrée
    // const blob = new Blob([decryptedBuffer], { type: "image/png" });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "decrypted_image.png";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);


    // URL.revokeObjectURL(url);




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {

        // 🔐 Stocke les données et attend que le token soit fourni via popup
        case "decrypt_with_token": {
            console.log("📩 decrypt_with_token reçu sans token (attente via popup)");

            chrome.storage.local.set({ decrypt_payload: message.data }, () => {
                console.log("🕒 Données stockées dans decrypt_payload. En attente du token via popup...");
            });

            break;
        }


        // 🔑 Réception du token depuis popup.js
        case "set_token": {
            const token = message.data.token;
            console.log("📥 Token reçu depuis popup :", token);

            // Stocke le token
            chrome.storage.local.set({ trust_token: token }, () => {
                console.log("✅ Token stocké, déclenchement de decrypt_with_token");

                // Récupère les données précédemment envoyées par Home.jsx
                chrome.storage.local.get(["decrypt_payload"], ({ decrypt_payload }) => {
                    if (!decrypt_payload) {
                        console.error("❌ Aucun payload de déchiffrement en attente.");
                        return;
                    }

                    const { username, image_ids, encrypted_images } = decrypt_payload;

                    image_ids.forEach((image_id) => {
                        fetch(`${TIERS_URL}/get_key/${image_id}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ token, username })
                        })
                            .then(res => res.json())
                            .then(async data => {
                                const encryptedImage = encrypted_images[image_id];
                                console.log("🔍 Tentative de déchiffrement :", {
                                    image_id,
                                    encryptedImage: encrypted_images[image_id],
                                    key: data.key
                                });
                                const decryptedImage = await decryptImageWithKey(encryptedImage, data.key);
                                // console.log("🔓 Image déchiffrée pour", decryptedImage);

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
                            })
                            .catch(err => {
                                console.error(`❌ Erreur pour ${image_id} :`, err);
                            });
                    });
                });
            });

            break;
        }



        // 🆕 Enregistrement utilisateur
        case "register_user": {
            if (message.from !== "content") return;

            const username = message.data.username;
            console.log("🆕 Utilisateur enregistré :", username);

            fetch(`${TIERS_URL}/register_viewer`, {
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

            fetch(`${TIERS_URL}/set_key`, {
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


        // 🔐 Déchiffrement des images
        case "decrypt_with_token": {
            console.log("📩 Message decrypt_with_token reçu dans background.js");

            const { token, username, image_ids, encrypted_images } = message.data;
            console.log("🔑 Token reçu :", token, "| 👤 Utilisateur :", username);

            image_ids.forEach((image_id) => {
                fetch(`${TIERS_URL}/get_key/${image_id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, username })
                })
                    .then(res => res.json())
                    .then(async data => {
                        console.log(`🔓 Clé récupérée pour ${image_id} :`, data.key);

                        const encryptedImage = encrypted_images[image_id];
                        const decryptedImage = await decryptImageWithKey(encryptedImage, data.key);

                        // Transmission de l’image déchiffrée au content script
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
                    })
                    .catch(err => {
                        console.error(`❌ Erreur lors de la récupération ou du déchiffrement de ${image_id} :`, err);
                    });
            });

            break;
        }

        case "user_logged_in": {
            console.log("📬 Message reçu dans background :", message);
            const username = message.username;
            if (!username) return;

            fetch(`${TIERS_URL}/trust_token/${username}`)
                .then(res => res.json())
                .then(({ token }) => {
                    if (token) {
                        chrome.storage.local.set({
                            trust_token: token,
                            trust_token_updated_at: Date.now()
                        });
                        console.log("✅ Token mis à jour automatiquement pour", username, ":", token);
                    }
                })
                .catch(err => {
                    console.error("❌ Erreur récupération trust_token pour", username, ":", err);
                });
            break;
        }

        default:
            console.warn("❔ Action non reconnue :", message.action);
    }
});


function handleDecryptWithToken(payload) {
    const { username, image_ids, encrypted_images } = payload;

    chrome.storage.local.get(["trust_token"], ({ trust_token }) => {
        if (!trust_token) {
            console.error("❌ Aucun token enregistré pour déchiffrement.");
            return;
        }

        image_ids.forEach((image_id) => {
            fetch(`${TIERS_URL}/get_key/${image_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: trust_token, username })
            })
                .then(res => res.json())
                .then(async data => {
                    const encryptedImage = encrypted_images[image_id];
                    console.log("🔍 Tentative de déchiffrement :", {
                        image_id,
                        encryptedImage,
                        key: data.key
                    });

                    const decryptedImage = await decryptImageWithKey(encryptedImage, data.key);

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
                })
                .catch(err => {
                    console.error(`❌ Erreur pour ${image_id} :`, err);
                });
        });
    });
}