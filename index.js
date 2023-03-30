#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const shiki = require('shiki');
const Shiki = require('markdown-it-shiki').default

let frontMatter;

const ayuDark = JSON.parse(fs.readFileSync('./themes/ayu-dark.json', 'utf8'));

const md = require('markdown-it')()
	.use(Shiki, {
	  theme: ayuDark
	})
	.use(require('markdown-it-front-matter'), (fm) => {
		frontMatter = JSON.parse(fm);
	})

const inPath = process.argv[ 2 ];
const outPath = path.join(path.dirname(inPath), path.basename(inPath, path.extname(inPath)) + '.html');

const mdContent = fs.readFileSync(inPath, 'utf8');

const rendered = md.render(mdContent);

const matterKeys = Object.keys(frontMatter);

function createMetaTag(prop, val) {
	return(`<meta property="${prop}" content="${val}">\n`)
}

const preamble = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">`

const postfix = `</body>
</html>
`

let head = ""

if (matterKeys.includes("title")) {
	head += `<title>${frontMatter.title}</title>`;
	head += createMetaTag("og:title", frontMatter.title)
	head += (createMetaTag("twitter:title", frontMatter.title))
}

if (matterKeys.includes("og")) {
	if (frontMatter.og.description)  head += (createMetaTag("og:description", frontMatter.og.description))
	if (frontMatter.og.description) head += (createMetaTag("twitter:description", frontMatter.og.description))
	if (frontMatter.og.url) head += (createMetaTag("og:site", frontMatter.og.url))
	if (frontMatter.og.site_name) head += (createMetaTag("og:site_name", frontMatter.og.site_name))
	if (frontMatter.og.image.url) head += (createMetaTag("og:image:url", frontMatter.og.image.url))
	if (frontMatter.og.image.width) head += (createMetaTag("og:image:width", frontMatter.og.image.width))
	if (frontMatter.og.image.height) head += (createMetaTag("og:image:height", frontMatter.og.image.height))
	if (frontMatter.og.image.alt) head += (createMetaTag("og:image:alt", frontMatter.og.image.alt))

}

if (matterKeys.includes("twitter")) {
	if (frontMatter.twitter.site) head += (createMetaTag("twitter:site_name", frontMatter.twitter.site))
	if (frontMatter.twitter.domain) head += (createMetaTag("twitter:domain", frontMatter.twitter.domain))
	if (frontMatter.og.image.ur) head += (createMetaTag("twitter:image", frontMatter.og.image.url))
	if (frontMatter.og.image.url) head += (createMetaTag("twitter:card", "summary_large_image"))
}

head += (createMetaTag("article:published_time", new Date().toISOString()))

if (matterKeys.includes("extra_header_bits")) {
	head += frontMatter.extra_header_bits.map(bit => bit).join("\n")
}

let body = "";
if (matterKeys.includes("extra_body_bits")) {
	body += frontMatter.extra_body_bits.map(bit => bit).join("\n")
}


fs.writeFile(outPath, `${preamble}
<head>
${head}
</head>
<body>${rendered}${body}
${postfix}
`, (err) => {
	if (err) throw err;
});
