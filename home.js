// Array to store course data (course name, credit hours, and achieved GPA)
const courses = [];

function addCourse() {
    const courseNameInput = document.getElementById('courseNameInput');
    const creditHoursInput = document.getElementById('creditHoursDropdown');
    const gpaInput = document.getElementById('gpaDropdown');
    const selectedCoursesList = document.getElementById('selectedCoursesList');
    const totalCreditHoursSpan = document.getElementById('totalCreditHours');

    // Get the values entered by the user
    const courseName = courseNameInput.value;
    const creditHours = parseFloat(creditHoursInput.value);
    const gpa = parseFloat(gpaInput.value);

    // Check if the inputs are valid
    if (isNaN(creditHours) || isNaN(gpa) || courseName.trim() === '') {
        alert('Invalid input');
        return;
    }

    // Calculate the grade based on GPA
    let grade = '';
    if (gpa == 4) {
        grade = 'A - Excellent';
    } else if (gpa == 3.5) {
        grade = 'B+ - Very Good';
    } else if (gpa == 3) {
        grade = 'B - Good';
    } else if (gpa == 2.5) {
        grade = 'C+ - Average';
    } else if (gpa == 2) {
        grade = 'C - Below Average';
    } else {
        grade = 'F - Fail';
    }

    // Add the course data to the array
    courses.push({ courseName, creditHours, gpa, grade });

    // Create a new table row to display the course, grade, and delete button
    const newRow = selectedCoursesList.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);

    cell1.textContent = courseName;
    cell2.textContent = creditHours;
    cell3.textContent = gpa;
    cell4.textContent = grade;

    // Create a delete button and set its attributes
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function () {
        deleteCourse(newRow);
    };
    cell5.appendChild(deleteButton);

    // Update the total credit hours
    const currentTotalCreditHours = parseFloat(totalCreditHoursSpan.textContent);
    const newTotalCreditHours = currentTotalCreditHours + creditHours;
    totalCreditHoursSpan.textContent = newTotalCreditHours.toFixed(2);

    // Clear the input fields
    courseNameInput.value = '';
    creditHoursInput.value = '';
    gpaInput.value = '';
}

// Function to delete a course
function deleteCourse(row) {
    const rowIndex = row.rowIndex;
    const totalCreditHoursSpan = document.getElementById('totalCreditHours');

    // Remove the course data from the array
    courses.splice(rowIndex - 1, 1);

    // Remove the row from the table
    row.remove();

    // Recalculate the total credit hours
    let totalCreditHours = 0;
    for (const course of courses) {
        totalCreditHours += course.creditHours;
    }
    totalCreditHoursSpan.textContent = totalCreditHours.toFixed(2);
}

// Function to calculate the total GPA
function calculateTotalGPA() {
    const totalGPASpan = document.getElementById('totalGPA');
    const totalGPAGrade = document.getElementById('totalGPAGrade');

    let totalGPA = 0;

    for (const course of courses) {
        totalGPA += course.creditHours * course.gpa;
    }

    const totalCreditHoursSpan = document.getElementById('totalCreditHours');
    const totalCreditHours = parseFloat(totalCreditHoursSpan.textContent);
    if (totalCreditHours === 0) {
        totalGPASpan.textContent = 'N/A';
        totalGPAGrade.textContent = '-';
    } else {
        const overallGPA = totalGPA / totalCreditHours;
        totalGPASpan.textContent = overallGPA.toFixed(2);

        // Calculate the grade for the total GPA
        let grade = '';
        if (overallGPA >= 4) {
            grade = 'A - Excellent';
        } else if (overallGPA >= 3.5) {
            grade = 'B+ - Very Good';
        } else if (overallGPA >= 3) {
            grade = 'B - Good';
        } else if (overallGPA >= 2.5) {
            grade = 'C+ - Average';
        } else if (overallGPA >= 2) {
            grade = 'C - Below Average';
        } else {
            grade = 'F - Fail';
        }

        console.log('Total GPA Grade:', grade);

        totalGPAGrade.textContent = grade;
    }
}

function generatePDF() {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Select the HTML content you want to convert to PDF
    const content = document.querySelector('html');

    // Create a canvas element to hold the HTML content
    html2canvas(content, {
        scale: 0.7, // Adjust the scale as needed
        useCORS: true // Enable cross-origin resource sharing if needed
    }).then((canvas) => {
        // Convert the canvas to an image
        const imgData = canvas.toDataURL('image/jpeg');

        // Add the image to the PDF
        doc.addImage(imgData, 'JPEG', 10, 10, 190, 0);

        // Save the PDF with a specific filename (e.g., "calculated_gpa.pdf")
        doc.save('calculated_gpa.pdf');
    });
}

function openHowToUseDialog() {
    const dialog = document.getElementById('howToUseDialog');
    const calculateButton = document.getElementById('calculateButton');

    // Calculate the position relative to the button
    const buttonRect = calculateButton.getBoundingClientRect();

    // Calculate the left position for the dialog
    const left = buttonRect.left - dialog.offsetWidth - 60;

    // Calculate the top position for the dialog
    const top = buttonRect.top - dialog.offsetHeight - 10;

    // Check if the dialog would go out of the screen on the left
    if (left < 10) {
        // If it would, reposition it to the right of the button
        left = buttonRect.right + 10; // Adjust as needed
    }

    // Set the position and width of the dialog
    dialog.style.position = 'absolute';
    dialog.style.left = left + 'px';
    dialog.style.top = top + 'px';

    dialog.showModal();
}

function closeHowToUseDialog() {
    const dialog = document.getElementById('howToUseDialog');
    dialog.close();
}
// Disable right-click on the entire document
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
