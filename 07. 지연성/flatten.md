# 1. L.flatten
- Array 의 메소드인 flatten 과 동일한 기능
```typescript
const isIterable = a => a && a[Symbol.iterator]

const L = {}

L.flatten = function *(iter) {
	for(const a of iter) {
		if (isIterable(a)) {
			for(const b of a) yield b;
    }
		else yield a;
  }
}
```

## L.flatten 으로 flatten 만들기
```typescript
const flatten = pipe(L.flatten, take(Infinity))
```