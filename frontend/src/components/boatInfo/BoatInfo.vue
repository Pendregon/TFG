<template>
	<div class="boat-info-container">
		<button class="close" @click="$emit('close')">
			<svg viewBox="0 0 24 24">
				<path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
			</svg>
		</button>
		<BoatInfoElement :label="`Name`" :value="vehicle.name"/>
		<!-- <BoatInfoElement :label="`Mission`" :value="vehicle.mission_name"/> -->
		<BoatInfoElement :label="`Latitude`" :value="vehicle.records[vehicle.current_playing_record].latitude.toFixed(4)"/>
		<BoatInfoElement :label="`Longitude`" :value="vehicle.records[vehicle.current_playing_record].longitude.toFixed(4)"/>
		<BoatInfoElement :label="`Speed`" :value="`${vehicle.records[vehicle.current_playing_record].speed.toFixed(1)} m/s`"/>
		<BoatInfoElement :label="`Course`" :value="`${vehicle.records[vehicle.current_playing_record].heading.toFixed(1)} º (${getCardinalPointByAngle(vehicle.records[vehicle.current_playing_record].heading)})`"/>
		<BoatInfoElement :label="`Wind Direction`" :value="`${vehicle.records[vehicle.current_playing_record].true_wind_angle} º (${getCardinalPointByAngle(vehicle.records[vehicle.current_playing_record].true_wind_angle)})`"/>
		<BoatInfoElement :label="`Wind Speed`" :value="`${vehicle.records[vehicle.current_playing_record].true_wind_speed.toFixed(1)} kns`"/>
		<BoatInfoElement :label="`Pitch`" :value="`${vehicle.records[vehicle.current_playing_record].pitch.toFixed(1)} º`"/>
		<BoatInfoElement :label="`Roll`" :value="`${vehicle.records[vehicle.current_playing_record].roll.toFixed(1)} º`"/>
		<BoatInfoElement :label="`Date/Time`" :value="`${new Date(vehicle.records[vehicle.current_playing_record].date).toLocaleString()}`"/>
	</div>
</template>
<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")
	.boat-info-container
		background-color third-color
		position absolute
		z-index 2002
		bottom 20px
		right 10px
		color main-color
		border-radius 5px
		padding 25px 30px 10px 30px

		.close
			padding 0
			cursor pointer
			border none 
			background-color transparent
			position absolute 
			top 2px
			right 2px

			svg 
				height 20px
				fill main-color
</style>

<script>
	import BoatInfoElement from '@/components/boatInfo/BoatInfoElement'

	export default {
		name: 'BoatInfo', 
		components:{
			BoatInfoElement
		},
		props: ['vehicle'],
		data() {
			return {
				boat_fields: false
			}
		},
		beforeMount() {
			this.boat_fields = [
			]
			setInterval(() =>{
				this.$forceUpdate()
			}, 1000)
		},
		methods: {
			getCardinalPointByAngle : function(angle){
				if(angle < 22.5 || angle >= 337.5)
					return 'N'
				else if (angle < 67.5)
					return 'NE'
				else if (angle < 112.5)
					return 'E'
				else if (angle < 157.5)
					return 'SE'
				else if (angle < 202.5)
					return 'S'
				else if (angle < 247.5)
					return 'SW'
				else if (angle < 292.5)
					return 'W'
				else if (angle < 337.5)
					return 'NW'
			}
		},
	}
</script>