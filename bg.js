chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "a unique id",
    title: "Blacklist",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tabs) => {
  addToBlackList();
});
//function for adding the webtoon to the blacklist
function addToBlackList() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getTitle" }, (title) => {
      if (title !== undefined || title !== "") {
        chrome.storage.local.get({ blackList: [] }, (result) => {
          const list = result.blackList;
          if (list.some((item) => item === title) === false) {
            list.push(title);
            chrome.storage.local.set({ blackList: list }, () => {
              console.log("added new item");
            });
          }
        });
      }
    });
  });
}
