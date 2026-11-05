# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static website for practicing UIL Spelling, based on the [2023-2024 Word Power](https://www.uiltexas.org/files/academics/WordPower_2023-24.pdf) list. There is no build step, package manager, linter, or test suite. jQuery and Bootstrap load from CDNs, and audio streams from third-party hosts, so the app needs network access.

## Commands

```sh
# Serve the site, then open http://localhost:8000
python3 -m http.server

# Regenerate word data from wordlist.txt (needs `pip install requests`).
# Read "Word data pipeline" first: this overwrites hand-edited data.
python3 get_ids.py
```

## Architecture

`index.html` loads `2024.js` (which defines the global `w2024`) in the head and `script.js` at the end of the body. `script.js` works entirely through globals and inline `onclick` handlers.

**Word data format.** Each `w2024` entry is `[spelling, audioUrl]`. `spelling` may hold pipe-separated accepted variants, such as `"apothegm|apophthegm"`. An answer is correct if it exactly matches any variant, including case. The word list next to the set picker shows only the first variant.

**Sets depend on array position.** The 1500 alphabetized words are divided into 20 sets of 75 by taking every 20th word: set `n` uses indices `n-1, n-1+20, ...`. Inserting or removing an entry moves words between sets, so fix entries in place and keep the length at 1500. These numbers are hardcoded in `script.js` (`1500`, `75`, `20`) and `index.html` (the 20 set cells and the "Out of the 75 words" message).

**Views.** The three screens are toggled by setting `display` on the elements of each CSS class: `toggle1` (set picker), `toggle2` (practice), and `toggle3` (results). Nothing resets session state, so the results page tells the user to reload to practice again.

## Word data pipeline

The Python scripts scrape audio URLs from ahdictionary.com. `2024.js` was then edited by hand and can't be reproduced by running them:

- `get_ids.py` truncates and rewrites both `2024.js` and `omit.txt`, using the first `.wav` on each word's results page. Words with no audio go to `omit.txt` and are left out of `2024.js`, which breaks the 1500-entry layout. It would also discard the current pipe variants and the 90 audio URLs from other hosts (mostly howtopronounce.com). For a single word, edit `2024.js` directly.
- `fix_omit_prog.py` retries the words in `omit.txt` and appends the results to `2024.js` after the closing `]`, leaving a file that needs merging by hand. Words that still fail go to `omit_take_two.txt`.
- `fix_audios.py` logs words whose first dictionary result doesn't match to `bad_audios.txt`, and its comments note false positives from parsing. It reads `2023.js`, which is no longer in the repo, so it needs that path updated before it will run.

The season is hardcoded in the `2024.js` filename, the `w2024` variable (used throughout `script.js`), `year` in `get_ids.py`, and the page title and heading in `index.html`.
