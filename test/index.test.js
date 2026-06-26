import { describe, expect, it } from 'vitest';
import { generatePluginCSS } from './utils';

describe('tw-spacing-semantics-plugin', () => {
	it('generates padding utilities', async () => {
		const css = await generatePluginCSS({
			content: '<div class="p-none px-md py-2xl"></div>',
		});

		expect(css).toContain('.p-none');
		expect(css).toContain('.px-md');
		expect(css).toContain('.py-2xl');
	});

	it('generates directional margin utilities', async () => {
		const css = await generatePluginCSS({
			content: '<div class="mt-sm mx-xl ml-11xl"></div>',
		});

		expect(css).toContain('.mt-sm');
		expect(css).toContain('.mx-xl');
		expect(css).toContain('.ml-11xl');
	});

	it('generates gap utilities', async () => {
		const css = await generatePluginCSS({
			content: '<div class="gap-lg gap-x-xs gap-y-4xl"></div>',
		});

		expect(css).toContain('.gap-lg');
		expect(css).toContain('.gap-x-xs');
		expect(css).toContain('.gap-y-4xl');
	});

	it('supports responsive variants', async () => {
		const css = await generatePluginCSS({
			content: '<div class="md:gap-sm lg:px-3xl"></div>',
		});

		expect(css).toContain('.md\\:gap-sm');
		expect(css).toContain('.lg\\:px-3xl');
	});

	it('supports state variants', async () => {
		const css = await generatePluginCSS({
			content: '<div class="hover:p-2xl focus:mx-sm"></div>',
		});

		expect(css).toContain('.hover\\:p-2xl');
		expect(css).toContain('.focus\\:mx-sm');
	});

	it('supports stacked variants', async () => {
		const css = await generatePluginCSS({
			content: '<div class="md:hover:gap-5xl"></div>',
		});

		expect(css).toContain('.md\\:hover\\:gap-5xl');
	});

	it('works alongside core Tailwind utilities', async () => {
		const css = await generatePluginCSS({
			content: '<div class="flex max-w-3xl p-lg"></div>',
		});

		expect(css).toContain('.flex');
		expect(css).toContain('.max-w-3xl');
		expect(css).toContain('.p-lg');
	});

	it('supports the largest spacing token', async () => {
		const css = await generatePluginCSS({
			content: '<div class="p-11xl"></div>',
		});

		expect(css).toContain('.p-11xl');
	});

	it('uses a custom --space-* token', async () => {
		const css = await generatePluginCSS({
			content: '<div class="p-md"></div>',
			inline: `
				@theme {
					--space-md: 123px;
				}
			`,
		});

		expect(css).toContain('--space-md:123px');
		expect(css).toContain('.p-md');
	});

	it('derives semantic spacing from --spacing', async () => {
		const css = await generatePluginCSS({
			content: '<div class="p-lg"></div>',
			inline: `
				@theme {
					--spacing: 10px;
				}
			`,
		});

		expect(css).toContain('.p-lg');
		expect(css).toContain('calc(var(--spacing) * 6)');
	});

	it('allows overriding semantic token independently of --spacing', async () => {
		const css = await generatePluginCSS({
			content: '<div class="p-lg"></div>',
			inline: `
				@theme {
					--spacing: 10px;
					--space-lg: 42px;
				}
			`,
		});

		expect(css).toContain('.p-lg');
		expect(css).toContain('--space-lg:42px');
	});

	it('shares semantic tokens across all spacing utilities', async () => {
		const css = await generatePluginCSS({
			content: '<div class="p-sm m-sm gap-sm"></div>',
			inline: `
				@theme {
					--space-sm: 20px;
				}
			`,
		});

		expect(css).toContain('.p-sm');
		expect(css).toContain('.m-sm');
		expect(css).toContain('.gap-sm');

		expect(css).toContain('20px');
	});

	it('supports negative margin utilities', async () => {
		const css = await generatePluginCSS({
			content: '<div class="-mt-xl -mx-lg -ml-2xl"></div>',
		});

		expect(css).toContain('.-mt-xl');
		expect(css).toContain('.-mx-lg');
		expect(css).toContain('.-ml-2xl');
	});

	it('should add new token', async () => {
		const css = await generatePluginCSS({
			content: '<div class="p-12xl"></div>',
			inline: `
				@theme {
					--space-12xl: calc(var(--spacing) * 512);
				}
			`,
		});

		expect(css).toContain('.p-12xl{padding:var(--space-12xl)}');
	});
});
