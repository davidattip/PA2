# PA-PCS-2024

Bienvenue sur le dépôt du projet PA-PCS-2024. Ce README a pour but de guider les contributeurs et de fournir des informations essentielles sur les conventions de notre projet.

## 📝 Convention de Nomination des Branches

Pour assurer une cohérence et faciliter la gestion de notre code, nous adoptons une convention de nommage claire pour les branches. Cela aide tous les membres de l'équipe à comprendre le but de chaque branche et à naviguer facilement dans le projet.

Voici nos conventions de nommage des branches :

- **`feature/nom-de-la-fonctionnalite`** : Utilisez cette préfixe pour les branches où vous travaillez sur de nouvelles fonctionnalités.
- **`bugfix/description-du-bug`** : Pour les corrections de bugs, préfixez votre branche avec `bugfix/`.
- **`hotfix/description-du-probleme`** : Les correctifs urgents qui ne peuvent attendre le prochain cycle de release doivent être préfixés par `hotfix/`.
- **`release/version`** : Pour préparer une nouvelle version ou une release, utilisez le préfixe `release/` suivi du numéro ou du nom de la version.

### Exemple

Si vous travaillez sur une mise à jour des conventions de README, votre branche pourrait s'appeler :

```yaml
branches:
  - name: docs/update-readme-conventions
    description: Mise à jour des conventions du README
```

# Collaboration Dev FRONT-END / BACK-END

Bienvenue dans notre guide de collaboration et d'intégration . Cet espace est dédié à établir des pratiques claires pour bosser entre développeurs Front-End et Back-End ensemble de manière efficace et harmonieuse.

## 🛠 API et Contrats

- **Définition des Contrats d'API :** Au début du projet, il est crucial de définir clairement les contrats d'API. Cela comprend la structure des requêtes et des réponses attendues. Cette démarche permet au développeur front-end de savoir précisément à quoi s'attendre et de commencer à travailler avec des données mockées en attendant que l'API soit pleinement opérationnelle.

## 🤝 Git et GitHub

- **Collaboration via Git :** Utilisez Git et GitHub comme outils centraux de collaboration. Cela implique de travailler sur des branches séparées pour le front-end et le back-end. Une fois que les fonctionnalités développées sont prêtes et testées, elles peuvent être fusionnées dans la branche principale. Cela assure une intégration fluide et la gestion des versions.

## 🗣 Communication

- **La clé d'une collaboration réussie** réside dans une communication ouverte et régulière. Discutez de l'avancement du projet, identifiez les éventuels blocages et clarifiez les interdépendances entre les équipes front-end et back-end. Une communication efficace mène à un travail d'équipe synchronisé et à la réussite du projet.

## 📝 Exemple de Contrat entre DAVID (Back-End) et KODJO (Front-End)

DAVID, le développeur back-end, doit fournir à KODJO, le développeur front-end, les spécifications claires des données mockées, y compris les URL d'API et la structure du JSON attendu. Ceci est un élément fondamental pour permettre à KODJO de débuter le développement du front-end avec une base solide.

### Exemple de Contrat d'API :

```json
{
  "apiUrl": "https://exemple.com/api/articles",
  "response": {
    "articles": [
      {
        "id": 1,
        "title": "Titre de l'article",
        "content": "Contenu de l'article"
      }
    ]
  }
}
