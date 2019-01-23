var hasRunOnce = false;
function getData() {
  chrome.storage.local.get("options", data => {
    if (
      !(
        data.hasOwnProperty("options") &&
        data.options.hasOwnProperty("alignCells") &&
        data.options.hasOwnProperty("timeout") &&
        data.options.hasOwnProperty("autoCapitalize") &&
        data.options.hasOwnProperty("removeAutoLogout")
      )
    ) {
      data.options = {
        alignCells: true,
        timeout: true,
        autoCapitalize: true,
        removeAutoLogout: true
      };
      chrome.storage.local.set({ options: data.options });
    } else {
      if (
        document.querySelector(
          'input[name="repairDetails.repairOrderDetails[0].serialNumber"]'
        ) &&
        data.options.autoCapitalize
      )
        autoCapitalizeFunction(data);
      if (document.querySelector(".link") != null && data.options.timeout)
        removeConfirmWaitFunction(data);
      if (
        document.querySelector("#arrived_order_report") != null &&
        data.options.alignCells
      )
        moveDispatchIDFunction(data);
      if (data.options.removeAutoLogout && !hasRunOnce) removeAutoLogout(data);
      hasRunOnce = true;
    }
  });
}

function removeAutoLogout(data) {
  function disablerAutoLogout() {
    const legacyConfirm = window.confirm;
    window.confirm = function confirm(msg) {
      if (msg.startsWith("Your session will timeout")) {
        const time = new Date().toLocaleTimeString();
        console.log("FixGSX prevented automatic logout at", time);
        return true; /*simulates user clicking yes*/
      }
      return legacyConfirm(msg);
    };
  }
  let disablerAutoLogoutString = "(" + disablerAutoLogout.toString() + ")();";
  let disablerScriptElement = document.createElement("script");
  disablerScriptElement.textContent = disablerAutoLogoutString;
  document.documentElement.appendChild(disablerScriptElement);
  disablerScriptElement.parentNode.removeChild(disablerScriptElement);
}

function moveDispatchIDFunction(data) {
  const table = document.querySelector("#arrived_order_report").children[0]
    .children[1];
  const tableHead = table.children[1].children[0];
  const tableBody = table.children[3];
  const searchBox = document.querySelector("#global_search");
  if (tableHead.children[10].innerText === "Dispatch ID\n") {
    [tableHead.children[0].innerHTML, tableHead.children[10].innerHTML] = [
      tableHead.children[10].innerHTML,
      tableHead.children[0].innerHTML
    ]; //swap the table Headers
  }
  if (
    tableBody.children.length > 0 &&
    tableHead.children[0].innerText === "Dispatch ID\n" &&
    tableBody.children[0].cells[10].innerText.charAt(0) === "G"
  ) {
    for (let i = 0; i < tableBody.children.length; i++) {
      [
        tableBody.children[i].cells[0].innerHTML,
        tableBody.children[i].cells[10].innerHTML
      ] = [
        tableBody.children[i].cells[10].innerHTML,
        tableBody.children[i].cells[0].innerHTML
      ]; //swap the table body elements
      tableBody.children[i].addEventListener("click", () => {
        searchBox.value = tableBody.children[i].cells[0].innerText;
        searchBox.focus();
      });
    }
  }
}

function removeConfirmWaitFunction(data) {
  document.querySelector(".link").style.display = "inline";
}

function autoCapitalizeFunction(data) {
  kgb = document.querySelector(
    'input[name="repairDetails.repairOrderDetails[0].serialNumber"]'
  );
  kbb = document.querySelector(
    'input[name="repairDetails.repairOrderDetails[0].oldSerialNumber"]'
  );
  kgb.value = kgb.value.toUpperCase();
  kbb.value = kbb.value.toUpperCase();
}
if (
  document.querySelector(
    'input[name="repairDetails.repairHeaderDetails.newSerialNumber"]'
  ) &&
  data.options.autoCapitalize
) {
  ciar = document.querySelector(
    'input[name="repairDetails.repairHeaderDetails.newSerialNumber"]'
  );
  ciar.value = ciar.value.toUpperCase();
}

setInterval(() => getData(), 500);
