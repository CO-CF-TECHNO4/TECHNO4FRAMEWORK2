import { YOOthemeWrapper } from './lib/yootheme.mjs';
import fs from 'fs';

const raw = fs.readFileSync('./docs-site/content/articles/131_segmented.html', 'utf8');
const wrapper = new YOOthemeWrapper();
const parsed = wrapper.parse(raw);

console.log('Parsed HTML length:', parsed.html.length);
console.log('Parsed Layout exists:', !!parsed.layout);
console.log('Layout version:', parsed.layout?.version);
console.log('Layout children count:', parsed.layout?.children?.length);
console.log('Section props id:', parsed.layout?.children?.[0]?.props?.id);

// Test markdown to YOOtheme generation
const sampleMd = `# Тестовий компонент

## Огляд
Це тестовий опис компонента у стилі TECHNO4.

## Приклад коду

\`\`\`html
<div class="test">Hello TECHNO4</div>
\`\`\`
`;

const generated = wrapper.markdownToDoc(sampleMd, { title: 'Тестовий компонент', menuModuleId: '123' });
console.log('\n--- Generated Document Test ---');
console.log('Fallback HTML lines:', generated.html.split('\n').length);
console.log('Layout valid:', !!generated.layout);
console.log('Contains YOOtheme comment:', generated.fullText.includes('<!-- {'));
console.log('Section elements count:', generated.layout.children[0].children[1].children[0].children.length);
console.log('First 200 chars of fullText:\n', generated.fullText.slice(0, 200));
