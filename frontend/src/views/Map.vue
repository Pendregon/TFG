<template>
	<div class="map-container">
		<Map 
			:missions="missions"
			:show_boats_route="show_boats_route"
			:show_next_waypoint="show_next_waypoint"
			:show_waypoints="show_waypoints"
			:show_wind="show_wind"
			:zoomControl="false"
			@showInfo="showBoatInfo($event)"
			@mapFocused="show_recomend_search = false"
			@mapUnfocused="show_recomend_search = false"
		/>
		<BoatInfo 
			v-if="vehicle_info" 
			:vehicle="vehicle_info"
			@close="vehicle_info=false"
		/>
		<SearchMission 
			:missions="missions"
			:is_user_logged="is_user_logged"
			:is_logged_user_admin="user_perms.find(e => e.name == 'show_admin_panel')"
			:show_recomend_search="show_recomend_search"
			@add="addMission($event)"
			@show_login="show_login = true"
			@input_search_focused="show_recomend_search = true"
			@logout="logout()"
		/>
		<SelectedMissionsList 
			:missions="missions"
			@deleteMission="deleteMission($event)"
		/>
		<div class="control-buttons">
			<button :class="[show_boats_route ? 'active':'']" @click="show_boats_route = !show_boats_route">
				<svg viewBox="0 0 24 24">
					<path d="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z" />
				</svg>
			</button>
			<button :class="[show_next_waypoint ? 'active':'']" @click="show_next_waypoint = !show_next_waypoint">
				<IconNextWaypoint />
			</button>
			<button :class="[show_waypoints ? 'active':'']" @click="show_waypoints = !show_waypoints">
				<IconWaypoints />
			</button>
			<button :class="[show_wind ? 'active':'']" @click="show_wind = !show_wind">
				<IconWind />
			</button>
		</div>
		
		<LoginModal 
			v-if="show_login" 
			@close="show_login = false" 
		/>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../assets/css/generalColors.styl")

	.map-container
		height 100vh
		position relative

		.control-buttons
			position absolute 
			z-index 2002
			bottom 10px
			left 10px

			button 
				border none
				border-radius 5px
				background-color transparent
				color main-color
				padding 3px 5px 1px 5px
				font-weight bold
				cursor pointer

				&:not(:last-child)
					margin-right: 10px

				&:hover
					background-color third-color
					-webkit-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
					-moz-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
					box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)


				&.active 
					background-color main-color
					-webkit-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
					-moz-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
					box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)

					svg 
						fill third-color



				svg 
					height 30px
					fill main-color

		.login-container
			position absolute
			top 5px
			right 5px
			z-index 2002

			svg 	
				width 40px

</style>

<script>
	import Map from '@/components/Map';
	import BoatInfo from '@/components/boatInfo/BoatInfo';
	import SearchMission from '@/components/searchMission/SearchMission';
	import SelectedMissionsList from '@/components/selectedMissions/SelectedMissionsList';
	import LoginModal from '@/components/LoginModal';
	import IconNextWaypoint from 'vue-material-design-icons/MapMarkerDistance.vue'
	import IconWaypoints from 'vue-material-design-icons/Map.vue'
	import IconWind from 'vue-material-design-icons/WeatherWindy.vue'
	import axios from 'axios'

	export default {
		name: 'MapView', 
		components: { 
			Map, 
			BoatInfo,
			SearchMission,
			SelectedMissionsList,
			LoginModal,
			IconNextWaypoint,
			IconWaypoints,
			IconWind
		},
		props:[
			'is_user_logged', 
			'user_perms'
		],
		data() {
			return {
				missions: [],
				vehicle_info: false,
				show_boats_route: false,
				show_next_waypoint: false,
				show_waypoints: false,
				show_wind: false,
				recording_interval: 1000,
				delay: 20000,
				show_login: false,
				show_recomend_search: false,
			}
		},
		beforeMount() {
			// Carga inicial de los datos del barco que mostremos inicialmente cargamos todos los barcos en directo
			
			
			// Simulacion de recepcion de datos
			// setInterval(() => {
			// 	this.missions.forEach(mission => {
			// 		// console.log("meto dato")
			// 		mission.vehicles.forEach(vehicle => {
			// 			let new_lat_value = vehicle.records[0].latitude + (0.0005 * Math.random())
			// 			let new_lng_value = vehicle.records[0].longitude + (0.0005 * Math.random())
			// 			let new_heading = 360 * Math.random()
			// 			vehicle.records.unshift({
			// 				latitude: new_lat_value,
			// 				longitude: new_lng_value,
			// 				heading: new_heading,
			// 				speed: 2.497,
			// 				true_wind_angle: 66,
			// 				true_wind_speed: 15,
			// 				pitch: 0,
			// 				roll: -17.468,
			// 				timestamp: 1614855952
			// 			})
			// 			vehicle.latLngs = vehicle.latLngs.concat([[new_lat_value, new_lng_value]])
			// 		})
			// 	});
			// }, 3000)
			setInterval(() => {
				this.missions.forEach(mission => {
					if(mission.current_playing && mission.current_playing_date < new Date(mission.end_date).getTime() && parseInt(mission.current_playing_date) + this.recording_interval < new Date().getTime() - this.delay){
						mission.current_playing_date = parseInt(mission.current_playing_date) + this.recording_interval
						mission.vehicles.forEach(vehicle => {
							if(vehicle.current_playing_record < vehicle.records.length){
								while(vehicle.records[vehicle.current_playing_record + 1] && new Date(vehicle.records[vehicle.current_playing_record + 1].timestamp).getTime() <= mission.current_playing_date){
									vehicle.current_playing_record++
									vehicle.latLngs = vehicle.latLngs.concat([[vehicle.records[vehicle.current_playing_record].latitude, vehicle.records[vehicle.current_playing_record].longitude]])
								}
							}
						})
					}
				});
			}, 1000)
			setInterval(() => {
				let now = new Date()
				this.missions.forEach(mission => {
					if(mission.current_playing && new Date(mission.start_date).getTime() <= now.getTime() && now.getTime() < new Date(mission.end_date).getTime()){
						mission.vehicles.forEach(vehicle => {
							axios.get(`https://atirma.iusiani.ulpgc.es:3000/getMissionsVehicleRecords/${mission.id}/${vehicle.id}`)
								.then(response => {
									mission.records = response.data.data
									console.log(mission.records)
								}).catch(e => {
									console.log(e);
								});
						})
					}
				});
			}, 5000)
		},
		methods: {
			showBoatInfo : function (boat){
				this.vehicle_info = boat
			},
			addMission : function (new_mission) {
				new_mission.current_playing_date = new Date(new_mission.start_date).getTime()
				new_mission.current_playing = true
				new_mission.vehicles.forEach(vehicle => {
					vehicle.current_playing_record = 0
					if(vehicle.records.length > 0){
						if(!vehicle.latLngs) vehicle.latLngs=[[vehicle.records[vehicle.current_playing_record].latitude, vehicle.records[vehicle.current_playing_record].longitude]]
						if (vehicle.waypoints){
							vehicle.waypoints_latLngs = []
							vehicle.waypoints.forEach(waypoint => {
								vehicle.waypoints_latLngs.push([waypoint.latitude, waypoint.longitude])
							})
						}
					}
				})
                this.missions.push(new_mission)
            },
			deleteMission : function (mission) {
				this.missions.splice(this.missions.indexOf(mission), 1)
            },
			logout : function(){
				localStorage.setItem('token', null)
				localStorage.setItem('perms', null)
				location.reload();
			},
		},
	}
</script>