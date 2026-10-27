from typing import List, Protocol

from models import Email, Payment, YearMonth


class PaymentRepository(Protocol):
    def fetch_payments(self, user_id: str, month: YearMonth) -> List[Payment]:
        """Retourne les paiements effectués par l'utilisateur pendant le mois donné."""
        ...


class EmailSender(Protocol):
    def send_email(self, user_id: str, email: Email) -> None:
        """Envoie un email à l'utilisateur."""
        ...
