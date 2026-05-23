/**
 * Canopy & Root - Main JavaScript
 * Handles form submission, validation, and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
  // Form submission handler
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Clear previous messages
      formMessage.className = 'form-message';
      formMessage.textContent = '';
      formMessage.style.display = 'none';

      // Validate form
      if (!validateForm(contactForm)) {
        showFormMessage(formMessage, 'Please fill in all required fields.', 'error');
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        // Submit form to Formspree
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          contactForm.reset();
          showFormMessage(formMessage, 'Thank you! Your message has been sent. I\'ll be in touch within 24 hours.', 'success');
        } else {
          // Error
          const errorData = await response.json();
          showFormMessage(formMessage, errorData.message || 'There was an error submitting your form. Please try again.', 'error');
        }
      } catch (error) {
        showFormMessage(formMessage, 'There was an error submitting your form. Please try again later.', 'error');
        console.error('Form submission error:', error);
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message →';
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Adjust for sticky nav height
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

/**
 * Validate form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if form is valid
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#dc2626';
      isValid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  return isValid;
}

/**
 * Display form submission message
 * @param {HTMLElement} element - The message element
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function showFormMessage(element, message, type) {
  element.textContent = message;
  element.className = `form-message ${type}`;
  element.style.display = 'block';

  // Hide message after 10 seconds
  setTimeout(() => {
    element.style.display = 'none';
  }, 10000);
}