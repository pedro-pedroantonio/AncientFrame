# AncientFrame

AncientFrame is a static, front-end construction and framing calculator website built for builders, framers, and tradespeople who need quick, practical geometry answers in the field.

The site helps users turn real-world measurements into usable framing dimensions such as roof rise, rafter length, stair geometry, arch dimensions, oval openings, and right-triangle calculations. It is intentionally lightweight, dependency-free, and easy to host on a standard static web server.

## Overview

AncientFrame is designed around a simple principle:

- users enter familiar construction measurements
- the site converts those values into geometry and dimension outputs
- results are displayed in practical feet, inches, and fractional formats
- saved measurement results remain on the device for quick reference

This project is not a framework application. It is a pure HTML, CSS, and JavaScript website with no build step, package manager, or server-side runtime required.

## Key features

- Rafter calculator with multiple modes
- Stair calculator for rise, tread, run, and stringer geometry
- Roof framing calculations
- Arched opening geometry
- Oval opening calculations
- Angles and right-triangle formulas
- Saved measurements using browser localStorage
- Guide content and calculators rendered from data files
- Static SEO metadata and JSON-LD schema markup
- Ready for deployment to a static host such as Hostinger

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser localStorage for temporary saved measurements
- No Node.js, npm, React, Vue, Angular, or JS framework

## Project structure

```text
AncientFrame/
├── index.html                  # Homepage and landing page
├── about.html                 # About page
├── blog-post.html             # Individual blog/article layout
├── calculators.html           # Calculators landing page
├── contact.html              # Feedback/contact page
├── disclaimer.html           # Disclaimer page
├── faq.html                  # FAQ page
├── guides.html               # Guides landing page
├── privacy.html              # Privacy page
├── projects.html             # Saved measurements page
├── terms.html                # Terms page
├── robots.txt                # SEO crawl directives
├── sitemap.xml               # Sitemap
├── README.md                 # Project documentation
├── assets/
│   └── images/               # Project images and visual assets
├── calculators/
│   ├── angles.html
│   ├── arched-opening.html
│   ├── oval-opening.html
│   ├── rafter.html
│   ├── roof-framing.html
│   └── stairs.html
├── css/
│   └── main.css              # Shared site styling
├── js/
│   ├── calculators.js        # Calculation logic and saved results handling
│   ├── config.js             # Deployment configuration and API endpoint placeholders
│   ├── data.js               # Calculator and guide metadata
│   ├── guides.js             # Guide rendering logic
│   ├── main.js               # Shared site navigation and homepage rendering
│   └── projects.js           # Saved measurements rendering and deletion
└── ...
```

## Architecture and behavior

### Static frontend

The project uses a static multi-page architecture. Each HTML page loads CSS and JavaScript files directly from the browser. There is no backend application, API server, database, or build system in the repository.

### Content-driven structure

A large portion of the site content is defined in `js/data.js`:

- calculator catalog entries
- guide articles and metadata
- text content for homepage sections and tool cards

This allows the site to reuse the same card-based layouts across different pages without duplicating large blocks of content in markup.

### Calculation model

Each calculator page uses JavaScript in `js/calculators.js` to:

- parse user input values
- convert measurements to a normalized internal format
- perform geometry calculations
- round results for display in feet/inches/fractions
- optionally save results in the browser

The design keeps the math logic separate from the page markup, which makes the calculators easier to maintain and extend.

### Saved measurements

The project stores saved calculation results locally in the browser using `localStorage`.

Storage key:

```text
ancientframe_saved_measurements_v1
```

Stored entry schema:

```json
{
  "id": 1727100000000,
  "type": "Rafter",
  "data": {
    "run": "12' 0\"",
    "rise": "8' 0\"",
    "length": "14' 8 1/2\"",
    "angle": "33.6901°",
    "pitch": "8/12"
  },
  "savedAt": "2026-09-23T12:00:00.000Z"
}
```

The list is capped to 100 entries and displayed on the Saved Measurements page.

## Data schemas

### 1. Calculator catalog schema

Defined in `js/data.js` and used by the main site and calculator landing page.

```json
{
  "title": "Rafter Calculator",
  "slug": "rafter",
  "description": "Rafter length, rise, run and roof angle from familiar measurements.",
  "url": "calculators/rafter.html"
}
```

Example array:

```json
[
  {
    "title": "Rafter Calculator",
    "slug": "rafter",
    "description": "Rafter length, rise, run and roof angle from familiar measurements.",
    "url": "calculators/rafter.html"
  },
  {
    "title": "Stair Calculator",
    "slug": "stairs",
    "description": "Riser height, tread depth, total run and stringer geometry.",
    "url": "calculators/stairs.html"
  }
]
```

