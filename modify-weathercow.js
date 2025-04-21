const fs = require('fs');
const path = require('path');

const weatherCowPath = path.join(__dirname, 'src', 'components', 'WeatherCow', 'index.tsx');

try {
  let content = fs.readFileSync(weatherCowPath, 'utf8');
  
  // Fix the Windows path in the component
  content = content.replace(/\\src\\assets\\image\\question\.png/g, '/assets/image/question.png');
  
  // Optional: Convert to use HTML files instead of PNG
  content = content.replace(/\/assets\/image\/([a-zA-Z]+)\.png/g, '/assets/image/$1.html');
  
  fs.writeFileSync(weatherCowPath, content);
  
  console.log('Successfully updated WeatherCow component to use correct paths.');
  console.log('Component now uses .html test files instead of .png files.');
  console.log('Restart your development server to see the changes.');
} catch (err) {
  console.error('Error updating WeatherCow component:', err);
}
