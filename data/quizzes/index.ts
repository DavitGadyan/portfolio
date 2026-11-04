import type { Track } from './types';
import { javascript } from './javascript';
import { react } from './react';
import { sql } from './sql';

export type { CheatNode, Question, Track } from './types';
export const QUIZZES_PATH = '/materials/quizzes/';
export const trackPath = (id: string) => `${QUIZZES_PATH}${id}/`;
/** Questions drawn per attempt. */
export const QUIZ_SIZE = 20;
/** Order = order of the tiles on /materials/quizzes/. */
export const tracks: Track[] = [javascript, react, sql];
