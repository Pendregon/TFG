<template>
	<div class="selected-missions-container"> 
		<SelectedMissionItem 
			v-for="mission in missions" 
			:key="mission.id" 
			:mission="mission"
			@close="$emit('deleteMission', $event)" 
		/>
	</div>
</template>

<style lang="stylus" scoped>
	@import("../../assets/css/generalColors.styl")
	.selected-missions-container
		position absolute
		bottom 70px
		left 15px
		z-index 99999999
</style>

<script>
	import SelectedMissionItem from '@/components/selectedMissions/SelectedMissionItem';
	export default {
		name: 'SelectedMissionsList', 
		components: {
			SelectedMissionItem
		},
		props:['missions'],
	}
</script>