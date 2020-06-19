<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Catálogo Contable"/>
                <div>
                    <vs-list v-for="item in TiposCuentas">
                        <vs-list-header color="warning" :title="item.referencia+' - '+item.nombre"></vs-list-header>
                        <vs-list v-for="item2 in item.cuentas">
                            <vs-list-header color="success" :title="item2.referencia+' - '+item2.nombre"></vs-list-header>
                            <vs-list v-for="item3 in item2.cuenta">
                                <vs-list-header color="primary" :title="item3.referencia+' - '+item3.nombre"></vs-list-header>
                                <div v-for="item4 in item3.cuentas">
                                    <vs-list-item :title="item4.referencia+' - '+item4.nombre" ></vs-list-item>
                                    <div v-for="bit in Bitacoras" v-if="item4.referencia == bit.referencia">
                                        <nuxt-link :to="bit.url">- {{bit.nombre}}</nuxt-link>
                                    </div>
                                </div>
                            </vs-list>
                        </vs-list>
                    </vs-list>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import tituloh5 from "../../components/tituloh5";
    export default {
        name: "index",
        components:{
            sideColaboradores,
            tituloh5
        },
        data(){
            return{
                TiposCuentas: null,
                Bitacoras: null
            }
        },
        created() {
            this.cargarTipos()
        },
        methods:{
            cargarTipos(){
                this.$axios.get('catalogo/tipos',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.TiposCuentas = res.data.cuentas
                        this.Bitacoras    = res.data.bitacoras
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
    .links
        font-size 25px

</style>
