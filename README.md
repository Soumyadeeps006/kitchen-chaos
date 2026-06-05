# Kitchen Chaos

A frantic 2D HTML5 cooking game built with [Phaser.js](https://phaser.io) and [Capacitor](https://capacitorjs.com/) for mobile deployment.

## Overview
In Kitchen Chaos, players navigate a chaotic kitchen environment, picking up raw ingredients from crates and delivering them to moving delivery windows while trying to maximize their score.

## Features
*   **Phaser 3 Engine:** Uses Phaser 3 for rendering, physics (Arcade), and game loop logic.
*   **Mobile Ready:** Implements touch/tap-to-move controls alongside standard keyboard arrows.
*   **Cross-Platform:** Uses Capacitor to wrap the web game into native Android and iOS applications.
*   **Dynamic Gameplay:** Delivery windows shift positions dynamically, keeping players on their toes!

## Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (includes npm)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
You can run the web version of the game using any standard local web server. For example:
```bash
npx serve .
```
Then open your browser to the local server address.

### Mobile Build (Capacitor)
To build and sync for native platforms (Android / iOS):
```bash
npx cap sync
```

To run on Android:
```bash
npx cap run android
```

To run on iOS (macOS required):
```bash
npx cap run ios
```

## How to Play
*   **Movement:** Use Arrow Keys or tap/click on the screen.
*   **Interaction:** Press `SPACE` when standing close to a station (pick up ingredients, deliver to window).

## License
This project is licensed under the ISC License.
