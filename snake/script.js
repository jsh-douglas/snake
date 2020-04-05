let snake = {
    head: this.body,
    body: "#5d55ed",
    pos: [
        {x: 0, y: 1},
        {x: 0, y: 2},
        {x: 0, y: 3},
        {x: 0, y: 4},
        {x: 0, y: 5},
        {x: 0, y: 6},
        {x: 0, y: 7},
        {x: 0, y: 8},
        {x: 0, y: 9},
        {x: 0, y: 10},
        {x: 0, y: 11}
    ],
    directions: {
        37: [-1, 0], // left
        38: [0, -1], // up
        39: [1, 0], // right
        40: [0, 1] // down
    },
    directionVector: [1, 0],

    draw: function(canvas) {
        for (snakePart of this.pos.slice(1)) {
            canvas.context.fillStyle = this.body;
            canvas.context.fillRect(snakePart.x * canvas.gridSquareSize, snakePart.y * canvas.gridSquareSize, canvas.gridSquareSize, canvas.gridSquareSize);
        }
        canvas.context.fillStyle = this.head;
        canvas.context.fillRect(this.pos[0].x * canvas.gridSquareSize, this.pos[0].y * canvas.gridSquareSize, canvas.gridSquareSize, canvas.gridSquareSize);

    },

    advance: function() {
        this.pos.pop();
        this.pos.unshift(JSON.parse(JSON.stringify(this.pos))[0]);
        this.pos[0].x += this.directionVector[0];
        this.pos[0].y += this.directionVector[1];
    },

    updateDirection: function(keyCode) {
        let x = this.directionVector;
        if (this.directions[keyCode][0] != x.map(x => x * -1)[0] && this.directions[keyCode][1] != x.map(x => x * -1)[1]) {
            this.directionVector = this.directions[keyCode];
        }
    },

    checkCollision: function() {
        for (part of this.pos.slice(1)) {
            if (part.x == this.pos[0].x && part.y == this.pos[0].y) {
                clearInterval(loop);
            }
        }
    }
}


function init() {
    let canvas = document.getElementById('mainCanvas');
    let canvasContainer = document.getElementById("canvasContainer")
    if (canvas.getContext) {
        canvas.context = canvas.getContext("2d");

        canvas.gridSquareSize = 20;
        canvas.gridSquareRowCount =  Math.floor(canvasContainer.clientWidth / canvas.gridSquareSize);
        canvas.gridSquareColCount = Math.floor(canvasContainer.clientHeight / canvas.gridSquareSize);
        
        canvas.width =  canvas.gridSquareRowCount * canvas.gridSquareSize;
        canvas.height = canvas.gridSquareColCount * canvas.gridSquareSize;

        canvas.color = "#ffffff";

        canvas.fill = function() {
            this.context.fillStyle = this.color;
            this.context.fillRect(0, 0, this.width, this.height);
        }

        loop = setInterval(function() {mainLoop(canvas)}, 100)
        
    } else {
        console.log("Canvas Unsupported");
    }
}


document.addEventListener('keydown', function() {snake.updateDirection(event.keyCode)});

function mainLoop(canvas) {
    canvas.fill();
    snake.draw(canvas);
    snake.checkCollision();
    snake.advance();
}