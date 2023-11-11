class GameObject {
  /* =================================  ================================= */
  /** @private @type {Sprite} Character/Object */
  #Sprite;
  /** @public @returns {Sprite} */
  get Sprite() { return this.#Sprite; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {characterKey} */
  #id = null;
  /** @public @returns {characterKey} getter for id */
  get id() { return this.#id }
  /** @public @param {characterKey} key setter for id */
  set id(key) { this.#id = key }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {boolean} if the object is mounted in the world as a phisical object */
  #isMounted = false;
  /** @public @returns {boolean} getter for isMounted */
  get mounted() { return this.#isMounted }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {number} X Position */ #x = 0;
  /** @public @returns {number} getter for X position */
  get x() { return this.#x; }
  /** @public @param {number} x setter for X position */
  set x(x) { this.#x = x; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {number} Y Position */ #y = 0;
  /** @public @returns {number} getter for Y position */
  get y() { return this.#y; }
  /** @public @param {number} y setter for Y position */
  set y(y) { this.#y = y; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @public @returns {pos} getter for position as vector */
  getPos() { return ({ x: this.#x, y: this.#y }); }
  /** @public @param {pos} pos getter for position as vector */
  setPos({ x, y }) { this.#x = x; this.#y = y; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {direction} */ #direction = directions.down;
  /** @public @returns {direction} */
  get direction() { return this.#direction };
  /** @public @param {direction} direction */
  set direction(direction) { this.#direction = direction; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {[behaviorEvent]} */ #behaviorLoop;
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @private @type {number} */ #behaviorLoopIndex = 0;
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @private @type {[{ events: [behaviorEvent] }]} */ #conversations
  /** @public @returns {[{ events: [behaviorEvent] }]} */
  get conversations() { return this.#conversations; }
  /* =================================  ================================= */

  /** @param {gameObjectConfig} config */
  constructor(config) {
    this.#Sprite = new Sprite({
      GameObject: this,
      src: config.src || "file://../../../static/characters/people/Hero.png",
    });

    if (config.pos) {
      this.#x = config.pos.x;
      this.#y = config.pos.y;
    }

    this.#conversations = config.conversations || []
    this.#behaviorLoop = config.behaviorLoop || [];
  }

  /* =================================  ================================= */
  /**
   * mounts the game object to the world and adds it to the maps walls object
   * @param {OverWorldMap} map 
   */
  mount(map) {
    this.#isMounted = true;
    map.addWall(this.x, this.y);

    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  update() {
    // to be overriden
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * starts looping through the behavior loop array and dispatched new event accordng to behavior
   * @async
   * @param {OverWorldMap} map 
   * @returns {void}
   */
  async doBehaviorEvent(map) {
    if (map.isCutscenePlaying || this.#behaviorLoop.length === 0 || this.isStanding) return;

    let eventConfig = this.#behaviorLoop[this.#behaviorLoopIndex];
    eventConfig.who = this.#id;


    const eventhandler = new OverWorldEvent({ map, eventConfig });
    await eventhandler.init();

    this.#behaviorLoopIndex += 1;
    if (this.#behaviorLoopIndex === this.#behaviorLoop.length) this.#behaviorLoopIndex = 0;

    this.doBehaviorEvent(map);
  }
  /* =================================  ================================= */
}