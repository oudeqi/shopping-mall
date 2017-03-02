var app=angular.module("appCart",[]);
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
            if(!moved && t>60 && t<300){
                if(attrs.tap){
                    scope.$apply(attrs.tap);
                }
            }
        });
    };
});
app.controller("appCartCt",function($scope,$http){
		$scope.loading=false;
		$scope.testTrue=true;
		$scope.totalPrice=0; //总价格
		$scope.totalQuantity=0; //总数量
		$scope.editAllDel=false; //编辑逻辑，是否删除所有
		$scope.testImg={
			'backgroundImage':"url('img/cart/item_lose.png')"
		}
		$scope.checkImg={
			"backgroundImage":"url('img/cart/item.png')"
		}
		$scope.checkImgAc={
			"backgroundImage":"url('img/cart/item_ac.png')"
		}
		/*编辑模式*/
		$scope.goEditFunction=function(){
			if($scope.editAllDel==true){
				$scope.editAllDel=false;
			}else{
				$scope.editAllDel=true;
			}
		}
		/*是否全选*/
		$scope.allCheck=false;
		$scope.allCheckFunction=function(){
			if($scope.allCheck==true){
				$scope.allCheck=false;
				$scope.allCheckYesFunctionNo();
			}else{
				$scope.allCheck=true;
				$scope.allCheckYesFunction();
			}
			$scope.totalQuantityFuntion();

		}


		// $scope.buyCar=[{
		// 	id:1,
		// 	goodsId:200,
		// 	name:"百草味 年货",
		// 	img:"img/head.jpg",
		// 	money:30.00,
		// 	quantity:20, //数量
		// 	isBuy:true, //勾选购买
		// 	isLose:false, //宝贝没有，已经失效
		// 	yesBuy:null, //是空就是没有勾选，是1 就是勾选了
		// },{
		// 	id:2,
		// 	goodsId:210,
		// 	name:"我是第二个货物",
		// 	img:"img/head.jpg",
		// 	money:120.00,
		// 	quantity:1, //数量
		// 	isBuy:false, //勾选购买
		// 	isLose:false, //宝贝没有，已经失效
		// 	yesBuy:null,
		// },{
		// 	id:3,
		// 	goodsId:220,
		// 	name:"我是第三个货物",
		// 	img:"img/head.jpg",
		// 	money:999.00,
		// 	quantity:2, //数量
		// 	isBuy:false, //勾选购买
		// 	isLose:true, //宝贝没有，已经失效
		// 	yesBuy:null,
		// }];
		$scope.buyCar=[];

		$scope.isBuyFuntion=function(item){

				if(item.isBuy==true){
					item.isBuy=false;
				}else{
					item.isBuy=true;
				}
				console.log(item.name,'点击了',item.isBuy);
				$scope.totalQuantityFuntion();
		}
		$scope.numAddFunction=function(item){
			if(item.quantity==99){
				return;
			}
			item.quantity++;

			$scope.totalQuantityFuntion();
		}
		$scope.numSubtractFunction=function(item){
			if(item.quantity==0){
				return;
			}
			item.quantity--;
			$scope.totalQuantityFuntion();
		}

		$scope.totalQuantityFuntion=function(){
			var endMoney=0;
			var endQuantity=0;
			console.log($scope.buyCar.length)
			if($scope.buyCar.length==0){
				$scope.totalPrice=endMoney;
				$scope.totalQuantity=endQuantity;
			}
			angular.forEach($scope.buyCar,function(val,index){
				// console.log(val);
				// console.log(index);

				if(val.isBuy==true){
					endQuantity=endQuantity+val.quantity;
					endMoney=endMoney+val.money*val.quantity;
				}else{
					console.log("没有勾选")
				}
				$scope.totalPrice=endMoney;
				$scope.totalQuantity=endQuantity;
				console.log(endQuantity,endMoney)

			});
		}
		$scope.totalQuantityFuntion();


		/*删除一个商品*/
		$scope.delItemOne=function(item,index){
			$scope.loading=true;
				$http.delete(APP_HOST+'/v1/aut/goods/shopping/cart?ids='+item.id,{
					headers: {
		                        'Authorization': APP_TOKEN,
		                    }
					}).success(function(data){
							console.log('删除一个商品成功');
							$scope.buyCar.splice(index,1);
							$scope.loading=false;
					})




		}
		/*全局删除按钮*/
		var str='';
		var strTrue=true;
		$scope.delItemAll=function(){
			$scope.loading=true;
			angular.forEach($scope.buyCar,function(val,index){
				if(val.isBuy==true || val.isLose==true){
					if(strTrue==true){
					str=str+val.id;
					$scope.buyCar.splice(index,1);
					$scope.delItemAll();
					}else{
						str=','+str+val.id;
						$scope.buyCar.splice(index,1);
						$scope.delItemAll();
					}

				}

			})
			console.log(str)
			$http.delete(APP_HOST+'/v1/aut/goods/shopping/cart?ids='+str,{
					headers: {
		                        'Authorization': APP_TOKEN,
		                    }
			}).success(function(data){
					console.log('删除所有选择的产品成功');
			})

			$scope.totalQuantityFuntion();
			$scope.loading=false;
				// $scope.buyCar.splice(index,1);
		}

		/*全选所有商品*/
		$scope.allCheckYesFunction=function(){
			angular.forEach($scope.buyCar,function(val,index){
				if(val.isLose==true){

				}else{
					val.isBuy=true;
				}

			});
		}
		/*取消所有选择产品*/
		$scope.allCheckYesFunctionNo=function(){
			angular.forEach($scope.buyCar,function(val,index){
				if(val.isLose==true){

				}else{
					val.isBuy=false;
				}
			});
		}

// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDgyMjAxODEyNzAzIn0.s6AfZ_AmoK0_5_sqYO3Db0eJQaLtvKORk2EYvzr8jzg


		$scope.getCarList=function(){
			$http.get(APP_HOST+'/v1/aut/goods/shopping/cart',{
				headers: {
                        'Authorization': APP_TOKEN,
                    }
			}).success(function(data){
				$scope.buyCar=[];
				angular.forEach(data.data,function(val,index){
					var kis={
						id:val.id, //购物车的id
						goodsId:val.goodsId, //商品id
						name:val.title,
						img:val.previewUrl,
						money:val.price,
						quantity:val.number, //数量
						isBuy:false, //勾选购买
						isLose:val.status==1?false:true, //宝贝没有，已经失效
						yesBuy:null,
					}
					$scope.buyCar.push(kis);
					// console.log(val.title);
				})
				console.log(data);
			})
			$scope.totalQuantityFuntion();
		}
		$scope.getCarList();

		$scope.delShopOne=function(one){
			$http.get(APP_HOST+'/v1/aut/goods/shopping/cart?ids='+one,{
					headers: {
		                        'Authorization': APP_TOKEN,
		                    }
			}).success(function(data){
					console.log('删除一个商品成功');
			})
		}
		$scope.delShopAll=function(all){
			var str='';
			angular.forEach(all,function(val,index){
				str=str+','+val;
			})
			$http.get(APP_HOST+'/v1/aut/goods/shopping/cart?ids='+str,{
					headers: {
		                        'Authorization': APP_TOKEN,
		                    }
			}).success(function(data){
					console.log('删除所有选择的产品成功');
			})
		}

		$scope.back = function() {
            history.go(-1);
        };



})
