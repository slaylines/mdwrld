import { debounce, getClient } from './utils';

class Photos {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.size = { width: 0, height: 0 }; // size of canvas
    this.viewport = { x: 0, y: 0, width: 0, height: 0 }; // visible part of infinite canvas
    this.grid = { rows: 0, cols: 0, width: 0, height: 0 }; // count and size of grid

    this.dragging = false;
    this.currentPos = null;

    this.onStartDrag = this.onStartDrag.bind(this);
    this.onDrag = debounce(this.onDrag, this);
    this.onScroll = debounce(this.onScroll, this);
    this.onStopDrag = this.onStopDrag.bind(this);

    this.canvas.addEventListener('mousedown', this.onStartDrag);
    this.canvas.addEventListener('touchstart', this.onStartDrag);

    this.canvas.addEventListener('mousemove', this.onDrag);
    this.canvas.addEventListener('touchmove', this.onDrag);

    this.canvas.addEventListener('mouseup', this.onStopDrag);
    this.canvas.addEventListener('mouseleave', this.onStopDrag);
    this.canvas.addEventListener('touchend', this.onStopDrag);

    this.canvas.addEventListener('mousewheel', this.onScroll, false);

    this.init();
  }

  init() {
    this.size = {
      width: this.canvas.clientWidth,
      height: this.canvas.clientHeight,
    };
    this.viewport = {
      x: -this.size.width * 0.01,
      y: -this.size.height * 0.01,
      width: this.size.width,
      height: this.size.height,
    };

    this.resizeCanvas();
    this.resizeGrid();
    this.render();
  }

  render() {
    this.context.clearRect(0, 0, this.size.width, this.size.height);

    const x0 = -this.viewport.x % this.grid.width;
    const y0 = -this.viewport.y % this.grid.height;

    for (let row = -1; row < this.grid.rows + 1; row++) {
      for (let col = -1; col < this.grid.cols + 1; col++) {
        this.context.strokeRect(
          x0 + col * this.grid.width,
          y0 + row * this.grid.height,
          this.grid.width,
          this.grid.height
        );
      }
    }
  }

  resizeCanvas() {
    this.canvas.setAttribute('width', this.size.width);
    this.canvas.setAttribute('height', this.size.height);
    this.context.fillStyle = 'rgba(80, 80, 80, 0.2)';
  }

  resizeGrid() {
    const { width, height } = this.size;
    const screenAspectRatio = height / width;

    let cols = 0;
    let rows = 0;

    if (width > height) {
      cols = this.getGridSize(width);
      rows = Math.max(Math.floor(cols * screenAspectRatio), 2);
    } else {
      rows = this.getGridSize(height);
      cols = Math.max(Math.floor(rows / screenAspectRatio), 2);
    }

    this.grid = {
      rows,
      cols,
      width: width / cols,
      height: height / rows,
    };
  }

  getGridSize(screenSize) {
    if (screenSize > 2800) {
      return 7;
    }
    if (screenSize > 1920) {
      return 6;
    }
    if (screenSize > 1440) {
      return 5;
    }
    if (screenSize > 1024) {
      return 4;
    }
    return 3;
  }

  resize() {
    this.init();
  }

  changeViewport(vp) {
    this.viewport = vp;
    this.render();
  }

  onStartDrag(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dragging = true;
    this.currentPos = getClient(event);
  }

  onDrag(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.dragging) {
      return;
    }

    const mousePos = getClient(event);
    const viewport = {
      x: this.viewport.x - mousePos.x + this.currentPos.x,
      y: this.viewport.y - mousePos.y + this.currentPos.y,
      width: this.viewport.width,
      height: this.viewport.height,
    };

    this.currentPos = { ...mousePos };
    this.changeViewport(viewport);
  }

  onScroll(event) {
    event.preventDefault();
    event.stopPropagation();

    const viewport = {
      x: this.viewport.x + event.deltaX,
      y: this.viewport.y + event.deltaY,
      width: this.viewport.width,
      height: this.viewport.height,
    };

    this.changeViewport(viewport);

    clearTimeout(this.isScrolling);
    this.isScrolling = setTimeout(() => {
      this.changeViewport(this.viewport);
    }, 100);
  }

  onStopDrag() {
    this.dragging = false;
    this.currentPos = null;
  }
}

export default Photos;
