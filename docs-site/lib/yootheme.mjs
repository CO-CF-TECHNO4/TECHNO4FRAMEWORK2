/**
 * YOOtheme Pro Layout Engine & Wrapper for TECHNO4 FRAMEWORK2
 * 
 * Target platform: Joomla 5 / YOOtheme Pro 4.3.x / YOOessentials 2.2.x
 */

export class YOOthemeWrapper {
  constructor(options = {}) {
    this.version = options.version || '4.5.6';
    this.yooessentialsVersion = options.yooessentialsVersion || '2.3.8';
    this.defaultMenuModuleId = options.defaultMenuModuleId || '139';
  }

  parse(rawText = '') {
    const commentRegex = /<!--\s*(\{[\s\S]*?"type"\s*:\s*"layout"[\s\S]*?\})\s*-->/;
    const match = rawText.match(commentRegex);

    if (!match) {
      return { html: rawText.trim(), layout: null, rawJson: null };
    }

    const rawJson = match[1];
    const html = rawText.replace(match[0], '').trim();
    let layout = null;
    try {
      layout = JSON.parse(rawJson);
    } catch (err) {
      console.error('Failed to parse YOOtheme layout JSON:', err.message);
    }

    return { html, layout, rawJson };
  }

  serialize(html, layout) {
    if (!layout) return html;
    const jsonString = typeof layout === 'string' ? layout : JSON.stringify(layout);
    return `${html.trim()}\n\n <!-- ${jsonString} -->`;
  }

