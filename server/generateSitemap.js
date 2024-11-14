const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

// Example function to simulate database fetching of dynamic route data
async function getDynamicData() {
  // Replace with actual database calls
  return {
    courses: [{ id: '67220cb1cb52984599b32ac4' }, { id: '672e317e2aff4fd0a1645dec' }],
    catalogs: [{ name: 'Web-Dev' }, { name: 'data-science' },{name:"Mobile-Application"}],
  };
}

async function generateSitemap() {
  const hostname = 'https://studynotion-e-learning.vercel.app';
  const sitemap = new SitemapStream({ hostname });

  // Static routes
  const staticRoutes = [
    '/',
    '/about',
    '/login',
    '/signup',
    '/verify-email',
    '/forgot-password',
    '/contact',
    '/dashboard/my-profile',
    '/dashboard/settings',
    '/dashboard/enrolled-courses',
    '/dashboard/cart',
    '/dashboard/my-courses',
    '/dashboard/add-course',
    '/manage-category',
  ];
  
  staticRoutes.forEach(route => {
    sitemap.write({ url: route, changefreq: 'daily', priority: 0.8 });
  });

  // Fetch dynamic data for routes
  const { courses, catalogs } = await getDynamicData();

  // Dynamic course routes
  courses.forEach(course => {
    sitemap.write({ url: `/courses/${course.id}`, changefreq: 'weekly', priority: 0.7 });
  });

  // Dynamic catalog routes
  catalogs.forEach(catalog => {
    sitemap.write({ url: `/catalog/${catalog.name}`, changefreq: 'weekly', priority: 0.6 });
  });

  // Nested private routes for course details
  courses.forEach(course => {
    sitemap.write({ url: `/view-course/${course.id}/section/1/sub-section/1`, changefreq: 'weekly', priority: 0.5 });
  });

  sitemap.end();

  // Save the generated sitemap as XML
  const sitemapXML = await streamToPromise(sitemap).then(data => data.toString());
  fs.writeFileSync(path.join(__dirname,'..', 'public', 'sitemap.xml'), sitemapXML);

  console.log('Sitemap generated successfully!');
}

generateSitemap().catch(console.error);
