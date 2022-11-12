var swiperBig;
$(function() {
    window.addEventListener('click', function(e){
        if(e.target.id!='user_dropdown_menu'){
            $('.user_dropdown_menu').removeClass("menu_selected");
        }
    });
    //  fire the plugin
   // $('.mh-head').mhead();
   $(document).on("keypress",".number_input",function(e) { 
    return e.metaKey || // cmd/ctrl
        e.which <= 0 || // arrow keys
        e.which == 8 || // delete key
        /[0-9]/.test(String.fromCharCode(e.which)); // numbers
    })
   $(document).on("click",".moreInfo",function(e) {
        e.preventDefault();
        $('.pro__detail_cont_list_wrap ul + ul').slideToggle();
        $(this).toggleClass('lessInfo');

        if($(this).hasClass('lessInfo')) {
            $(this).text('- Less Info');
        }else {
            $(this).text('+ More Info');
        }
    });

    /* Product delivery mobile */
    // $(document).on("click",".checkdelivery",function(e) {
    //     e.preventDefault();
    //     $('.delivery_showBox').slideToggle();
    //     $(this).toggleClass('showImg');
    // });
    $(document).on("click",".seeall_btn",function(e) {
        $('.mob_cat_container').toggleClass('showMore');
        $(this).toggleClass('up');
        e.preventDefault();
    });

    $(document).on("click",".toggle-sees",function(e) {
        $('.main-offer__available-toggle--content').slideToggle();
        $(this).toggleClass('active');
    
        if($(this).hasClass('active')) {
             $('.toggle-sees span').text('See less');
        }else {
             $('.toggle-sees span').text('See More');
        }
        //e.preventDefault();
    });

    $(document).on("click",".hamberger_menu",function(e) {
        $('.mob_menu_box').addClass('show_mobile_menu');
        // $('app-mobile-footer').css({
        //     'display': 'none',
        // });
        $('body').css({
            'overflow': 'hidden',
        });
        e.preventDefault();
    });
    $(document).on("click",".close_icon",function(e) {
        $('.mob_menu_box').removeClass('show_mobile_menu');
        // $('app-mobile-footer').css({
        //     'display': 'block',
        // });
        $('body').css({
            'overflow': 'auto',
        });
        e.preventDefault();
    });
    $(document).on("click",".mob_menu_wrap > ul > li > a",function(e) {
        // if()
        $(this).next().toggle()
        $(this).toggleClass('rotatet');
    });
    $(document).on("click",".mob_menu_wrap .sub_menu li a",function(e) {
      $('.close_icon').click();
    });
    $(document).on("click",".accordion",function(e) {
        this.classList.toggle("icon-active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
        panel.style.display = "none";
        } else {
        panel.style.display = "block";
        }
    });

});
function initMobileMenu(){
    
}
function loginDataLayer(user_id){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event' : 'login',
      'userId' : user_id
    });
