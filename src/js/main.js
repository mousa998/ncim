function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  });

  const dateTimeEl = document.getElementById("date-time");
  const timeEl = document.getElementById("time");

  if (dateTimeEl) dateTimeEl.textContent = date;
  if (timeEl) timeEl.textContent = time;
}

function fetchWeather() {
  fetch("https://wttr.in/?format=%C&lang=ar")
    .then((res) => res.text())
    .then((condition) => {
      const statusEl = document.getElementById("weather-status");
      const iconEl = document.getElementById("weather-icon");

      if (statusEl) statusEl.textContent = condition;

      if (iconEl) {
        if (condition.includes("غائم")) {
          iconEl.src = "https://openweathermap.org/img/wn/03d.png";
        } else if (condition.includes("مشمس")) {
          iconEl.src = "https://openweathermap.org/img/wn/01d.png";
        } else if (condition.includes("أمطار")) {
          iconEl.src = "https://openweathermap.org/img/wn/09d.png";
        } else {
          iconEl.src = "https://openweathermap.org/img/wn/50d.png";
        }
      }
    })
    .catch((err) => console.error("Weather fetch error:", err));
}

function getCity() {
  // ✅ CORS-safe API for location
  fetch(
    "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=ar"
  )
    .then((res) => res.json())
    .then((data) => {
      const locationEl = document.getElementById("location");
      if (locationEl)
        locationEl.textContent = data.city || data.locality || "غير معروف";
    })
    .catch((err) => console.error("City fetch error:", err));
}

function initWeatherWidget() {
  fetchWeather();
  updateDateTime();
  setInterval(updateDateTime, 60000);
}

function updateYear() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll(".year").forEach((el) => {
    el.textContent = currentYear;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initWeatherWidget();
  getCity();
  updateYear();
  initFeedbackComponent();
});
function initFeedbackComponent() {
  const feedbackForm = document.getElementById("feedbackForm");
  if (!feedbackForm) return;

  // Get elements with IDs
  const feedbackCollapse = new bootstrap.Collapse("#feedback", {
    toggle: false,
  });
  const positiveFeedback = document.getElementById("positiveFeedback");
  const positiveFeedbackBtn = document.getElementById("positiveFeedbackBtn");
  const negativeFeedbackBtn = document.getElementById("negativeFeedbackBtn");
  const closeFeedbackBtn = document.getElementById("closeFeedbackBtn");

  // Other elements remain the same
  const reasonCheckboxes = document.querySelectorAll(".reason-checkbox");
  const reasonInvalid = document
    .querySelector(".reason-checkbox")
    ?.closest("div")
    ?.parentElement.querySelector(".invalid-feedback");
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const genderInvalid = genderRadios[0]
    ?.closest("div")
    ?.parentElement.parentElement.parentElement.querySelector(
      ".invalid-feedback"
    );

  function showPositiveFeedback() {
    feedbackCollapse.hide();
    positiveFeedback.classList.remove("d-none");
    closeFeedbackBtn.classList.add("d-none");
    // Submit positive feedback logic here
    console.log("Positive feedback submitted");
  }

  function showNegativeFeedback() {
    feedbackCollapse.show();
    positiveFeedback.classList.add("d-none");
    closeFeedbackBtn.classList.remove("d-none");
  }

  function closeFeedback() {
    feedbackCollapse.hide();
    positiveFeedback.classList.remove("d-none");
    closeFeedbackBtn.classList.add("d-none");
  }

  // Event listeners with proper IDs
  positiveFeedbackBtn?.addEventListener("click", showPositiveFeedback);
  negativeFeedbackBtn?.addEventListener("click", showNegativeFeedback);
  closeFeedbackBtn?.addEventListener("click", closeFeedback);

  // Rest of your validation code remains the same
  function validateForm() {
    let valid = true;

    // Reasons validation
    if (![...reasonCheckboxes].some((cb) => cb.checked)) {
      reasonInvalid?.classList.add("d-block");
      valid = false;
    } else {
      reasonInvalid?.classList.remove("d-block");
    }

    // Gender validation
    if (![...genderRadios].some((rb) => rb.checked)) {
      genderInvalid?.classList.add("d-block");
      valid = false;
    } else {
      genderInvalid?.classList.remove("d-block");
    }

    return valid;
  }

  feedbackForm.addEventListener("submit", function (e) {
    if (!validateForm()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      // Form is valid, submit logic here
      console.log("Form submitted successfully");
    }
  });

  // Attach validation listeners
  reasonCheckboxes.forEach((cb) =>
    cb.addEventListener("change", () => {
      if ([...reasonCheckboxes].some((c) => c.checked)) {
        reasonInvalid?.classList.remove("d-block");
      }
    })
  );

  genderRadios.forEach((rb) =>
    rb.addEventListener("change", () => {
      if ([...genderRadios].some((r) => r.checked)) {
        genderInvalid?.classList.remove("d-block");
      }
    })
  );
}
