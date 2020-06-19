<template>
    <vs-card style="padding: 5px">
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <div v-if="isPeticionPrincipal">
                    <div class="row">
                        <div class="col-auto"><h4>{{datosColaborador.nombres}} {{datosColaborador.apellidos}}</h4></div>
                        <div class="col" v-if="tipoUser == 2 || tipoUser == 1">
                            <vs-button radius color="warning" type="flat" @click="popupActivo = true" icon="create"></vs-button>
                            <!--                            <vs-button radius color="success" type="flat" @click="popupPermisos = true" icon="lock_open"></vs-button>-->
                        </div>
                    </div>
                    <vs-divider></vs-divider>

                    <div class="row">
                        <div class="col">
                            <h5><strong>Información General del Colaborador</strong></h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-auto" v-for="(i, index,item) in infoCol">
                            <radiusficha :texto="infoCol[index]" :tipo="index"
                                         :icono="iconos[item]" color="#30B26e"/>
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="row">
                        <div class="col-md-4">
                            <vs-card>
                                <vs-list>
                                    <vs-list-header icon="perm_identity" title="Datos del Usuario"></vs-list-header>
                                    <vs-list-item v-if="isUsuario === 0"  icon="perm_identity" title="Sin Usuario"
                                                  subtitle="Este colaborador no tiene usuario">
                                        <vs-button size="small" color="warning" @click="redirecUser(0)">Crear usuario</vs-button>
                                    </vs-list-item>
                                    <div v-else>
                                        <vs-list-item icon="perm_identity" title="Usuario"
                                                      :subtitle="datosColaborador.users[0].usuario">
                                            <vs-button size="small" color="warning" @click="redirecUser(1)">Visitar</vs-button>
                                        </vs-list-item>
                                        <vs-list-item icon="mail_outline" title="Correo del usuario"
                                                      :subtitle="datosColaborador.users[0].email"></vs-list-item>
                                        <vs-list-item v-if="datosColaborador.users[0].estado === 1"
                                                      icon="perm_identity" title="Usuario"
                                                      subtitle="Activo"></vs-list-item>
                                        <vs-list-item v-if="datosColaborador.users[0].estado === 0"
                                                      icon="perm_identity" title="Inactivo"
                                                      subtitle="Activo"></vs-list-item>
                                    </div>
                                </vs-list>
                            </vs-card>
                        </div>
                        <div class="col-md-8">
                            <vs-card>
                                <vs-table :data="datosColaborador.contratos"  max-items="5" pagination>
                                    <template slot="header">
                                        <h6>Contratos de {{datosColaborador.nombres}} {{datosColaborador.apellidos}}</h6>
                                    </template>
                                    <template slot="thead">
                                        <vs-th>Fecha de Inicio</vs-th>
                                        <vs-th>Fecha de Finalización</vs-th>
                                        <vs-th>Pago</vs-th>
                                        <vs-th>Estado</vs-th>
                                    </template>
                                    <template slot-scope="{data}">
                                        <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data" >
                                            <vs-td >{{datosColaborador.contratos[indextr].fecha_inicio}}</vs-td>
                                            <vs-td >{{datosColaborador.contratos[indextr].fecha_final}}</vs-td>
                                            <vs-td >L {{datosColaborador.contratos[indextr].pago}}</vs-td>
                                            <vs-td >
                                                <vs-chip v-if="datosColaborador.contratos[indextr].estado === 1" color="success">Activo</vs-chip>
                                                <vs-chip v-if="datosColaborador.contratos[indextr].estado === 0" color="danger">Inactivo</vs-chip>
                                            </vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>
                            </vs-card>
                        </div>
                    </div>
                    <vs-popup   :title="'editando al colaborador '+datosColaborador.nombres+' '+datosColaborador.apellidos" :active.sync="popupActivo">
                        <div class="bodyPopup">
                            <div class="row">
                                <div class="col">
                                    <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Nombres:</label></div>
                                <div class="col-md-8">
                                    <input  :class="{'is-invalid': $v.editColaborador.nombres.$error}"
                                            v-model.trim="editColaborador.nombres"
                                            type="text" class="form-control-sm form-control">
                                    <div v-if="$v.editColaborador.nombres.$error">
                                        <div class="error" v-if="!$v.editColaborador.nombres.required">{{errores.required}}</div>
                                        <div class="error" v-if="!$v.editColaborador.nombres.min">{{errores.min}}3.</div>
                                        <div class="error" v-if="!$v.editColaborador.nombres.max">{{errores.max}}50.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Apellidos</label></div>
                                <div class="col-md-8">
                                    <input  :class="{'is-invalid': $v.editColaborador.apellidos.$error}"
                                            v-model.trim="editColaborador.apellidos"
                                            type="text" class="form-control-sm form-control">
                                    <div v-if="$v.editColaborador.apellidos.$error">
                                        <div class="error" v-if="!$v.editColaborador.apellidos.required">{{errores.required}}</div>
                                        <div class="error" v-if="!$v.editColaborador.apellidos.min">{{errores.min}}3</div>
                                        <div class="error" v-if="!$v.editColaborador.apellidos.max">{{errores.max}}50</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Identidad:</label></div>
                                <div class="col-md-8">
                                    <input  :class="{'is-invalid': $v.editColaborador.identidad.$error}"
                                            v-model.trim="editColaborador.identidad"
                                            type="text" class="form-control-sm form-control">
                                    <div v-if="$v.editColaborador.identidad.$error">
                                        <div class="error" v-if="!$v.editColaborador.identidad.required">{{errores.required}}</div>
                                        <div class="error" v-if="!$v.editColaborador.identidad.numeric">{{errores.numeric}}</div>
                                        <div class="error" v-if="!$v.editColaborador.identidad.min">{{errores.min}}13.</div>
                                        <div class="error" v-if="!$v.editColaborador.identidad.max">{{errores.max}}13.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Correo:</label></div>
                                <div class="col-md-8">
                                    <input  :class="{'is-invalid': $v.editColaborador.correo.$error}"
                                            v-model.trim="editColaborador.correo"
                                            type="text" class="form-control-sm form-control">
                                    <div v-if="$v.editColaborador.correo.$error">
                                        <div class="error" v-if="!$v.editColaborador.correo.required">{{errores.required}}</div>
                                        <div class="error" v-if="!$v.editColaborador.correo.numeric">{{errores.email}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Telefono:</label></div>
                                <div class="col-md-8">
                                    <input  :class="{'is-invalid': $v.editColaborador.telefono.$error}"
                                            v-model.trim="editColaborador.telefono"
                                            type="text" class="form-control-sm form-control">
                                    <div v-if="$v.editColaborador.telefono.$error">
                                        <div class="error" v-if="!$v.editColaborador.telefono.required">{{errores.required}}</div>
                                        <div class="error" v-if="!$v.editColaborador.telefono.numeric">{{errores.numeric}}</div>
                                        <div class="error" v-if="!$v.editColaborador.telefono.min">{{errores.min}}8.</div>
                                        <div class="error" v-if="!$v.editColaborador.telefono.max">{{errores.max}}8.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Sucursal Asignada:</label></div>
                                <div class="col-md-8">
                                    <select :class="{'is-invalid': $v.editColaborador.sucursal.$error}"
                                            v-model.trim="editColaborador.sucursal"
                                            class="form-control form-control-sm">
                                        <option v-for="item in sucursales" :value="item.id">{{item.nombre}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Puesto Asignado:</label></div>
                                <div class="col-md-8">
                                    <select :class="{'is-invalid': $v.editColaborador.puesto.$error}"
                                            v-model.trim="editColaborador.puesto"
                                            class="form-control form-control-sm">
                                        <option v-for="item in puestos" :value="item.id">{{item.nombre}}</option>
                                    </select>
                                    <div v-if="$v.editColaborador.puesto.$error">
                                        <div class="error" v-if="!$v.editColaborador.puesto.required">{{errores.required}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4"><label>Estado:</label></div>
                                <div class="col-md-8">
                                    <vs-switch color="success" @click="editColaborador.estado = !editColaborador.estado"
                                               v-model="editColaborador.estado"/>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col d-flex justify-content-end">
                                    <vs-button color="success" @click="verificarForm" :disabled="isPeticion"
                                               size="small" type="filled">Registrar Cambios</vs-button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <errores-servidor v-if="erroresServidor" :errores="erroresServidor"/>
                                </div>
                            </div>
                        </div>
                    </vs-popup>
                    <vs-prompt :active.sync="activePrompt"
                               title="Registro Exitoso"
                               color="success"
                               button-cancel
                               @accept="cargarColaboradores"
                               accept-text = "Aceptar"
                               @close="cargarColaboradores">
                        <p>{{mensaje}}</p>
                    </vs-prompt>
                </div>

            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import radiusficha from "../../components/radiusficha";
    import { required, minLength, numeric , maxLength, email} from 'vuelidate/lib/validators'
    import ErroresServidor from "../../components/ErroresServidor";
    export default {
        name: "show",
        components:{
            sideColaboradores,
            radiusficha,
            ErroresServidor
        },
        data(){
            return{
                isUsuario:        0,
                mensaje:          null,
                activePrompt:     false,
                errores:{
                    required: 'Este campo es requerido.',
                    min: 'Este campo lo mínimo de carácteres que acepta son ',
                    max: 'Este campo lo máximo de carácteres que acepta son ',
                    email: 'Este campo tiene que ser un correo valido.',
                    numeric: 'Este campo solo acepta datos númericos.'
                },
                isPeticion:       false,
                isPeticionPrincipal: false,
                erroresServidor:  [],
                sucursales:       null,
                puestos:          null,
                editColaborador:{
                    nombres:   null,
                    apellidos: null,
                    identidad: null,
                    correo:    null,
                    telefono:  null,
                    sucursal:  null,
                    puesto:    null,
                    estado:    null,
                    id:        null
                },
                popupActivo:      false,
                isPeticion:       false,
                datosColaborador: null,
                infoCol: {
                    identidad: null,
                    puesto:    null,
                    sucursal:  null,
                    correo:    null,
                    telefono:  null,
                    estado:    null,
                },
                iconos: ['person_outline','build','location_on','mail_outline','phone', 'perm_identity']
            }
        },
        computed:{
            tipoUser: function () {
                return this.$store.state.tipoUsuario
            }
        },
        validations:{
            editColaborador:{
                puesto:    {required},
                sucursal:  {required},
                nombres:   {required, min:minLength(3), max:maxLength(50)},
                apellidos: {required, min:minLength(3), max:maxLength(50)},
                telefono:  {required, min:minLength(8), max:maxLength(8), numeric},
                identidad: {required, min:minLength(13), max:maxLength(13), numeric},
                correo:    {required, email}
            }
        },
        created() {
            this.cargarColaboradores()
            this.cargarPuestosColaborador();
            this.cargarSucursales();
        },
        methods:{
            redirecUser(val){
                if (val === 0){
                    this.$router.replace({path:'/usuarios/nuevo'})
                }else if (val === 1){
                    this.$router.replace({path:'/usuarios/'+this.datosColaborador.users[0].id})
                }
            },
            verificarForm: function () {
                this.erroresServidor = [];
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = ['Tienes que llenar todos los campos.']
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        this.cambiosColaborador()
                    }, 500)
                }
            },
            cambiosColaborador: function(){
                this.isPeticion = true
                this.$axios.put('/colaboradores/'+this.editColaborador.id,{
                    nombres:   this.editColaborador.nombres,
                    apellidos: this.editColaborador.apellidos,
                    email:     this.editColaborador.correo,
                    telefono:  this.editColaborador.telefono,
                    identidad: this.editColaborador.identidad,
                    estado:    this.editColaborador.estado,
                    puesto:    this.editColaborador.puesto,
                    sucursal:  this.editColaborador.sucursal
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.mensaje = `Los cambios al colaborador ${this.editColaborador.nombres} ${this.editColaborador.apellidos}
                      fueron registrados exitosamente.`;
                        this.activePrompt = true
                    }
                }).catch((error)=>{
                    this.isPeticion = false
                    for (let item in error.response.data.error){
                        for (let index in error.response.data.error[item]){
                            this.erroresServidor.push(error.response.data.error[item][index])
                        }
                    }
                })
            },
            infoColaborador:function () {
                let estado
                let estadoBoolean
                for (let item in this.infoCol){
                    this.infoCol.identidad = this.datosColaborador.identidad;
                    this.infoCol.puesto    = this.datosColaborador.puesto_colaborador.nombre;
                    this.infoCol.sucursal  = this.datosColaborador.sucursal.nombre;
                    this.infoCol.correo    = this.datosColaborador.email;
                    this.infoCol.telefono  = this.datosColaborador.telefono;
                    if (this.datosColaborador.estado === 1){
                        estado = 'Activo'
                        estadoBoolean = true
                    }else if (this.datosColaborador.estado === 0){
                        estado = 'Inactivo'
                        estadoBoolean = false
                    }
                    this.infoCol.estado    = estado
                }
                this.editColaborador.id        = this.datosColaborador.id
                this.editColaborador.nombres   = this.datosColaborador.nombres
                this.editColaborador.apellidos = this.datosColaborador.apellidos
                this.editColaborador.identidad = this.datosColaborador.identidad
                this.editColaborador.telefono  = this.datosColaborador.telefono
                this.editColaborador.correo    = this.datosColaborador.email
                this.editColaborador.estado    = estadoBoolean
                this.editColaborador.sucursal  = this.datosColaborador.sucursal_id
                this.editColaborador.puesto    = this.datosColaborador.puesto_colaborador_id
            },
            cargarSucursales: function () {
                this.$axios.get('/sucursales',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.sucursales = res.data.suc;
                })
            },
            cargarPuestosColaborador: function () {
                this.$axios.get('/puestos_colaborador',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.puestos = res.data.puestos;
                })
            },
            cargarColaboradores(){
                this.popupActivo = false
                this.$axios.get('/colaboradores/'+this.$route.params.show,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isUsuario = res.data.isUser;
                        this.datosColaborador = res.data.col;
                        this.isPeticion = false
                        this.isPeticionPrincipal = true
                        this.infoColaborador()
                    }
                })
            }
        },
    }
</script>
<style scoped lang="stylus">
    .bodyficha
        font-size 20px
    .bodyPopup
        padding 5px
    .bodyPopup .row
        margin-top 5px
    .error
        color red
</style>