### 2. Guide schema

```json
{
  "title": "How to Think About Rafter Length",
  "slug": "rafter-length",
  "excerpt": "Understand the relationship between run, rise and the diagonal length of a common rafter.",
  "date": "2026-09-23",
  "category": "Roof framing",
  "body": "<p>...</p>"
}
```

This structure supports the guide index and article rendering without requiring a CMS or separate content service.

### 3. Measurement input formats

The calculator logic accepts a flexible range of common framing-style inputs, including:

- `12'`
- `12-6`
- `12' 6 1/2"`
- `10 1/8"`
- `1 3/16"`
- `8/12` as a pitch ratio

This is intentionally built to match how builders and framers naturally express dimensions in the field.

### 4. SEO / structured data

The homepage includes a JSON-LD schema object as a `WebApplication`:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AncientFrame",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "isAccessibleForFree": true,
  "description": "Free construction and framing calculators for builders and framers."
}
```

This helps search engines understand the site’s purpose and improves discoverability for a content-rich static business site.

## Supported calculator types

### Rafter calculator

Supports multiple solving modes:

- Run + Rise
- Pitch + Run
- Pitch + Rise
- Pitch + Rafter Length

Pitch values are commonly entered as ratios such as `8/12`.

### Stair calculator

The stair logic handles:

- total rise
- number of risers
- tread depth
- total run
- stringer length
- stair angle

### Roof framing calculator

Used for:

- span
- half-span run
- rise
- pitch
- roof angle

### Arch and oval calculators

Used for geometric layout and opening sizing, including:

- arch radius
- arc length
- ellipse major/minor axes
- area and approximate perimeter calculations

### Angles calculator

Handles right-triangle geometry and computes:

- hypotenuse
- side lengths
- angle output in degrees

## Measurement and display conventions

The site is built around a practical field format:

- measurements are entered using familiar feet/inch conventions
- result values are rounded for readability
- results are usually displayed to the nearest 1/16 inch

This is important because the displayed number is meant to be field-friendly, while the underlying mathematical computation may preserve more precision internally.

## Accuracy note

AncientFrame performs standard geometry calculations and displays rounded results for practical use. However:

- local code requirements vary by jurisdiction
- material thickness and framing conditions matter
- field verification is still required
- final layout should be checked against plans, site conditions, and building code requirements

This tool is intended to support decision-making and layout planning, not replace professional engineering review or project-specific verification.

## Deployment and configuration

This is a static website intended for simple hosting.

### Typical deployment

Upload the website contents to a static hosting environment such as Hostinger public web space or any static host that supports HTML/CSS/JS.

### Required configuration before production

Before going live:

1. Replace placeholder canonical and Open Graph URLs with the actual production domain.
2. Configure `js/config.js` with a real feedback endpoint if the contact form is enabled.
3. Add a secure server-side form handler for the feedback form if used.
4. Review all calculator outputs against trusted references.
5. Update marketing text and imagery to match the live brand and project details.

### Feedback / SMTP note

The frontend intentionally avoids embedding email credentials. The project expects a server-side endpoint to handle contact submissions with:

- validation
- honeypot field rejection
- rate limiting
- anti-abuse protections
- SMTP delivery through server-side environment variables or secure config

## Security and privacy considerations

- no user accounts are required
- measurement data is stored in the browser only
- sensitive data is not stored in the repository
- email credentials are intentionally kept out of the client-side code

## Development notes

This repository is intentionally simple and does not require a build pipeline. To work on it locally:

1. Open the project folder in a browser or local web server.
2. Edit HTML, CSS, and JS as needed.
3. Refresh the page to test changes.

Because the project is static, there is no compile step, no install command, and no dependency lockfile.

## Example usage

A typical workflow might look like this:

- homeowner or builder enters a roof run and rise
- the rafter calculator returns rafter length and angle
- the user saves the result to the browser
- the Saved Measurements page shows the calculation for quick reference later

## Summary

AncientFrame is a lightweight jobsite-focused calculation site for building geometry. It is intentionally static, practical, and friendly to developers who want a clear, low-complexity project structure without a framework or server stack.

The project combines:

- clean front-end architecture
- field-friendly measurement parsing
- reusable JavaScript calculation logic
- easy static hosting
- transparent browser-based data storage

This makes it a good fit for a small construction utility site that needs to stay fast, portable, and easy to maintain.
