<template>
	<div class="boat-info-element">
		<p class="label">
			{{label}}
		</p>
		<p class="value">
			{{value}}
		</p>
	</div>
</template>

<style lang="stylus" scoped>
	.boat-info-element
		display grid
		grid-template-columns repeat(2, 1fr)
		grid-gap 10px
		p
			margin 0
			padding 0
			text-align start
		.value
			text-align end
</style>

<script>
	export default {
		name: 'BoatInfoElement', 
		props: ['label', 'value'],
	}
</script>