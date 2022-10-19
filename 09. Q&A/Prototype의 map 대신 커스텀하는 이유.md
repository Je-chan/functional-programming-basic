# 1. Array 의 내장 메소드를 사용하지 않는 이유?
### map 내에서 비동기 작업을 할 수 없다 (비동기 제어 불가)
- 
```typescript
async function delayI(a) {
	return new Promise(resolve => setTimeout(() => resolve(a), 100))
}

async function f1() {
	const list = [1, 2, 3, 4]
  const temp = list.map(async a => await delayI(a * a))
  console.log(temp) // [Promise, Promise, Promise, Promise]
  
  const res = await temp
  console.log(res) // [Promise, Promise, Promise, Promise]
}

f1()
```
- 우리가 만든 map 을 활용하면 결과값이 잘 나온다
```typescript
async function f2() {
	const list = [1, 2, 3, 4]
  const temp = map(a => delayI(a * a), list)
  console.log(temp) // Promise {<pending>}
  
  const res = await temp
  console.log(res) // [1, 4, 9, 16]
}

f2() 
```
### async:await 에 대한 오해로 빚어지는 실수
```typescript
async function f3() {
	const list = [1, 2, 3, 4]
  const res = await map(a => delayI(a * a), list)
  console.log(res) // [1, 4, 9, 16]
  
  return res
}

console.log(f3()) // Promise {<pending>} 

f3().then(console.log) // [1, 4, 9, 16]
  
(async () => {
  console.log(await f4()) // [1, 4, 9, 16]
})()
```