// ═══════════════════════════════════════════
// SECTION 2: BOOKING FORM — cost preview
// (validation + submission logic comes in Section 3)
// ═══════════════════════════════════════════

// Base prices per person in GHS
var basePrices = {
    "General": 20,
    "VIP": 50,
    "Educational": 15
}

// Exchange rates relative to GHS
var exchangeRates = {
    "GHS": 1,
    "USD": 0.067,   // 1 GHS ≈ 0.067 USD
    "EUR": 0.062,   // 1 GHS ≈ 0.062 EUR
    "GBP": 0.053    // 1 GHS ≈ 0.053 GBP
}

// Currency symbols for display
var currencySymbols = {
    "GHS": "GHS ",
    "USD": "$",
    "EUR": "€",
    "GBP": "£"
}

// ── updateCostPreview() ──────────────────────────────────────
// Runs every time the user changes tour type OR currency.
// Shows the per-person price in the chosen currency.
//
// Flow:
//   1. Read tourType and currency from the dropdowns
//   2. Look up the base GHS price for that tour type
//   3. Multiply by the exchange rate to convert
//   4. Format the number and show it in the cost preview box

function updateCostPreview() {
    var tourType = document.getElementById("tourType").value
    var currency = document.getElementById("currency").value
    var visitors = parseInt(document.getElementById("visitors").value) || 0
    var costPreview = document.getElementById("costPreview")
    var costAmount = document.getElementById("costAmount")
    var costNote = document.querySelector(".cost-note")

    if (tourType === "") {
        costPreview.hidden = true
        return
    }

    var baseGHS = basePrices[tourType]
    var rate = exchangeRates[currency]
    var symbol = currencySymbols[currency]

    // Per-person price in chosen currency
    var perPersonGHS = baseGHS
    var perPerson = currency === "GHS"
        ? symbol + perPersonGHS.toFixed(0)
        : symbol + (perPersonGHS * rate).toFixed(2)

    if (visitors > 0) {
        // Show total + breakdown note
        var totalGHS = baseGHS * visitors
        var converted = currency === "GHS" ? totalGHS : totalGHS * rate
        var display = currency === "GHS"
            ? symbol + totalGHS.toFixed(0)
            : symbol + converted.toFixed(2)

        costAmount.textContent = display
        costNote.textContent = perPerson + " per person × " + visitors + " visitor" + (visitors > 1 ? "s" : "")

    } else {
        // No visitor count yet — just show per-person rate
        costAmount.textContent = perPerson
        costNote.textContent = "per person · enter number of visitors for total"
    }

    costPreview.hidden = false
}

var todayDate = new Date().toISOString().split("T")[0]
document.getElementById("tourDate").setAttribute("min", todayDate)

var todayDate = new Date().toISOString().split("T")[0]
document.getElementById("tourDate").setAttribute("min", todayDate)

// Also update cost when visitor count changes
document.getElementById("visitors").addEventListener("input", updateCostPreview)

// Set today as the minimum selectable date (can't book in the past)
var todayDate = new Date().toISOString().split("T")[0]   // "2026-10-09"
document.getElementById("tourDate").setAttribute("min", todayDate)

// ═══════════════════════════════════════════
// SECTION 3: BOOKING CONSTRUCTOR + VALIDATION
// Covers Lesson 10 Parts 4 & 5
// ═══════════════════════════════════════════

// ── BOOKING CONSTRUCTOR (Lesson 10 Part 4) ──────────────────
// A constructor is a function that acts as a blueprint.
// Every time we call  new Booking(...)  a fresh booking object
// is created with its own copy of these properties.

function Booking(name, email, nationality, visitors, date, tourType, language, currency) {
    this.name = name
    this.email = email
    this.nationality = nationality
    this.visitors = visitors
    this.date = date
    this.tourType = tourType
    this.language = language
    this.currency = currency
    this.cost = 0          // will be filled by calculateCost()
    this.reference = ""         // will be filled by generateReference()
}

