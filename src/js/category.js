var app = angular.module("category",["ngRoute"]);
app.constant("contstant",{
    // HOST:"http://192.168.10.254:8080"
    HOST:"https://api.uoolle.com"
});
//http://192.168.10.96:3000/category.html?token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDgyMjAxODEyNzAzIn0.s6AfZ_AmoK0_5_sqYO3Db0eJQaLtvKORk2EYvzr8jzg#llyp
/*
resolve: {
    delay: function($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 1000);
        return delay.promise;
    }
}
 */
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/dftc', {
            templateUrl: 'list.html',
            controller: 'getDftcList'
        })
        .when('/chg', {
            templateUrl: 'list.html',
            controller: 'getChgList'
        }).when('/llyp', {
            templateUrl: 'list.html',
            controller: 'getLlypList'
        })
        .otherwise({
            redirectTo: '/dftc'
        });
    }
]);

app.run(['$rootScope', '$location',"$window","device",
    function($rootScope, $location,$window,device) {

        $rootScope.token = localStorage.token;
        $rootScope.proViewW = parseInt(device.screenW() / 2 * 1.5);
        $rootScope.proViewH = parseInt(device.screenW() * 105 / 166 / 2 * 1.5);
        $rootScope.linkTo = function(uri,token,id){
            localStorage.isTopCar=1;
            if(token){
                uri = uri+"?token="+token;
            }
            if(id){
                uri = uri+"&id="+id;
            }
            location.href = uri;
        };
        $rootScope.getBanner = function(array){
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if(array[i].top == '1'){
                    res.push(array[i]);
                }
            }
            return res;
        };
        $rootScope.getList = function(array){
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if(array[i].top == '0'){
                    res.push(array[i]);
                }
            }
            return res;
        };
        console.log($rootScope.token);
        $rootScope.$on('$routeChangeSuccess',function(event, current, previous){
           console.log(current.$$route.originalPath);
          $rootScope.currentPath = current.$$route.originalPath;
       });
    }
]);

