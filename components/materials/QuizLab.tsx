'use client';
import { useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TechniqueGraph, type GraphStrings, type ToolView } from './TechniqueGraph';
import { Quiz, type QuestionView, type QuizStrings } from './Quiz';

/** The syntax map and the quiz of one track share the open card, so a reviewed answer can open its pattern on the map. */
export function QuizLab({ tool, t, questions, size, s, headings }: { tool: ToolView; t: GraphStrings; questions: QuestionView[]; size: number; s: QuizStrings; headings: { quiz: string; quizIntro: string } }) {
  const [open, setOpen] = useState<string | null>(null);
  const review = (id: string) => {
    setOpen(id);
    document.getElementById('tg-panel')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  return (
    <>
      <TechniqueGraph tool={tool} t={t} open={open} onOpenChange={setOpen} />
      <section className="qzsec" id="quiz" aria-labelledby="qz-title">
        <SectionTitle as="h2" align="center" size="sm" id="qz-title">{headings.quiz}</SectionTitle>
        <p className="qzsec__intro">{headings.quizIntro}</p>
        <Quiz questions={questions} size={size} s={s} onReview={review} />
      </section>
    </>
  );
}
