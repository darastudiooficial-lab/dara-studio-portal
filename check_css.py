
with open('client/src/index.css', 'r') as f:
    content = f.read()

stack = []
for i, char in enumerate(content):
    if char == '{':
        stack.append(i)
    elif char == '}':
        if not stack:
            print(f"Extra closing brace at position {i}")
        else:
            stack.pop()

if stack:
    for pos in stack:
        print(f"Unclosed opening brace starting at position {pos}")
else:
    print("All braces are matched.")
