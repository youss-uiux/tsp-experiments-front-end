import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tsp-graph',
  templateUrl: './tsp-graph.component.html',
  styleUrls: ['./tsp-graph.component.scss']
})
export class TSPGraphComponent implements OnChanges, AfterViewInit {
  @Input() distances: number[][] = [];
  @Input() route: number[] | null = null;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private cities: { x: number; y: number }[] = [];
  private seed = 42;

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['distances'] && this.ctx) {
      this.cities = this.generateCityPositions();
      this.draw();
    } else if (changes['route'] && this.ctx) {
      this.draw();
    }
  }

  private initCanvas(): void {
    const canvas = this.canvas.nativeElement;
    canvas.width = 600;
    canvas.height = 600;
    this.ctx = canvas.getContext('2d');

    this.cities = this.generateCityPositions();
    this.draw();
  }

  private seededRandom(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  private generateCityPositions(): { x: number; y: number }[] {
    const n = this.distances.length;
    const padding = 50;
    const width = 600 - 2 * padding;
    const height = 600 - 2 * padding;

    // Réinitialiser la graine pour reproductibilité
    this.seed = 42;

    return Array.from({ length: n }, () => ({
      x: padding + this.seededRandom() * width,
      y: padding + this.seededRandom() * height
    }));
  }

  private draw(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, 600, 600);

    // Tracer les routes
    if (this.route && this.route.length > 1) {
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < this.route.length - 1; i++) {
        const cityIdx = this.route[i] - 1;
        if (cityIdx >= 0 && cityIdx < this.cities.length) {
          const city = this.cities[cityIdx];
          if (i === 0) {
            ctx.moveTo(city.x, city.y);
          } else {
            ctx.lineTo(city.x, city.y);
          }
        }
      }
      ctx.stroke();
    }

    // Tracer les villes
    this.cities.forEach((city, index) => {
      ctx.fillStyle = '#4ECDC4';
      ctx.beginPath();
      ctx.arc(city.x, city.y, 8, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), city.x, city.y);
    });
  }
}

