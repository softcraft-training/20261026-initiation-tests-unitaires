package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class FizzBuzzTest {

    @Test
    void fizzBuzz_returnsTheNumber_whenNotDivisibleBy3Or5() {
        // Arrange
        FizzBuzz fizzBuzz = new FizzBuzz();

        // Act
        String result = fizzBuzz.fizzBuzz(1);

        // Assert
        assertEquals("1", result);
    }

    @Test
    void fizzBuzz_returnsFizz_whenDivisibleBy3() {
        // Arrange
        FizzBuzz fizzBuzz = new FizzBuzz();

        // Act
        String result = fizzBuzz.fizzBuzz(3);

        // Assert
        assertEquals("Fizz", result);
    }

    @Test
    void fizzBuzz_returnsBuzz_whenDivisibleBy5() {
        // Arrange
        FizzBuzz fizzBuzz = new FizzBuzz();

        // Act
        String result = fizzBuzz.fizzBuzz(5);

        // Assert
        assertEquals("Buzz", result);
    }

    @Test
    void fizzBuzz_returnsFizzBuzz_whenDivisibleBy3And5() {
        // Arrange
        FizzBuzz fizzBuzz = new FizzBuzz();

        // Act
        String result = fizzBuzz.fizzBuzz(15);

        // Assert
        assertEquals("FizzBuzz", result);
    }

    // Bonus : tests paramétrés
    @ParameterizedTest
    @ValueSource(ints = {3, 6, 9})
    void fizzBuzz_returnsFizz_forMultiplesOf3(int number) {
        assertEquals("Fizz", new FizzBuzz().fizzBuzz(number));
    }

    @ParameterizedTest
    @ValueSource(ints = {5, 10, 20})
    void fizzBuzz_returnsBuzz_forMultiplesOf5(int number) {
        assertEquals("Buzz", new FizzBuzz().fizzBuzz(number));
    }

    @ParameterizedTest
    @ValueSource(ints = {15, 30, 45})
    void fizzBuzz_returnsFizzBuzz_forMultiplesOf15(int number) {
        assertEquals("FizzBuzz", new FizzBuzz().fizzBuzz(number));
    }
}