// ── PROTOTYPE METHODS (Lesson 10 Part 5) ────────────────────
// These live on the prototype — shared by ALL Booking objects.
// Only ONE copy exists in memory no matter how many bookings.

Booking.prototype.calculateCost = function () {
    var baseGHS = basePrices[this.tourType]       // e.g. 50
    var rate = exchangeRates[this.currency]     // e.g. 0.067
    var symbol = currencySymbols[this.currency]   // e.g. "$"
    var totalGHS = baseGHS * this.visitors          // e.g. 150

    if (this.currency === "GHS") {
        this.cost = symbol + totalGHS.toFixed(0)
    } else {
        this.cost = symbol + (totalGHS * rate).toFixed(2)
    }
}

Booking.prototype.generateReference = function () {
    // Format: EC-TOURTYPE-RANDOMNUMBER  e.g. "EC-VIP-4829"
    var rand = Math.floor(Math.random() * 9000) + 1000   // 4-digit number
    this.reference = "EC-" + this.tourType.toUpperCase() + "-" + rand
}

Booking.prototype.getSummary = function () {
    return this.name + " | " + this.tourType + " | " +
        this.visitors + " visitor(s) | " + this.cost
}

// ── VALIDATION (checks each field before submitting) ─────────
// Returns true if the field is fine, false if something is wrong.
// Also sets/clears the red error message under each field.

function validateName() {
    var val = document.getElementById("visitorName").value.trim()
    var err = document.getElementById("nameError")
    var inp = document.getElementById("visitorName")

    if (val === "") {
        err.textContent = "Please enter your full name."
        inp.classList.add("invalid")
        return false
    }
    if (val.length < 2) {
        err.textContent = "Name must be at least 2 characters."
        inp.classList.add("invalid")
        return false
    }
    err.textContent = ""
    inp.classList.remove("invalid")
    return true
}

function validateEmail() {
    var val = document.getElementById("visitorEmail").value.trim()
    var err = document.getElementById("emailError")
    var inp = document.getElementById("visitorEmail")

    // Basic email check: must contain @ and a dot after it
    var hasAt = val.indexOf("@") > 0
    var hasDot = val.indexOf(".", val.indexOf("@")) > 0

    if (val === "" || !hasAt || !hasDot) {
        err.textContent = "Please enter a valid email address."
        inp.classList.add("invalid")
        return false
    }
    err.textContent = ""
    inp.classList.remove("invalid")
    return true
}

function validateNationality() {
    var val = document.getElementById("nationality").value
    var err = document.getElementById("nationalityError")
    var inp = document.getElementById("nationality")

    if (val === "") {
        err.textContent = "Please select your nationality."
        inp.classList.add("invalid")
        return false
    }
    err.textContent = ""
    inp.classList.remove("invalid")
    return true
}

function validateVisitors() {
    var val = parseInt(document.getElementById("visitors").value)
    var err = document.getElementById("visitorsError")
    var inp = document.getElementById("visitors")

    if (isNaN(val) || val < 1) {
        err.textContent = "Please enter at least 1 visitor."
        inp.classList.add("invalid")
        return false
    }
    if (val > 50) {
        err.textContent = "Maximum 50 visitors per booking."
        inp.classList.add("invalid")
        return false
    }
    err.textContent = ""
    inp.classList.remove("invalid")
    return true
}

function validateDate() {
    var val = document.getElementById("tourDate").value
    var err = document.getElementById("dateError")
    var inp = document.getElementById("tourDate")
    var today = new Date().toISOString().split("T")[0]

    if (val === "") {
        err.textContent = "Please choose a tour date."
        inp.classList.add("invalid")
        return false
    }
    if (val < today) {
        err.textContent = "Tour date cannot be in the past."
        inp.classList.add("invalid")
        return false
    }
    err.textContent = ""
    inp.classList.remove("invalid")
    return true
}

