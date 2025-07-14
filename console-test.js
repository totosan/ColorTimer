// Quick test script to verify relative time units
// Run this in the browser console when the app is loaded

console.log('Testing relative time units...');

// Test the functions directly from the app instance
const app = window.colorTimer;

// Test cases
const tests = [
    { duration: 60, expectedUnit: 'seconds', testName: '1 minute timer' },
    { duration: 120, expectedUnit: 'seconds', testName: '2 minute timer (boundary)' },
    { duration: 300, expectedUnit: 'minutes', testName: '5 minute timer' },
    { duration: 1800, expectedUnit: 'minutes', testName: '30 minute timer' },
    { duration: 7200, expectedUnit: 'minutes', testName: '2 hour timer (boundary)' },
    { duration: 10800, expectedUnit: 'hours', testName: '3 hour timer' }
];

tests.forEach(test => {
    // Set the timer duration
    app.timer.setTime(0, test.duration);

    // Get the optimal unit
    const unit = app.getOptimalTimeUnit(test.duration);

    // Test conversions
    const halfDuration = test.duration / 2;
    const halfInUnit = app.convertSecondsToRelativeUnit(halfDuration, unit);
    const backToSeconds = app.convertRelativeUnitToSeconds(halfInUnit, unit);

    console.log(`${test.testName}:`);
    console.log(`  Duration: ${test.duration}s`);
    console.log(`  Unit: ${unit.unit} (${unit.label})`);
    console.log(`  Half duration: ${halfDuration}s → ${halfInUnit} ${unit.label} → ${backToSeconds}s`);
    console.log(`  Expected unit: ${test.expectedUnit}, Actual: ${unit.unit}, Match: ${test.expectedUnit === unit.unit ? '✓' : '✗'}`);
    console.log('---');
});

console.log('Test complete! Open the event editor with different timer durations to see the units in action.');
