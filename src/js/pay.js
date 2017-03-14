function rewardcb(){
    var appElement = document.querySelector('[ng-controller="apppayct"]');
    var $scope = angular.element(appElement).scope();
    $scope.getRewardList();//改变了模型，想同步到控制器中，则需要调用$apply()
    $scope.$apply();
}
function goSuccess(orderNo){
 	var appElement = document.querySelector('[ng-controller="apppayct"]');
    var $scope = angular.element(appElement).scope();
    $scope.goPayMorex(orderNo);
    // $scope.getRewardList();//改变了模型，想同步到控制器中，则需要调用$apply()
    $scope.$apply();
}
function goAddress(addressid){
	var appElement = document.querySelector('[ng-controller="apppayct"]');
    var $scope = angular.element(appElement).scope();
    $scope.myAddressId=addressid;
    $scope.getAddress(addressid);
    // $scope.getRewardList();//改变了模型，想同步到控制器中，则需要调用$apply()
    $scope.$apply();
}

function showWeixin(){
	var appElement = document.querySelector('[ng-controller="apppayct"]');
    var $scope = angular.element(appElement).scope();
    $scope.payWayArr[1].viewShow=true;
    $scope.$apply();
}
function hideWeixin(){
	var appElement = document.querySelector('[ng-controller="apppayct"]');
    var $scope = angular.element(appElement).scope();
    $scope.payWayArr[1].viewShow=false;
    $scope.$apply();
}


