# 1. 비동기 처리
- 비동기를 처리하는 가장 기본적인 방법은 Callback 함수
- ES6 이후로는 Promise, async-await 문법이 추가로 만들어졌다
```typescript
// callback function
function add10(a, callback) {
	setTimeout(() => callback(a + 10), 100)
}

add10(5, res => {
	console.log(res) // 15
})

add10(5, (res) => {
	add10(res, (res) => {
		add10(res, (res) => {
			console.log(res); // 35
		});
	});
});


// Promise
function add20(a) {
	return new Promise((resolve) => setTimeout(() => resolve(a + 20), 100));
}

add20(5).then(console.log); // 25

// 합성을 연속적으로 타이핑 하기도 좋고, 눈에도 직관적으로 보임
add20(5)
  .then(add20)
  .then(add20)
  .then(add20)
  .then(console.log) // 85;
``` 