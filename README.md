### 简单易懂的Vue数据绑定源码解读
一.准备
在分析源码之前，我先说两个关于数据绑定相关的知识点：

1. 对象的访问器属性——getter和setter：

Object有一个名为defineProperty的方法，可以设置访问器属性，比如：
```
let obj = {}
Object.defineProperty(obj, 'a', {
    get: function(){
      console.log('this is the getter')
      return 1
    },
    set: function(){
      console.log('change new value')
    }
})
```
