const products = [
  {name: 'Keychron', price: 120000, quantity: 12, is_selected: true},
  {name: 'KN01C', price: 130000, quantity: 10, is_selected: false},
  {name: '660C', price: 230000, quantity: 3, is_selected: true},
  {name: 'R2', price: 270000, quantity: 0, is_selected: false},
  {name: 'R3 Silent', price: 390000, quantity: 0, is_selected: false},
]

const go = (...args) => reduce((initValue, f) => f(initValue), args);

const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const pipe = (f, ...fList) => (...aList) => go(f(...aList), ...fList);

const filter = curry((f, iterable) => {
  let result = [];
  for (const a of iterable) {
    if(f(a)) result.push(a)
  }
  return result
})

const map = curry((f, iterator) => {
  let result = [];
  for(const item of iterator) {
    result.push(f(item));
  }
  return result
})

const reduce = curry((f, acc, iterator) => {
  if(!iterator) {
    iterator = acc[Symbol.iterator]()
    acc = iterator.next().value
  }
  for (const a of iterator) {
    acc = f(acc, a)
  }
  return acc
})


// const total_quantity = products => go(products,
//     map(p => p.quantity),
//     reduce((a, b) => a + b)
//   )

// 1차 추상화
// const total_quantity = pipe(
//   map(p => p.quantity),
//   reduce((a, b) => a + b)
// )
//
// const total_price = pipe(
//   map(p => p.price * p.quantity),
//   reduce((a, b) => a + b)
// )

const add = (a, b) => a + b

// 2차 추상화
// const total_quantity = pipe(
//   map(p => p.quantity),
//   reduce(add)
// )
//
// const total_price = pipe(
//   map(p => p.price * p.quantity),
//   reduce(add)
// )

// 3차 추상화
// const sum = (f, iter) => go(
//   iter,
//   map(f),
//   reduce(add)
// )

// const total_quantity = products => sum(p => p.quantity, products);
// const total_price = products => sum(p => p.price * p.quantity, products);

// 4차 추상화
// > 여기서 sum 은 추상화 레벨이 높아 다양한 곳에서 사용할 수 있음
const sum = curry((f, iter) => go(
  iter,
  map(f),
  reduce(add)
))

const total_quantity = sum(p => p.quantity)
const total_price = sum(p => p.price * p.quantity)

console.log(total_quantity(products))
console.log(total_price(products))

// sum 을 다른 곳에서 사용한다고 하면
console.log(sum(user => user.age, [
  {age: 30},
  {age: 20},
  {age: 10}
]))

document.querySelector('#cart').innerHTML = `
  <table>
    <tr>
      <th></th>
      <th>상품 이름</th>
      <th>가격</th>
      <th>수량</th>
      <th>총 가격</th>
    </tr>
    ${go(products,
    //   map(p => `
    //     <tr>
    //       <td>${p.name}</td>
    //       <td>${p.price}</td>
    //       <td><input type="number" value="${p.quantity}"/></td>
    //       <td>${p.price * p.quantity}</td>
    //     </tr>
    //   `),
    //   reduce(add)
    // )}
  
    // sum 을 활용한 추상화 (map 부터 reduce 까지)
    sum(p => `
      <tr>
        <th><input type="checkbox" ${p.is_selected ? 'checked' : ''}/></th>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td><input type="number" value="${p.quantity}"/></td>
        <td>${p.price * p.quantity}</td>
      </tr>
    `))}
  
    <tr>
      <td colspan="2">합계</td>
      <td>${total_quantity(filter(p => p.is_selected, products))}</td>
      <td>${total_price(filter(p => p.is_selected, products))}</td>
    </tr>
  </table>
`