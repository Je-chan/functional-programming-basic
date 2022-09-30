# 1. take
- iterable 에서 첫 번째 인자로 받은 개수까지만 잘라내는 함수
- iterable 프로토콜을 따르고 있고 next() 로 값을 꺼내서 Push
- range 처럼 그냥 만들어진 함수라면 그렇게 필요할까 의심은 들지만
- L.range 처럼 지연성이 있는 함수도 사용할 수 있다는 장점
```typescript
const take = (l, iter) => {
  let res = []
  for(const a of iter) {
    res.push(a)
    if(res.length === l) return res
  }
  return res
}

console.log(take(5, range(100))) // [0, 1, 2, 3, 4]
console.log(take(5, L.range(100))) // [0, 1, 2, 3, 4]

// 효율적인 측면에서도 굉장히 좋다
console.log(take(5, range(1000000000))) 
// -> 위의 range 는 1000000000 의 Length 를 가지는 배열을 만들고 나서 5개를 잘라 내지만
console.log(take(5, L.range(1000000000)))
// -> 이건 그냥 다섯 개만 만들어 내기 때문
```

