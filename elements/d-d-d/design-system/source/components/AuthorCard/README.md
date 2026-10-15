# AuthorCard

Display author information with photo, bio, and social links.

- Package `@haxtheweb/author-card` 26.8.0
- HAX block "Author Card" (Other)
- HAX design-system controls offered: accent, primary

## Usage

```html
<author-card name="btopro" title="Developer &amp; Educator" description="btopro is a developer and educator working on HAX and web components." image="media/headshot.jpg" profile-url="/u/btopro" social-link="https://x.com/btopro" social-handle="@btopro"></author-card>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `name` | Author Name | Full name of the author. | textfield |
| `image` | Profile Image | Author profile photo. | haxupload |
| `title` | Job Title | Author's position or role. | textfield |
| `description` | Bio | Short author biography. | textarea |
| `profile-url` | Profile URL | Link to the author's profile page. | url |
| `social-link` | Social Link | Link to a social media profile. | url |
| `social-handle` | Social Handle | Social media handle (for example @username). | textfield |

## DDD usage

Its source references 22 distinct design-system variables. By family: theme (21), spacing (6), font (6), border (2), radius (1), lh (1). Most used: `--ddd-spacing-4`, `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-slateGray`, `--ddd-font-size-sm`, `--ddd-theme-default-slateLight`.
