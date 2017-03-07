var app = angular.module("pro_details",[]);
app.constant("contstant",{
    // HOST:"http://192.168.10.254:8080"
    HOST:"https://api.uoolle.com"
});

//http://192.168.10.96:3000/pro_details.html?id=102&token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDgyMjAxODEyNzAzIn0.s6AfZ_AmoK0_5_sqYO3Db0eJQaLtvKORk2EYvzr8jzg#llyp

app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);

app.run(['$rootScope', '$location',"$window",
    function($rootScope, $location,$window) {
        $rootScope.token = $location.search().token;
        $rootScope.id = $location.search().id;
        localStorage.token=$rootScope.token;
    }
]);

app.service("pageDate",["$http","$rootScope","$q","contstant",
    function($http,$rootScope,$q,contstant){
        this.getDetails = function(){
            var defer = $q.defer();
            $http.get(contstant.HOST+"/v1/aut/goods/info", {
                headers: {
                    'Authorization': $rootScope.token,
                },
                params:{
                    id:$rootScope.id,
                }
            }).success(function(data){
                if(data.data && typeof data.data === 'object'){
                    defer.resolve(data);
                }else{
                    defer.reject(data);
                }
            }).error(function(data){
                defer.reject("error");
            });
            return defer.promise;
        };
    }
]);

app.factory("cart",["$http","$q","contstant","$rootScope",
    function($http,$q,contstant,$rootScope){
        return {
            get: function(){
                var defer = $q.defer();
                $http.get(contstant.HOST+"/v1/aut/goods/shopping/cart", {
                    headers: {
                        'Authorization': $rootScope.token,
                    }
                }).success(function(data){
                    if(data.data && typeof data.data === 'object'){
                        defer.resolve(data);
                    }else{
                        defer.reject(data);
                    }
                }).error(function(data){
                    defer.reject("error");
                });
                return defer.promise;
            },
            add: function(obj){
                var defer = $q.defer();
                $http.post(contstant.HOST+"/v1/aut/goods/shopping/cart", obj,{
                    headers: {
                        'Authorization': $rootScope.token,
                    }
                }).success(function(data){
                    defer.resolve(data);
                }).error(function(data){
                    defer.reject("error");
                });
                return defer.promise;
            },
            order: function(obj){
                var defer = $q.defer();
                $http.post(contstant.HOST+"/v1/aut/goods/order", obj,{
                    headers: {
                        'Authorization': $rootScope.token,
                    }
                }).success(function(data){
                    defer.resolve(data);
                }).error(function(data){
                    defer.reject("error");
                });
                return defer.promise;
            }
        };
    }
]);
app.factory('device',['$window',function($window){
    return {
        screenW : function(){
            return parseInt($window.innerWidth);
        }
    };
}]);

app.directive("appBanner",["device",function(device){
    var w = parseInt(device.screenW()),
        h = parseInt(device.screenW() * 450 / 800);
    return {
        restrict: 'E',
        replace: true,
        scope:{
            banner:'=bannerArr'
        },
        template:function(element, attrs){
            var tpl = '<div class="banner">';
                tpl +=      '<ul class="pic-view">';
                tpl +=          '<li ng-repeat="item in banner track by $index">';
                tpl +=              '<a href="javascript:void(0);">';
                tpl +=                  '<img ng-src="{{item.previewUrl}}?x-oss-process=image/resize,m_fill,h_'+h+',w_'+w+'" />';
                tpl +=              '</a>';
                tpl +=          '</li>';
                tpl +=      '</ul>';
                tpl += '</div>';
            return tpl;
        },
        link:function(scope, element, attrs){
            scope.$watch("banner",function(nv,ov){
                if(scope.banner && scope.banner.length > 0){
                    photoSlide({
                        wrap: element[0],
                        loop: true,
                        autoPlay:true,
                        autoTime:8000,
                        pagination:true
                    });
                }
            });
        }
    };
}]);

app.directive("buyNow",["device","$document",function(device,$document){
    var w = parseInt(device.screenW() / 3);
    return {
        restrict: 'E',
        replace: true,
        scope:{
            cart:'=buyModel',
            click:'=buyClick',
            next:'&'
        },
        controller:["$scope",function($scope){
            $scope.click = false;
        }],
        template:function(element, attrs){
            var tpl = '';
                tpl += '<div class="popup_content">';
                tpl += '    <div class="popup_buy" ng-show="click">';
                tpl += '        <div class="shade"></div>';
                tpl += '        <div class="content">';
                tpl += '            <button class="close" type="button" tap="close()" name="button"></button>';
                tpl += '            <div class="con">';
                tpl += '                <div class="t">';
                tpl += '                    <div class="l">';
                tpl += '                        <img ng-src="{{cart.img}}?x-oss-process=image/resize,m_fill,h_'+w+',w_'+w+'" alt="">';
                tpl += '                    </div>';
                tpl += '                    <div class="r">';
                tpl += '                        <h3 class="tit" ng-bind="cart.name"></h3>';
                tpl += '                        <span class="price" ng-bind="cart.money | currency:\'￥\'"></span>';
                tpl += '                    </div>';
                tpl += '                </div>';
                tpl += '                <div class="b">';
                tpl += '                    <div class="l">购买数量：</div>';
                tpl += '                    <div class="r">';
                tpl += '                        <button ng-disabled="cart.quantity==1" class="minus" type="button" tap="minus()" name="button">-</button>';
                tpl += '                        <span ng-bind="cart.quantity"></span>';
                tpl += '                        <button ng-disabled="cart.quantity==cart.remainNumber" class="plus" type="button" tap="plus()" name="button">+</button>';
                tpl += '                    </div>';
                tpl += '                </div>';
                tpl += '            </div>';
                tpl += '            <div class="btn">';
                tpl += '                <button class="next" type="button" tap="next()" name="button">下一步</button>';
                tpl += '            </div>';
                tpl += '        </div>';
                tpl += '    </div>';
                tpl += '</div>';
            return tpl;
        },
        link:function(scope, element, attrs){
            scope.$watch("click",function(nv,ov){
                if(nv){
                    $document.bind("touchstart",function(e){
                        if(e.target.className != "close" && e.target.className != "minus" && e.target.className != "plus" && e.target.className != "next"){
                            e.preventDefault();
                        }
                    });
                }else{
                    $document.unbind("touchstart");
                }
            });
            scope.close = function(){
                scope.click = false;
            };
            scope.plus = function(){
                if(scope.cart.quantity<scope.cart.remainNumber){
                    scope.cart.quantity++;
                }
            };
            scope.minus = function(){
                if(scope.cart.quantity>1){
                    scope.cart.quantity--;
                }
            };
        }
    };
}]);

