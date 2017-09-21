# SinglePageRouterBaseOnHash

> routes.conf.js: 路由配置

> router.js: 基于hash的路由库 兼容IE8

#### 使用方式：


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
  7. 为了统一，此路由框架集成了jquery, 也可以独立出来单独使用
  8. 后续功能待完善...
```

 > 已投入使用的项目地址：http://42.51.172.20:8080/mtss-web/src/
