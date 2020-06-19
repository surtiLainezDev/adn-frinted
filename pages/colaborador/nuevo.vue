<template>
    <vs-card style="padding: 5px">
        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col-auto"><h5>Creando Colaborador</h5></div>
                    <div class="col">
                        <vs-progress v-if="isPeticion || isPeticionPuestos" indeterminate color="success"></vs-progress>
                    </div>
                    <div class="col-auto">
                        <vs-button color="warning" @click="popupActivo = true" type="flat">Agregar puestos de trabajo</vs-button>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col-md-1"></div>
                    <div class="col-md-10">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="row">
                                    <div class="col-md-6 form-group">
                                        <label>Nombres:</label>
                                        <input  v-model.trim="$v.colaborador.nombres.$model"
                                                :class="{ 'is-invalid': $v.colaborador.nombres.$error}"
                                                type="text" class="form-control-sm form-control">
                                        <div v-if="$v.colaborador.nombres.$error">
                                            <div class="error" v-if="!$v.colaborador.nombres.required">{{errores.required}}</div>
                                            <div class="error" v-if="!$v.colaborador.nombres.min">{{errores.min}}3.</div>
                                            <div class="error" v-if="!$v.colaborador.nombres.max">{{errores.max}}50.</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label>Apellidos:</label>
                                        <input  :class="{'is-invalid': $v.colaborador.apellidos.$error}"
                                                v-model.trim="$v.colaborador.apellidos.$model"
                                                type="text" class="form-control-sm form-control">
                                        <div v-if="$v.colaborador.apellidos.$error">
                                            <div class="error" v-if="!$v.colaborador.apellidos.required">{{errores.required}}</div>
                                            <div class="error" v-if="!$v.colaborador.apellidos.min">{{errores.min}}3</div>
                                            <div class="error" v-if="!$v.colaborador.apellidos.max">{{errores.max}}50</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4 form-group">
                                        <label>Correo:</label>
                                        <input
                                                :class="{'is-invalid': $v.colaborador.correo.$error}"
                                                v-model.trim="$v.colaborador.correo.$model"
                                                type="text" class="form-control-sm form-control">
                                        <div v-if="$v.colaborador.correo.$error">
                                            <div class="error" v-if="!$v.colaborador.correo.required">{{errores.required}}</div>
                                            <div class="error" v-if="!$v.colaborador.correo.numeric">{{errores.email}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 form-group">
                                        <label>Telefono:</label>
                                        <input  :class="{'is-invalid': $v.colaborador.telefono.$error}"
                                                v-model.trim="$v.colaborador.telefono.$model"
                                                type="text" class="form-control-sm form-control">
                                        <div v-if="$v.colaborador.telefono.$error">
                                            <div class="error" v-if="!$v.colaborador.telefono.required">{{errores.required}}</div>
                                            <div class="error" v-if="!$v.colaborador.telefono.numeric">{{errores.numeric}}</div>
                                            <div class="error" v-if="!$v.colaborador.telefono.min">{{errores.min}}8.</div>
                                            <div class="error" v-if="!$v.colaborador.telefono.max">{{errores.max}}8.</div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 form-group">
                                        <label>Identidad:</label>
                                        <input  :class="{'is-invalid': $v.colaborador.identidad.$error}"
                                                v-model.trim="$v.colaborador.identidad.$model"
                                                type="text" class="form-control-sm form-control">
                                        <div v-if="$v.colaborador.identidad.$error">
                                            <div class="error" v-if="!$v.colaborador.identidad.required">{{errores.required}}</div>
                                            <div class="error" v-if="!$v.colaborador.identidad.numeric">{{errores.numeric}}</div>
                                            <div class="error" v-if="!$v.colaborador.identidad.min">{{errores.min}}13.</div>
                                            <div class="error" v-if="!$v.colaborador.identidad.max">{{errores.max}}13.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 form-group">
                                        <label>Puesto Colaborador:</label>
                                        <select :class="{'is-invalid': $v.colaborador.puesto.$error}"
                                                class="form-control form-control-sm" v-model.trim="$v.colaborador.puesto.$model">
                                            <option v-for="item in puestos" :value="item.id">{{item.nombre}}</option>
                                        </select>
                                        <div v-if="$v.colaborador.puesto.$error">
                                            <div class="error" v-if="!$v.colaborador.puesto.required">{{errores.required}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label>Sucursal Asignada:</label>
                                        <select :class="{'is-invalid': $v.colaborador.sucursal.$error}"
                                                class="form-control form-control-sm" v-model.trim="$v.colaborador.sucursal.$model">
                                            <option v-for="item in sucursales" :value="item.id">{{item.nombre}}</option>
                                        </select>
                                        <div v-if="$v.colaborador.sucursal.$error">
                                            <div class="error" v-if="!$v.colaborador.sucursal.required">{{errores.required}}</div>
                                        </div>
                                    </div>
                                </div>
                                <br>
                                <strong>Cuenta de Banco</strong>
                                <div class="row">
                                    <div class="col form-group">
                                        <label>Seleccione un banco</label>
                                        <select :class="{'is-invalid': $v.colaborador.banco.$error}"
                                                v-model.trim="$v.colaborador.banco.$model" class="form-control-sm form-control">
                                            <option v-for="item in Bancos" :value="item.id">{{item.nombre}}</option>
                                        </select>
                                        <div v-if="$v.colaborador.banco.$error">
                                            <div class="error" v-if="!$v.colaborador.banco.required">{{errores.required}}</div>
                                        </div>
                                    </div>
                                    <div class="col form-group">
                                        <label>Número de cuenta</label>
                                        <input type="text" class="form-control form-control-sm"
                                               :class="{'is-invalid': $v.colaborador.numBanco.$error}"
                                               v-model.trim="$v.colaborador.numBanco.$model">
                                        <div v-if="$v.colaborador.numBanco.$error">
                                            <div class="error" v-if="!$v.colaborador.numBanco.required">{{errores.required}}</div>
                                            <div class="error" v-if="!$v.colaborador.numBanco.numeric">{{errores.numeric}}</div>
                                            <div class="error" v-if="!$v.colaborador.numBanco.min">{{errores.min}}7.</div>
                                            <div class="error" v-if="!$v.colaborador.numBanco.max">{{errores.max}}25.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row">
                                    <div class="col d-flex justify-content-center">
                                        <vs-upload id="logoFotoPerfil" color="success" @change="fotoPerfil"
                                                   limit="1" :show-upload="false" accept="image/*"
                                                   text="Foto de Perfil del Colaborador"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="row">
                            <div class="col form-group d-flex justify-content-end">
                                <vs-button color="success" @click="verificarForm" :disabled="isPeticion"   type="filled">Registrar Colaborador</vs-button>
                            </div>
                        </div>
                        <div v-if="erroresServidor">
                            <errores422 :errores="erroresServidor"/>
                        </div>
                    </div>
                    <div class="col-md-1"></div>
                </div>
            </div>
        </div>
        <vs-popup title="Agregando puestos de trabajos" :active.sync="popupActivo">
            <div style="padding: 5px">
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre</label>
                        <input type="text" placeholder="Nombre del puesto de trabajo"
                               class="form-control form-control-sm" v-model="nombrePuesto">
                    </div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button color="success" @click="agregarPuesto" type="filled">Agregar puesto</vs-button>
                    </div>
                </div>
            </div>
        </vs-popup>
    </vs-card>


</template>

<script>
    import { required, minLength, numeric , maxLength, email} from 'vuelidate/lib/validators'
    import sideSmall from "../../components/menus/sideSmall";
    import ErroresServidor from "../../components/ErroresServidor";
    import Errores422 from "../../components/Errores422";
    export default {
        name: "nuevo",
        components:{
            sideSmall,
            ErroresServidor, Errores422
        },
        data(){
            return{
                errores:{
                    required: 'Este campo es requerido.',
                    min: 'Este campo lo mínimo de carácteres que acepta son ',
                    max: 'Este campo lo máximo de carácteres que acepta son ',
                    email: 'Este campo tiene que ser un correo valido.',
                    numeric: 'Este campo solo acepta datos númericos.'
                },
                popupActivo:       false,
                puestos:           null,
                sucursales:        null,
                colaborador:       {
                    puesto:    null,
                    sucursal:  null,
                    nombres:   null,
                    apellidos: null,
                    correo:    null,
                    telefono:  null,
                    identidad: null,
                    banco:     null,
                    numBanco:  null
                },
                Bancos:        null,
                isPeticion:        false,
                isPeticionPuestos: false,
                nombrePuesto:      null,
                resPuesto:         [],
                erroresServidor:   {},
                foto: null
            }
        },
        validations:{
            colaborador:{
                puesto:    {required},
                sucursal:  {required},
                nombres:   {required, min:minLength(3), max:maxLength(50)},
                apellidos: {required, min:minLength(3), max:maxLength(50)},
                telefono:  {required, min:minLength(8), max:maxLength(8), numeric},
                identidad: {required, min:minLength(13), max:maxLength(13), numeric},
                correo:    {required, email},
                banco:     {required},
                numBanco:  {required, min:minLength(7), max:maxLength(25), numeric}
            }
        },
        methods:{
            fotoPerfil(){
                this.foto = document.getElementById("logoFotoPerfil").files[0];
            },
            verificarForm: function () {
                this.erroresServidor = {};
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = {}
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        this.registrarColaborador()
                    }, 500)
                }
            },
            registrarColaborador: function(){
                this.isPeticion = true
                let data = new FormData();
                data.append('nombres', this.colaborador.nombres);
                data.append('apellidos', this.colaborador.apellidos);
                data.append('identidad', this.colaborador.identidad);
                data.append('email', this.colaborador.correo);
                data.append('sucursal', this.colaborador.sucursal);
                data.append('puesto', this.colaborador.puesto);
                data.append('telefono', this.colaborador.telefono);
                data.append('banco', this.colaborador.banco);
                data.append('numBanco', this.colaborador.numBanco);
                data.append('foto', this.foto);
                this.$axios({
                    method: 'post',
                    url: '/colaboradores',
                    data:data,
                    headers:{
                        'Authorization': 'Bearer ' + this.$store.state.token,
                        'Content-Type': "multipart/form-data"
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.notificacion(
                            'Registro Exitoso',
                            `El colaborador ${this.colaborador.nombres} ${this.colaborador.apellidos} se ha creado exitosamente`,
                            'success'
                        )
                        this.$router.replace({path:"/colaborador/"})
                    }
                }).catch( (error)=> {
                    this.isPeticion = false
                    if (error.response.status === 422){
                        this.erroresServidor = error.response.data.errors
                    }else if (error.response.status === 400){
                        this.$vs.notify({
                            text: error.response.data.errors,
                            title: 'Error',
                            position: 'top-right',
                            color: 'danger'
                        })
                    }

                })
            },
            agregarPuesto: function () {
                this.$axios.post('/puesto_colaborador',{
                    nombre: this.nombrePuesto
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.data.status){
                        this.notificacion(
                            'Registro Exitoso',
                            'El puesto de trabajo '+this.nombrePuesto+' se ha registrado correctamente.',
                            'success')
                        this.popupActivo= false
                    }
                    this.cargarPuesto()
                })
            },
            notificacion: function (titulo, texto, color) {
                this.$vs.notify({
                    title: titulo,
                    text: texto,
                    color: color,
                    position: 'top-right'
                })
            },
            cargarPuesto: function () {
                this.isPeticionPuestos = true
                this.$axios.get('/puestos_colaborador',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.puestos = res.data.puestos
                    this.isPeticionPuestos = false
                })
            },
            cargarSucursales(){
                this.isPeticion = true
                this.$axios.get('/sucursales',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticion = false
                        this.sucursales = res.data.suc
                    }
                })
            },
            cargarBancos(){
                this.$axios.get('bancos',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Bancos = res.data.bancos
                    }
                })
            }
        },
        created() {
            this.cargarSucursales()
            this.cargarBancos()
            this.cargarPuesto()
        },
    }
</script>

<style scoped lang="stylus">
    .error
        color red
</style>
