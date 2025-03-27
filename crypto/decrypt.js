
function decryptImageWithKey(encryptedBase64, keyBase64) {
    const encryptedData = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const keyBytes = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));

    return crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    ).then((key) => {
        const iv = encryptedData.slice(0, 12); // assume 96-bit IV
        const ciphertext = encryptedData.slice(12);

        return crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            ciphertext
        );
    }).then((decryptedBuffer) => {
        const decodedText = new TextDecoder().decode(decryptedBuffer);
        return decodedText;
    }).catch((err) => {
        console.error("Erreur de déchiffrement :", err);
        return null;
    });
}