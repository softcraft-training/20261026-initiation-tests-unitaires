# Exercice 01 — Kata Tennis en TDD

## Objectifs

- Pratiquer le **TDD** (Test Driven Development) : écrire le test **avant** le code.
- Avancer par **petits pas** en respectant le cycle **Red → Green → Refactor**.
- Construire une **liste de tests** et l'utiliser pour guider le développement.

## Temps indicatif

1 heure.

## Rappel : le cycle TDD

```
   ┌──────────────► 🔴 RED ─────────────────┐
   │      Écrire un test qui échoue         │
   │                                        ▼
🔵 REFACTOR                             🟢 GREEN
Améliorer le code               Écrire le code le plus simple
sans changer le comportement    possible pour faire passer le test
(les tests restent verts)               │
   ▲                                        │
   └────────────────────────────────────────┘
```

Les 3 règles à respecter :

1. On n'écrit **pas de code de production** sans un test qui échoue.
2. On écrit **un seul test à la fois**, juste ce qu'il faut pour qu'il échoue.
3. On écrit **le minimum de code** pour faire passer ce test, même si c'est « tricher » (ex. retourner une valeur en dur). Les tests suivants obligeront le code à évoluer.

> 💡 Lancez les tests **très souvent** : après chaque test écrit (il doit être rouge) et après chaque modification du code (il doit être vert).

## Le sujet

L'objectif de ce kata est d'implémenter le système de score d'un **jeu** de tennis.

Les règles sont les suivantes :

- Durant un jeu, le serveur ou le receveur peuvent avoir 0, 15, 30 ou 40, pour respectivement 0, 1, 2 ou 3 points marqués.
- Lorsque les deux joueurs ont marqué trois points (40 - 40), le score est noté « Égalité ». Celui qui marque le point suivant obtient l'« Avantage ».
- Pour remporter le jeu, un joueur qui a l'avantage doit marquer un autre point.
- Si c'est le joueur qui n'a pas l'avantage qui marque le point suivant, on revient à « Égalité », et ainsi de suite jusqu'à ce que l'un des deux joueurs remporte le jeu.
- Un joueur qui a 40 et marque un point alors que son adversaire a moins de 40 remporte le jeu.

### Format attendu du score

Le score est une chaîne de caractères. Les points du **serveur** sont affichés en premier.

| Situation                              | Score attendu         |
|----------------------------------------|-----------------------|
| Début du jeu                           | `"0 - 0"`             |
| Le serveur a marqué 1 point            | `"15 - 0"`            |
| Serveur 1 point, receveur 2 points     | `"15 - 30"`           |
| Les deux joueurs ont marqué 3 points   | `"Égalité"`           |
| Le serveur mène d'un point après 40-40 | `"Avantage serveur"`  |
| Le receveur mène d'un point après 40-40| `"Avantage receveur"` |
| Le serveur remporte le jeu             | `"Jeu serveur"`       |
| Le receveur remporte le jeu            | `"Jeu receveur"`      |

### API imposée

Le projet `starter` contient déjà une classe `TennisGame` (non implémentée) avec 3 méthodes :

| Méthode                                     | Rôle                              |
|---------------------------------------------|-----------------------------------|
| `serverScores()` / `server_scores()`        | Le serveur marque un point        |
| `receiverScores()` / `receiver_scores()`    | Le receveur marque un point       |
| `score()`                                   | Retourne le score sous forme de texte |

> Les noms entre `/` correspondent à la convention Python.

## Choix du langage

Choisissez **un** langage et suivez le `README.md` de son dossier `starter` pour installer le projet et lancer les tests :

| Langage    | Dossier              | Bibliothèque de test |
|------------|----------------------|----------------------|
| Java       | `java/starter`       | JUnit 5              |
| Python     | `python/starter`     | pytest               |
| TypeScript | `typescript/starter` | Jest                 |
| JavaScript | `javascript/starter` | Jest                 |

Le dossier `solution` contient une correction possible. Ne la consultez qu'à la fin !

## Étapes

Pour chaque étape, écrivez les tests **un par un**, dans l'ordre, en faisant un cycle complet **Red → Green → Refactor** pour chacun.

> 💡 Astuce : écrire un test commence souvent par l'**assertion** (ce que l'on attend), puis on remonte vers le **Act** et l'**Arrange**.

### Étape 1 — Premier cycle (~5 min)

1. Installez le projet et lancez les tests.
2. ✅ **Attendu :** le test fourni (`score` au début du jeu vaut `"0 - 0"`) est **rouge**.
3. 🟢 Écrivez le code **le plus simple** qui fait passer ce test. Oui, `return "0 - 0"` est une réponse valable à ce stade !
4. 🔵 Y a-t-il quelque chose à refactorer ?

### Étape 2 — Les scores simples (~15 min)

Tests à écrire, un par un :

- [ ] le serveur marque 1 point → `"15 - 0"`
- [ ] le serveur marque 2 points → `"30 - 0"`
- [ ] le serveur marque 3 points → `"40 - 0"`
- [ ] le receveur marque 1 point → `"0 - 15"`
- [ ] le serveur marque 1 point et le receveur 2 points → `"15 - 30"`

> 🔵 Au fil des tests, du code dupliqué apparaît (dans le code de production **et** dans les tests). C'est le moment de refactorer, par exemple avec une méthode utilitaire dans les tests pour faire marquer plusieurs points.

### Étape 3 — Gagner un jeu (~10 min)

- [ ] le serveur marque 4 points → `"Jeu serveur"`
- [ ] le receveur marque 4 points → `"Jeu receveur"`

### Étape 4 — Égalité et avantage (~20 min)

- [ ] les deux joueurs marquent 3 points → `"Égalité"`
- [ ] 40 - 40, puis le serveur marque → `"Avantage serveur"`
- [ ] 40 - 40, puis le receveur marque → `"Avantage receveur"`
- [ ] avantage serveur, puis le receveur marque → `"Égalité"`
- [ ] avantage serveur, puis le serveur marque → `"Jeu serveur"`
- [ ] avantage receveur, puis le receveur marque → `"Jeu receveur"`

✅ **Attendu :** tous les tests sont **verts** et le code est lisible.

### Étape 5 — Bilan (~5 min)

- Relisez vos tests : leurs noms décrivent-ils les règles du tennis ? Pourrait-on les lire comme une spécification ?
- Avez-vous écrit du code qui n'était demandé par aucun test ?
- Comparez votre code avec le dossier `solution`.

### Pour aller plus loin (bonus)

- [ ] Marquer un point alors que le jeu est terminé **lève une erreur** (voir la cheat sheet de votre langage pour tester une erreur).
- [ ] Utilisez des **tests paramétrés** pour regrouper les scores simples (étape 2).
- [ ] Si vous utilisez git, faites un **commit à chaque test vert** : l'historique raconte alors votre démarche TDD.
