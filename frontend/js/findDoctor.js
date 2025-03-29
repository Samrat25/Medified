document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const symptomsInput = document.getElementById('symptoms');
    const locationInput = document.getElementById('location');
    const specialtySelect = document.getElementById('specialty');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const searchBtn = document.getElementById('search-btn');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const resultsGrid = document.getElementById('results-grid');
    const noResultsDiv = document.getElementById('no-results');

    // Sample doctor data (in a real app, this would come from an API)
    const sampleDoctors = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Family Medicine",
            address: "123 Medical Center Dr, Suite 100, Anytown, ST 12345",
            phone: "(555) 123-4567",
            distance: 0.8,
            acceptsNewPatients: true,
            rating: 4.7,
            image: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Internal Medicine",
            address: "456 Health Park Ave, Anytown, ST 12345",
            phone: "(555) 234-5678",
            distance: 1.2,
            acceptsNewPatients: true,
            rating: 4.5,
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 3,
            name: "Dr. Emily Rodriguez",
            specialty: "Pediatrics",
            address: "789 Children's Way, Anytown, ST 12345",
            phone: "(555) 345-6789",
            distance: 2.5,
            acceptsNewPatients: false,
            rating: 4.9,
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 4,
            name: "Dr. James Wilson",
            specialty: "Cardiology",
            address: "101 Heart Lane, Suite 200, Anytown, ST 12345",
            phone: "(555) 456-7890",
            distance: 3.1,
            acceptsNewPatients: true,
            rating: 4.8,
            image: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        {
            id: 5,
            name: "Dr. Lisa Park",
            specialty: "Dermatology",
            address: "202 Skin Care Blvd, Anytown, ST 12345",
            phone: "(555) 567-8901",
            distance: 1.8,
            acceptsNewPatients: true,
            rating: 4.6,
            image: "https://randomuser.me/api/portraits/women/28.jpg"
        },
        {
            id: 6,
            name: "Dr. Robert Thompson",
            specialty: "Neurology",
            address: "303 Brain Center Dr, Anytown, ST 12345",
            phone: "(555) 678-9012",
            distance: 4.2,
            acceptsNewPatients: false,
            rating: 4.7,
            image: "https://randomuser.me/api/portraits/men/82.jpg"
        }
    ];

    // Get current location
    currentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // In a real app, you would reverse geocode to get an address
                    locationInput.value = "Current Location";
                    // Store coordinates for later use
                    locationInput.dataset.lat = position.coords.latitude;
                    locationInput.dataset.lng = position.coords.longitude;
                },
                function(error) {
                    alert("Unable to retrieve your location. Please enter your address manually.");
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser. Please enter your address manually.");
        }
    });

    // Search for doctors
    searchBtn.addEventListener('click', function() {
        const symptoms = symptomsInput.value.trim();
        const location = locationInput.value.trim();
        const specialty = specialtySelect.value;

        // Validate inputs
        if (!symptoms) {
            alert("Please describe your symptoms.");
            return;
        }

        if (!location) {
            alert("Please enter your location.");
            return;
        }

        // Show loading
        loadingDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        noResultsDiv.style.display = 'none';

        // Simulate API call with setTimeout
        setTimeout(function() {
            // Hide loading
            loadingDiv.style.display = 'none';

            // Filter doctors based on specialty (if selected)
            let filteredDoctors = sampleDoctors;
            if (specialty) {
                const specialtyMap = {
                    'family': 'Family Medicine',
                    'pediatrics': 'Pediatrics',
                    'internal': 'Internal Medicine',
                    'cardiology': 'Cardiology',
                    'dermatology': 'Dermatology',
                    'neurology': 'Neurology',
                    'orthopedics': 'Orthopedics',
                    'ent': 'ENT (Ear, Nose, Throat)'
                };
                const specialtyText = specialtyMap[specialty];
                filteredDoctors = sampleDoctors.filter(doctor => doctor.specialty === specialtyText);
            }

            // Further filter based on symptoms (simplified for demo)
            // In a real app, this would be done by a medical API
            const symptomKeywords = symptoms.toLowerCase().split(/[ ,]+/);
            const symptomSpecialtyMap = {
                'headache': ['Family Medicine', 'Neurology'],
                'fever': ['Family Medicine', 'Pediatrics', 'Internal Medicine'],
                'stomach': ['Family Medicine', 'Internal Medicine'],
                'rash': ['Dermatology', 'Family Medicine'],
                'heart': ['Cardiology'],
                'ear': ['ENT (Ear, Nose, Throat)'],
                'nose': ['ENT (Ear, Nose, Throat)'],
                'throat': ['ENT (Ear, Nose, Throat)'],
                'skin': ['Dermatology'],
                'child': ['Pediatrics']
            };

            if (!specialty) {
                // If no specialty selected, try to match symptoms to specialties
                const matchedSpecialties = new Set();
                symptomKeywords.forEach(keyword => {
                    if (symptomSpecialtyMap[keyword]) {
                        symptomSpecialtyMap[keyword].forEach(spec => matchedSpecialties.add(spec));
                    }
                });

                if (matchedSpecialties.size > 0) {
                    filteredDoctors = filteredDoctors.filter(doctor => 
                        Array.from(matchedSpecialties).includes(doctor.specialty)
                    );
                }
            }

            // Sort by distance
            filteredDoctors.sort((a, b) => a.distance - b.distance);

            // Display results
            displayResults(filteredDoctors);
        }, 1500); // Simulate network delay
    });

    // Display results
    function displayResults(doctors) {
        resultsGrid.innerHTML = '';

        if (doctors.length === 0) {
            noResultsDiv.style.display = 'block';
            return;
        }

        doctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';
            doctorCard.innerHTML = `
                <div class="doctor-info">
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image" style="width:80px;height:80px;border-radius:50%;object-fit:cover;float:right;margin-left:15px;">
                    <h3 class="doctor-name">${doctor.name}</h3>
                    <p class="doctor-specialty">${doctor.specialty}</p>
                    <p class="doctor-rating">
                        ${'★'.repeat(Math.floor(doctor.rating))}${'☆'.repeat(5 - Math.floor(doctor.rating))} 
                        (${doctor.rating.toFixed(1)})
                    </p>
                    <p class="doctor-address"><i class="fas fa-map-marker-alt"></i> ${doctor.address}</p>
                    <p class="doctor-phone"><i class="fas fa-phone"></i> ${doctor.phone}</p>
                    <span class="doctor-distance"><i class="fas fa-walking"></i> ${doctor.distance} miles away</span>
                    ${doctor.acceptsNewPatients ? '<span class="doctor-availability" style="color:green;margin-left:10px;"><i class="fas fa-check-circle"></i> Accepting new patients</span>' : '<span class="doctor-availability" style="color:red;margin-left:10px;"><i class="fas fa-times-circle"></i> Not accepting new patients</span>'}
                </div>
                <div class="doctor-actions">
                    <button class="action-btn book-btn" data-id="${doctor.id}">
                        <i class="fas fa-calendar-check"></i> Book Appointment
                    </button>
                    <button class="action-btn directions-btn" data-id="${doctor.id}">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                </div>
            `;
            resultsGrid.appendChild(doctorCard);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const doctorId = this.getAttribute('data-id');
                const doctor = sampleDoctors.find(d => d.id == doctorId);
                alert(`Booking appointment with ${doctor.name}. In a real app, this would redirect to a booking system.`);
            });
        });

        document.querySelectorAll('.directions-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const doctorId = this.getAttribute('data-id');
                const doctor = sampleDoctors.find(d => d.id == doctorId);
                alert(`Getting directions to ${doctor.name}'s office at ${doctor.address}. In a real app, this would open Google Maps.`);
            });
        });

        resultsDiv.style.display = 'block';
    }
});