  createDocLayout({ title, lead = '', sections = [], menuModuleId }) {
    const navItems = [];
    const mainChildren = [];

    mainChildren.push({
      type: 'headline',
      props: { content: title, title_element: 'h2', title_style: 'heading-small' },
      name: `Заголовок - ${title}`
    });

    if (lead) {
      mainChildren.push({
        type: 'text',
        props: { column_breakpoint: 'm', content: lead, margin: 'default', text_style: 'lead' },
        name: 'Лід-опис'
      });
    }

    for (const sec of sections) {
      if (sec.title) {
        navItems.push({
          type: 'nav_item',
          props: { content: sec.title }
        });

        mainChildren.push({
          type: 'headline',
          props: { content: sec.title, title_element: 'h3', title_style: 'h3' },
          name: `Розділ - ${sec.title}`
        });
      }

      if (sec.html) {
        mainChildren.push({
          type: 'html',
          props: { content: sec.html },
          name: sec.title ? `HTML - ${sec.title}` : 'HTML віджет'
        });
      }

      if (sec.content) {
        mainChildren.push({
          type: 'text',
          props: { column_breakpoint: 'm', content: sec.content, margin: 'default', text_style: 'large' },
          name: 'Опис'
        });
      }

      if (sec.code) {
        mainChildren.push({
          type: 'code',
          props: { content: sec.code },
          name: 'Код'
        });
      }

      if (sec.table && Array.isArray(sec.table.rows)) {
        const tableChildren = sec.table.rows.map(row => ({
          type: 'table_item',
          props: {
            title: row.title || row.param || '',
            meta: row.meta || row.type || row.default || '',
            content: row.content || row.desc || ''
          }
        }));

        mainChildren.push({
          type: 'table',
          props: {
            table_style: 'divider',
            table_hover: true,
            table_head_title: sec.table.headTitle || 'Параметр',
            table_head_meta: sec.table.headMeta || 'Тип / За замовчуванням',
            table_head_content: sec.table.headContent || 'Опис',
            show_title: true,
            show_meta: true,
            show_content: true,
            table_responsive: 'overflow'
          },
          children: tableChildren,
          name: `Таблиця - ${sec.title || 'Параметри'}`
        });
      }
    }

    const moduleId = menuModuleId || this.defaultMenuModuleId;

    const layout = {
      type: 'layout',
      version: this.version,
      yooessentialsVersion: this.yooessentialsVersion,
      children: [
        {
          type: 'section',
          props: {
            id: 'general',
            image_position: 'center-center',
            style: 'primary',
            title_breakpoint: 'xl',
            title_position: 'top-left',
            title_rotation: 'left',
            vertical_align: 'middle',
            width: 'large'
          },
          children: [
            {
              type: 'row',
              children: [
                {
                  type: 'column',
                  props: {
                    image_position: 'center-center',
                    position_sticky_breakpoint: 'm',
                    preserve_color: true,
                    style: 'tile-muted'
                  },
                  children: [
                    {
                      type: 'headline',
                      props: { content: title, title_element: 'h2', title_style: 'heading-small' },
                      name: `Заголовок - ${title}`
                    },
                    {
                      type: 'headline',
                      props: { content: 'Навігація', title_decoration: 'line', title_element: 'h1', title_style: 'h4' },
                      name: 'Підзаголовок НАВІГАЦІЯ'
                    },
                    {
                      type: 'nav',
                      props: { grid: '1', image_vertical_align: true, nav_style: 'secondary', show_image: true, show_meta: true },
                      children: navItems,
                      name: 'Навігація'
                    }
                  ]
                }
              ]
            },
            {
              type: 'row',
              props: { layout: '3-4,1-4' },
              children: [
                {
                  type: 'column',
                  props: { image_position: 'center-center', position_sticky_breakpoint: 'm', style: 'tile-default', width_medium: '3-4' },
                  children: mainChildren
                },
                {
                  type: 'column',
                  props: { image_position: 'center-center', position_sticky_breakpoint: 'm', style: 'card-default', width_medium: '1-4' },
                  children: [
                    {
                      type: 'module',
                      props: { menu_image_align: 'center', menu_image_margin: true, menu_style: 'default', menu_type: 'nav', module: String(moduleId), type: 'mod_menu' }
                    }
                  ]
                }
              ]
            }
          ],
          name: `Документація - ${title}`
        }
      ]
    };

    let fallbackHtml = `<h2>${title}</h2>\n`;
    if (lead) {
      fallbackHtml += `<p class="uk-text-lead">${lead}</p>\n`;
    }
    if (navItems.length > 0) {
      fallbackHtml += `<h1>Навігація</h1>\n<ul>\n`;
      for (const item of navItems) {
        fallbackHtml += `  <li><div>${item.props.content}</div></li>\n`;
      }
      fallbackHtml += `</ul>\n`;
    }

    for (const sec of sections) {
      if (sec.title) {
        fallbackHtml += `<h3>${sec.title}</h3>\n`;
      }
      if (sec.html) {
        fallbackHtml += `${sec.html}\n`;
      }
      if (sec.content) {
        fallbackHtml += `<div>${sec.content}</div>\n`;
      }
      if (sec.code) {
        const escapedCode = sec.code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
        fallbackHtml += `<pre><code>${escapedCode}</code></pre>\n`;
      }
      if (sec.table && Array.isArray(sec.table.rows)) {
        fallbackHtml += `<table class="uk-table uk-table-divider uk-table-hover">\n`;
        fallbackHtml += `  <thead><tr><th>${sec.table.headTitle || 'Параметр'}</th><th>${sec.table.headMeta || 'Тип'}</th><th>${sec.table.headContent || 'Опис'}</th></tr></thead>\n`;
        fallbackHtml += `  <tbody>\n`;
        for (const r of sec.table.rows) {
          fallbackHtml += `    <tr><td><code>${r.title || r.param || ''}</code></td><td><em>${r.meta || r.type || ''}</em></td><td>${r.content || r.desc || ''}</td></tr>\n`;
        }
        fallbackHtml += `  </tbody>\n</table>\n`;
      }
    }

    return {
      html: fallbackHtml,
      layout,
      fullText: this.serialize(fallbackHtml, layout)
    };
  }
}
