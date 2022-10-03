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

- 