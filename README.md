### 简单易懂的Vue数据绑定源码解读
一.准备
在分析源码之前，我先说两个关于数据绑定相关的知识点：

1. 对象的访问器属性——getter和setter：

Object有一个名为defineProperty的方法，可以设置访问器属性，比如：
```
var obj = {}
Object.defineProperty(obj, 'a', {
    get: function(){
      console.log('this is the getter')
      return 1
    },
    set: function(){
      console.log('change new value')
    }
})
// 获取对象的值
obj.a

// 改变对象a的值
obj.a = 1
```
当我们执行obj.a的时候会触发get函数，控制台会打印'this is the getter'，当我们为obj.a赋值的时候，obj.a=2;这是控制台会打印"change new value"大家可以把getter和setter理解成获取对象属性值和给对象属性赋值时的钩子就可以了。

2. 订阅者模式：订阅者模式也叫“订阅-发布者模式”，对于前端来说这种模式简直无处不在，比如我们常用的xx.addEventListener('click',cb,false)就是一个订阅者，它订阅了click事件，当在页面触发时，浏览器会作为发布者告诉你，可以执行click的回调函数cb了。

<h1 id='title'>改变我</h1>
