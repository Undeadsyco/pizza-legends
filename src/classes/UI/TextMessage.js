/** @typedef {TextMessage} textMessage */
class TextMessage {
  /* =================================  ================================= */
  /** @private @type {string} */ #text;
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {Function} */ #onComplete
  /* =================================  ================================= */

  /* =================================  ================================= */
  /** @private @type {element} */ #element = null;
  /* =================================  ================================= */

  /**
   * @typedef {Object} textConfig
   * @property {string} text
   * @property {(() => void)} onComplete 
   * 
   * @param {textConfig} config 
   * @constructor
   */
  constructor({ text, onComplete }) {
    this.#text = text;
    this.#onComplete = onComplete;
  }

  /** 
   * creates a new div element and populates it with a paragraph 
   * filled with the given text and a button to move on either with
   * a click or an enter keypress
   */
  createElement() {
    this.#element = document.createElement("div");
    this.#element.classList.add("TextMessage");

    this.#element.innerHTML = (`
      <p class="TextMessage_p">${this.#text}</p>
      <button class="TextMessage_btn">Next</button>
    `);

    this.#element.querySelector("button").addEventListener('click', () => {
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  /** 
   * removes the element from the DOM and calls the complete action 
   */
  done() {
    this.#element.remove();
    this.#onComplete();
  }

  /**
   * creates a new element and adds it to the DOM
   * @param {element} container 
   */
  init(container) {
    this.createElement();
    container.appendChild(this.#element);
  }
}