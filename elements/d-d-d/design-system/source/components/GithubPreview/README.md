# GithubPreview

Accessible figure with long description.

- Package `@haxtheweb/github-preview` 26.8.0
- HAX block "Github Preview" (Other, git, code, github, repo)

## Usage

```html
<github-preview org="haxtheweb" repo="webcomponents"></github-preview>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `org` | Organization | Github organization machine name | textfield |
| `repo` | Repository | Repo machine name | textfield |
| `extended` | Extended View | Includes readme in element | boolean |

## DDD usage

Its source references 8 distinct design-system variables. By family: theme (6), spacing (5), font (2), border (1). Most used: `--ddd-theme-primary`, `--ddd-spacing-2`, `--ddd-theme-accent`, `--ddd-font-navigation`, `--ddd-spacing-4`, `--ddd-font-size-s`.

## Preview notes

Fetches repository details from the GitHub API at runtime, so it shows "Asset not found" when the network is unavailable, as in this preview.
