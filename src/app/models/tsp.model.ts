export interface TSPProblem {
  id: string;
  distances: number[][];
  expectedSolution?: number[];
  expectedDistance?: number;
}

export interface TSPSolution {
  problemId: string;
  route: number[];
  totalDistance: number;
  executionTime: number;
  isOptimal?: boolean;
}

export interface CityPosition {
  x: number;
  y: number;
}

