<template>
	<div class="general">
        <div class="general-width">
            <GeneralHeader 
                :item="vehicle" 
                :type="'Vehicle'" 
                :title="vehicle.name"
                :validation_target="'name'" 
                :can_edit="user_perms.find(e => e.name == 'edit_vehicle')" 
                :can_delete="user_perms.find(e => e.name == 'delete_vehicle')" 
                @edit="editVehicle($event)" 
                @delete="deleteVehicle($event)" 
            />
            <VehicleInfo 
                :vehicle="vehicle" 
                :user_perms="user_perms"
            />
        </div>
    </div>
</template>

<script>
import GeneralHeader from '@/components/admin/layouts/GeneralHeaderCard'
import VehicleInfo from '@/components/admin/vehicles/VehicleInfo.vue'
import axios from 'axios'

export default {
    name:"VehiclePage",
    components:{
        GeneralHeader,
        VehicleInfo
    },
    beforeMount (){
        axios.get(`https://atirma.iusiani.ulpgc.es/api/admin/vehicle/${this.$route.params.id}`)
        .then(response => {
            this.vehicle = response.data.data
        }).catch(e => {
            console.log(e);
        });
    },
    data (){
        return {
            vehicle : {}
        }
    },
    props:['user_perms'],
    methods: {
        editVehicle: function(input_vehicle){
            axios.put(`https://atirma.iusiani.ulpgc.es/api/admin/vehicle/${this.$route.params.id}`, input_vehicle)
                .then(() => {
                    this.vehicle.name = input_vehicle.name
                    this.vehicle.boat_mark_color = input_vehicle.boat_mark_color
                }).catch(e => {
                    console.log(e);
                });
        },
        deleteVehicle: function(){
            axios.delete(`https://atirma.iusiani.ulpgc.es/api/admin/vehicle/${this.$route.params.id}`)
                .then(() => {
                    this.$router.push({name:'AdminVehicles'})
                }).catch(e => {
                    console.log(e);
                });
        }
    },
}
</script>
<style lang="stylus" scoped>

</style>