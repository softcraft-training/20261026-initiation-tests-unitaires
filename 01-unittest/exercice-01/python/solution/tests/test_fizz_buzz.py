import pytest

from fizz_buzz import fizz_buzz


def test_fizz_buzz_returns_the_number_when_not_divisible_by_3_or_5():
    # Arrange
    number = 1

    # Act
    result = fizz_buzz(number)

    # Assert
    assert result == 1


def test_fizz_buzz_returns_fizz_when_divisible_by_3():
    # Arrange
    number = 3

    # Act
    result = fizz_buzz(number)

    # Assert
    assert result == "Fizz"


def test_fizz_buzz_returns_buzz_when_divisible_by_5():
    # Arrange
    number = 5

    # Act
    result = fizz_buzz(number)

    # Assert
    assert result == "Buzz"


def test_fizz_buzz_returns_fizzbuzz_when_divisible_by_3_and_5():
    # Arrange
    number = 15

    # Act
    result = fizz_buzz(number)

    # Assert
    assert result == "FizzBuzz"


# Bonus : tests paramétrés
@pytest.mark.parametrize("number", [3, 6, 9])
def test_fizz_buzz_returns_fizz_for_multiples_of_3(number):
    assert fizz_buzz(number) == "Fizz"


@pytest.mark.parametrize("number", [5, 10, 20])
def test_fizz_buzz_returns_buzz_for_multiples_of_5(number):
    assert fizz_buzz(number) == "Buzz"


@pytest.mark.parametrize("number", [15, 30, 45])
def test_fizz_buzz_returns_fizzbuzz_for_multiples_of_15(number):
    assert fizz_buzz(number) == "FizzBuzz"
