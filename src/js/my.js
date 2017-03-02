var app=angular.module("app",['ngTouch']);
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
app.controller("appct",function($scope,$http){
	var k=1;
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
        location.href = uri+"?token="+APP_TOKEN+"&id="+id;
    };


})
// alert(window.innerWidth)
