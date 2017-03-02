var app = angular.module("category",[]);
app.constant("contstant",{
    HOST:"http://192.168.10.254:8080"
});
//http://192.168.10.96:3000/category.html?token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDgyMjAxODEyNzAzIn0.s6AfZ_AmoK0_5_sqYO3Db0eJQaLtvKORk2EYvzr8jzg#llyp
app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }
]);

app.run(['$rootScope', '$location',"$window",
    function($rootScope, $location,$window) {
        $rootScope.token = $location.search().token;
        localStorage.token=$rootScope.token;
    }
]);

app.service("pageDate",["$http","$rootScope","$q","contstant",
    function($http,$rootScope,$q,contstant){

        // 优品
        var yp = {
            pageIndex: 1,
            pageSize: 20
        };
        this.yp = {
            next: function(){
                var defer = $q.defer();
                $http.get(contstant.HOST+"/v1/aut/goods/list", {
                    headers: {
                        'Authorization': $rootScope.token,
                    },
                    params:{
                        type: 3,
                        pageIndex:yp.pageIndex,
                        pageSize:yp.pageSize
                    }
                }).success(function(data){
                    if(data.data && typeof data.data === 'object'){
                        yp.pageIndex++;
                        defer.resolve(data);
                    }else{
                        defer.reject(data);
                    }

                }).error(function(data){
                    defer.reject("error");
                });
                return defer.promise;
            }
        };

        // 吃货馆
        var chg = {
            pageIndex: 1,
            pageSize: 20
        };
        this.chg = {
            next: function(){
                var defer = $q.defer();
                $http.get(contstant.HOST+"/v1/aut/goods/list", {
                    headers: {
                        'Authorization': $rootScope.token,
                    },
                    params:{
                        type: 2,
                        pageIndex:chg.pageIndex,
                        pageSize:chg.pageSize
                    }
                }).success(function(data){
                    if(data.data && typeof data.data === 'object'){
                        chg.pageIndex++;
                        defer.resolve(data);
                    }else{
                        defer.reject(data);
                    }

                }).error(function(data){
                    defer.reject("error");
                });
                return defer.promise;
            }
        };

        // 特产
        var lltc = {
            pageIndex: 1,
            pageSize: 20
        };
        this.lltc = {
            next: function(){
                var defer = $q.defer();
                $http.get(contstant.HOST+"/v1/aut/goods/list", {
                    headers: {
                        'Authorization': $rootScope.token,
                    },
                    params:{
                        type: 1,
                        pageIndex:lltc.pageIndex,
                        pageSize:lltc.pageSize
                    }
                }).success(function(data){
                    if(data.data && typeof data.data === 'object'){
                        lltc.pageIndex++;
                        defer.resolve(data);
                    }else{
                        defer.reject(data);
                    }

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
        screenW : parseInt($window.innerWidth)
    };
}]);

app.directive("appBanner",["device",function(device){
    var w = parseInt(device.screenW * 1.5),
        h = parseInt(device.screenW * 163 / 375 * 1.5);
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
                        autoTime:4000,
                        pagination:true
                    });
                }
            });
        }
    };
}]);
app.directive('tap',function(){
    return function(scope, elem, attrs){
        var start,end,t,moved = false;
        elem.bind('touchstart',function(e){
            start = e.timeStamp;
            moved = false;
            elem.css("opacity","0.7");
        });
        elem.bind('touchmove',function(e){
            // e.preventDefault();
            moved = true;
        });
        elem.bind('touchend',function(e){
            elem.css("opacity","1");
            end = e.timeStamp;
            t = end - start;
            if(!moved && t>30 && t<500){
                if(attrs.tap){
                    scope.$apply(attrs.tap);
                }
            }
        });
    };
});
app.controller("category",["$scope","pageDate","device",
    function($scope,pageDate,device){

        //设备相关
        $scope.proViewW = parseInt(device.screenW / 2 * 1.5);
        $scope.proViewH = parseInt(device.screenW * 105 / 166 / 2 * 1.5);
        function getBanner(array){
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if(array[i].top == '1'){
                    res.push(array[i]);
                }
            }
            return res;
        }
        function getList(array){
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if(array[i].top == '0'){
                    res.push(array[i]);
                }
            }
            return res;
        }

        $scope.type = 1;//列表类型 1特产 2吃货 3优品

        $scope.lltc = {
            list:[],
            banner:[],
            rowCount:0
        };
        //获取地方特产
        pageDate.lltc.next().then(function(data){
            console.log("获取地方特产：",data);
            $scope.lltc.banner = getBanner(data.data.data);
            $scope.lltc.list = getList(data.data.data);
            $scope.lltc.rowCount = $scope.lltc.list.length;
        }).catch(function(data){
            console.log(data);
        });

        $scope.lltcNext = function(){
            console.log($scope.lltc);
            pageDate.lltc.next().then(function(data){
                console.log("获取地方特产：",data);
                var array = data.data.data;
                for (var i = 0; i < array.length; i++) {
                    $scope.lltc.list.push(array[i]);
                }
                $scope.lltc.rowCount = data.data.data.length;
                console.log($scope.lltc);
            }).catch(function(data){
                console.log(data);
            });
        };


        $scope.chg = {
            list:[],
            banner:[],
            rowCount:0
        };
        //获取吃货管
        pageDate.chg.next().then(function(data){
            console.log("获取吃货管：",data);
            $scope.chg.banner = getBanner(data.data.data);
            $scope.chg.list = getList(data.data.data);
            $scope.chg.rowCount = $scope.chg.list.length;
        }).catch(function(data){
            console.log(data);
        });
        $scope.chgNext = function(){
            console.log($scope.chg);
            pageDate.chg.next().then(function(data){
                console.log("获取地方特产：",data);
                var array = data.data.data;
                for (var i = 0; i < array.length; i++) {
                    $scope.chg.list.push(array[i]);
                }
                $scope.chg.rowCount = data.data.data.length;
                console.log($scope.chg);
            }).catch(function(data){
                console.log(data);
            });
        };


        $scope.yp = {
            list:[],
            banner:[],
            rowCount:0
        };
        //获取优品
        pageDate.yp.next().then(function(data){
            console.log("获取优品：",data);
            $scope.yp.banner = getBanner(data.data.data);
            $scope.yp.list = getList(data.data.data);
            $scope.yp.rowCount = $scope.yp.list.length;
        }).catch(function(data){
            console.log(data);
        });
        $scope.ypNext = function(){
            console.log($scope.yp);
            pageDate.yp.next().then(function(data){
                console.log("获取地方特产：",data);
                var array = data.data.data;
                for (var i = 0; i < array.length; i++) {
                    $scope.yp.list.push(array[i]);
                }
                $scope.yp.rowCount = data.data.data.length;
                console.log($scope.yp);
            }).catch(function(data){
                console.log(data);
            });
        };

        $scope.linkTo = function(uri,token,id){
            location.href = uri+"?token="+token+"&id="+id;
        };
    }
]);
