const Speller = {
  ZERO: {
    arm: "ԶՐՕ", latin: "ZRO"
  },
  DIGITS: {
    1: { arm: "ՄԵԿ", latin: "MEK" },
    2: { arm: "ԵՐԿՈՒ", latin: "ERKU" },
    3: { arm: "ԵՐԵՔ", latin: "EREK'" },
    4: { arm: "ՉՈՐՍ", latin: "CHORS" },
    5: { arm: "ՀԻՆԳ", latin: "HING" },
    6: { arm: "ՎԵՑ", latin: "VETS'" },
    7: { arm: "ՅՈԹ", latin: "YOT'" },
    8: { arm: "ՈՒԹ", latin: "UT'" },
    9: { arm: "ԻՆԸ", latin: "INY" },
  },
  TENS: {
    1: { arm: "ՏԱՍԸ", latin: "TASY" },
    2: { arm: "ՔՍԱՆ", latin: "K'SAN" },
    3: { arm: "ԵՐԵՍՈՒՆ", latin: "ERESUN" },
    4: { arm: "ՔԱՌԱՍՈՒՆ", latin: "K'ARRASUN" },
    5: { arm: "ՀԻՍՈՒՆ", latin: "HISUN" },
    6: { arm: "ՎԱԹՍՈՒՆ", latin: "VATS'SUN" },
    7: { arm: "ՅՈԹԱՆԱՍՈՒՆ", latin: "YOT'ANASUN" },
    8: { arm: "ՈՒԹՍՈՒՆ", latin: "UT'SUN" },
    9: { arm: "ԻՆՆՍՈՒՆ", latin: "INNSUN" },
  },
  HUNDRED: {
    arm: "ՀԱՐՅՈՒՐ", latin: "HARYUR",
  },
  THOUSANDS: {
    3: { arm: "ՀԱԶԱՐ", latin: "HAZAR" },
    6: { arm: "ՄԻԼԻՈՆ", latin: "MILION" },
    9: { arm: "ՄԻԼԻԱՐԴ", latin: "MILIARD" },
    12: { arm: "ՏՐԻԼԻՈՆ", latin: "TRILION" },
    15: { arm: "ԿՎԱԴՐԻԼԻՈՆ", latin: "K'VADRILION" },
    18: { arm: "ՔՎԻՆՏԻԼԻՈՆ", latin: "K'VINTILION" },
    21: { arm: "ՍԵՔՍՏԻԼԻՈՆ", latin: "SEK'STILION" },
    24: { arm: "ՍԵՊՏԻԼԻՈՆ", latin: "SEPTILION" },
    27: { arm: "ՕԿՏԻԼԻՈՆ", latin: "OKTILION" },
    30: { arm: "ՆՈՆԻԼԻՈՆ", latin: "NONILION" },
  },

  spelling: 'arm',

  zero() { return this.ZERO[this.spelling] },
  digit(n) { return this.DIGITS[n][this.spelling] },
  ten(n) { return this.TENS[n][this.spelling] },
  hundred() { return this.HUNDRED[this.spelling] },
  thousand(n) { return this.THOUSANDS[n][this.spelling] },

  spell(number, spelling = 'arm') {
    this.spelling = spelling

    number = number.toString().replace(/\D/gm, "")

    if (isNaN(number) || number.toString().length > 31) {
      return 'Please make sure to enter a valid positive integer.'
    }

    if (number == 0) {
      return this.zero()
    }

    // This is how we do this.
    // We divide the number into groups, a group consists of 3 digits
    // Spell those groups and add them together
    // e.g. "43 420.600" is "43 million, 420 thousand, 600"

    const digitsArray = number.toString().split('')
    const numberOfGroups = Math.ceil(digitsArray.length / 3)

    // divide into groups, if in the last (first from left)
    // there are less than 3 digits we just add zeros instead
    const groups = [...Array(numberOfGroups).keys()]
        .map(r => digitsArray.splice(-3).join('').padStart(3, '0').split(''))
        .reverse()

    // do the spelling for each group and put them together
    return groups.map((g, key) => {
      const thousandsIndex = (groups.length - 1 - key) * 3
      const thousands = thousandsIndex === 0 ? '' : this.thousand(thousandsIndex)
      const group = this.group(g)

      if (!group) return ''

      return this.shouldSkipOne(group, thousands)
              ? `${thousands}`.trim()
              : `${group} ${thousands}`.trim()
    })
    .filter(i => i)
    .join(' ')
  },

  group (group) {
    const hundreds = parseInt(group[0])
    const hundredsPart = hundreds !== 0
      ? `${hundreds !== 1 ? `${this.digit(hundreds)} ` : ''}${this.hundred()}`
      : ''

    const decimals = parseInt(group[1])
    const decimalsPart = decimals !== 0 ? ` ${this.ten(decimals)}` : ''

    const digit = parseInt(group[2])
    const digitsPart = digit !== 0 ? this.digit(digit) : ''

    const result = `${hundredsPart}${decimalsPart}${digitsPart}`

    return digitsPart ? this.fixTen(result) : result
  },

  /**
   * For 100 and 1000 only, the "1" is skipped
   * 1142 is not "ONE thousand ONE hundred 42" but "thousand hundred 42".
  */
  shouldSkipOne(group, thousands) {
    return ['ՄԵԿ', 'MEK'].includes(group)
      && ['ՀԱՐՅՈՒՐ', 'HARYUR', 'ՀԱԶԱՐ', 'HAZAR'].includes(thousands)
  },

  /**
   * For numbers 11-19, the 10 "prefix" is not "ՏԱՍԸ" but "ՏԱՍՆ",
   * so after we concatenate them, we simply replace "ՏԱՍԸ" with "ՏԱՍՆ".
   */
  fixTen(str) {
    const tenFix = this.spelling === 'arm'
      ? ['ՏԱՍԸ', 'ՏԱՍՆ']
      : ['TASY', 'TASN']

    return str.replace(tenFix[0], tenFix[1])
  },
}
