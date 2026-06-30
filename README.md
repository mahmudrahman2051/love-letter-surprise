# Love Letter Surprise ❤️

An interactive, pixel-art love letter site. Open the envelope, watch the
letter type itself out, catch floating hearts, and count down to your
anniversary — all in vanilla HTML, CSS, and JS. No frameworks, no build step.

![preview](assets/preview.png)

## Features

- Pixel-envelope opening animation with sparkle burst + confetti
- Typing letter effect
- Ambient floating hearts
- Background music with a play/pause toggle
- Anniversary countdown timer (editable date, saved in the browser)
- "Read Again" and "Surprise Me" (20 random sweet messages)
- Dark / light mode toggle (remembers your choice)
- Fully responsive, mobile-first, accessible (reduced-motion respected,
  keyboard-focusable controls, semantic HTML)

## Project structure

```
/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── music.mp3       ← add your own track here
│   ├── favicon.png      (included)
│   └── preview.png      (included)
├── vercel.json
├── README.md
└── LICENSE
```

> **Note on `assets/music.mp3`:** a placeholder audio file isn't included
> (binary audio can't ship as code). Drop any royalty-free `.mp3` into
> `assets/music.mp3` using that exact filename, and the music button will
> work immediately. Until you add a file, the music button will simply do
> nothing — everything else works fine without it.

## Local development

No build tools needed. Any static server works:

```bash
# Option 1: Python
python3 -m http.server 5500

# Option 2: Node (npx, no install needed)
npx serve .

# Option 3: VS Code
# Install the "Live Server" extension, right-click index.html → "Open with Live Server"
```

Then open `http://localhost:5500` (or whatever port your tool prints).

## Uploading to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Love Letter Surprise"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is easiest).
2. Click **Add New → Project**.
3. Import the GitHub repository you just pushed.
4. Leave all settings as default — this is a static site, so Vercel needs
   **no framework preset, no build command, no output directory**.
5. Click **Deploy**.

That's it. `vercel.json` (already included) enables clean URLs; no further
configuration is required.

## Customization guide

### Change the anniversary date

Two ways:

1. **In the browser:** click the **Edit Date ⚙** control under the
   countdown, pick a date, click **Save**. It's stored in `localStorage`
   so it persists for that visitor.
2. **In code (sets the default for everyone):** open `script.js` and edit:

   ```js
   const ANNIVERSARY_DATE_DEFAULT = "2024-02-14"; // YYYY-MM-DD
   ```

   The countdown always counts to the *next upcoming* occurrence of that
   date, so it works as a recurring yearly anniversary timer.

### Replace the background music

Add your own audio file to `assets/` and name it `music.mp3` (replacing
any existing file). No code changes needed — `index.html` already points
`<audio>` at `assets/music.mp3`. Keep the file reasonably small
(under ~3–5MB) for fast loading.

If you'd rather use a different filename, update this line in `index.html`:

```html
<audio id="bg-music" src="assets/your-file-name.mp3" loop preload="none"></audio>
```

### Edit the love letter

Open `script.js` and edit the `LETTER_TEXT` constant near the top of the
file:

```js
const LETTER_TEXT = `My Dearest,

Your new letter text goes here...
`;
```

Line breaks in the template string become line breaks in the typed letter.

### Edit the 20 "Surprise Me" messages

Still in `script.js`, edit the `SURPRISE_MESSAGES` array — add, remove, or
rewrite any of the 20 strings. The button always avoids repeating the same
message twice in a row.

### Change colors / fonts

All design tokens live at the top of `style.css` under `:root` (light
theme) and `[data-theme="dark"]` (dark theme) — edit the hex values there
to restyle the whole site consistently.

### Replace the favicon / social preview image

Swap out `assets/favicon.png` (browser tab icon) or `assets/preview.png`
(the image shown when the link is shared on social media / messaging
apps) with your own images, keeping the same filenames.

## Accessibility & performance notes

- Respects `prefers-reduced-motion`: animations are minimized/disabled for
  users who request it.
- All interactive controls are keyboard-focusable with visible focus rings.
- Semantic landmarks (`main`, `section`, `footer`) and `aria-live` regions
  for the typed letter and countdown.
- No external JS frameworks or large dependencies — loads fast on mobile.

## License

MIT — see [LICENSE](LICENSE).
