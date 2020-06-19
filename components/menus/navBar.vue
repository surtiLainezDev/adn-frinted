<template>
    <vs-card class="border border-primary" style="background-color: orangered">
        <vs-tabs>
            <div v-if="tipoUser == 1">
                <vs-tab label="Administrador" icon="person" class="contenedorM">
                    <div class="row" v-if="$store.state.estadoMenu" >
                        <item2 :items="itemUser"/>
                        <item2 :items="itemSucursal"/>
                    </div>
                </vs-tab>
            </div>
            <div v-if="tipoUser == 1 || tipoUser == 2 || permisos.includes(1)">
                <vs-tab label="Colaboradores" icon="person_outline" class="contenedorM">
                    <div class="row" v-if="$store.state.estadoMenu">
                        <item2 v-if="tipoUser == 1 || tipoUser == 2" :items="itemColaborador"/>
                        <item2 :items="itemPlanilla"/>
                    </div>
                </vs-tab>
            </div>

            <div v-if="permisos.includes(4)">
                <vs-tab label="Contabilidad" icon="account_balance" class="contenedorM">
                    <div class="row" v-if="$store.state.estadoMenu">
                        <item2 v-if="permisos.includes(4)" :items="itemContabilidad"/>
                        <item2 v-if="permisos.includes(4)" :items="itemContabilidad2"/>
                    </div>
                </vs-tab>
            </div>
            <div v-if="permisos.includes(2)">
                <vs-tab label="Proveedores" icon="group" class="contenedorM">
                    <div class="row" v-if="$store.state.estadoMenu">
                        <item2 v-if="permisos.includes(2)" :items="itemProveedor"/>
                        <item2 v-if="permisos.includes(2)" :items="itemProveedor2"/>
                    </div>
                </vs-tab>
            </div>
            <div v-if="permisos.includes(3)">
                <vs-tab label="Inventario" icon="dashboard" class="contenedorM">
                    <div class="row" v-if="$store.state.estadoMenu">
                        <item2 v-if="permisos.includes(39)" :items="itemInventario"/>
                    </div>
                </vs-tab>
            </div>
            <div >
                <vs-tab :label="user" icon="person" class="contenedorM">
                    <div class="row" v-if="$store.state.estadoMenu">
                        <div class="col-md-11">
                            <div class="row">
                                <item2 :items="user1"/>
                                <item2 v-if="permisos.includes(5)" :items="user2"/>
                            </div>
                        </div>
                        <div class="col-md-1">
                            <div class="row d-flex justify-content-end">
                                <div class="col-auto ">
                                    <vs-button @click="logout" color="warning"  icon="exit_to_app">
                                    </vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </vs-tab>
            </div>
        </vs-tabs>
    </vs-card>
</template>

