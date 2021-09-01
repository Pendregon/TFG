import Vue from 'vue'
import VueRouter from 'vue-router'
import MapPage from '../views/Map.vue'
import AdminPage from '../views/admin/Home.vue'
import AdminVehiclePage from '../views/admin/Vehicle.vue'
import AdminVehiclesPage from '../views/admin/Vehicles.vue'
import AdminMissionPage from '../views/admin/Mission.vue'
import AdminMissionsPage from '../views/admin/Missions.vue'
import AdminUsersPage from '../views/admin/Users.vue'
import AdminRolePage from '../views/admin/Role.vue'
import AdminRolesPage from '../views/admin/Roles.vue'
import Error404 from '../views/Error404.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Map',
		component: MapPage
	},
	{
		path: '/admin',
		name: 'Admin',
		component: AdminPage,
		meta:{
			required_perm: 'show_admin_panel',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '/admin/mission/:id',
		name: 'AdminMission',
		component: AdminMissionPage,
		meta:{
			required_perm: 'show_mission',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '/admin/missions',
		name: 'AdminMissions',
		component: AdminMissionsPage,
		meta:{
			required_perm: 'show_missions',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '/admin/vehicle/:id',
		name: 'AdminVehicle',
		component: AdminVehiclePage,
		meta:{
			required_perm: 'show_vehicle',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '/admin/vehicles',
		name: 'AdminVehicles',
		component: AdminVehiclesPage,
		meta:{
			required_perm: 'show_vehicles',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '/admin/users',
		name: 'AdminUsers',
		component: AdminUsersPage,
		meta:{
			required_perm: 'show_users',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '/admin/role/:id',
		name: 'AdminRole',
		component: AdminRolePage,
		meta:{
			required_perm: 'show_role',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '/admin/roles',
		name: 'AdminRoles',
		component: AdminRolesPage,
		meta:{
			required_perm: 'show_roles',
			requiresAuth: true,
			is_admin: true
		}
	},
	{
		path: '*',
		name: 'Error404',
		component: Error404
	},

]

const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
	if(to.matched.some(record => record.meta.requiresAuth)) {
		if (localStorage.getItem('token') == null) {
			next({ name: 'Map'})
		} else {
			if(localStorage.getItem('perms')){
				let perms = JSON.parse(localStorage.getItem('perms'))
				if(perms && perms.find(element => element.name == to.matched[0].meta.required_perm)){
					next()
				}else{
					next({ name: 'Map'})
				}
			}else{
				next({ name: 'Map'})
			}
		}
	}else {
		next()
	}
})


export default router
