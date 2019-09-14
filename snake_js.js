class Game {
  constructor() {
    this.PX_SPRITE = 64;
    this.GAME_WIDTH = 960;
    this.GAME_HEIGHT = 640;
    this.SPRITE_SCALE = 2;
    this.SPEED_SNAKE = 32;
    this.imgBackground = new Image();
    this.imgBackground.src = "img/background_sand.jpg";
    this.imgSnake = new Image();
    this.imgSnake.src = "img/snake_sprite.png";
    this.idTimer = "";
    this.snake = new Snake();
  }

  createScene() {
    let canvasGame = document.createElement("canvas");
    canvasGame.id = "canvasGame";
    canvasGame.width = this.GAME_WIDTH;
    canvasGame.height = this.GAME_HEIGHT;
    document.body.appendChild(canvasGame);

    this.ctx = canvasGame.getContext("2d");

    let score = document.createElement('div');
    score.id = 'score';
    score.innerHTML = 'Score: ' + 0;
    document.body.appendChild(score);

    let buttonStart = document.createElement('input');
    buttonStart.id = 'buttonStart';
    buttonStart.type = 'button';
    buttonStart.value = 'Start';
    document.body.appendChild(buttonStart);

    let buttonPlay = document.createElement('input');
    buttonPlay.id = 'buttonPlay';
    buttonPlay.type = 'button';
    buttonPlay.value = 'Play';
    document.body.appendChild(buttonPlay);

    let buttonPause = document.createElement('input');
    buttonPause.id = 'buttonPause';
    buttonPause.type = 'button';
    buttonPause.value = 'Pause';
    document.body.appendChild(buttonPause);

    buttonStart.addEventListener("click", this.startGame);
    buttonPlay.addEventListener("click", this.playGame);
    buttonPause.addEventListener("click", this.pauseGame);
    document.addEventListener("keydown", this.snake.changeDirection);
  }

  startGame() {
    clearTimeout(game.idTimer);
    game.snake = new Snake();
    game.updateScore();
    game.snake.moveSnake();
    game.snake.generateApple(1, 19);
  }

  playGame() {
    clearTimeout(game.idTimer);
    game.snake.moveSnake();
  }

  pauseGame() {
    clearTimeout(game.idTimer);
  }

  updateScore() {
    document.querySelector('#score').innerHTML = 'Score: ' + this.snake.score;
  }

  playAudioEatApple() {
    let audio = new Audio();
    audio.src = '/E:/html, css, js/JS/snake canvas/audio/crunch_apple.mp3';
    audio.play();
  }

  renderSnake(snake) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // background
    this.ctx.drawImage(this.imgBackground, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

    // head
    let objDirectionHead = snake.getIndexSpriteHead(snake.bodySnake[0]);
    this.ctx.drawImage(this.imgSnake, objDirectionHead.spriteX * this.PX_SPRITE, objDirectionHead.spriteY * this.PX_SPRITE, this.PX_SPRITE,
      this.PX_SPRITE, snake.bodySnake[0].positionX * this.SPEED_SNAKE, snake.bodySnake[0].positionY * this.SPEED_SNAKE,
      this.PX_SPRITE / this.SPRITE_SCALE, this.PX_SPRITE / this.SPRITE_SCALE);

    // body
    for (let i = 1; i < snake.bodySnake.length - 1; i++) {
      let indNext = i + 1;
      let objDirectionBody = snake.getIndexSpriteBody(snake.bodySnake[i], snake.bodySnake[indNext]);
      this.ctx.drawImage(this.imgSnake, objDirectionBody.spriteX * this.PX_SPRITE, objDirectionBody.spriteY * this.PX_SPRITE, this.PX_SPRITE,
        this.PX_SPRITE, snake.bodySnake[i].positionX * (this.PX_SPRITE / this.SPRITE_SCALE), snake.bodySnake[i].positionY *
        (this.PX_SPRITE / this.SPRITE_SCALE), this.PX_SPRITE / this.SPRITE_SCALE, this.PX_SPRITE / this.SPRITE_SCALE);
    }

    // tail
    let indTail = snake.bodySnake.length - 1;
    let objDirectionTail = snake.getIndexSpriteTail(snake.bodySnake[indTail]);
    this.ctx.drawImage(this.imgSnake, objDirectionTail.spriteX * this.PX_SPRITE, objDirectionTail.spriteY * this.PX_SPRITE, this.PX_SPRITE,
      this.PX_SPRITE, snake.bodySnake[indTail].positionX * (this.PX_SPRITE / this.SPRITE_SCALE), snake.bodySnake[indTail].positionY *
      (this.PX_SPRITE / this.SPRITE_SCALE), this.PX_SPRITE / this.SPRITE_SCALE, this.PX_SPRITE / this.SPRITE_SCALE);

    // apple
    this.ctx.drawImage(this.imgSnake, 0 * this.PX_SPRITE, 3 * this.PX_SPRITE, this.PX_SPRITE, this.PX_SPRITE,
      snake.coordsApple.positionX * (this.PX_SPRITE / this.SPRITE_SCALE), snake.coordsApple.positionY *
      (this.PX_SPRITE / this.SPRITE_SCALE), this.PX_SPRITE / this.SPRITE_SCALE, this.PX_SPRITE / this.SPRITE_SCALE);
  }
}

