# Anthony Fish Care

Static Astro site for hobby fish-care information, fish care sheets, and short
fishkeeping notes.

## CMS Editing

This repo uses Pages CMS as the browser editor for content.

1. Open [Pages CMS](https://app.pagescms.org/).
2. Sign in with GitHub.
3. Open this repository.
4. Add or edit fish and notes through the form UI.
5. Upload fish images in the CMS instead of editing Astro files.
6. Keep a fish entry in draft until every required field is filled in.
7. Save the entry to create a Git commit, then wait for GitHub Pages to rebuild.

Anthony does not need to edit layouts or components to manage content.
The CMS handles the forms and uploads; the site still controls the final image
framing in the browser. If a fish field is left blank, the matching section
simply stays hidden on the public page.

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

Preferred workflow:

1. Create the entry in Pages CMS.
2. Fill out every required fish field while the entry is still marked draft.
3. Upload the main image, juvenile image, male image, female image, and any gallery images.
4. Save the draft and confirm the Git commit appears on `main`.
5. Turn off the draft toggle only after the entry is complete.
6. Leave any optional text box blank if you do not want that section to appear.

Manual fallback:

1. Copy `src/content/fish/_fish-template-copy-me.md.txt`.
2. Paste the copy in `src/content/fish/`.
3. Rename the copy with lowercase dashes, for example `orange-guppy.md`.
4. Fill out every frontmatter field.
5. Leave `draft: true` in place until the entry is complete.
6. Add images to `public/fish-images/`.
7. Use either a bare image name or a `/fish-images/...` path in the fish file.
8. Leave optional fields blank when you do not need them; the page will hide
   empty sections.

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

The site accepts bare file names, `fish-images/...` paths, and `/fish-images/...`
paths. It adds the site-root path automatically.

## Add a Note or Article

Preferred workflow:

1. Create the entry in Pages CMS.
2. Fill out `title`, `date`, `lastUpdated`, `summary`, optional
   `pictorialSteps` for a step list, optional `illustrationsDataTechnique`,
   optional `galleryImages`, and the body text.
3. Upload note images to the `Note images` media area.

Manual fallback:

1. Copy `src/content/notes/_article-template-copy-me.md.txt`.
2. Paste the copy in `src/content/notes/`.
3. Rename the copy with lowercase dashes, for example `water-change-basics.md`.
4. Fill out `title`, `date`, `lastUpdated`, `summary`, optional
   `pictorialSteps` for a step list, optional `illustrationsDataTechnique`,
   optional `galleryImages`, and the body text.
5. Save the file in `src/content/notes/`.

The notes index and article pages update automatically from Markdown files in
`src/content/notes/`. This content structure is suitable for a future
Git-based editor because Anthony can add entries by editing files only.
Note images stay separate from the fish sheet images, and the note page crops
them into a consistent 4:3 frame.

## Deployment

The site is published through GitHub Pages at
`https://aquatictreasuresoffortmyers.com/`. A CMS save creates a Git commit
first, then GitHub Pages publishes that commit after the Actions workflow
finishes.

## GitHub Pages Setup

The repository is already configured to deploy with GitHub Actions. After
publishing the branch, set GitHub Pages source to GitHub Actions in repository
settings.
