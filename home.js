function addCourse() {
  const courseNameInput = document.getElementById("courseNameInput");
  const creditHoursInput = document.getElementById("creditHoursDropdown");
  const gpaInput = document.getElementById("gpaDropdown");
  const selectedCoursesList = document.getElementById("selectedCoursesList");
  const totalCreditHoursSpan = document.getElementById("totalCreditHours");

  // Get the values entered by the user
  const courseName = courseNameInput.value;
  const creditHours = parseFloat(creditHoursInput.value);
  const gpa = parseFloat(gpaInput.value);

  // Check if the inputs are valid
  if (isNaN(creditHours) || isNaN(gpa) || courseName.trim() === "") {
    alert("Invalid input");
    return;
  }

  // Calculate the grade based on GPA
  let grade = "";
  if (gpa == 4) {
    grade = "A - Excellent";
  } else if (gpa == 3.5) {
    grade = "B+ - Very Good";
  } else if (gpa == 3) {
    grade = "B - Good";
  } else if (gpa == 2.5) {
    grade = "C+ - Average";
  } else if (gpa == 2) {
    grade = "C - Below Average";
  } else {
    grade = "F - Fail";
  }

  // Create a course object
  const course = { courseName, creditHours, gpa, grade };

  // Store the course data in local storage
  if (localStorage.getItem("courses")) {
    // If courses already exist in local storage, retrieve them and add the new course
    const storedCourses = JSON.parse(localStorage.getItem("courses"));
    storedCourses.push(course);
    localStorage.setItem("courses", JSON.stringify(storedCourses));
  } else {
    // If no courses exist in local storage, create a new array and add the course
    localStorage.setItem("courses", JSON.stringify([course]));
  }

  // Update the total credit hours
  const currentTotalCreditHours = parseFloat(totalCreditHoursSpan.textContent);
  const newTotalCreditHours = currentTotalCreditHours + creditHours;
  totalCreditHoursSpan.textContent = newTotalCreditHours.toFixed(2);

  // Clear the input fields
  courseNameInput.value = "";
  creditHoursInput.value = "";
  gpaInput.value = "";

  // Reload the page to display the updated course list from local storage
  location.reload();
}

function deleteCourse(courseIndex) {
  // Retrieve the courses from local storage
  const storedCourses = JSON.parse(localStorage.getItem("courses"));

  // Remove the selected course from the array
  storedCourses.splice(courseIndex, 1);

  // Update the local storage with the modified array
  localStorage.setItem("courses", JSON.stringify(storedCourses));

  // Reload the page to display the updated course list from local storage
  location.reload();
}

// Function to display courses on the screen
function displayCourses() {
  const selectedCoursesList = document.getElementById("selectedCoursesList");
  const tbody = selectedCoursesList.querySelector("tbody");
  tbody.innerHTML = ""; // Clear the existing content

  // Retrieve the courses from local storage
  const storedCourses = JSON.parse(localStorage.getItem("courses"));

  if (storedCourses) {
    // Loop through the stored courses and display them
    storedCourses.forEach((course, index) => {
      const newRow = tbody.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);
      const cell5 = newRow.insertCell(4);

      cell1.textContent = course.courseName;
      cell2.textContent = course.creditHours;
      cell3.textContent = course.gpa;
      cell4.textContent = course.grade;

      // Create a delete button and set its attributes
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.onclick = function () {
        deleteCourse(index);
      };
      cell5.appendChild(deleteButton);
    });
  }
}

// Call the function to display courses when the page loads
window.onload = function () {
  displayCourses();
};

// Function to calculate the total GPA and total credit hours
function calculateTotalGPA() {
  const totalGPASpan = document.getElementById("totalGPA");
  const totalGPAGrade = document.getElementById("totalGPAGrade");
  const totalCreditHoursSpan = document.getElementById("totalCreditHours");

  // Retrieve the courses from local storage
  const storedCourses = JSON.parse(localStorage.getItem("courses"));

  if (storedCourses && storedCourses.length > 0) {
    let totalGPA = 0;
    let totalCreditHours = 0;

    for (const course of storedCourses) {
      totalGPA += course.creditHours * course.gpa;
      totalCreditHours += course.creditHours;
    }

    const overallGPA = totalGPA / totalCreditHours;
    totalGPASpan.textContent = overallGPA.toFixed(2);

    // Calculate the grade for the total GPA
    let grade = "";
    if (overallGPA >= 4) {
      grade = "A - Excellent";
    } else if (overallGPA >= 3.5) {
      grade = "B+ - Very Good";
    } else if (overallGPA >= 3) {
      grade = "B - Good";
    } else if (overallGPA >= 2.5) {
      grade = "C+ - Average";
    } else if (overallGPA >= 2) {
      grade = "C - Below Average";
    } else {
      grade = "F - Fail";
    }

    totalGPAGrade.textContent = grade;
    totalCreditHoursSpan.textContent = totalCreditHours.toFixed(2);
  } else {
    // Handle the case when there are no stored courses
    totalGPASpan.textContent = "N/A";
    totalGPAGrade.textContent = "-";
    totalCreditHoursSpan.textContent = "0";
  }
}

function generatePDF() {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Select the HTML content you want to convert to PDF
  const content = document.querySelector("html");

  // Create a canvas element to hold the HTML content
  html2canvas(content, {
    scale: 0.7, // Adjust the scale as needed
    useCORS: true, // Enable cross-origin resource sharing if needed
  }).then((canvas) => {
    // Convert the canvas to an image
    const imgData = canvas.toDataURL("image/jpeg");

    // Add the image to the PDF
    doc.addImage(imgData, "JPEG", 10, 10, 190, 0);

    // Save the PDF with a specific filename (e.g., "calculated_gpa.pdf")
    doc.save("calculated_gpa.pdf");
  });
}
// JavaScript to toggle the dialog
const howToUseDialog = document.getElementById("howToUseDialog");

function toggleDialog() {
  if (howToUseDialog.style.display === "block") {
    // If the dialog is currently displayed, hide it
    howToUseDialog.style.display = "none";
  } else {
    // If the dialog is hidden, display it
    howToUseDialog.style.display = "block";
  }
}

function closeHowToUseDialog() {
  // Close the dialog
  howToUseDialog.style.display = "none";
}
