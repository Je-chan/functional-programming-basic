# 1. 순회하는 방법
## 1-1) 예시
```typescript
/* Array */
const arr = [1, 2, 3]
for (const a of arr) console.log(a); // 1 2 3

const set = new Set([1, 2, 3])
for (const b of set) console.log(b) // 1 2 3

const map = new Map([['x', 1], ['y', 2], ['z', 3]])
for (const c of map) console.log(c) // ['x', 1], ['y', 2], ['z', 3]

```

## 1-2) 순회하는 방법의 차이
- Array 의 경우 순회할 때 가장 좋은 방법으로 인덱스 조회가 있다
- 하지만 Set 과 Map 은 인덱스로 조회할 수 없다. set[1], map[1] 등이 안 되는 것
- 즉, for ... of 구문은 단순히 인덱스 값을 조회해서 동작하는 것이 아니다

## 1-3) Symbol.iterator

```typescript 
const arr = []
const set = new Set()
const map = new Map()

console.log(arr[Symbol.iterator]) // ƒ values()
console.log(set[Symbol.iterator]) // f values()
console.log(map[Symbol.iterator]) // f values()

arr[Symbol.iterator] = null
for(const a of arr) console.log(a) // TypeError: arr is not iterable
```

- 각각의 array, set, map 자료형은 Symbol.iterator 라고 하는 프로토콜을 지니고 있다
- 이 프로토콜 값을 null 로 주면 순회할 수 없다

# 2. 이터러블/이터레이터 프로토콜
## 이터러블
- 이터레이터를 리턴하는 [Symbol.iterator]() 를 가진 값
- Array, Set, Map 은 이터러블 
- 그래서 위에서 Symbol.iterator 값을 Null 로 줬을 때의 타입 에러가 arr is not iterable 인 것

## 이터레이터
- { value, done } 객체를 리턴하는 next() 를 가진 값
```typescript
const arr = [1, 2, 3]
let iteraotr = arr[Symbol.iterator]()
console.log(iterator) // Object [Array Iterator] {__proto__: { next: ƒ next() }}

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: undefined, done: true }

```

## 이터러블/이터레이터 프로토콜
- 이터러블을 for...of 나 전개 연사자 등과 함께 등작하도록 규약
- 프로토콜을 이용해서 순회를 할 수 있게 되는 것
- for...of 는 이터레이터를 만들고 next() 를 활용
- 이후 next() 한 객체의 done 값이 true 가 되면 순회 구문에서 빠져나오도록 돼 있다

```typescript
const arr = [1, 2, 3]
let iterator = arr[Symbol.iterator]()
iterator.next();

for (const a of iterator) console.log(a) // 2 3

const set = new Set([1, 2, 3])
let iteratorSet = set[Symbol.iterator]()

for(const b of iteratorSet) console.lob(b) // 1 2 3

const map = new Map([['x', 1], ['y', 2], ['z', 3]])
let iteratorMap = map[Symbol.iterator]();

for (const c of iteratorMap) console.log(c) // ['x', 1], ['y', 2], ['z', 3]
```

### Map 의 iterator 반환 메소드
- Map 의 keys(), values(), entries() 는 iterator 를 반환한다

```typescript
const map = new Map([['x', 1], ['y', 2], ['z', 3]])

for (const a of map.keys()) console.log(a) // 'x' 'y' 'z'
for (const a of map.values()) console.log(a) // 1 2 3
for (const a of map.entries()) console.log(a) // ['x', 1], ['y', 2], ['z', 3]

const iteratorKey = map.keys()[Symbol.iterator]() // Object [Map Iterator] {__proto__: { next: ƒ next() }}

```



