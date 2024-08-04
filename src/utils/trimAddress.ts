export const trimAddress = (address: string, number: number) => {
  if (address) {
    if (address.length <= number * 2 + 2) {
      return address
    }
    const prefix = String(address).slice(0, number + 1)
    const suffix = String(address).slice(-number)

    return `${prefix}...${suffix}`
  }
}
