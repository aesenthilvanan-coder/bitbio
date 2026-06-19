'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import GameHUD from '@/components/layout/GameHUD';
import { useGameStore } from '@/lib/store';
import { LEVELS } from '@/lib/curriculum';

interface CodexEntry {
  id: string;
  title: string;
  category: string;
  realm: 1 | 2 | 3 | 4;
  summary: string;
  detail: string;
  icon: string;
  color: string;
  unlockedBy: string; // node ID that unlocks this
}

const REALM_COLORS: Record<number, string> = {
  1: '#00ffcc', 2: '#52b788', 3: '#a855f7', 4: '#c0a0ff',
};

const CODEX_ENTRIES: CodexEntry[] = [
  // Realm 1
  { id: 'cx-cell', title: 'The Cell', category: 'Cell Biology', realm: 1, icon: '🔬', color: '#00ffcc',
    summary: 'The fundamental unit of life, enclosed by a plasma membrane.',
    detail: 'Every living organism is made of one or more cells. The cell membrane separates the interior from the environment using a phospholipid bilayer that is simultaneously impermeable to most things yet actively transports what it needs.',
    unlockedBy: 'l1-m1-n1' },
  { id: 'cx-atp', title: 'ATP: The Energy Currency', category: 'Metabolism', realm: 1, icon: '⚡', color: '#f59e0b',
    summary: 'Adenosine triphosphate — the universal energy carrier of life.',
    detail: 'One glucose molecule yields approximately 30-32 ATP through glycolysis, the citric acid cycle, and oxidative phosphorylation. The proton gradient across the inner mitochondrial membrane powers ATP synthase like a molecular turbine.',
    unlockedBy: 'l1-m1-n2' },
  { id: 'cx-membrane', title: 'Membrane Dynamics', category: 'Cell Biology', realm: 1, icon: '🧫', color: '#00ffcc',
    summary: 'The fluid mosaic model — proteins float in a lipid sea.',
    detail: 'The Singer-Nicolson fluid mosaic model (1972) describes the membrane as a 2D liquid where proteins diffuse laterally. Cholesterol modulates fluidity. Membrane asymmetry is maintained by flippases and scramblases.',
    unlockedBy: 'l1-m2-n1' },
  { id: 'cx-dna-replication', title: 'DNA Replication', category: 'Genetics', realm: 1, icon: '🧬', color: '#00ffcc',
    summary: 'Semi-conservative replication by DNA polymerase at the replication fork.',
    detail: 'Helicase unwinds the double helix. Primase lays RNA primers. DNA Pol III synthesizes the leading strand continuously and the lagging strand in Okazaki fragments. DNA Pol I removes primers, ligase seals nicks.',
    unlockedBy: 'l1-m2-n2' },
  { id: 'cx-mitosis', title: 'Mitosis', category: 'Cell Biology', realm: 1, icon: '🔄', color: '#39ff14',
    summary: 'Prophase → Metaphase → Anaphase → Telophase → Cytokinesis.',
    detail: 'Checkpoints (G1/S, G2/M, spindle assembly) prevent damaged or misaligned chromosomes from progressing. p53 and Rb are key tumor suppressors that enforce these checkpoints.',
    unlockedBy: 'l1-m3-n1' },

  // Realm 2
  { id: 'cx-double-helix', title: 'The Double Helix', category: 'Genomics', realm: 2, icon: '🧬', color: '#52b788',
    summary: 'Watson, Crick, Wilkins, and Franklin\'s B-form DNA structure.',
    detail: 'Rosalind Franklin\'s X-ray diffraction Photo 51 was the critical data that revealed the helical structure. The molecule has a major groove (wide, easily read by proteins) and a minor groove, with base pairs A-T and G-C held together by hydrogen bonds.',
    unlockedBy: 'l2-m1-n1' },
  { id: 'cx-pcr', title: 'PCR', category: 'Genomics', realm: 2, icon: '🔬', color: '#52b788',
    summary: 'Polymerase Chain Reaction — amplifying DNA exponentially.',
    detail: 'Kary Mullis conceived PCR while driving on Highway 128 in Mendocino County. 30 cycles amplify one molecule to 1 billion copies. Taq polymerase from Thermus aquaticus survives the 95°C denaturation step.',
    unlockedBy: 'l2-m1-n2' },
  { id: 'cx-blast', title: 'BLAST', category: 'Bioinformatics', realm: 2, icon: '💻', color: '#22c55e',
    summary: 'Basic Local Alignment Search Tool — finding sequence homologs.',
    detail: 'BLAST uses a heuristic approach: it finds short exact matches (words), then extends them. The E-value (expect value) tells you how many random sequences would produce this alignment by chance. E < 0.001 is generally significant.',
    unlockedBy: 'l2-m2-n1' },
  { id: 'cx-crispr', title: 'CRISPR-Cas9', category: 'Genomics', realm: 2, icon: '✂️', color: '#52b788',
    summary: 'Bacterial adaptive immunity repurposed as a genome editor.',
    detail: 'Cas9 is guided by a 20-nucleotide guide RNA to its target. The PAM sequence (NGG for SpCas9) is required. HDR enables precise edits; NHEJ creates indels. Base editors and prime editors expand the toolkit further.',
    unlockedBy: 'l2-m2-n2' },
  { id: 'cx-rna-seq', title: 'RNA-seq', category: 'Bioinformatics', realm: 2, icon: '📊', color: '#22c55e',
    summary: 'Quantifying gene expression across the entire transcriptome.',
    detail: 'RNA is reverse-transcribed to cDNA, fragmented, and sequenced. DESeq2 and edgeR normalize for library size using negative binomial models. Single-cell RNA-seq (scRNA-seq) adds cell-level resolution.',
    unlockedBy: 'l2-m3-n1' },

  // Realm 3
  { id: 'cx-p-value', title: 'P-values & Multiple Testing', category: 'Statistics', realm: 3, icon: '📈', color: '#a855f7',
    summary: 'A p-value is NOT the probability your hypothesis is true.',
    detail: 'p < 0.05 means: if H0 is true, this result or more extreme would occur less than 5% of the time. Bonferroni correction multiplies p-values by the number of tests. FDR (Benjamini-Hochberg) is often preferred.',
    unlockedBy: 'l3-m1-n1' },
  { id: 'cx-gradient-descent', title: 'Gradient Descent', category: 'Machine Learning', realm: 3, icon: '⬇️', color: '#a855f7',
    summary: 'Minimize loss by iteratively following the negative gradient.',
    detail: 'SGD updates weights using one sample at a time. Mini-batch SGD is the practical compromise. Adam optimizer uses adaptive learning rates based on moment estimates. Learning rate is the most important hyperparameter.',
    unlockedBy: 'l3-m1-n2' },
  { id: 'cx-attention', title: 'Attention Mechanism', category: 'Deep Learning', realm: 3, icon: '🔦', color: '#7c3aed',
    summary: 'Query-key-value attention that lets models focus dynamically.',
    detail: 'Self-attention computes Q, K, V from the same sequence. Scaled dot-product attention: softmax(QK^T/√d_k)V. Multi-head attention runs multiple attention heads in parallel, each learning different relationships.',
    unlockedBy: 'l3-m2-n1' },
  { id: 'cx-backprop', title: 'Backpropagation', category: 'Deep Learning', realm: 3, icon: '↩️', color: '#a855f7',
    summary: 'Chain rule applied recursively through a computational graph.',
    detail: 'Each node stores its local gradient during forward pass. Backward pass propagates error gradients via chain rule: ∂L/∂w = ∂L/∂y · ∂y/∂w. Vanishing gradients in deep networks → ReLU, batch norm, skip connections.',
    unlockedBy: 'l3-m2-n2' },
  { id: 'cx-regularization', title: 'Regularization', category: 'Machine Learning', realm: 3, icon: '⚖️', color: '#a855f7',
    summary: 'Preventing overfitting by penalizing model complexity.',
    detail: 'L1 (Lasso) promotes sparsity. L2 (Ridge) shrinks weights. Dropout randomly zeroes activations during training. Data augmentation is the most powerful regularizer when you have enough compute.',
    unlockedBy: 'l3-m3-n1' },

  // Realm 4
  { id: 'cx-protein-folding', title: 'Protein Folding', category: 'Structural Biology', realm: 4, icon: '🔮', color: '#c0a0ff',
    summary: 'The process by which a polypeptide achieves its 3D native state.',
    detail: 'Anfinsen\'s dogma: the native state is determined solely by the amino acid sequence. Folding proceeds via a funnel-shaped energy landscape. Chaperones (Hsp70, Hsp90) prevent misfolding in the cell.',
    unlockedBy: 'l4-m1-n1' },
  { id: 'cx-alphafold', title: 'AlphaFold 2', category: 'Computational Biology', realm: 4, icon: '🤖', color: '#c0a0ff',
    summary: 'DeepMind\'s transformer-based protein structure predictor.',
    detail: 'AlphaFold 2 uses an Evoformer module to process multiple sequence alignments (MSAs), capturing coevolutionary signals. The structure module uses Invariant Point Attention. pLDDT confidence scores guide interpretation.',
    unlockedBy: 'l4-m1-n2' },
  { id: 'cx-drug-design', title: 'Structure-Based Drug Design', category: 'Drug Discovery', realm: 4, icon: '💊', color: '#c0a0ff',
    summary: 'Using protein structure to guide small molecule design.',
    detail: 'Virtual screening docks millions of compounds into a binding pocket computationally. Lipinski\'s Rule of Five predicts oral bioavailability. ADMET (absorption, distribution, metabolism, excretion, toxicity) determines drug-likeness.',
    unlockedBy: 'l4-m2-n1' },
  { id: 'cx-multiomics', title: 'Multi-omics Integration', category: 'Systems Biology', realm: 4, icon: '🔗', color: '#c0a0ff',
    summary: 'Combining genomics, transcriptomics, proteomics, and metabolomics.',
    detail: 'MOFA (Multi-Omics Factor Analysis) learns shared latent factors across data types. Integration challenges include batch effects, missing data, and scale differences. The goal is systems-level understanding of disease.',
    unlockedBy: 'l4-m2-n2' },
  { id: 'cx-gnn', title: 'Graph Neural Networks', category: 'Deep Learning', realm: 4, icon: '🕸️', color: '#c0a0ff',
    summary: 'Neural networks that operate directly on graph-structured data.',
    detail: 'Molecules are naturally represented as graphs. GNNs aggregate information from neighbors iteratively. Message passing: h_v^(l+1) = UPDATE(h_v^l, AGGREGATE({h_u^l : u ∈ N(v)})). Used in AlphaFold, drug discovery, protein interaction prediction.',
    unlockedBy: 'l4-m3-n1' },
];

