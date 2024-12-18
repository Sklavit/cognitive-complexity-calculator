export const testExamples = [
  {
    name: "Simple Conditional (B1)",
    code: `def simple_if():
    if condition:  # +1
        return True
    return False`,
    expectedComplexity: 1,
    explanation: "Basic if statement adds 1 to complexity"
  },
  {
    name: "Nested If Statements (B1 + B2)",
    code: `def nested_if():
    if condition1:  # +1
        if condition2:  # +2 (nesting=1)
            return True
    return False`,
    expectedComplexity: 3,
    explanation: "Nested if adds complexity of its depth + 1"
  },
  {
    name: "Multiple Conditions (B1 + B3)",
    code: `def check_conditions(a, b, c, d):
    if a and b and c:  # +1 for if, +1 for boolean sequence
        return True
    elif a or b or c:  # +1 for elif, +1 for boolean sequence
        return True`,
    expectedComplexity: 4,
    explanation: "Boolean sequences each add 1, plus control structure complexity"
  },
  {
    name: "Loop with Break (B1 + B2)",
    code: `def find_item(items):
    for item in items:  # +1
        if item.valid:  # +2 (nesting=1)
            break  # +1 for break
    return item`,
    expectedComplexity: 3,
    explanation: "Loop adds 1, nested if adds 2"
  },
  {
    name: "Exception Handling",
    code: `def process_data():
    try:
        data.process()
    except ValueError:  # +1
        handle_error()
    except TypeError:  # +1
        handle_error()`,
    expectedComplexity: 2,
    explanation: "Each catch (except) adds 1 to complexity"
  },
  {
    name: "Complex Nesting with Loops",
    code: `def nested_loops():
    for i in range(10):  # +1
        for j in range(i):  # +2 (nesting=1)
            if i % j == 0:  # +3 (nesting=2)
                while check():  # +4 (nesting=3)
                    process()`,
    expectedComplexity: 10,
    explanation: "Each level of nesting adds its depth to the new structure's complexity"
  },
  {
    name: "Switch/Case Equivalent",
    code: `def get_value(type):
    if type == 1:  # +1 for if
        return "one"
    elif type == 2:  # +1 for elif
        return "two"
    elif type == 3:  # +1 for elif
        return "three"
    else:  # +1 for else
        return "unknown"`,
    expectedComplexity: 4,
    explanation: "Each condition adds 1, including else"
  },
  {
    name: "Complex Boolean Logic",
    code: `def check_access(user, role, permission):
    if (user and role) and  # +1 for if, +1 for boolean sequence
        (permission or  # +1 for new boolean sequence
         user.is_admin or
         role.is_super):
        return True
    return False`,
    expectedComplexity: 3,
    explanation: "Multiple boolean sequences each add 1"
  },
  {
    name: "Nested Exception Handling",
    code: `def risky_operation():
    try:
        with resource:
            try:
                process()
            except ValueError:  # +1
                if cleanup():  # +2 (nesting=1)
                    retry()
    except IOError:  # +1
        handle_error()`,
    expectedComplexity: 4,
    explanation: "Nested exception handling with conditional"
  },
  {
    name: "Early Returns",
    code: `def process_with_guards():
    if not valid:  # +1
        return None
    if not ready:  # +1
        return None
    if not enabled:  # +1
        return None
    process()`,
    expectedComplexity: 3,
    explanation: "Early returns don't add complexity, but their conditions do"
  },
  {
    name: "Loop with Multiple Exits",
    code: `def find_with_conditions():
    for item in items:  # +1
        if item.expired:  # +2 (nesting=1)
            continue
        if item.valid:  # +2 (nesting=1)
            if item.ready:  # +3 (nesting=2)
                return item
    return None`,
    expectedComplexity: 8,
    explanation: "Nested conditions in loop with continue and return"
  },
  {
    name: "Recursive Function",
    code: `def factorial(n):  # +1 for recursion
    if n <= 1:  # +1
        return 1
    return n * factorial(n - 1)`,
    expectedComplexity: 2,
    explanation: "Recursive function adds 1 plus its conditions"
  },
  // Edge Cases
  {
    name: "Empty Function",
    code: "def empty():\n    pass",
    expectedComplexity: 0,
    explanation: "Empty functions have zero complexity"
  },
  {
    name: "Comments Only",
    code: "def commented():\n    # this is a comment\n    pass",
    expectedComplexity: 0,
    explanation: "Comments don't add to complexity"
  },
  {
    name: "Empty String",
    code: "",
    expectedComplexity: 0,
    explanation: "Empty string has zero complexity"
  }
];
