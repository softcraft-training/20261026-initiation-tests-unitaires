from unittest.mock import ANY, call, create_autospec

import pytest

from contracts import Clock, EmailSender, PaymentRepository
from models import Category, Email, Payment, YearMonth
from unusual_spending_service import UnusualSpendingService

USER_ID = "user-42"
CURRENT_MONTH = YearMonth(2026, 10)
PREVIOUS_MONTH = YearMonth(2026, 9)


@pytest.fixture
def payment_repository():
    repository = create_autospec(PaymentRepository, instance=True)
    repository.fetch_payments.return_value = []
    return repository


@pytest.fixture
def email_sender():
    return create_autospec(EmailSender, instance=True)


@pytest.fixture
def clock():
    clock = create_autospec(Clock, instance=True)
    clock.current_month.return_value = CURRENT_MONTH
    return clock


@pytest.fixture
def service(payment_repository, email_sender, clock):
    return UnusualSpendingService(payment_repository, email_sender, clock)


def payment(category, price):
    return Payment(price, "Paiement", category)


def given_payments(payment_repository, payments_by_month):
    payment_repository.fetch_payments.side_effect = (
        lambda user_id, month: payments_by_month.get(month, [])
    )


def sent_email(email_sender):
    email_sender.send_email.assert_called_once_with(USER_ID, ANY)
    _, email = email_sender.send_email.call_args.args
    return email


# Étape 2 — Premier test : pas d'email

def test_sends_no_email_when_user_has_no_payments(service, email_sender):
    service.notify(USER_ID)

    email_sender.send_email.assert_not_called()


# Étape 3 — Une catégorie inhabituelle

def test_sends_email_to_the_user_when_spending_increases_by_at_least_50_percent(
    service, payment_repository, email_sender
):
    # Arrange
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 100)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 200)],
    })

    # Act
    service.notify(USER_ID)

    # Assert
    email_sender.send_email.assert_called_once_with(USER_ID, ANY)


def test_email_subject_contains_the_unusual_amount(service, payment_repository, email_sender):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 90)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 148)],
    })

    service.notify(USER_ID)

    assert sent_email(email_sender).subject == "Dépenses inhabituelles de 148 $ détectées !"


def test_email_body_lists_the_unusual_category(service, payment_repository, email_sender):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 90)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 148)],
    })

    service.notify(USER_ID)

    assert sent_email(email_sender).body == (
        "Bonjour cher client !\n"
        "\n"
        "Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :\n"
        "\n"
        "* Vous avez dépensé 148 $ en courses\n"
        "\n"
        "Cordialement,\n"
        "\n"
        "La Compagnie de Carte de Crédit"
    )


# Étape 4 — Les règles de comparaison

def test_sends_no_email_when_spending_increases_by_less_than_50_percent(
    service, payment_repository, email_sender
):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 100)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 149)],
    })

    service.notify(USER_ID)

    email_sender.send_email.assert_not_called()


def test_sends_email_when_spending_increases_by_exactly_50_percent(
    service, payment_repository, email_sender
):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 100)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 150)],
    })

    service.notify(USER_ID)

    email_sender.send_email.assert_called_once_with(USER_ID, ANY)


def test_sends_no_email_when_category_had_no_spending_last_month(
    service, payment_repository, email_sender
):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 100)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 100), payment(Category.GOLF, 500)],
    })

    service.notify(USER_ID)

    email_sender.send_email.assert_not_called()


def test_payments_of_the_same_category_are_summed(service, payment_repository, email_sender):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 60), payment(Category.GROCERIES, 40)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 80), payment(Category.GROCERIES, 70)],
    })

    service.notify(USER_ID)

    assert sent_email(email_sender).subject == "Dépenses inhabituelles de 150 $ détectées !"


# Étape 5 — Plusieurs catégories

def test_only_unusual_categories_are_listed(service, payment_repository, email_sender):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.GROCERIES, 90), payment(Category.TRAVEL, 100)],
        CURRENT_MONTH: [payment(Category.GROCERIES, 148), payment(Category.TRAVEL, 120)],
    })

    service.notify(USER_ID)

    email = sent_email(email_sender)
    assert email.subject == "Dépenses inhabituelles de 148 $ détectées !"
    assert "voyages" not in email.body


def test_several_unusual_categories_are_listed_in_enum_order_with_their_total_in_subject(
    service, payment_repository, email_sender
):
    given_payments(payment_repository, {
        PREVIOUS_MONTH: [payment(Category.TRAVEL, 300), payment(Category.GROCERIES, 90)],
        CURRENT_MONTH: [payment(Category.TRAVEL, 928), payment(Category.GROCERIES, 148)],
    })

    service.notify(USER_ID)

    email_sender.send_email.assert_called_once_with(USER_ID, Email(
        "Dépenses inhabituelles de 1076 $ détectées !",
        "Bonjour cher client !\n"
        "\n"
        "Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :\n"
        "\n"
        "* Vous avez dépensé 148 $ en courses\n"
        "* Vous avez dépensé 928 $ en voyages\n"
        "\n"
        "Cordialement,\n"
        "\n"
        "La Compagnie de Carte de Crédit",
    ))


# Étape 6 — Les mois

def test_fetches_payments_of_current_and_previous_month(service, payment_repository):
    service.notify(USER_ID)

    payment_repository.fetch_payments.assert_has_calls(
        [call(USER_ID, CURRENT_MONTH), call(USER_ID, PREVIOUS_MONTH)], any_order=True
    )


def test_previous_month_of_january_is_december_of_previous_year(service, payment_repository, clock):
    clock.current_month.return_value = YearMonth(2027, 1)

    service.notify(USER_ID)

    payment_repository.fetch_payments.assert_has_calls(
        [call(USER_ID, YearMonth(2027, 1)), call(USER_ID, YearMonth(2026, 12))], any_order=True
    )
