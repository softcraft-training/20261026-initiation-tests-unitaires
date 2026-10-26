package tp;

public class Main {

    public static void main(String[] args) {
        Calculator calculator = new Calculator();
        System.out.println("add(2, 3) = " + calculator.add(2, 3));

        FizzBuzz fizzBuzz = new FizzBuzz();
        for (int number = 1; number <= 15; number++) {
            System.out.println(fizzBuzz.fizzBuzz(number));
        }
    }
}
