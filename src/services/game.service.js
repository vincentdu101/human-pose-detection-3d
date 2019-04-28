
let gameState = "STOPPED"; 
let stopped = "STOPPED";
let started = "STARTED";
let lives = 3;
let startingLives = 3;
let startingTimer = 30;
let timer;

export default class GameService {

    static startGame() {
        gameState = started;
        lives = startingLives;
        timer = startingTimer;
        let interval = setInterval(() => {
            timer -= 1;
            if (timer === 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    static hasGameStarted() {
        return gameState === started;
    }

    static stopGame() {
        gameState = stopped;
        timer = startingTimer;
        lives = startingLives;
    }

    static hitOccurred() {
        lives -= 1;
        lives = lives < 0 ? 0 : lives;
    }

    static getTimeLeft() {
        return !timer ? startingTimer : timer;
    }

    static getLives() {
        return lives;
    }

}