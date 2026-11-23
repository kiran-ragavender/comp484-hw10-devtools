// =====================================================================
// HW10: Chrome DevTools demos for Giga Pets
// Open DevTools (F12 or Ctrl+Shift+J) and use the "DevTools Lab" buttons.
// The console demos also run once automatically when the page loads.
// =====================================================================

$(function() {
  runConsoleDemos();

  $('#log-demo-btn').click(runConsoleDemos);
  $('#error-404-btn').click(loadNewPetImage);
  $('#type-error-btn').click(findMissingPet);
  $('#violation-btn').click(slowClickHandler);
});

// ---------------------------------------------------------------------
// Part 2.1: Console message logging
// ---------------------------------------------------------------------
function runConsoleDemos() {
  // Log Custom: %c applies the CSS in the next argument to the text after it
  console.log(
    '%c🐾 Giga Pets %c DevTools Lab ',
    'background:#e0742a; color:white; font:600 16px Fredoka, sans-serif; padding:4px 10px; border-radius:6px 0 0 6px;',
    'background:#3b2f2a; color:#ffe6cf; font:600 16px Fredoka, sans-serif; padding:4px 10px; border-radius:0 6px 6px 0;'
  );

  // Log Info: console.log() and console.info() are both "Info" level messages
  console.log('[Giga Pets] Game loaded with ' + pets.length + ' pets.');
  console.info('[Giga Pets] Selected pet: ' + pet_info['name'] + ' (' + pet_info['species'] + ')');

  // Log Warning: shown with a yellow background and a stack trace you can expand
  if (HUNGER_TICK_MS < 10000) {
    console.warn('[Giga Pets] Pets get hungrier every ' + HUNGER_TICK_MS / 1000 + ' seconds. Feed them often!');
  }

  // Log Error: shown in red, counted in the Errors filter
  console.error('[Giga Pets] Demo error: this is what console.error() looks like (nothing is actually broken).');

  // Log Table: every pet object in the pets array, showing only the useful columns
  console.table(pets, ['name', 'species', 'weight', 'happiness', 'hunger']);

  // Log Group: one collapsible group per pet, nested inside a "Pet report" group
  console.group('[Giga Pets] Pet report');
  $.each(pets, function(index, pet) {
    console.group(pet['name'] + (pet === pet_info ? ' (selected)' : ''));
    console.log('Species: ' + pet['species']);
    console.log('Weight: ' + pet['weight'] + ' pounds');
    console.log('Happiness: ' + pet['happiness'] + ' ' + species_info[pet['species']].unit);
    console.log('Hunger: ' + pet['hunger'] + ' / ' + MAX_HUNGER);
    console.log('Mood: ' + (isPetSad(pet) ? 'needs care' : 'happy'));
    console.groupEnd();
  });
  console.groupEnd();
}

// ---------------------------------------------------------------------
// Part 2.2: Browser-logged messages
// ---------------------------------------------------------------------

// 404: asks for a picture of a 4th pet, "Mochi", that doesn't exist in images/.
// The BROWSER logs "GET .../images/mochi.svg 404 (Not Found)" (a network message),
// and then our code logs its own console.error (a user message).
function loadNewPetImage() {
  fetch('images/mochi.svg')
    .then(function(response) {
      if (!response.ok) {
        console.error('[Giga Pets] Could not load Mochi\'s picture: ' + response.status + ' ' + response.statusText);
      }
    });
}

// TypeError: looks up a pet that isn't in the pets array. find() returns undefined,
// and reading .name on undefined throws
// "Uncaught TypeError: Cannot read properties of undefined (reading 'name')".
// It is not caught on purpose, so the browser logs it.
function findMissingPet() {
  var pet = pets.find(function(p) {
    return p['name'] === 'Mochi';
  });
  showPetMessage('Looking for ' + pet.name + '...', true);
}

// Violation: this click handler blocks the main thread for about 600ms.
// Chrome logs "[Violation] 'click' handler took ___ms" because handlers should
// finish quickly. Violations are "Verbose" level, so turn on Verbose in the
// Default levels menu to see them.
function slowClickHandler() {
  var start = Date.now();
  while (Date.now() - start < 600) {
    // busy-wait on purpose (pretend we're doing heavy work)
  }
  showPetMessage('Phew, that took a while... 🐢', false);
}
