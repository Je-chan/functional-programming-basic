# 1. 중첩 사용
```typescript
const products = [
  {name: 'Keychron', price: 120000},
  {name: 'KN01C', price: 130000},
  {name: '660C', price: 230000},
  {name: 'R2', price: 270000},
  {name: 'R3 Silent', price: 390000},
]

const add = (a, b) => a + b

// price 만 뽑아내고자 하면 map 사용
map(p => p.price, products)

// 200000 원 이상의 상품들만 뽑아 price 만 가져오고 싶다면 filter, map 사용
map(p => p.price, filter(p => p.price >= 200000, products))

// 200000 원 이상의 상품들만 뽑아 price 를 가져오고, 그 합을 구하고 싶다면 filter, map, reduce 사용
reduce(add, map(p => p.price, filter(p => p.price >= 200000, products)))

// 다른 방식으로 price 를 모두 뽑은 다음 200000 원 이상인 것들만 걸러내 합을 구하고 싶은 경우 map, filter, reduce 사용
reduce(add, filter(n => n >= 200000, map(p => p.price, products)))
```

