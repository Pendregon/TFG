<template>
	<div class="general">
        <div class="general-width">
            <GeneralHeader 
                :item="role" 
                :type="'Role'"
                :title="role.display_name"
                :validation_target="'display_name'"  
                :can_edit="user_perms.find(e => e.name == 'edit_role')" 
                :can_delete="user_perms.find(e => e.name == 'delete_role')" 
                @edit="editRole($event)" 
                @delete="deleteRole($event)" 
            />
            <RoleInfo 
                :role="role"
                :user_perms="user_perms"
            />
        </div>
    </div>
</template>

<script>
import GeneralHeader from '@/components/admin/layouts/GeneralHeaderCard'
import RoleInfo from '@/components/admin/roles/RoleInfo'
import axios from 'axios'

export default {
    name:"RolePage",
    components:{
        GeneralHeader,
        RoleInfo
    },
    beforeMount (){
        axios.get(`${this.$store.state.api_url}/admin/role/${this.$route.params.id}`)
            .then(response => {
                this.role = response.data.data
            }).catch(e => {
                console.log(e);
            });
    },
    data (){
        return {
            role : {}
        }
    },
    props:['user_perms'],
    methods: {
        editRole: function(input_role){
            axios.put(`${this.$store.state.api_url}/admin/role/${this.$route.params.id}`, input_role)
                .then(() => {
                    this.role.name = input_role.name
                    this.role.display_name = input_role.display_name
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Rol editado'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error editando rol`
                    })
                });
        },
        deleteRole: function(input_role){
            axios.delete(`${this.$store.state.api_url}/admin/role/${input_role.id}`)
                .then(() => {
                    this.$router.push({name:'AdminRoles'})
                    this.$store.commit('addNotification', {
                        type: 'success',
                        title: 'Rol borrado'
                    })
                }).catch(e => {
                    console.log(e);
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: `Error borrando rol`
                    })
                });
        }
    },
}
</script>