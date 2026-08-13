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

	describe('inset utilities', () => {
		it('generates positive inset utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="top-sm right-md bottom-lg left-xl"></div>',
			});

			expect(css).toContain('.top-sm');
			expect(css).toContain('.right-md');
			expect(css).toContain('.bottom-lg');
			expect(css).toContain('.left-xl');
		});

		it('generates negative inset utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="-top-md -right-lg -bottom-xl -left-sm"></div>',
			});

			expect(css).toContain('.-top-md');
			expect(css).toContain('.-right-lg');
			expect(css).toContain('.-bottom-xl');
			expect(css).toContain('.-left-sm');
		});

		it('supports responsive variants for inset', async () => {
			const css = await generatePluginCSS({
				content: '<div class="md:top-xs lg:left-3xl"></div>',
			});

			expect(css).toContain('.md\\:top-xs');
			expect(css).toContain('.lg\\:left-3xl');
		});

		it('supports state variants for inset', async () => {
			const css = await generatePluginCSS({
				content: '<div class="hover:top-lg focus:right-sm"></div>',
			});

			expect(css).toContain('.hover\\:top-lg');
			expect(css).toContain('.focus\\:right-sm');
		});

		it('supports stacked variants for inset', async () => {
			const css = await generatePluginCSS({
				content: '<div class="md:hover:top-2xl"></div>',
			});

			expect(css).toContain('.md\\:hover\\:top-2xl');
		});

		it('uses a custom --space-* token for inset', async () => {
			const css = await generatePluginCSS({
				content: '<div class="top-md"></div>',
				inline: `
					@theme {
						--space-md: 99px;
					}
				`,
			});

			expect(css).toContain('--space-md:99px');
			expect(css).toContain('.top-md');
		});

		it('works alongside core Tailwind utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="flex top-lg left-md"></div>',
			});

			expect(css).toContain('.flex');
			expect(css).toContain('.top-lg');
			expect(css).toContain('.left-md');
		});

		it('derives inset spacing from --spacing', async () => {
			const css = await generatePluginCSS({
				content: '<div class="top-lg"></div>',
				inline: `
					@theme {
						--spacing: 10px;
					}
				`,
			});

			expect(css).toContain('.top-lg');
			expect(css).toContain('calc(var(--spacing) * 6)');
		});

		it('allows overriding semantic token independently for inset', async () => {
			const css = await generatePluginCSS({
				content: '<div class="bottom-xl"></div>',
				inline: `
					@theme {
						--spacing: 10px;
						--space-xl: 77px;
					}
				`,
			});

			expect(css).toContain('.bottom-xl');
			expect(css).toContain('--space-xl:77px');
		});

		it('shares semantic tokens with padding/margin/gap', async () => {
			const css = await generatePluginCSS({
				content: '<div class="top-sm p-sm m-sm gap-sm"></div>',
				inline: `
					@theme {
						--space-sm: 15px;
					}
				`,
			});

			expect(css).toContain('.top-sm');
			expect(css).toContain('.p-sm');
			expect(css).toContain('.m-sm');
			expect(css).toContain('.gap-sm');
			expect(css).toContain('15px');
		});

		it('generates inset utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="inset-sm inset-x-lg inset-y-xl"></div>',
			});

			expect(css).toContain('.inset-sm');
			expect(css).toContain('.inset-x-lg');
			expect(css).toContain('.inset-y-xl');
		});

		it('generates negative inset utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="-inset-md -inset-x-xl -inset-y-sm"></div>',
			});

			expect(css).toContain('.-inset-md');
			expect(css).toContain('.-inset-x-xl');
			expect(css).toContain('.-inset-y-sm');
		});

		it('supports responsive variants for inset', async () => {
			const css = await generatePluginCSS({
				content: '<div class="md:inset-sm lg:inset-x-2xl"></div>',
			});

			expect(css).toContain('.md\\:inset-sm');
			expect(css).toContain('.lg\\:inset-x-2xl');
		});

		it('uses a custom --space-* token for inset', async () => {
			const css = await generatePluginCSS({
				content: '<div class="inset-x-md"></div>',
				inline: `
					@theme {
						--space-md: 42px;
					}
				`,
			});

			expect(css).toContain('--space-md:42px');
			expect(css).toContain('.inset-x-md');
		});
	});

	describe('logical padding utilities', () => {
		it('generates logical padding utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="ps-sm pe-md pbs-lg pbe-xl"></div>',
			});

			expect(css).toContain('.ps-sm');
			expect(css).toContain('.pe-md');
			expect(css).toContain('.pbs-lg');
			expect(css).toContain('.pbe-xl');
		});

		it('supports responsive variants for logical padding', async () => {
			const css = await generatePluginCSS({
				content: '<div class="md:ps-md lg:pe-2xl"></div>',
			});

			expect(css).toContain('.md\\:ps-md');
			expect(css).toContain('.lg\\:pe-2xl');
		});

		it('uses a custom --space-* token for logical padding', async () => {
			const css = await generatePluginCSS({
				content: '<div class="pbs-md"></div>',
				inline: `
					@theme {
						--space-md: 33px;
					}
				`,
			});

			expect(css).toContain('--space-md:33px');
			expect(css).toContain('.pbs-md');
		});
	});

	describe('logical margin utilities', () => {
		it('generates logical margin utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="ms-sm me-md mbs-lg mbe-xl"></div>',
			});

			expect(css).toContain('.ms-sm');
			expect(css).toContain('.me-md');
			expect(css).toContain('.mbs-lg');
			expect(css).toContain('.mbe-xl');
		});

		it('generates negative logical margin utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="-ms-md -me-lg -mbs-xl -mbe-sm"></div>',
			});

			expect(css).toContain('.-ms-md');
			expect(css).toContain('.-me-lg');
			expect(css).toContain('.-mbs-xl');
			expect(css).toContain('.-mbe-sm');
		});

		it('supports responsive variants for logical margin', async () => {
			const css = await generatePluginCSS({
				content: '<div class="md:ms-lg lg:me-2xl"></div>',
			});

			expect(css).toContain('.md\\:ms-lg');
			expect(css).toContain('.lg\\:me-2xl');
		});

		it('uses a custom --space-* token for logical margin', async () => {
			const css = await generatePluginCSS({
				content: '<div class="mbe-md"></div>',
				inline: `
					@theme {
						--space-md: 77px;
					}
				`,
			});

			expect(css).toContain('--space-md:77px');
			expect(css).toContain('.mbe-md');
		});
	});

	describe('space between children utilities', () => {
		it('generates space-x utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="space-x-md"></div>',
			});

			expect(css).toContain('.space-x-md');
		});

		it('generates space-y utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="space-y-lg"></div>',
			});

			expect(css).toContain('.space-y-lg');
		});

		it('supports responsive variants for space utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="md:space-x-xl lg:space-y-2xl"></div>',
			});

			expect(css).toContain('.md\\:space-x-xl');
			expect(css).toContain('.lg\\:space-y-2xl');
		});

		it('uses a custom --space-* token for space utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="space-x-md"></div>',
				inline: `
					@theme {
						--space-md: 55px;
					}
				`,
			});

			expect(css).toContain('--space-md:55px');
			expect(css).toContain('.space-x-md');
		});

		it('generates negative space utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="-space-x-md -space-y-lg"></div>',
			});

			expect(css).toContain('.-space-x-md');
			expect(css).toContain('.-space-y-lg');
		});

		it('supports responsive variants for negative space utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="md:-space-x-xl lg:-space-y-2xl"></div>',
			});

			expect(css).toContain('.md\\:-space-x-xl');
			expect(css).toContain('.lg\\:-space-y-2xl');
		});

		it('uses a custom --space-* token for negative space utilities', async () => {
			const css = await generatePluginCSS({
				content: '<div class="-space-y-md"></div>',
				inline: `
					@theme {
						--space-md: 66px;
					}
				`,
			});

			expect(css).toContain('--space-md:66px');
			expect(css).toContain('.-space-y-md');
		});
	});
});
