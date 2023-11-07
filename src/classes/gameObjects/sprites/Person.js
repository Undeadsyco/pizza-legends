class Person extends GameObject {
  // PRIVATE VARIABLES
  // player controlled flag
  /** @private @type {boolean} */ #isPlayerControlled = false;
  // map for updating position of character
  /** @private @type {Map<direction,[string,number]>} */ #directionUpdateMap = new Map([["up", ['y', -1]], ["down", ['y', 1]], ["left", ['x', -1]], ["right", ['x', 1]]]);

  // remaning movement progress to nect grid cell
  /** @private @type */ #movementProgressRemaining = 0;
  /** @public @return {number} */
  get movementProgressRemaining() { return this.#movementProgressRemaining; }
  /** @public @private @param {number} progress  */
  set movementProgressRemaining(progress) { this.#movementProgressRemaining = progress; }

  /** @param {(gameObjectConfig & personConfig)} config */
  constructor(config) {
    super(config);

    this.#isPlayerControlled = config.controlled

  }

  upadtePostition() {
    if (this.#movementProgressRemaining > 0) {
      const update = this.#directionUpdateMap.get(this.direction);
      if (update) {
        const [property, value] = update;
        this[property] += value;
        this.#movementProgressRemaining -= 1;
      }
    }
  }

  update(state) {
    this.upadtePostition();
    const {direction} = state;

    if (this.#isPlayerControlled && this.#movementProgressRemaining === 0 && direction) {
      this.direction = direction;
      this.#movementProgressRemaining = 16
    }

  }
}