# Bargain Beacon

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/febry10/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/febry10/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Bargain Beacon is a real Black Friday & Cyber Monday deal finder: 38 deals at 9 US stores, each one found and checked on Friday 27 November 2026 at its store or in a deals roundup that names the store. Every deal shows its product, store, store link, sale price, usual price, discount, and when and where its price was checked — plus an honest signal (new low / strong price / routine sale / inflated) with the evidence behind it. Search, category / store / discount filters, four sort orders, and same-product price comparison across stores all work in the browser, on desktop and on a phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network request: the site is plain static files under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=xttqesbf&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
