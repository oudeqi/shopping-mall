var app = angular.module("index",[]);
app.constant("contstant",{
    HOST:"http://192.168.10.254:8080"
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
    return {
        screenW : parseInt($window.innerWidth)
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
app.directive("eleFixedTop",["$document","$interval",
    function($document,$interval){
        return function(scope, element, attrs){
            // var offsetTop = element[0].offsetTop;
            // function fix(){
            //     var scrollTop = $document.find("body")[0].scrollTop;
            //     if(parseInt(scrollTop - offsetTop) > 8){
            //         element.css({
            //             "position": "fixed",
            //             "top": "0",
            //             "width": "100%"
            //         });
            //     }else{
            //         element.css({
            //             "position": "static",
            //             "top": "0",
            //             "width": "100%"
            //         });
            //     }
            // }
            // $interval(function(x){
            //     fix();
            // },30);
            // $document.bind("touchend scroll",function(){
            //     fix();
            // });
        };
    }
]);

app.directive("appBanner",["device",function(device){
    var w = parseInt(device.screenW * 1.5),
        h = parseInt(device.screenW * 266 / 375 * 1.5);
    return {
        restrict: 'E',
        replace: true,
        scope:{
            banner:'=bannerArr',
            tap:'&tap'
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

app.controller("index",["$scope","pageDate","device",
    function($scope,pageDate,device){

        //设备相关
        $scope.proViewW = parseInt(device.screenW / 2 * 1.5);
        $scope.proViewH = parseInt(device.screenW * 105 / 166 / 2 * 1.5);

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
                h5.back();
            }
        };

        $scope.linkTo = function(uri,token,id){
            location.href = uri+"?token="+token+"&id="+id;
        };

    }
]);
