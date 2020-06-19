<template>
    <vs-card>
        <div class="row">
            <div class="col-auto">
                <vs-button icon="arrow_back" @click="goBack"></vs-button>
            </div>
            <div class="col">
                <tituloh5 titulo="Ingresando Artículos"/>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import tituloh5 from "../../../components/tituloh5";
    import navInventario from "../../../components/navInventario";
    export default {
        components:{navInventario, tituloh5},
        methods:{
            goBack(){
                this.$router.replace({path:'/inventario/'})
            }
        }
    }
</script>

<style scoped lang="stylus">
.tooltip-inner
    max-width: 300px !important;
    width 300px !important
    height 300px
    overflow-y auto
</style>
