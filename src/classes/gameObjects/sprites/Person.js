class Person extends GameObject {
  /* =================================  ================================= */
  /** @private @type {boolean} is player controlled flag */ #isPlayerControlled = false;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {Map<direction,[string,number]>} map refrence */
  #directionUpdateMap = new Map([
    [directions.up, ['y', -1]], 
    [directions.down, ['y', 1]], 
    [directions.left, ['x', -1]], 
    [directions.right, ['x', 1]],
  ]);
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type */ #movementProgressRemaining = 0;
  /** @public @return {number} */
  get movementProgressRemaining() { return this.#movementProgressRemaining; }
  /** @public @private @param {number} progress  */
  set movementProgressRemaining(progress) { this.#movementProgressRemaining = progress; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {boolean} if the character is currently running a stand behavior event */ 
  #isStanding = false;
  /** @returns {boolean} isStanding getter */
  get isStanding() { return this.#isStanding; }
  /** @param {boolean} value isSanding setter */
  set isStanding(value) { this.#isStanding = value; }
  /* =================================  ================================= */

  /** @param {(gameObjectConfig & personConfig)} config */
  constructor(config) {
    super(config);
    if (config.controlled) this.#isPlayerControlled = config.controlled;
  }

  /* =================================  ================================= */
  /**
   * update person state
   * @param {personState} state 
   */
  update(state) {
    const { direction, map } = state;

    if (this.#movementProgressRemaining > 0) this.upadtePostition();
    else {
      if (!map.isCutscenePlaying && this.#isPlayerControlled && direction) {
        this.startBehavior(state, {
          type: 'walk',
          direction: direction,
        })
      }
      this.updateSprite();
    }
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * execute behavior depending on behavior type
   * @param {personState} state 
   * @param {behaviorEvent} behavior
   * @returns {void}
   */
  startBehavior(state, behavior) {
    this.direction = behavior.direction;
    if (behavior.type === 'walk') {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10);
        return;
      }
      state.map.moveWall(this.x, this.y, this.direction);
      this.#movementProgressRemaining = 16;
      this.updateSprite(state);
    }

    if (behavior.type === 'stand') {
      this.#isStanding = true;
      setTimeout(() => {
        utils.emitEvent(customEventKeys.PersonWalkComplete, { whoId: this.id });
      }, behavior.time);
      this.#isStanding = false;
    }
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * updates position depending on current direction
   */
  upadtePostition() {
    const directionUpdate = this.#directionUpdateMap.get(this.direction);
    if (directionUpdate) {
      const [property, value] = directionUpdate;
      this[property] += value;
      this.#movementProgressRemaining -= 1;

      if (this.#movementProgressRemaining === 0) {
        utils.emitEvent(customEventKeys.PersonWalkComplete, { whoId: this.id });
      }
    }
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * sets animation depending on current action
   * @returns 
   */
  updateSprite() {
    if (this.#movementProgressRemaining > 0) {
      this.Sprite.setAnimation(`walk-${this.direction}`);
      return;
    }
    this.Sprite.setAnimation(`idle-${this.direction}`);
  }
  /* =================================  ================================= */
}