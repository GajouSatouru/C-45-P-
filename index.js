// Get the canvas element and its 2D context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create an image object and set its source
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// Game state variables
let gamePlaying = false; // Indicates whether the game is currently being played
const gravity = 0.5; // Gravity applied to the bird's flight
const speed = 6.2; // Speed of the game elements' movement
const size = [51, 36]; // Dimensions of the bird image
const jump = -11.5; // Vertical velocity applied when the bird jumps
const cTenth = canvas.width / 10; // Tenth of the canvas width

// Variables to keep track of game state and scores
let index = 0; // Index for animation and background movement
let bestScore = 0; // Best score achieved in the game
let flight, flyHeight, currentScore, pipes; // Bird's flight, height, current score, and pipes array

// Pipe settings
const pipeWidth = 78; // Width of the pipes
const pipeGap = 270; // Gap between the pipes
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; // Function to calculate random pipe placement

// Initialize game setup
const setup = () => {
    currentScore = 0; // Reset current score
    flight = jump; // Initialize bird's flight
    flyHeight = canvas.height / 2 - size[1] / 2; // Set initial fly height for the bird
    pipes = Array(3).fill().map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]); // Initialize pipe positions
};

// Main rendering function
const render = () => {
    index++; // Increment animation index
    // Draw background images to create illusion of movement
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

    // Check if game is in progress
    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed; // Move pipes to the left
            // Draw top and bottom pipes
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            // Check if bird passed a pipe
            if (pipe[0] <= -pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);
                // Remove and create a new pipe
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }

            // Check for collision with pipes
            if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(elem => elem)) {
                gamePlaying = false; // End the game
                setup(); // Reset game setup
            }
        });
    }

    // Update bird's position and draw it
    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity; // Apply gravity to the bird's flight
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]); // Limit bird's flight height
    } else {
        // Draw bird in start screen position
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size);
        flyHeight = canvas.height / 2 - size[1] / 2; // Reset bird's height
        // Draw start screen text
        ctx.fillText(`Best score : ${bestScore}`, 85, 245);
        ctx.fillText('Click to play', 90, 535);
        ctx.font = "bold 30px courier";
    }

    // Update score displays
    document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

    // Request the browser to perform the next animation frame
    window.requestAnimationFrame(render);
};

// Initialize game setup and start rendering after image loads
setup();
img.onload = render;

// Start the game on mouse click
document.addEventListener('click', () => gamePlaying = true);

// Apply jump when clicking anywhere on the window
window.onclick = () => flight = jump;
