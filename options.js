let page = document.getElementById("buttonDiv");
let options = {};

function constructOptions() {
  chrome.storage.local.get("options", data => {
    console.log(data.options);
    data.hasOwnProperty("options") ? null : (data.options = {});

    !data.options.hasOwnProperty("alignCells")
      ? (data.options.alignCells = true)
      : null;
    const alignCellsText = document.createElement("span");
    alignCellsText.innerHTML = "Move Dispatch ID to leftmost cell.";
    const alignCellsCheckbox = createCheckbox(
      "alignCells",
      data.options.alignCells
    );

    !data.options.hasOwnProperty("timeout")
      ? (data.options.timeout = true)
      : null;
    const timeoutText = document.createElement("span");
    timeoutText.innerHTML = "Remove timeout from Apple notifications";
    const timeoutCheckbox = createCheckbox("timeout", data.options.timeout);

    !data.options.hasOwnProperty("autoCapitalize")
      ? (data.options.autoCapitalize = true)
      : null;
    const autoCapitalizeText = document.createElement("span");
    autoCapitalizeText.innerHTML = "Auto-capitalize KBB and KGB values";
    const autoCapitalizeCheckbox = createCheckbox(
      "autoCapitalize",
      data.options.autoCapitalize
    );

    !data.options.hasOwnProperty("removeAutoLogout")
      ? (data.options.removeAutoLogout = true)
      : null;
    const removeAutoLogoutText = document.createElement("span");
    removeAutoLogoutText.innerHTML = "Remove Auto-Logout";
    const removeAutoLogoutCheckbox = createCheckbox(
      "removeAutoLogout",
      data.options.removeAutoLogout
    );

    page.appendChild(alignCellsCheckbox);
    page.appendChild(alignCellsText);
    page.appendChild(document.createElement("br"));

    page.appendChild(timeoutCheckbox);
    page.appendChild(timeoutText);
    page.appendChild(document.createElement("br"));

    page.appendChild(autoCapitalizeCheckbox);
    page.appendChild(autoCapitalizeText);
    page.appendChild(document.createElement("br"));

    page.appendChild(removeAutoLogoutCheckbox);
    page.appendChild(removeAutoLogoutText);
    page.appendChild(document.createElement("br"));
  });
}
function createCheckbox(optionName, optionValue) {
  options[optionName] = optionValue;
  optionValue === undefined ? (optionValue = true) : null;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = optionValue;
  checkbox.addEventListener("change", () => {
    options[optionName] = checkbox.checked;
    chrome.storage.local.set({ options }, () => {
      console.log(`Set ${optionName} to ${checkbox.checked}.`);
    });
  });
  return checkbox;
}

constructOptions();
