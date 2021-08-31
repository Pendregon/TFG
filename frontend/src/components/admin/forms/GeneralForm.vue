<template>
    <GeneralModal 
        @close="$emit('close')" 
        @nextPage="nextPage()" 
        @previousPage="previousPage()" 
        :showBackArrow="showBackArrow" 
        :isShowNextButtonDisabled="isShowNextButtonDisabled"
        :next_button_text="next_button_text"
    >
        <form action="">
            <div v-for="page in formData" :key="page.id" class="modal-content" :class="{showing: formData.indexOf(page) == 0}">
                <h2 v-if="page.title != ''">
                    {{page.title}}
                </h2>
                <div v-for="field in page.fields" :key="field.id">
                    <TextField v-if="field.type == 'text'" :field="field" @changingValue="showNextPageButton()"/>
                    <DateTimeField v-else-if="field.type == 'datetime'" :field="field" @changingValue="showNextPageButton()"/>
                    <TextAreaField v-else-if="field.type == 'textarea'" :field="field" @changingValue="showNextPageButton()"/>
                    <SelectField v-else-if="field.type == 'select'" :field="field" @changingValue="showNextPageButton()"/>
                    <ColorField v-else-if="field.type == 'color'" :field="field" @changingValue="showNextPageButton()"/>
                    <PasswordField v-else-if="field.type == 'password'" :field="field" @changingValue="showNextPageButton()"/>
                </div>
            </div>
        </form>
    </GeneralModal>
</template>

<script>
import GeneralModal from '@/components/admin/modals/GeneralModal'
import TextField from '@/components/admin/forms/fields/GeneralTextField'
import TextAreaField from '@/components/admin/forms/fields/GeneralTextAreaField'
import DateTimeField from '@/components/admin/forms/fields/GeneralDateTimeField'
import SelectField from '@/components/admin/forms/fields/GeneralSelectField'
import ColorField from '@/components/admin/forms/fields/GeneralColorField'
import PasswordField from '@/components/admin/forms/fields/GeneralPasswordField'
import axios from 'axios'