class Snake {
  constructor() {
    this.bodySnake = [{
      positionX: 16,
      positionY: 10,
      directionX: 1,
      directionY: 0
    }, {
      positionX: 15,
      positionY: 10,
      directionX: 1,
      directionY: 0
    }, {
      positionX: 14,
      positionY: 10,
      directionX: 1,
      directionY: 0
    }];
    this.coordsApple = {
      positionX: 0,
      positionY: 0
    };
    this.score = 0;
  }

  moveSnake() {
    this.bodySnake.pop();
    this.increaseSnake();

    if (this.chekEncounterWithSelf()) {
      alert("GAME OVER");
      return;
    }

    if (this.chekEncounterWitApple()) {
      game.playAudioEatApple();
      this.increaseScore();
      game.updateScore();
      this.increaseSnake();
      this.generateApple(0, 19);
    }

    this.reverseSnakeAtEncounterWithBorder();

    game.renderSnake(this);
    game.idTimer = setTimeout(() => this.moveSnake(), 100);
  }

  increaseSnake() {
    this.bodySnake.unshift({
      positionX: this.bodySnake[0].positionX + this.bodySnake[0].directionX,
      positionY: this.bodySnake[0].positionY + this.bodySnake[0].directionY,
      directionX: this.bodySnake[0].directionX,
      directionY: this.bodySnake[0].directionY
    });
  }

  changeDirection(e) {
    switch (e.keyCode) {
      case 38:
        if (game.snake.bodySnake[0].directionY === 1) {
          break;
        }
        game.snake.bodySnake[0].directionX = 0;
        game.snake.bodySnake[0].directionY = -1;
        break;
      case 40:
        if (game.snake.bodySnake[0].directionY === -1) {
          break;
        }
        game.snake.bodySnake[0].directionX = 0;
        game.snake.bodySnake[0].directionY = 1;
        break;
      case 39:
        if (game.snake.bodySnake[0].directionX === -1) {
          break;
        }
        game.snake.bodySnake[0].directionX = 1;
        game.snake.bodySnake[0].directionY = 0;
        break;
      case 37:
        if (game.snake.bodySnake[0].directionX === 1) {
          break;
        }
        game.snake.bodySnake[0].directionX = -1;
        game.snake.bodySnake[0].directionY = 0;
        break;
    }
  }

  generateApple(min, max) {
    this.coordsApple.positionX = Math.round(Math.random() * (max - min) + min);
    this.coordsApple.positionY = Math.round(Math.random() * (max - min) + min);
  }

