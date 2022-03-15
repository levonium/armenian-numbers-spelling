const Speller = {
  ARMENIAN: {
    ZERO: 'ԶՐՕ',
    DIGITS: {
      1: 'ՄԵԿ',
      2: 'ԵՐԿՈՒ',
      3: 'ԵՐԵՔ',
      4: 'ՉՈՐՍ',
      5: 'ՀԻՆԳ',
      6: 'ՎԵՑ',
      7: 'ՅՈԹ',
      8: 'ՈՒԹ',
      9: 'ԻՆԸ',
    },
    TENS: {
      1: 'ՏԱՍԸ',
      2: 'ՔՍԱՆ',
      3: 'ԵՐԵՍՈՒՆ',
      4: 'ՔԱՌԱՍՈՒՆ',
      5: 'ՀԻՍՈՒՆ',
      6: 'ՎԱԹՍՈՒՆ',
      7: 'ՅՈԹԱՆԱՍՈՒՆ',
      8: 'ՈՒԹՍՈՒՆ',
      9: 'ԻՆԻՍՈՒՆ',
    },
    HUNDRED: 'ՀԱՐՅՈՒՐ',
    THOUSANDS: {
      3: 'ՀԱԶԱՐ',
      6: 'ՄԻԼԻՈՆ',
      9: 'ՄԻԼԻԱՐԴ',
      12: 'ՏՐԻԼԻՈՆ',
      15: 'ԿՎԱԴՐԻԼԻՈՆ',
      18: 'ՔՎԻՆՏԻԼԻՈՆ',
      21: 'ՍԵՔՍՏԻԼԻՈՆ',
      24: 'ՍԵՊՏԻԼԻՈՆ',
      27: 'ՕԿՏԻԼԻՈՆ',
      30: 'ՆՈՆԻԼԻՈՆ',
    },
  },
  LATIN: {
    ZERO: "ZRO",
    DIGITS: {
      1: "MEK",
      2: "ERKU",
      3: "EREK'",
      4: "CHORS",
      5: "HING",
      6: "VETS'",
      7: "YOT'",
      8: "UT'",
      9: "INY",
    },
    TENS: {
      1: "TASY",
      2: "K'SAN",
      3: "ERESUN",
      4: "K'ARRASUN",
      5: "HISUN",
      6: "VATS'SUN",
      7: "YOT'ANASUN",
      8: "UT'SUN",
      9: "INISUN",
    },
    HUNDRED: "HARYUR",
    THOUSANDS: {
      3: "HAZAR",
      6: "MILION",
      9: "MILIARD",
      12: "TRILION",
      15: "K'VADRILION",
      18: "K'VINTILION",
      21: "SEK'STILION",
      24: "SEPTILION",
      27: "OKTILION",
      30: "NONILION",
    },
  },

  zero(spelling = 'arm') { return spelling === 'arm' ? this.ARMENIAN.ZERO : this.LATIN.ZERO },
  digit(n, spelling = 'arm') { return spelling === 'arm' ? this.ARMENIAN.DIGITS[n] : this.LATIN.DIGITS[n]},
  ten(n, spelling = 'arm') { return spelling === 'arm' ? this.ARMENIAN.TENS[n] : this.LATIN.TENS[n] },
  hundred(spelling = 'arm') { return spelling === 'arm' ? this.ARMENIAN.HUNDRED : this.LATIN.HUNDRED },
  thousand(n, spelling = 'arm') { return spelling === 'arm' ? this.ARMENIAN.THOUSANDS[n] : this.LATIN.THOUSANDS[n] },

  spell(number, spelling = 'arm') {
    number = number.toString()
      .replaceAll('.', '')
      .replaceAll(',', '')
      .replaceAll('_', '')
      .replaceAll('-', '')

    if (isNaN(number) || number.toString().length > 31) {
      return 'Please make sure to enter a valid positive integer.'
    }

    if (number == 0) {
      return this.zero(spelling)
    }

    const digitsArray = number.toString().split('')
    const numberOfGroups = Math.ceil(digitsArray.length / 3)
    const groups = [...Array(numberOfGroups).keys()]
        .map(r => digitsArray.splice(-3).join('').padStart(3, '0').split(''))
        .reverse()

    return groups.map((g, key) => {
      const thousandsIndex = (groups.length - 1 - key) * 3
      const thousands = thousandsIndex === 0 ? '' : this.thousand(thousandsIndex, spelling)
      const group = this.group(g, spelling)

      if (!group) return ''

      return this.skipOne(group, thousands)
              ? `${thousands}`.trim()
              : `${group} ${thousands}`.trim()
    })
    .filter(i => i)
    .join(' ')
  },

  group (group, spelling) {
    const hundreds = parseInt(group[0])
    const hundredsPart = hundreds !== 0
      ? `${hundreds !== 1 ? `${this.digit(hundreds, spelling)} ` : ''}${this.hundred(spelling)}`
      : ''

    const decimals = parseInt(group[1])
    const decimalsPart = decimals !== 0 ? ` ${this.ten(decimals, spelling)}` : ''

    const digit = parseInt(group[2])
    const digitsPart = digit !== 0 ? this.digit(digit, spelling) : ''

    const tenFix = spelling === 'arm' ? ['ՏԱՍԸ', 'ՏԱՍՆ'] : ['TASY', 'TASN']

    return digitsPart
      ? `${hundredsPart}${decimalsPart}${digitsPart}`.replace(tenFix[0], tenFix[1])
      : `${hundredsPart}${decimalsPart}${digitsPart}`
  },

  skipOne(group, thousands) {
    return ['ՄԵԿ', 'MEK'].includes(group)
      && ['ՀԱՐՅՈՒՐ', 'HARYUR', 'ՀԱԶԱՐ', 'HAZAR'].includes(thousands)
  },
}
