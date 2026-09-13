import fs from 'fs';
import path from 'path';

/**
 * Article Cleaner & Sanitizer for TECHNO4 FRAMEWORK 2.0 Docs
 */
export class ArticleCleaner {
  constructor(options = {}) {
    this.canonicalBaseUrl = options.canonicalBaseUrl || 'https://techno4.online/techno4-framework2';
  }

  /**
   * Clean raw article text (HTML + YOOtheme JSON comment)
   * @param {string} rawText 
   * @param {number|string} articleId 
   * @param {string} alias 
   * @returns {{ cleanedText: string, changes: string[] }}
   */
  cleanArticleText(rawText = '', articleId = null, alias = '') {
    let text = rawText;
    const changes = [];

    // 1. Remove stray area-chart snippet if this is not the area-chart article (ID 48)
    if (String(articleId) !== '48') {
      const strayAreaChartRegex = /<pre><code>(?:&lt;!--|<!--)\s*Area Chart element[\s\S]*?<\/code><\/pre>/gi;
      if (strayAreaChartRegex.test(text)) {
        text = text.replace(strayAreaChartRegex, '');
        changes.push('Видалено чужий фрагмент Area Chart');
      }

      const strayDivRegex = /<div class=["']area-chart["']><\/div>/gi;
      if (strayDivRegex.test(text)) {
        text = text.replace(strayDivRegex, '');
        changes.push('Видалено порожній div area-chart');
      }
    }

    // 2. Remove dummy placeholder tables with "Значення за замовчуванням"
    const dummyTableRegex = /<table>\s*<thead>\s*<tr>\s*<th>Значення за замовчуванням<\/th>[\s\S]*?<\/tbody>\s*<\/table>/gi;
    if (dummyTableRegex.test(text)) {
      text = text.replace(dummyTableRegex, '');
      changes.push('Видалено копіпаст-заглушку таблиці значень');
    }

    // 3. Fix outdated routes and links
    if (text.includes('/фреймворк') || text.includes('/надбання/фреймворк') || text.includes('Itemid=150')) {
      text = text.replace(/https:\/\/techno4\.online\/надбання\/фреймворк\/?/g, 'https://techno4.online/techno4-framework2/');
      text = text.replace(/https:\/\/techno4\.online\/фреймворк\/?/g, 'https://techno4.online/techno4-framework2/');
      text = text.replace(/\/надбання\/фреймворк\/?/g, '/techno4-framework2/');
      text = text.replace(/\/фреймворк\/?/g, '/techno4-framework2/');
      text = text.replace(/index\.php\?Itemid=150/g, `https://techno4.online/techno4-framework2/${alias || ''}`);
      changes.push('Оновлено старі URL-посилання на канонічний роут /techno4-framework2');
    }

    // 4. Clean namespace & npm install commands
    if (text.includes('npm install Framework7') || text.includes('npm install Techno4')) {
      text = text.replace(/npm install Framework7/g, 'npm install techno4');
      text = text.replace(/npm install Techno4/g, 'npm install techno4');
      changes.push('Виправлено команду npm install techno4');
    }

    if (text.includes('f7-icons')) {
      text = text.replace(/f7-icons/g, 't4-icons');
      changes.push('Замінено іконки f7-icons на t4-icons');
    }

    // 5. Clean YOOtheme AST layout JSON in HTML comment
    const commentMatch = text.match(/<!--\s*(\{[\s\S]*?"type"\s*:\s*"layout"[\s\S]*?\})\s*-->/);
    if (commentMatch) {
      try {
        const layoutObj = JSON.parse(commentMatch[1]);
        let astChanged = false;

        const cleanNode = (node) => {
          if (!node) return;
          if (node.children && Array.isArray(node.children)) {
            const initialCount = node.children.length;
            node.children = node.children.filter(child => {
              // Filter out stray Area chart blocks if not area-chart article
              if (String(articleId) !== '48') {
                if (child.type === 'code' && child.props?.content?.includes('area-chart')) {
                  astChanged = true;
                  return false;
                }
                if (child.type === 'table' && child.props?.table_head_title === 'Значення за замовчуванням') {
                  astChanged = true;
                  return false;
                }
              }
              return true;
            });

            // Clean URLs inside child props
            for (const child of node.children) {
              if (child.props) {
                for (const key of Object.keys(child.props)) {
                  if (typeof child.props[key] === 'string') {
                    const original = child.props[key];
                    let updated = original
                      .replace(/https:\/\/techno4\.online\/надбання\/фреймворк\/?/g, 'https://techno4.online/techno4-framework2/')
                      .replace(/https:\/\/techno4\.online\/фреймворк\/?/g, 'https://techno4.online/techno4-framework2/')
                      .replace(/\/надбання\/фреймворк\/?/g, '/techno4-framework2/')
                      .replace(/\/фреймворк\/?/g, '/techno4-framework2/')
                      .replace(/index\.php\?Itemid=150/g, `https://techno4.online/techno4-framework2/${alias || ''}`)
                      .replace(/f7-icons/g, 't4-icons');
                    if (updated !== original) {
                      child.props[key] = updated;
                      astChanged = true;
                    }
                  }
                }
              }
            }

            node.children.forEach(cleanNode);
          }
        };

        cleanNode(layoutObj);

        if (astChanged) {
          const newJson = JSON.stringify(layoutObj);
          text = text.replace(commentMatch[0], `<!-- ${newJson} -->`);
          changes.push('Очищено та валідовано дерево YOOtheme AST');
        }
      } catch (err) {
        console.warn(`Не вдалося розпарсити AST статті ${articleId}:`, err.message);
      }
    }

    return {
      cleanedText: text,
      changes
    };
  }
}
