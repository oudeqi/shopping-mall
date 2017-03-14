var app=angular.module("appInfo",[]);
app.controller("appInfoCt",["$scope","$http",
	function($scope,$http){
		var homesrc=location.href;
		var orderId=homesrc.split("=");

		console.log(orderId)
		console.log(orderId[1])
		$scope.schedule=[{
			name:"下单",
			id:0,
			gid:null,
		},{
			name:"付款",
			id:1,
			gid:null,
		},{
			name:"发货",
			id:2,
			gid:null,
		},{
			name:"完成",
			id:3,
			gid:null,
		}];

		$scope.oneColor={'color':'#848689'};
		$scope.twoColor={'background-color':'#848689'};
		$scope.threeColor={'color':'#11cd6e'};
		$scope.colorNumber=null;
		$scope.colorObject={
			one:false,
			two:false,
			three:false,
			four:false,
		}


		$scope.goodsinfo=null;
		$scope.getInfo=function(){
			$scope.colorObject=$scope.colorObject;
			$http.get(APP_HOST+'/v1/aut/goods/order?orderNo='+orderId[1],{
				headers: {
	                'Authorization': APP_TOKEN,
	            }
			}).success(function(data){
				$scope.goodsinfo=data;
				var csNumber=parseInt($scope.goodsinfo.data.orders[0].status);
				switch(csNumber){
					case 1:
						$scope.colorObject.one=true;
						break;
					case 2:
						$scope.colorObject.one=true;
						$scope.colorObject.two=true;
						break;
					case 3:
						$scope.colorObject.one=true;
						$scope.colorObject.two=true;
						$scope.colorObject.three=true;
						break;
					case 4:
						$scope.colorObject.one=true;
						$scope.colorObject.two=true;
						$scope.colorObject.three=true;
						$scope.colorObject.four=true;
						break;
				}
			})
		}
		$scope.getInfo();



	}
])
