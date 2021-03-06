<template>
    <div class="info-container">
        <div class="info-menu-container">
            <button :class="['dashboard', show_dashboard ? 'selected':'']" @click="show_vehicles=false;show_dashboard=true">Resumen</button>
            <button :class="['vehicles', show_vehicles ? 'selected':'']" @click="show_dashboard=false;show_vehicles=true">Vehículos</button>
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
                    {{item.target == 'start_date' || item.target == 'end_date'? getFormatedDate(mission[item.target]) : mission[item.target]}}
                </p>
            </div>
        </div>
        <GeneralList 
            v-if="show_vehicles" 
            :items="mission_vehicles" 
            type="MissionVehicle"
            :item_general_info="item_general_info"
            :item_additional_info="item_additional_info" 
            :validation_target="'name'" 
            :can_add="user_perms.find(e => e.name == 'edit_mission')"
            :can_delete="user_perms.find(e => e.name == 'edit_mission')"
            :can_add_csv="user_perms.find(e => e.name == 'edit_mission')"
            @uploadCSV="uploadCSV($event)"
            @add="addMissionVehicle($event)"
            @delete="deleteMissionVehicle($event)"
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
        props:['mission', 'user_perms'],
        beforeMount() {
            this.dashboard_items = [
                {
                    label: 'Nombre',
                    target: 'name'
                },
                {
                    label: 'Localización',
                    target: 'location'
                },
                {
                    label: 'Fecha de inicio',
                    target: 'start_date'
                },
                {
                    label: 'Fecha de fin',
                    target: 'end_date'
                },
                {
                    label: 'Descripción',
                    target: 'description'
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
            
            axios.get(`${this.$store.state.api_url}/admin/mission/${this.$route.params.id}/vehicles`)
                .then(response => {
                    this.mission_vehicles = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        },
        data() {
            return {
                show_dashboard : true,
                show_vehicles : false,
                dashboard_items : [],
                mission_vehicles : [],
                item_additional_info : [],
                item_general_info : {}
            }
        },
        methods: {
            addMissionVehicle: function(data){
                axios.put(`${this.$store.state.api_url}/admin/mission/${this.$route.params.id}/vehicles/${data.vehicle}`)
                    .then(response => {
                        this.mission_vehicles = response.data.data
                    }).catch(e => {
                        console.log(e);
                    });
            },
            deleteMissionVehicle: function(item){
                axios.delete(`${this.$store.state.api_url}/admin/mission/${this.$route.params.id}/vehicles/${item.id}`)
                    .then(response => {
                        this.mission_vehicles = response.data.data
                    }).catch(e => {
                        console.log(e);
                    });
            },
            uploadCSV: function(data){
                data.mission_id = this.mission.id
                if(data.file.name.match(/\.csv$/i)){
                    this.sendCSV(data)               

                    this.$store.commit('addNotification', {
                        type: 'warning',
                        title: 'Fichero muy pesado',
                        description: 'El fichero tardará un tiempo en añadirse'
                    })
                }else
                    this.$store.commit('addNotification', {
                        type: 'error',
                        title: 'Extensión incorrecta',
                        description: 'El archivo debe ser un .csv'
                    })
            },
            sendCSV: function(data){
                const reader = new FileReader();
                reader.readAsText(data.file);
                reader.onload = () => {
                    axios.post(`${this.$store.state.api_url}/admin/mission/uploadCSV`, {
                        mission_id : data.mission_id,
                        vehicle_id : data.vehicle_id,
                        file_data: [...new Map(this.csvToJson(reader.result).map(item =>[item.datetime, item])).values()]
                    })
                        .then(() => {
                            this.$store.commit('addNotification', {
                                type: 'success',
                                title: 'CSV añadido'
                            })
                        }).catch(e => {
                            console.log(e);
                            this.$store.commit('addNotification', {
                                type: 'error',
                                title: 'Error al leer el archivo'
                            })
                        });
                };
            },
            csvToJson: function(csv_data){
                let lines = [];
                const linesArray = csv_data.split('\n');
                // for trimming and deleting extra space 
                linesArray.forEach((e) => {
                    const row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ',').trim();
                    lines.push(row);
                });
                // for removing empty record
                lines.splice(lines.length - 1, 1);
                const result = [];
                const headers = lines[0].split(",");

                for (let i = 1; i < lines.length; i++) {

                    const obj = {};
                    const currentline = lines[i].split(",");

                    for (let j = 0; j < headers.length; j++) {
                        if(headers[j].replace(/"/g, '') == 'datetime')
                            obj[headers[j].replace(/"/g, '')] = currentline[j].replace(/"/g, '').replace(/\.[0-9]*$/g, '')
                        else
                            obj[headers[j].replace(/"/g, '')] = currentline[j].replace(/"/g, '')
                    }
                    result.push(obj)
                }
                //return result; //JavaScript object
                // return JSON.stringify(result); //JSON
                return result;
            },
            getFormatedDate: function(date){
                const new_date = new Date(date)
                return `${new_date.getDate()}/${new_date.getMonth()+1}/${new_date.getFullYear()}`
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