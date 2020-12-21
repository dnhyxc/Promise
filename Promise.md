## Promise

---

### Promise 的含义

1，Promise 是异步编程的一种解决方案，比传统的解决方案（回调函数和事件）更合理、更强大。

2，所谓的 Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的信息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

### Promise 对象的特点

1，对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：`pending（进行中）`、`fulfilled 或 resolved（已成功）`、`rejected（已失败）`。只有异步操作的结果，可以决定当前是哪一种状态，任何其它操作都无法改变这个状态。这也是 Promise 这个名字的由来，它的英语意思就是“承诺”，表示其它手段无法改变。

2，一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled（resolved） 和从 pending 变为 rejected。只要这两种情况发生，状态就凝固了，也就不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你在对 Promise 对象添加回调函数，也会立即得到这个结果。这与`事件（Event)`完全不同，事件的特点是：如果你错过了它，再去监听是得不到结果的。

3，有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise 对象提供统一的接口，使得控制异步操作更加容易。

### Promise 的缺点

1，无法取消 Promise，一旦新建它就会立即执行，无法中途取消。

2，如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。

3，当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

> 如果某些事件不断地反复发生，一般来说，使用 Stream 模式是比部署 Promise 更好的选择。

### Promise 基本用法

1，ES6 规定，Promise 对象是一个构造函数，用来生成 Promise 实例。下面代码创建了一个 Promise 实例。

```js
const promise = new Promise(function (resolve, reject) {
  // some code...
  if (/* 异步操作成功 */) {
    resolve(value);
  } else {
    reject(error);
  }
})
```

> Promise 构造函数接收一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。它们是两个函数，由 JS 引擎提供，不用自己部署。

> resolve 函数的作用是：将 Promise 对象的状态从“未完成”变为“成功”（即从 padding 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。

> reject 函数的作用是：将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

2，Promise 实例生成以后，可以用 then 方法分别指定 resolved 状态和 rejected 状态的回调函数。

```js
promise.then(function (value) {
  // success
}, function (error) {
  // failure
})
```

> then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数。

3，Promise 对象的简单例子。

```js
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  })
}

timeout(100).then((value) => {
  console.log(value); // done
})
```

> 上面代码中，timeout 方法返回一个 Promise 实例，表示一段时间以后才会发生的结果。过了指定的事件（ms 参数）以后，Promise 实例的状态变为 resolved，就会触发 then 方法绑定的回调函数。

4，Promise 新建后就会立即执行。

```js
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
```

> 上面代码中，Promise 新建后立即执行，所以首先输出的是 Promise。然后 then 方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 resolved 最后输出。

5，Promise 异步加载图片。

```js
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
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
```

> 上面代码中，使用 Promise 包装了一个图片加载的异步操作。如果加载成功，就调用 resolve 方法，否则就调用 reject 方法。

6，使用 Promise 对象实现 Ajax 操作。

```js
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

getJSON('/posts.json').then(function (json) {
  console.log('Contents: ' + json);
}, function (error) {
  console.log('出错了', + error);
})
```

> 上面代码中，getJSON 是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个 Promise 对象。需要注意的是，在 getJSON 内部，resolve 函数和 reject 函数调用时，都带有参数。

7，如果调用 resolve 函数和 reject 函数时带有参数，那么它们的参数会被传递给回调函数。reject 函数的参数通常时 Error 对象的实例，表示抛出的错误。resolve 函数的参数除了正常的值以外，还可能是另一个 Promise 实例，比如下面这样。

```js
const p1 = new Promise(fucntion (resolve, reject) {
  // ...
})

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```

> 上面代码中，p1 和 p2 都是 Promise 的实例，但是 p2 的 resolve 方法将 p1 作为参数，即一个异步操作的结果是返回另一个异步操作。

> **注意**：这时 p1 的状态就会传递给 p2，也就是说，p1 的状态决定了 p2 的状态。如果 p1 的状态是 pending，那么 p2 的回调函数就会等待 p1 的状态改变。如果 p1 的状态已经是 resolved 或者 rejected，那么 p2 的回调函数将会立刻执行。

> ```js
> const p1 = new Promise(function (resolve, reject) {
>   setTimeout(() => reject(new Error('fail')), 3000)
> })
> 
> const p2 = new Promise(function (resolve, reject) {
>   setTimeout(() => {
>     resolve(p1);
>     console.log('p2执行');
>   }, 1000)
> })
> 
> p2
>   .then(res => console.log(res))
>   .catch(err => console.log(err))
> // p2执行
> // Error: fail
> ```

> 上面代码中，p1 是一个 Promise，3 秒之后变为 rejected。p2 的状态在 1 秒之后改变，resolve 方法返回的是 p1。由于 p2 返回的是另一个 Promise，导致 p2 自己的状态无效了，由 p1 的状态决定 p2 的状态。所以，后面的 then 语句都变成针对后者（p1）。又过了 2 秒，p1 变为 rejected，导致触发 catch 方法指定的回调函数。

