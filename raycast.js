const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;
const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180);

const WALL_STRIP_WIDTH = 4;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

class Map {
	constructor() {
		this.grid = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            		[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            		[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            		[1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            		[1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

		];
	}
        hasWallAt(x, y)
        {
                if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT)
                        return true;
                var mapX = Math.floor(x / TILE_SIZE);
                var mapY = Math.floor(y / TILE_SIZE);
                return this.grid[mapY][mapX] != 0;
        }
        render() {
                for (var i = 0; i < MAP_NUM_ROWS; i++) {
                        for (var j = 0; j < MAP_NUM_COLS; j++) {
                                var tileX = j * TILE_SIZE;
                                var tileY = i * TILE_SIZE;
                                var tileColor = this.grid[i][j] == 1 ? "#222" : "#FFF";
                                stroke("#222");
                                fill(tileColor);
                                rect (tileX, tileY, TILE_SIZE, TILE_SIZE);
                        }
                }
        }
}

class   Player {
        constructor() {
                this.x = WINDOW_WIDTH / 2;
                this.y = WINDOW_HEIGHT / 2;
                this.radius = 3;
                this.turnDirection = 0; // -1 if left, +1 if right
                this.walkDirection = 0; // -1 if back, +1 if forward
                this.rotationAngle = Math.PI / 2;
                this.moveSpeed = 2.0;
                this.rotationSpeed = 2 * (Math.PI / 180); // (Math.PI/180) is conversion to radius
        }
        update() {
                // update player pos based on turnDirection and walkDirection
                console.log(this.turnDirection);
                this.rotationAngle += this.turnDirection * this.rotationSpeed;
                /* Going Forward */
                var moveStep = this.walkDirection * this.moveSpeed;
                var newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
                var newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;
                // Only set if not colliding
                if (!grid.hasWallAt(newPlayerX, newPlayerY))
                {
                        this.x = newPlayerX;
                        this.y = newPlayerY;
                }
        }
        render() {
                noStroke();
                fill("red");
                circle(this.x, this.y, this.radius);
               /*stroke("red");
                line(
                        this.x, 
                        this.y, 
                        this.x + Math.cos(this.rotationAngle) * 30, 
                        this.y + Math.sin(this.rotationAngle) * 30); */
        }
}

class Ray {
        constructor(rayAngle) {
                this.rayAngle = normalizeAngle(rayAngle);
                this.wallHitX = 0;
                this.wallHitY = 0; // track the position where the rays hits the wall
                this.distance = 0; // distance between player and collision between X and Y
                this.wasHitVertical = false;
        
                this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
                this.isRayFacingUp = !this.isRayFacingDown;

                this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
                this.isRayFacingLeft = !this.isRayFacingRight;
        }
        cast(columnId) {
                var xintercept, yintercept;
                var xstep, ystep;
                
                /* --------------------------------------------- */
                /* --- HORIZONTAL RAY-GRID INTERSECTION CODE --- */
                /* --------------------------------------------- */
                var foundHorWallHit = false;
                var horWallHitX = 0;
                var horWallHitY = 0;

                console.log("isRayFacingRight?", this.isRayFacingRight);

                // Find the y-coordinate of the closest horizontal grid intersection
                yintercept = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
                yintercept += this.isRayFacingDown ? TILE_SIZE : 0;

                // Find the x-coordinate of the closest horizontal grid intersection
                xintercept = player.x + (yintercept - player.y) / Math.tan(this.rayAngle);

                // Calculate the increment xstep and ystep
                ystep = TILE_SIZE;
                ystep *= this.isRayFacingUp ? -1 : 1;

                xstep = TILE_SIZE / Math.tan(this.rayAngle);
                xstep *= (this.isRayFacingLeft && xstep > 0) ? -1 : 1;
                xstep *= (this.isRayFacingRight && xstep < 0) ? -1 : 1;

                var nextHorTouchX = xintercept;
                var nextHorTouchY = yintercept;
                if (this.isRayFacingUp)
                        nextHorTouchY--; // move one pixel so that the player is in the grid

                // Increment xstep and ystep until we find a wall
                while (nextHorTouchX >= 0 && nextHorTouchX <= WINDOW_WIDTH
                        && nextHorTouchY >= 0 && nextHorTouchY <= WINDOW_HEIGHT) {
                        if (grid.hasWallAt(nextHorTouchX, nextHorTouchY)) {
                                foundHorWallHit = false;
                                horWallHitX = nextHorTouchX;
                                horWallHitY = nextHorTouchY;
                                stroke("red");
                                line(player.x, player.y, horWallHitX, horWallHitY);
                                break ;
                        } else {
                                nextHorTouchX += xstep;
                                nextHorTouchY += ystep;
                        }
                }
                /* --------------------------------------------- */
                /* --- VERTICAL RAY-GRID INTERSECTION CODE --- */
                /* --------------------------------------------- */
                var foundVerWallHit = false;
                var verWallHitX = 0;
                var verWallHitY = 0;

                console.log("isRayFacingRight?", this.isRayFacingRight);

                // Find the x-coordinate of the closest vertical grid intersection
                xintercept = Math.floor(player.x / TILE_SIZE) * TILE_SIZE;
                xintercept += this.isRayFacingRight ? TILE_SIZE : 0;

                // Find the y-coordinate of the closest vertical grid intersection
                yintercept = player.y + (xintercept - player.x) * Math.tan(this.rayAngle);

                // Calculate the increment xstep and ystep
                xstep = TILE_SIZE;
                xstep *= this.isRayFacingLeft ? -1 : 1;

                ystep = TILE_SIZE * Math.tan(this.rayAngle);
                ystep *= (this.isRayFacingUp && ystep > 0) ? -1 : 1;
                ystep *= (this.isRayFacingDown && ystep < 0) ? -1 : 1;

                var nextVerTouchX = xintercept;
                var nextVerTouchY = yintercept;
                if (this.isRayFacingLeft)
                        nextVerTouchX--; // move one pixel so that the player is in the grid

                // Increment xstep and ystep until we find a wall
                while (nextVerTouchX >= 0 && nextVerTouchX <= WINDOW_WIDTH
                        && nextVerTouchY >= 0 && nextVerTouchY <= WINDOW_HEIGHT) {
                        if (grid.hasWallAt(nextVerTouchX, nextVerTouchY)) {
                                foundVerWallHit = false;
                                verWallHitX = nextVerTouchX;
                                verWallHitY = nextVerTouchY;
                                stroke("red");
                                line(player.x, player.y, verWallHitX, verWallHitY);
                                break ;
                        } else {
                                nextVerTouchX += xstep;
                                nextVerTouchY += ystep;
                        }
                }

                // calculate both horizontal and ver distances and choose the smallest value.
                var horHitDist = (foundHorWallHit) 
                        ? distanceBetweenPoints(player.x, player.y, horWallHitX, horWallHitY)
                        : Number.MAX_VALUE;
                var verHitDist = (foundVerWallHit)
                        ? distanceBetweenPoints(player.x, player.y, verWallHitX, verWallHitY)
                        : Number.MAX_VALUE;

                // only store the smallest tof the distances
                this.wallHitX = (horHitDist < verHitDist) ? horWallHitX : verWallHitX;
                this.wallHitY = (horHitDist < verHitDist) ? horWallHitY : verWallHitY;
                this.distance = (horHitDist < verHitDist) ? horHitDist : verHitDist;
                this.wasHitVertical = (verHitDist < horHitDist);
        }
        render() {
                stroke("rgba(255, 0, 0, 0.1)");
                line(
                        player.x,
                        player.y,
                        this.wallHitX,
                        this.wallHitY
                );
        }
}

var grid = new Map();
var player = new Player();
var rays = [];

function keyPressed() {
        if (keyCode == UP_ARROW) {
                player.walkDirection = +1;
        } else if (keyCode == DOWN_ARROW) {
                player.walkDirection = -1;
        } else if (keyCode == RIGHT_ARROW) {
                player.turnDirection = +1;
        } else if (keyCode == LEFT_ARROW) {
                player.turnDirection = -1;
        }
}

function keyReleased() {
        if (keyCode == UP_ARROW) {
                player.walkDirection = 0;
        } else if (keyCode == DOWN_ARROW) {
                player.walkDirection = 0;
        } else if (keyCode == RIGHT_ARROW) {
                player.turnDirection = 0;
        } else if (keyCode == LEFT_ARROW) {
                player.turnDirection = 0;
        }
}

function castAllRays() {
        var columnId = 0;

        // start first ray by subtracting half of FOV
        var rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

        rays = []; // Empty all arrays

        // loop all columns casting the rays
        for (var i = 0; i < NUM_RAYS; i++)
        {
                var ray = new Ray(rayAngle);
                ray.cast(columnId);
                rays.push(ray);
                rayAngle += FOV_ANGLE / NUM_RAYS;
                columnId++;
        }
}

function normalizeAngle(angle) {
        angle = angle % (2 * Math.PI); // this is how we always keep our value between 0 and 360
        if (angle < 0)
                angle = 2 * Math.PI + angle;
        return angle;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function setup() {
	// TODO:  initialize all objects
        createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
	// update all game objects before we render the next frame
        player.update();
        castAllRays();
}

function draw() {
        // render all objects frame by frame
	update();
	grid.render();
        for (ray of rays) {
                ray.render();
        }
        player.render();
}
