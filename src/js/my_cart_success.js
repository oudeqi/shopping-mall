var app=angular.module("appBuySuccess",[]);
app.controller("appBuySuccessCt",function($scope,$http){
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


})