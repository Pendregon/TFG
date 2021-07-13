<template>
    <div id="general-modal">
        <div class="modal-fade" @click="$emit('close')"></div>
        <div class="modal-container">
            <div class="modal-header">
                <div class="back-arrow-container">
                    <ArrowLeft v-if="showBackArrow" @click="$emit('previousPage')"/>
                </div>
                <img src="/logo.png" alt="">
                <div class="next-button-container">
                    <button :disabled='isShowNextButtonDisabled' @click="$emit('nextPage')" class="nextButtonAddGamesModal">
                        {{next_button_text}}
                    </button>
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'

export default {
    name: "GeneralModal",
    props:["showBackArrow","isShowNextButtonDisabled","next_button_text"],
    components:{
        ArrowLeft,
    }
}
</script>
<style lang="stylus" scoped>
    @import("../../../assets/css/generalColors.styl")

    #general-modal
        height 100%
        width 100%
        position fixed
        left 0
        top 0
        z-index 0
        display flex
        justify-content center
        align-items center

        .modal-fade
            background-color rgba(0,0,0,.4)
            position fixed
            z-index 3
            left 0
            top 0
            height 100%
            width 100%

        .modal-container
            width 600px
            height 650px
            max-width 95vw
            max-height 90vh
            border-radius 8px
            background-color white
            z-index 999
            display flex
            flex-direction column

            .modal-header
                border-bottom solid 1px third-color
                display flex
                justify-content space-between
                padding:10px 30px

                img
                    height 50px
                    width auto

                .next-button-container
                    flex-basis 50%
                    display flex
                    justify-content flex-end
                    align-items center

                    button
                        border none 
                        background-color main-color
                        color white
                        font-size 1rem
                        font-weight 700
                        border-radius 99999px
                        padding 5px 12px
                        outline none

                    button:disabled
                        background-color third-color

                .back-arrow-container
                    flex-basis 50%
                    display flex
                    justify-content flex-start
                    align-items center
                    color main-color

                    svg 
                        height 35px
                        width 35px

</style>