class GameObject {
  // Character/Object
  /** @private @type {Sprite} */ #Sprite;
  /** @public @returns {Sprite} */
  get Sprite() { return this.#Sprite; }

  // POSITION
  /** @private @type {number} */ #x;
  /** @public @returns {number} */
  get x() { return this.#x; }
  /** @public @param {number} x */
  set x(x) { this.#x = x; }

  /** @private @type {number} */ #y;
  /** @public @returns {number} */
  get y() { return this.#y; }
  /** @public @param {number} y */
  set y(y) { this.#y = y; }

  // POSITION AS VECTOR
  /** @returns {pos} */
  getPos() { return ({ x: this.#x, y: this.#y }); }
  /** @param {pos} pos */
  setPos({ x, y }) { this.#x = x; this.#y = y; }

  // DIRECTION
  /** @private @type {direction} */ #direction;
  /** @public @returns {direction} */
  get direction() {return this.#direction};
  /** @public @param {direction} direction */
  set direction(direction) { this.#direction = direction; }

  /** @param {gameObjectConfig} config */
  constructor(config) {
    this.#x = config.pos.x ?? 0;
    this.#y = config.pos.y ?? 0;
    this.#direction = 'down';

    this.#Sprite = new Sprite({
      GameObject: this,
      src: config.src || "../../../static/characters/people/Hero.png",
    });
  }

  update() {}
}