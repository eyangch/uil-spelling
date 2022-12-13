import requests
import re
import urllib.parse
import random
import time

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

# i think some of it got omitted due to spacing
# i think it tries to request as "a%20b" rather than "a+b"
# the below prog tries to fix that
# there's also some cases of weird chars or trailing commas that may have messed things up

with open("2023.js", "a") as f:
	f.write("\n\n") # just separate the two lists
	fst = 1
	with open("omit.txt") as w:
		for word in w.readlines():
			word = re.split(", ", word.strip()[6:])[0]
			
			if ' ' in word or '-' in word:
				url = "https://www.ahdictionary.com/word/search.html?q=" + urllib.parse.quote_plus(word, safe='-/')
				r = requests.get(url).text
				idx = r.find("/application/resources/wavs/")
				#print(idx)
				if idx == -1:
					print("omit: " + word)
					open("omit_take_two.txt", "a").write(word + "\n")
					continue
				if not fst:
					f.write(",\n")
			else:
				params = {
					'q': word
				}
				#print("starting " + str(params))
				r = requests.get('https://www.ahdictionary.com/word/search.html', params=params, headers=headers).text
				idx = r.find("/application/resources/wavs/")
				#print(idx)
				if idx == -1:
					print("omit: " + word)
					open("omit_take_two.txt", "a").write(word + "\n")
					continue
				if not fst:
					f.write(",\n")
			fst = 0
			f.write("[\"" + word + "\",\"https://www.ahdictionary.com" + r[idx:idx+40] + "\"]")
			f.flush()