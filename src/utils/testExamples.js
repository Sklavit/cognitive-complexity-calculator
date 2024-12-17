export const testExamples = [
  {
    name: "getWords Example",
    code: `def get_words(number):
    if number == 1:
        return "one"
    elif number == 2:
        return "a couple"
    elif number == 3:
        return "a few"
    else:
        return "lots"`,
    expectedComplexity: 1
  },
  {
    name: "sumOfPrimes Example",
    code: `def sum_of_primes(max):
    total = 0
    for i in range(1, max + 1):
        for j in range(2, i):
            if i % j == 0:
                break
        else:
            total += i
    return total`,
    expectedComplexity: 7
  },
  {
    name: "Nested Control Flow Example",
    code: `def complex_function():
    try:
        if condition1:
            for i in range(10):
                while condition2:
                    pass
    except (ExcepType1, ExcepType2) as e:
        if condition2:
            pass`,
    expectedComplexity: 9
  },
  {
    name: "Logical Operators Example",
    code: `def check_conditions(a, b, c, d):
    if a and b and c and d:
        pass
    elif a or b and c or d:
        pass`,
    expectedComplexity: 4
  }
];
