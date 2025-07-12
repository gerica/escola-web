import { ProblemObject } from './problem-object.model';

export interface Problem {
  status: number;
  title: string;
  detail: string;
  userMessage: string;
  timestamp: Date;
  objects: ProblemObject[];
}
