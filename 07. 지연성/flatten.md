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

// 위의 코드는 아래와 같이 바꿀 수 있다 
// > yield *iterable  => for(const a of iterable) yield a
L.flatten = function *(iter) {
	for (const a of iter) {
		if (isIterable(a)) yield *a;
		else yield a;
	}
};

// 만약 한 depth 뿐만 아니라 아주 깊숙한 depth 까지 iterable 을 펼치고 싶다면 아래의 코드로 만들 수 있다
L.deepFlat = function *f(iter) {
	for (const a of iter) {
		if (isIterable(a)) yield *f(a);
		else yield a;
	}
};
```

## L.flatten 으로 flatten  만들기
```typescript
const flatten = pipe(L.flatten, take(Infinity))
```