<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <div v-if="Caja">
                    <tituloh5 :titulo="Caja.nombre"/>
                    <div class="row">
                        <div class="col-auto" v-for="(i, index,item) in itemsCaja">
                            <radiusficha :texto="''+itemsCaja[index]" :tipo="index"
                                         :icono="iconos[item]" color="#30B26e"/>
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import radiusficha from "../../components/radiusficha";
    import tituloh5 from "../../components/tituloh5";
    export default {
        components:{
            sideColaboradores, tituloh5, radiusficha
        },
        data(){
            return{
                Caja: null,
                iconos: ['store','store','person_outline','store'],
                itemsCaja: {
                    fecha_finalizacion: null,
                    fecha_inicio:null,
                    total_inicial:null,
                    total_actual:null
                }
            }
        },
        created() {
            this.cargarCaja()
        },
        methods:{
            addInfoCaja(){
                this.itemsCaja.fecha_finalizacion = ''+this.Caja.fecha_finalizacion
                this.itemsCaja.fecha_inicio = ''+this.Caja.fecha_asignacion
                this.itemsCaja.total_actual = 'L '+this.Caja.total_actual
                this.itemsCaja.total_inicial = 'L '+this.Caja.total_inicial
            },
            cargarCaja(){
                this.$axios.get('/caja_chica/'+this.$route.params.caja,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Caja = res.data.caja
                        this.addInfoCaja()
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>
