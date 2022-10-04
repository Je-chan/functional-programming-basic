# 1. join
- array 의 프로토타입으로 존재하는 join 과 기능은 유사
- array 에 종속된 것이 아니라 모든 Iterator 에 작동하는 join

```typescript
const join = curry((sep = ',', iter) => {
	reduce((a, b) => `${a}${sep}${b}`, iter)
})
```
- 덕분에 지연 평가 함수들과 함께 사용될 수 있음
  - take, reduce 와 같이 배열 안에 있는 요소를 꺼내서 활용
  - 배열에 있는 것을 꺼낼 때 지연 평가 함수가 평가를 시작하는 것