function validateTourType() {
    var val = document.getElementById("tourType").value
    var err = document.getElementById("tourTypeError")
    var inp = document.getElementById("tourType")

    if (val === "") {
        err.textContent = "Please select a tour type."
        inp.classList.add("invalid")
        return false
    }
    err.textContent = ""
    inp.classList.remove("invalid")
    return true
}

// ── FORM SUBMIT HANDLER ──────────────────────────────────────
// Runs when the user clicks "Confirm Booking →"
// 1. Validates all fields
// 2. Creates a Booking object
// 3. Calls its prototype methods
// 4. Fills the confirmation card with the results
// 5. Shows the confirmation section, hides the form

document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault()   // stop the page from refreshing

    // Run all validators — collect results into an array
    var results = [
        validateName(),
        validateEmail(),
        validateNationality(),
        validateVisitors(),
        validateDate(),
        validateTourType()
    ]

    // If ANY validator returned false, stop here
    // Array method: some() — returns true if at least one item matches
    var hasError = results.some(function (r) { return r === false })
    if (hasError) return

    // ── All valid — build the Booking object ──────────────────
    var booking = new Booking(
        document.getElementById("visitorName").value.trim(),
        document.getElementById("visitorEmail").value.trim(),
        document.getElementById("nationality").value,
        parseInt(document.getElementById("visitors").value),
        document.getElementById("tourDate").value,
        document.getElementById("tourType").value,
        document.getElementById("language").value,
        document.getElementById("currency").value
    )

    booking.calculateCost()        // sets booking.cost
    booking.generateReference()    // sets booking.reference

    // ── Fill the confirmation card ────────────────────────────
    document.getElementById("refNumber").textContent = booking.reference
    document.getElementById("confirmName").textContent = booking.name
    document.getElementById("confirmEmail").textContent = booking.email
    document.getElementById("confirmNationality").textContent = booking.nationality
    document.getElementById("confirmTourType").textContent = booking.tourType + " Tour"
    document.getElementById("confirmLanguage").textContent = booking.language
    document.getElementById("confirmDate").textContent = booking.date
    document.getElementById("confirmVisitors").textContent = booking.visitors + " visitor(s)"
    document.getElementById("confirmTotal").textContent = booking.cost

    // ── Show confirmation, scroll to it ──────────────────────
    var confirmSection = document.getElementById("confirmation")
    confirmSection.hidden = false
    confirmSection.scrollIntoView({ behavior: "smooth" })

    // ── Save to the global bookings array (used in Section 5) ─
    allBookings.push(booking)
    renderLog()
    console.log("Booking saved:", booking.getSummary())
})

// Global bookings array — Section 5 (Visitor Log) will read this
var allBookings = []

// ── RESET FUNCTION ────────────────────────────────────────────
// Called by the "Make Another Booking" button
function resetBookingForm() {
    document.getElementById("bookingForm").reset()
    document.getElementById("costPreview").hidden = true
    document.getElementById("confirmation").hidden = true

    // Scroll back up to the booking form
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" })
}

// ═══════════════════════════════════════════
// SECTION 4: VISITOR LOG
// Covers Lesson 10 Parts 6 & 7 — arrays + forEach
// ═══════════════════════════════════════════

// ── renderLog() ─────────────────────────────────────────────
// Reads the allBookings[] array and rebuilds the table.
// Called every time a new booking is added.
//
// Steps:
//   1. Get the <tbody> element
//   2. Clear whatever rows are already there
//   3. Use forEach to loop through allBookings[]
//   4. For each booking, build a <tr> string and insert it
//   5. Update the stat tiles

