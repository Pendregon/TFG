<template>
	<div class="mission-container">
		<div class="tag">
			<p>
				{{mission.name}}
			</p>
		</div>
		<div class="tools">
			<input 
				type="range" 
				:min="mission.start_date" 
				:max="mission.end_date" 
				step="1" 
				v-model="mission.current_playing_date"
				@change="calculateCurrentRecordPos"
			>
			<button v-if="!mission.current_playing" @click="mission.current_playing = true">
				<IconPlay />
			</button>
			<button v-else @click="mission.current_playing = false">
				<IconPause />
			</button>
			<button @click="$emit('close', mission)">
				<IconClose />
			</button>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")
	.mission-container
		border-radius 99999px
		margin-bottom 5px
		padding 0 10px
		display flex
		align-items center
		justify-content space-between
		background-color third-color 
		-webkit-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
		-moz-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
		box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)

		.tag
			display flex 
			margin-right 10px

			&:hover
				background-color rgba(255,255,255,0.3)
			
			p
				cursor context-menu
				color second-color
				margin 0
				font-weight bold
				letter-spacing 0.5px
				font-size 0.8rem

		.tools
			display flex
			justify-content center
			align-items center

			input 
				height 20px

			input::-webkit-slider-thumb 
				-webkit-appearance: none; /* Override default look */
				appearance: none;
				width: 25px; /* Set a specific slider handle width */
				height: 25px; /* Slider handle height */
				background: #04AA6D; /* Green background */
				cursor: pointer; /* Cursor on hover */

			input::-moz-range-thumb 
				width: 25px; /* Set a specific slider handle width */
				height: 25px; /* Slider handle height */
				background: #04AA6D; /* Green background */
				cursor: pointer; /* Cursor on hover */
			

			button 
				cursor pointer
				display flex
				border none
				padding 0
				margin 0
				background-color transparent
				margin-left 3px
				justify-content center
				align-items center
				outline none

				svg 
					width 15px
					fill second-color

				&:hover svg 
					fill main-color

</style>

<script>
	import IconClose from 'vue-material-design-icons/CloseThick.vue'
	import IconPlay from 'vue-material-design-icons/Play.vue'
	import IconPause from 'vue-material-design-icons/Pause.vue'

	export default {
		name: 'SelectedMissionItem', 
		components:{
			IconClose,
			IconPlay,
			IconPause
		},
		props: ['mission'],
		beforeMount() {
			setInterval(() =>{
				this.$forceUpdate()
			}, 1000)
		},
		methods: {
			calculateCurrentRecordPos: function(){
				this.mission.vehicles.forEach(vehicle =>{
					vehicle.latLngs = []
					vehicle.records.forEach((record, index) =>{
						if(record.timestamp <= this.mission.current_playing_date){
							vehicle.current_playing_record = index
							vehicle.latLngs = vehicle.latLngs.concat([[record.latitude,record.longitude]])
						}
					})
				})
			}
		},
	}
</script>