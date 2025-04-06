import { FRONTEND_URL, TIERS_URL } from "./config.js";


function updateTokenDisplayAndFields() {
    const tokenDisplay = document.getElementById("tokenDisplay");
    const tokenInput = document.getElementById("tokenInput");
    const validityTokenInput = document.getElementById("validityTokenInput");

    chrome.storage.local.get("trust_token", ({ trust_token }) => {
        if (trust_token) {
            console.log("🔐 trust_token récupéré depuis chrome.storage :", trust_token);
            tokenDisplay.textContent = `Token actuel : ${trust_token}`;
            if (tokenInput) tokenInput.value = trust_token;
            if (validityTokenInput) validityTokenInput.value = trust_token;
        } else {
            console.log("ℹ️ Aucun trust_token stocké.");
            tokenDisplay.textContent = "Aucun token stocké.";
            if (tokenInput) tokenInput.value = "";
            if (validityTokenInput) validityTokenInput.value = "";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateTokenDisplayAndFields();

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && (changes.trust_token || changes.trust_token_updated_at)) {
            updateTokenDisplayAndFields();
        }
    });

    // Enregistrer un nouveau token via le champ d'entrée
    document.getElementById("decryptButton").addEventListener("click", () => {
        const token = document.getElementById("tokenInput").value;
        console.log("🖱️ Bouton 'Déchiffrer' cliqué");
        console.log("📤 Token récupéré depuis input :", token);

        if (!token) {
            console.warn("⚠️ Aucun token saisi.");
            document.getElementById("tokenDisplay").textContent = "❌ Aucun token saisi.";
            return;
        }

        chrome.runtime.sendMessage({
            from: "popup",
            action: "set_token",
            data: { token }
        }, () => {
            console.log("📨 Message 'set_token' envoyé au background");
        });

        chrome.storage.local.set({ trust_token: token }, () => {
            console.log("💾 Token stocké dans chrome.storage.local");
            document.getElementById("tokenDisplay").textContent = `Token actuel : ${token}`;
        });
    });

    // 🎛️ Rendre invalide
    document.getElementById("invalidateButton").addEventListener("click", () => {
        updateImageValidity(false);
    });

    // ✅ Rendre valide
    document.getElementById("validateButton").addEventListener("click", () => {
        updateImageValidity(true);
    });

    function updateImageValidity(valid) {
        const username = document.getElementById("ownerInput").value.trim();
        const imageId = document.getElementById("imageIdInput").value.trim();
        const token = document.getElementById("validityTokenInput").value.trim();
        const status = document.getElementById("validityStatus");

        status.className = "status info";
        status.textContent = "";

        if (!username || !imageId || !token) {
            status.textContent = "❌ Veuillez remplir tous les champs.";
            return;
        }

        fetch(`${TIERS_URL}/update_validity/${username}/${imageId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ valid, token })
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    let msg = "Erreur inconnue.";

                    if (res.status === 403) msg = "❌ Token invalide ou nom d'utilisateur incorrect.";
                    else if (res.status === 404) msg = "❌ Clé non trouvée pour cette image.";
                    else msg = `❌ Erreur ${res.status} : ${text}`;

                    throw new Error(msg);
                }
                return res.json();
            })
            .then(data => {
                status.className = "status success";
                status.textContent = `✅ Succès : ${data.message}`;
            })
            .catch(err => {
                console.error(err);
                status.className = "status error";
                status.textContent = `❌ Erreur : ${err.message}`;
            });
    }

});
