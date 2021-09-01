import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import 'leaflet/dist/leaflet.css';
import './registerServiceWorker'

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
