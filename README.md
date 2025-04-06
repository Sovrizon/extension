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
- Communication entre : extension ⇄ frontend ⇄ serveur de confiance

---

## 🌐 Dépendances externes

- `https://secugram.web.app` (frontend)
- `https://tiers-de-confiance.onrender.com` (tiers de confiance)

---

## 🚀 Installation en mode développeur

1. Cloner le dépôt :

```
git clone https://github.com/ton-user/extension.git
cd extension
```

2. Ouvrir `chrome://extensions`

3. Activer **"Mode développeur"**

4. Cliquer sur **"Charger l’extension non empaquetée"**

5. Sélectionner le dossier `extension/`

---



## 🎥 Tutoriel vidéo

Une démonstration d'installation pas à pas est disponible ci-dessous :

▶️ [tutoriel installation extension.mp4](./media/tutoriel%20installation%20extension.mp4)

> Cette vidéo montre comment charger l’extension dans Chrome, activer le mode développeur et l’utiliser avec Secugram.


--- 
## ⚙️ Configuration

Le fichier `config.js` contient les URLs utilisées pour communiquer avec les services :

```
const ENV = "production";

const config = {
development: {
FRONTEND_URL: "http://localhost:5173/",
TIERS_URL: "http://localhost:8300/"
},
production: {
FRONTEND_URL: "https://secugram.web.app/",
TIERS_URL: "https://tiers-de-confiance.onrender.com/"
}
};

export const { FRONTEND_URL, TIERS_URL } = config[ENV];
```

---

## 📦 Fonctionnalités

- **Affichage du token courant** depuis `chrome.storage.local`
- **Mise à jour automatique du token** après une connexion sur Secugram
- **Déchiffrement conditionnel** des images après validation
- **Changement de validité** (activer/désactiver une image chiffrée)
- **Logs détaillés** dans la console du background

---

## 🧪 Debug

- Ouvre `chrome://extensions`
- Clique sur **"Service Worker (background.js)" > Inspecter**
- Tu y verras les logs du déchiffrement, tokens, erreurs éventuelles

---

## 🛑 Permissions

Le `manifest.json` ne demande que les permissions nécessaires :

- `"storage"` : pour mémoriser le token
- `"activeTab"` / `"scripting"` : pour injecter les scripts de déchiffrement
- `"host_permissions"` : uniquement pour les domaines nécessaires
- `"tabs"` : interaction avec l’onglet actif

---

## 📝 Licence

Projet développé dans le cadre d’un projet étudiant.  
Auteur : Loqmen ANANI  
Licence : MIT