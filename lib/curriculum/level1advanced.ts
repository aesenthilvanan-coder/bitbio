import type { Module } from "@/lib/types";

const modules: Module[] = [
  {
    id: "l1-adv-m1",
    title: "Python Functions Lab",
    description: "Master the art of writing reusable, powerful Python functions",
    realm: 1,
    color: "#00ffaa",
    nodes: [
      {
        id: "l1-adv-m1-n1",
        moduleId: "l1-adv-m1",
        title: "Function Basics",
        description: "Learn to define functions, use parameters, and return values",
        icon: "⚗️",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m1-n1-e1",
            type: "multiple-choice",
            question: "Which keyword is used to define a function in Python?",
            hint: "🔬 TEACHING: In Python, functions are reusable blocks of code. You define one using a special keyword followed by the function name and parentheses. For example: `def greet():` defines a function named greet. The body is indented below the definition line.",
            options: ["func", "def", "function", "define"],
            correctIndex: 1,
            explanation: "`def` is the keyword used to define a function in Python — it stands for 'define'. After `def`, write the function name, parentheses, and a colon. The body is indented.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m1-n1-e2",
            type: "multiple-choice",
            question: "What does the `return` statement do in a Python function?",
            hint: "🔬 TEACHING: When a function finishes, it can send a value back to the caller using `return`. Without it, a function returns `None` by default. Example: `def square(x): return x * x` — calling `square(4)` gives back `16`.",
            options: [
              "Stops the entire program",
              "Sends a value back to the caller and ends the function",
              "Prints a value to the console",
              "Repeats the function from the beginning",
            ],
            correctIndex: 1,
            explanation: "`return` sends a value back to the caller and immediately exits the function. It is how functions communicate results to the rest of your code.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m1-n1-e3",
            type: "fill-blank",
            question: "Complete the function definition: _____ count_nucleotides(dna_sequence):",
            hint: "🔬 TEACHING: A function definition starts with `def`, followed by the function name and parameters in parentheses. Parameters are placeholders for values you pass in when calling the function. Example: `def analyze(sequence):` defines a function that accepts one argument.",
            blanks: [{ text: "def", answer: "def", position: 0 }],
            explanation: "The `def` keyword is required to declare any function in Python. It tells the interpreter that what follows is a function definition.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m1-n1-e4",
            type: "fill-blank",
            question: "A function that accepts input values uses _____ to receive those values.",
            hint: "🔬 TEACHING: Parameters are variables listed in the function definition that receive passed-in values (arguments). In `def multiply(x, y): return x * y`, `x` and `y` are parameters. When you call `multiply(3, 4)`, the values 3 and 4 are the arguments.",
            blanks: [{ text: "parameters", answer: "parameters", position: 0 }],
            explanation: "Parameters are variable names in the function definition that receive passed-in argument values. They allow functions to work with different data each time they are called.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m1-n1-e5",
            type: "code-complete",
            question: "Complete the function that calculates GC content (percentage of G and C bases) in a DNA sequence.",
            hint: "🔬 TEACHING: GC content is the fraction of G and C bases divided by total bases, expressed as a percentage. To count occurrences of a character in a string, use `.count()`. For example: `'ATCG'.count('G')` returns 1. To get a percentage, divide by total length and multiply by 100.",
            codeTemplate: `def gc_content(dna):
    gc = dna.count('G') + dna.count('___')
    return (gc / len(dna)) * ___`,
            codeAnswer: `def gc_content(dna):
    gc = dna.count('G') + dna.count('C')
    return (gc / len(dna)) * 100`,
            explanation: "We count both 'G' and 'C' bases, divide by total sequence length, and multiply by 100 for a percentage. This is a real calculation used in genomics!",
            xpReward: 25,
          },
          {
            id: "l1-adv-m1-n1-e6",
            type: "debug-code",
            question: "This function should return the complement of a DNA base, but there is a bug. Find and fix it.",
            hint: "🔬 TEACHING: DNA base pairing: A pairs with T, T with A, G with C, C with G. In Python, a dictionary maps one value to another perfectly. Make sure the function actually returns the lookup result — a missing `return` statement means the function silently returns `None`.",
            codeTemplate: `def complement(base):
    pairs = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'}
    result = pairs[base]`,
            bugLine: 3,
            bugFix: "    return pairs[base]",
            explanation: "The function looked up the complement correctly but forgot to `return` the result. Without `return`, the function returns `None` instead of the complement base.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-adv-m1-n2",
        moduleId: "l1-adv-m1",
        title: "Scope & Closures",
        description: "Understand local vs global variables, the LEGB rule, and closures",
        icon: "🔭",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m1-n2-e1",
            type: "multiple-choice",
            question: "What does LEGB stand for in Python's scope resolution order?",
            hint: "🔬 TEACHING: Python resolves variable names by searching in a fixed order: Local scope (inside the current function), then Enclosing scope (outer functions), then Global scope (module level), then Built-in scope (Python's built-in names like `len` and `print`). This order is called LEGB.",
            options: [
              "Loop, Evaluate, Generate, Build",
              "Local, Enclosing, Global, Built-in",
              "List, Enumerate, Group, Bind",
              "Load, Execute, Get, Build",
            ],
            correctIndex: 1,
            explanation: "LEGB stands for Local, Enclosing, Global, Built-in — the order Python searches for variable names. Python starts in the innermost scope and works outward.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m1-n2-e2",
            type: "multiple-choice",
            question: "What is a closure in Python?",
            hint: "🔬 TEACHING: A closure occurs when an inner function 'remembers' variables from its enclosing (outer) function even after the outer function has finished running. Example: `def make_multiplier(n): def multiply(x): return x * n; return multiply` — `multiply` remembers `n` even after `make_multiplier` returns.",
            options: [
              "A function that closes files automatically",
              "An inner function that captures and remembers variables from its enclosing scope",
              "A function with no return value",
              "A built-in Python data structure",
            ],
            correctIndex: 1,
            explanation: "A closure is an inner function that retains access to variables from its enclosing scope, even after the outer function has returned. Closures are a powerful way to create function factories and maintain state.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m1-n2-e3",
            type: "fill-blank",
            question: "To modify a global variable inside a function, declare it with the _____ keyword first.",
            hint: "🔬 TEACHING: By default, assigning a variable inside a function creates a new local variable — even if a global variable with the same name exists. To tell Python you want to modify the global, use `global` before using it. Example: `global count` inside a function allows modifying the outer `count` variable.",
            blanks: [{ text: "global", answer: "global", position: 0 }],
            explanation: "The `global` keyword tells Python that a variable name refers to the global scope, not a new local variable. Without it, assigning to the variable inside a function creates a local that shadows the global.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m1-n2-e4",
            type: "fill-blank",
            question: "To modify a variable from an enclosing function inside a nested inner function, use the _____ keyword.",
            hint: "🔬 TEACHING: `nonlocal` works like `global` but targets the nearest enclosing function's scope rather than the global scope. This is essential in closures when you need to modify a variable from the outer function. Example: `nonlocal counter` inside a nested function lets you update `counter` defined in the outer function.",
            blanks: [{ text: "nonlocal", answer: "nonlocal", position: 0 }],
            explanation: "`nonlocal` tells Python that a variable refers to the nearest enclosing scope that is not global. It is essential when you want to update a variable inside a closure.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m1-n2-e5",
            type: "code-complete",
            question: "Complete this closure that creates a gene expression counter — each call increments the count.",
            hint: "🔬 TEACHING: A closure can maintain state between calls using `nonlocal`. The outer function creates a variable; the inner function modifies it using `nonlocal`. Think of it like a cell keeping track of how many times a gene has been expressed across multiple function calls.",
            codeTemplate: `def make_expression_counter():
    count = 0
    def increment():
        _____ count
        count += 1
        return count
    return increment`,
            codeAnswer: `def make_expression_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment`,
            explanation: "`nonlocal count` tells the inner function that `count` belongs to the enclosing scope. Without it, `count += 1` raises `UnboundLocalError` because Python would treat `count` as a new local variable.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m1-n2-e6",
            type: "debug-code",
            question: "This code has a scope bug — it crashes when `show_species()` is called. Fix it.",
            hint: "🔬 TEACHING: If you assign to a variable name anywhere inside a function, Python treats ALL uses of that name in the function as local — including lines before the assignment. This causes `UnboundLocalError`. If you only need to READ a global variable (not modify it), you do NOT need the `global` keyword at all.",
            codeTemplate: `species = 'Homo sapiens'

def show_species():
    print(species)
    species = 'Mus musculus'`,
            bugLine: 5,
            bugFix: "    local_species = 'Mus musculus'",
            explanation: "Because `species = 'Mus musculus'` appears in the function, Python treats `species` as local throughout — including the `print` call above it, causing `UnboundLocalError`. Using a different local variable name fixes it.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-adv-m1-n3",
        moduleId: "l1-adv-m1",
        title: "Lambda & Higher-Order Functions",
        description: "Write concise lambdas and use map(), filter(), and sorted()",
        icon: "🧬",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m1-n3-e1",
            type: "multiple-choice",
            question: "What is the correct syntax for a lambda function that squares a number?",
            hint: "🔬 TEACHING: A lambda is an anonymous one-line function. Syntax: `lambda parameters: expression`. For example, `lambda x: x + 1` creates a function that adds 1 to x. Lambdas are useful when you need a small function just once, without a full `def` definition.",
            options: [
              "lambda x => x * x",
              "lambda(x): x * x",
              "lambda x: x * x",
              "def lambda x: x * x",
            ],
            correctIndex: 2,
            explanation: "`lambda x: x * x` is correct. The keyword `lambda` is followed by parameters, a colon, then the expression to return. No parentheses around parameters and no `return` keyword needed.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m1-n3-e2",
            type: "multiple-choice",
            question: "What does `map(func, iterable)` return in Python 3?",
            hint: "🔬 TEACHING: `map()` applies a function to every item in an iterable and returns the results. In Python 3, `map()` returns a lazy iterator (a map object), not a list. Wrap it to get a list: `list(map(func, iterable))`. Example: `list(map(lambda x: x*2, [1,2,3]))` returns `[2, 4, 6]`.",
            options: [
              "A list of transformed values",
              "A dictionary mapping inputs to outputs",
              "A lazy iterator (map object) of transformed values",
              "The original iterable unchanged",
            ],
            correctIndex: 2,
            explanation: "In Python 3, `map()` returns a lazy map object (iterator), not a list. This is memory-efficient for large datasets. Wrap with `list()` to materialize the results.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m1-n3-e3",
            type: "fill-blank",
            question: "Complete the lambda that converts a gene name to uppercase: upper_gene = _____ gene: gene.upper()",
            hint: "🔬 TEACHING: Lambda functions follow the pattern `lambda <params>: <expression>`. They are anonymous functions you can assign to a variable or pass directly as arguments. `lambda gene: gene.upper()` creates a function that calls `.upper()` on any string passed to it.",
            blanks: [{ text: "lambda", answer: "lambda", position: 0 }],
            explanation: "The `lambda` keyword starts an anonymous function. `lambda gene: gene.upper()` is equivalent to `def f(gene): return gene.upper()`, just more concise.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m1-n3-e4",
            type: "fill-blank",
            question: "Complete: long_genes = list(_____(lambda g: len(g) > 4, genes))",
            hint: "🔬 TEACHING: `filter(function, iterable)` keeps only elements for which the function returns `True`. Think of it as a biological filter — only sequences that pass a test make it through. Example: `list(filter(lambda x: x > 0, [-1, 2, -3, 4]))` returns `[2, 4]`.",
            blanks: [{ text: "filter", answer: "filter", position: 0 }],
            explanation: "`filter()` applies the lambda to each element and keeps only those where it returns `True`. Here it keeps genes whose name length exceeds 4 characters.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m1-n3-e5",
            type: "code-complete",
            question: "Complete the code to sort gene tuples by expression level (second element), highest first.",
            hint: "🔬 TEACHING: `sorted()` accepts a `key=` argument — a function applied to each element to produce a sort key. Use a `lambda` to extract the value to sort by. `reverse=True` sorts in descending order. Example: `sorted(data, key=lambda x: x[1], reverse=True)` sorts by the second element, largest first.",
            codeTemplate: `genes = [('BRCA1', 8.5), ('TP53', 12.3), ('MYC', 6.1), ('EGFR', 15.0)]
sorted_genes = sorted(genes, key=_____ g: g[___], reverse=True)
print(sorted_genes)`,
            codeAnswer: `genes = [('BRCA1', 8.5), ('TP53', 12.3), ('MYC', 6.1), ('EGFR', 15.0)]
sorted_genes = sorted(genes, key=lambda g: g[1], reverse=True)
print(sorted_genes)`,
            explanation: "`key=lambda g: g[1]` tells `sorted()` to use the second element (expression level) as the sort key. `reverse=True` puts the highest expression first. This is a common bioinformatics pattern for ranking genes.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m1-n3-e6",
            type: "debug-code",
            question: "This code tries to double all expression values using `map()`, but the arguments are in the wrong order. Fix it.",
            hint: "🔬 TEACHING: `map()` requires two arguments in this order: the function first, then the iterable. A common mistake is passing them reversed. Remember: `map(function, iterable)` — function always comes first. Also, in Python 3, wrap with `list()` to get a list back.",
            codeTemplate: `expression_levels = [2.1, 5.3, 1.8, 9.2]
doubled = list(map(expression_levels, lambda x: x * 2))
print(doubled)`,
            bugLine: 2,
            bugFix: "doubled = list(map(lambda x: x * 2, expression_levels))",
            explanation: "`map(function, iterable)` — the function comes FIRST, the iterable SECOND. The original had them reversed, passing the list as the function and causing a TypeError.",
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l1-adv-m2",
    title: "Classes: The Cell Blueprint",
    description: "Model biological entities using Python's object-oriented programming",
    realm: 1,
    color: "#00ffaa",
    nodes: [
      {
        id: "l1-adv-m2-n1",
        moduleId: "l1-adv-m2",
        title: "OOP Foundations",
        description: "Learn classes, __init__, self, and instance vs class variables",
        icon: "🧫",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m2-n1-e1",
            type: "multiple-choice",
            question: "What is `self` in a Python class method?",
            hint: "🔬 TEACHING: In Python, `self` is a reference to the current instance of the class. It is the first parameter of every instance method, and Python passes it automatically when you call a method on an object. Through `self`, each object can access its own data: `self.name` accesses the `name` attribute of that specific object.",
            options: [
              "A keyword that refers to the class itself",
              "A reference to the current instance of the class",
              "A built-in variable that stores method results",
              "An optional parameter for class methods",
            ],
            correctIndex: 1,
            explanation: "`self` refers to the specific instance on which a method is being called. Python passes it automatically — you don't include it when calling `my_object.method()`.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m2-n1-e2",
            type: "multiple-choice",
            question: "What is the key difference between an instance variable and a class variable?",
            hint: "🔬 TEACHING: An instance variable (defined as `self.x = value` inside `__init__`) belongs to one specific object. A class variable (defined directly in the class body, outside any method) is shared by ALL instances. Example: `Cell.kingdom = 'Eukarya'` is shared; `self.name = 'Red Blood Cell'` is unique per object.",
            options: [
              "Instance variables are faster; class variables are slower",
              "Instance variables belong to one object; class variables are shared by all instances",
              "Instance variables can only hold numbers; class variables hold any type",
              "There is no difference",
            ],
            correctIndex: 1,
            explanation: "Instance variables (`self.x`) are unique to each object. Class variables (defined in the class body) are shared across all instances. Changing a class variable affects every object of that class.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m2-n1-e3",
            type: "fill-blank",
            question: "The special method that initializes a new object's attributes is called _____.",
            hint: "🔬 TEACHING: When you create a new object with `MyClass()`, Python automatically calls the `__init__` method (the constructor) to set up initial state. Inside `__init__`, you assign attributes using `self.attribute = value`. Example: `def __init__(self, name): self.name = name`.",
            blanks: [{ text: "__init__", answer: "__init__", position: 0 }],
            explanation: "`__init__` is the constructor method called automatically when a new instance is created. It sets up the object's initial state by assigning instance variables via `self`.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m2-n1-e4",
            type: "fill-blank",
            question: "To access an instance variable `dna_sequence` inside a method, write: _____.dna_sequence",
            hint: "🔬 TEACHING: Inside any instance method, access the object's own attributes using `self`. Dot notation `self.attribute_name` retrieves or sets the attribute for the current object. `self.dna_sequence` gets the DNA sequence belonging to this specific cell instance.",
            blanks: [{ text: "self", answer: "self", position: 0 }],
            explanation: "`self.dna_sequence` accesses the `dna_sequence` attribute of the current instance. `self` must always be the first parameter of instance methods.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m2-n1-e5",
            type: "code-complete",
            question: "Complete the `Cell` class with an `__init__` method that sets `cell_type` and `organelles` attributes.",
            hint: "🔬 TEACHING: A class is defined with `class ClassName:`. The `__init__` method takes `self` plus any initial data. Inside `__init__`, assign each piece of data to `self.attribute_name`. For example: `self.cell_type = cell_type` stores the argument as an instance variable.",
            codeTemplate: `class Cell:
    kingdom = 'Eukarya'

    def _____(self, cell_type, organelles):
        self.cell_type = _____
        self.organelles = organelles`,
            codeAnswer: `class Cell:
    kingdom = 'Eukarya'

    def __init__(self, cell_type, organelles):
        self.cell_type = cell_type
        self.organelles = organelles`,
            explanation: "`__init__` is the constructor. `self.cell_type = cell_type` stores the passed-in value as an instance variable. Each `Cell` object has its own `cell_type` and `organelles`, while `kingdom` is shared by all Cell instances.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m2-n1-e6",
            type: "debug-code",
            question: "This class has a bug — the `get_length` method crashes when called. Fix it.",
            hint: "🔬 TEACHING: Instance methods must always have `self` as their first parameter. Without `self`, Python doesn't know which object the method belongs to and you can't access `self.attribute`. Always include `self` as the first argument in instance method definitions — Python passes it automatically when you call `obj.method()`.",
            codeTemplate: `class Gene:
    def __init__(self, name, sequence):
        self.name = name
        self.sequence = sequence

    def get_length():
        return len(self.sequence)`,
            bugLine: 6,
            bugFix: "    def get_length(self):",
            explanation: "Instance methods need `self` as their first parameter. Without it, calling `my_gene.get_length()` raises `TypeError: get_length() takes 0 positional arguments but 1 was given` because Python tries to pass the instance automatically.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-adv-m2-n2",
        moduleId: "l1-adv-m2",
        title: "Inheritance",
        description: "Build class hierarchies with inheritance, super(), and method overriding",
        icon: "🌱",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m2-n2-e1",
            type: "multiple-choice",
            question: "What does `super()` do in a Python class?",
            hint: "🔬 TEACHING: `super()` gives you access to the parent class's methods. It is most commonly used in `__init__` to call the parent constructor so the child class inherits all the parent's setup. Example: `class EukaryoticCell(Cell): def __init__(self, ...): super().__init__(...)` calls Cell's `__init__`.",
            options: [
              "Creates a superclass from scratch",
              "Gives access to the parent class's methods and attributes",
              "Makes the current method faster",
              "Converts the class into a module",
            ],
            correctIndex: 1,
            explanation: "`super()` returns a proxy that delegates method calls to the parent class. It is primarily used to call the parent's `__init__` so the child inherits initialization logic without duplicating code.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m2-n2-e2",
            type: "multiple-choice",
            question: "When a child class defines a method with the same name as a parent class method, what happens?",
            hint: "🔬 TEACHING: Method overriding allows a child class to provide its own implementation of an inherited method. When you call the method on a child instance, Python uses the child's version. This is like a specialized neuron cell doing something different from a generic cell — same interface, different behavior.",
            options: [
              "Python raises an error because duplicate method names are not allowed",
              "The parent's method is called instead",
              "The child's method overrides the parent's method",
              "Both methods run simultaneously",
            ],
            correctIndex: 2,
            explanation: "Method overriding means the child's version takes precedence. Python first looks in the child class — if found, it uses that. This lets child classes customize inherited behavior while keeping the same interface.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m2-n2-e3",
            type: "fill-blank",
            question: "To create a `NeuronCell` class that inherits from `Cell`, write: class NeuronCell(_____):",
            hint: "🔬 TEACHING: To make a class inherit from a parent, write the parent class name in parentheses after the child class name. `class EukaryoticCell(Cell):` makes `EukaryoticCell` a subclass of `Cell`. The child automatically gets all methods and attributes of the parent.",
            blanks: [{ text: "Cell", answer: "Cell", position: 0 }],
            explanation: "Inheritance is specified by putting the parent class name in parentheses. `NeuronCell(Cell)` means NeuronCell inherits all of Cell's methods and attributes, and can add or override functionality.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m2-n2-e4",
            type: "fill-blank",
            question: "Inside a child class `__init__`, call the parent's constructor with: _____().__init__(cell_type, organelles)",
            hint: "🔬 TEACHING: `super().__init__(...)` calls the parent class's `__init__`, ensuring the parent's setup code runs first. This is important so the child object has all the attributes the parent expects. Without it, the child would be missing the parent's instance variables.",
            blanks: [{ text: "super", answer: "super", position: 0 }],
            explanation: "`super()` returns a reference to the parent class; `.__init__(...)` calls its constructor. This initializes parent-defined attributes so the child doesn't need to duplicate that code.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m2-n2-e5",
            type: "code-complete",
            question: "Complete the `NeuronCell` class that inherits from `Cell` and adds an `axon_length` attribute.",
            hint: "🔬 TEACHING: In the child's `__init__`, first call `super().__init__(...)` with the parent's required arguments, then add your new attributes. This ensures the object is properly initialized as both a `Cell` AND a `NeuronCell`.",
            codeTemplate: `class Cell:
    def __init__(self, cell_type, organelles):
        self.cell_type = cell_type
        self.organelles = organelles

class NeuronCell(_____):
    def __init__(self, organelles, axon_length):
        super().__init__('neuron', _____)
        self.axon_length = axon_length`,
            codeAnswer: `class Cell:
    def __init__(self, cell_type, organelles):
        self.cell_type = cell_type
        self.organelles = organelles

class NeuronCell(Cell):
    def __init__(self, organelles, axon_length):
        super().__init__('neuron', organelles)
        self.axon_length = axon_length`,
            explanation: "`NeuronCell(Cell)` establishes inheritance. `super().__init__('neuron', organelles)` calls `Cell.__init__` to set `cell_type` and `organelles`. Then `self.axon_length = axon_length` adds the neuron-specific attribute.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m2-n2-e6",
            type: "debug-code",
            question: "This `MuscleCell` subclass has an inheritance bug — it doesn't pass enough arguments to the parent. Fix it.",
            hint: "🔬 TEACHING: When calling `super().__init__(...)`, you must pass ALL arguments the parent's `__init__` requires. If `Cell.__init__` requires `cell_type` and `organelles`, you must provide both. Missing an argument causes a `TypeError: __init__() missing 1 required positional argument`.",
            codeTemplate: `class Cell:
    def __init__(self, cell_type, organelles):
        self.cell_type = cell_type
        self.organelles = organelles

class MuscleCell(Cell):
    def __init__(self, organelles):
        super().__init__(organelles)
        self.can_contract = True`,
            bugLine: 8,
            bugFix: "        super().__init__('muscle', organelles)",
            explanation: "`Cell.__init__` requires both `cell_type` and `organelles`. Passing only `organelles` assigned it to `cell_type` and left `organelles` missing. The fix passes `'muscle'` as the cell type explicitly.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-adv-m2-n3",
        moduleId: "l1-adv-m2",
        title: "Special Methods",
        description: "Implement magic methods: __str__, __len__, __eq__, and __repr__",
        icon: "✨",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m2-n3-e1",
            type: "multiple-choice",
            question: "What does the `__str__` method define for a Python class?",
            hint: "🔬 TEACHING: `__str__` defines the human-readable string representation of an object. When you call `print(my_object)` or `str(my_object)`, Python calls `__str__`. Without it, you get something like `<Cell object at 0x7f3a...>`. With it, you can return something meaningful like `'Cell: Red Blood Cell'`.",
            options: [
              "Converts the object to binary for storage",
              "Defines the human-readable string representation, used by print() and str()",
              "Counts the number of string attributes in the object",
              "Validates that all attributes are strings",
            ],
            correctIndex: 1,
            explanation: "`__str__` is called by `print()` and `str()`. It should return a clean, human-readable description of the object, like `'Gene: BRCA1 (7088 bp)'`.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m2-n3-e2",
            type: "multiple-choice",
            question: "What does defining `__len__` enable for your class?",
            hint: "🔬 TEACHING: `__len__` lets your object work with Python's built-in `len()` function. Define `def __len__(self): return ...` and `len(my_object)` will call it. For a DNA sequence object, `__len__` naturally returns the number of base pairs — making your class feel like a native Python type.",
            options: [
              "Allows the object to be used with the `len()` function",
              "Sets the maximum memory size of the object",
              "Counts the number of methods in the class",
              "Defines how many instances can be created",
            ],
            correctIndex: 0,
            explanation: "When you define `__len__`, Python's `len()` function calls it on your object. For a `Genome` class you might return the number of base pairs; for a `ProteinChain`, the number of amino acids.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m2-n3-e3",
            type: "fill-blank",
            question: "The special method that defines the `==` equality comparison between two objects is called _____.",
            hint: "🔬 TEACHING: `__eq__` is called when you use `==` to compare two objects. By default, `==` checks if two variables point to the same object in memory. By defining `__eq__`, you can make `==` compare by content — for example, two Gene objects are equal if they have the same sequence.",
            blanks: [{ text: "__eq__", answer: "__eq__", position: 0 }],
            explanation: "`__eq__(self, other)` defines what `==` means for your objects. Return `True` if they should be considered equal. Without it, `==` defaults to identity comparison (`is`), which is rarely what you want.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m2-n3-e4",
            type: "fill-blank",
            question: "`__repr__` should return a string that ideally looks like valid Python code to _____ the object.",
            hint: "🔬 TEACHING: `__repr__` is the developer-facing representation shown in the Python REPL and when you call `repr(obj)`. It should show how to recreate the object. Convention: if `eval(repr(obj)) == obj`, that's ideal. Example: `Gene('BRCA1', 'ATCG...')` rather than just the gene name.",
            blanks: [{ text: "recreate", answer: "recreate", position: 0 }],
            explanation: "`__repr__` provides an unambiguous representation useful for debugging. It's shown in the REPL and is the fallback when `__str__` is not defined.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m2-n3-e5",
            type: "code-complete",
            question: "Complete the `DNASequence` class with `__str__` and `__len__` methods.",
            hint: "🔬 TEACHING: `__str__` returns a formatted string (use an f-string). `__len__` returns an integer representing the 'size' of the object. For DNA, the length is the number of base pairs. These methods make your class feel like a native Python type.",
            codeTemplate: `class DNASequence:
    def __init__(self, name, sequence):
        self.name = name
        self.sequence = sequence

    def __str__(self):
        return f'DNASequence: {self._____} ({len(self.sequence)} bp)'

    def __len__(self):
        return len(self._____)`,
            codeAnswer: `class DNASequence:
    def __init__(self, name, sequence):
        self.name = name
        self.sequence = sequence

    def __str__(self):
        return f'DNASequence: {self.name} ({len(self.sequence)} bp)'

    def __len__(self):
        return len(self.sequence)`,
            explanation: "`__str__` uses an f-string to format a readable description. `__len__` returns the length of the sequence string. Now `print(dna)` gives nice output, and `len(dna)` returns the number of bases.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m2-n3-e6",
            type: "debug-code",
            question: "This `__eq__` method has a bug — it causes infinite recursion. Fix it to compare sequences correctly.",
            hint: "🔬 TEACHING: `__eq__` receives `self` (this object) and `other` (the object being compared to). To compare by content, check the relevant attributes: `return self.sequence == other.sequence`. A common bug is accidentally comparing `self == other`, which calls `__eq__` again recursively and crashes with a `RecursionError`.",
            codeTemplate: `class Gene:
    def __init__(self, name, sequence):
        self.name = name
        self.sequence = sequence

    def __eq__(self, other):
        return self == other`,
            bugLine: 7,
            bugFix: "        return self.sequence == other.sequence",
            explanation: "`self == other` calls `__eq__` recursively, causing infinite recursion. The correct check compares the actual data: `self.sequence == other.sequence` makes two Gene objects equal when they share the same DNA sequence.",
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l1-adv-m3",
    title: "Error Handling & File I/O",
    description: "Write robust code that handles errors and processes biological data files",
    realm: 1,
    color: "#00ffaa",
    nodes: [
      {
        id: "l1-adv-m3-n1",
        moduleId: "l1-adv-m3",
        title: "Exception Handling",
        description: "Use try/except/finally, raise errors, and create custom exceptions",
        icon: "⚠️",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m3-n1-e1",
            type: "multiple-choice",
            question: "What is the purpose of a `try/except` block in Python?",
            hint: "🔬 TEACHING: `try/except` lets you handle errors gracefully instead of crashing. Code inside `try` is attempted; if an error occurs, execution jumps to the matching `except` block. Example: trying to parse a malformed DNA file might raise a `ValueError` — catch it and report a helpful message rather than crashing.",
            options: [
              "To make code run twice for reliability",
              "To test if a variable has the correct type",
              "To handle errors gracefully without crashing the program",
              "To speed up code execution",
            ],
            correctIndex: 2,
            explanation: "`try/except` catches exceptions so your program can handle errors gracefully. Code in `try` runs normally; if any line raises an exception, Python jumps to the `except` block instead of crashing.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m3-n1-e2",
            type: "multiple-choice",
            question: "When does the `finally` block execute in a try/except/finally structure?",
            hint: "🔬 TEACHING: `finally` runs no matter what — whether the `try` block succeeded, raised an exception, or an `except` block re-raised it. This makes `finally` perfect for cleanup code like closing files or releasing resources. Think: 'always do this last, no matter what happened.'",
            options: [
              "Only when no exception occurs",
              "Only when an exception occurs",
              "Always, whether or not an exception occurred",
              "Only when the program is about to exit",
            ],
            correctIndex: 2,
            explanation: "`finally` always runs, regardless of whether an exception occurred or was handled. It's used for essential cleanup tasks like closing file handles or database connections.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m3-n1-e3",
            type: "fill-blank",
            question: "To manually trigger an exception, use: _____ ValueError('Invalid DNA base detected')",
            hint: "🔬 TEACHING: The `raise` statement lets you deliberately trigger an exception. This is useful for enforcing rules. Example: if a function receives an invalid DNA base, `raise ValueError('Invalid base: Z')` immediately signals the problem to the caller, who must handle it with try/except.",
            blanks: [{ text: "raise", answer: "raise", position: 0 }],
            explanation: "`raise` triggers an exception manually. `raise ValueError('Invalid DNA base detected')` stops the current function and propagates the error upward for the caller to handle.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m3-n1-e4",
            type: "fill-blank",
            question: "To create a custom exception class, write: class InvalidSequenceError(_____):  pass",
            hint: "🔬 TEACHING: Custom exceptions are classes that inherit from Python's built-in `Exception` class. They let you create domain-specific error types. `class InvalidSequenceError(Exception): pass` creates a new exception type you can raise and catch specifically for sequence-related errors in your biology code.",
            blanks: [{ text: "Exception", answer: "Exception", position: 0 }],
            explanation: "Custom exceptions must inherit from `Exception` or a subclass. `class InvalidSequenceError(Exception): pass` creates a new type you can `raise` and catch with `except InvalidSequenceError:`, keeping error handling precise.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m3-n1-e5",
            type: "code-complete",
            question: "Complete the function that validates a DNA sequence and raises a custom error if invalid bases are found.",
            hint: "🔬 TEACHING: Use `set(sequence)` to get the unique characters in the sequence. The `<=` operator checks if one set is a subset of another: `set('ATG') <= {'A','T','C','G'}` is True. If the sequence contains invalid characters, raise the custom exception with a descriptive message.",
            codeTemplate: `class InvalidSequenceError(Exception):
    pass

def validate_dna(sequence):
    valid_bases = {'A', 'T', 'C', 'G'}
    if not set(sequence) <= _____:
        _____ InvalidSequenceError(f'Invalid bases in: {sequence}')
    return True`,
            codeAnswer: `class InvalidSequenceError(Exception):
    pass

def validate_dna(sequence):
    valid_bases = {'A', 'T', 'C', 'G'}
    if not set(sequence) <= valid_bases:
        raise InvalidSequenceError(f'Invalid bases in: {sequence}')
    return True`,
            explanation: "`set(sequence) <= valid_bases` checks that every character is a valid base. If not, we `raise` our custom `InvalidSequenceError`. The caller can catch this specific type to handle invalid sequences appropriately.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m3-n1-e6",
            type: "debug-code",
            question: "This try/except catches too broadly and hides real errors. Fix it to only catch the expected exception.",
            hint: "🔬 TEACHING: Catching `Exception` or bare `except:` is usually bad practice — it catches every possible error including ones you didn't expect, masking real bugs. Always catch the most specific exception type you expect. For reading a file, catch `FileNotFoundError`, not all exceptions.",
            codeTemplate: `def read_sequence_file(filename):
    try:
        with open(filename) as f:
            return f.read()
    except Exception:
        return None`,
            bugLine: 5,
            bugFix: "    except FileNotFoundError:",
            explanation: "`except Exception:` catches everything, masking real bugs. `except FileNotFoundError:` only catches the expected case where the file doesn't exist. Other unexpected errors will now propagate properly instead of silently returning `None`.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-adv-m3-n2",
        moduleId: "l1-adv-m3",
        title: "File Operations",
        description: "Read, write, and process biological data files with Python",
        icon: "📂",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m3-n2-e1",
            type: "multiple-choice",
            question: "What does `open('data.txt', 'r')` return?",
            hint: "🔬 TEACHING: `open(filename, mode)` opens a file. Mode `'r'` = read (default), `'w'` = write (overwrites), `'a'` = append. It returns a file object — not the file's contents. You must then call methods on the file object (`.read()`, `.readline()`, `.readlines()`) to actually get data from it.",
            options: [
              "Creates a new file named data.txt",
              "Opens data.txt in read mode, returns a file object",
              "Reads all contents of data.txt and returns a string",
              "Deletes and recreates data.txt",
            ],
            correctIndex: 1,
            explanation: "`open('data.txt', 'r')` opens the file for reading and returns a file object. The file must exist or you get `FileNotFoundError`. Use the file object's methods to access contents.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m3-n2-e2",
            type: "multiple-choice",
            question: "Why is the `with` statement preferred when opening files?",
            hint: "🔬 TEACHING: The `with` statement (context manager) automatically closes the file when the block ends — even if an exception occurs. Without it, you must manually call `.close()`, and if an error occurs before that line, the file stays open, wasting resources or causing data corruption.",
            options: [
              "It reads files faster than open() directly",
              "It automatically closes the file when the block exits, even on errors",
              "It allows reading and writing simultaneously",
              "It is required for reading CSV files",
            ],
            correctIndex: 1,
            explanation: "The `with` statement ensures the file is always closed when you're done, even if an exception is raised. This prevents resource leaks and is the idiomatic Python way to handle files.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m3-n2-e3",
            type: "fill-blank",
            question: "To read all lines of an open file `f` into a list, call: lines = f._____",
            hint: "🔬 TEACHING: A file object has three main read methods: `.read()` returns the entire file as one string; `.readline()` reads one line at a time; `.readlines()` reads all lines and returns a list of strings. Each line string includes its trailing newline character `\\n`, which you can strip with `.strip()`.",
            blanks: [{ text: "readlines()", answer: "readlines()", position: 0 }],
            explanation: "`f.readlines()` reads all lines and returns them as a list. Each string includes the trailing `\\n`. For large files, iterating `for line in f:` is more memory-efficient.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m3-n2-e4",
            type: "fill-blank",
            question: "To read a CSV file robustly, import the _____ module and use its `reader()` or `DictReader()` function.",
            hint: "🔬 TEACHING: Python's built-in `csv` module handles reading and writing CSV files correctly, including edge cases like quoted fields containing commas. `csv.reader(file_object)` returns an iterator of lists. `csv.DictReader(file_object)` returns an iterator of dictionaries using the header row as keys.",
            blanks: [{ text: "csv", answer: "csv", position: 0 }],
            explanation: "The `csv` module is in Python's standard library. It correctly handles quoted fields, commas inside quotes, and other edge cases that manual string splitting would miss. `csv.DictReader` is especially convenient for tabular biological data.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m3-n2-e5",
            type: "code-complete",
            question: "Complete the FASTA parser that returns a dict mapping sequence names to sequences.",
            hint: "🔬 TEACHING: FASTA format: header lines start with `>` followed by the sequence name; subsequent lines are the sequence. Common pattern: if a line starts with `>`, it's a new sequence name (`line[1:]` strips the `>`); otherwise it's sequence data to accumulate. Strip whitespace from each line with `.strip()`.",
            codeTemplate: `def parse_fasta(filename):
    sequences = {}
    current_name = None
    with open(filename, _____) as f:
        for line in f:
            line = line.strip()
            if line.startswith('>'):
                current_name = line[1:]
                sequences[current_name] = ''
            elif current_name:
                sequences[_____] += line
    return sequences`,
            codeAnswer: `def parse_fasta(filename):
    sequences = {}
    current_name = None
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('>'):
                current_name = line[1:]
                sequences[current_name] = ''
            elif current_name:
                sequences[current_name] += line
    return sequences`,
            explanation: "Opening with `'r'` reads text. `line.startswith('>')` detects FASTA headers — `line[1:]` strips the `>`. Sequence lines are accumulated into the dictionary. This handles multi-line sequences and is the foundation of real bioinformatics file parsing.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m3-n2-e6",
            type: "debug-code",
            question: "This code tries to write results to a file but fails with a 'not writable' error. Fix it.",
            hint: "🔬 TEACHING: File opening modes matter: `'r'` = read only (default), `'w'` = write (creates or overwrites), `'a'` = append. Opening a file in `'r'` mode then calling `.write()` raises `io.UnsupportedOperation: not writable`. Use `'w'` to write a new file or `'a'` to append to an existing one.",
            codeTemplate: `results = ['BRCA1: HIGH', 'TP53: MEDIUM', 'MYC: LOW']

with open('results.txt', 'r') as f:
    for result in results:
        f.write(result + '\\n')`,
            bugLine: 3,
            bugFix: "with open('results.txt', 'w') as f:",
            explanation: "Opening with `'r'` makes the file read-only. Calling `.write()` raises `io.UnsupportedOperation`. Change `'r'` to `'w'` to open for writing. Use `'a'` to append without overwriting existing content.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-adv-m3-n3",
        moduleId: "l1-adv-m3",
        title: "List Comprehensions",
        description: "Write concise list, dict, and set comprehensions and generator expressions",
        icon: "📋",
        xpReward: 120,
        exercises: [
          {
            id: "l1-adv-m3-n3-e1",
            type: "multiple-choice",
            question: "What is the output of: `[x**2 for x in range(4)]`?",
            hint: "🔬 TEACHING: A list comprehension creates a new list by applying an expression to each element of an iterable. Syntax: `[expression for item in iterable]`. `range(4)` generates 0, 1, 2, 3. `x**2` squares each value. This is equivalent to a for-loop that appends to a list, but more concise.",
            options: ["[1, 4, 9, 16]", "[0, 1, 4, 9]", "[0, 1, 2, 3]", "[1, 2, 3, 4]"],
            correctIndex: 1,
            explanation: "`range(4)` produces 0, 1, 2, 3. Squaring each: 0²=0, 1²=1, 2²=4, 3²=9. Result: `[0, 1, 4, 9]`.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m3-n3-e2",
            type: "multiple-choice",
            question: "What is the key difference between `[x for x in data]` and `(x for x in data)`?",
            hint: "🔬 TEACHING: A list comprehension (with `[]`) creates the entire list in memory at once. A generator expression (with `()`) creates a lazy iterator that produces values one at a time on demand. For large biological datasets with millions of sequences, generators save significant memory.",
            options: [
              "List comprehensions are faster; generators are slower",
              "Generator expressions create a lazy iterator (memory efficient); list comprehensions build the entire list in memory",
              "They are identical — just different syntax",
              "Generators can only be used with numbers",
            ],
            correctIndex: 1,
            explanation: "A list comprehension stores all values in memory at once. A generator expression yields values lazily, one at a time, using far less memory. Use generators when processing large files or datasets.",
            xpReward: 15,
          },
          {
            id: "l1-adv-m3-n3-e3",
            type: "fill-blank",
            question: "Complete the dict comprehension: gene_lengths = {gene: _____(gene) for gene in gene_list}",
            hint: "🔬 TEACHING: A dictionary comprehension creates a dict using `{key: value for item in iterable}`. To map each gene name to its character count, use `len(gene)` as the value. Example: `{g: len(g) for g in ['BRCA1', 'TP53']}` produces `{'BRCA1': 5, 'TP53': 4}`.",
            blanks: [{ text: "len", answer: "len", position: 0 }],
            explanation: "`len(gene)` returns the number of characters in the gene name string. The dict comprehension creates a dictionary where each gene name maps to its character count.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m3-n3-e4",
            type: "fill-blank",
            question: "Complete to get unique chromosomes from locations: chromosomes = {_____.split(':')[0] for loc in locations}",
            hint: "🔬 TEACHING: A set comprehension creates a set (unique values only) using `{expression for item in iterable}`. If `locations = ['chr1:1000', 'chr2:5000', 'chr1:8000']`, the set comprehension extracts chromosome names with `.split(':')[0]`, and the set `{}` automatically deduplicates them.",
            blanks: [{ text: "loc", answer: "loc", position: 0 }],
            explanation: "`loc.split(':')[0]` splits at the colon and takes the chromosome name. Using `{}` creates a set, which automatically removes duplicates. Perfect for finding unique chromosomes in genomic data.",
            xpReward: 20,
          },
          {
            id: "l1-adv-m3-n3-e5",
            type: "code-complete",
            question: "Complete the function that extracts codons (groups of 3 bases) from a DNA sequence.",
            hint: "🔬 TEACHING: A codon is a group of 3 DNA bases that codes for an amino acid. To extract codons, slice the sequence at intervals of 3: `sequence[i:i+3]`. Use `range(0, len(sequence), 3)` to step through by 3s. This is how codon tables are built in real bioinformatics!",
            codeTemplate: `def get_codons(dna):
    return [dna[i:i+_____] for i in range(0, len(dna), _____)]

# get_codons('ATGGCCTAT') should return ['ATG', 'GCC', 'TAT']`,
            codeAnswer: `def get_codons(dna):
    return [dna[i:i+3] for i in range(0, len(dna), 3)]

# get_codons('ATGGCCTAT') should return ['ATG', 'GCC', 'TAT']`,
            explanation: "`range(0, len(dna), 3)` generates indices 0, 3, 6, 9... stepping by 3 (codon length). `dna[i:i+3]` slices 3 bases at each position. This is the standard bioinformatics pattern for codon extraction.",
            xpReward: 25,
          },
          {
            id: "l1-adv-m3-n3-e6",
            type: "debug-code",
            question: "This filtered list comprehension has a syntax error — the `if` clause is in the wrong place. Fix it.",
            hint: "🔬 TEACHING: A filtered list comprehension uses `[expression for item in iterable if condition]` — the `if` clause goes at the END, after the `for` clause, not before it. Example: `[g for g in genes if g[1] > 5.0]` keeps only genes with expression > 5.0. Putting `if` before `for` is a SyntaxError.",
            codeTemplate: `gene_data = [('BRCA1', 8.5), ('TP53', 2.1), ('MYC', 9.3), ('EGFR', 1.5)]
high_expr = [gene if gene[1] > 5.0 for gene in gene_data]`,
            bugLine: 2,
            bugFix: "high_expr = [gene for gene in gene_data if gene[1] > 5.0]",
            explanation: "The filter `if` clause must come after the `for` clause: `[expr for item in iterable if condition]`. Having `if gene[1] > 5.0` before `for gene in gene_data` is a SyntaxError.",
            xpReward: 25,
          },
        ],
      },
    ],
  },
];

export default modules;
