<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Revisión de Planillas para Pago"/>
                <vs-table :data="Colaboradores" stripe max-items="10" search pagination>
                    <template slot="header">
                        <div class="row">
                            <div class="col d-flex justify-content-start">
                                <vs-button color="success" icon="cached" @click="popupInicio = true"></vs-button>
                            </div>
                        </div>
                    </template>
                    <template slot="thead">
                        <vs-th>Sucursal</vs-th>
                        <vs-th>Colaborador</vs-th>
                        <vs-th>Identidad</vs-th>
                        <vs-th>Planilla</vs-th>
                        <vs-th>Periodo</vs-th>
                        <vs-th>Total a Pagar</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Pagado</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data" >
                            <vs-td :data="data[indextr].suc">{{data[indextr].suc}}</vs-td>
                            <vs-td :data="data[indextr].nombres">{{data[indextr].nombres}} {{data[indextr].apellidos}}</vs-td>
                            <vs-td :data="data[indextr].identidad">{{data[indextr].identidad}}</vs-td>
                            <vs-td :data="data[indextr].codigo">{{data[indextr].codigo}}</vs-td>
                            <vs-td :data="data[indextr].periodo"><strong>{{data[indextr].periodo}} de {{data[indextr].mes_asignado}}</strong></vs-td>
                            <vs-td :data="data[indextr].total_pagar">L {{data[indextr].total_pagar}}</vs-td>
                            <vs-td>
                                <vs-chip v-b-tooltip.hover title="El colaborador ya firmó la planilla y se registró en el sístema"
                                         v-if="data[indextr].estado === 1" color="success">Registrada</vs-chip>
                                <vs-chip v-b-tooltip.hover title="El colaborador aún no ha firmado la planilla"
                                         v-if="data[indextr].estado === 0" color="danger">Pendiente</vs-chip>
                            </vs-td>
                            <vs-td>
                                <vs-chip v-b-tooltip.hover :title="'A '+data[indextr].nombres+' '+data[indextr].apellidos+' ya se le pagó'"
                                         v-if="data[indextr].is_pagado === 1" color="success">Ya se realizó pago</vs-chip>
                                <vs-chip v-b-tooltip.hover :title="'A '+data[indextr].nombres+' '+data[indextr].apellidos+' se le debe el pago'"
                                         v-if="data[indextr].is_pagado === 0" color="danger">Pendiente pago</vs-chip>
                            </vs-td>
                            <vs-td class="d-flex justify-content-center">
                                <vs-button v-if="data[indextr].pagado === 0" size="small" v-b-tooltip.hover
                                           :title="'Agregar pago a '+data[indextr].nombres+' '+data[indextr].apellidos"
                                        icon="add" color="success" @click="abrirPopupPagos(tr)"></vs-button>
                                <vs-button v-else size="small" icon="visibility" color="warning"
                                           @click="abrirModalPagado(tr)">
                                </vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>

            </div>
        </div>


        <vs-popup title="Revisión de planillas para pago" :active.sync="popupInicio">
            <div style="padding: 5px">
                <vs-progress indeterminate color="success" v-if="isPeticion"></vs-progress>
                <div class="row">
                    <div class="col-auto"><strong>Seleccione un año</strong></div>
                </div>
                <div class="row" v-for="(item, index) in Anios">
                    <div class="col-auto" >
                        <vs-radio v-model="Consulta.anio" vs-name="anios" :vs-value="item.ano">{{item.ano}}</vs-radio>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-auto"><strong>Seleccione un mes</strong></div>
                </div>
                <div v-for="(item, index) in Anios">
                    <div class="row" v-for="value in item.mes" v-if="item.ano === Consulta.anio">
                        <div class="col-auto" >
                            <vs-radio v-model="Consulta.mes" vs-name="meses" :vs-value="value.mes">{{value.mes_asignado}}</vs-radio>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto"><strong>Seleccione una sucursal</strong></div>
                </div>
                <div class="row" v-for="item in Sucursales">
                    <div class="col d-flex justify-content-start">
                        <vs-radio v-model="Consulta.sucursal" vs-name="sucursales" :vs-value="item.id">{{item.nombre}}</vs-radio>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row" v-if="Consulta.anio && Consulta.mes && Consulta.sucursal">
                    <div class="col d-flex justify-content-end">
                        <vs-button color="success" :disabled="isPeticion" @click="cargarColaboradores">Consultar Planillas</vs-button>
                    </div>
                </div>
            </div>
        </vs-popup>
        <vs-popup :title="'Pagando salarío de '+this.Pago.nombreCompleto" :active.sync="popupPago">
            <div style="padding: 5px">
                <div class="row">
                    <div class="col-md-5 form-group">
                        <label>Seleccione un banco</label>
                        <select class="form-control form-control-sm" disabled></select>
                    </div>
                    <div class="col-md-4 form-group">
                        <label>Seleccione una cuenta</label>
                        <select class="form-control form-control-sm" disabled></select>
                    </div>
                    <div class="col-md-3 form-group">
                        <label>Monto a pagar</label>
                        <input type="text" disabled v-model="Pago.montoPagar" class="form-control form-control-sm">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-5 form-group">
                        <label>Referencia de pago</label>
                        <input type="text" v-model="Pago.referencia" class="form-control-sm form-control">
                    </div>
                    <div class="col-md-7 form-group">
                        <label>Referencia de pago</label>
                        <b-form-file v-model="Pago.file" :state="Boolean(Pago.file)"
                                placeholder="Subir referencia pago" accept="image/*" browse-text="Buscar"></b-form-file>
                    </div>
                </div>
                <div class="row">
                    <div class="col form-group">
                        <label>Observación</label>
                        <input type="text" v-model="Pago.observacion" class="form-control-sm form-control">
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button color="success" :disabled="isPago" @click="registrarPago">Registrar Pago</vs-button>
                    </div>
                </div>
            </div>
        </vs-popup>

        <b-modal v-model="modalPagado" size="xl"
                 :title="'Pago de '+this.Pago.nombreCompleto">
            <vs-alert color="warning" icon="new_releases" >
                <span>Solo tienes <b>5 mínutos</b> para ver esta imagen.</span>
            </vs-alert>
            <div class="row">
                <div class="col-md-9 d-flex justify-content-center" style="background-color: #47494e; max-height: 500px;padding: 5px">
                    <span v-if="cargaPago.cargando" style="background-color: #F5F5F5">Cargando imagen ...</span>
                    <b-img :src="urlPago" @load="cargaPago.cargando = false" fluid></b-img>
                </div>
                <div class="col-md-3" v-if="!cargaPago.cargando">
                    <h5 class="text-center">Información del Pago</h5>
                    <div class="row">
                        <div class="col-auto"><strong>Referencia</strong></div>
                    </div>
                    <div class="row">
                        <div class="col-auto">{{cargaPago.referencia}}</div>
                    </div>
                    <div class="row">
                        <div class="col-auto"><strong>Observación</strong></div>
                    </div>
                    <div class="row">
                        <div class="col-auto">{{cargaPago.obs}}</div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-auto"><strong>Nombre del Beneficiario</strong></div>
                    </div>
                    <div class="row">
                        <div class="col-auto">{{Pago.nombreCompleto}}</div>
                    </div>
                    <div class="row">
                        <div class="col-auto"><strong>Identidad</strong></div>
                    </div>
                    <div class="row">
                        <div class="col-auto">{{Pago.identidad}}</div>
                    </div>
                    <div class="row">
                        <div class="col-auto"><strong>Sucursal</strong></div>
                    </div>
                    <div class="row">
                        <div class="col-auto">{{Pago.sucursal}}</div>
                    </div>
                    <div class="row">
                        <div class="col-auto"><strong>Código de la planilla</strong></div>
                    </div>
                    <div class="row">
                        <div class="col-auto">{{Pago.planilla}}</div>
                    </div>
                </div>
            </div>
            <template v-slot:modal-footer="{ ok}">
                <b-button size="sm" variant="success" @click="ok()">
                    Cerrar
                </b-button>
            </template>
        </b-modal>
    </vs-card>

