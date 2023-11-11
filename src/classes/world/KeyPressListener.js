class KeyPressListener {

  /**
   * 
   * @param {string} keyCode 
   * @param {Function} callback 
   */
  constructor(keyCode, callback) {
    let keySafe = true;

    this.keyDown = (event) => {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    }
    this.keyUp = (event) => {
      if (event.code === keyCode) {
        keySafe = true;
      }
    }

    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);
  }

  unbind() {
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('keyup', this.keyUp);
  }
}