# 🧩 Sovrizon - Extension Chrome

Ce dépôt contient le code source de l'**extension Chrome** pour le projet Sovrizon. Cette extension permet aux utilisateurs de **visualiser des images chiffrées** via la plateforme Secugram, en interagissant avec un **tiers de confiance** pour la récupération et la validation des clés de déchiffrement.

---

## 🔐 Objectif

- Afficher dynamiquement les images chiffrées pour les utilisateurs autorisés
- Gérer automatiquement le **token d'authentification sécurisé**
- Modifier la validité d'une image (accessible ou non)
- Communiquer avec le **frontend** de Secugram et le **tiers de confiance**

---

## 🧱 Technologies

- Manifest V3
- Service Worker (`background.js`)
- HTML + Tailwind CSS pour l'interface (`popup.html`)
- Communication entre : extension ⇄ frontend ⇄ tiers de confiance


---

## 🚀 Installation

1. Cloner le dépôt :

```
git clone https://github.com/ton-user/extension.git
```

2. Aller dans `chrome://extensions` dans le navigateur Chrome

3. Activer **"Mode développeur"**

4. Cliquer sur **"Charger l'extension non empaquetée"**

5. Sélectionner le dossier `extension/`


Une démonstration d'installation pas à pas est disponible [ici](https://youtu.be/OJDMdyuysH4)

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

---


## 🧩 Intégration système

Cette extension est conçue pour fonctionner en conjonction avec :
- L'application web [secugram](https://github.com/Sovrizon/secugram) qui chiffre les images
- Le [tiers-de-confiance](https://github.com/sovrizon/tiers-de-confiance) qui gère les clés et tokens

---

## 👥 Auteurs et Contribution

Ce projet a été développé par :
- **Rémy GASMI**
- **Simon VINCENT**
- **Loqmen ANANI**

dans le cadre de leur projet de 3ème année à l'École Centrale de Lyon.

---

## 📄 Licence

© 2025 Sovrizon – Tous droits réservés.
