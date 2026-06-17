import type { Module } from "@/lib/types";

const modules: Module[] = [
  {
    id: "l2-adv-m1",
    title: "pandas: The Data Forest",
    description: "Explore and analyze biological datasets using the pandas library",
    realm: 2,
    color: "#52b788",
    nodes: [
      {
        id: "l2-adv-m1-n1",
        moduleId: "l2-adv-m1",
        title: "DataFrame Essentials",
        description: "Create DataFrames and inspect their shape, types, and statistics",
        icon: "🌿",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m1-n1-e1",
            type: "multiple-choice",
            question: "What does `df.shape` return for a pandas DataFrame?",
            hint: "🌿 TEACHING: A pandas DataFrame is a 2D table. `.shape` is an attribute (not a method — no parentheses!) that returns the dimensions as a tuple `(rows, columns)`. Knowing the shape is the first thing you check when loading a new dataset.\n\nExample: if `df.shape` returns `(1000, 12)`, your table has 1000 rows (genes) and 12 columns (samples or features).",
            options: [
              "The number of rows only",
              "A tuple of (number of rows, number of columns)",
              "The total number of cells (rows × columns)",
              "A list of column names",
            ],
            correctIndex: 1,
            explanation: "`df.shape` returns a tuple `(rows, columns)`. For example, `(5000, 8)` means 5000 rows and 8 columns. This is one of the first things to check when exploring a new dataset.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m1-n1-e2",
            type: "multiple-choice",
            question: "What does `df.describe()` show for a numeric DataFrame?",
            hint: "🌿 TEACHING: `df.describe()` is a quick statistical summary of numeric columns — it shows count, mean, standard deviation, min, 25th percentile, median (50th), 75th percentile, and max. This gives you an instant sense of the distribution of your data — essential for spotting outliers in expression data.\n\nExample: if mean expression is 5.2 but max is 10000, you likely have outliers.",
            options: [
              "The data types of each column",
              "The first 5 rows of the DataFrame",
              "Count, mean, std, min, quartiles, and max for numeric columns",
              "The number of missing values per column",
            ],
            correctIndex: 2,
            explanation: "`df.describe()` computes summary statistics (count, mean, std, min, 25%, 50%, 75%, max) for all numeric columns. It's a quick way to understand the distribution and spot outliers.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m1-n1-e3",
            type: "fill-blank",
            question: "To see the first 5 rows of a DataFrame `df`, call: df._____",
            hint: "🌿 TEACHING: `df.head(n)` returns the first `n` rows (default 5). `df.tail(n)` returns the last `n` rows. These are useful for quickly previewing data structure without printing the entire dataset. Always call `.head()` after loading a new file to verify the data loaded correctly.\n\nExample: `df.head()` shows the top 5 rows; `df.head(10)` shows the top 10.",
            blanks: [{ text: "head()", answer: "head()", position: 0 }],
            explanation: "`df.head()` returns the first 5 rows by default. Pass a number to change it: `df.head(10)` shows 10 rows. It's the standard way to preview a DataFrame after loading data.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m1-n1-e4",
            type: "fill-blank",
            question: "To inspect the data types of each column in `df`, use: df._____",
            hint: "🌿 TEACHING: `df.dtypes` is an attribute that returns the data type of each column. In bioinformatics, you might have `object` (string) for gene names, `float64` for expression values, and `int64` for counts. Knowing dtypes helps you catch parsing errors — like expression values loaded as strings instead of floats.\n\nExample: `df.dtypes` might show `gene_id: object, count: int64, expression: float64`.",
            blanks: [{ text: "dtypes", answer: "dtypes", position: 0 }],
            explanation: "`df.dtypes` returns a Series showing the data type of each column. Checking dtypes early catches parsing errors — for instance, numeric columns accidentally loaded as strings due to missing values or formatting.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m1-n1-e5",
            type: "code-complete",
            question: "Complete the code to create a DataFrame from a dictionary of gene expression data.",
            hint: "🌿 TEACHING: `pd.DataFrame(dictionary)` creates a DataFrame where each key becomes a column name and its list becomes the column values. All lists must be the same length. This is the most common way to build a DataFrame from scratch in Python.\n\nExample: `pd.DataFrame({'gene': ['BRCA1', 'TP53'], 'expr': [8.5, 12.3]})` creates a 2-row, 2-column table.",
            codeTemplate: `import pandas as _____

data = {
    'gene': ['BRCA1', 'TP53', 'MYC', 'EGFR'],
    'expression': [8.5, 12.3, 6.1, 15.0],
    'chromosome': ['17', '17', '8', '7']
}
df = pd._____(data)
print(df.shape)`,
            codeAnswer: `import pandas as pd

data = {
    'gene': ['BRCA1', 'TP53', 'MYC', 'EGFR'],
    'expression': [8.5, 12.3, 6.1, 15.0],
    'chromosome': ['17', '17', '8', '7']
}
df = pd.DataFrame(data)
print(df.shape)`,
            explanation: "`import pandas as pd` is the standard alias. `pd.DataFrame(data)` converts the dictionary to a DataFrame — each key is a column, each list is a column's values. `df.shape` will return `(4, 3)`.",
            xpReward: 25,
          },
          {
            id: "l2-adv-m1-n1-e6",
            type: "debug-code",
            question: "This code tries to read a CSV file into a DataFrame but has a bug. Fix it.",
            hint: "🌿 TEACHING: To read a CSV file into a pandas DataFrame, use `pd.read_csv('filename.csv')`. A very common mistake is calling `pd.DataFrame('filename.csv')` — this tries to create a DataFrame from the string itself, not from the file. `pd.read_csv()` is the correct function for file loading.\n\nExample: `df = pd.read_csv('gene_counts.csv')` loads the file properly.",
            codeTemplate: `import pandas as pd

df = pd.DataFrame('gene_expression.csv')
print(df.head())`,
            bugLine: 3,
            bugFix: "df = pd.read_csv('gene_expression.csv')",
            explanation: "`pd.DataFrame('gene_expression.csv')` tries to create a DataFrame from the string `'gene_expression.csv'`, not from the file. Use `pd.read_csv('gene_expression.csv')` to actually read the file.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l2-adv-m1-n2",
        moduleId: "l2-adv-m1",
        title: "Indexing & Filtering",
        description: "Select rows and columns with .loc[], .iloc[], boolean masks, and .query()",
        icon: "🔍",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m1-n2-e1",
            type: "multiple-choice",
            question: "What is the difference between `df.loc[]` and `df.iloc[]`?",
            hint: "🌿 TEACHING: `df.loc[]` selects by label (index name or column name). `df.iloc[]` selects by integer position (0-based). This matters when your index is not 0,1,2,3... — for example, if your index contains gene IDs, `df.loc['BRCA1']` finds it by name, while `df.iloc[0]` gets the first row regardless of label.\n\nExample: `df.loc['BRCA1', 'expression']` vs `df.iloc[0, 1]` — both might get the same value but by different means.",
            options: [
              "`.loc[]` is for rows; `.iloc[]` is for columns",
              "`.loc[]` selects by label; `.iloc[]` selects by integer position",
              "`.loc[]` is faster; `.iloc[]` is slower",
              "They are identical — just alternative syntax",
            ],
            correctIndex: 1,
            explanation: "`.loc[]` uses label-based indexing (row/column names). `.iloc[]` uses integer position (0-based). When your row index contains gene IDs or sample names, `.loc[]` lets you select by name; `.iloc[]` always uses position.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m1-n2-e2",
            type: "multiple-choice",
            question: "What does `df[df['expression'] > 10.0]` return?",
            hint: "🌿 TEACHING: `df['expression'] > 10.0` creates a boolean Series (True/False for each row). Using that mask inside `df[...]` filters the DataFrame to only rows where the condition is True — this is called boolean masking. It's one of the most common operations in pandas for filtering data by a threshold.\n\nExample: `df[df['pvalue'] < 0.05]` keeps only statistically significant genes.",
            options: [
              "A single value — the maximum expression level",
              "A DataFrame containing only rows where expression > 10.0",
              "A boolean Series showing which rows match",
              "The column of expression values filtered to > 10.0",
            ],
            correctIndex: 1,
            explanation: "`df['expression'] > 10.0` creates a boolean mask. `df[mask]` uses that mask to filter rows, returning a DataFrame containing only rows where expression exceeds 10.0.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m1-n2-e3",
            type: "fill-blank",
            question: "To select row with label 'BRCA1' and column 'expression' from df, use: df.___['BRCA1', 'expression']",
            hint: "🌿 TEACHING: `df.loc[row_label, column_label]` selects a specific cell by its row and column labels. If your DataFrame is indexed by gene name, `df.loc['BRCA1', 'expression']` returns the expression value for BRCA1. You can also select ranges: `df.loc['BRCA1':'MYC', 'expression':'pvalue']`.\n\nExample: `df.loc['TP53', 'chromosome']` returns the chromosome where TP53 is located.",
            blanks: [{ text: "loc", answer: "loc", position: 0 }],
            explanation: "`df.loc[row_label, column_label]` selects by label. For a DataFrame indexed by gene name, `df.loc['BRCA1', 'expression']` returns the expression value for the BRCA1 row.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m1-n2-e4",
            type: "fill-blank",
            question: "To filter a DataFrame using a SQL-like string condition, use: df._____(\"expression > 10.0\")",
            hint: "🌿 TEACHING: `df.query('condition string')` provides a readable alternative to boolean masking. You write conditions as strings using column names directly. It supports `and`, `or`, `not`, and comparison operators. Particularly useful for complex multi-condition filters.\n\nExample: `df.query('expression > 5 and pvalue < 0.05')` finds highly expressed, significant genes.",
            blanks: [{ text: "query", answer: "query", position: 0 }],
            explanation: "`df.query('expression > 10.0')` filters rows where the `expression` column exceeds 10. It's equivalent to `df[df['expression'] > 10.0]` but more readable for complex conditions.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m1-n2-e5",
            type: "code-complete",
            question: "Complete the code to select only the 'gene' and 'expression' columns for rows where expression > 5.",
            hint: "🌿 TEACHING: Chain pandas operations: first filter rows with a boolean mask `df[mask]`, then select columns with `[['col1', 'col2']]`. The double brackets select multiple columns and return a DataFrame (single brackets with one column name return a Series). Order matters: filter first, then select columns.\n\nExample: `df[df['pvalue'] < 0.05][['gene', 'log2fc']]` gets significant gene names and fold changes.",
            codeTemplate: `import pandas as pd

df = pd.read_csv('rna_seq.csv')
mask = df[_____] > 5.0
result = df[mask][[_____, 'expression']]
print(result.head())`,
            codeAnswer: `import pandas as pd

df = pd.read_csv('rna_seq.csv')
mask = df['expression'] > 5.0
result = df[mask][['gene', 'expression']]
print(result.head())`,
            explanation: "`df['expression'] > 5.0` creates the boolean mask. `df[mask]` filters rows. `[['gene', 'expression']]` selects only those two columns. The result is a DataFrame of high-expression genes with just the gene name and expression value.",
            xpReward: 25,
          },
          {
            id: "l2-adv-m1-n2-e6",
            type: "debug-code",
            question: "This `.iloc[]` call has an off-by-one error. Fix it to get the first 3 rows.",
            hint: "🌿 TEACHING: `df.iloc[start:end]` uses Python slice notation — the `end` index is exclusive (not included). So `df.iloc[0:3]` returns rows at positions 0, 1, 2 (the first 3 rows). A common mistake is using `df.iloc[1:3]`, which skips the first row and returns only rows at positions 1 and 2.\n\nExample: `df.iloc[0:5]` is equivalent to `df.head()`.",
            codeTemplate: `import pandas as pd

df = pd.read_csv('genes.csv')
first_three = df.iloc[1:3]
print(first_three)`,
            bugLine: 4,
            bugFix: "first_three = df.iloc[0:3]",
            explanation: "`df.iloc[1:3]` returns rows at positions 1 and 2 (only 2 rows), skipping the first row. `df.iloc[0:3]` correctly returns positions 0, 1, and 2 — the first 3 rows.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l2-adv-m1-n3",
        moduleId: "l2-adv-m1",
        title: "Aggregation & Groupby",
        description: "Group data and compute summaries with .groupby(), .agg(), and .pivot_table()",
        icon: "📊",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m1-n3-e1",
            type: "multiple-choice",
            question: "What does `df.groupby('chromosome')['expression'].mean()` compute?",
            hint: "🌿 TEACHING: `groupby()` splits the DataFrame into groups by unique values in the specified column, then you apply an aggregation function (like `.mean()`, `.sum()`, `.count()`) to each group. The result is a Series or DataFrame indexed by the group values.\n\nExample: `df.groupby('tissue')['expression'].mean()` gives the average expression per tissue type.",
            options: [
              "The mean expression of all genes on chromosome 1 only",
              "The mean expression value for each chromosome group",
              "The total expression summed across all chromosomes",
              "The number of genes on each chromosome",
            ],
            correctIndex: 1,
            explanation: "`groupby('chromosome')` splits the data into one group per chromosome, then `.mean()` computes the mean `expression` for each group. The result maps each chromosome to its mean expression level.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m1-n3-e2",
            type: "multiple-choice",
            question: "What does `.agg()` allow you to do that `.mean()` alone cannot?",
            hint: "🌿 TEACHING: `.agg({'column': ['func1', 'func2']})` lets you apply multiple aggregation functions to different columns simultaneously in a single step. Without `.agg()`, you'd need separate groupby calls for each statistic. This is much more efficient for computing multiple summaries at once.\n\nExample: `df.groupby('treatment').agg({'expression': ['mean', 'std', 'count']})` gives mean, standard deviation, and count per treatment.",
            options: [
              "It runs faster than .mean()",
              "It applies multiple aggregation functions to columns simultaneously",
              "It aggregates only string columns",
              "It removes duplicate rows before aggregating",
            ],
            correctIndex: 1,
            explanation: "`.agg()` lets you apply multiple functions at once: `groupby('chr').agg({'expression': ['mean', 'std'], 'count': 'sum'})` computes mean and std for expression and sum for count — all in one call.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m1-n3-e3",
            type: "fill-blank",
            question: "To group by 'tissue' and compute the mean expression: df.___('tissue')['expression'].mean()",
            hint: "🌿 TEACHING: The `groupby()` method is the heart of pandas aggregation. Pass the column name(s) you want to group by. After groupby, chain an aggregation like `.mean()`, `.sum()`, `.count()`, `.max()`, `.min()`, or `.agg()`. The result has the group keys as the index.\n\nExample: `df.groupby('tissue')['expression'].mean()` returns a Series with tissue names as index and mean expression as values.",
            blanks: [{ text: "groupby", answer: "groupby", position: 0 }],
            explanation: "`df.groupby('tissue')` splits the DataFrame by tissue type. Selecting `['expression']` then calling `.mean()` returns the average expression per tissue — a common summarization in RNA-seq analysis.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m1-n3-e4",
            type: "fill-blank",
            question: "To create a summary table with tissues as rows and statistics as columns, use: pd._____(df, values='expression', index='tissue', aggfunc='mean')",
            hint: "🌿 TEACHING: `pd.pivot_table()` reshapes data like a spreadsheet pivot table. `values` is the column to aggregate, `index` becomes the row labels, `columns` (optional) creates sub-columns, and `aggfunc` specifies the aggregation function. It is especially useful for creating cross-tabulations of biological data.\n\nExample: `pd.pivot_table(df, values='expr', index='tissue', columns='treatment', aggfunc='mean')` shows mean expression per tissue per treatment.",
            blanks: [{ text: "pivot_table", answer: "pivot_table", position: 0 }],
            explanation: "`pd.pivot_table()` creates a spreadsheet-like pivot summary. With `index='tissue'` and `aggfunc='mean'`, it calculates mean expression for each tissue type — a concise summary of your RNA-seq experiment.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m1-n3-e5",
            type: "code-complete",
            question: "Complete the groupby aggregation to get the count and mean expression per chromosome.",
            hint: "🌿 TEACHING: `groupby().agg({'col': ['func1', 'func2']})` computes multiple statistics at once. Pass a dictionary where keys are column names and values are lists of aggregation function names as strings. The result is a DataFrame with a MultiIndex on columns.\n\nExample: `df.groupby('chr').agg({'expression': ['count', 'mean', 'std']})` — three statistics in one step.",
            codeTemplate: `import pandas as pd

df = pd.read_csv('genes.csv')
summary = df.groupby(_____).agg({
    'expression': [_____, 'mean']
})
print(summary)`,
            codeAnswer: `import pandas as pd

df = pd.read_csv('genes.csv')
summary = df.groupby('chromosome').agg({
    'expression': ['count', 'mean']
})
print(summary)`,
            explanation: "`groupby('chromosome')` groups by chromosome. `.agg({'expression': ['count', 'mean']})` computes both the count (number of genes) and mean expression for each chromosome in a single operation.",
            xpReward: 25,
          },
          {
            id: "l2-adv-m1-n3-e6",
            type: "debug-code",
            question: "This `.apply()` usage has a bug — the lambda receives the wrong object. Fix it.",
            hint: "🌿 TEACHING: After `groupby()`, `.apply(func)` passes each group as a DataFrame to `func`. The lambda should operate on a group DataFrame. A common mistake is calling `.apply()` on the full DataFrame without groupby first, or using the wrong column access inside the lambda. Inside the lambda, `g` is a sub-DataFrame for one group.\n\nExample: `df.groupby('tissue').apply(lambda g: g['expression'].max() - g['expression'].min())`",
            codeTemplate: `import pandas as pd

df = pd.read_csv('genes.csv')
# Goal: compute expression range (max - min) per chromosome
ranges = df.groupby('chromosome')['expression'].apply(lambda g: g.max() - g['expression'].min())
print(ranges)`,
            bugLine: 5,
            bugFix: "ranges = df.groupby('chromosome')['expression'].apply(lambda g: g.max() - g.min())",
            explanation: "After `groupby()['expression']`, `.apply()` passes a Series (not a DataFrame) to the lambda. Inside the lambda, `g` is already the expression Series for that chromosome, so use `g.max()` and `g.min()` — not `g['expression'].min()` which would fail on a Series.",
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l2-adv-m2",
    title: "RNA-seq Analysis",
    description: "Understand count normalization, differential expression, and result interpretation",
    realm: 2,
    color: "#52b788",
    nodes: [
      {
        id: "l2-adv-m2-n1",
        moduleId: "l2-adv-m2",
        title: "Count Matrices & Normalization",
        description: "Transform raw read counts to CPM, RPKM, and TPM for fair comparison",
        icon: "🧮",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m2-n1-e1",
            type: "multiple-choice",
            question: "Why do raw RNA-seq read counts need to be normalized before comparing samples?",
            hint: "🌿 TEACHING: Raw counts are affected by two main biases: (1) sequencing depth — samples with more total reads will appear to have higher expression for all genes; (2) gene length — longer genes capture more fragments, inflating their counts. Normalization removes these technical biases so you compare true biological expression differences.\n\nExample: Gene A with 1000 counts in a 10M-read sample ≈ Gene B with 200 counts in a 2M-read sample — both are 0.1 CPM.",
            options: [
              "Normalization is only needed for comparing different species",
              "Raw counts are biased by sequencing depth and gene length, making cross-sample comparison unfair",
              "Normalization converts counts to amino acid sequences",
              "Raw counts are already comparable — normalization is optional",
            ],
            correctIndex: 1,
            explanation: "Raw counts are confounded by sequencing depth (samples with more reads show higher counts for all genes) and gene length (longer genes collect more fragments). Normalization corrects these biases to reveal true biological differences.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m2-n1-e2",
            type: "multiple-choice",
            question: "What does CPM stand for, and what does it normalize for?",
            hint: "🌿 TEACHING: CPM = Counts Per Million. To calculate it, divide each gene's count by the total counts in the sample, then multiply by 1,000,000. CPM normalizes for sequencing depth (total read count) but NOT for gene length. It is used when comparing expression of the same gene across samples.\n\nExample: A gene with 5000 counts in a sample with 10 million total reads has CPM = 5000/10,000,000 × 1,000,000 = 500 CPM.",
            options: [
              "Counts Per Megabase — normalizes for gene length only",
              "Counts Per Million — normalizes for sequencing depth only",
              "Counts Per Mapped read — normalizes for both depth and length",
              "Counts Per Molecule — normalizes for RNA degradation",
            ],
            correctIndex: 1,
            explanation: "CPM (Counts Per Million) divides each gene's count by the total reads in the sample and multiplies by 1,000,000. It removes sequencing depth bias but does not account for gene length differences.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m2-n1-e3",
            type: "fill-blank",
            question: "TPM normalization first divides counts by gene length (in kb) to get _____ per kilobase, then scales to per million.",
            hint: "🌿 TEACHING: TPM (Transcripts Per Million) is calculated in two steps: (1) Divide each gene's raw count by its length in kilobases to get RPK (reads per kilobase). (2) Sum all RPK values, divide each RPK by that sum, multiply by 1,000,000. TPM is preferred over RPKM/FPKM because the sum of all TPM values is always 1 million, making samples directly comparable.\n\nExample: Gene with 200 counts, 2 kb length → RPK = 100. If total RPK = 10000, TPM = (100/10000) × 1,000,000 = 10,000 TPM.",
            blanks: [{ text: "reads", answer: "reads", position: 0 }],
            explanation: "The first step of TPM divides counts by gene length in kilobases to get Reads Per Kilobase (RPK). This normalizes for gene length. The second step then scales by total RPK to normalize for sequencing depth, ensuring all samples sum to 1 million TPM.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m2-n1-e4",
            type: "fill-blank",
            question: "RPKM and FPKM are similar normalizations that correct for both sequencing depth AND gene _____.",
            hint: "🌿 TEACHING: RPKM (Reads Per Kilobase per Million) and FPKM (Fragments Per Kilobase per Million) normalize for two factors: (1) gene length in kilobases (so longer genes don't appear more expressed), and (2) sequencing depth in millions of reads. FPKM is used for paired-end sequencing where two reads come from one fragment.\n\nExample: RPKM = (count × 1e9) / (gene_length_bp × total_mapped_reads).",
            blanks: [{ text: "length", answer: "length", position: 0 }],
            explanation: "RPKM/FPKM normalize for both sequencing depth (per million reads) and gene length (per kilobase). This means longer genes and deeper-sequenced samples don't artificially appear more expressed.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m2-n1-e5",
            type: "code-complete",
            question: "Complete the CPM normalization function that converts a count Series to CPM.",
            hint: "🌿 TEACHING: CPM formula: `CPM = (count / total_counts) × 1,000,000`. In pandas, dividing a Series by a scalar divides every element. `.sum()` gives the total. Multiplying by 1e6 scales to per-million. This is a vectorized operation — no explicit loop needed.\n\nExample: `counts / counts.sum() * 1e6` converts all counts to CPM in one line.",
            codeTemplate: `import pandas as pd

def to_cpm(counts):
    """Convert raw counts Series to CPM."""
    total = counts._____()
    return (counts / _____) * 1e6

# Example usage
raw = pd.Series({'BRCA1': 500, 'TP53': 1200, 'MYC': 300})
print(to_cpm(raw))`,
            codeAnswer: `import pandas as pd

def to_cpm(counts):
    """Convert raw counts Series to CPM."""
    total = counts.sum()
    return (counts / total) * 1e6

# Example usage
raw = pd.Series({'BRCA1': 500, 'TP53': 1200, 'MYC': 300})
print(to_cpm(raw))`,
            explanation: "`counts.sum()` gives total reads in the sample. Dividing each count by the total and multiplying by 1e6 normalizes for sequencing depth. The result is in CPM — comparable across samples with different total read counts.",
            xpReward: 25,
          },
          {
            id: "l2-adv-m2-n1-e6",
            type: "debug-code",
            question: "This TPM normalization has a bug in the second normalization step. Fix it.",
            hint: "🌿 TEACHING: TPM step 1: divide counts by gene length (in kb) to get RPK. Step 2: divide each RPK by the SUM OF ALL RPK values (not by the sum of raw counts), then multiply by 1e6. A common bug is dividing by the wrong total — using `counts.sum()` instead of `rpk.sum()` in step 2.\n\nExample: The scaling factor must be `rpk.sum()` so all TPM values sum to exactly 1 million.",
            codeTemplate: `import pandas as pd

def to_tpm(counts, gene_lengths_kb):
    rpk = counts / gene_lengths_kb
    tpm = (rpk / counts.sum()) * 1e6
    return tpm`,
            bugLine: 5,
            bugFix: "    tpm = (rpk / rpk.sum()) * 1e6",
            explanation: "In TPM, the scaling denominator must be `rpk.sum()` — the sum of reads-per-kilobase values. Using `counts.sum()` (raw counts total) is incorrect and gives wrong results. Dividing by `rpk.sum()` ensures all TPM values across all genes sum to exactly 1,000,000.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l2-adv-m2-n2",
        moduleId: "l2-adv-m2",
        title: "Differential Expression",
        description: "Understand DESeq2 workflow, log-fold change, p-values, and FDR correction",
        icon: "📈",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m2-n2-e1",
            type: "multiple-choice",
            question: "What does a log2 fold change (log2FC) of +2 mean in differential expression analysis?",
            hint: "🌿 TEACHING: Log2 fold change measures how much expression changes between conditions. log2FC = log2(treatment / control). A log2FC of +1 means 2× higher expression (2^1=2). A log2FC of +2 means 4× higher expression (2^2=4). Negative values mean lower expression in the treatment. Using log2 makes up and down changes symmetric.\n\nExample: log2FC = -1 means 2× LOWER in treatment; log2FC = +3 means 8× HIGHER in treatment.",
            options: [
              "The gene is expressed 2× higher in the treatment condition",
              "The gene is expressed 4× higher in the treatment condition",
              "The gene's p-value is 0.01",
              "The gene is expressed 2× lower in the treatment condition",
            ],
            correctIndex: 1,
            explanation: "log2FC = +2 means 2^2 = 4× higher expression in the treatment compared to control. Log2 fold change is used because it makes increases and decreases symmetric: +1 = 2× up, -1 = 2× down.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m2-n2-e2",
            type: "multiple-choice",
            question: "Why is FDR (False Discovery Rate) correction necessary when testing thousands of genes?",
            hint: "🌿 TEACHING: When you run 20,000 statistical tests with p < 0.05 threshold, you expect 0.05 × 20,000 = 1000 false positives just by chance — even if no genes are truly differentially expressed. FDR correction (like Benjamini-Hochberg) adjusts p-values (producing 'adjusted p-values' or q-values) to control the proportion of false discoveries among your significant results.\n\nExample: With FDR < 0.05, you accept that at most 5% of your 'significant' genes are false positives.",
            options: [
              "FDR correction is only needed when sample sizes are small",
              "Testing thousands of genes inflates false positives; FDR controls the proportion of false discoveries",
              "FDR adjusts for gene length biases in the counts",
              "FDR is only used for visualization, not statistical testing",
            ],
            correctIndex: 1,
            explanation: "With 20,000 genes tested at p < 0.05, ~1000 genes would appear significant by pure chance. FDR correction (Benjamini-Hochberg) adjusts p-values so the expected proportion of false discoveries among significant results stays below a set threshold.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m2-n2-e3",
            type: "fill-blank",
            question: "In DESeq2, genes are considered differentially expressed when adjusted p-value (padj) < 0.05 AND |log2FC| > _____.",
            hint: "🌿 TEACHING: Standard DE cutoffs require BOTH statistical significance (padj < 0.05) AND biological significance (minimum fold change). The conventional log2FC threshold is 1, which corresponds to a 2× change. This dual threshold prevents calling statistically significant but biologically trivial changes (like 1.1× differences) as differentially expressed.\n\nExample: a gene with padj = 0.001 but log2FC = 0.1 (1.07× change) is statistically significant but biologically uninteresting.",
            blanks: [{ text: "1", answer: "1", position: 0 }],
            explanation: "The conventional cutoff is |log2FC| > 1 (2× change) combined with padj < 0.05. This ensures genes are both statistically significant AND show meaningful biological change. Using only the p-value cutoff would include tiny, biologically irrelevant changes.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m2-n2-e4",
            type: "fill-blank",
            question: "DESeq2 uses _____ size factors to normalize for differences in sequencing depth between samples.",
            hint: "🌿 TEACHING: DESeq2 estimates a 'size factor' for each sample — the median of the ratios of each gene's count to the geometric mean count across all samples. Dividing each sample's counts by its size factor normalizes for library size differences. This is more robust to outlier genes than simple total-count normalization.\n\nExample: if sample A's size factor is 1.5, all counts in sample A are divided by 1.5, making it comparable to samples with fewer reads.",
            blanks: [{ text: "size", answer: "size", position: 0 }],
            explanation: "DESeq2 estimates a size factor per sample using the median-of-ratios method. Counts are divided by these size factors to normalize for sequencing depth. This is more robust to outlier genes than dividing by total counts.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m2-n2-e5",
            type: "code-complete",
            question: "Complete the code to filter DESeq2 results for significant, up-regulated genes.",
            hint: "🌿 TEACHING: DESeq2 results are typically a DataFrame with columns `log2FoldChange`, `padj`, and `pvalue`. Filter by: (1) `padj < 0.05` for statistical significance, (2) `log2FoldChange > 1` for upregulation with at least 2× change, and (3) drop rows where `padj` is NaN (DESeq2 assigns NaN to outlier or low-count genes).\n\nExample: `results.dropna(subset=['padj'])` removes rows with missing adjusted p-values before filtering.",
            codeTemplate: `import pandas as pd

results = pd.read_csv('deseq2_results.csv', index_col=0)

# Remove genes with NA adjusted p-values
results = results.dropna(subset=[_____])

# Filter: significant (padj<0.05) and upregulated (log2FC>1)
sig_up = results[(results['padj'] < 0.05) & (results[_____] > 1)]
print(f'Significant upregulated genes: {len(sig_up)}')`,
            codeAnswer: `import pandas as pd

results = pd.read_csv('deseq2_results.csv', index_col=0)

# Remove genes with NA adjusted p-values
results = results.dropna(subset=['padj'])

# Filter: significant (padj<0.05) and upregulated (log2FC>1)
sig_up = results[(results['padj'] < 0.05) & (results['log2FoldChange'] > 1)]
print(f'Significant upregulated genes: {len(sig_up)}')`,
            explanation: "`dropna(subset=['padj'])` removes genes where DESeq2 couldn't compute an adjusted p-value (outliers, low counts). The dual filter `(padj < 0.05) & (log2FoldChange > 1)` selects genes that are both statistically significant and biologically upregulated (2× or more).",
            xpReward: 25,
          },
          {
            id: "l2-adv-m2-n2-e6",
            type: "debug-code",
            question: "This code tries to compute -log10 of p-values for a volcano plot but has a division error. Fix it.",
            hint: "🌿 TEACHING: Volcano plots use `-log10(padj)` on the y-axis — larger values mean more significant. In Python, `import numpy as np` then `np.log10(values)` computes log base 10. The negative sign flips the axis so significant genes (tiny p-values like 1e-10) appear at the top. Common bug: using `math.log` (natural log) instead of `np.log10`.\n\nExample: `padj=0.001` → `-log10(0.001)` = 3. `padj=1e-10` → 10. Higher y = more significant.",
            codeTemplate: `import pandas as pd
import numpy as np

results = pd.read_csv('deseq2_results.csv', index_col=0)
results['neg_log10_padj'] = -np.log(results['padj'])
print(results[['log2FoldChange', 'neg_log10_padj']].head())`,
            bugLine: 5,
            bugFix: "results['neg_log10_padj'] = -np.log10(results['padj'])",
            explanation: "`np.log()` computes the natural logarithm (base e), not base 10. Volcano plots use `-log10(padj)` so that p-values like 0.001 map to 3 and 1e-10 maps to 10. Use `np.log10()` to get the correct scale.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l2-adv-m2-n3",
        moduleId: "l2-adv-m2",
        title: "Interpreting Results",
        description: "Read volcano plots, MA plots, heatmaps, and gene ontology enrichment",
        icon: "🌋",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m2-n3-e1",
            type: "multiple-choice",
            question: "In a volcano plot, where do the most interesting (significant and highly changed) genes appear?",
            hint: "🌿 TEACHING: A volcano plot has log2FC on the x-axis and -log10(padj) on the y-axis. Genes that are BOTH highly changed (far left or right) AND highly significant (high on the y-axis) appear in the top-left and top-right corners — like the two peaks of a volcanic eruption. Genes in the center are either not significant or not changing much.\n\nExample: a gene with log2FC = +3 and padj = 1e-15 appears in the top-right corner.",
            options: [
              "In the center of the plot (low fold change, low significance)",
              "In the top-left and top-right corners (high fold change, high significance)",
              "Along the bottom edge (low -log10 p-value)",
              "Along the y-axis (zero fold change)",
            ],
            correctIndex: 1,
            explanation: "The top corners of a volcano plot contain the most biologically interesting genes: top-right = significantly upregulated; top-left = significantly downregulated. Genes near the center have small fold changes or high p-values.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m2-n3-e2",
            type: "multiple-choice",
            question: "What does an MA plot display, and what does a well-normalized dataset look like on one?",
            hint: "🌿 TEACHING: An MA plot shows M (log2 fold change, y-axis) vs A (average log expression, x-axis). The 'A' stands for 'average' expression level. In a well-normalized dataset, the cloud of points should be centered around M=0 (no systematic bias), symmetrically spread above and below. If the cloud is shifted above or below zero, there may be a normalization problem.\n\nExample: if all points cluster above M=0 at low expression levels, it suggests low-count genes are systematically inflated.",
            options: [
              "Mean expression vs standard deviation across replicates",
              "Log fold change (M) vs mean expression (A); well-normalized data centers around M=0",
              "p-value vs gene length for size-factor correction",
              "Sample correlation matrix showing replicate quality",
            ],
            correctIndex: 1,
            explanation: "An MA plot shows M (log2FC, y-axis) vs A (mean expression level, x-axis). In well-normalized data, points center around M=0 without systematic trends. A systematic shift away from zero suggests normalization failed.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m2-n3-e3",
            type: "fill-blank",
            question: "Gene Ontology (GO) enrichment analysis asks whether a set of DE genes is enriched for specific biological _____, molecular functions, or cellular components.",
            hint: "🌿 TEACHING: Gene Ontology (GO) organizes gene functions into three hierarchies: Biological Process (what the gene does in the cell, e.g. 'apoptosis'), Molecular Function (the biochemical activity, e.g. 'kinase activity'), and Cellular Component (where the gene product localizes, e.g. 'nucleus'). Enrichment analysis tests if your DE gene set has more genes from a GO term than expected by chance.\n\nExample: if 30 of your 100 DE genes are involved in 'cell cycle', but only 5% of all genes are cell cycle genes, that enrichment is significant.",
            blanks: [{ text: "processes", answer: "processes", position: 0 }],
            explanation: "GO enrichment tests whether DE genes are over-represented in specific GO terms across three categories: Biological Process (e.g., apoptosis), Molecular Function (e.g., kinase activity), and Cellular Component (e.g., nucleus). Finding enriched GO terms gives biological meaning to a list of DE genes.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m2-n3-e4",
            type: "fill-blank",
            question: "In a heatmap of gene expression, rows typically represent _____ and columns represent samples.",
            hint: "🌿 TEACHING: Expression heatmaps visualize a count matrix where each cell's color encodes expression level. Conventionally, rows are genes and columns are samples. Hierarchical clustering is applied to both rows and columns to group similar genes and similar samples together. This reveals gene modules (groups of co-expressed genes) and sample clusters (e.g., treated vs untreated).\n\nExample: a 50-gene × 20-sample heatmap after DESeq2 shows which genes are upregulated in tumor vs normal samples.",
            blanks: [{ text: "genes", answer: "genes", position: 0 }],
            explanation: "Heatmaps of RNA-seq data conventionally have genes as rows and samples as columns. Colors encode expression level (often row-scaled z-scores). Clustering reveals co-expressed gene modules and separates biological groups.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m2-n3-e5",
            type: "code-complete",
            question: "Complete the code to create a basic volcano plot using matplotlib.",
            hint: "🌿 TEACHING: A volcano plot: x-axis = log2FoldChange, y-axis = -log10(padj). Use `plt.scatter()` for the points, add horizontal and vertical threshold lines with `plt.axhline()` and `plt.axvline()`. Color significant genes differently. Always label axes and add a title so the plot is interpretable.\n\nExample: `plt.scatter(results['log2FoldChange'], results['neg_log10_padj'], alpha=0.5)` creates the basic cloud.",
            codeTemplate: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

results = pd.read_csv('deseq2_results.csv', index_col=0).dropna()
results['neg_log10_padj'] = -np.log10(results['padj'])

plt.scatter(results[_____], results['neg_log10_padj'], alpha=0.4, s=5)
plt.axhline(y=-np.log10(0.05), color='red', linestyle='--')
plt.axvline(x=1, color='blue', linestyle='--')
plt.axvline(x=_____, color='blue', linestyle='--')
plt.xlabel('log2 Fold Change')
plt.ylabel('-log10(adjusted p-value)')
plt.title('Volcano Plot')
plt.show()`,
            codeAnswer: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

results = pd.read_csv('deseq2_results.csv', index_col=0).dropna()
results['neg_log10_padj'] = -np.log10(results['padj'])

plt.scatter(results['log2FoldChange'], results['neg_log10_padj'], alpha=0.4, s=5)
plt.axhline(y=-np.log10(0.05), color='red', linestyle='--')
plt.axvline(x=1, color='blue', linestyle='--')
plt.axvline(x=-1, color='blue', linestyle='--')
plt.xlabel('log2 Fold Change')
plt.ylabel('-log10(adjusted p-value)')
plt.title('Volcano Plot')
plt.show()`,
            explanation: "The x-axis plots `log2FoldChange` and the y-axis plots `-log10(padj)`. The red horizontal line marks padj=0.05 significance. The two blue vertical lines at x=1 and x=-1 mark the 2× fold change threshold for up- and down-regulation.",
            xpReward: 25,
          },
          {
            id: "l2-adv-m2-n3-e6",
            type: "debug-code",
            question: "This code tries to identify top DE genes for a heatmap but selects by raw p-value instead of adjusted p-value. Fix it.",
            hint: "🌿 TEACHING: Always use adjusted p-values (padj, q-values) for selecting significant genes, not raw p-values. Raw p-values don't account for multiple testing — using them would include many false positives. DESeq2 and similar tools produce a `padj` column specifically for this purpose. Always filter on `padj`, not `pvalue`.\n\nExample: `results[results['padj'] < 0.05]` is correct; `results[results['pvalue'] < 0.05]` includes ~5% false positives per test.",
            codeTemplate: `import pandas as pd

results = pd.read_csv('deseq2_results.csv', index_col=0).dropna(subset=['padj'])

# Select top 50 DE genes for heatmap
top_genes = results[results['pvalue'] < 0.05].nlargest(50, 'log2FoldChange')
print(top_genes.index.tolist())`,
            bugLine: 5,
            bugFix: "top_genes = results[results['padj'] < 0.05].nlargest(50, 'log2FoldChange')",
            explanation: "Using `pvalue < 0.05` without multiple testing correction selects many false positives — with 20,000 genes tested, ~1000 would be falsely significant. Using `padj < 0.05` (Benjamini-Hochberg adjusted) ensures the false discovery rate stays below 5%.",
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l2-adv-m3",
    title: "Variant Calling",
    description: "Understand SAM/BAM/VCF file formats, GATK workflows, and population genetics",
    realm: 2,
    color: "#52b788",
    nodes: [
      {
        id: "l2-adv-m3-n1",
        moduleId: "l2-adv-m3",
        title: "SAM/BAM Format",
        description: "Decode the SAM alignment format and understand its key fields",
        icon: "🗂️",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m3-n1-e1",
            type: "multiple-choice",
            question: "What does the CIGAR string '50M2I3M' mean in a SAM record?",
            hint: "🌿 TEACHING: The CIGAR (Compact Idiosyncratic Gapped Alignment Report) string describes how a read aligns to the reference. Key operations: M = match or mismatch (aligned), I = insertion in read (not in reference), D = deletion from read (present in reference), S = soft clip (read bases not aligned). Numbers precede each operation.\n\nExample: '100M' = 100 bases all aligned. '50M2I48M' = 50 aligned, 2 inserted, 48 aligned.",
            options: [
              "50 matched bases, 2 deletions, 3 matched bases",
              "50 matched bases, 2 insertions, 3 matched bases",
              "50 mismatches, 2 insertions, 3 matches",
              "50 bases soft-clipped, 2 insertions, 3 matched",
            ],
            correctIndex: 1,
            explanation: "CIGAR '50M2I3M': 50 bases aligned to reference (M), 2 bases inserted in the read that are not in the reference (I), then 3 more bases aligned (M). The total read length consumed is 50+2+3=55 bases.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m3-n1-e2",
            type: "multiple-choice",
            question: "What is the key difference between SAM and BAM file formats?",
            hint: "🌿 TEACHING: SAM (Sequence Alignment Map) is a human-readable text format — you can open it with `cat` or a text editor. BAM (Binary Alignment Map) is the binary-compressed version of SAM. BAM files are much smaller and can be rapidly indexed (with `samtools index`) for fast random access to specific genomic regions. Most bioinformatics pipelines use BAM.\n\nExample: a SAM file of 10 GB might compress to a 2-3 GB BAM file, and you can query any region instantly with `samtools view`.",
            options: [
              "SAM contains only unmapped reads; BAM contains only mapped reads",
              "SAM is human-readable text; BAM is binary-compressed and indexable",
              "SAM stores quality scores; BAM does not",
              "SAM is for single-end reads; BAM is for paired-end reads",
            ],
            correctIndex: 1,
            explanation: "SAM is a plain-text tab-delimited format, human-readable but large. BAM is the binary compressed equivalent — much smaller and supports fast indexed random access with `samtools index`. Most tools work with BAM.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m3-n1-e3",
            type: "fill-blank",
            question: "In a SAM record, the _____ field (column 4) stores the 1-based leftmost mapping position of the read on the reference.",
            hint: "🌿 TEACHING: SAM fields (tab-delimited): QNAME (read name), FLAG (bitwise alignment flags), RNAME (reference chromosome), POS (1-based start position), MAPQ (mapping quality), CIGAR (alignment description), RNEXT, PNEXT, TLEN, SEQ (read sequence), QUAL (base quality scores). POS tells you WHERE on the chromosome the read aligned.\n\nExample: POS=1000 means the read's first base aligns at position 1000 on the chromosome (1-based indexing).",
            blanks: [{ text: "POS", answer: "POS", position: 0 }],
            explanation: "POS is the 4th field in a SAM record and contains the 1-based genomic coordinate where the read's first aligned base maps. A value of 0 means the read is unmapped.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m3-n1-e4",
            type: "fill-blank",
            question: "The MAPQ (mapping quality) field in SAM encodes the probability that the alignment is WRONG as -10 × log10(_____) rounded to the nearest integer.",
            hint: "🌿 TEACHING: MAPQ = -10 × log10(probability of wrong mapping). MAPQ 60 = probability 1e-6 of wrong alignment (very confident). MAPQ 0 = multimapper (could align equally well to multiple places). In variant calling, reads with MAPQ < 20 are often filtered out because their alignment is uncertain.\n\nExample: MAPQ 30 = 0.001 probability of wrong alignment = 99.9% confident in placement.",
            blanks: [{ text: "p", answer: "p", position: 0 }],
            explanation: "MAPQ = -10 × log10(p), where p is the probability of an incorrect mapping. MAPQ 60 means p = 10^(-6) — very high confidence. Low MAPQ reads (< 20) are usually filtered before variant calling because their alignment location is uncertain.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m3-n1-e5",
            type: "code-complete",
            question: "Complete the code to parse SAM records and extract read names and mapping positions.",
            hint: "🌿 TEACHING: SAM files have two types of lines: header lines starting with `@` (SAM header — skip these), and alignment lines (tab-separated fields). Split each alignment line by `\\t` to get the fields. Field indices (0-based in Python): [0]=QNAME, [1]=FLAG, [2]=RNAME, [3]=POS, [4]=MAPQ, [5]=CIGAR, [9]=SEQ, [10]=QUAL.\n\nExample: `fields = line.split('\\t'); qname, pos = fields[0], fields[3]`.",
            codeTemplate: `def parse_sam_positions(sam_file):
    positions = []
    with open(sam_file, 'r') as f:
        for line in f:
            if line.startswith(_____):  # skip header lines
                continue
            fields = line.strip().split(_____)
            qname = fields[0]
            pos = int(fields[3])
            positions.append((qname, pos))
    return positions`,
            codeAnswer: `def parse_sam_positions(sam_file):
    positions = []
    with open(sam_file, 'r') as f:
        for line in f:
            if line.startswith('@'):  # skip header lines
                continue
            fields = line.strip().split('\t')
            qname = fields[0]
            pos = int(fields[3])
            positions.append((qname, pos))
    return positions`,
            explanation: "SAM header lines start with `'@'` — we skip them with `continue`. Alignment lines are tab-delimited: `split('\\t')` gives a list of fields. `fields[0]` is QNAME (read name), `fields[3]` is POS (mapping position, 1-based, stored as a string — convert to `int`).",
            xpReward: 25,
          },
          {
            id: "l2-adv-m3-n1-e6",
            type: "debug-code",
            question: "This SAM FLAG parser has an off-by-one error in field indexing. Fix it to extract the FLAG field correctly.",
            hint: "🌿 TEACHING: SAM fields in order (1-based in the spec, 0-based in Python lists): [0]=QNAME, [1]=FLAG, [2]=RNAME, [3]=POS, [4]=MAPQ, [5]=CIGAR, [6]=RNEXT, [7]=PNEXT, [8]=TLEN, [9]=SEQ, [10]=QUAL. The FLAG is the SECOND field (index 1 in Python). It is a bitwise integer encoding alignment properties.\n\nExample: FLAG=16 means the read mapped to the reverse strand. FLAG=4 means unmapped.",
            codeTemplate: `def get_flag(sam_line):
    fields = sam_line.strip().split('\\t')
    flag = int(fields[0])  # FLAG field
    return flag`,
            bugLine: 3,
            bugFix: "    flag = int(fields[1])  # FLAG field",
            explanation: "SAM fields are 0-indexed in Python. `fields[0]` is QNAME (the read name). The FLAG field is the second column, so it must be `fields[1]`. Using `fields[0]` would try to convert the read name string to an integer, causing a ValueError.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l2-adv-m3-n2",
        moduleId: "l2-adv-m3",
        title: "VCF Format & GATK",
        description: "Decode VCF columns, understand GATK HaplotypeCaller, and filter variants",
        icon: "🧬",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m3-n2-e1",
            type: "multiple-choice",
            question: "In a VCF file, what does the REF column contain?",
            hint: "🌿 TEACHING: VCF (Variant Call Format) columns in order: CHROM (chromosome), POS (1-based position), ID (variant ID, often rsID from dbSNP or '.'), REF (reference allele at that position), ALT (alternative allele found in this sample), QUAL (variant quality score), FILTER (PASS or reason for filtering), INFO (annotations), FORMAT (describes the sample fields), then one column per sample.\n\nExample: CHROM=chr17, POS=41234450, REF=A, ALT=T means at position 41234450 on chr17, the reference has A but this sample has T.",
            options: [
              "The read depth at that position",
              "The reference genome allele at the variant position",
              "The mapping quality of supporting reads",
              "The rsID from the dbSNP database",
            ],
            correctIndex: 1,
            explanation: "REF is the reference genome base (or bases) at the variant position. ALT is the alternative allele found in the sample. Comparing REF and ALT tells you what changed: e.g., REF=A, ALT=T is an A→T single nucleotide variant.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m3-n2-e2",
            type: "multiple-choice",
            question: "What does GATK HaplotypeCaller do that distinguishes it from simpler variant callers?",
            hint: "🌿 TEACHING: HaplotypeCaller uses local de novo assembly in active regions — it reassembles short reads into longer haplotypes around candidate variants, then re-aligns reads to those haplotypes. This approach is more accurate for calling SNPs near indels and for complex regions where simple pileup-based callers fail. It also models genotype likelihoods across multiple alleles simultaneously.\n\nExample: Near a 3-bp insertion, reads may misalign by 3 positions. HaplotypeCaller's reassembly correctly aligns them before calling variants.",
            options: [
              "It counts how many reads cover each position",
              "It performs local de novo assembly to call variants with higher accuracy",
              "It removes PCR duplicates before calling variants",
              "It aligns reads to the reference genome",
            ],
            correctIndex: 1,
            explanation: "HaplotypeCaller performs local de novo assembly in active genomic regions, reconstructing haplotypes and then realigning reads to them. This makes it more accurate than pileup-based callers, especially in complex regions with nearby indels.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m3-n2-e3",
            type: "fill-blank",
            question: "In a VCF record, the FILTER column contains 'PASS' if the variant passed all filters, or a _____ if it failed.",
            hint: "🌿 TEACHING: The FILTER column in VCF records the quality control status of each variant. 'PASS' means all filters passed. If a variant fails, the column contains a semicolon-separated list of filter names that failed (these filters are defined in the VCF header with ##FILTER lines). Common GATK filters: 'LowQual', 'VQSRTrancheSNP99.00to99.90'.\n\nExample: FILTER=LowQual means the variant's quality score was below the threshold.",
            blanks: [{ text: "filter name", answer: "filter name", position: 0 }],
            explanation: "The FILTER column is either 'PASS' (variant is high quality) or contains the name(s) of filters the variant failed. Hard-filtering in GATK sets filter names based on quality metric thresholds. Failed variants should generally be excluded from analysis.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m3-n2-e4",
            type: "fill-blank",
            question: "The INFO field in VCF is a semicolon-separated list of key=value annotations. The field 'DP=48' records the total _____ at the variant position.",
            hint: "🌿 TEACHING: The INFO field packs variant-level annotations as `KEY=VALUE` pairs separated by semicolons. Common annotations: DP = total read Depth, AF = Allele Frequency, MQ = Mapping Quality, BaseQRankSum = base quality rank-sum test. Some flags have no value (e.g., `DB` means the variant is in dbSNP).\n\nExample: `DP=48;AF=0.5;MQ=58.5` means 48 reads cover this position, allele frequency is 0.5, and mean mapping quality is 58.5.",
            blanks: [{ text: "read depth", answer: "read depth", position: 0 }],
            explanation: "DP in the INFO field records total read depth (how many reads cover the variant position). Higher depth generally means higher confidence in the variant call. DP=48 means 48 reads were used to call this variant.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m3-n2-e5",
            type: "code-complete",
            question: "Complete the VCF parser that extracts CHROM, POS, REF, and ALT fields from non-header lines.",
            hint: "🌿 TEACHING: VCF files begin with metadata lines starting with `##`, then one header line starting with `#CHROM`, then data lines (one variant per line, tab-delimited). Skip `#` lines. In data lines: index [0]=CHROM, [1]=POS, [2]=ID, [3]=REF, [4]=ALT, [5]=QUAL, [6]=FILTER, [7]=INFO.\n\nExample: `fields = line.split('\\t'); chrom, pos, ref, alt = fields[0], fields[1], fields[3], fields[4]`.",
            codeTemplate: `def parse_vcf(vcf_file):
    variants = []
    with open(vcf_file, 'r') as f:
        for line in f:
            if line.startswith(_____):  # skip header and meta lines
                continue
            fields = line.strip().split('\\t')
            chrom = fields[0]
            pos = int(fields[_____])
            ref = fields[3]
            alt = fields[4]
            variants.append((chrom, pos, ref, alt))
    return variants`,
            codeAnswer: `def parse_vcf(vcf_file):
    variants = []
    with open(vcf_file, 'r') as f:
        for line in f:
            if line.startswith('#'):  # skip header and meta lines
                continue
            fields = line.strip().split('\t')
            chrom = fields[0]
            pos = int(fields[1])
            ref = fields[3]
            alt = fields[4]
            variants.append((chrom, pos, ref, alt))
    return variants`,
            explanation: "VCF header and metadata lines all start with `#`. Skipping them with `startswith('#')` leaves only variant data lines. Fields are tab-delimited: index 0=CHROM, 1=POS, 3=REF, 4=ALT. POS is a string in the file — convert with `int()` for numeric comparisons.",
            xpReward: 25,
          },
          {
            id: "l2-adv-m3-n2-e6",
            type: "debug-code",
            question: "This code tries to filter VCF variants to only 'PASS' variants but has a string comparison bug. Fix it.",
            hint: "🌿 TEACHING: The VCF FILTER field is at index 6 (0-based) in tab-split fields. 'PASS' must be matched exactly as the string `'PASS'`. A common bug is using `.strip()` inconsistently or comparing to the wrong field index. Trailing whitespace or newlines in the field value will also cause the comparison to fail.\n\nExample: `fields[6].strip() == 'PASS'` correctly handles trailing whitespace.",
            codeTemplate: `def get_pass_variants(vcf_file):
    pass_variants = []
    with open(vcf_file, 'r') as f:
        for line in f:
            if line.startswith('#'):
                continue
            fields = line.strip().split('\\t')
            if fields[5] == 'PASS':  # FILTER field
                pass_variants.append(fields)
    return pass_variants`,
            bugLine: 8,
            bugFix: "            if fields[6] == 'PASS':  # FILTER field",
            explanation: "The FILTER field is the 7th column (index 6, 0-based): CHROM[0], POS[1], ID[2], REF[3], ALT[4], QUAL[5], FILTER[6]. Using `fields[5]` checks the QUAL score (a number) for equality with 'PASS', which never matches. Fix to `fields[6]`.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "l2-adv-m3-n3",
        moduleId: "l2-adv-m3",
        title: "Population Genetics",
        description: "Understand MAF, Hardy-Weinberg equilibrium, SNP vs INDEL, and population stratification",
        icon: "🌍",
        xpReward: 120,
        exercises: [
          {
            id: "l2-adv-m3-n3-e1",
            type: "multiple-choice",
            question: "What is the Minor Allele Frequency (MAF) of a variant found in 30 out of 200 chromosomes?",
            hint: "🌿 TEACHING: MAF = the frequency of the less common allele at a variant site in the population. Calculate: count of minor allele copies / total chromosome copies. In a diploid population of N individuals, there are 2N chromosome copies. A common SNP has MAF > 5% (> 0.05); rare variants have MAF < 1% (< 0.01).\n\nExample: 30 copies of the minor allele out of 200 total chromosomes → MAF = 30/200 = 0.15 = 15%.",
            options: ["5%", "10%", "15%", "30%"],
            correctIndex: 2,
            explanation: "MAF = 30/200 = 0.15 = 15%. The minor allele appears in 30 of the 200 chromosome copies examined. MAF ranges from 0 (extremely rare) to 0.5 (equally common as major allele).",
            xpReward: 15,
          },
          {
            id: "l2-adv-m3-n3-e2",
            type: "multiple-choice",
            question: "What does it mean when a variant site is NOT in Hardy-Weinberg Equilibrium (HWE)?",
            hint: "🌿 TEACHING: Hardy-Weinberg Equilibrium (HWE) predicts genotype frequencies from allele frequencies in a large, randomly mating population with no selection, mutation, migration, or drift. Expected genotype frequencies: AA = p², Aa = 2pq, aa = q² (where p+q=1). A significant HWE deviation often indicates genotyping errors, population stratification, or strong selection at that locus.\n\nExample: if you observe far more homozygotes (AA and aa) than expected under HWE, it may indicate a genotyping error (allelic dropout) in your sequencing assay.",
            options: [
              "The variant is definitely pathogenic",
              "The variant may have genotyping errors, strong selection, or population stratification",
              "The variant is in perfect balance between alleles",
              "The variant is too rare to be analyzed",
            ],
            correctIndex: 1,
            explanation: "HWE deviation suggests non-random processes at work: genotyping error (most common in GWAS QC), strong selection, assortative mating, or population stratification. Variants with extreme HWE deviation are typically excluded in GWAS quality control.",
            xpReward: 15,
          },
          {
            id: "l2-adv-m3-n3-e3",
            type: "fill-blank",
            question: "An insertion or deletion of one or more bases (compared to the reference) is called an _____.",
            hint: "🌿 TEACHING: Genetic variants are classified by type: SNP (Single Nucleotide Polymorphism) = a single base change, e.g., A→T. INDEL = insertion or deletion of one or more bases — the number of bases inserted or deleted determines the length. Small indels (1-50 bp) are common in VCF files. Indels in coding regions can cause frameshift mutations if not divisible by 3.\n\nExample: REF=ACG, ALT=ACGG is a 1-base insertion (INDEL). REF=ACGT, ALT=ACT is a 1-base deletion (INDEL).",
            blanks: [{ text: "INDEL", answer: "INDEL", position: 0 }],
            explanation: "INDEL (Insertion-Deletion) refers to variants where bases are inserted into or deleted from the genome relative to the reference. INDELs in coding regions often cause frameshifts, making them particularly impactful mutations.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m3-n3-e4",
            type: "fill-blank",
            question: "Population _____ occurs when a study sample contains subgroups with different ancestry, causing spurious variant-disease associations.",
            hint: "🌿 TEACHING: Population stratification is a major confounder in genome-wide association studies (GWAS). If your study includes individuals of mixed ancestries, allele frequencies differ between subgroups — and if disease prevalence also differs between subgroups, you get false associations. Principal Component Analysis (PCA) of genotype data is the standard method to detect and correct for stratification.\n\nExample: if European ancestry individuals are more likely to have both a variant AND the disease (due to separate causes), that variant appears associated with the disease even if there's no biological relationship.",
            blanks: [{ text: "stratification", answer: "stratification", position: 0 }],
            explanation: "Population stratification occurs when ancestry differences confound variant-disease associations. GWAS studies correct for it by including principal components of the genotype matrix as covariates in the association model.",
            xpReward: 20,
          },
          {
            id: "l2-adv-m3-n3-e5",
            type: "code-complete",
            question: "Complete the function that calculates Minor Allele Frequency (MAF) from a list of genotypes.",
            hint: "🌿 TEACHING: Given diploid genotypes as strings like '0/0' (homozygous ref), '0/1' (heterozygous), '1/1' (homozygous alt): count alleles by splitting each genotype on '/' and summing. Total alleles = 2 × number of genotypes. Minor allele count = sum of '1' alleles. MAF = minor_count / total_alleles. If MAF > 0.5, subtract from 1 (we want the MINOR frequency).\n\nExample: genotypes = ['0/1', '0/0', '1/1'] → allele counts: 1+0+2=3 alt alleles out of 6 total → MAF = 0.5.",
            codeTemplate: `def calculate_maf(genotypes):
    """genotypes: list of strings like '0/0', '0/1', '1/1'"""
    total_alleles = len(genotypes) * _____
    alt_count = sum(
        gt.split('/').count(_____)
        for gt in genotypes
    )
    maf = alt_count / total_alleles
    return min(maf, 1 - maf)  # return the minor (smaller) frequency`,
            codeAnswer: `def calculate_maf(genotypes):
    """genotypes: list of strings like '0/0', '0/1', '1/1'"""
    total_alleles = len(genotypes) * 2
    alt_count = sum(
        gt.split('/').count('1')
        for gt in genotypes
    )
    maf = alt_count / total_alleles
    return min(maf, 1 - maf)  # return the minor (smaller) frequency`,
            explanation: "Each diploid individual has 2 alleles, so `len(genotypes) * 2` gives total alleles. `gt.split('/').count('1')` counts alt alleles in each genotype. `min(maf, 1-maf)` returns the minor (less common) frequency, which may be the ref or alt allele.",
            xpReward: 25,
          },
          {
            id: "l2-adv-m3-n3-e6",
            type: "debug-code",
            question: "This Hardy-Weinberg test has a bug — it computes expected heterozygote frequency incorrectly. Fix it.",
            hint: "🌿 TEACHING: Hardy-Weinberg expected frequencies: if p = freq(A allele) and q = freq(a allele), where p+q=1, then: homozygous AA = p², heterozygous Aa = 2pq, homozygous aa = q². The heterozygote frequency is 2pq (NOT p*q alone). Forgetting the factor of 2 is the classic HWE calculation mistake.\n\nExample: p=0.7, q=0.3 → expected heterozygotes = 2 × 0.7 × 0.3 = 0.42, NOT 0.7 × 0.3 = 0.21.",
            codeTemplate: `def hwe_expected_het(p):
    """p = major allele frequency, returns expected heterozygote frequency"""
    q = 1 - p
    expected_het = p * q  # Hardy-Weinberg formula
    return expected_het`,
            bugLine: 4,
            bugFix: "    expected_het = 2 * p * q  # Hardy-Weinberg formula",
            explanation: "Hardy-Weinberg heterozygote frequency = 2pq, not pq. The factor of 2 accounts for two ways to be heterozygous (inheriting A from parent 1 and a from parent 2, OR a from parent 1 and A from parent 2). Without the 2, you underestimate expected heterozygosity by half.",
            xpReward: 25,
          },
        ],
      },
    ],
  },
];

export default modules;
