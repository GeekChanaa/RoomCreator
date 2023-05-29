import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-plan-creator',
  templateUrl: './plan-creator.component.html',
  styleUrls: ['./plan-creator.component.css']
})
export class PlanCreatorComponent implements OnInit {


  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  scale: number = 1; // The current scale factor
  lines: any[] = [];
  cursorX: number = 0; // Cursor X position
  cursorY: number = 0; // Cursor Y position

  // Array of points
  points: any[] = [];

  //cursortypes : 
  cursorPan : boolean = false;
  cursorDraw : boolean = true;

  panX: number = 0;
  panY: number = 0;

  canvas : any = {};

  // Constructor
  constructor() { 
  }

  // On init life cycle hook
  ngOnInit() {
  }

  drawingInCanvas(){
    this.cursorPan = !this.cursorPan;
    this.cursorDraw = !this.cursorDraw;
  }
  movingCanvas(){
    this.cursorPan = !this.cursorPan;
    this.cursorDraw = !this.cursorDraw;
  }

  ngAfterViewInit() {
    this.canvas = this.myCanvas.nativeElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d')!;
    

    const drawPoint = (x: number, y: number) => {
      this.ctx.beginPath();
      this.ctx.arc( (x - this.panX) , (y - this.panY), 3, 0, 2 * Math.PI);
      this.ctx.fill();
    };

    const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
      const xDist = x2 - x1;
      const yDist = y2 - y1;
      return Math.sqrt(xDist * xDist + yDist * yDist);
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number, redrawing = false) => {
      
      this.ctx.beginPath();
      this.ctx.moveTo((x1 - this.panX), (y1 - this.panY));
      this.ctx.lineTo((x2 - this.panX), (y2 - this.panY));
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 5;
      this.ctx.stroke();

      if (redrawing)
        this.lines.push({ x1, y1, x2, y2 });
    };

    // Function to draw the grid
    const drawGrid = () => {
      console.log("redrawing the grid, this is the new scale : " + this.scale)
      const gridSize = 50; // Convert the scale to grid size

      this.ctx.strokeStyle = '#dddddd';
      this.ctx.lineWidth = 1 / this.scale;

      // Vertical lines
      for (let x = gridSize; x < this.canvas.width / this.scale; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x-this.panX, 0);
        this.ctx.lineTo(x-this.panX, this.canvas.height / this.scale);
        this.ctx.stroke();
      }

