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
  // 后续的条件要严格判断 保证代码能和别的库一起使用
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    try {
      // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）
      let then = x.then;
      if (typeof then === 'function') {
        // 不写成 x.then 而直接使用 then.call 是因为 x.then 会再次取值，Object.defineProperty
        then.call(x, y => { // 根据 promise 的状态决定是成功还是失败
          if (called) return;
          called = true;
          // 递归解析的过程（因为可能 promise 中还有 promise）
          resolvePromise(promise, y, resolve, reject);
        }, r => {
          // 只要失败就失败
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    // 如果 x 是个普通值就直接返回 resolve 作为结果
    resolve(x)
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
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onResolved, onRejected) {
    // 处理 onResolved/onRejected 没有传值的问题，如果 onResolved 不是函数，就手动设其为函数
    onResolved = typeof onResolved === 'function' ? onResolved : v => v;
    //因为错误的值要让后面访问到，所以这里也要抛出个错误，不然会在之后 then 的 resolve 中捕获
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    // 每次调用 then 都返回一个新的 promise
    let promise = new Promise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onResolved(this.value);
            // x可能是一个proimise
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e)
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
              reject(e)
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          }, 0);
        });
      }
    });
    return promise;
  }
}

const promise = new Promise((resolve, reject) => {
  // reject('失败了');
  resolve('成功了！！！');
}).then().then().then(data => {
  console.log('success', data);
}, err => {
  console.log('err', err);
})