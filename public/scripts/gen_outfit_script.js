const nameDiv = document.getElementById("name-div");
const nameInput = document.getElementById("name-input");
const colorPatternDiv = document.getElementById("colors-patterns-div");
const colorPatternList = document.getElementById("colors-patterns-list");
const colorPatternInput = document.getElementById("colors-patterns-input");
const colorPatternBtn = document.getElementById("colors-patterns-btn");
const stylesDiv = document.getElementById("styles-div");
const stylesList = document.getElementById("styles-list");
const stylesInput = document.getElementById("styles-input");
const stylesBtn = document.getElementById("styles-btn");
const submitBtn = document.getElementById("submit-btn");
const form = document.getElementById("generate-outfit-form");
const chips = document.getElementsByClassName("chip-btn");

if (colorPatternBtn) {
  colorPatternBtn.addEventListener("click", function () {
    addToList(colorPatternInput, colorPatternList, "colors-patterns[]");
  });
}

if (colorPatternInput) {
  colorPatternInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
      addToList(colorPatternInput, colorPatternList, "colors-patterns[]");
    }
  });
}

if (stylesBtn) {
  stylesBtn.addEventListener("click", function () {
    addToList(stylesInput, stylesList, "styles[]");
  });
}

if (stylesInput) {
  stylesInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
      addToList(stylesInput, stylesList, "styles[]");
    }
  });
}

if (chips) {
  for (let i = 0; i < chips.length; i++) {
    chips[i].addEventListener("click", removeFromList);
  }
}

if (form) {
  form.addEventListener("submit", (event) => {
    try {
      nameInput.classList.remove("error-input");

      let errors = document.getElementsByClassName("error-message");
      while (errors.length > 0) {
        errors[0].remove();
      }

      let nameValue = nameInput.value.trim();
      if (!nameValue) {
        let error = document.createElement("p");
        error.classList.add("error-message");
        error.innerHTML = "Outfit Name is Required";
        nameInput.classList.add("error-input");
        nameDiv.append(error);
      }

      let setColorPatterns = new Array();
      let listColorPatterns = colorPatternList.children;
      for (let i = 0; i < listColorPatterns.length; i++) {
        const chip = listColorPatterns[i].innerText.trim().toLowerCase();
        if (setColorPatterns.includes(chip)) {
          let error = document.createElement("p");
          error.classList.add("error-message");
          error.innerHTML = "Colors/Patterns cannot contain duplicates";
          colorPatternInput.classList.add("error-input");
          colorPatternDiv.append(error);
          break;
        } else {
          setColorPatterns.push(chip);
        }
      }

      let colorPatternValue = colorPatternInput.value;
      if (colorPatternValue.trim()) {
        let error = document.createElement("p");
        error.classList.add("error-message");
        error.innerHTML = 'Click "Add" to add Color/Pattern to Clothing Item';
        colorPatternInput.classList.add("error-input");
        colorPatternDiv.append(error);
      }

      let setStyles = new Array();
      let listStyles = stylesList.children;
      for (let i = 0; i < listStyles.length; i++) {
        const chip = listStyles[i].innerText.trim().toLowerCase();
        if (setStyles.includes(chip)) {
          let error = document.createElement("p");
          error.classList.add("error-message");
          error.innerHTML = "Styles cannot contain duplicates";
          stylesInput.classList.add("error-input");
          stylesDiv.append(error);
          break;
        } else {
          setStyles.push(chip);
        }
      }

      let stylesValue = stylesInput.value;
      if (stylesValue.trim()) {
        let error = document.createElement("p");
        error.classList.add("error-message");
        error.innerHTML = 'Click "Add" to add Style to Clothing Item';
        stylesInput.classList.add("error-input");
        stylesDiv.append(error);
      }

      if (document.getElementsByClassName("error-message").length > 0)
        throw "Error";
    } catch (e) {
      event.preventDefault();
    }
  });
}

function addToList(input, list, listName) {
  let inputValue = input.value.trim();
  if (inputValue) {
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "chip-btn");
    btn.setAttribute("aria-label", "delete " + inputValue);
    btn.setAttribute("title", "delete " + inputValue);

    btn.addEventListener("click", removeFromList);

    let icon = document.createElement("i");
    icon.setAttribute("class", "fa-solid fa-circle-xmark");

    let liItem = document.createElement("li");
    liItem.innerHTML = inputValue;
    let hiddenInput = document.createElement("input");
    hiddenInput.setAttribute("type", "hidden");
    hiddenInput.setAttribute("name", listName);
    hiddenInput.setAttribute("value", inputValue);
    btn.appendChild(icon);
    liItem.appendChild(hiddenInput);
    liItem.appendChild(btn);
    list.appendChild(liItem);
    input.value = "";
    input.focus();
  }
}

function removeFromList() {
  this.parentElement.remove();
}
