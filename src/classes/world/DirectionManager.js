class DirectionManager {
  /** @private @type {Map<string, direction>} */ 
  #keyMap = new Map([
    ["ArrowUp", "up"],
    ["ArrowDown", "down"],
    ["ArrowLeft", "left"],
    ["ArrowRight", "right"],
    ["KeyW", "up"],
    ["KeyS", "down"],
    ["KeyA", "left"],
    ["KeyD", "right"]
  ]);

  /** @public @type {[direction]} */ #heldDirections = [];
  get direction() { return this.#heldDirections[0]; }

  constructor(config) {

  }

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
}