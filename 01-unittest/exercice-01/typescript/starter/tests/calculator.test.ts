import { add } from "../src/calculator";

describe("add", () => {
  test("returns the sum of two numbers", () => {
    // Arrange
    const a = 2;
    const b = 3;

    // Act
    const result = add(a, b);

    // Assert
    expect(result).toBe(6);
  });
});
