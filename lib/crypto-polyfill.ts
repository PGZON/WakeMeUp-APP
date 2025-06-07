// Polyfill for crypto.getRandomValues()
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: function(buffer: Uint8Array) {
      // Generate random values using Math.random()
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
      return buffer;
    }
  };
}

export {}; 