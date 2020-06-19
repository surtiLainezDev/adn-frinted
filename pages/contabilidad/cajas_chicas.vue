<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                <tituloh5 titulo="Cajas Chicas"/>
                <vs-table v-model="selectedCaja" @selected="irCajasChicas" :data="Cajas"  pagination max-items="10" search>
                    <template slot="thead">
                        <vs-th>Sucursal</vs-th>
                        <vs-th>Total Inicial</vs-th>
                        <vs-th>Total Actual</vs-th>
                        <vs-th>Fecha Asignación</vs-th>
                        <vs-th>Fecha de Cierre</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                            <vs-td>
                                {{data[indextr].nombre}}
                            </vs-td>
                            <vs-td >
                                L {{data[indextr].total_inicial}}
                            </vs-td>
                            <vs-td >
                                L {{data[indextr].total_actual}}
                            </vs-td>
                            <vs-td >
                                {{data[indextr].fecha_asignacion}}
                            </vs-td>
                            <vs-td >
                                {{data[indextr].fecha_finalizacion}}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import tituloh5 from "../../components/tituloh5";
    export default {
        name: "cajas_chicas",
        components:{
            sideColaboradores,
            tituloh5
        },
        data(){
            return{
                isPeticion:   false,
                Cajas:        [],
                selectedCaja: []
            }
        },
        methods:{
            irCajasChicas(){
                this.$router.replace({path:'/cajas_chicas/'+this.selectedCaja.id})
            },
            cargarCajas(){
                this.isPeticion = true
                this.$axios.get('cajas_chicas',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Cajas = res.data.cajas
                        this.isPeticion = false
                    }
                })
            }
        },
        created() {
            this.cargarCajas()
        }
    }
</script>

<style scoped>

</style>
