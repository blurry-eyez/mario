(function () {
  var pressedKeys = {};

  function setKey(event, status) {
    var code = event.keyCode || event.which;
    var key;

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
        key = 'JUMP'; break; // KeyX
      case 90:
        key = 'RUN'; break;  // KeyZ
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
      pressedKeys['RUN'] = false;
      pressedKeys['LEFT'] = false;
      pressedKeys['RIGHT'] = false;
      pressedKeys['DOWN'] = false;
      pressedKeys['JUMP'] = false;
    }
  };
})();

// 👂 Handle postMessage from parent (Cloudflare Worker page)
window.addEventListener('message', (event) => {
  if (!event.data || !event.data.key) return;

  const keyInfo = messageToKeyCode(event.data.key);
  if (!keyInfo) return;

  const down = new KeyboardEvent('keydown', {
    key: keyInfo.key,
    code: keyInfo.code,
    keyCode: keyInfo.keyCode,
    which: keyInfo.keyCode,
    bubbles: true
  });
  window.dispatchEvent(down);

  setTimeout(() => {
    const up = new KeyboardEvent('keyup', {
      key: keyInfo.key,
      code: keyInfo.code,
      keyCode: keyInfo.keyCode,
      which: keyInfo.keyCode,
      bubbles: true
    });
    window.dispatchEvent(up);
  }, 150);
});

// 🎯 Mapping string keys to keyCodes for input.js switch-case
function messageToKeyCode(code) {
  switch (code) {
    case 'ArrowLeft': return { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 };
    case 'ArrowRight': return { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 };
    case 'KeyX': return { key: 'x', code: 'KeyX', keyCode: 88 }; // JUMP
    case 'KeyZ': return { key: 'z', code: 'KeyZ', keyCode: 90 }; // RUN
    default: return null;
  }
}
