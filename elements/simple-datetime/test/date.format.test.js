import { expect } from '@open-wc/testing'

// direct import of the lib so istanbul sees it even though the element
// only exercises a handful of format identifiers by default
import '../lib/date.format.js'

/**
 * behavioral tests for the PHP-style Date.prototype.format polyfill
 * local-component dates are used for local-time identifiers and
 * UTC-constructed dates for the UTC-based ones (B, U) so results
 * are deterministic regardless of the machine timezone
 */
describe('date.format', () => {
  describe('day identifiers', () => {
    it('d renders zero-padded day of month', () => {
      expect(new Date(2024, 0, 5).format('d')).to.equal('05')
      expect(new Date(2024, 0, 15).format('d')).to.equal('15')
    })
    it('D renders short day name', () => {
      expect(new Date(2024, 0, 1).format('D')).to.equal('Mon')
      expect(new Date(2024, 0, 3).format('D')).to.equal('Wed')
      expect(new Date(2024, 0, 7).format('D')).to.equal('Sun')
    })
    it('j renders day of month without padding', () => {
      expect(new Date(2024, 0, 5).format('j')).to.equal('5')
      expect(new Date(2024, 0, 15).format('j')).to.equal('15')
    })
    it('l renders long day name', () => {
      expect(new Date(2024, 0, 1).format('l')).to.equal('Monday')
      expect(new Date(2024, 0, 7).format('l')).to.equal('Sunday')
    })
    it('N renders ISO-8601 day of week (1=Mon, 7=Sun)', () => {
      expect(new Date(2024, 0, 1).format('N')).to.equal('1')
      expect(new Date(2024, 0, 7).format('N')).to.equal('7')
    })
    it('S renders English ordinal suffix', () => {
      expect(new Date(2024, 0, 1).format('S')).to.equal('st')
      expect(new Date(2024, 0, 2).format('S')).to.equal('nd')
      expect(new Date(2024, 0, 3).format('S')).to.equal('rd')
      expect(new Date(2024, 0, 4).format('S')).to.equal('th')
      // teens all use th
      expect(new Date(2024, 0, 11).format('S')).to.equal('th')
      expect(new Date(2024, 0, 12).format('S')).to.equal('th')
      expect(new Date(2024, 0, 13).format('S')).to.equal('th')
      // ...but 21st/22nd/23rd/31st are still suffixed
      expect(new Date(2024, 0, 21).format('S')).to.equal('st')
      expect(new Date(2024, 0, 22).format('S')).to.equal('nd')
      expect(new Date(2024, 0, 23).format('S')).to.equal('rd')
      expect(new Date(2024, 0, 31).format('S')).to.equal('st')
    })
    it('w renders day of week (0=Sun)', () => {
      expect(new Date(2024, 0, 1).format('w')).to.equal('1')
      expect(new Date(2024, 0, 7).format('w')).to.equal('0')
    })
    it('z renders day of year', () => {
      expect(new Date(2024, 0, 1).format('z')).to.equal('0')
      expect(new Date(2024, 0, 2).format('z')).to.equal('1')
      expect(new Date(2024, 2, 1).format('z')).to.equal('60')
    })
  })

  describe('week identifier', () => {
    it('W renders ISO-8601 week number', () => {
      // Monday, week 1
      expect(new Date(2024, 0, 1).format('W')).to.equal('01')
      // Thursday, week 1
      expect(new Date(2026, 0, 1).format('W')).to.equal('01')
      // Sunday belongs to previous year's week 52
      expect(new Date(2023, 0, 1).format('W')).to.equal('52')
      // Monday Dec 30 2024 is week 1 of 2025
      expect(new Date(2024, 11, 30).format('W')).to.equal('01')
      // mid-year double digit week, no padding
      expect(new Date(2024, 5, 15).format('W')).to.equal('24')
    })
  })

  describe('month identifiers', () => {
    it('F renders long month name', () => {
      expect(new Date(2024, 0, 1).format('F')).to.equal('January')
      expect(new Date(2024, 6, 1).format('F')).to.equal('July')
      expect(new Date(2024, 11, 25).format('F')).to.equal('December')
    })
    it('m renders zero-padded month', () => {
      expect(new Date(2024, 0, 1).format('m')).to.equal('01')
      expect(new Date(2024, 11, 25).format('m')).to.equal('12')
    })
    it('M renders short month name', () => {
      expect(new Date(2024, 0, 1).format('M')).to.equal('Jan')
      expect(new Date(2024, 11, 25).format('M')).to.equal('Dec')
    })
    it('n renders month without padding', () => {
      expect(new Date(2024, 0, 1).format('n')).to.equal('1')
      expect(new Date(2024, 11, 25).format('n')).to.equal('12')
    })
    it('t renders days in month', () => {
      expect(new Date(2024, 0, 15).format('t')).to.equal('31')
      expect(new Date(2023, 1, 15).format('t')).to.equal('28')
      expect(new Date(2024, 1, 15).format('t')).to.equal('29')
      expect(new Date(2024, 3, 15).format('t')).to.equal('30')
      // december rolls over via the nextMonth === 12 branch
      expect(new Date(2024, 11, 25).format('t')).to.equal('31')
    })
  })

  describe('year identifiers', () => {
    it('L renders leap year as boolean string', () => {
      expect(new Date(2024, 0, 1).format('L')).to.equal('true')
      expect(new Date(2023, 0, 1).format('L')).to.equal('false')
      // century rules
      expect(new Date(2000, 0, 1).format('L')).to.equal('true')
      expect(new Date(1900, 0, 1).format('L')).to.equal('false')
      expect(new Date(2100, 0, 1).format('L')).to.equal('false')
    })
    it('o renders ISO-8601 week-numbering year', () => {
      expect(new Date(2023, 0, 1).format('o')).to.equal('2022')
      expect(new Date(2024, 11, 30).format('o')).to.equal('2025')
      expect(new Date(2024, 5, 15).format('o')).to.equal('2024')
    })
    it('Y renders full year', () => {
      expect(new Date(2024, 0, 1).format('Y')).to.equal('2024')
    })
    it('y renders two-digit year', () => {
      expect(new Date(2024, 0, 1).format('y')).to.equal('24')
      expect(new Date(1999, 0, 1).format('y')).to.equal('99')
    })
  })

  describe('time identifiers', () => {
    it('a and A render lowercase/uppercase meridiem', () => {
      expect(new Date(2024, 0, 1, 0, 0, 0).format('a')).to.equal('am')
      expect(new Date(2024, 0, 1, 0, 0, 0).format('A')).to.equal('AM')
      expect(new Date(2024, 0, 1, 12, 0, 0).format('a')).to.equal('pm')
      expect(new Date(2024, 0, 1, 13, 42, 59).format('A')).to.equal('PM')
    })
    it('B renders swatch internet time from UTC parts', () => {
      expect(new Date(Date.UTC(2024, 0, 1, 12, 0, 0)).format('B')).to.equal(
        '541',
      )
      expect(new Date(Date.UTC(2024, 0, 1, 23, 59, 59)).format('B')).to.equal(
        '41',
      )
    })
    it('g renders 12-hour without padding', () => {
      expect(new Date(2024, 0, 1, 0, 0, 0).format('g')).to.equal('12')
      expect(new Date(2024, 0, 1, 9, 5, 7).format('g')).to.equal('9')
      expect(new Date(2024, 0, 1, 13, 0, 0).format('g')).to.equal('1')
    })
    it('G renders 24-hour without padding', () => {
      expect(new Date(2024, 0, 1, 0, 0, 0).format('G')).to.equal('0')
      expect(new Date(2024, 0, 1, 9, 5, 7).format('G')).to.equal('9')
      expect(new Date(2024, 0, 1, 13, 0, 0).format('G')).to.equal('13')
    })
    it('h renders 12-hour zero-padded', () => {
      expect(new Date(2024, 0, 1, 0, 0, 0).format('h')).to.equal('12')
      expect(new Date(2024, 0, 1, 9, 5, 7).format('h')).to.equal('09')
      expect(new Date(2024, 0, 1, 13, 0, 0).format('h')).to.equal('01')
      expect(new Date(2024, 0, 1, 23, 0, 0).format('h')).to.equal('11')
    })
    it('H renders 24-hour zero-padded', () => {
      expect(new Date(2024, 0, 1, 0, 0, 0).format('H')).to.equal('00')
      expect(new Date(2024, 0, 1, 9, 5, 7).format('H')).to.equal('09')
      expect(new Date(2024, 0, 1, 13, 42, 59).format('H')).to.equal('13')
    })
    it('i renders zero-padded minutes', () => {
      expect(new Date(2024, 0, 1, 12, 0, 0).format('i')).to.equal('00')
      expect(new Date(2024, 0, 1, 12, 5, 0).format('i')).to.equal('05')
      expect(new Date(2024, 0, 1, 13, 42, 59).format('i')).to.equal('42')
    })
    it('s renders zero-padded seconds', () => {
      expect(new Date(2024, 0, 1, 12, 0, 0).format('s')).to.equal('00')
      expect(new Date(2024, 0, 1, 12, 0, 7).format('s')).to.equal('07')
      expect(new Date(2024, 0, 1, 13, 42, 59).format('s')).to.equal('59')
    })
    it('v renders zero-padded milliseconds', () => {
      expect(new Date(2024, 0, 1, 12, 0, 0, 5).format('v')).to.equal('005')
      expect(new Date(2024, 0, 1, 12, 0, 0, 50).format('v')).to.equal('050')
      expect(new Date(2024, 0, 1, 12, 0, 0, 500).format('v')).to.equal('500')
    })
  })

  describe('timezone identifiers', () => {
    it('e renders the resolved timezone name', () => {
      expect(new Date(2024, 0, 1).format('e')).to.equal(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )
    })
    it('I reports whether the date is in DST', () => {
      // expected value derived from the timezone itself so the suite
      // passes in both DST and non-DST timezones
      const jan = new Date(2024, 0, 1)
      const jul = new Date(2024, 6, 1)
      const janOff = jan.getTimezoneOffset()
      const julOff = jul.getTimezoneOffset()
      const hasDst = janOff !== julOff
      const dstOff = Math.min(janOff, julOff)
      if (hasDst) {
        expect(jan.format('I')).to.equal(String(Number(janOff === dstOff)))
        expect(jul.format('I')).to.equal(String(Number(julOff === dstOff)))
      } else {
        // no DST in this timezone, so I is always 0 (as in PHP)
        expect(jan.format('I')).to.equal('0')
        expect(jul.format('I')).to.equal('0')
      }
    })
    it('O renders timezone offset as +HHMM', () => {
      const d = new Date(2024, 0, 1, 12, 0, 0)
      const off = d.getTimezoneOffset()
      const sign = -off < 0 ? '-' : '+'
      const hh = String(Math.floor(Math.abs(off) / 60)).padStart(2, '0')
      const mm =
        off % 60 === 0
          ? '00'
          : String(Math.abs(off % 60)).padStart(2, '0')
      expect(d.format('O')).to.equal(`${sign}${hh}${mm}`)
    })
    it('P renders timezone offset as +HH:MM', () => {
      const d = new Date(2024, 0, 1, 12, 0, 0)
      const off = d.getTimezoneOffset()
      const sign = -off < 0 ? '-' : '+'
      const hh = String(Math.floor(Math.abs(off) / 60)).padStart(2, '0')
      const mm =
        off % 60 === 0
          ? '00'
          : String(Math.abs(off % 60)).padStart(2, '0')
      expect(d.format('P')).to.equal(`${sign}${hh}:${mm}`)
    })
    it('T renders the timezone abbreviation', () => {
      const d = new Date(2024, 0, 1, 12, 0, 0)
      const parts = d.toLocaleTimeString(navigator.language, {
        timeZoneName: 'short',
      })
      expect(d.format('T')).to.equal(parts.split(' ').pop())
    })
    it('Z renders offset in seconds', () => {
      const d = new Date(2024, 0, 1, 12, 0, 0)
      expect(d.format('Z')).to.equal(String(-d.getTimezoneOffset() * 60))
    })
  })

  describe('full date/time identifiers', () => {
    it('c renders ISO 8601 date built from the other identifiers', () => {
      const d = new Date(2024, 0, 1, 13, 14, 15)
      const expected = `${d.format('Y')}-${d.format('m')}-${d.format(
        'd',
      )}T${d.format('H')}:${d.format('i')}:${d.format('s')}${d.format('P')}`
      expect(d.format('c')).to.equal(expected)
    })
    it('r renders the native toString value', () => {
      const d = new Date(2024, 0, 1, 13, 14, 15)
      expect(d.format('r')).to.equal(d.toString())
    })
    it('U renders unix epoch seconds', () => {
      expect(new Date(Date.UTC(2024, 0, 1)).format('U')).to.equal('1704067200')
    })
  })

  describe('escaping and unknown identifiers', () => {
    it('escapes an identifier with a backslash', () => {
      expect(new Date(2024, 0, 1).format('\\Y')).to.equal('Y')
      expect(new Date(2024, 0, 1).format('\\m')).to.equal('m')
    })
    it('passes unknown identifiers through', () => {
      expect(new Date(2024, 0, 1).format('Q')).to.equal('Q')
    })
    it('mixes identifiers, escapes and literals', () => {
      expect(new Date(2024, 0, 1).format('Y\\m-d')).to.equal('2024m-01')
      expect(new Date(2024, 0, 1).format('[Y]')).to.equal('[2024]')
    })
  })

  describe('composite formats', () => {
    it('renders the default element format M jS, Y', () => {
      expect(new Date(2024, 0, 21).format('M jS, Y')).to.equal('Jan 21st, 2024')
    })
  })
})