var app=angular.module("apppay",[]);
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
app.controller("apppayct",["$scope","$http",
    function($scope,$http){
    	$scope.testImg={
    			'backgroundImage':"url('img/cart/item_lose.png')"
    	}
    	$scope.checkImg={
    		"backgroundImage":"url('img/cart/item.png')"
    	}
    	$scope.checkImgAc={
    		"backgroundImage":"url('img/cart/item_ac_blue.png')"
    	}
    	$scope.listHeight={
    		"height":"5.8rem"
    	}

    	$scope.payWayArr=[{
    		title:"支付宝",
    		icon:"img/pay/alipayIcon.png",
    		ck:true,
    		val:3,
    		viewShow:false,
    	},{
    		title:"微信支付",
    		icon:"img/pay/wxIcon.png",
    		ck:false,
    		val:2,
    		viewShow:false,
    	},{
    		title:"零钱",
    		icon:"img/pay/looseIcon.png",
    		ck:false,
    		val:1,
    		viewShow:false,
    	},]

    	$scope.isSwitch="closeSwitch";
    	$scope.isSwitchx=false;//是否确定U币抵扣，true 是可以，false 是不可以


    	$scope.sYes={
    		"backgroundColor":"rgba(17,205,110,1)"
    	}
    	$scope.sNo={
    		"backgroundColor":"#bfbfbf"
    	}

    	$scope.orderNoAll=JSON.parse(localStorage.payAllx);
    	  var u = navigator.userAgent;

    	if($scope.orderNoAll.weixin==1){
    		$scope.payWayArr[1].viewShow=true;
    			if(typeof h5=="object"){
    			 var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    				if(isAndroid){
    					var k=h5.isWXAppInstalled();
    					if(k==1 || k=='1'){
    						$scope.payWayArr[1].viewShow=true;
    					}else{
    						$scope.payWayArr[1].viewShow=false;
    						// $scope.yesPayId=3;
    					}
    				}

    	 		}
    	}


    	if($scope.orderNoAll.alipay==1){
    		$scope.payWayArr[0].viewShow=true;
    	}
    	if($scope.orderNoAll.overplusMoneyUsable==1){
    		$scope.payWayArr[2].viewShow=true;
    	}
    	/*ios 判断微信*/
    	 var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    	 if(isiOS){
    	 		if(typeof h5=="object"){
    				h5.wechatInstalled();
    			}
    	 }


    	$scope.postGetOrderNo=$scope.orderNoAll.orderNo;

    	$scope.switchFunction=function(){
    		// if($scope.isSwitch=='closeSwitch'){
    		// 	$scope.isSwitch='openSwitch';
    		// }else{
    		// 	$scope.isSwitch='closeSwitch';
    		// }
    		if($scope.isSwitchx){
    			$scope.isSwitch='closeSwitch';
    			$scope.isSwitchx=false;
    		}else{
    			$scope.isSwitch='openSwitch';
    			$scope.isSwitchx=true;
    		}
    				console.log($scope.isSwitchx)
    	}

    	$scope.yesPayId=3; //付款方式  1余额，2 微信，3，支付宝

    	$scope.yesPayMoney=33; //总共实际付款金额

    	$scope.myAddressId=0; //地址id

    	$scope.payWayFunction=function(item){
    		item.ck=true;

    		angular.forEach($scope.payWayArr,function(val,index){
    			if(val.val==item.val){
    				$scope.yesPayId=val.val;
    				console.log("PayType="+$scope.yesPayId);
    			}else{
    				val.ck=false;
    			}

    		})
    	}



    	/*去付款*/
    	$scope.goPay=function(){
    		if($scope.myAddress){}else{
    			// alert("请选择地址")
    			$scope.getMyAddress();
    			return;
    		}
    		if($scope.yesPayId==1 || $scope.yesPayId=='1'){
    			console.log('余额支付开始')
    			/*余额，先调用mallpay*/
    			if(typeof h5=="object"){

    				h5.mallPayParameters($scope.yesPayId,$scope.postGetOrderNo,'')
    			// h5.mallPayParameters($scope.yesPayId,localStorage.payOrderNo,'');
    			// h5.mallPay($scope.yesPayId,localStorage.payOrderNo,'');
    			}
    		}else{
    			$scope.goPayMore();
    		}


    	}

    	$scope.goPayMore=function(){
    		$http.post(APP_HOST+'/v1/aut/goods/payment',{
    				"addressId":$scope.myAddressId,
    			    "orderNo":localStorage.payOrderNo,
    			    "payType":$scope.yesPayId,
    			    "payUcoin":$scope.isSwitchx?1:0,

    		},{
    			headers: {
            		'Authorization': APP_TOKEN,
        		}
            }).success(function(data){

            	if(data.data){

            		if(typeof h5=="object"){
            			h5.mallPayParameters($scope.yesPayId,$scope.postGetOrderNo,JSON.stringify(data));

            			// h5.mallPayParameters($scope.yesPayId,localStorage.payOrderNo,JSON.stringify(data));
            		// h5.mallPay($scope.yesPayId,localStorage.payOrderNo,JSON.stringify(data));
        			}
            		console.log(data.data.appId)
            		console.log('data成功')
            	}
            })
    	}

    	$scope.goPayMorex=function(payOrderNo){
    		$http.post(APP_HOST+'/v1/aut/goods/payment',{
    				"addressId":$scope.myAddressId,
    			    "orderNo":payOrderNo,
    			    "payType":1,
    			    "payUcoin":$scope.isSwitchx?1:0,

    		},{
    			headers: {
            		'Authorization': APP_TOKEN,
        		}
            }).success(function(data){

            	if(data.data){
        			if(data.data==1 || data.data=='1'){
        				localStorage.successOrderNo=payOrderNo;
        				// window.location.href="/pay.html"
        				console.log("余额支付成功,跳转到成功页面")

        				window.location.href='my_cart_success.html?orderno='+payOrderNo;
        			}
            	}
            })
    	}


    	/*地址相关*/
    	/*获取默认地址*/
    	$scope.myAddress=null;
    	$scope.myAddressId=0;
    	$http.get(APP_HOST+"/v1/aut/gem/personal/address/default",{
    		headers: {
            		'Authorization': APP_TOKEN,
        		}
        	}).success(function(data){
        		if(data.data){
        			/*有默认地址*/
        			$scope.myAddress=data.data;
        			$scope.myAddressId=data.data.id
        			console.log(data)
        		}
        	})

    	/*根据id获取地址*/
    	$scope.getAddress=function(addressid){
    		$scope.myAddressId=addressid;
    		$http.get(APP_HOST+'/v1/aut/gem/personal/address/byid?id='+addressid,{
    			headers: {
            		'Authorization': APP_TOKEN,
        		}
    		}).success(function(data){
    			if(data.data){
    				$scope.myAddress=data.data;
    			}else{
    				$scope.myAddress=null;
    			}
    		})
    	}

    	$scope.getMyAddress=function(){
    		if(typeof h5=="object"){
        		h5.chooseMallAddress($scope.myAddressId);
    			}
    	}
    	console.log("###############")
    	console.log(localStorage.payAllx)
    	console.log("###############")
    	$scope.getList=function(){
    		// $http.post(APP_HOST+"/v1/aut/goods/payment",{
    		// 	[{"goodsId":68,
    		// 	"number":2,}],
    		// },{
    		// 	headers: {
      //       		'Authorization': APP_TOKEN,
      //   		}
    		// }).success(function(data){

    		// })
    	}




    }
])

// window.onload=function(){
// 	var appElement = document.querySelector('[ng-controller="apppayct"]');
//     var $scope = angular.element(appElement).scope();
//     $scope.isWeixinFunction();
//     // $scope.getRewardList();//改变了模型，想同步到控制器中，则需要调用$apply()
//     $scope.$apply();
// }
