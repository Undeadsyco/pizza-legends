const utils = {
  /** 
   * multiplies grid coordinate with grid size to get pixel equivelent
   * @param {number} n
   * @returns {number}
  */
  withGrid: (n) => (n * 16),
  /**
   * returs a sting of the x,y coordinates multiplied by 16
   * @param {number} x 
   * @param {number} y 
   * @returns {string} 
   */
  adjustForGrid: (x, y) => (`${x*16},${y*16}`),
  /**
   * returns updated coordinate position based on given direction
   * @param {number} initX 
   * @param {number} initY 
   * @param {direction} direction
   * @returns 
   */
  nextPosition: (initX, initY, direction) => {
    const size = 16;
    let x = initX, y = initY;
    switch(direction) {
      case directions.down:
        y+=size
        break;
      case directions.up:
        y-=size
        break;
      case directions.right:
        x+=size
        break;
      case directions.left:
        x-=size
        break;
    }
    return {x, y};
  },
  /**
   * dispatches given custom events
   * @param {string} name 
   * @param {{ whoId: characterKey }} [detail] 
   */
  emitEvent: (name, detail) => {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event)
  },
  /**
   * returns the opposite of the given direction
   * @param {direction} direction
   * @returns {direction}
   */
  oppositeDirection: (direction) => {
    switch (direction) {
      case directions.up:
        return directions.down;
      case directions.down:
        return directions.up;
      case directions.left:
        return directions.right;
      case directions.right:
        return directions.left;
    }
  } 
}