function addCourse() {
  const courseNameInput = document.getElementById("courseNameInput");
  const creditHoursInput = document.getElementById("creditHoursDropdown");
  const gpaInput = document.getElementById("gpaDropdown");
  const totalCreditHoursSpan = document.getElementById("totalCreditHours");

  const courseName = courseNameInput.value;
  const creditHours = parseFloat(creditHoursInput.value);
  const gpa = parseFloat(gpaInput.value);

  if (isNaN(creditHours) || isNaN(gpa) || courseName.trim() === "") {
    alert("Invalid input");
    return;
  }

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

  const course = { courseName, creditHours, gpa, grade };

  if (localStorage.getItem("courses")) {
    const storedCourses = JSON.parse(localStorage.getItem("courses"));
    storedCourses.push(course);
    localStorage.setItem("courses", JSON.stringify(storedCourses));
  } else {
    localStorage.setItem("courses", JSON.stringify([course]));
  }

  const currentTotalCreditHours = parseFloat(totalCreditHoursSpan.textContent);
  const newTotalCreditHours = currentTotalCreditHours + creditHours;
  totalCreditHoursSpan.textContent = newTotalCreditHours.toFixed(2);

  courseNameInput.value = "";
  creditHoursInput.value = "";
  gpaInput.value = "";
  location.reload();
}

function deleteCourse(courseIndex) {
  const storedCourses = JSON.parse(localStorage.getItem("courses"));
  storedCourses.splice(courseIndex, 1);
  localStorage.setItem("courses", JSON.stringify(storedCourses));
  location.reload();
}

function displayCourses() {
  const selectedCoursesList = document.getElementById("selectedCoursesList");
  const tbody = selectedCoursesList.querySelector("tbody");
  tbody.innerHTML = "";

  const storedCourses = JSON.parse(localStorage.getItem("courses"));

  if (storedCourses) {
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

window.onload = function () {
  displayCourses();
};

function calculateTotalGPA() {
  const totalGPASpan = document.getElementById("totalGPA");
  const totalGPAGrade = document.getElementById("totalGPAGrade");
  const totalCreditHoursSpan = document.getElementById("totalCreditHours");
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
    totalGPASpan.textContent = "N/A";
    totalGPAGrade.textContent = "-";
    totalCreditHoursSpan.textContent = "0";
  }
}

function generatePDF() {
  const doc = new jsPDF();
  const content = document.querySelector("html");

  html2canvas(content, {
    scale: 0.7,
    useCORS: true,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg");
    doc.addImage(imgData, "JPEG", 10, 10, 190, 0);
    doc.save("calculated_gpa.pdf");
  });
}
const howToUseDialog = document.getElementById("howToUseDialog");

function toggleDialog() {
  if (howToUseDialog.style.display === "block") {
    howToUseDialog.style.display = "none";
  } else {
    howToUseDialog.style.display = "block";
  }
}

function closeHowToUseDialog() {
  howToUseDialog.style.display = "none";
}
