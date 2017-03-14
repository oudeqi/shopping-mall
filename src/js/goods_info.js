var app=angular.module("goodsInfo",[]);
app.controller("goodsInfoCt",["$scope",
	function($scope){

			$scope.centerNum=8;
			$scope.leftClass="sliderItemLeft";
			$scope.centerClass="sliderItemCenter";
			$scope.rightClass="sliderItemRight";
			$scope.sliderAnimation=function(){
				switch($scope.centerNum){
					case 7:
						$scope.leftClass="sliderItemCenter";
						$scope.centerClass="sliderItemRight";
						$scope.rightClass="sliderItemLeft";
						break;
					case 8:
						$scope.leftClass="sliderItemLeft";
						$scope.centerClass="sliderItemCenter";
						$scope.rightClass="sliderItemRight";
						break;
					case 9:
						$scope.leftClass="sliderItemRight";
						$scope.centerClass="sliderItemLeft";
						$scope.rightClass="sliderItemCenter";
						break;

				}
			}
			/*幻灯右滚*/
			$scope.swipeRight=function(){
				switch($scope.centerNum){
					case 7:
						$scope.centerNum++;
						break;
					case 8:
						$scope.centerNum++;
						break;
					case 9:
						$scope.centerNum=7;
						break;
				}
				$scope.sliderAnimation();
				// $scope.leftClass="sliderItemRight";
				// $scope.centerClass="sliderItemLeft";
				// $scope.rightClass="sliderItemCenter";
				console.log("右滚了")
			}
			/*幻灯片左滚*/
			$scope.swipeLeft=function(){
				switch($scope.centerNum){
					case 7:
						$scope.centerNum=9;
						break;
					case 8:
						$scope.centerNum--;
						break;
					case 9:
						$scope.centerNum--;
						break;
				}
				$scope.sliderAnimation();
				console.log("左滚了")
			}


	}
])
