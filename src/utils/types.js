/** @typedef {("up"|"down"|"left"|"right")} direction */
/** @typedef {[[number]]} animsArray */

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

/** @typedef {characters} gameObjects */

/**
 * @typedef {Object} mapKeys
 * @property {string} lower
 * @property {string} upper
 */

/**
 * @typedef {Object} mapData
 * @param {mapKeys} map
 * @param {gameObjects} gameObjects
 */

/**
 * @typedef pos
 * @type {Object}
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} overworldConfig
 * @property {HTMLElement} element
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 */

/**
 * @typedef {Object} gameObjectConfig
 * @property {string} [src]
 * @property {pos} pos
 */

/**
 * @typedef {Object} spriteConfig
 * @property {string} src
 * @property {animsArray} animations
 * @property {string} currentAnimation
 * @property {GameObjct} GameObject
 */

/**
 * @typedef {Object} personConfig
 * @property {boolean} controlled
 */