8，调用 resolve 或 reject 并不会终结 Promise 的参数函数的执行。

```js
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

> 上面代码中，调用 resolve(1) 之后，后面的 console.log(2) 还是会执行，并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

9，一般来说，调用 resolve 或 reject 以后，Promise 的使命就完成了，后续操作应该放到 then 方法里面，而不应该直接写在 resolve 或 reject 的后面。所以最好在它们前面加上 return 语句，这样就不会有意外。

```js
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})
```

### Promise.prototype.then()

1，Promise 实例具有 then 方法，也就是说，then 方法是定义在原型对象 Promise.prototype 上的。它的作用是为 Promise 实例添加状态改变时的回调函数。then 方法的第一个参数是 resolved 状态的回调函数，第二个参数（可选）是 rejected 状态的回调函数。

2，then 方法返回的是一个新的 Promise 实例（注意：不是原来那个 Promise 实例）。因此可以采用链式写法，即 then 方法后面再调用另一个 then 方法。

```js
getJSON('/post.json').then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
})
```

> 上面的代码使用 then 方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

3，采用链式的 then，可以指定一组按照次序调用的回调函数。这时，前一个回调函数有可能返回的还是一个 Promise 对象（即有异步操作），这时后一个回调函数，就会等待该 Promise 对象的状态发生变化，才会被调用。

```js
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  console.log('resolved: ', comments);
}, function (err) {
  console.log('rejected', err);
});
```

> 上面代码中，第一个 then 方法指定的回调函数，返回的是另一个 Promise 对象。这时，第二个 then 方法指定的回调函数，就会等待这个新的 Promise 对象状态发生变化。如果变为 resolved，就调用第一个回调函数，如果状态变为 rejected，就调用第二个回调函数。

### Promise.prototype.catch()

1，Promise.prototype.catch() 方法是 .then(null, rejection) 或 .then(undefined, rejection) 的别名，用于指定发生错误时的回调函数。

```js
getJSON('/post.json').then(function (post) {
  // ...
}).catch(function (error) {
  // 处理getJSON和前一个回调函数运行时发生的错误
  console.log('发生错误', error);
})
```

> 上面代码中，getJSON() 方法返回一个 Promise 对象，如果该对象状态变为 resolved，则会调用 then() 方法指定的回调函数，如果异步操作抛出错误，状态就会变为 rejected，就会调用 catch() 方法指定的回调函数，处理这个错误。

2，then() 方法指定的回调函数，如果运行中抛出错误，也会被 catch() 方法捕获。

```js
// 例一
p.then((val) => console.log('fulfilled: ', value))
  .catch((err) => console.log('rejected', err));
// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log('rejected: ', err));

// 例二
const promise = new Promise(function (resolve, reject) {
  throw new Error('test');
});
promise.catch(function (error) {
  console.log(error); // Error: test
})
```

> 上面代码中，promise 抛出一个错误，就被 catch() 方法指定的回调函数捕获。注意：上面的写法与下面两种写法是等价的。

```js
// 写法一
const promise = new Promise(function (resolve, reject) {
  try {
    throw new Error('test');
  } catch (e) {
    reject(e);
  }
});
promise.catch(function (error) {
  console.log(error);
})

// 写法二
const promise = new Promise(function (resolve, reject) {
  reject(new Error('test'));
});
promise.catch(function (error) {
  console.log(error);
});
```

> 比较上面两种写法，可以发现 reject() 方法的作用，等同于抛出错误。

3，如果 Promise 状态已经变成 resolved，再抛出错误是无效的。

```js
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise.then(function (value) {
  console.log(value);
}).catch(function (error) {
  console.log(error);
});
// ok
```

> 上面代码中，Promise 在 resolve 语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永远保持该状态，不会再变了。

4，Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

```js
getJSON('/post/1.json').then(function (post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  // some code
}).catch(function (error) {
  // 处理前面三个Promise产生的错误
})
```

> 上面代码中，一共有三个 Promise 对象：一个由 getJSON() 产生，两个由 then() 产生。它们之中任何一个抛出错误，都会被最后一个 catch() 捕获。、

5，一般不要在 then() 方法里面定义 Reject 状态的回调函数（即 then() 方法的第二个参数），而是使用 catch() 方法。

```js
// 不推荐写法
promise.then(function (data) {
  // success
}, function (err) {
  // error
});

