# 1. Promise
## 1-1) Callback 과 Promise 의 큰 차이
- Promise 와 callback 의 가장 중요한 차이는 비동기 상황을 일급으로 처리한다는 것
- Promise 라는 클래스를 통해서 만들어진 인스턴스를 반환
  - 대기와 성공과 실패를 다루는 일급 값으로 이루어짐
  - 일을 끝내는 것들을 코드와 컨텍스트로만 다뤄지는 것이 아니라 "대기" 상태의 값을 만든다는 점에서 Callback 과 큰 차이가 있음
  - 이 점이 굉장히 중요
- Callback 과 응용하는 점이 다름
- 비동기 상황에 대한 값을 만들어서 Return 하고 있다는 점이 굉장히 중요한 차이

```typescript
const asyncCallback = add10(5, (res) => {
  add10(res, (res) => {
    add10(res, (res) => {
      console.log(res);
    });
  });
});

console.log(asyncCallback) // undefined

const asyncPromise = add20(5).then(add20).then(add20).then(add20).then(console.log);

console.log(asyncPromise) // Promise { <pending> }
```
### Callback
- return 값은 중요하지 않음
- 비동기로 동작하는 코드적인 상황과 끝났을 때 다시 어떤 함수를 실행해주고 있다는 Context 만 남아 있는 것
- asyncCallback 에 add10 을 할당할 때, 결과가 바로 평가되고 이 결과가 끝남

### Promise
- 코드를 평가했을 때 즉시 Promise 를 리턴
- 내가 원하는 일들을 다룰 수 있다는 점이 중요
- asyncPromise 는 Promise 의 결과를 반환 받아서 내가 하고 싶은 일을 할 수 있게 된다는 장점
- then 을 통해서 원하는 일들을 해나갈 수 있게 된다는 것
- 비동기로 일어난 상황에 대해서 값으로 다룰 수 있고 그게 일급이라는 것을 의미
- 어떤 변수에 할당할 수 있고 전달될 수 있고 일들을 진행할 수 있다는 것

## 1-2) 값으로서의 Promise
```typescript
// go1 함수가 잘 동작하기 위해서는 f 라는 함수가 동기적으로 작동해야 하고, a 값도 동기적으로 확인할 수 있는 값이어야 한다는 것
const go1 = (a, f) => f(a);
const add5 = (a) => a + 5;

const delay100 = (a) =>
	new Promise((resolve) => setTimeout(() => resolve(a), 100));


console.log(go1(10, add5)); // 15
console.log(go1(delay100(10), add5)); //[object Promise]5 => 정상 동작이 되지 않음

// 그렇다면 비동기 처리를 할 수 있도록 하는 go1 을 만들면
const goP = (a, f) => (a instanceof Promise ? a.then(f) : f(a));

console.log(goP(delay100(10), add5)); // Promise { <pending> }

// 이렇게 되면 아래의 코드는 동일한 모습을 취하게 된다
const r = goP(10, add5) 
const rPromsie = goP(delay100(10), add5)

console.log(r) // 15
console.log(rPromise.then(console.log)) // 15

// 위의 r 과 rPromise 를 동일하게 적용할 수 있는 방법이 있다
const n1 = 10;
const n2 = delay100(10)
goP(goP(n1, add5), console.log) // 15
goP(goP(n2, add5), console.log) // 15 

// 하지만 위의 코드를 console.log 찍으면 
console.log('out_console', goP(goP(n1, add5), console.log)) // 15 \n out_console undefined
console.log('out_console', goP(goP(n2, add5), console.log)) // out_console Promise { <pending> } \n 15
```
- 어떤 일을 한 결과의 상황을 일급 값으로 만들어서 지속적으로 이어나갈 수 있게 하는 것이 Promise 의 중요한 특징
