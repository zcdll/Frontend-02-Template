def kmp_search(txt: str, pat: str) -> int:
    txt_len, pat_len = len(txt), len(pat)

    def make_dfa():
        dfa = [{} for i in range(pat_len)]  # [state][in] => next state
        print(dfa)

        x, dfa[0][pat[0]] = 0, 1

        for j in range(1, pat_len):
            for ch in pat:
                print(ch, '---ch')
                print(dfa[x].get(ch, 0), '---111')
                dfa[j][ch] = dfa[x].get(ch, 0)
            dfa[j][pat[j]] = j + 1
            x = dfa[x].get(pat[j], 0)

        return dfa

    i, j, dfa = 0, 0, make_dfa()

    print(dfa)

    while i < txt_len and j < pat_len:
        j = dfa[j].get(txt[i], 0)
        i += 1

    if j == pat_len:
        print(i - pat_len)
        return i - pat_len

    return -1

kmp_search("BBC ABCDAB ABCDABCDABDE", "ABCDABD")