console.log("dataLayer", window.dataLayer);
}
function addToCartDataLayer(product,variants, variant){
    dataLayer.push({ ecommerce: null }); 
    dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
        currency: "INR",
        value:variants.price,
        items: [
        {
            item_id: product.item_id?product.item_id : '',
            item_sku: variants.sku,
            item_name: product.title,
            affiliation: "My Raymond",
            currency: "INR",
            price: variants.compare_price? variants.compare_price : variants.price,
            discount: variants.compare_price? (variants.compare_price-variants.price) : 0,
            item_brand: product.content.split(',')[0],
            item_product_type: product.product_type,
            item_occassion: product.occassion,
            item_sleeve: product.sleeve,
            item_neck: product.neck,
            item_variant: product.color,
            item_size: variant,
            item_fabric_details : product.fabric_details,
            item_fit : product.fit,
            item_season : product.season,
            item_wash_care: product.wash_care,
            item_product_id: product.id,
            item_collection_name : product.collection_name? product.collection_name : '',
            quantity: 1
        }
    ]
}
});
console.log("dataLayer", window.dataLayer);
}
function addToWishlistDataLayer(product,variants){
            dataLayer.push({ ecommerce: null });
            dataLayer.push({
            event: "add_to_wishlist",
            ecommerce: {
                currency: "INR",
                value: variants.price,
                items: [
                {
                    item_id: product.item_id? product.item_id : '',
                    item_sku: variants.sku,
                    item_name: product.title,
                    affiliation: "My Raymond",
                    currency: "INR",
                    price: variants.price,
                    discount: variants.compare_price? ((((variants.compare_price-variants.price)/variants.compare_price)*100).toFixed()) : 0,
                    item_brand: product.content.split(',')[0],
                    item_product_type: product.product_type,
                    item_occassion: product.occassion,
                    item_sleeve: product.sleeve,
                    item_neck: product.neck,
                    item_variant: product.color,
                    item_fabric_details : product.fabric_details,
                    item_fit : product.fit,
                    item_season : product.season,
                    item_wash_care: product.wash_care,
                    item_product_id: product.id,
                    item_collection_name : product.collection_name ? product.collection_name : '',
                    quantity: 1
                }
                ]
            }
            });

   
    console.log("dataLayer", window.dataLayer);
}
function removeFromCartDataLayer(cartItem, product, variants){
            dataLayer.push({ ecommerce: null });
            dataLayer.push({
            event: "remove_from_cart",
            ecommerce: {
                items: [
                {
                    item_id: product.item_id,
                    item_sku: cartItem.variant_id,
                    item_name: product.title,
                    currency: "INR",
                    affiliation: "My Raymond",
                    price: variants.price,
                    discount: variants.compare_price? ((((variants.compare_price-variants.price)/variants.compare_price)*100).toFixed()) : 0,
                    item_brand: product.content.split(',')[0],
                    item_product_type: product.product_type,
                    item_occassion: product.occassion,
                    item_sleeve: product.sleeve,
                    item_neck: product.neck,
                    item_variant: product.color,
                    item_size: cartItem.varientQuantity,
                    item_fabric_details : product.fabric_details,
                    item_fit : product.fit,
                    item_season : product.season,
                    item_wash_care: product.wash_care,
                    item_product_id: cartItem.id,
                    item_collection_name : product.collection_name,
                    quantity: cartItem.quantity
                }
                ]
            }
            });
   
      console.log("dataLayer", window.dataLayer);
}
function selectItemDataLayer(product, variants,productName,ProductID){ 
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
    event: "select_item",
    ecommerce: {
    items: [
    {
        item_id: product.item_id,
        item_sku: variants.sku,
        item_name: product.title,
        currency: "INR",
        affiliation: "My Raymond",
        item_list_id: ProductID,
        item_list_name: productName,
        price : variants.price,
        // item_discount_price: variants.compare_price? variants.compare_price : variants.price,
        discount: variants.compare_price? ((((variants.compare_price-variants.price)/variants.compare_price)*100).toFixed()) : 0,
        item_brand: product.content.split(',')[0],
        item_product_type: product.product_type,
        item_occassion: product.occassion,
        item_sleeve: product.sleeve,
        item_neck: product.neck,
        item_variant: product.color,
        item_fabric_details : product.fabric_details,
        item_fit : product.fit,
        item_season : product.season,
        item_wash_care: product.wash_care,
        item_product_id: product.id,
        item_collection_name : product.collection_name
    }
    ]
  }
});   
    
      console.log("dataLayer", window.dataLayer);
}

function selectItemDataLayerDIY(product, variants,productName){ 
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
    event: "select_item",
    ecommerce: {
    items: [
    {
        item_sku: product.sku_code,
        item_name: product.title,
        currency: "INR",
        affiliation: "My Raymond",
        item_list_id: product.product_category,
        item_list_name: productName,
        price : variants.price,
        // item_discount_price: variants.compare_price? variants.compare_price : variants.price,
        discount: variants.compare_price? ((((variants.compare_price-variants.price)/variants.compare_price)*100).toFixed()) : 0,
        item_brand: product.content.split(',')[0],
        item_product_type: product.product_type,
        item_occassion: product.occassion,
        item_sleeve: product.sleeve,
        item_neck: product.neck,
        item_variant: product.color,
        item_fabric_details : product.fabric_details,
        item_fit : product.fit,
        item_season : product.season,
        item_wash_care: product.wash_care,
        item_product_id: product.id,
        item_occassion : product.occassion,
        item_diy_images : product.images
    }
    ]
  }
});   
    
      console.log("dataLayer", window.dataLayer);
}