<script>
    import item2 from "../ComponentesMenu/item2";
    export default {
        name: "navBar",
        components:{
            item2,
        },
        data(){
            return{
                user1:[
                    {nombre:'Perfil',icon:'person',url:'#', per:true},
                    {nombre:'Cambiar Contraseña',icon:'person',url:'#', per:true},
                    {nombre:'Mi Colaborador',icon:'face',url:'#',per:true},
                ]
            }
        },
        computed:{
            user2:function(){
                let items = [
                  {nombre:'Agregar Ciudades',icon:'add',url:'/direcciones/ciudad', per:this.permisos.includes(51)},
                  {nombre:'Agregar Colonias',icon:'add',url:'/direcciones/colonias', per:this.permisos.includes(52)}
                ]
                return items;
            },
            sucursal: function () {
                return this.$store.state.sucursal
            },
            user: function () {
                return this.$store.state.usuario
            },
            tipoUser: function () {
                return this.$store.state.tipoUsuario
            },
            permisos:function () {
                return this.$store.state.permisosUser
            },
            itemUser:function(){
              let items = [
                  {nombre:'Crear Usuarios',icon:'person_add', url:'/usuarios/nuevo/', per:true},
                  {nombre:'Usuarios',icon:'person', url:'/usuarios/', per:true},
                  {nombre:'Agregar Módulos',icon:'add',url:'/usuarios/modulos/', per:true},
                ]
              return items
            },
            itemSucursal:function(){
              let item = [
                  {nombre:'Crear Sucursal', icon:'add',url:'/administrador/sucursales/nuevo', per:true},
                  {nombre:'Sucursales', icon:'store',url:'/administrador/sucursales/', per:true},
                  {nombre:'Crear Colaborador', icon:'add',url:'/colaborador/nuevo', per:true}
              ]
              return item
            },
            itemColaborador:function(){
              let items =[
                  {nombre:'Colaboradores', icon:'person_outline',url:'/colaborador/', per:true},
                  {nombre:'Contratos Colaboradores', icon:'description',url:'/colaborador/contratos', per:true},
              ]
              return items
            },
            itemContabilidad:function(){
              let items =[
                  {nombre:'Catálogo',icon:'book',url:'/contabilidad/', per:this.permisos.includes(41)},
                  {nombre:'Cajas Generales',icon:'attach_money',url:'/contabilidad/cajas', per:this.permisos.includes(42)},
                  {nombre:'Cajas Chicas',icon:'attach_money',url:'/contabilidad/cajas_chicas',per:this.permisos.includes(44)},
              ]
                return items
            },
            itemContabilidad2:function(){
                let items=[
                    {nombre:'Bancos',icon:'attach_money',url:'/contabilidad/bancos',per:this.permisos.includes(43)},
                    {nombre:'Pago a Colaboradores',icon:'attach_money',url:'/colaborador/planillas/pago',per:this.permisos.includes(14)},
                ]
                return items
            },
            itemPlanilla:function () {
                let items = [
                    {nombre:'Crear Planilla',icon:'add',url:'/colaborador/planillas/nuevo', per:this.permisos.includes(11)},
                    {nombre:'Planillas',icon:'description',url:'/colaborador/planillas/',per:this.permisos.includes(12) },
                    {nombre:'Planillas Pendientes',icon:'maximize',url:'/colaborador/planillas/planillas', per:this.permisos.includes(13)},
                ];
                return items
            },
            itemProveedor:function () {
                let items = [
                    {nombre:'Crear Proveedor',icon:'add',url:'/proveedores/nuevo', per:this.permisos.includes(21)},
                    {nombre:'Proveedores',icon:'group',url:'/proveedores/', per:this.permisos.includes(23)},
                    {nombre:'Contactos',icon:'contacts',url:'/proveedores/contactos', per:this.permisos.includes(22)},
                ]
                return items;
            },
            itemProveedor2:function () {
                let item = [
                    {nombre:'Crear Cotización',icon:'add',url:'/proveedores/cotizaciones/nuevo', per:this.permisos.includes(24)},
                    {nombre:'Ver Cotizaciones',icon:'picture_as_pdf',url:'/proveedores/cotizaciones/', per:this.permisos.includes(25)},
                    {nombre:'Marcas/Módelos/Familias',icon:'add',url:'/inventario/marcas/nuevo', per:this.permisos.includes(35)},
                ]
                return item;
            },
            itemInventario:function () {
                let item=[
                    {nombre: 'Menú', icon:'list', url:'/inventario/', per:this.permisos.includes(39)}
                ]
                return item
            }
        },
        methods:{
            logout:function () {
                this.$store.commit("guardarToken", null);
                this.$store.commit("guardarUsuario", null);
                this.$store.commit("guardarTipoUsuario", null);
                this.$store.commit("guardarSucursal", null);
                this.$store.commit("guardarEstadoUsuario", null);

                localStorage.removeItem('token')
                localStorage.removeItem('usuario')
                localStorage.removeItem('tipoUsuario')
                localStorage.removeItem('sucursal')
                localStorage.removeItem('estadoUsuario')

                this.$router.replace({path:"/"})
            },
        },
    }
</script>

<style scoped lang="stylus">
.contenedorM
    padding 0px
</style>
