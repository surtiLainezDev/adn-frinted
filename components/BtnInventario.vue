<template>
    <div v-if="permiso">
        <div class="col d-flex justify-content-center" >
            <div class="btnsInventario" v-b-tooltip.hover :title="tooltip" @click="redirect">
                <div class="row">
                    <div class="col d-flex justify-content-center" style="height: 70px">
                        <h6 style="font-size: 25px; margin-top: 2px" class="text-center d-flex align-items-center">{{titulo}}</h6>
                    </div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <vs-icon size="70px" :icon="icon"></vs-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BtnInventario",
        props:{
            tooltip: String,
            titulo: String,
            icon: String,
            url: String,
            permiso: Boolean
        },
        methods:{
            redirect(){
                this.$router.replace({path:this.url})
            }
        }
    }
</script>

<style scoped lang="stylus">
    .btnsInventario
        height 170px
        width 170px
        background-color #3498DB
        margin 10px
        border-radius 10px 10px 10px 10px
        -moz-border-radius 10px 10px 10px 10px
        -webkit-border-radius 10px 10px 10px 10px
        color #FFF
        cursor pointer
    .btnsInventario:hover
        background-color #5DADE2
        border: 1px solid #3498DB
</style>
