# Suivi d'indices boursiers

Application Vue.js permettant d'ajouter et de suivre des indices boursiers

## Choix techniques
- Vue 3, Vite
- localStorage pour conserver les données des indices sauvegardee.

## Lancer le projet
1. Installer les dépendances avec bash :
   
   npm install
   
2. lancer le serveur Back:
   
   cd backend/
   
   npm start
   
3. lancer le Front (aller dans le dossier front) :
   
   npm run dev
   
## Fonctionnalités terminées
- Ajout, modification et suppression d’indice.
- Affichage des variations de prix avec icône pour une meilleur visualisation.
- Affichage des détails (prix haut/bas, variation %).
- Données sauvegardées localement (localStorage).
- 
## Ce qui reste à faire
- Écrire des tests unitaires
- Ameliorer l'interface
- Prendre en compte les possibles contraintes si on a beaucoup d'indice suivis
