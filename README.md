# Work Shortcuts

A one-page set of work links, shown as tiles and served with GitHub Pages.

## Changing links

Everything is in `links.json`:

- `locations`: one panel per station, with `name`, `code` and `links`.
  Each link has a `type` and a `url`, plus an optional `label` to override the default name.
  Types (each has its own colour and icon): `departures`, `map`, `board`, `thameslink`, `link`.
- `other`: extra links shown under "Other", each with `label` and `url`.

Panels and links appear in the order they're listed. Edit the file on GitHub
and commit, and the site updates within a minute or two.

## Installing on a phone

The site is a web app: open it in the browser and choose **Add to Home Screen**
(iPhone: Share menu; Android: ⋮ menu → Install app). It opens instantly from the
saved copy and checks `links.json` for changes each time it opens.
