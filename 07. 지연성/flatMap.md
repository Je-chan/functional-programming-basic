# 1. flatMap
- flatMap 은 map 을 한 값에 flatten 을 한 것
- flatMap 이 있는 이유는 map 과 flatten 이 비효율적으로 동작하기 때문
  - 첫 번째 map 을 할 때, 모든 값을 순회하면서 새로운 배열을 한 번 만듦
  - 그 다음에 전체를 순회하면서 flat 을 하기에 비효율이 발생
  - 그래서 flatMap 한 번에 모든 것을 동작하도록 만든 것
- 문제는, flatMap 과 map-flatten 두 개의 방식이 시간 복잡도 면에서 다르지 않다는 것
- flatMap 을 조금 더 효율적으로 동작하고, iterable 을 모두 다룰 수 있는 형식으로 만들 것
  - 하지만, 이미 언급했듯, map 과 flatten 만 있으면 만들 수 있으므로 아래와 같이 간단하게 표현이 가능하다

```typescript
L.flatMap = pipe(L.map, L.flatten)

const flatMap = curry(pipe(L.map, L.flatten, take(Infinity)))
```