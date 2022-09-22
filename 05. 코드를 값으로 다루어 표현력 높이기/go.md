# 1. go
- 함수형 프로그래밍에서는 코드를 값으로 다룰 수 있기 때문에 평가하는 시점을 원하는 대로 다뤄 코드의 표현력을 높일 수 있다
- "go" 는 함수를 여러 개 받아서 함수를 순차적으로 진행할 수 있는 함수
```typescript
const go = (...args) => reduce((initValue, f) => f(initValue), args);
```
