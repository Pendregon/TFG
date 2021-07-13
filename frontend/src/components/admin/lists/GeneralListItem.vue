<template>
    <div class="item">
        <img :src="item.image" alt="">
        <div class="general-info">
            <component :is="item_general_info.should_redirect && can_show ? 'router-link' : 'div'" class="item-url" :to="`/admin/${type.toLowerCase()}/${item.id}`">
                <component 
                    v-for="field in item_general_info.fields"
                    :key="field.id"
                    :is="field.component"
                >
                    {{item[field.target]}}
                </component>
            </component>
        </div>
        <div class="additional-info">
            <p v-for="add_info in item_additional_info" :key="add_info.id">
                {{item[add_info]}}
            </p>
        </div>
        <div class="admin-item-tools">
            <EditIcon v-if="can_edit" class="edit-icon" @click="$emit('edit', item)"/>
            <DeleteIcon v-if="can_delete" class="delete-icon" @click="$emit('delete', item)"/>
        </div>
    </div>
</template>
<style lang="stylus" scope>
    @import("../../../assets/css/generalColors.styl")

    .item-url
        color inherit
        text-decoration none

    .item
        display flex
        background-color rgba(255,255,255,.6)
        margin-bottom 10px
        border-radius 8px

        .additional-info
            align-self center
            display flex

            p
                margin 0
                
        img
            border-radius 5px
            height 50px
            object-fit contain
            object-position center

        .general-info
            padding 10px 25px
            flex-grow 1
        
            h2
                margin 0
                font-size 1.3rem
                text-align start
                margin-bottom 5px
            
            p
                margin 0
                grid-column span 2
                text-align start
                color main-color
                font-weight bold
            a
                outline none
        .date
            padding 0px 10px
            justify-self end

            @media (max-width: 500px)
                display none
        .loc
            @media (max-width: 500px)
                display none
        .join-button
            border none
            background-color main-color
            border-radius 9999999px
            font-size 1.1rem
            font-weight 700
            color white
            cursor pointer
            padding 5px 15px
            outline none

        .type
            padding 0px 10px
            justify-self end
            align-self center

        .admin-item-tools
            display flex
            flex-direction row

            .edit-icon, .delete-icon
                display flex
                align-items center
                justify-content center
                padding 7px 15px
                flex-grow 1
                cursor pointer
                background third-color
                color main-color

                svg 
                    height 30px
                    width 30px

            .edit-icon:hover, .delete-icon:hover
                background main-color
                color third-color

            span:last-child
                border-top-right-radius 8px
                border-bottom-right-radius 8px

                @media (max-width: 500px)
                    border-top-right-radius 0
                    border-bottom-right-radius 0
        

</style>
<script>
import EditIcon from 'vue-material-design-icons/Pencil.vue'
import DeleteIcon from 'vue-material-design-icons/DeleteForeverOutline.vue'

export default {
    name: 'GeneralListItem',
    props: [
        'item', 
        'type', 
        'can_show', 
        'can_edit', 
        'can_delete', 
        'item_additional_info', 
        'item_general_info' 
    ],
    components:{
        EditIcon,
        DeleteIcon
    },
}
</script>