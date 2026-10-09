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