# Portfolio

A one-page portfolio site, built with Jekyll and hosted on GitHub Pages.

```
_config.yml            site settings (baseurl lives here — see "Publishing")
_data/
  profile.yml          name, role, about text, contact links
  skills.yml           skill groups and certifications
  projects.yml         one entry per project card
_includes/             page sections
_layouts/default.html  page shell
_sass/                 SCSS partials
assets/
  css/main.scss        imports the partials; GitHub compiles this
  js/main.js           theme toggle, scroll spy, lightbox
  img/projects/        project images
index.html             assembles the sections
```

---

## Adding a project

Add an entry to `_data/projects.yml`:

```yaml
- title: "Project name"
  year: "2024"
  summary: >-
    A nice summary of the project.
  cover: "my-project/cover.jpg"
  alt: "Describes the cover image for screen readers"
  tags: ["C++", "Altium"]
  gallery:                          # optional — omit for a single image
    - src: "my-project/cover.jpg"
      alt: "Describes this image"
      caption: "Shown under the image in the lightbox"
    - src: "my-project/02.jpg"
      alt: "Describes this image"
      caption: "Second image"
  link:                             # optional
    label: "Read the paper"
    url: "https://doi.org/..."
```

Images for the gallery go in `assets/img/projects/my-project/`.

- Paths in `cover` and `gallery.src` are relative to `assets/img/projects/`.
- **With two or more gallery images** the card becomes clickable, shows a
  photo-count badge, and opens the lightbox. **With one image or no `gallery`
  key** it's a plain card. Nothing else changes.
- Images around 1200px wide work well. Cards crop to 3:2, so a mixed set
  still lines up — but the crop is centred, so keep the subject centred.

## Editing the rest

- **About text, name, contact links** — `_data/profile.yml`
- **Skills and tools** — `_data/skills.yml`. Groups render in the order
  listed; add or remove groups freely, the grid adapts.
- **A downloadable CV** — put the PDF in `assets/` and uncomment `cv_url`
  in `_data/profile.yml`. A button appears under the header.

## Colours and type

All design tokens are at the top of `_sass/_variables.scss`. The light and
dark themes are two blocks of CSS custom properties; changing a colour in one
place changes it everywhere.

To ship a **light-only site**, set `dark_mode: false` in `_config.yml`. That
removes the toggle and the pre-paint script; the page then always uses the
light palette.

---

## Publishing

1. Create a repository on GitHub and push this folder to it.
2. Repository **Settings → Pages → Build and deployment**, set source to
   **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Wait a minute for the first build.

**Set `baseurl` in `_config.yml` to match:**

| Repository name        | Site URL                          | `baseurl`      |
| ---------------------- | --------------------------------- | -------------- |
| `<username>.github.io` | `https://<username>.github.io`    | `""`           |
| anything else          | `https://<username>.github.io/<repo>` | `"/<repo>"` |

Getting this wrong is the usual cause of a site that loads but has no styling.
Also update `url:` to your GitHub Pages domain.

The repository must be **public** for free GitHub Pages hosting. That is fine:
a static site ships its HTML, CSS and JS to every visitor anyway, so there is
nothing in here that a public repo exposes and the live site doesn't. Just
don't commit anything you wouldn't put on the page.

## Previewing locally

GitHub builds the site for you, so this is optional. If you want it:

```bash
sudo apt install ruby-dev build-essential   # needed to compile native gems
gem install --user-install bundler

# Put the gem executables on PATH (add to ~/.bashrc to make it stick).
# Without this the shell reports "Command 'bundle' not found".
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"

# Keep the site's gems in the project. Without this, bundler tries to write
# to the system gem directory and fails with a permission error.
bundle config set --local path vendor/bundle

bundle install
bundle exec jekyll serve --livereload       # http://127.0.0.1:4000
```

Stop it with Ctrl+C, or `pkill -f "[j]ekyll serve"` if it got detached. The
brackets stop the pattern matching the shell you type it into.

If `bundle` is still not found, do **not** `apt install ruby-bundler` — that
installs an older bundler system-wide that shadows this one and reintroduces
the permission error. Fix the PATH instead.

A fuller version of this guide, with troubleshooting, lives in Notion:
https://app.notion.com/p/3e4238572b95803888a9d1615df9e3d2
