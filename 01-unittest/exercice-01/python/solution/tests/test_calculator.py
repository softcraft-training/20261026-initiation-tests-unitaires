from calculator import add


def test_add_returns_the_sum_of_two_numbers():
    # Arrange
    a = 2
    b = 3

    # Act
    result = add(a, b)

    # Assert
    assert result == 5
