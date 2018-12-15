"use strict";
var LogUtils = (function () {
    var instance;

    /**
     * @private
     * */
    function init() {
        function getName() {
            return "LogUtils";
        }
        instance = {};
        instance.log = function (args) {
            if (args === undefined || args === null || args === "" || args === '') {
                //console.log(getName() + ": show log with empty args");
                cc.error("cc. ERROR " + getName() + ": show log with empty args");
                return false;
            }
            if (cc.isArray(args)) {
                //console.log(getName() + ": " + args.join(" "));
                cc.log("cc. " + getName() + ": " + args.join(" "));
            } else if (cc.isString(args)) {
                //console.log(getName() + ": " + args);
                cc.log("cc. " + getName() + ": " + args);
            } else if (cc.isObject(args)) {
                //console.log(getName() + ": " + JSON.stringify(args));
                cc.log("cc. " + getName() + ": " + JSON.stringify(args));
            } else {
                //console.log(args);
                cc.log("cc. ",args);
            }
        };

        instance.error = function (args) {
            var strTemp = "ERROR =====> ";
            var ccTempErr = "cc. ERROR =====> ";
            if (args === undefined || args === null || args === "" || args === '') {
                //console.log(strTemp + getName() + ": show log with empty args");
                cc.error(ccTempErr + getName() + ": show log with empty args");
                return false;
            }
            if (cc.isArray(args)) {
                //console.log(strTemp + getName() + ": " + args.join(" "));
                cc.error(ccTempErr + getName() + ": " + args.join(" "));
            } else if (cc.isString(args)) {
                //console.log(strTemp + getName() + ": " + args);
                cc.error(ccTempErr + getName() + ": " + args);
            } else if (cc.isObject(args)) {
                //console.log(strTemp + getName() + ": " + JSON.stringify(args));
                cc.error(ccTempErr + getName() + ": " + JSON.stringify(args));
            } else {
                //console.log(strTemp, args);
                cc.error(ccTempErr, args);
            }
        };

        /**
         * @return
         * @public
         */
        return instance;
    }

    /**
     * @public
     * */
    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    }
})();
