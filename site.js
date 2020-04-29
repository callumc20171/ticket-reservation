var database = firebase.database();

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {

  OutputError.style.display = "none";
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:

    

    return submitForm();
  }
  // Otherwise, display the correct tab:
  updateSummary();
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }

  if (Venues.value == "Select your choice: ") { //Check their concert
  	valid = false;  	
  }

  
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
    OutputError.style.display = "none";
  }
  else {
  	OutputError.innerHTML = "Please correctly fill out the form."
  	OutputError.style.display = "block";
  }

  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

function addOptions(selectEle, list) {
	let selectChild = document.createElement("option");
	selectChild.selected = true;
	selectChild.value = "Select your choice: ";
	selectChild.disabled = true;
	selectChild.innerHTML = "Select your choice: ";
	selectEle.appendChild(selectChild);
	for (let val of list) {
		var opt = document.createElement("option");
		opt.value = val;
		opt.innerHTML = val;
		selectEle.appendChild(opt);
	}
	return selectEle;
}

function selectButton(button) {
	var seatButtons = document.getElementsByClassName("seatType");
	for (let seatButton of seatButtons) {
		if (seatButton.getAttribute("selected") == "true") {
			seatButton.removeAttribute("selected");
		}
	}
	button.setAttribute("selected", "true");

}

function updateSummary() {
	Quantity.innerHTML = "Quantity: " + TicketQuantity.value;
	let ppt = document.querySelector('[selected|="true"]');
	if (!ppt) {
		return;
	}
	PPT.innerHTML = "Price per ticket: " + ppt.dataset.price;
	let cost = Number(TicketQuantity.value) * Number(ppt.dataset.price) + 10;
	TotalCost.innerHTML = "Total cost: " + cost;
	return cost;
}

function submitForm() {
	var data = {}
	data["Ticket Quantity"] = TicketQuantity.value;
	data[document.querySelector('[selected|="true"]').value] = document.querySelector('[selected|="true"]').dataset.price;
	data["cost"] = updateSummary();
	data["venue"] = Venues.value;
	data[NameInput.value] = EmailInput.value;
	data["cellphone"] = CellphoneInput.value;
	console.log(data);

	database.ref("tickets/" + NameInput.value).set(data);
	RegForm.style.display = "none"
	Finished.style.display = "block";
	return true;
}

addOptions(document.getElementById("Venues"), [
	"Teletubbies, 24th October 2020",
		"The wiggles, 9th December 2020",
		"Minecraft sing a long, 1 January 2021",
		"Despacito 2, 2nd May 2021"]);