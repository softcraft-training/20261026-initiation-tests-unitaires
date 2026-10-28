# Exercice 05 — Qualité du code : couverture, métriques et tests de mutation

## Objectifs

- Mesurer la qualité d'un code et de ses tests avec **SonarQube** : couverture de code, lignes dupliquées, complexité.
- Comprendre pourquoi une **couverture élevée ne prouve pas** que les tests sont bons.
- Utiliser les **tests de mutation** pour évaluer la qualité réelle des tests, puis les renforcer.
- **Refactorer** un code complexe et dupliqué, en s'appuyant sur des tests solides et en mesurant l'amélioration à chaque étape.

## Temps indicatif

2 heures.

## Rappels

### Couverture de code

La couverture mesure la part du code **exécutée** par les tests :

- **couverture de lignes** : les lignes exécutées au moins une fois ;
- **couverture de branches** : les chemins pris dans les `if` (vrai **et** faux).

⚠️ Une ligne exécutée n'est pas une ligne **vérifiée** : un test sans assertion couvre du code sans rien prouver.

### Complexité

| Métrique                    | Ce qu'elle mesure                                                                 |
|-----------------------------|-----------------------------------------------------------------------------------|
| **Complexité cyclomatique** | Le nombre de **chemins** indépendants dans le code (+1 par `if`, `&&`, `||`, boucle…). Indique le nombre minimal de tests pour couvrir tous les chemins. |
| **Complexité cognitive**    | La difficulté à **lire et comprendre** le code. Pénalise fortement l'**imbrication** (un `if` dans un `if` dans un `if`…). C'est elle que SonarQube utilise pour signaler les fonctions trop complexes (règle *S3776*, seuil de 15 par fonction). |

### Duplication

SonarQube détecte les **blocs de code dupliqués** (copier-coller) d'au moins une dizaine de lignes. Un bug corrigé dans une copie reste présent dans l'autre.

### Tests de mutation

Un outil de mutation **modifie volontairement le code** (crée des *mutants*), puis relance les tests sur chaque mutant :

| Exemple de mutation                   | Code d'origine     | Mutant              |
|---------------------------------------|--------------------|---------------------|
| Changer une borne                     | `if (sellIn < 11)` | `if (sellIn <= 11)` |
| Inverser une condition                | `if (quality > 0)` | `if (quality <= 0)` |
| Changer un opérateur                  | `quality + 1`      | `quality - 1`       |

| Statut du mutant       | Signification                                                              |
|------------------------|----------------------------------------------------------------------------|
| 🟢 **Tué** (*killed*)   | Au moins un test échoue : les tests ont **détecté** le changement          |
| 🔴 **Survivant** (*survived*) | Tous les tests passent : le changement est passé **inaperçu**        |
| ⚪ **Non couvert** (*no coverage*) | Aucun test n'exécute ce code                                   |
| 🟡 **Équivalent**      | Le mutant se comporte exactement comme l'original : **impossible** à tuer |

**Score de mutation** = mutants tués / mutants générés. C'est un bien meilleur indicateur de la qualité des tests que la couverture.

## Le code : la Gilded Rose

Vous reprenez le code de l'auberge **Gilded Rose**, qui gère un inventaire d'objets. Chaque objet (`Item`) a :

- un nom (`name`) ;
- `sellIn` : le nombre de jours restants pour vendre l'objet ;
- `quality` : la valeur de l'objet.

Chaque soir, la méthode `updateQuality` (`update_quality` en Python) met à jour tous les objets selon ces règles :

- À la fin de chaque journée, `sellIn` et `quality` diminuent de 1.
- Une fois la date de vente passée (`sellIn` < 0), la qualité se dégrade **deux fois plus vite**.
- La qualité n'est **jamais négative** et ne dépasse **jamais 50**.
- **Aged Brie** : sa qualité **augmente** avec le temps (deux fois plus vite après la date de vente).
- **Sulfuras, Hand of Ragnaros** : objet légendaire, il ne se vend jamais et ne perd jamais en qualité (sa qualité vaut 80).
- **Backstage passes to a TAFKAL80ETC concert** : la qualité augmente de 1, de 2 quand il reste 10 jours ou moins, de 3 quand il reste 5 jours ou moins. Après le concert, elle tombe à 0.
- **Conjured Mana Cake** : les objets « Conjured » se dégradent **deux fois plus vite** que les objets normaux.