function viewItemDataLayer(product, variants){  
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
    event: "view_item",
    ecommerce: {
        items: [
        {
            item_id: product.item_id ? product.item_id : '',
            item_sku: variants.sku,
            item_name: product.title,
            item_images : product.images,
            currency: "INR",
            affiliation: "My Raymond",
            price: variants.price,
            discount: variants.compare_price? ((((variants.compare_price-variants.price)/variants.compare_price)*100).toFixed()) : 0,
            item_brand: product.content.split(',')[0],
            item_product_type: product.product_type,
            item_occassion: product.occassion,
            item_sleeve: product.sleeve,
            item_neck: product.neck,
            item_variant: product.color,
            item_fabric_details : product.fabric_details,
            item_fit : product.fit,
            item_season : product.season,
            item_wash_care: product.wash_care,
            item_product_id: product.id,
            item_collection_name : product.collection_name ? product.collection_name : '',
            quantity: 1
        }
        ]
  }
});
      console.log("dataLayer", window.dataLayer);
}
function viweListItemDataLayer(items){
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
    event: "view_item_list",
    ecommerce: {
        items
    }
    });    
    console.log("dataLayer", window.dataLayer);
}
function viweCartDataLayer(totalPrice,items){
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
    event: "view_cart",
    ecommerce: {
        currency: "INR",
        value: totalPrice,
        items
    }
});
console.log("dataLayer", window.dataLayer);
}
function beginCheckoutDataLayer(items, price, couponCode){
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
    event: "begin_checkout",
    ecommerce: {    
        currency: "INR",
        value: price,
        coupon: couponCode,    
        items
    }
    });
    console.log("dataLayer", window.dataLayer);
}
function addShippingInfoDataLayer(totalPrice,couponCode,items){
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
    event: "add_shipping_info",
    ecommerce: { 
        currency: "INR",
        value: totalPrice,
        coupon: couponCode,
        shipping_tier: "Ground",       
        items
    }
    });
    console.log("dataLayer", window.dataLayer);
}
function addPaymentInfoDataLayer(totalPrice,couponCode,items){
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
    event: "add_payment_info",
    ecommerce: { 
        currency: "INR",
        value: totalPrice,
        coupon: couponCode,
        payment_type: "Online Payment",       
        items
    }
    });
    console.log("dataLayer", window.dataLayer);
}
function purchaseDataLayer(orderDetails,items,orderId){
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
    event: "purchase",
    ecommerce: { 
        transaction_id: orderId,
        affiliation: "My Raymond",
        value: orderDetails.total,
        shipping: orderDetails.shipping_cost,
        tax: 0,
        currency: "INR",
        coupon: orderDetails.coupon_discount_code,       
        items
    }
    });
    console.log("dataLayer", window.dataLayer);
}
function refundDataLayer(orderId,product){
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
        dataLayer.push({
            event: "refund",
            ecommerce: {
            currency: "INR",
            transaction_id: orderId,
            value: product.net_value,
            affiliation: "My Raymond",
            tax: 0,
            items: [
                {
                    item_id: product.details.item_id,
                    item_sku: product.stock_no,
                    item_name: product.details.title,
                    currency: "INR",
                    affiliation: "My Raymond",
                    price: product.net_value,
                    discount: product.discount,
                    item_brand: product.brand,
                    item_sleeve: product.details.sleeve,
                    item_neck: product.details.neck,
                    item_variant: product.details.color,
                    item_fabric_details : product.details.fabric_details,
                    item_fit : product.details.fit,
                    item_season : product.details.season,
                    item_wash_care: product.details.wash_care,
                    item_product_id: product.product_id,
                    item_collection_name : product.details.collection_name,
                    quantity: product.quantity
                }
                ]
        }
    });
    console.log("dataLayer", window.dataLayer);
}
function initOtpInput(inputForm){
    document
  .querySelectorAll('.otp_input input')
  .forEach(el => el.onkeyup = e => e.target.value && el.nextElementSibling.focus());

  $("#two_factor_mobile_otp").keyup(function(){
    var text = $("#two_factor_mobile_otp").val().split("");
    if(text.length>1){
       inputForm.get('two_factor_mobile_otp').setValue(text[0]);
       inputForm.get('two_factor_mobile_otp_two').setValue(text[1]);
       inputForm.get('two_factor_mobile_otp_three').setValue(text[2]);
       inputForm.get('two_factor_mobile_otp_four').setValue(text[3]);
    //    inputForm.get('two_factor_mobile_otp_five').setValue(text[4]);
    //    inputForm.get('two_factor_mobile_otp_six').setValue(text[5]);
    }
 });

  if (document.getElementById('two_factor_mobile_otp')) {
        document.querySelector('#two_factor_mobile_otp').addEventListener('paste', (e) => {

            let pasteData = (e.clipboardData || window.clipboardData).getData('text');
            pasteData = pasteData.replace(/[^\x20-\xFF]/gi, '');
            window.setTimeout(() => {
                var text = pasteData.split("");
                inputForm.get('two_factor_mobile_otp').setValue(text[0]);
                inputForm.get('two_factor_mobile_otp_two').setValue(text[1]);
                inputForm.get('two_factor_mobile_otp_three').setValue(text[2]);
                inputForm.get('two_factor_mobile_otp_four').setValue(text[3]);
                // inputForm.get('two_factor_mobile_otp_five').setValue(text[4]);
                // inputForm.get('two_factor_mobile_otp_six').setValue(text[5]);
            });
        });
    }


  $('.otp_input input').on('keypress', function(e){
    return e.metaKey || // cmd/ctrl
      e.which <= 0 || // arrow keys
      e.which == 8 || // delete key
      /[0-9]/.test(String.fromCharCode(e.which)); // numbers
  })
}
function initSimilarProduct(){   
    $('.similar_product_slider').owlCarousel({
        loop: false,
        margin: 15,
        autoplay: false,
        autoplayTimeout: 2000,
        navigation:false,
        responsive: {
            0: {
                items: 2,
                nav: false,
                dots: false,
                margin: 15,
            },
            400: {
                items: 2,
                nav: false,
                dots: false,
                margin: 15,
            },
            500: {
                items: 2,
                nav: false,
                dots: false,
                margin: 15,
            },
            600: {
                items: 3,
                nav: false,
                dots: false,
                margin: 15,
            },
            700: {
                items: 3,
                nav: false,
                dots: false,
                margin: 15,
    
            },
            1000: {
                items: 5,
                nav: false,
                dots: false,
                margin: 15
            },
            1100: {
                items: 5,
                nav: false,
                dots: false,
                margin: 15
            }
        }
    });

    /* similar-slider*/
//      var swiper = new Swiper(".similar_slider", {
//        slidesPerView: 2.1,
//        spaceBetween: 0,
//        loop: false,
//        autoplay: false,
//        breakpoints: {
//          0: {
//             slidesPerView: 2,
//             spaceBetween: 15,
//           },
//            320: {
//              slidesPerView: 2.3,
//              spaceBetween: 15,
//            },
//            500: {
//                slidesPerView: 2,
//                spaceBetween: 15,
//            },
  
//            991: {
//                slidesPerView: 4,
//                spaceBetween: 15,
//            },
//            1200: {
//                slidesPerView: 5,
//                spaceBetween: 15
//            },
//        },
//    });
    
  
    
}
function initPro(poduct_id){
    swiperBig = new Swiper(".proBig", {
        spaceBetween: 10,
        loop: true,
        loopedSlides: 6,
        navigation: {
          nextEl: ".swiper-button-next-proBig",
          prevEl: ".swiper-button-prev-proBig",
        },
        pagination: {
            el: ".swiper-pagination"+poduct_id,
            dynamicBullets: true,
            clickable: true,
          }
    });
    // swiperBig.on('slideChange', function (e) {
    //     console.log("index", swiperBig.activeIndex);
    //     if(swiperBig.activeIndex !=0 && swiperBig.activeIndex !=8){
    //         $('.customizePoint').hide();
    //     }
    // });
   
    var swiperSmall = new Swiper(".proSmall", {
        direction: "vertical",
        spaceBetween: 10,
        slidesPerView: 6,
        freeMode: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        loop: true,
        loopedSlides: 6
    });
    swiperBig.controller.control = swiperSmall;
    swiperSmall.controller.control = swiperBig;

    swiperBig.on('slideChange', function (e) {
        console.log("index", swiperBig.activeIndex);
        if(swiperBig.activeIndex !=0 && swiperBig.activeIndex !=8){
            $('.customizePoint').hide();
        }
    });

    // if($('.proSmall').hasClass("swiper-initialized")){
    //     reinitSwiper(swiper);
    // }else{
       
    // }
    
    
    // if($('.proBig').hasClass("swiper-initialized")){
    //     reinitSwiper(swiperBig);
    // }else{
        
    // }
}
function swipeToFirstSide(){
    swiperBig.slideTo(0)
}
function reinitSwiper(swiper) {
    setTimeout(function () {
     swiper.update();
    }, 500);
}
function initModalPro(){
    $('.probig_slider_box').click(function() {
        //console.log("OK",$(window).width());
        
        if ($(window).width() > 768) {
            $("body").addClass('backdrop_hidden');
            // alert("rakea")
        } else {
            $("body").removeClass('backdrop_hidden');
        }
    });
    var swiper = new Swiper(".modalproSmall", {
        spaceBetween: 10,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true,
    });
    var swiper2 = new Swiper(".modalproBig", {
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next-proBig",
          prevEl: ".swiper-button-prev-proBig",
        },
        thumbs: {
          swiper: swiper,
        },
    });
}
function gtag_report_conversion_AddtoCart(values,currency) {
	//gtag('event', 'conversion', { 'send_to': 'AW-609800998/2jdGCIap6tgBEKam46IC', 'value': values+'.00', 'currency': currency }); return false; 
}
function callAddtocartPixel(){
	//fbq('track', 'AddToCart');
}
function closeSearch(){
    $('body').removeClass('quickview_open search_opened');
    $('.product_search .search_container').removeClass('open');
     window.setTimeout(function(){
       $('.product_search').hide();
     },100);
}
function callSeachPixel(){
	//fbq('track', 'Search');
}
function gtag_report_conversion_initiateCheckout(values,currency) { 
	//gtag('event', 'conversion', { 'send_to': 'AW-609800998/GxY-CNmm69gBEKam46IC', 'value': values+'.00', 'currency': currency }); return false; 
}
function callPaymentInfoPixel(){
	//fbq('track', 'AddPaymentInfo');
}
function callAddtocartPixel(){
	//fbq('track', 'AddToCart');
}
function callInitiateCheckoutPixel(){
	//fbq('track', 'InitiateCheckout');
}
function callCompleteRegistrationPixel(){
	//fbq('track', 'CompleteRegistration');
}
function callCompletePurchasePixel(purchase_value,purchase_currency){
	//fbq('track', 'Purchase', {value: purchase_value, currency: purchase_currency});
}
function callSeachPixel(){
	//fbq('track', 'Search');
}
function gtag_report_conversion_signup(url) {
	 var callback = function () { 
		if (typeof(url) != 'undefined') {
		  window.location = url; } 
		}; 
	//gtag('event', 'conversion', { 'send_to': 'AW-609800998/91D9CMqk-tgBEKam46IC'}); return false; 
} 

