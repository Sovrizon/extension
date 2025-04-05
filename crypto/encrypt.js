async function encryptImage(base64Image) {
  const rawData = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));

  // Générer une clé AES 256 bits
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // IV de 96 bits

  // Chiffrer
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    rawData
  );

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Convertir en base64
  const encryptedBase64 = btoa(String.fromCharCode(...combined));

  return encryptedBase64;
}

// Exporter pour le background.js
self.encryptImage = encryptImage;
