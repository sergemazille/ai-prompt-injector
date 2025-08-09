(() => {
  'use strict';
  
  if (typeof browser !== 'undefined') {
    return;
  }
  
  const browserAPI = {};
  
  const wrapAPI = (api, path = []) => {
    return new Proxy(api, {
      get(target, prop) {
        if (typeof target[prop] === 'function') {
          return function(...args) {
            return new Promise((resolve, reject) => {
              const callback = (result) => {
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError.message));
                } else {
                  resolve(result);
                }
              };
              
              args.push(callback);
              target[prop].apply(target, args);
            });
          };
        } else if (typeof target[prop] === 'object' && target[prop] !== null) {
          return wrapAPI(target[prop], [...path, prop]);
        }
        return target[prop];
      }
    });
  };
  
  if (typeof chrome !== 'undefined') {
    browserAPI.storage = wrapAPI(chrome.storage);
    browserAPI.tabs = wrapAPI(chrome.tabs);
    browserAPI.scripting = wrapAPI(chrome.scripting);
    browserAPI.runtime = {
      ...wrapAPI(chrome.runtime),
      onMessage: chrome.runtime.onMessage
    };
    
    window.browser = browserAPI;
  }
})();