function renderLog(bookingsToShow) {
    var tbody = document.getElementById("logTableBody")
    var empty = document.getElementById("logEmpty")

    // Default: show all bookings
    if (bookingsToShow === undefined) {
        bookingsToShow = allBookings
    }

    // Clear existing rows
    tbody.innerHTML = ""

    if (bookingsToShow.length === 0) {
        empty.hidden = false
        return
    }

    empty.hidden = true

    // forEach — Lesson 10 Part 7
    // Goes through each booking object and creates a table row
    bookingsToShow.forEach(function (b) {
        var row = document.createElement("tr")

        row.innerHTML =
            '<td class="ref-cell">' + b.reference + "</td>" +
            "<td>" + b.name + "</td>" +
            "<td>" + b.nationality + "</td>" +
            '<td><span class="tour-badge badge-' + b.tourType + '">' +
            b.tourType + "</span></td>" +
            "<td>" + b.date + "</td>" +
            "<td>" + b.visitors + "</td>" +
            "<td><strong>" + b.cost + "</strong></td>" +
            "<td>" + b.language + "</td>"

        tbody.appendChild(row)
    })

    // Update stat tiles
    updateLogStats()
}

// ── updateLogStats() ─────────────────────────────────────────
// Counts totals from allBookings[] and updates the 5 tiles.
// Uses forEach to accumulate counts — Lesson 10 Part 7.

function updateLogStats() {
    var totalBookings = allBookings.length
    var totalVisitors = 0
    var countGeneral = 0
    var countVIP = 0
    var countEducational = 0

    allBookings.forEach(function (b) {
        totalVisitors += b.visitors   // add each booking's visitors to running total

        if (b.tourType === "General") countGeneral++
        if (b.tourType === "VIP") countVIP++
        if (b.tourType === "Educational") countEducational++
    })

    document.getElementById("statTotal").textContent = totalBookings
    document.getElementById("statVisitors").textContent = totalVisitors
    document.getElementById("statGeneral").textContent = countGeneral
    document.getElementById("statVIP").textContent = countVIP
    document.getElementById("statEducational").textContent = countEducational
}

// ── filterLog() ──────────────────────────────────────────────
// Runs on every keystroke in the search box.
// Filters allBookings[] and re-renders with matching results.
// Uses forEach + indexOf — Lesson 10 Part 7.

function filterLog() {
    var query = document.getElementById("logSearch").value.toLowerCase().trim()

    if (query === "") {
        renderLog(allBookings)   // show everything if search is empty
        return
    }

    var filtered = []

    allBookings.forEach(function (b) {
        var searchable = (b.name + b.nationality + b.tourType).toLowerCase()

        // indexOf returns -1 if not found, anything else if found
        if (searchable.indexOf(query) !== -1) {
            filtered.push(b)
        }
    })

    renderLog(filtered)
}

// ── Hook into the booking submit ─────────────────────────────
// After a booking is pushed to allBookings[], re-render the log.
// We do this by overriding the push call in the submit handler.
// Find this line in the submit handler above:
//   allBookings.push(booking)
// And ADD this line directly after it:
//   renderLog()

// ═══════════════════════════════════════════
// SECTION 5: TOUR GUIDE AVAILABILITY CHECKER
// Covers: arrays of objects, forEach, indexOf
// ═══════════════════════════════════════════

// ── The guides array ─────────────────────────────────────────
// An array where each item is an object (Lesson 10 Part 6).
// Each guide object has: name, initials, role, languages,
// available (boolean), and speciality.

var guides = [
    {
        name: "Kwesi Mensah",
        initials: "KM",
        role: "Senior Guide",
        languages: ["English", "Dutch", "Fante"],
        available: true,
        speciality: "Expert in the Dutch colonial period and dungeon history."
    },
    {
        name: "Abena Agyeman",
        initials: "AA",
        role: "Heritage Guide",
        languages: ["English", "French"],
        available: true,
        speciality: "Specialises in diaspora connections and the slave trade routes."
    },
    {
        name: "Kofi Asante",
        initials: "KA",
        role: "Educational Guide",
        languages: ["French", "Fante"],
        available: false,
        speciality: "Leads school and university group tours."
    },
    {
        name: "Ama Brew",
        initials: "AB",
        role: "Cultural Guide",
        languages: ["English", "Spanish", "Fante"],
        available: true,
        speciality: "Covers Elmina town history and the fishing community."
    },
    {
        name: "Yaw Donkor",
        initials: "YD",
        role: "VIP Guide",
        languages: ["English", "Dutch"],
        available: true,
        speciality: "Private tours of restricted areas and the governor's quarters."
    },
    {
        name: "Efua Sekyi",
        initials: "ES",
        role: "Heritage Guide",
        languages: ["French", "Spanish", "English"],
        available: false,
        speciality: "Expert in Portuguese-era architecture and early trade records."
    }
]

