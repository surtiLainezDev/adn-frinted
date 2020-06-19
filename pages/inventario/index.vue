<template>
    <vs-card>
        <div class="row" style="padding: 5px">
            <div class="col-md-2">
                <nav-inventario/>
            </div>
            <div class="col-md-10">
                <vs-card>
                    <div class="d-flex justify-content-center">
                        <div class="w-75">
                            <div class="row">
                                <div class="col d-flex justify-content-center"><h4>Menú Rápido de Inventario</h4></div>
                            </div>
                            <vs-divider></vs-divider>
                            <div class="row">
                                <div v-for="item in fila1">
                                    <BtnInventario :icon="item.icon" :titulo="item.titulo" :permiso="item.permiso"
                                                   :tooltip="item.tooltip" :url="item.url"/>
                                </div>
                            </div>
                            <div class="row">
                                <div v-for="item in fila2">
                                    <BtnInventario :icon="item.icon" :titulo="item.titulo" :permiso="item.permiso"
                                                   :tooltip="item.tooltip" :url="item.url"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </vs-card>
            </div>
        </div>
    </vs-card>

</template>

<script>
    import BtnInventario from "../../components/BtnInventario";
    import navInventario from "../../components/navInventario";
    export default {
        name: "index",
        components:{BtnInventario, navInventario},
        computed:{
            permisos:function () {
                return this.$store.state.permisosUser
            },
            fila1:function () {
                let info=[
                    {icon:'add', titulo:'Crear Nuevo Artículo',permiso:this.permisos.includes(310),
                    tooltip:'Crear nuevo articulo para despues ingresarlo', url:'/inventario/articulos/nuevo'},
                    {icon:'add', titulo:'Ingresar Artículo',permiso:this.permisos.includes(37),
                        tooltip:'Ingresando Artículos al inventario', url:'/inventario/articulos/entrada'},
                    {icon:'add', titulo:'Crear Orden de Compra',permiso:this.permisos.includes(32),
                        tooltip:'Creando ordenes de compra', url:'/inventario/ordenes-compra/nuevo'}]
                return info;
            },
            fila2:function () {
                let info=[
                    {icon:'dashboard', titulo:'Inventario',permiso:this.permisos.includes(39),
                    tooltip:'Inventario', url:'/inventario/articulos/'}
                    ]
                return info;
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
