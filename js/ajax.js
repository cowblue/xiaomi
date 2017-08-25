$(function () {
    //navbar 的ajax请求
    $.ajax({
        url: "http://localhost:9900/api/nav",
        dataType: "json",
        success: function (data) {
            $('.navbar').append(template('tempnav', data));
            $('.navbar li a').eq(7).attr('href', data[7].sourceUrl)
            $('.navbar li a').last().attr('href', data[8].sourceUrl);
        }
    });

    //侧栏的ajax请求
    $.ajax({
        url: "http://localhost:9900/api/items",
        dataType: "json",
        success: function (data) {
            $('#slide>.slide-left>ul>li>a').each(function (index, value) {
                $(value).html(data[index].content);
                $(value).attr('type', data[index].type);
            })
        }
    });

    // 轮播图的ajax请求
    $.ajax({
        url: "http://localhost:9900/api/lunbo",
        dataType: "json",
        success: function (data) {
            $('.slidepic').append(template('tempslide', data));
        }
    });

    // 智能硬件的 ajax请球
    $.ajax({
        url: "http://localhost:9900/api/hardware",
        dataType: "json",
        success: function (data) {
            var hardware = {
                list: data
            }
            // console.log(hardware.list);
            $('.hardware-content-right ul').append(template('temphardware', hardware));
        }
    });

    // product  的ajax请求
    //搭配 的ajax请求
    $.ajax({
        url: "http://localhost:9900/api/product",
        data: {
            toptitle: "match"
        },
        dataType: "json",
        success: function (data) {
            $('#products').html(template('tempproduct', data));
            product('match');
        }
    });
    //配合 的ajax请求
    $.ajax({
        url: "http://localhost:9900/api/product",
        data: {
            toptitle: 'accessories'
        },
        dataType: "json",
        success: function (data) {
            $('#products').append(template('tempproduct', data));
            product('accessories');
        }
    });
    //周边 的ajax请求
    $.ajax({
        url: "http://localhost:9900/api/product",
        data: {
            toptitle: 'around'
        },
        dataType: "json",
        success: function (data) {
            $('#products').append(template('tempproduct', data));
            product('around');
        }
    });

    //热门评论 ajax请求
    $.ajax({
        url: "http://localhost:9900/api/hotcomment",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            var hotcomment = {
                list: data
            }
            $('#hotcomment').html(template('temphotcomment', hotcomment));
        }
    });

    //内容 ajax请求
    $.ajax({
        url: "http://localhost:9900/api/content",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            $('#content').html(template('tempcontent', data));
            //轮播部分
            var contentWidth = $('.content-content>ul:eq(0)>li:eq(0)').width();
            var arr = [0, 0, 0, 0];
            for (var i = 0; i < data.contents.length; i++) {
                $('.' + data.contents[i].type + '>.content-pre').addClass('disabled');
                $('.' + data.contents[i].type + '>ul:eq(1)>li:first()').addClass('current');
                //右箭头

                $('.' + data.contents[i].type + '>.content-next').click(function (event) {
                    if ($(this).hasClass('disabled')) {
                        alert('别点了');
                        return;
                    }
                    event.stopPropagation();
                    if (arr[$(this).parent().index()] == arr.length - 2) {
                        $(this).addClass('disabled');
                    } else {
                        $('.' + $(this).parent().attr('class') + '>.content-pre').removeClass('disabled');
                    }
                    arr[$(this).parent().index()]++;
                    $('.' + $(this).parent().attr('class') + ' .xyd>li').eq(arr[$(this).parent().index()]).siblings().removeClass('current');
                    $('.' + $(this).parent().attr('class') + ' .xyd>li').eq(arr[$(this).parent().index()]).addClass('current');
                    $('.' + $(this).parent().attr('class') + '>ul:first()').animate({
                        left: -(arr[$(this).parent().index()] * contentWidth) + 'px'
                    }, 500);
                });

                //左箭头

                $('.' + data.contents[i].type + '>.content-pre').click(function (event) {
                    if ($(this).hasClass('disabled')) {
                        alert('别点了');
                        return;
                    }
                    event.stopPropagation();
                    if (arr[$(this).parent().index()] == 1) {
                        $(this).addClass('disabled');
                    } else {
                        $('.' + $(this).parent().attr('class') + '>.content-next').removeClass('disabled');
                    }
                    arr[$(this).parent().index()]--;
                    $('.' + $(this).parent().attr('class') + ' .xyd>li').eq(arr[$(this).parent().index()]).siblings().removeClass('current');
                    $('.' + $(this).parent().attr('class') + ' .xyd>li').eq(arr[$(this).parent().index()]).addClass('current');
                    $('.' + $(this).parent().attr('class') + '>ul:first()').animate({
                        left: -(arr[$(this).parent().index()] * contentWidth) + 'px'
                    }, 500);
                });
            }
        }
    });

    // 视频的 ajax请求
    $.ajax({
        url: "http://localhost:9900/api/video",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            $('#video').html(template('tempvideo', data));
        }
    });
});


//侧边导航的切换
function product(topTitle) {
    $('.products-top ul').on('mouseenter', 'a[topTitle=' + topTitle + ']', function () {
        var $this = $(this);
        console.log(this);
        $.ajax({
            url: "http://localhost:9900/api/product",
            data: {
                key: $this.attr('key')
            },
            dataType: "json",
            success: function (data) {
                $('div[title=' + topTitle + '] ul:eq(1)').html(template('tempproduct2', data));
                $this.parent().siblings().find('a').css({
                    color: '#666',
                    borderBottom: "0px"
                })
                $this.css({
                    color: '#ff6700',
                    borderBottom: "3px solid #ff6700"
                })
            }
        });
    })
}