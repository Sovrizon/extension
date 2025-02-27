document.getElementById("decryptButton").addEventListener("click", async () => {
    const file = document.getElementById("imageInput").files[0];
    const key = document.getElementById("keyInput").value;

    if (!file || !key) {
        alert("Veuillez sélectionner une image et entrer une clé.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        const encryptedData = new Uint8Array(event.target.result);
        const decryptedData = await decryptImage(encryptedData, key);
        displayImage(decryptedData);
    };
    reader.readAsArrayBuffer(file);
});

async function decryptImage(encryptedData, key) {
    // Exemple avec AES-GCM
    const keyBuffer = new TextEncoder().encode(key.padEnd(32, "0")).slice(0, 32);
    const cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, ["decrypt"]);
    try {
        const iv = encryptedData.slice(0, 12); // IV stocké dans l'image chiffrée
        const cipherText = encryptedData.slice(12);
        const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, cipherText);
        return new Uint8Array(decryptedBuffer);
    } catch (e) {
        alert("Échec du déchiffrement !");
        console.error(e);
        return null;
    }
}

function displayImage(imageData) {
    if (!imageData) return;
    const blob = new Blob([imageData], { type: "image/png" });
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
}
