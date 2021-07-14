<template>
    <div class="modal-container">
        <div class="background" @click="$emit('close')"></div>
        <div class="modal">
            <div class="close">
                <svg viewBox="0 0 24 24" @click="$emit('close')">
                    <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                </svg>
            </div>
            <div class="header">
                <img src="logo.png" alt="">
                <h3>
                    LOGIN
                </h3>
            </div>
            <form
                @submit="checkLogin"
                method="post"
            >
                <div class="input-container">
                    <label for="">Email</label>
                    <input 
                        type="email" 
                        v-model="email" 
                        required
                    >
                </div>
                <div class="input-container">
                    <label for="">Password</label>
                    <input 
                        type="password" 
                        v-model="password" 
                        required
                    >
                </div>
                <button type="submit">LOGIN</button>
            </form>
        </div>
    </div>
</template>

<style lang="stylus" scoped>
    @import("../assets/css/generalColors.styl")

    .modal-container
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        z-index 3000
        display flex
        justify-content center
        align-items center

        .background
            position absolute
            height 100%
            width 100%
            background-color rgba(0,0,0,0.2)
            z-index 3000

        .modal
            width 95%
            max-width 400px
            background-color white
            z-index 3001
            border-radius 10px
            padding 20px 20px 15px 20px
            box-sizing border-box
            border solid 4px second-color
            position relative

            .close
                position absolute
                z-index 3002
                top 3px
                right 3px

                svg
                    height 30px
                    width 30px
                    fill second-color
                    cursor pointer

                    &:hover
                        fill main-color

            .header
                display flex
                justify-content center
                align-items center
                margin-bottom 30px

                img
                    width 65px
                    height 65px
                    object-fit contain
                    object-position center
                    margin-right 10px

                h3
                    margin 0
                    padding 0
                    font-weight bold
                    font-size 2.5rem
                    color main-color
                    

            .input-container
                display flex
                flex-direction column
                margin-bottom 15px

                label
                    text-align start
                    margin-bottom 3px
                    font-weight bold
                    font-size 1.1rem
                    color second-color

                input
                    border 2px solid second-color
                    border-radius 5px
                    padding 5px 10px
                    font-size 1.3rem
                    color second-color

            button
                width 100%
                border 3px solid second-color
                border-radius 10px
                padding 8px 10px
                font-weight bold
                color second-color
                font-size 1.2rem
                background-color third-color
                cursor pointer

                &:hover
                    color third-color
                    background-color main-color
                    border 3px solid third-color


</style>

<script>
    import axios from 'axios'

	export default {
		name: 'LoginModal',
		components: {
		},
        data() {
            return {
                email:'',
                password:''
            }
        },
        props: [],
        methods: {
            checkLogin: function(e){
                axios.post(`http://15.188.10.32/api/login`, {email: this.email, password: this.password})
                    .then(response => {
                        if(response.data.token){
                            localStorage.setItem('token', response.data.token);
                            localStorage.setItem('perms', response.data.perms);
                            location.reload();
                            this.$emit('close')
                        }
                    }).catch(e => {
                        localStorage.setItem('token', null);
                        localStorage.setItem('perms', null);
                        console.log(e.response);
                    });

                e.preventDefault()
            }
        }
	}
</script>