<template>
    <div :class="[notification.type, 'notification-container']">
        <div class="close" @click="$emit('removeNotification')">
            <svg viewBox="0 0 24 24">
                <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
            </svg>
        </div>
        <div class="notification">
            <div class="icon">
                <svg viewBox="0 0 24 24" v-html="icons[notification.type].svg"></svg>
            </div>
            <div class="content">
                <p class="title">{{notification.title}}</p>
                <p class="description">{{notification.description}}</p>
            </div>
        </div>
    </div>
</template>

<style lang="stylus">
    .notification-container
        padding 10px
        border-radius 4px

        &.success
            background-color #90BE6D

        &.warning
            background-color #F49F0A

        &.error
            background-color #f76457

        .close
            position absolute 
            top 5px
            right 5px
            cursor pointer

            svg 
                width 20px
                fill rgba(255,255,255,.6)

                &:hover
                    fill rgba(255,255,255,.9)

        .notification
            width 95vw
            max-width 300px
            border-left 4px solid rgba(255,255,255,.6)
            display flex
            align-items center

            .icon
                padding 10px
                svg 
                    width 60px
                    fill rgba(255,255,255,.8)

            .content
                flex-grow 1
                font-family 'Poppins', sans-serif
                padding 6px

                .title
                    font-weight bold
                    font-size 1.2rem
                    margin 0
                    color rgba(255,255,255,.8)

                .description
                    font-size 0.8rem
                    margin 0
                    color rgba(255,255,255,.6)

</style>

<script>
    export default {
        name: 'AdminNotificationItem',
        props: [
            'notification'
        ],
        beforeMount() {
            this.icons = {
                warning: {
                    svg: '<path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />'
                },
                error: {
                    svg: '<path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />'
                },
                success: {
                    svg: '<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />'
                }
            }
        },
    }
</script>




