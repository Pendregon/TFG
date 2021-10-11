<template>
	<div id="app" :class="[is_admin_page() ? 'is_admin' : '']">
		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link rel="manifest" href="manifest.json">
		<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"> 
		<Menu 
			v-if="is_admin_page()" 
			:menuData="menuData" 
		/>
		<router-view 
			:user_perms="user_perms"
			:is_user_logged="is_user_logged"
		/>
		<BottomMenuMobile 
			v-if="is_admin_page()"
			:menuData="menuData"
		/>
	</div>
</template>

<style lang="stylus">
	#app
		font-family Avenir, Helvetica, Arial, sans-serif
		-webkit-font-smoothing antialiased
		-moz-osx-font-smoothing grayscale
		text-align center
		color #2c3e50

	.is_admin
		display flex
		height 100%
		width 100%
		flex-direction column

		@media (min-width: 500px)
			flex-direction unset
			align-items flex-start

	body
		margin 0
		height 100vh
		background-color lightblue
		color #363636
	
	.general
		padding 40px 20px
		flex-grow 1
		display flex
		flex-wrap wrap
		overflow auto
		max-height 100vh
		box-sizing border-box

		@media (max-width: 500px)
			padding 0

	.general-width
		width 940px

		@media (max-width: 1070px)
			width 100%
</style>

<script>
import Menu from '@/components/admin/menu/Menu.vue'
import BottomMenuMobile from '@/components/admin/menu/BottomMenuMobile.vue'
import axios from 'axios'


export default {
	name : 'app',
	components: {
		Menu,
		BottomMenuMobile
	},
	methods: {
		is_admin_page: function(){
			return this.$route.path.includes('admin') && this.$route.name != 'Error404'
		}
	},
	data() {
		return {
			menuData : [],
			is_user_logged : false,
			user_perms: []
		}
	},
	beforeMount() {
		let menuDataProvisional = [
			{
				route:'/admin',
				icon:'IconHome',
				icon_selected:'IconHomeSelected',
				text:'Inicio',
				required_perm: 'show_admin_panel'
			},
			{
				route:'/admin/missions',
				icon:'IconMissions',
				icon_selected:'IconMissionsSelected',
				text:'Misiones',
				required_perm: 'show_missions'
			},
			{
				route:'/admin/vehicles',
				icon:'IconVehicles',
				icon_selected:'IconVehicles',
				text:'Vehículos',
				required_perm: 'show_vehicles'
			},
			{
				route:'/admin/users',
				icon:'IconAdmins',
				icon_selected:'IconAdminsSelected',
				text:'Usuarios',
				required_perm:'show_users'
			},
			{
				route:'/admin/roles',
				icon:'IconRoles',
				icon_selected:'IconRolesSelected',
				text:'Roles',
				required_perm:'show_roles'
			},
		]
		this.menuData = []
		axios.get(`https://atirma.iusiani.ulpgc.es:3000/getPerms`)
			.then(response => {
				localStorage.setItem('perms', response.data.perms)
				let perms = JSON.parse(response.data.perms)
				this.user_perms = perms
				this.is_user_logged = response.data.is_logged
				menuDataProvisional.forEach(element => {
					let element_finded = perms.find(e => e.name == element.required_perm)
					if (element_finded){
						this.menuData.push(element)
					}
				});
			}).catch(e => {
				console.log(e.response);
			});
		
	},
}
</script>