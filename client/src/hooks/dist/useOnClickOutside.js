"use strict";
exports.__esModule = true;
var react_1 = require("react");
function useOnClickOutside(props) {
    var ref = react_1.useRef(null);
    react_1.useEffect(function () {
        var listener = function (event) {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            if (!props.ignoreRef.current ||
                props.ignoreRef.current.contains(event.target)) {
                return;
            }
            props.callback();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return function () {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [props.callback, props.ignoreRef]);
    return ref;
}
exports["default"] = useOnClickOutside;
