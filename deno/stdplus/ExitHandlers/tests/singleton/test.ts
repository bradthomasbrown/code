import { ExitHandlers } from '../../mod.ts'

const exitHandlers0 = new ExitHandlers()
const exitHandlers1 = new ExitHandlers()

console.log(exitHandlers0 === exitHandlers1)
console.log(exitHandlers0)

exitHandlers0.push(() => console.log('foo'))
exitHandlers1.push(() => console.log('bar'))