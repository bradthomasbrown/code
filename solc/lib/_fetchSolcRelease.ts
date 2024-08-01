export async function fetchSolcRelease(release:string):Promise<void> {
    const response = await fetch(`https://binaries.soliditylang.org/linux-amd64/${release}`)
    const blob = await response.blob()
    await Deno.writeFile(`${Deno.env.get('HOME')}/.w4/solc/${release}`, blob.stream(), { mode: 0o755 })
}