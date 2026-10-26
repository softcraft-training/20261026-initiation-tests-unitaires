# Solution Python — pytest

## Prérequis

- Python 3.9 ou plus récent : `python --version`

## Structure

```
starter
├── requirements.txt         # Dépendances (pytest)
├── pytest.ini               # Configuration de pytest
├── src
│   └── tennis_game.py       # Code de production (classe TennisGame)
└── tests
    └── test_tennis_game.py  # Tests unitaires
```

## Restaurer le projet

Créer un environnement virtuel puis installer les dépendances :

```bash
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

> **Windows (PowerShell)** : si l'activation échoue avec l'erreur « l'exécution de scripts est désactivée sur ce système », autorisez les scripts pour la session en cours, puis relancez l'activation :
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .venv\Scripts\Activate.ps1
> ```

## Exécuter les tests

Ce kata n'a pas de programme principal : le code est exécuté uniquement par les tests.

```bash
pytest          # tous les tests
pytest -v       # affichage détaillé (un test par ligne)
pytest -x       # s'arrête au premier test en échec
```

## Cheat sheet pytest

### Écrire un test

- Chaque test est une fonction dont le nom commence par `test_`.
- Une fonction **sans** le préfixe `test_` (ex. une fonction utilitaire) n'est pas exécutée comme un test.

```python
from tennis_game import TennisGame


def test_score_is_0_0_at_the_start_of_the_game():
    # Arrange
    game = TennisGame()

    # Act
    result = game.score()

    # Assert
    assert result == "0 - 0"
```

### Assertions

```python
assert result == "15 - 0"       # égalité
assert result != "0 - 0"        # différence
```

### Vérifier qu'une erreur est levée (bonus)

```python
import pytest


def test_scoring_after_the_game_is_over_raises_an_error():
    game = ...
    with pytest.raises(RuntimeError):
        game.server_scores()
```

### Tests paramétrés (bonus)

```python
@pytest.mark.parametrize(
    "server_points, receiver_points, expected",
    [
        (1, 0, "15 - 0"),
        (2, 0, "30 - 0"),
    ],
)
def test_simple_scores(server_points, receiver_points, expected):
    ...
```

### Lire le résultat

- `.` ou `PASSED` : test vert ✅
- `F` ou `FAILED` : test rouge ❌ — pytest affiche la valeur obtenue et la valeur attendue :

```
>       assert result == "15 - 0"
E       AssertionError: assert '0 - 0' == '15 - 0'
```
