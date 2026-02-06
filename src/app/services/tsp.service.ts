import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TSPProblem, TSPSolution } from '../models/tsp.model';

@Injectable({
  providedIn: 'root'
})
export class TSPService {
  private apiUrl = 'http://localhost:3000/api/tsp';

  constructor(private http: HttpClient) {}

  loadTestDataFromFile(filename: string): Observable<string> {
    return this.http.get(`/test-data/${filename}`, { responseType: 'text' });
  }

  parseTestData(fileContent: string): TSPProblem[] {
    const instances: TSPProblem[] = [];
    const lines = fileContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let i = 0;
    let blockIndex = 0;

    while (i < lines.length) {
      const currentLine = lines[i];

      // Vérifier si c'est une ligne de distances (commence par des nombres)
      if (/^[\d.]+\s/.test(currentLine)) {
        const distanceParts = currentLine.split(/\s+/).map(x => parseFloat(x)).filter(x => !isNaN(x));

        // La ligne suivante doit contenir "output"
        if (i + 1 < lines.length && lines[i + 1].startsWith('output')) {
          const outputLine = lines[i + 1]
            .replace('output', '')
            .trim()
            .split(/\s+/)
            .map(x => parseInt(x))
            .filter(x => !isNaN(x));

          const n = Math.sqrt(distanceParts.length);
          if (Number.isInteger(n) && n > 0) {
            const distances: number[][] = [];

            for (let row = 0; row < n; row++) {
              distances[row] = [];
              for (let col = 0; col < n; col++) {
                distances[row][col] = distanceParts[row * n + col] || 0;
              }
            }

            instances.push({
              id: `tsp-10-${blockIndex + 1}`,
              distances: distances,
              expectedSolution: outputLine
            });

            blockIndex++;
            i += 2;
            continue;
          }
        }
      }

      i++;
    }

    return instances;
  }

  calculateDistance(distances: number[][], route: number[]): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      const from = route[i] - 1;
      const to = route[i + 1] - 1;
      totalDistance += distances[from][to];
    }
    return totalDistance;
  }

  solveTSP(problem: TSPProblem): Observable<TSPSolution> {
    return this.http.post<TSPSolution>(`${this.apiUrl}/solve`, problem);
  }

  generateRandomSolution(problem: TSPProblem): TSPSolution {
    const n = problem.distances.length;
    const route = Array.from({ length: n }, (_, i) => i + 1);
    route.push(route[0]);

    // Shuffle
    for (let i = 1; i < route.length - 1; i++) {
      const j = 1 + Math.floor(Math.random() * (n - 1));
      [route[i], route[j]] = [route[j], route[i]];
    }

    const totalDistance = this.calculateDistance(problem.distances, route);

    return {
      problemId: problem.id,
      route: route,
      totalDistance: totalDistance,
      executionTime: 0
    };
  }
}


