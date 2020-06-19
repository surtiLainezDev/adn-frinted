<template>
    <vs-card style="padding: 5px">
        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <div>
                    <div class="row">
                        <div class="col-auto">
                            <h4>{{datosSucursal.nombre}}</h4>
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="row">
                        <div class="col-auto" v-for="(i, index, item) in infoSucursal">
                            <radiusficha :texto="infoSucursal[index]" :tipo="index"
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
    import sideSmall from "../../../components/menus/sideSmall";
    import radiusficha from "../../../components/radiusficha";
    export default {
        components:{
            sideSmall,
            radiusficha
        },
        data(){
            return{
                isPeticion: false,
                datosSucursal: null,
                infoSucursal:{
                    nombre: null,
                    ubicacion:null,
                    telefono:null,
                    correo:null,
                    colaboradores_activos:null
                },
                iconos: ['store','location_on','phone','mail_outline','group']
            }
        },
        methods:{
            addInfoSucursal(){
                let contador = 0;
                this.infoSucursal.nombre    = this.datosSucursal.nombre
                this.infoSucursal.ubicacion = this.datosSucursal.ciudade.nombres+', '+this.datosSucursal.ciudade.municipio.departamento.nombre
                this.infoSucursal.telefono  = this.datosSucursal.telefono
                this.infoSucursal.correo    = this.datosSucursal.email
                for (let item in this.datosSucursal.colaborador){
                    if (this.datosSucursal.colaborador[item].estado === 1){
                        contador++
                    }
                }
                this.infoSucursal.colaboradores_activos = contador+''
            }
        },
        created() {
            this.addInfoSucursal()
        },
        asyncData({$axios, store, route}){
            return $axios.get('/sucursales/'+route.params.sucursal,{
                headers:{
                    'Authorization': `Bearer ${store.state.token}`
                },
            }).then((res)=>{
                return{
                    datosSucursal: res.data.suc
                }
            })
        },
    }
</script>

<style scoped>

</style>
