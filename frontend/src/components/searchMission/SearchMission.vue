<template>
	<div class="search-wrapper">
		<div class="select-container" @blur="search_text='';search_result=false;">
			<div class="select-input-container">
				<input 
					@focus="$emit('input_search_focused')" 
					@keyup="searchNewData" 
					class="select-input" 
					placeholder="Buscar la misión deseada" 
					type="text" 
					v-model="search_text" 
				>
				<div :class="['select-search-icon', search_text ? 'active' : '' ]">
					<svg viewBox="0 0 24 24">
						<path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
					</svg>
					<template v-if="!is_user_logged">
						<span>|</span>
						<svg v-if="!is_user_logged" viewBox="0 0 24 24" @click="$emit('show_login')">
							<path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
						</svg>
					</template>
					<template v-if="is_logged_user_admin">
						<span>|</span>
						<router-link to="/admin">
							<svg viewBox="0 0 24 24">
								<path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
							</svg>
						</router-link>
					</template>
					<template v-if="is_user_logged">
						<span>|</span>
						<svg viewBox="0 0 24 24" @click="$emit('logout')">
							<path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
						</svg>
					</template>
				</div>
			</div>
			<div v-if="show_recomend_search && (search_text || missions.length > 0)" :class="['separation-row', !search_result && search_text ? 'animate':'']">
				<div></div>
			</div>
			<div v-if="show_recomend_search && search_text && search_result" class="search-container">
				<div v-if="search_result.length == 0">
					<h3>
						No se ha encontrado ningún resultado
					</h3>
				</div>
				<SearchMissionElement 
					v-for="mission in search_result"
					:key="mission.id"
					:mission="mission"
					:can_add="missions.filter(e => e.id === mission.id).length == 0"
					@add="$emit('add', $event)"
				/>
			</div>
		</div>
		<div v-if="show_recomend_search && search_text == ''">
			<RecomendSearch 
				@add="$emit('add', $event)"
				:selected_missions="missions"
				:missions="recomended_missions"
				:vehicles="recomended_vehicles"
			/>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")
	.search-wrapper
		position absolute
		top 10px
		left 10px
		z-index 2002
		width 95%
		max-width 400px

	.select-container
		display flex
		flex-direction column
		background-color third-color 
		padding 10px 20px 10px 20px
		border-radius 8px
		place-items center
		-webkit-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
		-moz-box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)
		box-shadow 0px 0px 11px 0px rgba(0,0,0,0.15)

		.tags-container
			display flex 
			flex-wrap wrap
			margin-top 5px
			width 100%

			

		.select-input-container
			width 100%
			display flex

			.select-input
				border-radius 2px
				border none
				background-color transparent
				outline none
				font-family 'Roboto', sans-serif
				font-size 1rem
				color main-color
				width 100%

				&::placeholder
					color second-color

		.select-search-icon 
			display flex
			align-items center
			a
				margin 0
				padding 0
				display flex
			span
				font-weight bold
				font-size 1.1rem
				margin-left 5px
				margin-right 5px
				align-self start
				margin-top 2px


			svg 
				height 25px
				fill second-color

			&.active svg 
				fill main-color

		.separation-row
			transition display 3s linear
			margin-top 10px
			height 3px
			width 100%
			border-radius 99px
			overflow hidden
			position relative

			> div 
				height 100%
				width 100%
				border-radius 99px
				background-color main-color
				opacity 1

			&.animate > div
				animation-name searching
				animation-duration 2s
				animation-iteration-count infinite
				animation-timing-function linear
				position absolute
				left 0
				top 0
				transform: translateX(-100%)
		.search-container
			width 100%
			
	@keyframes searching {
		0% {opacity: 0;transform: translateX(-100%)}
		25% {opacity: 0.8;transform: translateX(0%)}
		50% {opacity: 0;transform: translateX(100%)}
		75% {opacity: 0.8;transform: translateX(0%)}
		100% {opacity: 0;transform: translateX(-100%)}
	}
</style>

<script>
	import SearchMissionElement from '@/components/searchMission/SearchMissionElement'
	import RecomendSearch from '@/components/searchMission/RecomendSearch'
	import axios from 'axios'
	export default {
		name: 'SelectMission', 
		components: {
			SearchMissionElement,
			RecomendSearch
		},
		props:['missions', 'is_user_logged', 'is_logged_user_admin', 'show_recomend_search'],
		data() {
			return {
				search_text: '',
				search_result: false,
				keyup_timeout: false,
				recomended_missions: [],
				recomended_vehicles:[]
			}
		},
		methods: {
			searchNewData: function(){
				this.search_result = false
				if(this.keyup_timeout){
					clearTimeout(this.keyup_timeout)
				}
				this.keyup_timeout = setTimeout(() => {
					axios.post(`http://15.188.10.32/api/searchForMission`,{
						search: this.search_text
					})
						.then(response => {
							this.search_result = response.data.missions
						}).catch(e => {
							console.log(e.response);
						});
					this.keyup_timeout = false
				}, 2000)
			}
		},
	}
</script>