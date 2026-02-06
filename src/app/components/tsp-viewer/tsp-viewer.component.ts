import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { TSPService } from '../../services/tsp.service';
import { TSPProblem, TSPSolution } from '../../models/tsp.model';
import { TSPGraphComponent } from '../tsp-graph/tsp-graph.component';

@Component({
  selector: 'app-tsp-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, TSPGraphComponent],
  templateUrl: './tsp-viewer.component.html',
  styleUrls: ['./tsp-viewer.component.scss']
})
export class TSPViewerComponent implements OnInit {
  instances: TSPProblem[] = [];
  selectedInstance: TSPProblem | null = null;
  solution: TSPSolution | null = null;
  loading = false;
  error: string | null = null;

  constructor(private tspService: TSPService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    this.tspService.loadTestDataFromFile('tsp10_test_concorde.txt').subscribe({
      next: (content) => {
        this.instances = this.tspService.parseTestData(content);
        console.log('Instances chargées :', this.instances);
        if (this.instances.length > 0) {
          this.selectInstance(this.instances[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données : ' + err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectInstance(instance: TSPProblem | null): void {
    if (instance) {
      this.selectedInstance = instance;
      this.solution = null;
    }
  }

  solve(): void {
    if (!this.selectedInstance) return;

    // Générer une solution aléatoire pour la démo
    this.solution = this.tspService.generateRandomSolution(this.selectedInstance);

    // En production, appeler le serveur :
    // this.loading = true;
    // this.tspService.solveTSP(this.selectedInstance).subscribe({
    //   next: (result) => {
    //     this.solution = result;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Erreur lors de la résolution';
    //     this.loading = false;
    //   }
    // });
  }

  getExpectedDistance(): number | null {
    if (!this.selectedInstance || !this.selectedInstance.expectedSolution) {
      return null;
    }
    return this.tspService.calculateDistance(
      this.selectedInstance.distances,
      this.selectedInstance.expectedSolution
    );
  }
}


