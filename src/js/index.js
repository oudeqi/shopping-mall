var app = angular.module("index",[]);
app.constant("contstant",{
    // HOST:"http://192.168.10.254:8080"
    HOST:"https://api.uoolle.com"
});
//http://192.168.10.96:3000/index.html?token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDgyMjAxODEyNzAzIn0.s6AfZ_AmoK0_5_sqYO3Db0eJQaLtvKORk2EYvzr8jzg
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
        this.getData = function(){
            var defer = $q.defer();
            $http.get(contstant.HOST+"/v1/aut/mall/home", {
                headers: {
                    'Authorization': $rootScope.token,
                }
            }).success(function(data){
                defer.resolve(data);
            }).error(function(data){
                defer.reject("error");
            });
            return defer.promise;
        };
    }
]);

app.factory('device',['$window',function($window){
    var userAgent = $window.navigator.userAgent.toLowerCase();
    function find(needle){
        return userAgent.indexOf(needle) !== -1;
    }
    return {
        screenW : function(){
            return parseInt($window.innerWidth);
        },
        iphone : function(){
            return find('iphone');
        },
        android : function(){
            return find('android');
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

app.directive("appBanner",["device",function(device){
    var w = parseInt(device.screenW()),
        h = parseInt(device.screenW() * 450 / 800);
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
                if(scope.token && id){
                    location.href = "/pro_details.html?token="+scope.token+"&id="+id;
                }
            };
        }
    };
}]);

app.controller("index",["$scope","pageDate","device",
    function($scope,pageDate,device){

        $scope.iphone = device.iphone();

        //设备相关
        $scope.proViewW = parseInt(device.screenW() / 2 * 1.5);
        $scope.proViewH = parseInt(device.screenW() * 105 / 166 / 2 * 1.5);

        pageDate.getData().then(function(data){
            console.log("获取首页数据：",data);
            if(data.data && typeof data.data === 'object'){
                $scope.banner = data.data.top;
                $scope.marquee = data.data.scroll;
                $scope.newProduct = data.data.commend;
                $scope.llchg = data.data.food;
                $scope.lltc = data.data.special;
                $scope.llyp = data.data.good;

                $scope.newProductShow = false;
                $scope.llchgShow = false;
                $scope.lltcShow = false;
                $scope.llypShow = false;
            }
        }).catch(function(data){
            console.log(data);
        });

        $scope.back = function(){
            if(typeof h5 == "object"){
                h5.mallBack();
            }
        };

        $scope.linkTo = function(uri,token,id){
            localStorage.isTopCar=1;
            location.href = uri+"?token="+token+"&id="+id;
        };

    }
]);
