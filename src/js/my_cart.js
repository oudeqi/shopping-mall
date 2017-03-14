function loginBackToken(token){
	localStorage.token=token;
	location.reload();
}

var app=angular.module("appCart",[]);
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
app.factory("cart",["$http","$q","$rootScope",
    function($http,$q,$rootScope){
        return {
            get: function(){
                var defer = $q.defer();
                $http.get(APP_HOST+"/v1/aut/goods/shopping/cart", {
                    headers: {
                        'Authorization':localStorage.token,
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
app.controller("appCartCt",function($scope,$http,cart){
		$scope.mytoken=APP_TOKEN;
		$scope.tokenShow=false;
		if($scope.mytoken==undefined || $scope.mytoken==null || $scope.mytoken=='' || $scope.mytoken=='undefined'){
			$scope.tokenShow=false;
		}else{
			$scope.tokenShow=true;
			cart.get().then(function(data){
            console.log("获取购物车",data);
            $scope.cartAll = data.data;
		        }).catch(function(data){
		            console.log(data);
		        });
		}
		console.log($scope.mytoken)
		console.log($scope.tokenShow)

        

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
        // window.strTrue=true;
		$scope.delItemAll=function(){
            console.log("打印删除后");
            console.log($scope.buyCar);
			$scope.loading=true;
            for (var i = 0; i < $scope.buyCar.length; i++) {
                if($scope.buyCar[i].isBuy || $scope.buyCar[i].isLose){
    					if(strTrue){
                            console.log("2+++++2");
        					str=str+$scope.buyCar[i].id;
        					$scope.buyCar.splice(i,1);
                            strTrue=false;
        					$scope.delItemAll();
    					}else{
                            console.log("1+++++1");
    						str=str+','+$scope.buyCar[i].id;
    						$scope.buyCar.splice(i,1);
    						$scope.delItemAll();
    					}

    				}
            }


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

		/*调用原生登录*/
		$scope.openLogin=function(){
			if(typeof h5=="object"){
        		h5.openLogin();
        	}
		}

		/*购物车结算*/
		  $scope.payNow=function(){
		  	console.log($scope.buyCar);
		  	var carArr=[];
		  	angular.forEach($scope.buyCar,function(val,index){
					if(val.isBuy==true){
						var kis={
							goodsId:val.goodsId,
							number:val.quantity,
						}
						carArr.push(kis);
					}
				})

	  		$http.post(APP_HOST+"/v1/aut/goods/order", carArr,{
                headers: {
                    'Authorization': APP_TOKEN,
                }
            }).success(function(data){
            	console.log("#######################")
            	console.log(data)
            	console.log("#######################")

            	
            	/*全部*/
            	// localStorage.setOnePay.money=data.data.money;
            	if(data.errMessage){
            	}else{
            		console.log(data.data.orderNo)
	            	localStorage.payAllx=JSON.stringify(data.data);
	            	localStorage.payOrderNo=data.data.orderNo;
	            	localStorage.payMoney=data.data.money;
            		window.location.href="pay.html"
            		// if(typeof h5=="object"){
              //   		h5.mallPay(JSON.stringify(data));
            		// 	}
            		
            	}

            	
            }).error(function(data){

            });


		    }


// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2Jhc2VfaWQiOiIxMDAwNXwxNDgyMjAxODEyNzAzIn0.s6AfZ_AmoK0_5_sqYO3Db0eJQaLtvKORk2EYvzr8jzg


		$scope.getCarList=function(){
			// $scope.tokenShow=true;
			if($scope.tokenShow==false){
				console.log("return了")
				return;
			}
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

        $scope.linkTo = function(uri,token,id){
        	 if(token){
                uri = uri+"?token="+APP_TOKEN;
            }
            if(id){
                uri = uri+"&id="+id;
            }
            location.href = uri;
		};
		$scope.linkTox=function(url){
			window.location.href=url+"?token="+APP_TOKEN;
		}

		$scope.isTopBack=true;
		$scope.noTopBackStyle={
			"bottom":"0",
		}
		if(localStorage.isTopCar){
			if(localStorage.isTopCar==2){
				$scope.isTopBack=true;
			}else{
				$scope.isTopBack=false;
			}
		}
		/*是否顶级菜单进入*/
		// localStorage.getIsTop;




})