// 推荐写法
promise.then(function (data) {
  // success
}).catch(function (err) {
  // error
})
```

> 上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面 then() 方法执行中的错误，也更接近同步的写法（try/catch）。因此建议总是使用 catch() 方法，而不使用 then() 方法的第二个参数。

6，跟传统的 try/catch 代码块不同的是，如果没有使用 catch() 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

```js
const someAsyncThing = function () {
  return new Promise(function (resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function () {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123 
```

> 上面代码中，someAsyncThing() 函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示 ReferenceError: x is not defined，但是不会退出进程，终止脚本执行，2 秒之后还是会输出 123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是 `Promise 会吃掉错误`。

7，错误被抛出 Promise 函数体外的情况。

```js
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  setTimeout(function () { throw new Error('test') }, 0)
});
promise.then(function (value) { console.log(value) });
// ok
// Uncaught Error: test
```

> 上面代码中，Promise 指定在下一轮“事件循环”再抛出错误。到那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

8，Promise 对象后面最后跟 catch() 方法，这样可以处理 Promise 内部发生的错误。catch() 方法返回的还是一个 Promise 对象，因此后面可以接着调用 then() 方法。

```js
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
// carry on
```

> 上面代码运行完 catch() 方法指定的回调函数，会接着运行后面那个 then() 方法指定的回调函数。如果没有报错，则会跳过 catch() 方法。

```js
Promise.resolve()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// carry on
```

> 上面代码因为没有报错，就直接跳过了 catch() 方法，直接执行了后面的 then() 方法。此时，要使 then() 方法里面报错，就与前面的 catch() 无关了。

9，catch() 方法中，还能再抛出错误。

```js
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  return someOtherAsyncThing();
}).catch(function(error) {
  console.log('oh no', error);
  // 下面一行会报错，因为 y 没有声明
  y + 2;
}).then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
```

> 上面代码中，catch() 方法抛出一个错误，因为后面没有别的 catch() 方法了，导致这个错误不会被捕获，也不会传递到外层，如果改写一下，结果就会不一样了。

```js
someAsyncThing().then(function() {
  return someOtherAsyncThing();
}).catch(function(error) {
  console.log('oh no', error);
  // 下面一行会报错，因为y没有声明
  y + 2;
}).catch(function(error) {
  console.log('carry on', error);
});
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]
```

> 上面代码中，第二个 catch() 方法用来捕获前一个 catch() 方法抛出的错误。

### Promise.prototype.finally()

1，finally() 方法用于指定不管 Promise 对象最后的状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

> 上面代码中，不管 promise 最后的状态，在执行完 then() 或 catch() 指定的回调函数以后，都会执行 finally 方法指定的回调函数。

2，服务器使用 Promise 处理请求，然后使用 finally 方法关掉服务器。

```js
server.listen(port)
  .then(function () {
    // ...
  })
  .finally(server.stop);
```

> finally() 方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是 resolved 还是 rejected。这表明，finally() 方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

3，finally() 本质上是 then() 方法的特例。

```js
promise
.finally(() => {
  // ...
});

// 等同于
promise
.then(
  result => {
    // ...
    return result;
  },
  error => {
    // ...
    throw error;
  }
);
```

> 上面代码中，如果不使用 finally() 方法，同样的语句需要为成功和失败两种情况各写一次。有了 finally() 方法，则只需写一次即可。

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

> 上面代码中，不管前面的 Promise 是 resolved 还是 rejected，都会执行回调函数 callback。

4，finally() 方法总是会返回原来的值。

```js
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})
// resolve 的值是 2
Promise.resolve(2).finally(() => {})
// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})
// reject 的值是 3
Promise.reject(3).finally(() => {})
```

### Promise.all()

1，Promise.all() 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
const p = Promise.all([p1, p2, p3]);

p.then((data) => {
  console.log(data, '成功了，返回值是一个数组');
}).catch((error) => {
  console.log(error, '失败了，是第一个失败的 rejected 的值');
})
```

> 上面代码中，Promise.all() 方法接受一个数组作为参数，p1、p2、p3 都是 Promise 实例，如果不是，就会调用 Promise.resolve() 方法，将参数转为 Promise 实例，再进一步处理。此外，`Promise.all() 方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例`。

**说明**：上述代码 p 的状态由 p1、p2、p3 的状态决定，其中可分为两种情况：

(1)，只有 p1、p2、p3 的状态都变成 resolved 时，p 的状态才会变成 resolved。此时，`p1、p2、p3 的返回值将会组成一个数组`，传递给 p 的回调函数。

(2)，只要 p1、p2、p3 之中有一个状态变成 rejected，p 的状态就变成 rejected，此时`第一个被 rejected 的实例的返回值会传递给 p 的回调函数`。

```js
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
```

> 上面代码中，promises 是包含 6 个 Promise 实例的数组，只有这 6 个实例的状态都变成 resolved，才会调用 Promise.all() 方法后面的回调函数。

```js
const databasePromise = connectDatabase();

const booksPromise = databasePromise
  .then(findAllBooks);

const userPromise = databasePromise
  .then(getCurrentUser);

Promise.all([
  booksPromise,
  userPromise
])
.then(([books, user]) => pickTopRecommendations(books, user));
```

> 上面代码中，booksPromise 和 userPromise 是两个异步操作，只有等它们的结果都返回了，才会触发 pickTopRecommendations 这个回调函数。

