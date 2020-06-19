<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <tabla-planillas titulo="Planillas" :head="theads" :pdf="false" :dato-planillas="Planillas"/>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    import tablaPlanillas from "./tablaPlanillas";
    export default {
        name: "index",
        data(){
            return{
                Planillas: null,
                theads: ['Código', 'Fecha Creación','Total Planilla','Périodo','Sucursal','Usuario Creador','Estado','Acciones']
            }
        },
        components:{
            sideColaboradores,
            tablaPlanillas
        },
        asyncData({$axios, store}){
            return $axios.get('/planillas/',{
                headers:{
                    'Authorization': 'Bearer '+ store.state.token
                }
            }).then((res)=>{
                return{
                    Planillas: res.data.planillas
                }
            })
        },
    }
</script>

<style scoped>

</style>