// ── renderGuides(list, highlightLang) ────────────────────────
// Builds a card for each guide in the list array.
// highlightLang marks which language tag is currently filtered.

function renderGuides(list, highlightLang) {
    var grid = document.getElementById("guidesGrid")
    var empty = document.getElementById("guidesEmpty")

    grid.innerHTML = ""   // clear previous cards

    if (list.length === 0) {
        empty.hidden = false
        return
    }

    empty.hidden = true

    // forEach — loop through each guide object
    list.forEach(function (guide) {

        // Build the language tags HTML
        // indexOf — check if the highlighted language is in this guide's array
        var langTagsHTML = ""
        guide.languages.forEach(function (lang) {
            var isHighlighted = (lang === highlightLang)
            langTagsHTML += '<span class="lang-tag' +
                (isHighlighted ? " highlighted" : "") + '">' + lang + "</span>"
        })

        // Available or not — pick the right CSS class and label
        var statusClass = guide.available ? "status-available" : "status-unavailable"
        var statusText = guide.available ? "✓ Available" : "✗ Unavailable"
        var cardClass = guide.available ? "" : " unavailable"

        // Build the full card HTML string
        var card = document.createElement("div")
        card.className = "guide-card" + cardClass

        card.innerHTML =
            '<div class="guide-top">' +
            '<div class="guide-avatar">' + guide.initials + "</div>" +
            '<div>' +
            '<div class="guide-name">' + guide.name + "</div>" +
            '<div class="guide-role">' + guide.role + "</div>" +
            "</div>" +
            "</div>" +
            '<span class="guide-status ' + statusClass + '">' + statusText + "</span>" +
            '<div class="guide-languages">' + langTagsHTML + "</div>" +
            '<p class="guide-speciality">' + guide.speciality + "</p>"

        grid.appendChild(card)
    })
}

// ── filterGuides(lang) ───────────────────────────────────────
// Called by each filter button.
// If lang is "All" — show every guide.
// Otherwise — use forEach to collect only guides who speak lang.
//   indexOf on the guide's languages array:
//     returns -1  → language NOT found → skip
//     returns ≥ 0 → language found     → include

function filterGuides(lang) {

    // Update active button styling
    var buttons = document.querySelectorAll(".filter-btn")
    buttons.forEach(function (btn) {
        if (btn.textContent === lang || (lang === "All" && btn.textContent === "All Guides")) {
            btn.classList.add("active")
        } else {
            btn.classList.remove("active")
        }
    })

    if (lang === "All") {
        renderGuides(guides, null)
        return
    }

    // Build filtered list using forEach + indexOf
    var filtered = []

    guides.forEach(function (guide) {
        // indexOf checks if lang exists inside guide.languages array
        if (guide.languages.indexOf(lang) !== -1) {
            filtered.push(guide)
        }
    })

    renderGuides(filtered, lang)   // pass lang so matching tag gets highlighted
}

// Render all guides on page load
renderGuides(guides, null)

// ═══════════════════════════════════════════
// SECTION 6: CASTLE HISTORY TIMELINE
// Covers: array of objects, index-based navigation
// ═══════════════════════════════════════════

// ── Timeline data array ───────────────────────────────────────
// Each item is an object with: year, era, event, detail, power
// "power" = which colonial power was in control at the time

