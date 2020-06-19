<template>
    <vs-card style="padding: 5px">
        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col-auto"><h5>Creando Usuario</h5></div>
                </div>
                <vs-divider></vs-divider>
                <div v-if="$fetchState.pending" class="row">
                    <div class="col">
                        <vs-progress indeterminate color="success"></vs-progress>
                    </div>
                </div>
                <div v-else>
                   <div class="row">
                       <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                       <div class="col-md-6 form-group">
                           <label>Sucursal</label>
                           <select class="form-control form-control-sm" v-model="usuario.sucursal" @change="cargarColaboradores">
                               <option v-for="item in Sucursales" :value="item.id">{{item.nombre}}</option>
                           </select>
                       </div>
                       <div class="col-md-6 form-group">
                           <label>Colaborador</label>
                           <select :class="{'is-invalid': $v.usuario.colaborador.$error}"
                                   class="form-control form-control-sm" v-model.trim="$v.usuario.colaborador.$model">
                               <option v-for="item in colaboradores" :value="item.id">{{item.nombres}} {{item.apellidos}}</option>
                           </select>
                           <div v-if="$v.usuario.colaborador">
                               <div class="error" v-if="!$v.usuario.colaborador.required">{{errores.required}}</div>
                           </div>
                       </div>
                   </div>

                    <div class="row">
                        <div class="col-md-3 form-group">
                            <label>Usuario</label>
                            <input  :class="{'is-invalid': $v.usuario.usuario.$error}"
                                    v-model.trim="$v.usuario.usuario.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.usuario.usuario">
                                <div class="error" v-if="!$v.usuario.usuario.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.usuario.usuario.min">{{errores.min}} 5.</div>
                            </div>
                        </div>
                        <div class="col-md-3 form-group">
                            <label>Correo</label>
                            <input  :class="{'is-invalid': $v.usuario.correo.$error}"
                                    v-model.trim="$v.usuario.correo.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.usuario.correo">
                                <div class="error" v-if="!$v.usuario.correo.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.usuario.correo.email">{{errores.email}}</div>
                            </div>
                        </div>
                        <div class="col-md-3 form-group">
                            <label>Contraseña</label>
                            <input  :class="{'is-invalid': $v.usuario.password.$error}"
                                    v-model.trim="$v.usuario.password.$model"
                                    type="text" class="form-control form-control-sm">
                            <div v-if="$v.usuario.password">
                                <div class="error" v-if="!$v.usuario.password.required">{{errores.required}}</div>
                                <div class="error" v-if="!$v.usuario.password.min">{{errores.min}} 8.</div>
                            </div>
                        </div>
                        <div class="col-md-3 form-group">
                            <label>Tipo Usuario</label>
                            <select :class="{'is-invalid': $v.usuario.tipo.$error}"
                                    class="form-control-sm form-control" v-model.trim="$v.usuario.tipo.$model">
                                <option v-for="item in tipoUsuario" :value="item.id">{{item.nombre}}</option>
                            </select>
                            <div v-if="$v.usuario.tipo">
                                <div class="error" v-if="!$v.usuario.tipo.required">{{errores.required}}</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col d-flex justify-content-end">
                            <vs-button color="success" :disabled="isPeticion" @click="verificarForm" type="filled">Registrar Usuario</vs-button>
                        </div>
                    </div>

                    <div class="row" v-if="erroresServidor">
                        <div class="col">
                            <errores-servidor :errores="erroresServidor"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideSmall from "../../components/menus/sideSmall";
    import ErroresServidor from "../../components/ErroresServidor";
    import {email, maxLength, minLength, numeric, required} from "vuelidate/lib/validators";
    export default {
        name: "nuevo",
        data(){
            return{
                errores:{
                    required: 'Este campo es requerido.',
                    min: 'Este campo lo mínimo de carácteres que acepta son ',
                    max: 'Este campo lo máximo de carácteres que acepta son ',
                    email: 'Este campo tiene que ser un correo valido.',
                },
                erroresServidor: [],
                usuario:         {
                    sucursal: null,
                    colaborador: null,
                    tipo: null,
                    usuario: null,
                    correo: null,
                    password: null,
                },
                Sucursales:      null,
                isPeticion:      false,
                colaboradores:   null,
                tipoUsuario:     null
            }
        },
        validations:{
            usuario:{
                usuario:     {required, min:minLength(5), max:maxLength(25)},
                colaborador: {required, },
                tipo:        {required},
                correo:      {required, email},
                password:    {required, min:minLength(8)},
            }
        },
        components:{
            sideSmall,
            ErroresServidor
        },
        methods:{
            verificarForm: function () {
                this.erroresServidor = [];
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = ['Tienes que llenar todos los campos.']
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        this.registrarUsuario()
                    }, 500)
                }
            },
            cargarColaboradores:function () {
                this.isPeticion = true
                this.$axios.get('/colaboradores_suc/'+this.usuario.sucursal,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.colaboradores = res.data.col
                    }
                })
            },

            registrarUsuario:function () {
                this.isPeticion = true
                this.$axios.post('/usuarios',{
                    usuario: this.usuario.usuario,
                    colaborador_id: this.usuario.colaborador,
                    email: this.usuario.correo,
                    password: this.usuario.password,
                    tipo_usuario_id: this.usuario.tipo,
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        let id = res.data.id;
                        this.$vs.notify({
                            title: 'Registro Exitoso',
                            text: `Se registro exitosamente el usuario ${this.usuario.usuario}.`,
                            position: 'top-right',
                            color: 'success'
                        })
                        this.$router.replace({path:"/usuarios/"+id})
                    }
                }).catch((error)=>{
                    this.isPeticion = false
                    if (error.response.status === 422){
                        for (let item in error.response.data.errors){
                            for (let index in error.response.data.errors[item]){
                                this.erroresServidor.push(error.response.data.errors[item][index])
                            }
                        }
                    }
                    if (error.response.status  === 400){
                        let error = ['Hubo un problema con el servidor al ingresa los datos, intente nuevamente. Si el error ' +
                            'persiste contacte al servicio técnico.']
                        this.erroresServidor.push(error[0])
                    }

                })
            }
        },
        async fetch (){
            this.isPeticion = true
            this.Sucursales =(await this.$axios.get('/sucursales', {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token
                }
            })).data.suc
            this.tipoUsuario = (await this.$axios.get('/tipos_usuarios',{
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token
                }
            })).data.tipos
            this.isPeticion = false
        }
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
