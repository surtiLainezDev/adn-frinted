<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                <tituloh5 titulo="Bancos"/>
                <div class="row">
                    <div class="col-md-9">
                        <vs-table v-model="selectedCuenta" @selected="irCuenta" :data="Cuentas">
                            <template slot="header">
                                <div class="row">
                                    <div class="col-auto"><h6>Cuentas de Surtidora Laínez</h6></div>
                                </div>
                            </template>
                            <template slot="thead">
                                <vs-th>Banco</vs-th>
                                <vs-th>Tipo</vs-th>
                                <vs-th>Número</vs-th>
                                <vs-th>Total</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                                    <vs-td>{{data[indextr].banco.nombre}}</vs-td>
                                    <vs-td>{{data[indextr].tipo.nombre}}</vs-td>
                                    <vs-td>{{data[indextr].num}}</vs-td>
                                    <vs-td>L {{data[indextr].total}}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div class="col-md-3">
                        <div class="row">
                            <div class="col">
                                <vs-card>
                                    <div slot="header">
                                        <h6>Registrar Banco</h6>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group">
                                            <label>Nombre del Banco</label>
                                            <input v-model="nombreBanco" type="text" class="form-control form-control-sm" @keyup="btnBanco">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col d-flex justify-content-end">
                                            <vs-button color="success" :disabled="isBtnBanco" @click="guardarBanco" type="filled">Registrar Banco</vs-button>
                                        </div>
                                    </div>
                                </vs-card>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <vs-card>
                                    <div slot="header">
                                        <h6>Registrar Cuenta</h6>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group">
                                            <label>Banco</label>
                                            <select :class="{'is-invalid': $v.cuenta.banco.$error}"
                                                    v-model.trim="$v.cuenta.banco.$model" class="form-control form-control-sm">
                                                <option v-for="item in Bancos" :value="item.id">{{item.nombre}}</option>
                                            </select>
                                            <div v-if="$v.cuenta.banco.$error">
                                                <div class="error" v-if="!$v.cuenta.banco.required">Este campo es requerido.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group">
                                            <label>Tipo de Cuenta</label>
                                            <select :class="{'is-invalid': $v.cuenta.tipo.$error}"
                                                    v-model.trim="$v.cuenta.tipo.$model" class="form-control form-control-sm">
                                                <option v-for="item in tiposCuenta" :value="item.id">{{item.nombre}}</option>
                                            </select>
                                            <div v-if="$v.cuenta.tipo.$error">
                                                <div class="error" v-if="!$v.cuenta.tipo.required">Este campo es requerido.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col form-group">
                                            <label>Número de Cuenta</label>
                                            <input  :class="{'is-invalid':$v.cuenta.num.$error}"
                                                    v-model.trim="$v.cuenta.num.$model" type="text" class="form-control form-control-sm">
                                            <div v-if="$v.cuenta.num.$error">
                                                <div class="error" v-if="!$v.cuenta.num.required">Este campo es requerido.</div>
                                                <div class="error" v-if="!$v.cuenta.num.min">Este campo es requiere mínimo 5 carácteres.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col d-flex justify-content-end">
                                            <vs-button color="success" @click="verificarForm" type="filled">Registrar Banco</vs-button>
                                        </div>
                                    </div>
                                    <div class="row" v-if="erroresSer">
                                        <div class="col">
                                            <Errores422 :errores="erroresSer"/>
                                        </div>
                                    </div>
                                </vs-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import { required, minLength} from 'vuelidate/lib/validators'
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import tituloh5 from "../../components/tituloh5";
    import Errores422 from "../../components/Errores422";
    export default {
        name: "bancos",
        components: {Errores422, sideColaboradores, tituloh5},
        data(){
            return{
                Cuentas:     [],
                selectedCuenta: [],
                isPeticion:  false,
                isBtnBanco:  true,
                isBtnCuenta: true,
                tiposCuenta: null,
                Bancos:      null,
                nombreBanco: null,
                cuenta:      {
                    tipo:  null,
                    num:   null,
                    banco: null
                },
                nombreBanco: null,
                erroresSer:  {}
            }
        },
        created() {
            this.cargarCuentas()
            this.tipoCuenta();
            this.cargarBancos();
        },
        validations:{
            cuenta: {
                tipo:  {required},
                num:   {required, min:minLength(5)},
                banco: {required}
            }
        },
        methods:{
            irCuenta(){
                this.$router.replace({path:'/bancos/cuentas/sl/'+this.selectedCuenta.id})
            },
            verificarForm: function () {
                this.erroresSer = {};
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresSer = {err: ['Tienes que cumplir los requerimientos de los campos.']}
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        this.registrarBanco()
                    }, 500)
                }
            },
            registrarBanco(){
                this.isBtnCuenta = true
                this.isPeticion = true
                this.$axios.post('cuentas',{
                    tipo:  this.cuenta.tipo,
                    banco: this.cuenta.banco,
                    num:   this.cuenta.num
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.isPeticion = false
                        this.notificacion(
                            'Registro Exitoso',
                            'La Cuenta '+this.cuenta.num+' se registro exitosamente',
                            'success'
                        );
                        this.cargarCuentas();
                        this.cuenta.tipo = null;
                        this.cuenta.banco =null;
                        this.cuenta.num = null
                    }
                }).catch((error)=>{
                    this.isPeticion = false
                    this.isPeticion = false
                    if (error.response.status === 422){
                        this.erroresSer = error.response.data.errors
                    }
                })
            },
            cargarCuentas(){
                this.isPeticion = true
                this.$axios.get('cuentas', {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticion = false
                        this.Cuentas = res.data.cuentas
                    }
                })
            },
            btnBanco(){
                if (this.nombreBanco.length > 6){
                    this.isBtnBanco = false
                }else if(this.nombreBanco.length < 6){
                    this.isBtnBanco = true
                }
            },
            guardarBanco(){
                this.isPeticion = true
                this.isBtnBanco = true
                this.$axios.post('bancos',{
                    nombre: this.nombreBanco
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticion = false
                        this.isBtnBanco = false
                        this.notificacion(
                            'Registro Exitoso',
                            'El banco '+this.nombreBanco+' se registro exitosamente',
                            'success'
                        );
                        this.nombreBanco = null;
                        this.cargarBancos()
                    }
                })
            },
            cargarBancos(){
                this.isPeticion = true
                this.$axios.get('bancos',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.Bancos = res.data.bancos
                    }
                })
            },
            notificacion(titulo, texto, color){
                this.$vs.notify({
                    title: titulo,
                    text:  texto,
                    color: color,
                    position: 'top-right'
                })
            },
            tipoCuenta(){
                this.isPeticion = true
                this.$axios.get('tipo_cuenta',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status === 200){
                        this.tiposCuenta = res.data.tipos
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
