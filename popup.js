document.addEventListener("DOMContentLoaded", () => {
    const tokenInput = document.getElementById("tokenInput");
    const tokenDisplay = document.getElementById("tokenDisplay");

    // Charger le token existant depuis chrome.storage.local
    chrome.storage.local.get("trust_token", ({ trust_token }) => {
        if (trust_token) {
            tokenDisplay.textContent = `Token actuel : ${trust_token}`;
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
});