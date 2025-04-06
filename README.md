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

- 🔐 **Récupération automatique du token** via le tiers de confiance (serveur externe sécurisé)
- 💾 **Stockage local sécurisé du token** dans `chrome.storage.local`
- 🔁 **Mise à jour automatique du token** à chaque connexion utilisateur sur Secugram
- 🔗 **Communication directe avec le frontend** de Secugram pour déclencher le processus de déchiffrement
- 🧭 **Requête au tiers de confiance** pour obtenir la clé de déchiffrement si le token est valide
- 🖼️ **Déchiffrement conditionnel** des images chiffrées uniquement pour les utilisateurs autorisés
- ❌✅ **Modification de la validité** d’une image (activer/désactiver) via l’interface popup de l’extension
- 🔐 **Chiffrement des images** effectué côté serveur (backend Secugram), la clé est uniquement transmise via le tiers
- 🧾 **Logs détaillés** dans la console du `background.js` pour débogage et suivi du flux

---

## 🧪 Debug

- Ouvrir `chrome://extensions`
- Cliquer sur **"Service Worker (background.js)" > Inspecter**
- On y voit les logs du déchiffrement, tokens, erreurs éventuelles
