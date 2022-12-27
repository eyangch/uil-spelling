import requests
import re

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Referer': 'https://www.ahdictionary.com/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

L = len(open("2023.js", "r").readlines()) # total words
done = 0 # number processed

for w in open("2023.js", "r").readlines():
    done += 1

    w = w.strip()
    if w == ']':
        break
    if w[0] != '[':
        continue
    w = w[1:-2].split(",")
    s = w[0][1:-1].split("|")[0] # the actual word
    if "ahdic" not in w[1]:
        continue # not an ahdictionary link, no point in checking

    params = {
        'q': s
    }

    r = requests.get('https://www.ahdictionary.com/word/search.html', params=params, headers=headers).text
    # do the query
    idx = r.find("<font color=\"#006595\">")
    test = r[idx+22:idx+70]
    test = test[:test.find("</font>")] # find the mention of the word
    test = ''.join(map(str, test.split("·"))) # remove pronunciation symbols

    if test != s:
        # goofed up audio
        open("bad_audios.txt", "a").write(test + " " + s + "\n")
        # lol turns out for some of them it parses wrong like "corpocracy<sup> 1</sup>" oof

    print("{0:.2%}".format(done/L)) # progress tracker
    # break