app.service("pageDate",["$http","$rootScope","$q","contstant",
    function($http,$rootScope,$q,contstant){

        // 吃货馆
        var chg = {
            pageSize: 20,
            type:2
        };
        this.chg = {
            next: function(pageIndex){
                var defer = $q.defer();
                $http.get(contstant.HOST+"/v1/aut/goods/list", {
                    headers: {
                        'Authorization': $rootScope.token,
                    },
                    params:{
                        type: chg.type,
                        pageIndex:pageIndex,
                        pageSize:chg.pageSize
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
            }
        };

        // 特产
        var dftc = {
            pageSize: 20,
            type: 1
        };
        this.dftc = {
            next: function(pageIndex){
                var defer = $q.defer();
                $http.get(contstant.HOST+"/v1/aut/goods/list", {
                    headers: {
                        'Authorization': $rootScope.token,
                    },
                    params:{
                        type: dftc.type,
                        pageIndex:pageIndex,
                        pageSize:dftc.pageSize
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
            }
        };

        // 优品
        var yp = {
            pageSize: 20,
            type: 3
        };
        this.yp = {
            next: function(pageIndex){
                var defer = $q.defer();
                $http.get(contstant.HOST+"/v1/aut/goods/list", {
                    headers: {
                        'Authorization': $rootScope.token,
                    },
                    params:{
                        type: yp.type,
                        pageIndex:pageIndex,
                        pageSize:yp.pageSize
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
        h = parseInt(device.screenW() * 350 / 800);
    return {
        restrict: 'E',
        replace: true,
        scope:{
            banner:'=bannerArr',
            token:'@'
        },
        template:function(element, attrs){
            var tpl = '<div class="banner">';
                tpl +=      '<ul class="pic-view">';
                tpl +=          '<li ng-repeat="item in banner track by $index">';
                tpl +=              '<a href="javascript:void(0);" ng-click="linkTo(item.id)">';
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
            scope.linkTo = function(id){
                localStorage.isTopCar=1;
                if(scope.token && id){
                    location.href = "/pro_details.html?token="+scope.token+"&id="+id;
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

app.controller("nav",["$scope",function($scope){
    $scope.back = function(){
        if(typeof h5 == "object"){
            h5.mallBack();
        }
    };
    $scope.linkTo = function(uri,token,id){
        if(token){
            uri = uri+"?token="+token;
        }
        if(id){
            uri = uri+"&id="+id;
        }
        location.href = uri;
    };
}]);

app.controller("getDftcList",["$scope","pageDate","device","$rootScope",
    function($scope,pageDate,device,$rootScope){

        $scope.pageIndex = 1;
        $scope.list = [];
        $scope.banner = [];
        $scope.rowCount = 0;
        pageDate.dftc.next($scope.pageIndex).then(function(data){
            console.log("获取地方特产：",data);
            $scope.pageIndex ++;
            $scope.banner = $rootScope.getBanner(data.data.data);
            $scope.list = $rootScope.getList(data.data.data);
            $scope.rowCount = $scope.list.length;
        }).catch(function(data){
            console.log(data);
        });

        $scope.next = function(){
            pageDate.dftc.next($scope.pageIndex).then(function(data){
                console.log("获取地方特产：",data);
                $scope.pageIndex ++;
                var array = data.data.data;
                for (var i = 0; i < array.length; i++) {
                    $scope.list.push(array[i]);
                }
                $scope.rowCount = data.data.data.length;
                console.log($scope.list,$scope.banner,$scope.rowCount);
            }).catch(function(data){
                console.log(data);
            });
        };
    }
]);

app.controller("getChgList",["$scope","pageDate","device","$rootScope",
    function($scope,pageDate,device,$rootScope){

        $scope.pageIndex = 1;
        $scope.list = [];
        $scope.banner = [];
        $scope.rowCount = 0;
        pageDate.chg.next($scope.pageIndex).then(function(data){
            console.log("获取吃货馆：",data);
            $scope.pageIndex ++;
            $scope.banner = $rootScope.getBanner(data.data.data);
            $scope.list = $rootScope.getList(data.data.data);
            $scope.rowCount = $scope.list.length;
        }).catch(function(data){
            console.log(data);
        });

        $scope.next = function(){
            pageDate.chg.next($scope.pageIndex).then(function(data){
                console.log("获取吃货馆：",data);
                $scope.pageIndex ++;
                var array = data.data.data;
                for (var i = 0; i < array.length; i++) {
                    $scope.list.push(array[i]);
                }
                $scope.rowCount = data.data.data.length;
                console.log($scope.list,$scope.banner,$scope.rowCount);
            }).catch(function(data){
                console.log(data);
            });
        };
    }
]);

app.controller("getLlypList",["$scope","pageDate","device","$rootScope",
    function($scope,pageDate,device,$rootScope){

        $scope.pageIndex = 1;
        $scope.list = [];
        $scope.banner = [];
        $scope.rowCount = 0;
        pageDate.yp.next($scope.pageIndex).then(function(data){
            console.log("获取联联优品：",data);
            $scope.pageIndex ++;
            $scope.banner = $rootScope.getBanner(data.data.data);
            $scope.list = $rootScope.getList(data.data.data);
            $scope.rowCount = $scope.list.length;
        }).catch(function(data){
            console.log(data);
        });

        $scope.next = function(){
            pageDate.yp.next($scope.pageIndex).then(function(data){
                console.log("获取联联优品：",data);
                $scope.pageIndex ++;
                var array = data.data.data;
                for (var i = 0; i < array.length; i++) {
                    $scope.list.push(array[i]);
                }
                $scope.rowCount = data.data.data.length;
                console.log($scope.list,$scope.banner,$scope.rowCount);
            }).catch(function(data){
                console.log(data);
            });
        };

    }
]);
