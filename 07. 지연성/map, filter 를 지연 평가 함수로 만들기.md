# 1. map
```typescript
const basicMap = curry((f, iter) => {
	let res = []
  for(const a of iter) res.push(a)
	return res
})

L.map = curry(function *(f, iter) {
	for(const a of iter) yield f(a)
})

// 아래 코드는 pipe 로 추상화 할 수 있음
// const map = curry((f, iter) => go(
// 	iter,
//   L.map(f),
//   take(Infinity)
// ))

const map = curry(pipe(L.map, take(Infinity)))
```

# 2. filter
```typescript
const basicFilter = curry((f, iter) => {
	let res = []
  for(const a of iter) if (f(a)) res.push(a)
	return res
})

L.filter = curry(function *(f, iter) {
	for(const a of iter) if(f(a)) yield a;
})

const filter = curry(pipe(L.filter), take(Infinity))
```
