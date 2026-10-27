# Starter Python — pytest

## Prérequis

- Python 3.9 ou plus récent : `python --version`

## Structure

```
starter
├── requirements.txt         # Dépendances (pytest)
├── pytest.ini               # Configuration de pytest
├── src
│   └── book_pricing.py      # Fonction price(books) à implémenter
└── tests                    # Vos tests (à créer)
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

```bash
pytest          # tous les tests
pytest -v       # rapport détaillé : se lit comme la carte
pytest -rs      # affiche aussi la raison des tests en attente
```

Créez votre fichier de test dans `tests/test_book_pricing.py`.

## Cheat sheet pytest pour le BDD

### Story, règles, exemples

pytest n'a pas de `describe` : on utilise le **fichier** pour la story, une **classe** par règle et une **fonction** par exemple. Les noms s'écrivent en snake_case, sans accents.

```python
"""Prix d'un panier de livres."""            # 🟨 la story

from pytest import approx

from book_pricing import price


class TestUnLivreCoute8Euros:                # 🟦 une règle (le nom commence par Test)
    def test_un_tome_8_euros(self):          # 🟩 un exemple (le nom commence par test_)
        # Given : un panier contenant le tome 1
        books = [1]

        # When : on calcule le prix
        total = price(books)

        # Then : il vaut 8 €
        assert total == approx(8)
```

> Quand l'exemple tient en une ligne, Given / When / Then peuvent être réunis : `assert price([1]) == approx(8)`

### Tests en attente : la liste de tests

```python
import pytest


class TestLesDoublonsSontAuPrixPlein:
    @pytest.mark.skip(reason="à faire")
    def test_tomes_1_1_et_2_23_euros_20(self):
        pass
```

Pour activer l'exemple, retirez la ligne `@pytest.mark.skip(...)` et écrivez le corps du test.

### Comparer des prix décimaux

En virgule flottante, `16 * 0.95` ne vaut pas exactement `15.2`. Comparez avec une tolérance :

```python
assert price([1, 2]) == approx(15.20)
```

### Lire le rapport

```
tests/test_book_pricing.py::TestUnLivreCoute8Euros::test_un_tome_8_euros PASSED
tests/test_book_pricing.py::TestLesDoublonsSontAuPrixPlein::test_tomes_1_1_et_2_23_euros_20 SKIPPED (à faire)
```

- `PASSED` : exemple vert ✅
- `FAILED` : exemple rouge ❌
- `SKIPPED` : exemple en attente
