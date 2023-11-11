class DirectionManager {
  /* =================================  ================================= */
  /** @private @type {Map<string, direction>} */ 
  #keyMap = new Map([
    ["ArrowUp", directions.up],
    ["ArrowDown", directions.down],
    ["ArrowLeft", directions.left],
    ["ArrowRight", directions.right],
    ["KeyW", directions.up],
    ["KeyS", directions.down],
    ["KeyA", directions.left],
    ["KeyD", directions.right]
  ]);
  /* =================================  ================================= */

  /** @public @type {[direction]} */ #heldDirections = [];
  get direction() { return this.#heldDirections[0]; }

  constructor() {}

  /* =================================  ================================= */
  /**
   * initulize direction manager and adding events to the keydown and keyup evens to add and remove specific keys to an array based on the keymap
   */
  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.#keyMap.get(e.code);
      if (dir && this.#heldDirections.indexOf(dir) === -1) this.#heldDirections.unshift(dir);
    });
    document.addEventListener("keyup", (e) => {
      const dir = this.#keyMap.get(e.code);
      const index = this.#heldDirections.indexOf(dir);
      if (index > -1) this.#heldDirections.splice(index, 1);
    });
  }
  /* =================================  ================================= */
}