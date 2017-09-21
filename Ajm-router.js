(function (global, AjmRouter) {

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = AjmRouter() :
        typeof define === 'function' && define.amd ? define(AjmRouter) :
            (global.AjmRouter = AjmRouter());
}(this, function AjmRouter() {
    /*
     * @Date 2017.07.26
     * @Author zhuxl
     * @Subject String '辅助工具'
     * @Function { Object }
     * @Comment string:'$AjmRouter是基于hash封装的路由框架，目前功能：
     * 1. 可自定义路由路径，
     * 2. 路由之间可进行参数传递，
     * 3. 每个路由的业务逻辑在对应配置回调中进行，
     * 4. 可自定义当前激活路由样式类，
     * 5. 通过go方法可进行路由的快捷跳转，并携带相关参数
     * 6. 父子路由配置api接口根地址，其参数在对应link标签参object的格式传入,
     *    比如：<a href="#/home” params="{id: 001, username: 'zhuxl', age: 29, gender: 'male'}">Home</a>
     *    模板动态参数绑定: <a href="#/home” params="{id: '{{ d.id }}', username: '{{ d.username }}', age: {{ d.age}}, gender: '{{ d.male }}'}">Home</a>
     * 7. 为了统一，此路由框架集成了jquery、layui模板引擎,也可以独立出来单独使用
     */

    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _toString = Object.prototype.toString;
    var _valueOf = Object.prototype.valueOf;


    var _random = Math.random;
    var _max = Math.max;
    var _min = Math.min;

    var _slice = Array.prototype.slice;
    var _arrIndexOf = Array.prototype.indexOf;
    var _concat = Array.prototype.concat;
    var _push = Array.prototype.push;
    var _pop = Array.prototype.pop;
    var _unshift = Array.prototype.unshift;
    var _shift = Array.prototype.shift;

    var _strIndexOf = String.prototype.indexOf;
    var _EmptyReg = /^\s*|\s*$/g;


    function isArray(object) {
        return _toString.call(obj) === '[object Array]' && typeof obj === 'object';
    };

    function isPlainObject(object) {
        return _toString.call(object) === '[object Object]';
    };

    function isRegExp(object) {
        return _toString.call(object) === '[object RegExp]';
    };

    function convertToString(value) {
        return !value ? '' : typeof value === 'object' ? JSON.stringify(val, null, 2) : String(value);
    };

    function $AjmRouter(options) {

        this.options = options;
        this.init();
        this.viewContainer = document.getElementById('ajmViews');
        this.$track = [];
    };


    $AjmRouter.prototype = {
        constructor: $AjmRouter,

        /*
         * @Function { Object }
         * @Params Object[require]
         * @Comment String '局部页面渲染，当reload/初次load/hashchange事件发生时，获取window.location.hash值进行路由处理/'
         * @Comment String '兼容IE8的事件梆定attachEvent/window['onhashchange']方式'
         */
        init: function () {

            var $this = this;
            if (window.addEventListener) {

                window.addEventListener('load', function (event) {
                    $this.clearLocalStorage();
                    $this.initHashAction();
                }, false);

                window.addEventListener('hashchange', function (event) {
                    $this.initHashAction();
                }, false);
            } else if (window.attachEvent) {

                window.attachEvent('onload', function (event) {
                    $this.clearLocalStorage();
                    $this.initHashAction();
                });

                window.attachEvent('onhashchange', function (event) {
                    $this.initHashAction();
                });
            } else {

                window['onload'] = function (event) {
                    $this.clearLocalStorage();
                    $this.initHashAction();
                }

                window['onhashchange'] = function (event) {
                    $this.initHashAction();
                }
            }
        },
        clearLocalStorage: function () {
            this.setLocalStorage();
        },
        /*
         * @Function { Object }
         * @Params Object[ string ]
         * @Comment String '获取所在页面指定为jamLink类的元素'
         */
        getElementByClassName: function (tagName, className) {

            var $classList = [];
            var uuid = 0;
            var $getAllLinks = document.getElementsByTagName(tagName);
            for (var i = 0; i < $getAllLinks.length; i++) {

                if ($getAllLinks[i].className.replace(_EmptyReg, '').split(' ')[0] === className) {
                    $getAllLinks[i].setAttribute('uuid', uuid++);
                    $classList.push($getAllLinks[i]);
                }
            }
            return $classList;
        },

        /*
         * @Function { Object }
         * @Comment String：
         * 1. '当页面第一次加载，后结页面刷新，或改变hash值时进行路由跳转处理',
         * 2. ‘当hash值为空，路由跳转至’/'.
         */
        initHashAction: function () {

            var $hash = window.location.hash.slice(1);
            var $ajmRoutes = this.options['AjmRoutes'];
            var $len = $ajmRoutes.length;
            var $splitHash = $hash.split('/');
            var $child = $splitHash[2];
            var $childViews = this.viewContainer.getElementsByTagName('div');
            var $ajmLinks = this.getElementByClassName('a', 'ajmLink');
            var $childRoutes;
            var $childViewContainer;
            var $parentpath;
            var $defaultViews;
            var $getRouteparams;
            if ($splitHash[1] === undefined) {
                $hash = '';
            } else {
                $hash = '/' + $splitHash[1];
            }
            // var $index = this.$track.indexOf($hash);

            /*if ($index === -1) {
             this.$track.push($hash);
             } else {
             this.$track.splice($index, 1);
             this.$track.push($hash);
             }*/


            this.$hash = $hash;
            this.$child = $child;
            if ($hash) {

                if ($splitHash.length === 2) {

                    for (var check = 0; check < $ajmRoutes.length; check++) {
                        if ($ajmRoutes[check].path === $hash) {
                            $defaultViews = $ajmRoutes[check].childRoutes;
                            break;
                        }
                    }

                    if ($defaultViews) {
                        location.hash = $hash + $defaultViews[0].path;
                    } else {
                        this.viewContainer.style['opacity'] = 0;
                        this.firstRender($hash, $ajmRoutes);
                    }

                } else {

                    if (!this.isContainsChildView(this.viewContainer, 'child-views')) {

                        this.firstRender($hash, $ajmRoutes, 'uid0', '/' + $child);
                    } else {
                        this.viewContainer.style['opacity'] = 1;
                        for (var $element = 0; $element < $childViews.length; $element++) {
                            if ($childViews[$element].getAttribute('id') === 'child-views') {
                                $childViews[$element].style.opacity = 0;
                                $childViewContainer = $childViews[$element];
                                break;
                            }
                        }
                        for (var $windex = 0; $windex < $len; $windex++) {
                            $parentpath = $ajmRoutes[$windex].path;
                            if ($ajmRoutes[$windex].childRoutes) {
                                $childRoutes = $ajmRoutes[$windex].childRoutes;
                            } else {
                                continue;
                            }
                            $childRoutes = $ajmRoutes[$windex].childRoutes;
                            for (var $iindex = 0; $iindex < $childRoutes.length; $iindex++) {
                                if ($parentpath + $childRoutes[$iindex].path === location.hash.slice(1)) {
                                    this.$childViewContainer = $childViewContainer;

                                    var isMatch = this.getMatch(location.hash, $ajmLinks);
                                    if (this.$childViewContainer && isMatch) {

                                        this.addHashHandler($childRoutes[$iindex], 'uid1', $child);
                                    } else {
                                        this.firstRender($parentpath, $ajmRoutes, 'uid0', '/' + $child);
                                    }

                                }
                            }
                        }
                    }
                }
            }

            if (!$hash) {

                for (var $i = 0; $i < $len; $i++) {
                    if ($ajmRoutes[$i].path === '/home') {
                        this.addHashHandler($ajmRoutes[$i]);
                    }
                }
            }
        },
        getMatch: function (hash, links) {
            var layerTailReg = /\w+\/(\w+)$/g;
            var hash = hash.slice(1);
            var isMatch = false;

            for (var i = 0; i < links.length; i++) {
                if (layerTailReg.exec(links[i].getAttribute('href').slice(1))) {
                    if (hash.split('/')[1] === links[i].getAttribute('href').slice(1).split('/')[1]) {
                        isMatch = true;
                    } else {
                        isMatch = false;
                    }
                } else {
                    continue;
                }
            }
            return isMatch;
        },
        isContainsChildView: function (parent, child) {
            var isTrue = false;
            var childNodes = parent.getElementsByTagName('div');

            for (var i = 0; i < childNodes.length; i++) {
                if (childNodes[i].getAttribute('id') === child) {
                    isTrue = true;
                    break;
                }
            }
            return isTrue;
        },

        firstRender: function ($hash, $routes, child, _child) {

            var $len = $routes.length;
            // this.viewContainer.style['opacity'] = 0;
            for (var $index = 0; $index < $len; $index++) {
                if ($hash === $routes[$index].path) {
                    this.addHashHandler($routes[$index], child, _child);
                }
            }
        },
        /*
         * @Function { Object }
         * @Comment String：
         * 1. '监听hash值变更，对当前要渲染的ajmLink标签进行高亮处理，如果匹配多个ajmLink标签',则多个ajmLink标签高亮',
         * 2. 处理对应路由要渲染的模板，invoke.render函数，参数为_path，当前路径
         */
        addHashHandler: function (_path, child, _child) {

            var $path = _path.path;
            var $this = this;
            var $local;
            var tmpl = _path.url;

            this.addHighlightHandler(_path);
            $local = this.getLocalStorage('route');
            if (!$local) {
                this.setLocalStorage(_path.path);
            }

            /* @Comment string:
             *  1. 路由的生命周期，在进入路由之前进行拦截并进行业务处理.
             *  2. 配置中没有配置，则不作拦截，直接跳转到当前路由即可.
             *
             */
            if (this.beforeEnter && typeof this.beforeEnter === 'function') {
                this.beforeEnter($local, _path, function (cbpath) {
                    $this.go(cbpath);
                }, this.addConfirmHandler);
            } else {

                if (child === 'uid1') {
                    this.render(_path, this.$childViewContainer, tmpl, child);
                } else if (child === 'uid0') {
                    this.render(_path, this.viewContainer, tmpl, child, _child);
                } else {
                    this.render(_path, this.viewContainer, tmpl);
                }
            }

        },

        addConfirmHandler: function (msg, callback) {
            var _confirmPopWin = '<p>' + msg + '</p>'
                + '<div class="status-btn-body">'
                + '<input type="button" id="yes-btn" class="yes-btn btn" value="确定" />'
                + '<input type="button" id="no-btn" class="no-btn btn" value="取消" />'
                + '</div>';
            var popwin = document.createElement('div');
            var mask = document.createElement('div');
            popwin.id = 'confirmPopwin';
            popwin.className = 'confirmPopwin';
            mask.id = 'maskwin';
            mask.className = 'maskwin';
            document.body.appendChild(mask);
            document.body.appendChild(popwin);
            document.getElementById('confirmPopwin').innerHTML = _confirmPopWin;

            callback && callback();

        },
        addHighlightHandler: function (_path) {

            var $path = _path.path;
            var $needToActived, $selectedElement, $activeLinks = [];
            var $getAllJamLinks, $strSplit;
			var $storeClassNames;
			var headReg; 
            var tailReg;
            var layerHeadReg;
            var layerTailReg;
            var layer0;
            var layer2Reg;
            var currentHash;
            this.jamLinks = this.getElementByClassName('a', 'ajmLink');
            $getAllJamLinks = this.jamLinks;
			//console.log(this.$hash + '             =====$hash');

            if (!this.$hash) {
                this.$hash = '/home';
            }

            // location.hash.slice(1)
            for (var i = 0; i < $getAllJamLinks.length; i++) {
                $needToActived = $getAllJamLinks[i];
                $selectedElement = $needToActived.getAttribute('href').slice(1);
                $strSplit = $selectedElement.split('/');
                currentHash = location.hash.slice(1);

                layerHeadReg = /(\w+)[A-Z]\w+$/g;
                layerTailReg = /\w+\/(\w+)$/g;
                layer2Reg = /(\w+)[A-Z]\w+$/g;

                headReg = layerHeadReg.exec(currentHash);
                tailReg = layerTailReg.exec($selectedElement);
                layer0 = layer2Reg.exec($selectedElement);

                if ('/' + $strSplit[1] === this.$hash && $strSplit[2] === void 0) {
                    for ( var $n = 0; $n < $getAllJamLinks.length; $n++) {
                        $storeClassNames = $getAllJamLinks[$n].className;
                        $storeClassNames = $storeClassNames.replace(/(ajmLink|\bon\b)*/g, '');
                        $storeClassNames = 'ajmLink' + $storeClassNames;
                        $getAllJamLinks[$n].className = $storeClassNames;
                    }
                    $activeLinks.push($getAllJamLinks[i]);
                }

                if ($selectedElement === currentHash) {
                    for ( var ii = 0; ii < $getAllJamLinks.length; ii++ ) {
                        $storeClassNames = $getAllJamLinks[ii].className;
                        $storeClassNames = $storeClassNames.replace(/(ajmLink|\bon\b)*/g, '');
                        $storeClassNames = 'ajmLink' + $storeClassNames;
                        $getAllJamLinks[ii].className = $storeClassNames;
                    }
                    $activeLinks.push($getAllJamLinks[i]);
                }

                if (layer0) {
                    if ('/' + layer0[1] === this.$hash) {
                        (function () {
                            for ( var ii = 0; ii < $getAllJamLinks.length; ii++ ) {
                                $storeClassNames = $getAllJamLinks[ii].className;
                                $storeClassNames = $storeClassNames.replace(/(ajmLink|\bon\b)*/g, '');
                                $storeClassNames = 'ajmLink' + $storeClassNames;
                                $getAllJamLinks[ii].className = $storeClassNames;
                            }

                        }());
                        $activeLinks.push($getAllJamLinks[i]);
                    }
                }
				/*if ($selectedElement !== currentHash) {
					if ($selectedElement === '/home' && currentHash.split('/')[2] === void 0) {
						(function() {
							for ( var ii = 0; ii < $getAllJamLinks.length; ii++ ) {
								$storeClassNames = $getAllJamLinks[ii].className;
								$storeClassNames = $storeClassNames.replace(/(ajmLink|\bon\b)*!/g, '');
								$storeClassNames = 'ajmLink' + $storeClassNames;
								$getAllJamLinks[ii].className = $storeClassNames;
							}
						}());
						$activeLinks.push($getAllJamLinks[i]);
					}
					
				}*/
				
				
                if (headReg && tailReg) {
                    if (headReg[1] === tailReg[1]) {
                        (function() {
                            for (var i = 0; i < $getAllJamLinks.length; i++) {
                                storeClassName = $getAllJamLinks[i].className;
                                storeClassName = storeClassName.replace(/(ajmLink|\bon\b)*/g, '');
                                storeClassName = 'ajmLink' + storeClassName;
                                $getAllJamLinks[i].className = storeClassName;
                            }
                        }());
                        $activeLinks.push($getAllJamLinks[i]);
                    }
                    
                }
            }

            for (var $i = 0; $i < $activeLinks.length; $i++) {
                if (!$activeLinks[$i]) {
                    return
                } else {
                    $activeLinks[$i].className += this.options['routerLinkActive'];
                }
            }
        },
        /*
         * @Function { Object }
         * @Params string:<_path>
         * @Comment String：'发关ajax请求需要渲染的模板,并进行渐进动画效果，当模板渲染完成，执行路由回调.
         */
        render: function (_path, views, tmpl, child, _child) {

            // var $template = _path.url;
            var currentTitle = _path.title;
            var params = _path.params ? _path.params : !1;
            var cb = _path.callback ? _path.callback : !1;
            var $childViews;
            var xhr = null;
            var $this = this;
            var childRoutes = _path.childRoutes;

            /*
             * @Comment: string:<string>
             * 1. 整合路由,knockout框架,
             * 2. 在ko进行数据绑定和渲染时,
             * 3. 通过ko['ajmRouter']访问当前路径,
             * 4. 通过ko['$param']访问当前路径通过配置中传递的参数
             * 5. 获取当前路径参数后, 通过ko.applayBindings(ko['$param'], target),即可在模板中进行渲染.
             * 6. 要和指定api接口返回的数据进行整合,可在ko上下文中通过$.extend(apiResp, ko['$param'])====> ko.applayBindings(mergeData, target);
             * 7. ko上下文激活后，在模板中可通过上下文关键字进行数据访问, 比如：$parent.bindDatas...
             *
            var local$param = localStorage.getItem('$param');
            var $param, $this = this;
            if (local$param) {
                $param = JSON.parse(local$param);
            } else {
                $param = $this.$param ? $this.$param : {};
            }

            if (!ko.hasOwnProperty('ajmRouter')) {
                ko['ajmRouter'] = _path;
            } else {
                ko['ajmRouter'] = _path;
            }
            if (!ko.hasOwnProperty(('$param'))) {
                ko['$param'] = $param;
            } else {
                ko['$param'] = $param;
            }*/

            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                var $ajmLinks = $this.getElementByClassName('a', 'ajmLink');
                var apiUri = _path.apiUrl ? _path.apiUrl + '?' : '';
                var pathParams;

                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.title = currentTitle;

                    for (var $ri = 0; $ri < $ajmLinks.length; $ri++) {
                        if ($ajmLinks[$ri].getAttribute('href').slice(1) === location.hash.slice(1)) {
                            pathParams = eval("(" + $ajmLinks[$ri].getAttribute('params') + ")");
                            break;
                        }
                    }


                    if (typeof pathParams === 'object') {
                        for (var key in pathParams) {
                            apiUri += key + '=' + pathParams[key] + '&';
                        }
                    } else {
                        apiUri = apiUri.replace(/(\?)$/g, '');
                    }


                    if (_path.beforeEnter && typeof _path.beforeEnter === 'function') {
                        _path.beforeEnter(function (resp) {
                            document.title = currentTitle;
                            var local$param = localStorage.getItem('$param');
                            var getTpl = xhr.responseText;
                            var compileTpl = juicer(getTpl);
                            var html;
                            if (local$param && local$param != "undefined") {
                                html = compileTpl.render($.extend(JSON.parse(local$param), resp));
                            } else {
                                html = compileTpl.render($.extend($this.$param ? $this.$param : {}, resp));
                            }

                            $(views).html(html);

                            if (child === 'uid0') {

                                $childViews = $this.viewContainer.getElementsByTagName('div');
                                if ($childViews) {
                                    for (var $c = 0; $c < $childViews.length; $c++) {
                                        if ($childViews[$c].getAttribute('id') === 'child-views') {
                                            views = $childViews[$c];
                                            break;
                                        }
                                    }
                                }


                                if (childRoutes) {
                                    for (var $r = 0; $r < childRoutes.length; $r++) {
                                        if (childRoutes[$r].path === _child) {
                                            _path = childRoutes[$r];
                                            tmpl = childRoutes[$r].url;
                                            break;
                                        }
                                    }
                                }

                                $this.render(_path, views, tmpl, 'uid1');
                            }
                        })
                    } else {
                        +(function() {
                            var local$param = localStorage.getItem('$param');
                            var getTpl = xhr.responseText;
                            var compileTpl = juicer(getTpl);
                            var html;
                            if (local$param && local$param != "undefined") {
                                html = compileTpl.render(JSON.parse(local$param));
                            } else {
                                html = compileTpl.render($this.$param ? $this.$param : {});
                            }
                            $(views).html(html);
                        })();


                        if (child === 'uid0') {

                            $childViews = $this.viewContainer.getElementsByTagName('div');
                            if ($childViews) {
                                for (var $c = 0; $c < $childViews.length; $c++) {
                                    if ($childViews[$c].getAttribute('id') === 'child-views') {
                                        views = $childViews[$c];
                                    }
                                }
                            }


                            if (childRoutes) {
                                for (var $r = 0; $r < childRoutes.length; $r++) {
                                    if (childRoutes[$r].path === _child) {
                                        _path = childRoutes[$r];
                                        tmpl = childRoutes[$r].url;
                                    }
                                }
                            }

                            $this.render(_path, views, tmpl, 'uid1');
                        }
                    }


                    $this.addAnimateHandler(views, 'opacity', 1, function () {
                    });


                    var timer = setTimeout(function () {

                        cb && cb(_path.path, params);
                        $this.addHighlightHandler(_path);
                        clearTimeout(timer);
                    }, 0);

                }
            }
            xhr.open('GET', tmpl, true);
            xhr.send(null);
        },

        getRemoteData: function () {


        },
        go: function (path) {
            var $this = this;
            +(function () {
                if (!path.$param || (typeof path.$param === 'object' && Object.prototype.toString.call(path.$param) !== '[object Object]')) {

                    return;
                } else {

                    $this.$param =  path.$param;
                    localStorage.setItem('$param', JSON.stringify(path.$param));
                }

            })();

             location.hash = path.path;
        },

        setLocalStorage: function (path) {

            if (window.localStorage) {

                localStorage.setItem('route', path ? path : '');
            }
        },

        getLocalStorage: function (key) {

            return localStorage.getItem(key);
        },
        /*
         * @Function { Object }
         * @Params object:<obj> string:<attr> object:<target> function:<callback> number:<delay>
         * @Comment String：'处理动画'
         *
         */
        addAnimateHandler: function (obj, attr, target, callback, delay) {

            var $this = this;
            if (attr == 'opacity') {
                target = target * 100;
            }
            clearInterval(obj.timer);
            obj.timer = setInterval(function () {
                var base = Math.floor(Math.random() * 4) + 17;
                var speed;

                dest = $this.getComputedStyle(obj, attr);
                speed = (target - dest) / base;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if (target === dest) {

                    clearInterval(obj.timer);
                    setTimeout(function () {

                        callback && callback();
                    }, delay);
                } else {
                    if (attr === 'opacity') {

                        obj.style.opacity = (dest + speed) / 100;
                        obj.style.filter = "alpha(opacity:" + (dest + speed) + ")";
                    } else if (attr == 'scrollTop') {

                        obj.scrollTop = (dest + speed);
                    } else {

                        obj.style[attr] = dest + speed + 'px';
                    }

                }


            }, 15);
        },

        getComputedStyle: function (element, attr) {
            var attrVal;
            if (attr === 'opacity') {

                if (window.getComputedStyle) {

                    attrVal = Math.round(parseFloat(document.defaultView.getComputedStyle(element, null)[attr] * 100));
                } else {

                    attrVal = parseInt(element.currentStyle(attr));
                }
            } else if (attr === 'scrollTop') {

                attrVal = element.scrollTop;
            } else {

                if (window.getComputedStyle) {

                    attrVal = parseInt(document.defaultView.getComputedStyle(element, null)[attr])
                } else {

                    attrVal = parseInt(element.currentStyle(attr));
                }
            }
            return attrVal;
        }
    }

    $AjmRouter.version = '1.0.1';

    return $AjmRouter;
}));
