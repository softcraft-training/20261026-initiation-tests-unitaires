from contracts import EmailSender, PaymentRepository


class UnusualSpendingService:
    def __init__(self, payment_repository: PaymentRepository, email_sender: EmailSender):
        self._payment_repository = payment_repository
        self._email_sender = email_sender

    def notify(self, user_id: str) -> None:
        raise NotImplementedError("À implémenter")
