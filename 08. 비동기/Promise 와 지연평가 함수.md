# 1. Promise 와 지연 평가 함수 
```typescript
go(
	[Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  L.map(a => a + 10),
  take(2),
  console.log // [ '[object Promise]10', '[object Promise]10' ]
) 
```  
- 기존의 지연 평가 함수로는 비동기를 처리할 수 없다
- 지연 평가 함수에 변형을 줘야 한다

```typescript
L.map = curry(function* (f, iter) {
	iter = iter[Symbol.iterator]();
	for (const a of iter) {
		yield goP(a, f);
	}
});


go(
	[Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
	L.map(a => a + 10),
	take(2),
	console.log // [ Promise { <pending> }, Promise { <pending> } ]
)
```
- 여기서는 take 에 문제

```typescript
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();

  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (a instanceof Promise) {
        return a.then((a) => ((res.push(a), res).length === l ? res : recur()));
      }
      res.push(a);
      if (res.length === l) return res;
    }
    return res;
  })();
});

go(
	[Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
	L.map(a => a + 10),
	take(2),
	console.log // [ 11, 12 ]
)

go(
	[2, 3, 4],
	L.map((a) => Promise.resolve(a + 10)),
	take(2),
	console.log // [12, 13]
);

```
- 이렇게 되면 map 도 L.map 으로 만든 로직을 반영할 경우 아래의 코드들은 모두 값을 반환하게 된다

```typescript
const map = curry(pipe(L.map, takeAll));

go(
	[1, 2, 3],
	map((a) => Promise.resolve(a + 10)),
  console.log
)

go(
	[Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
	map((a) => a + 10),
	console.log
)

go(
	[Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
	map((a) => Promise.resolve(a + 10)),
	console.log
)
```
