export const toFixedFloor = (number: number, decimals: number) => {
  const factor = Math.pow(10, decimals)
  return String(Math.floor(number * factor) / factor)
}
