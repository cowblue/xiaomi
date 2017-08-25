// 入口函数
$(function () {
    //购物车
    shopCar();
    //搜索框
    search();
    //nav栏的下拉js
    nav();
    //轮播图
    slide();
    // sidebar
    sidebar();
    // 为你推荐
    recommend();
})
//购物车
function shopCar() {
    $('.li-shopcar').mouseenter(function () {
        $('.shopcar').stop().slideDown();
    }).mouseleave(function () {
        $('.shopcar').stop().slideUp();
    })
}

//nav栏的下拉js
function nav() {
    $('.navbar').on('mouseenter', 'a', function () {
        if ($(this).attr('type') == '') {
            $('.nav-slide').stop().slideUp();
            return;
        }
        $('.nav-slide').stop().slideDown();
        // nav下拉框的的ajax请求
        var indexNav = $(this).index();
        var $this = $(this);
        $.ajax({
            url: "http://localhost:9900/api/nav",
            data: "type=" + $this.attr('type'),
            dataType: "json",
            success: function (data) {
                // console.log(data);
                var html = '<ul class="clearfix">';
                for (var i = 0; i < data.length; i++) {
                    html += '<li><div><img src="' + data[i].imgUrl + '"></div><p>' + data[i].name + '</p><p>' + data[i].price + '</p></li>';
                }
                html += '</ul>';
                $('.nav-slide').html(html);
                $('.nav-slide ul li div').last().css('borderRight', '0');
            }
        });
    })
    $('.navbar').on('mouseleave', '.canslide', function () {
        $('.nav-slide').stop().slideUp();
    })
    $('.nav-slide').mouseenter(function () {
        $(this).stop().slideDown();
    }).mouseleave(function () {
        $(this).stop().slideUp();
    })
}

// 搜索框的点击事件
function search() {
    $('.search').find('input').first().focus(function () {
        $('.search').find('span').animate({
            opacity: 0
        }, 500);
        $('.search').css({
            borderColor: '#ff6700'
        });
        $(this).css('borderColor', '#ff6700');
        $('.search-slide').css('display', 'block');
    }).blur(function () {
        $('.search').find('span').animate({
            opacity: 1
        }, 500);
        $('.search').css({
            borderColor: '#e0e0e0'
        });
        $(this).css('borderColor', '#e0e0e0');
        $('.search-slide').css('display', 'none');
    })
}

//轮播图
var index = 0;

function slide() {
    var timerId = null;
    timerId = setInterval(goNext, 2000);
    $('.arrow-right').click(goNext);
    $('.arrow-left').click(function () {
        index--;
        if (index < 0) {
            index = 4;
        }
        $('.slidepic li a').stop().animate({
            opacity: 0,
            zIndex: 1
        }, 800).eq(index).stop().animate({
            opacity: 1,
            zIndex: 2
        }, 800);
    })
    $('.slide-right').mouseenter(function () {
        clearInterval(timerId);
    }).mouseleave(function () {
        timerId = setInterval(goNext, 2000);
    })
}
// 轮播图点击右键按钮
function goNext() {
    index++;
    if (index > 4) {
        index = 0;
    }
    $('.slidepic li a').stop().animate({
        opacity: 0,
        zIndex: 1
    }, 800).eq(index).stop().animate({
        opacity: 1,
        zIndex: 2
    }, 800);
}

// sidebar ajax 部分
function sidebar() {
    $('.slide-left').on('mouseenter', 'a', function () {
        $this = $(this);
        $.ajax({
            url: "http://localhost:9900/api/items",
            data: {
                type: $this.attr('type')
            },
            dataType: "json",
            success: function (data) {
                var ulNum = Math.ceil(data.length / 6);
                var html = '';
                for (var i = 0; i < ulNum; i++) {
                    html += '<ul class="clearfix">';
                    for (var j = 0; j < ((i == ulNum - 1) ? (data.length % 6 == 0 ? 6 : data.length % 6) : 6); j++) {
                        if (data[j + i * 6].buyStatus == "true") {
                            html += '<li><a href="' + data[j + i * 6].sourceUrl + '"><img src="' + data[j + i * 6].imgUrl + '" alt=""><p>' + data[j + i * 6].name + '</p><p class = "xuangou">选购</p></a></li>';
                        } else {
                            html += '<li><a href="' + data[j + i * 6].sourceUrl + '"><img src="' + data[j + i * 6].imgUrl + '" alt=""><p>' + data[j + i * 6].name + '</p></a></li>';
                        }
                    }
                    html += '</ul>';
                }
                $('.sidebar').html(html).show();
            }
        });
    })
    $('.sidebar').mouseenter(function () {
        $(this).show();
    }).mouseleave(function () {
        $(this).hide();
    })
    $('.slide-left').on('mouseleave', function () {
        $('.sidebar').hide();
    })
}

// 为你推荐
var rrWidth = +$('.recommend-content').width() + 10;
var target = 0;

function recommend() {
    getRecommendData();
    // 右箭头
    $('.recommend-right').click(function () {
        if ($(this).hasClass('disabled')) {
            alert('飞哥，别点了');
            return;
        }
        if (target == 2) {
            $(this).addClass('disabled');
        } else {
            $('.recommend-left').removeClass('disabled');
        }
        target++;
        $('.recommend-content ul').animate({
            left: -(target * rrWidth) + 'px'
        }, 200);
    });
    // 左箭头
    $('.recommend-left').click(function () {
        if ($(this).hasClass('disabled')) {
            alert('飞哥，别点了');
            return;
        }
        if (target == 1) {
            $(this).addClass('disabled');
        } else {
            $('.recommend-right').removeClass('disabled');
        }
        target--;
        $('.recommend-content ul').animate({
            left: -(target * rrWidth) + 'px'
        }, 200);
    })
}

// 为你推荐获取数据
function getRecommendData() {
    for (var i = 1; i < 5; i++) {
        $.ajax({
            url: "http://localhost:9900/api/recommend",
            data: {
                page: i
            },
            dataType: "json",
            success: function (data) {
                // console.log(data);
                $('.recommend-content ul').append(template('temprecommend', data));
            }
        });
    }
}