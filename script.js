// 1. Anonymous Checkbox Toggle Logic
const anonymousToggle = document.getElementById('anonymousToggle');
const contactDetails = document.getElementById('contactDetails');
const studentNameInput = document.getElementById('studentName');
const studentIdInput = document.getElementById('studentId');

anonymousToggle.addEventListener('change', function() {
    if (this.checked) {
        // Hide the contact details section smoothly
        contactDetails.style.display = 'none';
        // Clear the fields so data isn't accidentally submitted
        studentNameInput.value = '';
        studentIdInput.value = '';
    } else {
        // Show the contact details section
        contactDetails.style.display = 'block';
    }
});

// 2. Incident Form Submission Simulator
const complaintForm = document.getElementById('complaintForm');
const tokenDisplay = document.getElementById('tokenDisplay');
const generatedToken = document.getElementById('generatedToken');

complaintForm.addEventListener('submit', function(event) {
    // Prevent the page from refreshing (default form behavior)
    event.preventDefault();

    // Generate a random tracking token (e.g., TKN-847291)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const token = 'TKN-' + randomNum;

    // Display the token
    generatedToken.textContent = token;
    
    // Hide the form and show the token area
    complaintForm.style.display = 'none';
    tokenDisplay.classList.remove('hidden');

    // Scroll to the top of the form section for better UX
    document.getElementById('report').scrollIntoView({ behavior: 'smooth' });
});

// 3. Complaint Tracking Simulator
const trackForm = document.getElementById('trackForm');
const statusDisplay = document.getElementById('statusDisplay');
const statusBadge = document.getElementById('statusBadge');
const statusDesc = document.getElementById('statusDesc');

trackForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const tokenInput = document.getElementById('trackingInput').value.trim();

    // Simple validation
    if (tokenInput.length === 0) {
        alert("Please enter a valid token.");
        return;
    }

    // Array of mock statuses to simulate different database responses
    const mockStatuses = [
        { badge: "Submitted", color: "#3b82f6", desc: "Your complaint has been recorded and is waiting for assignment to an investigator." },
        { badge: "Under Review", color: "#f59e0b", desc: "The Anti-Ragging Committee is currently reviewing the details of your complaint." },
        { badge: "Investigation in Progress", color: "#8b5cf6", desc: "We are actively investigating the incident. Relevant parties are being interviewed." },
        { badge: "Resolved", color: "#10b981", desc: "This grievance has been reviewed and appropriate disciplinary action has been taken." }
    ];

    // Pick a random status just for the demonstration purposes of this frontend project
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    // Update the UI
    statusBadge.textContent = randomStatus.badge;
    statusBadge.style.backgroundColor = randomStatus.color;
    statusDesc.textContent = randomStatus.desc;

    // Show the status display
    statusDisplay.classList.remove('hidden');
});