function getData() {
  chrome.storage.local.get("options", data => {
    if (
      !(
        data.hasOwnProperty("options") &&
        data.options.hasOwnProperty("alignCells") &&
        data.options.hasOwnProperty("timeout") &&
        data.options.hasOwnProperty("autoCapitalize")
      )
    ) {
      data.options = { alignCells: true, timeout: true, autoCapitalize: true };
      chrome.storage.local.set({ options });
    } else {
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
      if (document.querySelector(".link") != null && data.options.timeout) {
        document.querySelector(".link").style.display = "inline";
      }
      if (
        document.querySelector("#arrived_order_report") != null &&
        data.options.alignCells
      ) {
        // clearInterval(scanGSX);
        const table = document.querySelector("table");
        const tableHead = table.children[1].children[0];
        const tableBody = table.children[3];
        if (tableHead.children[10].innerText === "Dispatch ID\n") {
          [
            tableHead.children[0].innerHTML,
            tableHead.children[10].innerHTML
          ] = [
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
          }
        }
      }
    }
  });
}

setInterval(() => getData(), 1000);
