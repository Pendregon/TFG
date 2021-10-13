<template>
    <div class="datetime-input-wrapper">
        <div :class="[is_focused ? 'selected': '', 'datetime-input-container']">
            <label :for="field.name">
                {{field.label}}
            </label>
            <input 
                :class="['field', is_focused ? 'selected': '']" 
                :required="field.required" 
                v-model="field.value" 
                :id="field.name" 
                :name="field.name" 
                @change="$emit('changingValue');validate_field()" 
                @focus="is_focused=true" 
                @blur="is_focused=false" 
                type="datetime-local"
                step="1"
            >
        </div>
        <p v-if="validation && validation != true" class="validation-error">
            *{{validation}}
        </p>
    </div>
</template>
<script>
export default {
    name:"GeneralDateTimeField",
    props:["field"],
    data() {
        return {
            is_focused: false,
            validation: true
        }
    },
    methods: {
        validate_field: function() {
            if(this.field.validation){
                this.validation = this.field.validation(this.field.value)
            }
        }
    },
}
</script>
<style lang="stylus" scoped>
    @import("../../../../assets/css/generalColors.styl")

    .datetime-input-wrapper
        margin-bottom 17px

        .datetime-input-container
            display flex
            flex-direction column
            background-color #ede8e8
            padding 10px
            border-bottom #8a8a8a 3px solid
            color #8a8a8a
            border-radius 3px

            &.selected
                border-color main-color
                color main-color

            label 
                text-align left
                font-size 1.2rem
                margin-bottom 10px

            input
                outline none
                background-color transparent 
                font-size 1rem
                border none
                color #8a8a8a
                
        .validation-error
            text-align start
            padding 0
            margin 0
            color red
            font-weight bold
            margin-top 3px

</style>
