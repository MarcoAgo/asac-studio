# asac-studio

Sanity Studio for the Amici del Cuore Scaligera website. The website is the
sibling repo `../asac-website`; see its `CLAUDE.md` and the project plan.

## Git

- Working directly on `main` is fine.
- Everything git-related is **always in English**: commit messages, branch
  names, tags, PR titles and descriptions. Never Italian.

## Conventions

- Schema names, field names and every editor-facing label are Italian (the
  editors are Italian volunteers); code comments are English.
- Two workspaces, `production` and `development`, one per dataset
  (`constants.ts`).
- `richiesta` documents are created only by the website, always with
  `_id: "richieste.<uuid>"` (an ID with a dot is never served without a
  token). Never add personal data to documents with a root ID.
- Never upload files containing personal data: Sanity assets are public on
  the CDN even when the dataset is private.
- `npm run typegen` extracts the schema and writes types into
  `../asac-website/app/_types/sanity.types.ts`.

## Commands

```
npm run dev       # Studio on http://localhost:3333
npm run typegen   # schema extract + typegen into the website repo
npm run deploy    # deploy to <host>.sanity.studio
```