2，如果作为参数的 Promise 实例，自己定义了 catch() 方法，那么它一旦被 rejected，并不会触发 Promise.all() 的 catch() 方法。

```js
const p11 = new Promise((resolve, rejected) => {
  resolve('成功了');
}).then(res => res).catch(e => e);

const p22 = new Promise((resolve, rejected) => {
  throw new Error('报错了');
}).then(res => res).catch(e => e);

p22.then(e => console.log(e));  // Error: 报错了

Promise.all([p11, p22]).then(res => console.log(res)).catch(e => console.log(e));
// ['成功了', Error: 报错了]
```

> 上面代码中，p1 会 resolved，p2 首先会 rejected，但是 p2 有自己的 catch() 方法，`该方法返回的是一个新的 Promise 实例，p2 指向的实际是这个新的 Promise 实例。该实例执行完 catch() 方法后，也会变成 resolved`，导致 Promise.all() 方法的参数里面的两个实例都会 resolved，因此会调用 then() 方法指定的回调函数，而不会调用 catch() 方法指定的回调函数。如果 p2 没有自己的 catch() 方法，就会调用 Promise.add() 的 catch() 方法。

```js
const p11 = new Promise((resolve, rejected) => {
  resolve('成功了');
}).then(res => res).catch(e => e);

const p22 = new Promise((resolve, rejected) => {
  throw new Error('报错了');
}).then(res => res);

Promise.all([p11, p22]).then(res => console.log(res)).catch(e => console.log(e));
// Error: 报错了
```

### Promise.race()

1，Promise.race() 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。它将返回最先执行完成的实例的返回值，不管实例成功还是失败，都是返回第一个执行完成的实例的返回值。

```js
const p = Promise.race([p1, p2, p3]);

p.then((d) => {
  console.log(p + 'p1, p2, p3其中最先调用的返回值');
})
```

> 上面代码中，只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就是这个率先改变的实例的状态。这个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

2，Promise.race() 方法的参数于 Promise.all() 方法一样，如果不是 Promise 实例，就会先调用 Promise.resolve() 方法，将参数转为 Promise 实例，再进一步处理。

```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

> 上面代码中，如果 5 秒之内 fatch() 方法无法返回结果，变量 p 的状态就会变成 rejected，从而触发 catch() 方法指定的回调函数。

### Promise.allSettled()

1，Promise.allSettled() 方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，`不管是 resolved 还是 rejected`，包装实例才会有结果。该方法由 ES2020 引入。

```js
const promises = [
  fetch('/api-1'),
  fetch('/api-2'),
  fetch('/api-3'),
];

await Promise.allSettled(promises);
removeLoadingIndicator();
```

> 上述代码对服务器发出三个请求，等到三个请求都结束，不管请求成功还是失败，加载的滚动图标就会消失。

2，Promise.allSettled() 方法返回新的 Promise 实例，`一旦结束，状态总是 resolved，不会变成 rejected`。状态变成 resolved 后，Promise 的监听函数收到的参数是一个数组，每个成员对应一个传入 Promise.allSettled() 的 Promise 实例。

```js
const resolved = Promise.resolve(2);
const rejected = Promise.reject(1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

// res 是一个数组
allSettledPromise.then(function (res) {
  console.log(res);
  /**
   *  [
   *    {status: 'resolved', value: 2},
   *    {status: 'rejected', reason: 1}
   *  ]
   */
}) 
```

> 上面代码中，Promise.allSettled() 方法的返回值 allSettledPromise，状态只可能变成 resolved。它的监听函数接收到的参数使数组 res。该数组的每个成员都是一个对象，对应传入 Promise.allSettled() 的两个 Promise 实例。每个对象都有 status 属性，该属性的值只可能是字符串 resolved 或字符串 rejected。`resolved 时，对象有 value 属性，rejected 时则有 reason 属性`，对应这两种状态的返回值。

3，Promise.allSettled() 返回指的用法。

```js
const promise = [fetch('index.html'), fetch('http://xxx.yy')];
const res = await Promise.allSettled(promises);

// 过滤出失败的请求，并输出原因
const errors = res.filter(p => p.status === 'rejected').map(p => p.reason);
```

4，有时候，我们不关心异步操作的结果，`只关心这些操作有没有结束`。这时，Promise.allSettled() 方法就很有用。如果没有这个方法，想要确保所有操作都结束，就很麻烦。Promise.all() 方法无法做到这一点。

```js
const urls = [/*...*/];
const requests = urls.map(x => fetch(x));

try {
  await Promise.all(requests);
  console.log('所有请求都成功');
} catch () {
  console.log('至少有一个请求失败，其他请求可能还没结束');
}
```

> 上面代码中，Promise.all() 无法确定所有请求都结束，想要达到这个目的，写起来很麻烦，有了 Promise.settled()，这就很容易了。

### Promise.any()

1，ES2021 引入了 Promise.any() 方法。该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。`只要参数实例有一个变成 resolved 状态，包装实例就会变成 resolved 状态`。如果所有参数实例变成 rejected 状态，包装实例就会变成 rejected 状态。

2，Promise.any() 跟 Promise.race() 方法很像，只有一点不同，就是不会因为某个 Promise 变成 rejected 状态而结束。

```js
const promises = [
  fetch('api-a').then(() => 'a'),
  fetch('api-b').then(() => 'b'),
  fetch('api-c').then(() => 'c'),
];

try {
  const first = await Promise.any(promises);
  console.log(first);
} catch (error) {
  console.log(error);
}
```

> 上面代码中，Promise.any() 方法的参数数组包含三个 Promise 操作。其中只要有一个变成 resolved，Promise.any() 返回的 Promise 对象就变成 resolved 状态。如果所有三个操作都变成 rejected 状态，那么 await 命令就会抛出错误。

3，Promise.any() 抛出的错误不是一个一般的错误，而是一个 `AggregateError` 实例。它相当于一个数组，每个成员对应一个被 rejected 的操作所抛出的错误。下面是 AggregateError 的实现实例。

```js
new AggregateError() extends Array -> AggregateError;

const err = new AggregateError();
err.push(new Error('first error'));
err.push(new Error('second error'));
throw err;
```

4，捕捉错误时，如果不用 try...catch 结构和 await 命令，可以像下面这样写。

```js
Promsie.any(promises).then(
  first => {
    // any of the promise was resolved
  },
  error => {
    // all of the promise were rejected
  },
);
```

5，Promise.any() 基本使用示例。

```js
const resolved = Promise.resolve(22);
const rejected = Promise.reject(11);
const alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (res) {
  console.log(res); // 22
})

