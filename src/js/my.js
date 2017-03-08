var app=angular.module("app",[]);
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
app.controller("appct",function($scope,$http,cart){

    cart.get().then(function(data){
        console.log("获取购物车",data);
        $scope.cartAll = data.data;
    }).catch(function(data){
        console.log(data);
    });

	var k=1;
	$scope.loadMoreShow=true;
	$scope.loading=false;
	$scope.loadText="点击加载更多";
	$scope.testRight=function(){
		console.log("我向右滑动了");
	}
	$scope.goodsClass=[{
		name:"全部订单",
		img:"img/my/goods_all.png",
		imgac:"img/my/goods_all_active.png",
		id:1,
	},{
		name:"待支付",
		img:"img/my/goods_nopay.png",
		imgac:"img/my/goods_nopay_active.png",
		id:2,
	},{
		name:"待收货",
		img:"img/my/goods_nohave.png",
		imgac:"img/my/goods_nohave_active.png",
		id:3,
	},{
		name:"已完成",
		img:"img/my/goods_have.png",
		imgac:"img/my/goods_have_active.png",
		id:4,
	}]
	$scope.gid=1;

	$scope.kid=0;

	$scope.changeGid=function(index){
		$scope.gid=index;
		$scope.loadMoreShow=true;

		$scope.getList(index-1,0);
		$scope.kid=index-1;
		k=1;
	}

	$scope.name="商店";


	/*获取用户信息*/
	$scope.myinfo=null;
	$scope.getInfo=function(){
		$http.get(APP_HOST+'/v1/aut/user/ucoin',{
			headers: {
		                        'Authorization': APP_TOKEN,
		                    }
            }).success(function(data){
            	$scope.myinfo=data;
            	console.log(data)
            })
	}
	$scope.getInfo();

	/*获取订单信息*/
	// status -> 1已下单，2待发货，3待收货，4完成
	$scope.mylist=null;
	$scope.getList=function(type,page,isload){
		$scope.loading=true;
		$scope.loadText="加载中....";
		console.log("请求："+type+'，页数：'+page)
		$http.get(APP_HOST+'/v1/aut/goods/order/list?type='+type+'&pageIndex='+page,{
			headers: {
                'Authorization': APP_TOKEN,
            }
		}).success(function(data){
			if(isload){
				angular.forEach(data.data.data,function(val,index){
					$scope.mylist.data.data.push(val)
					console.log(val,'前面是val')
				})
				console.log(data.data.data.length)
				if(data.data.data.length==0){
					$scope.loadMoreShow=false;
				}
			}else{
				$scope.mylist=data;

			}
			$scope.loadText="点击加载更多";



			console.log(data)
			$scope.loading=false;
		})
	}
	$scope.getList(0,0);


	/*跳转页面*/
	$scope.goGoodsInfo=function(itemid){
		window.location.href='my_goods_info.html?orderno='+itemid;
	}
	/*跳转物流页面*/
	$scope.goGoodsEms=function(itemid){
		window.location.href='my_goods_ems.html?id='+itemid;
	}

	/*返回顶部*/
	$scope.pageScroll=function(){
    	scroll(0,0);
	}
	/*加载更多*/

	$scope.loadMoreFunction=function(){
		k=k+1;
		$scope.getList($scope.kid,k,2);
	}

    // add more
    $scope.linkTo = function(uri,token,id){
        console.log(token);
    	localStorage.isTopCar=1;
        if(token){
            uri = uri+"?token="+APP_TOKEN;
        }
        if(id){
            uri = uri+"&id="+id;
        }
        location.href = uri;
    };
    $scope.linkTox = function(uri,token,id){
    	localStorage.isTopCar=2;
        if(token){
            uri = uri+"?token="+APP_TOKEN;
        }
        if(id){
            uri = uri+"&id="+id;
        }
        location.href = uri;
    };

    /*立即支付*/

    $scope.payNow=function(orderNo,number){
    	var obj={
            "orderNo":orderNo
        }
    	console.log(obj)
    	 $http.post(APP_HOST+"/v1/aut/goods/order/continue", obj,{
                    headers: {
                        'Authorization': APP_TOKEN,
                    }
                }).success(function(data){
                	console.log(data)
                	if(data.errMessage){
		            	}else{
		            		if(typeof h5=="object"){
		                		h5.mallPay(JSON.stringify(data));
		            			}

		            	}
                }).error(function(data){

                });
    }

    /*去地址管理*/
    $scope.goAddress=function(){
    	console.log("去地址管理")
    	if(typeof h5=="object"){
    		h5.openAddrManage();
    	}

    }
    /*商场返回*/

    $scope.back=function(){
    	console.log("返回")
    	if(typeof h5=="object"){
    		h5.mallBack();
    	}
    }

})
// alert(window.innerWidth)
