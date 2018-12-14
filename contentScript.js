const scanGSX = setInterval(() => {
  if (document.querySelector(".link") != null) {
    document.querySelector(".link").style.display = "inline";
  }
  if (document.querySelector("table") != null) {
    // clearInterval(scanGSX);
    const table = document.querySelector("table");
    const tableHead = table.children[1].children[0];
    const tableBody = table.children[3];
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
      }
    }
  }
}, 1000);
