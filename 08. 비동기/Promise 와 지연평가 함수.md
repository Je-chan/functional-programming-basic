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
				return a
					.then((a) => ((res.push(a), res).length == l ? res : recur()))
					.catch((e) => (e == noP ? recur() : Promise.reject(e)));
			}
			res.push(a);
			if (res.length == l) return res;
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

# 2. Kleisli Composition 활용
- filter 에서 지연 평가와 비동기 동시성(Promise)을 함께 지원하려면 Kleisli Composition 을 활용해야 한다

```typescript
go(
	[1, 2, 3, 4, 5, 6],
  L.map(a => Promise.resolve(a * a)),
  L.filter(a => a % 2),
  take(2),
  console.log // [] => 정상적으로 동작하지 않는 상황
)
```

- filter 로 넘어오는 값이 Promise 기 때문에 [] 을 반환하는 것
- filter 메소드가 Promise 를 다룰 수 있도록 수정해야 함

```typescript
const noP = Symbol("noP");

L.filter = curry(function* (f, iter) {
	for (const a of iter) {
		const b = goP(a, f);
		// filter 를 통해서 yield 를 전달할 때, 다음 함수에 인자가 전달되서는 안 됨.
		// > 이를 하기 위해서 Kleisli Composition 을 활용.
		//> noP 이라는 구분자를 활용해서 아무 일도 하지 않도록 설정 (take 함수에서) => 즉, then 체이닝에서 catch 로 넘어감
		if (b instanceof Promise)
			yield b.then((b) => (b ? a : Promise.reject(noP)));
		else if (b) yield a;
	}
});

go(
	[1, 2, 3, 4, 5, 6],
	L.map((a) => Promise.resolve(a * a)),
	L.filter((a) => {
		console.log(a); // 1 \n 4 \n 9
		return a % 2;
	}),
	// 4는 filter 에서 reject 되고 다음 함수 인자로 넘어가지 않음
	L.map((a) => {
		console.log(a) // 1 \n 9
		1
		return a * a;
	}),
	take(2),
	console.log // [1, 81]
);
```
- noP 이라는 구분자를 사용

# 3. reduce 와 noP
```typescript
go(
  [1, 2, 3, 4, 5, 6],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => Promise.resolve(a % 2)),
  reduce(add),
  console.log // 1[object Promise][object Promise][object Promise][object Promise][object Promise]
);
```
- 방금 전에 만든 noP 은 Reduce 에서 제대로 값을 활용할 수 없는 상태

```typescript
// 함수로 추상화해서 선언적인 코드 작성
const reduceP = (acc, a, f) =>
	a instanceof Promise
		? a.then(
			(a) => f(acc, a),
			(e) => (e === noP ? acc : Promise.reject(e))
		)
		: f(acc, a);

const head = (iter) => goP(take(1, iter), ([h]) => h);

const reduce = curry((f, acc, iter) => {
	if (!iter) return reduce(f, head((iter = acc[Symbol.iterator]())), iter);

	iter = iter[Symbol.iterator]();
	return goP(acc, function recur(acc) {
		let cur;
		while (!(cur = iter.next()).done) {
			acc = reduceP(acc, cur.value, f);
			if (acc instanceof Promise) return acc.then(recur);
		}
		return acc;
	});
});

go(
	[1, 2, 3, 4, 5, 6],
	L.map((a) => Promise.resolve(a * a)),
	L.filter((a) => Promise.resolve(a % 2)),
	reduce(add),
	console.log // 35
);
```