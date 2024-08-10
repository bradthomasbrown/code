import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts';
import { compile } from "solc/compile/lib/mod.ts";

const home = Deno.env.get('HOME')!

Deno.test('ERC20', async () => {
    const results = await compile({
        targets: { 'ERC20.sol': ['ERC20'] },
        basePath: `${home}/dizzyhavoc/contracts/ERC20`,
        excludeOpcodes: ['PUSH0']
    })
    const push0Match = JSON.parse(results).contracts['ERC20.sol']['ERC20'].evm.bytecode.opcodes.match(/PUSH0/)
    assert(!push0Match)
})

Deno.test('Resolver', async () => {
    const results = await compile({
        targets: { 'Resolver.sol': ['Resolver'] },
        basePath: `${home}/dizzyhavoc/contracts/Resolver`,
        excludeOpcodes: ['PUSH0']
    })
    const push0Match = JSON.parse(results).contracts['Resolver.sol']['Resolver'].evm.bytecode.opcodes.match(/PUSH0/)
    assert(!push0Match)
})

Deno.test('UniversalRouter', async () => {
    const results = await compile({
        targets: { 'UniversalRouter.sol': ['UniversalRouter'] },
        basePath: `${home}/universal-router/contracts`,
        includePaths: [`${home}/openzeppelin-contracts/v4.7.0-trim`, `${home}/solmate`, `${home}/permit2`, `${home}/v2-core`, `${home}/v3-core`],
        remappings: ['@openzeppelin=v4.7.0-trim', '@uniswap/='],
        optimizer: { enabled: true, runs: 1000000 },
        viaIR: true,
        excludeOpcodes: ['PUSH0']
    })
    const push0Match = JSON.parse(results).contracts['UniversalRouter.sol']['UniversalRouter'].evm.bytecode.opcodes.match(/PUSH0/)
    assert(!push0Match)
})