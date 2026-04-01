# 🌟 ORION - Plateforme de Signalement JOJ 2026

## 📖 Description de l'application
ORION est une application mobile et web conçue pour les **Jeux Olympiques de la Jeunesse (JOJ) 2026 au Sénégal**. Son objectif est de protéger et coordonner les interventions en permettant au staff, aux bénévoles et aux citoyens de signaler rapidement des incidents (sécurité, médical, technique, logistique) depuis leur téléphone. 

Pour simplifier et accélérer les procédures, **ORION intègre un assistant virtuel (IA Chatbot)** capable de converser en langage naturel avec la victime afin de déduire le lieu, l'urgence, et lancer une alerte qualifiée aux équipes de secours. À l'origine un prototype Web, ce dépôt représente l'architecture professionnelle native Mobile (React Native / Expo).

---

## 📦 Installations nécessaires
Pour contribuer ou tester le projet sur votre machine en local, vous aurez besoin de **Node.js** (v18+).

```bash
# 1. Naviguez vers le répertoire de la version Mobile
cd orion-mobile

# 2. Installez toutes les dépendances (dont React Native, React Navigation, Zustand...)
npm install
```

---

## 🚀 Comment lancer le projet

Le cœur de l'application a été conçu avec le framework **Expo**.

1. Ouvrez un terminal dans le dossier **`orion-mobile`**.
2. Lancez la commande suivante :
   ```bash
   npx expo start
   ```
3. **Tester sur votre appareil** : 
   * **Mobile natif** : Téléchargez l'application **Expo Go** (sur iOS ou Android) et scannez le QR code affiché dans votre terminal.
   * **Simulateur Web** : Appuyez sur la touche **`w`** de votre clavier dans le terminal pour l'ouvrir, via un navigateur classique.

---

## 🎯 Tâches à compléter (Roadmap)
L'application possède actuellement une architecture front-end robuste, modulaire (`components`, `services`, `store`), prête à être branchée (`Squelette natif`), mais gère ses données en mémoire locale pure. Voici les jalons pour obtenir le résultat de production escompté :

- [ ] **Brancher le Backend Définitif** : Modifier `src/services/incidents.service.ts` pour remplacer la sauvegarde `AsyncStorage` par de vraies requêtes HTTP (`Axios`) vers le serveur back-end ORION.
- [ ] **Connecter la Véritable Intelligence Artificielle** : Remplacer l'algorithme "bouchon" basé sur des mots-clés (`src/services/ai.service.ts`) par un appel vers une API Deep Learning / LLM (Mistral, OpenAI) pour une conversation fluide.
- [ ] **Activer la localisation GPS Automatique** : Relier le signalement de `ReportScreen` au capteur natif du téléphone avec `expo-location` pour accroître la précision d'intervention.
- [ ] **Activer l'Upload Photo/Caméra** : Intégrer `expo-image-picker` pour que les utilisateurs puissent joindre les preuves visuelles à l'incident.
- [ ] **Implémenter le Temps Réel (WebSockets)** : Permettre de recevoir des notifications silencieuses depuis le QG pour que l'icône de statut ("En attente" -> "Résolu") change localement en temps réel pour l'utilisateur.
- [ ] **Authentification** : Mettre en place un système de login et de session (`Zustand Store`) pour différencier un Citoyen anonyme d'un Agent ORION habilité.
