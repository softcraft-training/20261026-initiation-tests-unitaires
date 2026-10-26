from calculator import add
from fizz_buzz import fizz_buzz

if __name__ == "__main__":
    print(f"add(2, 3) = {add(2, 3)}")

    for number in range(1, 16):
        print(fizz_buzz(number))
