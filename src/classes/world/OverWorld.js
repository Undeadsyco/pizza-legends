class OverWorld {
  /* =================================  ================================= */
  /** @private @type {element} */ #element;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {canvas} */ #canvas;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {canvasContext} */ #ctx;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {Person} */ #cameraFocus;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {OverWorldMap} */ #Map;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {DirectionManager} */ #DirectionManager;
  /* =================================  ================================= */

  /** @param {overWorldConfig} config  */
  constructor(config) {
    this.#element = config.element;
    this.#canvas = this.#element.querySelector(".game-canvas");
    this.#ctx = this.#canvas.getContext("2d");
    this.#Map = null;
  }

  /* =================================  ================================= */
  /**
   * draws map and game objects
   * @param {Person} cameraPerson 
   */
  #drawScene(cameraPerson) {
    // draw lower image of map
    this.#Map.drawLowerImage(this.#ctx, cameraPerson);

    // draws game objects
    Object.values(this.#Map.gameObjects).sort((a, b) => a.y - b.y).forEach((/** @type {GameObject} */ obj) => {
      obj.Sprite.draw(this.#ctx, cameraPerson);
    })

    // draw upper image of map
    this.#Map.drawUpperImage(this.#ctx, cameraPerson);
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @param {number} delta time since last frame */
  #update() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    this.#cameraFocus = this.#Map.gameObjects.hero;

    // update game objects
    Object.values(this.#Map.gameObjects).forEach((/** @type {GameObject} */ obj) => {
      obj.update({
        direction: this.#DirectionManager.direction,
        map: this.#Map,
      });
    });

    // draws map and game objects
    this.#drawScene(this.#cameraFocus);
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * starts game loop
  */
  startGameLoop() {
    const step = (delta) => {
      this.#update(delta);

      requestAnimationFrame((dt) => {
        step(dt);
      });
    }
    step();
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.#Map.checkForActionCutscene()
    });
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  bindHeroPosCheck() {
    document.addEventListener(customEventKeys.PersonWalkComplete, (e) => {
      if (e.detail.whoId === 'hero') {
        this.#Map.checkForFootstepCutscene();
      }
    })
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * @param {overWorldMapConfig} map
   */
  startMap(mapConfig) {
    this.#Map = new OverWorldMap(mapConfig);
    this.#Map.overWorld = this;
    this.#Map.mountObjects();
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * inits the game world
   */
  init() {
    this.startMap(window.OverWorldMaps[mapkeys.DemoRoom]);

    this.bindActionInput();
    this.bindHeroPosCheck()

    this.#DirectionManager = new DirectionManager();
    this.#DirectionManager.init();

    this.startGameLoop();

    this.#Map.startCutscene([
      // move hero
      { who: characterKeys.hero, type: eventTypes.walk, direction: directions.down },
      { who: characterKeys.hero, type: eventTypes.walk, direction: directions.down },
      { who: characterKeys.hero, type: eventTypes.walk, direction: directions.down },
      { who: characterKeys.hero, type: eventTypes.stand, direction: directions.left, time: 100 },
      // move npc2
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.down },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.down },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.right },
      // hero & npc2 conversation
      { type: "textMessage", text: "time to make pizza npc2" },
      { type: "textMessage", text: "lets do it hero" },
      // move npc1
      { who: characterKeys.npc1, type: eventTypes.walk, direction: directions.left },
      // hero & npc1 conversation pt 1
      { type: "textMessage", text: "dont forget about me hero" },
      // rotate hero
      { who: characterKeys.hero, type: eventTypes.stand, direction: directions.right, time: 300 },
      // hero & npc1 conversation pt2
      { type: "textMessage", text: "of course not npc1" },
      // rotate characters
      { who: characterKeys.hero, type: eventTypes.stand, direction: directions.up, time: 100 },
      { who: characterKeys.npc1, type: eventTypes.stand, direction: directions.up, time: 100 },
      { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.up, time: 200 },
      // move npc2 to next position 
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.up },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.up },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.up },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.up },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.right },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.right },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.right },
      { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.right },
      { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.down, time: 100 },
    ]);
  }
  /* =================================  ================================= */
}