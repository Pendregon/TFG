<template>
	<div class="search-container">
		<h2 v-if="type=='vehicles'">
			Vehicles
		</h2>
		<h2 v-else-if="type=='missions'">
			Misiones
		</h2>
		<h2 v-else-if="type=='vehicle_mission'">
			Misiones
		</h2>
		<RecomendSearchListElement 
			v-for="item in list" 
			:key="item.id"
			:title="item.name"
			:live="item && item.start_date && item.end_date && new Date(item.start_date).getTime() <= new Date().getTime() && new Date().getTime() < new Date(item.end_date).getTime()"
			:additional_info="item.description"
			:buttons="type=='missions' || type=='vehicle_mission' ? [{text: 'Info',emit: 'additional_info'},{text: 'Add',emit: 'add', disabled: !missions.filter(e => e.id === item.id).length == 0 || checkIfMissionButtonIsDisabled(item)}] : [{text: 'Search',emit: 'search_by_vehicle'}]"
			@info="showInfo"
			@add="$emit('add', item)"
			@search_by_vehicle="$emit('search_by_vehicle', item)"
		/>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")
	.search-container
		padding 10px
		padding-bottom 0

		h2
			margin 0
			margin-bottom 5px
			color second-color
</style>

<script>
	import RecomendSearchListElement from './RecomendSearchListElement'

	export default {
		name: `RecommendSearchList`, 
		components: {
			RecomendSearchListElement
		},
		props:['list', 'type', 'missions'],
		methods: {
			showInfo: function(){
				console.log("INFO!")
			},
			showAdd: function(){
				console.log("Add!")
			},
			checkIfMissionButtonIsDisabled: function (item){
				if(!item.vehicles || item.vehicles.length == 0){
					return true
				}else{
					let some_vehicle_have_records = false
					item.vehicles.forEach(vehicle => {
						if(vehicle.records && vehicle.records.length > 0){
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