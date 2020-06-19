<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col">
                        <vs-table v-model="selectedTable" max-tems="10" @selected="redirectColaborador"
                                  pagination search :data="datosContratos">
                            <template slot="header">
                                <div class="row">
                                    <div class="col-auto">
                                        <h4>Contratos</h4>
                                    </div>
                                    <div class="col">
                                        <vs-button radius color="success" @click="popupContratos = true"
                                                   type="flat" icon="add"></vs-button>
                                    </div>
                                </div>
                            </template>
                            <template slot="thead">
                                <vs-th>Colaborador</vs-th>
                                <vs-th>Fecha de Inicio</vs-th>
                                <vs-th>Fecha de Finalización</vs-th>
                                <vs-th>Pago</vs-th>
                                <vs-th>Estado</vs-th>
                                <vs-th>Obrevación</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].nombres">{{data[indextr].nombres}} {{data[indextr].apellidos}}</vs-td>
                                    <vs-td :data="data[indextr].fecha_inicio">{{data[indextr].fecha_inicio}}</vs-td>
                                    <vs-td :data="data[indextr].fecha_final">{{data[indextr].fecha_final}}</vs-td>
                                    <vs-td :data="data[indextr].pago">L {{data[indextr].pago}}</vs-td>
                                    <vs-td :data="data[indextr].estado">
                                        <vs-chip v-if="data[indextr].estado === 1" color="success">Vigente</vs-chip>
                                        <vs-chip v-if="data[indextr].estado === 0" color="danger">Vencido</vs-chip>
                                    </vs-td>
                                    <vs-td >{{data[indextr].observacion}}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>

                <vs-popup title="Creando Contrato" :active.sync="popupContratos">
                    <div style="padding: 5px">
                        <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                        <div class="row">
                            <div class="col-md-6 form-group">
                                <label >Sucursal</label>
                                <select class="form-control form-control-sm"
                                        v-model="contratos.sucursal" @change="cargarColaborador">
                                    <option v-for="item in sucursales" :value="item.id">{{item.nombre}}</option>
                                </select>
                            </div>
                            <div class="col-md-6 form-group">
                                <label >Empleado</label>
                                <select :class="{'is-invalid': $v.contratos.empleado.$error}"
                                        v-model.trim="$v.contratos.empleado.$model"
                                        class="form-control form-control-sm">
                                    <option v-for="item in colaboradores" :value="item.id">
                                        {{item.nombres}} {{item.apellidos}}
                                    </option>
                                </select>
                                <div v-if="$v.contratos.empleado.$error">
                                    <div class="error" v-if="!$v.contratos.empleado.requied">{{errores.required}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 form-group">
                                <label>Fecha Inicio</label>
                                <b-form-datepicker  v-model.trim="$v.contratos.fecha_inicio.$model"
                                                    class="form-control form-control-sm"></b-form-datepicker>
                                <div v-if="$v.contratos.fecha_inicio.$error">
                                    <div class="error" v-if="!$v.contratos.fecha_inicio.requied">{{errores.required}}</div>
                                </div>
                            </div>
                            <div class="col-md-6 form-group">
                                <label >Fecha Finalización</label>
                                <b-form-datepicker v-model.trim="$v.contratos.fecha_final.$model"
                                                   class="form-control form-control-sm"></b-form-datepicker>
                                <div v-if="$v.contratos.fecha_final.$error">
                                    <div class="error" v-if="!$v.contratos.fecha_final.requied">{{errores.required}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 form-group">
                                <label>Pago</label>
                                <input :class="{'is-invalid': $v.contratos.pago.$error}"
                                       v-model.trim="$v.contratos.pago.$model"
                                       type="text" class="form-control form-control-sm">
                                <div v-if="$v.contratos.pago.$error">
                                    <div class="error" v-if="!$v.contratos.pago.requied">{{errores.required}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col form-group">
                                <label>Observación</label>
                                <input v-model="contratos.observacion"
                                       type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col d-flex justify-content-end">
                                <vs-button type="filled" @click="verificarForm" :disabled="isPeticion" color="success">
                                    Registrar contrato
                                </vs-button>
                            </div>
                        </div>
                        <div class="row" v-if="erroresServidor">
                            <div class="col">
                                <errores-servidor :errores="erroresServidor"/>
                            </div>
                        </div>
                    </div>
                </vs-popup>
                <vs-prompt
                        cancel-text
                        @accept="cargarContratos"
                        @close="cargarContratos"
                        title="Contrato Registrado"
                        color="success"
                        accept-text="Aceptar"
                        :active.sync="promptContrato">
                    <div>
                        <p>Se ha registrado el contrato exitosamente.</p>
                    </div>
                </vs-prompt>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../components/menus/sideColaboradores";
    import ErroresServidor from "../../components/ErroresServidor";
    import {required} from 'vuelidate/lib/validators'
    export default {
        name: "contratos",
        components:{sideColaboradores, ErroresServidor},
        data(){
            return{
                promptContrato: false,
                errores:{
                    required: 'Este campo es requerido.',
                },
                selectedTable: [],
                datosContratos: [],
                isPeticion: false,
                popupContratos: false,
                sucursales:[],
                colaboradores: [],
                contratos:{
                    sucursal: null,
                    empleado: null,
                    fecha_inicio: null,
                    fecha_final: null,
                    pago:null,
                    observacion: null
                },
                erroresServidor: []
            }
        },
        validations:{
            contratos:{
                fecha_inicio:    {required},
                fecha_final:  {required},
                pago:   {required},
                empleado: {required},
            }
        },
        created() {
            this.cargarContratos();
            this.cargarSucursales()
        },
        methods:{
            redirectColaborador(tr){
                this.$router.replace({path:'/colaborador/'+tr.col})
            },
            verificarForm: function () {
                this.isPeticion = true
                this.erroresServidor = [];
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.erroresServidor = ['Tienes que llenar todos los campos.']
                    this.isPeticion = false
                    // si en input del formulario falla se activara al alerta
                } else {
                    setTimeout(() => {
                        this.registrarContrato()
                    }, 500)
                }
            },
            registrarContrato: function(){
                let fechaI = this.contratos.fecha_inicio.split('T')[0];
                let fechaF = this.contratos.fecha_final.split('T')[0];
                this.contratos.fecha_inicio = fechaI;
                this.contratos.fecha_final  = fechaF;
                this.$axios.post('save_contrato',{
                    finicio:     this.contratos.fecha_inicio,
                    ffinal:      this.contratos.fecha_final,
                    observacion: this.contratos.observacion,
                    colaborador: this.contratos.empleado,
                    pago:        this.contratos.pago
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    this.popupContratos = false
                    if (res.status === 200){
                        this.promptContrato = true
                    }
                })
            },
            cargarColaborador: function () {
                this.isPeticion = true
                this.$axios.get('colaboradores_suc/'+this.contratos.sucursal,{
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
            cargarContratos(){
                this.$axios.get('/contratos',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.datosContratos = res.data.contratos
                    }
                })
            },
            cargarSucursales(){
                this.$axios.get('/sucursales',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status ===200){
                        this.sucursales = res.data.suc
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>
