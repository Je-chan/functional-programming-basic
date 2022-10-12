# 1. 비동기 제어 방법
- go, pipe 로 합성하는 함수 중에 비동기가 있으면 어떻게 처리해야 하나
```typescript
	go(
    1,
    (a) => a + 10,
    (a) => Promise.resolve(a + 100),
    (a) => a + 1000,
    (a) => a + 10000,
    console.log
  )  // [object Promise]100010000
```

## 1-1) 비동기를 처리하기 위한 아이디어
```typescript
const go = (...args) => reduce((a, f) => f(a), args)
```
- go 함수는 reduce 를 사용하고 즉시 평가 되는 함수를 사용
- 이 함수들이 실행되는 모든 제어권을 reduce 가 가지고 있음
- 즉, reduce 만 잘 고쳐주면 문제를 해결할 수 있게 됨
- pipe 도 go 함수를 사용하고 있기에 go 에 포함된 reduce 를 수정하면 됨

## 1-2) reduce 수정
```typescript
const reduce = curry((f, acc, iter) => {
	if(!iter) {
		iter = acc[Symbol.iterator]()
    acc = iter.next().value
  } else {
		iter = iter[Symbol.iterator]()
  }
	
	let cur
  while(!(cur = iter.next()).done) {
		const a = cur.value
    acc = f(acc, a)
  }
	
	return acc
})
```
- 위의 reduce 중 acc 가 어느 시점에서는 Promise 가 되는 것
  - 그 Promise 를 첫 번째 인자로 받아서 함수를 실행
- 즉, Promise 를 첫 번째 인자로 받는 함수가 pending 이 끝난 값을 받아서 동작하도록 만들면 됨

간단하게 만들면 이렇게 작성할 수 있다
```typescript
const reduce = curry((f, acc, iter) => {
	if(!iter) {
		iter = acc[Symbol.iterator]()
    acc = iter.next().value
  } else {
		iter = iter[Symbol.iterator]()
  }
	
	let cur
  while(!(cur = iter.next()).done) {
		const a = cur.value
    /* 아래 코드가 변형된 것 */
    acc = acc instanceof Promise 
      ? acc.then(acc => f(acc, a))
      : f(acc, a)
  }
	
	return acc
})
```
- 문제점은 합성되는 함수는 동기적으로 하나의 콜스택에서 실행되지 못함
- 함수 합성이 많아지면 불필요한 로드가 생겨서 성능 저하 발생
- 중간에 Promise 를 만나도 Promise 가 아닐 때는 동기적으로 while 문을 통해 넘어가도록 구성하는 것이 좋음 

이런 경우는 재귀를 활용
```typescript
const reduce = curry((f, acc, iter) => {
	if(!iter) {
		iter = acc[Symbol.iterator]()
    acc = iter.next().value
  } else {
		iter = iter[Symbol.iterator]()
  }
	
	return function recur(acc) {
		let cur
    
    while(!(cur = iter.next()).done) {
			const a = cur.value;
			acc = f(acc, a)
      if(acc instanceof Promise) return acc.then(recur)
    }
		
		return acc
  } (acc)
})
```
- 하지만 위 코드의 문제는 맨 처음 인자가 비동기로 받은 값인 경우, 가장 첫 acc 가 pending 인채로 넘어가게 된다

이런 경우 Promise 를 기다려주는 함수 하나 만들어서 reduce 에 적용하면 된다
```typescript
const goP = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const reduce = curry((f, acc, iter) => {
	if(!iter) {
		iter = acc[Symbol.iterator]()
    acc = iter.next().value
  } else {
		iter = iter[Symbol.iterator]()
  }
	
	return goP(acc, function recur(acc) {
		let cur
    
    while(!(cur = iter.next()).done) {
			const a = cur.value;
			acc = f(acc, a)
      if(acc instanceof Promise) return acc.then(recur)
    }
		
		return acc
  })
})

go(
	Promise.resolve(1),
	(a) => a + 10,
	(a) => Promise.resolve(a + 100),
	(a) => a + 1000,
	(a) => a + 10000,
	console.log
);
```
- 하지만, Promise 가 reject 를 발생시키는 경우라면?
- go 라는 함수 끝에 .reject()를 붙여 줄 것

```typescript
go(
  Promise.resolve(1),
  (a) => a + 10,
  (a) => Promise.reject("ERRORRRRR"),
  (a) => a + 1000,
  (a) => a + 10000,
  console.log
).catch(error => console.log(error));

```
