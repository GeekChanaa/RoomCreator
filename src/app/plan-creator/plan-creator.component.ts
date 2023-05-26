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

  //cursortypes : 
  cursorPan : boolean = false;
  cursorDraw : boolean = true;

  panX: number = 0;
  panY: number = 0;
  constructor() { }

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
    const canvas = this.myCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d')!;
    var points: any[] = [];

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
      for (let x = gridSize; x < canvas.width / this.scale; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x-this.panX, 0);
        this.ctx.lineTo(x-this.panX, canvas.height / this.scale);
        this.ctx.stroke();
      }

      // Horizontal lines
      for (let y = gridSize; y < canvas.height / this.scale; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y-this.panY);
        this.ctx.lineTo(canvas.width / this.scale, y-this.panY);
        this.ctx.stroke();
      }
    }

    canvas.addEventListener('click', (e) => {
      if(this.cursorDraw)
      {
        var rect = canvas.getBoundingClientRect();
        var x = (e.clientX - rect.left)/this.scale;
        var y = (e.clientY - rect.top)/this.scale;
        if( points.length > 0 && Math.abs(this.cursorY - points[points.length - 1].y) < 20){
          y = points[points.length - 1].y
        }
        if( points.length > 0 && Math.abs(this.cursorX - points[points.length - 1].x) < 20){
          x = points[points.length - 1].x
        }
        drawPoint(x*this.scale, y*this.scale );
        points.push({ x: x, y: y });

        if (points.length > 1) {
          // If there are at least two points, draw a line between the last two points
          var p1 = points[points.length - 2];
          var p2 = points[points.length - 1];
          drawLine(p1.x, p1.y, p2.x, p2.y, true);
        }
      }

      console.log(points);
      
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
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.save();
      this.ctx.scale(this.scale, this.scale);

      // Redraw all points and lines
      for (let point of points) {
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
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.cursorX = event.clientX - rect.left;
      this.cursorY = event.clientY - rect.top;

      // Clear the canvas and redraw everything at the new scale
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.save();
      this.ctx.scale(this.scale, this.scale);

      // Redraw the grid
      drawGrid();

      // Redraw all points
      for (let point of points) {
        drawPoint(point.x, point.y);
      }

      // redraw lines
      for (let line of this.lines) {
        drawLine(line.x1, line.y1, line.x2, line.y2, false);
      }

      

      // Draw a horizontal preview line and stick the preview line into the preview line
      if(this.cursorDraw)
      if(Math.abs(this.cursorY - points[points.length - 1].y) < 20 || Math.abs(this.cursorX - points[points.length - 1].x) < 20)
      {
        if(Math.abs(this.cursorY - points[points.length - 1].y) < 20 )
        {
          this.ctx.beginPath();
          this.ctx.moveTo(0, points[points.length - 1].y);
          this.ctx.lineTo(canvas.width / this.scale, points[points.length - 1].y);
          this.ctx.strokeStyle = 'lightgray';  // Set the stroke color to light gray
          this.ctx.stroke();
          // Redraw the preview line
          if (points.length > 0) {
            
            var x = points[points.length - 1].x;
            var y = points[points.length - 1].y;
            const lastPoint = {x,y};
            drawLine(lastPoint.x, lastPoint.y, this.cursorX/this.scale, points[points.length - 1].y);
            const distance = calculateDistance(lastPoint.x, lastPoint.y, this.cursorX / this.scale, this.cursorY / this.scale);
            const middleX = (lastPoint.x + this.cursorX) / 2 ;
            const middleY = ((lastPoint.y + this.cursorY) / 2) - 20;
            
            this.ctx.fillStyle = 'black';
            this.ctx.font = '16px Arial';
            this.ctx.fillText((distance/50).toFixed(2) + "m", middleX, middleY);
          }

        }

        // Draw a vertical preview line
        if(Math.abs(this.cursorX - points[points.length - 1].x) < 20)
        {
          this.ctx.beginPath();
          this.ctx.moveTo(points[points.length - 1].x, 0);
          this.ctx.lineTo(points[points.length - 1].x,canvas.height / this.scale);
          this.ctx.strokeStyle = 'lightgray';  // Set the stroke color to light gray
          this.ctx.stroke();

          // Redraw the preview line
          if (points.length > 0) {
            var x = points[points.length - 1].x;
            var y = points[points.length - 1].y;
            const lastPoint = {x,y};
            drawLine(lastPoint.x, lastPoint.y, points[points.length - 1].x, this.cursorY/this.scale);
          }
        }
      }
      else{
        // Redraw the preview line
        if (points.length > 0) {
          var x = points[points.length - 1].x;
          var y = points[points.length - 1].y;
          const lastPoint = {x,y};
          drawLine(lastPoint.x, lastPoint.y, this.cursorX/this.scale, this.cursorY/this.scale);
        }
      }

      this.ctx.restore();
    });

    let isPanning = false;
    let startPanX: number, startPanY: number;

    canvas.addEventListener('mousedown', (e) => {
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
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        drawGrid();

        for (let point of points) {
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

}
