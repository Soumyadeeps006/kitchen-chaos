class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // No assets to load yet, we will use shapes
    }

    create() {
        this.scene.start('GameScene');
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.playerSpeed = 250;
        this.heldItem = null;
    }

    create() {
        // Create floor
        this.add.rectangle(0, 0, this.scale.width * 2, this.scale.height * 2, 0xdddddd);

        // Stations
        this.stations = this.physics.add.staticGroup();
        
        // Crate (Source of raw ingredients)
        let crate = this.add.rectangle(50, 300, 60, 60, 0x795548);
        crate.stationType = 'crate';
        crate.itemType = 'lettuce';
        this.stations.add(crate);

        // Cutting board (Green)
        let board = this.add.rectangle(150, 100, 60, 60, 0x4caf50);
        board.stationType = 'board';
        board.heldItem = null;
        this.stations.add(board);
        
        // Stove (Red)
        let stove = this.add.rectangle(400, 100, 60, 60, 0xf44336);
        stove.stationType = 'stove';
        stove.heldItem = null;
        this.stations.add(stove);
        
        // Delivery Window (Blue)
        let window = this.add.rectangle(this.scale.width / 2, this.scale.height - 50, 150, 40, 0x2196f3);
        window.stationType = 'window';
        this.stations.add(window);

        // Player (Yellow circle)
        this.player = this.add.circle(this.scale.width / 2, this.scale.height / 2, 20, 0xffeb3b);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setCircle(20);

        // Player Held Item Graphic (smaller circle)
        this.playerItemGraphic = this.add.circle(this.player.x, this.player.y, 10, 0x00ff00);
        this.playerItemGraphic.setVisible(false);

        // Collisions
        this.physics.add.collider(this.player, this.stations);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Mobile tap to move
        this.input.on('pointerdown', (pointer) => {
            this.targetPosition = { x: pointer.x, y: pointer.y };
        });

        // Instructions text
        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: 0\nMove: Arrows/Touch\nInteract: SPACE near station', { 
            fontSize: '16px', 
            fill: '#000' 
        });

        // Interaction Logic
        this.spaceKey.on('down', () => this.handleInteraction());
    }

    handleInteraction() {
        // Find closest station
        let closestStation = null;
        let minDistance = 60; // Interaction range
        
        this.stations.getChildren().forEach(station => {
            let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, station.x, station.y);
            if (dist < minDistance) {
                closestStation = station;
                minDistance = dist;
            }
        });

        if (!closestStation) return;

        if (closestStation.stationType === 'crate' && !this.heldItem) {
            // Pick up from crate
            this.heldItem = closestStation.itemType;
            this.updatePlayerItemGraphic();
        } 
        else if (closestStation.stationType === 'window' && this.heldItem) {
            // Deliver item
            this.heldItem = null;
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score + '\nMove: Arrows/Touch\nInteract: SPACE near station');
            this.updatePlayerItemGraphic();
            
            // Randomly shift the window to make it confusing!
            closestStation.x = Phaser.Math.Between(100, this.scale.width - 100);
            closestStation.y = Phaser.Math.Between(100, this.scale.height - 100);
            closestStation.body.updateFromGameObject();
        }
    }

    updatePlayerItemGraphic() {
        if (this.heldItem) {
            this.playerItemGraphic.setVisible(true);
            this.playerItemGraphic.setFillStyle(this.heldItem === 'lettuce' ? 0x8bc34a : 0xffffff);
        } else {
            this.playerItemGraphic.setVisible(false);
        }
    }

    update(time, delta) {
        // Keyboard movement
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown) velocityX = -this.playerSpeed;
        else if (this.cursors.right.isDown) velocityX = this.playerSpeed;

        if (this.cursors.up.isDown) velocityY = -this.playerSpeed;
        else if (this.cursors.down.isDown) velocityY = this.playerSpeed;

        // If no keyboard input, check target position from pointer
        if (velocityX === 0 && velocityY === 0 && this.targetPosition) {
            const dx = this.targetPosition.x - this.player.x;
            const dy = this.targetPosition.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                velocityX = (dx / distance) * this.playerSpeed;
                velocityY = (dy / distance) * this.playerSpeed;
            } else {
                this.targetPosition = null;
            }
        } else {
            this.targetPosition = null;
        }

        this.player.body.setVelocity(velocityX, velocityY);

        // Update held item graphic position
        this.playerItemGraphic.setPosition(this.player.x, this.player.y - 15);
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth > 800 ? 800 : window.innerWidth,
    height: window.innerHeight > 600 ? 600 : window.innerHeight,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, GameScene]
};

const game = new Phaser.Game(config);
