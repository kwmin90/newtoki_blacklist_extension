//gets the blacklist from chrome storage and saves it to localstorage for ease of access
chrome.storage.local.get({ blackList: [] }, (result) => {
  localStorage.setItem("blackList", JSON.stringify(result.blackList));
});
chrome.storage.local.get({ completed: [] }, (result) => {
  localStorage.setItem("completed", JSON.stringify(result.completed));
});

//utility function for removing spaces and certain characters
function removeSpecialCharAndSpace(item) {
  return item
    .replace(/\r?\n|\r/g, "")
    .replace(/[-~.,]/g, "")
    .replace(/ /g, "");
}
//function for getting webtoon title for popup.js to use
function getWebToonTitle() {
  const title = document.querySelector(
    "#content_wrapper > div.content > div > div.view-wrap > section > article > div.view-title > div > div > div.col-sm-8 > div:nth-child(1) > span > b"
  ).innerText;
  return title;
}
//sends the title to the popup.js on request
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "getTitle":
      sendResponse(removeSpecialCharAndSpace(getWebToonTitle()));
      break;
    default:
      console.error("Unrecognized message: ", message);
  }
});
//utility function for checking the list
function checkBlackList(item) {
  const filteredItem = removeSpecialCharAndSpace(item);
  const list = JSON.parse(localStorage.getItem("blackList"));
  return list.some((x) => x === filteredItem);
}
function checkCompletedList(item) {
  const filteredItem = removeSpecialCharAndSpace(item);
  const list = JSON.parse(localStorage.getItem("completed"));
  return list.some((x) => x === filteredItem);
}
//function for checking the list and applying the filter to the div container
function applyFilter() {
  const parent = document.querySelectorAll("div.list-row");
  parent.forEach((element) => {
    if (element.innerText != "") {
      const child = element.children[0].children[0].children[0].innerText;
      if (checkBlackList(child)) {
        element.outerHTML = "";
      } else if (checkCompletedList(child)) {
        const compl = element.querySelector("div > div > a > span").style;
        compl.color = "red";
        compl.textDecoration = "line-through";
      }
    }
  });
}
//applies the filter if the extension is enabled
chrome.storage.sync.get("isExtensionActive", (storage) => {
  if (storage.isExtensionActive === true) {
    applyFilter();
  }
});
