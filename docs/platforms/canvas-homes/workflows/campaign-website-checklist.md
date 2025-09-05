Campaign Website Checklist

---

# Getting Started

* Clone the template from GitHub on your system and modify the content accordingly.
* In the contact form, change the `projectId` and `projectName`.

---

# Meta Tags

Every site needs its own set of meta tags in `index.html`. This includes the `<title>`, `<meta name="description">`, `<link rel="canonical">`, and all `og:` tags to ensure proper SEO and social sharing.

```html
<link rel="canonical" href="https://assetz-sorasaki.com" />
<meta property="og:title" content="Assetz- Sora and Saki">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.assetz-sorasaki.com">
<meta property="og:image" content="https://www.assetz-sorasaki.com/assets/hero-banner.avif" />
<meta name="description" content="Discover elevated living at Sora and Sake by Assetz, an opu">
```

---

# Google Analytics & Ads IDs

* Create a new GA4 property and data stream for the new website.
* Update the GA Measurement ID in your **Vercel environment variables**.
* Create a goal in your Google Ads account and import the conversion:

  * Go to **Goals** → **+Create conversion action** → **Import** → **GA4** → **Web**
* Reference: [Google Analytics Setup Guide](https://support.google.com/analytics/answer/12946393?hl=en)

---

# Sitemap & Robots.txt

These files are specific to a website's structure and content, so you'll need to generate new ones.

---

# Content

All text, images, videos, and other assets need to be **new and relevant** to the new site.

---

# Favicons

The favicon is a key branding element and must be updated.

* Reference: [Favicon Generator](https://favicon.io/favicon-converter)

---

# Deployment

* Delete the `.git` hidden folder of the template.
* Push the updated code to GitHub (basic `git add`, `git commit`, `git push` commands).
* Import that repo in Vercel, then add the environment variables.
* Adding a **Custom Domain**:

  * Click on **Add Domain**
  * Paste the domain from GoDaddy → click **Add**
  * Customize GoDaddy DNS → Add the values from Vercel domains → click **Save**

---

Do you also want me to make this into a **step-by-step checklist format** (with \[ ] task boxes) so your team can directly follow it?
