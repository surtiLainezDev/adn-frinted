<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <div v-if="Caja">
                    <tituloh5 :titulo="'Caja de '+Caja.nombre"/>
                    <div class="row">
                        <div class="col-auto" v-for="(i, index,item) in Caja">
                            <radiusficha :texto="''+Caja[index]" :tipo="index"
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
    import tituloh5 from "../../components/tituloh5";
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import radiusficha from "../../components/radiusficha";
    export default {
        components:{
            sideColaboradores, tituloh5, radiusficha
        },
        data(){
            return{
                Caja: null,
                iconos: ['store','store','person_outline','store']
            }
        },
        created() {
            this.cargarCaja()
        },
        methods:{
            cargarCaja(){
                this.$axios.get('/caja/'+this.$route.params.caja,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Caja = res.data.caja[0]
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>
