# Anthony Fish Site

A simple static Astro fish catalog for GitHub Pages.

Temporary Pages URL:

`https://viscrimson.github.io/anthony-fish-site/`

## Add a Fish

1. Copy `src/pages/fish/fish-page-template.astro.txt`.
2. Paste the copy in the same folder.
3. Rename the copy with lowercase dashes and remove `.txt`, for example `orange-guppy.astro`.
4. Edit the fish details at the top of the file.
5. Put the fish image in `public/fish-images/`.
6. Set `image` to only the image file name, for example `orange-guppy.jpg`.

The home page updates automatically from files in `src/pages/fish/`.

If a fish does not have a photo yet, use:

```js
image: "fish-placeholder.svg"
```

## Image Paths

Use this folder for fish images:

`public/fish-images/`

In a fish page, write only the file name:

```js
image: "blue-betta.svg"
```

Do not include `/anthony-fish-site/`, `/public/`, or `fish-images/` in the
fish page. The site adds the GitHub Pages base path automatically.

## Scripts

PowerShell:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
```

## Deployment

Push to `main`, then set GitHub Pages to use GitHub Actions as the source in
repository settings. Do not add a custom domain until the final domain is ready.
