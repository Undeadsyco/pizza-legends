/** @typedef {HTMLElement} element */
/** @typedef {HTMLCanvasElement} canvas */
/** @typedef {CanvasRenderingContext2D} canvasContext */

/** @typedef {("PersonWalkComplete"|"PersonStandComplete")} customEventKey */
const customEventKeys = {
  /** @type {customEventKey} */ "PersonWalkComplete": "PersonWalkComplete",
  /** @type {customEventKey} */ "PersonStandComplete": "PersonStandComplete",
}

/** 
 * @typedef {("hero" | "erio" | "npc1" | "npc2" | "npc3" | "npc4" | "npc5")} characterKey 
 */
const characterKeys = {
  /** @type {characterKey} */ "hero": "hero",
  /** @type {characterKey} */ "erio": "erio",
  /** @type {characterKey} */ "npc1": "npc1",
  /** @type {characterKey} */ "npc2": "npc2",
  /** @type {characterKey} */ "npc3": "npc3",
  /** @type {characterKey} */ "npc4": "npc4",
  /** @type {characterKey} */ "npc5": "npc5",
}

/**
 * @typedef {("up"|"down"|"left"|"right")} direction
 */
const directions = {
  /** @type {direction} */ "down": "down",
  /** @type {direction} */ "up": "up",
  /** @type {direction} */ "right": "right",
  /** @type {direction} */ "left": "left",
}

/** @typedef {("stand" | "walk" | "textMessage" | "changeMap")} eventType */
const eventTypes = {
  /** @type {eventType} */ "stand": "stand",
  /** @type {eventType} */ "walk": "walk",
  /** @type {eventType} */ "textMessage": "textMessage",
  /** @type {eventType} */ "changeMap": "changeMap",
}

/** @typedef {("DemoRoom" | "Kitchen")} mapKey */
const mapkeys = {
  /** @type {mapKey} */ "DemoRoom": "DemoRoom",
  /** @type {mapKey} */ "Kitchen": "Kitchen",
}

/**
 * @typedef {Object} behaviorEvent
 * @property {eventType} type
 * @property {characterKey} [who]
 * @property {direction} [direction]
 * @property {boolean} [retry]
 * @property {number} [time]
 * @property {string} [text]
 * @property {characterKey} [faceHero]
 * @property {mapKey} [map]
 */

/** @typedef {[number, number]} frame */
/** @typedef {[frame]} animsArray */
/**
 * @typedef {Object} animations 
 * @property {animsArray} idle-down
 * @property {animsArray} [walk-down]
 * @property {animsArray} [idle-right]
 * @property {animsArray} [walk-right]
 * @property {animsArray} [idle-up]
 * @property {animsArray} [walk-up]
 * @property {animsArray} [idle-left]
 * @property {animsArray} [walk-left]
 */

/** 
 * @typedef {Object} characters
 * @property {Person} hero
 * @property {Person} [erio]
 * @property {Person} [npc1]
 * @property {Person} [npc2]
 * @property {Person} [npc3]
 * @property {Person} [npc4]
 * @property {Person} [npc5]
 */

/** @typedef {(characters)} gameObjects */

/**
 * @typedef {Object} mapKeys
 * @property {string} lower
 * @property {string} upper
 */

/**
 * @typedef {Object} walls
 * @property {boolean} [""?]
 */

/**
 * @typedef pos
 * @type {Object}
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} overWorldConfig
 * @property {HTMLElement} element
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 */

/**
 * @typedef {Object} overWorldMapConfig
 * @property {mapKeys} map
 * @property {gameObjects} gameObjects
 * @property {walls} walls
 */

/**
 * @typedef {Object} overWorldEventConfig
 * @property {OverWorldMap} map
 * @property {behaviorEvent} eventConfig
 */

/**
 * @typedef {Object} gameObjectConfig
 * @property {string} [src]
 * @property {pos} pos
 * @property {[behaviorEvent]} behaviorLoop
 */

/**
 * @typedef {Object} spriteConfig
 * @property {string} src
 * @property {animsArray} animations
 * @property {string} currentAnimation
 * @property {GameObjct} GameObject
 * @property {number} animationFrameLimit
 */

/**
 * @typedef {Object} personConfig
 * @property {boolean} controlled
 */

/**
 * @typedef {Object} personState
 * @property {direction} direction currect direction of pressed keys
 * @property {OverWorldMap} map refrence of current map
 */