export default {
    name : 'GeneralForm',
    props:['type', 'data'],
    components :{
        GeneralModal,
        TextField,
        TextAreaField,
        DateTimeField,
        SelectField,
        ColorField,
        PasswordField
    },
    data () {
        return {
            isShowNextButtonDisabled : true,
            next_button_text: 'Siguiente',
            showBackArrow : false,
            currentPage : 1,
            pages : 2,
            formData : null
        }
    },
    beforeMount (){
        this.currentPage = 1
        this.isShowNextButtonDisabled = true
        this.showBackArrow = false
        if(this.type =='addMission'){
            this.formData = [
                {
                    title: "CREAR MISIÓN",
                    fields: [
                        {
                            type: "text",
                            name: "name",
                            label: "Nombre",
                            required: true,
                            value: "",
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "textarea",
                            name: "description",
                            label: "Descripción",
                            required: true,
                            value: "",
                            validation: (value) => {
                                if(value.length > 200){
                                    return "Este campo tiene como máximo 200 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "text",
                            name: "location",
                            label: "Localización",
                            required: true,
                            value: "",
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                    ]
                },
                {
                    title: "CREAR MISIÓN",
                    fields: [
                        {
                            type: "datetime",
                            name: "start_date",
                            label: "Fecha de inicio",
                            required: true,
                            value: ""
                        },
                        {
                            type: "datetime",
                            name: "end_date",
                            label: "Fecha de finalización",
                            required: true,
                            value: ""
                        }
                    ]
                }
            ]
        }else if(this.type =='editMission'){
            this.isShowNextButtonDisabled = false
            this.formData = [
                {
                    title: "EDITAR MISIÓN",
                    fields: [
                        {
                            type: "text",
                            name: "name",
                            label: "Nombre",
                            required: true,
                            value: this.data.name,
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "textarea",
                            name: "description",
                            label: "Descripción",
                            required: true,
                            value: this.data.description,
                            validation: (value) => {
                                if(value.length > 200){
                                    return "Este campo tiene como máximo 200 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "text",
                            name: "location",
                            label: "Localización",
                            required: true,
                            value: this.data.location,
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                    ]
                },
                {
                    title: "EDITAR MISIÓN",
                    fields: [
                        {
                            type: "datetime",
                            name: "start_date",
                            label: "Fecha de inicio",
                            required: true,
                            value: this.transformDate(new Date(this.data.start_date))
                        },
                        {
                            type: "datetime",
                            name: "end_date",
                            label: "Fecha de fin",
                            required: true,
                            value: this.transformDate(new Date(this.data.end_date))
                        }
                    ]
                }
            ]
        }else if(this.type =='addMissionVehicle'){
            this.formData = [
                {
                    title: "ASIGNAR VEHÍCULO",
                    fields: [
                        {
                            type: "select",
                            name: "vehicle",
                            label: "Vehículo",
                            required: true,
                            value: 0,
                            options: [],
                            placeholder: 'Selecciona un vehículo'
                        },
                    ]
                }
            ]
            
            axios.get(`http://15.188.10.32/api/admin/mission/${this.$route.params.id}/vehicles/getPossibleVehicles`)
                .then(response => {
                    this.formData[0].fields[0].options = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        }else if(this.type =='addPerms'){
            this.formData = [
                {
                    title: "ASIGNAR PERMISO",
                    fields: [
                        {
                            type: "select",
                            name: "id",
                            label: "Permiso",
                            required: true,
                            value: 0,
                            options: [],
                            placeholder: 'Selecciona un permiso'
                        },
                    ]
                }
            ]
            
            axios.get(`http://15.188.10.32/api/admin/role/${this.$route.params.id}/getPossiblePerms`)
                .then(response => {
                    this.formData[0].fields[0].options = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        }else if(this.type =='addVehicleMission'){
            this.formData = [
                {
                    title: "ASIGNAR MISIÓN",
                    fields: [
                        {
                            type: "select",
                            name: "mission",
                            label: "Misión",
                            required: true,
                            value: 0,
                            options: [],
                            placeholder: 'Selecciona una misión'
                        },
                    ]
                }
            ]
            
            axios.get(`http://15.188.10.32/api/admin/vehicle/${this.$route.params.id}/missions/getPossibleMissions`)
                .then(response => {
                    this.formData[0].fields[0].options = response.data.data
                }).catch(e => {
                    console.log(e);
                });
        }else if(this.type =='addVehicle'){
            this.formData = [
                {
                    title: "CREAR VEHÍCULO",
                    fields: [
                        {
                            type: "text",
                            name: "name",
                            label: "Nombre",
                            required: true,
                            value: "",
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "color",
                            name: "boat_mark_color",
                            label: "Mark color",
                            required: false,
                            value: "#002885"
                        },
                        {
                            type: "color",
                            name: "boat_waypoint_color",
                            label: "Waypoint color",
                            required: false,
                            value: "#002885"
                        },
                    ]
                }
            ]
        }else if(this.type =='editVehicle'){
            this.data.boat_mark_color = this.data.boat_mark_color == '' ? '#002885' : this.data.boat_mark_color
            this.data.boat_waypoint_color = this.data.boat_waypoint_color == '' ? '#002885' : this.data.boat_waypoint_color
            this.formData = [
                {
                    title: "EDITAR VEHÍCULO",
                    fields: [
                        {
                            type: "text",
                            name: "name",
                            label: "Nombre",
                            required: true,
                            value: this.data.name,
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "color",
                            name: "boat_mark_color",
                            label: "Mark color",
                            required: false,
                            value: this.data.boat_mark_color
                        },
                        {
                            type: "color",
                            name: "boat_waypoint_color",
                            label: "Waypoint color",
                            required: false,
                            value: this.data.boat_waypoint_color
                        },
                    ]
                }
            ]
        }else if(this.type =='addUser'){
            // let possible_roles = []
            axios.get(`http://15.188.10.32/api/admin/user/getRoles`)
                .then(response => {
                    console.log(response)
                    this.formData[0].fields[3].options = response.data.data
                }).catch(e => {
                    console.log(e);
                });
            this.formData = [
                {
                    title: "AÑADIR USUARIO",
                    fields: [
                        {
                            type: "text",
                            name: "name",
                            label: "Nombre",
                            required: true,
                            value: '',
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "text",
                            name: "email",
                            label: "Correo",
                            required: true,
                            value: '',
                            validation: (value) => {
                                const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                if(!email.test(value.toLowerCase())){
                                    return "Este campo debe contener un email válido."
                                }
                                return true
                            }
                        },
                        {
                            type: "password",
                            name: "password",
                            label: "Contraseña",
                            required: true,
                            value: '',
                            validation: (value) => {
                                const special_characters = /[ `¿¡!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
                                const numbers = /[0123456789]+/;
                                const letters = /[abcdefghijklmnñopqrstuvwxyz]+/;
                                if(value.length < 6){
                                    return "Este campo tiene como mínimo 6 caracteres."
                                }else if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }else if(!special_characters.test(value)){
                                    return "Este campo debe contener al menos un símbolo."
                                }else if(!numbers.test(value)){
                                    return "Este campo debe contener al menos un número."
                                }else if(!letters.test(value)){
                                    return "Este campo debe contener al menos una letra."
                                }
                                return true
                            }
                        },
                        {
                            type: "select",
                            name: "role_id",
                            label: "Rol",
                            required: true,
                            value: '',
                            options: [],
                            placeholder: 'Selecciona un rol'
                        },
                    ]
                }
            ]
        }else if(this.type =='editUser'){
            axios.get(`http://15.188.10.32/api/admin/user/getRoles`)
                .then(response => {
                    this.formData[0].fields[3].options = response.data.data
                }).catch(e => {
                    console.log(e);
                });
            this.formData = [
                {
                    title: "EDITAR USUARIO",
                    fields: [
                        {
                            type: "text",
                            name: "name",
                            label: "Nombre",
                            required: true,
                            value: this.data.name,
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                        {
                            type: "text",
                            name: "email",
                            label: "Correo",
                            required: true,
                            value: this.data.email,
                            validation: (value) => {
                                const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                if(!email.test(value.toLowerCase())){
                                    return "Este campo debe contener un email válido."
                                }
                                return true
                            }
                        },
                        {
                            type: "password",
                            name: "password",
                            label: "Contraseña",
                            required: true,
                            value: this.data.password,
                            validation: (value) => {
                                const special_characters = /[ `¿¡!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
                                const numbers = /[0123456789]+/;
                                const letters = /[abcdefghijklmnñopqrstuvwxyz]+/;
                                if(value.length < 6){
                                    return "Este campo tiene como mínimo 6 caracteres."
                                }else if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }else if(!special_characters.test(value)){
                                    return "Este campo debe contener al menos un símbolo."
                                }else if(!numbers.test(value)){
                                    return "Este campo debe contener al menos un número."
                                }else if(!letters.test(value)){
                                    return "Este campo debe contener al menos una letra."
                                }
                                return true
                            }
                        },
                        {
                            type: "select",
                            name: "role_id",
                            label: "Rol",
                            required: true,
                            value: this.data.role_id,
                            options: [],
                            placeholder: 'Selecciona un rol'
                        },
                    ]
                }
            ]
        }else if(this.type =='addRole'){
            this.formData = [
                {
                    title: "AÑADIR ROL",
                    fields: [
                        {
                            type: "text",
                            name: "display_name",
                            label: "Nombre de muestra",
                            required: true,
                            value: '',
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                    ]
                }
            ]
        }else if(this.type =='editRole'){
            this.formData = [
                {
                    title: "EDITAR ROL",
                    fields: [
                        {
                            type: "text",
                            name: "display_name",
                            label: "Nombre de muestra",
                            required: true,
                            value: this.data.display_name,
                            validation: (value) => {
                                if(value.length > 20){
                                    return "Este campo tiene como máximo 20 caracteres."
                                }
                                return true
                            }
                        },
                    ]
                }
            ]
        }else{
            this.formData = [
                {
                    title: "Error al cargar el modal"
                }
            ]
        }
        this.pages = this.formData.length
    },
    mounted() {
        if(this.currentPage == this.pages)
            this.nextButtonText()
    },
    methods: {
        showNextPageButton: function () {
            this.isShowNextButtonDisabled = !this.canShowNextPageButton(this.currentPage)
        },
        canShowNextPageButton: function (page) {
            let result = true
            let elements = this.$el.querySelectorAll("form .modal-content:nth-child("+ page +") .field:required")
            elements.forEach(element => {
                if(result && element.value == '')
                    result = false
            })
            if(result){
                this.formData[this.currentPage-1].fields.forEach(field =>{
                    if(result && field.validation && field.validation(field.value) != true){
                        result = false
                    }
                })
            }
            return result
        },
        nextPage: function() {
            if(this.currentPage == this.pages){
                let res_data = {}
                let pass_validation = true
                this.formData.forEach(page => {
                    page.fields.forEach(field =>{
                        res_data[field.name] = field.value
                        if(pass_validation && field.validation && field.validation(field.value) != true){
                            pass_validation = false
                        }
                    })
                })
                if(this.data) res_data.id = this.data.id
                if(!pass_validation){
                    console.log("No pasaaa!")
                }else{
                    this.$emit('formComplete', res_data)
                    this.$emit('close')
                }
            }else{
                this.$el.querySelector(".modal-content:nth-child("+ this.currentPage +")").classList.remove("showing");
                this.$el.querySelector(".modal-content:nth-child("+ (this.currentPage+1) +")").classList.add("showing");
                this.currentPage++
                this.showBackArrow = true
                this.nextButtonText()
                this.showNextPageButton()
            }
        },
        previousPage: function() {
            if(this.currentPage > 1){
                this.$el.querySelector(".modal-content:nth-child("+ (this.currentPage) +")").classList.remove("showing");
                this.$el.querySelector(".modal-content:nth-child("+ (this.currentPage-1) +")").classList.add("showing");
                this.currentPage--
                if(this.currentPage == 1)
                    this.showBackArrow = false
                this.nextButtonText()
                this.showNextPageButton()
            }
        },
        nextButtonText: function(){
            if(this.currentPage == this.pages)
                this.next_button_text = "Finalizar"
            else
                this.next_button_text = "Siguiente"
        },
        transformDate: function(date){
            return `${date.getFullYear()}-${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}T${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
        }
    },
}
</script>

<style lang="stylus" scope>
    @import("../../../assets/css/generalColors.styl")

    .modal-content
        padding 30px 30px
        flex-grow 1
        display none

        h2
            margin 0
            margin-bottom 25px
            font-weight 700

    .modal-content.showing
        display block
</style>