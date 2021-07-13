<template>
	<div id="nav">
		<div class="sidebar">
			<div id="logo">
				<router-link to="/">
					<img src="/logo.png" alt="">
				</router-link>
			</div>
			<div class="nav-bar">
				<MenuItem 
					v-for="item in menuData" 
					:key="item.id"
					:item="item"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
@import("../../../assets/css/generalColors.styl")

#logo
	padding 20px 15px
	text-align left
	a
		outline none

	img
		height 120px
		
		@media (max-width: 1280px)
			width 100%
			height auto

#nav
	background-color white
	height 100%
	display flex
	justify-content  flex-end
	align-items  flex-start
	flex-grow 1

	@media (max-width: 1070px)
		flex-grow unset

	@media (max-width: 500px)
		display none

	.sidebar
		width 250px

		@media (max-width: 1280px)
			width 88px

		@media (max-width: 850px)
			width 80px

	.nav-bar
		display flex
		flex-direction  column

</style>

<script>
import MenuItem from './MenuItem'

export default {
	name: 'Menu',
	props:['menuData'],
	components :{
		MenuItem
	},
}
</script>