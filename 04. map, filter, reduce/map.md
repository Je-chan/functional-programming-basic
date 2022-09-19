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