app.directive('tap',function(){
    return function(scope, elem, attrs){
        var start,end,t,moved = false;
        elem.bind('touchstart',function(e){
            start = e.timeStamp;
            moved = false;
            elem.css({
                "opacity":"0.7"
            });
        });
        elem.bind('touchmove',function(e){
            end = e.timeStamp;
            t = end - start;
            if(t>300){
                e.preventDefault();
            }
            moved = true;
        });
        elem.bind('touchend',function(e){
            elem.css({
                "opacity":"1"
            });
            end = e.timeStamp;
            t = end - start;
            if(!moved && t>10 && t<300){
                if(attrs.tap){
                    scope.$apply(attrs.tap);
                }
            }
        });
    };
});

app.controller("pro_details",["$scope","pageDate","device","$sce","cart",
    function($scope,pageDate,device,$sce,cart){

        //设备相关
        $scope.proViewW = parseInt(device.screenW() / 2 * 1.5);
        $scope.proViewH = parseInt(device.screenW() * 105 / 166 / 2 * 1.5);

        cart.get().then(function(data){
            console.log("获取购物车",data);
            $scope.cartAll = data.data;
        }).catch(function(data){
            console.log(data);
        });

        pageDate.getDetails().then(function(data){
            console.log("获取详情：",data);
            $scope.ok = true;
            var banner = [];
            for (var i = 0; i < data.data.imgList.length; i++) {
                var obj = {
                    previewUrl:data.data.imgList[i]
                };
                banner.push(obj);
            }
            $scope.banner = banner;
            $scope.title = data.data.title;
            $scope.price = data.data.price;
            $scope.deduction = data.data.deduction;
            $scope.originalPrice = data.data.originalPrice;
            var start,end,content;
            if(data.data.content.indexOf('<body>') !== -1){
                start = data.data.content.indexOf('<body>')+6;
                end = data.data.content.indexOf('</body>');
                content = data.data.content.substring(start,end);
            }else{
                content = data.data.content;
            }
            // console.log(content);
            $scope.content = $sce.trustAsHtml(content);
            //立即购买
            $scope.cart.id = data.data.id;
            $scope.cart.name = data.data.title;
            $scope.cart.img = data.data.previewUrl;
            $scope.cart.money = data.data.price;
            $scope.cart.remainNumber = data.data.remainNumber;
            //购物车
            $scope.cartObj = {
                goodsId:data.data.id,
                number:1
            };
        }).catch(function(data){
            console.log(data);
        });

        $scope.cart = {
            id:null,
			name:null,
			img:null,
			money:0,
			quantity:1, //数量
            remainNumber:0
		};

        $scope.buyClick = false;
        $scope.buy = function(){
            $scope.buyClick = true;
        };
        $scope.linkTo = function(uri,token,id){
            // location.href = uri+"?token="+token+"&id="+id;
            localStorage.isTopCar=2; //不是顶部导航
            if(token){
                uri = uri+"?token="+token;
            }
            if(id){
                uri = uri+"&id="+id;
            }
            location.href = uri;
        };
        $scope.pageBack = function() {
            history.go(-1);
        };

        $scope.addCart = function(){
            cart.add($scope.cartObj).then(function(data){
                console.log("添加购物车",data);
                $scope.cartAll.push($scope.cartObj);
                console.log($scope.cartAll);
            }).catch(function(data){
                console.log(data);
            });
        };

        // 下单
        $scope.nextClicked = false;
        $scope.next = function(){
            console.log($scope.cart);
            if($scope.nextClicked){
                return;
            }
            $scope.nextClicked = true;
            cart.order([{
                goodsId:$scope.cart.id,
                number:$scope.cart.quantity
            }]).then(function(data){
                console.log(data);
                if(data.data && typeof data.data === 'object'){
                    localStorage.payAllx=JSON.stringify(data.data);
                    localStorage.payOrderNo=data.data.orderNo;
                    localStorage.payMoney=data.data.money;
                    window.location.href="/pay.html"
                    //下单成功
                    // if(typeof h5 == "object"){
                    //     h5.mallPay(JSON.stringify(data));
                    // }
                }else{
                    //下单失败
                    $scope.nextClicked = false;
                }
            }).catch(function(data){
                $scope.nextClicked = false;
            });
        };
    }
]);

function mallPaySucc(id){
    location.href = "./my_cart_success.html?id="+id;
    // var ctrlElement = document.querySelector('[ng-controller="pro_details"]');
    // var $scope = angular.element(ctrlElement).scope();
    // $scope.getRewardList();//改变了模型，想同步到控制器中，则需要调用$apply()
    // $scope.$apply();
}
