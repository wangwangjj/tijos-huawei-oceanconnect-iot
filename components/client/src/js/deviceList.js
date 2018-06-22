$(function () {
    let quitFlag = false;
    let url = 'https://demo.tijos.net';
    let deviceType = getRequest('deviceType');
    init();

    function init() {
        getDevices();
        preventBrowserBack();

        mui(".device-list-left").on('tap','.device-list-left-item',function(e){
            let el = e.target.tagName == 'DIV' ? e.target : e.target.parentElement;
            if($(el).hasClass('active')){
                return;
            }else{
                $('.device-list-left-item').each(function (i) {
                    if(this === el){
                        $(el).addClass('active');
                        $(el).find('img').attr('src', '../img/type' + (i + 1) + '_active.png');
                        $('.device-list-right-item').find('img').attr('src', '../img/type' + (i + 1) + '.png');
                    }else{
                        $(this).find('img').attr('src', '../img/type' + (i + 1) + '.png');
                        $(this).removeClass('active');
                    }
                });
            }
        });

        mui(".device-list-right").on('tap','.device-list-right-item',function(e){
            let el;
            if(e.target.tagName == 'DIV' && $(e.target).attr('id')){
                el = e.target;
            }else if(e.target.tagName == 'DIV' && !$(e.target).attr('id')){
                el = e.target.parentElement;
            }else if(e.target.tagName == 'IMG'){
                el = e.target.parentElement;
            }else{
                el = e.target.parentElement.parentElement;
            }
            let deviceId = $(el).attr('id');
            if($('#type1').hasClass('active')){
                mui.openWindow('device.html?deviceId=' + deviceId + '&deviceType=1');
            }else if($('#type2').hasClass('active')){
                mui.openWindow('temperature.html?deviceId=' + deviceId + '&deviceType=2');
            }else{
                mui.openWindow('switch.html?deviceId=' + deviceId + '&deviceType=3');
            }
        });

        document.addEventListener("backbutton", onBackKeyDown, false);
    }

    function getDevices() {
        $.ajax({
            type: 'GET',
            url: url + '/devices',
            dataType: 'json',
            success: function (data) {
                if (data.err_code == '00') {
                    console.log(data)
                    let devices = {
                        data: []
                    }
                    for (var i in data.data) {
                        devices.data.push(data.data[i])
                    }
                    var html = template('deviceList', devices);
                    $('.device-list-right').html(html);
                    if(deviceType){
                        $('.device-list-left-item').each(function (i) {
                            if(deviceType == (i + 1)){
                                $(this).addClass('active');
                                $(this).find('img').attr('src', '../img/type' + (i + 1) + '_active.png');
                                $('.device-list-right-item').find('img').attr('src', '../img/type' + (i + 1) + '.png');
                            }else{
                                $(this).removeClass('active');
                                $(this).find('img').attr('src', '../img/type' + (i + 1) + '.png');
                            }
                        });
                        $('#type' + deviceType).addClass('active');
                        $('#type' + deviceType).find('img').attr('src', '../img/type' + deviceType + '_active.png');
                    }
                }
            },
            error: function (err) {
                mui.toast('err', {duration: 'short', type: 'div'})
                console.log(err)
            }
        })
    }

    function onBackKeyDown() {
        // 返回按钮事件的事件处理函数
        setTimeout(function () {
            quitFlag = false;
        },2000)
        if (!quitFlag) {
            quitFlag = !quitFlag;
            mui.toast('再按一次退出',{ duration:'short', type:'div' });
            event.preventDefault();
        }else{
            navigator.app.exitApp();
        }
    }

    function getRequest(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        let context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }

    function preventBrowserBack() {
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {
                window.history.pushState('forward', null, '#');
                window.history.forward(1);
            });
        }
        window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
        window.history.forward(1);
    }
})