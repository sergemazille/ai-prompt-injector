browser.runtime.onInstalled.addListener(() => {
  console.log('Prompt Library extension installed');
});

browser.action.onClicked.addListener((tab) => {
  browser.action.openPopup();
});