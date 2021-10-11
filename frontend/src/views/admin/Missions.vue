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
        axios.get('https://atirma.iusiani.ulpgc.es:3000/admin/mission/getAll')
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
            axios.post(`https://atirma.iusiani.ulpgc.es:3000/admin/mission`, input_mission)
                .then(response => {
                    this.missions = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        editMission: function(input_mission){
            axios.put(`https://atirma.iusiani.ulpgc.es:3000/admin/mission/${input_mission.id}`, input_mission)
                .then(response => {
                    this.missions = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        deleteMission: function(input_mission){
            axios.delete(`https://atirma.iusiani.ulpgc.es:3000/admin/mission/${input_mission.id}`)
                .then(response => {
                    this.missions = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        }
    },
}
</script>