function gtag_report_conversion_AddtoCart(values,currency) {
	//gtag('event', 'conversion', { 'send_to': 'AW-609800998/2jdGCIap6tgBEKam46IC', 'value': values+'.00', 'currency': currency }); return false; 
}
function gtag_report_conversion_initiateCheckout(values,currency) { 
	//gtag('event', 'conversion', { 'send_to': 'AW-609800998/GxY-CNmm69gBEKam46IC', 'value': values+'.00', 'currency': currency }); return false; 
}
function gtag_report_conversion_successCheckout(values,currency,transaction_id) { 
	//gtag('event', 'conversion', { 'send_to': 'AW-609800998/8prHCOKo6tgBEKam46IC', 'value': values+'.00', 'currency': currency,'transaction_id': transaction_id }); return false; 
}
function gtag_wedding(){
   //gtag('config', 'AW-609800998');
    //gtag('event', 'conversion', { 'send_to': 'AW-609800998/k6bLCKz96v0BEKam46IC', 'value': '1000.00', 'currency': 'INR' }); return false; 
}
function gtag_wedding_book_stylist(){
   // gtag('config', 'AW-609800998');
   // gtag('event', 'conversion', { 'send_to': 'AW-609800998/CAhuCIL84f0BEKam46IC', 'value': '1000.00', 'currency': 'INR' }); return false; 
}
function successCheckout(trnsaction_id,values,shipping_chrages,coupon_code,product_data) { 
    dataLayer.push({
        'event': 'conversion',
          'ecommerce': {
            'purchase': {
              'actionField': {
                'id': trnsaction_id, // Transaction ID. Required for purchases and refunds.
                'revenue': values,// Total transaction value (incl. tax and shipping)
                'tax':'0.00',
                'shipping': shipping_chrages,
                'coupon': coupon_code
              },
              'products': product_data
            }
          }
        });
}
function cartToAddNotification(){
    $('.notification_box.cart_notification').addClass('active');
      setTimeout(function() {
          $(".notification_box.cart_notification").removeClass("active");
      }, 2000);
}
function cartToAddNotificationFail(){
    $('.notification_box.cart_notification_failed').addClass('active');
      setTimeout(function() {
          $(".notification_box.cart_notification_failed").removeClass("active");
      }, 2000);
}