> 💬 Le support des objets « Conjured » a été ajouté récemment par un développeur pressé…

Le projet contient déjà des tests. Ils sont tous **verts**.

## Choix du langage

Choisissez **un** langage et suivez le `README.md` de son dossier `starter` :

| Langage    | Dossier              | Tests   | Couverture | Mutation                 | Analyse SonarQube |
|------------|----------------------|---------|------------|--------------------------|-------------------|
| Java       | `java/starter`       | JUnit 5 | JaCoCo     | PIT                      | Maven             |
| Python     | `python/starter`     | pytest  | pytest-cov | mutmut (dans **Docker**) | pysonar           |
| TypeScript | `typescript/starter` | Jest    | Jest       | Stryker                  | npm               |
| JavaScript | `javascript/starter` | Jest    | Jest       | Stryker                  | npm               |

Le dossier `solution` contient une correction possible. Ne la consultez qu'à la fin !

## Prérequis

### Vérifier Docker

SonarQube s'exécute dans un conteneur Docker (comme mutmut pour Python). Vérifiez que Docker fonctionne :

```bash
docker version
docker run --rm hello-world
```

✅ **Attendu :** la commande `hello-world` affiche « Hello from Docker! ».

> ❌ **Docker ne fonctionne pas sur votre poste ?** Prévenez le formateur : il vous donnera l'adresse d'un **serveur SonarQube partagé** et un **jeton** (*token*). Remplacez alors `http://localhost:9000` par cette adresse dans toutes les commandes et passez directement à l'étape 1.
>
> Pour Python, mutmut ne fonctionne pas nativement sous Windows : sans Docker, utilisez WSL ou faites équipe avec un binôme.

SonarQube a besoin d'environ **2 Go de mémoire** disponibles : fermez les applications inutiles.

## Étapes

### Étape 0 — Démarrer SonarQube (~10 min)

1. Depuis le dossier de l'exercice (celui qui contient `docker-compose.yml`), démarrez SonarQube :

   ```bash
   docker compose up -d
   ```

2. Attendez 1 à 2 minutes, puis ouvrez <http://localhost:9000>. Tant que la page affiche « SonarQube is starting », patientez.
3. Connectez-vous avec `admin` / `admin`, puis choisissez un nouveau mot de passe.
4. Créez un **jeton d'analyse** : menu de votre compte (en haut à droite) → **My Account** → **Security** → **Generate Tokens** :
   - **Name** : `tp`
   - **Type** : `Global Analysis Token`
5. Copiez le jeton (il commence par `sqa_`) et **gardez-le** : il n'est affiché qu'une seule fois.

> Pour arrêter SonarQube à la fin : `docker compose down` (les données sont conservées pour la prochaine fois).

### Étape 1 — Première analyse (~15 min)

1. Installez le projet, lancez les tests avec la couverture, puis l'analyse SonarQube (voir le `README.md` de votre langage).
2. Dans SonarQube, ouvrez votre projet et relevez les métriques dans ce tableau :

| Métrique                           | Où la trouver dans SonarQube                     | Analyse 1 | Après étape 3 | Après étape 4 |
|------------------------------------|--------------------------------------------------|-----------|---------------|---------------|
| Couverture                         | **Overview** → *Coverage*                        |           |               |               |
| Lignes dupliquées (%)              | **Overview** → *Duplications*                    |           |               |               |
| Complexité cyclomatique            | **Measures** → *Complexity* → *Cyclomatic Complexity* |      |               |               |
| Complexité cognitive               | **Measures** → *Complexity* → *Cognitive Complexity*  |      |               |               |
| Nombre de problèmes (*issues*)     | **Issues**                                       |           |               |               |
| Score de mutation                  | rapport de l'outil de mutation (étape 2)         |           |               |               |

3. Explorez le projet :
   - Dans **Code**, ouvrez le fichier de la Gilded Rose : quelles lignes ne sont **pas couvertes** (en rouge) ? Pourquoi ?
   - Dans **Measures** → *Duplications*, quels blocs sont dupliqués ?
   - Dans **Issues**, quels problèmes concernent la complexité ? Et les **tests** ?

❓ La couverture vous semble-t-elle **correcte** ? D'après SonarQube, les tests sont-ils **bons** ?

