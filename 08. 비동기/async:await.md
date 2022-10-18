# 1. async await 기초
- 비동기적으로 일어나는 일들을 동기적인 문장으로 다룰 수 있도록 하기 위함

```typescript
function delayIdentity(a) {
	return new Promise(resolve => setTimeout(() => resolve(a), 500))
}

async function f1() {
	// await 는 Promise 가 끝나기 전까지 함수가 멈추고, Promise 내부의 값이 할당 된다
	const a = await delayIdentity(10);
	console.log(a) // 10
	const b = delayIdentity(100)
	console.log(b) // Promise { <pending> }
}
```
- async, await 의 코드만을 보면 Promise 없이 동기적으로 동작하는 것처럼 보인다
- 하지만, await 는 Promise 를 리턴해야 동작한다

```typescript
function delay(time) {
	return new Promise(resolve => setTimeout(() => resolve(), time))
}

async function delayIdentity2(a) {
	await delay(500)
  return a
}

async function f2() {
	const a = await delayIdentity2(10)
	const b = await delayIdentity2(5)
  
  console.log(a + b) 
}
```
- delayIdentity 에 Promise 는 사라졌지만 어딘가에서는 분명 Promise 가 존재한다
- Promise 를 리턴하기로 준비된 라이브러리를 사용만 할 때는 async:await 만으로 커버가 가능
- 하지만, 내가 직접 Promise 다뤄서 리턴하거나, Promise 를 값으로 다루면서 평가 시점을 잡고자 할 때는 직접적으로 다룰 줄 알아야 한다

```typescript
async function f3() {
	const a = await delayIdentity(10)
	const b = await delayIdentity(5)
  
  return a + b
}

console.log(f3()) // Promise { <pending> }

async function f4() {
	const a = 10
  const b = 5
  
  return a + b
}

console.log(f4()) // Promise { <resolved>: 15 }
```
- async 함수를 사용하면 Promise 를 반드시 리턴한다
- 즉, async 함수 내에서 모든 로직을 처리하고 끝낸다면(리턴 값을 활용하지 않는다면) 이 문장 안에서는 동기적으로 처리할 수 있지만
- 문제는 이 함수가 결과값을 리턴하세 다른 곳에 이어 받아서 코드를 활용하고자 한다면 Promise 가 되므로 
  - .then() 이나
  - goP 등의 함수를 활용해서 처리를 해야 제대로 값을 활용할 수 있는 것
- await 는 async 가 반환하는 Promise 혹은 Promise 로 평가된 값을 처리하는 것

```typescript
const pa = Promise.resolve(10)

(async () => {
  console.log(pa) // Promise {<resolved>: 10}
})()

(async () => {
	console.log(await pa) // 10
})()
```