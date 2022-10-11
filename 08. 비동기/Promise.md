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

## 1-3) 합성 관점에서의 Promise
- Promise 는 비동기 상황에서 함수 합성을 안전하게 하기 위한 도구
- 연속적인 함수 실행을 안전하게 하는 Monad 로 설명할 수 있음
- 함수 합성 표현
  - f(g(x))

### Monad
- 상황에 따라 안전하게 합성할 수 있도록 Monad 라는 개념이 존재
  - 그 구현체 중에 비동기 상황을 안전하게 합성할 수 있게 하는 것이 Promise
- 자바스크립트는 동적 타입 언어고 타입을 중심적으로 사고하면서 프로그래밍하는 언어는 아님
  - Monad, 대수 구조 타입이 잘 묻어나지 않는 경향 존재
  - 자바스크립트에서는 Monad 를 직접적으로 활용하거나 이용하는 객체를 만들어서 코딩하지는 않음
- 하지만 Monad 의 개념을 알고 있으면 안전한 함수 합성에 더 좋은 사고를 가질 수 있음
  - Array 나 Promise 등을 통해 Monad 를 알 수 있고 안전하게 함수 합성을 할 수 있도록 도와줄 수 있음
```typescript
// Box 안에 값이 존재하고 이 값으로 함수 합성을 안전하게 해나가는 것이라고 생각하면 됨
const g = a => a + 1
const f = a => a * a

console.log(f(g(1))) // 4
console.log(f(g())) // NaN

// 만약 빈 값을 전달하거나 이상한 값을 넣으면 잘못된 값으로 평가하며
// 심지어 그 무의미하고 이상한 값을 console.log 함수에 활용하게 됨 
// 즉, 안전한 함수 합성이 불가능하다는 것
```

어떤 값이 들어올지 모르는 상황에서 어떻게 함수 합성을 안전하게 할 수 있는가 생각하는 아이디어가 Monad
- [1] 모나드는 박스를 가지고 있고 박스 안에 연산에 필요한 재료를 가지고 있음. 
- 그리고 함수 합성을 박스가 가지고 있는 메소드(map 등)들을 활용해서 함수를 합성
- g와 f 함수를 합성하고 싶다면 " [1].map(g).map(f) " 로 합성함
```typescript
console.log([1].map(g).map(f)) // [4]
```

하지만 Array 가 꼭 필요한 값은 아니다
- Array 는 개발자가 어떤 효과를 만들거나 값을 다룰 때 사용하는 도구
- 사용자 화면에 노출되는 실제 결론이 아니라는 것
- Array 인 채로 활용하는 것이 아니라 div 태그로 변환하는 등 화면에 실제로 보여줄 수 있도록 하는 것이 효율적인 코드 작성에 도움되는 것
  
```typescript
[1]
  .map(g)
  .map(f)
  .forEach(r => console.log(`가격: ${r}`)) // 가격 : 4 

```

이렇게 함수를 합성했을 때의 장점은?

```typescript
[]
  .map(g)
  .map(f)
  .forEach(r => console.log(`가격: ${r}`)) 
```
- 위와 같이 console 에 아무것도 찍히지 않는다 => 무의미한 값을 처리하지 않는다
- 함수 자체가 실행되지 않는 것
- 박스 안에 효과가 있는지 없는지에 따라서 합성을 효과적으로 하거나 안 하고 있다는 것
- 모나드 형태의 Array map 을 활용해 안전하게 효과를 일으키지 않는 방식으로 일어난다는 것
  - 순수 함수를 통한 합성까지는 사용자에게 필요한 효과는 없는 것
  - 그 후에 실제 사용자에게 필요한 효과를 출력하거나 HTML 을 만들기까지 안전하게 함수를 합성하는 기법
- Array 는 값이 하나든지 없든지 여러개이든지 안전하게 함수를 합성해서 결과를 만들기 위한 성질을 가지고 있음
```typescript
[1, 2, 3]
  .map(g)
  .map(f)
  .forEach(r => console.log(`가격: ${r}`)) // 가격 : 4 \n 가격 : 9 \n 가격 : 16
``` 

