# 🧩 Sovrizon - Extension Chrome

Cette extension Chrome permet aux utilisateurs de **visualiser des images chiffrées** via la plateforme Secugram, en interagissant avec un **tiers de confiance** pour la récupération et la validation des clés de déchiffrement.

---

## 🔐 Objectif

- Afficher dynamiquement les images chiffrées pour les utilisateurs autorisés
- Gérer automatiquement le **token d’authentification sécurisé**
- Modifier la validité d’une image (accessible ou non)
- Communiquer avec le **frontend** de Secugram et le **tiers de confiance**

---

## 🧱 Technologies

- Manifest V3
- Service Worker (`background.js`)
- HTML + Tailwind CSS pour l’interface (`popup.html`)
- Communication entre : extension ⇄ frontend ⇄ tiers de confiance

---

## 🌐 Dépendances externes

-  **Frontend Secugram** : [https://secugram-82493.web.app/](https://secugram-82493.web.app/)
-  **Backend Secugram** : [https://secugram.onrender.com/docs](https://secugram.onrender.com/docs)
- **Tiers de confiance** : [https://tiers-de-confiance.onrender.com/docs](https://tiers-de-confiance.onrender.com/docs)

---

## 🚀 Installation en mode développeur

1. Cloner le dépôt :

```
git clone https://github.com/ton-user/extension.git
```

2. Aller dans `chrome://extensions` dans le navigateur Chrome

3. Activer **"Mode développeur"**

4. Cliquer sur **"Charger l’extension non empaquetée"**

5. Sélectionner le dossier `extension/`

---



## 🎥 Tutoriel vidéo

Une démonstration d'installation pas à pas est disponible [ici](https://youtu.be/OJDMdyuysH4)

> Cette vidéo montre comment charger l’extension dans Chrome en activant le mode développeur.



---

## 📦 Fonctionnalités

- 🔐 **Gestion des tokens d'authentification** via communication sécurisée avec le tiers de confiance
- 💾 **Persistance des données de sécurité** dans le stockage local de l'extension (`chrome.storage.local`)
- 🔄 **Synchronisation automatique des tokens** lors de l'authentification utilisateur sur Secugram
- 🔗 **Architecture de communication bidirectionnelle** entre le frontend Secugram et l'extension via messaging API
- 🛡️ **Authentification sécurisée** auprès du tiers de confiance pour la récupération des clés cryptographiques
- 🔒 **Cryptographie AES-GCM** pour le chiffrement/déchiffrement des images avec vecteur d'initialisation (IV)
- 🚦 **Gestion des autorisations d'accès** via l'interface popup de l'extension (activation/révocation)
- 📦 **Séparation des responsabilités** : chiffrement client-side avec clés fournies par le tiers de confiance
- 📊 **Journalisation structurée** dans le service worker background pour audit et débogage
---

## 🧪 Debug

- Ouvrir `chrome://extensions`
- Cliquer sur **"Service Worker (background.js)" > Inspecter**
- On y voit les logs du déchiffrement, tokens, erreurs éventuelles
