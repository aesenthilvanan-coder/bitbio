"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { getNode, getLevelForNode } from "@/lib/curriculum";
import type { Exercise, Realm } from "@/lib/types";
import GameHUD from "@/components/layout/GameHUD";
import ProgressBar from "@/components/ui/ProgressBar";
import PixelButton from "@/components/ui/PixelButton";
import MascotDisplay from "@/components/mascots/MascotDisplay";
import MultipleChoice from "@/components/exercises/MultipleChoice";
import FillBlank from "@/components/exercises/FillBlank";
import DragDrop from "@/components/exercises/DragDrop";
import CodeEditor from "@/components/exercises/CodeEditor";
import PixelTerminal from "@/components/exercises/PixelTerminal";
import SequenceOrder from "@/components/exercises/SequenceOrder";
import FreeText from "@/components/exercises/FreeText";
import TapCorrect from "@/components/exercises/TapCorrect";
import HeartDisplay from "@/components/ui/HeartDisplay";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const nodeId = params.nodeId as string;
  const realmId = parseInt(params.realmId as string) as Realm;

  const { progress, completeExercise, completeNode, useHint, awardGems } = useGameStore();

  const node = getNode(nodeId);
  const level = getLevelForNode(nodeId);

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mascotTrigger, setMascotTrigger] = useState<"lesson-start" | "correct" | "wrong" | "lesson-complete">("lesson-start");
  const [mascotAnimation, setMascotAnimation] = useState("idle");
  const [showHint, setShowHint] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [xpFlash, setXpFlash] = useState<number | null>(null);

  useEffect(() => {
    // Welcome dialogue on mount
    const timer = setTimeout(() => {
      setMascotTrigger("lesson-start");
      setMascotAnimation("jump");
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!node || !level) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="font-pixel text-[10px] text-[#ef4444]">NODE NOT FOUND</p>
          <button onClick={() => router.back()} className="pixel-btn pixel-btn-dark mt-4">← BACK</button>
        </div>
      </div>
    );
  }

  const exercises = node.exercises;
  const currentExercise: Exercise = exercises[exerciseIdx];
  const progress_pct = ((exerciseIdx) / exercises.length) * 100;

  const handleAnswer = (correct: boolean) => {
    const xp = correct ? currentExercise.xpReward : 0;
    completeExercise(nodeId, correct, xp);
    if (correct) {
      setXpGained((x) => x + xp);
      setXpFlash(xp);
      setMistakes(0);
      setMascotTrigger("correct");
      setMascotAnimation("cheer");
      setLastCorrect(true);
    } else {
      setMistakes((m) => m + 1);
      setMascotTrigger("wrong");
      setMascotAnimation("sad");
      setLastCorrect(false);
    }

    // Advance after a delay
    setTimeout(() => {
      setXpFlash(null);
      setShowHint(false);
      if (exerciseIdx < exercises.length - 1) {
        setExerciseIdx((i) => i + 1);
        setMascotAnimation("idle");
        setLastCorrect(null);
      } else {
        // Lesson complete!
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        completeNode(nodeId, stars);
        setIsComplete(true);
        setMascotTrigger("lesson-complete");
        setMascotAnimation("spin");
        awardGems(stars * 5);
      }
    }, 1400);
  };

  const handleHint = () => {
    useHint();
    setShowHint(true);
    setMascotTrigger("lesson-start"); // reuse start trigger for hint
    setMascotAnimation("think");
  };

  if (isComplete) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <GameHUD />
        <div className="relative z-10 text-center max-w-sm w-full mt-16">
          {/* Stars */}
          <div className="text-5xl mb-4 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <span key={s} className={s <= stars ? "animate-achievement-pop" : "opacity-20"} style={{ animationDelay: `${s * 0.2}s` }}>
                ⭐
              </span>
            ))}
          </div>

          <h1 className="font-pixel text-[12px] text-[#39ff14] glow-neon mb-2">LESSON COMPLETE!</h1>
          <p className="font-pixel text-[8px] text-[#f59e0b] mb-6">+{xpGained} XP EARNED</p>

          {/* Mascot celebration */}
          <div className="flex justify-center mb-6">
            <MascotDisplay realm={realmId} trigger="lesson-complete" animation="cheer" />
          </div>

          <div className="pixel-card border border-[#374151] p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Node</span>
              <span className="text-[#39ff14] font-pixel text-[8px]">{node.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Exercises</span>
              <span className="text-gray-200">{exercises.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Mistakes</span>
              <span className={mistakes === 0 ? "text-[#39ff14]" : "text-[#f59e0b]"}>{mistakes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Stars</span>
              <span>{"⭐".repeat(stars)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <PixelButton variant="dark" size="sm" onClick={() => router.push(`/realm/${realmId}`)} className="flex-1">
              ← REALM MAP
            </PixelButton>
            <PixelButton variant="neon" size="sm" onClick={() => {
              // Find next node
              router.push(`/realm/${realmId}`);
            }} className="flex-1">
              NEXT →
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <GameHUD />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4" style={{ paddingTop: 56 }}>
        {/* Lesson header */}
        <div className="py-4 border-b border-[#374151]">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => router.back()} className="font-pixel text-[8px] text-gray-500 hover:text-gray-300">
              ← EXIT
            </button>
            <div className="flex-1">
              <ProgressBar value={exerciseIdx} max={exercises.length} color="#39ff14" />
            </div>
            <HeartDisplay hearts={progress.hearts} maxHearts={progress.maxHearts} size="sm" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-pixel text-[7px] text-gray-500">{node.title}</p>
            <p className="font-pixel text-[7px] text-gray-600">
              {exerciseIdx + 1} / {exercises.length}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 py-6">
          {/* Exercise area */}
          <div className="flex-1">
            {/* XP flash */}
            {xpFlash && (
              <div className="text-center mb-2 animate-slide-in-up">
                <span className="font-pixel text-[12px] text-[#f59e0b]">+{xpFlash} XP!</span>
              </div>
            )}

            {/* Correct/wrong flash */}
            {lastCorrect !== null && (
              <div className={`text-center mb-3 font-pixel text-[10px] animate-slide-in-up ${lastCorrect ? "text-[#39ff14]" : "text-[#ef4444]"}`}>
                {lastCorrect ? "✓ CORRECT!" : "✗ NOT QUITE"}
              </div>
            )}

            {/* Question */}
            <div className="pixel-card border-2 border-[#374151] p-4 md:p-6 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-pixel text-[7px] text-gray-500 uppercase">
                  {currentExercise.type.replace("-", " ")}
                </span>
                {currentExercise.xpReward > 0 && (
                  <span className="font-pixel text-[7px] text-[#f59e0b]">+{currentExercise.xpReward} XP</span>
                )}
              </div>
              <h2 className="text-gray-100 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                {currentExercise.question}
              </h2>

              {/* Hint */}
              {showHint && currentExercise.hint && (
                <div className="pixel-card border border-[#f59e0b] p-3 mb-4 animate-slide-in-up">
                  <p className="font-pixel text-[7px] text-[#f59e0b] mb-1">💡 HINT (-5 💎)</p>
                  <p className="text-gray-300 text-sm">{currentExercise.hint}</p>
                </div>
              )}

              {/* Exercise component */}
              {currentExercise.type === "multiple-choice" && <MultipleChoice exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "fill-blank" && <FillBlank exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "drag-drop" && <DragDrop exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "matching" && <DragDrop exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "code-complete" && <CodeEditor exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "debug-code" && <CodeEditor exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "terminal" && <PixelTerminal exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "sequence-order" && <SequenceOrder exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "free-text" && <FreeText exercise={currentExercise} onAnswer={handleAnswer} />}
              {currentExercise.type === "tap-correct" && <TapCorrect exercise={currentExercise} onAnswer={handleAnswer} />}
            </div>

            {/* Hint/skip buttons */}
            <div className="flex gap-2">
              {currentExercise.hint && !showHint && (
                <button onClick={handleHint} className="pixel-btn pixel-btn-dark text-[8px] py-2 px-3">
                  💡 HINT (5💎)
                </button>
              )}
              <button
                onClick={() => handleAnswer(false)}
                className="pixel-btn pixel-btn-dark text-[8px] py-2 px-3 opacity-50 hover:opacity-100"
              >
                SKIP (10💎)
              </button>
            </div>
          </div>

          {/* Mascot sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20">
              <MascotDisplay
                realm={realmId}
                trigger={mascotTrigger}
                animation={mascotAnimation}
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
