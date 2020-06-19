<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <vs-progress color="success" indeterminate v-if="!cargaPagina"></vs-progress>
                <div v-if="cargaPagina">
                    <div class="row">
                        <div class="col-auto"><h4>Planilla {{Planilla.codigo}}</h4></div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="row">
                        <div class="col-auto">
                            <h5><strong>Información general de la planilla</strong></h5>
                        </div>
                        <div class="col d-flex justify-content-end">
                            <vs-button class="margenes" color="primary" @click="pdf(1)" type="filled" size="small" icon="print">Imprimir</vs-button>
                            <vs-button class="margenes" color="success" @click="popupSubir = true" type="filled" size="small" icon="cloud_upload">Subir Planilla</vs-button>
                            <vs-button  class="margenes" @click="clickPdf"
                                        color="danger" type="filled" size="small" icon="picture_as_pdf">PDF</vs-button>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-auto" v-for="(i, index,item) in infoPlantilla">
                            <radiusficha :texto="infoPlantilla[index]" :tipo="index"
                                         :icono="iconos[item]" color="#30B26e"/>
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                    <br>
                    <div class="row">
                        <vs-card>
                            <div class="col">
                                <tabla-componentes titulo="Cuerpo de la planilla" :head="theadCuerpoPlanilla"
                                                   :dato-planillas="Planilla.cuerpo_planillas"
                                                   :total="'L '+Planilla.total_planilla"/>
                            </div>
                        </vs-card>
                    </div>
                    <br>
                    <div class="row">
                        <vs-card>
                            <div slot="header"><h5>Acciones de la planilla por empleados</h5></div>
                            <div class="col">
                                <vs-collapse type="border" v-for="item in Planilla.cuerpo_planillas">
                                    <vs-collapse-item>
                                        <div slot="header">{{item.colaborador[0].nombres}} {{item.colaborador[0].apellidos}}</div>
                                        <acciones :item="item"/>
                                    </vs-collapse-item>
                                </vs-collapse>
                            </div>
                        </vs-card>
                    </div>

                    <vs-popup title="Subiendo Planilla Firmada" :active.sync="popupSubir">
                        <div style="padding: 5px">
                            <vs-progress v-if="isFIleSubir" indeterminate color="success"></vs-progress>
                            <div class="row">
                                <div class="col d-flex justify-content-center">
                                    <vs-upload id="planillaFirmada" color="success" @change="subirPlanilla"
                                               limit="1" :show-upload="false"
                                               accept="application/pdf"
                                               text="Planilla Firmada"/>
                                </div>
                            </div>
                            <div v-if="errorSubida" class="row"><div class="col">
                                <small style="color: red">Tienes que subir un archivo</small>
                            </div></div>
                            <vs-divider></vs-divider>
                            <div class="row">
                                <div class="col d-flex justify-content-end">
                                    <vs-button @click="subirPlanillaFirmada" color="success">Subir</vs-button>
                                </div>
                            </div>
                        </div>
                    </vs-popup>

                    <vs-prompt color="success"
                               title="Registro Exitoso"
                               accept-text="Aceptar"
                               cancel-text
                               @accept="cargarPlanilas"
                               @close="cargarPlanilas"
                               :active.sync="dialogoSubir">
                        <div class="bodyPopup">
                            <p>Se ha registrado correctamente la planilla.Esta planila paso de estar pendiente a registrada</p>
                        </div>
                    </vs-prompt>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    import tablaComponentes from "./tablaComponentes";
    import acciones from "./acciones";
    import radiusficha from "../../../components/radiusficha";
    export default {
        components:{
            sideColaboradores,
            tablaComponentes,
            acciones, radiusficha
        },
        data(){
            return{
                dialogoSubir: false,
                isFIleSubir: false,
                popupSubir: false,
                infoPlantilla:       {
                    fecha_creacion: null,
                    total:          null,
                    usuario_creador: null,
                    periodo:        null,
                    estado:        null,
                },
                iconos:              ['calendar_today','attach_money','person_outline',
                    'date_range','perm_identity'],
                Planilla:            [],
                theadAcciones:       ['Nombre Completo',
                    'Nombre de la Acción','Agregados','Deducidos'],
                theadCuerpoPlanilla: ['Colaborador','Identidad','Puesto','Suedlo Base','Días T.',
                    'Pago','Total Agregado','Total Deducido','Total'],
                filePlanilla: null,
                errorSubida: false,
                cargaPagina: false
            }
        },
        created() {
            this.cargarPlanilas()
        },
        methods:{
            subirPlanillaFirmada(){
                if (this.filePlanilla){
                    this.isFIleSubir  = true
                    this.errorSubida = false
                    let data = new FormData();
                    data.append('id', this.$route.params.planilla);
                    data.append('planilla', this.filePlanilla);
                    this.$axios({
                        method: 'post',
                        url: 'planilla/subir',
                        data:data,
                        headers:{
                            'Authorization': 'Bearer ' + this.$store.state.token,
                            'Content-Type': "multipart/form-data"
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.isFIleSubir = false
                            this.notificacion('success','Se ha registrado correctamnete la planillas',
                                'Registro Exitoso')
                            this.popupSubir = false;
                            this.dialogoSubir = true
                        }
                    })
                }else{
                    this.errorSubida = true
                }
            },
            subirPlanilla(){
                this.errorSubida = false
                this.filePlanilla = document.getElementById("planillaFirmada").files[0];
            },
            pdf(val){
                if (val === 1){
                    this.$router.replace('/colaborador/planillas/pdf/'+this.$route.params.planilla)
                }
            },
            clickPdf(){
                if (this.Planilla.estado === 0){
                    this.notificacion(
                        'danger',
                        'Esta planilla no tiene archivos registrados',
                        'Archivo no encontrado'
                    )
                }else{
                    this.$router.replace({path:'/colaborador/planillas/file/'+this.$route.params.planilla})
                }
            },
            notificacion(color, texto, titulo){
                this.$vs.notify({
                    text: texto,
                    title: titulo,
                    position: 'top-right',
                    color: color
                })
            },
            infoPlan(){
                let estado = ''
                this.infoPlantilla.fecha_creacion = this.Planilla.fecha_creacion
                this.infoPlantilla.total          = 'L '+this.Planilla.total_planilla
                this.infoPlantilla.usuario_creador = this.Planilla.user.usuario
                this.infoPlantilla.periodo        = this.Planilla.periodo+' de '+this.Planilla.mes_asignado+' del '+this.Planilla.ano
                if (this.Planilla.estado === 1){
                    estado = 'Registrado'
                }else if (this.Planilla.estado === 0){
                    estado = 'Pendiente'
                }
                this.infoPlantilla.estado         = estado
            },
            cargarPlanilas(){
                this.$axios.get('/planillas/'+this.$route.params.planilla,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.cargaPagina = true
                        this.Planilla = res.data.planilla
                        this.infoPlan()
                    }
                })
            }
        },
    }
</script>

<style scoped lang="stylus">
    .margenes
        margin-left 5px
        margin-right 5px

</style>
