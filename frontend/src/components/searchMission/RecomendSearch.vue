<template>
	<div class="container">
		<div class="controls-container" v-if="show_buttons">
			<button @click="searchVehicles">
				<IconVehicles /> Vehículos
			</button>
			<button @click="searchMissions">
				<IconMissions /> Misiones
			</button>
		</div>
		<div class="search-container">
			<RecomendSearchList 
				v-if="show_recomended_list"
				:list="list"
				:type="list_type"
				@add="$emit('add', $event)"
				@search_by_vehicle="searchMissionByVehicle($event)"
			/>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")
	.container
		padding 10px
		background-color third-color
		border-radius 10px
		margin-top 8px
		-webkit-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
		-moz-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
		box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)

		.controls-container
			display flex

			button
				flex-grow 1
				min-height  50px
				border none
				background-color second-color 
				border-radius 8px
				color third-color
				font-weight bold
				font-size 1.2rem
				cursor pointer
				display flex
				justify-content center
				align-items center

				&:not(:last-child)
					margin-right 10px
				&:hover
					background-color main-color
				svg	
					width 30px
					margin-right 5px

</style>

<script>
	import IconMissions from 'vue-material-design-icons/HelpRhombusOutline.vue'
	import IconVehicles from 'vue-material-design-icons/SailBoat.vue'
	import RecomendSearchList from './RecomendSearchList'
	import axios from 'axios'
	
	export default {
		name: 'RecommendSearch', 
		components: {
			IconMissions,
			IconVehicles,
			RecomendSearchList
		},
		props:[],
		data() {
			return {
				show_buttons: true,
				show_recomended_list: false,
				list: [],
				list_type: false
			}
		},
		methods: {
			searchVehicles: function(){
				this.show_recomended_list = true
				this.show_buttons = false
				this.list_type = 'vehicles'
				axios.get(`http://localhost/api/getAllVehicles`)
					.then(response => {
						this.list = response.data.vehicles
					}).catch(e => {
						console.log(e.response);
					});
			},
			searchMissions: function(){
				this.show_recomended_list = true
				this.show_buttons = false
				this.list_type = 'missions'
				axios.get(`http://localhost/api/getAllMissions`)
					.then(response => {
						this.list = response.data.missions
					}).catch(e => {
						console.log(e.response);
					});
			},
			searchMissionByVehicle: function(vehicle){
				this.show_recomended_list = false
				this.list_type = 'vehicle_mission'
				axios.get(`http://localhost/api/getMissionsByVehicle/${vehicle.id}`)
					.then(response => {
						this.list = response.data.missions
						this.show_recomended_list = true
					}).catch(e => {
						console.log(e.response);
					});

			}
		},
	}
</script>