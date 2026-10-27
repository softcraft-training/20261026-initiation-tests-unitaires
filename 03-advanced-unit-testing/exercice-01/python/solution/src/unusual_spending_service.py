from collections import defaultdict

from contracts import Clock, EmailSender, PaymentRepository
from models import Category, Email


class UnusualSpendingService:
    def __init__(self, payment_repository: PaymentRepository, email_sender: EmailSender, clock: Clock):
        self._payment_repository = payment_repository
        self._email_sender = email_sender
        self._clock = clock

    def notify(self, user_id: str) -> None:
        current_month = self._clock.current_month()
        current_totals = _totals_by_category(self._payment_repository.fetch_payments(user_id, current_month))
        previous_totals = _totals_by_category(self._payment_repository.fetch_payments(user_id, current_month.previous()))

        unusual_spending = {
            category: current_totals[category]
            for category in Category
            if _is_unusual(current_totals[category], previous_totals[category])
        }

        if unusual_spending:
            self._email_sender.send_email(user_id, _compose_email(unusual_spending))


def _totals_by_category(payments):
    totals = defaultdict(int)
    for payment in payments:
        totals[payment.category] += payment.price
    return totals


def _is_unusual(current, previous):
    # current >= previous * 1.5, en nombres entiers
    return previous > 0 and current * 2 >= previous * 3


def _compose_email(unusual_spending):
    total = sum(unusual_spending.values())
    lines = "\n".join(
        f"* Vous avez dépensé {amount} $ en {category.label}"
        for category, amount in unusual_spending.items()
    )

    subject = f"Dépenses inhabituelles de {total} $ détectées !"
    body = (
        "Bonjour cher client !\n"
        "\n"
        "Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :\n"
        "\n"
        f"{lines}\n"
        "\n"
        "Cordialement,\n"
        "\n"
        "La Compagnie de Carte de Crédit"
    )
    return Email(subject, body)
