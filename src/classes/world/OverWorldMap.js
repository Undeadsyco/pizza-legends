class OverWorldMap {
  /** @private @type {Image} */ #lowerImage;
  /** @private @type {Image} */ #upperImage;

  /** @private @type {boolean} */ #isLowerLoaded;
  /** @private @type {boolean} */ #isUpperLoaded;

  /** @public @type {gameObjects} */ #gameObjects
  get gameObjects() { return this.#gameObjects }

  /** @param {mapData} config  */
  constructor(config) {
    this.#gameObjects = config.gameObjects;

    this.#lowerImage = new Image();
    this.#lowerImage.src = config.map.lower;
    this.#lowerImage.onload = () => {
      this.#isLowerLoaded = true
    }

    this.#upperImage = new Image();
    this.#upperImage.src = config.map.upper;
    this.#upperImage.onload = () => {
      this.#isUpperLoaded = true;
    }
  }

  drawLowerImage(ctx) { this.#isLowerLoaded && ctx.drawImage(this.#lowerImage, 0, 0); }
  drawUpperImage(ctx) { this.#isUpperLoaded && ctx.drawImage(this.#upperImage, 0, 0); }
}

window.OverWorldMaps = {
  /** @type {mapData} */ DemoRoom: {
    map: {
      lower: "../../../static/maps/DemoLower.png",
      upper: "../../../static/maps/DemoUpper.png",
    },
    gameObjects: {
      hero: new Person({
        pos: { x: utils.withGrid(5), y: utils.withGrid(6) },
        controlled: true,
      }),
      npc1: new Person({
        pos: { x: utils.withGrid(7), y: utils.withGrid(9) },
        src: "../../../static/characters/people/npc1.png",
      }),
    },
    // walls: {
    //   [adjustForGrid(1, 3)]: true,
    //   [adjustForGrid(2, 3)]: true,
    //   [adjustForGrid(3, 3)]: true,
    //   [adjustForGrid(4, 3)]: true,
    //   [adjustForGrid(5, 3)]: true,
    //   [adjustForGrid(6, 4)]: true,
    //   [adjustForGrid(7, 2)]: true, // door
    //   [adjustForGrid(8, 4)]: true,
    //   [adjustForGrid(9, 3)]: true,
    //   [adjustForGrid(10, 3)]: true,
    //   [adjustForGrid(7, 6)]: true,
    //   [adjustForGrid(8, 6)]: true,
    //   [adjustForGrid(7, 7)]: true,
    //   [adjustForGrid(8, 7)]: true,
    // }
  },
  /** @type {mapData} */ Kitchen: {
    map: {
      lower: "../../../static/maps/KitchenLower.png",
      upper: "../../../static/maps/KitchenUpper.png",
    },
    gameObjects: {
      hero: new Person({
        pos: { x: utils.withGrid(5), y: utils.withGrid(6) },
        controlled: true,
      }),
      npc1: new Person({
        pos: { x: utils.withGrid(9), y: utils.withGrid(6) },
        src: "../../../static/characters/people/npc1.png",
      }),
      npc2: new Person({
        pos: { x: utils.withGrid(10), y: utils.withGrid(8) },
        src: "../../../static/characters/people/npc2.png",
      }),
    },
    // walls: {
    //   [adjustForGrid(1, 3)]: true, // wall
    //   [adjustForGrid(2, 3)]: true, // wall
    //   [adjustForGrid(3, 3)]: true, // wall
    //   [adjustForGrid(4, 3)]: true, // wall
    //   [adjustForGrid(5, 3)]: true, // wall
    //   [adjustForGrid(6, 3)]: true, // wall
    //   [adjustForGrid(7, 3)]: true, // wall
    //   [adjustForGrid(8, 3)]: true, // wall
    //   [adjustForGrid(9, 3)]: true, // wall
    //   [adjustForGrid(10, 3)]: true, // wall
    //   [adjustForGrid(11, 5)]: true, // wall
    //   [adjustForGrid(12, 5)]: true, // wall
    //   [adjustForGrid(1, 5)]: true, // oven
    //   [adjustForGrid(1, 6)]: true, // oven
    //   [adjustForGrid(1, 7)]: true, // oven
    //   [adjustForGrid(6, 7)]: true, // countertop1
    //   [adjustForGrid(7, 7)]: true, // countertop1
    //   [adjustForGrid(9, 7)]: true, // countertop2
    //   [adjustForGrid(10, 7)]: true, // countertop2
    //   [adjustForGrid(1, 9)]: true, // box
    //   [adjustForGrid(2, 9)]: true, // box
    //   [adjustForGrid(9, 9)]: true, // coutertop3
    //   [adjustForGrid(10, 9)]: true, // coutertop3
    // }
  }
}