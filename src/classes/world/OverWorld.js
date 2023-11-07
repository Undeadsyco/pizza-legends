class OverWorld {
  /** @private @type {HTMLElement} */ #element;
  /** @private @type {HTMLCanvasElement} */ #canvas;
  /** @private @type {CanvasRenderingContext2D} */ #ctx;
  /** @private @type {OverWorldMap} */ #Map
  /** @private @type {DirectionManager} */ #DirectionManager;

  /** @param {overworldConfig} config  */
  constructor(config) {
    this.#element = config.element;
    this.#canvas = this.#element.querySelector(".game-canvas");
    this.#ctx = this.#canvas.getContext("2d");
    this.#Map = null;
  }

  startGameLoop() {
    const step = (delta) => {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

      this.#drawScene();

      requestAnimationFrame((dt) => {
        step(dt);
      });
    }
    step();
  }

  #drawScene() {
    this.#Map.drawLowerImage(this.#ctx);

    Object.values(this.#Map.gameObjects).forEach((/** @type {GameObject} */ obj) => {
      obj.update({ direction: this.#DirectionManager.direction });
      obj.Sprite.draw(this.#ctx);
    })

    this.#Map.drawUpperImage(this.#ctx);
  }

  init() {
    this.#Map = new OverWorldMap(window.OverWorldMaps.DemoRoom);

    this.#DirectionManager = new DirectionManager();
    this.#DirectionManager.init();

    this.startGameLoop();
  }

  draw() {

  }
}