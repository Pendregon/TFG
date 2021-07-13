<template>
	<div class="general">
		<div class="general-width">
			<GeneralList 
                :items="users" 
				type="User" 
				:item_general_info="item_general_info" 
				:item_additional_info="item_additional_info" 
                :validation_target="'name'" 
				:can_add="user_perms.find(e => e.name == 'create_user')" 
				:can_edit="user_perms.find(e => e.name == 'edit_user')" 
				:can_delete="user_perms.find(e => e.name == 'delete_user')" 
                @add="addUser($event)" 
                @edit="editUser($event)" 
                @delete="deleteUser($event)" 
            />
		</div>
	</div>
</template>

<script>
import GeneralList from '@/components/admin/lists/GeneralList'
import axios from 'axios'

export default {
    name:"AdminUsers",
    components:{
        GeneralList
    },
    beforeMount (){
		this.item_additional_info = ['role']
		this.item_general_info = {
			should_redirect: false,
			fields: [
				{
					component: 'h2',
					target: 'name'
				}
			]
		}
        axios.get('http://localhost:3000/admin/user/getAll')
            .then(response => {
                this.users = response.data.data
            }).catch(e => {
                console.log(e);
            });
    },
    data(){
        return {
            users: []
        }
    },
    props:['user_perms'],
    methods: {
        addUser: function(input_user){
            axios.post(`http://localhost:3000/admin/user`, input_user)
                .then(response => {
                    this.users = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        editUser: function(input_user){
			console.log(input_user)
            axios.put(`http://localhost:3000/admin/user/${input_user.id}`, input_user)
                .then(response => {
                    this.users = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        deleteUser: function(input_user){
			console.log(input_user)
            axios.delete(`http://localhost:3000/admin/user/${input_user.id}`)
                .then(response => {
                    this.users = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        }
    },
}
</script>