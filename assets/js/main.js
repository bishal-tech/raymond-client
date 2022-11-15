$(document).ready(function () {
  /* banner_slider_box */
  var swiper = new Swiper(".banner_slider_box", {
    loop: true,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
      clickable: true,
    },

    navigation: {
      nextEl: ".swiper-button-next-banner",
      prevEl: ".swiper-button-prev-banner",
    },
  });

  /* brand_slider */
  var swiper = new Swiper(".brand_slider", {
    slidesPerView: 3.4,
    spaceBetween: 20,
    loop: false,
    autoplay: true,
  });

  /* fashion_slider */
  var swiper = new Swiper(".fashion_slider", {
    slidesPerView: 2,
    spaceBetween: 40,
    loop: true,
    autoplay: true,
    breakpoints: {
      320: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      540: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        centeredSlides: false,
      },
    },
  });

  /* fashion_slider */
  // var swiper = new Swiper(".occation_slider", {
  //     slidesPerView: 3,
  //     spaceBetween: 30,
  //     loop: true,
  //     autoplay: true,
  //     breakpoints: {
  //         800: {
  //             slidesPerView: 4,
  //             spaceBetween: 20,
  //         },
  //         1024: {
  //             slidesPerView: 4,
  //             spaceBetween: 40,
  //             centeredSlides: false,
  //         },
  //         320: {
  //             slidesPerView: 2,
  //             spaceBetween: 30,
  //             centeredSlides: false,
  //         },
  //     },
  // });

  /* fashion_slider */
  var swiper = new Swiper(".collection_slider", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    autoplay: true,
    breakpoints: {
      800: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
        centeredSlides: false,
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: false,
      },
      320: {
        slidesPerView: 1.4,
        spaceBetween: 30,
        centeredSlides: false,
      },
    },
  });
  /* fashion_slider */
  var swiper = new Swiper(".product_slider", {
    slidesPerView: 2.1,
    spaceBetween: 0,
    loop: true,
    autoplay: false,
    centeredSlides: true,
    navigation: {
      nextEl: ".swiper-button-next-product",
      prevEl: ".swiper-button-prev-product",
    },
    breakpoints: {
      400: {
        slidesPerView: 2,
        spaceBetween: 15,
      },

      991: {
        slidesPerView: 4,
        spaceBetween: 15,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 15,
        centeredSlides: false,
      },
    },
  });
  var swiper = new Swiper(".product_list_slider", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
    },
  });
  /* header icon */

  $(".hdr_icon").hover(function () {
    $(".active").removeClass("active");
    $(this).addClass("active");

    $(".dropdown_box").removeClass("dropdown_box_show");
    if (!$(".dropdown_box").hasClass(".dropdown_box_show")) {
      $(this).siblings().addClass("dropdown_box_show");
    } else {
      $(".dropdown_box").removeClass(".dropdown_box_show");
    }
  });
  $(".hdr_icon").mouseout(function () {
    $(".dropdown_box").removeClass("dropdown_box_show");
  });

  $(".mob_footer > ul > li > a").click(function () {
    $(".active").removeClass("active");
    $(this).addClass("active");

    $(".ftr_user_detail_box").removeClass("ftr_user_detail_box_show");
    if (!$(".ftr_user_detail_box").hasClass(".ftr_user_detail_box_show")) {
      $(this).siblings().addClass("ftr_user_detail_box_show");
    } else {
      $(".ftr_user_detail_box").removeClass(".ftr_user_detail_box_show");
    }
  });

  /* see-all */
  $(".seeall_btn").click(function (e) {
    $(".mob_cat_container").toggleClass("showMore");
    $(this).toggleClass("up");
    e.preventDefault();
  });

  $(".hamberger_menu").click(function (e) {
    $(".mob_menu_box").addClass("show_mobile_menu");
    $("body").css({
      overflow: "hidden",
    });
    e.preventDefault();
  });
  $(".close_icon").click(function (e) {
    $(".mob_menu_box").removeClass("show_mobile_menu");
    $("body").css({
      overflow: "auto",
    });
    e.preventDefault();
  });

  $(".mob_menu_wrap > ul > li > a").click(function () {
    // if()
    $(".sub_menu").toggle();
    // $(this).siblings().slideToggle();
    $(this).toggleClass("rotatet");
    // $('.sub_menu').addClass('rotatet');
    // $('.sub_menu').removeClass('rotatet');
  });
  $(".mob_menu_wrap > ul > li > a").click(function () {
    // if()
    $(".sub_menu_two").toggle();
    // $(this).siblings().slideToggle();
    $(this).toggleClass("rotatet");
    // $('.sub_menu').addClass('rotatet');
    // $('.sub_menu').removeClass('rotatet');
  });
  var headerHeight = $("header").innerHeight();

  $(".body_content_wrap").css({
    "padding-top": headerHeight,
  });

  /* product-slide */
  // $('.proBig .swiper-slide img').elevateZoom({
  //     zoomType: "window",
  //     cursor: "pointer",
  //     zoomWindowFadeIn: 400,
  //     zoomWindowFadeOut: 400,
  //     scrollZoom: true
  // });

  var swiper = new Swiper(".proSmall", {
    direction: "vertical",
    spaceBetween: 10,
    slidesPerView: 6,
    freeMode: true,
    watchSlidesProgress: true,
  });
  var swiper2 = new Swiper(".proBig", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next-proBig",
      prevEl: ".swiper-button-prev-proBig",
    },
    thumbs: {
      swiper: swiper,
    },
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

  /* similar-slider*/

  var swiper = new Swiper(".similar_product_slider ", {
    slidesPerView: 2.1,
    spaceBetween: 0,
    loop: true,
    autoplay: false,
    centeredSlides: false,
    breakpoints: {
      320: {
        slidesPerView: 2.3,
        spaceBetween: 15,
      },
      500: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      770: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      991: {
        slidesPerView: 4,
        spaceBetween: 15,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 15,
        centeredSlides: false,
      },
    },
  });

  var swiper = new Swiper(".recentview_slider", {
    slidesPerView: 2.1,
    spaceBetween: 0,
    loop: false,
    autoplay: false,
    centeredSlides: false,
    breakpoints: {
      320: {
        slidesPerView: 2.3,
        spaceBetween: 15,
      },
      500: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      770: {
        slidesPerView: 3,
        spaceBetween: 15,
      },

      991: {
        slidesPerView: 4,
        spaceBetween: 15,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 15,
      },
    },
  });
});

