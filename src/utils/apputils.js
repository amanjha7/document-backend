const fs = require('fs');


exports.waitForFile = (filePath, timeout = 15000) => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (fs.existsSync(filePath)) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error('PDF not created in time'));
      } else {
        setTimeout(check, 200);
      }
    };
    check();
  });
};