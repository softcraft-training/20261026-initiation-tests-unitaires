# Starter Python - pytest

## Prérequis

- Python 3.9 ou plus récent : `python --version`

## Structure

```
starter
├── requirements.txt         # Dépendances (pytest)
├── pytest.ini               # Configuration de pytest
├── src
│   ├── calculator.py        # Code de production
│   └── main.py              # Programme principal
└── tests
    └── test_calculator.py   # Tests unitaires
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

## Exécuter le projet

```bash
python src/main.py
```

## Exécuter les tests

```bash
pytest          # tous les tests
pytest -v       # affichage détaillé (un test par ligne)
```

## Cheat sheet pytest

### Écrire un test

- Le fichier de test commence par `test_` (ex. `test_fizz_buzz.py`) et se place dans `tests/`.
- Chaque test est une fonction dont le nom commence par `test_`.

```python
from calculator import add


def test_add_returns_the_sum_of_two_numbers():
    # Arrange
    a = 2
    b = 3

    # Act
    result = add(a, b)

    # Assert
    assert result == 5
```

### Assertions

pytest utilise le mot-clé `assert` de Python :

```python
assert result == 5          # égalité
assert result != 0          # différence
assert result == "Fizz"     # égalité de chaînes
assert isinstance(result, int)  # type
```

### Tests paramétrés (bonus)

```python
import pytest


@pytest.mark.parametrize("number", [3, 6, 9])
def test_fizzbuzz_returns_fizz_when_divisible_by_3(number):
    assert fizz_buzz(number) == "Fizz"
```

### Lire le résultat

- `.` ou `PASSED` : test vert ✅
- `F` ou `FAILED` : test rouge ❌ - pytest affiche la valeur obtenue et la valeur attendue :

```
>       assert result == 6
E       assert 5 == 6
```