### Étape 2 — Tests de mutation (~15 min)

1. Lancez l'outil de mutation (voir le `README.md` de votre langage). Il exécute les tests des dizaines de fois : comptez quelques dizaines de secondes.
2. Ouvrez le rapport et relevez le **score de mutation** dans le tableau.
3. Examinez les **mutants survivants** dans `updateQuality` : pour chacun, quelle modification du code n'a été détectée par **aucun** test ?

❓ Comparez la couverture de `updateQuality` (toutes ses lignes sont exécutées par les tests) et son score de mutation. Que mesure vraiment la couverture ?

### Étape 3 — Renforcer les tests (~30 min)

⚠️ Dans cette étape, **on ne modifie pas le code de production** : uniquement les tests.

1. Relisez les tests un par un. Repérez ceux qui sont **inutiles** ou **trop faibles** :
   - un test sans assertion ;
   - une assertion toujours vraie ;
   - une assertion trop vague (« plus grand que », « défini »…) qui accepte des valeurs fausses.
2. Corrigez-les : chaque test doit vérifier une **valeur exacte** (`sellIn` **et** `quality`).
3. Ajoutez les tests manquants, en particulier aux **bornes** : que se passe-t-il quand il reste exactement 11, 10, 6 ou 5 jours avant le concert ? La veille de la date de vente ? Quand la qualité atteint exactement 0 ou 50 ? Quand plusieurs objets sont dans l'inventaire ?
4. Relancez l'outil de mutation après chaque série de tests.

✅ **Attendu :** tous les mutants de `updateQuality` sont **tués**.

5. Il reste des mutants dans la méthode de mise à jour des objets « Conjured ». Examinez-les :
   - Certains ne sont **pas couverts** : pouvez-vous écrire un test qui exécute ces lignes ? Pourquoi ?
   - Certains survivent alors que la ligne est couverte : le mutant change-t-il vraiment le comportement ?
6. Relancez l'analyse SonarQube et complétez la colonne « Après étape 3 ».

❓ Pourquoi la couverture n'atteint-elle pas 100 % malgré tous vos tests ? Pourquoi était-il important de renforcer les tests **avant** de refactorer ?

### Étape 4 — Refactorer (~40 min)

Vos tests sont maintenant un **filet de sécurité** fiable. Réduisez la **duplication** et la **complexité**, par petits pas :

- après **chaque** modification, relancez les tests : ils doivent rester **verts** ;
- après chaque étape importante, relancez l'**analyse SonarQube** et observez l'évolution des métriques.

Pistes, dans l'ordre :

1. Supprimez le **code mort** révélé à l'étape 3.
2. Remplacez les noms d'objets répétés par des **constantes**.
3. Extrayez une **méthode par type d'objet** (Aged Brie, Backstage passes, objet normal…).
4. Supprimez la **duplication** : les objets « Conjured » se comportent comme des objets normaux qui se dégradent deux fois plus vite.
5. Réduisez l'**imbrication** des `if` : regroupez les conditions, utilisez des retours anticipés ou un `switch`, extrayez des méthodes utilitaires (augmenter / diminuer la qualité en respectant les bornes 0 et 50…).

✅ **Attendu :**

- tous les tests sont **verts** et le score de mutation reste à **100 %** ;
- **0 %** de lignes dupliquées ;
- plus aucun problème de **complexité cognitive** (*S3776*) ;
- la colonne « Après étape 4 » est complétée.

### Étape 5 — Bilan (~10 min)

- Comparez les trois colonnes de votre tableau. Quelle métrique a le plus évolué ? Laquelle a le moins évolué, et pourquoi ?
- La complexité cyclomatique a-t-elle autant baissé que la complexité cognitive ? Qu'est-ce que cela dit de la différence entre les deux ?
- Une couverture de 100 % garantit-elle des tests de qualité ? Et un score de mutation de 100 % ?
- Comparez votre code avec le dossier `solution`.

### Pour aller plus loin (bonus)

- [ ] Dans SonarQube, créez une **Quality Gate** exigeant au moins 90 % de couverture et 0 % de duplication, associez-la à votre projet et relancez l'analyse.
- [ ] Le métier demande maintenant que les objets « Conjured » ne puissent jamais dépasser une qualité de 30. Combien de temps vous faut-il pour l'ajouter, maintenant que le code est propre ?
