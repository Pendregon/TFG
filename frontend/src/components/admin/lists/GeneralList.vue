<template>
    <div id="ItemListCard">
        <div v-if="can_add" class="add-item-button" @click="showAddItemModal=true">
            <IconAdd/>
        </div>
        <Item 
            v-for="item in items" 
            :key="item.id" 
            :item="item"
            :type="type"
            :item_general_info="item_general_info"
            :item_additional_info="item_additional_info"
            :can_show="can_show"
            :can_edit="can_edit"
            :can_delete="can_delete"
            @edit="user_to_manage=item;showEditItemModal=true"
            @delete="user_to_manage=item;showDeleteItemModal=true"
        />
        <GeneralModal 
            :type="`add${type}`" 
            v-if="can_add && showAddItemModal" 
            @formComplete="$emit('add', $event)" 
            @close="showAddItemModal=false"
        />
        <GeneralModal 
            :type="`edit${type}`" 
            v-if="can_edit && showEditItemModal" 
            :data="user_to_manage" 
            @formComplete="$emit('edit', $event)" 
            @close="showEditItemModal=false"
        />
        <GeneralConfirmModal 
            v-if="can_delete && showDeleteItemModal" 
            :type="`delete${type}`" 
            :validation_text="user_to_manage[validation_target]" 
            @formComplete="$emit('delete', user_to_manage)" 
            @close="showDeleteItemModal=false"
        />
    </div>
</template>
<style lang="stylus" scoped>
@import("../../../assets/css/generalColors.styl")

#ItemListCard
    background-color rgba(255,255,255,.6)
    border-radius 8px
    padding 15px

    @media (max-width: 500px)
        border-radius 0

    .add-item-button
        background-color rgba(255,255,255,.6)
        margin-bottom 10px
        display flex
        justify-content center
        align-items center
        border-radius 8px
        cursor pointer
        padding 4px

        svg 
            height 45px
            width 45px
            color main-color

        &:hover
            background-color main-color
        
            svg
                color third-color
</style>
<script>
import Item from './GeneralListItem'
import IconAdd from 'vue-material-design-icons/PlusCircle.vue'
import GeneralModal from '@/components/admin/forms/GeneralForm.vue'
import GeneralConfirmModal from '@/components/admin/forms/CheckConfirmForm.vue'

export default {
    name: 'ItemList',
    components: {
        Item,
        IconAdd,
        GeneralModal,
        GeneralConfirmModal,
    },
    props: [
        'items', 
        'type', 
        'validation_target', 
        'can_show', 
        'can_add', 
        'can_edit', 
        'can_delete', 
        'item_additional_info',
        'item_general_info'
    ],
    beforeMount() {
        this.canAdd = true
    },
    data() {
        return {
            canAdd : false,
            showAddItemModal: false,
            showEditItemModal: false,
            showDeleteItemModal: false,
            user_to_manage: false
        }
    },
}
</script>