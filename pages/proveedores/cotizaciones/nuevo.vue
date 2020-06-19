<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Nueva Cotización"/>
                <vs-progress indeterminate color="success" v-if="isPeticion"></vs-progress>
                <div class="row">
                    <div class="col-md-4">
                        <label>Proveedor</label>
                        <select v-model="cotizacion.proveedor" @change="contactosProveedor" class="form-control form-control-sm">
                            <option v-for="item in Proveedores" :value="item.id">{{item.nombre}}</option>
                        </select>
                        <span v-if="cotizacion.requiredPro" class="error">El proveedor es requerido</span>
                    </div>
                    <div class="col-md-2">
                        <label>Usuario</label>
                        <input type="text" disabled :value="user" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-3"></div>
                    <div class="col-md-3 d-flex justify-content-end align-self-end">
                        <vs-button icon="email" size="small" @click="popupMail = true" color="success" >Enviar</vs-button>
                        <vs-button icon="add" style="margin-left: 5px" size="small" @click="addFilas" color="success" >Agregar Fila</vs-button>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="CuerpoCotizacion" style="overflow-y: scroll; ">
                    <div class="row TituloCotizacion">
                        <div class="col-md-1">#</div>
                        <div class="col-md-1">Cant.</div>
                        <div class="col-md-9">Descripción del Artículo</div>
                        <div class="col-md-1">Eliminar</div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="row filasCuerpoCotizacion" v-for="(item, index) in cotizacion.filas">
                        <div class="col-md-1 d-flex justify-content-center">{{index + 1}}</div>
                        <div class="col-md-1 d-flex justify-content-center">
                            <vs-input-number size="small" v-model="item.cantidad" min="1"></vs-input-number>
                        </div>
                        <div class="col-md-1 d-flex justify-content-center">
                            <vs-button color="success" disabled="true" size="small" icon="search"></vs-button>
                        </div>
                        <div class="col-md-8">
                            <input type="text" v-model="item.descripcion" class="form-control form-control-sm">
                            <span class="error" v-if="item.required">{{errorRequired}}</span>
                        </div>
                        <div class="col-md-1 d-flex justify-content-center">
                            <vs-button color="danger" @click="removeFila(item.fila)" icon="remove" size="small"></vs-button>
                        </div>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button :disabled="isPeticion" @click="registrarCotizacion" color="success">Crear Cotización</vs-button>
                    </div>
                </div>
                <div class="row" v-if="erroresServidor">
                    <Errores422 :errores="erroresServidor"/>
                </div>

                <vs-popup :active.sync="popupAcciones" title="Acciones al Guardar Cotización">
                    <div style="padding: 5px">
                        <div class="row filasPopup">
                            <div class="col-md-11">
                                <vs-button color="success" @click="acciones(3)" size="small" icon="picture_as_pdf">Ver en PDF</vs-button>
                            </div>
                        </div>
                        <div class="row filasPopup">
                            <div class="col-md-11">
                                <vs-button color="success" :disabled="isPeticion" size="small" icon="add">Crear Nueva Cotización</vs-button>
                            </div>
                        </div>
                    </div>
                </vs-popup>

                <vs-popup  title="Enviar Cotización al Proveedor" :active.sync="popupMail">
                    <div style="padding: 5px">
                        <div class="row"><div class="col text-center"><strong>Seleccione contactos</strong></div></div>
                        <vs-divider></vs-divider>
                        <div v-for="(indice,item) in Contactos" class="row">
                            <div class="col d-flex justify-content-start">
                                <vs-checkbox :vs-value="indice" :key="item" v-model="contactosMail">{{indice.nombre_completo}} - {{indice.puesto}}</vs-checkbox>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="row">
                            <div class="col"><small>Correos a los que se le enviara la cotización</small></div>
                        </div>
                        <div v-for="item in contactosMail" class="row"><div class="col"><small><strong>{{item.email}}</strong></small></div></div>
                    </div>
                </vs-popup>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import Errores422 from "../../../components/Errores422";
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    import tituloh5 from "../../../components/tituloh5";
    export default {
        components:{sideColaboradores, tituloh5, Errores422},
        name: "nuevo",
        data(){
            return{
                contactosMail:[],
                popupMail: false,
                Contactos: null,
                idCotizacion: null,
                popupAcciones: false,
                erroresServidor: {},
                isPeticion: false,
                Proveedores: null,
                errorRequired: 'Este campo no puede quedar vacio o tiene que tener ser mayor a 5 carácteres',
                cotizacion:{
                    proveedor: null,
                    filas:[
                        {fila:0,cantidad:1,descripcion:'',required:false}
                    ],
                    requiredPro: false
                },
                filas: 1
            }
        },
        computed:{
            user: function () {
                return this.$store.state.usuario
            },
        },
        mounted() {
          this.cargarProveedores()
        },
        methods:{
            contactosProveedor(){
                this.isPeticion = true
                this.contactosMail = []
                this.$axios.get('contactos_proveedor/'+this.cotizacion.proveedor,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticion = false
                        this.Contactos = res.data.contactos
                    }
                })
            },
            registrarCotizacion(){
                let estado = this.cotizacion.filas.length + 1
                let bandera = 0;
                for (let i in this.cotizacion.filas){
                    if (this.cotizacion.filas[i].descripcion.length < 5){
                      this.cotizacion.filas[i].required = true
                    }else{
                      bandera++
                      this.cotizacion.filas[i].required = false
                    }
                }
                if (this.cotizacion.proveedor > 0){
                    bandera ++
                    this.cotizacion.requiredPro = false
                }else{
                    this.cotizacion.requiredPro = true
                }
                if (bandera === estado){
                    this.isPeticion = true
                    this.$axios.post('proveedores/cotizaciones',{
                        proveedor: this.cotizacion.proveedor,
                        cuerpo:    this.cotizacion.filas,
                        contactos: this.contactosMail
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.token
                        }
                    }).then((res)=>{
                        this.isPeticion = false
                        if (res.status === 200){
                            this.popupAcciones = true
                            this.idCotizacion = res.data.cotizacion
                            this.notificacion('success','La Cotización se guardó exitosamente',
                            'Registro Exitoso')
                            this.cotizacion.proveedor = null
                            this.contactosMail = []
                            this.cotizacion.filas= {fila:0,cantidad:1,descripcion:'',required:false}
                        }
                    }).catch((error)=>{
                        this.isPeticion = false
                        if (error.response.status === 422){
                            this.erroresServidor = error.response.data.errors
                        }
                    })
                }
            },
            acciones(accion){
                this.popupAcciones = false
                if (accion === 3){
                    this.$router.replace({path:'/proveedores/cotizaciones/cotizacion/'+this.idCotizacion})
                }
            },
            addFilas(){
                let fila = this.cotizacion.filas.length
                this.cotizacion.filas.push({
                            "fila": fila ,
                            "cantidad": 1,
                            "descripcion": '',
                            "required": false
                        })
            },
            notificacion(color, text, titulo){
                this.$vs.notify({
                    text: text,
                    title: titulo,
                    position: 'top-right',
                    color: color
                })
            },
            removeFila(fila){
                if (this.cotizacion.filas.length < 2){
                    this.notificacion('warning', 'No se puede elimar la fila porque es la última.',
                        'Error al eliminar fila')
                }else{
                    this.cotizacion.filas.splice(fila, 1)
                    for (let item in this.cotizacion.filas){
                        this.cotizacion.filas[item].fila = item
                    }
                    this.notificacion('success', 'Ha eliminado una fila.',
                        'Eliminación Exitosa')
                }
            },
            cargarProveedores(){
                this.isPeticion = true
                this.$axios.get('/proveedores',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticion = false
                        this.Proveedores = res.data.proveedores
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
.CuerpoCotizacion
    height 400px
    width 100%
    background-color #F8FCF9
    padding 15px
.TituloCotizacion
    font-weight bold
    font-size 18px
.filasCuerpoCotizacion
    margin-top 5px
.error
    color  red
.filasPopup
    margin-top 10px
</style>
