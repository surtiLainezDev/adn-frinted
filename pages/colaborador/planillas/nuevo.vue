<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col">
                        <vs-card>
                            <!--                            encabezado-->
                            <div slot="header">
                                <div class="row">
                                    <div class="col-auto">
                                        <vs-button color="warning" @click="popupPlanilla = true" type="border">Crear Planilla</vs-button>
                                    </div>
                                    <div class="col-auto">
                                        <vs-button color="warning" @click="popupAcciones = true" type="border">Crear Acciones</vs-button>
                                    </div>
                                    <div class="col d-flex justify-content-center">
                                        <h5>Área de Trábajo</h5>
                                    </div>
                                </div>
                            </div>
                            <!--                            encabezado-->
                            <div v-show="disabledArea">
                                <div class="row">
                                    <div class="col-auto">
                                        Sucursal: <strong>{{sucursal.nombre}}</strong>
                                    </div>
                                </div>
                                <div class="row top">
                                    <div class="col-md-4">
                                        <div class="row">
                                            <div class="col-auto">
                                                Mes de Pago:
                                            </div>
                                            <div class="col-auto">
                                                <select v-model="sucursal.mes"  class="form-control form-control-sm" @click="mesesString">
                                                    <option v-for="item in meses" :value="item.id">{{item.mes}}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="row">
                                            <div class="col-auto">Año de Pago:</div>
                                            <div class="col-auto">
                                                <select v-model="sucursal.ano" class="form-control form-control-sm">
                                                    <option v-for="item in anos" :value="item">{{item}}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-5">
                                        <div class="row">
                                            <div class="col-auto">
                                                Periodo de Pago:
                                            </div>
                                            <div class="col-auto">
                                                <vs-input-number size="small" min="1" max="31" label="del" v-model="sucursal.periodo.inicio"/>
                                            </div>
                                            <div class="col-auto">
                                                <vs-input-number size="small" min="1" max="31" label="al" v-model="sucursal.periodo.final"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <vs-divider></vs-divider>

                                <!--                                tabla-->
                                <vs-table
                                        v-model="selected" :data="dataPlanilla" >
                                    <div slot="header">
                                        <h6>
                                            Colaboradores en la Planilla
                                        </h6>
                                    </div>
                                    <template slot="thead">
                                        <vs-th>
                                            Nombre Completo
                                        </vs-th>
                                        <vs-th>
                                            Identidad
                                        </vs-th>
                                        <vs-th>
                                            Cargo
                                        </vs-th>
                                        <vs-th>Sueldo Base</vs-th>
                                        <vs-th>Tipo de Pago</vs-th>
                                        <vs-th>Dias Trabajados</vs-th>
                                        <vs-th>Pago</vs-th>
                                        <vs-th>Total Agregado</vs-th>
                                        <vs-th>Total Deducido</vs-th>
                                        <vs-th>Total Pago</vs-th>
                                        <vs-th>Acciones</vs-th>
                                    </template>

                                    <template slot-scope="{data}">
                                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                                            <vs-td :data="data[indextr].nombreCompleto">{{data[indextr].nombreCompleto}}</vs-td>
                                            <vs-td :data="data[indextr].identidad">{{data[indextr].identidad}}</vs-td>
                                            <vs-td :data="data[indextr].puesto">{{data[indextr].tipoCol}}</vs-td>
                                            <vs-td :data="data[indextr].pago">L.{{data[indextr].sueldo_base}}</vs-td>
                                            <vs-td>
                                                <select class="form-control form-control-sm" v-model="dataPlanilla[indextr].tipoPago" @change="diasTrabajados(indextr)">
                                                    <option v-for="item in rangos" :value="item.id+'-'+item.dias">{{item.nombre}}</option>
                                                </select>
                                            </vs-td>
                                            <vs-td>
                                                <input type="text" class="form-control form-control-sm" v-model="dataPlanilla[indextr].dias_trabajados" @change="totalPago(indextr)">
                                            </vs-td>
                                            <vs-td>
                                                <input type="text" class="form-control form-control-sm" readonly v-model="dataPlanilla[indextr].pago">
                                            </vs-td>
                                            <vs-td>
                                                <input type="text" class="form-control form-control-sm" readonly v-model="dataPlanilla[indextr].totalAgregado" >
                                            </vs-td>
                                            <vs-td>
                                                <input type="text" class="form-control form-control-sm" readonly v-model="dataPlanilla[indextr].totalDeducido" >
                                            </vs-td>
                                            <vs-td>
                                                <input type="text" class="form-control form-control-sm" readonly v-model="dataPlanilla[indextr].totalPago" >
                                            </vs-td>
                                            <vs-td class="d-flex justify-content-center">
                                                <vs-button size="small" @click="handleSelected()" type="filled" color="success" icon="add">
                                                </vs-button>
                                            </vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>
                                <div class="row">
                                    <div class="col-auto">
                                        <strong>Observació de la planilla completa</strong>
                                    </div>
                                </div>
                                <br>
                                <div class="row">
                                    <div class="col">
                                        <input type="text" placeholder="Observación corta de la planilla" maxlength="250"
                                               class="form-control form-control-sm" v-model="sucursal.observacion">
                                    </div>
                                </div>
                                <vs-divider></vs-divider>

                                <div class="row" v-show="disabledVerificar">
                                    <div class="col">
                                        <div class="d-flex justify-content-end">
                                            <vs-button  color="success" @click="dialogoVerificar = true" type="filled">Crear Planilla</vs-button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </vs-card>
                    </div>
                </div>
            </div>


        </div>
        <!--            recursos de la pagina-->
        <vs-popup  title="Creando Planilla de Pago" :active.sync="popupPlanilla">
            <div class="bodyPopup">
                <form >
                    <div class="row">
                        <div class="col-sm-4">
                            Seleccione una Sucursal
                        </div>
                        <div class="col-sm-8">
                            <select class="form-control form-control-sm" v-model="sucursal_id" @change="buscarColaboradores">
                                <option v-for="item in sucursales" :value="item.id+'-'+item.nombre">{{item.nombre}}</option>
                            </select>
                        </div>
                    </div>
                    <vs-progress v-if="isPeticionSucursal" indeterminate color="success"></vs-progress>
                    <vs-divider></vs-divider>
                    <div v-if="colaboradores">
                        <div class="row Tablebody">
                            <div class="col-md-12">
                                <vs-table
                                        multiple v-model="selectedColaboradores" :data="colaboradores">
                                    <template slot="header">
                                        <h6>
                                            Colaboradores Activos
                                        </h6>
                                    </template>

                                    <template slot="thead">
                                        <vs-th>Nombre Completo</vs-th>
                                        <vs-th>Puesto de Colaborador</vs-th>
                                        <vs-th>Sucursal Asignada</vs-th>
                                    </template>

                                    <template slot-scope="{data}">
                                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                                            <vs-td :data="data[indextr].nombres">
                                                {{data[indextr].nombres}} {{data[indextr].apellidos}}
                                            </vs-td>
                                            <vs-td :data="data[indextr].puesto">
                                                {{data[indextr].puesto}}
                                            </vs-td>

                                            <vs-td :data="data[indextr].sucursal">
                                                {{data[indextr].sucursal}}
                                            </vs-td>
                                        </vs-tr>
                                    </template>

                                </vs-table>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="row">
                            <div class="col-sm-9"></div>
                            <div class="col-sm-3">
                                <vs-button color="success" size="small" @click="planillaCol" type="border">Crear Planilla</vs-button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </vs-popup>
        <vs-popup title="Acciones con fila de planilla" :active.sync="popupAccionPlanilla">
            <div class="bodyPopup">
                <div class="row">
                    <div class="col-sm-4">
                        <button class="btn btn-success btn-sm" @click="addAccion">Agregar Acción</button>
                    </div>
                    <div class="col-sm-8"></div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col-sm-6"><label>Seleccione la Acción</label></div>
                    <div class="col-sm-4"><label>Total de la Acción</label></div>
                    <div class="col-sm-2"></div>
                </div>
                <div class="row filas" v-for="item in selected.acciones" @change="selectTipoAccion(item-1)">
                    <div class="col-sm-6">
                        <select class="form-control form-control-sm" v-model="selected.tipoAccion[item - 1]" >
                            <option v-for="item in tipoAcciones" :value="item.id+'-'+item.tipo">{{item.nombre}}</option>
                        </select>
                    </div>
                    <div class="col-sm-4">
                        <input type="text" class="form-control form-control-sm" v-model="selected.totalAccion[item - 1]">
                    </div>
                    <div class="col">
                        <button class="btn btn-danger btn-sm" @click="deleteAccion(item - 1)">X</button>
                    </div>
                </div>

                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col-sm-4">
                        <strong>Agregado: L.</strong>{{selected.totalAgregado}}
                    </div>
                    <div class="col-sm-4">
                        <strong>Deducido: L.</strong>{{selected.totalDeducido}}
                    </div>
                    <div class="col-sm-4">
                        <strong>Total a Pagar: L.</strong>{{selected.totalPago}}
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col-sm-9"></div>
                    <div class="col-sm-3">
                        <button class="btn btn-outline-success btn-sm" @click="popupAccionPlanilla = false">Registrar</button>
                    </div>
                </div>
            </div>
        </vs-popup>
        <vs-popup title="Nuevas Acciones" :active.sync="popupAcciones">
            <div class="bodyPopup">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label >Ver Acciones Existentes</label>
                            <select class="form-control form-control-sm">
                                <option v-for="item in tipoAcciones" :value="item.id">{{item.nombre}}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label>Nombre</label>
                            <input type="text" class="form-control form-control-sm" v-model="AccionesP.nombre">
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="form-group">
                            <label>Tipo de Acción</label>
                            <select class="form-control form-control-sm" v-model="AccionesP.tipo">
                                <option value="1">Suma</option>
                                <option value="2">Resta</option>
                            </select>
                        </div>
                    </div>
                    <vs-divider></vs-divider>

                    <div class="row">
                        <div class="d-flex justify-content-end">
                            <div class="col">
                                <vs-button color="success" size="small" @click="addAcciones"  type="filled">Agregar Acción</vs-button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </vs-popup>

        <vs-prompt color="warning"
                   title="Verificación de Planilla"
                   :is-valid="checkEnviar"
                   :active.sync="dialogoVerificar"
                   accept-text="Crear Planilla"
                   cancel-text="Verificar Planilla"
                   @accept="crearPlanilla">
            <div>
                <div class="row">
                    <div class="col">
                        Sucursal: {{sucursal.nombre}}
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        El periodo de pago abarca del {{sucursal.periodo.inicio}} al {{sucursal.periodo.final}} de {{sucursal.nombreMes}}
                    </div>
                </div>
                <br>
                <br>
                <vs-alert :active="true" color="warning" icon="new_releases" >
                    <span>Por favor verífica los todos los datos de la planilla</span>
                </vs-alert>
                <div class="row">
                    <div class="col">
                        Si ya verífico los datos de la planilla seleccione habilite el siguiente switch <vs-switch @click="checkEnviar = true" v-model="checkEnviar" />
                    </div>
                </div>
            </div>

        </vs-prompt>
        <vs-prompt color="success"
                   title="Registro Exitoso"
                   accept-text="Ver planilla actual"
                   @accept="irPlanillas"
                   :active.sync="dialogoImprimir"
                   cancel-text="Agregar nueva planilla">
            <div class="bodyPopup">
                <div class="row">
                    <div class="col-auto">
                        <p>La planilla se ha guardado correctamente en la base de datos.</p>
                        <vs-button :disabled="printF" icon="print" @click="print" color="warning" size="small">Imprimir Planilla</vs-button>
                    </div>
                </div>
            </div>
        </vs-prompt>
    </vs-card>
