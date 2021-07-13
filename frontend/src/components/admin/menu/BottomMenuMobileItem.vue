<template>
    <router-link :to="item.route">
        <div class="nav-item">
            <component :is="item.icon" /> 
            <component :is="item.icon_selected" /> 
        </div>
    </router-link>
</template>

<style lang="stylus" scoped>
@import("../../../assets/css/generalColors.styl")
a 
    text-decoration none
    font-weight 700
    color #363636
    font-size 19px
    padding 7px 0
    display flex

    &.router-link-exact-active
        color main-color

        
        .nav-item 
            span:first-child
                display none

            span:nth-child(2)
                display block

.nav-item
    padding 8px 15px
    display flex
    align-items center

    &:hover
        color main-color
        background-color third-color
        border-radius 99999px
    svg
        height 33px
        width 33px

    span:nth-child(2)
        display none
</style>

<script>
import IconHome from 'vue-material-design-icons/HomeVariantOutline.vue'
import IconHomeSelected from 'vue-material-design-icons/HomeVariant.vue'
import IconMissions from 'vue-material-design-icons/HelpRhombusOutline.vue'
import IconMissionsSelected from 'vue-material-design-icons/HelpRhombus.vue'
import IconVehicles from 'vue-material-design-icons/SailBoat.vue'
import IconAdmins from 'vue-material-design-icons/AccountGroupOutline.vue'
import IconAdminsSelected from 'vue-material-design-icons/AccountGroup.vue'
import IconRoles from 'vue-material-design-icons/BadgeAccountOutline.vue'
import IconRolesSelected from 'vue-material-design-icons/BadgeAccount.vue'

export default {
    name: 'Menu',
    props:['item'],
    components :{
        IconHome,
        IconHomeSelected,
        IconMissions,
        IconMissionsSelected,
        IconAdmins,
        IconAdminsSelected,
        IconVehicles,
        IconRoles,
        IconRolesSelected
    },
}
</script>