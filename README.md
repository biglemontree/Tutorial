### 简单易懂的双向数据绑定解读
![GitHub][github]

[github]: https://user-gold-cdn.xitu.io/2017/5/23/6187ce83f3cf77f8ec107289ccd28b31?imageView2/0/w/1280/h/960/format/webp/ignore-error/1

数据更新视图的重点是如何知道数据变了，只要知道数据变了，那么接下去的事都好处理。如何知道数据变了，就是通过Object.defineProperty( )对属性设置一个set函数，当数据改变了就会来触发这个函数，所以我们只要将一些需要更新的方法放在这里面就可以实现data更新view了
![vue][vue]

[vue]: https://images2015.cnblogs.com/blog/938664/201705/938664-20170522230647382-1643499691.jpg

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
console.log(obj.a.get)
// 改变对象a的值
obj.a = 1
```
当我们执行obj.a的时候会触发get函数，控制台会打印'this is the getter'，当我们为obj.a赋值的时候，obj.a=2;这是控制台会打印"change new value"大家可以把getter和setter理解成获取对象属性值和给对象属性赋值时的钩子就可以了。
实现过程
我们已经知道实现数据的双向绑定，首先要对数据进行劫持监听，所以我们需要设置一个监听器Observer，用来监听所有属性。如果属性发上变化了，就需要告诉订阅者Watcher看是否需要更新。因为订阅者是有很多个，所以我们需要有一个消息订阅器Dep来专门收集这些订阅者，然后在监听器Observer和订阅者Watcher之间进行统一管理的。接着，我们还需要有一个指令解析器Compile，对每个节点元素进行扫描和解析，将相关指令对应初始化成一个订阅者Watcher，并替换模板数据或者绑定相应的函数，此时当订阅者Watcher接收到相应属性的变化，就会执行对应的更新函数，从而更新视图。因此接下去我们执行以下3个步骤，实现数据的双向绑定：

1.实现一个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。

2.实现一个订阅者Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。

3.实现一个解析器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。
流程图如下：
![process][process]

[process]: https://user-gold-cdn.xitu.io/2017/5/23/04fdcd64ed41f762a7a495f73c0a2f86?imageView2/0/w/1280/h/960/format/webp/ignore-error/1
订阅者模式：订阅者模式也叫“订阅-发布者模式”，对于前端来说这种模式简直无处不在，比如我们常用的xx.addEventListener('click',cb,false)就是一个订阅者，它订阅了click事件，当在页面触发时，浏览器会作为发布者告诉你，可以执行click的回调函数cb了。
eg: https://jsbin.com/biyulaz/edit?html,output
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
在这段代码中，obj是发布者，Watcher实例是订阅者，Dep用来储存订阅者，以及接受发布者通知的一个媒介

### proxy（es6）实现

```
var nameProxy = new Proxy({
			name: 'gaodeng'
		}, {
			get: function (target, key, value) {
				console.log('触发getter钩子函数, 值为: ', value)
				return target[key];
			},
			set: function (target, key, value) {
				console.log('触发setter钩子函数, 值为: ', value)
				target[key] = value;
			}
		});
// 获取		
nameProxy.name
// 设置
nameProxy.name = '小明'
```
最后一个完整的栗子: https://jsbin.com/yijorunepe/edit?html,output

