(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
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

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        },
        reset: function() {
          pressedKeys['RUN'] = false;
          pressedKeys['LEFT'] = false;
          pressedKeys['RIGHT'] = false;
          pressedKeys['DOWN'] = false;
          pressedKeys['JUMP'] = false;
        }
    };
})();

// 👂 Listen for messages from parent window (Cloudflare Worker page)
window.addEventListener('message', (event) => {
  if (!event.data || !event.data.key) return;

  const keyCode = event.data.key;

  // 🔽 Simulate keydown
  const down = new KeyboardEvent('keydown', { code: keyCode, key: keyFromCode(keyCode) });
  window.dispatchEvent(down);

  // 🔼 Simulate keyup after short delay (like a quick tap)
  setTimeout(() => {
    const up = new KeyboardEvent('keyup', { code: keyCode, key: keyFromCode(keyCode) });
    window.dispatchEvent(up);
  }, 150);
});

// Optional helper function to get 'key' value from 'code'
function keyFromCode(code) {
  const map = {
    'ArrowLeft': 'ArrowLeft',
    'ArrowRight': 'ArrowRight',
    'KeyZ': 'z',
    'KeyX': 'x'
  };
  return map[code] || '';
}
