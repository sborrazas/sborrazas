import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function parsePost(text, filename) {
  const split = text.replace(/^\uFEFF/, '').split(/\r?\n\r?\n/, 2);
  const metadata = {};
  for (const line of split[0].split(/\r?\n/)) {
    const match = line.match(/^:([\w-]+):\s*(.*)$/);
    if (!match) throw new Error(`Invalid metadata in ${filename}: ${line}`);
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    metadata[match[1]] = value;
  }
  for (const field of ['title', 'date', 'slug', 'description']) {
    if (!metadata[field]) throw new Error(`Missing :${field}: in ${filename}`);
  }
  return { ...metadata, content: split[1] ?? '', filename };
}

function layout(content, { title = '', description = '', keywords = '', scripts = '' } = {}) {
  const pageTitle = title ? `${esc(title)} – Sebastian Borrazas` : 'Sebastian Borrazas – Developer';
  return `<!DOCTYPE html>
<html lang="en"><head>
  <title>${pageTitle}</title>
  <meta name="description" content="${esc(description || 'Love the web, working with cool technologies like JavaScript, Ruby and Rails.')}">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta charset="utf-8"><meta name="author" content="Sebastian Borrazas">
  <meta name="keywords" content="sebastian borrazas,sborrazas,ruby,developer,web,html,css,javascript${keywords ? `,${esc(keywords)}` : ''}">
  <link href="/stylesheets/application.css?182817203" media="screen" rel="stylesheet">
  <link href="/images/favicon.png" rel="shortcut icon" type="image/png">
  ${title ? '<link href="/stylesheets/sh_acid.css?182817203" media="screen" rel="stylesheet">' : ''}
  <meta name="google-site-verification" content="3FXwhkDewdLEPNkXPXO9FOjdfXBrAGgfQ0rrBG5XhxQ">
</head><body>
  <header id="main-header"><a href="/" class="image-holder"><img src="/images/sborrazas.jpeg" alt="sborrazas"></a>
    <hgroup><h1>Sebastian Borrazas</h1><h2>I'm a full stack engineer from Montevideo. Love functional programming, the web and Erlang.</h2></hgroup>
    <nav><ul><li><a href="http://github.com/sborrazas" class="github"><span>GitHub</span></a></li><li><a href="http://twitter.com/sborrazas" class="twitter" target="_blank"><span>Twitter</span></a></li><li><a href="mailto:hi@sborrazas.com" class="email" target="_blank"><span>My Email</span></a></li></ul></nav>
  </header><section id="main-content">${content}</section>
  <footer id="main-footer"><p>&copy; 2026. Sebastian Borrazas</p></footer>
  ${scripts}
</body></html>`;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'public'), output, { recursive: true });
await writeFile(path.join(output, '.nojekyll'), '');

const files = (await readdir(path.join(root, 'blogposts'))).filter((name) => name.endsWith('.md'));
const posts = await Promise.all(files.map(async (name) => parsePost(await readFile(path.join(root, 'blogposts', name), 'utf8'), name)));
posts.sort((a, b) => b.date.localeCompare(a.date));

const list = `<ol class="blog-list">${posts.map((post) => `<li><article><time>${new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</time><a href="/blog/${esc(post.slug)}/"><h1>${esc(post.title)}</h1></a><p>${esc(post.description)}</p></article></li>`).join('\n')}</ol>`;
await writeFile(path.join(output, 'index.html'), layout(list));

for (const post of posts) {
  const directory = path.join(output, 'blog', post.slug);
  await mkdir(directory, { recursive: true });
  const date = new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
  const body = `<article class="blogpost"><header><time>${date}</time><h1>${esc(post.title)}</h1></header><section>${marked.parse(post.content)}</section></article><nav class="blogpost-end"><p><a href="/">&laquo; Back</a></p></nav>`;
  const scripts = '<script src="/javascripts/lib/sh_main.js"></script><script src="/javascripts/lib/sh_ruby.js"></script><script src="/javascripts/lib/sh_css.js"></script><script src="/javascripts/lib/sh_javascript.js"></script><script>sh_highlightDocument();</script>';
  const html = layout(body, { title: post.title, description: post.description, keywords: post.keywords, scripts });
  await writeFile(path.join(directory, 'index.html'), html);
  await writeFile(path.join(output, 'blog', `${post.slug}.html`), html);
}

// Older post content links to the asset path used by the Sinatra deployment.
await cp(path.join(root, 'public'), path.join(output, 'assets'), { recursive: true });
await writeFile(path.join(output, '404.html'), layout('<h1>Not Found</h1>'));
console.log(`Built ${posts.length} posts and static assets in dist/`);