var width = $(window).width();

$(window).scroll(function () {
  var headerHeight = $("header").innerHeight();
  if ($(this).scrollTop() > headerHeight) {
    $("header").addClass("mobHeader");
    $(".srch_icon").addClass("dBlock");
  } else {
    $("header").removeClass("mobHeader");
    $(".srch_icon").removeClass("dBlock");
  }
});

$(window).on("load", function () {
  var headerHeight = $("header").innerHeight();

  // alert(headerHeight);
  $(".body_content_wrap").css({
    "padding-top": headerHeight,
  });

  var width = $(window).width();
  var responsiveHeaderHeight = $(
    ".product-listing-header-mobile"
  ).innerHeight();
  var footerHeight = $(".mob_footer").innerHeight();
  if (width < 768) {
    // alert(footerHeight);
    $(".body_content_wrap").css({
      "padding-top": responsiveHeaderHeight,
      "padding-bottom": footerHeight,
    });
  }

  $(window).resize(function () {
    var headerHeight = $("header").innerHeight();

    // alert(headerHeight);
    $(".body_content_wrap").css({
      "padding-top": headerHeight,
    });

    var width = $(window).width();
    var responsiveHeaderHeight = $(
      ".product-listing-header-mobile"
    ).innerHeight();
    var footerHeight = $(".mob_footer").innerHeight();
    if (width < 768) {
      // alert(footerHeight);
      $(".body_content_wrap").css({
        "padding-top": responsiveHeaderHeight,
        "padding-bottom": footerHeight,
      });
    }
  });

  $(".srch_icon").click(function () {
    $("header").removeClass("mobHeader");
  });

  $(".for_order_page_mob_haeder .srch_icon").click(function (e) {
    e.preventDefault(0);
    $(".mob_hder_srchbar").toggleClass("show_srchBar");
  });

  $(".addnew_btn").click(function (e) {
    e.preventDefault();
    $(".address_form_box").addClass("show_address_form");
  });

  /* Filter Toggle In Desktop */
  var acc = document.getElementsByClassName("accordion");
  var i;
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("icon-active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }

  /* Filter Block On Mobile */
  $(".filter-btn").click(function (e) {
    $(".mob_filter_block").addClass("show_mob_filter_block");
    $("body").css({
      overflow: "hidden",
    });
    e.preventDefault();
  });

  $(".filter-btn").click(function (e) {
    $(".filter-footer-block").css({
      display: "block",
    });
    e.preventDefault();
  });

  /* Product detail mobile */
  $(".moreInfo").click(function (e) {
    e.preventDefault();
    $(".pro__detail_cont_list_wrap ul + ul").slideToggle();
    $(this).toggleClass("lessInfo");

    if ($(this).hasClass("lessInfo")) {
      $(this).text("- Less Info");
    } else {
      $(this).text("+ More Info");
    }
  });

  /* Product delivery mobile */
  $(".checkdelivery").click(function (e) {
    e.preventDefault();
    $(".delivery_showBox").slideToggle();
    $(this).toggleClass("showImg");
  });

  /*  */

  $("#ftr_wishlist").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $("#ftr_wishlist img").attr("src", "images/red-heart-sm.png");
      $("#ftr_wishlist span").text("Wishlisted");
    } else {
      $("#ftr_wishlist img").attr("src", "images/ftr-wishlist.png");
      $("#ftr_wishlist span").text("Add to wishlist");
    }
  });

  $("#ftr_cart").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $("#ftr_cart img").attr("src", "images/cart-red.png");
      $("#ftr_cart span").text("Go to bag");
    } else {
      $("#ftr_cart img").attr("src", "images/ftr-cart.png");
      $("#ftr_cart span").text("Add to bag");
    }
  });

  /* chart */
  $(".sizeRadio input").click(function () {
    $(".li_active").removeClass("li_active");
    $(this).closest("li").addClass("li_active");
  });

  $(".wishlist_box").click(function () {
    if ($(window).width() > 768) {
      $("body").addClass("backdrop_hidden");
      // alert("rakea")
    } else {
      $("body").removeClass("backdrop_hidden");
    }
  });

  $(".btnMore").click(function (e) {
    e.preventDefault();
    $(".orader_tracking_box").slideToggle();
    $(this).toggleClass("openBox");

    if ($(this).hasClass("openBox")) {
      $(this).html('Less Details <img src="images/drop-icon.png" alt="">');
    } else {
      $(this).html('More Details <img src="images/drop-icon.png" alt="">');
    }
  });

  $(".btnRemove_show_more").click(function (e) {
    e.preventDefault();
    $(".btn_remove_more_box").slideToggle();
    $(this).toggleClass("show_brn_remove");

    if ($(this).hasClass("show_brn_remove")) {
      $(this).text("Cancel");
    } else {
      $(this).html("Remove");
    }
  });

  /* login */
  $(".gender_btn_mob").click(function () {
    if ($(".gender_btn_mob").hasClass("active")) {
      $(".gender_btn_mob").removeClass("active");
    }
    $(this).addClass("active");
  });

  $("#btnContinue").click(function (e) {
    $("#login_block").hide();
    $("#otp_block").show();
    $(".login_body_wrap").addClass("transparent_bg");
    e.preventDefault();
  });

  $("#btnStartShopping").click(function (e) {
    $("#otp_block").hide();
    $("#setup_block").show();
    $(".login_body_wrap").addClass("transparent_bg");
    e.preventDefault();
  });

  $("#loginFild").click(function () {
    $(".login_btn_box").show();
    $(".social_login").hide();
  });
});

// ============================================
$(".toggle-sees").click(function () {
  $(".main-offer__available-toggle--content").slideToggle();
  $(this).toggleClass("active");

  if ($(this).hasClass("active")) {
    $(".toggle-sees span").text("See less");
  } else {
    $(".toggle-sees span").text("See More");
  }
});

$(".guestCounter li:not(.counterText)").on("click", function () {
  var operationType = $(this).attr("data-btn-type");
  var oldValue = $(this).parent().find("input").val();
  let newVal;
  if (operationType == "increment") {
    newVal = parseFloat(oldValue) + 1;
  } else {
    if (oldValue > 1) {
      newVal = parseFloat(oldValue) - 1;
    } else {
      newVal = 1;
    }
  }
  $(this).parent().find("input").val(newVal);
});
