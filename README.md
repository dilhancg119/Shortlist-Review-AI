# Shortlist Review

A dashboard that compares three shortlisted Sri Lankan tour operators as prospects for a travel booking system: Green Holiday Travels, Red Dot Tours and Blue Lanka Tours.

It covers their products, their teams, how they handle clients, and how well a booking system would fit each one.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. It redirects to `/all`, the view that compares all three.

`npm run build` produces a fully static site (every company selection and page is prerendered).

## Pages

| Route | What it shows |
| --- | --- |
| `/[view]` | Ranking by fit score, cross-shortlist findings, company snapshot |
| `/[view]/work` | Catalogue size, published prices, service lines, themes and awards |
| `/[view]/teams` | Visible team by function, how each team is organised |
| `/[view]/clients` | Enquiry journey, contact channels, public reviews |
| `/[view]/opportunity` | Fit score with adjustable weights, capability gaps, pitch plan, discovery questions |
| `/[view]/sources` | Every page reviewed, and how to read the evidence tags |

## Signing in

Every page sits behind a sign-in screen. There is one shared account, set through the `AUTH_USERNAME` and `AUTH_PASSWORD` environment variables: copy `.env.example` to `.env.local` for local work, and set the same variables on your host when deploying. Until both are set, nobody can sign in. A sign-in lasts 30 days, and changing the password signs everyone out.

The check runs on the server (`src/proxy.ts` and `src/app/login/actions.ts`), so the password is never sent to the browser. It does need a Node server (`npm run start` or a host that runs Next.js); a static export would not be protected.

## Built for phones first

- Bottom tabs for the five sections, with the company filter pinned at the top.
- Comparison tables read fact by fact on a phone, with each company's answer listed under the fact.
- Long lists (team members, score weights) fold away and open on tap.
- Details that would be hover tooltips on desktop open on tap.
- It can be added to a phone's home screen and opens full screen (see `src/app/manifest.ts`).

## The company filter

The filter is the first URL segment, so any filtered view can be shared as a link:

- `/all/work` compares all three
- `/blue-lanka/teams` shows one company
- `/green-holiday-vs-blue-lanka/opportunity` compares two

## Where the data lives

- `src/lib/companies.ts`: every fact about the three companies, each tagged with where it came from (company site, review platform, guest reviews, our reading, or not published).
- `src/lib/fit.ts`: the five scoring criteria, their default weights, and each company's 1 to 5 scores with the evidence behind them.

All data was read from public websites on 15 Nov 2026 and has not been confirmed with the companies. The fit scores are a judgement, not a measurement. Update both files as discovery calls bring first-hand answers.

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, lucide-react for icons. Charts are plain HTML and CSS, with no chart library.
