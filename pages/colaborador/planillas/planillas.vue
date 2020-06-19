<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <tabla-planillas titulo="Planillas Pendientes" :pdf="true" :head="theads" :dato-planillas="Planillas"/>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import tablaPlanillas from "./tablaPlanillas";
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    export default {
        name: "planillas",
        components:{
            sideColaboradores,
            tablaPlanillas
        },
        data(){
            return{
                Planillas: null,
                theads: ['Código', 'Fecha Creación','Total Planilla','Périodo','Sucursal','Usuario Creador','Estado','Acciones']
            }
        },
        asyncData({$axios, store}){
            return $axios.get('/planillas_p/',{
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