Promise.any([rejected, alsoRejected]).then(function (res) {
  console.log(res); // [11, Infinity]
})
```

### Promise.resolve()

1，有时需要将现有对象转为 Promise 对象，Promise.resolve() 方法就起这个作用。

```js
const jsPromise = Promise.resolve($.ajax('/whatever.json'));
```

> 上面代码将 jQuery 生成的 deferred 对象，转为一个新的 Promise 对象。

2，Promise.resolve() 等价于如下写法：

```js
Promise.resolve('foo');
// 等价于
new Promise(resolve => resolve('foo'));
```

3，Promise.resolve() 方法的参数可分成四种情况：

`<1>，参数是一个 Promise 实例。`

> 如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改，原封不动的返回这个实例。

`<2>，参数是一个 thenable 对象。`

> thenable 对象指的是具有 then() 方法的对象，比如下面这个对象。

> ```js
> let thenable = {
>   then: function (resolve, reject) {
>     resolve(222);
>   }
> }
>
> let p1 = Promise.resolve(thenable);
> p1.then(value => {
>   console.log(value); // 222
> })
> ```

> 上面代码中，thenable 对象的 then() 方法执行后，对象 p1 的状态就变为 resolved，从而立即执行最后那个 then() 方法指定的回调函数，输出 222。

`<3>，参数不是具有 then() 方法的对象，或根本就不是对象（原始值）`。

> 如果参数是一个`原始值`，或者是一个不具有 then() 方法的对象，则 Promise.resolve() 方法返回一个新的 Promise 对象，状态为 resolved。

```js
const p = Promise.resolve('hello');

p.then(function (s) => {
  console.log(s); // hello
});
```

> 上面代码生成一个新的 Promise 对象的实例 p。由于字符串 hello 不属于异步操作（判断方法是字符串对象不具有 then() 方法），返回 Promise 实例的状态从一生成就是 resolved，所以回调函数会立即执行。Promise.resolve() 方法的参数，会同时传给回调函数。

`<4>，不带任何参数`

> Promise.resolve() 方法允许调用时不带参数，直接返回一个 resolved 状态的 Promise 对象。所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用 Promise.resolve() 方法。

```js
const p = Promise.resolve();
p.then(function () {
  // ...
})
```

> 上面代码的变量 p 就是一个 Promise 对象。

4，**注意**：立即 resolve() 的 Promise 对象，是在本轮`事件循环（event loop）的结束时执行`，而不是在下一轮事件循环的开始时执行。

```js
setTimeout(() => {
  console.log('three');
}, 0);

Promise.resolve().then(() => {
  console.log('two');
})

console.log('one');

// one => two => three
```

> 上面代码中，`setTimeout(fn, 0) 在下一轮事件循环开始时执行`，Promise.resolve() 在本轮事件循环结束时执行，console.log('one') 则是立即执行，因此最先输出。

### Promise.reject()

1，Promise.reject(reason) 方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。

```js
const p = Promise.reject('出错了');
// 等价于
const p = new Promise((resolve, reject) => reject('出错了'));

