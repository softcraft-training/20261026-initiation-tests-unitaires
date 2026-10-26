import { add } from "./calculator";
import { fizzBuzz } from "./fizzBuzz";

console.log(`add(2, 3) = ${add(2, 3)}`);

for (let number = 1; number <= 15; number++) {
  console.log(fizzBuzz(number));
}
