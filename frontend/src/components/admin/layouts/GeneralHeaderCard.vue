<template>
    <div class="card">
        <div class="header-container">
            <div class="header">
                <a @click="$router.go(-1)">
                    <ArrowLeft class="backArrow"/>
                </a>
                <p class="name">
                    {{title}}
                </p>
                <span></span>
            </div>
            <div class="admin-tools">
                <EditIcon 
                    v-if="can_edit" 
                    class="edit-icon" 
                    @click="showEditModal = true"
                />
                <DeleteIcon 
                    v-if="can_delete" 
                    class="delete-icon" 
                    @click="showDeleteModal = true"
                />
            </div>
        </div>
        <GeneralModal 
            v-if="showEditModal" 
            :type="`edit${type}`" 
            :data="item" 
            @formComplete="$emit('edit', $event)" 
            @close="showEditModal=false"
        />
        <GeneralConfirmModal 
            v-if="showDeleteModal" 
            :type="`delete${type}`" 
            :validation_text="item[validation_target]" 
            @formComplete="$emit('delete')" 
            @close="showDeleteModal=false"
        />
    </div>
</template>

<script>
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import EditIcon from 'vue-material-design-icons/Pencil.vue'
import DeleteIcon from 'vue-material-design-icons/DeleteForeverOutline.vue'
import GeneralModal from '@/components/admin/forms/GeneralForm.vue'
import GeneralConfirmModal from '@/components/admin/forms/CheckConfirmForm.vue'

export default {
    name:"GeneralHeaderCard",
    props: [
        "title", 
        "item", 
        "type", 
        "validation_target", 
        "can_edit", 
        "can_delete"
    ],
    components:{
        ArrowLeft,
        EditIcon,
        DeleteIcon,
        GeneralModal,
        GeneralConfirmModal
    },
    data() {
        return {
            showEditModal: false,
            showDeleteModal: false
        }
    },

}
</script>
<style lang="stylus" scoped>
@import("../../../assets/css/generalColors.styl")
.card
    margin-bottom 30px
    @media (max-width: 500px)
        margin-bottom 20px
    .header-container
        display flex

        .admin-tools
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
        
        .header
            background-repeat no-repeat
            background-size cover
            background-position center
            border-top-left-radius 8px
            border-bottom-left-radius 8px
            display flex
            justify-content space-between
            align-items center
            padding 10px 30px
            flex-grow 1
            background-color second-color

            @media (max-width: 500px)
                border-top-left-radius 0
                border-bottom-left-radius 0

            .backArrow svg
                color white
                height 45px
                width 45px

            .name
                margin 0
                color white
                font-weight 700
                font-size 1.5rem
                text-shadow 0px 0px 8px #000
</style>