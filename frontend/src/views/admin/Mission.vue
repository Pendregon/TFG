<template>
	<div class="general">
        <div class="general-width">
            <GeneralHeader 
                :item="mission" 
                :type="'Mission'" 
                :title="mission.name"
                :validation_target="'name'"
                :can_edit="user_perms.find(e => e.name == 'edit_mission')" 
                :can_delete="user_perms.find(e => e.name == 'delete_mission')" 
                @edit="editMission($event)" 
                @delete="deleteMission($event)" 
            />
            <MissionInfo 
                :mission="mission" 
                :user_perms="user_perms"
            />
        </div>
    </div>
</template>

<script>
import GeneralHeader from '@/components/admin/layouts/GeneralHeaderCard'
import MissionInfo from '@/components/admin/missions/MissionInfo'
import axios from 'axios'

export default {
    name:"MissionPage",
    components:{
        GeneralHeader,
        MissionInfo
    },
    props:['user_perms'],
    beforeMount (){
        axios.get(`${this.$store.state.api_url}/admin/mission/${this.$route.params.id}`)
            .then(response => {
                this.mission = response.data.data
            }).catch(e => {
                console.log(e);
            });
    },
    data (){
        return {
            mission : {}
        }
    },
    methods: {
        editMission: function(input_mission){
            axios.put(`${this.$store.state.api_url}/admin/mission/${this.$route.params.id}`, input_mission)
                .then(() => {
                    this.mission.name = input_mission.name
                    this.mission.description = input_mission.description
                    this.mission.location = input_mission.location
                    this.mission.start_date = input_mission.start_date
                    this.mission.end_date = input_mission.end_date
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
        deleteMission: function(){
            axios.delete(`${this.$store.state.api_url}/admin/mission/${this.$route.params.id}`)
                .then(() => {
                    this.$router.push({name:'AdminMissions'})
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