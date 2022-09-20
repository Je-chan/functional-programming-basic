# 1. filter
```typescript
const products = [
  {name: 'Keychron', price: 120000},
  {name: 'KN01C', price: 130000},
  {name: '660C', price: 230000},
  {name: 'R2', price: 270000},
  {name: 'R3 Silent', price: 390000},
]

const filter = (f, iterable) => {
  let result = [];

  for (const a of iterable) {
    if(f(a)) result.push(a)
  }
  
  return result
}

console.log(product, product.price < 200000, products) 
// [ { name: 'Keychron', price: 120000 }, { name: 'KN01C', price: 130000 } ]
```
- 내부에 있는 값의 다형성은 보조 함수(첫 번째 인자인 함수)를 통해 만들 수 있고
- 외부에서는 이터러블 프로토콜을 따르면서 다양한 것을 만들어낼 수 있다

```typescript
// 위에서 만든 filter 함수를 가져 오면
console.log(filter(n => n % 2, function *() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
} ()))
```