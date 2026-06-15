import type { Module } from "@/lib/types";

const level1Modules: Module[] = [
  {
    id: "l1-m1",
    title: "What Even Is Biology?",
    description: "The cell as the unit of life — inside the cytoplasm",
    realm: 1,
    color: "#39ff14",
    nodes: [
      {
        id: "l1-m1-n1",
        moduleId: "l1-m1",
        title: "The Cell: Life's Basic Unit",
        description: "Every living thing is made of cells",
        icon: "🔬",
        xpReward: 100,
        exercises: [
          {
            id: "l1-m1-n1-e1",
            type: "multiple-choice",
            question: "What is the basic unit of all living things?",
            options: ["Atom", "Cell", "Organ", "Molecule"],
            correctIndex: 1,
            explanation: "The cell is the smallest unit capable of carrying out life processes — metabolism, reproduction, and response to the environment.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n1-e2",
            type: "multiple-choice",
            question: "Which of these is NOT a characteristic of living things?",
            options: ["Growth", "Reproduction", "Rusting", "Response to environment"],
            correctIndex: 2,
            explanation: "Rusting is a chemical reaction, not a property of life. All living things grow, reproduce, and respond to their environment.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n1-e3",
            type: "drag-drop",
            question: "Match each organelle to its function",
            pairs: [
              { left: "Nucleus", right: "Contains DNA — the cell's instruction manual" },
              { left: "Mitochondria", right: "Produces energy (ATP) — the powerhouse" },
              { left: "Ribosome", right: "Makes proteins from RNA instructions" },
              { left: "Cell membrane", right: "Controls what enters and exits the cell" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m1-n1-e4",
            type: "fill-blank",
            question: "Complete the sentence: The nucleus contains the cell's _____, which holds all the genetic information.",
            blanks: [{ text: "DNA", answer: "DNA", position: 0 }],
            explanation: "DNA (deoxyribonucleic acid) is stored in the nucleus and contains all the instructions for building and running the cell.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n1-e5",
            type: "tap-correct",
            question: "Tap ALL the organelles that are found in eukaryotic cells:",
            options: ["Nucleus", "Mitochondria", "Cell Wall (in plant cells)", "Ribosome", "Chloroplast (in plant cells)", "Nucleoid"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "Nucleoid is found in prokaryotes only. All others can be found in eukaryotes (some plant-specific).",
            xpReward: 15,
          },
          {
            id: "l1-m1-n1-e6",
            type: "multiple-choice",
            question: "Elliot says the mitochondria is 'overrated, honestly.' But what does it actually do?",
            options: [
              "Stores water for the cell",
              "Makes proteins by reading mRNA",
              "Produces ATP through cellular respiration",
              "Digests old cell components",
            ],
            correctIndex: 2,
            explanation: "Mitochondria convert glucose + oxygen into ATP energy through cellular respiration. Elliot's opinion is not scientifically supported.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n1-e7",
            type: "sequence-order",
            question: "Put these in order from SMALLEST to LARGEST:",
            items: ["Atom", "Molecule", "Organelle", "Cell", "Tissue", "Organ", "Organism"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            xpReward: 20,
          },
          {
            id: "l1-m1-n1-e8",
            type: "free-text",
            question: "In your own words: why is the cell called the 'basic unit of life'? What makes it different from just a collection of molecules?",
            rubric: ["mentions self-replication or reproduction", "mentions metabolism or energy use", "mentions autonomous function"],
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-m1-n2",
        moduleId: "l1-m1",
        title: "Prokaryotes vs. Eukaryotes",
        description: "Two fundamental types of cells and what makes them different",
        icon: "🧫",
        xpReward: 100,
        exercises: [
          {
            id: "l1-m1-n2-e1",
            type: "multiple-choice",
            question: "What is the KEY difference between a prokaryotic and eukaryotic cell?",
            options: [
              "Eukaryotes are always bigger",
              "Prokaryotes have no DNA",
              "Eukaryotes have a membrane-bound nucleus; prokaryotes do not",
              "Prokaryotes can't reproduce",
            ],
            correctIndex: 2,
            explanation: "The defining feature: eukaryotes have DNA enclosed in a nucleus. Prokaryotes have DNA in a nucleoid region without a membrane.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n2-e2",
            type: "drag-drop",
            question: "Sort these into Prokaryote or Eukaryote:",
            pairs: [
              { left: "Bacteria", right: "Prokaryote" },
              { left: "Human liver cell", right: "Eukaryote" },
              { left: "Archaea", right: "Prokaryote" },
              { left: "Yeast", right: "Eukaryote" },
              { left: "Plant cell", right: "Eukaryote" },
              { left: "E. coli", right: "Prokaryote" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m1-n2-e3",
            type: "multiple-choice",
            question: "Which of these is ONLY found in eukaryotic cells?",
            options: ["Ribosomes", "DNA", "Cell membrane", "Mitochondria"],
            correctIndex: 3,
            explanation: "Mitochondria are only in eukaryotes. Ribosomes, DNA, and cell membranes exist in both types.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n2-e4",
            type: "fill-blank",
            question: "Bacteria are _____ cells, while animal cells are _____ cells.",
            blanks: [
              { text: "prokaryotic", answer: "prokaryotic", position: 0 },
              { text: "eukaryotic", answer: "eukaryotic", position: 1 },
            ],
            xpReward: 15,
          },
          {
            id: "l1-m1-n2-e5",
            type: "multiple-choice",
            question: "The endosymbiotic theory proposes that mitochondria were once:",
            options: ["Made by the nucleus", "Free-living prokaryotes absorbed by larger cells", "Formed from the cell membrane", "Created during cell division"],
            correctIndex: 1,
            explanation: "Mitochondria were likely once free-living bacteria that were engulfed by larger cells — they still have their own circular DNA!",
            xpReward: 15,
          },
          {
            id: "l1-m1-n2-e6",
            type: "free-text",
            question: "Elliot lives inside a eukaryotic cell. What THREE organelles would he see floating around him in the cytoplasm?",
            rubric: ["names valid eukaryotic organelles", "describes at least one function", "at least 3 organelles mentioned"],
            xpReward: 20,
          },
        ],
      },
      {
        id: "l1-m1-n3",
        moduleId: "l1-m1",
        title: "DNA: The Instruction Manual",
        description: "What DNA is and why it matters",
        icon: "🧬",
        xpReward: 120,
        exercises: [
          {
            id: "l1-m1-n3-e1",
            type: "multiple-choice",
            question: "What does DNA stand for?",
            options: [
              "Deoxyribonucleic acid",
              "Diribonucleic acid",
              "Double-stranded nucleic arrangement",
              "Dynamic nucleotide array",
            ],
            correctIndex: 0,
            explanation: "DNA = Deoxyribonucleic acid. The 'deoxy' refers to the sugar (deoxyribose) that doesn't have an oxygen atom that RNA's ribose does.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n3-e2",
            type: "drag-drop",
            question: "Match the DNA base pairs (they always pair with their partner):",
            pairs: [
              { left: "Adenine (A)", right: "Thymine (T)" },
              { left: "Guanine (G)", right: "Cytosine (C)" },
              { left: "Thymine (T)", right: "Adenine (A)" },
              { left: "Cytosine (C)", right: "Guanine (G)" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m1-n3-e3",
            type: "fill-blank",
            question: "DNA has a _____ helix structure, with two strands wound around each other.",
            blanks: [{ text: "double", answer: "double", position: 0 }],
            xpReward: 10,
          },
          {
            id: "l1-m1-n3-e4",
            type: "multiple-choice",
            question: "If one strand of DNA reads 5'-ATCG-3', what does the complementary strand read (in 3' to 5' direction)?",
            options: ["ATCG", "TAGC", "UAGC", "CGAT"],
            correctIndex: 1,
            explanation: "A pairs with T, T pairs with A, C pairs with G, G pairs with C → TAGC. (In RNA, T becomes U.)",
            xpReward: 15,
          },
          {
            id: "l1-m1-n3-e5",
            type: "sequence-order",
            question: "Put these levels of DNA organization in order from SMALLEST to LARGEST:",
            items: ["Nucleotide", "Gene", "Chromosome", "Genome", "DNA double helix"],
            correctOrder: [0, 4, 1, 2, 3],
            xpReward: 20,
          },
          {
            id: "l1-m1-n3-e6",
            type: "multiple-choice",
            question: "How many base pairs are in the human genome (approximately)?",
            options: ["3 thousand", "3 million", "3 billion", "3 trillion"],
            correctIndex: 2,
            explanation: "The human genome has ~3.2 billion base pairs. If stretched out, it would be about 2 meters long — packed into a nucleus 6 micrometers across.",
            xpReward: 10,
          },
          {
            id: "l1-m1-n3-e7",
            type: "free-text",
            question: "Explain DNA using the analogy of a recipe book. What is the 'book', what are the 'chapters', and what are the 'recipes'?",
            rubric: ["genome = book", "chromosomes = chapters", "genes = recipes/instructions"],
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m2",
    title: "The Language of Life",
    description: "Molecular biology basics — from DNA to protein",
    realm: 1,
    color: "#00ff88",
    nodes: [
      {
        id: "l1-m2-n1",
        moduleId: "l1-m2",
        title: "The Central Dogma",
        description: "DNA → RNA → Protein: life's information highway",
        icon: "➡️",
        xpReward: 130,
        exercises: [
          {
            id: "l1-m2-n1-e1",
            type: "sequence-order",
            question: "Arrange the Central Dogma in the correct order:",
            items: ["DNA", "Protein", "RNA", "Function"],
            correctOrder: [0, 2, 1, 3],
            xpReward: 15,
          },
          {
            id: "l1-m2-n1-e2",
            type: "multiple-choice",
            question: "What process converts DNA into RNA?",
            options: ["Translation", "Transcription", "Replication", "Transduction"],
            correctIndex: 1,
            explanation: "Transcription is the process where the DNA template is read by RNA polymerase to create a messenger RNA (mRNA) copy.",
            xpReward: 10,
          },
          {
            id: "l1-m2-n1-e3",
            type: "multiple-choice",
            question: "What process converts RNA into protein?",
            options: ["Transcription", "Replication", "Translation", "Transduction"],
            correctIndex: 2,
            explanation: "Translation occurs at the ribosome — the mRNA code is read three nucleotides at a time (codons), and amino acids are added accordingly.",
            xpReward: 10,
          },
          {
            id: "l1-m2-n1-e4",
            type: "drag-drop",
            question: "Match each molecule to its role:",
            pairs: [
              { left: "DNA", right: "Master blueprint — stored in nucleus, rarely leaves" },
              { left: "mRNA", right: "Working copy — carries instructions to the ribosome" },
              { left: "tRNA", right: "Adapter — brings the right amino acid to the ribosome" },
              { left: "Protein", right: "The final product — does most of the work in the cell" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m2-n1-e5",
            type: "multiple-choice",
            question: "In RNA, which base replaces Thymine?",
            options: ["Adenine", "Guanine", "Uracil", "Cytosine"],
            correctIndex: 2,
            explanation: "RNA uses Uracil (U) where DNA uses Thymine (T). So A pairs with U in RNA instead of A-T.",
            xpReward: 10,
          },
          {
            id: "l1-m2-n1-e6",
            type: "fill-blank",
            question: "A sequence of 3 nucleotides in mRNA that codes for one amino acid is called a _____.",
            blanks: [{ text: "codon", answer: "codon", position: 0 }],
            explanation: "Each codon is a 3-letter code. There are 64 possible codons coding for 20 amino acids (plus start and stop signals).",
            xpReward: 10,
          },
          {
            id: "l1-m2-n1-e7",
            type: "multiple-choice",
            question: "What does the stop codon do during translation?",
            options: [
              "Speeds up protein production",
              "Signals the ribosome to pause",
              "Terminates translation — the protein chain is released",
              "Adds a final amino acid",
            ],
            correctIndex: 2,
            explanation: "Stop codons (UAA, UAG, UGA) signal that the protein is complete. No amino acid is added — the ribosome releases the finished polypeptide.",
            xpReward: 10,
          },
          {
            id: "l1-m2-n1-e8",
            type: "free-text",
            question: "Describe what would happen to a cell if its ribosomes stopped working. Use the Central Dogma to explain your reasoning.",
            rubric: ["mentions proteins cannot be made", "explains downstream effects on cell function", "connects to Central Dogma flow"],
            xpReward: 25,
          },
        ],
      },
      {
        id: "l1-m2-n2",
        moduleId: "l1-m2",
        title: "Genes and Genomes",
        description: "What a gene is and what the genome contains",
        icon: "📖",
        xpReward: 110,
        exercises: [
          {
            id: "l1-m2-n2-e1",
            type: "multiple-choice",
            question: "A gene is best described as:",
            options: [
              "All the DNA in a cell",
              "A segment of DNA that codes for a functional product (usually a protein)",
              "A single nucleotide in the genome",
              "A chromosome",
            ],
            correctIndex: 1,
            explanation: "A gene is a discrete segment of DNA with the information to produce a functional molecule, typically a protein.",
            xpReward: 10,
          },
          {
            id: "l1-m2-n2-e2",
            type: "multiple-choice",
            question: "Approximately what percentage of the human genome codes for proteins?",
            options: ["~2%", "~25%", "~50%", "~98%"],
            correctIndex: 0,
            explanation: "Only ~1.5-2% of the human genome codes for proteins! The rest includes regulatory regions, introns, repeat elements, and sequences we're still studying.",
            xpReward: 15,
          },
          {
            id: "l1-m2-n2-e3",
            type: "drag-drop",
            question: "Match the genomic term to its definition:",
            pairs: [
              { left: "Exon", right: "Coding sequence — included in the final mRNA" },
              { left: "Intron", right: "Non-coding sequence — spliced out before translation" },
              { left: "Promoter", right: "Regulatory sequence where transcription begins" },
              { left: "Allele", right: "Alternative version of a gene at the same locus" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m2-n2-e4",
            type: "multiple-choice",
            question: "Humans have approximately how many protein-coding genes?",
            options: ["~1,000", "~20,000", "~3 million", "~3 billion"],
            correctIndex: 1,
            explanation: "Humans have ~20,000-25,000 protein-coding genes — fewer than a water flea! The complexity comes from how genes are regulated and proteins are modified.",
            xpReward: 10,
          },
          {
            id: "l1-m2-n2-e5",
            type: "fill-blank",
            question: "The complete set of genetic information in an organism is called its _____.",
            blanks: [{ text: "genome", answer: "genome", position: 0 }],
            xpReward: 10,
          },
          {
            id: "l1-m2-n2-e6",
            type: "multiple-choice",
            question: "Why do cells in your liver and your skin have the same DNA but do different things?",
            options: [
              "They don't have the same DNA",
              "Different genes are expressed in different cell types",
              "Liver cells have more DNA",
              "The DNA mutates differently in each tissue",
            ],
            correctIndex: 1,
            explanation: "Gene expression is regulated! Every cell has the full genome, but different sets of genes are switched on or off depending on the cell type and environment.",
            xpReward: 15,
          },
        ],
      },
      {
        id: "l1-m2-n3",
        moduleId: "l1-m2",
        title: "Mutations: When the Code Changes",
        description: "Types of mutations and why they matter",
        icon: "⚡",
        xpReward: 120,
        exercises: [
          {
            id: "l1-m2-n3-e1",
            type: "multiple-choice",
            question: "A mutation where one nucleotide is swapped for another is called a:",
            options: ["Insertion", "Deletion", "Substitution (point mutation)", "Frameshift"],
            correctIndex: 2,
            explanation: "A substitution replaces one base with another. This can be silent (no amino acid change), missense (different amino acid), or nonsense (creates a stop codon).",
            xpReward: 10,
          },
          {
            id: "l1-m2-n3-e2",
            type: "multiple-choice",
            question: "Elliot mentions 'missense mutations.' What makes them 'missense'?",
            options: [
              "They are nonsensical — they do nothing",
              "They insert an extra nucleotide",
              "They change the codon to one coding for a DIFFERENT amino acid",
              "They create a premature stop codon",
            ],
            correctIndex: 2,
            explanation: "A missense mutation changes the amino acid sequence — the message is 'mis-read.' The protein may still fold, but with different properties.",
            xpReward: 10,
          },
          {
            id: "l1-m2-n3-e3",
            type: "drag-drop",
            question: "Match the mutation type to its definition:",
            pairs: [
              { left: "Silent", right: "Base changes but amino acid stays the same (different codon, same meaning)" },
              { left: "Missense", right: "Base changes and a DIFFERENT amino acid is encoded" },
              { left: "Nonsense", right: "Mutation creates a premature STOP codon — protein cut short" },
              { left: "Frameshift", right: "Insertion or deletion shifts the entire reading frame downstream" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m2-n3-e4",
            type: "multiple-choice",
            question: "Which mutation type is MOST likely to completely destroy a protein's function?",
            options: ["Silent mutation", "Conservative missense", "Frameshift at position 2", "Synonymous substitution"],
            correctIndex: 2,
            explanation: "A frameshift near the beginning changes EVERY codon downstream — the entire protein sequence is scrambled. Silent and conservative mutations often have minimal effect.",
            xpReward: 15,
          },
          {
            id: "l1-m2-n3-e5",
            type: "fill-blank",
            question: "The genetic condition sickle cell disease is caused by a single _____ mutation in the hemoglobin gene.",
            blanks: [{ text: "missense", answer: "missense", position: 0 }],
            explanation: "Sickle cell disease is caused by a single A→T substitution in codon 6 of the hemoglobin beta gene (Glu→Val). One nucleotide change, life-altering effect.",
            xpReward: 15,
          },
          {
            id: "l1-m2-n3-e6",
            type: "free-text",
            question: "Are all mutations harmful? Give an example of a mutation that could be neutral or even beneficial.",
            rubric: ["acknowledges not all mutations are harmful", "gives a plausible neutral/beneficial example", "mentions evolution or adaptation"],
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m3",
    title: "Introduction to Coding",
    description: "Python from absolute zero — through biological metaphors",
    realm: 1,
    color: "#f59e0b",
    nodes: [
      {
        id: "l1-m3-n1",
        moduleId: "l1-m3",
        title: "Variables: Naming Your Data",
        description: "Variables, data types, and why they matter in biology",
        icon: "📦",
        xpReward: 130,
        exercises: [
          {
            id: "l1-m3-n1-e1",
            type: "multiple-choice",
            question: "In Python, what is a variable?",
            options: [
              "A type of loop",
              "A named container that stores a value",
              "A function that takes arguments",
              "A special kind of number",
            ],
            correctIndex: 1,
            explanation: "A variable is a label that points to a value in memory. Like a gene name that refers to a specific DNA sequence.",
            xpReward: 10,
          },
          {
            id: "l1-m3-n1-e2",
            type: "code-complete",
            question: "Create a variable called `gene_name` and assign it the string value 'BRCA1':",
            codeTemplate: "# Assign BRCA1 to a variable\ngene_name = ___",
            codeAnswer: 'gene_name = "BRCA1"',
            xpReward: 15,
          },
          {
            id: "l1-m3-n1-e3",
            type: "multiple-choice",
            question: "What data type is `sequence = 'ATCGATCG'`?",
            options: ["int", "float", "str", "bool"],
            correctIndex: 2,
            explanation: "Text in quotes is a string (str) in Python. DNA sequences are always strings — even though they look like letters, Python treats them as text.",
            xpReward: 10,
          },
          {
            id: "l1-m3-n1-e4",
            type: "drag-drop",
            question: "Match each Python value to its data type:",
            pairs: [
              { left: "42", right: "int (integer)" },
              { left: "'ATCG'", right: "str (string)" },
              { left: "3.14", right: "float (decimal number)" },
              { left: "True", right: "bool (boolean — True or False)" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m3-n1-e5",
            type: "debug-code",
            question: "This code has a bug — find and fix it:",
            codeTemplate: `gene_count = 23
chromosome_name = Chromosome1
print(gene_count)`,
            bugLine: 1,
            bugFix: 'chromosome_name = "Chromosome1"',
            explanation: "Strings need quotes! Without quotes, Python thinks 'Chromosome1' is a variable name — which doesn't exist yet.",
            xpReward: 20,
          },
          {
            id: "l1-m3-n1-e6",
            type: "fill-blank",
            question: "The Python function _____ displays output to the screen.",
            blanks: [{ text: "print()", answer: "print", position: 0 }],
            xpReward: 10,
          },
          {
            id: "l1-m3-n1-e7",
            type: "code-complete",
            question: "Write code to print the length (number of characters) in a DNA sequence:",
            codeTemplate: `sequence = "ATCGATCG"
# Print the length of sequence
print(___(sequence))`,
            codeAnswer: "print(len(sequence))",
            explanation: "len() returns the number of items in a sequence. For a string, that's the number of characters.",
            xpReward: 15,
          },
          {
            id: "l1-m3-n1-e8",
            type: "multiple-choice",
            question: "What does this code output? `x = 5; y = 3; print(x + y)`",
            options: ["x + y", "53", "8", "Error"],
            correctIndex: 2,
            explanation: "When + is used with numbers, it adds them. When used with strings, it concatenates. 5 + 3 = 8.",
            xpReward: 10,
          },
        ],
      },
      {
        id: "l1-m3-n2",
        moduleId: "l1-m3",
        title: "Control Flow: The Cell Decides",
        description: "If/else and loops — how programs make decisions",
        icon: "🔀",
        xpReward: 150,
        exercises: [
          {
            id: "l1-m3-n2-e1",
            type: "multiple-choice",
            question: "Which keyword starts a conditional statement in Python?",
            options: ["when", "if", "check", "condition"],
            correctIndex: 1,
            explanation: "Python uses 'if', 'elif', and 'else' for conditionals — the cell uses checkpoints to 'decide' whether to divide.",
            xpReward: 10,
          },
          {
            id: "l1-m3-n2-e2",
            type: "code-complete",
            question: "Complete this code so it prints 'Divide!' if dna_damage is 0, else prints 'Halt!':",
            codeTemplate: `dna_damage = 0
___ dna_damage == 0:
    print("Divide!")
___:
    print("Halt!")`,
            codeAnswer: `if dna_damage == 0:
    print("Divide!")
else:
    print("Halt!")`,
            xpReward: 20,
          },
          {
            id: "l1-m3-n2-e3",
            type: "multiple-choice",
            question: "What does a for loop do?",
            options: [
              "Repeats indefinitely until stopped",
              "Iterates over each item in a sequence, one at a time",
              "Only runs if a condition is True",
              "Defines a function",
            ],
            correctIndex: 1,
            explanation: "A for loop iterates — like reading each nucleotide in a DNA sequence one by one.",
            xpReward: 10,
          },
          {
            id: "l1-m3-n2-e4",
            type: "code-complete",
            question: "Write a for loop that prints each nucleotide in the sequence:",
            codeTemplate: `sequence = "ATCG"
___ nucleotide ___ sequence:
    print(nucleotide)`,
            codeAnswer: `for nucleotide in sequence:
    print(nucleotide)`,
            xpReward: 15,
          },
          {
            id: "l1-m3-n2-e5",
            type: "multiple-choice",
            question: "What will this code print?\n```python\ncount = 0\nfor base in 'AATCG':\n    if base == 'A':\n        count += 1\nprint(count)\n```",
            options: ["1", "2", "AATCG", "5"],
            correctIndex: 1,
            explanation: "The loop counts how many 'A's are in 'AATCG' — there are 2.",
            xpReward: 15,
          },
          {
            id: "l1-m3-n2-e6",
            type: "debug-code",
            question: "Find the bug in this GC content calculator:",
            codeTemplate: `sequence = "ATCGCG"
gc_count = 0
for base in sequence:
    if base == "G" or base == "C":
        gc_count + 1
print(gc_count)`,
            bugLine: 4,
            bugFix: "        gc_count += 1",
            explanation: "`gc_count + 1` computes the sum but doesn't save it! You need `gc_count += 1` (shorthand for `gc_count = gc_count + 1`).",
            xpReward: 20,
          },
          {
            id: "l1-m3-n2-e7",
            type: "code-complete",
            question: "Write a function that counts how many times a given base appears in a sequence:",
            codeTemplate: `def count_base(sequence, base):
    count = 0
    for nucleotide in sequence:
        ___ nucleotide == base:
            count ___ 1
    return count

# Test it:
print(count_base("AATCGAA", "A"))  # Should print 4`,
            codeAnswer: `def count_base(sequence, base):
    count = 0
    for nucleotide in sequence:
        if nucleotide == base:
            count += 1
    return count`,
            xpReward: 25,
          },
          {
            id: "l1-m3-n2-e8",
            type: "free-text",
            question: "Describe a biological process that is like a while loop — something that keeps repeating as long as a condition is true.",
            rubric: ["describes repetition", "identifies a stopping condition", "connects to real biology"],
            xpReward: 20,
          },
        ],
      },
      {
        id: "l1-m3-n3",
        moduleId: "l1-m3",
        title: "Functions: The Enzymes of Code",
        description: "Functions take inputs, do something specific, and return outputs",
        icon: "⚙️",
        xpReward: 150,
        exercises: [
          {
            id: "l1-m3-n3-e1",
            type: "multiple-choice",
            question: "Which keyword defines a function in Python?",
            options: ["function", "define", "def", "func"],
            correctIndex: 2,
            explanation: "In Python, functions are defined with the 'def' keyword followed by the function name and parentheses.",
            xpReward: 10,
          },
          {
            id: "l1-m3-n3-e2",
            type: "code-complete",
            question: "Complete this function that returns the GC content (% of G+C bases) of a sequence:",
            codeTemplate: `def gc_content(sequence):
    gc = 0
    for base in sequence:
        if base in ['G', 'C']:
            gc += 1
    ___ gc / len(sequence) * 100

print(gc_content("ATCGCG"))  # Should print 66.666...`,
            codeAnswer: "    return gc / len(sequence) * 100",
            xpReward: 20,
          },
          {
            id: "l1-m3-n3-e3",
            type: "multiple-choice",
            question: "What is a 'parameter' in a function?",
            options: [
              "The result that the function produces",
              "The name of the function",
              "A variable that receives input values when the function is called",
              "A comment inside the function",
            ],
            correctIndex: 2,
            explanation: "Parameters are the inputs a function accepts. When you call the function, you pass 'arguments' which become the parameter values.",
            xpReward: 10,
          },
          {
            id: "l1-m3-n3-e4",
            type: "debug-code",
            question: "This complement function has a bug:",
            codeTemplate: `def complement(sequence):
    comp = ""
    for base in sequence:
        if base == "A":
            comp += "T"
        elif base == "T":
            comp += "A"
        elif base == "G":
            comp += "G"
        elif base == "C":
            comp += "G"
    return comp

print(complement("ATCG"))  # Should print TAGC`,
            bugLine: 8,
            bugFix: '            comp += "G"  # C should pair with G, but the elif for C was wrong - should be comp += "G"... wait, C pairs with G. The bug is base == "G" adding "G" instead of "C"',
            explanation: "Line with `elif base == 'G': comp += 'G'` is wrong! G pairs with C. Should be `comp += 'C'`. Also the C handler should be `comp += 'G'`.",
            xpReward: 20,
          },
          {
            id: "l1-m3-n3-e5",
            type: "code-complete",
            question: "Write a function `reverse_complement` that returns the reverse complement of a DNA sequence (complement read backwards):",
            codeTemplate: `def reverse_complement(seq):
    complement_map = {'A':'T', 'T':'A', 'G':'C', 'C':'G'}
    comp = ""
    for base in seq:
        comp += complement_map[base]
    return ___

print(reverse_complement("ATCG"))  # Should print: CGAT`,
            codeAnswer: "    return comp[::-1]",
            explanation: "`comp[::-1]` reverses a string in Python using slice notation. `[::-1]` means: start at end, go backwards.",
            xpReward: 25,
          },
          {
            id: "l1-m3-n3-e6",
            type: "free-text",
            question: "Why is it useful to write a function instead of just writing the same code over and over? Use a biology analogy in your answer.",
            rubric: ["mentions reusability", "mentions avoiding repetition", "biology analogy is reasonable"],
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m4",
    title: "Data Structures Through Biology",
    description: "Lists, dictionaries, and arrays — through molecular biology",
    realm: 1,
    color: "#a855f7",
    nodes: [
      {
        id: "l1-m4-n1",
        moduleId: "l1-m4",
        title: "Lists: DNA as a Sequence",
        description: "Ordered collections — like nucleotides on a strand",
        icon: "📋",
        xpReward: 140,
        exercises: [
          {
            id: "l1-m4-n1-e1",
            type: "multiple-choice",
            question: "Which of these creates a list in Python?",
            options: ["`bases = ('A', 'T', 'G', 'C')`", "`bases = {'A', 'T', 'G', 'C'}`", "`bases = ['A', 'T', 'G', 'C']`", "`bases = 'ATGC'`"],
            correctIndex: 2,
            explanation: "Lists use square brackets []. Parentheses () make tuples. Curly braces {} make sets or dicts. Quotes make strings.",
            xpReward: 10,
          },
          {
            id: "l1-m4-n1-e2",
            type: "code-complete",
            question: "Add 'A' to the end of this nucleotides list:",
            codeTemplate: `nucleotides = ['T', 'G', 'C']
nucleotides.___('A')
print(nucleotides)  # ['T', 'G', 'C', 'A']`,
            codeAnswer: "nucleotides.append('A')",
            xpReward: 10,
          },
          {
            id: "l1-m4-n1-e3",
            type: "multiple-choice",
            question: "What does `sequence[0]` return for `sequence = ['A','T','C','G']`?",
            options: ["T", "A", "4", "Error"],
            correctIndex: 1,
            explanation: "Python uses 0-based indexing. The first element is at index 0, so `sequence[0]` returns 'A'.",
            xpReward: 10,
          },
          {
            id: "l1-m4-n1-e4",
            type: "code-complete",
            question: "Split a DNA string into a list of codons (3-letter groups):",
            codeTemplate: `sequence = "ATCGATCGAT"
codons = []
for i in range(0, len(sequence), ___):
    codons.append(sequence[i:i+3])
print(codons)  # ['ATC', 'GAT', 'CGA', 'T']`,
            codeAnswer: "for i in range(0, len(sequence), 3):",
            xpReward: 20,
          },
          {
            id: "l1-m4-n1-e5",
            type: "multiple-choice",
            question: "What is list comprehension? `[x*2 for x in [1,2,3]]`",
            options: [
              "A way to define a function",
              "A compact way to create a list from another sequence",
              "A type of loop that runs backwards",
              "A way to sort a list",
            ],
            correctIndex: 1,
            explanation: "List comprehension creates a new list by applying an expression to each element. This produces [2, 4, 6].",
            xpReward: 15,
          },
          {
            id: "l1-m4-n1-e6",
            type: "free-text",
            question: "A DNA sequence is a string, but scientists often work with it as a list. What are the advantages of having a list of nucleotides instead of a string?",
            rubric: ["mentions mutability (strings are immutable)", "mentions easier manipulation of individual elements", "provides a practical example"],
            xpReward: 20,
          },
        ],
      },
      {
        id: "l1-m4-n2",
        moduleId: "l1-m4",
        title: "Dictionaries: The Codon Table",
        description: "Key-value pairs — like a codon-to-amino-acid lookup",
        icon: "📚",
        xpReward: 150,
        exercises: [
          {
            id: "l1-m4-n2-e1",
            type: "multiple-choice",
            question: "A Python dictionary stores data as:",
            options: ["Ordered numbers", "Key-value pairs", "Sorted strings", "Nested lists"],
            correctIndex: 1,
            explanation: "Dictionaries map keys to values — perfect for codon tables (codon → amino acid), gene databases (gene name → sequence), etc.",
            xpReward: 10,
          },
          {
            id: "l1-m4-n2-e2",
            type: "code-complete",
            question: "Look up what amino acid the codon 'ATG' codes for:",
            codeTemplate: `codon_table = {
    "ATG": "Methionine",
    "TAA": "STOP",
    "GGG": "Glycine",
    "TTT": "Phenylalanine"
}
amino_acid = codon_table[___]
print(amino_acid)  # Methionine`,
            codeAnswer: 'amino_acid = codon_table["ATG"]',
            xpReward: 15,
          },
          {
            id: "l1-m4-n2-e3",
            type: "code-complete",
            question: "Add a new codon 'CCC' for 'Proline' to the table:",
            codeTemplate: `codon_table = {"ATG": "Methionine", "TAA": "STOP"}
codon_table[___] = ___
print(codon_table)`,
            codeAnswer: `codon_table["CCC"] = "Proline"`,
            xpReward: 15,
          },
          {
            id: "l1-m4-n2-e4",
            type: "multiple-choice",
            question: "What does `dict.get(key, default)` do differently from `dict[key]`?",
            options: [
              "It's faster",
              "It returns a default value if the key doesn't exist, instead of raising an error",
              "It adds the key if it doesn't exist",
              "It returns all keys",
            ],
            correctIndex: 1,
            explanation: "`.get()` is safer — it won't crash if the key is missing. `dict[key]` raises a KeyError for missing keys.",
            xpReward: 15,
          },
          {
            id: "l1-m4-n2-e5",
            type: "code-complete",
            question: "Write a function that translates a codon sequence to amino acids:",
            codeTemplate: `codon_table = {"ATG":"Met","TAA":"*","GGG":"Gly","TTT":"Phe","CGT":"Arg"}

def translate(dna_sequence):
    protein = []
    for i in range(0, len(dna_sequence), 3):
        codon = dna_sequence[i:i+3]
        aa = codon_table.___(codon, "?")
        protein.append(aa)
    return "".join(protein)

print(translate("ATGGGGCGT"))  # MetGlyArg`,
            codeAnswer: "        aa = codon_table.get(codon, '?')",
            xpReward: 25,
          },
          {
            id: "l1-m4-n2-e6",
            type: "free-text",
            question: "The genetic code (codon table) is described as 'degenerate' — multiple codons can code for the same amino acid. How would you represent this in a Python dictionary, and what challenge does it create?",
            rubric: ["identifies the issue with one-to-many mapping", "suggests a solution (reverse mapping, list of codons per amino acid)", "demonstrates Python thinking"],
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m5",
    title: "Reading and Writing Files",
    description: "FASTA format and file I/O in Python",
    realm: 1,
    color: "#00ffff",
    nodes: [
      {
        id: "l1-m5-n1",
        moduleId: "l1-m5",
        title: "FASTA Format",
        description: "The universal biological sequence file format",
        icon: "📄",
        xpReward: 120,
        exercises: [
          {
            id: "l1-m5-n1-e1",
            type: "multiple-choice",
            question: "In a FASTA file, what does the line starting with '>' contain?",
            options: ["The sequence data", "A sequence identifier/description", "A file header", "Quality scores"],
            correctIndex: 1,
            explanation: "Lines starting with > are headers — they contain the sequence ID and optional description. The sequence follows on subsequent lines.",
            xpReward: 10,
          },
          {
            id: "l1-m5-n1-e2",
            type: "fill-blank",
            question: "Complete the FASTA format example:\n___BRCA1_human\nATCGATCGATCGATCGATCG",
            blanks: [{ text: ">", answer: ">", position: 0 }],
            xpReward: 10,
          },
          {
            id: "l1-m5-n1-e3",
            type: "code-complete",
            question: "Write code to read a FASTA file and print each line:",
            codeTemplate: `___ open("sequence.fasta", "r") as f:
    for line in f:
        print(line.strip())`,
            codeAnswer: "with open('sequence.fasta', 'r') as f:",
            xpReward: 15,
          },
          {
            id: "l1-m5-n1-e4",
            type: "code-complete",
            question: "Parse a FASTA file and store sequences in a dictionary:",
            codeTemplate: `def parse_fasta(filename):
    sequences = {}
    current_id = None
    with open(filename) as f:
        for line in f:
            line = line.strip()
            if line.startswith(___):
                current_id = line[1:].split()[0]
                sequences[current_id] = ""
            elif current_id:
                sequences[current_id] += line
    return sequences`,
            codeAnswer: '            if line.startswith(">")',
            xpReward: 25,
          },
          {
            id: "l1-m5-n1-e5",
            type: "free-text",
            question: "Why do bioinformaticians prefer standardized file formats like FASTA over just having plain text? What problems does standardization solve?",
            rubric: ["mentions interoperability between tools", "mentions parsing reliability", "gives a concrete example"],
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m6",
    title: "The Terminal",
    description: "Your lab bench — command line basics",
    realm: 1,
    color: "#39ff14",
    nodes: [
      {
        id: "l1-m6-n1",
        moduleId: "l1-m6",
        title: "Navigating the Terminal",
        description: "cd, ls, pwd — finding your way around",
        icon: "💻",
        xpReward: 130,
        exercises: [
          {
            id: "l1-m6-n1-e1",
            type: "terminal",
            question: "Use the `pwd` command to see your current directory:",
            terminalCommands: {
              pwd: "/home/user/biolab",
              ls: "sequences/  scripts/  results/  README.txt",
              "ls sequences": "brca1.fasta  tp53.fasta  myc.fasta",
              "cd sequences": "",
              "cd ..": "",
              "python script.py": "Running analysis...\nDone! Results in results/",
              "cat README.txt": "# BioLab Project\nComputational biology workspace",
            },
            xpReward: 20,
          },
          {
            id: "l1-m6-n1-e2",
            type: "multiple-choice",
            question: "What does `ls` do in the terminal?",
            options: ["Lists files and directories in current location", "Logs you out of the system", "Launches a script", "Links files together"],
            correctIndex: 0,
            xpReward: 10,
          },
          {
            id: "l1-m6-n1-e3",
            type: "multiple-choice",
            question: "Which command changes your current directory to 'sequences'?",
            options: ["go sequences", "cd sequences", "open sequences", "mv sequences"],
            correctIndex: 1,
            xpReward: 10,
          },
          {
            id: "l1-m6-n1-e4",
            type: "multiple-choice",
            question: "What does `pip install biopython` do?",
            options: [
              "Creates a new Python file called biopython",
              "Downloads and installs the Biopython package from PyPI",
              "Updates Python itself",
              "Compiles a Python script",
            ],
            correctIndex: 1,
            explanation: "pip is Python's package manager. `pip install` downloads packages from the Python Package Index (PyPI) and makes them available to import.",
            xpReward: 15,
          },
          {
            id: "l1-m6-n1-e5",
            type: "terminal",
            question: "Practice: navigate to the sequences directory and list its contents. Then go back up.",
            terminalCommands: {
              pwd: "/home/user/biolab",
              ls: "sequences/  scripts/  results/  README.txt",
              "ls sequences": "brca1.fasta  tp53.fasta  myc.fasta",
              "cd sequences": "",
              "cd ..": "",
              "python script.py": "Running analysis...\nDone!",
              "cat README.txt": "# BioLab Project\nComputational biology workspace",
            },
            xpReward: 20,
          },
          {
            id: "l1-m6-n1-e6",
            type: "free-text",
            question: "Why do computational biologists use the terminal instead of just clicking through folders with a mouse? Give two practical reasons.",
            rubric: ["mentions automation/scripting", "mentions speed or reproducibility", "accurate description of terminal benefits"],
            xpReward: 20,
          },
        ],
      },
    ],
  },
];

export default level1Modules;
