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

// resolve/reject 就是从 Promise 类中 constructor 中执行executor()以实参的方式传递出来的
const promise = new Promise((resolve, reject) => {
  resolve('成功');
}).then(data => {
  console.log('success', data);
}, error => {
  console.log(error);
})
// 输出为：success 成功

// 传入异步操作的情况
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

// 升级成能够处理异步情况的 promise
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
        this.onRejectedCallbacks.forEach(fn => {
          // console.log(fn);  // () => {onRejected(this.reason)}
          fn()
        });
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
// 输出为：async success 异步成功
