import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const functions = {
  formatExpiryDateTime(date: Date | number) {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  },
  lengthenUnits(word: string) {
    switch (word) {
      case 'L':
      case 'l':
        return 'litre'
      case 'kg':
        return 'kilogram'
      case 'g':
        return 'gram'
      case 'ml':
        return 'millilitres'
      case 'mg':
        return 'milligrams'
      case 'ac':
        return 'acres'
      case 'ha':
        return 'hectare'
      case 'Mg':
      case 't':
        return 'tonne'
      default:
        return word
    }
  },
}
export default functions
