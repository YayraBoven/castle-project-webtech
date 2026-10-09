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