      // Horizontal lines
      for (let y = gridSize; y < this.canvas.height / this.scale; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y-this.panY);
        this.ctx.lineTo(this.canvas.width / this.scale, y-this.panY);
        this.ctx.stroke();
      }
    }

    this.canvas.addEventListener('click', (e : any) => {
      if(this.cursorDraw)
      {
        var rect = this.canvas.getBoundingClientRect();
        var x = (e.clientX - rect.left)/this.scale;
        var y = (e.clientY - rect.top)/this.scale;
        if( this.points.length > 0 && Math.abs(this.cursorY - this.points[this.points.length - 1].y) < 20){
          y = this.points[this.points.length - 1].y
        }
        if( this.points.length > 0 && Math.abs(this.cursorX - this.points[this.points.length - 1].x) < 20){
          x = this.points[this.points.length - 1].x
        }
        drawPoint(x*this.scale, y*this.scale );
        this.points.push({ x: x, y: y });

        if (this.points.length > 1) {
          // If there are at least two points, draw a line between the last two points
          var p1 = this.points[this.points.length - 2];
          var p2 = this.points[this.points.length - 1];
          drawLine(p1.x, p1.y, p2.x, p2.y, true);
        }
      }
      let recenteredPoints = this.recenterPoints(this.points);
      console.log(recenteredPoints);
      
    });

    window.addEventListener('wheel', (event) => {
      event.preventDefault();

      // Change the scale factor based on the direction of the mouse wheel
      if (event.deltaY < 0) {
        this.scale *= 1.005;
      } else {
        this.scale *= 0.995;
      }

      // Clear the canvas and redraw everything at the new scale
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(this.scale, this.scale);

      // Redraw all points and lines
      for (let point of this.points) {
        drawPoint(point.x, point.y);
      }

      for (let line of this.lines) {
        drawLine(line.x1, line.y1, line.x2, line.y2, false);
      }

      // redrawing the grid : 
      drawGrid();

      this.ctx.restore();
    }, { passive: false });

    // Event listener for cursor movement
    this.canvas.addEventListener('mousemove', (event : any) => {
      const rect = this.canvas.getBoundingClientRect();
      this.cursorX = event.clientX - rect.left;
      this.cursorY = event.clientY - rect.top;

      // Clear the canvas and redraw everything at the new scale
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(this.scale, this.scale);

      // Redraw the grid
      drawGrid();

      // Redraw all points
      for (let point of this.points) {
        drawPoint(point.x, point.y);
      }

      // redraw lines
      for (let line of this.lines) {
        drawLine(line.x1, line.y1, line.x2, line.y2, false);
      }

      

      // Draw a horizontal preview line and stick the preview line into the preview line
      if(this.cursorDraw)
      if(Math.abs(this.cursorY - this.points[this.points.length - 1].y) < 20 || Math.abs(this.cursorX - this.points[this.points.length - 1].x) < 20)
      {
        if(Math.abs(this.cursorY - this.points[this.points.length - 1].y) < 20 )
        {
          this.ctx.beginPath();
          this.ctx.moveTo(0, this.points[this.points.length - 1].y);
          this.ctx.lineTo(this.canvas.width / this.scale, this.points[this.points.length - 1].y);
          this.ctx.strokeStyle = 'lightgray';  // Set the stroke color to light gray
          this.ctx.stroke();
          // Redraw the preview line
          if (this.points.length > 0) {
            
            var x = this.points[this.points.length - 1].x;
            var y = this.points[this.points.length - 1].y;
            const lastPoint = {x,y};
            drawLine(lastPoint.x, lastPoint.y, this.cursorX/this.scale, this.points[this.points.length - 1].y);
            const distance = calculateDistance(lastPoint.x, lastPoint.y, this.cursorX / this.scale, this.cursorY / this.scale);
            const middleX = (lastPoint.x + this.cursorX) / 2 ;
            const middleY = ((lastPoint.y + this.cursorY) / 2) - 20;
            
            this.ctx.fillStyle = 'black';
            this.ctx.font = '16px Arial';
            this.ctx.fillText((distance/50).toFixed(2) + "m", middleX, middleY);
          }

        }

        // Draw a vertical preview line
        if(Math.abs(this.cursorX - this.points[this.points.length - 1].x) < 20)
        {
          this.ctx.beginPath();
          this.ctx.moveTo(this.points[this.points.length - 1].x, 0);
          this.ctx.lineTo(this.points[this.points.length - 1].x,this.canvas.height / this.scale);
          this.ctx.strokeStyle = 'lightgray';  // Set the stroke color to light gray
          this.ctx.stroke();

          // Redraw the preview line
          if (this.points.length > 0) {
            var x = this.points[this.points.length - 1].x;
            var y = this.points[this.points.length - 1].y;
            const lastPoint = {x,y};
            drawLine(lastPoint.x, lastPoint.y, this.points[this.points.length - 1].x, this.cursorY/this.scale);
            const distance = calculateDistance(lastPoint.x, lastPoint.y, this.cursorX / this.scale, this.cursorY / this.scale);
            const middleX = (lastPoint.x + this.cursorX) / 2 ;
            const middleY = ((lastPoint.y + this.cursorY) / 2) - 20;
            
            this.ctx.fillStyle = 'black';
            this.ctx.font = '16px Arial';
            this.ctx.fillText((distance/50).toFixed(2) + "m", middleX, middleY);
          }
        }
      }
      else{
        // Redraw the preview line
        if (this.points.length > 0) {
          var x = this.points[this.points.length - 1].x;
          var y = this.points[this.points.length - 1].y;
          const lastPoint = {x,y};
          drawLine(lastPoint.x, lastPoint.y, this.cursorX/this.scale, this.cursorY/this.scale);
          const distance = calculateDistance(lastPoint.x, lastPoint.y, this.cursorX / this.scale, this.cursorY / this.scale);
          const middleX = (lastPoint.x + this.cursorX) / 2 ;
          const middleY = ((lastPoint.y + this.cursorY) / 2) - 20;
          
          this.ctx.fillStyle = 'black';
          this.ctx.font = '16px Arial';
          this.ctx.fillText((distance/50).toFixed(2) + "m", middleX, middleY);
        }
      }

      this.ctx.restore();
    });

    let isPanning = false;
    let startPanX: number, startPanY: number;

    this.canvas.addEventListener('mousedown', (e : any) => {
      if(this.cursorPan)
      {
        isPanning = true;
        startPanX = e.clientX;
        startPanY = e.clientY;
      }
    });

    window.addEventListener('mouseup', (e) => {
      isPanning = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isPanning) {
        const dx = startPanX - e.clientX;
        const dy = startPanY - e.clientY;
        startPanX = e.clientX;
        startPanY = e.clientY;

        this.panX += dx;
        this.panY += dy;

        // Now that the pan offset has changed, redraw everything
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        drawGrid();

        for (let point of this.points) {
          drawPoint(point.x, point.y);
        }

        for (let line of this.lines) {
          drawLine(line.x1, line.y1, line.x2, line.y2, false);
        }

        this.ctx.restore();
      }
    });

    // Initial draw of the grid : 
    drawGrid();
  }

  // Recentering points to the 0,0 axis
  recenterPoints(points: any[]) {
    // Calculate total x and y
    let totalX = 0;
    let totalY = 0;
    points.forEach(point => {
        totalX += point.x;
        totalY += point.y;
    });

    // Find average to get the center of the square
    let centerX = totalX / points.length;
    let centerY = totalY / points.length;

    // Recenter points
    let recenteredPoints = points.map(point => ({
        x: point.x - centerX,
        y: point.y - centerY
    }));

    return recenteredPoints;
  }

  // Clearing the canvas
  clearCanvas(){
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}
