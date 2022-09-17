# 1. 기존과 달라진 ES6에서의 리스트 순회
- for i++
- for of

```typescript
const numberList = [1, 2, 3];
const string = 'abc'

// 기존
for(let i = 0 ; i < list.length ; i++ ) {
  console.log(list[i]) // 1 2 3
}

for(let i = 0 ; i < string.length ; i++ ) {
  console.log(string[i]) // a b c 
}

// ES6 이후
for (const number of list) {
  console.log(number) // 1 2 3
} 

for (const letter of string) {
  console.log(letter) // a b c
}

```
- 조금 더 간결해지고 선언적으로 바뀌게 됨
- 단순히 간결하게 된 것 이상의 효과가 존재함
 