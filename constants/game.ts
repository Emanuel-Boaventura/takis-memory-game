const chilli = require('@/assets/images/chilli.png')
const explosion = require('@/assets/images/explosion.png')
const fuego = require('@/assets/images/fuego.png')
const greenPepper = require('@/assets/images/green-pepper.png')
const redPepper = require('@/assets/images/red-pepper.png')
const takisLogo = require('@/assets/images/logo-takis.png')
export interface Card {
  id: number
  type: string
  image: any
  isFlipped: boolean
  matched: boolean
}

export const TIME_LIMIT = 30 // seconds
export const BLOCK_MOVE_TIME = 1000 * 0.5 // seconds
export const INITIAL_SHOW_CARDS_TIME = 1000 * 2 // seconds
export const MIN_CARDS = 4 // minimum number of cards

export const GAME_CARDS: Card[] = [
  { id: 1, type: 'chilli', image: chilli, isFlipped: false, matched: false },
  { id: 2, type: 'chilli', image: chilli, isFlipped: false, matched: false },
  { id: 3, type: 'explosion', image: explosion, isFlipped: false, matched: false },
  { id: 4, type: 'explosion', image: explosion, isFlipped: false, matched: false },
  { id: 5, type: 'fuego', image: fuego, isFlipped: false, matched: false },
  { id: 6, type: 'fuego', image: fuego, isFlipped: false, matched: false },
  { id: 7, type: 'green-pepper', image: greenPepper, isFlipped: false, matched: false },
  { id: 8, type: 'green-pepper', image: greenPepper, isFlipped: false, matched: false },
  { id: 9, type: 'red-pepper', image: redPepper, isFlipped: false, matched: false },
  { id: 10, type: 'red-pepper', image: redPepper, isFlipped: false, matched: false },
  { id: 11, type: 'logo-takis', image: takisLogo, isFlipped: false, matched: false },
  { id: 12, type: 'logo-takis', image: takisLogo, isFlipped: false, matched: false },
]
