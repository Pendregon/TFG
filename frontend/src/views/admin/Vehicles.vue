<template>
	<div class="general">
		<div class="general-width">
            <GeneralList 
                :items="vehicles" 
				type="Vehicle"
				:item_general_info="item_general_info"
				:item_additional_info="item_additional_info" 
                :validation_target="'name'"
				:can_show="user_perms.find(e => e.name == 'show_vehicle')"
				:can_add="user_perms.find(e => e.name == 'create_vehicle')"
				:can_edit="user_perms.find(e => e.name == 'edit_vehicle')"
				:can_delete="user_perms.find(e => e.name == 'delete_vehicle')"
                @add="addVehicle($event)"
                @edit="editVehicle($event)"
                @delete="deleteVehicle($event)"
            />
		</div>
	</div>
</template>

<script>
import GeneralList from '@/components/admin/lists/GeneralList'
import axios from 'axios'

export default {
    name:"AdminVehicles",
    components:{
        GeneralList,
    },
    beforeMount (){
        this.item_additional_info = []
		this.item_general_info = {
			should_redirect: true,
			fields: [
				{
					component: 'h2',
					target: 'name'
				}
			]
		}
        axios.get(`${this.$store.state.api_url}/admin/vehicle/getAll`)
            .then(response => {
                this.vehicles = response.data.data
            }).catch(e => {
                console.log(e);
            });
    },
    data(){
        return {
            vehicles: []
        }
    },
    props:['user_perms'],
    methods: {
        addVehicle: function(input_vehicle){
            axios.post(`${this.$store.state.api_url}/admin/vehicle`, input_vehicle)
                .then(response => {
                    this.vehicles = response.data.data
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Vehículo añadido'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error añadiendo vehículo`
                    })
                });
        },
        editVehicle: function(input_vehicle){
            axios.put(`${this.$store.state.api_url}/admin/vehicle/${input_vehicle.id}`, input_vehicle)
                .then(response => {
                    this.vehicles = response.data.data
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Vehículo editado'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error editando vehículo`
                    })
                });
        },
        deleteVehicle: function(input_vehicle){
            axios.delete(`${this.$store.state.api_url}/admin/vehicle/${input_vehicle.id}`)
                .then(response => {
                    this.vehicles = response.data.data
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Vehículo borrado'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error borrando vehículo`
                    })
                });
        }
    },
}
</script>