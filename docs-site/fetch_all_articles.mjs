import https from 'https';
import fs from 'fs';
import path from 'path';

const token = 'c2hhMjU2Ojk3NDowYzgxMTJmMDFlMDhiNzg1MDMxOGEzN2Y2MzY4YTUzYmJkMjJmMTU2MDhiMWI3ZTUzYjUzOWU5OGFkZmQ4NDhl';
const outputDir = 'D:/_DEVE/framework_techno4/TECHNO4FRAMEWORK2/docs-site/content';
const articlesDir = path.join(outputDir, 'articles');

fs.mkdirSync(articlesDir, { recursive: true });

async function get(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'techno4.online',
      port: 443,
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': 'Techno4-Agent/2.0',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.api+json'
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function fetchAllFrameworkArticles() {
  console.log('🔄 Fetching all articles from category 11 (Framework)...');
  const allArticles = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    console.log(`  Fetching offset ${offset} (limit ${limit})...`);
    const res = await get(`/api/v1/content/articles?filter[category]=11&page[offset]=${offset}&page[limit]=${limit}`);
    if (!res.data || res.data.length === 0) break;
    
    allArticles.push(...res.data);
    if (!res.links || !res.links.next) break;
    offset += limit;
  }

  console.log(`✅ Total articles fetched: ${allArticles.length}`);

  // Save index json
  const indexData = allArticles.map(a => ({
    id: a.id,
    title: a.attributes.title,
    alias: a.attributes.alias,
    state: a.attributes.state,
    created: a.attributes.created,
    modified: a.attributes.modified,
    hasYOOtheme: (a.attributes.text || '').includes('{"type":"layout"'),
    textLength: (a.attributes.text || '').length
  }));

  fs.writeFileSync(path.join(outputDir, 'articles-index.json'), JSON.stringify(indexData, null, 2), 'utf8');

  // Save each article in full detail
  for (const a of allArticles) {
    const filename = `${String(a.id).padStart(3, '0')}_${a.attributes.alias || 'article'}.json`;
    fs.writeFileSync(path.join(articlesDir, filename), JSON.stringify(a, null, 2), 'utf8');
    
    // Also save raw text/HTML for easy inspection
    const htmlFilename = `${String(a.id).padStart(3, '0')}_${a.attributes.alias || 'article'}.html`;
    fs.writeFileSync(path.join(articlesDir, htmlFilename), a.attributes.text || '', 'utf8');
  }

  console.log(`✅ All ${allArticles.length} articles saved to ${articlesDir}`);
  return indexData;
}

fetchAllFrameworkArticles().catch(console.error);
