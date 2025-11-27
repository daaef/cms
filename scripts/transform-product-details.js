import fs from 'fs';

// Read the seed data
const data = JSON.parse(fs.readFileSync('seed-data/zibot-product-detail.json', 'utf8'));

// Transform each section to flatten sectionData
data.sections = data.sections.map(section => {
  const { sectionType, sectionData } = section;

  // Get the section type's data (e.g., sectionData.hero becomes the new hero field)
  const sectionContent = sectionData[sectionType];

  // Return flattened structure: { sectionType: 'hero', hero: {...} }
  return {
    sectionType,
    [sectionType]: sectionContent
  };
});

// Write back
fs.writeFileSync('seed-data/zibot-product-detail.json', JSON.stringify(data, null, 2));

console.log('✅ Transformed product details seed data');