var timeline = [
    {
        year: 1482,
        era: "Portuguese Era",
        event: "The Castle is Built",
        detail: "Portuguese explorer Diogo de Azambuja constructs São Jorge da Mina " +
            "on the Gold Coast. It becomes Europe's first permanent trading post " +
            "in sub-Saharan Africa, initially built to control the gold trade.",
        power: "🇵🇹 Portugal"
    },
    {
        year: 1486,
        era: "Portuguese Era",
        event: "Royal Charter Granted",
        detail: "King John II of Portugal grants Elmina a royal charter, establishing " +
            "it as the administrative capital of Portuguese West Africa. The castle " +
            "is expanded and fortified.",
        power: "🇵🇹 Portugal"
    },
    {
        year: 1553,
        era: "Portuguese Era",
        event: "Slave Trade Begins",
        detail: "The castle's function shifts. What began as a gold-trading fort becomes " +
            "a key holding point for enslaved Africans before their forced passage " +
            "across the Atlantic. The dungeons are expanded.",
        power: "🇵🇹 Portugal"
    },
    {
        year: 1637,
        era: "Dutch Era",
        event: "Dutch Forces Capture the Castle",
        detail: "The Dutch West India Company seizes Elmina from the Portuguese after " +
            "a brief siege. They rename it and make it the headquarters of their " +
            "Gold Coast operations, continuing the slave trade at a larger scale.",
        power: "🇳🇱 Netherlands"
    },
    {
        year: 1660,
        era: "Dutch Era",
        event: "Fort Coenraadsburg Built",
        detail: "The Dutch construct Fort Coenraadsburg on the hill overlooking the castle " +
            "to protect it from attack. The two structures create an interlocking " +
            "defensive system still visible today.",
        power: "🇳🇱 Netherlands"
    },
    {
        year: 1790,
        era: "Dutch Era",
        event: "Peak of the Slave Trade",
        detail: "Elmina Castle processes tens of thousands of enslaved people annually " +
            "at its peak. The 'Door of No Return' becomes the last point of contact " +
            "with African soil for countless captives.",
        power: "🇳🇱 Netherlands"
    },
    {
        year: 1814,
        era: "Abolition Era",
        event: "Dutch Abolish the Slave Trade",
        detail: "Following international pressure and the British abolition of 1807, " +
            "the Netherlands formally abolishes the slave trade. Elmina's purpose " +
            "shifts again — but the castle remains under Dutch control.",
        power: "🇳🇱 Netherlands"
    },
    {
        year: 1872,
        era: "British Era",
        event: "Handed to the British",
        detail: "The Netherlands sells all its Gold Coast possessions — including Elmina " +
            "Castle — to Great Britain as part of the Anglo-Dutch Treaty. The castle " +
            "becomes part of the British Gold Coast colony.",
        power: "🇬🇧 Britain"
    },
    {
        year: 1957,
        era: "Independence",
        event: "Ghana Gains Independence",
        detail: "Ghana becomes the first sub-Saharan African country to gain independence " +
            "from colonial rule. Elmina Castle, along with all colonial structures, " +
            "passes into the hands of the Ghanaian state.",
        power: "🇬🇭 Ghana"
    },
    {
        year: 1979,
        era: "World Heritage",
        event: "UNESCO World Heritage Site",
        detail: "UNESCO designates Elmina Castle — along with Cape Coast Castle and other " +
            "forts along Ghana's coast — as a World Heritage Site. It is recognised " +
            "as a site of outstanding universal value and global significance.",
        power: "🇬🇭 Ghana"
    }
]

// ── Current index — tracks which event is showing ────────────
var currentIndex = 0

// ── renderTimelineEvent(index) ───────────────────────────────
// Takes an index number, reads timeline[index],
// and updates every element in the card.

function renderTimelineEvent(index) {
    var event = timeline[index]   // get the object at this position

    // Update card content
    document.getElementById("tlEra").textContent = event.era
    document.getElementById("tlYear").textContent = event.year
    document.getElementById("tlEvent").textContent = event.event
    document.getElementById("tlDetail").textContent = event.detail
    document.getElementById("tlPower").textContent = event.power

    // Update progress bar
    var percent = ((index + 1) / timeline.length) * 100
    document.getElementById("timelineProgress").style.width = percent + "%"
    document.getElementById("timelineLabel").textContent =
        "Event " + (index + 1) + " of " + timeline.length

    // Enable/disable prev and next buttons
    document.getElementById("tlPrev").disabled = (index === 0)
    document.getElementById("tlNext").disabled = (index === timeline.length - 1)

    // Update dot indicators
    var dots = document.querySelectorAll(".tl-dot")
    dots.forEach(function (dot, i) {
        if (i === index) {
            dot.classList.add("active")
        } else {
            dot.classList.remove("active")
        }
    })
}

