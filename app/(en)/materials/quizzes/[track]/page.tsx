import { QuizPage, quizMetadata, trackIds } from '@/components/pages/QuizzesPage';
type P = { params: Promise<{ track: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return trackIds.map((track) => ({ track })); }
export async function generateMetadata({ params }: P) { const { track } = await params; return quizMetadata('en', track); }
export default async function Page({ params }: P) { const { track } = await params; return <QuizPage locale="en" id={track} />; }