</template>

<script>
    var elemtos = []
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    export default {
        name: "nuevo",
        data(){
            return{
                printF:                  false,
                dialogoImprimir:        false,
                checkEnviar:            false,
                dialogoVerificar:       false,
                AccionesP:              {
                    nombre: null,
                    tipo: null
                },
                popupAcciones:          false,
                popupPlanilla:          false,
                sucursal_id:            null,
                selected:               [],
                sucursal:               {
                    id: null,
                    nombre: '',
                    periodo: {
                        inicio: 1,
                        final: 31,
                    },
                    ano:null,
                    mes: null,
                    nombreMes: null,
                    observacion: null,
                },
                selectedColaboradores:  [],
                dataPlanilla:           [],
                colaboradores:          null,
                isPeticionSucursal:     false,
                habilitarVerificacion:  [],
                disabledVerificar:      false,
                disabledArea:           false,
                empleadosSeleccionados: null,
                meses:                  [{"id":1, "mes":"enero"}, {"id":2, "mes":"febrero"}, {"id":3, "mes":"marzo"},
                    {"id":4, "mes":"abril"},{"id":5, "mes":"mayo"},{"id":6, "mes":"junio"},
                    {"id":7, "mes":"julio"},{"id":8, "mes":"agosto"},{"id":9, "mes":"septiembre"},
                    {"id":10, "mes":"octubre"},{"id":11, "mes":"noviembre"}, {"id":12, "mes":"diciembre"}],
                anos:                   [],
                rangos:                 null,
                popupAccionPlanilla:    false,
                tipoAcciones:           null,
                codPlanillasGo:         null

            }
        },
        components:{
            sideColaboradores
        },
        methods:{
            anios: function(){
                let fecha = new Date();
                let ano = fecha.getFullYear();
                let anomas = fecha.getFullYear() + 1;
                let menosano = fecha.getFullYear() - 1;
                this.sucursal.ano = ano
                this.anos.push(menosano)
                this.anos.push(ano)
                this.anos.push(anomas)
            },
            print: function(){
                this.$router.replace({path:'/colaborador/planillas/pdf/'+this.codPlanillasGo})
            },
            irPlanillas(){
                this.dialogoImprimir = false
                this.$router.replace({path:"/colaborador/planillas/"+this.codPlanillasGo})
            },
            crearPlanilla(){
                this.$vs.loading({color:'success'})
                return this.$axios.post("/planillas", {
                    sucursalId: this.sucursal.id,
                    observacion: this.sucursal.observacion,
                    mesAsignado: this.sucursal.nombreMes,
                    anoAsignado: this.sucursal.ano,
                    periodo: `del ${this.sucursal.periodo.inicio} al ${this.sucursal.periodo.final}`,
                    colaboradors: this.dataPlanilla,
                    mes: this.sucursal.mes
                },{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token,
                    }
                }).then((res)=>{
                    if (res.data.status){
                        this.disabledArea = false
                        setTimeout(()=>{
                            this.$vs.loading.close()
                        }, 1000)
                        this.dialogoImprimir = true
                        this.checkEnviar = false
                        this.codPlanillasGo = res.data.id

                    }
                })
            },
            mesesString: function(){
                for (let item in this.meses){
                    if (this.meses[item].id === this.sucursal.mes){
                        this.sucursal.nombreMes = this.meses[item].mes
                    }
                }
            },
            addAcciones: function(){
                this.$axios.post('tipos_acciones',{
                    nombre: this.AccionesP.nombre,
                    tipo: this.AccionesP.tipo
                },{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token,
                    }
                }).then((res)=>{
                    if (res.data.status){
                        this.$vs.notify({
                            title:'Guardado Exitoso',
                            text:`La acción ${this.AccionesP.nombre} se ha guardado exitosamente.`,
                            color:'success', position:'top-right'
                        })
                        this.AccionesP.nombre = ''
                        this.AccionesP.tipo = ''
                        this.cargarTipoAccionesPlanillas()
                        this.popupAcciones = false
                    }
                })
            },
            suma: function(){
                this.selected.totalAgregado = 0;
                this.selected.totalDeducido = 0;
                for (let items in this.selected.accionesCol){
                    if (this.selected.accionesCol[items].tipoId ==  1){
                        this.selected.totalAgregado = (parseFloat(this.selected.totalAgregado) + parseFloat(this.selected.accionesCol[items].totalAccion)).toFixed(2)
                    }else if (this.selected.accionesCol[items].tipoId == 2){
                        this.selected.totalDeducido = (parseFloat(this.selected.totalDeducido) + parseFloat(this.selected.accionesCol[items].totalAccion)).toFixed(2)
                    }
                }
                this.selected.totalPago = ((parseFloat(this.selected.pago) - parseFloat(this.selected.totalDeducido)) + parseFloat(this.selected.totalAgregado)).toFixed(2)
            },
            selectTipoAccion: function(item){
                if (this.selected.tipoAccion[item] && this.selected.totalAccion[item]){
                    let idAccion = this.selected.tipoAccion[item].split('-')[0]
                    let Accion = this.selected.tipoAccion[item].split('-')[1]
                    if(Accion == 1){
                        if (this.selected.accionesCol[item]){
                            this.selected.accionesCol[item].tipoAccion = "suma"
                            this.selected.accionesCol[item].tipoId = 1
                            this.selected.accionesCol[item].accion_id = idAccion
                            this.selected.accionesCol[item].totalAccion = this.selected.totalAccion[item]
                        }else{
                            this.selected.accionesCol.push({
                                "tipoAccion": "suma",
                                "tipoId": 1,
                                "accion_id": idAccion,
                                "totalAccion": this.selected.totalAccion[item]
                            })
                        }
                        this.suma(item)
                    }else if (Accion == 2){
                        if (this.selected.accionesCol[item]){
                            this.selected.accionesCol[item].tipoAccion = "resta"
                            this.selected.accionesCol[item].tipoId = 2
                            this.selected.accionesCol[item].accion_id = idAccion
                            this.selected.accionesCol[item].totalAccion = this.selected.totalAccion[item]
                        }else {
                            this.selected.accionesCol.push({
                                "tipoAccion": "resta",
                                "tipoId": 2,
                                "accion_id": idAccion,
                                "totalAccion": this.selected.totalAccion[item]
                            })
                        }
                        this.suma(item)
                    }
                }
            },
            addAccion: function(){
                this.selected.acciones++
            },
            deleteAccion: function(item){
                if (item === 0){
                    this.selected.tipoAccion = []
                    this.selected.totalAccion = []
                    this.selected.accionesCol = []
                }
                this.selected.acciones--
                this.selected.tipoAccion.splice(item, item)
                this.selected.totalAccion.splice(item, item)
                this.selected.accionesCol.splice(item, item)
                this.suma()
            },
            habilitarBtnVerificacion: function(){
                if (elemtos.length == this.empleadosSeleccionados){
                    this.disabledVerificar = true
                }
            },
            planillaCol: function() {
                this.habilitarVerificacion = []
                elemtos = []
                this.disabledVerificar = false
                this.dataPlanilla = [];
                this.habilitarVerificacion = 0;
                this.disabledArea = true;
                this.empleadosSeleccionados = this.selectedColaboradores.length;
                for (let item in this.selectedColaboradores){
                    this.dataPlanilla.push({
                        "colaborador_id": this.selectedColaboradores[item].id, // es el id del colaborador seleccionado
                        "dias_trabajados": 0, //este es el campo en el que determina cuanto dias trabajo el trabajador
                        "nombreCompleto": this.selectedColaboradores[item].nombres+' '+this.selectedColaboradores[item].apellidos, //nombre completo del trabajador
                        "identidad": this.selectedColaboradores[item].identidad, //identidad del trabajador
                        "tipoCol": this.selectedColaboradores[item].puesto, //tipo de puesto que tiene en la empresa el empleado
                        "sueldo_base": this.selectedColaboradores[item].pago, //este es el sueldo base del trabajador
                        "tipoPago": null, //si quicena, mensualidad, semana
                        "rangoPago": null, //si quicena, mensualidad, semana
                        "totalAgregado": 0, // este es total de dinero que tiene extra sobre el sueldo base
                        "totalDeducido": 0, //este es el total de dinero que tiene deducido del total del pago
                        "pago": 0, //este es el sueldo base sin deducciones ni sumas
                        "totalPago": 0, //esto es el total que se le pagara al trabajador  =(sueldo_base - totalDeducido) + totalAgregado
                        "observacion": '', //esta es la observacion corta de este empleado *esta sale impresa
                        "acciones": 0, //esta es la cantidad de acciones que tiene el empleado (vales, anticipos, comision)
                        "accionesCol": [], //esto es el registro de todas las acciones del empleado
                        "tipoAccion":[], //este es para el campo tipo acciones en el select
                        "totalAccion": [] //este es el total de la accion que se eligio
                    })
                }
                this.mesesString();
                this.popupPlanilla = false
            },
            totalPago: function(item){
                let elem = elemtos.includes(item)
                if(elem === false){
                    elemtos.push(item)
                    this.habilitarBtnVerificacion()
                }
                let pagoDia = this.dataPlanilla[item].sueldo_base / 30;
                this.dataPlanilla[item].totalPago = (((this.dataPlanilla[item].dias_trabajados * pagoDia) + parseFloat(this.dataPlanilla[item].totalAgregado)) - parseFloat(this.dataPlanilla[item].totalDeducido)).toFixed(2)
                this.dataPlanilla[item].pago = (this.dataPlanilla[item].dias_trabajados * pagoDia).toFixed(2)
            },
            handleSelected() {
                this.popupAccionPlanilla = true
            },
            buscarColaboradores: function() {
                this.isPeticionSucursal    = true
                this.sucursal.id           = this.sucursal_id.split('-')[0]
                this.sucursal.nombre       = this.sucursal_id.split('-')[1]
                let fecha                  = new Date();
                this.sucursal.mes          = fecha.getMonth() + 1;
                this.selected              = []
                this.selectedColaboradores = []
                this.dataPlanilla          = []
                return this.$axios.get('empleados_plantilla/'+this.sucursal.id, {
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token,
                    }
                }).then((res) =>{
                    this.isPeticionSucursal = false
                    this.colaboradores = res.data.col
                })
            },
            diasTrabajados: function(item){
                let diasTrabajados = this.dataPlanilla[item].tipoPago.split('-')[1]
                this.dataPlanilla[item].dias_trabajados = diasTrabajados
                this.dataPlanilla[item].rangoPago = this.dataPlanilla[item].tipoPago.split('-')[0]
                this.totalPago(item)
            },
            cargarRangos:function () {
                return this.$axios.get('rangos', {
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token,
                    }
                }).then((res)=>{
                    this.rangos = res.data.rangos
                })
            },
            cargarTipoAccionesPlanillas: function () {
                return this.$axios.get('tipos_acciones', {
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token,
                    }
                }).then((res)=>{
                    this.tipoAcciones = res.data.acciones
                })
            },
        },
        created() {
            this.cargarRangos();
            this.anios();
            this.cargarTipoAccionesPlanillas();
        },
        asyncData({$axios, store}){
            return $axios.get('/sucursales',{
                headers:{
                    'Authorization': `Bearer ${store.state.token}`
                },
            }).then( res =>{
                return {
                    sucursales: res.data.suc
                }
            })
        }
    }
</script>

<style scoped lang="stylus">
    .top
        margin-top 10px
    .CuerpoContenedor
        position relative
        padding 10px
    .bodyPopup
        padding 20px
    .Tablebody
        padding 10px
    .con-expand-users
    .con-btns-user
        display flex
        padding 10px
        padding-bottom 0px
        align-items center
        justify-content space-between
        .con-userx
            display flex
            align-items center
            justify-content flex-start
    .list-icon
        i
            font-size .9rem !important
    .filas
        margin-bottom 5px
</style>
