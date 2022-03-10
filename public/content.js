// import "regenerator-runtime/runtime.js";

const getSIOPRequest = () => {
  return window.location.search;
};

const isSIOPRequest = (queryParameter) => {
  return (
    queryParameter.includes("scope") && queryParameter.includes("response_type")
  );
};

const isGettingDataRequest = (queryParameter) => {
  return (
    queryParameter.includes("referenceCredential") ||
    queryParameter.includes("jopApplicationCredential") ||
    queryParameter.includes("citizenshipCredential") ||
    queryParameter.includes("jobCredential")
  );
};

const performSignInIfAvailable = async () => {
  if (isSIOPRequest(window.location.search)) {
    const request = getSIOPRequest();
    // @ts-expect-error
    window.location.href = chrome.runtime.getURL("tab.html") + request;
  } else if (isGettingDataRequest(window.location.search)) {
    const request = getSIOPRequest();
    // @ts-expect-error
    window.location.href = chrome.runtime.getURL("tab.html") + request;
  } else {
    console.info("not observing url");
  }
};

performSignInIfAvailable().then(() => {
  console.log("done");
});
