const getC2Addr = ({ salt, create2 }:{ salt:bigint, create2:{ address:string }}) => {
    const saltStr = salt.toString(16).padStart(64, '0')
    return `0x${keccak256(hexToBytes(`ff${create2.address.slice(2)}${saltStr}${keccak256(hexToBytes('6020343434335afa3451803b343482933c34f3'))}`)).slice(-40)}`
}