</template>

<script>
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    import tituloh5 from "../../../components/tituloh5";
    export default {
        name: "pago",
        components:{sideColaboradores, tituloh5},
        data(){
            return{
                urlPago: null,
                modalPagado: false,
                Anios:null,
                popupInicio: true,
                Consulta:{
                    anio: null,
                    mes: null,
                    sucursal: null
                },
                Colaboradores: [],
                isPeticion:false,
                Sucursales:null,
                popupPago: false,
                Pago:{
                    file: null,
                    nombreCompleto: null,
                    cuerpoId:null,
                    referencia: null,
                    observacion: null,
                    montoPagar: null,
                    planilla: null,
                    identidad: null,
                    sucursal: null
                },
                isPago: false,
                cargaPago:{
                    cargando: true,
                    referencia: null,
                    obs: null
                }
            }
        },
        created() {
            this.isPeticion = true
            this.cargarInfo()
        },
        methods:{
            registrarPago(){
              if (this.Pago.file && this.Pago.referencia){
                  let data = new FormData()
                  this.isPago = true
                  data.append('cuerpo', this.Pago.cuerpoId);
                  data.append('referencia', this.Pago.referencia);
                  data.append('observacion', this.Pago.observacion);
                  data.append('planilla', this.Pago.planilla);
                  data.append('foto', this.Pago.file);
                  this.$axios({
                      method: 'post',
                      url:    'pagos',
                      data:   data,
                      headers:{
                          'Authorization': 'Bearer ' + this.$store.state.token,
                          'Content-Type': "multipart/form-data"
                      }
                  }).then((res)=>{
                      if (res.status === 200){
                          this.$vs.notify({
                              text:'El pago se registró exitosamente en la base de datos',
                              title:'Registro Exitoso',
                              color:'success',
                              position:'top-right'
                          })
                          this.cargarColaboradores()
                          this.Pago.file = null
                          this.Pago.referencia = null
                          this.popupPago = false
                          this.isPago = false
                      }
                  })
              }
            },
            abrirModalPagado(tr){
                this.Pago.nombreCompleto = tr.nombres+' '+tr.apellidos
                this.Pago.identidad = tr.identidad
                this.Pago.planilla = tr.codigo
                this.Pago.sucursal = tr.suc
                this.cargaPago.cargando = true
                this.urlPago = null
                this.Pago.nombreCompleto = tr.nombres+' '+tr.apellidos
                this.Pago.cuerpoId = tr.cuerpo
                this.modalPagado = true
                this.cargarPago()
            },
            abrirPopupPagos(tr){
                this.Pago.planilla = tr.codigo
                this.Pago.nombreCompleto = tr.nombres+' '+tr.apellidos
                this.Pago.cuerpoId = tr.cuerpo
                this.Pago.montoPagar= tr.total_pagar
                this.Pago.observacion = `Pagando a ${this.Pago.nombreCompleto} ${tr.total_pagar} lps de planilla ${tr.codigo}`
                this.popupPago = true
            },
            cargarColaboradores(){
                this.isPeticion = true
              this.$axios.get(`revision_planillas/${this.Consulta.anio}/${this.Consulta.mes}/${this.Consulta.sucursal}`,{
                  headers:{
                      'Authorization': 'Bearer '+ this.$store.state.token,
                  }
              })  .then((res)=>{
                  if (res.status === 200){
                      this.isPeticion = false
                      this.Colaboradores = res.data.col
                      this.popupInicio = false

                  }
              })
            },
            cargarInfo(){
                this.$axios.get('revision_planillas',{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token,
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Anios = res.data.anos
                        this.Sucursales = res.data.suc
                        this.isPeticion = false
                    }
                })
            },
            cargarPago(){
                this.$axios.get('pagos/'+this.Pago.cuerpoId,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token,
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.urlPago = res.data.url
                        this.cargaPago.referencia = res.data.cuerpo.referencia
                        this.cargaPago.obs = res.data.cuerpo.observacion
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
