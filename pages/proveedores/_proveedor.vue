<template>
<vs-card>
    <div class="row">
        <div class="col-md-2"><side-colaboradores/></div>
        <div class="col-md-10">
            <vs-progress v-if="$fetchState.pending" indeterminate color="success"></vs-progress>
            <div v-else>
                <vs-tabs>
                    <vs-tab :label="Proveedor.nombre">
                        <div class="row">
                            <div class="col-xl-5">
                                <vs-card style="padding: 5px">
                                    <div class="row">
                                        <div class="col d-flex justify-content-center">
                                            <vs-avatar size="120px" :src="Proveedor.logo"/>
                                        </div>
                                    </div>
                                    <vs-divider></vs-divider>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <vs-list>
                                                <vs-list-header title="Información General"></vs-list-header>
                                                <vs-list-item title="Nombre" :subtitle="Proveedor.nombre">
                                                    <vs-button color="warning" v-b-toggle.sidebar-ContactosProveedorEditar
                                                               size="small" icon="create">Editar</vs-button>
                                                </vs-list-item>
                                                <vs-list-item title="Rtn" :subtitle="Proveedor.rtn">
                                                </vs-list-item>
                                                <vs-list-item title="Correo Eléctronico" :subtitle="Proveedor.email">
                                                </vs-list-item>
                                                <vs-list-item title="Teléfono" :subtitle="Proveedor.telefono">
                                                </vs-list-item>
                                            </vs-list>
                                        </div>
                                        <div class="col-md-6">
                                            <vs-list>
                                                <vs-list-header title="Información de Ubicación"></vs-list-header>
                                                <vs-list-item title="País" :subtitle="Proveedor.pais">
                                                </vs-list-item>
                                                <vs-list-item title="Código Postal" :subtitle="Proveedor.codigo_postal">
                                                </vs-list-item>
                                                <vs-list-item title="Dirección Completa" :subtitle="Proveedor.direccion">
                                                </vs-list-item>
                                            </vs-list>
                                        </div>
                                    </div>
                                </vs-card>
                            </div>
                            <div class="col-xl-4">
                                <vs-card>
                                    <vs-list>
                                        <vs-list-header title="Contactos Asignados" color="primary"></vs-list-header>
                                        <vs-list-item v-for="item in Proveedor.contacto_proveedors"
                                                      :title="item.nombre_completo" :subtitle="item.puesto">
                                            <vs-button size="small" color="warning">Ver</vs-button>
                                            <template slot="avatar">
                                                <vs-avatar :text="item.nombre_completo"/>
                                            </template>
                                        </vs-list-item>
                                    </vs-list>
                                </vs-card>
                            </div>
                            <div class="col-xl-3">
                                <vs-card>
                                <vs-list>
                                    <vs-list-item title="Cuentas Bancarias" color="success">
                                        <vs-button size="small" @click="popupBancos = true" radius color="success"
                                                   icon="add"></vs-button>
                                    </vs-list-item>
                                    <vs-list-item v-for="item in Cuentas"
                                                  :title="item.banco.nombre" :subtitle="item.num">
                                        <vs-chip>
                                            <vs-avatar icon="attach_money"/>
                                            L {{item.total_transferido}}
                                        </vs-chip>
                                        <template slot="avatar">
                                            <vs-avatar :text="item.banco.nombre"/>
                                        </template>
                                    </vs-list-item>
                                </vs-list>
                            </vs-card>
                            </div>
                        </div>
                    </vs-tab>
                    <vs-tab label="Inventario">
                        <div class="con-tab-ejemplo">
                            Trabajando en Inventario
                        </div>
                    </vs-tab>
                    <vs-tab label="Facturas">
                        <div class="con-tab-ejemplo">
                            Trabajando en Facturas
                        </div>
                    </vs-tab>
                    <vs-tab label="Transacciones">
                        <div class="con-tab-ejemplo">
                            Trabajando en Transacciones
                        </div>
                    </vs-tab>
                </vs-tabs>

                <b-sidebar v-model="sideProveedor"
                           id="sidebar-ContactosProveedorEditar" :title="'Editando '+Proveedor.nombre"  right shadow width="500px">
                    <div class="px-3 py-2">
                        <vs-progress v-if="isPeticionEditar" color="success" indeterminate></vs-progress>
                        <div class="row"><div class="col form-group">
                            <label >Nombre</label>
                            <input type="text" class="form-control form-control-sm"
                                    v-model="proveedorDatos.nombre">
                        </div></div>
                        <div class="row">
                            <div class="col-md-4 form-group">
                                <label >Rtn</label>
                                <input type="text" class="form-control form-control-sm"
                                       v-model="proveedorDatos.rtn">
                            </div>
                            <div class="col-md-4 form-group">
                                <label >País</label>
                                <input type="text" disabled class="form-control form-control-sm"
                                       v-model="Proveedor.pais">
                            </div>
                            <div class="col-md-4 form-group">
                                <label >Código Postal</label>
                                <input type="text"  class="form-control form-control-sm"
                                       v-model="proveedorDatos.postal">
                            </div>
                        </div>
                        <div class="row"><div class="col form-group">
                            <label >Dirección</label>
                            <input type="text" class="form-control form-control-sm"
                                   v-model="proveedorDatos.direccion">
                        </div></div>
                        <div class="row">
                            <div class="col-md-6 form-group">
                                <label >Correo Eléctronico</label>
                                <input type="text" class="form-control form-control-sm"
                                       v-model="proveedorDatos.email">
                            </div>
                            <div class="col-md-3 form-group">
                                <label >Teléfono</label>
                                <input type="text"  class="form-control form-control-sm"
                                       v-model="proveedorDatos.telefono">
                            </div>
                            <div class="col-md-3 form-group">
                                <label >Swift</label>
                                <input type="text"  class="form-control form-control-sm"
                                       v-model="proveedorDatos.swift">
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="row"><div class="col d-flex justify-content-end">
                            <vs-button :disabled="isPeticionEditar" color="success"@click="editandoProveedor" >Registrar Cambios</vs-button>
                        </div></div>
                        <div class="row" v-if="erroresServidor">
                            <div class="col">
                                <errores422 :errores="erroresServidor"/>
                            </div>
                        </div>
                    </div>
                </b-sidebar>

                <vs-prompt color="success"
                           title="Registro Exitoso"
                           accept-text="Aceptar"
                           @accept="$fetch"
                           button-cancel
                           :active.sync="prompt.state">
                    <div >
                        {{prompt.msg}}
                    </div>
                </vs-prompt>

                <vs-popup title="Creando Cuenta de Bancos" :active.sync="popupBancos">
                    <div style="padding: 5px">
                        <vs-progress color="success" indeterminate v-if="isPeticionCuenta"></vs-progress>
                        <div class="row">
                            <div class="col-md-6">
                                <label>Banco</label>
                                <select v-model="cuenta.banco" class="form-control-sm form-control">
                                    <option v-for="item in Bancos" :value="item.id">{{item.nombre}}</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label >Número de Cuenta</label>
                                <input type="text" class="form-control-sm form-control" v-model="cuenta.num">
                                <span class="error" v-if="cuenta.error">La cuenta tiene que ser mayor a 5 carácteres.</span>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="row">
                            <div class="col d-flex justify-content-end">
                                <vs-button :disabled="isPeticionCuenta" @click="addcuentas" color="success" >Registrar Cuenta</vs-button>
                            </div>
                        </div>
                        <div v-if="erroresServidor" class="row">
                            <div class="col">
                                <errores422 :errores="erroresServidor"/>
                            </div>
                        </div>
                    </div>
                </vs-popup>

            </div>


        </div>
    </div>
</vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import Errores422 from "../../components/Errores422";
    export default {
        name: "_proveedor",
        components:{Errores422, sideColaboradores},
        data(){
            return{
                prompt:{
                    state: false,
                    msg: null
                },
                isPeticionEditar: false,
                erroresServidor:{},
                Proveedor: null,
                sideProveedor: false,
                proveedorDatos: {
                    nombre: null,
                    telefono: null,
                    direccion: null,
                    postal:null,
                    rtn:null,
                    email:null,
                    swift:null
                },
                Bancos: null,
                popupBancos: null,
                cuenta:{
                    banco:null,
                    num:'',
                    error: false,
                },
                Cuentas: null,
                isPeticionCuenta:false
            }
        },
        methods:{
            addcuentas(){
                if (this.cuenta.num.length > 5){
                    this.cuenta.error = false
                    this.isPeticionCuenta = true
                    this.$axios.post('proveedores_cuentas_bancos',{
                        proveedor: this.Proveedor.id,
                        banco:     this.cuenta.banco,
                        num:       this.cuenta.num
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.$vs.notify({
                                text: 'Se ha registrado la cuenta '+this.cuenta.num+' correctamente.',
                                title: 'Registro Exitoso',
                                position: 'top-right',
                                color: 'success'
                            })
                            this.cuenta.banco = null;
                            this.cuenta.num = ''
                            this.isPeticionCuenta = false
                            this.popupBancos = false
                            this.erroresServidor = {}
                            this.cargarCuentas()
                        }
                    }).catch((error)=>{
                        this.isPeticionCuenta = false
                        if (error.response.status === 422){
                            this.erroresServidor = {}
                            this.erroresServidor = error.response.data.errors
                        }
                    })
                }else{
                    this.cuenta.error = true
                }
            },
            cargarCuentas(){
                this.$axios.get('proveedores_cuentas_bancos/'+this.$route.params.proveedor,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status = 200){
                        this.Cuentas = res.data.cuentas
                    }
                })
            },
            pasarDatos(){
                this.proveedorDatos.nombre    = this.Proveedor.nombre
                this.proveedorDatos.telefono  = this.Proveedor.telefono
                this.proveedorDatos.direccion = this.Proveedor.direccion
                this.proveedorDatos.postal    = this.Proveedor.codigo_postal
                this.proveedorDatos.rtn       = this.Proveedor.rtn
                this.proveedorDatos.email     = this.Proveedor.email
                this.proveedorDatos.swift     = this.Proveedor.swift
            },
            editandoProveedor(){
                this.isPeticionEditar = true
                this.$axios.put('proveedores/'+this.Proveedor.id,{
                    nombre:        this.proveedorDatos.nombre,
                    rtn:           this.proveedorDatos.rtn,
                    pais:          this.Proveedor.pais,
                    codigo_postal: this.proveedorDatos.postal,
                    direccion:     this.proveedorDatos.direccion,
                    email:         this.proveedorDatos.email,
                    telefono:      this.proveedorDatos.telefono,
                    swift:         this.proveedorDatos.swift,
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticionEditar = false
                        this.sideProveedor = false
                        this.prompt.msg = `Se registraron los cambios del proveedor ${this.Proveedor.nombre} correctamente.`
                        this.prompt.state = true
                    }
                }).catch((error)=>{
                    this.isPeticionEditar = false
                    if (error.response.status === 422){
                        this.erroresServidor = error.response.data.errors
                    }
                    if (error.response.status === 500){
                        this.erroresServidor = {err: ['Hubo un error en el servidor al registrar los datos.' +
                            ' Intenta de nuevo si el error persiste comuniquese con servicio técnico.']}
                    }
                })
            }
        },
        async fetch (){
            this.Proveedor =(await this.$axios.get('/proveedores/'+this.$route.params.proveedor, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token
                }
            })).data.proveedor
            this.pasarDatos()
            this.Bancos = (await this.$axios.get('/bancos',{
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token
                }
            })).data.bancos
            this.cargarCuentas()
        }
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
