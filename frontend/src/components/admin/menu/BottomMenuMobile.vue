<template>
    <div id="bottom-mobile-nav">
        <div class="nav-bar">
            <BottomMenuMobileItem 
                v-for="item in menuData" 
                :key="item.id"
                :item="item"
            />
        </div>
    </div>
</template>

<style lang="stylus" scoped>
@import("../../../assets/css/generalColors.styl")
#bottom-mobile-nav
    background-color white

    @media (min-width 500px)
        display none

    .nav-bar
        display flex
        flex-direction row
        justify-content space-around
</style>

<script>
import BottomMenuMobileItem from './BottomMenuMobileItem'

export default {
    name: 'Menu',
    props:['menuData'],
    components :{
        BottomMenuMobileItem
    }
}
</script>