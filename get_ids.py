import requests

year = 2024

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

ff = open('omit.txt', 'w', encoding='utf-8')
cnt = 0
with open("2024.js", "w") as f:
	f.write("var w" + str(year) + " = [\n")
	fst = 1
	with open("wordlist.txt", encoding='utf-8') as w:
		for word in w.readlines():
			print(f'Working on #{cnt+1}', flush=True)
			cnt += 1
			word = word.strip()
			params = {
				'q': word
			}
			#print("starting " + str(params))
			r = requests.get('https://www.ahdictionary.com/word/search.html', params=params, headers=headers).text
			idx = r.find("/application/resources/wavs/")
			#print(idx)
			if idx == -1:
				ff.write(str(word) + '\n')
				continue
			if not fst:
				f.write(",\n")
			fst = 0
			f.write("[\"" + word + "\",\"https://www.ahdictionary.com" + r[idx:idx+40] + "\"]")
			f.flush()
	f.write("\n]\n")

ff.close()