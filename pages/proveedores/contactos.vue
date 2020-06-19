<template>
<vs-card>
    <div class="row">
        <div class="col-md-2"><side-colaboradores/></div>
        <div class="col-md-10">
            <tituloh5 titulo="Contactos de Proveedores"/>
            <vs-progress v-if="isPeticion" color="success" indeterminate></vs-progress>
            <vs-table :data="Contactos" search max-items="10" @selected="editContacto"
                      pagination v-model="selectContacto" stripe>
                <template slot="header">
                    <div class="row">
                        <div class="col-auto d-flex align-items-center">
                            <h6>Contactos</h6>
                        </div>
                        <div class="col-auto">
                            <vs-button radius color="success" @click="abrirSide"
                                       type="flat" icon="add_circle"></vs-button>
                        </div>
                    </div>
                </template>
                <template slot="thead">
                    <th>Nombre Completo</th>
                    <th>Proveedor</th>
                    <th>Correo Eléctronico</th>
                    <th>Teléfono</th>
                    <th>Puesto</th>
                    <th>Estado</th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombre_completo">{{data[indextr].nombre_completo}}</vs-td>
                        <vs-td :data="data[indextr].proveedor.nombre">
                            <vs-chip color="#FFF" style="color: black" >
                                <vs-avatar v-if="data[indextr].proveedor.logo" :src="data[indextr].proveedor.logo"/>
                                <vs-avatar  v-else :text="data[indextr].proveedor.nombre"/>
                                {{data[indextr].proveedor.nombre}}
                            </vs-chip >
                        </vs-td>
                        <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>
                        <vs-td :data="data[indextr].telefono">{{data[indextr].telefono}}</vs-td>
                        <vs-td :data="data[indextr].puesto">{{data[indextr].puesto}}</vs-td>
                        <vs-td :data="data[indextr].estado">
                            <vs-chip v-if="data[indextr].estado === 1" color="success">Activo</vs-chip>
                            <vs-chip v-if="data[indextr].estado === 0" color="danger">Inactivo</vs-chip>
                        </vs-td>
                    </vs-tr>
                </template>

            </vs-table>

            <b-sidebar v-model="sideContactos" :title="tituloSide" right shadow width="450px">
                <div class="px-3 py-2">
                    <vs-progress v-if="isPeticionRC" color="success" indeterminate></vs-progress>
                    <div class="row" v-if="contactos.tipo"><div class="col d-flex justify-content-end">
                        <div>
                            <label>Estado</label>
                            <vs-switch v-model="contactos.estado" @click="contactos.estado = !contactos.estado"/>
                        </div>
                    </div></div>
                    <div class="row"><div class="col form-group">
                        <label>Nombre Completo</label>
                        <input type="text" class="form-control form-control-sm"
                               :class="{'is-invalid': $v.contactos.nombre.$error}"
                               v-model.trim="$v.contactos.nombre.$model">
                        <div v-if="$v.contactos.nombre.$error">
                            <div class="error" v-if="!$v.contactos.nombre.required">{{errores.required}}</div>
                            <div class="error" v-if="!$v.contactos.nombre.max">{{errores.max}} 50.</div>
                            <div class="error" v-if="!$v.contactos.nombre.min">{{errores.min}} 3.</div>
                        </div>
                    </div></div>
                    <div class="row">
                        <div class="col-md-4 form-group">
                            <label>Teléfono</label>
                            <input type="text" class="form-control form-control-sm"
                                   :class="{'is-invalid':$v.contactos.telefono.$error}"
                                   v-model.trim="$v.contactos.telefono.$model">
                            <div v-if="$v.contactos.telefono.$error">
                                <div class="error" v-if="!$v.contactos.telefono.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.contactos.telefono.max">{{errores.max}} 13.</div>
                                <div class="error" v-if="!$v.contactos.telefono.min">{{errores.min}} 8.</div>
                            </div>
                        </div>
                        <div class="col-md-8 form-group">
                            <label>Correo Eléctronico</label>
                            <input type="text" class="form-control form-control-sm"
                                   :class="{'is-invalid':$v.contactos.email.$error}"
                                   v-model.trim="$v.contactos.email.$model">
                            <div v-if="$v.contactos.email.$error">
                                <div class="error" v-if="!$v.contactos.email.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.contactos.email.max">{{errores.email}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label>Puesto</label>
                            <input type="text" class="form-control form-control-sm"
                                   :class="{'is-invalid':$v.contactos.puesto.$error}"
                                   v-model.trim="$v.contactos.puesto.$model">
                            <div v-if="$v.contactos.puesto.$error">
                                <div class="error" v-if="!$v.contactos.puesto.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.contactos.puesto.max">{{errores.max}} 25.</div>
                            </div>
                        </div>
                        <div class="col-md-6 form-group">
                            <label >Proveedor</label>
                            <select class="form-control-sm form-control " :disabled="this.contactos.tipo"
                                    :class="{'is-invalid':$v.contactos.proveedor.$error}"
                                    v-model.trim="$v.contactos.proveedor.$model">
                                <option v-for="item in Proveedores" :value="item.id">{{item.nombre}}</option>
                            </select>
                            <div v-if="$v.contactos.proveedor.$error">
                                <div class="error" v-if="!$v.contactos.proveedor.required">{{errores.required}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row"><div class="col form-group">
                        <label >Observación</label>
                        <input type="text" class="form-control form-control-sm" v-model="contactos.observacion">
                    </div></div>
                    <vs-divider></vs-divider>
                    <div class="row">
                        <div class="col d-flex justify-content-end">
                            <vs-button color="success" @click="verificarForm">{{btnSide}}</vs-button>
                        </div>
                    </div>
                    <div v-if="erroresServidor">
                        <errores422 :errores="erroresServidor"/>
                    </div>
                </div>
            </b-sidebar>

        </div>
    </div>
</vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import tituloh5 from "../../components/tituloh5";
    import Errores422 from "../../components/Errores422";
    import { required, minLength, maxLength, email} from 'vuelidate/lib/validators'
    export default {
        name: "contactos",
        components:{sideColaboradores, tituloh5, Errores422},
        data(){
            return{
                selectContacto: null,
                errores:{
                    required: 'Este campo es requerido.',
                    min: 'Este campo lo mínimo de carácteres que acepta son ',
                    max: 'Este campo lo máximo de carácteres que acepta son ',
                    email: 'Este campo tiene que ser un correo valido.',
                    numeric: 'Este campo solo acepta datos númericos.'
                },
                sideContactos: false,
                Contactos: [],
                isPeticion: false,
                isPeticionRC: false,
                Proveedores: null,
                erroresServidor:{},
                contactos:{
                    nombre: null,
                    proveedor: null,
                    telefono: null,
                    email:null,
                    puesto: null,
                    observacion: null,
                    estado: null,
                    tipo: null
                },
                tituloSide: null,
                btnSide: null,
            }
        },
        validations:{
            contactos: {
                nombre:  {required, min:minLength(3), max:maxLength(50)},
                proveedor:   {required},
                email: {required, email},
                puesto: {required, max:maxLength(25)},
                telefono:{required, min:minLength(8), max:maxLength(13)}
            }
        },
        mounted() {
            this.cargarContactos()
            this.cargarProveedores()
        },
        methods:{
            abrirSide(){
                this.contactos.nombre      = null
                this.contactos.proveedor   = null
                this.contactos.email       = null
                this.contactos.puesto      = null
                this.contactos.telefono    = null
                this.contactos.observacion = null
                this.contactos.tipo        = null
                this.tituloSide            = "Creando un Nuevo Contacto"
                this.btnSide               = "Registrar Contacto"
                this.contactos.tipo        = false
                this.contactos.estado      = false
                this.sideContactos         = true
            },
            editContacto(){
                this.contactos.nombre      = this.selectContacto.nombre_completo
                this.contactos.proveedor   = this.selectContacto.proveedor_id
                this.contactos.email       = this.selectContacto.email
                this.contactos.puesto      = this.selectContacto.puesto
                this.contactos.telefono    = this.selectContacto.telefono
                this.contactos.observacion = this.selectContacto.observacion
                this.contactos.estado      = this.selectContacto.estado
                this.tituloSide            = `Editando Contacto ${this.selectContacto.nombre_completo}`
                this.btnSide               = "Registrar Cambios del Contacto"
                this.contactos.tipo        = true
                this.sideContactos         = true
            },
            verificarForm: function () {
                this.erroresServidor = {};
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = {err: ['Tienes que cumplir los requerimientos de los campos.']}
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        if (this.contactos.tipo){
                            this.editarContacto()
                        }else{
                            this.registrarContacto()
                        }
                    }, 500)
                }
            },
            editarContacto(){
                this.isPeticionRC = true
                this.$axios.put('proveedores_contactos/'+this.selectContacto.id,{
                    nombre:      this.contactos.nombre,
                    proveedor:   this.contactos.proveedor,
                    telefono:    this.contactos.telefono,
                    email:       this.contactos.email,
                    puesto:      this.contactos.puesto,
                    observacion: this.contactos.observacion,
                    estado:      this.contactos.estado
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.$vs.notify({
                            text: `Se registraron los cambios del contacto ${this.contactos.nombre} correctamente.`,
                            title: 'Registro de Cambios exitoso',
                            position: 'top-right',
                            color: 'success'
                        })
                        this.isPeticionRC = false
                        this.sideContactos = false
                        this.cargarContactos()
                    }
                }).catch((error)=>{
                    this.isPeticionRC = false
                    if (error.response.status === 422){
                        this.erroresServidor = error.response.data.errors
                    }
                    if (error.response.status === 500){
                        this.erroresServidor = {err: ['Hubo un error en el servidor al registrar los datos.' +
                            ' Intenta de nuevo si el error persiste comuniquese con servicio técnico.']}
                    }
                })
            },
            cargarContactos(){
                this.isPeticion = true
                this.$axios.get('proveedores_contactos',{
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
            cargarProveedores(){
                this.$axios.get('proveedores',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Proveedores = res.data.proveedores
                    }
                })
            },
            registrarContacto(){
                this.isPeticionRC = true
                this.$axios.post('proveedores_contactos',{
                    nombre:      this.contactos.nombre,
                    proveedor:   this.contactos.proveedor,
                    telefono:    this.contactos.telefono,
                    email:       this.contactos.email,
                    puesto:      this.contactos.puesto,
                    observacion: this.contactos.observacion
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.$vs.notify({
                            text: `Se registró el contacto ${this.contactos.nombre} correctamente.`,
                            title: 'Registro exitoso',
                            position: 'top-right',
                            color: 'success'
                        })
                        this.isPeticionRC = false
                        this.sideContactos = false
                        this.cargarContactos()
                    }
                }).catch((error)=>{
                    this.isPeticionRC = false
                    if (error.response.status === 422){
                        this.erroresServidor = error.response.data.errors
                    }
                    if (error.response.status === 500){
                        this.erroresServidor = {err: ['Hubo un error en el servidor al registrar los datos.' +
                            ' Intenta de nuevo si el error persiste comuniquese con servicio técnico.']}
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
