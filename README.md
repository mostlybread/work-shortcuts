# Work Shortcuts

A one-page set of work links, shown as tiles and served with GitHub Pages.

## Changing links

All sections and links are in `links.json`. Each link has:

- `label`: the name on the tile
- `code`: a short code shown under the name (can be `""`)
- `url`: the address it opens (`https://…`, or `tel:` / `mailto:` for contacts)

Sections and links appear in the order they're listed. Edit the file on GitHub
and commit, and the site updates within a minute or two.

## Installing on a phone

The site is a web app: open it in the browser and choose **Add to Home Screen**
(iPhone: Share menu; Android: ⋮ menu → Install app). It opens instantly from the
saved copy and checks `links.json` for changes each time it opens.
