var app=angular.module("appEms",[]);
app.controller("appEmsCt",function($scope,$http){
	var homesrc=location.href;
	var emsId=homesrc.split("=");
	var emsIdTrue=emsId[1];
	$scope.redColor={
		"color":"#fb4747",
	}

	$scope.ems=null;
	$scope.getEms=function(){
		$http.get(APP_HOST+'/v1/aut/goods/road?id='+emsIdTrue,{
			headers: {
                'Authorization': APP_TOKEN,
            }
		}).success(function(data){
			$scope.ems=data;
			console.log(data)
		})
	}
	$scope.getEms();

	console.log(emsIdTrue)
})