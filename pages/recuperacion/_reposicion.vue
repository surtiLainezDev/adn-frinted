<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-center">
            <div class="row" style="width: 40%">
                <div class="col">
                    <br>
                    <br>
                    <br>
                    <vs-card>
                        <div class="row" v-if="isPeticion">
                            <div class="col">
                                <vs-progress indeterminate color="success"></vs-progress>
                            </div>
                        </div>
                        <div slot="header"><h4>Cambio de contraseña</h4></div>
                        <div class="row">
                            <div class="col-md-5 text-center"><strong>{{datos.usuario}}</strong></div>
                            <div class="col-md-7 text-center"><strong>{{datos.nombres}}</strong></div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="row">
                            <div class="col-md-4">
                                <label>Escribir Contraseña</label>
                            </div>
                            <div class="col-md-8">
                                <input  :class="{'is-invalid': $v.password.$error}"
                                        v-model.trim="$v.password.$model"
                                        type="password" class="form-control form-control-sm">
                                <div v-if="$v.password.$error">
                                    <div class="error" v-if="!$v.password.required">La contraseña es requerida</div>
                                    <div class="error" v-if="!$v.password.min">La contraseña no debe ser menor que
                                        {{ $v.password.$params.min }} carácteres.</div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="margin-top: 10px">
                            <div class="col-md-4">
                                <label>Repetir Contraseña</label>
                            </div>
                            <div class="col-md-8">
                                <input  :class="{'is-invalid': $v.repeatPassword.$error}"
                                        v-model.trim="$v.repeatPassword.$model"
                                        type="password" class="form-control form-control-sm">
                                <div class="error" v-if="!$v.repeatPassword.sameAsPassword">Las contraseñas deben coincidir.</div>
                            </div>
                        </div>
                        <div class="row" style="margin-top: 15px">
                            <div class="col d-flex justify-content-end">
                                <vs-button @click="verificarForm" :disabled="isPeticion"
                                           color="success" type="filled">Cambiar Contraseña</vs-button>
                            </div>
                        </div>
                        <br>
                        <div class="row" v-if="erroresServidor">
                            <div class="col">
                                <ErroresServidor :errores="erroresServidor" />
                            </div>
                        </div>
                    </vs-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { required, minLength, sameAs} from 'vuelidate/lib/validators'
    import ErroresServidor from "../../components/ErroresServidor";
    export default {
        name: "reposicion",
        components:{
            ErroresServidor
        },
        data(){
            return{
                password: null,
                repeatPassword: null,
                isPeticion:false,
                erroresServidor: []
            }
        },
        validations: {
            password: {
                required,
                min: minLength(8)
            },
            repeatPassword: {
                sameAsPassword: sameAs('password')
            }
        },
        methods:{
            verificarForm: function () {
                this.isPeticion = true
                this.erroresServidor = []
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.isPeticion = false
                    this.erroresServidor = ['Tienes que llenar todos los campos.']
                } else {
                    setTimeout(() => {
                        this.registrarPasswords()
                    }, 500)
                }
            },
            registrarPasswords(){
                this.isPeticion = true
                this.$axios.post('/cambio_password',{
                    usuario:        this.datos.usuario,
                    password:       this.password,
                    repeatPassword: this.repeatPassword
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.$vs.notify({
                            title: 'Cambio de contraseña exitoso',
                            text: `${this.datos.usuario}, su cambio de contraseña se realizó exitosamente.`,
                            position: 'top-right',
                            color: 'success'
                        })
                        this.$router.replace({path:'/'})
                    }
                }).catch((error)=>{
                    this.isPeticion = false
                    this.erroresServidor.push(error.response.data)
                })
            },
        },
        asyncData({ store, $axios, route}){
            return $axios.get('/reponer/'+route.params.reposicion,{
                headers:{
                    'Authorization': `Bearer ${store.state.token}`
                },
            }).then( res =>{
                return {
                    datos: res.data
                }
            })
        }
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
