class OverWorldMap {
  /* =================================  ================================= */
  /** @private @type {OverWorld} */ #overworld = null;
  /** @public @returns {OverWorld} */
  get overWorld() { return this.#overworld; }
  /** @public @param {OverWorld} value */
  set overWorld(value) { this.#overworld = value; }
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @private @type {Image} */ #lowerImage = new Image();;
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @private @type {Image} */ #upperImage = new Image();;
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @private @type {boolean} */ #isLowerLoaded;
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @private @type {boolean} */ #isUpperLoaded;
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @public @type {gameObjects} */ #gameObjects
  get gameObjects() { return this.#gameObjects }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {boolean} */ #isCutscenePlaying = false;
  /** @public @returns {boolean} */
  get isCutscenePlaying() { return this.#isCutscenePlaying; }
  /** @public @param {boolean} value */
  set isCutscenePlaying(value) { this.#isCutscenePlaying = value; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {walls} */ #walls;
  /** @public @returns {walls} */
  get walls() { return this.#walls; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {{ ""?: [{ events: [behaviorEvent] }] }} */ #actionSpaces
  /** @public @returns {{ ""?: [{ events: [behaviorEvent] }] }} */
  get actionSpaces() { return this.#actionSpaces; }
  /* =================================  ================================= */

  /** @param {overWorldMapConfig} config  */
  constructor(config) {
    this.#gameObjects = config.gameObjects;

    this.#walls = config.walls ?? {}
    this.#actionSpaces = config.actionSpaces || {};

    this.#lowerImage.src = config.map.lower;
    this.#lowerImage.onload = () => {
      this.#isLowerLoaded = true
    }

    this.#upperImage.src = config.map.upper;
    this.#upperImage.onload = () => {
      this.#isUpperLoaded = true;
    }
  }

  /* =================================  ================================= */
  /**
   * checks to see if the given image is loaded then draws the image if so
   * @param {canvasContext} ctx 
   * @param {Person} cameraPerson 
   * @param {boolean} isLoaded 
   * @param {Image} image 
   */
  #drawMapImage(ctx, cameraPerson, isLoaded, image) { isLoaded && ctx.drawImage(image, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y); }
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /**
   * draws lower map image
   * @param {canvasContext} ctx 
   * @param {Person} cameraPerson 
   */
  drawLowerImage(ctx, cameraPerson) { this.#drawMapImage(ctx, cameraPerson, this.#isLowerLoaded, this.#lowerImage); }
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /**
   * draws upper map image
   * @param {canvasContext} ctx 
   * @param {Person} cameraPerson 
   */
  drawUpperImage(ctx, cameraPerson) { this.#drawMapImage(ctx, cameraPerson, this.#isUpperLoaded, this.#upperImage); }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * checks to see if the next space being moved to is currently occupeied and returns a true value if so
   * @param {number} currentX 
   * @param {number} currentY 
   * @param {direction} direction
   * @returns {boolean}
   */
  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.#walls[`${x},${y}`] ?? false;
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * adds each gameobject to the #walls list for collisions between characters and objects
   */
  mountObjects() {
    Object.keys(this.#gameObjects).forEach(key => {
      let obj = this.#gameObjects[key];
      obj.id = key;
      obj.mount(this);
    })
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * loops through the list to dispatch each event
   * @param {[behaviorEvent]} events 
   */
  async startCutscene(events) {
    this.#isCutscenePlaying = true;

    for (let i = 0; i < events.length; i += 1) {
      const eventHandler = new OverWorldEvent({
        map: this,
        eventConfig: events[i],
      });

      await eventHandler.init();
    }

    this.#isCutscenePlaying = false;

    Object.values(this.#gameObjects).forEach((/** @type {GameObject} */ obj) => obj.doBehaviorEvent(this));
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * checks to see if thers a character with a cutscene in the next position ahead 
   */
  checkForActionCutscene() {
    const hero = this.#gameObjects['hero'];
    const nextPos = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.#gameObjects).find((obj) => (`${obj.x},${obj.y}` === `${nextPos.x},${nextPos.y}`));

    if (!this.#isCutscenePlaying && match && match.conversations.length) {
      this.startCutscene(match.conversations[0].events);
    }
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * checks to see if theres a queueable action in the next current space
   */
  checkForFootstepCutscene() {
    const hero = this.#gameObjects['hero'];
    const match = this.#actionSpaces[`${hero.x},${hero.y}`];

    if (!this.#isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }
  /* =================================  ================================= */

   /* =================================  ================================= */
  /**
   * add an wall to the #walls object with the x & y position as the key
   * @param {string} key
   * @param {GameObject} object
   */
  addGameObject(key, object) {
    this.#walls[key] = object;
  }
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /**
   * removes a wall from the gameobject array using given key
   * @param {string} key
   */
  removeGameObject(key) {
    delete this.#gameObjects[key];
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * add an wall to the #walls object with the x & y position as the key
   * @param {number} x 
   * @param {number} y 
   */
  addWall(x, y) {
    this.#walls[`${x},${y}`] = true;
  }
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /**
   * removes a wall from the wall object using the x & y as the key
   * @param {number} x 
   * @param {number} y 
   */
  removeWall(x, y) {
    delete this.#walls[`${x},${y}`];
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * removes existing wall using initial x & y as key, and adds new one at updated position
   * @param {number} wasX 
   * @param {number} wasY 
   * @param {direction} direction
   */
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x: newX, y: newY } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(newX, newY);
  }
  /* =================================  ================================= */
}

window.OverWorldMaps = {
  /** @type {overWorldMapConfig} */ [mapkeys.DemoRoom]: {
    map: {
      lower: "file://../../../static/maps/DemoLower.png",
      upper: "file://../../../static/maps/DemoUpper.png",
    },
    gameObjects: {
      hero: new Person({
        pos: { x: utils.withGrid(5), y: utils.withGrid(6) },
        controlled: true,
      }),
      npc1: new Person({
        pos: { x: utils.withGrid(7), y: utils.withGrid(9) },
        src: "file://../../../static/characters/people/npc1.png",
        behaviorLoop: [
          { type: eventTypes.stand, direction: directions.left, time: 800 },
          { type: eventTypes.stand, direction: directions.up, time: 800 },
          { type: eventTypes.stand, direction: directions.left, time: 1200 },
          { type: eventTypes.stand, direction: directions.down, time: 300 },
          { type: eventTypes.stand, direction: directions.left, time: 800 },
          { type: eventTypes.stand, direction: directions.up, time: 800 },
          { type: eventTypes.stand, direction: directions.right, time: 1200 },
          { type: eventTypes.stand, direction: directions.up, time: 300 },
        ],
        conversations: [
          {
            events: [
              { type: eventTypes.textMessage, text: "im ready to get started", faceHero: characterKeys.npc1 },
              { type: eventTypes.textMessage, text: "lets get busy" },
              { who: characterKeys.npc1, type: eventTypes.walk, direction: directions.up },
              { who: characterKeys.hero, type: eventTypes.walk, direction: directions.up },
              { who: characterKeys.hero, type: eventTypes.walk, direction: directions.up },
              { who: characterKeys.hero, type: eventTypes.stand, direction: directions.right, time: 100 },
            ]
          }
        ]
      }),
      npc2: new Person({
        pos: { x: utils.withGrid(3), y: utils.withGrid(7) },
        src: "file://../../../static/characters/people/npc2.png",
        behaviorLoop: [
          { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.down, time: 2500 },
          { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.left, time: 1500 },
          { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.down, time: 3000 },
          { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.right, time: 1000 },
        ],
      }),
    },
    walls: {
      [utils.adjustForGrid(1, 3)]: true, // wall
      [utils.adjustForGrid(2, 3)]: true, // wall
      [utils.adjustForGrid(3, 3)]: true, // wall
      [utils.adjustForGrid(4, 3)]: true, // wall
      [utils.adjustForGrid(5, 3)]: true, // wall
      [utils.adjustForGrid(6, 4)]: true, // wall
      [utils.adjustForGrid(7, 2)]: true, // wall
      [utils.adjustForGrid(8, 4)]: true, // wall
      [utils.adjustForGrid(9, 3)]: true, // wall
      [utils.adjustForGrid(10, 3)]: true, // wall
      [utils.adjustForGrid(0, 4)]: true, // left edge
      [utils.adjustForGrid(0, 5)]: true, // left edge
      [utils.adjustForGrid(0, 6)]: true, // left edge
      [utils.adjustForGrid(0, 7)]: true, // left edge
      [utils.adjustForGrid(0, 8)]: true, // left edge
      [utils.adjustForGrid(0, 9)]: true, // left edge
      [utils.adjustForGrid(1, 10)]: true, // bottom edge pt1
      [utils.adjustForGrid(2, 10)]: true, // bottom edge pt1
      [utils.adjustForGrid(3, 10)]: true, // bottom edge pt1
      [utils.adjustForGrid(4, 10)]: true, // bottom edge pt1
      [utils.adjustForGrid(6, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(7, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(8, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(9, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(10, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(11, 4)]: true, // right edge
      [utils.adjustForGrid(11, 5)]: true, // right edge
      [utils.adjustForGrid(11, 6)]: true, // right edge
      [utils.adjustForGrid(11, 7)]: true, // right edge
      [utils.adjustForGrid(11, 8)]: true, // right edge
      [utils.adjustForGrid(11, 9)]: true, // right edge
      [utils.adjustForGrid(7, 6)]: true, // table top
      [utils.adjustForGrid(8, 6)]: true, // table top
      [utils.adjustForGrid(7, 7)]: true, // table top
      [utils.adjustForGrid(8, 7)]: true, // table top
    },
    actionSpaces: {
      [utils.adjustForGrid(7, 4)]: [
        {
          events: [
            { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.left },
            { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.up, time: 200 },
            { type: eventTypes.textMessage, text: "you're not supposed to be in there" },
            { who: characterKeys.npc2, type: eventTypes.walk, direction: directions.right },
            { who: characterKeys.npc2, type: eventTypes.stand, direction: directions.down, time: 200 },
            { who: characterKeys.hero, type: eventTypes.walk, direction: directions.down },
            { who: characterKeys.hero, type: eventTypes.walk, direction: directions.left },
            { who: characterKeys.hero, type: eventTypes.stand, direction: directions.left, time: 100 },
          ]
        }
      ],
      [utils.adjustForGrid(5, 10)]: [
        {
          events: [
            { type: eventTypes.changeMap, map: mapkeys.Kitchen },
          ]
        }
      ]
    }
  },
  /** @type {overWorldMapConfig} */ [mapkeys.Kitchen]: {
    map: {
      lower: "file://../../../static/maps/KitchenLower.png",
      upper: "file://../../../static/maps/KitchenUpper.png",
    },
    gameObjects: {
      hero: new Person({
        pos: { x: utils.withGrid(5), y: utils.withGrid(5) },
        controlled: true,
      }),
      npc1: new Person({
        pos: { x: utils.withGrid(10), y: utils.withGrid(8) },
        src: "file://../../../static/characters/people/npc1.png",
        conversations: [
          {
            events: [
              { type: eventTypes.textMessage, text: "you made it" },
            ]
          }
        ]
      }),
      npc2: new Person({
        pos: { x: utils.withGrid(4), y: utils.withGrid(8) },
        src: "file://../../../static/characters/people/npc2.png",
      }),
    },
    walls: {
      [utils.adjustForGrid(1, 3)]: true, // wall
      [utils.adjustForGrid(2, 3)]: true, // wall
      [utils.adjustForGrid(3, 3)]: true, // wall
      [utils.adjustForGrid(4, 3)]: true, // wall
      [utils.adjustForGrid(5, 3)]: true, // wall
      [utils.adjustForGrid(6, 3)]: true, // wall
      [utils.adjustForGrid(7, 3)]: true, // wall
      [utils.adjustForGrid(8, 3)]: true, // wall
      [utils.adjustForGrid(9, 3)]: true, // wall
      [utils.adjustForGrid(10, 3)]: true, // wall
      [utils.adjustForGrid(11, 4)]: true, // wall
      [utils.adjustForGrid(12, 4)]: true, // wall
      [utils.adjustForGrid(0, 4)]: true, // left edge pt1
      [utils.adjustForGrid(0, 8)]: true, // left edge pt2
      [utils.adjustForGrid(3, 10)]: true, // bottom edge pt1
      [utils.adjustForGrid(4, 10)]: true, // bottom edge pt1
      [utils.adjustForGrid(6, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(7, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(8, 10)]: true, // bottom edge pt2
      [utils.adjustForGrid(11, 10)]: true, // bottom edge pt3
      [utils.adjustForGrid(12, 10)]: true, // bottom edge pt3
      [utils.adjustForGrid(13, 5)]: true, // right edge
      [utils.adjustForGrid(13, 6)]: true, // right edge
      [utils.adjustForGrid(13, 7)]: true, // right edge
      [utils.adjustForGrid(13, 8)]: true, // right edge
      [utils.adjustForGrid(13, 9)]: true, // right edge
      [utils.adjustForGrid(1, 5)]: true, // oven
      [utils.adjustForGrid(1, 6)]: true, // oven
      [utils.adjustForGrid(1, 7)]: true, // oven
      [utils.adjustForGrid(6, 7)]: true, // countertop1
      [utils.adjustForGrid(7, 7)]: true, // countertop1
      [utils.adjustForGrid(9, 7)]: true, // countertop2
      [utils.adjustForGrid(10, 7)]: true, // countertop2
      [utils.adjustForGrid(1, 9)]: true, // box
      [utils.adjustForGrid(2, 9)]: true, // box
      [utils.adjustForGrid(9, 9)]: true, // coutertop3
      [utils.adjustForGrid(10, 9)]: true, // coutertop3
    },
    actionSpaces: {
      [utils.adjustForGrid(5, 10)]: [
        {
          events: [
            { type: eventTypes.changeMap, map: mapkeys.DemoRoom },
          ]
        }
      ]
    }
  }
}