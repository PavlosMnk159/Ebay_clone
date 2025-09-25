import { __awaiter, __generator } from "tslib";
import { useEffect, useMemo, useState } from 'react';
import { eventListener, timeout } from '../helper/utils';
import { useStreamState } from './use-stream-state';
var DEFAULT_CONSTRAINTS = {
    width: { min: 640, ideal: 1280 },
    height: { min: 480, ideal: 720 },
    facingMode: {
        ideal: 'environment'
    },
    advanced: [
        { width: 1920, height: 1280 },
        { aspectRatio: 1.333 }
    ]
};
export function useCamera(ref, trackConstraints) {
    var _this = this;
    var _a = useState(false), isCameraSupported = _a[0], setCameraSupported = _a[1];
    var _b = useStreamState(), setStream = _b[1];
    useEffect(function () {
        if (!window.isSecureContext) {
            throw new Error("[react-barcode-scanner]: \n        Browser ask for secure origin (such as https) when use getUserMedia,\n        reference: https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins\n      ");
        }
    }, []);
    var constraints = useMemo(function () {
        var videoConstraints = Object.assign({}, DEFAULT_CONSTRAINTS, trackConstraints);
        return {
            audio: false,
            video: videoConstraints
        };
    }, [trackConstraints]);
    useEffect(function () {
        var cancelled = false;
        var stream;
        var _ = function () { return __awaiter(_this, void 0, void 0, function () {
            var target;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        target = ref.current;
                        if (target == null)
                            return [2];
                        return [4, navigator.mediaDevices.getUserMedia(constraints)];
                    case 1:
                        stream = _a.sent();
                        if (target.mozSrcObject !== undefined) {
                            target.mozSrcObject = stream;
                        }
                        else {
                            target.srcObject = stream;
                        }
                        return [4, eventListener(target, 'loadeddata')];
                    case 2:
                        _a.sent();
                        return [4, timeout(500)];
                    case 3:
                        _a.sent();
                        setCameraSupported(true);
                        setStream(stream);
                        return [2];
                }
            });
        }); };
        var close = function () {
            stream === null || stream === void 0 ? void 0 : stream.getTracks().forEach(function (track) { track.stop(); });
        };
        void _().then(function () {
            if (cancelled) {
                close();
            }
        });
        return function () {
            cancelled = true;
            close();
        };
    }, [ref, constraints, setStream]);
    return [isCameraSupported];
}
