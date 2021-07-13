<template>
    <div :class="[is_focused ? 'selected': '', 'text-input-container']">
        <label :for="field.name">
            {{field.label}}
        </label>
        <select 
            class="field" 
            :name="field.name" 
            :id="field.name" 
            :required="field.required" 
            v-model="field.value"
            @change="$emit('changingValue')" 
            @focus="is_focused=true" 
            @blur="is_focused=false" 
        >
            <option value="">{{field.placeholder}}</option>
            <option 
                v-for="option in field.options" 
                :key="option.key" 
                :value="option.id" 
            >
                {{option.name}}
            </option>
        </select>
    </div>
</template>
<script>
export default {
    name:"selectField",
    props:["field"],
    data() {
        return {
            is_focused: false,
        }
    },
}
</script>
<style lang="stylus" scoped>
    @import("../../../../assets/css/generalColors.styl")

    .text-input-container
        display flex
        flex-direction column
        background-color #ede8e8
        padding 10px
        border-bottom #8a8a8a 3px solid
        color #8a8a8a
        border-radius 3px
        margin-bottom 25px

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
</style>