p.then(null, function (s) {
  console.log(s); // 出错了
})
```

> 上面代码生成一个 Promise 对象的实例 p，状态为 rejected，回调函数会立即执行。

2，Promise.reject() 方法的参数，会原封不动的作为 reject 的理由，变成后续方法的参数。

```js
Promise.reject('出大问题了');
.catch(e => {
  console.log(e === '出大问题了');  // true
})
```

> 上面代码中，Promise.reject() 方法的参数是一个字符串，后面 catch() 方法的参数 e 就是这个字符串。

## Promise 的应用

### 加载图片

1，我们可以将图片的加载写成一个 Promise，一旦加载完成，Promise 的状态就发生变化。

```js
const loadImage = function (path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = path;
  });
};   
```

### Generator 函数与 Promise 相结合

1，使用 Generator 函数管理流程，遇到异步操作的时候，通常返回一个 Promise 对象。

```js
function getFoo () {
  return new Promise((resolve, reject) => {
    resolve('foo');
  })
}

const g = function* () {
  try {
    const foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
}

function run (generator) {
  const it = generator();

  function go(result) {
    if (result.done) {
      return result.value;
    }
    return result.value.then((value) => {
      return go(it.next(value));
    }, (error) => {
      return go(it.throw(error));
    })
  }

  go(it.next());
}

run(g);
```

> 上面代码的 Generator 函数 g 之中，有一个异步操作 getFoo，它返回的就是一个 Promise 对象。函数 run 用来处理这个 Promise 对象，并调用下一个 next() 方法。

### Promise.try()

1，实际开发中，经常遇到一种情况，不知道或者不想区分函数 f 是同步函数还是异步操作，但是想用 Promise 来处理它。因为这样就可以不管 f 是否包含异步操作，都用 then() 方法指定下一步流程，用 catch() 方法处理 f 抛出的错误。一般会采用下面的写法。

```js
Promise.resolve().then(f);
```

> 上面的写法有一个缺陷，就是如果 f 是同步函数，那么它会在本轮事件循环的末尾执行。

```js
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next => now
```

> 上面代码中，函数 f 是同步的，但是用 Promise 包装了以后，就变成异步执行了。

2，使用 async 函数实现同步函数同步执行，异步函数异步执行。

```js
const f = () => console.log('first');
(async () => f())();
console.log('second'); 
// first => second
```

> 上面代码中，第二行是一个立即执行的匿名函数，会立即执行里面的 async 函数，因此如果 f 是同步的，就会得到同步的结果，如果 f 是异步的，就可以用 then 指定下一步，就像下面的写法。

```js
(async () => f())().then(...);
```

> **注意**：async () => f() 会吃掉 f() 抛出的错我。所以，如果想要捕获错误，需要使用 promise.catch() 方法。

```js
(async () => f()()).then(...).catch(...);
```

3，使用 new Promise() 实现同步函数同步执行，异步函数异步执行。

```js
const f = () => console.lg('first');
(() => new Promise(
  resolve => resolve(f());
))();
console.log('second');
// first => second
```

> 上面代码也是使用立即执行的匿名函数，执行 new Promise()。这种情况下，同步函数也是同步执行的。

4，使用 [Promise.try()](https://github.com/tc39/proposal-promise-try) 方法实现同步函数同步执行，异步函数异步执行，代替前面上述的两种方式。

```js
const f = () => console.log('first');
Promise.try(f);
```

5，由于 Promise.try() 为所有操作提供了统一的处理机制，所以如果想用 then() 方法管理流程，最好都用 Promise.try() 包装一下。这样有[许多好处](http://cryto.net/~joepie91/blog/2016/05/11/what-is-promise-try-and-why-does-it-matter/)，其中一点就是可以更好地管理异常。

```js
function getUserName(userId) {
  return data.users.get({id: userId})
  .then(function (user) {
    return user.name;
  })
  .catch((err) => {
    console.log(err);
  })
}
```

> 上述代码中，data.users.get({id: userId}) 返回一个 Promise 对象，如果抛出异步错误，可以使用 catch() 方法捕获，但是如果抛出地是同步错误（比如数据库连接错误，具体看实现方法），这时就不得不使用 `try...catch` 去捕获错误了。

```js
function getUserName(userId) {
  try {
    return data.users.get({ id: userId })
      .then(function (user) {
        return user.name;
      })
  } catch (err) {
    throw new Error(err);
  }
}
```

> 上面地写法显得很笨拙，此时就可以统一地使用 `Promise.catch()` 来捕获所有同步和异步地错误。

```js
function getUserName(userId) {
  return Promise.try(() => data.users.get({ id: userId }))
    .then((userId) => {
      return userId;
    })
    .catch((err) => {
      throw new Error(err);
    })
}
```

**说明**：事实上，Promise.try() 就是模拟 try 代码块，就像 Promise.catch() 模拟的是 catch() 代码块。

## 手写 Promise

### 基础版 Promise

1，首先看最简单的 Promise 使用方式。

```js
const p1 = new Promise((resolve, reject) => {
  console.log('new promise');
  resolve('success');
})

console.log('after new promise');

const p2 = p1.then(data => {
  console.log(data);
  throw new Error('faild...');
})

const p3 = p2.then(data => {
  console.log('success', data);
}, err => {
  cosole.log('faild', err);
})

// new promise => after new promise => success => failed Error: faild...
```

> 通过上面的代码，可以发现，我们在调用 Promise 时，会返回一个 Promise 对象。在构建 Promise 对象时，需要传入一个 `executor` 函数，Promise 的主要业务流程都在 executor 函数中执行。如果运行在 executor 函数中的业务执行成功了，则会调用 resolve 函数，否则就执行 reject 函数。需要注意的是：Promise 的状态不可逆，同时调用 resolve 函数和 reject 函数，默认会采用第一次调用的结果。

2，Promise 的基本特征：

<1>，Promise 有三个状态：pending、resolved、rejected.

<2>，new Promise 时，需要传递一个 executor() 执行器，执行器立即执行。

<3>，executor 接收两个参数，分别是 resolve 和 reject。

<4>，Promsie 的默认状态是 pending。

<5>，Promise 有一个 value 保存成功状态的值，可以是 undefined/thenable/promise。

<6>，Promise 有一个 reason 保存失败状态的值。

<7>，Promise 只能从 pending 到 resolved，或者从 pending 到 rejected。状态一旦确认，就不会再改变。

<8>，Promise 必须有一个 then() 方法，then() 方法接收两个参数，分别是：Promise 成功的回调 onResolved 和 Promise 失败的回调 onRejected。

<9>，如果调用 then() 时，Promise 已经成功，则执行 onResolved，参数是 Promise 的value。

<10>，如果调用 then() 时，Promise 已经失败，那么执行 onRejected，参数是 Promise 的 reason。

<11>，如果 then() 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then() 的失败的回调 onRejected。

3，实现最基本的 Promise：

```js
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) {
    // 默认状态为 PENDING
    this.status = PENDING;
    // 存放成功状态的值，默认为 undefined
    this.value = undefined;
    // 存放失败状态的值，默认为 undefined
    this.reason = undefined;

    // 调用此方发就表示成功
    let resolve = (value) => {
      /*状态为 PENDING 时才可以更新状态，
      防止 executor 中调用两次 resolve/reject 方法*/
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = value;
      }
    }

    // 调用此方发就表示失败
    let reject = (reason) => {
      /*状态为 PENDING 时才可以更新状态，
      防止 executor 中调用两次 resolve/reject 方法*/
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    }

    try {
      // 立即执行，将 resolve 和 reject 函数传递给使用者
      executor(resolve, reject);
    } catch (error) {
      // 发生异常时执行失败逻辑
      reject(error);
    }
  }

  // 包含一个 then 方法，并接收两个参数 onResolved、onRejected
  then(onResolved, onRejected) {
    if (this.status === RESOLVED) {
      onResolved(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}

console.log(new Promise(() => { }));

// resolve/reject 就是从 Promise 类中 constructor 中执行executor()以实参的方式传递出来的
const promise = new Promise((resolve, reject) => {
  resolve('成功');
}).then(data => {
  console.log('success', data);
}, error => {
  console.log(error);
})
// success 成功
```

> 通过上述代码，我们已经实现了一个基础版的 Promise，其中只处理了同步操作的 promise。如果在 executor() 中传入一个异步操作，会有什么结果呢？我们可以试一下：

```js
const promise1 = new Promise((resolve, reject) => {
  // 传入一个异步操作
  setTimeout(() => {
    resolve('成功');
  }, 1000);
}).then(
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  }
)
// 没有任何输出
```

> 执行上述测试代码后发现，promise 没有任何返回，这是因为 Promise 调用 then() 方法时，当前的 Promise 并没有成功，一直处于 pending 状态。我们需要先将成功和失败的回调分别存放起来，在 executor() 异步任务被执行时，触发 resolve 或 reject，依次调用成功或失败的回调。

4，优化之前处理同步的 promise 成能够处理异步情况的 Promise。

```js
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

class asyncPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    // 存放成功的回调
    this.onResolvedCallbacks = [];
    // 存放失败的回调
    this.onRejectedCallbacks = [];

    let resolve = value => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = value;
        // 依次将对应的函数执行
        this.onResolvedCallbacks.forEach(fn => {
          // console.log(fn);  // () => {onResolved(this.value)}
          fn()
        });
      }
    }

    let reject = reason => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.reason = reason;
        // 依次将对应的函数执行
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onResolved, onRejected) {
    if (this.status === RESOLVED) {
      onResolved(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }

    if (this.status === PENDING) {
      /* 如果 Promise 的状态是 pending，则说明是异步操作，
      需要将 onResolved 和 onRejected 函数存放起来，
      等待状态确定后，再依次将对应的函数执行 */
      this.onResolvedCallbacks.push(() => {
        onResolved(this.value);
      })

      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      })
    }
  }
}

