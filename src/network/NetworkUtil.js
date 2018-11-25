'use strict';

var NetworkUtil = (function () {
    var instance;
    /**
     * @private
     * */
    function init(){
        instance = {};
        //todo ===== host and port
        /**
         * @return string
         * */
        instance.GetHost = function () {
            return "127.0.0.1";
        };
        /**
         * @return number
         * */
        instance.GetPort = function () {
            return 3011;
        };

        //todo ===== encode ======
        /**
         * @return string
         * */
        instance.EncodeInt8 = function (number) {
            var arr = new Int8Array(1);
            arr[0] = number;
            return String.fromCharCode(arr[0]);
        };
        /**
         * @return string
         * */
        instance.EncodeInt16 = function (number) {
            var arr = new Int16Array(1);
            var char = new Uint8Array(arr.buffer);
            arr[0] = number;
            return String.fromCharCode(char[0], char[1]);
        };
        /**
         * @return string
         * */
        instance.EncodeUInt8 = function (number) {
            var arr = new Uint8Array(1);
            arr[0] = number;
            return String.fromCharCode(arr[0]);
        };
        /**
         * @return string
         * */
        instance.EncodeUInt16 = function (number) {
            var arr = new Uint16Array(1);
            var char = new Uint8Array(arr.buffer);
            arr[0] = number;
            return String.fromCharCode(char[0], char[1]);
        };
        /**
         * @return string
         * */
        instance.EncodeFloat32 = function (number) {
            var arr  = new Float32Array(1);
            var char = new Uint8Array(arr.buffer);

            arr[0] = number;
            return String.fromCharCode(char[0], char[1], char[2], char[3]);
        };
        //todo ===== decode ======
        instance.DecodeInt8 = function (string, offset) {
            var arr  = new Int8Array(1);
            var char = new Int8Array(arr.buffer);
            arr[0] = string.charCodeAt(offset);
            return char[0];
        };
        instance.DecodeInt16 = function (string, offset) {
            var arr  = new Int16Array(1);
            var char = new Uint8Array(arr.buffer);

            for (var i=0; i<2; ++i) {
                char[i] = string.charCodeAt(offset + i);
            }
            return arr[0];
        };
        instance.DecodeUInt8 = function (string, offset) {
            return string.charCodeAt(offset);
        };
        instance.DecodeUInt16 = function (string, offset) {
            var arr  = new Uint16Array(1);
            var char = new Uint8Array(arr.buffer);

            for (var i=0; i<2; ++i) {
                char[i] = string.charCodeAt(offset + i);
            }
            return arr[0];
        };
        instance.DecodeFloat32 = function (string, offset) {
            var arr  = new Float32Array(1);
            var char = new Uint8Array(arr.buffer);

            for (var i=0; i<4; ++i) {
                char[i] = string.charCodeAt(offset + i);
            }
            return arr[0];
        };
        //todo to string
        /**
         * @return string
         * */
        instance.PacketToString = function (data) {
            var print = "";
            for (var i=0; i<data.length; i++) {
                print += data.charCodeAt(i) + " ";
            }
            return print;
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
            if(!instance){
                instance = init();
            }
            return instance;
        }
    }
})();