(() => {
  'use strict';

  const
  const CANVAS_WIDTH = 10;
  const CANVAS_HEIGHT = 10;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  function canvasInit() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawRect({
    x,
    y,
    width,
    height
  }) {
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, width, height);
  }
})();