// 测试
const promise2 = new asyncPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('异步成功');
  }, 1000);
}).then(data => {
  console.log('async success', data);
}, error => {
  console.log('async faild', error);
})
// 输出为：async 异步成功
```

> 以上就完成处理异步的情况 Promise。熟悉设计模式的同学，应该意识到了这其实是一个`发布订阅模式`，这种收集依赖 -> 触发通知 -> 取出依赖执行的方式，被广泛运用于发布订阅模式的实现。

### then 的链式调用 && 值穿透特性

1，我们都知道，Promise 的优势在于可以链式调用。在我们使用 Promise 的时候，当 then() 函数中 return 了一个值，不管是什么值，我们都能在下一个 then() 中获取到，这就是所谓的 then() 链式调用。而且，当我们不在 then() 中放入参数，例如：promise.then().then()，那么其后面的 then() 依旧可以得到之前 then() 返回的值，这就是所谓的值穿透。那具体如何实现呢？`如果每次调用 then() 的时候，我们都重新创建一个 promise 对象，并把上一个 then() 的返回结果传给这个新的 Promise 的 then() 方法`，不就可以一直 then() 下去了吗？

2，结合以上思路，我们可以得出以下结论：

<1>，then() 的参数 onResolved 和 onRejected 可以缺省，如果 onResolved 或者 onRejected 不是函数，将其忽略，且依旧可以在下面的 then() 中获取到之前返回的值。

<2>，Promise 可以 then() 多次，每次执行完 Promise.then() 方法后返回的都是一个新的 Promise。

<3>，如果 then() 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then() 的成功的回调中。

<4>，如果 then() 中抛出异常，那么久会把这个异常作为参数，传递给下一个 then() 的失败回调中。

<5>，如果 then() 的返回值 x 是一个 Promise，那么会等这个 Promise 执行完，Promise 如果成功，就走下一个 then() 的成功回调 onResolved()，如果失败，就走下一个 then() 的失败回调 onRejected()。如果抛出异常，就走下一个 then() 的失败回调 onRejected()。

<6>，如果 `then() 的返回值 x 和 Promise 是同一个引用对象，造成循环引用，则抛出异常`，把异常传递给下一个 then() 失败的回调中。

<7>，如果 then() 的返回值 x 是一个 Promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其它所有调用被忽略。

3，综合上述内容，完成 Promise.then() 的链式调用。

```js
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

