# Solution Python — pytest + unittest.mock

## Prérequis

- Python 3.9 ou plus récent : `python --version`

## Structure

```
solution
├── requirements.txt                 # Dépendances (pytest)
├── pytest.ini                       # Configuration de pytest
├── src
│   ├── models.py                    # Category, Payment, Email, YearMonth (objets valeur)
│   ├── contracts.py                 # Contrats : PaymentRepository, EmailSender, Clock
│   └── unusual_spending_service.py  # Service d'alerte (implémenté)
└── tests
    └── test_unusual_spending_service.py  # Tests unitaires
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
pytest -v       # affichage détaillé (un test par ligne)
```


## Cheat sheet unittest.mock

`unittest.mock` fait partie de la bibliothèque standard de Python : rien à installer.

```python
from unittest.mock import ANY, call, create_autospec
```

### Créer une doublure

```python
from contracts import EmailSender, PaymentRepository

payment_repository = create_autospec(PaymentRepository, instance=True)
email_sender = create_autospec(EmailSender, instance=True)

service = UnusualSpendingService(payment_repository, email_sender)
```

> `create_autospec` crée une doublure qui respecte le **contrat** : appeler une méthode qui n'existe pas, ou avec un mauvais nombre d'arguments, lève une erreur.

### Stub : définir une valeur de retour

```python
# Toujours la même valeur, quels que soient les arguments
payment_repository.fetch_payments.return_value = [Payment(148, "Supermarché", Category.GROCERIES)]

# Une valeur qui dépend des arguments
payment_repository.fetch_payments.side_effect = lambda user_id, month: (
    [Payment(148, "Supermarché", Category.GROCERIES)] if month == YearMonth(2026, 10) else []
)
```

### Mock : vérifier un appel

```python
email_sender.send_email.assert_called_once_with("user-42", Email("sujet", "corps"))
email_sender.send_email.assert_called_once_with("user-42", ANY)   # peu importe l'email
email_sender.send_email.assert_not_called()                       # jamais appelé

payment_repository.fetch_payments.assert_has_calls(
    [call("user-42", YearMonth(2026, 10)), call("user-42", YearMonth(2026, 9))],
    any_order=True,
)
```

### Récupérer les arguments d'un appel pour les inspecter

```python
user_id, email = email_sender.send_email.call_args.args
assert email.subject == "Dépenses inhabituelles de 148 $ détectées !"
```

### Préparer les doublures avec des fixtures

```python
import pytest


@pytest.fixture
def email_sender():
    return create_autospec(EmailSender, instance=True)


def test_something(email_sender):   # pytest injecte la fixture par son nom
    ...
```

### Comparer des objets valeur

`Payment`, `Email` et `YearMonth` sont des `dataclass` : deux instances avec les mêmes valeurs sont **égales** (`==`). On peut donc les utiliser directement dans `assert` et `assert_called_once_with`.

## Remarque sur la solution : le mois courant

Le service doit connaître le **mois courant**. Le lire directement dans le code (`date.today()`) rend les tests dépendants du jour où ils sont exécutés : impossible de vérifier les mois récupérés, ni le cas de janvier.

La solution ajoute donc une **troisième dépendance**, le contrat `Clock` (méthode `current_month()`), injectée dans le constructeur et remplacée par un **stub** dans les tests.
