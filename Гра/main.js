class Main extends Phaser.Scene {
    preload() {
        this.load.spritesheet('pipe', 'assets/pipe.png', { frameWidth: 98, frameHeight: 83 });
        this.load.spritesheet('apple', 'assets/apple.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.pipes = this.physics.add.group(); // Група для сегментів змійки

        // Створюємо змійку з трьох сегментів (можна змінити за потребою)
        for (let i = 0; i < 1; i++) {
            let pipe = this.pipes.create(100 + i * 32, 100, 'pipe');
            pipe.setScale(0.65, 0.65);
            pipe.setOrigin(0, 0);
            pipe.setCollideWorldBounds(true); // Зробимо змійку обмеженою границями світу
        }

        this.input.keyboard.on('keydown', this.handleKeyDown, this);

        this.score = 0;
        this.labelScore = this.add.text(20, 20, "0", { fontSize: 24, color: "White" });

        this.timedEvent = this.time.addEvent({
            delay: 100000,
            callback: this.addRowOfPipes,
            callbackScope: this,
            loop: true
        });

        this.apple = this.physics.add.sprite(300, 300, 'apple'); // Додаємо яблуко
        this.apple.setScale(1, 1);
        this.apple.setCollideWorldBounds(true);

        // Додаємо обробник колізій між змійкою та яблуком
        this.physics.add.overlap(this.pipes, this.apple, this.eatApple, null, this);
    }

    update() {
        // Логіка оновлення гри
        this.moveSnake();
        
    }

    handleKeyDown(event) {
        // Обробка натискань клавіш
        switch (event.code) {
            case 'ArrowUp':
                this.direction = 'up';
                break;
            case 'ArrowDown':
                this.direction = 'down';
                break;
            case 'ArrowLeft':
                this.direction = 'left';
                break;
            case 'ArrowRight':
                this.direction = 'right';
                break;
        }
    }

    moveSnake() {
        // Логіка руху змійки
        this.pipes.children.iterate(function (pipe) {
            switch (this.direction) {
                case 'up':
                    pipe.y -= 5;
                    break;
                case 'down':
                    pipe.y += 5;
                    break;
                case 'left':
                    pipe.x -= 5;
                    break;
                case 'right':
                    pipe.x += 5;
                    break;
            }

            // Перевірка колізій з границями світу
            if (pipe.x < 0) {
                pipe.x = 0;
            }
            if (pipe.x > this.game.config.width - pipe.width) {
                pipe.x = this.game.config.width - pipe.width;
            }
            if (pipe.y < 0) {
                pipe.y = 0;
            }
            if (pipe.y > this.game.config.height - pipe.height) {
                pipe.y = this.game.config.height - pipe.height;
            }
        }, this);
    }

    addRowOfPipes() {
        // Логіка додавання нових "труб"
        var newX = Phaser.Math.Between(0, this.game.config.width - this.apple.width);
        var newY = Phaser.Math.Between(0, this.game.config.height - this.apple.height);
        this.apple.setPosition(newX, newY);
    }

    eatApple(pipe, apple) {
        // Логіка, що виконується при зіткненні змійки з яблуком
        this.score += 1;
        this.labelScore.setText(this.score);

        // Збільшуємо змійку (можете використати власну логіку для збільшення)
        // Очищаємо яблуко та встановлюємо нові координати для нього
        var newX = Phaser.Math.Between(0, this.game.config.width - this.apple.width);
        var newY = Phaser.Math.Between(0, this.game.config.height - this.apple.height);
        this.apple.setPosition(newX, newY);
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Main,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
};

var game = new Phaser.Game(config);