# Anthony Fish Site

Static Astro site for hobby fish-care information, fish care sheets, and short
fishkeeping notes.

## What This Site Is

- A public hobby fish-care resource
- A place to share fish care sheets
- A place to share fishkeeping notes and articles
- A site where QR codes on fish bags can open the matching care sheet

## What This Site Is Not

- Not a store
- No shopping cart
- No payments
- No backend

## Run Locally

```powershell
npm install
npm run dev
npm run build
```

## Add a Fish

1. Copy `src/content/fish/_fish-template-copy-me.md.txt`.
2. Paste the copy in `src/content/fish/`.
3. Rename the copy with lowercase dashes, for example `orange-guppy.md`.
4. Fill out the frontmatter fields.
5. Add images to `public/fish-images/`.
6. Use only the image file name in the fish file, for example `orange-guppy.jpg`.

The fish care sheet index and individual fish pages update automatically from
Markdown files in `src/content/fish/`. Anthony does not need to edit layouts or
components to add a new fish.

If a fish does not have a photo yet, use:

```yaml
mainImage: fish-placeholder.svg
juvenileImage: fish-placeholder.svg
maleImage: fish-placeholder.svg
femaleImage: fish-placeholder.svg
```

## Image Naming Rules

- Use lowercase file names
- Use dashes instead of spaces
- Avoid personal names in filenames unless Anthony wants them public

Write only the file name in the content file. The site adds the GitHub Pages
base path automatically.

## Add a Note or Article

1. Copy `src/content/notes/_article-template-copy-me.md.txt`.
2. Paste the copy in `src/content/notes/`.
3. Rename the copy with lowercase dashes, for example `water-change-basics.md`.
4. Fill out `title`, `date`, `lastUpdated`, `summary`, optional
   `pictorialSteps`, optional `illustrationsDataTechnique`, and the body text.
5. Save the file in `src/content/notes/`.

The notes index and article pages update automatically from Markdown files in
`src/content/notes/`. This content structure is suitable for a future
Git-based editor because Anthony can add entries by editing files only.

## Deployment

GitHub Pages deployment is temporary during setup. Connect the final custom
domain before printing QR codes.

## GitHub Pages Setup

The repository is already configured to deploy with GitHub Actions. After
publishing the branch, set GitHub Pages source to GitHub Actions in repository
settings.
