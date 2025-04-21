const fs = require('fs');
const path = require('path');

// Create the assets/image directory structure
const imageDir = path.join(__dirname, 'public', 'assets', 'image');

// Ensure directories exist
fs.mkdirSync(path.join(__dirname, 'public', 'assets'), { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });

// Simple HTML templates for test images - these will work in any browser
const createTestHTML = (text, color) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
    .container {
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .box {
      width: 90%;
      height: 90%;
      background: ${color};
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 24px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="box">${text}</div>
  </div>
</body>
</html>
`;

// Create test images
const testImages = [
  { name: 'presentation.png', text: 'Presentation Image', color: '#9b59b6' },
  { name: 'question.png', text: 'Question Image', color: '#3498db' },
  { name: 'solution.png', text: 'Solution Image', color: '#2ecc71' },
  { name: 'sunny.png', text: 'Sunny Image', color: '#f1c40f' },
  { name: 'rainy.png', text: 'Rainy Image', color: '#3498db' },
  { name: 'cloudy.png', text: 'Cloudy Image', color: '#95a5a6' },
  { name: 'mild.png', text: 'Mild Image', color: '#e67e22' }
];

// Write test images as HTML files that can be opened in a browser
for (const image of testImages) {
  const htmlContent = createTestHTML(image.text, image.color);
  
  // Save as .html for now
  const filePath = path.join(imageDir, image.name.replace('.png', '.html'));
  
  fs.writeFileSync(filePath, htmlContent);
  console.log(`Created test image: ${filePath}`);
}

console.log('\nTest HTML files created in the public/assets/image directory.');
console.log('To use them as actual images:');
console.log('1. Open each HTML file in a browser');
console.log('2. Take a screenshot');
console.log('3. Save the screenshot as the corresponding .png file in the same directory');
console.log('\nOr you can run modify-weathercow.js to update the component to use HTML files directly.\n');
