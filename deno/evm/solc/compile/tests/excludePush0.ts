import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts';
import { compile } from '../lib/mod.ts'
import { wrapImportMeta as w } from '../../../../stdplus/path/lib/wrapImportMeta.ts'

const i = w(import.meta)
const k = i`smartks/`
const u = k.cd`uniswap/`

Deno.test('ERC20', async () => {
    const results = await compile({
        targets: { 'ERC20.sol': ['ERC20'] },
        basePath: k`dizzyhavoc/ERC20`,
        excludeOpcodes: ['PUSH0']
    })
    const push0Match = JSON.parse(results).contracts['ERC20.sol']['ERC20'].evm.bytecode.opcodes.match(/PUSH0/)
    assert(!push0Match)
})

Deno.test('Resolver', async () => {
    const results = await compile({
        targets: { 'Resolver.sol': ['Resolver'] },
        basePath: k`dizzyhavoc/Resolver`,
        excludeOpcodes: ['PUSH0']
    })
    const push0Match = JSON.parse(results).contracts['Resolver.sol']['Resolver'].evm.bytecode.opcodes.match(/PUSH0/)
    assert(!push0Match)
})

Deno.test('UniversalRouter', async () => {
    const results = await compile({
        targets: { 'UniversalRouter.sol': ['UniversalRouter'] },
        basePath: u`universal-router/contracts`,
        includePaths: [k`openzeppelin/4.7.0`, k`solmate`, u`permit2`, u`v2-core`, u`v3-core`],
        remappings: ['@openzeppelin=4.7.0', '@uniswap/='],
        optimizer: { enabled: true, runs: 1000000 },
        viaIR: true,
        excludeOpcodes: ['PUSH0']
    })
    const push0Match = JSON.parse(results).contracts['UniversalRouter.sol']['UniversalRouter'].evm.bytecode.opcodes.match(/PUSH0/)
    assert(!push0Match)
})