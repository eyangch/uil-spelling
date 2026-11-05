# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static website for practicing UIL Spelling, based on the [2026-2027 Word Power](https://www.uiltexas.org/files/academics/WordPower_2026-2027.pdf) list and hosted on GitHub Pages. There is no build step, package manager, linter, or test suite. jQuery and Bootstrap load from CDNs. The contest's authority for spellings and forms is *The American Heritage Dictionary of the English Language*, Fifth Edition: Fiftieth Anniversary (2018 Printing). ahdictionary.com is the working source, but UIL doesn't accept online dictionaries as authoritative. `AHD.pdf` is a different book (the 2011 *Essential* AHD), so it's only useful for spot checks.

## Commands

```sh
# Serve the site, then open http://localhost:8000
python3 -m http.server
```

## Architecture

`index.html` loads `2027.js` (which defines the global `w2027`) in the head and `script.js` at the end of the body. `script.js` works entirely through globals and inline `onclick` handlers.

**Word data format.** Each `w2027` entry is `[spelling, audioPath]`, where `audioPath` is `audio/NNNN.mp3` (the Word Power number) or `""` if there is no clip. `spelling` may hold pipe-separated accepted variants, such as `"abridgment|abridgement"`. An answer is correct if it exactly matches any variant, including case. UIL only credits the form matching the definition read aloud, so this check is more lenient than the contest.

**Sets depend on array position.** The 1500 alphabetized words are divided into 20 sets of 75 by taking every 20th word: set `n` uses indices `n-1, n-1+20, ...`. Inserting or removing an entry moves words between sets, so fix entries in place and keep the length at 1500. Words with no clip stay in the array but are skipped in practice, so some sets have fewer than 75 words.

**Views.** The three screens are toggled by setting `display` on the elements of each CSS class: `toggle1` (set picker), `toggle2` (practice), and `toggle3` (results). Nothing resets session state, so the results page tells the user to reload to practice again.

## Word and audio data

**`wordlist.txt`** has one entry per line in official order, so the line number is the Word Power number. An entry keeps its source notation: `, ` separates accepted spellings, a trailing ` •` marks one of the 350 vocabulary-study words, and `(...)` is a qualifier rather than part of the spelling, such as `(singular)`, `(trademark)`, or `(adj)`.

**`audio_log.txt`** lists, in numerical order, every word whose clip isn't an exact-headword AHD clip or that needs a note. Keep it in sync when changing a clip.

Two kinds of wrong clip look fine to a simple scrape of ahdictionary.com:
- **Other forms.** Searching a form without its own entry silently returns the base word's page, so `decoyed` gets `decoy`. Compare the entry's headword to the word.
- **Partial clips.** On multi-word headwords, the clip may voice only part of the term, so `Homo sapiens` says only "sapiens". The printed pronunciation shows which words are voiced.

`get_ids.py`, `fix_audios.py`, and `fix_omit_prog.py` are from the 2024 season. They don't handle either case, and running `get_ids.py` would create a stray `2024.js`. The 2027 pipeline and saved AHD pages are in `.cache/` (gitignored, local only). The pages also contain definitions, origins, and other word forms for future features.