const resolvePromise = (promise, x, resolve, reject) => {
  // 当前 promise 与 then 的返回值 x 是同一个引用对象，会造成循环引用，所以需要抛出异常结束 promise
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 创建一个控制 Promise 执行次数的状态，确保当前 Promise 只能被调用一次
  let called;
  // 后续条件需要严格控制，保证代码能和别的库一起使用
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      // 为了判断 resolve 之后就不用再 reject 了（比如 reject 和 resolve 同时调用的情况）
      let then = x.then;  // then 的返回值（x）中的 then 属性赋值给一个新的变量 then
      if (typeof then === 'function') {
        // 不写成 x.then 而直接使用 then.call 是因为 x.then 会再次取值，Object.defineProperty
        then.call(x, y => { // 根据 Promise 的状态决定是成功还是失败
          if (called) return;
          called = true;
          // 递归解析的过程（因为可能 Promise 中还有 Promise）
          resolvePromise(promise, y, resolve, reject);
        }, r => {
          // 只要失败就失败
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // 如果 x.then 是一个普通值就直接返回 resolve 作为结果
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 如果 x 是一个普通值接直接返回 resolve 作为结果
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = value => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }

    let reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onResolved, onRejected) {
    // 处理 onResolved/onRejected 没有传值的问题，如果 onResolved 不是函数，就手动设其为函数
    onResolved = typeof onResolved === 'function' ? onResolved : v => v;
    // 因为错误的值要让后面访问到，所以这里需要抛出错误，不然会在之后的 then 的 resolve 中捕获
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    // 每次调用 then 都返回一个新的 Promise
    let promise = new Promise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onResolved(this.value);
            // console.log(x, 'onResolved>>>>>>>>>>');
            // x 可能是一个 Promise
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            // console.log(x, '-----------------------');
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            console.log(e, 'onRejected');
            reject(e);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onResolved(this.value);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise;
  }
}

// 测试
const promise = new Promise((resolve, reject) => {
  // resolve('>>>成功>>>>>>>');
  // reject('>>>失败>>>>>>>');
  resolve(new Promise((resolve, reject) => {
    reject('promise 失败了');
  }))
}).then().then().then(data => {
  console.log('success', data);
}, err => {
  console.log('err', err);
});
// err promise 失败了
```
