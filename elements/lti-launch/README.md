# lti-launch

A block that opens an external learning tool: the tool's title and description with a launch button, in a new window or on the page.

```html
<!-- plain link -->
<lti-launch
  title="Lab 4 autograder"
  description="Submit your code to the autograder."
  launch-url="https://tool.example/lab4"
>
  <a slot="fallback" href="https://tool.example/lab4">Lab 4 autograder</a>
</lti-launch>

<!-- LTI 1.3 login request -->
<lti-launch
  title="Lab 4 autograder"
  launch-url="https://tool.example/lab4"
  login-url="https://tool.example/lti/login"
  client-id="hax-8c1f"
  deployment-id="dep-001"
></lti-launch>
```

## What it is, and what it is not

This is the front-end piece an author places. It does two things:

- **Plain link**: `launch-url` opens the tool.
- **LTI 1.3**: when `login-url`, `client-id` and `deployment-id` are all set, the button sends the LTI 1.3 third-party-initiated login request to the tool's `login-url`, as a real `<form method="post">`.

A full LTI 1.3 launch needs more than that request. The tool answers it by sending the browser back to the platform's authorization address, and the platform must reply with a signed `id_token` and publish its public keys. **That platform back end is not part of this element** and is future plugin work. Without it, a tool that receives the login request has nowhere to finish the launch. (The other direction, an LMS launching HAXcms as a tool, is a separate plugin.)

## Attributes

| Attribute | Property | Default | Notes |
| --- | --- | --- | --- |
| `title` | `title` | `""` | Name of the tool: header and button text. |
| `description` | `description` | `""` | What learners do in the tool. Plain text. |
| `launch-url` | `launchUrl` | `""` | Address of the tool. Absolute `http://` or `https://` only. In LTI mode it is sent as `target_link_uri`. |
| `display` | `display` | `window` | `window` (a new window; the button says so) or `embed` (a frame on the page). |
| `login-url` | `loginUrl` | `""` | LTI 1.3: the tool's login initiation address. |
| `client-id` | `clientId` | `""` | LTI 1.3: sent as `client_id`. |
| `deployment-id` | `deploymentId` | `""` | LTI 1.3: sent as `lti_deployment_id`. |
| `issuer` | `issuer` | page origin | LTI 1.3: sent as `iss`. |
| `login-hint` | `loginHint` | `""` | LTI 1.3: opaque value sent as `login_hint`. Usually supplied by the host (below). |
| `lti-message-hint` | `ltiMessageHint` | `""` | LTI 1.3: opaque value sent as `lti_message_hint`. |
| `embed-height` | `embedHeight` | `480` | Height of the frame in pixels, 200 to 2000. |
| `accent-color` | `accentColor` | none | A SimpleColors name for the chip and button. Without it they follow the theme palette. |

If `login-url`, `client-id` or `deployment-id` is missing or the login address is not usable, the block is a plain link. If `launch-url` is not usable the block says so and has no button.

## Slot

| Slot | What it is |
| --- | --- |
| `fallback` | A plain `<a href>` to the tool, kept in the light DOM. The element does not display it; it is what a reader sees when scripts do not run. HAX writes it on save from `launch-url` and `title`. |

## Events

| Event | When | Detail |
| --- | --- | --- |
| `lti-launch-request` (bubbles, composed, cancelable) | LTI mode, before the form is posted | `{ display, loginUrl, params: { iss, target_link_uri, client_id, lti_deployment_id, login_hint, lti_message_hint } }` |
| `user-engagement` (bubbles, composed) | The learner launches | `{ activityDisplay: "attempted", objectName, statement }` |

A host (the platform back end's front end) listens for `lti-launch-request` and sets `detail.params.login_hint` and `detail.params.lti_message_hint` synchronously; the element then posts the form with them. Only those two values are read back: the rest are the author's settings. `preventDefault()` stops the launch. With no issuer or no login hint, nothing is sent and the block says the sign-in service is not available.

```js
document.addEventListener("lti-launch-request", (e) => {
  e.detail.params.login_hint = platform.hintForCurrentLearner();
  e.detail.params.lti_message_hint = platform.hintForLaunch(e.target);
});
```

## Security

- **Addresses.** Every address is parsed and must be absolute `http:` or `https:` with no user name or password in it. `javascript:`, `data:`, `blob:`, `file:`, relative paths and anything that does not parse are treated as no address. The element uses the parsed, normalized address, never the raw attribute (`lib/lti-launch-url.js`).
- **No secrets in attributes.** Client id and deployment id are public identifiers the tool hands out. Private keys, client secrets and tokens live on the platform back end and must never be put in this element. Hints are opaque values that mean nothing without the back end; do not use a password or a token as one.
- **New windows** open with `rel="noopener"` (plus `noreferrer` on plain links), so the tool cannot reach back into the page.
- **Embedding.** The frame has a title, `loading="lazy"`, `allow="fullscreen"` only, and a sandbox (scripts, forms, popups, downloads). A tool on another origin also gets `allow-same-origin` so its own sign-in and storage work; a frame on the page's own origin never does.
- **No HTML from strings.** The form, its hidden fields and the frame are rendered as templates.
- **No tracking.** The element stores nothing and contacts nobody on its own; it only announces that the tool was opened.

## Learner record (xAPI)

The element sends one statement: `attempted` when the learner launches, about a generic interaction activity. It does not count toward page completion, because the block cannot know whether the learner finished anything in the tool. Nothing is sent while HAX is editing.

Scores are the platform back end's job. When a tool reports a score (LTI Assignment and Grade Services), the back end should record a `completed` statement for the same activity id, marked as imported, and the element never fakes one:

```json
{
  "verb": { "id": "http://adlnet.gov/expapi/verbs/completed" },
  "object": { "id": "<the activity id of the attempted statement>" },
  "result": {
    "success": true,
    "completion": true,
    "score": { "raw": 18, "min": 0, "max": 20, "scaled": 0.9 }
  },
  "context": {
    "extensions": {
      "https://haxtheweb.org/xapi/extensions/imported": true,
      "https://haxtheweb.org/xapi/extensions/element": "lti-launch"
    }
  }
}
```

Build it with `buildStatement` from `@haxtheweb/user-action/lib/xapi.js` so it carries the educational record context.

## Keyboard and accessibility

- The plain link is a real link and the LTI launch a real submit button; both work with Enter, and the button text says when a new window opens.
- In embed mode a visible "Open in a new window instead" control is always there, for tools that refuse to be framed. Opening on the page moves focus to the frame, which has a title.
- What happened ("A new window opened with the tool.") is shown in the footer and announced through a polite live region.
- Colors come from DDD tokens and work in dark mode. Nothing moves.

## HAX

Configure: title, description, launch URL, open in. Advanced: LTI login URL, client ID, deployment ID, issuer, height on the page, accent color. Developer: the two hints. While editing, the button does not launch and nothing is sent.

## Commands

- `yarn start` - development server
- `yarn run build` - format, analyze and refresh the docs data
- `yarn test` - run the tests
