<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <vs-table v-model="selectedCotizacion" @selected="verCotizacion" :data="Cotizaciones" search max-items="10" pagination>
                    <template stripe slot="header"><h5>Solicitudes de Cotización</h5></template>
                    <template slot="thead">
                        <th>Código de cotización</th>
                        <th>Proveedor de solicitúd</th>
                        <th>Usuario creador</th>
                        <th>Fecha de creación</th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].cod_cotizacion">{{data[indextr].cod_cotizacion}}</vs-td>
                            <vs-td :data="data[indextr].cod_cotizacion">
                                <vs-chip color="#FFF" style="color: black" >
                                    <vs-avatar v-if="data[indextr].proveedor.logo" :src="data[indextr].proveedor.logo"/>
                                    <vs-avatar  v-else :text="data[indextr].proveedor.nombre"/>
                                    {{data[indextr].proveedor.nombre}}
                                </vs-chip >
                            </vs-td>
                            <vs-td :data="data[indextr].user.usuario">{{data[indextr].user.usuario}}</vs-td>
                            <vs-td :data="data[indextr].fecha_creacion">{{data[indextr].fecha_creacion}}</vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    export default {
        name: "index",
        components: {sideColaboradores},
        data(){
          return{
              selectedCotizacion: null
          }
        },
        methods:{
            verCotizacion(){
                this.$router.replace({path:'/proveedores/cotizaciones/cotizacion/'+this.selectedCotizacion.id})
            }
        },
        asyncData({$axios, store, route}){
            return $axios.get('cotizaciones',{
                headers:{
                    'Authorization': `Bearer ${store.state.token}`
                },
            }).then(res =>{
                return{
                    Cotizaciones: res.data.cotizaciones,
                }
            })
        }
    }
</script>

<style scoped>

</style>
