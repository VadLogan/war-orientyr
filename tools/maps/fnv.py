import sys
s=open(sys.argv[1]).read().strip()
h=2166136261
for ch in s:
    h^=ord(ch); h=(h*16777619)&0xffffffff
print(len(s), format(h,'x'))
