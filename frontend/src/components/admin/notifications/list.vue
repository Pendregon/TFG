<template>
    <div class="notifications-container">
        <AdminNotificationItem 
            :notification="$store.state.admin_notifications[0]"
            @removeNotification="removeNotification"
        />
    </div>
</template>

<style lang="stylus">
    .notifications-container
        position fixed 
        top 30px
        left 50%
        transform translateX(-50%)
        z-index 99999
</style>

<script>
    import AdminNotificationItem from './item'

    export default {
        name: 'AdminNotifications',
        data() {
            return {
                interval_control:false
            }
        },
        components:{
            AdminNotificationItem,
        },
        beforeMount() {
            if(!this.interval_control){
                this.createInterval()
            }
        },
        methods: {
            removeNotification : function (){
                clearInterval(this.interval_control)
                this.$store.commit('removeNotification')
                this.createInterval()
            },
            createInterval : function (){
                this.interval_control = setInterval(() => {
                    //quitamos elemento
                    this.removeNotification()
                    if(this.$store.state.admin_notifications.length <= 0){
                        clearInterval(this.interval_control)
                    }
                },3000)
            }
        },
    }
</script>




