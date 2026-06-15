import type { Module } from "@/lib/types";

const level1ExtraModules: Module[] = [
  {
    id: "l1-m7",
    title: "How Cells Communicate",
    description: "Signals, receptors, and the art of biological gossip",
    realm: 1,
    color: "#39ff14",
    nodes: [
      {
        id: "l1-m7-n1",
        moduleId: "l1-m7",
        title: "Signal Transduction Basics",
        description: "How a cell hears and responds to messages",
        icon: "📡",
        xpReward: 110,
        exercises: [
          {
            id: "l1-m7-n1-e1",
            type: "multiple-choice",
            question: "What is signal transduction?",
            options: [
              "Moving signals through nerves",
              "Converting an extracellular signal into an intracellular response",
              "Translating mRNA into protein",
              "Copying DNA to RNA",
            ],
            correctIndex: 1,
            explanation: "Signal transduction is the process by which a cell receives an outside signal (like a hormone) and converts it into an internal cellular response.",
            xpReward: 10,
          },
          {
            id: "l1-m7-n1-e2",
            type: "sequence-order",
            question: "Order the steps of a typical receptor-mediated signaling pathway:",
            items: [
              "Second messengers (e.g., cAMP) amplify the signal",
              "Ligand binds to receptor on cell surface",
              "Target proteins are activated → cellular response",
              "Receptor changes shape (conformational change)",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 20,
          },
          {
            id: "l1-m7-n1-e3",
            type: "drag-drop",
            question: "Match each signaling molecule to its category:",
            pairs: [
              { left: "Insulin", right: "Peptide hormone — binds surface receptor" },
              { left: "Estrogen", right: "Steroid hormone — enters cell, binds nuclear receptor" },
              { left: "Epinephrine (adrenaline)", right: "Amino acid-derived — binds GPCR" },
              { left: "cAMP", right: "Second messenger — amplifies signal inside cell" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m7-n1-e4",
            type: "fill-blank",
            question: "G protein-coupled receptors (GPCRs) use _____ proteins that toggle between active (GTP-bound) and inactive (GDP-bound) states.",
            blanks: [{ text: "G", answer: "G", position: 0 }],
            explanation: "G proteins are heterotrimeric proteins. When a GPCR is activated, the alpha subunit exchanges GDP for GTP and detaches to activate downstream effectors like adenylyl cyclase.",
            xpReward: 10,
          },
          {
            id: "l1-m7-n1-e5",
            type: "multiple-choice",
            question: "Which of the following is an example of autocrine signaling?",
            options: [
              "Pancreatic beta cells releasing insulin into the bloodstream",
              "A neuron releasing neurotransmitters to a muscle cell",
              "A cancer cell releasing growth factors that stimulate its own proliferation",
              "A liver cell responding to adrenaline from the adrenal gland",
            ],
            correctIndex: 2,
            explanation: "Autocrine signaling is when a cell signals to itself — it releases a molecule that binds to its own receptor. Cancer cells often exploit this for uncontrolled growth.",
            xpReward: 10,
          },
          {
            id: "l1-m7-n1-e6",
            type: "tap-correct",
            question: "Tap ALL that are types of cell-to-cell signaling:",
            options: ["Autocrine", "Paracrine", "Endocrine", "Telecrine", "Juxtacrine", "Synaptic"],
            correctIndices: [0, 1, 2, 4, 5],
            explanation: "'Telecrine' is not a real signaling type. Autocrine (self), paracrine (nearby), endocrine (bloodstream), juxtacrine (contact), and synaptic (neuron) are all real.",
            xpReward: 15,
          },
          {
            id: "l1-m7-n1-e7",
            type: "free-text",
            question: "Explain why signal amplification (like a kinase cascade) is important in biology.",
            rubric: ["amplification", "small signal", "large response", "cascade", "phosphorylation", "enzyme"],
            minKeywords: 2,
            explanation: "A single hormone molecule binding one receptor can activate thousands of enzymes — signal amplification allows tiny signals (like a single hormone molecule) to produce massive cellular responses.",
            xpReward: 20,
          },
          {
            id: "l1-m7-n1-e8",
            type: "multiple-choice",
            question: "Elliot loves phosphorylation. What does a kinase do?",
            options: [
              "Removes phosphate groups from proteins",
              "Adds phosphate groups to proteins, often activating them",
              "Cuts proteins into smaller pieces",
              "Builds phospholipid bilayers",
            ],
            correctIndex: 1,
            explanation: "Kinases add phosphate groups (phosphorylation) to target proteins — typically on serine, threonine, or tyrosine residues — changing their activity. Phosphatases do the opposite (remove phosphates).",
            xpReward: 10,
          },
        ],
      },
      {
        id: "l1-m7-n2",
        moduleId: "l1-m7",
        title: "The Nervous System in Code",
        description: "Neurons as biological computation units",
        icon: "⚡",
        xpReward: 120,
        exercises: [
          {
            id: "l1-m7-n2-e1",
            type: "multiple-choice",
            question: "What is the resting membrane potential of a typical neuron?",
            options: ["+70 mV", "0 mV", "-70 mV", "-140 mV"],
            correctIndex: 2,
            explanation: "Most neurons have a resting membrane potential of about -70 mV (inside negative relative to outside), maintained by the Na⁺/K⁺ ATPase pump and selective ion channels.",
            xpReward: 10,
          },
          {
            id: "l1-m7-n2-e2",
            type: "sequence-order",
            question: "Order the events of an action potential:",
            items: [
              "Repolarization — K⁺ channels open, K⁺ rushes out",
              "Threshold reached — voltage-gated Na⁺ channels open",
              "Resting state — membrane at -70 mV",
              "Depolarization — Na⁺ rushes in, membrane potential rises to +40 mV",
            ],
            correctOrder: [2, 1, 3, 0],
            xpReward: 20,
          },
          {
            id: "l1-m7-n2-e3",
            type: "fill-blank",
            question: "The gap between two neurons where neurotransmitters are released is called the _____.",
            blanks: [{ text: "synapse", answer: "synapse", position: 0 }],
            explanation: "The synapse (specifically the synaptic cleft) is the tiny gap between a presynaptic neuron and a postsynaptic cell. Neurotransmitters diffuse across this gap to pass signals.",
            xpReward: 10,
          },
          {
            id: "l1-m7-n2-e4",
            type: "drag-drop",
            question: "Match each neurotransmitter to its primary function:",
            pairs: [
              { left: "Dopamine", right: "Reward, motivation, motor control" },
              { left: "Serotonin", right: "Mood regulation, sleep, appetite" },
              { left: "Acetylcholine", right: "Muscle activation at neuromuscular junctions" },
              { left: "GABA", right: "Primary inhibitory NT — calms neural activity" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m7-n2-e5",
            type: "multiple-choice",
            question: "Why can't an action potential go backwards along an axon?",
            options: [
              "The myelin sheath blocks backward transmission",
              "Na⁺ channels behind the action potential are in a refractory period and cannot reopen immediately",
              "Axons are too narrow for backward flow",
              "Calcium ions prevent it",
            ],
            correctIndex: 1,
            explanation: "After Na⁺ channels open and close, they enter an absolute refractory period where they cannot open again for a brief moment. This forces the action potential to move only forward (away from the cell body).",
            xpReward: 15,
          },
          {
            id: "l1-m7-n2-e6",
            type: "code-complete",
            question: "Complete this Python model of a leaky integrate-and-fire neuron:",
            starterCode: `import numpy as np

def lif_neuron(input_current, dt=0.001, threshold=-55.0,
               V_rest=-70.0, tau=0.02, R=10.0):
    \"\"\"
    Leaky integrate-and-fire neuron model.
    Returns spike times and voltage trace.
    \"\"\"
    V = V_rest
    spike_times = []
    V_trace = []

    for i, I in enumerate(input_current):
        # Compute change in voltage: dV = dt/tau * (V_rest - V + R*I)
        dV = ___
        V += dV
        V_trace.append(V)

        if V >= threshold:
            spike_times.append(i * dt)
            V = V_rest  # reset after spike

    return spike_times, V_trace`,
            solution: `        dV = (dt / tau) * (V_rest - V + R * I)`,
            explanation: "The LIF model captures neuron integration: the membrane charges up with input current, leaks back toward rest, and fires (spikes) when it crosses threshold.",
            xpReward: 25,
          },
          {
            id: "l1-m7-n2-e7",
            type: "tap-correct",
            question: "Tap ALL structures that are part of a neuron:",
            options: ["Dendrites", "Axon", "Myelin sheath", "Cristae", "Synaptic vesicles", "Cell body (soma)", "Cilia", "Axon terminal"],
            correctIndices: [0, 1, 2, 4, 5, 7],
            explanation: "Dendrites receive signals, soma integrates them, axon conducts, myelin insulates, synaptic vesicles store NTs, axon terminal releases them. Cristae are in mitochondria; cilia are elsewhere.",
            xpReward: 15,
          },
          {
            id: "l1-m7-n2-e8",
            type: "multiple-choice",
            question: "Myelin sheaths dramatically speed up nerve conduction via saltatory conduction. Why?",
            options: [
              "Myelin conducts electricity better than axoplasm",
              "The action potential jumps between Nodes of Ranvier rather than propagating continuously",
              "Myelin increases the ion concentration gradient",
              "Myelin prevents any signal loss",
            ],
            correctIndex: 1,
            explanation: "Saltatory conduction (from Latin 'saltare' — to jump): the action potential hops from one Node of Ranvier to the next, skipping the myelinated sections. This is 50× faster than unmyelinated fibers.",
            xpReward: 10,
          },
        ],
      },
      {
        id: "l1-m7-n3",
        moduleId: "l1-m7",
        title: "Immune System as a Data Problem",
        description: "Pattern recognition, memory, and self vs. non-self classification",
        icon: "🛡️",
        xpReward: 130,
        exercises: [
          {
            id: "l1-m7-n3-e1",
            type: "multiple-choice",
            question: "What is the key difference between innate and adaptive immunity?",
            options: [
              "Innate is slower but more accurate; adaptive is fast but general",
              "Innate is fast and general; adaptive is slow but highly specific and has memory",
              "They are essentially the same system with different names",
              "Innate only works against bacteria; adaptive only against viruses",
            ],
            correctIndex: 1,
            explanation: "Innate immunity (fast, general, no memory) and adaptive immunity (slow, specific, has immunological memory) form two layers of defense. Adaptive immunity 'learns' from exposure.",
            xpReward: 10,
          },
          {
            id: "l1-m7-n3-e2",
            type: "drag-drop",
            question: "Match each immune cell to its primary role:",
            pairs: [
              { left: "Cytotoxic T cell (CD8+)", right: "Kills infected or cancerous cells directly" },
              { left: "Helper T cell (CD4+)", right: "Coordinates immune response by releasing cytokines" },
              { left: "B cell", right: "Produces antibodies specific to antigens" },
              { left: "Natural killer (NK) cell", right: "Innate immune — kills cells missing MHC-I" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m7-n3-e3",
            type: "fill-blank",
            question: "Antibodies are Y-shaped proteins called _____ that bind to specific antigens with high affinity.",
            blanks: [{ text: "immunoglobulins", answer: "immunoglobulins", position: 0 }],
            explanation: "Immunoglobulins (Ig) are the formal name for antibodies. Each has two heavy and two light chains forming a Y shape, with antigen-binding sites at the tips of the Y.",
            xpReward: 10,
          },
          {
            id: "l1-m7-n3-e4",
            type: "sequence-order",
            question: "Order the events of an adaptive immune response to a new pathogen:",
            items: [
              "Plasma B cells produce antigen-specific antibodies",
              "Antigen-presenting cell (APC) presents antigen via MHC",
              "Memory cells persist long-term for rapid future response",
              "Naïve B and T cells recognize antigen and proliferate (clonal expansion)",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 20,
          },
          {
            id: "l1-m7-n3-e5",
            type: "multiple-choice",
            question: "Why does a second exposure to the same pathogen cause a faster, stronger response?",
            options: [
              "The pathogen mutates to become less virulent",
              "Memory B and T cells from the first exposure rapidly expand and respond",
              "The innate immune system is primed and reacts faster",
              "Antibodies from the first infection persist forever",
            ],
            correctIndex: 1,
            explanation: "During the primary response, memory cells are formed. On second exposure, these long-lived memory cells rapidly differentiate into effector cells, producing a much faster and larger (secondary) response.",
            xpReward: 15,
          },
          {
            id: "l1-m7-n3-e6",
            type: "code-complete",
            question: "Write a Python function that simulates clonal selection — finding B cells that match an antigen:",
            starterCode: `def clonal_selection(b_cells, antigen, threshold=0.8):
    \"\"\"
    Given a list of B cells with receptor_affinity scores,
    return those whose affinity for the antigen exceeds threshold.
    Each b_cell is a dict: {'id': str, 'affinity': float}
    \"\"\"
    selected = ___
    return selected`,
            solution: `    selected = [bc for bc in b_cells if bc['affinity'] >= threshold]`,
            explanation: "Clonal selection: only B cells whose receptor strongly binds the antigen get selected for proliferation. We filter by affinity — a perfect parallel to a list comprehension with a condition.",
            xpReward: 25,
          },
          {
            id: "l1-m7-n3-e7",
            type: "tap-correct",
            question: "Tap ALL that are components of the complement system:",
            options: ["C3b (opsonin)", "C5a (chemotaxin)", "IL-2 (interleukin)", "Membrane Attack Complex (MAC)", "IgM antibodies", "C1q (initiates classical pathway)"],
            correctIndices: [0, 1, 3, 5],
            explanation: "C3b, C5a, MAC, and C1q are all complement proteins. IL-2 is a cytokine; IgM can activate complement but is not itself a complement component.",
            xpReward: 15,
          },
          {
            id: "l1-m7-n3-e8",
            type: "free-text",
            question: "Explain how the immune system distinguishes 'self' from 'non-self' at the molecular level.",
            rubric: ["MHC", "self-tolerance", "thymus", "T cell", "receptor", "antigen", "autoimmune"],
            minKeywords: 3,
            explanation: "MHC (major histocompatibility complex) molecules on cell surfaces display peptide fragments. During development in the thymus, T cells that strongly recognize self-MHC + self-peptide are eliminated (negative selection), preventing autoimmunity.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m8",
    title: "Evolution: Biology's Algorithm",
    description: "Natural selection as the world's best optimization algorithm",
    realm: 1,
    color: "#52b788",
    nodes: [
      {
        id: "l1-m8-n1",
        moduleId: "l1-m8",
        title: "Darwin's Algorithm",
        description: "Variation, selection, heredity — the three pillars",
        icon: "🦋",
        xpReward: 110,
        exercises: [
          {
            id: "l1-m8-n1-e1",
            type: "multiple-choice",
            question: "Natural selection requires three conditions. Which set is correct?",
            options: [
              "Variation, Inheritance, Selection pressure",
              "Mutation, Drift, Migration",
              "Competition, Adaptation, Extinction",
              "DNA, RNA, Protein",
            ],
            correctIndex: 0,
            explanation: "Natural selection needs: heritable variation (differences between individuals that can be passed to offspring), and differential survival/reproduction (some variants do better than others).",
            xpReward: 10,
          },
          {
            id: "l1-m8-n1-e2",
            type: "fill-blank",
            question: "The unit of heredity passed from parents to offspring is the _____, which is a segment of DNA encoding a functional product.",
            blanks: [{ text: "gene", answer: "gene", position: 0 }],
            explanation: "A gene is the fundamental unit of heredity — a DNA sequence that encodes a functional RNA or protein. Humans have ~20,000 protein-coding genes.",
            xpReward: 10,
          },
          {
            id: "l1-m8-n1-e3",
            type: "drag-drop",
            question: "Match each type of selection to what it does to a population's trait distribution:",
            pairs: [
              { left: "Directional selection", right: "Shifts the distribution toward one extreme — favors one end of the spectrum" },
              { left: "Stabilizing selection", right: "Narrows the distribution — favors the average, removes extremes" },
              { left: "Disruptive selection", right: "Creates two peaks — favors both extremes, removes the middle" },
              { left: "Sexual selection", right: "Favors traits that increase mating success, even if costly to survival" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m8-n1-e4",
            type: "code-complete",
            question: "Implement a simple genetic drift simulation — random sampling of alleles each generation:",
            starterCode: `import random

def genetic_drift(pop_size, initial_freq, generations):
    \"\"\"Simulate genetic drift for a biallelic locus.\"\"\"
    freq = initial_freq
    history = [freq]

    for _ in range(generations):
        # Count allele A in next generation by random sampling
        count_A = ___
        freq = count_A / (2 * pop_size)
        history.append(freq)
        if freq == 0.0 or freq == 1.0:  # fixation or loss
            break
    return history`,
            solution: `        count_A = sum(random.random() < freq for _ in range(2 * pop_size))`,
            explanation: "Genetic drift: each generation, we randomly sample 2N alleles. Smaller populations drift faster to fixation or loss — this is a key force in evolution alongside selection.",
            xpReward: 25,
          },
          {
            id: "l1-m8-n1-e5",
            type: "multiple-choice",
            question: "What is the difference between a genotype and a phenotype?",
            options: [
              "Genotype is visible traits; phenotype is the DNA sequence",
              "Genotype is the genetic makeup (alleles); phenotype is the observable characteristics",
              "They are synonymous terms",
              "Genotype applies to populations; phenotype to individuals",
            ],
            correctIndex: 1,
            explanation: "Genotype = the actual DNA/allele combination an organism has. Phenotype = what we observe (color, height, disease resistance, etc.). Phenotype = genotype + environment.",
            xpReward: 10,
          },
          {
            id: "l1-m8-n1-e6",
            type: "sequence-order",
            question: "Order these events in speciation via geographic isolation (allopatric speciation):",
            items: [
              "Reproductive isolation becomes complete — two separate species",
              "Geographic barrier separates a population",
              "Each sub-population diverges via selection and drift",
              "Isolated sub-populations accumulate different mutations",
            ],
            correctOrder: [1, 3, 2, 0],
            xpReward: 20,
          },
          {
            id: "l1-m8-n1-e7",
            type: "tap-correct",
            question: "Tap ALL mechanisms that cause allele frequencies to change in a population (forces of evolution):",
            options: ["Natural selection", "Genetic drift", "Gene flow (migration)", "DNA replication", "Mutation", "Phenotypic plasticity"],
            correctIndices: [0, 1, 2, 4],
            explanation: "The four forces of evolution are: natural selection, genetic drift, gene flow, and mutation. DNA replication and phenotypic plasticity don't directly change allele frequencies.",
            xpReward: 15,
          },
          {
            id: "l1-m8-n1-e8",
            type: "free-text",
            question: "Why do computational biologists say natural selection is an 'optimization algorithm' without a goal?",
            rubric: ["fitness", "local optima", "gradient", "blind", "no foresight", "selection pressure", "population"],
            minKeywords: 2,
            explanation: "Evolution maximizes fitness by selecting heritable variants that reproduce more — it's a gradient ascent on the fitness landscape. But it has no foresight, gets stuck in local optima, and has no goal — just differential reproduction.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "l1-m8-n2",
        moduleId: "l1-m8",
        title: "Phylogenetics: The Tree of Life",
        description: "Reading evolutionary history from molecular sequences",
        icon: "🌳",
        xpReward: 130,
        exercises: [
          {
            id: "l1-m8-n2-e1",
            type: "multiple-choice",
            question: "What is a phylogenetic tree?",
            options: [
              "A diagram showing how traits change across generations",
              "A branching diagram showing evolutionary relationships between organisms",
              "A chart of genetic mutations in a population over time",
              "A map of gene expression in different tissues",
            ],
            correctIndex: 1,
            explanation: "A phylogenetic tree is a branching diagram representing evolutionary history. Each fork (node) represents a common ancestor; branch lengths often represent evolutionary time or mutation rate.",
            xpReward: 10,
          },
          {
            id: "l1-m8-n2-e2",
            type: "fill-blank",
            question: "The concept that all organisms on Earth share a common _____ is supported by the universality of the genetic code.",
            blanks: [{ text: "ancestor", answer: "ancestor", position: 0 }],
            explanation: "LUCA (Last Universal Common Ancestor) is the hypothetical common ancestor of all life. The near-universal genetic code is the strongest molecular evidence for universal common descent.",
            xpReward: 10,
          },
          {
            id: "l1-m8-n2-e3",
            type: "drag-drop",
            question: "Match each phylogenetic concept to its correct definition:",
            pairs: [
              { left: "Clade (monophyletic group)", right: "An ancestor and ALL of its descendants" },
              { left: "Homologous structure", right: "Same evolutionary origin, possibly different function (e.g., human arm vs. whale fin)" },
              { left: "Analogous structure", right: "Same function but different evolutionary origin (convergent evolution)" },
              { left: "Molecular clock", right: "Uses mutation rate to estimate divergence time from sequence differences" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m8-n2-e4",
            type: "code-complete",
            question: "Write a function to calculate pairwise Hamming distance between DNA sequences (a simple molecular distance measure):",
            starterCode: `def hamming_distance(seq1, seq2):
    \"\"\"
    Count the number of positions where seq1 and seq2 differ.
    Assumes same length sequences.
    \"\"\"
    if len(seq1) != len(seq2):
        raise ValueError("Sequences must be same length")
    return ___`,
            solution: `    return sum(a != b for a, b in zip(seq1, seq2))`,
            explanation: "Hamming distance counts differing positions between two strings of equal length. For DNA, this counts point mutations — a simple but foundational measure in phylogenetics and bioinformatics.",
            xpReward: 25,
          },
          {
            id: "l1-m8-n2-e5",
            type: "multiple-choice",
            question: "Humans and chimpanzees share ~98.8% DNA identity. What does this mean phylogenetically?",
            options: [
              "Humans evolved from chimpanzees",
              "Humans and chimpanzees share a recent common ancestor and diverged ~6 million years ago",
              "Chimpanzees are an inferior version of humans",
              "The 1.2% difference has no functional significance",
            ],
            correctIndex: 1,
            explanation: "High DNA identity = recent common ancestor. Humans and chimps are sister species that diverged ~6 MYA — neither evolved from the other. The ~1.2% protein-coding difference drives significant phenotypic differences.",
            xpReward: 15,
          },
          {
            id: "l1-m8-n2-e6",
            type: "sequence-order",
            question: "Order the steps in building a phylogenetic tree from sequences:",
            items: [
              "Apply a tree-building algorithm (e.g., neighbor-joining or maximum likelihood)",
              "Collect sequences from organisms of interest",
              "Perform multiple sequence alignment (MSA)",
              "Calculate a pairwise distance matrix between aligned sequences",
            ],
            correctOrder: [1, 2, 3, 0],
            xpReward: 20,
          },
          {
            id: "l1-m8-n2-e7",
            type: "tap-correct",
            question: "Tap ALL genes/regions commonly used as molecular markers in phylogenetics:",
            options: ["16S rRNA", "Cytochrome c", "COX1 (barcoding)", "GAPDH", "histone H3", "Alu elements"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "16S rRNA (bacteria), cytochrome c (universal), COX1 (barcoding animals), GAPDH (housekeeping), histone H3 (deep eukaryote phylogenetics) are all used. Alu elements are transposons, used for human phylogenetics but not typically 'molecular markers' in the standard sense.",
            xpReward: 15,
          },
          {
            id: "l1-m8-n2-e8",
            type: "free-text",
            question: "Why is the 16S rRNA gene particularly useful for studying bacterial phylogenetics?",
            rubric: ["conserved", "universal", "bacteria", "variable regions", "ribosomal", "hypervariable", "PCR"],
            minKeywords: 3,
            explanation: "16S rRNA is: (1) universally present in bacteria, (2) has conserved regions (for PCR primers) flanking hypervariable regions (for species discrimination), and (3) evolves slowly enough to compare across phyla yet fast enough to distinguish species.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m9",
    title: "Metabolism: The Biochemistry of Energy",
    description: "How cells extract, store, and spend energy",
    realm: 1,
    color: "#f59e0b",
    nodes: [
      {
        id: "l1-m9-n1",
        moduleId: "l1-m9",
        title: "Glycolysis & The Krebs Cycle",
        description: "ATP: the energy currency of life",
        icon: "⚡",
        xpReward: 120,
        exercises: [
          {
            id: "l1-m9-n1-e1",
            type: "multiple-choice",
            question: "What is ATP and why is it called the 'energy currency' of the cell?",
            options: [
              "A type of DNA that stores energy",
              "A protein that catalyzes energy reactions",
              "A nucleotide that stores and releases energy via phosphate bond hydrolysis",
              "A lipid membrane component",
            ],
            correctIndex: 2,
            explanation: "ATP (adenosine triphosphate) is a nucleotide with three phosphate groups. Hydrolyzing the terminal phosphate bond releases ~7.3 kcal/mol — this energy drives cellular work. It's 'currency' because it's spent and regenerated constantly.",
            xpReward: 10,
          },
          {
            id: "l1-m9-n1-e2",
            type: "sequence-order",
            question: "Order the main stages of complete glucose oxidation:",
            items: [
              "Oxidative phosphorylation — electron transport chain generates 30-32 ATP",
              "Pyruvate oxidation — pyruvate enters mitochondria, becomes acetyl-CoA",
              "Glycolysis — glucose → 2 pyruvate + 2 ATP + 2 NADH (in cytoplasm)",
              "Krebs cycle (TCA cycle) — acetyl-CoA → CO₂ + NADH + FADH₂ + 2 ATP",
            ],
            correctOrder: [2, 1, 3, 0],
            xpReward: 20,
          },
          {
            id: "l1-m9-n1-e3",
            type: "fill-blank",
            question: "In cellular respiration, glucose (C₆H₁₂O₆) + oxygen → CO₂ + _____ + ~30 ATP",
            blanks: [{ text: "water", answer: "water", position: 0 }],
            explanation: "Complete aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~30 ATP. The oxygen accepts electrons at the end of the electron transport chain, producing water.",
            xpReward: 10,
          },
          {
            id: "l1-m9-n1-e4",
            type: "drag-drop",
            question: "Match each metabolic molecule to its role:",
            pairs: [
              { left: "NAD⁺/NADH", right: "Electron carrier — shuttles electrons from glycolysis/Krebs to ETC" },
              { left: "Acetyl-CoA", right: "Central metabolic hub — enters Krebs cycle from pyruvate, fats, amino acids" },
              { left: "ATP synthase", right: "Enzyme that uses proton gradient to make ATP (chemiosmosis)" },
              { left: "Citrate", right: "First product of Krebs cycle — formed from acetyl-CoA + oxaloacetate" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m9-n1-e5",
            type: "multiple-choice",
            question: "Why can anaerobic organisms (like yeast) survive without oxygen?",
            options: [
              "They don't need ATP",
              "They use a different electron acceptor (like pyruvate) to regenerate NAD⁺, allowing glycolysis to continue",
              "They get energy directly from sunlight",
              "Their cells are much smaller and need less energy",
            ],
            correctIndex: 1,
            explanation: "Without O₂ as the final electron acceptor, NADH can't be reoxidized to NAD⁺ via the ETC. Fermentation regenerates NAD⁺ using pyruvate as acceptor (→ lactate in muscle or ethanol+CO₂ in yeast), keeping glycolysis running.",
            xpReward: 15,
          },
          {
            id: "l1-m9-n1-e6",
            type: "code-complete",
            question: "Write a function that calculates ATP yield from glucose metabolism:",
            starterCode: `def atp_yield(glucose_moles, aerobic=True):
    \"\"\"
    Calculate total ATP from glucose oxidation.
    Aerobic: ~30 ATP/glucose
    Anaerobic (fermentation): 2 ATP/glucose
    \"\"\"
    if aerobic:
        atp_per_glucose = ___
    else:
        atp_per_glucose = ___
    return glucose_moles * atp_per_glucose`,
            solution: `        atp_per_glucose = 30
    else:
        atp_per_glucose = 2`,
            explanation: "Aerobic respiration yields ~30 ATP per glucose (glycolysis + Krebs + oxidative phosphorylation). Anaerobic fermentation yields only 2 ATP (glycolysis only) — 15× less efficient but works without oxygen.",
            xpReward: 20,
          },
          {
            id: "l1-m9-n1-e7",
            type: "tap-correct",
            question: "Tap ALL molecules that are NADH-producing steps in the Krebs cycle:",
            options: ["Isocitrate → α-ketoglutarate", "Succinate → fumarate", "α-ketoglutarate → succinyl-CoA", "Malate → oxaloacetate", "Succinyl-CoA → succinate"],
            correctIndices: [0, 2, 3],
            explanation: "Three NADH-producing steps: isocitrate dehydrogenase, α-ketoglutarate dehydrogenase, and malate dehydrogenase. Succinate → fumarate produces FADH₂; succinyl-CoA → succinate produces GTP.",
            xpReward: 15,
          },
          {
            id: "l1-m9-n1-e8",
            type: "free-text",
            question: "Why do biologists say 'fat burns in the flame of carbohydrates'?",
            rubric: ["oxaloacetate", "acetyl-CoA", "Krebs", "carbohydrate", "glucose", "replenish", "anaplerosis"],
            minKeywords: 2,
            explanation: "Fat breakdown yields acetyl-CoA, which enters the Krebs cycle — but the cycle requires oxaloacetate (from carbohydrate metabolism) to accept it. When carbs are depleted (starvation/keto), oxaloacetate is scarce, so fat can't be fully oxidized → ketone bodies form instead.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "l1-m9-n2",
        moduleId: "l1-m9",
        title: "Photosynthesis: Capturing Light",
        description: "The original solar panel — converting photons to sugar",
        icon: "🌿",
        xpReward: 110,
        exercises: [
          {
            id: "l1-m9-n2-e1",
            type: "multiple-choice",
            question: "What is the overall equation for oxygenic photosynthesis?",
            options: [
              "CO₂ + H₂O + light → glucose + O₂",
              "Glucose + O₂ → CO₂ + H₂O + ATP",
              "CO₂ + light → glucose",
              "H₂O + ATP → O₂ + ADP",
            ],
            correctIndex: 0,
            explanation: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Plants use light to reduce CO₂ to glucose while oxidizing water (releasing O₂). This is the reverse of cellular respiration.",
            xpReward: 10,
          },
          {
            id: "l1-m9-n2-e2",
            type: "drag-drop",
            question: "Match each photosynthesis component to its location and role:",
            pairs: [
              { left: "Chlorophyll (in thylakoid membrane)", right: "Absorbs light energy (mostly blue and red) — converts to chemical energy" },
              { left: "Photosystem II", right: "Water splitting — releases O₂ and energizes electrons" },
              { left: "Photosystem I", right: "Reduces NADP⁺ to NADPH — final electron acceptor in light reactions" },
              { left: "Calvin cycle (in stroma)", right: "Uses ATP + NADPH to fix CO₂ into G3P (sugar precursor)" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m9-n2-e3",
            type: "fill-blank",
            question: "The Calvin cycle enzyme _____ (abbreviated RuBisCO) catalyzes the fixation of CO₂ into organic carbon.",
            blanks: [{ text: "RuBisCO", answer: "RuBisCO", position: 0 }],
            explanation: "Ribulose-1,5-bisphosphate carboxylase/oxygenase (RuBisCO) is the most abundant enzyme on Earth. It catalyzes the first step of carbon fixation — CO₂ + RuBP → 2× 3-phosphoglycerate.",
            xpReward: 10,
          },
          {
            id: "l1-m9-n2-e4",
            type: "sequence-order",
            question: "Order the events of the light-dependent reactions in photosynthesis:",
            items: [
              "ATP synthase uses proton gradient to make ATP (photophosphorylation)",
              "Photosystem II absorbs light and splits water → O₂ released",
              "Energized electrons pass through electron transport chain (plastoquinone → cytochrome b6f → plastocyanin)",
              "Photosystem I re-energizes electrons → NADPH produced",
            ],
            correctOrder: [1, 2, 3, 0],
            xpReward: 20,
          },
          {
            id: "l1-m9-n2-e5",
            type: "multiple-choice",
            question: "Why are C4 plants (like maize) more efficient than C3 plants in hot, sunny conditions?",
            options: [
              "They have more chlorophyll",
              "They concentrate CO₂ around RuBisCO using a spatial pump, reducing wasteful photorespiration",
              "They use a different light spectrum",
              "They perform photosynthesis at night (CAM)",
            ],
            correctIndex: 1,
            explanation: "In hot conditions, O₂ competes with CO₂ at RuBisCO (photorespiration — wasteful). C4 plants fix CO₂ first via PEP carboxylase in mesophyll cells, concentrate it in bundle sheath cells, and suppress photorespiration — ~30% more efficient.",
            xpReward: 15,
          },
          {
            id: "l1-m9-n2-e6",
            type: "tap-correct",
            question: "Tap ALL pigments found in plant chloroplasts that contribute to light absorption:",
            options: ["Chlorophyll a", "Chlorophyll b", "Carotenoids (β-carotene)", "Hemoglobin", "Xanthophylls", "Phycocyanin"],
            correctIndices: [0, 1, 2, 4],
            explanation: "Chlorophyll a, b, carotenoids, and xanthophylls are all found in chloroplasts. Hemoglobin is in red blood cells. Phycocyanin is in cyanobacteria/algae, not plant chloroplasts.",
            xpReward: 15,
          },
          {
            id: "l1-m9-n2-e7",
            type: "multiple-choice",
            question: "What does photorespiration do to a plant and why is it considered wasteful?",
            options: [
              "It's beneficial — produces extra ATP via light",
              "RuBisCO uses O₂ instead of CO₂, consuming ATP+NADPH without net carbon fixation",
              "It breaks down excess sugars when there's too much sun",
              "It converts NADPH back to NADP⁺ when the Calvin cycle is inactive",
            ],
            correctIndex: 1,
            explanation: "Photorespiration: RuBisCO reacts with O₂ (instead of CO₂) → 2-phosphoglycolate. Recycling this back is energetically costly, consuming ATP and NADPH while releasing CO₂ — essentially running photosynthesis in reverse. Up to 25% of carbon fixed can be lost this way in C3 plants.",
            xpReward: 15,
          },
          {
            id: "l1-m9-n2-e8",
            type: "free-text",
            question: "Explain why photosynthesis and cellular respiration are said to be complementary processes in the biosphere.",
            rubric: ["oxygen", "carbon dioxide", "glucose", "cycle", "energy", "light", "complementary", "producers"],
            minKeywords: 3,
            explanation: "Photosynthesis consumes CO₂ + H₂O + light → glucose + O₂. Respiration consumes glucose + O₂ → CO₂ + H₂O + ATP. They're exact reverses — together they cycle carbon, oxygen, and energy through the biosphere. Producers (plants) and consumers (animals) depend on each other.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
];

export default level1ExtraModules;
