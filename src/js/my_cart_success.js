var app=angular.module("appBuySuccess",[]);
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
            if(!moved && t>10 && t<500){
                if(attrs.tap){
                    scope.$apply(attrs.tap);
                }
            }
        });
    };
});
app.controller("appBuySuccessCt",["$scope","$http",
    function($scope,$http){
    	var homesrc=location.href;
    	var orderId=homesrc.split("=");
    	var orderIdYes=orderId[1];


    	$scope.goodsinfo=null;
    	$scope.getInfo=function(){
    		$http.get(APP_HOST+'/v1/aut/goods/order?orderNo='+orderIdYes,{
    			headers: {
                    'Authorization': APP_TOKEN,
                }
    		}).success(function(data){
    			$scope.goodsinfo=data;
    		})
    	}
    	$scope.getInfo();

    	$scope.linkTo = function(uri,token,id){
            location.href = uri+"?token="+APP_TOKEN+"&id="+id;
        };


    }
])
