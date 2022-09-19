# 1. map
```typescript
const products = [
  {name: 'Keychron', price: 120000},
  {name: 'KN01C', price: 130000},
  {name: '660C', price: 230000},
  {name: 'R2', price: 270000},
  {name: 'R3 Silent', price: 390000},
]

const map = (f, iterator) => {
  let result = [];
  
  for(const item of iterator) {
    result.push(f(item));
  }
  
  return result
}

console.log(map(product => product.name, products)) // [ 'Keychron', 'KN01C', '660C', 'R2', 'R3 Silent' ]
console.log(map(product => product.price, products)) // [ 120000, 130000, 230000, 270000, 390000 ] 

```

# 2. map 의 다형성
- map 은 이터러블 프로토콜을 따르고 있어 다형성을 지닌다
```typescript
// NodeList 에는 이터러블 프로토콜을 하고 있지만 map 메소드를 prototype 안에 가지고 있지 않다
console.log(document.querySelector('*').map(node => node.nodeName)) // Error

// 하지만 위에서 구현한 map 을 사용하면 원하는 대로 데이터를 얻을 수 있다
console.log(map(node => node.nodeName), document.querySelectorAll('*')) // ["HTML", ... ]

// 제너레이터로 만든 이터레이터도 돌릴 수 있다
function *gen() {
  yield 2;
  yield 3;
  yield 4;
}

console.log(map(a => a * a, gen())) // [4, 9, 16]
```