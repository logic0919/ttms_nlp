// await 解包演示
async function demo() {
    console.log('=== await 解包演示 ===');

    // 1. Promise resolve 数组
    const promiseArray = Promise.resolve([1, 2, 3, 4, 5]);
    const array = await promiseArray;
    console.log('数组解包结果:', array);  // [1, 2, 3, 4, 5]
    console.log('类型:', typeof array, Array.isArray(array));  // object true

    // 2. Promise resolve 对象
    const promiseObject = Promise.resolve({ name: '张三', age: 25 });
    const obj = await promiseObject;
    console.log('对象解包结果:', obj);  // { name: '张三', age: 25 }
    console.log('类型:', typeof obj);  // object

    // 3. Promise resolve 数字
    const promiseNumber = Promise.resolve(42);
    const num = await promiseNumber;
    console.log('数字解包结果:', num);  // 42
    console.log('类型:', typeof num);  // number

    // 4. Promise resolve 字符串
    const promiseString = Promise.resolve('Hello World');
    const str = await promiseString;
    console.log('字符串解包结果:', str);  // Hello World
    console.log('类型:', typeof str);  // string

    // 5. Promise resolve null
    const promiseNull = Promise.resolve(null);
    const nullValue = await promiseNull;
    console.log('null解包结果:', nullValue);  // null
    console.log('类型:', typeof nullValue);  // object

    console.log('=== 对比：不使用await ===');
    // 不使用await时，得到的是Promise对象本身
    const promise = Promise.resolve([1, 2, 3]);
    console.log('不使用await:', promise);  // Promise { <pending> }
    console.log('类型:', typeof promise);  // object
}

// 运行演示
demo();