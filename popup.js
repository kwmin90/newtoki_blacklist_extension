//adds event listener to buttons and toggle switch
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#add").addEventListener("click", addToBlackList);
  document
    .querySelector("#complete")
    .addEventListener("click", addToCompletedList);
  document.querySelector("#checkbox").addEventListener("click", checkBoxClick);
});
//utility function for toggling the state
function setToggleState() {
  chrome.storage.sync.get("isExtensionActive", (storage) => {
    chrome.storage.sync.set({
      isExtensionActive: !storage.isExtensionActive,
    });
  });
}
//function for initializing the state
function initializeCheckBox() {
  const status = localStorage.getItem("status");
  const checkbox = document.querySelector("#checkbox");
  if (!status) {
    localStorage.setItem("status", checkbox.checked);
    chrome.storage.sync.set({
      isExtensionActive: true,
    });
  }
  if (status === "false") {
    checkbox.checked = false;
  }
}
//function for the toggle switch
function checkBoxClick() {
  const checkbox = document.querySelector("#checkbox");
  localStorage.setItem("status", checkbox.checked);
  setToggleState();
}
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
//function for adding the webtoon to the completed list
function addToCompletedList() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getTitle" }, (title) => {
      if (title !== undefined || title !== "") {
        chrome.storage.local.get({ completed: [] }, (result) => {
          const list = result.completed;
          if (list.some((item) => item === title) === false) {
            list.push(title);
            chrome.storage.local.set({ completed: list }, () => {
              console.log("added new item");
            });
          }
        });
      }
    });
  });
}
initializeCheckBox();
