class OverWorldEvent {
  /** @private @type {OverWorldMap} */ #Map;

  /** @private @type {behaviorEvent} */ #event;

  /** @param {overWorldEventConfig} config */
  constructor({ map, eventConfig }) {
    this.#Map = map;
    this.#event = eventConfig;
  }

  /* =================================  ================================= */
  /**
   * creates and returns a new promise which calls the function based on the event type given by config
   * @returns {Promise<any>}
   */
  init() {
    return new Promise(resolve => {
      this[this.#event.type](resolve);
    })
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @param {{(value: any) => void}} resolve */
  stand(resolve) {
    const person = this.#Map.gameObjects[this.#event.who];
    person.startBehavior({ map: this.#Map }, {
      type: "stand",
      direction: this.#event.direction,
      time: this.#event.time
    });

    const completeHandler = (e) => {
      if (e.detail.whoId === this.#event.who) {
        document.removeEventListener(customEventKeys.PersonWalkComplete, completeHandler);
        resolve();
      }
    }

    document.addEventListener(customEventKeys.PersonWalkComplete, completeHandler)
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @param {{(value: any) => void}} resolve */
  walk(resolve) {
    const person = this.#Map.gameObjects[this.#event.who];
    person.startBehavior({ map: this.#Map }, {
      type: "walk",
      direction: this.#event.direction,
      retry: true,
    });

    const completeHandler = (e) => {
      if (e.detail.whoId === this.#event.who) {
        document.removeEventListener(customEventKeys.PersonWalkComplete, completeHandler);
        resolve();
      }
    }

    document.addEventListener(customEventKeys.PersonWalkComplete, completeHandler)
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @param {{(value: any) => void}} resolve */
  textMessage(resolve) {
    if (this.#event.faceHero) {
      const obj = this.#Map.gameObjects[this.#event.faceHero];
      obj.direction = utils.oppositeDirection(this.#Map.gameObjects['hero'].direction);
    }

    const message = new TextMessage({
      text: this.#event.text,
      onComplete: () => { resolve() },
    });
    message.init(document.querySelector(".game-container"));
  }
  /* =================================  ================================= */

  /* =================================  ================================= */
  changeMap(resolve) {
    this.#Map.overWorld.startMap(window.OverWorldMaps[this.#event.map]);
    resolve();
  }
  /* =================================  ================================= */
}