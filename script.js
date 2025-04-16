const canvas = document.getElementById("tennis-court");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const courtWidth = canvas.width;
const courtHeight = canvas.height;

let player = { x: 30, y: courtHeight / 2 - 30, width: 10, height: 60, speed: 5 };
let ai = { x: courtWidth - 40, y: courtHeight / 2 - 30, width: 10, height: 60, speed: 3 };
let ball = { x: courtWidth / 2, y: courtHeight / 2, radius: 7, speedX: 4, speedY: 4 };

let playerScore = 0;
let aiScore = 0;

const playerScoreElement = document.getElementById("player-score");
const aiScoreElement = document.getElementById("ai-score");

function drawCourt() {
    ctx.clearRect(0, 0, courtWidth, courtHeight);
    ctx.fillStyle = "#d2691e"; // Terre battue
    ctx.fillRect(0, 0, courtWidth, courtHeight);

    // Ligne du milieu
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(courtWidth / 2, 0);
    ctx.lineTo(courtWidth / 2, courtHeight);
    ctx.stroke();
}

function drawPlayer() {
    ctx.fillStyle = "#ff6347"; // Couleur du joueur
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAI() {
    ctx.fillStyle = "#4682b4"; // Couleur de l'IA
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);
}

function drawBall() {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= courtHeight) {
        ball.speedY = -ball.speedY; // Rebondir contre les bords supérieur et inférieur
    }

    // Collision avec le joueur
    if (ball.x - ball.radius <= player.x + player.width && ball.y >= player.y && ball.y <= player.y + player.height) {
        ball.speedX = -ball.speedX;
    }

    // Collision avec l'IA
    if (ball.x + ball.radius >= ai.x && ball.y >= ai.y && ball.y <= ai.y + ai.height) {
        ball.speedX = -ball.speedX;
    }

    // Marquer un point
    if (ball.x - ball.radius <= 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x + ball.radius >= courtWidth) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = courtWidth / 2;
    ball.y = courtHeight / 2;
    ball.speedX = -ball.speedX;
    ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1); // Choisir une direction aléatoire
}

function movePlayer(e) {
    const touchY = e.touches ? e.touches[0].clientY : e.clientY;
    if (touchY > player.height / 2 && touchY < courtHeight - player.height / 2) {
        player.y = touchY - player.height / 2;
    }
}

function moveAI() {
    if (ball.y < ai.y + ai.height / 2) {
        ai.y -= ai.speed;
    } else {
        ai.y += ai.speed;
    }
}

function updateScore() {
    playerScoreElement.textContent = playerScore;
    aiScoreElement.textContent = aiScore;
}

function gameLoop() {
    drawCourt();
    drawPlayer();
    drawAI();
    drawBall();
    moveBall();
    moveAI();
    updateScore();
}

document.addEventListener("mousemove", movePlayer);
document.addEventListener("touchmove", movePlayer);

setInterval(gameLoop, 1000 / 60);
