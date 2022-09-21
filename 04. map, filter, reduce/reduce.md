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

- 복잡한 형태의 데이터를 축약할 때에도 어려움이 없음

```typescript
const products = [
  {name: 'Keychron', price: 120000},
  {name: 'KN01C', price: 130000},
  {name: '660C', price: 230000},
  {name: 'R2', price: 270000},
  {name: 'R3 Silent', price: 390000},
]

console.log(reduce(((total_price, product) => total_price + product.price), 0, products))
```