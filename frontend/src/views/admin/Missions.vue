<template>
	<div class="general">
		<div class="general-width">
			<GeneralList 
                :items="missions" 
				type="Mission" 
				:item_general_info="item_general_info" 
				:item_additional_info="item_additional_info" 
                :validation_target="'name'" 
				:can_show="user_perms.find(e => e.name == 'show_mission')" 
				:can_add="user_perms.find(e => e.name == 'create_mission')" 
				:can_edit="user_perms.find(e => e.name == 'edit_mission')" 
				:can_delete="user_perms.find(e => e.name == 'delete_mission')" 
                @add="addMission($event)" 
                @edit="editMission($event)" 
                @delete="deleteMission($event)" 
            />
		</div>
	</div>
</template>

<script>
import GeneralList from '@/components/admin/lists/GeneralList.vue'
import axios from 'axios'

export default {
    name:"AdminMissions",
    components:{
        GeneralList,
    },
    props:['user_perms'],
    beforeMount (){
        this.item_additional_info = ['location', 'start_date']
		this.item_general_info = {
			should_redirect: true,
			fields: [
				{
					component: 'h2',
					target: 'name'
				},
				{
					component: 'p',
					target: 'vehicles'
				}
			]
		}
        axios.get(`${this.$store.state.api_url}/admin/mission/getAll`)
            .then(response => {
                this.missions = response.data.data
            }).catch(e => {
                console.log(e);
            });
    },
    data(){
        return {
            missions: [],
			item_additional_info:[],
			item_general_info:{}
        }
    },
    methods: {
        addMission: function(input_mission){
            axios.post(`${this.$store.state.api_url}/admin/mission`, input_mission)
                .then(response => {
                    this.missions = response.data.data
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Misión añadida'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error añadiendo misión`
                    })
                });
        },
        editMission: function(input_mission){
            axios.put(`${this.$store.state.api_url}/admin/mission/${input_mission.id}`, input_mission)
                .then(response => {
                    this.missions = response.data.data
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Misión editada'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error editando misión`
                    })
                });
        },
        deleteMission: function(input_mission){
            axios.delete(`${this.$store.state.api_url}/admin/mission/${input_mission.id}`)
                .then(response => {
                    this.missions = response.data.data
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Misión borrada'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error borrando misión`
                    })
                });
        }
    },
}
</script>