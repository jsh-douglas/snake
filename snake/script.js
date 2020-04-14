function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

function arraysEqual(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length == b.length) {
            for (let i = 0; i < a.length; i++) {
                if (Array.isArray(a[i])) {
                    if (!arraysEqual(a[i], b[i])) {
                        return false;
                    }
                } else if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    } else {
        return a === b;
    }
}

let snake = {
    head: this.body,
    body: "#5d55ed",
    pos: [
        {x: 0, y: 1},
        {x: 0, y: 2}
    ],
    directions: {
        37: [-1, 0], // left
        38: [0, -1], // up
        39: [1, 0], // right
        40: [0, 1] // down
    },
    directionVector: [1, 0],
    nextDirectionVector: [1, 0],

    draw: function(canvas) {
        for (snakePart of this.pos.slice(1)) {
            canvas.context.fillStyle = this.body;
            canvas.context.fillRect(snakePart.x * canvas.gridSquareSize, snakePart.y * canvas.gridSquareSize, canvas.gridSquareSize, canvas.gridSquareSize);
        }
        canvas.context.fillStyle = this.head;
        canvas.context.fillRect(this.pos[0].x * canvas.gridSquareSize, this.pos[0].y * canvas.gridSquareSize, canvas.gridSquareSize, canvas.gridSquareSize);

    },

    advance: function() {
        this.directionVector = this.nextDirectionVector;
        this.pos.pop();
        this.pos.unshift(JSON.parse(JSON.stringify(this.pos))[0]);
        this.pos[0].x += this.directionVector[0];
        this.pos[0].y += this.directionVector[1];
    },

    extend: function() {
        newTail = {x: this.pos[this.pos.length - 1].x, y: this.pos[this.pos.length - 1].y};
        this.pos.push(newTail);
    },

    updateDirection: function(keyCode) {
        let x = this.directionVector;
        if (this.directions[keyCode]) {
            if (this.directions[keyCode][0] != x.map(x => x * -1)[0] && this.directions[keyCode][1] != x.map(x => x * -1)[1]) {
                this.nextDirectionVector = this.directions[keyCode];
            }
        }
        
    },

    checkCollision: function(canvas, food) {
        if (this.pos[0].x < 0 || this.pos[0].x > canvas.gridSquareRowCount - 1) {
            return true;
        } else if (this.pos[0].y < 0 || this.pos[0].y > canvas.gridSquareColCount - 1) {
            return true;
        } else if (this.pos[0].x == food.pos.x && this.pos[1].y == food.pos.y) {
            console.log('food collected');
            this.extend();
            food.remove();
        }
        for (part of this.pos.slice(1)) {
            if (part.x == this.pos[0].x && part.y == this.pos[0].y) {
                return true;
            }
        }
        return false;
    },

    speed: 550
}

let food = {
    color: "#f54263",
    pos: {x: null, y: null},
    draw: function(canvas) {
        canvas.context.fillStyle = this.color;
        canvas.context.fillRect(this.pos.x * canvas.gridSquareSize, this.pos.y * canvas.gridSquareSize, canvas.gridSquareSize, canvas.gridSquareSize);        
    },
    place: function(canvas, sanke) {
        do {
            this.pos.x = Math.floor(Math.random() * canvas.gridSquareRowCount);
            this.pos.y = Math.floor(Math.random() * canvas.gridSquareColCount);
            available = true;
            for (snakePart of snake.pos) {
                if (isEquivalent(snakePart, this.pos)) {
                    available = false;
                }
            }
            if (available) {
                this.draw(canvas);
            }
        } while (available == false);
    },
    remove: function() {
        this.pos.x = this.pos.y = null;
    }
}


function init() {
    let canvas = document.getElementById('mainCanvas');
    let canvasContainer = document.getElementById("canvasContainer")
    if (canvas.getContext) {
        canvas.context = canvas.getContext("2d");

        canvas.gridSquareSize = 25;
        canvas.gridSquareRowCount =  Math.floor(canvasContainer.clientWidth / canvas.gridSquareSize);
        canvas.gridSquareColCount = Math.floor(canvasContainer.clientHeight / canvas.gridSquareSize);
        
        canvas.width =  canvas.gridSquareRowCount * canvas.gridSquareSize;
        canvas.height = canvas.gridSquareColCount * canvas.gridSquareSize;

        canvas.color = "#ffffff";

        canvas.fill = function() {
            this.context.fillStyle = this.color;
            this.context.fillRect(0, 0, this.width, this.height);
        }

        loop = setInterval(function() {mainLoop(canvas, food)}, snake.speed);
        
    } else {
        console.log("Canvas Unsupported");
    }
}


document.addEventListener('keydown', function() {snake.updateDirection(event.keyCode)});

function mainLoop(canvas) {
    if (snake.checkCollision(canvas, food)) {
        clearInterval(loop);
    } else {
        if (!food.pos.x) {
            food.place(canvas, snake);
        }
        canvas.fill();
        food.draw(canvas);
        snake.draw(canvas);
        snake.advance();
    }
   
}