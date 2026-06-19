'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import GameHUD from '@/components/layout/GameHUD';
import { useGameStore } from '@/lib/store';

interface ResearchNode {
  id: string;
  title: string;
  description: string;
  cost: number; // XP cost
  prereqs: string[];
  x: number; // 0-1
  y: number; // 0-1
  lore: string;
}

const RESEARCH_TREES: Record<number, { color: string; name: string; nodes: ResearchNode[] }> = {
  1: {
    color: '#00ffcc',
    name: 'CYTOPLASM',
    nodes: [
      { id: 'r1-cell-theory', title: 'Cell Theory', description: 'All living things are made of cells.', cost: 200, prereqs: [], x: 0.5, y: 0.1, lore: 'Schleiden and Schwann figured this out with just a light microscope. Imagine what they would have done with a confocal.' },
      { id: 'r1-membrane', title: 'Membrane Dynamics', description: 'Fluid mosaic model & selective permeability.', cost: 300, prereqs: ['r1-cell-theory'], x: 0.25, y: 0.35, lore: 'The membrane is not a wall. It is a conversation.' },
      { id: 'r1-atp', title: 'ATP Synthesis', description: 'Chemiosmosis and the F1F0 ATP synthase motor.', cost: 400, prereqs: ['r1-cell-theory'], x: 0.75, y: 0.35, lore: 'The proton gradient is one of evolution\'s oldest tricks. It still works.' },
      { id: 'r1-signals', title: 'Signal Cascades', description: 'GPCR pathways, second messengers, kinase networks.', cost: 500, prereqs: ['r1-membrane', 'r1-atp'], x: 0.35, y: 0.6, lore: 'One hormone. A billion cellular responses. Evolution loves a leverage point.' },
      { id: 'r1-cycle', title: 'Cell Cycle', description: 'G1/S/G2/M phases, checkpoints, and cyclins.', cost: 500, prereqs: ['r1-membrane', 'r1-atp'], x: 0.65, y: 0.6, lore: 'The cell cycle is democracy and tyranny at once. Most cells know when to stop.' },
      { id: 'r1-expression', title: 'Gene Expression', description: 'From chromatin remodeling to protein synthesis.', cost: 600, prereqs: ['r1-signals', 'r1-cycle'], x: 0.5, y: 0.85, lore: 'Every cell has the same genome. Expression is identity.' },
    ],
  },
  2: {
    color: '#52b788',
    name: 'GENOME FOREST',
    nodes: [
      { id: 'r2-dna', title: 'DNA Structure', description: 'B-form double helix, base stacking, major/minor groove.', cost: 200, prereqs: [], x: 0.5, y: 0.1, lore: 'Franklin\'s Photo 51 changed everything. Remember that.' },
      { id: 'r2-sequencing', title: 'Sequencing Methods', description: 'Sanger → NGS → long-read (PacBio, Nanopore).', cost: 300, prereqs: ['r2-dna'], x: 0.25, y: 0.35, lore: 'The cost of sequencing a human genome dropped from $3B to $200 in 20 years.' },
      { id: 'r2-alignment', title: 'BLAST & Alignment', description: 'Smith-Waterman, BLAST heuristics, E-values.', cost: 400, prereqs: ['r2-dna'], x: 0.75, y: 0.35, lore: 'Sequence similarity is evolutionary memory.' },
      { id: 'r2-crispr', title: 'CRISPR', description: 'Cas9 mechanism, guide RNA design, off-target effects.', cost: 500, prereqs: ['r2-sequencing', 'r2-alignment'], x: 0.35, y: 0.6, lore: 'Bacteria invented CRISPR to fight viruses. We borrowed it to rewrite life.' },
      { id: 'r2-pop-gen', title: 'Population Genetics', description: 'Hardy-Weinberg, genetic drift, selection coefficients.', cost: 500, prereqs: ['r2-sequencing', 'r2-alignment'], x: 0.65, y: 0.6, lore: 'Natural selection is just math applied to survival.' },
      { id: 'r2-phylo', title: 'Phylogenetics', description: 'Maximum likelihood trees, Bayesian inference, BEAST.', cost: 600, prereqs: ['r2-crispr', 'r2-pop-gen'], x: 0.5, y: 0.85, lore: 'The tree of life is not a metaphor. It is a mathematical object.' },
    ],
  },
  3: {
    color: '#a855f7',
    name: 'NEURAL NEBULA',
    nodes: [
      { id: 'r3-stats', title: 'Statistics', description: 'Distributions, p-values, Bayesian inference, multiple testing.', cost: 200, prereqs: [], x: 0.5, y: 0.1, lore: 'Statistics is the art of lying with precision.' },
      { id: 'r3-classical-ml', title: 'Classical ML', description: 'SVMs, random forests, regularization, cross-validation.', cost: 300, prereqs: ['r3-stats'], x: 0.25, y: 0.35, lore: 'Before the deep learning explosion, we had decades of brilliant elegant algorithms.' },
      { id: 'r3-nn', title: 'Neural Networks', description: 'Backprop, activation functions, vanishing gradients.', cost: 400, prereqs: ['r3-stats'], x: 0.75, y: 0.35, lore: 'The neuron metaphor is wrong but useful. Most good metaphors are.' },
      { id: 'r3-cnn', title: 'CNNs', description: 'Convolutional layers, pooling, ResNets, object detection.', cost: 500, prereqs: ['r3-classical-ml', 'r3-nn'], x: 0.35, y: 0.6, lore: 'AlexNet ran on two GTX 580s. What changed was not the algorithm.' },
      { id: 'r3-transformers', title: 'Transformers', description: 'Attention mechanisms, positional encoding, BERT, GPT.', cost: 500, prereqs: ['r3-classical-ml', 'r3-nn'], x: 0.65, y: 0.6, lore: '"Attention is all you need." — a paper title that aged terrifyingly well.' },
      { id: 'r3-foundation', title: 'Foundation Models', description: 'Pre-training, fine-tuning, RLHF, emergent capabilities.', cost: 600, prereqs: ['r3-cnn', 'r3-transformers'], x: 0.5, y: 0.85, lore: 'We built brains that cannot tell us why they work.' },
    ],
  },
  4: {
    color: '#c0a0ff',
    name: 'PROTEIN CATHEDRAL',
    nodes: [
      { id: 'r4-structure', title: 'Protein Structure', description: 'Primary → quaternary structure, Ramachandran plots.', cost: 200, prereqs: [], x: 0.5, y: 0.1, lore: 'A protein\'s function is in its fold. Its fold is in its sequence. Its sequence is in its gene.' },
      { id: 'r4-folding', title: 'Folding Algorithms', description: 'Rosetta, Gaussian networks, molecular dynamics.', cost: 300, prereqs: ['r4-structure'], x: 0.25, y: 0.35, lore: 'Anfinsen\'s dogma: the native state is thermodynamically stable. Usually.' },
      { id: 'r4-alphafold', title: 'AlphaFold', description: 'Evoformer, MSA attention, structure module, confidence scores.', cost: 400, prereqs: ['r4-structure'], x: 0.75, y: 0.35, lore: 'DeepMind solved the 50-year-old protein folding problem at a biology competition. No big deal.' },
      { id: 'r4-drug', title: 'Drug Discovery', description: 'Target ID, virtual screening, ADMET properties, lead optimization.', cost: 500, prereqs: ['r4-folding', 'r4-alphafold'], x: 0.35, y: 0.6, lore: 'A drug is just a molecule that binds to the right pocket at the right time.' },
      { id: 'r4-systems', title: 'Systems Biology', description: 'Boolean networks, ODEs, metabolic flux analysis.', cost: 500, prereqs: ['r4-folding', 'r4-alphafold'], x: 0.65, y: 0.6, lore: 'The cell is not a bag of enzymes. It is a city with traffic laws.' },
      { id: 'r4-multiomics', title: 'Multi-omics', description: 'Integrating genomics, transcriptomics, proteomics, metabolomics.', cost: 600, prereqs: ['r4-drug', 'r4-systems'], x: 0.5, y: 0.85, lore: 'Each -omics layer is a different photograph of the same city from a different altitude.' },
    ],
  },
};

