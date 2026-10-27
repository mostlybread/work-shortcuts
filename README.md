# Work Shortcuts

A one-page set of work links, shown as tiles and served with GitHub Pages.

## Changing links

The links are stored encrypted in `links.enc.json`, and the page asks for the
password once per phone. The readable source (`links.json`) is kept privately,
outside this repo, and is ignored by git.

`links.json` has three lists:

- `locations`: one panel per station, with `name`, `code` and `links`.
  Each link has a `type` (`departures`, `map`, `board`, `thameslink`, `link`) and a `url`,
  plus an optional `label`.
- `contacts`: groups with a `title` and `items`; each item has a `name` and a
  `phone` and/or `email` (add `"text": true` for a Text button), plus optional `icon` (emoji) and `links` ({label, url}). Groups can have an `icon` too.
- `other`: web links for the Links section, each with `label`, `url` and an optional `icon`.

To publish a change, re-encrypt and commit `links.enc.json`:

    SHORTCUTS_PASSWORD='…' node tools/encrypt.mjs path/to/links.json

## Installing on a phone

The site is a web app: open it in the browser and choose **Add to Home Screen**
(iPhone: Share menu; Android: ⋮ menu → Install app). It opens instantly from the
saved copy and checks `links.json` for changes each time it opens.