export default function CodexPage() {
  const { progress } = useGameStore();
  const [activeRealm, setActiveRealm] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [selected, setSelected] = useState<CodexEntry | null>(null);
  const [search, setSearch] = useState('');

  const unlockedNodeIds = new Set(
    Object.keys(progress.completedNodes).filter((id) => progress.completedNodes[id].completed)
  );

  const visible = useMemo(() => {
    return CODEX_ENTRIES.filter((e) => {
      const unlocked = unlockedNodeIds.has(e.unlockedBy);
      const realmMatch = activeRealm === 'all' || e.realm === activeRealm;
      const searchMatch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
      return unlocked && realmMatch && searchMatch;
    });
  }, [activeRealm, search, progress.completedNodes]);

  const locked = CODEX_ENTRIES.filter((e) => !unlockedNodeIds.has(e.unlockedBy));

  return (
    <div style={{ minHeight: '100vh', background: '#08080e', paddingTop: 56 }}>
      <GameHUD />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <Link href="/realm/1" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#444', textDecoration: 'none', display: 'block', marginBottom: 8 }}>← BACK</Link>
            <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: '#00ffcc', textShadow: '0 0 10px #00ffcc66', margin: 0 }}>CODEX</h1>
            <p style={{ color: '#555', fontSize: 11, margin: '6px 0 0' }}>Complete lessons to unlock entries.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#39ff14' }}>
              {visible.length + (activeRealm === 'all' && !search ? 0 : 0)}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#555' }}>
              / {CODEX_ENTRIES.length} ENTRIES
            </div>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: '#0a0a0a',
            border: '2px solid #333',
            color: '#ccc',
            fontFamily: 'monospace',
            fontSize: 12,
            marginBottom: 16,
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />

        {/* Realm filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['all', 1, 2, 3, 4] as const).map((r) => {
            const color = r === 'all' ? '#888' : REALM_COLORS[r];
            return (
              <button
                key={r}
                onClick={() => setActiveRealm(r)}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  padding: '7px 14px',
                  background: activeRealm === r ? color + '22' : 'transparent',
                  border: `2px solid ${activeRealm === r ? color : '#333'}`,
                  color: activeRealm === r ? color : '#555',
                  cursor: 'pointer',
                }}
              >
                {r === 'all' ? 'ALL' : `REALM ${r}`}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 16 }}>
          {/* Entry grid */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {visible.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
                  style={{
                    background: selected?.id === entry.id ? entry.color + '11' : '#0a0a0a',
                    border: `2px solid ${selected?.id === entry.id ? entry.color : entry.color + '44'}`,
                    padding: 14,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: selected?.id === entry.id ? `0 0 12px ${entry.color}33` : 'none',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>{entry.icon}</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: entry.color, marginBottom: 4, textAlign: 'center' }}>
                    {entry.title}
                  </div>
                  <div style={{ fontSize: 10, color: '#555', textAlign: 'center' }}>{entry.category}</div>
                </div>
              ))}

              {/* Locked entries */}
              {!search && locked.filter((e) => activeRealm === 'all' || e.realm === activeRealm).map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: '#080808',
                    border: '2px solid #1a1a1a',
                    padding: 14,
                    opacity: 0.5,
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8, textAlign: 'center', filter: 'grayscale(1)' }}>🔒</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#333', textAlign: 'center' }}>???</div>
                  <div style={{ fontSize: 9, color: '#2a2a2a', textAlign: 'center', marginTop: 4 }}>Complete lessons to unlock</div>
                </div>
              ))}
            </div>

            {visible.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#333' }}>
                {search ? 'NO ENTRIES FOUND' : 'COMPLETE LESSONS TO UNLOCK ENTRIES'}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{
              background: '#0a0a0a',
              border: `2px solid ${selected.color}66`,
              padding: 20,
              position: 'sticky',
              top: 72,
              alignSelf: 'start',
            }}>
              <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>{selected.icon}</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: selected.color, marginBottom: 4, textAlign: 'center' }}>
                {selected.title}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#555', textAlign: 'center', marginBottom: 16 }}>
                {selected.category} — REALM {selected.realm}
              </div>
              <div style={{ height: 1, background: selected.color + '33', marginBottom: 14 }} />
              <p style={{ fontSize: 12, color: '#aaa', lineHeight: 1.6, marginBottom: 12 }}>{selected.summary}</p>
              <p style={{ fontSize: 11, color: '#666', lineHeight: 1.7 }}>{selected.detail}</p>
              <button
                onClick={() => setSelected(null)}
                style={{
                  marginTop: 16,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6,
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#444',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
