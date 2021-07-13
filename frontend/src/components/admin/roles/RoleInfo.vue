<template>
    <div class="info-container">
        <div class="info-menu-container">
            <button :class="['dashboard', show_dashboard ? 'selected':'']" @click="show_perms=false;show_dashboard=true">Resumen</button>
            <button :class="['perms', show_perms ? 'selected':'']" @click="show_dashboard=false;show_perms=true">Permisos</button>
        </div>
        <div v-if="show_dashboard" class="dashboard-wrapper">
            <div 
                v-for="item in dashboard_items" 
                :key="item.id" 
                class="mission-dashboard-item"
            >
                <p class="label">
                    {{item.label}}
                </p>
                <p class="content">
                    {{role[item.target]}}
                </p>
            </div>
        </div>
        <GeneralList 
            v-if="show_perms" 
            :items="perms" 
            type="Perms"
            :item_general_info="item_general_info"
            :item_additional_info="item_additional_info" 
            :validation_target="'name'" 
            :can_add="user_perms.find(e => e.name == 'edit_role')"
            :can_delete="user_perms.find(e => e.name == 'edit_role')"
            @add="addPerm($event)"
            @delete="deletePerm($event)"
        />
    </div>
</template>
<script>
    import GeneralList from '@/components/admin/lists/GeneralList'
    import axios from 'axios'
    axios.defaults.headers.common = {
        Authorization: `${localStorage.getItem('token')}`
    };
    export default {
        name:'missionInfo',
        components:{
            GeneralList
        },
        props:['role', 'user_perms'],
        beforeMount() {
            this.dashboard_items = [
                {
                    label: 'Nombre',
                    target: 'name'
                },
                {
                    label: 'Nombre de muestra',
                    target: 'display_name'
                },
            ]
            this.item_additional_info = []
            this.item_general_info = {
                should_redirect: false,
                fields: [
                    {
                        component: 'h2',
                        target: 'name'
                    }
                ]
            }

            axios.get(`http://localhost:3000/admin/role/${this.$route.params.id}/perms`)
                .then(response => {
                    this.perms = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        data() {
            return {
                show_dashboard : true,
                show_perms : false,
                dashboard_items : [],
                perms : [],
                item_additional_info : [],
                item_general_info : {}
            }
        },
        methods: {
            addPerm: function(item){
                axios.put(`http://localhost:3000/admin/role/${this.$route.params.id}/perm/${item.id}`)
                    .then(response => {
                        this.perms = response.data.data
                    }).catch(e => {
                        console.log(e);
                    });
            },
            deletePerm: function(item){
                axios.delete(`http://localhost:3000/admin/role/${this.$route.params.id}/perm/${item.id}`)
                    .then(response => {
                        this.perms = response.data.data
                    }).catch(e => {
                        console.log(e);
                    });
            }
        },
    }
</script>
<style lang="stylus" scoped>
@import("../../../assets/css/generalColors.styl")
general-radius = 8px

.info-container
    background-color rgba(255,255,255,0.8)
    border-radius general-radius

    @media (max-width: 500px)
        border-radius 0

    .dashboard-wrapper
        background-color rgba(255,255,255,0.8)
        border-bottom-left-radius 8px
        border-bottom-right-radius 8px
        display grid 
        grid-template-columns repeat(auto-fit, minmax(400px, 1fr))
        grid-gap 30px
        padding 20px

        @media (max-width: 500px)
            grid-template-columns 1fr

        .mission-dashboard-item
            p
                padding 0
                margin 0
                text-align start
            
                &.label
                    font-size 0.9rem
                    font-weight bold
                    margin-bottom 5px
                    
                &.content
                    font-size 1.3rem
                    margin-left 15px

    .info-menu-container
        display flex

        button
            flex-grow 1
            font-size 1.2rem
            padding 10px 20px
            border none
            background-color transparent
            outline none
            cursor pointer
            color #363636

            &:first-child
                border-top-left-radius general-radius
                @media (max-width: 500px)
                    border-top-left-radius 0
            &:last-child
                border-top-right-radius general-radius
                @media (max-width: 500px)
                    border-top-right-radius 0
                
            &.selected
                font-weight bold
                background-color rgba(255,255,255,0.8)
                border-top-right-radius general-radius
                border-top-left-radius general-radius
            
</style>