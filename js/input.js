(function () {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode || event.which || 0;
        var key;

        // Normalize from .code if needed (for synthetic events)
        if (event.code === 'ArrowLeft') code = 37;
        else if (event.code === 'ArrowRight') code = 39;
        else if (event.code === 'KeyX') code = 88;
        else if (event.code === 'KeyZ') code = 90;

        switch (code) {
            case 32:
                key = 'SPACE'; break;
            case 37:
                key = 'LEFT'; break;
            case 38:
                key = 'UP'; break;
            case 39:
                key = 'RIGHT'; break;
            case 40:
                key = 'DOWN'; break;
            case 88:
                key = 'JUMP'; break;
            case 90:
                key = 'RUN'; break;
            default:
                key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function (e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function (e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function () {
        pressedKeys = {};
    });

    window.input = {
        isDown: function (key) {
            return pressedKeys[key.toUpperCase()];
        },
        reset: function () {
            pressedKeys = {};
        }
    };
})();