// ── timelineStep(direction) ──────────────────────────────────
// Called by the prev (-1) and next (+1) buttons.
// Moves currentIndex by direction, then re-renders.

function timelineStep(direction) {
    var newIndex = currentIndex + direction

    // Guard: don't go below 0 or above the last index
    if (newIndex < 0 || newIndex >= timeline.length) return

    currentIndex = newIndex
    renderTimelineEvent(currentIndex)
}

// ── Build the dot indicators ─────────────────────────────────
// One dot per timeline event — clicking a dot jumps to that event.
// Uses a for loop (Lesson 10 Part 6) to create each dot.

function buildTimelineDots() {
    var dotsContainer = document.getElementById("tlDots")
    dotsContainer.innerHTML = ""

    for (var i = 0; i < timeline.length; i++) {
        var dot = document.createElement("span")
        dot.className = "tl-dot"
        dot.setAttribute("data-index", i)   // store which event this dot links to
        dot.title = timeline[i].year        // tooltip shows the year on hover

            // Each dot needs its own click handler
            // We use an immediately invoked function to capture i correctly
            ; (function (index) {
                dot.addEventListener("click", function () {
                    currentIndex = index
                    renderTimelineEvent(currentIndex)
                })
            })(i)

        dotsContainer.appendChild(dot)
    }
}

// ── Initialise on page load ──────────────────────────────────
buildTimelineDots()
renderTimelineEvent(0)


// ═══════════════════════════════════════════
// SECTION 7: VISITOR FEEDBACK
// Covers: arrays, push, forEach, average calc
// ═══════════════════════════════════════════

// ── Feedback array ────────────────────────────────────────────
// Every submitted review is pushed into this array as an object.
var allFeedback = []

// Tracks which star the user has clicked (0 = none selected)
var selectedRating = 0

// ── Star picker interactions ──────────────────────────────────
// When the user hovers over a star, highlight it and all before it.
// When they click, lock that rating in.

var stars = document.querySelectorAll(".star")

stars.forEach(function (star) {

    // Hover: highlight up to this star
    star.addEventListener("mouseover", function () {
        var hoverVal = parseInt(this.getAttribute("data-value"))
        stars.forEach(function (s) {
            var sVal = parseInt(s.getAttribute("data-value"))
            if (sVal <= hoverVal) {
                s.classList.add("hovered")
            } else {
                s.classList.remove("hovered")
            }
        })
    })

    // Mouse leaves the picker: go back to showing selected rating
    star.addEventListener("mouseleave", function () {
        stars.forEach(function (s) {
            s.classList.remove("hovered")
        })
    })

    // Click: lock in the rating
    star.addEventListener("click", function () {
        selectedRating = parseInt(this.getAttribute("data-value"))

        // Update which stars show as selected
        stars.forEach(function (s) {
            var sVal = parseInt(s.getAttribute("data-value"))
            if (sVal <= selectedRating) {
                s.classList.add("selected")
            } else {
                s.classList.remove("selected")
            }
        })

        // Update the label below the stars
        var labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"]
        document.getElementById("starLabel").textContent =
            selectedRating + " / 5 — " + labels[selectedRating]

        // Clear any rating error
        document.getElementById("fbRatingError").textContent = ""
    })
})

// Mouse leaves the whole picker container: restore selected state
document.getElementById("starPicker").addEventListener("mouseleave", function () {
    stars.forEach(function (s) {
        s.classList.remove("hovered")
    })
})

// ── buildStarString(rating) ───────────────────────────────────
// Converts a number (e.g. 4) into a string of filled/empty stars.
// e.g. buildStarString(4) → "★★★★☆"

