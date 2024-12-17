
export const localTests = [
  {
    name: "getWords Example",
    code: `def get_words(number):
    switch (number):  # +1
        case 1:
            return "one"
        case 2:
            return "a couple"
        case 3:
            return "a few"
        default:
            return "lots"`,
    expectedComplexity: 1,
    explanation: "Switch statement adds 1 to complexity"
  },
  {
    name: "sumOfPrimes Example",
    code: `def sum_of_primes(max):
    total = 0
    OUT: for i in range(1, max + 1):  # +1
        for j in range(2, i):  # +2 (nesting=1)
            if i % j == 0:  # +3 (nesting=2)
                continue OUT  # +1
        total += i
    return total`,
    expectedComplexity: 7,
    explanation: "Nested loops and continue to label"
  },
  {
    name: "overriddenSymbol Example",
    code: `def overridden_symbol_from(class_type):
    if class_type.is_unknown():  # +1
        return Symbols.unknown_method_symbol
    unknown_found = False
    for symbol in class_type.get_symbol().members().lookup(name):  # +1
        if symbol.is_kind(JavaSymbol.MTH) and not symbol.is_static():  # +2 (nesting=1)
            method_java_symbol = symbol
            if can_override(method_java_symbol):  # +3 (nesting=2)
                overriding = check_overriding_parameters(method_java_symbol, class_type)
                if overriding is None:  # +4 (nesting=3)
                    if not unknown_found:  # +5 (nesting=4)
                        unknown_found = True
                elif overriding:  # +1
                    return method_java_symbol
    if unknown_found:  # +1
        return Symbols.unknown_method_symbol
    return None`,
    expectedComplexity: 19,
    explanation: "Complex nesting with multiple conditions and early returns"
  },
  {
    name: "Pattern Matching Example",
    code: `def to_regexp(ant_pattern, directory_separator):
    escaped_separator = '\\' + directory_separator
    sb = []
    i = 1 if ant_pattern.startswith("/") else 0
    
    while i < len(ant_pattern):  # +1
        ch = ant_pattern[i]
        if ch in SPECIAL_CHARS:  # +2 (nesting=1)
            sb.append('\\' + ch)
        elif ch == '*':  # +1
            if i + 1 < len(ant_pattern) and ant_pattern[i + 1] == '*':  # +3 (nesting=2)
                if i + 2 < len(ant_pattern) and is_slash(ant_pattern[i + 2]):  # +4 (nesting=3)
                    sb.append("(?:.*" + escaped_separator + "|)")
                    i += 2
                else:  # +1
                    sb.append("