# 1. reduce
```typescript
const nums = [1, 2, 3, 4, 5];

const reduce = (f, acc, iterator) => {
  if(!iterator) {
    iterator = acc[Symbol.iterator]()
    acc = iterator.next().value
  }
  for (const a of iterator) {
    acc = f(acc, a)
  }
  return acc
}

const add = (a, b) => a + b

console.log(reduce(add, 0, nums)) // 15
console.log(reduce(add, nums)) // 15
```