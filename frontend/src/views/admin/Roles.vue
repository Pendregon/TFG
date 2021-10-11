<template>
	<div class="general">
		<div class="general-width">
			<GeneralList 
                :items="roles" 
				type="Role" 
				:item_general_info="item_general_info" 
				:item_additional_info="item_additional_info" 
                :validation_target="'display_name'"
				:can_show="user_perms.find(e => e.name == 'show_role')" 
				:can_add="user_perms.find(e => e.name == 'create_role')" 
				:can_edit="user_perms.find(e => e.name == 'edit_role')" 
				:can_delete="user_perms.find(e => e.name == 'delete_role')" 
                @add="addRole($event)" 
                @edit="editRole($event)" 
                @delete="deleteRole($event)" 
            />
		</div>
	</div>
</template>

<script>
import GeneralList from '@/components/admin/lists/GeneralList'
import axios from 'axios'

export default {
    name:"AdminRoles",
    components:{
        GeneralList,
    },
    props:['user_perms'],
    beforeMount (){
		this.item_additional_info = []
		this.item_general_info = {
			should_redirect: true,
			fields: [
				{
					component: 'h2',
					target: 'display_name'
				}
			]
		}
        axios.get('https://atirma.iusiani.ulpgc.es:3000/admin/role/getAll')
            .then(response => {
                this.roles = response.data.data
            }).catch(e => {
                console.log(e);
            });
    },
    data(){
        return {
            roles: [],
			item_additional_info:[],
			item_general_info:{}
        }
    },
    methods: {
        addRole: function(input_role){
            axios.post(`https://atirma.iusiani.ulpgc.es:3000/admin/role`, input_role)
                .then(response => {
                    this.roles = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        editRole: function(input_role){
            axios.put(`https://atirma.iusiani.ulpgc.es:3000/admin/role/${input_role.id}`, input_role)
                .then(response => {
                    this.roles = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        deleteRole: function(input_role){
            axios.delete(`https://atirma.iusiani.ulpgc.es:3000/admin/role/${input_role.id}`)
                .then(response => {
                    this.roles = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        }
    },
}
</script>