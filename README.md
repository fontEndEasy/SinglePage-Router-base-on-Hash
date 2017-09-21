# SinglePageRouterBaseOnHash

> routes.conf.js: 路由配置

> router.js: 基于hash的路由库 兼容IE8

#### routes.conf配置说明：
> 初始为数据字面量，元素为对象字面量,即[{},{},...{}]，每一个对象即为一个路由，子路由以childRoutes标识，格式与父路由一样。
 1. beforeEnter: 为模板渲染前需要预处理的函数，发送ajax请求数据等;
 2. callback: 回调为模板渲染后执行相关业务逻辑或DOM交互操作;
 3. title: 可为当前已渲染的模板设置title
 4. params: 为当前路由要传递的参数
 5. url: 模板路径，如：'./pages/manager/user.html'
 6. path: 当前路由对应要更新的hash值，如：'/user'
 7. childRoutes: 定义子路由

```javascript
> 引入jquery.js 和 routes.conf.js配置文件，该文件可根据业务需求进行定制

> var router = new Router({routes: routes, routerLinkActive: ' on', views: 'views'}); // 实例化路由

> 入口html中定义视图渲染容器<div class="views" id="views"></div>
> 子视图渲染容器为：<div class="child-views" id="child-views"></div>

> @Comment string:Router是基于hash封装的路由框架，目前功能：
  1. 可自定义路由路径，
  2. 路由之间可进行参数传递，
  3. 每个路由的业务逻辑在对应配置回调中进行，
  4. 可自定义当前激活路由样式类，
  5. 通过go方法可进行路由的快捷跳转，并携带相关参数
  6. 父子路由配置api接口根地址，其参数在对应link标签参object的格式传入,
  比如：
     <a href="#/home" params="{id: 001, username: 'zhuxl', age: 29, gender: 'male'}">Home</a>
    模板动态参数绑定: <a href="#/home" params="{id: '{{ d.id }}', username: '{{ d.username }}', age: {{ d.age}}, gender: '{{ d.male             }}'}">Home</a>
  7. 为了统一，此路由框架集成了jquery, 也可以独立出来单独使用;  
  8. 后续功能待完善...
```

 > 已投入使用的项目地址：http://42.51.172.20:8080/mtss-web/src/
