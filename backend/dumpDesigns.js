require('dotenv').config();
const connectDB = require('./config/db');
const Design = require('./models/Design');
const Category = require('./models/Category');

const dump = async () => {
  await connectDB();
  
  const designs = await Design.find().populate('category');
  const categories = await Category.find();
  
  console.log('\n--- Real Database Dump ---');
  console.log(`Total Categories in DB: ${categories.length}`);
  console.log(`Total Designs in DB: ${designs.length}`);
  
  console.log('\n--- Design Titles ---');
  designs.forEach(d => {
    console.log(`- [${d.designId}] ${d.title_en} (${d.category ? d.category.name_en : 'No Category'})`);
  });
  
  process.exit(0);
};

dump();
