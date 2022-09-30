# 1. range
- 숫자 하나를 받고 숫자의 크기 만한 배열을 만들어 내는 함수

```typescript
const range = l => {
  let i = -1
  let res = []
  while(++i < l) {
    res.push(i)
  }
  return res
}

console.log(range(5)) // [0, 1, 2, 3, 4]

const list = range(4);
console.log(list) // [0, 1, 2, 3]
console.log(reduce(add, list)) // 6
```

# 2. L.range
- lange 와 동일한 일을 하지만 느긋한 range

```typescript
const L = {};

L.range = function *(l) {
  let i = -1
  while(++i < l) {
    yield i;
  }
}

const list = L.range(4);
console.log(list) // L.range {<suspended>} // list 값은 이터레이터
console.log(reduce(add, list)) // 6
```

# 3. range 와 L.range 의 차이
- range 는 reduce 에 list 를 전달하기 전에도 range(4) 를 호출해서 즉시 [0, 1, 2, 3] 으로 평가를 받음
- L.range 는 reduce 에 list 가 전달되기 전까지는 L.range(4) 를 호출하지 않음. 평가 자체가 되지도 않고 함수 로직이 작동하지 않음
  - list.next(), 즉 next() 를 호출해 다음 요소로 넘어가야 비로소 평가를 시작함
```typescript
const list = L.range(4);
console.log(list) // L.range{<suspended>}
console.log(list.next()) // {value : 0, done: false}
console.log(list.next()) // {value : 1, done: false}
console.log(list.next()) // {value : 2, done: false}
console.log(list.next()) // {value : 3, done: false}
```
- range 는 실행했을 때 이미 모든 부분이 평가가 되어 값이 매겨지는 것
- L.range 는 어떠한 코드도 평가가 되지 않고 실제로 내부에 있는 값이 필요할 때 비로소 평가가 되는 것
  - 이거는 array 를 만들지 않고 하나씩 값만 꺼내는 것

# 3. range 와 L.range 성능 테스트
```typescript
function test(name, time, f) {
  console.time(name)
  while(time--) f();
  console.timeEnd(name);
}

test('range', 10, () => reduce(add, range(1000000)))  // 492.~~~ ms
test('L.range', 10, () => reduce(add, range(1000000))) // 256.~~~ ms
```