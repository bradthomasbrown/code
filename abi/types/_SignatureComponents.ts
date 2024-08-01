export type SignatureComponents = {
    parameters: string
    type: 'index'
}|{
    parameters: string
    types: string
    type: 'name'
}|{
    type: 'nullary'
}