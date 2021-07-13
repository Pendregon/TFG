<template>
    <GeneralModal 
        @close="$emit('close')"
        @nextPage="nextPage()" 
        :isShowNextButtonDisabled="isShowNextButtonDisabled"
        :next_button_text="next_button_text"
    >
        <div class="confirm-modal-content">
            <h2>
                {{texts.title}}
            </h2>
            <p>
                {{texts.description}}
            </p>
            <form>
                <TextField :field="field" @changingValue="showNextPageButton()"/>
            </form>
        </div>
    </GeneralModal>
</template>
<script>
import GeneralModal from '@/components/admin/modals/GeneralModal.vue'
import TextField from '@/components/admin/forms/fields/GeneralTextField.vue'
export default {
    name:"checkConfirFormModal",
    props:['type', 'validation_text'],
    components:{
        GeneralModal,
        TextField
    },
    data() {
        return {
            field:{},
            texts:{},
            isShowNextButtonDisabled: true,
            currentPage: 1,
            pages:1,
            next_button_text: 'Confirmar'
        }
    },
    beforeMount (){
        if(this.type == "deleteMission"){
            this.field = {
                type: "text",
                name: "name",
                label: "Nombre de la misión",
                required: true,
                value: ""
            }
            this.texts={
                title: "Borrar Misión",
                description: "Para la correcta eliminación de la misión debe escribir el nombre de la misma como confimación."
            }
        }else if(this.type == "deleteVehicle"){
            this.field = {
                type: "text",
                name: "name",
                label: "Nombre del vehículo",
                required: true,
                default: ""
            }
            this.texts={
                title: "Borrar Vehículo",
                description: "Para la correcta eliminación del vehículo debe escribir el nombre del mismo como confimación."
            }
        }else if(this.type == "deleteUser"){
            this.field = {
                type: "text",
                name: "name",
                label: "Nombre del usuario",
                required: true,
                default: ""
            }
            this.texts={
                title: "Borrar Usuario",
                description: "Para la correcta eliminación del usuario debe escribir el nombre del mismo como confimación."
            }
        }else if(this.type == "deleteRole"){
            this.field = {
                type: "text",
                name: "display_name",
                label: "Nombre del rol",
                required: true,
                default: ""
            }
            this.texts={
                title: "Borrar Rol",
                description: "Para la correcta eliminación del rol debe escribir el nombre del mismo como confimación."
            }
        }else if(this.type == "deleteMissionVehicle"){
            this.field = {
                type: "text",
                name: "name",
                label: "Nombre del vehículo",
                required: true,
                default: ""
            }
            this.texts={
                title: "Borrar Vehículo",
                description: "Para la correcta eliminación del vehículo debe escribir el nombre del mismo como confimación."
            }
        }else if(this.type == "deleteVehicleMission"){
            this.field = {
                type: "text",
                name: "name",
                label: "Nombre de la misión",
                required: true,
                default: ""
            }
            this.texts={
                title: "Borrar Misión",
                description: "Para la correcta eliminación de la misión debe escribir el nombre de la mismo como confimación."
            }
        }else if(this.type == "deletePerms"){
            this.field = {
                type: "text",
                name: "id",
                label: "Nombre del permiso",
                required: true,
                default: ""
            }
            this.texts={
                title: "Borrar Permiso",
                description: "Para la correcta eliminación del permiso debe escribir el nombre del mismo como confimación."
            }
        }
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
            return result && this.field.value == this.validation_text
        },
        nextPage: function() {
            if(this.currentPage == this.pages){
                this.$emit('formComplete')
                this.$emit('close')
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
            return `${date.getFullYear()}-${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}-${date.getDate()}T${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
        }
    },
}
</script>
<style lang="stylus" scoped>
    .confirm-modal-content
        padding 30px 30px

        p
            text-align start
            margin-bottom 50px
</style>