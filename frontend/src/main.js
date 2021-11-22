import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'

Vue.config.productionTip = false
import 'leaflet/dist/leaflet.css';
import './registerServiceWorker'

Vue.use(Vuex)

let api_url = 'http://localhost:3000/api'
if(process.env.NODE_ENV != "development")
	api_url = 'https://atirma.iusiani.ulpgc.es/api'

const store = new Vuex.Store({
	state: {
		admin_notifications: [],
		api_url: api_url
	},
	mutations: {
		//notifications related
		addNotification(state, notification){
			state.admin_notifications.push(notification)
		},
		removeNotification(state){
			state.admin_notifications.shift()
		},
	}
})

new Vue({
	router,
	store: store,
	render: h => h(App)
}).$mount('#app')
