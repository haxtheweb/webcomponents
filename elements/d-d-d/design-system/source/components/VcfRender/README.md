# VcfRender

Show the people in a contact file as person cards, quotes, a table or a list.

- Package `@haxtheweb/vcf-render` 26.8.0
- HAX block "Contacts" (Content, contacts, vcard, vcf, directory)
- HAX design-system controls offered: accent, primary, card, text

## Usage

```html
<vcf-render contact-data="BEGIN:VCARD
VERSION:3.0
N:Doe;John;;;
FN:John Doe
ORG:Example Corp
TITLE:Director of Teaching and Learning
TEL;TYPE=WORK,VOICE:(111) 555-1212
EMAIL;TYPE=PREF,INTERNET:john.doe@example.com
ADR;TYPE=WORK:;;42 Plantation St.;Baytown;LA;30314;United States of America
URL:https://hax.psu.edu/
NOTE:Supports faculty adopting open courseware.
END:VCARD" display-as="cards"></vcf-render>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `data-source` | Contact file | Upload or choose a .vcf contact file. Its cards are read in the browser. | haxupload |
| `display-as` | Display as | How to present what the file contains. | select |
| `caption` | Heading | Shown above the contacts, and as the table caption. | textfield |

## DDD usage

Its source references 7 distinct design-system variables. By family: font (5), spacing (4), theme (1). Most used: `--ddd-font-navigation`, `--ddd-spacing-2`, `--ddd-spacing-4`, `--ddd-font-size-s`, `--ddd-font-weight-bold`, `--ddd-font-size-4xs`.
