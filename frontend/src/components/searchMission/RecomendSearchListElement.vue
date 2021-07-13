<template>
	<div>
		<div class="container">
			<div class="info">
				<p class="name">
					{{title}}
				</p>
				<p v-if="additional_info" class="vehicles">
					Vehículos
				</p>
			</div>
			<div class="tools">
				<button v-for="button in buttons" :key="button.id" @click="button.emit == 'additional_info' ? show_additional_info =! show_additional_info : $emit(button.emit)" :disabled="button.disabled">
					{{button.text}}
				</button>
			</div>
		</div>
		<div v-if="show_additional_info" class="additional-info">
			{{additional_info}}
		</div>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")
	.container
		display flex
		margin-bottom 8px
		min-height 35px

		.info
			flex-grow 1
			align-self center

			p
				text-align start
				margin 0
				padding 0

			.name
				font-size 1.2rem

			.vehicles
				font-size 0.9rem

		.tools
			display flex

			button
				border none
				background-color second-color 
				color third-color
				border-radius 99999999px
				
				&:not(:last-child)
					margin-right 5px

				&:hover
					background-color main-color
				
				&:disabled
					background-color third-color
					color second-color
			
			
</style>

<script>

	export default {
		name: `RecomendSearchListElement`, 
		components: {
		},
		props:['title', 'additional_info','buttons'],
		data() {
			return {
				show_additional_info: false
			}
		},
	}
</script>