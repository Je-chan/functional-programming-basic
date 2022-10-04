# 1. queryStr 
- 객체로부터 URL Query String 을 만들어주는 함수
- 어떻게 map, filter, reduce 를 사용하는지 아는 것이 중요

```typescript
const queryStr = pipe(
	obj,
  Object.entries,
  map(([key, value]) => `${key}=${value}`),
  reduce((a, b) => `${a}&${b}`)
)

console.log(queryStr({limit : 10, offset: 10, type: 'notice'})) // limit=10&offset=10&type=notice
```

## join 을 활용한 리팩터링
- 위의 queryStr 을 join 과 지연 평가 함수를 활용한 리팩털
  - 성능이 더욱 좋아지는 방식
- Object.entries 도 지연 평가할 수 있도록 만듦 

```typescript
L.entries = function *(obj) {
	for (const key in obj) yield [key, obj[key]]
}

const queryStr = pipe(
	L.entries,
  L.map(([key, value]) => `${key}=${value}`),
  join('&')
)
```