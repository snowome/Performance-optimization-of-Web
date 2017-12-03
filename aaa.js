/**
 * 一、去除布局跌簸
1、问题：考虑一下网页操作是如何进行设置(setting)和获取(getting)这两项任何的：例一：设置一个元素的CSS属性(setting)，获取一个元素的CSS属性(getting)。例二：往页面里插入新元素(setting)，或者从页面里查询一组已存在的元素(getting)
     设置(setting)和获取(getting)是引发性能开销的两个核心浏览器进程(还有图形渲染)。在为元素设置了新属性以后，浏览器必须计算这次更改所产生的后续影响，如：改变一个元素的宽度会导致它的父元素、兄弟元素和子元素的宽度根据各自的CSS属性也要调整。
     由设置(setting)和获取(getting)的交替而导致的UI性能降低被称为"布局跌簸"
     尽管浏览器已经为页面的布局的重新计算进行了高度优化，但由于布局跌簸，这些优化大大折扣。
     如：浏览器可以轻易地将同一时间的一系列获取(getting)操作优化为一个单一的、流畅的操作。因为浏览器第一次获取(getting)之后可以缓冲页面的状态，然后在后续每次获取(setting)操作时，参考那个状态。但是，如果反复的执行了获取(getting)之后又进行设置(setting)。就会使缓冲失效。
     什么意思呢：说白了就是 getting->setting，getting->setting,getting->setting，这样会缓冲失效。而应该改为getting，getting,getting->setting,setting,setting
2、解决办法：
    示例一、
    糟糕的做法：以下代码语法有问题，请忽略语法。只关注：布局跌簸 问题
 * **/

    //糟糕的做法：以下代码语法有问题，请忽略语法。只关注：布局跌簸 问题
    var currentTop = $('element').css('top');   // 获取(getting)
    $('element').style.top = currentTop + 1;    // 设置(setting)
    var currentLeft = $('element').css('left'); // 获取(getting)
    $('element').style.left = currentLeft + 1;  // 设置(setting)
    //优化：把查询放在一起，设置放在一起，那么浏览器就可以打包相应的操作，从而减少代码造成的布局跌簸的影响
    var currentTop = $('element').css('top');   // 获取(getting)
    var currentLeft = $('element').css('left'); // 获取(getting)
    $('element').style.top = currentTop + 1;    // 设置(setting)
    $('element').style.left = currentLeft + 1;  // 设置(setting)


/**
    优化：把查询放在一起，设置放在一起，那么浏览器就可以打包相应的操作，从而减少代码造成的布局跌簸的影响
 * **/


    var currentTop = $('element').css('top');   // 获取(getting)
    var currentLeft = $('element').css('left'); // 获取(getting)
    $('element').style.top = currentTop + 1;    // 设置(setting)
    $('element').style.left = currentLeft + 1;  // 设置(setting)


/**

                                        糟糕的做法：**/
                                            $('#element').css('opacity', 1);
                                            // ...... 一些中间操作 ......
                                            $('#element').css('opacity', 0);
                                        /**
                                         优化：复用 $element 减少 DOM树查询(getting)，
                                         * **/
                                            var $element = $('#element');
                                            $element.css('opacity', 1);
                                        // ...... 一些中间操作 ......
                                            $element.css('opacity', 0);

/**
 二、批量添加DOM
 * **/

    var $body = $('body');
    var $newElements = ['<div>div1</div>', '<div>div2</div>', '<div>div3</div>'];

    $newElements.each(function (index, ele) {
        $(ele).appendTo($body);
    })
/** 以上代码遍历了一组元素字符串，然后实例化到jQuery元素对象中。(这么做没有什么性能损失，因为没有查询DOM，即getting) 问题是：如下：**/
    $newElements.each(function (index, ele) {
        $(ele).appendTo($body);
        console.log($body.children().size());
    })
