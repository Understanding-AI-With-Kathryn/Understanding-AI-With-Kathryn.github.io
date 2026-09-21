// Understanding AI with Kathryn — shared site behavior
// The intake form (form[data-real-form]) submits by email via FormSubmit.co.
// It never books or charges anything — booking and payment happen only through
// the Gumroad links on the offer page.
(function () {
  "use strict";

  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector("nav.primary-nav");
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close menu" : "Menu";
    });
    // Close the mobile menu after a nav link is activated (keyboard or pointer).
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && window.matchMedia("(max-width: 720px)").matches) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  // Demo form handler: attach to any <form data-demo-form> on the page.
  // Prevents the browser's real submission, does basic accessible validation,
  // and shows a status message that is explicit about this being a preview.
  function initDemoForms() {
    var forms = document.querySelectorAll("form[data-demo-form]");
    forms.forEach(function (form) {
      var status = form.querySelector(".form-status");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        if (status) {
          status.textContent =
            "Preview only — nothing was sent or saved. In the live site this step would hand your answers to Kathryn for review, not process a booking or payment.";
          status.classList.add("show");
          status.setAttribute("role", "alert");
          status.tabIndex = -1;
          status.focus();
        }
        form.reset();
      });
    });
  }

  // Real form handler: attach to any <form data-real-form> on the page.
  // Submits via fetch to the form's action (FormSubmit.co) and shows an
  // inline confirmation instead of navigating away.
  function initRealForms() {
    var forms = document.querySelectorAll("form[data-real-form]");
    forms.forEach(function (form) {
      var status = form.querySelector(".form-status");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        var data = new FormData(form);
        fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Request failed");
            return res.json();
          })
          .then(function () {
            if (status) {
              status.textContent =
                "Sent — thank you. Kathryn will follow up by email. This only sends your answers; it doesn't book or charge anything. To book a tier, use the Gumroad links on the offer page.";
              status.classList.add("show");
              status.setAttribute("role", "status");
              status.tabIndex = -1;
              status.focus();
            }
            form.reset();
          })
          .catch(function () {
            if (status) {
              status.textContent =
                "Something went wrong sending this. Please try again, or email understandingaiwithkathryn@gmail.com directly.";
              status.classList.add("show");
              status.setAttribute("role", "alert");
              status.tabIndex = -1;
              status.focus();
            }
          })
          .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initDemoForms();
    initRealForms();
  });
})();
