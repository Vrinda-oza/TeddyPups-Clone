# TeddyPups U.A.E. – Website Clone (React + Vite)

Clone of https://puppy.instabizweb.com/ built for the Insta Biz Web technical assignment.

## Tech
React 18, React Router 6, Vite 5, plain CSS (no UI library).

## Run locally
```
npm install
npm run dev      # open http://localhost:5173
npm run build    # production build in /dist
```

## Deploy (Vercel)
Push to GitHub, import the repo on vercel.com. Framework preset: Vite. `vercel.json` already handles page refreshes.

## Structure
- `src/data.js` – all puppies, FAQs, steps and gallery data in one place
- `src/components/` – Header, Footer, WhatsApp chat button, PuppyCard, FAQ accordion
- `src/pages/` – Home, Puppies (filters), PuppyDetail, Families, HowItWorks, Faq, Contact
- `src/styles.css` – all styles, responsive with one breakpoint at 860px

## Home page scenes (scroll-driven)
`src/pages/Home.jsx` has one small component per scene: Hero, MeetPups (page stays pinned while the shelf slides and doors open), TwoWays, Journey (steps and phone chat follow the scroll), Passport, Happy, Questions, Welcome (door opens). The hook `useProgress` tells each scene how far the user has scrolled through it.

## Update notes
- **Page transition**: `PageTransition` in `src/App.jsx` runs on the first visit and on every route change (curtain drops, puppy walks in leaving paw prints, "every puppy is family").
- **Sizes**: `src/scale.js` sets `--k` / `--kv` from the screen size; the home scenes are written for a 1912 x 872 screen (like the original) and scale from there. The container is wide (up to 1840px).
- **Meet the pups**: doors open smoothly as the dog gets near (`o` prop of `DoorCard`), so only the last 2 doors stay closed at the end. The window dog hides the moment the roaming dog steps out, with no flicker.
- **Two ways** and the other scenes use the same bigger sizes.

- **v7**: the dog walks on along the shelf and stops at the 13th door (Korean Teacup), doors open as it reaches them, last 2 stay closed. Happy families has sun + buildings that blend the passport into the wall, a lamp, a panelled door and a new button. Ready-to-meet door redrawn; footer background continues from it; footer bottom bar (logo, year, tagline) matches the original. Journey left column is bigger with more space.

## Merge notes (v8)
- Based on your v7 home page. Added: new Puppies page, "Already gone home" strip (above the footer on /puppies pages, photos in `public/gone/`), hover colour on puppy circles, new puppy detail page (`src/pages/PuppyDetail.jsx`, page colour taken from the photo by `src/tint.js`), cleaner footer moon.
- **v24**: Visit & contact page rebuilt to match the original (heading + intro, call/email, awning visit card with arched photo, notebook-style letter with stamp, dog, paw trail, entry animations). Only src/pages/Contact.jsx and the .ct-* block at the end of src/styles.css changed.
- **v25**: Contact page components bigger; footer basket dog now also on Visit & contact (Layout.jsx); FAQ notes animate on scroll, hover/open animations fixed, sitting dog with tail.
- **v26**: letter tightened; 'curious about' dropdown now lists the real puppies (Max (Maltipoo, boy) ...).
- **v27**: small walking dog on phones and tablets (<1100px); menu has WhatsApp us + Call (bottom bar hidden while menu open, links open their page and close the menu); letter lighter, tablet layout one column.
- **v28**: Home dog on phones/tablets walks with the scroll and peeks over the bottom bar (stays left in Meet the pups); How it works chips wrapped pills; Meet them all dashed arch with shelf.