  getIndexSpriteHead(head) {
    let spriteX, spriteY;
    // check horizont
    switch (head.directionX) {
      case 1:
        spriteX = 4;
        spriteY = 0;
        break;
      case -1:
        spriteX = 3;
        spriteY = 1;
        break;
    }

    // check vertical
    switch (head.directionY) {
      case 1:
        spriteX = 4;
        spriteY = 1;
        break;
      case -1:
        spriteX = 3;
        spriteY = 0;
        break;
    }

    return {
      spriteX: spriteX,
      spriteY: spriteY
    };
  }

  getIndexSpriteBody(elemBody, nextElemBody) {
    let spriteX, spriteY;
    // check horizont
    switch (elemBody.directionX) {
      case 1:
        spriteX = 1;
        spriteY = 0;
        break;
      case -1:
        spriteX = 1;
        spriteY = 0;
        break;
    }

    // check vertical
    switch (elemBody.directionY) {
      case 1:
        spriteX = 2;
        spriteY = 1;
        break;
      case -1:
        spriteX = 2;
        spriteY = 1;
        break;
    }

    // check turn
    if (nextElemBody.directionX === 1 && elemBody.directionY === -1) {
      spriteX = 2;
      spriteY = 2;
    } else if (nextElemBody.directionX === -1 && elemBody.directionY === -1) {
      spriteX = 0;
      spriteY = 1;
    } else if (nextElemBody.directionX === 1 && elemBody.directionY === 1) {
      spriteX = 2;
      spriteY = 0;
    } else if (nextElemBody.directionX === -1 && elemBody.directionY === 1) {
      spriteX = 0;
      spriteY = 0;
    } else if (nextElemBody.directionY === -1 && elemBody.directionX === -1) {
      spriteX = 2;
      spriteY = 0;
    } else if (nextElemBody.directionY === -1 && elemBody.directionX === 1) {
      spriteX = 0;
      spriteY = 0;
    } else if (nextElemBody.directionY === 1 && elemBody.directionX === 1) {
      spriteX = 0;
      spriteY = 1;
    } else if (nextElemBody.directionY === 1 && elemBody.directionX === -1) {
      spriteX = 2;
      spriteY = 2;
    }

    return {
      spriteX: spriteX,
      spriteY: spriteY,
    };
  }

  getIndexSpriteTail(tail) {
    let spriteX, spriteY;
    // check horizont
    switch (tail.directionX) {
      case 1:
        spriteX = 4;
        spriteY = 2;
        break;
      case -1:
        spriteX = 3;
        spriteY = 3;
        break;
    }

    // check vertical
    switch (tail.directionY) {
      case 1:
        spriteX = 4;
        spriteY = 3;
        break;
      case -1:
        spriteX = 3;
        spriteY = 2;
        break;
    }

    return {
      spriteX: spriteX,
      spriteY: spriteY
    };
  }

  reverseSnakeAtEncounterWithBorder() {
    for (let i = 0; i < this.bodySnake.length; i++) {
      if (this.bodySnake[i].positionX > 30) {
        this.bodySnake[i].positionX = 0;
        this.bodySnake[i].directionX = 1;
      }
      if (this.bodySnake[i].positionX < 0) {
        this.bodySnake[i].positionX = 30;
        this.bodySnake[i].directionX = -1;
      }
      if (this.bodySnake[i].positionY > 20) {
        this.bodySnake[i].positionY = 0;
        this.bodySnake[i].directionY = 1;
      }
      if (this.bodySnake[i].positionY < 0) {
        this.bodySnake[i].positionY = 20;
        this.bodySnake[i].directionY = -1;
      }
    }
  }

  chekEncounterWithSelf() {
    for (var i = 1; i < this.bodySnake.length; i++) {
      if (this.bodySnake[0].positionX === this.bodySnake[i].positionX &&
        this.bodySnake[0].positionY === this.bodySnake[i].positionY) {
        return true;
      }
    }
  }

  chekEncounterWitApple() {
    if (this.bodySnake[0].positionX === this.coordsApple.positionX &&
      this.bodySnake[0].positionY === this.coordsApple.positionY) {
      return true;
    }
  }

  increaseScore() {
    this.score += 1;
  }
}

game = new Game();
game.createScene();
game.startGame();
