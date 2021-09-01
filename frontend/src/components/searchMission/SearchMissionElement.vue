<template>
	<div :class="['element-container', show_additional_info ? 'additional_info':'']">
		<div class="extract-container">
			<!-- <img :src="mission.vehicles[0].image" alt=""> -->
			<div class="name-container">
				<p class="boat-name">
					<svg v-if="new Date(mission.start_date).getTime() <= new Date().getTime() && new Date().getTime() < new Date(mission.end_date).getTime()" class="live" viewBox="0 0 24 24">
						<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
					</svg>
					{{mission.name}}
				</p>
				<p class="boat-mission-name">
					{{mission.mission_name}}
				</p>
			</div>
			<div class="controls-container">
				<button @click="show_additional_info = !show_additional_info">
					<svg viewBox="0 0 24 24">
						<path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
					</svg>
				</button>
				<button @click="$emit('add', mission)" :disabled="!can_add || checkIfMissionButtonIsDisabled(mission)">
					<svg viewBox="0 0 24 24">
						<path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
					</svg>
				</button>
			</div>
		</div>
		<div v-if="show_additional_info" class="additional-info-container">
			<p>
				{{mission.description}}
			</p>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")

	.element-container
		border-radius 15px

		&:not(:last-child)
			margin 8px 0

		.additional-info-container
			padding 5px 20px 15px 20px
			color third-color

			p
				cursor context-menu
				margin 0
				text-align justify

		.extract-container
			padding 10px 10px 10px 15px
			display flex
			align-items center

			> img 
				object-fit cover 
				object-position center
				height 50px
				width 60px
				margin-right 5px
				border 3px solid second-color
				border-radius 8px

			.name-container
				flex-grow 1
				padding 5px 10px 5px 0

				.boat-name
					font-weight bold
					font-size 1.1rem
					margin-bottom 5px
					display flex

					.live
						align-self center
						display flex
						height 10px
						width 10px
						margin-right 10px
						fill red

				p
					cursor context-menu
					padding 0
					margin 0
					color second-color
					text-align start

			.controls-container
				display flex
				align-items center
				
				button 
					border none 
					padding 0
					background-color transparent 
					cursor pointer



					&:first-child
						margin-right 5px
						margin-left 5px
						
					svg 
						width 30px
						fill second-color

					&:disabled svg
						fill gray


		&.additional_info
			background-color #95aebd

		&.additional_info .name-container p
			color second-color

		&.additional_info .extract-container > img
			border-color second-color

		&.additional_info .controls-container button:hover svg
			fill main-color

		&:not(.additional_info):hover .name-container p
			color main-color

		&:not(.additional_info):hover .extract-container > img
			border-color main-color

		&:not(.additional_info):hover .controls-container button:hover svg
			fill main-color
			


</style>

<script>
	export default {
		name: 'SearchMissionElement', 
		props: ['mission', 'can_add'],
		data() {
			return {
				show_additional_info: false
			}
		},
		methods: {
			
			checkIfMissionButtonIsDisabled: function (item){
				if(item.vehicles.length == 0){
					return true
				}else{
					let some_vehicle_have_records = false
					item.vehicles.forEach(vehicle => {
						if(vehicle.records.length > 0){
							some_vehicle_have_records = true
						}
					});
					if(!some_vehicle_have_records){
						return true
					}
				}
				return false
			}
		},
	}
</script>