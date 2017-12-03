;(function ($) {
    var fullPageObj = function () {
        var self = this;
        this.domNode= {
            fullPageDiv: $('#fullPage'),                            // fullpage 容器
        };
        /** 初始化fullpage **/
        this.initFullPage();
    };
    fullPageObj.prototype = {
        constructor: fullPageObj,
        /** 初始化fullpage **/
        initFullPage: function () {
            var self = this;
            self.domNode.fullPageDiv.fullpage({
                anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8',
                            'page9', 'page10', 'page11', 'page12', 'page13', 'page14', 'page15',
                            'page16', 'page17', 'page18', 'page19'],
                menu : '#fullpageMenu',
                // sectionsColor: ['#C63D0F', '#1BBC9B', '#7E8F7C'],
                verticalCentered: true,
                paddingTop: '5rem',
                css3: false,
                continuousVertical: true,
                loopHorizontal: false,
                controlArrows: false,
                slidesNavigation: true,
            });
        },
    };
    fullPageObj.init = function () {
        new this();
    };

    function indexInit() {
        fullPageObj.init();
    }

    $(document).ready = indexInit();
})(jQuery);
