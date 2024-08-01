export async function fetchSolcRelease(release:string):Promise<void> {
    const cachePath = `${Deno.env.get('HOME')}/.kaaos/solc/${release}`
    const fileInfo = await Deno.stat(cachePath).catch(() => undefined)
    if (!fileInfo) {
        const response = await fetch(`https://binaries.soliditylang.org/linux-amd64/${release}`)
        const blob = await response.blob()
        await Deno.writeFile(cachePath, blob.stream(), { mode: 0o755 })
    }
}