(function () {
    /*
     * @Date 2017.07.27
     * @Object routes:<{}>
     * @Title string '路由相关配置'
     * @Comment string:
     *    path: 路径:<string>
     *    url: 要渲染的模板:<string>
     *    params: 需要在路由中传递的参数:<object--->key:value>
     *    callback: 注：模板渲染完成执行的回调，所有对模板的业务，交互操作将放在回调函数中自毁执行.
     *    后续功能待完善.
     * @Author zhuxl
     *
     *
     * */
    var routes = [{
        path: '/',
        url: './pages/home.html',
        title: '移动威胁感知',
        params: {
            name: '/',
            id: 200717026,
            state: true
        },
        callback: function () {
            var path, params;
            if (!arguments[1]) {

                params = {};
            } else {

                path = arguments[0];
                params = arguments[1];
            }

            /*var _formsubmit = $('#loginsubmit');
             var _form = document.getElementById('formlogin');

             var _uuid = $('#uuid');
             var _eeid = $('#eid');

             var _pwd = $('#nloginpwd');
             var _name = $('#loginname');

             _formsubmit.on('click', function() {
             var $pwd = _pwd.val();
             var $name = _name.val();
             _uuid.val($name);
             _eeid.val($pwd);
             console.log(_uuid.val());
             console.log(_eeid.val());
             _pwd.val('');
             _name.val('');
             _form.submit();


             });*/

        }
    },
        {
            path: '/home',
            url: './pages/home.html',
            title: '移动威胁感知',
            params: {
                name: '/home',
                id: 2000170726,
                state: false
            },
            callback: function () {
                var path, params;
                childRouteOperation();
                if (!arguments[1]) {

                    params = {};
                } else {

                    path = arguments[0];
                    params = arguments[1];
                }

                function childRouteOperation() {
                }

            }
        },
        {
            path: '/perceptionApp',
            url: './pages/list.html',
            title: '移动威胁感知',
            params: {},
            beforeEnter: function (cb) {
                indexService.getlist(function (resp) {
                	resp.url = setting.resourceServerUrl+"/api/static/view";
                    if (resp.status == 200) {
                        cb(resp);
                    } else {
                        console.log("服务器繁忙！");
                    }
                });
            },
            callback: function () {
                var s = document.getElementsByTagName('script');
                var a = [];
                var ns = null;
                (function () {
                    for (var i = 0; i < s.length; i++) {
                        if (s[i].className.split(' ')[0] === 'childScript') {
                            a.push(s[i]);
                        }
                    }
                }());

                (function () {
                    for (var i = 0; i < a.length; i++) {
                        ns = document.createElement('script');
                        ns.innerHTML = s[i].innerHTML;
                        document.body.appendChild(ns);
                        document.body.removeChild(ns);
                    }

                }());
                (function () {
                	if($("#listvalue").val() == 1){
                		$(".creatapp").click();
                		$("#listvalue").val("");
                	}else{
                		
                	}
                   	
                }())
            }
        },
        {
            path: '/perception',
            url: './pages/perception/main.html',
            title: '移动威胁感知',
            apiUrl: '',
            params: {
                name: '/account',
                id: 2000170728,
                state: true
            },
            childRoutes: [{
                path: '/view',
                url: './pages/perception/overview.html',
                title: '移动威胁感知',
                apiUrl: '',
                params: {},
                beforeEnter: function (cb) {
                    viewService.getappdetail(function (resp) {
                        if (resp.status == 200) {
							resp.url = setting.resourceServerUrl+"/api/static/view";
                            resp.deviceType = sessionStorage.getItem("deviceType");
                            cb(resp);
                        } else {
                            console.log("服务器繁忙！");
                        }
                    });
                }
            }, {
                path: '/attackDetail',
                url: './pages/perception/attackdetail.html',
                title: '移动威胁感知',
                params: {},
                callback: function () {
                   // console.log('攻击详情')
                },
                beforeEnter: function (cb) {
                    attackDetailService.getattackdetail(function (resp) {
                        if (resp.status == 200) {
                            cb(resp);
                        } else {
                          //  console.log("服务器繁忙！");
                        }
                    });
                }
            },

                {
                    path: '/attack',
                    url: './pages/perception/attack.html',
                    title: '移动威胁感知',
                    params: {},
                    callback: function () {
                      //  console.log('攻击感知');
                        var type=$("#times").val();
                        if(type==1){
                        	$(".equipment_tit").find("a.times").click();
                        	$("#times").val("");
                        }
                    }
                }, {
                    path: '/user',
                    url: './pages/perception/user.html',
                    title: '移动威胁感知',
                    callback: function () {
                      //  console.log('用户感知')
                    }
                }, {
                    path: '/userDetail',
                    url: './pages/perception/userdetail.html',
                    title: '移动威胁感知',
                    callback: function () {
                       // console.log('用户感知')
                    }
                }, {
                    path: '/virus',
                    url: './pages/perception/virus.html',
                    title: '移动威胁感知',
                    params: {},
                    callback: function () {
                      //  console.log('病毒感知')
                    }
                }, {
                    path: '/virusDetail',
                    url: './pages/perception/virusdetail.html',
                    title: '移动威胁感知',
                    params: {},
                    callback: function () {
                      //  console.log('病毒感知')
                    }
                }, {
                    path: '/response',
                    url: './pages/perception/response.html',
                    title: '移动威胁感知',
                    params: {},
                    beforeEnter: function (callback) {
                        var appKey = sessionStorage.getItem("appKey");
                        if (!appKey) {
                            appKey = "4ffb61dc34fe406cbabaefbd64473977";
                        }
                        responseService.findAppStrategy(appKey, function (resp) {
                            
                            var data = resp.data;
                            callback.call(this, data);
                        });
                    },
                    callback: function () {
                     //   console.log('响应策略')
                    }
                }
            ],
            callback: function () {
                var path, params;
                if (!arguments[1]) {

                    params = {};
                } else {

                    path = arguments[0];
                    params = arguments[1];
                }
              //  console.log('perception')
            }
        },
        {
            path: '/manager',
            url: './pages/manager/main.html',
            title: '移动威胁感知',
            params: {
                name: '/account',
                id: 2000170728,
                state: true
            },
            childRoutes: [{
                path: '/user',
                url: './pages/manager/user.html',
                title: '移动威胁感知',
                params: {},
                callback: function () {
                //    console.log('账号管理')
                }
            }, {
                path: '/sdk',
                url: './pages/manager/sdk.html',
                title: '移动威胁感知',
                params: {},
                beforeEnter: function (callback) {
                    sdkService.findSdkList(function (resp) {
                        var data = resp;
                        callback.call(this, data);
                    });
                },
                callback: function () {
                 //   console.log('sdk管理')
                }
            }, {
                path: '/us',
                url: './pages/manager/about.html',
                title: '移动威胁感知',
                params: {},
                beforeEnter: function (callback) {
                    //查询关于我们信息接口
                    aboutService.findAbout(function (resp) {
                        //响应数据
                        var data = resp.data;
                        callback.call(this, data);
                    });
                },
                callback: function () {
                  //  console.log('关于我们')
                }
            }],
            callback: function () {
                var path, params;
                if (!arguments[1]) {

                    params = {};
                } else {

                    path = arguments[0];
                    params = arguments[1];
                }
              //  console.log('manager66')
            }
        }
    ];
    this.routes = routes;
}(this));