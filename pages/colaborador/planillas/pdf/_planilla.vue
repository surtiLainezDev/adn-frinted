<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-colaboradores/>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col-auto">
                        <vs-button color="success" type="flat" @click="back" icon="arrow_back"></vs-button>
                    </div>
                    <div class="col-auto"> <tituloh5 :titulo="'Cotización '+titulo"/></div>
                </div>
                <div class="row" >
                    <div class="col-md-1"></div>
                    <div class="col-md-10">
                        <div class="contenedorPadrePdf">
                            <div class="row contenedorTitulo">
                                <div class="col"><small><strong>{{titulo}}</strong></small></div>
                                <div class="col d-flex justify-content-end">
                                    <vs-button  @click="$refs.pdfCotizacion[0].print()" icon="print" color="dark"></vs-button>
                                    <vs-button :href="urlFile" icon="get_app" style="margin-left: 5px" color="dark"></vs-button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-10">
                                    <pdf   ref="pdfCotizacion"
                                           v-for="i in numPages"
                                           :key="i"
                                           :page="i"
                                           style="margin-top: 10px"
                                           :src="urlFile"/>
                                </div>
                                <div class="col-md-1"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1"></div>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../../../components/menus/sideColaboradores";
    import tituloh5 from "../../../../components/tituloh5";
    import pdf from 'vue-pdf'
    export default {
        components:{
            sideColaboradores, tituloh5, pdf
        },
        data(){
            return{
                popupActivo: false,
                numPages: undefined,
                currentPage: 0,
                pageCount: 0,
                contactos:[]
            }
        },
        computed:{
            src:function () {
                return pdf.createLoadingTask(this.urlFile)
            }
        },
        created() {
            this.src.then(pdf => {
                this.numPages = pdf.numPages;
            });
        },
        methods:{
            back(){
                this.$router.replace({path:'/colaborador/planillas/'+this.$route.params.planilla})
            }
        },
        asyncData({$axios, store, route}){
            return $axios.get('planillas_pdf/'+route.params.planilla,{
                headers:{
                    'Authorization': `Bearer ${store.state.token}`
                },
            }).then(res =>{
                return{
                    urlFile: res.data.url,
                    titulo: res.data.titulo,
                }
            })
        }
    }
</script>

<style scoped lang="stylus">
    .contenedorPadrePdf
        background-color #47494e
        overflow-y scroll
        overflow-x hidden
        height 700px
    .contenedorTitulo
        background-color #211F1F
        color #FFF
        padding 5px
    .contenedorTitulo:hover
        background-color #47494e
</style>