function buildStarString(rating) {
    var result = ""
    for (var i = 1; i <= 5; i++) {
        result += (i <= rating) ? "★" : "☆"
    }
    return result
}

// ── updateRatingSummary() ─────────────────────────────────────
// Recalculates the average from allFeedback[] using forEach.
// Updates the big score, star display and review count.

function updateRatingSummary() {
    var summary = document.getElementById("ratingSummary")

    if (allFeedback.length === 0) {
        summary.hidden = true
        return
    }

    summary.hidden = false

    // Add up all ratings using forEach
    var total = 0
    allFeedback.forEach(function (fb) {
        total += fb.rating
    })

    // Calculate average and round to 1 decimal place
    var average = total / allFeedback.length
    var rounded = Math.round(average * 10) / 10   // e.g. 4.333 → 4.3

    document.getElementById("avgScore").textContent = rounded.toFixed(1)
    document.getElementById("avgStars").textContent = buildStarString(Math.round(average))
    document.getElementById("avgCount").textContent = allFeedback.length +
        (allFeedback.length === 1 ? " review" : " reviews")
}

// ── renderReviews() ───────────────────────────────────────────
// Rebuilds the reviews list from allFeedback[].
// Most recent review appears at the top (we reverse the array).

function renderReviews() {
    var list = document.getElementById("reviewsList")
    var empty = document.getElementById("reviewsEmpty")

    list.innerHTML = ""

    if (allFeedback.length === 0) {
        list.appendChild(empty)
        empty.hidden = false
        return
    }

    empty.hidden = true

    // Reverse copy so newest appears first
    var reversed = allFeedback.slice().reverse()

    reversed.forEach(function (fb) {
        var card = document.createElement("div")
        card.className = "review-card"

        card.innerHTML =
            '<div class="review-top">' +
            '<div>' +
            '<div class="review-name">' + fb.name + "</div>" +
            '<div class="review-country">' + (fb.country || "Visitor") + "</div>" +
            "</div>" +
            '<div class="review-stars">' + buildStarString(fb.rating) + "</div>" +
            "</div>" +
            '<p class="review-comment">"' + fb.comment + '"</p>'

        list.appendChild(card)
    })
}

// ── Feedback form submit ──────────────────────────────────────
document.getElementById("feedbackForm").addEventListener("submit", function (e) {
    e.preventDefault()

    var name = document.getElementById("fbName").value.trim()
    var country = document.getElementById("fbCountry").value.trim()
    var comment = document.getElementById("fbComment").value.trim()
    var valid = true

    // Validate name
    if (name === "") {
        document.getElementById("fbNameError").textContent = "Please enter your name."
        document.getElementById("fbName").classList.add("invalid")
        valid = false
    } else {
        document.getElementById("fbNameError").textContent = ""
        document.getElementById("fbName").classList.remove("invalid")
    }

    // Validate rating
    if (selectedRating === 0) {
        document.getElementById("fbRatingError").textContent = "Please select a star rating."
        valid = false
    } else {
        document.getElementById("fbRatingError").textContent = ""
    }

    // Validate comment
    if (comment.length < 10) {
        document.getElementById("fbCommentError").textContent =
            "Please write at least 10 characters."
        document.getElementById("fbComment").classList.add("invalid")
        valid = false
    } else {
        document.getElementById("fbCommentError").textContent = ""
        document.getElementById("fbComment").classList.remove("invalid")
    }

    if (!valid) return

    // Build feedback object and push to array
    var feedback = {
        name: name,
        country: country,
        rating: selectedRating,
        comment: comment
    }

    allFeedback.push(feedback)

    // Update display
    renderReviews()
    updateRatingSummary()

    // Reset form
    document.getElementById("feedbackForm").reset()
    selectedRating = 0
    stars.forEach(function (s) {
        s.classList.remove("selected", "hovered")
    })
    document.getElementById("starLabel").textContent = "Click a star to rate"
})