### Promise
- 그렇다면 Promise 는 어떤 함수 합성을 하는 값인가?
- Promise 도 Array method 와 비슷한 형태를 띈다.
  - Array 가 map 으로 합성을 한다면
  - Promise 는 then 으로 합성한다
```typescript
Array.of(1)
  .map(g)
  .map(f)
  .forEach(r => console.log(r)) // 4

Promise.resolve(1)
  .then(g)
  .then(f)
  .then(r => console.log(r)) // 4
```

Promise 는 비동기적인 상황을 안전하게 합성하기 위한 도구
- 단, 주의할 점은 인자로 전달되는 것이 무엇이든 안전하게 합성하기 위한 도구는 아니라는 것
- 비동기 상황에서만 국한됨
```typescript
// 인자에 이상한 것이 들어갈 경우
Promise.resolve()
  .then(g)
  .then(f)
  .then(r => console.log(r)) // NaN

// 비동기 상황일 경우
new Promise(resolve => setTimeout(() => resolve(2), 1000))
  .then(g)
  .then(f)
  .then(r => console.log(r)) // 9
```

## 1-3) Kleisli Composition 관점에서의 Promise
- 오류가 있을 수 있는 상황에서 안전하게 함수를 합성할 수 있는 규칙
  - 수학적인 Programming 에서는 정확한 상수와 변수를 통해 합성을 해 평가를 냄
  - 현대 프로그래밍에서는 State, Side Effect 등 외부 세상에 의존할 수밖에 없다
  - 이런 상황일 때 에러가 발생한다
- 수학적 프로그래밍에서 함수 합성은 항상 같아야 한다
  - f(g(x)) = f(g(x))
- 하지만, g(x) 의 값이 언제 실행되느냐에 따라 값이 달라진다면 오류가 발생할 수 있다 => 즉, 순수한 함수형 프로그래밍이 안 되는 것
  - 그런 상황에서도 특정 규칙을 만들어 합성을 안전하게 하고 좀 더 수학적으로 바라보도록 만드는 것이 Kleisli 합성
  - 만약 g(x) 에 에러가 났다고 하면 
  - f(g(x)) = g(x)
  - 로 만드는 것

```typescript
// user 라는 State
const users = [
	{id: 1, name: 'aa'},
	{id: 2, name: 'bb'},
	{id: 3, name: 'cc'},
]

const find = curry((f, iter) => go (
	iter,
	L.filter(f),
	take(1),
	([a]) => a
))

const getUserById = id => find(u => u.id === id, users);

const f = ({name}) => name;
const g = getUserById
const fg = (id) => f(g(id));

console.log(fg(2)); // bb
console.log(fg(2) === fg(2)) // true
```

하지만 실세계에서는 users 라는 state 가 항상 동일하다고 볼 수 없다
```typescript
const r = fg(2)
console.log(r) 

users.pop()
users.pop()

// 에러 발생해서 코드를 볼 수 없음
const r2 = fg(2);
console.log(r2)
```
- f 라는 함수는 객체에 항상 name 이 있어야만 정상적으로 동작하는 코드
- g 라는 함수는 find 의 결과가 있을 때 정상적으로 동작하는 코드
- 이런 상황에서 에러가 나지 않도록 하는 것이 Kleisli Composition

```typescript
// g 함수가 에러 나지 않도록 만들기 위해 reject 를 사용
const getUserById = id =>
  find(user => user.id === id, users) || Promise.reject('No one')

const f = ({name}) => name
const g = getUserById
const fg = id => Promise.resolve(id).then(g).then(f).catch(a => a)

fg(2).then(console.log) // bb
g(2) // {id: 2, name: 'bb'}
users.pop()
g(2) // Promise {<rejected>: "No one"}

fg(2).then(console.log) // "No one" 
f(g(2)) // undefined => 이렇게 엉뚱하고 의미없는 결과를 사용하지 않는다

```