function wishListedNotification(){
    $('.notification_box.wishlist_notification').addClass('active');
    setTimeout(function() {
        $(".notification_box.wishlist_notification").removeClass("active");
    }, 2000);
}
function shippingAddressSelectedNotification(){
    $('.notification_box.shippingAddres_notification').addClass('active');
    setTimeout(function() {
        $(".notification_box.shippingAddres_notification").removeClass("active");
    }, 2000);
}
function addAddressNotification(){
    $('.notification_box.addAddress_notification').addClass('active');
    setTimeout(function() {
        $(".notification_box.addAddress_notification").removeClass("active");
    }, 2000);
}
function updateAddressNotification(){
    $('.notification_box.updateAddress_notification').addClass('active');
    setTimeout(function() {
        $(".notification_box.updateAddress_notification").removeClass("active");
    }, 2000);
}
function removeWishListedNotification(){
    $('.notification_box.removeWishlist_notification').addClass('active');
    setTimeout(function() {
        $(".notification_box.removeWishlist_notification").removeClass("active");
    }, 2000);
}
function removeCartNotification(){
    $('.notification_box.removeCart_notification').addClass('active');
    setTimeout(function() {
        $(".notification_box.removeCart_notification").removeClass("active");
    }, 2000);
}
function accountUpdatedNotification(){
    $('.notification_box.accountUpdated_notification').addClass('active');
    setTimeout(function() {
        $(".notification_box.accountUpdated_notification").removeClass("active");
    }, 2000);
}
function selectBodyType(){
    $('.notification_box.select_body_type').addClass('active');
    setTimeout(function() {
        $(".notification_box.select_body_type").removeClass("active");
    }, 2000);
}
function pleaseLogin(){
    $('.notification_box.please_login').addClass('active');
    setTimeout(function() {
        $(".notification_box.please_login").removeClass("active");
    }, 2000);
}
function notAvailableLocation(){
    $('.notification_box.not_available_location').addClass('active');
    setTimeout(function() {
        $(".notification_box.not_available_location").removeClass("active");
    }, 2000);
}
function notAvailable(){
    $('.notification_box.not_available').addClass('active');
    setTimeout(function() {
        $(".notification_box.not_available").removeClass("active");
    }, 2000);
}
function emptyCart(){
    $('.notification_box.emptyCart').addClass('active');
    setTimeout(function() {
        $(".notification_box.emptyCart").removeClass("active");
    }, 2000);
}
function SomethingWrong(){
    $('.notification_box.Something_wrong').addClass('active');
    setTimeout(function() {
        $(".notification_box.Something_wrong").removeClass("active");
    }, 2000);
}
function redeemPoint(){
    $('.notification_box.redeem_point').addClass('active');
    setTimeout(function() {
        $(".notification_box.redeem_point").removeClass("active");
    }, 2000);
}
function invalidOtp(){
    $('.notification_box.invalid_otp').addClass('active');
    setTimeout(function() {
        $(".notification_box.invalid_otp").removeClass("active");
    }, 2000);
}
function selectShoulderType(){
    $('.notification_box.select_shoulder_type').addClass('active');
    setTimeout(function() {
        $(".notification_box.select_shoulder_type").removeClass("active");
    }, 2000);
}
function selectSize(){
    $('.notification_box.select_size').addClass('active');
    setTimeout(function() {
        $(".notification_box.select_size").removeClass("active");
    }, 2000);
}
function selectHeight(){
    $('.notification_box.select_height').addClass('active');
    setTimeout(function() {
        $(".notification_box.select_height").removeClass("active");
    }, 2000);
}
function selectFit(){
    $('.notification_box.select_fit').addClass('active');
    setTimeout(function() {
        $(".notification_box.select_fit").removeClass("active");
    }, 2000);
}
function selectInseam(){
    $('.notification_box.select_inseam').addClass('active');
    setTimeout(function() {
        $(".notification_box.select_inseam").removeClass("active");
    }, 2000);
}
function quantityUnavailable(){
    $('.notification_box.quantity_unavailable').addClass('active');
    setTimeout(function() {
        $(".notification_box.quantity_unavailable").removeClass("active");
    }, 2000);
}
function noTrackingData(){
    $('.notification_box.no_trackingData').addClass('active');
    setTimeout(function() {
        $(".notification_box.no_trackingData").removeClass("active");
    }, 2000);
}
function shareNotSupportNotification(){
    $('.notification_box.no_share_support').addClass('active');
      setTimeout(function() {
          $(".notification_box.no_share_support").removeClass("active");
      }, 2000);
}
function copyLinkNotification(){
    $('.notification_box.copyLink').addClass('active');
      setTimeout(function() {
          $(".notification_box.copyLink").removeClass("active");
      }, 2000);
}
function copyLinkNotificationPopup(){
    $('.notification_box_popup.copyLink').addClass('active');
      setTimeout(function() {
          $(".notification_box_popup.copyLink").removeClass("active");
      }, 10000);
}
function requestProcessedNotification(){
    $('.notification_box.request_processed').addClass('active');
      setTimeout(function() {
          $(".notification_box.request_processed").removeClass("active");
      }, 2000);
}
function requestNotProcessedNotification(){
    $('.notification_box.request_not_processed').addClass('active');
      setTimeout(function() {
          $(".notification_box.request_not_processed").removeClass("active");
      }, 2000);
}
function cancellationDetailsNotification(){
    $('.notification_box.cancellation_details').addClass('active');
      setTimeout(function() {
          $(".notification_box.cancellation_details").removeClass("active");
      }, 2000);
}
function returnResonNotification(){
    $('.notification_box.return_reson').addClass('active');
      setTimeout(function() {
          $(".notification_box.return_reson").removeClass("active");
      }, 2000);
}
function refundDetailsNotification(){
    $('.notification_box.redund_details').addClass('active');
      setTimeout(function() {
          $(".notification_box.redund_details").removeClass("active");
      }, 2000);
}
function outOfStockNotification(){
    $('.notification_box.outOfStock').addClass('active');
      setTimeout(function() {
          $(".notification_box.outOfStock").removeClass("active");
      }, 2000);
}
function orderIdNotFoundNotification(){
    $('.notification_box.orderIdNotFound').addClass('active');
      setTimeout(function() {
          $(".notification_box.orderIdNotFound").removeClass("active");
      }, 2000);
}
function emailAlreadyUseNotification(){
    $('.notification_box.emailAlreadyUse').addClass('active');
      setTimeout(function() {
          $(".notification_box.emailAlreadyUse").removeClass("active");
      }, 2000);
}