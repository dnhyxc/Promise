// Promise简单实例
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  })
}

timeout(100).then((value) => {
  console.log(value); // done
})


let promise = new Promise(function (resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function () {
  console.log('resolved');
});

console.log('hi');
// Promise
// hi
// resolved


// Promise 异步加载图片
function loadImageAsync(url) {
  return new Promise(function (resolve, reject) {
    const image = new Image();

    image.onload = function () {
      resolve(image);
    };

    image.onerror = function () {
      reject(new Error('Could not load iamge at' + url));
    };

    image.src = url;
  });
}


//使用Promise对象实现Ajax操作。
const getJSON = function (url) {
  const promise = new Promise(function (resolve, reject) {
    const handler = function () {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open('GET', url);
    client.onreadystatechange = handler;
    client.responseType = 'json';
    client.setRequestHeader('Accept', 'application/json');
    client.send();
  })
  return promise;
}
// getJSON('/posts.json').then(function (json) {
//   console.log('Contents: ' + json);
// }, function (error) {
//   console.log('出错了', + error);
// })


// resolve方法的参数是另一个Promise的实例
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve(p1);
    console.log('p2执行');
  }, 1000)
})

p2
  .then(res => console.log(res))
  .catch(err => console.log(err))
// p2执行
// Error: fail


// 调用resolve或reject并不会终结Promise的参数函数的执行。
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
