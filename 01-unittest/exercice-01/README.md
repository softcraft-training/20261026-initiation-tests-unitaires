# Exercice 01 - Introduction aux tests unitaires

## Objectifs

- Savoir exécuter un projet et ses tests.
- Savoir lire le résultat d'un test (rouge / vert).
- Savoir écrire un test unitaire simple : **Arrange / Act / Assert**.

> Cet exercice n'est **pas** réalisé en TDD : on écrit d'abord le code, puis les tests.

## Temps indicatif

30 à 45 minutes.

## Choix du langage

Choisissez **un** langage et suivez le `README.md` de son dossier `starter` pour installer, exécuter le projet et lancer les tests :

| Langage    | Dossier                 | Bibliothèque de test |
|------------|-------------------------|----------------------|
| Java       | `java/starter`          | JUnit 5              |
| Python     | `python/starter`        | pytest               |
| TypeScript | `typescript/starter`    | Jest                 |
| JavaScript | `javascript/starter`    | Jest                 |

Le projet contient une fonction `add(a, b)` qui additionne deux nombres, et un test associé.

## Étape 1 - Exécuter le projet initial (~5 min)

1. Installez les dépendances du projet.
2. Exécutez le projet : il affiche le résultat de `add(2, 3)`.
3. Exécutez les tests.

✅ **Attendu :** le test est **rouge** (en échec).

Lisez attentivement le message d'erreur : quelle valeur était attendue ? Quelle valeur a été obtenue ?

## Étape 2 - Corriger l'assertion (~5 min)

Le code de `add` est correct : c'est **l'assertion du test** qui est fausse.

1. Corrigez la valeur attendue dans le test.
2. Exécutez à nouveau le projet et les tests.

✅ **Attendu :** le test est **vert** (en succès).

## Étape 3 - FizzBuzz (~20-35 min)

### 3.1 Écrire la fonction

Ajoutez une fonction `fizzBuzz` qui prend un nombre en paramètre et retourne un nombre ou une chaîne de caractères selon les règles suivantes :

- Si le nombre est divisible par 3, on le remplace par `"Fizz"` ;
- Si le nombre est divisible par 5, on le remplace par `"Buzz"` ;
- Si le nombre est divisible par 3 et par 5, on le remplace par `"FizzBuzz"` ;
- Par défaut, on retourne le nombre.

| Entrée | Sortie attendue |
|--------|-----------------|
| 1      | `1`             |
| 3      | `"Fizz"`        |
| 5      | `"Buzz"`        |
| 15     | `"FizzBuzz"`    |

> Adaptez le nom aux conventions du langage : `fizz_buzz` en Python.
> En Java, une méthode ne peut retourner qu'un seul type : `fizzBuzz` retournera une `String` (`"1"`, `"Fizz"`, …).

Vous pouvez appeler `fizzBuzz` dans le programme principal pour afficher les résultats de 1 à 15.

### 3.2 Écrire les tests

Ajoutez des tests pour vérifier le comportement attendu. Prévoyez **au moins un test par règle** :

- [ ] un nombre qui n'est divisible ni par 3 ni par 5 retourne le nombre ;
- [ ] un nombre divisible par 3 retourne `"Fizz"` ;
- [ ] un nombre divisible par 5 retourne `"Buzz"` ;
- [ ] un nombre divisible par 3 et par 5 retourne `"FizzBuzz"`.

Conseils :

- Donnez à chaque test un **nom explicite** qui décrit le comportement vérifié.
- Structurez chaque test en 3 parties : **Arrange** (préparer), **Act** (exécuter), **Assert** (vérifier).
- Un test = un comportement.

✅ **Attendu :** tous les tests sont **verts**.

### Pour aller plus loin (bonus)

- Vérifiez qu'un test **peut échouer** : introduisez volontairement un bug dans `fizzBuzz` (ex. inversez `"Fizz"` et `"Buzz"`) et constatez que les tests deviennent rouges. Annulez ensuite le bug.
- Testez plusieurs valeurs par règle (ex. 3, 6, 9 pour `"Fizz"`) à l'aide de tests paramétrés (voir la cheat sheet de votre langage).
