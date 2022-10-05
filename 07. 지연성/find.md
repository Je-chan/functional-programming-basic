# 1. find
- 함수형 프로그래밍의 함수는 계열을 지닌다
  - 예를 들어, join 은 reduce 로 인해 만들어지는 reduce 계열
  - 지금 만들 find 는 take 계열 (find 의 쓰임은 Array prototype 과 동일)

```typescript
const users = [
	{ age: 32 },
	{ age: 31 },
	{ age: 25 },
	{ age: 28 },
	{ age: 13 },
	{ age: 45 },
	{ age: 51 },
]

// 아래의 find 의 아쉬운 점은, 하나의 결과만을 뽑지만 모든 배열의 요소를 다 꺼내본다는 것
// const find = (f, iter) => go(
// 	iter,
//   filter(f),
//   take(1),
// 	([a]) => a
// )

// 아래의 find 는 하나 찾자마자 끝
// 그리고 아래의 코드를 읽으면 직관적으로, iterable 을 받고 f 로 filtering 을 하고 하나만을 take 해서 구조분해한다
// > 직관적으로 이해할 수 있음
const find = curry((f, iter) => go (
	iter,
  L.filter(f),
  take(1),
	([a]) => a
))
 
console.log(find(user => user.age < 30, users))

```