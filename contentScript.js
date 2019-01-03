var runOnce = false;
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
      chrome.storage.local.set({ options });
    } else {
      autoCapitalizeFunction(data);
      removeConfirmWaitFunction(data);
      moveDispatchIDFunction(data);
      removeAutoLogout(data);
      runOnce = true;
    }
  });
}

function removeAutoLogout(data) {
  if (data.options.removeAutoLogout && !runOnce) {
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
}

function moveDispatchIDFunction(data) {
  if (
    document.querySelector("#arrived_order_report") != null &&
    data.options.alignCells
  ) {
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
}

function removeConfirmWaitFunction(data) {
  if (document.querySelector(".link") != null && data.options.timeout) {
    document.querySelector(".link").style.display = "inline";
  }
}

function autoCapitalizeFunction(data) {
  if (
    document.querySelector(
      'input[name="repairDetails.repairOrderDetails[0].serialNumber"]'
    ) &&
    data.options.autoCapitalize
  ) {
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
}

setInterval(() => getData(), 1000);