const CANVAS_W = 600;
const CANVAS_H = 400;

export default function ResearchPage() {
  const { progress, unlockResearch } = useGameStore();
  const [activeRealm, setActiveRealm] = useState<1 | 2 | 3 | 4>(1);
  const [hoveredNode, setHoveredNode] = useState<ResearchNode | null>(null);
  const [confirmNode, setConfirmNode] = useState<ResearchNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tree = RESEARCH_TREES[activeRealm];
  const unlocked = progress.researchUnlocked ?? [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const color = tree.color;
    const nodes = tree.nodes;

    // Draw edges
    nodes.forEach((node) => {
      node.prereqs.forEach((pid) => {
        const parent = nodes.find((n) => n.id === pid);
        if (!parent) return;
        const x1 = parent.x * CANVAS_W;
        const y1 = parent.y * CANVAS_H;
        const x2 = node.x * CANVAS_W;
        const y2 = node.y * CANVAS_H;
        const parentUnlocked = unlocked.includes(pid);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = parentUnlocked ? color + '88' : '#333';
        ctx.lineWidth = parentUnlocked ? 2 : 1;
        ctx.stroke();
      });
    });

    // Draw nodes
    nodes.forEach((node) => {
      const cx = node.x * CANVAS_W;
      const cy = node.y * CANVAS_H;
      const isUnlocked = unlocked.includes(node.id);
      const prereqsMet = node.prereqs.every((p) => unlocked.includes(p));
      const canAfford = progress.totalXP >= node.cost;
      const isHovered = hoveredNode?.id === node.id;

      const r = isHovered ? 18 : 14;

      // Glow
      if (isUnlocked) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      }

      // Circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isUnlocked ? color : prereqsMet && canAfford ? color + '33' : '#1a1a2a';
      ctx.fill();
      ctx.strokeStyle = isUnlocked ? color : prereqsMet ? color + '88' : '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Text
      ctx.fillStyle = isUnlocked ? '#000' : prereqsMet ? color : '#555';
      ctx.font = `bold ${isHovered ? 9 : 8}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const words = node.title.split(' ');
      if (words.length === 1) {
        ctx.fillText(node.title.slice(0, 6), cx, cy);
      } else {
        ctx.fillText(words[0].slice(0, 6), cx, cy - 5);
        ctx.fillText(words[1].slice(0, 6), cx, cy + 5);
      }

      // XP cost tag
      if (!isUnlocked) {
        ctx.fillStyle = prereqsMet && canAfford ? '#f59e0b' : '#444';
        ctx.font = '7px monospace';
        ctx.fillText(`${node.cost}xp`, cx, cy + r + 12);
      }
    });
  }, [activeRealm, hoveredNode, unlocked, progress.researchUnlocked]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    for (const node of tree.nodes) {
      const dx = mx - node.x * CANVAS_W;
      const dy = my - node.y * CANVAS_H;
      if (Math.sqrt(dx * dx + dy * dy) <= 20) {
        const isUnlocked = unlocked.includes(node.id);
        if (!isUnlocked) setConfirmNode(node);
        return;
      }
    }
    setConfirmNode(null);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    for (const node of tree.nodes) {
      const dx = mx - node.x * CANVAS_W;
      const dy = my - node.y * CANVAS_H;
      if (Math.sqrt(dx * dx + dy * dy) <= 20) {
        setHoveredNode(node);
        return;
      }
    }
    setHoveredNode(null);
  };

  const handleConfirm = () => {
    if (!confirmNode) return;
    const prereqsMet = confirmNode.prereqs.every((p) => unlocked.includes(p));
    const canAfford = progress.totalXP >= confirmNode.cost;
    if (!prereqsMet || !canAfford) { setConfirmNode(null); return; }
    unlockResearch(confirmNode.id, confirmNode.cost);
    setConfirmNode(null);
  };

  const realmKeys = [1, 2, 3, 4] as const;

  return (
    <div style={{ minHeight: '100vh', background: '#08080e', paddingTop: 56 }}>
      <GameHUD />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <Link href="/realm/1" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#444', textDecoration: 'none', display: 'block', marginBottom: 8 }}>← BACK</Link>
            <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#a855f7', textShadow: '0 0 10px #a855f766', margin: 0 }}>RESEARCH TREE</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#f59e0b' }}>{progress.totalXP.toLocaleString()}</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#555' }}>XP AVAILABLE</div>
          </div>
        </div>

        {/* Realm tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {realmKeys.map((r) => {
            const t = RESEARCH_TREES[r];
            const isActive = activeRealm === r;
            const isLocked = !progress.unlockedRealms.includes(r);
            return (
              <button
                key={r}
                onClick={() => !isLocked && setActiveRealm(r)}
                disabled={isLocked}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  padding: '8px 14px',
                  background: isActive ? t.color + '22' : 'transparent',
                  border: `2px solid ${isActive ? t.color : isLocked ? '#222' : '#444'}`,
                  color: isActive ? t.color : isLocked ? '#333' : '#666',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  letterSpacing: 1,
                }}
              >
                {isLocked ? '🔒 ' : ''}{t.name}
              </button>
            );
          })}
        </div>

        {/* Canvas */}
        <div style={{ position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              width: '100%',
              imageRendering: 'pixelated',
              border: `2px solid ${tree.color}44`,
              cursor: hoveredNode ? 'pointer' : 'default',
              display: 'block',
            }}
          />

          {/* Node info tooltip */}
          {hoveredNode && (
            <div style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: '#0a0a0a',
              border: `1px solid ${tree.color}66`,
              padding: '10px 14px',
              maxWidth: 280,
              pointerEvents: 'none',
            }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: tree.color, marginBottom: 4 }}>{hoveredNode.title}</div>
              <p style={{ fontSize: 10, color: '#888', margin: 0 }}>{hoveredNode.description}</p>
              {!unlocked.includes(hoveredNode.id) && (
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#f59e0b', marginTop: 6 }}>
                  COST: {hoveredNode.cost} XP
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm panel */}
        {confirmNode && (
          <div style={{
            marginTop: 16,
            background: '#0a0a0a',
            border: `2px solid ${tree.color}`,
            padding: 20,
          }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: tree.color, marginBottom: 8 }}>
              RESEARCH: {confirmNode.title}
            </div>
            <p style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>{confirmNode.description}</p>
            <p style={{ fontSize: 10, color: '#666', fontStyle: 'italic', marginBottom: 16 }}>{confirmNode.lore}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#f59e0b' }}>
                COST: {confirmNode.cost} XP
              </div>
              {confirmNode.prereqs.length > 0 && !confirmNode.prereqs.every((p) => unlocked.includes(p)) && (
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#ef4444' }}>
                  PREREQS NOT MET
                </div>
              )}
              {progress.totalXP < confirmNode.cost && (
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#ef4444' }}>
                  NOT ENOUGH XP
                </div>
              )}
              {confirmNode.prereqs.every((p) => unlocked.includes(p)) && progress.totalXP >= confirmNode.cost && (
                <button
                  onClick={handleConfirm}
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    padding: '8px 16px',
                    background: '#0a1a0a',
                    border: `2px solid ${tree.color}`,
                    color: tree.color,
                    cursor: 'pointer',
                  }}
                >
                  UNLOCK
                </button>
              )}
              <button
                onClick={() => setConfirmNode(null)}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '2px solid #333',
                  color: '#555',
                  cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: tree.color }} />
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#555' }}>UNLOCKED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: tree.color + '33', border: `1px solid ${tree.color}` }} />
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#555' }}>AVAILABLE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a2a', border: '1px solid #333' }} />
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#555' }}>LOCKED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
