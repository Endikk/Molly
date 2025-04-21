const fs = require('fs');
const path = require('path');

// Create the assets/image directory structure
const imageDir = path.join(__dirname, 'public', 'assets', 'image');

// Create directories if they don't exist
fs.mkdirSync(path.join(__dirname, 'public', 'assets'), { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });

console.log('Image directory structure created at:', imageDir);
console.log('\nMake sure to place these images in the directory:');
console.log('1. question.png - The cow thinking/asking about weather');
console.log('2. solution.png - The cow about to reveal the weather');
console.log('3. sunny.png - The cow in sunny weather');
console.log('4. rainy.png - The cow in rainy weather');
console.log('5. cloudy.png - The cow in cloudy weather');
console.log('6. mild.png - The cow in mild weather conditions');
