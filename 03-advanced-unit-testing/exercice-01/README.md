# Exercice 03 — Doublures de test (mocks, stubs…) en TDD

## Objectifs

- Comprendre ce qu'est une **doublure de test** (*test double*) et à quoi elle sert.
- Savoir distinguer un **stub** (qui fournit des données) d'un **mock** (qui vérifie une interaction).
- Utiliser une **bibliothèque de mock** pour remplacer les dépendances d'une classe.
- Continuer à pratiquer le **TDD** : Red → Green → Refactor.

## Temps indicatif

1 h à 1 h 30.

## Rappel : les doublures de test

Une classe dépend souvent d'autres composants (base de données, API, serveur d'email…). Dans un test unitaire, on les remplace par des **doublures** que l'on contrôle :

| Doublure  | Rôle                                                                 | Exemple dans cet exercice                        |
|-----------|----------------------------------------------------------------------|--------------------------------------------------|
| **Dummy** | Objet passé en paramètre mais jamais utilisé                         | —                                                |
| **Stub**  | Retourne des réponses préparées à l'avance                           | `fetchPayments` retourne une liste de paiements  |
| **Spy**   | Enregistre les appels reçus pour les vérifier ensuite                | —                                                |
| **Mock**  | Doublure dont on **vérifie les appels** (arguments, nombre d'appels) | `sendEmail` a-t-il été appelé ? avec quel contenu ? |
| **Fake**  | Implémentation simplifiée mais fonctionnelle (ex. base en mémoire)   | —                                                |

> 💡 On ne double que les **dépendances** (ce qui sort du périmètre de la classe testée). On ne double jamais les **objets valeur** (`Payment`, `Email`…) : on les crée directement.

## Le sujet

Vous travaillez pour une société de cartes de crédit. Pour offrir un service supplémentaire, elle souhaite **alerter ses clients** lorsque leurs dépenses dans une catégorie sont plus élevées que d'habitude.

Règles :

1. Un **paiement** (`Payment`) est un objet valeur simple composé d'un montant (`price`, en dollars entiers), d'une description et d'une catégorie.
2. Une **catégorie** (`Category`) est une énumération : divertissement, restaurants, golf, courses, voyages.
3. Pour un utilisateur donné (`userId`), on récupère les paiements du **mois courant** et ceux du **mois précédent**.
4. On compare, **par catégorie**, le total dépensé chaque mois. On ne garde que les catégories pour lesquelles l'utilisateur a dépensé **au moins 50 % de plus** ce mois-ci que le mois précédent.
5. Une catégorie dans laquelle l'utilisateur n'avait **rien dépensé** le mois précédent n'est **pas** considérée comme inhabituelle.
6. S'il y a au moins une catégorie inhabituelle, on envoie un **email** à l'utilisateur. Sinon, **aucun email** n'est envoyé.

### Format de l'email

Les catégories sont listées dans l'**ordre de déclaration** de l'énumération `Category`. Le montant du sujet est la somme des montants listés.

**Sujet :**

```
Dépenses inhabituelles de 1076 $ détectées !
```

**Corps :**

```
Bonjour cher client !

Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :

* Vous avez dépensé 148 $ en courses
* Vous avez dépensé 928 $ en voyages

Cordialement,

La Compagnie de Carte de Crédit
```

> Les lignes sont séparées par un simple retour à la ligne (`\n`), sans retour à la ligne final.

### Ce qui est fourni

Le projet `starter` contient :

| Élément                    | Description                                                                  |
|----------------------------|------------------------------------------------------------------------------|
| `Category`                 | L'énumération des catégories, avec leur libellé (`"courses"`, `"voyages"`…)  |
| `Payment`                  | Le paiement (objet valeur)                                                   |
| `Email`                    | Le contenu d'un email : `subject` et `body` (objet valeur)                   |
| `PaymentRepository`        | **Contrat** : `fetchPayments(userId, month)` retourne les paiements d'un mois |
| `EmailSender`              | **Contrat** : `sendEmail(userId, email)` envoie un email à l'utilisateur     |
| `UnusualSpendingService`   | La classe à implémenter, avec la méthode `notify(userId)`                    |

Les deux dépendances (`PaymentRepository` et `EmailSender`) sont **injectées** dans le constructeur de `UnusualSpendingService`.

> ⚠️ Il n'existe **pas** d'implémentation réelle des contrats `PaymentRepository` et `EmailSender`, et vous ne devez pas en écrire. Dans les tests, ils sont remplacés par des doublures créées avec la bibliothèque de mock.

## Choix du langage

Choisissez **un** langage et suivez le `README.md` de son dossier `starter` :

| Langage    | Dossier              | Tests   | Mocks           |
|------------|----------------------|---------|-----------------|
| Java       | `java/starter`       | JUnit 5 | Mockito         |
| Python     | `python/starter`     | pytest  | `unittest.mock` |
| TypeScript | `typescript/starter` | Jest    | `jest.fn()`     |
| JavaScript | `javascript/starter` | Jest    | `jest.fn()`     |

Le dossier `solution` contient une correction possible. Ne la consultez qu'à la fin !

## Étapes

Le projet `starter` ne contient **aucun test** : à vous de créer le fichier de test (voir le `README.md` de votre langage).

Pour chaque étape, écrivez les tests **un par un**, en faisant un cycle complet **Red → Green → Refactor** pour chacun.

### Étape 1 — Découverte (~10 min)

1. Installez le projet et lancez les tests (il n'y en a encore aucun).
2. Lisez le code fourni : les objets valeur, les deux contrats et `UnusualSpendingService`.
3. Lisez la cheat sheet de la bibliothèque de mock de votre langage.

### Étape 2 — Premier test : pas d'email (~10 min)

- [ ] quand l'utilisateur n'a aucun paiement, **aucun email** n'est envoyé

> 💡 Ce test utilise déjà les deux types de doublure : un **stub** pour `fetchPayments` (qui retourne une liste vide) et un **mock** pour `sendEmail` (dont on vérifie qu'il n'est **jamais** appelé).

### Étape 3 — Une catégorie inhabituelle (~20 min)

- [ ] quand les dépenses d'une catégorie augmentent d'au moins 50 %, un email est envoyé **à l'utilisateur**
- [ ] le **sujet** de l'email contient le montant dépensé dans cette catégorie
- [ ] le **corps** de l'email liste cette catégorie et son montant

### Étape 4 — Les règles de comparaison (~15 min)

- [ ] une hausse de **moins de 50 %** n'envoie pas d'email
- [ ] une hausse d'**exactement 50 %** envoie un email
- [ ] une catégorie **sans dépense le mois précédent** n'envoie pas d'email
- [ ] plusieurs paiements d'une même catégorie sont **additionnés**

### Étape 5 — Plusieurs catégories (~15 min)

- [ ] seules les catégories inhabituelles sont listées dans l'email
- [ ] plusieurs catégories inhabituelles sont listées **dans l'ordre de l'énumération**, et le sujet contient **leur total**

### Étape 6 — Les mois (~10 min)

- [ ] les paiements sont récupérés pour le **mois courant** et pour le **mois précédent**
- [ ] en **janvier**, le mois précédent est **décembre de l'année précédente**

✅ **Attendu :** tous les tests sont **verts**, et ils passent **quel que soit le jour** où on les exécute.

### Étape 7 — Bilan (~10 min)

- Qu'est-ce qui a rendu certains tests **difficiles à écrire** ? Qu'avez-vous changé dans le code pour les rendre possibles ?
- Pour chaque doublure de vos tests : est-ce un **stub** ou un **mock** ?
- Pourquoi les dépendances sont-elles définies par des **contrats** plutôt que par des classes concrètes ?
- Avez-vous vérifié des appels qui n'apportent rien au test ? Un test qui vérifie trop de détails devient **fragile**.
- Comparez votre code avec le dossier `solution`.

### Pour aller plus loin (bonus)

- [ ] Pendant le refactoring, extrayez le calcul des catégories inhabituelles ou la composition de l'email dans des classes/fonctions dédiées. Faut-il les doubler dans les tests de `UnusualSpendingService` ? Pourquoi ?
- [ ] Si vous utilisez git, faites un **commit à chaque test vert**.
