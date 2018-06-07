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

https://jsbin.com/yijorunepe/edit?html,output
再举一个更简单的例子，士兵与长官就是一个订阅与发布者的关系，士兵的所有行动都通过长官来发布，只有长官发号施令，士兵们才能执行对应的行动。
```
// obj是一个发布者, 发布信息时调用dep的notify方法
obj = {
    pub: function(dep){
        dep.notify()
    }
}

//Dep是链接订阅者和发布者的一个桥梁, 订阅者将自己存入subs中, 发布者通过pub方法来通知subs中的每一个订阅者
function Dep(){
    this.subs = []
}
Dep.prototype.notify = function () {
    // 通知订阅者, 并让它们执行update方法
    this.subs.forEach(item => {
        item.update()
    })
}

// 订阅者
function Watcher(msg) {
    this.msg = msg
}
Watcher.prototype.update = function () {
    console.log('dom' + this.msg + '更新');
}

// 创建三个订阅者
var a = new Watcher(1),
    b = new Watcher(2),
    c = new Watcher(3);

var dep = new Dep();

// 将三个订阅者push进Dep.subs中
dep.subs.push(a)
dep.subs.push(b)
dep.subs.push(c)

// 发布者发布
obj.pub(dep)
```