/** 浏览器无法将上面的DOM插入优化成一次操作，因为代码要求在下次循环开始之前，究竟存在多少个元素。即设置(setting)和获取(getting)轮流出现的布局跌簸 优化如下：**/
    var html = '';
    $newElements.each(function (index, ele) {
        html += ele;
    })
    $(html).appendTo($body);

/**
 三、避免影响临近元素

问题：
 设置一个元素的尺寸时，经常会影响附近元素的定位。
 例：设置嵌入在父元素中的子元素的动画，父元素的width和height都是auto。设置子元素的动画时，父元素的尺寸也会发生改变，从而确保将子元素包裹住。
 实际上，子元素并不是唯一被设置动画的元素，因为它的父元素的尺寸也被设置了动画。如果发生在动画循环里边，那么浏览器在每次循环时要做的工作就更多了...、
优化：
 有很多CSS属性，一经改变，就会造成临近元素尺寸或未知的调整，其中包括：top、right、bottom、left、margin、padding、border、width、height等
 这种可以避免影响到临近元素的解决办法是尽可能设置CSS的 transform属性(translateX、translateY、scaleX、scaleY、rotateZ、rotateX、rotateY)的动画。
 transform属性的特殊之处，在于它们将目标元素提升至一个单独的层，这个层可以独立于页面其他内容单独渲染。例如： * **/


    $element.velocity({ left: '500px' });   /** 应该修改为: **/    $element.velocity({ translateX: '500px' });
    $element.velocity({ top: '100px' });    /** 应该修改为: **/    $element.velocity({ translateY: '100px' });


/**
 *
 四、不使用持续响应滚动(scroll)和调整大小(resize)事件
 * **/

    // 当滚动浏览器窗口时，执行一个行为
    $(window).scroll(function () {
        // 这里写的任何行为都会在用户滚动时，每秒触发多次
    });
    // 当滚动浏览器窗口时，执行一个行为
    $(window).resize(function () {
        // 这里写的任何行为都会在用户调整窗口大小时，每秒触发多次
    });


let componentDidMount = function () {

}
/**
 优化：
**/
    componentDidMount() {
        const loadMoreFn = this.props.loadMoreFn;
        const wrapper = this.refs.wrapper;
        let timeOUtId;
        function callback() {
            const top = wrapper.getBoundingClientRect().top;
            const winHeight = window.screen.height;
            if (top && top < winHeight) {
                loadMoreFn();
            }
        }
        window.addEventListener('scroll', function () {
            if (this.props.isLoadingMore) return false;
            if (timeOUtId) {
                clearTimeout(timeOUtId);
            }
            timeOUtId = setTimeout(callback, 50);
        }.bind(this), false);
    }

/**
 五、减少图片渲染
 问题：视屏和图片是多媒体元素类型，浏览器需要加倍努力渲染才行。要计算 非多媒体 元素的尺寸浏览器很轻松，但是多媒体元素包含成千上万的像素数据，要改变它们的大小、尺寸或重新合成，对浏览器而言开销很大
       另外：鉴于滚动页面几乎可以视为设置整个页面的动画（可以把滚动页面视为设置页面的top属性的动画），在CPU吃紧的移动设备上，多媒体元素也会造成滚动性能的巨幅下降。
 优化：
    不幸的是：除了尽可能把简单的、基于图形的图片转化成SVG元素以外，就没有任何办法可以将多媒体内容重构成更快的元素类型。
    因此：唯一可行的性能优化做法就是减少在页面上 同时显示 和 同时设置 动画 的多媒体元素 总数
    因此：有两种最佳实践：
        1、如果感觉在页面上添加不添加图片无所谓，那么不添加。渲染的图片越少，性能越好。
        2、如果同时加载很多图片进入视图，考虑不要设置这些图片的动画，或者只是简单的从 图片的 不可见到可见。这种视觉效果可能不好，弥补这一点，可以考虑错开切换可见性的时间，使图片一个接一个显示而不是同时显示，这样往往会产生更精致的动效。
 * **/
