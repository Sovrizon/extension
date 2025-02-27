from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

def encrypt_image(input_path, output_path, key, key_output_file):
    # Lire l'image en mode binaire
    with open(input_path, "rb") as f:
        data = f.read()

    # Assurer que la clé fait 32 octets (remplissage avec des "0")
    key_padded = key.ljust(32, "0").encode("utf-8")[:32]

    # Générer un IV de 12 octets aléatoire
    iv = os.urandom(12)

    aesgcm = AESGCM(key_padded)
    encrypted_data = aesgcm.encrypt(iv, data, None)

    # Sauvegarder le fichier chiffré : IV suivi du ciphertext
    with open(output_path, "wb") as f:
        f.write(iv + encrypted_data)

    # Enregistrer la clé dans un fichier (ceci est moins sécurisé)
    with open(key_output_file, "w") as f:
        f.write(key_padded.decode("utf-8"))

    print("Image chiffrée avec succès.")
    print("Clé utilisée et enregistrée dans", key_output_file)

if __name__ == "__main__":
    input_image = "image.png"          # Chemin de l'image à chiffrer
    output_file = "encrypted_image.bin"  # Fichier de sortie
    key_output_file = "cle.txt"          # Fichier où la clé sera enregistrée
    key = "ma_cle_secrete"               # Exemple de clé
    encrypt_image(input_image, output_file, key, key_output_file)
