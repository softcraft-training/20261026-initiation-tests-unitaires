const { fizzBuzz } = require("../src/fizzBuzz");

describe("fizzBuzz", () => {
  test("returns the number when not divisible by 3 or 5", () => {
    // Arrange
    const number = 1;

    // Act
    const result = fizzBuzz(number);

    // Assert
    expect(result).toBe(1);
  });

  test("returns Fizz when divisible by 3", () => {
    // Arrange
    const number = 3;

    // Act
    const result = fizzBuzz(number);

    // Assert
    expect(result).toBe("Fizz");
  });

  test("returns Buzz when divisible by 5", () => {
    // Arrange
    const number = 5;

    // Act
    const result = fizzBuzz(number);

    // Assert
    expect(result).toBe("Buzz");
  });

  test("returns FizzBuzz when divisible by 3 and 5", () => {
    // Arrange
    const number = 15;

    // Act
    const result = fizzBuzz(number);

    // Assert
    expect(result).toBe("FizzBuzz");
  });

  // Bonus : tests paramétrés
  test.each([3, 6, 9])("returns Fizz for %i", (number) => {
    expect(fizzBuzz(number)).toBe("Fizz");
  });

  test.each([5, 10, 20])("returns Buzz for %i", (number) => {
    expect(fizzBuzz(number)).toBe("Buzz");
  });

  test.each([15, 30, 45])("returns FizzBuzz for %i", (number) => {
    expect(fizzBuzz(number)).toBe("FizzBuzz");
  });
});
