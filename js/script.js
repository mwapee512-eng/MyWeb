'use strict';

/* Elite Merchandise Traders and IT student portfolio interactions. */

/* Shortcut for finding an element by id */
function byId(id) {
  return document.getElementById(id);
}

/* ---------- 1. Contact form validation and preview ---------- */

/* Returns true when the text looks like name@domain.ext */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/* Shows or clears an error message beside a field */
function setFieldError(input, errorBox, message) {
  errorBox.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

/* Checks all three fields and returns the cleaned values, or null if invalid */
function validateContactForm() {
  const nameInput = byId('name');
  const emailInput = byId('email');
  const messageInput = byId('message');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  let valid = true;
  let firstInvalid = null;

  if (name === '') {
    setFieldError(nameInput, byId('name-error'), 'Enter your name. Spaces alone are not accepted.');
    valid = false;
    firstInvalid = firstInvalid || nameInput;
  } else {
    setFieldError(nameInput, byId('name-error'), '');
  }

  if (email === '') {
    setFieldError(emailInput, byId('email-error'), 'Enter your email address.');
    valid = false;
    firstInvalid = firstInvalid || emailInput;
  } else if (!isValidEmail(email)) {
    setFieldError(emailInput, byId('email-error'), 'Enter an email in the format name@example.com.');
    valid = false;
    firstInvalid = firstInvalid || emailInput;
  } else {
    setFieldError(emailInput, byId('email-error'), '');
  }

  if (message === '') {
    setFieldError(messageInput, byId('message-error'), 'Write a message. Spaces alone are not accepted.');
    valid = false;
    firstInvalid = firstInvalid || messageInput;
  } else {
    setFieldError(messageInput, byId('message-error'), '');
  }

  if (!valid) {
    firstInvalid.focus();
    return null;
  }
  return { name: name, email: email, message: message };
}

/* Builds the on-page summary using textContent so typed text is never run as HTML */
function showPreview(data) {
  const box = byId('form-status');
  box.textContent = '';

  const heading = document.createElement('h3');
  heading.textContent = 'Form checked. Your details were validated.';
  box.appendChild(heading);

  const note = document.createElement('p');
  note.textContent = 'Preview only. No message was sent or delivered.';
  box.appendChild(note);

  const list = document.createElement('dl');
  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Message', data.message]
  ];
  rows.forEach(function (row) {
    const term = document.createElement('dt');
    term.textContent = row[0];
    const desc = document.createElement('dd');
    desc.textContent = row[1];
    list.appendChild(term);
    list.appendChild(desc);
  });
  box.appendChild(list);
  box.hidden = false;
}

/* Handles the form submit event and keeps everything local */
function handleContactSubmit(event) {
  event.preventDefault();
  const data = validateContactForm();
  const box = byId('form-status');
  if (data) {
    showPreview(data);
  } else {
    box.hidden = true;
    box.textContent = '';
  }
}

/* ---------- Theme switch ---------- */

/* Applies the light or dark theme and updates the button label */
function applyTheme(theme) {
  const button = byId('theme-toggle');
  document.documentElement.setAttribute('data-theme', theme);
  button.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

function setupTheme() {
  const button = byId('theme-toggle');
  let saved = null;
  try {
    saved = localStorage.getItem('theme');
  } catch (error) {
    saved = null; // storage blocked, continue with the default theme
  }
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  button.addEventListener('click', function () {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      // saving the preference is optional
    }
  });
}

/* ---------- Project filter and expandable details ---------- */

/* Shows only the project cards whose text or keywords match the search */
function filterProjects() {
  const query = byId('project-search').value.trim().toLowerCase();
  const cards = document.querySelectorAll('.project');
  const message = byId('filter-message');
  let visible = 0;

  cards.forEach(function (card) {
    const text = (card.textContent + ' ' + card.dataset.keywords).toLowerCase();
    const match = query === '' || text.indexOf(query) !== -1;
    card.hidden = !match;
    if (match) { visible++; }
  });

  if (query === '') {
    message.textContent = '';
    message.classList.remove('is-error');
  } else if (visible === 0) {
    message.textContent = 'No skills match "' + query + '". Press Reset to see all of them.';
    message.classList.add('is-error');
  } else {
    message.textContent = 'Showing ' + visible + ' of ' + cards.length + ' skills.';
    message.classList.remove('is-error');
  }
}

/* Clears the search box and shows every project again */
function resetFilter() {
  byId('project-search').value = '';
  filterProjects();
  byId('project-search').focus();
}

/* Opens or closes one project's details and updates the button state */
function toggleDetails(button) {
  const panel = byId(button.getAttribute('aria-controls'));
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  button.textContent = willOpen ? 'Hide details' : 'Show details';
}

/* ---------- Start everything once the page is ready ---------- */
function init() {
  setupTheme();

  byId('contact-form').addEventListener('submit', handleContactSubmit);

  byId('project-search').addEventListener('input', filterProjects);
  byId('filter-reset').addEventListener('click', resetFilter);

  document.querySelectorAll('.toggle-details').forEach(function (button) {
    button.addEventListener('click', function () { toggleDetails(button); });
  });
}

init();
