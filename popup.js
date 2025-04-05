document.addEventListener("DOMContentLoaded", () => {
    const tokenInput = document.getElementById("tokenInput");
    const tokenDisplay = document.getElementById("tokenDisplay");

    // Charger le token existant depuis chrome.storage.local
    chrome.storage.local.get("trust_token", ({ trust_token }) => {
        if (trust_token) {
            tokenDisplay.textContent = `Token actuel : ${trust_token}`;

            const validityTokenInput = document.getElementById("validityTokenInput");
            if (validityTokenInput) {
                validityTokenInput.value = trust_token;
            }

            const tokenInput = document.getElementById("tokenInput");
            if (tokenInput) {
                tokenInput.value = trust_token;  // ✅ ici on pré-remplit aussi pour le déchiffrement
            }

        } else {
            tokenDisplay.textContent = "Aucun token stocké.";
        }
    });

    // Enregistrer un nouveau token via le champ d'entrée
    document.getElementById("decryptButton").addEventListener("click", () => {
        const token = tokenInput.value;

        chrome.runtime.sendMessage({
            from: "popup",
            action: "set_token",
            data: { token }
        });

        chrome.storage.local.set({ trust_token: token }, () => {
            tokenDisplay.textContent = `Token actuel : ${token}`;
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

        fetch(`http://127.0.0.1:8300/update_validity/${username}/${imageId}`, {
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


