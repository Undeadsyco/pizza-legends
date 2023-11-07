class Sprite {
  // PRIVATE PROPERTIES
  // sprite images
  /** @private @type {Image} */ #body;
  /** @private @type {Image} */ #shadow;

  //image loaded flags
  /** @private @type {boolean} */ #isBodyLoaded;
  /** @private @type {boolean} */ #isShadowLoaded;

  // use shadow flag
  /** @private @type {boolean} */ #useShadow = true;

  // parent gameObject
  /** @private @type {GameObject} */ #GameObject;

  // animations states
  /** @private @type {animsArray} */ #animations;
  /** @private @type {number} */ #currentAnimationFrame;

  /** @private @type {string} */ #currentAnimation;
  /** @public @returns {number} */
  get currentAnimation() { return this.#currentAnimation; }
  /** @public @param {string} value */
  set currentAnimation(value) { this.#currentAnimation = value; }

  /** @param {spriteConfig} config */
  constructor(config) {
    this.#GameObject = config.GameObject;

    this.#initImage(config.src);
    this.#initState(config.animations, config.currentAnimation);
  }

  /** @param {string} src  */
  #initImage(src) {
    this.#body = new Image();
    this.#body.src = src;
    this.#body.onload = () => {
      this.#isBodyLoaded = true;
    }

    this.#shadow = new Image();
    if (this.#useShadow) {
      this.#shadow.src = '../../../static/characters/shadow.png';
    }
    this.#shadow.onload = () => {
      this.#isShadowLoaded = true;
    }
  }

  /**
   * @param {animsArray} anims 
   * @param {string} currentAnim 
   */
  #initState(anims, currentAnim) {
    this.#animations = anims || {
      "idleDown": [[0, 0]],
    }

    this.#currentAnimation = currentAnim || "idleDown";
    this.#currentAnimationFrame = 0;
  }

  /** @param {CanvasRenderingContext2D } ctx  */
  draw(ctx) {
    const size = 32, x = this.#GameObject.x - 8, y = this.#GameObject.y - 18;
    this.#isShadowLoaded && ctx.drawImage(
      this.#shadow, x, y
    );
    this.#isBodyLoaded && ctx.drawImage(
      this.#body,
      0, 0, size, size, // cut pos & size
      x, y, size, size // object pos & size: ;
    );
  }
}