# AncientFrame

AncientFrame is a static, framework-free construction calculator website.

## Stack
- HTML5
- CSS3
- ES6 JavaScript
- Browser localStorage for saved measurements

No Node.js, npm, build process, React, Vue, Angular, Bootstrap, Tailwind or jQuery is required.

## Publishing
Upload the contents of this folder to the public web directory on Hostinger.

Before production:
1. Replace `https://www.ancientframe.com/` in canonical/OG tags with the actual domain.
2. Configure `js/config.js` with the URL of a server-side form endpoint for the feedback/contact form.
3. Configure that server-side handler to use Hostinger SMTP credentials stored only on the server.
4. Add real project/blog imagery and update `js/data.js`.
5. Test calculations against a trusted reference before using them for live construction work.

## Measurement format
Inputs accept feet/inches style values such as:
- `12'`
- `12-6`
- `12' 6 1/2"`
- `10 1/8"`
- `1 3/16"`

Displayed dimensional results are rounded to the nearest 1/16 inch.

## Accuracy note
The calculator uses standard mathematical formulas. Display rounding is separate from the underlying calculation. Construction dimensions should still be verified against actual site conditions, material dimensions, plans and applicable building requirements.

## Feedback / SMTP
The static frontend deliberately contains no email credentials. `js/config.js` accepts a server endpoint. The server-side handler should:
- validate fields again
- reject the honeypot field
- rate-limit requests
- add CAPTCHA or another anti-abuse layer if needed
- send mail through Hostinger SMTP
- keep SMTP username/password in server-side environment/configuration only

## Rafter modes
The rafter calculator supports Run + Rise, Pitch + Run (calculates Rise), Pitch + Rise (calculates Run), and Pitch + Rafter Length (calculates both Run and Rise). Pitch accepts forms such as `8/12`.
