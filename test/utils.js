import minify from '@csstools/postcss-minify';
import tailwindcss from '@tailwindcss/postcss';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';

const PLUGIN_PATH = pathToFileURL(join(process.cwd(), 'src/index.css')).href;

export async function generatePluginCSS({ content = '', inline = '' } = {}) {
	const input = `
    @import "tailwindcss";
    @import "${PLUGIN_PATH}";

    ${inline}

    @source inline("${content}");
  `;

	const result = await postcss([tailwindcss(), minify()]).process(input, {
		from: 'input.css',
	});

	return result.css;
}
