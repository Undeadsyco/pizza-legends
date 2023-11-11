class Sprite {
  /* =================================  ================================= */
  /** @private @type {Image} */ #body;
  /* =================================  ================================= */
  
  /* =================================  ================================= */
  /** @private @type {boolean} */ #isBodyLoaded;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {Image} */ #shadow;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {boolean} */ #isShadowLoaded;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {boolean} */ #useShadow = true;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {GameObject} */ #GameObject;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {animations} */ #animations;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {number} */ #currentAnimationFrame = 0;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {string} */ #currentAnimation;
  /** @public @returns {number} */
  get currentAnimation() { return this.#currentAnimation; }
  /** @public @param {string} value */
  set currentAnimation(value) { this.#currentAnimation = value; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  get frame() { return this.#animations[this.#currentAnimation][this.#currentAnimationFrame]; }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {number} */ #animationFrameLimit = 8;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {number} */ #animationFrameProgress = this.#animationFrameLimit;
  /* =================================  ================================= */

  /** @param {spriteConfig} config */
  constructor(config) {
    this.#GameObject = config.GameObject;


    if (config.animationFrameLimit) {
      this.#animationFrameLimit = config.animationFrameLimit;
      this.#animationFrameProgress = this.#animationFrameLimit;
    }

    this.#initImage(config.src);
    this.#initState(config.animations, config.currentAnimation);
  }

  /* =================================  ================================= */
  /** @param {string} src  */
  #initImage(src) {
    this.#body = new Image();
    this.#body.src = src;
    this.#body.onload = () => {
      this.#isBodyLoaded = true;
    }

    this.#shadow = new Image();
    if (this.#useShadow) {
      this.#shadow.src = "file://../../../static/characters/shadow.png";
    }
    this.#shadow.onload = () => {
      this.#isShadowLoaded = true;
    }
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * sets animation as well as current animations
   * @param {animations} anims 
   * @param {string} currentAnim 
   */
  #initState(anims, currentAnim) {
    this.#animations = anims || {
      "idle-down": [[0, 0]],
      "walk-down": [[1, 0], [0, 0], [3, 0], [0, 0]],
      "idle-right": [[0, 1]],
      "walk-right": [[1, 1], [0, 1], [3, 1], [0, 1]],
      "idle-up": [[0, 2]],
      "walk-up": [[1, 2], [0, 2], [3, 2], [0, 2]],
      "idle-left": [[0, 3]],
      "walk-left": [[1, 3], [0, 3], [3, 3], [0, 3]],
    }

    this.#currentAnimation = currentAnim || "idle-down";
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * counts down the progress of the current animation frame then switches to the next frame before resetting progress and resetting frame when it resches end of animation
   * @returns {void}
   */
  #updateAnimationProgress() {
    if (this.#animationFrameProgress > 0) {
      this.#animationFrameProgress -= 1;
      return;
    }

    this.#animationFrameProgress = this.#animationFrameLimit;
    this.#currentAnimationFrame += 1;

    if (!this.frame) this.#currentAnimationFrame = 0;
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /**
   * sets the animaton key to the given key and resets current frame and animation progress
   * @param {string} key 
   */
  setAnimation(key) {
    if (this.#currentAnimation !== key) {
      this.#currentAnimation = key;
      this.#currentAnimationFrame = 0;
      this.#animationFrameProgress = this.#animationFrameLimit;
    }
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** 
   * @param {CanvasRenderingContext2D } ctx 
   * @param {Person} cameraPerson
   */
  draw(ctx, cameraPerson) {
    const size = 32,
      x = this.#GameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x,
      y = this.#GameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;
    const [frameX, frameY] = this.frame;
    this.#isShadowLoaded && ctx.drawImage(
      this.#shadow, x, y
    );
    this.#isBodyLoaded && ctx.drawImage(
      this.#body,
      frameX * size, frameY * size, size, size, // cut pos & size: ;
      x, y, size, size // object pos & size: ;
    );

    this.#updateAnimationProgress();
  }
  /* =================================  ================================= */
}