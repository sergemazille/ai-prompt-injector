browser.runtime.onInstalled.addListener(() => {
  console.log('AI Prompt Injector extension installed');
});

browser.action.onClicked.addListener((tab) => {
  browser.action.openPopup();
});